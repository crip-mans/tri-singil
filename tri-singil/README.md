# Tri-Singil

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Tech stack

- React 18 + Vite
- Tailwind CSS
- React Router
- Supabase (`@supabase/supabase-js`)
- Leaflet / React Leaflet + Turf (mapping utilities)

## Project structure

```
src/
  components/
  hooks/
  lib/
  pages/
```

## Deploying to Vercel

### 1. Set up the Supabase project first

Before the first deploy, run the schema against a real Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in the Supabase dashboard.
3. Run `supabase/migrations/001_init.sql` to create the `zones`, `fare_matrix`,
   and `fare_modifiers` tables.
4. Run `supabase/seed.sql` to load placeholder zones/fares (optional, but
   useful for a working demo before you have real zone data).
5. Copy the project's URL and anon/public key from
   **Project Settings → API** — you'll need these in step 3 below.

### 2. Connect the repo to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo (Vercel deploys from
   a connected Git repo).
2. In the [Vercel dashboard](https://vercel.com/new), click **Add New →
   Project** and import that repo.
3. Vercel auto-detects this as a Vite project — the build command
   (`npm run build`) and output directory (`dist`) are correct out of the
   box and are also pinned explicitly in `vercel.json`, so no manual
   framework configuration is needed.

### 3. Set environment variables in Vercel

In **Project Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Add these for all environments you plan to use (Production, Preview,
Development). Redeploy after adding them if the project already built once
without them — Vite bakes env vars in at build time.

If these are missing, the app shows a clear "Tri-Singil isn't configured
yet" screen instead of a blank page (see `src/components/ConfigErrorScreen.jsx`).

### 4. Deploy

Click **Deploy**. Vercel will build and host the app; `vercel.json` handles
SPA routing (all paths rewrite to `index.html`) so client-side routes work
on refresh and direct links.
