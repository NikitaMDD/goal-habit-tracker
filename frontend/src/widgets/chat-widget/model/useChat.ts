import type {MascotEmotion, MascotPersona} from "@/entities/mascot";
import type {ChatMessage, MessageStatus, TextChatMessage} from "@/entities/message";
import {useCallback, useEffect, useRef, useState} from "react";
import {sendMessageToServer, waitForAgentReply} from "@/widgets/chat-widget/api/fakeAgent";

const HAPPY_AFTER_REPLY_MS = 2500;

const now = () => new Date().toISOString();

function createGreeting(persona: MascotPersona): ChatMessage {
    return {
        id: crypto.randomUUID(),
        kind: 'text',
        author: 'agent',
        status: 'sent',
        createdAt: now(),
        text: `Привет! Я ${persona.name}. Помогу с привычками, целями и напоминаниями.`,
    }
}

/** Состояние чата: сообщения, «печатает…», эмоция маскота. Отправка пока через заглушку fakeAgent. */
export function useChat(persona: MascotPersona) {
    const [messages, setMessages] = useState<ChatMessage[]>(() => [createGreeting(persona)]);
    // Счётчик, а не boolean: можно отправить несколько сообщений подряд,
    // и «печатает…» должно гореть, пока не пришёл ответ на каждое
    const [pendingReplies, setPendingReplies] = useState(0);
    const [isHappy, setIsHappy] = useState(false);
    const happyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(happyTimer.current), []);

    const setStatus = (id: string, status: MessageStatus) =>
        setMessages((list) => list.map((message) => (message.id === id
            ? { ...message, status }
            : message
        )))

    const deliver = useCallback(async (message: TextChatMessage)=> {
        setStatus(message.id, 'sending');
        try {
            await sendMessageToServer();
        } catch {
            setStatus(message.id, 'failed');
            return;
        }
        setStatus(message.id, 'sent');

        setPendingReplies((count) => count + 1);
        const reply = await waitForAgentReply();
        setPendingReplies((count) => count - 1);
        setMessages((list) => [
            ...list,
            { id: crypto.randomUUID(), kind: 'text', author: 'agent', status: 'sent', createdAt: now(), text: reply }
        ]);

        setIsHappy(true);
        clearTimeout(happyTimer.current);
        happyTimer.current = setTimeout(() => setIsHappy(false), HAPPY_AFTER_REPLY_MS);
    }, []);

    const send = useCallback(
        (text: string) => {
            const message: TextChatMessage = {
                id: crypto.randomUUID(),
                kind: 'text',
                author: 'user',
                status: 'sending',
                createdAt: now(),
                text
            }
            setMessages((list) => [...list, message]);
            void deliver(message)
        },
        [deliver],
    )

    const retry = useCallback(
        (message: ChatMessage) => {
            if (message.kind === 'text') void deliver(message);
        },
        [deliver],
    )

    const isAgentTyping = pendingReplies > 0;
    const lastMessage = messages.at(-1);
    // Эмоция маскота следует за разговором
    const mascotEmotion: MascotEmotion = isAgentTyping
        ? 'focused'
        : isHappy
            ? 'happy'
            : lastMessage?.status === 'failed'
                ? 'effort'
                : 'neutral';

    return { messages, isAgentTyping, mascotEmotion, send, retry };
}