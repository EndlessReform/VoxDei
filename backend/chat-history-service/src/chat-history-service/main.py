from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient 
from dotenv import load_dotenv
from routers import chats
import os
import uvicorn

from config import get_config
from init_db import initialize_db


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
    ],  # Add the ports you're using
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chats.router)


@app.on_event("startup")
async def startup():
    env = os.getenv("ENV", "prod")
    app.state.env = env

    # Load environment variables from .env file
    if env == "dev":
        load_dotenv(f".env.{env}")

    config = get_config()
    app.state.config = config

    # Create a MongoDB client
    app.state.client = MongoClient(config.mongo_conn)

    db = app.state.client[config.db_name]
    initialize_db(db)

    chats_coll = db["chats"]
    app.state.db = db
    app.state.chats_coll = chats_coll


@app.get("/")
async def root():
    return {}


@app.get("/health")
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    env = os.getenv("ENV", "dev")
    port = int(os.getenv("PORT", 8000)) if env == "dev" else 8000
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=env == "dev")
