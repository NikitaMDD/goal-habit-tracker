from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI, HTTPException
from openai import APIConnectionError, APITimeoutError, AsyncOpenAI

from app.core.llm.client import generate_reply, LLMClient
from app.core.llm.mapper import to_openai_messages
from app.schemas.chat import ChatRequest, ChatResponse, TextPart

from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.llm_client = AsyncOpenAI(
        base_url=settings.llm_base_url,
        api_key=settings.llm_api_key.get_secret_value(),
        timeout=settings.llm_timeout_seconds,
    )
    yield
    await app.state.llm_client.close()

app = FastAPI(title="AI Agent", lifespan=lifespan)

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/chat")
async def chat(request: ChatRequest, client: LLMClient) -> ChatResponse:
    messages = to_openai_messages(request.messages)
    try:
        reply = await generate_reply(client, messages)
    except (APIConnectionError, APITimeoutError) as e:
        raise HTTPException(status_code=503, detail="LLM недоступна") from e

    return ChatResponse(parts=[TextPart(text=reply)])