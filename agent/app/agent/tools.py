from pydantic import BaseModel, Field

from app.core.llm.json_schema import inline_refs
from app.schemas.chat import NonEmptyStr

from openai.types.chat import ChatCompletionToolParam

ASK_QUESTIONS_TOOL = "ask_questions"

class QuestionArg(BaseModel):
    text: NonEmptyStr = Field(description="Вопрос, который задаёт агент")
    options: list[NonEmptyStr] = Field(min_length=2, max_length=5,
                               description="От 2 до 5 коротких вариантов ответа; взаимоисключающие, если multiple_choice=false")
    multiple_choice: bool = Field(default=False, description="Можно ли выбрать несколько ответов")

class AskQuestionsArgs(BaseModel):
    questions: list[QuestionArg] = Field(
        min_length=1,
        max_length=4,
        description="Вопросы пользователю от 1 до 4"
    )

ASK_QUESTIONS_TOOL_PARAMETERS = inline_refs(AskQuestionsArgs.model_json_schema())

def build_ask_questions_tool() -> ChatCompletionToolParam:
    return {
        "type": "function",
        "function": {
            "name": ASK_QUESTIONS_TOOL,
            "description": (
                "Задать пользователю один или несколько вопросов с вариантами "
                "ответов, когда для ответа не хватает данных из диалога"
            ),
            "parameters": ASK_QUESTIONS_TOOL_PARAMETERS
        }
    }