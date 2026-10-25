from typing import Literal, Union, Annotated, Self

from pydantic import BaseModel, Field, StringConstraints, model_validator

from app.agent.personas import PersonaId

NonEmptyStr = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1),
]

#ToDo List:
# - Добавить возможность в options, вариант своего ответа
# Примерное решение сделать отдельную модель для options где будет list[str] и вариант своего значения

class Question(BaseModel):
    question_id: int = Field(..., description="ID вопроса")
    text: NonEmptyStr = Field(description="Вопрос который задает агент")
    options: list[NonEmptyStr] = Field(min_length=2, max_length=10, description="Варианты ответа, которые предлагает агент")
    multiple_choice: bool = Field(default=False, description="Можно ли выбрать несколько ответов")

class TextPart(BaseModel):
    type: Literal["text"] = "text"
    text: NonEmptyStr = Field(description="Текстовая часть")

class QuestionPart(BaseModel):
    type: Literal["questions"] = "questions"
    call_id: str = Field(..., description="ID вызова инструмента")
    questions: list[Question] = Field(min_length=1, description="Список вопросов")

Part = Annotated[
    Union[TextPart, QuestionPart],
    Field(discriminator="type", description="Часть ответа агента")
]

class AssistantMessage(BaseModel):
    role: Literal["assistant"] = "assistant"
    parts: list[Part] = Field(min_length=1, description="Полный вариант ответа")

class UserMessage(BaseModel):
    role: Literal["user"] = "user"
    text: NonEmptyStr = Field(description="Запрос пользователя")

class Answer(BaseModel):
    question_id: int = Field(..., description="ID вопроса")
    selected: list[NonEmptyStr] = Field(min_length=1, description="Выбранные ответы")

class ToolMessage(BaseModel):
    role: Literal["tool"] = "tool"
    call_id: str = Field(..., description="ID вызова инструмента")
    answers: list[Answer] = Field(min_length=1, description="Ответы пользователя на вопросы")

ChatMessage = Annotated[
    Union[AssistantMessage, UserMessage, ToolMessage],
    Field(discriminator="role")
]

class ChatRequest(BaseModel):
    persona_id: PersonaId = Field(description="ID персоны модели")
    messages: list[ChatMessage] = Field(min_length=1, description="Вся переписка с агентом")

    @model_validator(mode="after")
    def check_last_message(self) -> Self:
        if self.messages[-1].role == 'assistant':
            raise ValueError("Последнее сообщение не может быть от assistant, только user и tool")
        return self

class ChatResponse(BaseModel):
    parts: list[Part] = Field(min_length=1, description="Все части ответов")
