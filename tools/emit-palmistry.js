const fs = require('fs');
const path = require('path');
const { page, wrapTables, esc, ROOT } = require('./gen-v28.js');
const { LINES } = require('./lib/palmistry-lines.js');
const { MOUNTS, SHAPES } = require('./lib/palmistry-mounts.js');

const HOME = { name: 'Home', href: 'index.html' };
const HUB  = { name: 'Palm Reading', href: 'palm-reading.html' };
const LHUB = { name: 'Palm Lines', href: 'palm-lines.html' };
const MHUB = { name: 'Palm Mounts', href: 'palm-mounts.html' };
const SHUB = { name: 'Hand Shapes', href: 'hand-shapes.html' };

const pages = [];
const lineKeys = Object.keys(LINES);
const mountKeys = Object.keys(MOUNTS);
const shapeKeys = Object.keys(SHAPES);

const pick = (arr, self, n) => arr.filter(k => k !== self).slice(0, n);

/* ---------- main hub ---------- */
pages.push({
  slug: 'palm-reading', title: 'Palm Reading', h1: 'Palm Reading and Palmistry Guide',
  eyebrow: 'Palmistry',
  desc: 'Palm reading guide: find every major line, mount and hand shape, with traditional meanings explained clearly and an honest account of what a palm cannot tell you.',
  crumbs: [HOME, HUB],
  answer: 'Palm reading, or palmistry, interprets the lines, mounts and shape of the hand as a description of character. It is a cultural tradition with a long history across India, China, Persia and Europe. It is not a predictive method: no study supports palmistry forecasts, and different traditions contradict each other on the same features.',
  faqLabel: 'palm reading',
  sections:
    `<section class="extractable"><h2>What are the main parts of a palm reading?</h2>`
    + `<p>Three groups, read together rather than separately.</p>`
    + `<table><thead><tr><th>Part of the hand</th><th>What tradition reads from it</th><th>Where to start</th></tr></thead><tbody>`
    + `<tr><td>The lines</td><td>Emotional style, thinking style, energy and direction</td><td><a href="palm-lines.html">Palm lines</a></td></tr>`
    + `<tr><td>The mounts</td><td>The fleshy pads, read as areas of emphasis</td><td><a href="palm-mounts.html">Palm mounts</a></td></tr>`
    + `<tr><td>The hand shape</td><td>A broad type from palm and finger proportion</td><td><a href="hand-shapes.html">Hand shapes</a></td></tr>`
    + `</tbody></table></section>`
    + `<section class="extractable"><h2>Which hand should you read?</h2>`
    + `<p>Most modern palmists read the dominant hand for current patterns and the non-dominant hand for what they describe as inherited tendencies. Traditions disagree, and some reverse it entirely.</p>`
    + `<p>Because no reading here is predictive, neither hand is more authoritative than the other. Comparing both and noticing where they differ is more interesting than trying to establish which one is correct.</p></section>`
    + `<section class="extractable"><h2>What palmistry cannot tell you</h2>`
    + `<p>This matters more than any individual reading, so it comes before the detail rather than after it.</p>`
    + `<p>A palm cannot predict how long you will live. The life line does not measure lifespan, and a short one means nothing. It cannot tell you whether or when you will marry; experienced hand analysts describe that claim as the least supportable in the whole tradition. It cannot indicate fertility or how many children you will have. It cannot diagnose any illness, physical or mental, and it cannot assess intelligence.</p>`
    + `<p>Palmistry is <a href="https://en.wikipedia.org/wiki/Palmistry" rel="nofollow">widely classed as a pseudoscience</a>, on two grounds: the lack of evidence for its predictions, and the contradictions between different teachings about the same features. We think that is accurate, and we would rather say so on the first page than bury it. Read what follows as a tradition worth understanding, and as entertainment.</p></section>`
    + `<section class="extractable"><h2>How does palmistry relate to numerology?</h2>`
    + `<p>They are separate systems. Numerology works from a birth date and name through arithmetic, and every result can be checked by redoing the calculation. Palmistry works from observation of the hand, and no two readers will describe the same palm identically.</p>`
    + `<p>That difference is worth stating plainly, because it affects how much weight each deserves. Our <a href="app.html">free numerology chart</a> shows every step of its working. A palm reading cannot offer that, and any site presenting one as equally precise is overstating it.</p></section>`,
  howto: { name: 'How do I read my own palm?', steps: [
    'Sit in good light and open your dominant hand flat, relaxed rather than stretched.',
    'Find the three major lines first: heart at the top, head in the middle, life curving round the thumb.',
    'Note each line length, depth and any forks or breaks, without interpreting yet.',
    'Look at the mounts, the fleshy pads below each finger and at the base of the thumb.',
    'Measure the palm against the middle finger to identify the hand shape.',
    'Read the meanings together as a description, then set the whole thing down and get on with your day.'
  ] },
  faqs: [
    ['Is palm reading real?', 'Palmistry is a genuine cultural tradition with centuries of history across India, China, Persia and Europe. It is not a reliable method of prediction. It is widely classed as a pseudoscience because there is no evidence its forecasts work and because different teachings contradict each other about the same features. Reading it as folklore and self-reflection is reasonable; treating it as information about your future is not.'],
    ['Which hand do you read in palmistry?', 'Most modern palmists read the dominant hand, the one you write with, for current life and active choices, and the non-dominant hand for what they call inherited tendencies. Some traditions reverse this and others read only one. Since no reading is predictive, no hand is authoritative. Looking at both and noticing where they differ is the more interesting approach.'],
    ['Can a palm reading predict the future?', 'No. There is no evidence that any feature of the hand forecasts events, and the claims that get made most confidently, about marriage, children, lifespan and wealth, are the least supportable in the tradition. Palm creases form before birth and change with age and hand use. Treat any specific prediction as invention, however assured it sounds.'],
    ['How long does it take to learn palm reading?', 'The basic vocabulary of three major lines, seven mounts and four hand shapes can be learned in an afternoon, which is roughly what this guide covers. Traditional apprenticeships took considerably longer, largely because reading a hand fluently is a performance skill. What cannot be learned in any amount of time is accuracy, since the underlying claims do not hold.'],
    ['Do palm lines change over time?', 'Yes, gradually. Creases deepen and alter with age, weight, hand use and skin condition. Palmists who work with this treat the change as meaningful and re-read hands periodically. A sceptical reading is that skin simply ages. There is no way to distinguish the two positions with evidence, which is a fair summary of the field.'],
    ['Is palmistry the same as chiromancy?', 'Yes. Chiromancy, chirology and cheirology are alternative names for the same practice, mostly appearing in older texts. The number of names reflects palmistry being a set of overlapping oral traditions rather than one codified system, which is the same reason interpretations of an identical feature differ so widely between sources.']
  ],
  related: [
    ['palm-reading-guide.html', 'Guided Palm Reading', 'Choose a line, choose what it looks like, and read the traditional meaning for that exact combination.'],
    ['palm-lines.html', 'All Palm Lines', 'Heart, head, life, fate, sun, marriage, children and intuition lines.'],
    ['hand-shapes.html', 'Hand Shapes', 'Earth, air, fire and water, and how to measure which you have.']
  ]
});

