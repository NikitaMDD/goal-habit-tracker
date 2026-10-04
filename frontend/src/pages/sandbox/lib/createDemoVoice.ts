/**
 * Синтезирует «голосовое» для песочницы: шум и тон с огибающей как у речи (слоги, паузы между словами).
 * Возвращает ссылку на WAV и waveform — как будто это записал пользователь.
 */
export function createDemoVoice(durationSec: number) {
    const sampleRate = 8000
    const samples = new Float32Array(Math.floor(durationSec * sampleRate))

    for (let i = 0; i < samples.length; i++) {
        const t = i / sampleRate
        const syllables = Math.max(0, Math.sin(2 * Math.PI * 4.5 * t)) // ~4–5 слогов в секунду
        const words = Math.sin(2 * Math.PI * 0.6 * t + 0.5) > -0.3 ? 1 : 0.05 // паузы между словами
        const loudness = 0.55 + 0.45 * Math.sin(2 * Math.PI * 0.23 * t + 1) // где-то громче, где-то тише
        const voice = Math.sin(2 * Math.PI * 180 * t) * 0.6 + (Math.random() * 2 - 1) * 0.4
        samples[i] = syllables * words * loudness * voice * 0.8
    }

    return { audioUrl: URL.createObjectURL(encodeWav(samples, sampleRate)), waveform: getPeaks(samples, 100) }
}

/** Максимальная громкость на каждом из count отрезков. */
function getPeaks(samples: Float32Array, count: number) {
    const chunk = Math.floor(samples.length / count)
    return Array.from({ length: count }, (_, index) => {
        let peak = 0
        for (let i = index * chunk; i < (index + 1) * chunk; i++) peak = Math.max(peak, Math.abs(samples[i]))
        return peak
    })
}

/** 16-битный моно WAV: 44 байта заголовка + PCM. */
function encodeWav(samples: Float32Array, sampleRate: number) {
    const view = new DataView(new ArrayBuffer(44 + samples.length * 2))
    const writeString = (offset: number, text: string) => {
        for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + samples.length * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true) // размер блока fmt
    view.setUint16(20, 1, true) // PCM
    view.setUint16(22, 1, true) // моно
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true) // байт в секунду
    view.setUint16(32, 2, true) // байт на сэмпл
    view.setUint16(34, 16, true) // бит на сэмпл
    writeString(36, 'data')
    view.setUint32(40, samples.length * 2, true)
    samples.forEach((sample, i) => view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, sample)) * 0x7fff, true))

    return new Blob([view], { type: 'audio/wav' })
}