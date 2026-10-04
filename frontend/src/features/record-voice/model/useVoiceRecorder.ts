import {useCallback, useEffect, useRef, useState} from "react";
import {getLevel} from "@/features/record-voice/lib/level.ts";

/** Одна полоска = 100 мс звука (столько же полосок в секунду уходит в waveform сообщения) */
const BAR_INTERVAL_MS = 100;
/** Сколько последних полосок показывать в баре записи */
const VISIBLE_BARS = 48;
/** Короче этого значение - считаем случайным нажатием и не отправляем */
const MIN_DURATION_SEC = 1;
/** Как в Instagram: дольше минуты не пишем, отправляем автоматически */
export const MAX_DURATION_SEC = 60;

export type RecorderVoice = {
    audioUrl: string;
    durationSec: number;
    waveform: number[];
}

type RecorderStatus = 'idle' | 'requesting' | 'recording';

/** Все, что живет ровно одну запись: микрофон, рекордер, анализатор */
type Session = {
    stream: MediaStream;
    recorder: MediaRecorder;
    audioContext: AudioContext;
    chunks: Blob[];
    levels: number[];
    startedAt: number;
    frame: number;
}

type UseVoiceRecorderOptions = {
    onRecorded: (voice: RecorderVoice) => void;
}

/**
 * Запись голосового: MediaRecorder пишет звук, AnalyserNode каждый кадр меряет громкость.
 * Громкость копится полосками по 100 мс — из них и живой бар во время записи, и waveform готового сообщения.
 */
export function useVoiceRecorder({ onRecorded }: UseVoiceRecorderOptions) {
    const [status, setStatus] = useState<RecorderStatus>('idle');
    const [levels, setLevels] = useState<number[]>([]);
    const [totalBars, setTotalBars] = useState(0);
    const [elapsedSec, setElapsedSec] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const sessionRef = useRef<Session | null>(null);
    const onRecordedRef = useRef(onRecorded);
    const stopRef = useRef<() => void>(() => {});

    useEffect(() => {
        onRecordedRef.current = onRecorded;
    })

    /** Освободить микрофон и всё остальное. Без stop() у дорожек браузер продолжит показывать «микрофон включён». */
    const release = useCallback(() => {
        const session = sessionRef.current;
        if (!session) return;
        sessionRef.current = null;
        cancelAnimationFrame(session.frame);
        session.stream.getTracks().forEach((track) => track.stop());
        void session.audioContext.close();
        setStatus('idle');
        setLevels([]);
        setTotalBars(0);
        setElapsedSec(0);
    }, []);

    const stop = useCallback(() => {
        const session = sessionRef.current;
        if (!session) return;
        const durationSec = (performance.now() - session.startedAt) / 1000;

        if (durationSec < MIN_DURATION_SEC) {
            session.recorder.onstop = null;
            session.recorder.stop();
            release();
            setError('Слишком коротко. Нажми на микрофон и говори');
            return;
        }

        const { recorder, chunks, levels: waveform } = session;
        // Последний кусок звука приходит в ondataavailable уже после stop() - собираем файл в onstop
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: recorder.mimeType });
            onRecordedRef.current({ audioUrl: URL.createObjectURL(blob), durationSec, waveform })
        }
        recorder.stop();
        release()
    }, [release]);

    const cancel = useCallback(() => {
        const session = sessionRef.current;
        if (!session) return;
        session.recorder.onstop = null;
        session.recorder.stop();
        release();
    }, [release]);

    useEffect(() => {
        stopRef.current = stop;
    }, [stop]);

    useEffect(() => cancel, [cancel]);

    const start = useCallback( async () => {
        if (sessionRef.current) return;
        setError(null);
        setStatus('requesting');

        let stream: MediaStream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (reason) {
            setStatus('idle');
            setError(
                reason instanceof DOMException && reason.name === 'NotAllowedError'
                    ? 'Нет доступа к микрофону. Разреши его в настройках браузера'
                    : 'Не получилось включить микрофон',
            );
            return;
        }

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        audioContext.createMediaStreamSource(stream).connect(analyser);
        const samples = new Float32Array(analyser.fftSize);

        const recorder = new MediaRecorder(stream);
        const session: Session = {
            stream,
            recorder,
            audioContext,
            chunks: [],
            levels: [],
            startedAt: performance.now(),
            frame: 0,
        }
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) session.chunks.push(event.data);
        }
        recorder.start();
        sessionRef.current = session;
        setStatus('recording');

        let barPeak = 0;
        let barStartedAt = session.startedAt;

        const tick = (now: number) => {
            analyser.getFloatTimeDomainData(samples);
            // Полоска = самый громкий момент за свои 100 мс, а не среднее — так видны отдельные слоги
            barPeak = Math.max(barPeak, getLevel(samples));

            if (now - barStartedAt >= BAR_INTERVAL_MS) {
                session.levels.push(barPeak);
                barPeak = 0;
                barStartedAt = now;

                const elapsed = (now - session.startedAt) / 1000;
                setLevels(session.levels.slice(-VISIBLE_BARS));
                setTotalBars(session.levels.length);
                setElapsedSec(elapsed);

                if (elapsed >= MAX_DURATION_SEC) {
                    stopRef.current();
                    return;
                }
            }
            session.frame = requestAnimationFrame(tick);
        }
        session.frame = requestAnimationFrame(tick);
    }, []);

    return {
        status,
        /** Последние полоски для живого бара */
        levels,
        /** Номер первой из показанных полосок - для стабильных key */
        levelsOffset: totalBars - levels.length,
        elapsedSec,
        error,
        start,
        stop,
        cancel,
    }
}