/* Name Checker interface: free ranking, paid breakdown, licence unlock.
   Needs assets/name-checker.js loaded first. */
(function () {
  'use strict';
  var d = document, N = window.MNCNames;
  var tool = d.getElementById('nameChecker');
  if (!tool || !N) { return; }

  var API = 'api/name-checker-unlock.php';
  var STORE = 'mnc-nc-licence', DEVICE = 'mnc-nc-device', SRC = 'mnc-nc-src';
  var MODES = {
    baby:     { dob: "Baby's date of birth (or due date)", names: 'Names on your shortlist', hint: 'Add first and middle names as you would write them, with the surname if you know it.', add: 'Add another name', ph: ['Amelia Rose', 'Isla Grace', 'Olivia May'] },
    business: { dob: "Owner's date of birth", names: 'Business names you are considering', hint: 'Type the trading name exactly as it will appear on signs and invoices.', add: 'Add another business name', ph: ['Bright Bakery', 'Northside Coffee', 'Fern & Field'] },
    married:  { dob: 'Your date of birth', names: 'Your current name, then the new name(s)', hint: 'Put your current full name first. Then add each version you are thinking of using.', add: 'Add another version', ph: ['Sarah Jane Collins', 'Sarah Jane Okafor', 'Sarah Collins-Okafor'] },
    own:      { dob: 'Your date of birth', names: 'Your name, and any spellings you are weighing up', hint: 'Start with the name you use every day. The full report suggests respellings that keep the sound.', add: 'Add another spelling', ph: ['Katherine Lewis', 'Kathryn Lewis', ''] }
  };

  var el = function (s) { return tool.querySelector(s); };
  var form = el('[data-nc-form]'), list = el('[data-nc-names]'), out = el('[data-nc-results]');
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var lsGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var lsSet = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

  /* Where did this visitor come from? Passed to the checkout so you can see
     which pages sell. Set by the mini checker links (?src=) or the page slug. */
  var params = new URLSearchParams(location.search);
  var src = params.get('src') || (function () { try { return sessionStorage.getItem(SRC); } catch (e) { return null; } })() || (d.querySelector('main') || {}).dataset && d.querySelector('main').dataset.pageSlug || 'name-checker';
  try { sessionStorage.setItem(SRC, src); } catch (e) {}

  var mode = params.get('mode') || tool.dataset.mode || 'baby';
  if (!MODES[mode]) { mode = 'baby'; }

  function setMode(m) {
    mode = m; tool.dataset.mode = m;
    tool.querySelectorAll('[data-nc-mode]').forEach(function (b) { var on = b.dataset.ncMode === m; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    el('[data-nc-dob-label]').textContent = MODES[m].dob;
    el('[data-nc-names-label]').textContent = MODES[m].names;
    el('[data-nc-hint]').textContent = MODES[m].hint;
    el('[data-nc-add]').textContent = '+ ' + MODES[m].add;
    var inputs = list.querySelectorAll('input');
    inputs.forEach(function (inp, i) { inp.placeholder = MODES[m].ph[i] || ''; });
  }

  function addRow(value) {
    if (list.children.length >= 10) { return; }
    var i = list.children.length;
    var row = d.createElement('div'); row.className = 'nc-row';
    row.innerHTML = '<input type="text" maxlength="80" autocomplete="off" aria-label="Name ' + (i + 1) + '" placeholder="' + esc(MODES[mode].ph[i] || '') + '"><button type="button" class="nc-x" aria-label="Remove name ' + (i + 1) + '">&times;</button>';
    row.querySelector('input').value = value || '';
    row.querySelector('.nc-x').addEventListener('click', function () { if (list.children.length > 1) { row.remove(); } else { row.querySelector('input').value = ''; } });
    list.appendChild(row);
    el('[data-nc-add]').hidden = list.children.length >= 10;
  }

  /* ---------------- licence ---------------- */
  function licence() { try { return JSON.parse(lsGet(STORE) || 'null'); } catch (e) { return null; } }
  function unlocked() {
    var l = licence(); if (!l || !l.ok) { return false; }
    if (l.expires_at && Date.parse(l.expires_at) < Date.now()) { return false; }
    return true;
  }
  function device() { var id = lsGet(DEVICE); if (!id) { id = 'd' + Math.random().toString(36).slice(2) + Date.now().toString(36); lsSet(DEVICE, id); } return id; }

  function post(body) {
    return fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }, body: new URLSearchParams(body).toString() })
      .then(function (r) { return r.json().catch(function () { return { ok: false, message: 'The server sent an unexpected reply. Please try again.' }; }); });
  }

  var config = null;
  function loadConfig() {
    return fetch(API + '?action=config', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); }).then(function (c) { config = c; return c; })
      .catch(function () { config = { ok: false }; return config; });
  }

  /* Re-check a stored licence once a day, quietly. */
  function revalidate() {
    var l = licence(); if (!l || !l.key) { return; }
    if (l.checked && Date.now() - l.checked < 864e5) { return; }
    post({ action: 'validate', key: l.key, instance: l.instance || '' }).then(function (r) {
      if (r && r.ok) { l.ok = true; l.tier = r.tier; l.expires_at = r.expires_at; l.checked = Date.now(); lsSet(STORE, JSON.stringify(l)); }
      else if (r && r.definitive) { l.ok = false; l.checked = Date.now(); lsSet(STORE, JSON.stringify(l)); render(); }
    });
  }

  function activate(key, msgEl) {
    key = String(key || '').trim();
    if (!key) { msgEl.textContent = 'Paste the licence key from your receipt email.'; return; }
    msgEl.textContent = 'Checking your key...';
    post({ action: 'activate', key: key, device: device() }).then(function (r) {
      if (r && r.ok) {
        lsSet(STORE, JSON.stringify({ ok: true, key: key, instance: r.instance || '', tier: r.tier, expires_at: r.expires_at || null, checked: Date.now() }));
        msgEl.textContent = 'Unlocked. Thank you.';
        render();
      } else { msgEl.textContent = (r && r.message) || 'That key could not be checked. Please try again.'; }
    });
  }

  /* ---------------- results ---------------- */
  var last = null;

  function bar(score) { return '<span class="nc-bar" aria-hidden="true"><span style="width:' + score + '%"></span></span>'; }

  function freeCards(rows) {
    return '<ol class="nc-rank">' + rows.map(function (r, i) {
      return '<li class="nc-card' + (i === 0 ? ' is-top' : '') + '"><div class="nc-card-head"><span class="nc-pos">' + (i + 1) + '</span><strong class="nc-name">' + esc(r.name) + '</strong><span class="nc-score"><b>' + r.score + '</b>/100</span></div>' + bar(r.score) + '<p>' + esc(r.reason) + '</p></li>';
    }).join('') + '</ol>';
  }

  function breakdown(r) {
    var n = r.numbers;
    return '<details class="nc-detail" open><summary><strong>' + esc(r.name) + '</strong> <span>' + r.score + '/100</span></summary>'
      + '<div class="nc-nums"><div><span>Expression</span><b>' + n.expression.value + '</b><small>' + n.totals.expression + ' &gt; ' + n.expression.steps.join(' &gt; ') + '</small></div>'
      + '<div><span>Soul Urge</span><b>' + n.soul.value + '</b><small>vowels ' + n.totals.soul + '</small></div>'
      + '<div><span>Personality</span><b>' + n.personality.value + '</b><small>consonants ' + n.totals.personality + '</small></div></div>'
      + '<div class="table-scroll" tabindex="0" role="region" aria-label="Scoring table"><table class="nc-table"><thead><tr><th>Pairing</th><th>Numbers</th><th>Reading</th><th>Weight</th></tr></thead><tbody>'
      + r.parts.map(function (p) { return '<tr><td>' + esc(p.what) + '</td><td>' + p.nameNumber + ' &amp; ' + p.birthNumber + '</td><td>' + esc(p.label) + '</td><td>' + p.weight + '%</td></tr>'; }).join('')
      + '</tbody></table></div><p class="nc-working"><span>Letter working:</span> ' + esc(n.working) + '</p></details>';
  }

  function suggestions(rows) {
    var html = '', any = false;
    rows.forEach(function (r) {
      var entered = rows.map(function (x) { return x.name.toUpperCase(); });
      var v = N.variantsFor(r.name, last.birth, mode, last.system, 6).filter(function (x) { return entered.indexOf(x.name.toUpperCase()) < 0; }).slice(0, 4);
      if (!v.length) { return; }
      any = true;
      html += '<div class="nc-sugg"><p><strong>' + esc(r.name) + '</strong> (' + r.score + ') could also be written as:</p><ul>' + v.map(function (x) { return '<li><b>' + esc(x.name) + '</b> ' + bar(x.score) + ' <span>' + x.score + '/100</span></li>'; }).join('') + '</ul></div>';
    });
    if (!any) { return '<p>None of the respellings we test score higher than what you already have, so there is nothing to change.</p>'; }
    return html + '<p class="nc-note">' + (mode === 'business' ? 'These are small additions to the trading name, such as "Co" or "Studio".' : 'These keep the sound of the name. Say each one out loud, and check you would be happy writing it on a form for the rest of your life, before taking any of them seriously.') + '</p>';
  }

  function offer() {
    var c = config && config.ok ? config : null;
    var buy = function (tier) {
      var url = c && c.checkout && c.checkout[tier];
      if (!url) { return '<span class="btn btn-secondary is-disabled" aria-disabled="true">Checkout not set up yet</span>'; }
      var u = url + (url.indexOf('?') < 0 ? '?' : '&') + 'checkout[custom][placement]=' + encodeURIComponent(src) + '&checkout[custom][mode]=' + encodeURIComponent(mode);
      return '<a class="btn ' + (tier === 'lifetime' ? 'btn-primary' : 'btn-secondary') + '" href="' + esc(u) + '" rel="nofollow">' + (tier === 'lifetime' ? 'Unlimited for life, ' + esc(c.price.lifetime) : '30-day pass, ' + esc(c.price.pass)) + '</a>';
    };
    return '<section class="nc-offer" aria-labelledby="ncOfferTitle"><h3 id="ncOfferTitle">See why each name scored as it did</h3>'
      + '<ul class="nc-included"><li>The full pairing table for every name, with the letter working</li><li>Respellings that keep the sound and score higher</li><li>A side-by-side chart you can save as a PDF and share</li><li>Pythagorean and Chaldean, switch any time</li></ul>'
      + '<div class="nc-buy">' + buy('pass') + buy('lifetime') + '</div>'
      + '<p class="nc-small">One payment, no subscription. Handled securely by Lemon Squeezy; we never see your card.</p>'
      + '<details class="nc-key"><summary>Already bought? Enter your licence key</summary><div class="nc-keyrow"><input type="text" data-nc-key placeholder="Licence key from your receipt email" autocomplete="off" aria-label="Licence key"><button type="button" class="btn btn-primary" data-nc-activate>Unlock</button></div><p class="nc-small" data-nc-keymsg aria-live="polite"></p></details></section>';
  }

  function paidBlock(rows) {
    var max = rows.length ? rows[0].score : 100;
    var chart = '<div class="nc-chart" role="img" aria-label="Scores side by side">' + rows.map(function (r) { return '<div class="nc-col"><span class="nc-colbar" style="height:' + Math.max(8, r.score) + '%"><b>' + r.score + '</b></span><em>' + esc(r.name) + '</em></div>'; }).join('') + '</div>';
    var l = licence();
    return '<section class="nc-paid"><div class="nc-paid-head"><h3>Your full report</h3><button type="button" class="btn btn-secondary" data-nc-print>Save as PDF</button></div>'
      + '<p class="nc-small">Birth numbers: Life Path ' + last.birth.lifePath + ', Birthday ' + last.birth.birthday + ' (' + esc(last.birth.trace) + '). System: ' + (last.system === 'chaldean' ? 'Chaldean' : 'Pythagorean') + '.</p>'
      + chart + rows.map(breakdown).join('')
      + '<h3>Spellings that score higher</h3>' + suggestions(rows)
      + (l && l.tier === 'pass' && l.expires_at ? '<p class="nc-small">Your 30-day pass runs until ' + esc(new Date(l.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })) + '.</p>' : '')
      + '</section>';
  }

  function render() {
    if (!last) { return; }
    var rows = last.rows;
    var html = '<h2 class="nc-h">Your ranking</h2>' + freeCards(rows)
      + '<p class="nc-small nc-method">How the score works: each name number is paired with a birth number. Same number 100, same root 95, same traditional family (1-5-7, 2-4-8, 3-6-9) 82, contrast 55; weighted and shown on a 40 to 100 scale. It is a symbolic reading for entertainment, not a prediction. <a href="methodology.html">Full method</a>.</p>';
    html += unlocked() ? paidBlock(rows) : offer();
    out.innerHTML = html;
    out.hidden = false;
    var act = out.querySelector('[data-nc-activate]');
    if (act) { act.addEventListener('click', function () { activate(out.querySelector('[data-nc-key]').value, out.querySelector('[data-nc-keymsg]')); }); }
    var pr = out.querySelector('[data-nc-print]');
    if (pr) { pr.addEventListener('click', function () { d.body.classList.add('nc-printing'); window.print(); setTimeout(function () { d.body.classList.remove('nc-printing'); }, 500); }); }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = el('[data-nc-status]');
    var birth = N.birthNumbers(el('[data-nc-dob]').value);
    if (!birth) { status.textContent = 'Please enter the date of birth first.'; el('[data-nc-dob]').focus(); return; }
    var names = Array.prototype.map.call(list.querySelectorAll('input'), function (i) { return i.value.trim(); })
      .filter(function (v) { return /[A-Za-zÀ-ɏ]/.test(v); });
    if (!names.length) { status.textContent = 'Add at least one name.'; list.querySelector('input').focus(); return; }
    status.textContent = '';
    var system = el('[data-nc-system]').value;
    var rows = names.map(function (n) { return N.scoreName(n, birth, mode, system); });
    if (mode !== 'married') { rows.sort(function (a, b) { return b.score - a.score; }); }
    last = { birth: birth, system: system, rows: rows };
    (config ? Promise.resolve() : loadConfig()).then(function () { render(); out.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  });

  tool.querySelectorAll('[data-nc-mode]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.ncMode); }); });
  el('[data-nc-add]').addEventListener('click', function () { addRow(''); list.lastElementChild.querySelector('input').focus(); });

  /* Prefill from the mini checker: ?name=...&mode=... */
  var pre = (params.get('name') || '').slice(0, 80);
  addRow(pre); addRow(''); addRow('');
  setMode(mode);
  loadConfig();
  revalidate();
  if (unlocked()) { tool.classList.add('nc-is-unlocked'); }
})();
