# Stride Hub

A monorepo for Stride Hub, a personalized fitness companion that brings together Strava activities, curated content, and smart route recommendations.

## Structure

- `apps/mobile` – Expo React Native app (TypeScript) with tabbed navigation for Activities, Feed, Routes, and Settings.
- `apps/backend` – Node.js/Express API (TypeScript) handling Strava OAuth, Strava data, feed aggregation, and route generation.
- `packages/shared` – Shared TypeScript types used across the backend and mobile app.

## Prerequisites

- Node.js 18+
- npm (workspaces enabled)
- Expo CLI (`npm install -g expo-cli`) if running the mobile app locally

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REDIRECT_URI`, `YOUTUBE_API_KEY`, `NEWS_API_KEY`, and optional `MAPBOX_TOKEN`.

3. Prepare the database (SQLite in dev):

   ```bash
   cd apps/backend
   npx prisma migrate dev --name init
   cd ../..
   ```

## Running

- Start the backend API:

  ```bash
  npm run dev:backend
  ```

  The API defaults to `http://localhost:4000` and exposes `/auth/strava/login`, `/auth/strava/callback`, `/strava/activities`, `/feed`, and route generation endpoints.

- Start the mobile app:

  ```bash
  npm run dev:mobile
  ```

  Point the Expo app to the backend URL via `EXPO_PUBLIC_BACKEND_URL` in your app config if needed.

## Notes

- Strava OAuth stores refresh tokens securely via Prisma.
- Feed aggregation uses YouTube Data API and NewsAPI; falls back gracefully if keys are missing.
- Route generation calls Mapbox/OSRM when configured, otherwise a local circular heuristic is used.
- The project is structured for easy Postgres migration later by updating the Prisma datasource.
