import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function handler(req, res) {
  const filePath = path.join(__dirname, "..", "template.html");
  let html = fs.readFileSync(filePath, "utf8");

  html = html
    .replace("__API_BASE__", "/api")
    .replace("__SECRET__", process.env.LOG_SECRET || "");

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
