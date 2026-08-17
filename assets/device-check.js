/* On-device compatibility check. Runs against whatever engine displays it,
   which is the point: these behaviours cannot be measured from a desktop. */
(function () {
  var box = document.getElementById('dcResults');
  if (!box) return;
  var last = '';

  function supports(prop, val) { try { return CSS.supports(prop, val); } catch (e) { return false; } }

  function run() {
    var de = document.documentElement, rows = [];
    function add(name, ok, detail) { rows.push({ name: name, ok: ok, detail: detail }); }

    /* horizontal drift, the single most common mobile fault */
    var sx = window.scrollX; window.scrollTo(9999, window.scrollY);
    var drifted = window.scrollX; window.scrollTo(sx, window.scrollY);
    var drift = de.scrollWidth - de.clientWidth;
    add('Horizontal drift', drift === 0 && drifted === 0, drift === 0 ? 'none' : drift + 'px of overflow');

    /* table swipe */
    var t = document.querySelector('.table-scroll');
    if (t) {
      var can = t.scrollWidth > t.clientWidth;
      var before = t.scrollLeft; t.scrollLeft = 9999;
      var moved = t.scrollLeft > before; t.scrollLeft = before;
      add('Table scrolls sideways', !can || moved, can ? (moved ? 'scrollable, ' + (t.scrollWidth - t.clientWidth) + 'px of travel' : 'CANNOT scroll, content is cut off') : 'table fits, no scroll needed');
      var sec = t.parentElement;
      add('Heading stays put', !(sec.scrollWidth > sec.clientWidth), sec.scrollWidth > sec.clientWidth ? 'section scrolls too, heading will move' : 'only the table moves');
    }

    /* sticky header actually sticking */
    var h = document.querySelector('.site-header');
    if (h) add('Sticky header', getComputedStyle(h).position === 'sticky', getComputedStyle(h).position);

    /* viewport units */
    add('dvh supported', supports('height', '100dvh'), supports('height', '100dvh') ? 'dynamic viewport height available' : 'falls back to vh, address bar may overlap');
    add('Visual viewport API', !!window.visualViewport, window.visualViewport ? Math.round(window.visualViewport.height) + 'px visible' : 'not available');

    /* WebKit specifics */
    add('backdrop-filter', supports('-webkit-backdrop-filter', 'blur(4px)') || supports('backdrop-filter', 'blur(4px)'), supports('-webkit-backdrop-filter', 'blur(4px)') ? 'prefixed version in use' : (supports('backdrop-filter', 'blur(4px)') ? 'unprefixed' : 'unsupported, header blur will not render'));
    add('overflow-x: clip', supports('overflow-x', 'clip'), supports('overflow-x', 'clip') ? 'supported' : 'falls back to hidden');
    add('Safe-area insets', supports('padding-top', 'env(safe-area-inset-top)'), 'notch padding');
    add('Flex gap', supports('gap', '8px'), 'layout spacing');

    /* input zoom trap: iOS zooms if a focused input is under 16px */
    var inp = document.querySelector('input[type=email], input[type=text]');
    if (inp) {
      var fs = parseFloat(getComputedStyle(inp).fontSize);
      add('Input font size', fs >= 16, fs + 'px' + (fs >= 16 ? '' : ' — iOS will zoom on focus'));
    }

    /* reduced motion + colour scheme, for completeness */
    add('Reduced motion', true, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'user prefers reduced motion' : 'standard');

    /* informational only: not required, so not scored as pass or fail */
    var info = [
      ['Browser engine', /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Android/.test(navigator.userAgent) ? 'WebKit (Safari)' : 'not Safari'],
      [':has() selector', supports('selector(:has(a))') ? 'supported' : 'not supported, and not used by this site'],
      ['Touch points', String(navigator.maxTouchPoints || 0)]
    ];

    /* render */
    while (box.firstChild) box.removeChild(box.firstChild);
    var tbl = document.createElement('table');
    var th = document.createElement('thead');
    th.innerHTML = '<tr><th>Check</th><th>Result</th><th>Detail</th></tr>';
    tbl.appendChild(th);
    var tb = document.createElement('tbody');
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      [r.name, r.ok ? 'PASS' : 'FAIL', r.detail].forEach(function (v, i) {
        var td = document.createElement('td');
        td.textContent = v;
        if (i === 1) { td.style.fontWeight = '700'; td.style.color = r.ok ? '#18723b' : '#9d1c1c'; }
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    var wrap = document.createElement('div');
    wrap.className = 'table-scroll';
    wrap.setAttribute('tabindex', '0');
    wrap.appendChild(tbl);
    box.appendChild(wrap);

    var infoP = document.createElement('p');
    infoP.textContent = info.map(function (i) { return i[0] + ': ' + i[1]; }).join(' | ');
    box.appendChild(infoP);

    var env = document.createElement('p');
    env.textContent = 'Screen ' + window.innerWidth + ' x ' + window.innerHeight +
      ', pixel ratio ' + (window.devicePixelRatio || 1) +
      ', orientation ' + (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    box.appendChild(env);

    var ua = document.createElement('p');
    ua.style.fontSize = '.85rem';
    ua.style.wordBreak = 'break-word';
    ua.textContent = navigator.userAgent;
    box.appendChild(ua);

    last = 'DEVICE CHECK\n' + rows.map(function (r) {
      return (r.ok ? '[PASS] ' : '[FAIL] ') + r.name + ' — ' + r.detail;
    }).join('\n') + '\n' + info.map(function (i) { return '[INFO] ' + i[0] + ' — ' + i[1]; }).join('\n') + '\n\n' + env.textContent + '\n' + navigator.userAgent;
  }

  run();
  document.getElementById('dcRerun').addEventListener('click', run);
  document.getElementById('dcCopy').addEventListener('click', function () {
    var note = document.getElementById('dcCopied');
    function done() { note.hidden = false; setTimeout(function () { note.hidden = true; }, 2500); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(last).then(done, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = last; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });
  window.addEventListener('orientationchange', function () { setTimeout(run, 400); });
})();
