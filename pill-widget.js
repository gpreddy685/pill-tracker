const API_URL = "https://your-app.vercel.app";
const SECRET  = "your-secret-here";

const C = {
  bg:     new Color("#FAF8F4"),
  goodBg: new Color("#E8F6EF"),
  ink:    new Color("#1B1F1D"),
  good:   new Color("#0E6B4C"),
  muted:  new Color("#7A8079"),
  accent: new Color("#3D6B5C"),
};

async function fetchStatus() {
  const req = new Request(`${API_URL}/api/status?key=${encodeURIComponent(SECRET)}`);
  req.timeoutInterval = 10;
  return req.loadJSON();
}

function buildWidget(data) {
  const taken = data?.takenToday ?? false;

  const w = new ListWidget();
  w.backgroundColor = taken ? C.goodBg : C.bg;
  w.setPadding(14, 16, 14, 16);
  w.url = API_URL;

  const label = w.addText("Levipil · 250 mg");
  label.font = Font.boldSystemFont(10);
  label.textColor = C.muted;

  w.addSpacer(10);

  const statusText = w.addText(taken ? "✓  Taken" : "Not yet");
  statusText.font = Font.boldSystemFont(28);
  statusText.textColor = taken ? C.good : C.ink;
  statusText.minimumScaleFactor = 0.7;

  w.addSpacer(4);

  const sub = w.addText(
    taken ? `Today at ${data.lastTakenLabel}` : "No dose logged yet today"
  );
  sub.font = Font.systemFont(12);
  sub.textColor = C.muted;

  if (data?.streak >= 2) {
    w.addSpacer(10);
    const streak = w.addText(`🔥 ${data.streak}-day streak`);
    streak.font = Font.boldSystemFont(11);
    streak.textColor = C.accent;
  }

  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);
  return w;
}

function errorWidget(message) {
  const w = new ListWidget();
  w.backgroundColor = C.bg;
  w.setPadding(14, 16, 14, 16);
  const t = w.addText("⚠ " + message);
  t.font = Font.systemFont(12);
  t.textColor = C.muted;
  t.lineLimit = 3;
  return w;
}

let widget;
try {
  const data = await fetchStatus();
  widget = buildWidget(data);
} catch (e) {
  widget = errorWidget("Can't reach server. Check your URL and secret.");
}

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentSmall();
}
Script.complete();
