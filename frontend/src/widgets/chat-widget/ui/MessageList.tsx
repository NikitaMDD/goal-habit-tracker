import {type ChatMessage, Message, TypingIndicator} from "@/entities/message";
import {useEffect, useRef} from "react";

type MessageListProps = {
    messages: readonly ChatMessage[];
    isAgentTyping: boolean;
    onRetry: (message: ChatMessage) => void;
}

export function MessageList({
    messages,
    isAgentTyping,
    onRetry,
}: MessageListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const list = listRef.current;
        list?.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
    }, [messages.length, isAgentTyping]);

    return (
        <div
            ref={listRef}
            // role="log" — скринридер зачитывает новые сообщения, не перечитывая старые
            role="log"
            aria-label="Сообщения"
            className="bg-dots flex flex-1 flex-col gap-3 overflow-y-auto p-4"
        >
            {messages.map((message) => (
                <Message
                    key={message.id}
                    message={message}
                    onRetry={message.status === 'failed' ? () => onRetry(message) : undefined}
                />
            ))}
            {isAgentTyping && <TypingIndicator/>}
        </div>
    )
}