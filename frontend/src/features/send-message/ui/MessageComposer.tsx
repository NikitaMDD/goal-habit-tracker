import { type ReactNode, type SubmitEvent, type KeyboardEvent, useState } from "react";
import {Button} from "@/shared/ui/button";
import {SendIcon} from "@/shared/ui/icon";

type MessageComposerProps = {
    onSend: (text: string) => void;
    autoFocus?: boolean;
    placeholder?: string;
    /** Что показать вместо кнопки 'Отправить', пока поле пустое (например, микрофон) */
    emptyAction?: ReactNode;
}

/** Поле ввода сообщения. Сама не отправляет — отдаёт текст наружу через onSend. */
export function MessageComposer({
    onSend,
    autoFocus = false,
    placeholder = 'Напиши сообщение',
    emptyAction,
}: MessageComposerProps) {
    const [text, setText] = useState('');
    const canSend = text.trim().length > 0;

    const submit = () => {
        if (!canSend) return;
        onSend(text.trim());
        setText('');
    }

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter — отправить, Shift+Enter — новая строка.
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-line bg-surface p-3">
            <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                autoFocus={autoFocus}
                placeholder={placeholder}
                aria-label="Сообщение"
                className="field-sizing-content max-h-32 min-h-10 flex-1 resize-none rounded-control border border-line bg-canvas px-3 py-2 placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
            {/* Как в мессенджерах: пустое поле - микрофон, есть текст - 'Отправить' */}
            {!canSend && emptyAction ? emptyAction : (
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!canSend}
                    aria-label="Отправить"
                    className="size-10 shrink-0 px-0"
                >
                    <SendIcon className="size-5"/>
                </Button>
            )}
        </form>
    )

}