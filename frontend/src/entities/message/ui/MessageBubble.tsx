import type {MessageAuthor, MessageStatus} from "@/entities/message/model/types";
import { motionTokens } from "@/shared/config/theme";
import { motion } from "framer-motion";
import type {ReactNode} from "react";
import {cn, formatTime} from "@/shared/lib";
import {AlertIcon, ClockIcon} from "@/shared/ui/icon";

type MessageBubbleProps = {
    author: MessageAuthor;
    status: MessageStatus;
    createdAt: string;
    /** Повторить отправку, если не передавать - кнопки "Повторить" не будет */
    onRetry?: () => void;
    children: ReactNode;
}

export function MessageBubble({
    author,
    status,
    createdAt,
    onRetry,
    children,
}: MessageBubbleProps) {
    const isUser = author === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTokens.springCalm}
            className={cn(
                'flex max-w-4/5 flex-col gap-1',
                isUser
                    ? 'items-end self-end'
                    : 'items-start self-start'
            )}
        >
            <div
                className={cn(
                    'rounded-bubble px-4 py-2.5 transition-opacity',
                    isUser
                        ? cn(
                            'rounded-br-md bg-(--bubble-color) text-on-accent',
                            status === 'failed'
                                ? '[--bubble-color:var(--color-danger)]'
                                : '[--bubble-color:var(--color-accent)]',
                        )
                        : 'rounded-bl-md border border-line bg-surface text-ink',
                    status === 'sending' && 'opacity-80'
                )}
            >
                {children}
            </div>
            <div className="flex items-center gap-1.5 px-1 text-xs">
                { status === 'failed' ? (
                    <span
                        role="alert"
                        className="flex items-center gap-1 text-danger"
                    >
                        <AlertIcon className="size-3.5" />
                        Не отправлено
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="ml-1 font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-danger"
                            >
                                Повторить
                            </button>
                        )}
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-ink-muted">
                        {status === 'sending' && <ClockIcon className="size-3.5" aria-label="Отправляется" />}
                        <time dateTime={createdAt}>{formatTime(createdAt)}</time>
                    </span>
                ) }
            </div>
        </motion.div>
    )
}