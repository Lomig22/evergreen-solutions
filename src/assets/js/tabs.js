/* Onglets accessibles (rendements) : clic + flèches, roving tabindex */
(function () {
  document.querySelectorAll('[data-yields]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-yields-tab]'));
    if (!tabs.length) return;
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0]); return; }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1]); return; }
        if (!dir) return;
        e.preventDefault();
        if (document.documentElement.dir === 'rtl') dir = -dir;
        select(tabs[(i + dir + tabs.length) % tabs.length]);
      });
    });
  });
})();
