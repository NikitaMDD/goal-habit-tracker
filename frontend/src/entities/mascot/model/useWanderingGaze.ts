import {useEffect, useState} from "react";

type Point = { x: number; y: number; };

const CENTER: Point = { x: 0, y: 0 };

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
}

/** Случайная точка внутри эллипса с полуосями range — так глаза не вылезают за скруглённое тело. */
function randomPointInEllipse(range: Point): Point {
    const angle = Math.random() * Math.PI * 2;
    // sqrt — точки распределяются равномерно по площади, а не кучкуются у центра
    const radius = Math.sqrt(Math.random());
    return { x: Math.cos(angle) * radius * range.x, y: Math.sin(angle) * radius * range.y };
}

/**
 * «Бегающий взгляд»: через случайные паузы переводит взгляд в случайную точку.
 * Возвращает одно смещение на оба глаза — поэтому они всегда двигаются парой.
 */
export function useWanderingGaze(range: Point, enabled: boolean): Point {

    const [gaze, setGaze] = useState<Point>(CENTER);
    const { x: rangeX, y: rangeY } = range;

    useEffect(() => {
        if (!enabled) return;

        let timer: ReturnType<typeof setTimeout>;
        const lookSomewhere = () => {
            // Иногда возвращаемся в центр — так выглядит живее, чем бесконечное блуждание
            setGaze(Math.random() < 0.25 ? CENTER : randomPointInEllipse({ x: rangeX, y: rangeY }));
            timer = setTimeout(lookSomewhere, randomBetween(400, 2600));
        }
        timer = setTimeout(lookSomewhere, randomBetween(400, 2600));

        return () => clearTimeout(timer);
    }, [enabled, rangeX, rangeY]);

    return enabled ? gaze : CENTER;
}