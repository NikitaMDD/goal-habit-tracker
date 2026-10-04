import type {MascotEmotion} from "@/entities/mascot/model/types.ts";

export const mascotEmotions = [
    { value: 'neutral', label: 'Нейтрально', },
    { value: 'happy', label: 'Радость', },
    { value: 'focused', label: 'Фокус', },
    { value: 'effort', label: 'Усилие', },
] as const satisfies readonly { value: MascotEmotion, label: string }[];