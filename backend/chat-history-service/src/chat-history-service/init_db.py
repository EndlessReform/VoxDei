import json
import jsonref
import os
from pymongo.database import Database


def initialize_db(db: Database):
    """
    Initialize the database.

    Args:
        db (Database): The MongoDB database.
    """

    # Create the chats collection if it doesn't exist
    if "chats" not in db.list_collection_names():
        db.create_collection("chats")
        db["chats"].create_index("conversation_id", unique=True)

