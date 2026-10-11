// Renders public/icons/icon.svg to the PNG sizes iOS, Android, and Chrome need.
// Run: node scripts/make-icons.mjs  (needs: npx playwright install chromium)
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";

const svg = await readFile(new URL("../public/icons/icon.svg", import.meta.url), "utf8");
const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/rx="10"/, 'rx="0"');
const jobs = [
  { file: "icon-192.png", size: 192, pad: 0, round: true },
  { file: "icon-512.png", size: 512, pad: 0, round: true },
  { file: "apple-touch-icon.png", size: 180, pad: 0, round: false },
  { file: "icon-maskable-512.png", size: 512, pad: 0.12, round: false },
];
const browser = await chromium.launch();
const page = await browser.newPage();
for (const j of jobs) {
  const p = j.pad * 48;
  const body = j.round ? svg : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-p} ${-p} ${48 + 2 * p} ${48 + 2 * p}"><rect x="${-p}" y="${-p}" width="${48 + 2 * p}" height="${48 + 2 * p}" fill="#0b6b66"/>${inner}</svg>`;
  await page.setViewportSize({ width: j.size, height: j.size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${body.replace("<svg ", `<svg width="${j.size}" height="${j.size}" `)}</body></html>`);
  await page.screenshot({ path: new URL(`../public/icons/${j.file}`, import.meta.url).pathname.replace(/^\/(\w:)/, "$1"), omitBackground: true });
  console.log("wrote", j.file);
}
await browser.close();
