/* Compteurs : montent une seule fois à l'entrée dans l'écran (valeur finale déjà dans le HTML) */
(function () {
  var nodes = document.querySelectorAll('[data-counter]');
  if (!nodes.length || !('IntersectionObserver' in window)) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  var lang = document.documentElement.lang || 'fr';
  var fmt = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });

  function run(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200, t0 = null;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / duration);
      el.textContent = prefix + fmt.format(Math.round(target * ease(p))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      run(en.target);
    });
  }, { threshold: 0.4 });
  nodes.forEach(function (n) { io.observe(n); });
})();
