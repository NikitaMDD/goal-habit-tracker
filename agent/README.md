# Agent (Python)

## Запуск проекта локально

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

## Работа с `.env`

| Переменная | За что отвечает | Обязательное |
| --- | --- | --- |
| LLM_BASE_URL | Адрес АПИ сервера языковой модели | ✅ |
| LLM_MODEL | Какая языковая модель используется | ✅ |
| LLM_TIMEOUT_SECONDS | Время ответа языковой модели | ❌ |
| LLM_API_KEY | АПИ ключ для доступа к провайдеру | ❌ |

Создание `.env` по примеру

```bash

cp .env.example .env

```