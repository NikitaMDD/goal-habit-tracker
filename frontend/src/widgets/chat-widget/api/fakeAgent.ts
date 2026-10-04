/**
 * Заглушка бэкенда, пока его нет: имитирует задержки сети и иногда — ошибку,
 * чтобы было видно статус «Не отправлено». Заменится на API-клиент из shared/api.
 */

/** Доля сообщений, которые «не дойдут» — для проверки повторной отправки */
const FAILURE_RATE = 0.2;

const wait =
    (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomBetween =
    (min: number, max: number) => min + Math.random() * (max - min);

const demoReplies = [
    "Записал! Хочешь, напомню об этом вечером?",
    "Отличный прогресс - ты уже третий день подряд держишь привычку.",
    "Понял. Давай разобьём это на маленькие шаги?",
    "За неделю ты прошел 42 тысячи шагов - это на 15% больше, чем на прошлой",
];

/** Сервер принял сообщение. Иногда «падает». */
export async function sendMessageToServer() {
    await wait(randomBetween(400, 900));
    if (Math.random() < FAILURE_RATE) throw new Error('Сервер недоступен');
}

/** Агент подумал и ответил */
export async function waitForAgentReply() {
    await wait(randomBetween(1200, 2200))
    return demoReplies[Math.floor(Math.random() * demoReplies.length)];
}