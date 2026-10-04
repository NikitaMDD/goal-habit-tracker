import {useCallback, useEffect, useRef, useState} from "react";
import {clamp} from "@/shared/lib";

/**
 * Аудио, которое играет прямо сейчас — одно на всю страницу, как в Telegram.
 * Обычная переменная модуля, а не React-состояние: компонентам не нужно перерисовываться,
 * когда она меняется. Старый плеер узнает о паузе из собственного события 'pause'.
 */
let activeAudio: HTMLAudioElement | null = null;

/**
 * Проигрывание одного аудио. progress — 0..1, обновляется каждый кадр (requestAnimationFrame),
 * а не по событию timeupdate: оно приходит ~4 раза в секунду, и полоски закрашивались бы рывками.
 */
export function useAudioPlayer(src: string, durationSec: number) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const audio = new Audio(src);
        audio.preload = 'metadata';
        audioRef.current = audio;

        let frame = 0;

        const tick = () => {
            setProgress(clamp(audio.currentTime / durationSec, 0, 1));
            frame = requestAnimationFrame(tick);
        }

        const handlePlay = () => {
            if (activeAudio && activeAudio !== audio) activeAudio.pause();
            activeAudio = audio;
            setIsPlaying(true);
            frame = requestAnimationFrame(tick);
        }

        const handlePause = () => {
            if (activeAudio === audio) activeAudio = null;
            setIsPlaying(false);
            cancelAnimationFrame(frame);
        }

        const handleEnded = () => {
            audio.currentTime = 0;
            setProgress(0);
        }

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.pause();
            cancelAnimationFrame(frame);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audioRef.current = null;
        }

    }, [src, durationSec]);

    const toggle = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            // play() может быть отклонен браузером
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, []);

    const seek = useCallback((fraction: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = fraction * durationSec;
        setProgress(fraction);
    }, [durationSec]);

    return { isPlaying, progress, toggle, seek };
}