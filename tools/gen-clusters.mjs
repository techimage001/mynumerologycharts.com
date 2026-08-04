// Generates distinct content pages for the missing high-traffic clusters and
// merges them into data/pages.json. Content is built from real per-entity data
// (numbers, angel numbers, personal years, birthdays), so every page is
// distinct by construction — not keyword-swapped boilerplate.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NUMBERS } from './lib/numbers.mjs';
import { ANGEL } from './lib/angel.mjs';
import { PERSONAL_YEAR } from './lib/personalYear.mjs';
import { BIRTHDAY } from './lib/birthday.mjs';
import { reduce, compatibility } from './lib/engine.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ul = arr => `<ul>${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const clampDesc = s => { s = s.replace(/\s+/g,' ').trim(); if (s.length>158) s = s.slice(0,155).replace(/\s+\S*$/,'')+'…'; while (s.length<52) s += ' A clear, plain-English explanation.'; return s.slice(0,160); };
const ordinal = n => n+(['th','st','nd','rd'][(n%100>>3^1&&n%10)||0]||'th');

const pages = [];
const noDash = s => typeof s==='string' ? s.replace(/\s*\u2014\s*/g,', ').replace(/,\s*,/g,',').replace(/,\s*\./g,'.') : s;
const add = p => {
  const q = { index:true, ...p };
  for (const k of ['title','h1','description','answer','sections']) if (q[k]!==undefined) q[k]=noDash(q[k]);
  q.description = clampDesc(q.description);
  pages.push(q);
};

// ---- Life Path meaning pages (distinct from the generic number pages) ----
const CORE = [1,2,3,4,5,6,7,8,9,11,22,33];
for (const n of CORE) {
  const d = NUMBERS[n];
  add({
    slug:`life-path-number-${n}`, group:'Numbers',
    title:`Life Path Number ${n} Meaning: ${d.title.replace(/ \(.*/,'')}`,
    h1:`Life Path Number ${n}: ${d.title.replace(/ \(.*/,'')}`,
    description:`What Life Path Number ${n} means — the ${d.keyword}. Strengths, challenges, love and career for the ${n} life path.`,
    answer:`Life Path Number ${n} is ${d.title.replace(/ \(.*/,'').toLowerCase()} of numerology — ${d.essence}`,
    sections:
      `<section><h2>What Life Path ${n} means</h2><p>${esc(d.lens.lifePath)} ${esc(d.essence)}</p></section>`+
      `<section><h2>Strengths of Life Path ${n}</h2>${ul(d.strengths)}</section>`+
      `<section><h2>Challenges to watch</h2>${ul(d.challenges)}</section>`+
      `<section><h2>Life Path ${n} in love</h2><p>${esc(d.love)}</p></section>`+
      `<section><h2>Life Path ${n} careers</h2><p>${esc(d.career)}</p></section>`+
      (NUMBERS[n].master?`<section><h2>Is ${n} a master number?</h2><p>Yes. ${n} is a master number, carrying heightened potential and pressure. Its base single-digit energy is ${reduce(n,false)}, and many people with it grow into its full expression over time.</p></section>`:'')+
      `<section><h2>How the Life Path ${n} is calculated</h2><p>Your Life Path comes from your full date of birth: reduce the month, day and year to single digits (keeping master numbers 11, 22 and 33), then add those three results and reduce again. When that final total is ${n}, your Life Path is ${n}.</p></section>`
  });
}

