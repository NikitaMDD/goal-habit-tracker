import type {MascotEmotion} from "@/entities/mascot/model/types.ts";
import {AnimatePresence, motion, useReducedMotion} from "framer-motion";
import {motionTokens} from "@/shared/config/theme";
import {useWanderingGaze} from "../model/useWanderingGaze";

const line = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

/** Один глаз в точке (0, 0). Рисуется как левый — правый получается зеркалом. */
function EyeGlyph({ emotion }: { emotion: MascotEmotion }) {
    switch (emotion) {
        case 'neutral':
            return <ellipse rx={5} ry={7.5} fill="currentColor" />
        case 'happy':
            return <path d="M -6 3 L 0 -4 L 6 3" {...line} />
        case 'focused':
            return <path d="M 0 -6 V 6 M -6 0 H 6" {...line} />
        case 'effort':
            return <path d="M -5 -6 L 5 0 L -5 6" {...line} />
    }
}

/** Масштаб/моргание вокруг центра самой группы, а не начала координат SVG */
const centerOrigin = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

/** Эмоции, в которых глаза открыты и могут «бегать». При ^ ^ и > < глаза зажмурены — им смотреть некуда. */
const lookingAroundEmotions: ReadonlySet<MascotEmotion> = new Set(['neutral', 'focused']);

type MascotEyesProps = {
    emotion: MascotEmotion;
    x: number;
    y: number;
    spacing: number;
    scale: number;
    lookRange: { x: number; y: number; };
}

export function MascotEyes({
    emotion,
    x,
    y,
    spacing,
    scale,
    lookRange,
}: MascotEyesProps) {
    const reduceMotion = useReducedMotion();
    const blinks = emotion === 'neutral' && !reduceMotion;
    const gaze = useWanderingGaze(lookRange, lookingAroundEmotions.has(emotion) && !reduceMotion);

    return (
        <motion.g animate={gaze} transition={motionTokens.saccade}>
            <AnimatePresence mode="wait" initial={false}>
                {/* key=emotion: при смене эмоции старые глаза схлопываются, новые «выпрыгивают» */}
                <motion.g
                    key={emotion}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={ motionTokens.springBouncy }
                    style={centerOrigin}
                >
                    <motion.g
                        animate={blinks ? { scaleY: [1, 1, 0.1, 1] } : {scaleY: 1}}
                        transition={blinks ? {duration: 4, times: [0, 0.94, 0.97, 1], repeat: Infinity} : undefined}
                        style={centerOrigin}
                    >
                        <g transform={`translate(${x - spacing / 2} ${y}) scale(${scale})`}>
                            <EyeGlyph emotion={emotion} />
                        </g>
                        <g transform={`translate(${x + spacing / 2} ${y}) scale(${-scale} ${scale})`}>
                            <EyeGlyph emotion={emotion} />
                        </g>
                    </motion.g>
                </motion.g>
            </AnimatePresence>
        </motion.g>
    );
}