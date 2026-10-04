import {createDemoVoice} from "@/pages/sandbox/lib/createDemoVoice.ts";
import type {ChatMessage} from "@/entities/message";

const shortVoice = createDemoVoice(4);
const longVoice = createDemoVoice(14);
const minutesAgo =
    (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const demoMessages: ChatMessage[] = [
    { id: '1', kind: 'text', author: 'agent', status: 'sent', createdAt: minutesAgo(12), text: 'Привет! Сегодня ты ещё не отметил прогулку. Сходишь?' },
    { id: '2', kind: 'text', author: 'user', status: 'sent', createdAt: minutesAgo(11), text: 'Да, через полчаса' },
    { id: '3', kind: 'voice', author: 'user', status: 'sent', createdAt: minutesAgo(10), durationSec: 4, ...shortVoice },
    { id: '4', kind: 'text', author: 'agent', status: 'sent', createdAt: minutesAgo(9), text: 'Поставил напоминание на 18:30 🙂' },
    { id: '5', kind: 'voice', author: 'user', status: 'sent', createdAt: minutesAgo(3), durationSec: 14, ...longVoice },
    { id: '6', kind: 'text', author: 'user', status: 'sending', createdAt: minutesAgo(0), text: 'А сколько шагов я сделал за неделю?' },
    { id: '7', kind: 'text', author: 'user', status: 'failed', createdAt: minutesAgo(0), text: 'И напомни про воду' },
    { id: '8', kind: 'voice', author: 'user', status: 'failed', createdAt: minutesAgo(0), durationSec: 4, ...shortVoice },
]