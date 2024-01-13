from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional
from schemas import Message as ArchivalMessage
from schemas.message import Author, Metadata


class AuthorRole(Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class Message(BaseModel):
    id: str
    role: AuthorRole
    content: str
    createdAt: str

    def to_archival_message(self, parent, model_slug) -> ArchivalMessage:
        return ArchivalMessage(
            parent=parent,
            children=[],
            author=Author(role=self.role.value),
            create_time=self.createdAt,
            content=self.content,
            metadata=Metadata(
                model_slug=model_slug,
                edit_status="todo",
                original_content=self.content,
                recipient=None,
            ),
        )


class BaseRequest(BaseModel):
    slug: Optional[str] = Field(..., alias="model_slug")
    platform: Optional[str] = Field(..., alias="platform")


class ConvoCreateRequest(BaseRequest):
    conversation_id: str
    messages: list[Message]
    title: Optional[str] = None


class AddMessageRequest(BaseRequest):
    parent_id: str | None = None
    new_message: Message
