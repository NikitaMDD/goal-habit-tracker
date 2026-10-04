import {useId} from "react";
import {cn} from "@/shared/lib";
import { motion } from "framer-motion";
import {motionTokens} from "@/shared/config/theme";


type Option<T extends string> = { value: T; label: string; };

type SegmentedControlProps<T extends string> = {
    options: readonly Option<T>[];
    value: T;
    onChange: (value: T) => void;
    /** Подпись группы для скинридеров */
    label?: string;
    className?: string;
}

export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    label,
    className,
}: SegmentedControlProps<T>) {

    const indicatorId = useId();

    return (
        <div
            role="group"
            aria-label={label}
            className={
                cn(
                    'inline-flex gap-1 rounded-control border border-line bg-surface p-1',
                    className
                )
            }
        >
            {
                options.map((option) => {
                    const isActive = option.value === value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onChange(option.value)}
                            className={
                                cn(
                                    'relative h-8 rounded-control-inner px-3 text-sm transition-colors',
                                    'focus-visible:outline-2 focus-visible:outline-accent',
                                    isActive ? 'text-on-accent' : 'text-ink-muted hover:text-ink'
                                )
                            }
                        >
                            {isActive && (
                                <motion.span
                                    layoutId={indicatorId}
                                    className="absolute inset-0 rounded-control-inner bg-accent"
                                    transition={motionTokens.springCalm}
                                />
                            )}
                            <span className="relative">{option.label}</span>
                        </button>
                    )
                })
            }
        </div>
    );
}