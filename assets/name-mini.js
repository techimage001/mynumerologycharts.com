/* Mini name checker: one box, instant Expression number, link to the full
   checker. Drop <div data-name-mini data-mode="baby" data-src="number-33"
   data-title="..."></div> on any page and load this file. */
(function () {
  'use strict';
  var M = {A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9};
  function expr(s) {
    var t = String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '').split('')
      .reduce(function (a, c) { return a + (M[c] || 0); }, 0);
    if (!t) { return null; }
    while (t > 9 && t !== 11 && t !== 22 && t !== 33) { t = String(t).split('').reduce(function (a, b) { return a + Number(b); }, 0); }
    return t;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var base = '/';   /* absolute, so it also works inside /blog/ articles */
  document.querySelectorAll('[data-name-mini]').forEach(function (box, i) {
    var mode = box.dataset.mode || 'own', src = box.dataset.src || ((document.querySelector('main') || {}).dataset || {}).pageSlug || 'page';
    var title = box.dataset.title || 'What number does a name add up to?';
    var id = 'nameMini' + i;
    box.classList.add('name-mini');
    box.innerHTML = '<p class="name-mini-title">' + esc(title) + '</p>'
      + '<div class="name-mini-row"><label class="sr-only" for="' + id + '">Name</label><input id="' + id + '" type="text" maxlength="80" autocomplete="off" placeholder="Type a name"><output class="name-mini-out" aria-live="polite">&ndash;</output></div>'
      + '<p class="name-mini-note"><strong>For entertainment only.</strong> A symbolic number, not a prediction.</p>'
      + '<p class="name-mini-foot"><a class="btn btn-primary" href="' + base + 'name-checker.html?mode=' + encodeURIComponent(mode) + '&amp;src=' + encodeURIComponent(src) + '">Compare names against a birth date</a><span>Free. Save and share your results.</span></p>';
    var input = box.querySelector('input'), out = box.querySelector('output'), link = box.querySelector('a');
    input.addEventListener('input', function () {
      var v = expr(input.value);
      out.innerHTML = v ? '<small>Expression</small><b>' + v + '</b>' : '&ndash;';
      link.href = base + 'name-checker.html?mode=' + encodeURIComponent(mode) + '&src=' + encodeURIComponent(src) + (input.value.trim() ? '&name=' + encodeURIComponent(input.value.trim()) : '');
    });
  });
})();
