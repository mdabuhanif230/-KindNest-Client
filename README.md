# KindNest Client

KindNest is a community events platform for organizing and joining local service activities, including cleanups, donation drives, and plantation events.

- **Live application:** https://kindnest-client.vercel.app
- **API:** https://kindnest-server.vercel.app
- **Client repository:** https://github.com/mdabuhanif230/KindNest-Client
- **Server repository:** https://github.com/mdabuhanif230/KindNest-Server

## Features

- Browse upcoming community events and view event details.
- Create, edit, and manage events, with ownership checks for changes.
- Join events and see your joined events sorted by date.
- Register and sign in with email and password, or use Google sign-in.
- Update your profile and profile picture.
- Switch between light and dark themes.
- Responsive layouts, form validation, loading states, and toast notifications.
- Protected API requests using JWTs.

## Tech stack

- Next.js 15 App Router, React 19, and JavaScript
- Better Auth for authentication
- MongoDB for authentication and event data
- Tailwind CSS and DaisyUI

## Run locally

Requirements: Node.js and access to a MongoDB database.

1. Install the client dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the client directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   BETTER_AUTH_SECRET=replace-with-a-long-random-secret
   BETTER_AUTH_URL=http://localhost:3000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=use-the-same-long-secret-as-the-server
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```

   Google sign-in requires valid Google OAuth credentials. Use the same `JWT_SECRET` in the client and server.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |

## Related project

The Express API source code and its setup instructions are in the [KindNest Server repository](https://github.com/mdabuhanif230/KindNest-Server).
