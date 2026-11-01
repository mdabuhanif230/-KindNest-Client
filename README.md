# KindNest – Social Development Events Platform

Live site: https://your-client-url.vercel.app  |  API: https://your-server-url.vercel.app

## Features
- Create, update and delete community service events (Cleanup, Plantation, Donation and more)
- Upcoming-only listing: events whose date has passed are hidden automatically
- One-click Join Event with duplicate protection, plus a Joined Events page sorted by date
- Search & filter events by title and event type
- Email/password and GitHub login (BetterAuth + MongoDB) with JWT-protected API routes
- Light/dark theme toggle, loading skeletons, toast feedback and full form validation

## Project structure
```
kindnest/
├── client/          # Next.js 15 (App Router)
│   └── src/
│       ├── app/                 # pages + API routes
│       │   ├── api/auth/[...all]  # BetterAuth handler
│       │   ├── api/token/         # issues JWT for the Express API
│       │   ├── events/            # list + detail pages
│       │   └── create|login|register|manage|joined/
│       ├── components/          # Navbar, Footer, Guard, EventCard/Grid/Form
│       └── lib/                 # api.js, auth.js, auth-client.js
└── server/          # Express API (JWT-protected CRUD + joins)
    └── index.js
```

## Setup
1. `cd server && cp .env.example .env && npm i && npm run dev`
2. `cd client && cp .env.example .env.local && npm i && npm run dev`
3. Use the same `JWT_SECRET` in both. (A `.env.local` with generated secrets already exists — just fill in `MONGODB_URI`.)
4. Optional: set `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` in `client/.env.local` to enable GitHub login.

## Scripts
| Where   | Command        | What it does            |
|---------|----------------|-------------------------|
| client  | `npm run dev`  | Next.js on :3000        |
| client  | `npm run build`| Production build        |
| server  | `npm run dev`  | Express API on :5000    |
| server  | `npm start`    | Production start        |
