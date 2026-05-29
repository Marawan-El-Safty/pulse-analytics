import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = "docs";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function cap(theme) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800); // let skeleton resolve + charts draw
  await page.screenshot({ path: `${OUT}/overview-${theme}.png` });
  await page.screenshot({ path: `${OUT}/overview-${theme}-full.png`, fullPage: true });
  console.log(`✓ overview ${theme}`);

  await page.goto(`${BASE}/customers`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/customers-${theme}.png` });
  console.log(`✓ customers ${theme}`);
  await ctx.close();
}

await cap("dark");
await cap("light");
await browser.close();
console.log("Done.");
