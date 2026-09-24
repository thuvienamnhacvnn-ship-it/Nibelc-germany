// Kiểm tra hiệu ứng rê chuột: đo transform của lớp nền khi chuột ở mép trái và mép phải.
import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1672, height: 941 } });
await p.goto("http://localhost:3140/", { waitUntil: "networkidle" });
const read = () => p.evaluate(() => {
  const imgs = [...document.querySelectorAll("section img")];
  const bg = imgs.find((i) => i.src.includes("b2"))?.parentElement;
  const fg = imgs.find((i) => i.src.includes("b1"))?.parentElement;
  return { bg: bg?.style.transform ?? "", fg: fg?.style.transform ?? "" };
});
await p.mouse.move(50, 450); await p.waitForTimeout(1500); const left = await read();
await p.mouse.move(1620, 450); await p.waitForTimeout(1500); const right = await read();
console.log("chuot TRAI :", JSON.stringify(left));
console.log("chuot PHAI :", JSON.stringify(right));
await b.close();
