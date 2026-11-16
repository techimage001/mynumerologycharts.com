/* Shows a Name Checker prompt under the chart once a name has been entered.
   Watches #result rather than editing app.js, so the chart code is untouched. */
(function () {
  'use strict';
  var result = document.getElementById('result'), nameInput = document.getElementById('fullName');
  if (!result || !nameInput || !window.MutationObserver) { return; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var busy = false;
  new MutationObserver(function () {
    if (busy) { return; }
    var name = nameInput.value.trim();
    var old = result.querySelector('.nc-app-hook');
    if (!name || !result.textContent.trim()) { if (old) { old.remove(); } return; }
    if (old && old.dataset.name === name) { return; }
    busy = true;
    if (old) { old.remove(); }
    var box = document.createElement('aside');
    box.className = 'nc-app-hook'; box.dataset.name = name;
    box.innerHTML = '<p><strong>Your numbers are set at birth. Your name is not.</strong> See how "' + esc(name) + '" compares with other spellings, a married name or a nickname against your Life Path.</p>'
      + '<a class="btn btn-primary" href="name-checker.html?mode=own&amp;src=app-results&amp;name=' + encodeURIComponent(name) + '">Check my name</a>';
    result.insertBefore(box, result.firstElementChild ? result.firstElementChild.nextSibling : null);
    busy = false;
  }).observe(result, { childList: true, subtree: true });
})();
