# Vox Dei

This monorepo is the platform for my personal inference stack:

- OpenAI-compatible backend wrapper for HuggingFace [text-generation-inference]()
- History microservice
- Chat frontend
- Annotation frontend

# Deploying this stack

TODO

## Local development setup

### Prerequisites

You should install the following if you don't have them:

- Git
- Node (through [nvm](https://github.com/nvm-sh/nvm))
- Python
- Python [Poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)

### Setup

We're using [Nx](https://nx.dev) for monorepo management.

Install dependencies:

```bash
nvm install
# Install NPM dependencies using npm workspaces.
# TODO: Change install options?
npm i
# Install Python Poetry
curl -sSL https://install.python-poetry.org | python -
# Install python dependencies
npx nx run-many -t install
```

Everything in development uses `dev`.

```bash
# Run single project
npx nx run chat-ui:dev
# Run individual projects
npx nx run-many -t dev -p chat-ui chat-history-service
```

Build all projects:

```
npm run build
```

### Poetry

Add dependency to Python project:

```bash
npx nx chat-history-service:add dep
npx nx some_project:rm --name dep
```

Add local dependency:

```bash
# Add lib1 to proj2
npx nx run proj2:add --name lib1 --local
```

Create new Python project:

## Contributing

See ARCHITECTURE.md for details.
