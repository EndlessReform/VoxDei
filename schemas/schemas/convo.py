from pydantic import BaseModel, Field
from schemas.message import Message, EditStatus
from typing import Dict, Optional
import json
import os


def hello():
    """Return a friendly greeting."""
    return "Hello schemas"


class Metadata(BaseModel):
    platform: str
    edit_status: Optional[EditStatus] = None
    system_message: Optional[str] = Field(
        ..., description="System message when convo was created"
    )


class Convo(BaseModel):
    conversation_id: str
    title: Optional[str] = None
    create_time: str = Field(..., description="ISO 8601 timestamp")
    metadata: Metadata
    mapping: Dict[str, Message]
    last_message: str


def main():
    """
    Export derived schema as JSON Schema.

    TODO: Refactor this once I have more data models
    """
    # Return Convo as JSON Schema
    curr_path = os.path.dirname(__file__)
    with open(os.path.join(curr_path, "..", "json", "Convo.json"), "w") as f:
        f.write(json.dumps(Convo.model_json_schema(), indent=2))


if __name__ == "__main__":
    main()
