import type { KeyboardEvent, MouseEvent } from 'react';
import {clamp, cn, formatDuration} from "@/shared/lib";

type WaveformProps = {
    /** Уже подогнанные под нужное число полосок значения 0..1 */
    bars: readonly number[];
    /** Сколько прослушано, 0..1 */
    progress: number;
    durationSec: number;
    onSeek: (fraction: number) => void;
    className?: string;
}

/** Шаг перемотки стрелками и PageUp/PageDown, секунды */
const SMALL_STEP_SEC = 1;
const BIG_STEP_SEC = 5;

/**
 * Полоски громкости и одновременно ползунок перемотки (role="slider"):
 * мышью — клик по нужному месту, с клавиатуры — стрелки, PageUp/PageDown, Home/End.
 * Цвет — currentColor: на синем пузыре белые, на белом — синие.
 */
export function Waveform({
    bars,
    progress,
    durationSec,
    onSeek,
    className,
}: WaveformProps) {

    const currentSec = progress * durationSec;

    const seekToSecond = (second: number) => onSeek(clamp(second / durationSec, 0, 1))

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onSeek(clamp((event.clientX - rect.left) / rect.width, 0, 1));
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const targets: Partial<Record<string, number>> = {
            ArrowRight: currentSec + SMALL_STEP_SEC,
            ArrowUp: currentSec + SMALL_STEP_SEC,
            ArrowLeft: currentSec - SMALL_STEP_SEC,
            ArrowDown: currentSec - SMALL_STEP_SEC,
            PageUp: currentSec + BIG_STEP_SEC,
            PageDown: currentSec - BIG_STEP_SEC,
            Home: 0,
            End: durationSec,
        };
        const target = targets[event.key];
        if (target === undefined) return;
        event.preventDefault();
        seekToSecond(target);
    }

    return (
        <div
            role="slider"
            tabIndex={0}
            aria-label="Перемотка голосового сообщения"
            aria-valuemin={0}
            aria-valuemax={Math.round(durationSec)}
            aria-valuenow={Math.round(currentSec)}
            aria-valuetext={`${formatDuration(currentSec)} из ${formatDuration(durationSec)}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(
                'flex h-7 cursor-pointer items-center gap-0.5 rounded-sm',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
                className,
            )}
        >
            {bars.map((level, index) => {
                // Полоска считается прослушанной, когда прогресс прошел ее середину
                const isPlayed = (index + 0.5) / bars.length <= progress;
                return (
                    <span
                        key={index}
                        className={
                            cn(
                                'w-0.75 shrink-0 rounded-full bg-current',
                                isPlayed ? 'opacity-100' : 'opacity-40'
                            )
                        }
                        style={{ height: `${Math.max(12, level * 100)}%` }}
                    />
                )
            })}
        </div>
    )
}