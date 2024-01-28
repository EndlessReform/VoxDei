# Deploy UI

NOTE: This is a half-measure until I get k8s working.

## Installation

1. Copy `docker-compose.yml` to some folder.
2. Make .env file with the following items:

```bash
OPENAI_BASE_URL=""
# Leave blank, infra is running locally
OPENAI_KEY=""
# Prefer in-network
CHAT_HISTORY_SERVICE_URL="http://chat-history-service:8000"

# TODO: this should really be in a separate file
MONGO_CONN=""
MONGO_DB_NAME=""
```

Yes, this is very insecure. However, at this point, there are no secrets so it's all theatre: will refactor later.

Start: `docker-compose up --pull`
