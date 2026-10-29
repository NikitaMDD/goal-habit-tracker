from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam, ChatCompletionToolParam, ChatCompletionMessage

from app.core.config import settings

from typing import Annotated
from fastapi import Depends, Request

async def generate_reply(
    client: AsyncOpenAI,
    messages: list[ChatCompletionMessageParam],
    tools: list[ChatCompletionToolParam] | None = None,
    temperature: float = 0.7,
) -> ChatCompletionMessage:
    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=messages,
        tools=tools,
        temperature=temperature,
    )

    return response.choices[0].message

def get_llm_client(request: Request) -> AsyncOpenAI:
    return request.app.state.llm_client

LLMClient = Annotated[AsyncOpenAI, Depends(get_llm_client)]