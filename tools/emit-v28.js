const fs = require('fs');
const path = require('path');
const { page, wrapTables, esc, KARMIC_DEBT, ROOT } = require('./gen-v28.js');

const pages = [];
const HOME = { name: 'Home', href: 'index.html' };
const KD_HUB = { name: 'Karmic Debt Numbers', href: 'karmic-debt-numbers.html' };
const NAME_HUB = { name: 'Name Numerology', href: 'name-numerology.html' };

/* ---------------- karmic debt hub ---------------- */
pages.push({
  slug: 'karmic-debt-numbers',
  title: 'Karmic Debt Numbers',
  h1: 'Karmic Debt Numbers Explained',
  eyebrow: 'Karmic Debt',
  desc: 'Karmic debt numbers 13, 14, 16 and 19 explained with the reduction rule that produces them, plain readings and a free chart that shows the working.',
  crumbs: [HOME, KD_HUB],
  answer: 'Karmic debt numbers are 13, 14, 16 and 19. They appear when a total in your chart passes through one of those four numbers before reducing to a single digit, so the route to the result matters as much as the result. Traditional numerology reads each as a theme for reflection, offered as entertainment rather than as prediction.',
  faqLabel: 'karmic debt numbers',
  sections:
    `<section class="extractable"><h2>What are the four karmic debt numbers?</h2>`
    + `<p>There are exactly four: 13, 14, 16 and 19. Each reduces to a single digit, and it is the intermediate total that carries the reading rather than the final digit.</p>`
    + `<table><thead><tr><th>Karmic debt number</th><th>Reduces to</th><th>Traditional theme</th></tr></thead><tbody>`
    + `<tr><td><a href="karmic-debt-13.html">13</a></td><td>4</td><td>Effort without immediate reward; shortcuts collapse</td></tr>`
    + `<tr><td><a href="karmic-debt-14.html">14</a></td><td>5</td><td>Freedom that needs a chosen structure</td></tr>`
    + `<tr><td><a href="karmic-debt-16.html">16</a></td><td>7</td><td>Rebuilding on a sounder footing</td></tr>`
    + `<tr><td><a href="karmic-debt-19.html">19</a></td><td>1</td><td>Independence that has to learn interdependence</td></tr>`
    + `</tbody></table></section>`
    + `<section class="extractable"><h2>How does a karmic debt number appear in a chart?</h2>`
    + `<p>It appears when an intermediate total is exactly 13, 14, 16 or 19 on the way to the final digit. This is why a calculator that shows only the answer cannot tell you whether one is present.</p>`
    + `<p>A worked example: a birth date totalling 31 reduces 3 + 1 to 4, and carries no karmic debt. A birth date totalling 13 also reduces to 4, but passes through 13 and therefore carries the reading. Same final digit, different route, different interpretation.</p>`
    + `<p>Five positions can carry one: the Life Path, the <a href="expression-number-calculator.html">Expression number</a>, the <a href="soul-urge-calculator.html">Soul Urge</a>, the <a href="personality-number-calculator.html">Personality number</a> and the <a href="birthday-number-calculator.html">Birthday number</a>. More than one position can carry a debt, and the positions are read separately rather than added together.</p></section>`
    + `<section class="extractable"><h2>How seriously should karmic debt be taken?</h2>`
    + `<p>Lightly. Numerology has no demonstrated ability to predict events, diagnose conditions or assess character, and karmic debt is no exception. The four themes are recognisable human patterns, which is what makes them feel accurate, and that familiarity is not evidence.</p>`
    + `<p>Two things are worth naming plainly. Some sites describe 16 in frightening language and then offer a paid remedy, which is a sales technique rather than a tradition. And no reliable figures exist for how common each number is, so any specific percentage you see quoted has been invented. Our <a href="methodology.html">methodology page</a> sets out how these pages are written and checked.</p></section>`,
  howto: { name: 'How do I find my karmic debt number?', steps: [
    'Open the free complete chart and enter your birth date and full birth name.',
    'Open the calculation details rather than reading only the final numbers.',
    'Look at each intermediate total in the reduction chain, not just the last digit.',
    'Note any total that is exactly 13, 14, 16 or 19 before it reduces.',
    'Read that number page for the theme, and treat it as reflection rather than instruction.'
  ] },
  faqs: [
    ['What are the karmic debt numbers in numerology?', 'There are four: 13, 14, 16 and 19. Each appears when a total in your chart passes through that exact number before reducing to a single digit. Thirteen reduces to 4, fourteen to 5, sixteen to 7 and nineteen to 1. Traditional numerology attaches a different reflective theme to each, and treats the route to the final digit as carrying meaning that the digit alone does not.'],
    ['How do I calculate my karmic debt number by hand?', 'Add your birth date the standard way and write down every intermediate total rather than only the final digit. Do the same for your Expression, Soul Urge, Personality and Birthday numbers. If any of those totals is exactly 13, 14, 16 or 19 before reducing, that position carries a karmic debt reading. The free chart on this site prints the whole reduction chain, which removes the arithmetic and the chance of missing one.'],
    ['Is it bad to have a karmic debt number?', 'No. Traditional numerology frames them as themes to reflect on rather than misfortunes, and numerology cannot predict outcomes at all. Nothing in a chart determines your health, finances, relationships or worth. Some sources describe karmic debt in alarming terms and then sell a remedy for it, which is worth recognising as a sales approach rather than a tradition worth paying for.'],
    ['Can you have more than one karmic debt number?', 'Yes. The five positions in a chart are calculated separately, so a Life Path might carry 13 while an Expression number carries 16. Traditional practice reads each in its own position rather than combining them into one total or treating several as compounding severity. Where more than one appears, the useful question is what theme they have in common.'],
    ['How common are karmic debt numbers?', 'No reliable frequency data exists, and any site quoting a specific percentage has invented it. What can be said is that most people do not carry one in most positions, because a karmic debt requires an exact intermediate total rather than merely a matching final digit. Whether one appears in your own chart is the only figure that matters for a reading.'],
    ['Do karmic debt numbers change over time?', 'No. They come from a fixed birth date and birth name, so the numbers themselves do not move. Some practitioners suggest a name change alters the name-based positions, and there is no basis for treating that as clearing a debt. Since the framework is symbolic entertainment, the sensible approach is to take the reflective value and ignore anything sold as a removal service.']
  ],
  related: [
    ['karmic-lessons-calculator.html', 'Karmic Lessons Calculator', 'A different idea entirely: karmic lessons come from letters missing in your name, not from intermediate totals.'],
    ['app.html', 'Free Complete Chart', 'Shows every intermediate total in the working, which is where a karmic debt becomes visible.'],
    ['master-numbers.html', 'Master Numbers 11, 22 and 33', 'The other case where an intermediate total is kept rather than reduced.']
  ]
});

