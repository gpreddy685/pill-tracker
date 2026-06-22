# Pill Tracker

A minimal personal web app to track a daily medication dose. Built for one person, one pill, one tap.

**Live:** https://pill-tracker-beta.vercel.app

---

## What it does

- Shows whether you've taken your pill today
- Logs a dose with one tap (protected by a secret key)
- Tracks your streak and shows a 70-day heatmap
- Guards against double-dosing — warns you if you try to log twice
- iOS home screen widget via Scriptable

## Stack

- **Vercel** — serverless functions + static hosting
- **Upstash Redis** — stores last taken timestamp and history
- Vanilla JS frontend, no frameworks

## Deploy your own

**1. Clone and deploy to Vercel**

```bash
git clone https://github.com/gpreddy685/pill-tracker.git
cd pill-tracker
vercel deploy
```

**2. Set environment variables** in Vercel project settings:

| Variable | Description |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis REST token |
| `LOG_SECRET` | Any secret string — used to protect the log endpoint |

Get Redis credentials free at [upstash.com](https://upstash.com).

**3. Access the app**

Open your Vercel URL. The secret you set is embedded in the page — keep the URL private.

## API

| Endpoint | Description |
|---|---|
| `GET /api/status?key=SECRET` | Returns today's status, streak, and history |
| `GET /api/log?key=SECRET` | Logs a dose for today |
| `GET /api/log?key=SECRET&force=1` | Logs a second dose (override) |

## iOS Widget (Scriptable)

Shows taken / not-yet status on your home screen without opening the app.

1. Install [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) (free) from the App Store
2. Create a new script, paste in [`pill-widget.js`](pill-widget.js)
3. Edit the two config lines at the top with your URL and secret
4. Tap ▶ Run to preview, then add a Scriptable small widget to your home screen and point it at this script
