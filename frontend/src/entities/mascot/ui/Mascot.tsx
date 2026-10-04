import type {MascotEmotion, MascotPersona} from "@/entities/mascot/model/types.ts";
import {motion} from "framer-motion";
import {mascotShapes} from "@/entities/mascot/ui/shapes.tsx";
import {mascotEmotions} from "@/entities/mascot/model/emotions.ts";
import {MascotEyes} from "@/entities/mascot/ui/MascotEyes.tsx";
import {cn} from "@/shared/lib";

type MascotProps = {
    persona: MascotPersona;
    emotion?: MascotEmotion;
    /** Размер в px (маскот квадратный) */
    size?: number;
    className?: string;
}

export function Mascot({
    persona,
    emotion = 'neutral',
    size = 96,
    className,
}: MascotProps) {
    const shape = mascotShapes[persona.shape];
    const eyeColor = persona.color === 'coal' ?
        'var(--color-mascot-eye)' :
        'var(--color-mascot-eye-dark)';

    const emotionLabel = mascotEmotions.find(
        (item) => item.value === emotion)?.label ?? '';

    return (
        <motion.div
            className={cn('inline-block origin-bottom motion-safe:animate-breathe', className)}
        >
            <svg
                viewBox="0 0 100 100"
                width={size}
                height={size}
                role="img"
                aria-label={`${persona.name}: ${emotionLabel.toLowerCase()}`}
                className="block"
            >
                <g style={{ color: `var(--color-mascot-${persona.color})` }}>{shape.body}</g>
                <g style={{ color: eyeColor }}>
                    <MascotEyes emotion={emotion} {...shape.eyes} lookRange={shape.lookRange} />
                </g>
            </svg>
        </motion.div>
    )

}