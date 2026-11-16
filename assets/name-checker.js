/* MyNumerologyCharts Name Checker (v42)
   ------------------------------------------------------------------
   Everything is calculated in the browser. Nothing typed here is sent
   anywhere except the licence key, which goes to our own
   api/name-checker-unlock.php so it can be checked with Lemon Squeezy.

   Scoring (shown to the visitor on the page, never hidden):
     each pairing of a name number with a birth number scores
       100  same number
        95  same root (e.g. master 11 with 2)
        82  same traditional family (1-5-7, 2-4-8, 3-6-9)
        55  contrast
     a weighted average of the pairings is rescaled to 40-100, so a
     name full of contrast is never presented as "bad".
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var MASTER = [11, 22, 33];
  var PYTH = {A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9};
  var CHAL = {A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8};
  var FAMILY = {1:'1-5-7',5:'1-5-7',7:'1-5-7',2:'2-4-8',4:'2-4-8',8:'2-4-8',3:'3-6-9',6:'3-6-9',9:'3-6-9'};
  var VOWELS = 'AEIOU';

  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase(); }
  function lettersOf(s) { return norm(s).replace(/[^A-Z]/g, '').split(''); }
  function digitSum(n) { return String(n).split('').reduce(function (a, b) { return a + Number(b); }, 0); }
  function reduce(n) { var steps = [n]; while (n > 9 && MASTER.indexOf(n) < 0) { n = digitSum(n); steps.push(n); } return { value: n, steps: steps }; }
  function root(n) { return n > 9 ? ((n - 1) % 9) + 1 : n; }

  function nameNumbers(name, system) {
    var map = system === 'chaldean' ? CHAL : PYTH;
    var L = lettersOf(name);
    var all = 0, vow = 0, con = 0, work = [];
    L.forEach(function (c) {
      var v = map[c] || 0; all += v; work.push(c + '=' + v);
      if (VOWELS.indexOf(c) >= 0) { vow += v; } else { con += v; }
    });
    return {
      letters: L.length,
      working: work.join(' '),
      totals: { expression: all, soul: vow, personality: con },
      expression: reduce(all), soul: reduce(vow), personality: reduce(con)
    };
  }

  function birthNumbers(iso) {
    var p = String(iso || '').split('-').map(Number);
    if (p.length !== 3 || !p[0] || !p[1] || !p[2]) { return null; }
    var y = p[0], m = p[1], d = p[2];
    var rm = reduce(m).value, rd = reduce(d).value, ry = reduce(digitSum(y)).value;
    var lp = reduce(rm + rd + ry);
    return { lifePath: lp.value, birthday: reduce(d).value, trace: 'Month ' + m + ' > ' + rm + ', day ' + d + ' > ' + rd + ', year ' + y + ' > ' + ry + ', total ' + (rm + rd + ry) + ' > ' + lp.steps.join(' > ') };
  }

  function pair(a, b) {
    if (a === b) { return { score: 100, label: 'Same number' }; }
    var ra = root(a), rb = root(b);
    if (ra === rb) { return { score: 95, label: 'Same root number' }; }
    if (FAMILY[ra] && FAMILY[ra] === FAMILY[rb]) { return { score: 82, label: 'Same ' + FAMILY[ra] + ' family' }; }
    return { score: 55, label: 'Contrast' };
  }

  var WEIGHTS = {
    person:   [['expression', 'lifePath', 45, 'Expression with Life Path'], ['soul', 'lifePath', 20, 'Soul Urge with Life Path'], ['expression', 'birthday', 20, 'Expression with Birthday number'], ['personality', 'birthday', 15, 'Personality with Birthday number']],
    business: [['expression', 'lifePath', 50, 'Name Expression with owner Life Path'], ['expression', 'birthday', 20, 'Name Expression with owner Birthday number'], ['soul', 'lifePath', 15, 'Name Soul Urge with owner Life Path'], ['personality', 'lifePath', 15, 'Name Personality with owner Life Path']]
  };

  function scoreName(name, birth, mode, system) {
    var n = nameNumbers(name, system);
    var w = WEIGHTS[mode === 'business' ? 'business' : 'person'];
    var sum = 0, total = 0, parts = [];
    w.forEach(function (row) {
      var a = n[row[0]].value, b = birth[row[1]];
      var p = pair(a, b);
      sum += p.score * row[2]; total += row[2];
      parts.push({ what: row[3], nameNumber: a, birthNumber: b, label: p.label, score: p.score, weight: row[2] });
    });
    var raw = sum / total;                      /* 55..100 */
    var score = Math.round(40 + ((raw - 55) / 45) * 60);
    return { name: name, score: Math.max(40, Math.min(100, score)), raw: raw, numbers: n, parts: parts, reason: reasonFor(parts, mode) };
  }

  function describe(p, who) {
    if (p.label === 'Same number') { return p.nameNumber + ' matches ' + who + ' ' + p.birthNumber + ' exactly'; }
    if (p.label === 'Same root number') { return p.nameNumber + ' shares a root with ' + who + ' ' + p.birthNumber; }
    if (p.label.indexOf('family') > 0) { return p.nameNumber + ' sits in the same ' + FAMILY[root(p.nameNumber)] + ' family as ' + who + ' ' + p.birthNumber; }
    return p.nameNumber + ' contrasts with ' + who + ' ' + p.birthNumber;
  }
  /* One honest sentence: the main pairing first, then the best supporting
     one if the main pairing is a contrast. */
  function reasonFor(parts, mode) {
    var owner = mode === 'business' ? "the owner's " : '';
    var who = function (p) { return owner + (p.birthNumber === undefined ? '' : (p.what.indexOf('Birthday') > 0 ? 'Birthday number' : 'Life Path')); };
    var nm = function (p) { return p.what.split(' with ')[0].replace(/^Name /, ''); };
    var main = parts[0];
    var s = nm(main) + ' ' + describe(main, who(main));
    if (main.score >= 82) { return s + '.'; }
    var best = parts.slice(1).filter(function (p) { return p.score >= 82; }).sort(function (a, b) { return b.score - a.score; })[0];
    if (best) { return s + ', but ' + nm(best) + ' ' + describe(best, who(best)) + '.'; }
    return s + ', and the other pairings contrast too: a stretching combination rather than an easy one.';
  }

  /* ---------- Spelling variants (paid) ----------
     Only spellings that keep the sound of the name. Every suggestion is
     still checked by a human: we say so on the page. */
  var RULES = [
    [/PH/g, 'F'], [/^F/, 'PH'], [/CK/g, 'K'], [/^C(?=[AOU])/, 'K'], [/^K/, 'C'],
    [/AY/, 'AI'], [/AI/, 'AY'], [/EY/, 'EI'], [/Y(?=[^AEIOU])/, 'I'], [/I(?=N$)/, 'Y'], [/YN$/, 'IN'],
    [/IE$/, 'Y'], [/Y$/, 'IE'], [/EY$/, 'IE'], [/IE$/, 'EY'], [/EE$/, 'IE'], [/AY$/, 'AE'],
    [/AH$/, 'A'], [/([^H])A$/, '$1AH'], [/ANNE$/, 'ANN'], [/ANN$/, 'ANNE'], [/LYN$/, 'LYNNE'], [/LYN$/, 'LINE'],
    [/^AA/, 'A'], [/^A(?=[^A])/, 'AA'],
    [/([BCDFGKLMNPRSTVZ])\1/, '$1'], [/^([^AEIOUY]*[AEIOUY])([LNRT])([AEIOUY])/, '$1$2$2$3']
  ];
  /* Spellings that do not look like names are thrown away. */
  var IMPLAUSIBLE = /II|UU|AAA|EEE|YY|HE$|([A-Z])\1\1|^[^AEIOUY]{3}/;
  function tokenVariants(tok) {
    var up = norm(tok), out = {};
    RULES.forEach(function (r) {
      var v = up.replace(r[0], r[1]);
      if (v && v !== up && v.length >= 2 && v.length <= up.length + 2 && /[AEIOUY]/.test(v) && !IMPLAUSIBLE.test(v)) { out[v] = 1; }
    });
    return Object.keys(out);
  }
  function titleCase(s) { return s.toLowerCase().replace(/(^|[\s'-])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); }); }

  function variantsFor(name, birth, mode, system, max) {
    var base = scoreName(name, birth, mode, system);
    var tokens = String(name).trim().split(/\s+/);
    var seen = {}, cands = [];
    seen[norm(name)] = 1;
    /* Business names: the honest tweaks are small additions, not respellings. */
    if (mode === 'business') {
      ['The ', ''].forEach(function (pre) {
        ['', ' Co', ' Studio', ' & Co', ' Ltd', ' Group'].forEach(function (suf) {
          var c = (pre + String(name).trim() + suf).trim();
          if (!seen[norm(c)]) { seen[norm(c)] = 1; cands.push(c); }
        });
      });
    } else {
      /* Only respell the first name: it is the one people choose. */
      tokenVariants(tokens[0]).forEach(function (v) {
        var c = [titleCase(v)].concat(tokens.slice(1)).join(' ');
        if (!seen[norm(c)]) { seen[norm(c)] = 1; cands.push(c); }
      });
    }
    return cands.map(function (c) { return scoreName(c, birth, mode, system); })
      .filter(function (r) { return r.score > base.score; })
      .sort(function (a, b) { return b.score - a.score || a.name.length - b.name.length; })
      .slice(0, max || 5);
  }

  window.MNCNames = { nameNumbers: nameNumbers, birthNumbers: birthNumbers, scoreName: scoreName, variantsFor: variantsFor, pair: pair, root: root, family: FAMILY };
})();
