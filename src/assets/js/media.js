/* Vidéos : lecture au clic sur le poster, lecture/pause automatique des boucles selon la visibilité */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-video]').forEach(function (box) {
    var video = box.querySelector('video');
    var btn = box.querySelector('[data-video-play]');
    if (!video) return;
    function play() { box.classList.add('is-playing'); var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    function pause() { video.pause(); box.classList.remove('is-playing'); }
    if (btn) btn.addEventListener('click', function () { if (video.paused) play(); else pause(); });
    if (box.hasAttribute('data-video-auto') && !reduced && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) play(); else pause(); });
      }, { threshold: 0.35 });
      io.observe(box);
    }
  });
})();
