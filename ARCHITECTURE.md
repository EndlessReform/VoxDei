# Architecture

## Overview

Vox Dei is a platform to serve my own truly personal assistant:

- Serve fine-tuned models, as an OpenAI-compatible API and web platform
- Gather chat data and human / AI preferences for future improvements

## Code map

```bash
.
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
│   # Definitions for common data formats
└── schemas
```

## MLOps

TODO

## Colophon

Inspired by Matklad's [ARCHITECTURE.md](https://matklad.github.io//2021/02/06/ARCHITECTURE.md.html)

Diagram created with [D2](https://d2lang.com)
