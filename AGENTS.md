# AGENTS.md

Project-wide rules for any AI coding agent working in this repo. Each app also has its own AGENTS.md with its framework's rules: read the one in the folder you're working in.

## About this app

This repo starts as a template. When a new app is created from it, fill in this section and the names listed in README.md.

- What it does: TODO — one or two sentences on what the app is for and who uses it.
- Platforms: iOS, Android and web from one codebase, all supported from day one. Every feature must work on all three unless its spec says otherwise.
- Solo project. My main language is Python: when code relies on a TypeScript or React pattern with no obvious Python equivalent, explain it in one line in your summary.

## Repo layout

```
apps/
  client/       Expo app for iOS, Android and web   → EAS (stores), Vercel (web)
  api/          Next.js API routes, no UI           → Vercel
packages/
  core/         @app/core: shared logic, types and request/response schemas
supabase/       migrations/, seed.sql, config.toml
docs/specs/     one short spec per feature (copy _template.md)
scripts/        repo scripts, e.g. release.mjs
```

## Commands (from the repo root)

```bash
npm install                      # install everything
npm run dev:client               # Expo dev server (press i / a / w for iOS, Android, web)
npm run dev:api                  # API on http://localhost:3000
npm run typecheck && npm run lint && npm test
npm run db:start                 # local Supabase (needs Docker); db:stop to stop it
npx supabase migration new <name>
npm run db:reset                 # rebuild the local database from migrations + seed.sql
npm run db:types                 # regenerate packages/core/src/db-types.ts
npm run release:ios              # store release, only when switched on in release-targets.json
```

## Monorepo rules

- npm workspaces with one lockfile at the root. Run `npm install` from the root only. Add a dependency to one workspace with `npm install <pkg> -w apps/api`; in the Expo app, run `npx expo install <pkg>` from `apps/client` instead.
- Imports flow one way: apps import packages. Apps never import from each other, and packages never import from apps.
- `packages/core` is plain TypeScript: no React, React Native or Next.js imports, so it runs in the app, the API and tests alike. Internal packages use the `@app/` scope (the same in every app made from this template; never rename it), are `private`, are depended on as `"*"`, and export TypeScript source directly (no build step).
- One React version for the whole repo: the root `package.json` `overrides` pins `react` and `react-dom` to the version the current Expo SDK expects. Update it in the same change as any Expo SDK upgrade.
- Every workspace has `lint`, `typecheck` and `test` scripts. From the root, `npm run typecheck`, `npm run lint` and `npm test` run them across all workspaces.
- Propose any new app or package to me before creating it.
- Project instructions live only in AGENTS.md files. Never create a CLAUDE.md or CLAUDE.local.md anywhere in this repo: Claude Code skips AGENTS.md when one exists.
- Check current docs before using an Expo, Next.js, Supabase or Vercel API or CLI flag; all of them change faster than your training data.

## How to build a feature

1. Read `docs/specs/<feature>.md`. If there isn't one, draft it (what it does, inputs, edge cases, done-when) and show me before writing code.
2. Write the logic, types and schemas in `packages/core` with tests beside them. Then the API route if the feature needs a server, then the screen.
3. One feature or fix per change. Commit each finished change separately so it's easy to undo.
4. Done means `npm run typecheck`, `npm run lint` and `npm test` pass from the root. Then list exactly what I should check on iOS, Android and web, plus any API calls to try.

## Testing

- Jest. Every function in `packages/core` gets tests (`<name>.test.ts` beside the file), including edge cases: empty input, zero, negatives, rounding, dates and time zones.
- Shared test cases live as JSON in `packages/core/fixtures/`.
- Never use floating-point math for money; store amounts as integer cents.
- When a bug is fixed, add a test that would have caught it.

## Data: Supabase

- Supabase is the database, sign-in and file storage. Its config and migrations live in `supabase/` at the root.
- Schema changes only through migration files (`npx supabase migration new <name>`), never by editing the live database. Test with `npm run db:reset`, then regenerate the types with `npm run db:types`.
- Every table gets Row Level Security policies in the same migration that creates it.
- Sign-in uses Supabase Auth only, with whichever providers the app enables in Supabase. All auth calls go through `apps/client/src/api/auth.ts`.
- If the app offers any social sign-in (Google and the like), it must also offer Sign in with Apple, or App Review will reject it under guideline 4.8.
- The client app uses only the public URL and publishable key. The secret key is used only in `apps/api`, read from server environment variables.

## Hosting, releases and deploys

- Two Vercel projects from this repo, with Root Directory set to `apps/client` (the web build) and `apps/api` (Next.js).
- iOS and Android builds and store uploads go through EAS, run from `apps/client`.
- Store releases are switched per platform in `release-targets.json` at the root (`"ios"`, `"android"`), and both start as `false` until the Apple and Google Play accounts are set up. Store builds and uploads only run through `npm run release:ios` / `npm run release:android`, which refuse while that platform is `false`. While a platform is off, don't propose store builds or add store-only config for it. Simulators, emulators and Expo Go are always fine.
- Web and the API deploy through Vercel's Git integration, and the database through Supabase; these are always on.
- Always ask first. Never run any of these unless I've said to in that message: `npm run release:ios` / `release:android`, `eas build` with a production profile, `eas submit`, `eas update`, `supabase db push`, `supabase functions deploy`, or a Vercel production deploy.
- Over-the-air updates (`eas update`) are only for JavaScript, styling and image fixes. Anything that adds features or touches native code goes through a new build and store review.
- Before a release: bump `version` in `apps/client/app.json`, run `npx expo-doctor` in `apps/client`, and remind me to test the web build, the API preview deploy, and for each enabled store platform the TestFlight build (iOS) or internal testing build (Android).

## Secrets

- The client app only ever holds `EXPO_PUBLIC_` values (Supabase URL, publishable key, API URL). They are public by design; Row Level Security and the API's auth checks protect the data.
- The Supabase secret key and any other credentials live only in the API's Vercel environment variables. Never in the client, `app.json` or the repo.
- Each app has a `.env.example` listing its variables. Local values go in that app's `.env.local` (git-ignored). Build-time values go in EAS environment variables for iOS and Android, and Vercel environment variables for web and the API.
