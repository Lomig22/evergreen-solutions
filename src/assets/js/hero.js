/* Hero : comparateur terre sèche / champ irrigué — séquence d'ouverture, glisser, clavier */
(function () {
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var stage = hero.querySelector('[data-compare-stage]');
  var handle = hero.querySelector('[data-compare-handle]');
  var rtl = document.documentElement.dir === 'rtl';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var valueTpl = handle.getAttribute('data-valuetext') || '{n} %';
  /* séquence raccourcie sur mobile : le titre doit arriver vite */
  var small = window.matchMedia('(max-width: 899px)').matches;
  var REST = small ? 44 : 50;
  var SWEEP = small ? 1600 : 3000;
  var DELAY = small ? 150 : 350;
  var TITLE_AT = small ? 800 : 2600;
  var current = 100;
  var raf = null;

  function setSplit(pct, silent) {
    current = Math.max(0, Math.min(100, pct));
    hero.style.setProperty('--split', current + '%');
    if (!silent) {
      var n = Math.round(current);
      handle.setAttribute('aria-valuenow', String(n));
      handle.setAttribute('aria-valuetext', valueTpl.replace('{n}', String(n)));
    }
  }
  function animateTo(target, duration, done) {
    if (raf) cancelAnimationFrame(raf);
    var from = current, t0 = null;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / duration);
      setSplit(from + (target - from) * ease(p), p < 1);
      if (p < 1) raf = requestAnimationFrame(step); else { raf = null; if (done) done(); }
    }
    raf = requestAnimationFrame(step);
  }

  /* --- séquence d'ouverture, une fois par session */
  var played = false;
  try { played = sessionStorage.getItem('gs-hero') === '1'; } catch (e) {}
  function finish() {
    hero.classList.add('is-titled');
    setTimeout(function () { hero.classList.add('is-ready'); }, reduced ? 0 : 700);
  }
  if (reduced || played) {
    hero.classList.add('is-static');
    setSplit(REST);
    finish();
  } else {
    setSplit(100);
    setTimeout(function () {
      animateTo(REST, SWEEP, function () { hero.classList.add('is-static'); });
      setTimeout(finish, TITLE_AT);
    }, DELAY);
    try { sessionStorage.setItem('gs-hero', '1'); } catch (e) {}
  }

  /* --- glisser (souris, doigt, stylet) — coupe verticale sur desktop, horizontale sur mobile */
  if (small) handle.setAttribute('aria-orientation', 'vertical');
  function pctFromEvent(e) {
    var r = stage.getBoundingClientRect();
    if (small) return ((e.clientY - r.top) / r.height) * 100;
    var x = (e.clientX - r.left) / r.width;
    if (rtl) x = 1 - x;
    return x * 100;
  }
  var dragging = false;
  function start(e) {
    if (e.button !== undefined && e.button !== 0) return;
    /* sur mobile, seul le curseur se saisit : le doigt ailleurs fait défiler la page */
    if (small && !handle.contains(e.target)) return;
    dragging = true;
    hero.classList.add('is-dragging', 'is-static');
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    hero.classList.add('is-titled', 'is-ready');
    setSplit(pctFromEvent(e));
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  }
  function move(e) { if (dragging) setSplit(pctFromEvent(e)); }
  function end() { dragging = false; hero.classList.remove('is-dragging'); }
  stage.addEventListener('pointerdown', start);
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  /* --- clavier sur la poignée */
  handle.addEventListener('keydown', function (e) {
    var stepSize = e.shiftKey ? 10 : 2, next = null;
    switch (e.key) {
      case 'ArrowRight': next = current + (rtl ? -stepSize : stepSize); break;
      case 'ArrowLeft': next = current - (rtl ? -stepSize : stepSize); break;
      case 'ArrowUp': next = current - stepSize; break;
      case 'ArrowDown': next = current + stepSize; break;
      case 'Home': next = 0; break;
      case 'End': next = 100; break;
      case 'PageUp': next = current + 10; break;
      case 'PageDown': next = current - 10; break;
      default: return;
    }
    e.preventDefault();
    hero.classList.add('is-static', 'is-titled', 'is-ready');
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    setSplit(next);
  });
})();
