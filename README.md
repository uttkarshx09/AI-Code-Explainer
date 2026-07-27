# AI Code Explainer

This workspace contains a full-stack AI code explainer.

## What it includes

- Express API with a `/api/explain` endpoint
- Optional LLM integration through OpenAI-compatible chat completions
- React 19 + Vite + Tailwind client
- `useActionState`-driven form submission and result handling

## Local setup

1. Start the backend from `server/` on port `3002`.
2. Start the frontend from `client/` on port `3001`.
3. Open the client in the browser at `http://localhost:3001` and paste any snippet.

## Environment

Set the backend environment variables from `server/.env.example`.

If `OPENAI_API_KEY` is missing, the backend returns a deterministic demo explanation so the UI still works.