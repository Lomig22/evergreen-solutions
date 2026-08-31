/* Formulaire « Présenter mon projet » : 2 étapes, validation, envoi Formspree (placeholder documenté dans le README) */
(function () {
  var form = document.querySelector('[data-form]');
  if (!form) return;
  var steps = form.querySelectorAll('[data-step]');
  var progress = form.querySelectorAll('[data-progress]');
  var nextBtn = form.querySelector('[data-form-next]');
  var backBtn = form.querySelector('[data-form-back]');
  var success = form.querySelector('[data-form-success]');

  function fieldBox(el) { return el.closest('.cform__field, .cform__choices'); }
  function validate(stepEl) {
    var ok = true, first = null;
    stepEl.querySelectorAll('.is-invalid').forEach(function (b) { b.classList.remove('is-invalid'); });
    stepEl.querySelectorAll('input[required], textarea[required]').forEach(function (input) {
      var valid = input.type === 'radio'
        ? !!stepEl.querySelector('input[name="' + input.name + '"]:checked')
        : input.checkValidity();
      if (!valid) {
        ok = false;
        var box = fieldBox(input);
        if (box) box.classList.add('is-invalid');
        if (!first) first = input;
      }
    });
    if (first) first.focus();
    return ok;
  }
  function show(n) {
    steps.forEach(function (s) { s.hidden = s.getAttribute('data-step') !== String(n); });
    progress.forEach(function (p) {
      var i = Number(p.getAttribute('data-progress'));
      p.classList.toggle('is-active', i === n);
      p.classList.toggle('is-done', i < n);
    });
    var legend = form.querySelector('[data-step="' + n + '"] .cform__legend');
    if (legend) legend.setAttribute('tabindex', '-1'), legend.focus();
  }
  if (nextBtn) nextBtn.addEventListener('click', function () { if (validate(steps[0])) show(2); });
  if (backBtn) backBtn.addEventListener('click', function () { show(1); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(steps[1])) return;
    var done = function () {
      steps.forEach(function (s) { s.hidden = true; });
      form.querySelector('.cform__progress').hidden = true;
      success.hidden = false;
      success.setAttribute('tabindex', '-1');
      success.focus();
    };
    var action = form.getAttribute('action') || '';
    if (action.indexOf('FORM_ID_A_REMPLACER') !== -1) { done(); return; } /* maquette : endpoint non branché */
    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (r.ok) done(); else throw new Error(); })
      .catch(function () { btn.disabled = false; form.submit(); });
  });
})();
