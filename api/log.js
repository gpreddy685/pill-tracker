import { Redis } from "@upstash/redis";
import { dayKey, timeStr } from "../lib/date.js";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY_LAST = "levipil:last_taken";
const KEY_HISTORY = "levipil:history";
const HISTORY_KEEP = 400; // ~13 months of daily entries, plenty for a heatmap

export default async function handler(req, res) {
  if (req.query.key !== process.env.LOG_SECRET) {
    return res.status(403).json({ status: "forbidden", message: "Invalid key." });
  }

  const now = Date.now();
  const force = req.query.force === "1"; // explicit "I really do need another dose"
  const last = await redis.get(KEY_LAST);

  if (!force && last && dayKey(last) === dayKey(now)) {
    const mins = Math.round((now - Number(last)) / 60000);
    return res.status(200).json({
      status: "already_taken",
      message: `Already logged today at ${timeStr(last)} (${mins} min ago). Skipping — don't take another.`,
      lastTaken: Number(last),
      lastTakenLabel: timeStr(last),
    });
  }

  await redis.set(KEY_LAST, now);
  await redis.lpush(KEY_HISTORY, now);
  await redis.ltrim(KEY_HISTORY, 0, HISTORY_KEEP - 1);

  const wantsBrowser = (req.headers.accept || "").includes("text/html");
  if (wantsBrowser) return res.redirect(302, "/");

  return res.status(200).json({
    status: "logged",
    message: `Logged at ${timeStr(now)}. Nice.`,
    lastTaken: now,
    lastTakenLabel: timeStr(now),
  });
}
