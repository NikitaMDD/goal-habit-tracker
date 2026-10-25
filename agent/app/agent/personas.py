from enum import StrEnum

from pydantic import BaseModel, Field, ConfigDict

from app.agent.characters import (RYZHIK_CHARACTER, UGOLEK_CHARACTER, KLYAKSA_CHARACTER,
                        UGOLOK_CHARACTER, ROSTOK_CHARACTER, PUSHOK_CHARACTER)


class PersonaId(StrEnum):
    RYZHIK = "ryzhik"
    UGOLEK = "ugolek"
    KLYAKSA = "klyaksa"
    UGOLOK = "ugolok"
    ROSTOK = "rostok"
    PUSHOK = "pushok"

class GrammaticalGender(StrEnum):
    FEMININE = "feminine"
    MASCULINE = "masculine"

class Persona(BaseModel):
    model_config = ConfigDict(frozen=True)
    id: PersonaId
    name: str = Field(description="Имя персоны")
    character: str = Field(description="Характер персоны")
    grammatical_gender: GrammaticalGender = Field(description="Грамматический род персоны")

_PERSONAS = [
    Persona(id=PersonaId.RYZHIK, name="Рыжик", character=RYZHIK_CHARACTER, grammatical_gender=GrammaticalGender.MASCULINE),
    Persona(id=PersonaId.UGOLEK, name="Уголек", character=UGOLEK_CHARACTER, grammatical_gender=GrammaticalGender.MASCULINE),
    Persona(id=PersonaId.KLYAKSA, name="Клякса", character=KLYAKSA_CHARACTER, grammatical_gender=GrammaticalGender.FEMININE),
    Persona(id=PersonaId.UGOLOK, name="Уголок", character=UGOLOK_CHARACTER, grammatical_gender=GrammaticalGender.MASCULINE),
    Persona(id=PersonaId.ROSTOK, name="Росток", character=ROSTOK_CHARACTER, grammatical_gender=GrammaticalGender.MASCULINE),
    Persona(id=PersonaId.PUSHOK, name="Пушок", character=PUSHOK_CHARACTER, grammatical_gender=GrammaticalGender.MASCULINE),
]

PERSONAS: dict[PersonaId, Persona] = {persona.id: persona for persona in _PERSONAS}

if len(PERSONAS) != len(_PERSONAS):
    raise RuntimeError(
        "Ошибка инициализации, найдены дубликаты персон в '_PERSONAS' "
        f"Всего записей {len(_PERSONAS)}, но всего уникальных id: {len(PERSONAS)}"
    )

_missing_ids = set(PersonaId) - set(PERSONAS)

if _missing_ids:
    missing_str = ", ".join(f"'{id_}'" for id_ in _missing_ids)
    raise RuntimeError(
        f"Ошибка инициализации PERSONAS. Нет данных для следующих PersonaId: {missing_str} "
        "Пожалуйста, добавьте их в массив '_PERSONAS'."
    )

