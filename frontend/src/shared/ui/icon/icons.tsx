import type {ComponentProps} from "react";

type IconProps = ComponentProps<'svg'>;

/**
 * Базовые свойства иконок: 24x24, цвет - currentColor, размер задается классом (size-4 и т.п.)
 */
const base = { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
const stroke = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function PlayIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path
                d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function PauseIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x={6} y={5} width={4} height={14} rx={1.5} fill="currentColor" />
            <rect x={14} y={5} width={4} height={14} rx={1.5} fill="currentColor" />
        </svg>
    )
}

export function ClockIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <circle cx={12} cy={12} r={9} {...stroke} />
            <path d="M12 7v5l3 2" {...stroke} />
        </svg>
    )
}

export function AlertIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <circle cx={12} cy={12} r={9} {...stroke} />
            <path d="M12 8v4.5M12 16h.01" {...stroke} />
        </svg>
    )
}

export function SendIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M12 19V5M5 12l7-7 7 7" {...stroke} />
        </svg>
    )
}


export function CloseIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M6 6l12 12M18 6 6 18" {...stroke} />
        </svg>
    )
}

export function MicIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x={9} y={3} width={6} height={11} rx={3} {...stroke} />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" {...stroke} />
        </svg>
    )
}

export function TrashIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" {...stroke} />
        </svg>
    )
}