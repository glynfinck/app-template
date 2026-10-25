# App template

One repo for an app on iOS, Android and web, with its own API:

- `apps/client`: Expo (React Native) app for iOS, Android and web
- `apps/api`: Next.js API routes
- `packages/core`: shared logic, types and schemas (`@app/core`)
- `supabase/`: database, sign-in and storage

Rules for AI coding agents are in `AGENTS.md` (root and each app).

## Run it locally

Needs Node 22.13 or later, and Docker for the local database.

1. `npm install`
2. `npm run db:start`. It prints the local Supabase URL, publishable key and secret key.
3. Copy `apps/client/.env.example` to `apps/client/.env.local`, and `apps/api/.env.example` to `apps/api/.env.local`. Fill in the keys from step 2.
4. In two terminals: `npm run dev:api` and `npm run dev:client`. Then press `w` for web, `i` for the iOS Simulator or `a` for the Android emulator.

Check everything with `npm run typecheck`, `npm run lint` and `npm test`.

## Start a new app from this template

1. Create the new repo with GitHub's **Use this template** button.
2. Rename the app:
   - `name` in the root `package.json`
   - in `apps/client/app.json`: `name`, `slug`, `scheme`, `ios.bundleIdentifier` and `android.package` (e.g. `com.yourname.appname`)
   - in `supabase/config.toml`: `project_id`, and the `myapp://` redirect URL to match the new `scheme`
   - leave the `@app/` package scope as it is
3. Fill in "About this app" in `AGENTS.md`.
4. Create the services:
   - a Supabase project, then enable the sign-in providers you want (add Sign in with Apple if you enable any social sign-in)
   - two Vercel projects from this repo, with Root Directory `apps/client` and `apps/api`
   - later, for the stores: an Apple Developer account, a Google Play developer account and an EAS project (`npx eas-cli@latest init` in `apps/client`). Then set `"ios"` and/or `"android"` to `true` in `release-targets.json`. Until then, store releases are switched off and everything else works.
5. Set the same variables as in each `.env.example` in Vercel (client and API) and, once enabled, in EAS (client). Set `ALLOWED_ORIGINS` on the API to the web app's URL.
