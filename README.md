# Pill Tracker

A minimal personal web app to track a daily medication dose. One tap to log, one glance to check.

---

## Stack

- **Vercel** — serverless functions + hosting
- **Upstash Redis** — stores dose history
- Vanilla JS, no frameworks

---

## Deploy

### 1. Set up Redis

Create a free database at [upstash.com](https://upstash.com). You'll need the REST URL and token from the database dashboard.

### 2. Deploy to Vercel

```bash
git clone https://github.com/gpreddy685/pill-tracker.git
cd pill-tracker
vercel deploy
```

### 3. Add environment variables

In your Vercel project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `UPSTASH_REDIS_REST_URL` | From Upstash dashboard |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash dashboard |
| `LOG_SECRET` | Any random string you choose — this is your password |

Redeploy after adding them.

---

## Using the app

Open your Vercel URL. The page shows whether you've taken your dose today, your streak, and a 70-day heatmap. Tap **I'm taking it now** after your pill.

It warns you if you try to log twice in one day so you don't accidentally double-dose.

---

## NFC tag (tap to log instantly)

Write this URL to an NFC tag and stick it on your pill bottle:

```
https://your-app.vercel.app/api/log?key=YOUR_SECRET
```

Bring your iPhone near the tag → dose logged → redirects to the app. Done in one tap, no opening the app manually.

**How to write to an NFC tag:**
- Use the [NFC Tools](https://apps.apple.com/app/nfc-tools/id1252962749) app (free)
- Add a record → URL → paste your log URL → write

---

## iOS Home Screen Widget

Shows your status right on the home screen without opening anything.

**Setup:**

1. Install [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) from the App Store (free)

2. Open Scriptable → tap **+** (top right) → paste the contents of [`pill-widget.js`](pill-widget.js)

3. Edit the two lines at the top:
   ```js
   const API_URL = "https://your-app.vercel.app";
   const SECRET  = "your-secret-here";
   ```

4. Tap **▶** at the bottom to preview — you should see the widget

5. Go to your iPhone home screen → long press → tap **+** → search **Scriptable** → pick **Small** → tap Add Widget

6. Long press the widget → **Edit Widget** → set Script to your script name

The widget shows green **✓ Taken** or **Not yet** and refreshes every 15 minutes. Tap it to open the full app.

---

## API

| Endpoint | Description |
|---|---|
| `GET /api/status?key=SECRET` | Today's status, streak, history |
| `GET /api/log?key=SECRET` | Log today's dose |
| `GET /api/log?key=SECRET&force=1` | Log a second dose (override) |

All endpoints return JSON. The `/api/log` endpoint also redirects to `/` when called from a browser (e.g. via NFC tap).
