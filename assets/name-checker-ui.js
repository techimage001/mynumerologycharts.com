/* Name Checker interface (v43). Everything is free; the licence/payment
   path is kept but only switches on if api/name-checker-config.php sets
   'paid' => true. Needs assets/name-checker.js loaded first. */
(function () {
  'use strict';
  var d = document, N = window.MNCNames;
  var tool = d.getElementById('nameChecker');
  if (!tool || !N) { return; }

  var API = 'api/name-checker-unlock.php', STATS = 'api/nc-stats.php';
  var STORE = 'mnc-nc-licence', DEVICE = 'mnc-nc-device', SRC = 'mnc-nc-src', LAST = 'mnc-nc-last';
  var SITE = 'mynumerologycharts.com';
  var MODES = {
    baby:     { dob: "Baby's date of birth (or due date)", names: 'Names on your shortlist', hint: 'Add first and middle names as you would write them, with the surname if you know it.', add: 'Add another name', ph: ['Amelia Rose', 'Isla Grace', 'Olivia May'], sex: true, title: 'Our baby name shortlist' },
    middle:   { dob: "Baby's date of birth (or due date)", names: 'Middle names you like (optional)', hint: 'Leave these empty and we will suggest middle names that pair well. Or type your own to compare them.', add: 'Add another middle name', ph: ['Rose', 'Grace', 'May'], sex: true, title: 'Middle name ideas' },
    business: { dob: "Owner's date of birth", names: 'Business names you are considering', hint: 'Type the trading name exactly as it will appear on signs and invoices.', add: 'Add another business name', ph: ['Bright Bakery', 'Northside Coffee', 'Fern & Field'], title: 'Business name shortlist' },
    married:  { dob: 'Your date of birth', names: 'Your current name, then the new name(s)', hint: 'Put your current full name first. Then add each version you are thinking of using.', add: 'Add another version', ph: ['Sarah Jane Collins', 'Sarah Jane Okafor', 'Sarah Collins-Okafor'], title: 'Married name comparison' },
    own:      { dob: 'Your date of birth', names: 'Your name, and any spellings you are weighing up', hint: 'Start with the name you use every day. The report suggests respellings that keep the sound.', add: 'Add another spelling', ph: ['Katherine Lewis', 'Kathryn Lewis', ''], title: 'My name check' }
  };
  var SEX_WORD = { g: "Girl's name", b: "Boy's name", u: 'Unisex' };

  var el = function (s) { return tool.querySelector(s); };
  var form = el('[data-nc-form]'), list = el('[data-nc-names]'), out = el('[data-nc-results]');
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var lsGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var lsSet = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

  /* Proper capitals: "mary-jane o'neil" -> "Mary-Jane O'Neil". Leaves names
     someone typed with deliberate capitals (McDonald, DeShawn) alone. */
  function nice(s) {
    s = String(s).trim().replace(/\s+/g, ' ');
    return s.split(' ').map(function (w) {
      if (/[a-z][A-Z]/.test(w)) { return w; }
      return w.toLowerCase().replace(/(^|[-'’])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); });
    }).join(' ');
  }

  var params = new URLSearchParams(location.search);
  /* Usage counts only run if the visitor accepted optional analytics in the
     site's cookie banner, which promises analytics stay off otherwise. */
  function analyticsOk() { try { var c = JSON.parse(localStorage.getItem('mnc-cookie-consent') || 'null'); return !!(c && c.analytics); } catch (e) { return false; } }
  var src = params.get('src') || (analyticsOk() ? (function () { try { return sessionStorage.getItem(SRC); } catch (e) { return null; } })() : null) || ((d.querySelector('main') || {}).dataset || {}).pageSlug || 'name-checker';
  if (analyticsOk()) { try { sessionStorage.setItem(SRC, src); } catch (e) {} }

  /* ---------------- anonymous usage counts ---------------- */
  function track(ev) {
    if (!analyticsOk()) { return; }
    try {
      var body = new FormData(); body.append('e', ev); body.append('src', src); body.append('m', mode);
      if (navigator.sendBeacon) { navigator.sendBeacon(STATS, body); }
      else { fetch(STATS, { method: 'POST', body: body, keepalive: true, credentials: 'omit' }); }
    } catch (e) {}
  }

  /* ---------------- boy / girl list (loaded only when needed) ---------------- */
  var names = null, namesLoading = null;
  function loadNames() {
    if (names || namesLoading) { return namesLoading || Promise.resolve(names); }
    namesLoading = fetch('assets/names.json?v=1').then(function (r) { return r.json(); })
      .then(function (j) { names = j; return j; }).catch(function () { names = { sex: {}, top: { g: [], b: [] } }; return names; });
    return namesLoading;
  }
  function sexOf(first) { return names && names.sex ? (names.sex[String(first).toLowerCase()] || null) : null; }

  /* ---------------- mode, sex, rows ---------------- */
  var mode = params.get('mode') || tool.dataset.mode || 'baby';
  if (!MODES[mode]) { mode = 'baby'; }
  var sex = 'any';

  function setMode(m) {
    mode = m; tool.dataset.mode = m;
    tool.querySelectorAll('[data-nc-mode]').forEach(function (b) { var on = b.dataset.ncMode === m; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    el('[data-nc-dob-label]').textContent = MODES[m].dob;
    el('[data-nc-names-label]').textContent = MODES[m].names;
    el('[data-nc-hint]').textContent = MODES[m].hint;
    el('[data-nc-add]').textContent = '+ ' + MODES[m].add;
    el('[data-nc-sex-row]').hidden = !MODES[m].sex;
    el('[data-nc-middle-row]').hidden = m !== 'middle';
    list.querySelectorAll('input').forEach(function (inp, i) { inp.placeholder = MODES[m].ph[i] || ''; });
    if (MODES[m].sex) { loadNames(); }
  }
  function setSex(s) {
    sex = s;
    tool.querySelectorAll('[data-nc-sex]').forEach(function (b) { var on = b.dataset.ncSex === s; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
  }

  function addRow(value) {
    if (list.children.length >= 10) { return; }
    var i = list.children.length;
    var row = d.createElement('div'); row.className = 'nc-row';
    row.innerHTML = '<input type="text" maxlength="80" autocomplete="off" aria-label="Name ' + (i + 1) + '" placeholder="' + esc(MODES[mode].ph[i] || '') + '"><button type="button" class="nc-x" aria-label="Remove name ' + (i + 1) + '">&times;</button>';
    var inp = row.querySelector('input'); inp.value = value || '';
    inp.addEventListener('blur', function () { if (inp.value.trim()) { inp.value = nice(inp.value); } });
    row.querySelector('.nc-x').addEventListener('click', function () { if (list.children.length > 1) { row.remove(); } else { inp.value = ''; } el('[data-nc-add]').hidden = false; });
    list.appendChild(row);
    el('[data-nc-add]').hidden = list.children.length >= 10;
  }
  function setRows(values) { list.innerHTML = ''; var v = values.slice(0, 10); while (v.length < 3) { v.push(''); } v.forEach(addRow); }
  ['[data-nc-first]', '[data-nc-surname]'].forEach(function (s) { var i = el(s); i.addEventListener('blur', function () { if (i.value.trim()) { i.value = nice(i.value); } }); });

  /* ---------------- payment path (dormant while everything is free) ---------------- */
  var config = null;
  function loadConfig() {
    return fetch(API + '?action=config', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); }).then(function (c) { config = c; return c; })
      .catch(function () { config = { ok: false }; return config; });
  }
  function licence() { try { return JSON.parse(lsGet(STORE) || 'null'); } catch (e) { return null; } }
  function paidMode() { return !!(config && config.ok && config.paid === true); }
  function unlocked() {
    if (!paidMode()) { return true; }
    var l = licence(); if (!l || !l.ok) { return false; }
    return !(l.expires_at && Date.parse(l.expires_at) < Date.now());
  }
  function device() { var id = lsGet(DEVICE); if (!id) { id = 'd' + Math.random().toString(36).slice(2) + Date.now().toString(36); lsSet(DEVICE, id); } return id; }
  function post(body) {
    return fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }, body: new URLSearchParams(body).toString() })
      .then(function (r) { return r.json().catch(function () { return { ok: false, message: 'Unexpected reply. Please try again.' }; }); });
  }
  function activate(key, msgEl) {
    key = String(key || '').trim();
    if (!key) { msgEl.textContent = 'Paste the licence key from your receipt email.'; return; }
    msgEl.textContent = 'Checking your key...';
    post({ action: 'activate', key: key, device: device() }).then(function (r) {
      if (r && r.ok) { lsSet(STORE, JSON.stringify({ ok: true, key: key, instance: r.instance || '', tier: r.tier, expires_at: r.expires_at || null, checked: Date.now() })); render(); }
      else { msgEl.textContent = (r && r.message) || 'That key could not be checked.'; }
    });
  }
  function offer() {
    var c = config, buy = function (tier) {
      var url = c.checkout && c.checkout[tier];
      if (!url) { return '<span class="btn btn-secondary is-disabled" aria-disabled="true">Checkout not set up yet</span>'; }
      return '<a class="btn ' + (tier === 'lifetime' ? 'btn-primary' : 'btn-secondary') + '" href="' + esc(url + (url.indexOf('?') < 0 ? '?' : '&') + 'checkout[custom][placement]=' + encodeURIComponent(src)) + '" rel="nofollow">' + (tier === 'lifetime' ? 'Unlimited, ' + esc(c.price.lifetime) : '30-day pass, ' + esc(c.price.pass)) + '</a>';
    };
    return '<section class="nc-offer"><h3>See why each name scored as it did</h3><div class="nc-buy">' + buy('pass') + buy('lifetime') + '</div>'
      + '<details class="nc-key"><summary>Already bought? Enter your licence key</summary><div class="nc-keyrow"><input type="text" data-nc-key placeholder="Licence key" aria-label="Licence key"><button type="button" class="btn btn-primary" data-nc-activate>Unlock</button></div><p class="nc-small" data-nc-keymsg aria-live="polite"></p></details></section>';
  }

  /* ---------------- results ---------------- */
  var last = null;
  function bar(score) { return '<span class="nc-bar" aria-hidden="true"><span style="width:' + score + '%"></span></span>'; }

  /* Which word of the name carries the sex label: the first name, or in
     middle-name mode the middle name. */
  function labelWord(r) { var t = r.name.split(' '); return mode === 'middle' ? (t[1] || t[0]) : t[0]; }
  function sexBadge(r) {
    if (!MODES[mode].sex) { return ''; }
    var w = labelWord(r), s = sexOf(w);
    if (!names) { return ''; }
    if (!s) { return '<span class="nc-sex nc-sex-x" title="Not in our list of 16,000 names">Name not in our list</span>'; }
    var warn = (sex === 'g' && s === 'b') || (sex === 'b' && s === 'g');
    return '<span class="nc-sex nc-sex-' + s + '">' + SEX_WORD[s] + '</span>' + (warn ? '<span class="nc-sex-note">' + esc(nice(w)) + ' is usually used for ' + (s === 'b' ? 'boys' : 'girls') + '.</span>' : '');
  }
  function freeCards(rows) {
    return '<ol class="nc-rank">' + rows.map(function (r, i) {
      return '<li class="nc-card' + (i === 0 && mode !== 'married' ? ' is-top' : '') + '"><div class="nc-card-head"><span class="nc-pos">' + (i + 1) + '</span><strong class="nc-name">' + esc(r.name) + '</strong><span class="nc-score"><b>' + r.score + '</b>/100</span></div>'
        + '<div class="nc-badges">' + sexBadge(r) + (mode === 'married' && i === 0 ? '<span class="nc-sex nc-sex-x">Current name</span>' : '') + '</div>'
        + bar(r.score) + '<p>' + esc(r.reason) + '</p></li>';
    }).join('') + '</ol>';
  }
  function breakdown(r) {
    var n = r.numbers;
    return '<details class="nc-detail"><summary><strong>' + esc(r.name) + '</strong> <span>' + r.score + '/100</span></summary>'
      + '<div class="nc-nums"><div><span>Expression</span><b>' + n.expression.value + '</b><small>' + n.totals.expression + ' &gt; ' + n.expression.steps.join(' &gt; ') + '</small></div>'
      + '<div><span>Soul Urge</span><b>' + n.soul.value + '</b><small>vowels ' + n.totals.soul + '</small></div>'
      + '<div><span>Personality</span><b>' + n.personality.value + '</b><small>consonants ' + n.totals.personality + '</small></div></div>'
      + '<div class="table-scroll" tabindex="0" role="region" aria-label="Scoring table"><table class="nc-table"><thead><tr><th>Pairing</th><th>Numbers</th><th>Reading</th><th>Weight</th></tr></thead><tbody>'
      + r.parts.map(function (p) { return '<tr><td>' + esc(p.what) + '</td><td>' + p.nameNumber + ' &amp; ' + p.birthNumber + '</td><td>' + esc(p.label) + '</td><td>' + p.weight + '%</td></tr>'; }).join('')
      + '</tbody></table></div><p class="nc-working"><span>Letter working:</span> ' + esc(n.working) + '</p></details>';
  }
  function respellings(rows) {
    if (mode === 'middle') { return ''; }
    var entered = rows.map(function (x) { return x.name.toUpperCase(); }), html = '';
    rows.forEach(function (r) {
      var v = N.variantsFor(r.name, last.birth, mode === 'business' ? 'business' : 'person', last.system, 6)
        .filter(function (x) { return entered.indexOf(x.name.toUpperCase()) < 0; }).slice(0, 4);
      r.variants = v;
      if (v.length) { html += '<div class="nc-sugg"><p><strong>' + esc(r.name) + '</strong> (' + r.score + ') could also be written as:</p><ul>' + v.map(function (x) { return '<li><b>' + esc(x.name) + '</b> ' + bar(x.score) + ' <span>' + x.score + '/100</span></li>'; }).join('') + '</ul></div>'; }
    });
    if (!html) { return '<h3>Spellings that score higher</h3><p>None of the respellings we test score higher than what you already have.</p>'; }
    return '<h3>Spellings that score higher</h3>' + html + '<p class="nc-note">' + (mode === 'business' ? 'These are small additions to the trading name, such as "Co" or "Studio".' : 'These keep the sound of the name. Say each one out loud before taking any of them seriously.') + '</p>';
  }
  /* Same buttons, wording and pop-ups as the chart page (app.html), so the
     two tools feel like one product. */
  function actions() {
    return '<section class="nc-actions-box report-actions-panel" aria-labelledby="ncSaveTitle"><h3 id="ncSaveTitle">Save and share</h3>'
      + '<div class="result-actions nc-result-actions">'
      + '<button type="button" class="btn btn-secondary" data-nc-preview>Preview Image</button>'
      + '<button type="button" class="btn btn-secondary" data-nc-share>Share</button>'
      + '<a class="btn btn-secondary nc-wa" data-nc-wa href="#" target="_blank" rel="noopener">WhatsApp</a>'
      + '<button type="button" class="btn btn-secondary" data-nc-png>Download PNG</button>'
      + '<button type="button" class="btn btn-secondary" data-nc-jpg>Download JPG</button>'
      + '<button type="button" class="btn btn-secondary" data-nc-pdf>Download PDF Report</button>'
      + '<button type="button" class="btn btn-secondary" data-nc-save>Save on This Device</button>'
      + '<button type="button" class="btn btn-secondary" data-nc-saved>Saved Shortlists</button>'
      + '<button type="button" class="btn btn-secondary" data-nc-copy>Copy Private-Safe Link</button>'
      + '</div>'
      + '<label class="nc-check"><input type="checkbox" data-nc-showdate> Include the date of birth on the image and in shared links</label>'
      + '<p class="nc-small" data-nc-actmsg aria-live="polite">Images and PDFs are made on your device. Nothing is uploaded.</p></section>';
  }

  /* ---------------- saved shortlists (this device only) ---------------- */
  var SAVED = 'mnc-nc-saved';
  function savedList() { try { return JSON.parse(lsGet(SAVED) || '[]'); } catch (e) { return []; } }
  function saveCurrent() {
    var st = stateFor(true); st.label = last.rows.slice(0, 3).map(function (r) { return mode === 'middle' && r.middle ? r.middle : r.name.split(' ')[0]; }).join(', ');
    st.title = MODES[mode].title; st.savedAt = new Date().toISOString();
    var all = savedList().filter(function (x) { return JSON.stringify([x.m, x.d, x.n, x.f, x.l]) !== JSON.stringify([st.m, st.d, st.n, st.f, st.l]); });
    all.unshift(st); lsSet(SAVED, JSON.stringify(all.slice(0, 30)));
  }
  function applyState(st) {
    mode = MODES[st.m] ? st.m : 'baby'; setRows(st.n || []); setMode(mode); setSex(st.x || 'any');
    el('[data-nc-system]').value = st.y === 'chaldean' ? 'chaldean' : 'pythagorean';
    el('[data-nc-first]').value = st.f || ''; el('[data-nc-surname]').value = st.l || ''; el('[data-nc-dob]').value = st.d || '';
  }
  function showSaved() {
    var dlg = d.getElementById('ncSavedDialog');
    if (!dlg) { dlg = d.createElement('dialog'); dlg.id = 'ncSavedDialog'; dlg.className = 'saved-charts-dialog'; d.body.appendChild(dlg); }
    var all = savedList();
    dlg.innerHTML = '<div class="preview-dialog-head"><div><p class="eyebrow">Private on this device</p><h2>My saved shortlists</h2></div><button class="icon-btn" type="button" data-nc-close aria-label="Close">×</button></div><div class="saved-chart-list">'
      + (all.length ? all.map(function (x, i) { return '<article><div><strong>' + esc(x.title || 'Shortlist') + '</strong><small>' + esc(x.label || '') + ' · saved ' + new Date(x.savedAt).toLocaleDateString('en-GB') + '</small></div><div><button class="btn btn-secondary" type="button" data-nc-open="' + i + '">Open</button><button class="btn btn-secondary" type="button" data-nc-del="' + i + '">Delete</button></div></article>'; }).join('') : '<p>No shortlists have been saved on this device yet.</p>')
      + '</div>';
    dlg.onclick = function (e) {
      var t = e.target;
      if (t === dlg || t.closest('[data-nc-close]')) { dlg.close(); return; }
      if (t.dataset.ncOpen !== undefined) { applyState(savedList()[+t.dataset.ncOpen]); dlg.close(); run(); }
      if (t.dataset.ncDel !== undefined) { var l = savedList(); l.splice(+t.dataset.ncDel, 1); lsSet(SAVED, JSON.stringify(l)); showSaved(); }
    };
    if (!dlg.open) { dlg.showModal(); }
  }
  function showPreview() {
    var dlg = d.getElementById('ncPreviewDialog');
    if (!dlg) {
      dlg = d.createElement('dialog'); dlg.id = 'ncPreviewDialog'; dlg.className = 'share-preview-dialog';
      dlg.innerHTML = '<div class="preview-dialog-head"><div><p class="eyebrow">Preview before sharing</p><h2>Your share card</h2></div><button class="icon-btn" type="button" data-nc-close aria-label="Close preview">×</button></div><div class="share-preview-stage"><img data-nc-previmg alt="Preview of your name shortlist card"></div><div class="preview-actions"><button class="btn btn-primary" type="button" data-nc-pshare>Share</button><button class="btn btn-secondary" type="button" data-nc-ppng>Download PNG</button><button class="btn btn-secondary" type="button" data-nc-pjpg>Download JPG</button></div>';
      d.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) {
        var t = e.target;
        if (t === dlg || t.closest('[data-nc-close]')) { dlg.close(); }
        else if (t.closest('[data-nc-pshare]')) { doShare(); }
        else if (t.closest('[data-nc-ppng]')) { savePic('png'); }
        else if (t.closest('[data-nc-pjpg]')) { savePic('jpg'); }
      });
    }
    dlg.querySelector('[data-nc-previmg]').src = cardCanvas().toDataURL('image/png');
    dlg.showModal(); track('preview');
  }
  function signupPrompt() {
    return '<aside class="nc-signup"><p><strong>New name tools are on the way.</strong> Be first to hear when they launch. One email when there is something new, nothing else.</p><button class="btn btn-secondary" type="button" data-open-signup data-nc-signup>Tell me about new tools</button></aside>';
  }
  function fullReport(rows) {
    var chart = '<div class="nc-chart" role="img" aria-label="Scores side by side">' + rows.map(function (r) { return '<div class="nc-col"><span class="nc-colbar" style="height:' + Math.max(8, r.score) + '%"><b>' + r.score + '</b></span><em>' + esc(r.name) + '</em></div>'; }).join('') + '</div>';
    return '<section class="nc-paid"><h3>Your full report</h3>'
      + '<p class="nc-small">Birth numbers: Life Path ' + last.birth.lifePath + ', Birthday ' + last.birth.birthday + ' (' + esc(last.birth.trace) + '). System: ' + (last.system === 'chaldean' ? 'Chaldean' : 'Pythagorean') + '.</p>'
      + chart + rows.map(breakdown).join('') + respellings(rows) + '</section>';
  }

  function render() {
    if (!last) { return; }
    var rows = last.rows;
    var head = mode === 'middle' ? '<h2 class="nc-h">' + (last.suggested ? 'Middle names that pair well' : 'Your middle names, ranked') + '</h2>' + (last.suggested ? '<p class="nc-small">Taken from the most-used ' + (sex === 'b' ? "boys'" : sex === 'g' ? "girls'" : '') + ' names and ranked for ' + esc(last.first + (last.surname ? ' … ' + last.surname : '')) + '.</p>' : '') : '<h2 class="nc-h">Your ranking</h2>';
    var html = head + '<p class="nc-notice" role="note"><strong>For entertainment only.</strong> Scores are symbolic numerology, not facts or predictions about any person, baby, marriage or business. A name you love matters more than any score.</p>' + freeCards(rows)
      + '<p class="nc-small nc-method">How the score works: each name number is paired with a birth number. Same number 100, same root 95, same traditional family (1-5-7, 2-4-8, 3-6-9) 82, contrast 55; weighted and shown on a 40 to 100 scale. Whether a name is a boy\'s or girl\'s name does not change its numbers. It is a symbolic reading for entertainment, not a prediction. <a href="methodology.html">Full method</a>.</p>';
    html += unlocked() ? actions() + fullReport(rows) + signupPrompt() : offer();
    out.innerHTML = html; out.hidden = false;
    wire();
  }

  /* ---------------- share links (state lives in the #fragment, never sent to the server) ---------------- */
  function stateFor(withDate) {
    return { m: mode, x: sex, y: last.system, d: withDate ? last.dob : '', n: last.inputNames, f: last.first || '', l: last.surname || '' };
  }
  function b64(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64(s) { try { s = s.replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) { return null; } }
  function shareUrl() {
    var withDate = !!(out.querySelector('[data-nc-showdate]') || {}).checked;
    return location.origin + location.pathname + '?src=share#s=' + b64(stateFor(withDate));
  }
  function shareText() {
    var top = last.rows.slice(0, 3).map(function (r) { return r.name + ' (' + r.score + ')'; }).join(', ');
    return MODES[mode].title + ': ' + top + '. Compare names for free:';
  }
  function refreshLinks() {
    var u = shareUrl(), t = shareText();
    var wa = out.querySelector('[data-nc-wa]'); if (wa) { wa.href = 'https://wa.me/?text=' + encodeURIComponent(t + ' ' + u); }
  }

  /* ---------------- image card (canvas) ---------------- */
  function css(v, fb) { var s = getComputedStyle(d.documentElement).getPropertyValue(v).trim(); return s || fb; }
  function wrapLines(ctx, text, max) {
    var words = String(text).split(' '), lines = [], cur = '';
    words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w; } else { cur = t; } });
    if (cur) { lines.push(cur); } return lines;
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function cardCanvas() {
    var W = 1080, H = 1350, c = d.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d'), brand = '#5b2d6f', gold = '#c79245', ink = '#241d2b', muted = '#675d6d';
    var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#fbf8f3'); g.addColorStop(1, '#efe6f2');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = brand; x.fillRect(0, 0, W, 14);
    x.fillStyle = brand; x.font = '700 30px Georgia, serif'; x.fillText('MyNumerologyCharts', 72, 92);
    x.fillStyle = ink; x.font = '700 66px Georgia, serif';
    var y = 190; wrapLines(x, MODES[mode].title, W - 144).forEach(function (l) { x.fillText(l, 72, y); y += 74; });
    x.fillStyle = muted; x.font = '400 30px system-ui, sans-serif';
    var sub = 'Life Path ' + last.birth.lifePath + ' · ' + (last.system === 'chaldean' ? 'Chaldean' : 'Pythagorean') + (out.querySelector('[data-nc-showdate]').checked ? ' · born ' + new Date(last.dob + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
    x.fillText(sub, 72, y + 4); y += 60;
    last.rows.slice(0, 6).forEach(function (r, i) {
      var top = i === 0 && mode !== 'married';
      roundRect(x, 60, y, W - 120, 142, 24); x.fillStyle = '#ffffff'; x.fill();
      x.lineWidth = top ? 5 : 2; x.strokeStyle = top ? gold : '#ded4c9'; x.stroke();
      x.fillStyle = top ? gold : '#efe8df'; x.beginPath(); x.arc(118, y + 50, 26, 0, Math.PI * 2); x.fill();
      x.fillStyle = top ? '#fff' : ink; x.font = '700 28px system-ui, sans-serif'; x.textAlign = 'center'; x.fillText(String(i + 1), 118, y + 60); x.textAlign = 'left';
      x.fillStyle = ink; x.font = '700 40px Georgia, serif';
      var nm = r.name; while (x.measureText(nm).width > 640 && nm.length > 4) { nm = nm.slice(0, -2) + '…'; }
      x.fillText(nm, 166, y + 64);
      x.fillStyle = brand; x.font = '800 48px system-ui, sans-serif'; x.textAlign = 'right'; x.fillText(String(r.score), W - 150, y + 66);
      x.fillStyle = muted; x.font = '400 24px system-ui, sans-serif'; x.fillText('/100', W - 90, y + 66); x.textAlign = 'left';
      roundRect(x, 166, y + 92, W - 300, 16, 8); x.fillStyle = '#efe8df'; x.fill();
      roundRect(x, 166, y + 92, Math.max(16, (W - 300) * r.score / 100), 16, 8); x.fillStyle = brand; x.fill();
      var s = MODES[mode].sex && names ? sexOf(labelWord(r)) : null;
      if (s) { x.fillStyle = muted; x.font = '600 22px system-ui, sans-serif'; x.textAlign = 'right'; x.fillText(SEX_WORD[s], W - 90, y + 124); x.textAlign = 'left'; }
      y += 162;
    });
    x.fillStyle = ink; x.font = '800 28px system-ui, sans-serif';
    x.fillText('For entertainment only. A symbolic reading, not a prediction.', 72, H - 118);
    x.fillStyle = brand; var fs = 32, foot = 'Compare names free at ' + SITE + '/name-checker';
    do { x.font = '700 ' + fs + 'px system-ui, sans-serif'; fs -= 1; } while (x.measureText(foot).width > W - 144 && fs > 18);
    x.fillText(foot, 72, H - 66);
    return c;
  }
  function fileName(ext) { return 'name-checker-' + mode + '-' + new Date().toISOString().slice(0, 10) + '.' + ext; }
  function download(blob, name) {
    var a = d.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    d.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function toBlob(c, type, q) { return new Promise(function (res) { c.toBlob(res, type, q); }); }

  /* ---------------- PDF report: a real .pdf file, built here with no library ----------------
     Each page is drawn on a canvas, saved as JPEG and wrapped in a minimal
     PDF. Simple, small, and opens in every PDF reader. */
  function reportPages() {
    var PW = 1240, PH = 1754, M = 96, pages = [], c, x, y;
    var brand = '#5b2d6f', ink = '#241d2b', muted = '#675d6d', line = '#ded4c9';
    function page() {
      c = d.createElement('canvas'); c.width = PW; c.height = PH; x = c.getContext('2d');
      x.fillStyle = '#ffffff'; x.fillRect(0, 0, PW, PH); x.fillStyle = brand; x.fillRect(0, 0, PW, 12);
      x.fillStyle = muted; x.font = '400 20px system-ui, sans-serif';
      x.fillText(SITE + '/name-checker  ·  page ' + (pages.length + 1), M, PH - 50);
      pages.push(c); y = M;
    }
    function need(h) { if (y + h > PH - 110) { page(); } }
    function text(t, font, color, gap, max) {
      x.font = font; var ls = wrapLines(x, t, max || PW - 2 * M), lh = parseInt(font.match(/(\d+)px/)[1], 10) * 1.35;
      ls.forEach(function (l) { need(lh); x.fillStyle = color; x.fillText(l, M, y + lh * 0.8); y += lh; }); y += gap || 0;
    }
    function rule() { need(20); x.fillStyle = line; x.fillRect(M, y + 6, PW - 2 * M, 2); y += 22; }
    page();
    text('MyNumerologyCharts', '700 28px Georgia, serif', brand, 10);
    text(MODES[mode].title, '700 54px Georgia, serif', ink, 6);
    text('For entertainment only. Scores are symbolic numerology, not facts or predictions about any person, baby, marriage or business.', '800 24px system-ui, sans-serif', ink, 10);
    var showDate = out.querySelector('[data-nc-showdate]').checked;
    text('Life Path ' + last.birth.lifePath + ', Birthday number ' + last.birth.birthday + (showDate ? ' (' + last.birth.trace + ')' : '') + '. System: ' + (last.system === 'chaldean' ? 'Chaldean' : 'Pythagorean') + '. Made ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '.', '400 24px system-ui, sans-serif', muted, 18);
    text('Ranking', '700 34px Georgia, serif', ink, 4);
    last.rows.forEach(function (r, i) {
      var s = MODES[mode].sex && names ? sexOf(labelWord(r)) : null;
      text((i + 1) + '.  ' + r.name + '   ' + r.score + '/100' + (s ? '   (' + SEX_WORD[s] + ')' : ''), '700 28px system-ui, sans-serif', ink, 0);
      text(r.reason, '400 22px system-ui, sans-serif', muted, 10);
    });
    rule();
    text('Detail for each name', '700 34px Georgia, serif', ink, 6);
    last.rows.forEach(function (r) {
      var n = r.numbers;
      need(150);
      text(r.name + ' — ' + r.score + '/100', '700 28px system-ui, sans-serif', brand, 2);
      text('Expression ' + n.expression.value + ' (total ' + n.totals.expression + ')   Soul Urge ' + n.soul.value + '   Personality ' + n.personality.value, '400 24px system-ui, sans-serif', ink, 4);
      r.parts.forEach(function (p) { text('• ' + p.what + ': ' + p.nameNumber + ' & ' + p.birthNumber + ' — ' + p.label + ' (' + p.weight + '%)', '400 22px system-ui, sans-serif', ink, 0); });
      text('Letter working: ' + n.working, '400 20px ui-monospace, monospace', muted, 6);
      if (r.variants && r.variants.length) { text('Higher-scoring spellings: ' + r.variants.map(function (v) { return v.name + ' (' + v.score + ')'; }).join(', '), '400 22px system-ui, sans-serif', ink, 6); }
      rule();
    });
    text('How the score works: each name number is paired with a birth number. Same number 100, same root 95, same traditional family (1-5-7, 2-4-8, 3-6-9) 82, contrast 55; weighted and shown on a 40 to 100 scale. Whether a name is a boy\'s or girl\'s name does not change its numbers. For entertainment only: it does not predict anything, and a name you love and can live with matters more than any score.', '400 20px system-ui, sans-serif', muted, 0);
    return pages;
  }
  function dataUrlBytes(u) { var b = atob(u.split(',')[1]), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) { a[i] = b.charCodeAt(i); } return a; }
  function makePdf(pages) {
    var enc = new TextEncoder(), parts = [], offsets = [], len = 0;
    function add(x) { var u = typeof x === 'string' ? enc.encode(x) : x; parts.push(u); len += u.length; }
    function obj(n, body) { offsets[n] = len; add(n + ' 0 obj\n'); body(); add('\nendobj\n'); }
    var W = 595.28, H = 841.89, n = pages.length, kids = [];
    for (var i = 0; i < n; i++) { kids.push((3 + i * 3) + ' 0 R'); }
    add('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, function () { add('<< /Type /Catalog /Pages 2 0 R >>'); });
    obj(2, function () { add('<< /Type /Pages /Count ' + n + ' /Kids [' + kids.join(' ') + '] >>'); });
    pages.forEach(function (c, i) {
      var p = 3 + i * 3, img = dataUrlBytes(c.toDataURL('image/jpeg', 0.86)), content = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im' + i + ' Do Q';
      obj(p, function () { add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im' + i + ' ' + (p + 1) + ' 0 R >> >> /Contents ' + (p + 2) + ' 0 R >>'); });
      obj(p + 1, function () { add('<< /Type /XObject /Subtype /Image /Width ' + c.width + ' /Height ' + c.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + img.length + ' >>\nstream\n'); add(img); add('\nendstream'); });
      obj(p + 2, function () { add('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream'); });
    });
    var total = 3 + n * 3, xref = len;
    add('xref\n0 ' + total + '\n0000000000 65535 f \n');
    for (var k = 1; k < total; k++) { add(String(offsets[k]).padStart(10, '0') + ' 00000 n \n'); }
    add('trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
    return new Blob(parts, { type: 'application/pdf' });
  }

  function say(t) { var m = out.querySelector('[data-nc-actmsg]'); if (m) { m.textContent = t; } }
  function savePic(ext) {
    toBlob(cardCanvas(), ext === 'jpg' ? 'image/jpeg' : 'image/png', 0.92).then(function (b) { download(b, fileName(ext)); say('Image saved to your downloads.'); track('save_' + ext); });
  }
  /* Phone share sheet with the image attached (WhatsApp, Messages, Instagram...).
     Falls back to sharing just the link, then to copying it. */
  function doShare() {
    var text = shareText(), url = shareUrl();
    toBlob(cardCanvas(), 'image/png').then(function (b) {
      var file = window.File ? new File([b], fileName('png'), { type: 'image/png' }) : null;
      var withFile = { title: MODES[mode].title, text: text + ' ' + url, files: file ? [file] : [] };
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) { return navigator.share(withFile).then(function () { say('Share options opened.'); track('share_native'); }); }
      if (navigator.share) { return navigator.share({ title: MODES[mode].title, text: text, url: url }).then(function () { say('Share options opened.'); track('share_native'); }); }
      return navigator.clipboard.writeText(text + ' ' + url).then(function () { say('Sharing is not available in this browser, so the summary and link were copied. Paste them into WhatsApp or an email.'); track('share_copy'); });
    }).catch(function (err) { if (!err || err.name !== 'AbortError') { say('Sharing was not completed. You can download the image instead.'); } });
  }
  function wire() {
    var act = out.querySelector('[data-nc-activate]');
    if (act) { act.addEventListener('click', function () { activate(out.querySelector('[data-nc-key]').value, out.querySelector('[data-nc-keymsg]')); }); }
    if (!out.querySelector('[data-nc-png]')) { return; }
    refreshLinks();
    out.querySelector('[data-nc-showdate]').addEventListener('change', refreshLinks);
    out.querySelector('[data-nc-preview]').addEventListener('click', showPreview);
    out.querySelector('[data-nc-png]').addEventListener('click', function () { savePic('png'); });
    out.querySelector('[data-nc-jpg]').addEventListener('click', function () { savePic('jpg'); });
    out.querySelector('[data-nc-pdf]').addEventListener('click', function () { say('Making your PDF...'); setTimeout(function () { download(makePdf(reportPages()), fileName('pdf')); say('PDF saved to your downloads.'); track('save_pdf'); }, 30); });
    out.querySelector('[data-nc-share]').addEventListener('click', doShare);
    out.querySelector('[data-nc-wa]').addEventListener('click', function () { track('share_whatsapp'); });
    out.querySelector('[data-nc-save]').addEventListener('click', function () { saveCurrent(); say('Saved privately on this device. Open it any time from Saved Shortlists.'); track('save_device'); });
    out.querySelector('[data-nc-saved]').addEventListener('click', showSaved);
    out.querySelector('[data-nc-copy]').addEventListener('click', function () {
      var u = shareUrl();
      (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { say(out.querySelector('[data-nc-showdate]').checked ? 'Link copied, including the date of birth.' : 'Private-safe link copied: it does not include the date of birth.'); }).catch(function () { window.prompt('Copy this link:', u); });
      track('share_copy');
    });
    var su = out.querySelector('[data-nc-signup]'); if (su) { su.addEventListener('click', function () { track('signup_click'); }); }
  }

  /* ---------------- run ---------------- */
  function run(opts) {
    var status = el('[data-nc-status]'), dob = el('[data-nc-dob]').value;
    var birth = N.birthNumbers(dob);
    if (!birth) { status.textContent = 'Please enter the date of birth first.'; el('[data-nc-dob]').focus(); return; }
    var typed = Array.prototype.map.call(list.querySelectorAll('input'), function (i) { return i.value.trim(); }).filter(function (v) { return /\p{L}/u.test(v); }).map(nice);
    list.querySelectorAll('input').forEach(function (i) { if (i.value.trim()) { i.value = nice(i.value); } });
    var system = el('[data-nc-system]').value, scoreMode = mode === 'business' ? 'business' : 'person';
    var first = nice(el('[data-nc-first]').value), surname = nice(el('[data-nc-surname]').value);
    status.textContent = '';
    var go = function () {
      var rows, suggested = false;
      if (mode === 'middle') {
        if (!first) { status.textContent = 'Enter the first name.'; el('[data-nc-first]').focus(); return; }
        var cands = typed.slice();
        if (!cands.length) {
          suggested = true;
          var pool = sex === 'g' ? names.top.g : sex === 'b' ? names.top.b : names.top.g.slice(0, 500).concat(names.top.b.slice(0, 500));
          cands = pool.filter(function (m) { return m.toLowerCase() !== first.toLowerCase().split(' ')[0]; }).slice(0, 600);
        }
        rows = cands.map(function (m, i) { var full = [first, nice(m), surname].filter(Boolean).join(' '); var r = N.scoreName(full, birth, 'person', system); r.middle = nice(m); r.pop = i; return r; });
        /* Equal scores: the more widely used name first, so suggestions feel familiar. */
        rows.sort(function (a, b) { return b.score - a.score || a.pop - b.pop; });
        if (suggested) { rows = rows.slice(0, 12); }
      } else {
        if (!typed.length) { status.textContent = 'Add at least one name.'; list.querySelector('input').focus(); return; }
        rows = typed.map(function (n) { return N.scoreName(n, birth, scoreMode, system); });
        if (mode !== 'married') { rows.sort(function (a, b) { return b.score - a.score; }); }
      }
      last = { birth: birth, dob: dob, system: system, rows: rows, inputNames: typed, first: first, surname: surname, suggested: suggested };
      render();
      if (!opts || !opts.quiet) { out.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      track(mode === 'middle' ? (suggested ? 'middle_suggest' : 'middle_rank') : 'rank');
    };
    if (MODES[mode].sex) { loadNames().then(go); } else { go(); }
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
  tool.querySelectorAll('[data-nc-mode]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.ncMode); }); });
  tool.querySelectorAll('[data-nc-sex]').forEach(function (b) { b.addEventListener('click', function () { setSex(b.dataset.ncSex); }); });
  el('[data-nc-add]').addEventListener('click', function () { addRow(''); list.lastElementChild.querySelector('input').focus(); });

  /* Start: a shared link (#s=...), a mini-checker prefill (?name=), or blank. */
  var shared = location.hash.indexOf('#s=') === 0 ? unb64(location.hash.slice(3)) : null;
  if (shared && MODES[shared.m]) {
    mode = shared.m; setRows(shared.n || []); setMode(mode); setSex(shared.x || 'any');
    el('[data-nc-system]').value = shared.y === 'chaldean' ? 'chaldean' : 'pythagorean';
    el('[data-nc-first]').value = shared.f || ''; el('[data-nc-surname]').value = shared.l || '';
    if (shared.d) { el('[data-nc-dob]').value = shared.d; run({ quiet: true }); }
    else { el('[data-nc-status]').textContent = 'Someone shared this shortlist with you. Add the date of birth to see the ranking.'; }
    track('share_open');
  } else {
    setRows([(params.get('name') || '').slice(0, 80)]);
    setMode(mode); setSex('any');
  }
  loadConfig().then(function () { if (last && paidMode()) { render(); } });
})();
