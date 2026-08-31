const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:8123/', { waitUntil: 'networkidle0' });
  await sleep(4400);
  await page.click('[data-nav-toggle]');
  await sleep(500);
  await page.screenshot({ path: process.argv[2] + '/state-mobilenav.png' });
  await page.evaluate(() => document.querySelector('[data-mega] button').click());
  await sleep(400);
  await page.evaluate(() => document.querySelector('#site-nav').scrollTo(0, 300));
  await sleep(200);
  await page.screenshot({ path: process.argv[2] + '/state-mobilenav-mega.png' });
  await browser.close();
  console.log('ok');
})().catch((e) => { console.error(e.message); process.exit(1); });
