#!/usr/bin/env node
/* Captures d'écran par tranches assemblées (contourne le bug Chrome fullPage + images lazy)
   node tools/shots.js <url> <outPrefix> [width=1440] [height=950] [waitMs=1500] */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [url, out, w = '1440', h = '950', wait = '1500'] = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(+wait);
  // parcours complet pour déclencher le lazy-loading, puis attente du décodage
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => Promise.all(Array.from(document.images).map((img) => img.complete ? null : new Promise((ok) => { img.addEventListener('load', ok); img.addEventListener('error', ok); setTimeout(ok, 4000); }))));
  await sleep(300);
  await page.screenshot({ path: `${out}-fold.png` });
  const H = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
  const offsets = [];
  let n = 0;
  for (let y = 0; ; y += +h) {
    const actual = await page.evaluate((yy) => { window.scrollTo(0, yy); return Math.round(window.scrollY); }, y);
    if (n > 0) await page.evaluate(() => { const el = document.querySelector('.site-header'); if (el) el.style.visibility = 'hidden'; });
    await sleep(160);
    await page.screenshot({ path: `${out}-s${n}.png` });
    offsets.push(actual);
    n++;
    if (actual + +h >= H || n > 40) break;
  }
  fs.writeFileSync(`${out}-meta.json`, JSON.stringify({ width: +w, vh: +h, H, offsets }));
  await browser.close();
  console.log('ok', out, `${n} tranches, H=${H}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
