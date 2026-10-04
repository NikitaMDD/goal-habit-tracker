import {Button} from "@/shared/ui/button";
import {SendIcon, TrashIcon} from "@/shared/ui/icon";
import {formatDuration} from "@/shared/lib";
import {LiveWaveform} from "@/features/record-voice/ui/LiveWaveform.tsx";

type VoiceRecorderBarProps = {
    levels: readonly number[];
    levelsOffset: number;
    elapsedSec: number;
    onCancel: () => void;
    onSend: () => void;
}

/** Бар записи вместо поля ввода: удалить — [● 0:07 ▁▃▅▂▇] — отправить. */
export function VoiceRecorderBar({ levels, levelsOffset, elapsedSec, onCancel, onSend }: VoiceRecorderBarProps) {
    return (
        <div className="flex items-center gap-2 border-t border-line bg-surface p-3">
            <Button
                variant="ghost"
                onClick={onCancel}
                aria-label="Отменить запись"
                className="size-10 shrink-0 px-0 text-danger hover:bg-canvas hover:text-danger"
            >
                <TrashIcon className="size-5"/>
            </Button>

            <div className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-control bg-accent px-3 text-on-accent">
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-on-accent motion-safe:animate-pulse"/>
                <span className="text-sm tabular-nums">{formatDuration(elapsedSec)}</span>
                <LiveWaveform levels={levels} offset={levelsOffset} />
                <span role="status" className="sr-only">
                    Идет запись голосового
                </span>
            </div>

            <Button
                variant="primary"
                onClick={onSend}
                aria-label="Отправить голосовое"
                // Микрофон, на который нажали, исчез — фокус переносим сюда, чтобы клавиатура не «потерялась»
                autoFocus
                className="size-10 shrink-0 px-0"
            >
                <SendIcon className="size-5" />
            </Button>
        </div>
    );
}