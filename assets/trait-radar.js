/* Trait balance radar — additive enhancement.
   Reads the values the app already computes for the .trait-bars section and
   draws a radar/spider chart above them. Does not touch the app's own code. */
(function () {
  function buildRadar(traits) {
    var N = traits.length, cx = 150, cy = 148, R = 92;
    function pt(i, rad) { var a = -Math.PI / 2 + i * 2 * Math.PI / N; return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]; }
    var grid = '';
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      var p = '';
      for (var i = 0; i < N; i++) { var xy = pt(i, R * f); p += (i ? 'L' : 'M') + xy[0].toFixed(1) + ' ' + xy[1].toFixed(1); }
      grid += '<path d="' + p + 'Z" fill="none" stroke="var(--line)" stroke-width="1" opacity=".75"/>';
    });
    var axes = '', labels = '';
    for (var i = 0; i < N; i++) {
      var e = pt(i, R); axes += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="var(--line)" opacity=".6"/>';
      var l = pt(i, R + 20); labels += '<text x="' + l[0].toFixed(0) + '" y="' + l[1].toFixed(0) + '" font-size="10.5" font-weight="700" fill="var(--muted)" text-anchor="middle" dominant-baseline="middle">' + traits[i].label + '</text>';
    }
    var poly = '', dots = '';
    traits.forEach(function (t, i) { var xy = pt(i, R * Math.max(6, t.val) / 100); poly += (i ? 'L' : 'M') + xy[0].toFixed(1) + ' ' + xy[1].toFixed(1); dots += '<circle cx="' + xy[0].toFixed(1) + '" cy="' + xy[1].toFixed(1) + '" r="2.7" fill="var(--brand)"/>'; });
    return '<svg viewBox="-32 0 364 300" width="100%" style="max-width:360px;display:block;margin:0 auto" role="img" aria-label="Radar chart of your trait balance">' +
      grid + axes + '<path d="' + poly + 'Z" fill="var(--brand)" fill-opacity=".16" stroke="var(--brand)" stroke-width="2" stroke-linejoin="round"/>' + dots + labels + '</svg>';
  }
  function readTraits(tb) {
    var rows = tb.querySelectorAll(':scope > div'), out = [];
    for (var i = 0; i < rows.length; i++) {
      var span = rows[i].querySelector('span'); if (!span) continue;
      var bar = rows[i].querySelector('.bar-track i'); var val = 0;
      if (bar) { var m = /([\d.]+)\s*%/.exec(bar.getAttribute('style') || ''); if (m) val = parseFloat(m[1]); }
      out.push({ label: span.textContent.trim(), val: val });
    }
    return out;
  }
  function enhance() {
    var bars = document.querySelectorAll('.trait-bars');
    for (var i = 0; i < bars.length; i++) {
      var tb = bars[i];
      if (tb.previousElementSibling && tb.previousElementSibling.classList.contains('trait-radar')) continue;
      var traits = readTraits(tb);
      if (traits.length < 3) continue;
      var wrap = document.createElement('figure');
      wrap.className = 'trait-radar';
      wrap.style.cssText = 'margin:0 0 6px;padding:0';
      wrap.innerHTML = buildRadar(traits) + '<figcaption style="font-size:.86rem;color:var(--muted);text-align:center;max-width:420px;margin:10px auto 0;line-height:1.5">Each point is one trait, worked out from your numbers. The further it reaches toward the edge, the stronger that trait is for you. The bars below give the exact score.</figcaption>';
      tb.parentNode.insertBefore(wrap, tb);
    }
  }
  var obs = new MutationObserver(function () { enhance(); });
  function start() { enhance(); obs.observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
