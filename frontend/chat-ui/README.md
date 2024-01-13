# Chat UI

This example shows how to use the [Vercel AI SDK](https://sdk.vercel.ai/docs) with [Next.js](https://nextjs.org/) and [OpenAI](https://openai.com) to create a ChatGPT-like AI-powered streaming chat bot.

## Setup

Install dependencies:

```bash
npm i
```

Set up `.env.local`:

```bash
# OpenAI-compatible endpoint for chat. Set to dev server for now
OPENAI_BASE_URL="foo.com/openai"
# Not needed at the moment since we don't have auth on backend yet
OPENAI_API_KEY="foobar"
CHAT_HISTORY_SERVICE_URL="http://localhost:8000"
```

## Development

Run dev server:

```bash
npm run dev
```

## Learn More

To learn more about OpenAI, Next.js, and the Vercel AI SDK take a look at the following resources:

- [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- [Vercel AI Playground](https://play.vercel.ai)
- [OpenAI Documentation](https://platform.openai.com/docs) - learn about OpenAI features and API.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
