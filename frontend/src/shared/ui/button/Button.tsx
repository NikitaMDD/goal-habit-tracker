import type { ComponentProps } from 'react';
import { cn } from "@/shared/lib";

const variants = {
    primary: 'bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed',
    secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
    ghost: 'text-ink-muted hover:bg-accent-soft hover:text-ink',
} as const;

const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
} as const;

type ButtonProps = ComponentProps<'button'> & {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
}

export function Button({
    variant = 'secondary',
    size = 'sm',
    type = 'button',
    className,
    ...props
}: ButtonProps) {
    return (
      <button
        type={type}
        className={
          cn(
              'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              'disabled:pointer-events-none disabled:opacity-50',
              variants[variant],
              sizes[size],
              className,
          )
        }
        {...props}
      />
    );
}