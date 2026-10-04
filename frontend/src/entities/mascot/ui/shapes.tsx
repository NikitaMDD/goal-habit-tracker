import type {ReactNode} from "react";
import type {MascotShape} from "@/entities/mascot/model/types.ts";

type ShapeDefinition = {
    /** Тело в координатах viewBox 0 0 100 100. Цвет — через currentColor. */
    body: ReactNode;
    /** Где и какого размера рисовать глаза. */
    eyes: { x: number; y: number; spacing: number; scale: number; };
    /** Насколько далеко (в единицах viewBox) взгляд может уйти от центра по x и y */
    lookRange: { x: number; y: number; };
}

/*
 * Скруглённые многоугольники: обводка того же цвета, что и заливка, с round-углами.
 * Визуально обводки нет — это просто способ скруглить углы без сложных path.
 */
const roundedPolygon = {
    fill: 'currentColor',
    stroke: 'currentColor',
    strokeLinejoin: 'round',
} as const;

export const mascotShapes: Record<MascotShape, ShapeDefinition> = {
    flower: {
        body: (
            <g fill="currentColor">
                <circle cx={50} cy={28} r={20} />
                <circle cx={75} cy={45} r={20} />
                <circle cx={66} cy={74} r={20} />
                <circle cx={34} cy={74} r={20} />
                <circle cx={25} cy={45} r={20} />
                <circle cx={50} cy={53} r={26} />
            </g>
        ),
        eyes: { x: 50, y: 52, spacing: 22, scale: 1 },
        lookRange: { x: 6, y: 5, },
    },
    circle: {
        body: <circle cx={50} cy={52} r={40} fill="currentColor" />,
        eyes: { x: 50, y: 50, spacing: 26, scale: 1.3 },
        lookRange: { x: 9, y: 7, },
    },
    blob: {
        body: <polygon points="50,22 80,42 74,78 28,80 20,44" strokeWidth={22} {...roundedPolygon} />,
        eyes: { x: 50, y: 52, spacing: 24, scale: 1 },
        lookRange: { x: 7, y: 6, },
    },
    triangle: {
        body: <polygon points="50,22 84,82 16,82" strokeWidth={18} {...roundedPolygon} />,
        eyes: { x: 50, y: 64, spacing: 20, scale: 0.9 },
        lookRange: { x: 5, y: 3, },
    },
    sprout: {
        body: (
            <g fill='currentColor'>
                <ellipse cx={58} cy={26} rx={8} ry={15} transform="rotate(28 58 26)"/>
                <ellipse cx={42} cy={30} rx={6} ry={11} transform="rotate(-30 42 30)"/>
                <ellipse cx={50} cy={60} rx={34} ry={30} />
            </g>
        ),
        eyes: { x: 50, y: 60, spacing: 22, scale: 1 },
        lookRange: { x: 8, y: 6, },
    },
    bear: {
        body: (
            <g fill='currentColor'>
                <circle cx={29} cy={36} r={11} />
                <circle cx={71} cy={36} r={11} />
                <circle cx={50} cy={58} r={30} />
            </g>
        ),
        eyes: { x: 50, y: 58, spacing: 20, scale: 0.85 },
        lookRange: { x: 7, y: 5, },
    }
}