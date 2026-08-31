const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8123/', { waitUntil: 'networkidle0' });
  await sleep(350);
  await page.screenshot({ path: process.argv[2] + '/hm-early.png' });
  await sleep(700);
  await page.screenshot({ path: process.argv[2] + '/hm-mid.png' });
  await sleep(1800);
  await page.screenshot({ path: process.argv[2] + '/hm-rest.png' });
  await page.evaluate(() => { document.querySelector('[data-hero]').style.setProperty('--split', '26%'); });
  await sleep(250);
  await page.screenshot({ path: process.argv[2] + '/hm-26.png' });
  await page.evaluate(() => { document.querySelector('[data-hero]').style.setProperty('--split', '74%'); });
  await sleep(250);
  await page.screenshot({ path: process.argv[2] + '/hm-74.png' });
  // petit écran étroit
  await page.setViewport({ width: 360, height: 700, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8123/', { waitUntil: 'networkidle0' });
  await sleep(2600);
  await page.screenshot({ path: process.argv[2] + '/hm-360.png' });
  await browser.close();
  console.log('ok');
})().catch((e) => { console.error(e.message); process.exit(1); });
