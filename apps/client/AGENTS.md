This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## This app (apps/client)

The rules above are Expo's template. These are specific to this project; the root AGENTS.md has the project-wide rules.

- Expo app for iOS, Android and web. Shared logic, types and schemas come from `@app/core`; never duplicate them here.
- `src/app/`: screens and layouts only. No calculations, data shaping or network calls inline.
- `src/api/`: every network call.
  - `supabase.ts`: the Supabase client (publishable key only); `storage.ts` / `storage.web.ts` keep the session on each platform.
  - `auth.ts`: all sign-in and sign-out. Add social providers here per app.
  - `http.ts`: `apiFetch` for calls to `apps/api`. It sends the user's token and validates responses with a schema from `@app/core`. Add one small module per resource, like `me.ts`.
- `src/hooks/`: connect `@app/core` and `src/api/` to screens (e.g. `use-session.ts`). `src/components/`: reusable UI pieces.
- Shared code by default. Use platform files (`.ios.tsx`, `.android.tsx`, `.web.tsx`) or `Platform.OS` only where behaviour truly differs.
- Use `expo-glass-effect` or `@expo/ui` for Liquid Glass and `expo-widgets` for widgets and Live Activities. These are iOS-only: always provide a clean fallback (never a crash or blank space) on Android, web, older iOS, and when Reduce Transparency is on.
- Follow each platform's conventions: Apple's look on iOS (native tabs, SF Symbols via `expo-symbols`), Material on Android, and on web a responsive layout that works with mouse, keyboard and wide screens. Light and dark mode everywhere.
- Web is a single-page build for Vercel: keep `"web": { "output": "single" }` in app.json. `vercel.json` builds it with `expo export -p web` into `dist/`.
- When a change adds a native module or config plugin, say clearly that a new development build is needed.
- Environment: copy `.env.example` to `.env.local`. Only `EXPO_PUBLIC_` values go here.
