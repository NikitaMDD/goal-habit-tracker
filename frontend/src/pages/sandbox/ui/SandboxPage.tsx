import {useState} from "react";
import {Button} from "@/shared/ui/button";
import {SegmentedControl} from "@/shared/ui/segmented-control";
import {Mascot, type MascotEmotion, mascotEmotions, mascotPersonas} from "@/entities/mascot";

import {Message} from "@/entities/message";
import {demoMessages} from "../config/demoMessages";
import {ChatWidget} from "@/widgets/chat-widget";

export function SandboxPage() {
    const [emotion, setEmotion] = useState<MascotEmotion>('neutral');

    return (
        <main className="bg-dots min-h-screen px-4 py-10">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <header>
                    <h1 className="font-display text-3xl font-semibold">Песочница</h1>
                    <p className="mt-1 text-ink-muted">Маскоты, эмоции и UI-компоненты модуля</p>
                </header>

                <section className="rounded-card border border-line bg-surface p-6">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-lg font-medium">Маскоты</h2>
                        <SegmentedControl
                            label="Эмоция маскота (агента)"
                            options={mascotEmotions}
                            value={emotion}
                            onChange={setEmotion}
                        />
                    </div>
                    <ul className="grid grid-cols-3 gap-6 sm:grid-cols-6">
                        {mascotPersonas.map((persona) => (
                            <li key={persona.id} className="flex flex-col items-center gap-2">
                                <Mascot persona={persona} emotion={emotion} size={112} />
                                <span className="font-display text-sm">{persona.name}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-card border border-line bg-surface p-6">
                    <h2 className="mb-4 text-lg font-medium">Кнопки</h2>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary" size="md">Отправить</Button>
                        <Button>Отмена</Button>
                        <Button variant="ghost">Подробнее</Button>
                        <Button variant="primary" size="sm">Маленькая</Button>
                        <Button disabled>Недоступна</Button>
                    </div>
                </section>

                <section className="rounded-card border border-line bg-surface p-6">
                    <h2 className="mb-4 text-lg font-medium">Сообщения</h2>
                    <div className="flex flex-col gap-3 rounded-card bg-canvas p-4">
                        {demoMessages.map((message) => (
                            <Message
                                key={message.id}
                                message={message}
                                onRetry={
                                    message.status === 'failed'
                                        ? () => alert(`Повтор: ${message.id}`)
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                </section>

                <ChatWidget persona={mascotPersonas[4]}/>
            </div>
        </main>
    );
}