// ---- Angel numbers ----
for (const [k, a] of Object.entries(ANGEL)) {
  const digitSum = k.split('').reduce((s,c)=>s+(+c||0),0);
  const base = reduce(digitSum, false);
  add({
    slug:`angel-number-${k}`, group:'Angel Numbers',
    title:`${k} Angel Number Meaning: ${a.theme.replace(/^(\w)/,c=>c.toUpperCase())}`,
    h1:`${k} Angel Number Meaning`,
    description:`Seeing ${k}? The ${k} angel number is about ${a.theme}. What it means, why you keep seeing it, and its message for love.`,
    answer:`The ${k} angel number is a sign of ${a.theme}. ${a.meaning}`,
    sections:
      `<section><h2>What the ${k} angel number means</h2><p>${esc(a.meaning)}</p></section>`+
      `<section><h2>Why you keep seeing ${k}</h2><p>${esc(a.seeing)}</p></section>`+
      `<section><h2>${k} and love</h2><p>${esc(a.love)}</p></section>`+
      `<section><h2>The numerology behind ${k}</h2><p>Reduced, the digits of ${k} add to ${base}, so it carries an undertone of the number ${base} — ${esc((NUMBERS[base]||NUMBERS[reduce(base)]||{keyword:''}).keyword)}. Angel numbers are a modern spiritual idea rather than part of classical Pythagorean numerology, so treat ${k} as gentle encouragement to notice a theme, not as a fixed prediction.</p></section>`
  });
}

