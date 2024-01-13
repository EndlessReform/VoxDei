from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import List
from dependencies.shared_state import get_shared_state


class ConvoItem(BaseModel):
    id: str
    title: str
    create_time: float
    mapping: dict
    metadata: dict


app = FastAPI()


@app.get("/dalle/")
def read_all_convos(
    limit: int = 10, page: int = 1, shared_state=Depends(get_shared_state)
) -> List[ConvoItem]:
    skip = (page - 1) * limit
    state = shared_state.get_state()
    convos = list(state["dalle_collection"].find().skip(skip).limit(limit))
    return convos


@app.get("/dalle/{item_id}")
def read_item(item_id: str, q: str = None, shared_state=Depends(get_shared_state)):
    state = shared_state.get_state()
    item = state["dalle_collection"].find_one({"id": item_id})
    # return {"item": item, "q": q}
    if item is not None:
        item["_id"] = str(item["_id"])
    return item


@app.post("/dalle/")
def create_item(item: ConvoItem, shared_state=Depends(get_shared_state)):
    state = shared_state.get_state()
    state["dalle_collection"].insert_one(item.model_dump())
    return item.model_dump_json()


@app.put("/dalle/{item_id}")
def update_item(item_id: str, item: ConvoItem, shared_state=Depends(get_shared_state)):
    state = shared_state.get_state()
    state["dalle_collection"].update_one({"id": item_id}, {"$set": item.model_dump()})
    return item.model_dump()
