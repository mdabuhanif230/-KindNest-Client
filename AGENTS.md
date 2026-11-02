# KindNest

Two independent Node apps sharing one MongoDB database and one JWT secret. No monorepo tooling, no root manifest, no git repo (yet). This dir is the Next.js client; the Express API lives in `../server`.

## Commands (Windows — PowerShell blocks `npm`, always use `npm.cmd`)

- Client dev: `npm.cmd run dev` → Next.js on :3000
- Client verify: `npm.cmd run build` → the only check that exists (no lint/test/typecheck scripts, no ESLint/Prettier/TS config anywhere)
- Server dev: `npm.cmd run dev` (node --watch), prod: `npm.cmd start` → Express on :5000

Plain JavaScript only: `jsconfig.json` (no tsconfig), `@/*` alias → `./src/*`.

## Layout

- `src/app` — App Router pages + API routes; `src/components`; `src/lib`
- Server is one CommonJS file: `../server/index.js` (Express + raw mongodb driver)
- Tailwind v4 + daisyUI v5 configured inside `src/app/globals.css` via `@plugin` — there is no `tailwind.config.js`. Both themes are defined inline as CSS custom props and toggled with `data-theme` + `localStorage`.

## Auth flow (easy to break)

1. BetterAuth (`src/lib/auth.js`, MongoDB adapter) handles login; handler at `src/app/api/auth/[...all]/route.js`.
2. `src/app/api/token/route.js` signs a JWT `{ email }` with `JWT_SECRET` once a BetterAuth session exists.
3. `src/lib/api.js` fetches that token and sends `Authorization: Bearer` to the Express API.
4. Express `verify` middleware (`../server/index.js`) validates the same `JWT_SECRET` and sets `req.email`.

⇒ `JWT_SECRET` must be identical in `client/.env.local` and the server env, or every protected API call 403s.

## Env files

- Client: `.env.local` (auto-loaded by Next). `NEXT_PUBLIC_API_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (Google login optional; email/password works without them).
- Server: `dotenv.config()` loads `.env` only — **not** `.env.local`. Needs `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (comma-separated CORS allowlist).
- Both sides hardcode db name `kindnest`: BetterAuth collections come from the adapter; the server owns `events` and `joins`.

## Gotchas

- After moving/renaming `app` or `src` dirs: kill the dev server, delete `.next`, restart. Stale chunks surface as `Cannot find module './887.js'` runtime errors.
- **Never run `npm run build` while `npm run dev` is running** — both use `.next`, so the build corrupts the dev server and every route returns 500. Kill dev first, build, then restart dev (and delete `.next` if routes stay broken).
- `src/app/events/page.js` uses `useSearchParams()`; it must stay wrapped in `<Suspense>` or `next build` fails (`missing-suspense-with-csr-bailout`).
- `next build` evaluates BetterAuth at build time (MongoClient is constructed at import), so build needs `MONGODB_URI`/`JWT_SECRET` set — a dummy `mongodb://127.0.0.1:27017/kindnest` is enough.
- Event validation is duplicated by design: client `src/components/EventForm.js` and server `clean()` in `../server/index.js`. Change both together.
- Dates are compared as `YYYY-MM-DD` strings: listing filters `date >= today()` (today included), but creation and join both require a *strictly future* date.
- All pages are client components; `src/components/Guard.js` is the auth gate for protected pages (`/create`, `/manage`, `/joined`).
- Deploy: server has `vercel.json` (single-function build); client is standard Next. README still has placeholder live URLs.
