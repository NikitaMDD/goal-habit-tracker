import json
from typing import assert_never

from openai.types.chat import (
    ChatCompletionAssistantMessageParam,
    ChatCompletionMessageFunctionToolCallParam,
    ChatCompletionMessageParam,
    ChatCompletionToolMessageParam,
    ChatCompletionUserMessageParam,
)

from app.schemas.chat import (
    AssistantMessage,
    ChatMessage,
    QuestionPart,
    TextPart,
    ToolMessage,
    UserMessage,
)

ASK_QUESTIONS_TOOL = "ask_questions"

def to_openai_message(message: ChatMessage) -> ChatCompletionMessageParam:
    match message:
        case UserMessage(text=text):
            return _user(text)
        case AssistantMessage(parts=parts):
            return _assistant(parts)
        case ToolMessage(call_id=call_id, answers=answers):
            return _tool(call_id, answers)
        case _:
            # TODO(review): все три вида сообщений обработаны — заменить на assert_never(message),
            #  как в _assistant (один подход к «невозможной ветке»). Текст «Неизвестное событие» — из примера.
            raise ValueError(f"Неизвестное событие: {type(message).__name__}")

# TODO(review): сделать system_prompt обязательным (str без None) — персона есть всегда,
#  а `if system_prompt:` молча пропускает None и "" → модель остаётся без инструкций.
def to_openai_messages(
    messages: list[ChatMessage],
    system_prompt: str | None = None,
) -> list[ChatCompletionMessageParam]:
    result: list[ChatCompletionMessageParam] = []
    if system_prompt:
        result.append({"role": "system", "content": system_prompt})
    result.extend(to_openai_message(m) for m in messages)
    return result


def _user(text: str) -> ChatCompletionUserMessageParam:
    return {"role": "user", "content": text}

# TODO(review): аннотировать answers (list[Answer]).
def _tool(call_id: str, answers) -> ChatCompletionToolMessageParam:
    return {
        "role": "tool",
        "tool_call_id": call_id,
        "content": json.dumps(
            {"answers": [a.model_dump() for a in answers]},
            ensure_ascii=False,
        )
    }

# TODO(review): аннотировать parts (list[Part]) — без этого assert_never ниже не проверяется анализатором.
def _assistant(parts) -> ChatCompletionAssistantMessageParam:
    texts: list[str] = []
    tool_calls: list[ChatCompletionMessageFunctionToolCallParam] = []

    for part in parts:
        match part:
            case TextPart(text=text):
                texts.append(text)
            case QuestionPart(call_id=call_id, questions=questions):
                # TODO: описать отдельную модель аргументов инструмента (шаг 4).
                # TODO(review): сериализовать через неё, а не q.model_dump() — сейчас в arguments
                #  уходит question_id, которого не будет в схеме инструмента (его проставляет агент).
                tool_calls.append({
                    "id": call_id,
                    "type": "function",
                    "function": {
                        "name": ASK_QUESTIONS_TOOL,
                        "arguments": json.dumps(
                            {"questions": [q.model_dump() for q in questions]},
                            ensure_ascii=False,
                        ),
                    },
                })
            case _:
                assert_never(part)

    msg: ChatCompletionAssistantMessageParam = {
        "role": "assistant",
        "content": "\n\n".join(texts) or None,
    }
    if tool_calls:
        msg["tool_calls"] = tool_calls
    return msg