const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const l of ['es', 'pt', 'it']) {
    await page.goto(`http://localhost:8123/${l}/`, { waitUntil: 'networkidle0' });
    await sleep(4300);
    await page.screenshot({ path: `${process.argv[2]}/lang-${l}.png` });
  }
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8123/pt/solutions/ecofert/', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: `${process.argv[2]}/lang-pt-mobile.png` });
  await page.goto('http://localhost:8123/it/contact/', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: `${process.argv[2]}/lang-it-contact.png` });
  await browser.close(); console.log('ok');
})().catch(e => { console.error(e.message); process.exit(1); });
