export type MessageAuthor = 'user' | 'agent';

/**
 * sending - ушло на сервер, ждем ответ
 * failed - не отправилось, можно повторить отправку
 */
export type MessageStatus = 'sending' | 'sent' | 'failed';

type ChatMessageBase = {
    id: string;
    author: MessageAuthor;
    status: MessageStatus;
    /** ISO-строка */
    createdAt: string;
}

export type TextChatMessage = ChatMessageBase & {
    kind: 'text';
    text: string;
}

export type VoiceChatMessage = ChatMessageBase & {
    kind: 'voice';
    audioUrl: string;
    /** Длительность храним в сообщении: у записей MediaRecorder (webm) audio.duration часто = Infinity */
    durationSec: number;
    /** Громкость по ходу записи, значения 0..1 Считается при записи как в Telegram */
    waveform: number[];
}

export type ChatMessage = TextChatMessage | VoiceChatMessage;