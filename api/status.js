import { Redis } from "@upstash/redis";
import { dayKey, timeStr } from "../lib/date.js";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY_LAST = "levipil:last_taken";
const KEY_HISTORY = "levipil:history";
const DAY_MS = 86400000;

export default async function handler(req, res) {
  if (req.query.key !== process.env.LOG_SECRET) {
    return res.status(403).json({ status: "forbidden", message: "Invalid key." });
  }

  const now = Date.now();
  const last = await redis.get(KEY_LAST);
  const rawHistory = await redis.lrange(KEY_HISTORY, 0, -1);
  const history = (rawHistory || []).map(Number).sort((a, b) => b - a); // most recent first

  const takenToday = last ? dayKey(last) === dayKey(now) : false;

  // streak: consecutive IST days with a dose, counting back from today
  // (or from yesterday, if today's dose just hasn't happened yet)
  const daysWithDose = new Set(history.map((ts) => dayKey(ts)));
  let streak = 0;
  let cursor = now;
  if (!daysWithDose.has(dayKey(cursor))) cursor -= DAY_MS;
  while (daysWithDose.has(dayKey(cursor))) {
    streak++;
    cursor -= DAY_MS;
  }

  res.status(200).json({
    takenToday,
    lastTaken: last ? Number(last) : null,
    lastTakenLabel: last ? timeStr(last) : null,
    streak,
    history, // array of ms timestamps, most recent first
  });
}
