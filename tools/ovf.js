const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 780 });
  await page.goto('http://localhost:8123/de/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  const culprits = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 || r.left < -1) {
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || '';
        out.push(`${el.tagName.toLowerCase()}.${String(cls).split(' ')[0]} L=${Math.round(r.left)} R=${Math.round(r.right)} texte="${(el.textContent||'').trim().slice(0,40)}"`);
      }
    });
    return out.slice(0, 20);
  });
  console.log(culprits.join('\n') || 'rien');
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
