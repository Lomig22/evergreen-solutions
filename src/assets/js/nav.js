/* Header : état « scrollé », menu mobile, méga-menu, sélecteur de langue */
(function () {
  var header = document.querySelector('[data-header]');
  if (!header) return;
  var nav = document.querySelector('[data-nav]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var megas = document.querySelectorAll('[data-mega]');
  var lang = document.querySelector('[data-lang]');

  /* --- fond opaque dès que la page a défilé de 24 px */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- menu mobile */
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-nav-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      var first = nav.querySelector('a, button');
      if (first) first.focus({ preventScroll: true });
    }
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });

  /* --- méga-menu (clic + clavier ; le survol est géré en CSS sur desktop) */
  megas.forEach(function (item) {
    var btn = item.querySelector('button[aria-expanded]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      megas.forEach(function (o) { o.classList.remove('is-open'); o.querySelector('button[aria-expanded]').setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  });

  /* --- fermeture : Échap, clic à l'extérieur, redimensionnement vers desktop */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    megas.forEach(function (o) { o.classList.remove('is-open'); o.querySelector('button[aria-expanded]').setAttribute('aria-expanded', 'false'); });
    if (lang && lang.open) lang.open = false;
    if (nav && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    megas.forEach(function (o) { if (!o.contains(e.target)) { o.classList.remove('is-open'); o.querySelector('button[aria-expanded]').setAttribute('aria-expanded', 'false'); } });
    if (lang && lang.open && !lang.contains(e.target)) lang.open = false;
  });
  var mq = window.matchMedia('(min-width: 900px)');
  mq.addEventListener('change', function (e) { if (e.matches) setNav(false); });
})();
