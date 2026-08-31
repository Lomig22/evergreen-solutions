const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  // DE accueil desktop (après intro)
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:8123/de/', { waitUntil: 'networkidle0' });
  await sleep(4400);
  await page.screenshot({ path: process.argv[2] + '/de-home.png' });
  // DE mobile étroit : le pire cas pour les mots longs
  await page.setViewport({ width: 360, height: 780, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8123/de/', { waitUntil: 'networkidle0' });
  await sleep(2400);
  await page.screenshot({ path: process.argv[2] + '/de-mobile.png' });
  // débordement horizontal ? largeur de document vs viewport sur les pages DE
  const overflow = [];
  for (const p of ['', 'solutions/', 'solutions/evergreen-ecosorb/', 'paulownia/', 'resultats/', 'entreprise/', 'contact/']) {
    await page.goto('http://localhost:8123/de/' + p, { waitUntil: 'networkidle0' });
    const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (o > 1) overflow.push(p + ' → +' + o + 'px');
  }
  console.log('débordements DE 360px :', overflow.length ? overflow.join(' | ') : 'aucun');
  // DE page produit desktop
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8123/de/solutions/evergreen-ecosorb/', { waitUntil: 'networkidle0' });
  await sleep(1200);
  await page.screenshot({ path: process.argv[2] + '/de-product.png' });
  // EN accueil fold
  await page.goto('http://localhost:8123/en/', { waitUntil: 'networkidle0' });
  await sleep(4400);
  await page.screenshot({ path: process.argv[2] + '/en-home.png' });
  await browser.close();
  console.log('ok');
})().catch((e) => { console.error(e.message); process.exit(1); });
