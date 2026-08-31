/* Captures des états interactifs */
const puppeteer = require('puppeteer-core');
const S = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  // 1. méga-menu desktop
  let page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:8123/solutions/', { waitUntil: 'networkidle0' });
  await page.click('[data-mega] button');
  await sleep(500);
  await page.screenshot({ path: `${S}/state-mega.png` });
  // 2. menu mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:8123/', { waitUntil: 'networkidle0' });
  await sleep(4400);
  await page.click('[data-nav-toggle]');
  await sleep(500);
  await page.screenshot({ path: `${S}/state-mobilenav.png` });
  await page.evaluate(() => document.querySelector('[data-mega] button').click());
  await sleep(400);
  await page.screenshot({ path: `${S}/state-mobilenav-mega.png` });
  // 3. formulaire étape 2 + erreurs étape 1
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('http://localhost:8123/contact/', { waitUntil: 'networkidle0' });
  await page.click('[data-form-next]');
  await sleep(300);
  await page.screenshot({ path: `${S}/state-form-errors.png` });
  await page.type('#f-culture', 'Oliviers');
  await page.type('#f-pays', 'Tunisie');
  await page.click('input[name="probleme"][value="eau"]');
  await page.click('[data-form-next]');
  await sleep(400);
  await page.screenshot({ path: `${S}/state-form-step2.png` });
  // 4. FAQ ouverte + onglet rendements
  await page.goto('http://localhost:8123/solutions/ecofert/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => { document.querySelectorAll('[data-yields-tab]')[1].click(); });
  await page.evaluate(() => { const d = document.querySelector('.faq__item'); d.open = true; d.scrollIntoView({ block: 'center' }); });
  await sleep(400);
  await page.screenshot({ path: `${S}/state-faq-tab.png` });
  // 5. sans JavaScript
  page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:8123/', { waitUntil: 'networkidle2' });
  await sleep(800);
  await page.screenshot({ path: `${S}/state-nojs.png` });
  await browser.close();
  console.log('états capturés');
})().catch((e) => { console.error(e.message); process.exit(1); });
