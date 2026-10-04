const timeFormatter = new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' });

/** 14:05 */
export function formatTime(date: Date | string) {
    return timeFormatter.format(new Date(date));
}

/** 7 -> "0:07", 75 -> "1:15" */
export function formatDuration(totalSeconds: number) {
    const seconds = Math.max(0, Math.round(totalSeconds));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}