/* ---------------- four karmic debt number pages ---------------- */
for (const [n, d] of Object.entries(KARMIC_DEBT)) {
  const others = Object.keys(KARMIC_DEBT).filter(x => x !== n);
  pages.push({
    slug: 'karmic-debt-' + n,
    title: d.h1,
    h1: d.h1,
    eyebrow: d.eyebrow,
    desc: `${d.kw} explained: how it appears in a chart, what the traditional reading says, and what it cannot tell you.`.slice(0, 155),
    crumbs: [HOME, KD_HUB, { name: d.h1, href: 'karmic-debt-' + n + '.html' }],
    answer: d.answer,
    faqLabel: d.kw,
    sections:
      `<section class="extractable"><h2>Where does karmic debt ${n} appear in a chart?</h2><p>${esc(d.where)}</p>`
      + `<p>It can sit in the Life Path, <a href="expression-number-calculator.html">Expression</a>, <a href="soul-urge-calculator.html">Soul Urge</a>, <a href="personality-number-calculator.html">Personality</a> or <a href="birthday-number-calculator.html">Birthday</a> position, and the theme is ${esc(d.theme)}.</p></section>`
      + d.reads.map(r => `<section class="extractable"><h2>${esc(r[0])}</h2><p>${esc(r[1])}</p></section>`).join(''),
    howto: { name: `How do I check for karmic debt ${n}?`, steps: [
      'Open the free complete chart and enter your birth date and full birth name.',
      'Open the calculation details so the full reduction chain is visible.',
      `Look for an intermediate total of exactly ${n} in any position.`,
      'Read the theme on this page as a reflective prompt rather than a forecast.'
    ] },
    faqs: d.faqs,
    related: [
      ['karmic-debt-numbers.html', 'All Four Karmic Debt Numbers', 'The reduction rule that produces all four, side by side in one table.'],
      ['karmic-debt-' + others[0] + '.html', 'Karmic Debt ' + others[0], 'A different intermediate total with a different theme entirely.'],
      ['app.html', 'Free Complete Chart', 'Prints every intermediate total, so a karmic debt is visible in the working.']
    ]
  });
}

