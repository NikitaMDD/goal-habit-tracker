import type {MascotPersona} from "@/entities/mascot/model/types.ts";

export const mascotPersonas = [
    { id: 'ryzhik', name: 'Рыжик', shape: 'flower', color: 'orange' , },
    { id: 'ugolek', name: 'Уголек', shape: 'circle', color: 'coal', },
    { id: 'klyaksa', name: 'Клякса', shape: 'blob', color: 'pink', },
    { id: 'ugolok', name: 'Уголок', shape: 'triangle', color: 'blue', },
    { id: 'rostok', name: 'Росток', shape: 'sprout', color: 'green',},
    { id: 'pushok', name: 'Пушок', shape: 'bear', color: 'milk',},
] as const satisfies readonly MascotPersona[];