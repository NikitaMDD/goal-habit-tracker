import {clamp} from "@/shared/lib";


/**
 * Тише этого - тишина (0),
 * громче верхней границы - максимум (1).
 * Децибелы относительно максимума сигнала
 */
const SILENCE_DB = -50;
const LOUD_DB = -10;

/**
 * Громкость кусочка звука -Ю 0..1
 * RMS - 'средняя сила' сигнала. Переводим в децибелы, потому что слух воспринимает громкость логарифмически: без этого
 * тихая речь почти не двигала бы полоски, а громкая сразу упиралась бы в потолок
 */
export function getLevel(samples: Float32Array) {
    let sumOfSquares = 0;
    for (const sample of samples) sumOfSquares += sample * sample;
    const rms = Math.sqrt(sumOfSquares / samples.length);
    const db = 20 * Math.log10(rms || 1e-8);
    return clamp((db - SILENCE_DB) / (LOUD_DB - SILENCE_DB), 0, 1)
}