/* ---------- lines hub ---------- */
pages.push({
  slug: 'palm-lines', title: 'Palm Lines', h1: 'Palm Lines and What They Mean',
  eyebrow: 'Palmistry',
  desc: 'Palm lines explained: the three major lines plus fate, sun, marriage, children and intuition lines, where each sits and what tradition reads from it.',
  crumbs: [HOME, HUB, LHUB],
  answer: 'Palmistry recognises three major lines, the heart, head and life lines, and a number of minor ones including the fate, sun, marriage, children and intuition lines. The major lines appear on nearly every hand. The minor lines are frequently absent, and their absence carries no negative meaning.',
  faqLabel: 'palm lines',
  sections:
    `<section class="extractable"><h2>What are the main palm lines?</h2>`
    + `<table><thead><tr><th>Line</th><th>Where it runs</th><th>Traditionally read as</th></tr></thead><tbody>`
    + lineKeys.map(k => `<tr><td><a href="${k}.html">${esc(LINES[k].h1.replace(' in Palmistry',''))}</a></td><td>${esc(LINES[k].where.split('.')[0])}</td><td>${esc(LINES[k].answer.split('Traditional palmistry reads it as ')[1] ? LINES[k].answer.split('Traditional palmistry reads it as ')[1].split('.')[0] : LINES[k].kw)}</td></tr>`).join('')
    + `</tbody></table></section>`
    + `<section class="extractable"><h2>Which lines does every hand have?</h2>`
    + `<p>The heart, head and life lines appear on almost every hand and are usually the deepest. The fate, sun and intuition lines are frequently missing entirely, and that is unremarkable rather than significant.</p>`
    + `<p>This distinction is useful, because sources selling readings often treat an absent minor line as a problem to be explained. A large proportion of hands have no fate line and no sun line, including plenty belonging to people whose lives are visibly directed and visibly recognised.</p></section>`
    + `<section class="extractable"><h2>What do breaks, forks and islands mean?</h2>`
    + `<p>Traditional palmistry reads a break as a change, a fork as two things held at once, and an island as a period of divided attention. These readings are consistent enough across sources to be worth knowing.</p>`
    + `<p>The physical explanation is simpler: palm creases respond to how a hand folds, and they alter with age, weight, hydration and manual work. Most hands show irregularities somewhere. None of them indicates an illness, an accident or a date, and no reading can time an event from a mark on skin.</p></section>`,
  faqs: [
    ['What are the three major lines on the palm?', 'The heart line runs horizontally across the top of the palm below the fingers, the head line runs horizontally across the middle, and the life line curves around the base of the thumb toward the wrist. These three appear on almost every hand and are usually the deepest creases. Everything else, including the fate and sun lines, is classed as a minor line.'],
    ['Which palm line is the most important?', 'Traditional palmistry does not rank them, and readers differ on where to start. Classical practice often begins with the heart line because it sits highest and is easiest to trace. Since none of the lines carries predictive information, importance is a matter of the reader preference rather than a property of the hand.'],
    ['What does it mean if a palm line is missing?', 'For the major lines it is very unusual, and where it happens it is a structural variation in how the hand creases. For minor lines such as the fate and sun lines it is entirely common. Traditional readings describe absence neutrally, and sources that treat a missing minor line as a deficiency are usually building toward an offer.'],
    ['Do palm lines mean the same thing in every tradition?', 'No, and this is one of the strongest arguments for treating palmistry as folklore. Chinese, Indian and Western palmistry disagree about which lines matter, what individual features mean and even which hand to read. If a method produced reliable information, that level of disagreement between long-established traditions would be difficult to explain.'],
    ['Can palm lines indicate health problems?', 'No. Palmistry cannot identify any medical condition, and marks on a hand are features of skin rather than health signals. Some traditions, particularly in India, historically treated hands as health indicators, and that history is real, but the readings do not work. Any genuine health concern belongs with a doctor rather than a palm.'],
    ['Why do my two hands have different lines?', 'Hands differ because they are used differently, with the dominant hand usually showing deeper and more numerous creases from more frequent and forceful use. Palmistry interprets the difference as inherited tendencies against current life. The physical explanation is that one hand does more work, which accounts for the observation on its own.']
  ],
  related: [
    ['heart-line.html', 'Heart Line', 'The uppermost line, read as emotional style.'],
    ['life-line.html', 'Life Line', 'The most misunderstood line, and it does not measure lifespan.'],
    ['palm-reading-guide.html', 'Guided Palm Reading', 'Pick a line and its shape to read the traditional meaning directly.']
  ]
});

