/**
 * Пузырь чата агента с тремя прыгающими точками - "Печатает..."
 * Анимация - CSS (animate-typing-dot в tokens.css)
 */
export function TypingIndicator() {
    return (
        <div
            className="flex gap-1 self-start rounded-bubble rounded-bl-md border border-line bg-surface px-4 py-3.5"
        >
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    aria-hidden
                    className="size-1.5 rounded-full bg-ink-muted motion-safe:animate-typing-dot"
                    // Каждая следующая точка стартует чуть позже — получается волна
                    style={{ animationDelay: `${index * 0.15}ms` }}
                />
            ))}
            <span className="sr-only">Печатает...</span>
        </div>
    )
}