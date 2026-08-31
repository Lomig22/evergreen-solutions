const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8123/', { waitUntil: 'networkidle0' });
  await sleep(2600);
  await page.screenshot({ path: process.argv[2] + '/hm2-rest.png' });
  const p2 = await browser.newPage();
  await p2.setViewport({ width: 360, height: 700, deviceScaleFactor: 2 });
  await p2.setJavaScriptEnabled(false);
  await p2.goto('http://localhost:8123/', { waitUntil: 'networkidle2' });
  await sleep(600);
  await p2.screenshot({ path: process.argv[2] + '/hm2-nojs360.png' });
  await browser.close();
  console.log('ok');
})().catch((e) => { console.error(e.message); process.exit(1); });
