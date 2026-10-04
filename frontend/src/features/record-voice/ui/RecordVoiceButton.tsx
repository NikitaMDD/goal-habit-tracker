import {Button} from "@/shared/ui/button";
import {MicIcon} from "@/shared/ui/icon";

type RecordVoiceButtonProps = {
    onClick: () => void,
    /** Ждем, пока пользователь разрешит доступ к микрофону */
    isStarting?: boolean,
}

export function RecordVoiceButton({onClick, isStarting = false}: RecordVoiceButtonProps) {
    return (
        <Button
            variant="primary"
            onClick={onClick}
            aria-label="Записать голосовое"
            aria-busy={isStarting}
            className="size-10 shrink-0 px-0"
        >
            <MicIcon className="size-5" />
        </Button>
    )
}