/* ---------- line pages ---------- */
for (const k of lineKeys) {
  const d = LINES[k];
  const sibs = pick(lineKeys, k, 2);
  pages.push({
    slug: k, title: d.title, h1: d.h1, eyebrow: 'Palm Lines',
    desc: d.desc.slice(0, 155), crumbs: [HOME, HUB, LHUB, { name: d.h1, href: k + '.html' }],
    answer: d.answer, faqLabel: d.kw,
    sections:
      `<section class="extractable"><h2>Where is the ${esc(d.kw)} on the palm?</h2><p>${esc(d.where)}</p></section>`
      + `<section class="extractable"><h2>What do different ${esc(d.kw)} shapes mean?</h2>`
      + `<table><thead><tr><th>Variation</th><th>Traditional reading</th></tr></thead><tbody>`
      + d.variations.map(v => `<tr><td>${esc(v[0])}</td><td>${esc(v[1])}</td></tr>`).join('')
      + `</tbody></table></section>`
      + `<section class="extractable"><h2>What the ${esc(d.kw)} cannot tell you</h2><p>${esc(d.limits)}</p></section>`,
    howto: { name: `How do I find my ${d.kw}?`, steps: [
      'Sit in good light with your dominant hand open and relaxed.',
      d.where.split('.')[0] + '.',
      'Note its length, depth and any forks or breaks before interpreting anything.',
      'Compare the same line on your other hand and notice any difference.',
      'Read the variation table above, then treat it as description rather than instruction.'
    ] },
    faqs: d.faqs,
    related: [
      ['palm-lines.html', 'All Palm Lines', 'Every major and minor line side by side, with where each one runs.'],
      [sibs[0] + '.html', LINES[sibs[0]].h1.replace(' in Palmistry', ''), 'A different line with a different traditional reading entirely.'],
      ['palm-reading-guide.html', 'Guided Palm Reading', 'Choose this line and its shape to read the matching interpretation.']
    ]
  });
}

