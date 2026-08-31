/* Schéma du système : la ligne se trace quand la section arrive à l'écran (une fois) ; marquee : duplication des logos */
(function () {
  var sys = document.querySelector('[data-system]');
  if (sys && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { sys.classList.add('is-inview'); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(sys);
  } else if (sys) { sys.classList.add('is-inview'); }

  document.querySelectorAll('[data-marquee]').forEach(function (m) {
    var track = m.querySelector('.marquee__track');
    if (!track || track.children.length === 0) return;
    var clones = Array.prototype.map.call(track.children, function (li) { var c = li.cloneNode(true); c.classList.add('is-clone'); c.setAttribute('aria-hidden', 'true'); return c; });
    clones.forEach(function (c) { track.appendChild(c); });
  });
})();
