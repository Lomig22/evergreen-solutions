const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 780 });
  const res = [];
  for (const p of ['', 'solutions/', 'solutions/evergreen-ecosorb/', 'paulownia/', 'resultats/', 'entreprise/', 'contact/']) {
    await page.goto('http://localhost:8123/de/' + p, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const o = await page.evaluate(() => ({
      html: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      scrollable: (() => { const x = window.scrollX; window.scrollTo(80, 0); const moved = window.scrollX; window.scrollTo(x, 0); return moved; })(),
    }));
    res.push(`/de/${p} → débord ${o.html}px, défilable ${o.scrollable}px`);
  }
  console.log(res.join('\n'));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
