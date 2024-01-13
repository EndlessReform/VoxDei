# Architecture

## Overview

LaURA is a platform to create my own truly personal assistant:

- Create LLM instruction datasets for creative and conversational tasks
- Fine-tune foundation model LLMs as artifacts
- Serve fine-tuned models, as an OpenAI-compatible API and web platform
- Gather chat data and human / AI preferences for future improvements

## System diagram

<image src="./docs/ARCHITECTURE.svg" width="480">

We use:

## Code map

```bash
.
│   # Exploratory Jupyter notebooks
├── analysis
│   # FastAPI monolith (for now): history and inference
├── backend
├── docs
├── frontend
│  │   # UI for manual data editing
│  ├── annotation
│  │   # Chat UI (Next.js)
│  └── chat
│   # IaC deployment scripts
├── infra
│   # Ad-hoc Jupyter notebooks
├── ingestion
│   # Ad-hoc Jupyter notebooks to convert to ChatML
├── instruction
│   # Definitions for common data formats
└── schemas
```

## MLOps

TODO

## Colophon

Inspired by Matklad's [ARCHITECTURE.md](https://matklad.github.io//2021/02/06/ARCHITECTURE.md.html)

Diagram created with [D2](https://d2lang.com)
