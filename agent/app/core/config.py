from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, SecretStr

ENV_FILE = Path(__file__).parents[2] / ".env"

class Settings(BaseSettings):
    llm_base_url: str = Field(..., min_length=3, description="Адрес API-сервера LLM")
    llm_model: str = Field(..., min_length=3, description="Используемая модель")
    llm_timeout_seconds: float = Field(
        default=120.0,
        gt=0,
        description="Таймаут запроса к LLM, сек"
    )
    llm_api_key: SecretStr = Field(default="ollama", description="API ключ для доступа к провайдеру")

    model_config = SettingsConfigDict(env_file=ENV_FILE)

settings = Settings()