// ---- Life Path compatibility pairs (45 unique combinations, 1–9) ----
for (let a=1;a<=9;a++) for (let b=a;b<=9;b++) {
  const A=NUMBERS[a], B=NUMBERS[b], c=compatibility(a,b);
  const same = a===b;
  add({
    slug:`life-path-${a}-and-${b}-compatibility`, group:'Compatibility',
    title:`Life Path ${a} and ${b} Compatibility in Numerology`,
    h1:`Life Path ${a} and ${b} Compatibility`,
    description:`How Life Path ${a} (${A.keyword}) and Life Path ${b} (${B.keyword}) match in love and life — a ${c.label.toLowerCase()} numerology pairing.`,
    answer:`Life Path ${a} and Life Path ${b} form a ${c.label.toLowerCase()} numerology match. ${same?`Two ${a}s share the same instincts — ${A.essence}`:`${A.title.replace(/ \(.*/,'')} meets ${B.title.replace(/ \(.*/,'')}, blending ${A.keyword} with ${B.keyword}.`}`,
    sections:
      `<section><h2>Life Path ${a} and ${b}: the overall match</h2><p>This is a <strong>${esc(c.label.toLowerCase())}</strong> pairing. ${same?esc(`Two Life Path ${a}s meet as mirrors — instinctive understanding, but also shared blind spots.`):esc(`It brings together the ${A.keyword} of a ${a} and the ${B.keyword} of a ${b}.`)}</p></section>`+
      `<section><h2>Where you click</h2><p>${esc(A.title.replace(/ \(.*/,''))} energy (${esc(A.keyword)}) can complement ${esc(B.title.replace(/ \(.*/,''))} energy (${esc(B.keyword)}). At your best, ${esc(A.love.replace(/^In love, /,''))}, while ${esc(B.love.replace(/^In love, /,'').toLowerCase())}</p></section>`+
      `<section><h2>Where you may clash</h2><p>Friction shows up when ${esc(A.challenges[0].toLowerCase())} meets ${esc(B.challenges[0].toLowerCase())}. ${same?'Sharing the same weaknesses means no one balances them — that is the main risk for a same-number match.':'Naming these differences early keeps them from hardening into resentment.'}</p></section>`+
      `<section><h2>Advice for a ${a} and ${b} pairing</h2><p>Lead with the strengths above and treat the clashes as things to manage, not verdicts. Numerology compatibility describes tendencies, not fate: two people with any pairing can thrive with honesty and effort.</p></section>`
  });
}

// ---- Birthday number pages (1–31) ----
for (let d=1; d<=31; d++) {
  const meaning = BIRTHDAY[d];
  const red = reduce(d, false);
  add({
    slug:`birthday-number-${d}`, group:'Numbers',
    title:`Birthday Number ${d}: Born on the ${ordinal(d)}`,
    h1:`Birthday Number ${d}: Born on the ${ordinal(d)}`,
    description:`Born on the ${ordinal(d)}? Your Birthday Number is ${d}. What it says about your natural talents, and how it colours your wider chart.`,
    answer:`If you were born on the ${ordinal(d)}, your Birthday Number is ${d}. ${meaning}`,
    sections:
      `<section><h2>What Birthday Number ${d} means</h2><p>${esc(meaning)}</p></section>`+
      `<section><h2>Born on the ${ordinal(d)}: your natural gift</h2><p>The Birthday Number is the specific talent you carry from birth. For the ${ordinal(d)} it reduces to ${red}, tying it to the core energy of the number ${red} — ${esc((NUMBERS[red]||{keyword:''}).keyword)}.</p></section>`+
      `<section><h2>How it fits your full chart</h2><p>Your Birthday Number is one of five core numbers. Read it alongside your Life Path, Expression, Soul Urge and Personality numbers rather than on its own — it adds nuance, not the whole picture.</p></section>`
  });
}

// ---- Personal Year 1–9 ----
for (let n=1;n<=9;n++) {
  const y = PERSONAL_YEAR[n];
  add({
    slug:`personal-year-${n}`, group:'Learn',
    title:`Personal Year ${n} in Numerology: ${y.headline}`,
    h1:`Personal Year ${n}: ${y.headline}`,
    description:`In a Personal Year ${n}? It is a year of ${y.theme}. What to focus on, what it means for love, and what to watch out for.`,
    answer:`A Personal Year ${n} is ${y.headline.toLowerCase()} — a year of ${y.theme}. ${y.meaning}`,
    sections:
      `<section><h2>What a Personal Year ${n} means</h2><p>${esc(y.meaning)}</p></section>`+
      `<section><h2>What to focus on</h2><p>${esc(y.focus)}</p></section>`+
      `<section><h2>Personal Year ${n} in love</h2><p>${esc(y.love)}</p></section>`+
      `<section><h2>What to watch</h2><p>${esc(y.watch)}</p></section>`+
      `<section><h2>How to find your Personal Year</h2><p>Add your birth month and birth day to the current year, then reduce to a single digit. When the result is ${n}, you are in a Personal Year ${n}. The cycle runs 1 through 9 and then begins again.</p></section>`
  });
}

// ---- Name numerology hub ----
add({
  slug:'name-numerology', group:'Learn',
  title:'Name Numerology: What Your Name Reveals',
  h1:'Name Numerology: What Your Name Reveals',
  description:'Name numerology turns the letters of your name into numbers. Learn how the Expression, Soul Urge and Personality numbers are found from your name.',
  answer:'Name numerology assigns each letter of your name a value from 1 to 9 and reduces the totals to reveal your Expression, Soul Urge and Personality numbers.',
  sections:
    `<section><h2>How name numerology works</h2><p>In the Pythagorean system each letter A–Z carries a number from 1 to 9 (A=1, B=2 … I=9, then J=1 again, and so on). Adding the values of the letters in your full birth name, and reducing the totals, produces your name-based core numbers.</p></section>`+
    `<section><h2>The three name numbers</h2><ul><li><strong>Expression (Destiny)</strong> — all the letters: your natural talents and life direction.</li><li><strong>Soul Urge (Heart's Desire)</strong> — the vowels: what you want most deeply.</li><li><strong>Personality</strong> — the consonants: how others first experience you.</li></ul></section>`+
    `<section><h2>Which name should you use?</h2><p>Traditionally the full name on your birth certificate is used for the core reading, because it reflects the identity you were given at the start. A current or changed name can be read separately to show how you present now.</p></section>`
});

// ---- Hub pages (kill orphans, build hub-and-spoke) ----
const linkList = (items) => `<div class="grid cards link-cards">${items.map(([href,label])=>`<article><h3><a href="${href}.html">${esc(label)}</a></h3></article>`).join('')}</div>`;
const slugsIn = re => pages.filter(p=>re.test(p.slug));

add({ slug:'angel-numbers', group:'Categories',
  title:'Angel Numbers: Meanings of Every Repeating Number',
  h1:'Angel Numbers and Their Meanings',
  description:'A complete guide to angel numbers — what 111, 222, 333, 444 and every repeating sequence mean, and why you keep seeing them.',
  answer:'Angel numbers are repeating number sequences many people notice and read as gentle guidance. This hub explains what each common sequence means and links to a full page for every one.',
  sections:`<section><h2>What are angel numbers?</h2><p>Angel numbers are repeating sequences — like 111, 444 or 1212 — that people notice on clocks, receipts and signs and read as small nudges of encouragement. They are a modern spiritual idea rather than part of classical numerology, best treated as prompts to reflect rather than predictions.</p></section><section><h2>Every angel number meaning</h2>${linkList(slugsIn(/^angel-number-/).map(p=>[p.slug,p.h1]))}</section>` });

add({ slug:'life-path-numbers', group:'Categories',
  title:'Life Path Numbers 1–9, 11, 22, 33: Full Meanings',
  h1:'Life Path Numbers and Their Meanings',
  description:'Every Life Path number explained — 1 through 9 plus the master numbers 11, 22 and 33. Strengths, challenges, love and career for each.',
  answer:'Your Life Path number is the single most important number in your chart. This hub links to a full meaning page for each Life Path, from 1 to 9 plus the master numbers 11, 22 and 33.',
  sections:`<section><h2>Find your Life Path meaning</h2><p>The Life Path is drawn from your date of birth and describes the road your life tends to follow. Choose your number below for its full meaning.</p>${linkList(slugsIn(/^life-path-number-/).map(p=>[p.slug,p.h1]))}</section>` });

add({ slug:'numerology-compatibility', group:'Categories',
  title:'Numerology Compatibility: All Life Path Pairings',
  h1:'Numerology Compatibility by Life Path',
  description:'How every Life Path number pairs with the others in love and life. Browse all Life Path compatibility combinations from 1 to 9.',
  answer:'Numerology compatibility compares two Life Path numbers to describe how their energies tend to blend. This hub links to every Life Path pairing so you can read your own match.',
  sections:`<section><h2>Browse every Life Path pairing</h2><p>Pick a combination to see where two Life Paths click, where they clash, and how to make the pairing work.</p>${linkList(slugsIn(/compatibility$/).map(p=>[p.slug,p.h1]))}</section>` });

add({ slug:'personal-years', group:'Categories',
  title:'Personal Year Numbers 1–9: The Nine-Year Cycle',
  h1:'Personal Year Numbers and the Nine-Year Cycle',
  description:'Numerology runs in a nine-year cycle. Find out what each Personal Year from 1 to 9 means and where you are in the cycle right now.',
  answer:'Numerology moves in a repeating nine-year cycle, and each Personal Year has its own theme. This hub links to a full page for every Personal Year from 1 to 9.',
  sections:`<section><h2>The nine-year cycle</h2><p>Each year of your life carries a Personal Year number from 1 to 9, then the cycle begins again. Choose a year below for its full meaning.</p>${linkList(slugsIn(/^personal-year-\d/).map(p=>[p.slug,p.h1]))}</section>` });

add({ slug:'birthday-numbers', group:'Categories',
  title:'Birthday Numbers: Meaning of Every Day, 1st to 31st',
  h1:'Birthday Numbers: Born on Each Day',
  description:'The day of the month you were born carries its own meaning. Find the Birthday Number for every date from the 1st to the 31st.',
  answer:'Your Birthday Number is simply the day of the month you were born, and each day carries a distinct natural talent. This hub links to a page for every date from the 1st to the 31st.',
  sections:`<section><h2>Choose your birth date</h2><p>Find the day of the month you were born for its Birthday Number meaning.</p>${linkList(slugsIn(/^birthday-number-/).map(p=>[p.slug, 'Born on the '+ordinal(+p.slug.split('-').pop())]))}</section>` });

// ---- Rewrite the thin number-1..33 pages with real meaning (positions angle, distinct from life-path-number-*) ----
for (const n of CORE) {
  const d = NUMBERS[n];
  add({
    slug:`number-${n}`, group:'Numbers',
    title:`Number ${n} in Numerology: Meaning and Symbolism`,
    h1:`The Meaning of the Number ${n} in Numerology`,
    description:`The number ${n} in numerology represents ${d.keyword}. What ${n} means as a Life Path, Expression, Soul Urge and Personality number.`,
    answer:`In numerology the number ${n} represents ${d.keyword}. ${d.essence}`,
    sections:
      `<section><h2>What does the number ${n} mean?</h2><p>${esc(d.essence)} At its heart, ${n} is the number of ${esc(d.keyword)}.</p></section>`+
      `<section><h2>The number ${n} across your chart</h2><p><strong>As a Life Path:</strong> ${esc(d.lens.lifePath)}</p><p><strong>As an Expression number:</strong> ${esc(d.lens.expression)}</p><p><strong>As a Soul Urge:</strong> ${esc(d.lens.soulUrge)}</p><p><strong>As a Personality number:</strong> ${esc(d.lens.personality)}</p></section>`+
      `<section><h2>Positive traits of ${n}</h2>${ul(d.strengths)}</section>`+
      `<section><h2>The shadow side of ${n}</h2>${ul(d.challenges)}</section>`+
      (d.master?`<section><h2>Why ${n} is a master number</h2><p>${n} is one of the three master numbers (11, 22 and 33). It carries a higher-octave version of the energy of ${reduce(n,false)}, with greater potential and greater pressure than the single digit alone.</p></section>`:`<section><h2>How the number ${n} is reached</h2><p>In a chart, ${n} appears whenever a calculation reduces to ${n}. Because it does not reduce further, ${n} stands as one of the nine core single-digit meanings in numerology.</p></section>`)
  });
}

// ---- Fix the one over-ceiling pair: rewrite personality-number-guide distinctly ----
add({ slug:'personality-number-guide', group:'Learn',
  title:'Personality Number Guide: How Others First See You',
  h1:'Personality Number Guide',
  description:'Your Personality number, from the consonants of your name, shapes the first impression you make. How to calculate it and what each number means.',
  answer:'Your Personality number comes from the consonants in your full birth name and describes the first impression you give, the outer layer others meet before they know you well.',
  sections:
    `<section><h2>What is a Personality number?</h2><p>Your Personality number is calculated from the consonants of your full birth name. It describes the outward impression you make and the side of yourself you show the world before people know you well.</p></section>`+
    `<section><h2>How to calculate your Personality number</h2><ol><li>Write out your full birth name.</li><li>Keep only the consonants.</li><li>Give each letter its value from 1 to 9 (B=2, C=3, D=4, F=6, and so on).</li><li>Add them and reduce to a single digit, keeping master numbers 11, 22 and 33.</li></ol></section>`+
    `<section><h2>Personality numbers 1 to 9 at a glance</h2><ul>${[1,2,3,4,5,6,7,8,9].map(k=>`<li><strong>${k}:</strong> ${esc(NUMBERS[k].lens.personality.replace(/^As a Personality number, /,'').replace(/^\w/,c=>c.toUpperCase()))}</li>`).join('')}</ul></section>`
});

// ---- 81-cell Life Path x Personal Year matrix (richly varied per cell) ----
for (let n=1;n<=9;n++) for (let m=1;m<=9;m++) {
  const d=NUMBERS[n], y=PERSONAL_YEAR[m];
  const s1=d.strengths[(m-1)%d.strengths.length], s2=d.strengths[m%d.strengths.length];
  const c1=d.challenges[(m-1)%d.challenges.length];
  add({
    slug:`life-path-${n}-personal-year-${m}`, group:'Categories',
    title:`Life Path ${n} in a Personal Year ${m} — Numerology`,
    h1:`Life Path ${n} in a Personal Year ${m}`,
    description:`A Life Path ${n} (${d.keyword}) moving through a Personal Year ${m}: ${y.headline.toLowerCase()}. Focus, love and cautions for the year.`,
    answer:`You are a Life Path ${n}, ${d.title.replace(/ \(.*/,'').toLowerCase()}, and this year is a Personal Year ${m}, ${y.headline.toLowerCase()}. So your ${d.keyword} meets a year of ${y.theme}.`,
    sections:
      `<section><h2>Life Path ${n} in a Personal Year ${m}</h2><p>You are a Life Path ${esc(String(n))}: ${esc(d.essence)} This twelve-month cycle runs as a Personal Year ${esc(String(m))}, ${esc(y.headline.toLowerCase())}. The meeting of your ${esc(d.keyword)} with a year of ${esc(y.theme)} shapes how the months ahead are likely to feel.</p></section>`+
      `<section><h2>What a ${m} year asks of a Life Path ${n}</h2><p>${esc(y.focus)} For a ${esc(String(n))} in particular, lean on being ${esc(s1.toLowerCase())} and ${esc(s2.toLowerCase())}, and keep a gentle watch on any pull toward being ${esc(c1.toLowerCase())}.</p></section>`+
      `<section><h2>Work and direction this year</h2><p>${esc(d.career)} Inside a Personal Year ${esc(String(m))} of ${esc(y.theme)}, that focus is best aimed at ${esc(y.focus.replace(/^\w/,c=>c.toLowerCase()))}</p></section>`+
      `<section><h2>Love and relationships</h2><p>${esc(d.love)} A Personal Year ${esc(String(m))} then adds its own colour: ${esc(y.love.replace(/^\w/,c=>c.toLowerCase()))}</p></section>`+
      `<section><h2>What to watch in a ${m} year</h2><p>${esc(y.watch)} Balanced against a ${esc(String(n))}\u2019s nature, the year rewards using your ${esc(d.keyword)} rather than forcing it.</p></section>`
  });
}

add({ slug:'life-path-personal-year', group:'Categories',
  title:'Life Path in Each Personal Year: Full Forecast Grid',
  h1:'Your Life Path in Each Personal Year',
  description:'How every Life Path number moves through each Personal Year. Browse all 81 Life Path and Personal Year combinations.',
  answer:'Every Life Path number experiences the nine Personal Years differently. This grid links to a page for all 81 combinations of Life Path 1 to 9 and Personal Year 1 to 9.',
  sections:`<section><h2>Find your Life Path and Personal Year</h2><p>Choose the combination of your Life Path number and your current Personal Year to see how the cycle is likely to feel for you.</p>${linkList(slugsIn(/^life-path-\d-personal-year-\d$/).map(p=>[p.slug,p.h1]))}</section>` });

// ---- Merge into pages.json (override thin pages, keep the rest, append the new) ----
const dataPath = path.join(root,'data','pages.json');
const existing = JSON.parse(fs.readFileSync(dataPath,'utf8'));
const usable = pages;
const genBySlug = new Map(usable.map(p=>[p.slug,p]));
const OVERRIDE = new Set([...CORE.map(n=>`number-${n}`), 'personality-number-guide']);
const merged = existing.map(e => (OVERRIDE.has(e.slug) && genBySlug.has(e.slug)) ? genBySlug.get(e.slug) : e);
const have = new Set(merged.map(p=>p.slug));
const fresh = usable.filter(p=>!have.has(p.slug));
fs.writeFileSync(dataPath, JSON.stringify([...merged, ...fresh], null, 2));
console.log(`existing pages: ${existing.length}`);
console.log(`overridden: ${[...OVERRIDE].filter(s=>have.has(s)).length}`);
console.log(`generated (new): ${fresh.length}`);
console.log(`total now: ${merged.length + fresh.length}`);
const byGroup={}; fresh.forEach(p=>byGroup[p.group]=(byGroup[p.group]||0)+1);
console.log('new by group:', JSON.stringify(byGroup));
