# AI Code Explainer

AI Code Explainer is a full-stack application that demonstrates how to build an AI-powered code explanation experience with React 19, Express.js, and an LLM-compatible backend.

## Overview

The project includes:

- An Express.js API with a `/api/explain` endpoint
- Optional LLM integration using OpenAI-compatible chat completions
- A modern React 19 client built with Vite and Tailwind CSS
- `useActionState`-based form submission and response handling

## Getting Started

1. Start the backend from `server/` on port `3002`.
2. Start the frontend from `client/` on port `3001`.
3. Open `http://localhost:3001` in your browser and paste in a code snippet to generate an explanation.

## Environment Variables

Configure the backend using the variables defined in `server/.env.example`.

If `OPENAI_API_KEY` is not set, the backend will return a deterministic demo explanation so the application remains fully usable during local development.
