// Chụp một route ở bề ngang tuỳ ý: node scripts/shot.mjs <route> <width> <out>
import { chromium } from "@playwright/test";
const [route = "/", w = "1920", out = "artifacts/shot.png"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: +w, height: Math.round(+w * 941 / 1672) } });
await p.goto("http://localhost:3140" + route, { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.screenshot({ path: out });
await b.close();
console.log("da chup", out);
