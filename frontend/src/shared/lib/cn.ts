import { extendTailwindMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";


const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            radius: ['control', 'control-inner', 'bubble', 'card'],
            shadow: ['float'],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(...inputs));
}