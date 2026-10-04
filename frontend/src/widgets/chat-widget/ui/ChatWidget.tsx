import {Mascot, type MascotPersona, mascotPersonas} from "@/entities/mascot";
import {useCallback, useEffect, useId, useRef, useState} from "react";
import {useChat} from "@/widgets/chat-widget/model/useChat.ts";
import {AnimatePresence, motion} from "framer-motion";
import {motionTokens} from "@/shared/config/theme";
import {CloseIcon} from "@/shared/ui/icon";
import {MessageList} from "@/widgets/chat-widget/ui/MessageList.tsx";
import {MessageComposer} from "@/features/send-message";
import {cn} from "@/shared/lib";

type ChatWidgetProps = {
    persona?: MascotPersona
}

export function ChatWidget({
    persona = mascotPersonas[0],
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const chat = useChat(persona);
    const panelId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const launcherRef = useRef<HTMLButtonElement>(null);

    const close = useCallback(() => {
        setIsOpen(false);
        // Возвращаем фокус на маскота — иначе при работе с клавиатуры он «теряется» в начале страницы
        launcherRef.current?.focus();
    }, []);

    // Esc закрывает чат, если фокус внутри виджета или "потерян" на body (например, исчезла кнопка "Повторить").
    // Если фокус в поле страницы, куда встроен виджет, — Esc не трогаем, он принадлежит странице.
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            const target = event.target as Node;
            if (target === document.body || rootRef.current?.contains(target)) close()
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, close]);

    return (
        <div ref={rootRef} className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.section
                        id={panelId}
                        role="dialog"
                        aria-label={`Чат: ${persona.name}`}
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={motionTokens.springCalm}
                        style={{ originX: 1, originY: 1 }}
                        className="fixed inset-0 flex flex-col overflow-hidden bg-canvas sm:static sm:h-150 sm:max-h-[calc(100vh-8rem)] sm:w-95 sm:rounded-card sm:border sm:border-line sm:shadow-float"
                    >
                        <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
                            <Mascot persona={persona} emotion={chat.mascotEmotion} size={40} />
                            <div className="flex-1">
                                <p className="font-display text-sm">{persona.name}</p>
                                <p>{chat.isAgentTyping ? 'печатает...' : 'В сети'}</p>
                            </div>
                            <button
                                type="button"
                                onClick={close}
                                aria-label="Закрыть чат"
                                className="flex size-9 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                            >
                                <CloseIcon />
                            </button>
                        </header>

                        <MessageList messages={chat.messages} isAgentTyping={chat.isAgentTyping} onRetry={chat.retry} />
                        <MessageComposer onSend={chat.send} autoFocus />
                    </motion.section>
                )}
            </AnimatePresence>

            <button
                ref={launcherRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={isOpen ? 'Свернуть чат' : `Открыть чат: ${persona.name}`}
                className={cn(
                    'rounded-full transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
                    // На телефоне панель на весь экран - маскот бы перекрывал поле ввода, закрытие - крестиком в шапке
                    isOpen && 'max-sm:hidden',
                )}
            >
                <Mascot persona={persona} emotion={chat.mascotEmotion} size={72} />
            </button>
        </div>
    )
}