/* ---------------- baby name numerology ---------------- */
pages.push({
  slug: 'baby-name-numerology',
  title: 'Baby Name Numerology',
  h1: 'Baby Name Numerology Calculator',
  eyebrow: 'Name Numerology',
  desc: 'Baby name numerology: work out the Expression, Soul Urge and Personality numbers for a name you are considering, with the full working shown and nothing charged.',
  crumbs: [HOME, NAME_HUB, { name: 'Baby Name Numerology', href: 'baby-name-numerology.html' }],
  answer: 'Baby name numerology converts a proposed name into numbers using the Pythagorean letter values, producing an Expression number from all letters, a Soul Urge from the vowels and a Personality number from the consonants. It is a way of exploring how a name sounds and feels rather than a method for choosing one, and it predicts nothing about the child.',
  faqLabel: 'baby name numerology',
  sections:
    `<section class="extractable"><h2>How is a baby name number calculated?</h2>`
    + `<p>Each letter takes a value from 1 to 9 under the Pythagorean system, the values are added, and the total reduces to a single digit unless it is 11, 22 or 33.</p>`
    + `<table><thead><tr><th>Number from the name</th><th>Letters used</th><th>Traditional reading</th></tr></thead><tbody>`
    + `<tr><td><a href="expression-number-calculator.html">Expression</a></td><td>Every letter</td><td>The overall character of the name</td></tr>`
    + `<tr><td><a href="soul-urge-calculator.html">Soul Urge</a></td><td>Vowels only</td><td>What the name suggests inwardly</td></tr>`
    + `<tr><td><a href="personality-number-calculator.html">Personality</a></td><td>Consonants only</td><td>How the name comes across outwardly</td></tr>`
    + `</tbody></table></section>`
    + `<section class="extractable"><h2>Should numerology decide a baby name?</h2>`
    + `<p>No, and we would rather say so than sell you the idea that it should. A name number cannot influence a child temperament, health, intelligence or future, and there is no evidence connecting the two.</p>`
    + `<p>What the calculation does offer is a structured way to compare a shortlist and notice which names you keep returning to. That is a real use, and it is an honest one. The practical considerations that actually matter, how a name is spelled, said, shortened and lived with, sit outside numerology entirely.</p></section>`
    + `<section class="extractable"><h2>What about the child birth date?</h2>`
    + `<p>The birth date produces the <a href="life-path-calculator.html">Life Path number</a>, which is fixed and cannot be chosen. Some traditions compare a proposed name number with the Life Path and describe the pairing as harmonious or not. Treat any such comparison as symbolic. A name that a family loves and can say easily is worth more than a number that a tradition calls compatible.</p></section>`,
  howto: { name: 'How do I check a baby name in numerology?', steps: [
    'Open the free chart tool and enter the full name you are considering.',
    'Add the birth date if the child has been born, or leave it out to score the name alone.',
    'Read the Expression, Soul Urge and Personality numbers together rather than separately.',
    'Repeat for each name on your shortlist and compare them side by side.',
    'Treat the result as one input among many, never as the deciding factor.'
  ] },
  faqs: [
    ['How do I calculate my baby name number?', 'Assign each letter its Pythagorean value from 1 to 9, add them, and reduce to a single digit unless the total is 11, 22 or 33. All letters give the Expression number, vowels alone give the Soul Urge and consonants alone give the Personality number. The free tool on this site does all three at once and prints the letter-by-letter working, so you can check the arithmetic rather than take a result on trust.'],
    ['Does a baby name number affect the child future?', 'No. There is no evidence that a name number influences temperament, health, intelligence, relationships or any outcome, and we will not suggest otherwise. Numerology is a symbolic system offered as entertainment. Choosing a name your family loves and can say comfortably matters considerably more than any number attached to it.'],
    ['Which name should I use, the full name or the short one?', 'Traditional practice uses the full name as it is first recorded, on the basis that this is the name given rather than the one adopted later. Some numerologists also calculate the everyday short form separately and compare the two. Both are conventions rather than rules, and neither has any greater claim to accuracy than the other.'],
    ['What is a lucky number for a baby name?', 'No number is lucky, and any source telling you one is has moved from tradition into sales. Different traditions favour different numbers, they contradict each other, and none has evidence behind it. If you enjoy the symbolism, treat the numbers as flavour rather than fortune, and choose the name you actually want the child to carry.'],
    ['Can I change a name later to change its number?', 'The calculation will produce a different result for a different name, yes. Whether that carries any meaning is a matter of belief rather than fact, and traditions disagree with one another about whether a birth name or a current name holds more weight. Our page on <a href="birth-name-vs-current-name.html">birth name against current name</a> sets out both positions without picking one.'],
    ['Is baby name numerology the same as astrology?', 'No. Numerology works from letters and dates through arithmetic, while astrology works from positions of the sun, moon and planets at a moment in time. They are separate systems with separate methods, and neither has demonstrated predictive power. Some people use both together, which is a preference rather than a method.']
  ],
  related: [
    ['business-name-numerology.html', 'Business Name Numerology', 'The same letter values applied to a trading name rather than a person.'],
    ['name-numerology.html', 'Name Numerology Hub', 'How names convert to numbers, and which name a tradition says to use.'],
    ['app.html', 'Free Complete Chart', 'Runs Expression, Soul Urge and Personality together with the working shown.']
  ]
});

