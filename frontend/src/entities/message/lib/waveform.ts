import {clamp} from "@/shared/lib";

const MIN_BARS = 16;
const MAX_BARS = 48;
const BARS_PER_SECONDS = 3;

/** Количество полосок зависит от длины: короткое голосовое — узкое, длинное — шире (до предела). */
export function getBarCount(durationSec: number) {
    return Math.round(clamp(durationSec * BARS_PER_SECONDS, MIN_BARS, MAX_BARS));
}

/**
 * Подгоняет waveform под нужное число полосок: каждая полоска = максимум громкости на своём отрезке.
 * Нормализует по самому громкому месту, чтобы тихая запись не превращалась в ровную линию.
 */
export function resampleWaveform(peaks: readonly number[], count: number): number[] {

    if (peaks.length === 0) return Array.from({ length: count }, () => 0);

    const loudest = Math.max(...peaks) || 1;

    return Array.from({ length: count }, (_, index) => {
        const start = Math.floor((index * peaks.length) / count);
        const end = Math.max(start + 1, Math.floor(((index + 1) * peaks.length) / count));
        return Math.max(...peaks.slice(start, end)) / loudest;
    })
}