type LiveWaveformProps = {
    levels: readonly number[];
    /** Номер первой полоски от начала записи */
    offset: number;
}

/**
 * Полоски, которые бегут справа налево во время записи.
 * key — номер полоски от начала записи: старые полоски не перерисовываются заново,
 * анимацию появления (animate-bar-in) проигрывает только новая.
 */
export function LiveWaveform({levels, offset}: LiveWaveformProps) {
    return (
        <div
            aria-hidden
            className="flex h-6 min-w-0 flex-1 items-center justify-end gap-0.5 overflow-hidden"
        >
            {levels.map((level, index) => (
                <span
                    key={offset + index}
                    className="w-0.75 shrink-0 rounded-full bg-current motion-safe:animate-bar-in"
                    style={{ height: `${Math.max(12, level * 100)}%` }}
                />
            ))}
        </div>
    )
}