/* ---------------- business name numerology ---------------- */
pages.push({
  slug: 'business-name-numerology',
  title: 'Business Name Numerology',
  h1: 'Business Name Numerology Calculator',
  eyebrow: 'Name Numerology',
  desc: 'Business name numerology: convert a trading name into its Expression number with the letter values shown, plus an honest account of what the result can and cannot tell you.',
  crumbs: [HOME, NAME_HUB, { name: 'Business Name Numerology', href: 'business-name-numerology.html' }],
  answer: 'Business name numerology converts a trading name into a number using the same Pythagorean letter values applied to personal names, producing an Expression number for the name as a whole. Traditional practice reads that number as the character the name projects. It cannot forecast revenue, survival or success, and no evidence connects a name number to commercial outcome.',
  faqLabel: 'business name numerology',
  sections:
    `<section class="extractable"><h2>How is a business name number calculated?</h2>`
    + `<p>Every letter in the trading name takes its Pythagorean value, the values are added and the total reduces to a single digit unless it is 11, 22 or 33. Punctuation, spacing and a legal suffix such as Ltd are normally excluded, though traditions differ and none is authoritative.</p>`
    + `<p>Because the method is identical to a personal name, the <a href="expression-number-calculator.html">Expression number calculator</a> produces the figure directly. Enter the trading name in place of a person name.</p></section>`
    + `<section class="extractable"><h2>What do the numbers traditionally suggest for a business?</h2>`
    + `<table><thead><tr><th>Number</th><th>Traditional emphasis</th></tr></thead><tbody>`
    + `<tr><td>1</td><td>Leading, launching, being first to a market</td></tr>`
    + `<tr><td>2</td><td>Partnership, service, close client relationships</td></tr>`
    + `<tr><td>3</td><td>Communication, creative work, visible brand voice</td></tr>`
    + `<tr><td>4</td><td>Systems, reliability, trades and infrastructure</td></tr>`
    + `<tr><td>5</td><td>Change, travel, marketing and variety</td></tr>`
    + `<tr><td>6</td><td>Care, hospitality, home and family services</td></tr>`
    + `<tr><td>7</td><td>Research, analysis, specialist expertise</td></tr>`
    + `<tr><td>8</td><td>Commerce, scale, finance and property</td></tr>`
    + `<tr><td>9</td><td>Broad reach, charitable and community work</td></tr>`
    + `<tr><td>11, 22, 33</td><td>Kept unreduced; read as an intensified form of 2, 4 and 6</td></tr>`
    + `</tbody></table></section>`
    + `<section class="extractable"><h2>What this cannot tell you about a business</h2>`
    + `<p>It cannot tell you whether a business will succeed, what to charge, whether to incorporate, or whether a name is legally available. Those are decisions for evidence, market research and where relevant a solicitor or accountant.</p>`
    + `<p>Before committing to a trading name, the checks that genuinely matter are the Companies House register, the UK trade mark register, domain availability and whether the name is already in use in your sector. A numerology result is entertainment; a trade mark conflict is expensive.</p></section>`,
  howto: { name: 'How do I check a business name in numerology?', steps: [
    'Write the trading name as customers would see it, without the legal suffix.',
    'Open the Expression number calculator and enter that name.',
    'Read the resulting number against the traditional emphasis table above.',
    'Repeat for each shortlisted name and compare.',
    'Run the real checks separately: Companies House, trade marks and domain availability.'
  ] },
  faqs: [
    ['How do I calculate my business name number?', 'Assign each letter in the trading name its Pythagorean value from 1 to 9, add the values, and reduce the total to a single digit unless it is 11, 22 or 33. Most practitioners exclude spaces, punctuation and a legal suffix such as Ltd or Limited, though traditions vary on this. The Expression number calculator on this site performs the same calculation and shows each letter value.'],
    ['Which business name number is luckiest?', 'None of them. Different traditions favour different numbers and contradict each other, which is a strong sign that none is authoritative. Sources presenting a definitive lucky number for business are stating an opinion, often ahead of a sales pitch. If the symbolism appeals, use it to compare a shortlist rather than to pick a winner.'],
    ['Should the legal suffix be included in the calculation?', 'Most traditions leave out Ltd, Limited, LLP or PLC on the basis that customers rarely say them and they are a legal formality rather than part of the brand. Others include everything on the register. Neither approach has a stronger claim, so pick one and apply it consistently across every name you are comparing, otherwise the comparison is meaningless.'],
    ['Does my business name number need to match my personal number?', 'Some traditions compare the trading name Expression number with the owner Life Path and describe the pairing as harmonious or not. Treat that as symbolic. There is no evidence that any pairing affects trading performance, and a name that customers remember and can spell will serve the business considerably better than one chosen for numerical agreement.'],
    ['Can I rename a business to change its number?', 'The calculation will give a different result for a different name. Whether that means anything is a matter of belief. What is certain is that renaming an established business carries real costs in search visibility, existing customer recognition, signage, stationery and registration. Those costs are measurable in a way that a name number is not.'],
    ['Is business name numerology used in any industry seriously?', 'It appears mainly in branding and naming consultancy as one input among many, usually alongside linguistic checks, domain availability and trade mark searches. Nobody in that field treats it as a decision-making tool on its own. Presenting it as more than an optional flourish would misrepresent how it is actually used.']
  ],
  related: [
    ['baby-name-numerology.html', 'Baby Name Numerology', 'The same letter values applied to a personal name rather than a trading name.'],
    ['expression-number-calculator.html', 'Expression Number Calculator', 'Does the arithmetic for any name and shows each letter value.'],
    ['chaldean-vs-pythagorean.html', 'Chaldean and Pythagorean Systems', 'The two letter-value systems disagree, which is why results differ between sites.']
  ]
});

/* ---------------- emit ---------------- */
let written = 0;
for (const p of pages) {
  const html = wrapTables(page(p));
  fs.writeFileSync(path.join(ROOT, p.slug + '.html'), html, 'utf8');
  written++;
}
console.log('v28: wrote ' + written + ' pages');
console.log(pages.map(p => '  ' + p.slug + '.html').join('\n'));