/* ---------- mounts hub ---------- */
pages.push({
  slug: 'palm-mounts', title: 'Palm Mounts', h1: 'Palm Mounts in Palmistry',
  eyebrow: 'Palmistry',
  desc: 'Palm mounts explained: the seven fleshy pads of the hand, where each sits, what tradition reads from a raised or flat mount, and why size reflects muscle.',
  crumbs: [HOME, HUB, MHUB],
  answer: 'The mounts are the fleshy pads of the palm, named after classical planets: Venus at the thumb, Jupiter, Saturn, Apollo and Mercury below the four fingers, Mars in two places, and Luna at the base opposite the thumb. Traditional palmistry reads a raised mount as emphasis in that area of life.',
  faqLabel: 'palm mounts',
  sections:
    `<section class="extractable"><h2>Where is each mount on the hand?</h2>`
    + `<table><thead><tr><th>Mount</th><th>Location</th><th>Traditionally read as</th></tr></thead><tbody>`
    + mountKeys.map(k => `<tr><td><a href="${k}.html">${esc(MOUNTS[k].kw)}</a></td><td>${esc(MOUNTS[k].where.split('.')[0])}</td><td>${esc(MOUNTS[k].answer.split('reads it as ')[1] ? MOUNTS[k].answer.split('reads it as ')[1].split('.')[0] : '')}</td></tr>`).join('')
    + `</tbody></table></section>`
    + `<section class="extractable"><h2>How are the mounts assessed?</h2>`
    + `<p>By comparison rather than in isolation. A reader looks at which mounts stand highest relative to the others, and traditionally considers firmness as well as height.</p>`
    + `<p>The physical reality is that mount prominence largely reflects muscle and fat distribution in the hand, which varies with build, grip strength, manual work and age. A bricklayer and an office worker will show different mounts for reasons that have nothing to do with temperament, and that alone should set how much weight the readings deserve.</p></section>`
    + `<section class="extractable"><h2>Why are the mounts named after planets?</h2>`
    + `<p>Palmistry borrowed its naming from the same classical astrological framework that assigns qualities to planets: Venus for affection, Mars for courage, Mercury for communication. The names carry the symbolism rather than any connection to the planets themselves. Our <a href="numerology-and-astrology.html">numerology and astrology page</a> covers how these systems borrowed from one another.</p></section>`,
  faqs: [
    ['What are the mounts in palmistry?', 'They are the fleshy raised pads of the palm, named after classical planets. Venus sits at the base of the thumb, Jupiter, Saturn, Apollo and Mercury below the index, middle, ring and little fingers respectively, Luna at the base of the palm opposite the thumb, and Mars in two separate places with a plain between them. Traditional palmistry reads a prominent mount as emphasis.'],
    ['How do you tell if a mount is developed?', 'By comparing the mounts with each other rather than judging one alone. Look across the pads beneath all four fingers and notice which stands highest. Traditional readers also press gently to assess firmness. Mount prominence largely reflects muscle and fat distribution, which varies with build and manual work, so the comparison is symbolic rather than diagnostic.'],
    ['Which mount is the most important?', 'Traditional palmistry does not rank them, though Venus and Luna receive the most attention because they are usually the largest and sit opposite each other. Readers often compare those two as a pair. Since none of the mounts carries predictive information, importance reflects the reader habit rather than any property of the hand.'],
    ['What does a flat mount mean?', 'Traditional palmistry reads a flat mount as that quality being less emphasised rather than absent, and classical sources generally present this neutrally. Some modern writing frames flat mounts as deficiencies, which reflects the tone of the writer. Since mount height is largely muscle, a flat mount is a structural feature rather than a statement about character.'],
    ['Can mounts change over time?', 'Yes, more readily than the hand shape. Muscle bulk, weight and skin all change with age, activity and manual work, and the mounts change with them. This is worth knowing, because it undercuts any reading presenting the mounts as a fixed map. A hand that does heavy work for a decade will show different mounts at the end of it.'],
    ['Why are there two Mars mounts?', 'Traditional palmistry splits the Mars symbolism across two areas: Lower Mars above the thumb inside the life line, and Upper Mars on the opposite edge below the Mercury mount, with the Plain of Mars in the hollow between them. Sources disagree about the naming and about which is which, which indicates how settled this part of the tradition is.']
  ],
  related: [
    ['mount-of-venus.html', 'Mount of Venus', 'The largest mound on the hand, at the base of the thumb.'],
    ['mount-of-moon.html', 'Mount of Moon', 'Luna, sitting opposite Venus and traditionally read against it.'],
    ['palm-reading.html', 'Palm Reading Guide', 'How the mounts fit alongside the lines and the hand shape.']
  ]
});

