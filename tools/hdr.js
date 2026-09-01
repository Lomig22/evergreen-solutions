const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 300, deviceScaleFactor: 2 });
  for (const [u, n] of [['/', 'hdr-fr'], ['/ar/', 'hdr-ar'], ['/solutions/ecofert/', 'hdr-page']]) {
    await page.goto('http://localhost:8123' + u, { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: process.argv[2] + '/' + n + '.png' });
  }
  await page.goto('http://localhost:8123/', { waitUntil: 'networkidle0' });
  await page.click('[data-nav-toggle]'); await sleep(450);
  await page.screenshot({ path: process.argv[2] + '/hdr-open.png' });
  await browser.close(); console.log('ok');
})().catch(e => { console.error(e.message); process.exit(1); });
