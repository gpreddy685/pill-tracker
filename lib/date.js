// Shared date helpers — keeps "what day is it" consistent across endpoints,
// always computed in IST regardless of which timezone the server runs in.

export function dayKey(ms, tz = "Asia/Kolkata") {
  // en-CA gives a sortable YYYY-MM-DD string
  return new Date(Number(ms)).toLocaleDateString("en-CA", { timeZone: tz });
}

export function timeStr(ms, tz = "Asia/Kolkata") {
  return new Date(Number(ms)).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}
