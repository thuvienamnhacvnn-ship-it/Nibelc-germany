/**
 * Visual regression theo DESIGN LOCK.
 * Chụp route ở viewport 1672×941, so với ảnh mẫu bằng pixelmatch, ghi:
 *   artifacts/visual-regression/<name>.png        ảnh chụp thực tế
 *   artifacts/visual-regression/<name>.diff.png   ảnh khác biệt
 *   artifacts/visual-regression/<name>.side.png   ghép mẫu | thực tế
 *
 * Dùng: node scripts/visual.mjs home / 01-homepage
 */
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const [name = "home", route = "/", ref = "01-homepage"] = process.argv.slice(2);
const BASE = process.env.BASE_URL ?? "http://localhost:3140";
const KIT = "E:/Works/itw/Nibelc DE/NIBELC_Web_Full_Visual_Kit_v3/screens";
const OUT = "artifacts/visual-regression";
mkdirSync(OUT, { recursive: true });

const W = 1672;
const H = 941;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(BASE + route, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const shotPath = `${OUT}/${name}.png`;
await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

const a = PNG.sync.read(readFileSync(`${KIT}/${ref}.png`));
const b = PNG.sync.read(readFileSync(shotPath));
const diff = new PNG({ width: W, height: H });
const bad = pixelmatch(a.data, b.data, diff.data, W, H, { threshold: 0.2 });
writeFileSync(`${OUT}/${name}.diff.png`, PNG.sync.write(diff));

// ghép cạnh nhau: mẫu bên trái, thực tế bên phải
const side = new PNG({ width: W * 2, height: H });
PNG.bitblt(a, side, 0, 0, W, H, 0, 0);
PNG.bitblt(b, side, 0, 0, W, H, W, 0);
writeFileSync(`${OUT}/${name}.side.png`, PNG.sync.write(side));

const pct = ((bad / (W * H)) * 100).toFixed(1);
console.log(`${name}: ${bad} px khác (${pct}%) — ${OUT}/${name}.side.png`);
