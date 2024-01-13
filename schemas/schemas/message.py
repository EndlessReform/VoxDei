from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional


class AuthorRole(Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"


class Author(BaseModel):
    name: Optional[str] | None = "None"
    role: AuthorRole

    class Config:
        use_enum_values = True


class ContentTypes(Enum):
    SEED = "seed"
    PROMPT = "prompt"
    IMAGE_PROMPT = "image_prompt"


class ImagePrompt(BaseModel):
    size: str
    prompt: Optional[str] = None
    prompts: Optional[List[str]] = None


class EditStatus(Enum):
    IN_PROGRESS = "in_progress"
    TODO = "todo"
    DONE = "done"


class Metadata(BaseModel):
    slug: Optional[str] = Field(..., alias="model_slug")
    edit_status: Optional[EditStatus] = None
    original_content: Optional[str] = None
    recipient: Optional[str] = None

    class Config:
        use_enum_values = True


class Message(BaseModel):
    parent: Optional[str] = None
    children: List[str] = []
    author: Author
    create_time: int | str = Field(
        ..., description="unix timestamp or ISO 8601 datetime string"
    )
    content: str | List[int] | ImagePrompt
    content_type: Optional[ContentTypes] | None = None
    metadata: Optional[Metadata] = None
