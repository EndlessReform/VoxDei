import os
from pydantic import BaseModel


class AppConfig(BaseModel):
    mongo_conn: str = os.getenv("MONGO_CONN")
    db_name: str = os.getenv("MONGO_DB_NAME")
    schema_dir: str = os.getenv("SCHEMA_DIR", "/app/schemas")


def get_config() -> AppConfig:
    return AppConfig()
