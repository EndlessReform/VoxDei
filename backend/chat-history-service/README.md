# Chat History Service

## Deployment

Provide either via Docker or via `.env.prod`:

```bash
# Full connection string to MongoDB
MONGO_CONN=string
# Name of client DB
MONGO_DB_NAME=string
```

## Local development

Set `.env.dev` as above.

This project uses poetry!

```bash
poetry install
poetry run python main.py
```

## DB schema

On MongoDB.

- `chats` collection: follows `schemas/convo_schema`.