/* ---------- mount pages ---------- */
for (const k of mountKeys) {
  const d = MOUNTS[k];
  const sibs = pick(mountKeys, k, 2);
  pages.push({
    slug: k, title: d.title, h1: d.h1, eyebrow: 'Palm Mounts',
    desc: d.desc.slice(0, 155), crumbs: [HOME, HUB, MHUB, { name: d.h1, href: k + '.html' }],
    answer: d.answer, faqLabel: d.kw,
    sections:
      `<section class="extractable"><h2>Where is the ${esc(d.kw)}?</h2><p>${esc(d.where)}</p></section>`
      + `<section class="extractable"><h2>What do different ${esc(d.kw)} variations mean?</h2>`
      + `<table><thead><tr><th>Variation</th><th>Traditional reading</th></tr></thead><tbody>`
      + d.variations.map(v => `<tr><td>${esc(v[0])}</td><td>${esc(v[1])}</td></tr>`).join('')
      + `</tbody></table></section>`
      + `<section class="extractable"><h2>What the ${esc(d.kw)} cannot tell you</h2><p>${esc(d.limits)}</p></section>`,
    faqs: d.faqs,
    related: [
      ['palm-mounts.html', 'All Palm Mounts', 'Every mount and its location in one table.'],
      [sibs[0] + '.html', MOUNTS[sibs[0]].kw, 'A different mount with a different traditional emphasis.'],
      ['palm-reading.html', 'Palm Reading Guide', 'How the mounts sit alongside the lines and hand shape.']
    ]
  });
}

