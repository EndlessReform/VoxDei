# Stage 1: Builder

FROM python:3.11.0-slim-buster as builder

# Set working directory
WORKDIR /app

COPY dist/chat_history_service*.whl /app/
RUN ls -la /app/
RUN pip install /app/chat_history_service*.whl
CMD ["python", "/usr/local/lib/python3.11/site-packages/chat-history-service/main.py"]
