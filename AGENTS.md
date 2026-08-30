# voice-agent-html

Instructions for AI coding agents working in this repository. Read this file
before writing any code.

Shared browser frontend for the Deepgram voice-agent starter family. It is
consumed as a git submodule (mounted at `frontend/`) by the backend starters
in the `deepgram-starters` organization — for example `node-voice-agent` and
`flask-voice-agent`. It does not work standalone: it needs a backend serving
`/api/session`, `/api/metadata`, and the `/api/voice-agent` WebSocket.

## What it is

- Vanilla JavaScript + HTML + CSS, bundled by Vite (dev server on port 8080)
- No Deepgram SDK in this repository: the browser talks only to the starter's
  backend over a WebSocket; the backend owns the Deepgram connection and the
  API key never reaches the browser
- Styling comes from the `@deepgram/styles` package

## Install, run, and test headlessly

```bash
corepack pnpm install     # install (corepack supplies the pinned pnpm 10)
corepack pnpm run build   # production build into dist/ — the headless check
corepack pnpm run dev -- --port 8080 --no-open   # dev server (needs a backend on 8081)
```

There is no unit-test suite in this repository; `corepack pnpm run build`
succeeding is the headless validation. Conformance tests live in the backend
starters (`make test` there), which exercise this frontend through the
running application.

## Versions (as of 2026-08-24)

| Package | Declared | Notes |
|---------|----------|-------|
| `vite` | `^7.3.2` | dev dependency; the only dependency tree of size |
| `@deepgram/styles` | `latest` | shared design tokens and CSS |

## Common failure modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `pnpm: command not found` | corepack not enabled | `corepack enable`, or prefix commands with `corepack pnpm` |
| Page loads but connecting fails | no backend running on port 8081 | start the parent starter (`make start` in its repository); this repo is not standalone |
| Edits vanish after committing in the parent starter | changes were made in the parent's `frontend/` working copy without committing in the submodule | commit and push inside `frontend/` first, then update the submodule pointer in the parent |

## Live documentation and machine-readable surfaces

- Documentation: https://developers.deepgram.com — append `.md` to any docs
  page URL to get clean Markdown.
- Agent index of all documentation: https://developers.deepgram.com/llms.txt
- API status (machine-readable): https://status.deepgram.com/api/v2/status.json

## Conventional Commits

All commits must follow conventional commits format.
