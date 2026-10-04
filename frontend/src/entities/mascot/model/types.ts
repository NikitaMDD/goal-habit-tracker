export type MascotEmotion = 'neutral' | 'happy' | 'focused' | 'effort';
export type MascotShape = 'flower' | 'circle' | 'blob' | 'triangle' | 'sprout' | 'bear';

/** Совпадает с токенами --color-mascot-* в token.css */
export type MascotColor = 'orange' | 'blue' | 'pink' | 'green' | 'coal' | 'milk';

/** Персона маскота — отдельная сущность, чтобы позже стать полноценным агентом (характер, системный промпт). */
export type MascotPersona = {
    id: string;
    name: string;
    shape: MascotShape;
    color: MascotColor;
}
