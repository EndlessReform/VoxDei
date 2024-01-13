from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
from transformers import AutoTokenizer
import os
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List
import logging

from chat_hf import app as chat_app
from convos import app as convos_app
from dependencies.shared_state import get_shared_state

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],  # Add the ports you're using
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    shared_state = get_shared_state()
    load_dotenv()
    logger.info("Connecting to MongoDB")

    mongo_client = MongoClient(os.environ["MONGO_URL"])
    laura_db = mongo_client["laura-dataset"]
    dalle_collection = laura_db["dalle"]

    # Test the connection
    try:
        # The ismaster command is cheap and does not require auth.
        mongo_client.admin.command("ismaster")
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")

    # Yes, this violates separation of concerns, but FastAPI is too prissy to let me do this on a sub-app level
    hf_client = InferenceClient(os.getenv("INFERENCE_SERVER_URL"))
    tokenizer = AutoTokenizer.from_pretrained("teknium/OpenHermes-2-Mistral-7B")

    shared_state.set_state(
        {
            "dalle_collection": dalle_collection,
            "hf_client": hf_client,
            "tokenizer": tokenizer,
            "laura_db": laura_db,
            "mongo_client": mongo_client,
        }
    )


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/health")
def health():
    return {"status": "ok"}


app.mount("/convos", convos_app)
app.mount("/openai", chat_app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
