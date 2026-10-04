import {useAudioPlayer} from "@/entities/message/model/useAudioPlayer";
import {useMemo} from "react";
import {getBarCount, resampleWaveform} from "@/entities/message/lib/waveform";
import {cn, formatDuration} from "@/shared/lib";
import {PauseIcon, PlayIcon} from "@/shared/ui/icon";
import {Waveform} from "@/entities/message/ui/Waveform";

type VoicePlayerProps = {
    audioUrl: string;
    durationSec: number;
    waveform: readonly number[];
    /** true - плеер на синем пузыре (сообщение пользователя) */
    inverted?: boolean;
}

export function VoicePlayer({
    audioUrl,
    durationSec,
    waveform,
    inverted = false,
}: VoicePlayerProps) {
    const { isPlaying, progress, toggle, seek } = useAudioPlayer(audioUrl, durationSec);
    const bars = useMemo(
        () => resampleWaveform(waveform, getBarCount(durationSec)
    ), [waveform, durationSec]);
    const shownSeconds = progress > 0 ? progress * durationSec : durationSec;

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={toggle}
                aria-label={isPlaying ? 'Пауза' : 'Прослушать'}
                className={
                    cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95',
                        'focus-visible:outline-2 focus-visible:outline-offset-2',
                        inverted
                            ? 'bg-on-accent text-(--bubble-color) focus-visible:outline-on-accent'
                            : 'bg-accent text-on-accent focus-visible:outline-accent',
                    )
                }
            >
                {isPlaying
                    ? <PauseIcon className="size-4" />
                    : <PlayIcon className="size-4" />
                }
            </button>
            <div className="flex flex-col gap-0.5">
                <Waveform
                    bars={bars}
                    progress={progress}
                    durationSec={durationSec}
                    onSeek={seek}
                    className={inverted ? undefined : 'text-accent'}
                />
                <span
                    className={
                        cn(
                            'text-xs tabular-nums',
                            inverted
                                ? 'text-on-accent/80'
                                : 'text-ink-muted'
                        )
                    }
                >
                    {formatDuration(shownSeconds)}
                </span>
            </div>
        </div>
    )

}