#ToDo List
# Следующая задача — закрыть TODO(review) в этом файле:
# - to_openai_message: заменить raise ValueError в ветке case _ на assert_never(message)
# - _tool: аннотировать answers (list[Answer])
# - _assistant: аннотировать parts (list[Part])
# Логирование в main.py: при 502 писать в лог исключение и сырые arguments от модели,
# сейчас причина ошибки теряется
import json
from typing import assert_never

from openai.types.chat import (
    ChatCompletionAssistantMessageParam,
    ChatCompletionMessageFunctionToolCallParam,
    ChatCompletionMessageParam,
    ChatCompletionToolMessageParam,
    ChatCompletionUserMessageParam, ChatCompletionMessage,
)

from app.schemas.chat import (
    AssistantMessage,
    ChatMessage,
    Question,
    QuestionPart,
    TextPart,
    ToolMessage,
    UserMessage,
    Part,
)

from app.agent.tools import (
    ASK_QUESTIONS_TOOL,
    AskQuestionsArgs,
    QuestionArg,
)

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

def to_openai_messages(
    messages: list[ChatMessage],
    system_prompt: str,
) -> list[ChatCompletionMessageParam]:
    result: list[ChatCompletionMessageParam] = [
        {"role": "system", "content": system_prompt}
    ]
    result.extend(to_openai_message(m) for m in messages)
    return result

def from_openai_message(message: ChatCompletionMessage) -> list[Part]:
    parts: list[Part] = []

    content = message.content.strip() if message.content else ""
    if content:
        parts.append(TextPart(text=content))

    for call in message.tool_calls or []:
        if call.function.name != ASK_QUESTIONS_TOOL:
            raise ValueError(f"Неизвестный инструмент: {call.function.name}")

        args = AskQuestionsArgs.model_validate_json(call.function.arguments)
        parts.append(
            QuestionPart(
                call_id=call.id,
                questions=[
                    Question(
                        question_id=i,
                        text=q.text,
                        options=q.options,
                        multiple_choice=q.multiple_choice,
                    )
                    for i, q in enumerate(args.questions, start=1)
                ],
            )
        )

    if not parts:
        raise ValueError("Модель вернула пустой ответ")

    return parts

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
                tool_calls.append({
                    "id": call_id,
                    "type": "function",
                    "function": {
                        "name": ASK_QUESTIONS_TOOL,
                        "arguments": AskQuestionsArgs(
                            questions=[
                                QuestionArg(
                                    text=q.text,
                                    options=q.options,
                                    multiple_choice=q.multiple_choice,
                                )
                                for q in questions
                            ]
                        ).model_dump_json()
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