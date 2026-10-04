import type {ChatMessage} from "@/entities/message/model/types";
import {MessageBubble} from "@/entities/message/ui/MessageBubble";
import {VoicePlayer} from "@/entities/message/ui/VoicePlayer";

type MessageProps = {
    message: ChatMessage;
    onRetry?: () => void;
}

/** Сообщение любого вида */
export function Message({
    message,
    onRetry,
}: MessageProps) {
    return (
        <MessageBubble
            author={message.author}
            status={message.status}
            createdAt={message.createdAt}
            onRetry={onRetry}
        >
            {message.kind === 'text' ? (
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
            ) : (
                <VoicePlayer
                    audioUrl={message.audioUrl}
                    durationSec={message.durationSec}
                    waveform={message.waveform}
                    inverted={message.author === "user"}
                />
            )}
        </MessageBubble>
    )
}