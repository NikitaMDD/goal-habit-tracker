import logging

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from openai import APIConnectionError, APITimeoutError, AsyncOpenAI

from app.agent.tools import build_ask_questions_tool
from app.core.llm.client import generate_reply, LLMClient
from app.core.llm.mapper import to_openai_messages, from_openai_message
from app.schemas.chat import ChatRequest, ChatResponse

from app.core.config import settings

from app.agent.personas import PERSONAS
from app.agent.prompts import build_system_prompt

logging.basicConfig(
    filename="LLM_agent.log",
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filemode="a",
    level=logging.DEBUG,
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

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
    persona = PERSONAS[request.persona_id]
    messages = to_openai_messages(request.messages, build_system_prompt(persona))
    message = None
    try:
        message = await generate_reply(client, messages, tools=[build_ask_questions_tool()])
        parts = from_openai_message(message)
    except (APIConnectionError, APITimeoutError) as e:
        logger.warning("LLM недоступна: %s", e)
        raise HTTPException(status_code=503, detail="LLM недоступна") from e
    except ValueError as e:
        raw_calls = [
            (c.function.name, c.function.arguments) for c in (message.tool_calls or [])
        ] if message else None
        logger.exception(
            "Некорректный ответ модели: content=%r tool_calls=%r",
            message.content if message else None,
            raw_calls,
        )
        raise HTTPException(status_code=502, detail="Модель вернула некорректный ответ") from e

    return ChatResponse(parts=parts)