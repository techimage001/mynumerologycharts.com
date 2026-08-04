// My Numerology Charts — calculation engine
// Pure, deterministic. Shared by the Node generator and the browser app.
// No external data, no network. Numerology is a system of meaning, not science.

export const MASTERS = [11, 22, 33];
export const KARMIC_DEBTS = [13, 14, 16, 19];

const PYTHAGOREAN = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8
};
const VOWELS = new Set(['a','e','i','o','u']);

function digitsSum(n) {
  return String(n).split('').reduce((a, d) => a + (parseInt(d, 10) || 0), 0);
}

// Reduce a number to a single digit, preserving master numbers (11/22/33) by default.
export function reduce(n, keepMasters = true) {
  n = Math.abs(parseInt(n, 10) || 0);
  while (n > 9 && !(keepMasters && MASTERS.includes(n))) {
    n = digitsSum(n);
  }
  return n;
}

// Detect a karmic debt number surfacing in a raw (pre-reduction) total.
export function karmicDebtFrom(raw) {
  return KARMIC_DEBTS.includes(raw) ? raw : null;
}

function cleanName(name) {
  return (name || '').toLowerCase().replace(/[^a-z]/g, '');
}

// Y counts as a vowel only when it is not adjacent to another vowel.
function isVowelAt(letters, i) {
  const ch = letters[i];
  if (VOWELS.has(ch)) return true;
  if (ch === 'y') {
    const prev = letters[i - 1];
    const next = letters[i + 1];
    const prevVowel = prev && VOWELS.has(prev);
    const nextVowel = next && VOWELS.has(next);
    return !prevVowel && !nextVowel;
  }
  return false;
}

export function parseDOB(input) {
  // Accepts YYYY-MM-DD or a Date. Returns {y,m,d} or null.
  if (input instanceof Date) {
    return { y: input.getFullYear(), m: input.getMonth() + 1, d: input.getDate() };
  }
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(input).trim());
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

// Life Path: reduce month, day, year separately (keeping masters), then reduce the sum.
export function lifePath(dob) {
  const p = parseDOB(dob);
  if (!p) return null;
  const parts = [reduce(p.m), reduce(p.d), reduce(p.y)];
  const total = parts.reduce((a, b) => a + b, 0);
  return { value: reduce(total), parts, sum: total };
}

export function birthdayNumber(dob) {
  const p = parseDOB(dob);
  if (!p) return null;
  return reduce(p.d); // meaning is keyed to the calendar day (1..31)
}

function nameNumber(name, filter) {
  const letters = cleanName(name).split('');
  let raw = 0;
  letters.forEach((ch, i) => {
    if (filter(ch, i, letters)) raw += PYTHAGOREAN[ch] || 0;
  });
  return { value: reduce(raw), raw, karmicDebt: karmicDebtFrom(raw) };
}

export function expression(name) { return nameNumber(name, () => true); }
export function soulUrge(name)  { return nameNumber(name, (ch, i, l) => isVowelAt(l, i)); }
export function personality(name) { return nameNumber(name, (ch, i, l) => !isVowelAt(l, i)); }

// Personal Year: month + day + the year in question, reduced.
export function personalYear(dob, year) {
  const p = parseDOB(dob);
  if (!p) return null;
  const total = reduce(p.m) + reduce(p.d) + reduce(year);
  return reduce(total);
}
export function personalMonth(dob, year, month) {
  const py = personalYear(dob, year);
  return reduce(py + reduce(month));
}
export function personalDay(dob, year, month, day) {
  const pm = personalMonth(dob, year, month);
  return reduce(pm + reduce(day));
}

// Four Pinnacles and three Challenges across the life cycles.
export function pinnacles(dob) {
  const p = parseDOB(dob);
  if (!p) return null;
  const m = reduce(p.m), d = reduce(p.d), y = reduce(p.y);
  const first = reduce(m + d);
  const second = reduce(d + y);
  const third = reduce(first + second);
  const fourth = reduce(m + y);
  const firstLen = 36 - reduce(lifePath(dob).value);
  return {
    pinnacles: [first, second, third, fourth],
    challenges: [
      reduce(Math.abs(m - d), false),
      reduce(Math.abs(d - y), false),
      reduce(Math.abs(reduce(Math.abs(m - d), false) - reduce(Math.abs(d - y), false)), false),
      reduce(Math.abs(m - y), false)
    ],
    firstEnds: firstLen
  };
}

// Karmic lessons: which digits 1..9 are absent from the full name.
export function karmicLessons(name) {
  const present = new Set();
  cleanName(name).split('').forEach(ch => present.add(PYTHAGOREAN[ch]));
  const missing = [];
  for (let i = 1; i <= 9; i++) if (!present.has(i)) missing.push(i);
  return missing;
}

// Compatibility score + driver, synthesised from two life-path numbers.
// Groups reflect commonly-cited numerological temperaments.
const GROUP = { 1:'fire',2:'water',3:'air',4:'earth',5:'fire',6:'water',7:'water',8:'earth',9:'air',11:'water',22:'earth',33:'water' };
const HARMONY = {
  fire:{fire:3,air:4,water:2,earth:1},
  air:{air:3,fire:4,water:1,earth:2},
  water:{water:4,earth:3,fire:2,air:1},
  earth:{earth:3,water:3,air:2,fire:1}
};
export function compatibility(a, b) {
  const ga = GROUP[a] || 'earth', gb = GROUP[b] || 'earth';
  let score = HARMONY[ga][gb];
  if (a === b) score = Math.min(4, score + 1);            // same number: instinctive understanding
  if (Math.abs(reduce(a) - reduce(b)) === 0 && a !== b) score = Math.min(4, score + 1);
  const masters = MASTERS.includes(a) || MASTERS.includes(b);
  const label = ['Challenging','Workable','Strong','Excellent'][score - 1] || 'Workable';
  return { score, label, groups: [ga, gb], masters };
}

// Full chart for the browser app.
export function fullChart(name, dob, year = new Date().getFullYear()) {
  const lp = lifePath(dob);
  return {
    lifePath: lp ? lp.value : null,
    expression: expression(name).value,
    soulUrge: soulUrge(name).value,
    personality: personality(name).value,
    birthday: birthdayNumber(dob),
    personalYear: personalYear(dob, year),
    personalMonth: personalMonth(dob, year, new Date().getMonth() + 1),
    pinnacles: pinnacles(dob),
    karmicLessons: karmicLessons(name),
    karmicDebts: [expression(name), soulUrge(name), personality(name)]
      .map(x => x.karmicDebt).filter(Boolean)
  };
}
