/* MyNumerologyCharts sign-up, sign-in and account menu (v44).

   Its own file, so it works on every page that loads it, including /blog/.
   The server decides who is unlocked (api/status.php reads a secure cookie);
   this script only shows that state. Every message shown comes from the
   server, with its reason code, so nothing fails silently. */
(function () {
  'use strict';
  var d = document, API = '/api/';
  var HINT = 'mnc-acc-hint';
  var COST = 'No charge applies. No payment and no card details are ever requested.';
  var state = { verified: false, email: null, loaded: false };
  var listeners = [];
  var token = null, tokenReq = null, tokenAt = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ss(k, v) { try { if (v === undefined) { return sessionStorage.getItem(k); } if (v === null) { sessionStorage.removeItem(k); } else { sessionStorage.setItem(k, v); } } catch (e) { return null; } }
  function pagePath() { return location.pathname + location.search.replace(/([?&])(verified|signin|signup)=[^&]*&?/g, '$1').replace(/[?&]$/, ''); }

  /* ---------------- server calls ---------------- */
  function getJSON(url, opts) {
    opts = opts || {};
    opts.credentials = 'same-origin';
    opts.headers = Object.assign({ Accept: 'application/json' }, opts.headers || {});
    return fetch(url, opts).then(function (r) {
      return r.json().catch(function () { return { ok: false, reason: 'bad_response', message: 'The server sent an unexpected reply (HTTP ' + r.status + '). Please try again.' }; });
    });
  }
  function loadToken(force) {
    if (token && !force) { return Promise.resolve(token); }
    if (tokenReq && !force) { return tokenReq; }
    tokenReq = getJSON(API + 'form-token.php').then(function (j) { token = j && j.token ? j.token : null; if (token && (force || !tokenAt)) { tokenAt = Date.now(); } return token; })
      .catch(function () { token = null; return null; });
    return tokenReq;
  }
  function refresh() {
    return getJSON(API + 'status.php', { cache: 'no-store' }).then(function (j) {
      setState({ verified: !!(j && j.verified), email: (j && j.email) || null, loaded: true });
      return state;
    }).catch(function () { setState({ verified: state.verified, email: state.email, loaded: true }); return state; });
  }
  function setState(n) {
    var changed = n.verified !== state.verified || n.email !== state.email;
    state = n;
    ss(HINT, JSON.stringify({ verified: n.verified, email: n.email }));
    renderHeader();
    if (changed || n.loaded) { listeners.slice().forEach(function (fn) { try { fn(state); } catch (e) {} }); }
  }

  /* ---------------- header: Sign in button or initial avatar ---------------- */
  var slot = null;
  function ensureSlot() {
    if (slot) { return slot; }
    var inner = d.querySelector('.site-header .header-inner');
    if (!inner) { return null; }
    slot = d.createElement('div');
    slot.className = 'acc-slot';
    inner.appendChild(slot);
    /* The old in-menu button is replaced by this one, which shows on every screen size. */
    inner.querySelectorAll('.nav [data-open-signup]').forEach(function (b) { b.hidden = true; b.classList.add('acc-legacy'); });
    return slot;
  }
  function renderHeader() {
    var s = ensureSlot(); if (!s) { return; }
    if (!state.verified) {
      s.innerHTML = '<button class="btn btn-primary acc-signin" type="button">Sign in</button>';
      s.querySelector('button').addEventListener('click', function () { open('signin'); });
      return;
    }
    var letter = (state.email || '?').trim().charAt(0).toUpperCase();
    s.innerHTML = '<div class="account"><button class="account-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">' + esc(letter) + '</button>'
      + '<div class="account-menu" role="menu"><span class="acc-email">' + esc(state.email) + '</span><span class="acc-note">Downloads and sharing are unlocked on this browser.</span><hr class="acc-divider">'
      + '<button class="acc-signout" type="button" role="menuitem">Sign out</button></div></div>';
    var wrap = s.querySelector('.account'), btn = s.querySelector('.account-btn');
    btn.addEventListener('click', function (e) { e.stopPropagation(); var o = wrap.classList.toggle('open'); btn.setAttribute('aria-expanded', String(o)); });
    s.querySelector('.acc-signout').addEventListener('click', signOut);
  }
  d.addEventListener('click', function (e) { var w = slot && slot.querySelector('.account.open'); if (w && !w.contains(e.target)) { w.classList.remove('open'); w.querySelector('.account-btn').setAttribute('aria-expanded', 'false'); } });
  function signOut() {
    getJSON(API + 'logout.php', { method: 'POST' }).then(function () {
      setState({ verified: false, email: null, loaded: true });
      toast('Signed out on this browser.');
    });
  }

  /* ---------------- the box ---------------- */
  var modal = null, card = null, lastFocus = null, mode = 'signin', opts = {}, lastEmail = '', poll = null;
  function ensureModal() {
    if (modal) { return modal; }
    modal = d.getElementById('signupModal');
    if (!modal) { modal = d.createElement('div'); modal.id = 'signupModal'; modal.className = 'gate'; modal.hidden = true; d.body.appendChild(modal); }
    modal.classList.add('acc-modal');
    modal.innerHTML = '<div class="gate-card acc-card" role="dialog" aria-modal="true" aria-labelledby="accTitle"></div>';
    card = modal.firstChild;
    modal.addEventListener('click', function (e) { if (e.target === modal) { close(); } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal && !modal.hidden) { close(); } });
    return modal;
  }
  var COPY = {
    signin: { title: 'Welcome back', lede: 'Enter the email you confirmed before. We will email you a link that unlocks this device.', button: 'Email my sign-in link', switchText: 'New here?', switchLink: 'Create your account', to: 'signup' },
    signup: { title: 'Create your account', lede: 'Confirm your email and downloads and sharing stay unlocked on this device.', button: 'Email my confirmation link', switchText: 'Already signed up?', switchLink: 'Sign in instead', to: 'signin' },
    gate: { title: 'Keep saving and sharing', lede: 'You have used your three downloads and shares on this device. Confirm your email to keep going.', button: 'Email my confirmation link', switchText: 'Already signed up?', switchLink: 'Sign in instead', to: 'signin',
      list: ['Unlimited image and PDF downloads', 'Sharing to WhatsApp and other apps', 'Every Name Checker mode and the full working', 'Occasional numerology notes by email'] }
  };
  function draw(view) {
    var c = COPY[mode] || COPY.signin;
    var h = '<button class="modal-close" type="button" data-acc-close aria-label="Close">×</button><p class="acc-star" aria-hidden="true">✦</p><h2 id="accTitle">' + esc(c.title) + '</h2>';
    if (view === 'sent') {
      h += '<p class="acc-sent" role="status"><strong>Check your inbox</strong> (and your spam folder). We just sent a link to <strong>' + esc(lastEmail) + '</strong>. Open it on this device and everything unlocks here.</p>'
        + '<p class="acc-cost">' + COST + '</p>'
        + '<div class="acc-row"><button class="btn btn-primary" type="button" data-acc-resend>Resend the link</button></div>'
        + '<p class="acc-status" data-acc-status aria-live="polite"></p>'
        + '<p class="acc-switch"><button type="button" class="acc-link" data-acc-different>Use a different email</button></p>';
    } else {
      h += '<p class="acc-lede">' + esc(c.lede) + '</p>';
      if (c.list) { h += '<ul class="acc-list">' + c.list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
      h += '<p class="acc-cost">' + COST + '</p>'
        + '<form class="acc-form" novalidate><label class="sr-only" for="accEmail">Email address</label>'
        + '<input id="accEmail" type="email" name="email" autocomplete="email" maxlength="160" required placeholder="you@example.com" value="' + esc(lastEmail) + '">'
        + '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
        + '<button class="btn btn-primary" type="submit">' + esc(c.button) + '</button>'
        + '<p class="acc-status" data-acc-status aria-live="polite"></p></form>';
      if (opts.later) { h += '<p class="acc-switch"><button type="button" class="acc-link" data-acc-later>Maybe later</button></p>'; }
      h += '<p class="acc-switch">' + esc(c.switchText) + ' <button type="button" class="acc-link" data-acc-switch>' + esc(c.switchLink) + '</button></p>';
    }
    h += '<p class="acc-fine">We send one confirmation link, then occasional numerology notes by email. Every email has a link to delete your address. See our <a href="/privacy.html">privacy policy</a>.</p>';
    card.innerHTML = h;
    card.querySelector('[data-acc-close]').addEventListener('click', close);
    var f = card.querySelector('.acc-form');
    if (f) { f.addEventListener('submit', function (e) { e.preventDefault(); submit(f.email.value, f.website.value, f.querySelector('button[type=submit]')); }); }
    var sw = card.querySelector('[data-acc-switch]'); if (sw) { sw.addEventListener('click', function () { mode = c.to; opts = {}; draw('form'); focusInput(); }); }
    var lt = card.querySelector('[data-acc-later]'); if (lt) { lt.addEventListener('click', function () { var fn = opts.later; close(); if (fn) { fn(); } }); }
    var rs = card.querySelector('[data-acc-resend]'); if (rs) { rs.addEventListener('click', function () { submit(lastEmail, '', rs); }); }
    var df = card.querySelector('[data-acc-different]'); if (df) { df.addEventListener('click', function () { stopPoll(); draw('form'); focusInput(); }); }
  }
  function focusInput() { setTimeout(function () { var i = card && card.querySelector('#accEmail'); if (i) { i.focus(); } }, 30); }
  function setStatus(msg, kind, reason) {
    var p = card && card.querySelector('[data-acc-status]'); if (!p) { return; }
    p.className = 'acc-status' + (kind ? ' is-' + kind : '');
    p.innerHTML = esc(msg) + (reason && kind === 'error' ? ' <small>(code: ' + esc(reason) + ')</small>' : '');
  }

  function submit(email, honeypot, btn, retried) {
    email = String(email || '').trim();
    if (!email || email.indexOf('@') < 1) { setStatus('Enter a valid email address.', 'error', 'invalid_email'); return; }
    lastEmail = email;
    if (btn) { btn.disabled = true; }
    setStatus('Sending…', 'busy');
    loadToken().then(function (t) {
      /* The server ignores anything sent within 3 seconds of the form loading; wait that out quietly. */
      var wait = tokenAt ? 3300 - (Date.now() - tokenAt) : 0;
      return new Promise(function (res) { setTimeout(function () { res(t); }, Math.max(0, wait)); });
    }).then(function (t) {
      return getJSON(API + 'subscribe.php', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, website: honeypot || '', js_token: t || '', page: pagePath(), mode: mode }) });
    }).then(function (j) {
      if (btn) { btn.disabled = false; }
      if (j && j.ok) { draw('sent'); startPoll(); return; }
      var reason = (j && j.reason) || 'unknown';
      /* Recover quietly from an expired form or a too-fast first click. */
      if (!retried && reason === 'token') { token = null; return loadToken(true).then(function () { submit(email, honeypot, btn, true); }); }
      if (!retried && reason === 'time_trap') { setStatus('One moment…', 'busy'); setTimeout(function () { submit(email, honeypot, btn, true); }, 3200); return; }
      setStatus((j && j.message) || 'Something went wrong. Please try again.', 'error', reason);
    }).catch(function () {
      if (btn) { btn.disabled = false; }
      setStatus('We could not reach the server. Check your connection and try again.', 'error', 'network');
    });
  }

  /* While "check your inbox" is showing, notice when the link is opened in another tab. */
  function startPoll() {
    stopPoll(); var n = 0;
    poll = setInterval(function () { if (++n > 150 || !modal || modal.hidden) { stopPoll(); return; } refresh().then(function (st) { if (st.verified) { onVerified(); } }); }, 4000);
  }
  function stopPoll() { if (poll) { clearInterval(poll); poll = null; } }
  function onVerified() {
    stopPoll();
    var fn = opts.onUnlock; close();
    toast('Email confirmed. Downloads and sharing are unlocked on this browser.');
    if (fn) { fn(); }
  }

  function open(m, o) {
    ensureModal();
    mode = COPY[m] ? m : 'signin'; opts = o || {};
    lastFocus = d.activeElement;
    draw('form');
    modal.hidden = false;
    d.documentElement.classList.add('acc-lock');
    loadToken();
    focusInput();
  }
  function close() {
    stopPoll();
    if (!modal || modal.hidden) { return; }
    modal.hidden = true;
    d.documentElement.classList.remove('acc-lock');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  /* ---------------- small notices ---------------- */
  function toast(msg) {
    var t = d.querySelector('.acc-toast');
    if (!t) { t = d.createElement('div'); t.className = 'acc-toast'; t.setAttribute('role', 'status'); d.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 5200);
  }

  /* ---------------- contact form: same page, result shown in place ---------------- */
  function enhanceContact() {
    d.querySelectorAll('form.contact-form').forEach(function (f) {
      if (f.dataset.accReady) { return; } f.dataset.accReady = '1';
      var st = f.querySelector('[data-contact-status]');
      if (!st) { st = d.createElement('p'); st.className = 'acc-status'; st.setAttribute('data-contact-status', ''); st.setAttribute('aria-live', 'polite'); f.appendChild(st); }
      loadToken();
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = f.querySelector('button[type=submit]'); if (btn) { btn.disabled = true; }
        st.className = 'acc-status is-busy'; st.textContent = 'Sending…';
        var data = {}; new FormData(f).forEach(function (v, k) { data[k] = v; }); data.page = pagePath();
        var go = function (retried) {
          loadToken().then(function (t) { var wait = tokenAt ? 3300 - (Date.now() - tokenAt) : 0; return new Promise(function (res) { setTimeout(function () { res(t); }, Math.max(0, wait)); }); }).then(function (t) { data.js_token = t || ''; return getJSON(API + 'contact.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); })
            .then(function (j) {
              var reason = (j && j.reason) || 'unknown';
              if (!retried && reason === 'token') { token = null; return loadToken(true).then(function () { go(true); }); }
              if (!retried && reason === 'time_trap') { setTimeout(function () { go(true); }, 3200); return; }
              if (btn) { btn.disabled = false; }
              if (j && j.ok) { st.className = 'acc-status is-ok'; st.textContent = j.message; f.reset(); return; }
              st.className = 'acc-status is-error'; st.innerHTML = esc((j && j.message) || 'Please try again.') + ' <small>(code: ' + esc(reason) + ')</small>';
            }).catch(function () { if (btn) { btn.disabled = false; } st.className = 'acc-status is-error'; st.textContent = 'We could not reach the server. Check your connection and try again.'; });
        };
        go(false);
      });
    });
  }

  /* ---------------- start ---------------- */
  function start() {
    try { localStorage.removeItem('mnc-account'); } catch (e) {} /* the old browser-only sign-in */
    try { var h = JSON.parse(ss(HINT) || 'null'); if (h) { state.verified = !!h.verified; state.email = h.email || null; } } catch (e) {}
    renderHeader();
    d.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-open-signup]');
      if (b && !b.classList.contains('acc-legacy')) { e.preventDefault(); open(state.verified ? 'signin' : 'signup'); }
    });
    enhanceContact();
    var q = new URLSearchParams(location.search);
    var justVerified = q.get('verified') === '1';
    if (justVerified || q.has('signin') || q.has('signup')) {
      ['verified', 'signin', 'signup'].forEach(function (k) { q.delete(k); });
      var qs = q.toString();
      try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (e) {}
    }
    window.MNCAccount.ready = refresh().then(function (st) {
      if (justVerified && st.verified) { toast('Email confirmed. Downloads and sharing are unlocked on this browser.'); }
      else if (justVerified) { toast('Your email is confirmed. If this browser is not unlocked, sign in once more.'); }
      if (!st.verified && wantSignin) { open('signin'); } else if (!st.verified && wantSignup) { open('signup'); }
      return st;
    });
    window.addEventListener('focus', function () { if (state.loaded) { refresh(); } });
  }

  window.MNCAccount = {
    get state() { return state; },
    ready: Promise.resolve(state),
    open: open,
    close: close,
    refresh: refresh,
    onChange: function (fn) { listeners.push(fn); },
    toast: toast
  };
  /* Opening the box from a link such as /app.html?signin=1 */
  var wantSignin = /[?&]signin=1\b/.test(location.search), wantSignup = /[?&]signup=1\b/.test(location.search);
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', go); } else { go(); }
  function go() { start(); }
})();