/* ---------- shapes hub ---------- */
pages.push({
  slug: 'hand-shapes', title: 'Hand Shapes in Palmistry', h1: 'Hand Shapes in Palmistry',
  eyebrow: 'Palmistry',
  desc: 'Hand shapes in palmistry: earth, air, fire and water, how to measure which you have, what each traditionally means and why proportion is inherited.',
  crumbs: [HOME, HUB, SHUB],
  answer: 'Palmistry sorts hands into four types named after the classical elements, using the proportion of palm to fingers. Earth has a square palm and short fingers, air a square palm and long fingers, fire an oblong palm and short fingers, water an oblong palm and long fingers.',
  faqLabel: 'hand shapes',
  sections:
    `<section class="extractable"><h2>What are the four hand shapes?</h2>`
    + `<table><thead><tr><th>Hand type</th><th>Palm shape</th><th>Finger length</th><th>Traditionally read as</th></tr></thead><tbody>`
    + `<tr><td><a href="earth-hand.html">Earth</a></td><td>Square</td><td>Short</td><td>Practicality and steadiness</td></tr>`
    + `<tr><td><a href="air-hand.html">Air</a></td><td>Square</td><td>Long</td><td>Curiosity and communication</td></tr>`
    + `<tr><td><a href="fire-hand.html">Fire</a></td><td>Oblong</td><td>Short</td><td>Energy and momentum</td></tr>`
    + `<tr><td><a href="water-hand.html">Water</a></td><td>Oblong or oval</td><td>Long</td><td>Sensitivity and receptiveness</td></tr>`
    + `</tbody></table></section>`
    + `<section class="extractable"><h2>How do I measure my hand shape?</h2>`
    + `<p>Measure the palm from the wrist crease to the base of the fingers, and measure its width at the widest point. If those are roughly equal the palm is square; if the height is clearly greater it is oblong.</p>`
    + `<p>Then compare the middle finger length with the palm height. Shorter than the palm counts as short fingers; close to or exceeding it counts as long. Palm shape is the primary distinction and finger length the secondary one, which is why the two square types and the two oblong types pair together.</p></section>`
    + `<section class="extractable"><h2>Does hand shape determine personality?</h2>`
    + `<p>No. Palm and finger proportion is set by bone growth and inherited, fixed once growth finishes. It does not correlate with temperament, aptitude or interests, and no study has found that it does.</p>`
    + `<p>The four descriptions are broad enough that most people recognise something of themselves in at least two of them, which is worth noticing when a type feels accurate. Read the classification as a traditional way of grouping hands, not as a personality test.</p></section>`,
  faqs: [
    ['What are the four hand shapes in palmistry?', 'Earth, air, fire and water, named after the classical elements. The classification uses two measurements: whether the palm is square or oblong, and whether the fingers are short or long relative to the palm height. Earth is square with short fingers, air square with long, fire oblong with short, and water oblong with long fingers.'],
    ['How do I know which hand shape I have?', 'Measure the palm from the wrist crease to the base of the fingers, then measure its width at the widest point. Roughly equal means a square palm; clearly taller means oblong. Then compare your middle finger with the palm height. Shorter counts as short fingers, similar or longer counts as long. Those two answers give the type.'],
    ['Does hand shape reveal personality?', 'No. Palm and finger proportion is determined by bone growth and inherited, and no study has connected it to temperament, aptitude or interests. The four traditional descriptions are broad enough that most people recognise themselves in more than one, which is a familiar effect and not evidence. Treat the classification as a way of grouping hands.'],
    ['Can my hand shape change?', 'The underlying proportion of palm to fingers is fixed once growth is complete and does not change afterwards. Skin, flexibility, mount prominence and line depth all do change with age and hand use. This makes hand shape the most stable feature in palmistry and the mounts among the least, which is rarely mentioned in readings.'],
    ['What if my hands do not fit any type?', 'That is common. The four-type system uses thresholds that different sources set differently, so a hand near a boundary can be classified two ways depending on which guide you read. Some palmists add mixed types to cover it. A system needing extra categories for the cases it does not fit is worth treating loosely.'],
    ['Are hand shapes related to astrology elements?', 'They borrow the same four-element vocabulary, and the associations broadly match: fire for energy, water for sensitivity, earth for practicality, air for intellect. The borrowing is a naming convention rather than a connection between the systems. Palmistry, astrology and numerology have exchanged terminology for centuries without sharing any method.']
  ],
  related: [
    ['earth-hand.html', 'Earth Hand', 'Square palm, short fingers, and the fewest lines of the four types.'],
    ['water-hand.html', 'Water Hand', 'Long oval palm with long fingers and typically many fine lines.'],
    ['palm-reading.html', 'Palm Reading Guide', 'How hand shape fits alongside the lines and mounts.']
  ]
});

/* ---------- shape pages ---------- */
for (const k of shapeKeys) {
  const d = SHAPES[k];
  const sibs = pick(shapeKeys, k, 2);
  pages.push({
    slug: k, title: d.title, h1: d.h1, eyebrow: 'Hand Shapes',
    desc: d.desc.slice(0, 155), crumbs: [HOME, HUB, SHUB, { name: d.h1, href: k + '.html' }],
    answer: d.answer, faqLabel: d.kw,
    sections:
      `<section class="extractable"><h2>How do I identify an ${esc(d.kw)}?</h2><p>${esc(d.identify)}</p></section>`
      + d.reads.map(r => `<section class="extractable"><h2>${esc(r[0])} of the ${esc(d.kw)}</h2><p>${esc(r[1])}</p></section>`).join(''),
    howto: { name: `How do I measure for an ${d.kw}?`, steps: [
      'Measure your palm from the wrist crease to the base of the fingers.',
      'Measure the palm width at its widest point and compare the two.',
      'Measure your middle finger and compare it with the palm height.',
      'Match both answers against the four-type table to find your shape.'
    ] },
    faqs: d.faqs,
    related: [
      ['hand-shapes.html', 'All Four Hand Shapes', 'The measurement method and every type in one table.'],
      [sibs[0] + '.html', SHAPES[sibs[0]].h1.replace(' in Palmistry', ''), 'A different proportion with a different traditional reading.'],
      ['palm-lines.html', 'Palm Lines', 'How line patterns typically differ between hand types.']
    ]
  });
}

let n = 0;
for (const p of pages) {
  fs.writeFileSync(path.join(ROOT, p.slug + '.html'), wrapTables(page(p)), 'utf8');
  n++;
}
console.log('palmistry: wrote ' + n + ' pages');
module.exports = { palmSlugs: pages.map(p => p.slug) };
