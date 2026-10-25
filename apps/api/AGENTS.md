<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## This app (apps/api)

The block above is maintained by Next.js. These rules are specific to this project; the root AGENTS.md has the project-wide rules.

- Headless Next.js API on Vercel: route handlers only (`app/<name>/route.ts`), no pages or UI. `app/health` and `app/me` are the examples to copy.
- Route handlers stay thin: parse input, check auth, call `@app/core` or Supabase, return JSON. Business logic belongs in `@app/core`.
- Validate every request body and query string with the shared schemas in `@app/core`; reject invalid input with a 400.
- Use the helpers in `lib/`:
  - `respond.ts`: `json()` and `error()` for every response (adds CORS for allowed web origins), and `preflight` exported as `OPTIONS` from every route.
  - `auth.ts`: `requireUser()` on any route that touches user data. It verifies the caller's Supabase token and returns a client that acts as that user, or a 401.
  - `supabase.ts`: `userClient()` by default. `adminClient()` uses the secret key and bypasses Row Level Security; use it only when a route genuinely has to, with a comment saying why.
  - `env.ts`: every environment variable is read here.
- CORS: only origins in `ALLOWED_ORIGINS` get CORS headers. The iOS and Android apps don't need CORS.
- Errors return `{ "error": "..." }` with the right status code; never expose stack traces, keys or internal details.
- Tests: Jest, `*.test.ts` beside the file. Pure helpers get unit tests.
- Environment: copy `.env.example` to `.env.local`. Never commit real values.
