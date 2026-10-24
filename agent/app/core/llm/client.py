from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam

from app.core.config import settings

from typing import Annotated
from fastapi import Depends, Request

async def generate_reply(
    client: AsyncOpenAI,
    messages: list[ChatCompletionMessageParam],
    temperature: float = 0.7,
) -> str:
    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=messages,
        temperature=temperature,
    )

    content = response.choices[0].message.content
    if not content:
        raise ValueError("Модель вернула пустой ответ")

    return content.strip()

def get_llm_client(request: Request) -> AsyncOpenAI:
    return request.app.state.llm_client

LLMClient = Annotated[AsyncOpenAI, Depends(get_llm_client)]