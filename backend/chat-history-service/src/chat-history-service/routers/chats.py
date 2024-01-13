from bson import json_util
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request
from pymongo.collection import Collection
from pymongo import DESCENDING
from typing import List
import uuid
from models import AddMessageRequest, ConvoCreateRequest
from schemas import Convo
import json

router = APIRouter()


@router.get("/chats")
async def get_chats(
    request: Request, page: int = 1, page_size: int = 10
) -> List[Convo]:
    chats_coll: Collection = request.app.state.chats_coll
    chats = (
        chats_coll.find()
        .sort("create_time", DESCENDING)
        .skip((page - 1) * page_size)
        .limit(page_size)
    )
    return list(chats)


@router.get("/chats/titles")
async def get_chat_titles(request: Request, page: int = 1, page_size: int = 10):
    chats_coll: Collection = request.app.state.chats_coll
    chats = (
        chats_coll.find({}, {"title": 1, "conversation_id": 1})
        .sort("create_time", DESCENDING)
        .skip((page - 1) * page_size)
        .limit(page_size)
    )
    return [{**chat, "_id": str(chat["_id"])} for chat in chats]


@router.get("/chats/{chat_id}")
async def get_chat(request: Request, chat_id: str) -> Convo:
    chats_coll: Collection = request.app.state.chats_coll
    chat = chats_coll.find_one({"conversation_id": chat_id})
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.post("/chats")
async def create_chat(request: Request, item: ConvoCreateRequest):
    chat_create_time = datetime.now().isoformat()

    chat = {
        "conversation_id": item.conversation_id,
        # TODO: This is an ugly hack, change the spec
        "title": item.title if item.title is not None else "None",
        "create_time": chat_create_time,
        "metadata": {
            "platform": item.platform,
            "edit_status": "todo",
            "system_message": item.messages[0].content
            if len(item.messages) > 0 and item.messages[0].role.value == "system"
            else None,
        },
        "mapping": {},
    }

    for message in item.messages:
        # Update mapping
        if "last_message" in chat:
            chat["mapping"][chat["last_message"]]["children"].append(message.id)

        # Populate message
        new_message = message.to_archival_message(
            chat["last_message"] if "last_message" in chat else None,
            item.slug if item.slug else "unknown",
        ).dict(by_alias=True)

        # Persist new message
        chat["last_message"] = message.id
        chat["mapping"] = {**chat["mapping"], message.id: new_message}

    chats_coll: Collection = request.app.state.chats_coll
    try:
        result = chats_coll.insert_one(chat)
        return {"convo_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/chats/{chat_id}")
async def update_chat(request: Request, chat_id: str, chat: dict):
    chats_coll: Collection = request.app.state.chats_coll
    try:
        result = chats_coll.update_one({"conversation_id": chat_id}, {"$set": chat})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")
        return {"convo_id": chat_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/chats/{chat_id}/messages")
async def create_message(request: Request, chat_id: str, item: AddMessageRequest):
    chats_coll: Collection = request.app.state.chats_coll

    if item.parent_id is None:
        # Assume we are adding a new last message
        if (
            new_id := chats_coll.find_one(
                {"conversation_id": chat_id}, {"last_message": 1}
            )
        ) is not None:
            item.parent_id = new_id["last_message"]
        else:
            raise HTTPException(status_code=404, detail="Chat not found")

    # Construct message
    new_msg = item.new_message.to_archival_message(item.parent_id, item.slug).dict(
        by_alias=True
    )

    try:
        result = chats_coll.update_one(
            {"conversation_id": chat_id},
            {
                "$set": {
                    f"mapping.{item.new_message.id}": new_msg,
                    "last_message": item.new_message.id,
                }
            },
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")
        return {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
