# Simon's Dashboard

A mobile-first personal dashboard for:
- Current-location weather
- Today's Todoist tasks
- Current world news headlines

## Run locally

1. Install Node.js 20+.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Todoist API token.
5. Run `npm run dev`.
6. Open the local address shown by Next.js.

## Deploy

This project is designed for Vercel.

1. Create a Vercel project from this folder/repository.
2. Add `TODOIST_API_TOKEN` as a Vercel Environment Variable.
3. Deploy.
4. Open the resulting URL on the Samsung Fold.
5. In Chrome, use the menu and choose "Add to home screen".

## Notes

- Weather uses the browser's location permission and Open-Meteo.
- Todoist is accessed server-side so the token is not exposed to the browser.
- News is pulled server-side from RSS feeds.
