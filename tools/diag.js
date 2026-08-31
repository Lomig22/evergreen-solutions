const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  page.on('requestfailed', r => console.log('REQ FAILED:', r.url(), r.failure() && r.failure().errorText));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.type(), m.text()); });
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  await page.goto('http://localhost:8123/resultats/', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 1200)); window.scrollTo(0,0); });
  await new Promise(r => setTimeout(r, 1500));
  const imgs = await page.evaluate(() => Array.from(document.images).map(i => ({
    src: (i.currentSrc || i.src).replace(location.origin,''), complete: i.complete, nw: i.naturalWidth,
    w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height, loading: i.loading,
    display: getComputedStyle(i).display, vis: getComputedStyle(i).visibility, op: getComputedStyle(i).opacity
  })));
  console.table ? imgs.forEach(x => console.log(JSON.stringify(x))) : null;
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
