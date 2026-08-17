/* v32: replace the mad-lib FAQ on every remaining page with FAQs built from
   facts computed for that specific entity.

   The mad-lib was five fixed questions with the page title substituted, on 409
   pages, carrying FAQPage schema with identical answers. Every question below
   is instead derived from something true of that entity alone: its digits, its
   reduction, its element and ruler, the pairing of two numbers, and so on.

   Where a cluster has no computable distinguishing fact, the block is removed
   rather than replaced, because a page with no FAQ beats a page carrying an
   FAQ that 400 other pages also carry. */

const NUM = {
  1: ['initiative', 'starting things and going first'],
  2: ['co-operation', 'partnership and reading a room'],
  3: ['expression', 'communication and creative output'],
  4: ['structure', 'method, order and building to last'],
  5: ['change', 'variety, movement and adaptability'],
  6: ['responsibility', 'care, home and holding things together'],
  7: ['analysis', 'understanding before acting'],
  8: ['scale', 'resources, organisation and ambition'],
  9: ['completion', 'perspective and drawing things to a close'],
  11: ['heightened awareness', 'sensitivity, read as an intensified 2'],
  22: ['building at scale', 'large plans made concrete, read as an intensified 4'],
  33: ['service through teaching', 'care extended outward, read as an intensified 6']
};

const SIGN = {
  aries:      ['Aries', '21 March to 19 April', 'fire', 'cardinal', 'Mars'],
  taurus:     ['Taurus', '20 April to 20 May', 'earth', 'fixed', 'Venus'],
  gemini:     ['Gemini', '21 May to 20 June', 'air', 'mutable', 'Mercury'],
  cancer:     ['Cancer', '21 June to 22 July', 'water', 'cardinal', 'the Moon'],
  leo:        ['Leo', '23 July to 22 August', 'fire', 'fixed', 'the Sun'],
  virgo:      ['Virgo', '23 August to 22 September', 'earth', 'mutable', 'Mercury'],
  libra:      ['Libra', '23 September to 22 October', 'air', 'cardinal', 'Venus'],
  scorpio:    ['Scorpio', '23 October to 21 November', 'water', 'fixed', 'Mars and Pluto'],
  sagittarius:['Sagittarius', '22 November to 21 December', 'fire', 'mutable', 'Jupiter'],
  capricorn:  ['Capricorn', '22 December to 19 January', 'earth', 'cardinal', 'Saturn'],
  aquarius:   ['Aquarius', '20 January to 18 February', 'air', 'fixed', 'Saturn and Uranus'],
  pisces:     ['Pisces', '19 February to 20 March', 'water', 'mutable', 'Jupiter and Neptune']
};

const MASTER = [11, 22, 33];
const digitsum = n => String(n).split('').reduce((a, c) => a + +c, 0);
function reduce(n) { while (n > 9 && !MASTER.includes(n)) n = digitsum(n); return n; }
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------- angel numbers ---------------- */
function angelFaqs(n) {
  const ds = String(n).split('');
  const uniqueDigits = [...new Set(ds)];
  const repeating = uniqueDigits.length === 1;
  const total = ds.reduce((a, c) => a + +c, 0);
  const red = reduce(total);
  const [theme, gloss] = NUM[red] || NUM[9];
  const chain = total > 9 && !MASTER.includes(total)
    ? `${ds.join(' + ')} = ${total}, then ${String(total).split('').join(' + ')} = ${red}`
    : `${ds.join(' + ')} = ${total}`;
  const pattern = repeating
    ? `${n} is a repeating sequence of the single digit ${ds[0]}, and repetition is read as intensification rather than as a separate meaning.`
    : `${n} combines the digits ${uniqueDigits.join(', ')}, so it is read as those qualities in sequence rather than as one quality repeated.`;
  return [
    [`What does angel number ${n} mean?`,
     `${n} reduces to ${red} through ${chain}, and traditional numerology reads ${red} as ${theme}: ${gloss}. ${pattern} Angel numbers are a modern practice rather than a classical one, and there is no evidence that seeing a number carries a message. Read it as a prompt to notice what you were thinking about, which is the part people find genuinely useful.`],
    [`How is ${n} reduced in numerology?`,
     `Add the digits: ${chain}. ${MASTER.includes(total) ? `The total ${total} is a master number and is held rather than reduced further.` : `The final digit is ${red}.`} This is the same reduction used everywhere else in numerology, so the angel number ${n} shares its underlying digit with any other total reaching ${red}. What distinguishes it in the practice is the specific digit pattern, not the reduced value.`],
    [`Why do people say they keep seeing ${n}?`,
     `The usual explanation is frequency bias: once a number is noticed it becomes salient, so subsequent appearances register where they previously would not. ${n} appears on clocks, receipts and door numbers at roughly the rate chance predicts. That does not make noticing it meaningless, but the meaning sits in what prompted you to look, rather than in the number arriving as a signal.`],
    [`Is ${n} connected to any other number?`,
     `It reduces to ${red}, so it shares that root with every other angel number reaching ${red}. ${repeating ? `As a repeating sequence it is also read alongside other repetitions of ${ds[0]}, such as ${ds[0]}${ds[0]} and ${ds[0]}${ds[0]}${ds[0]}${ds[0]}, which the practice treats as the same theme at different strengths.` : `Reordering the same digits gives a different sequence with the same reduced value, and the practice reads the order as mattering.`}`],
    [`Should I make a decision based on seeing ${n}?`,
     `No. Nothing about a number appearing can inform a decision about work, money, health or a relationship, and treating it as guidance means outsourcing a choice to coincidence. If ${n} keeps surfacing while you are weighing something up, the useful question is what you were already thinking, not what the number is telling you. Any decision that matters deserves evidence and, where relevant, professional advice.`]
  ];
}

/* ---------------- life path x personal year matrix ---------------- */
function lpPyFaqs(lp, py) {
  const [lt, lg] = NUM[lp] || NUM[9];
  const [pt, pg] = NUM[py] || NUM[9];
  return [
    [`What does personal year ${py} mean for life path ${lp}?`,
     `Life path ${lp} is the fixed theme, read as ${lt}: ${lg}. Personal year ${py} is the temporary cycle, read as ${pt}: ${pg}. The combination is read as ${lt} operating within a year emphasising ${pt}. The life path does not change; only the year does, so this pairing recurs every nine years.`],
    [`How often does life path ${lp} have a personal year ${py}?`,
     `Once every nine years, because the personal year cycles through 1 to 9 in sequence. Someone with life path ${lp} met personal year ${py} nine years ago and will meet it again nine years from now. The life path itself never changes, since it comes from a fixed date of birth, which is why only one half of this pairing moves.`],
    [`How do I work out whether I am in personal year ${py}?`,
     `Reduce your birth day, reduce your birth month, reduce the calendar year, then add the three and reduce again. If the result is ${py}, this pairing applies to you. Most systems change the personal year on 1 January; a minority change it on your birthday, which will give a different answer for part of the year, so check which convention a site uses.`],
    [`Does the personal year override the life path ${lp} reading?`,
     `No. Traditional numerology treats the life path as the long theme and the personal year as a shorter cycle running inside it, so ${lt} remains the underlying reading and ${pt} colours the current period. They are read together rather than one replacing the other. Where the two themes pull against each other, the reading describes tension rather than contradiction.`],
    [`What comes after personal year ${py}?`,
     `Personal year ${py === 9 ? 1 : py + 1}, since the cycle runs 1 to 9 and then restarts. For life path ${lp} that means the ${lt} theme carrying into a year emphasising ${(NUM[py === 9 ? 1 : py + 1] || NUM[1])[0]}. The nine-year sequence is the framework the whole personal year system rests on, and every life path moves through the same order.`]
  ];
}

/* ---------------- life path compatibility ---------------- */
function lpCompatFaqs(a, b) {
  const [at, ag] = NUM[a] || NUM[9];
  const [bt, bg] = NUM[b] || NUM[9];
  const same = a === b;
  return [
    [`Are life path ${a} and ${b} compatible?`,
     `Traditional numerology reads life path ${a} as ${at} and life path ${b} as ${bt}. ${same ? `Where both partners share ${a}, the reading describes recognition and the risk of sharing the same blind spot.` : `The pairing is read as ${ag} meeting ${bg}.`} No numerology pairing predicts whether a relationship works. Compatibility depends on how two people treat each other, which is not recorded in a birth date.`],
    [`What do life path ${a} and ${b} have in common?`,
     `${same ? `They are the same number, so the shared ground is complete: both read as ${at}. Traditional readings treat that as easy mutual understanding paired with a shared weakness neither partner compensates for.` : `Traditional readings look for where ${at} and ${bt} overlap in practice. ${ag} and ${bg} are different emphases rather than opposites, and most pairings share more than the numbers alone suggest.`}`],
    [`Where might life path ${a} and ${b} disagree?`,
     `${same ? `Where both hold ${a}, disagreement tends to be described as neither partner offering a different angle, so a shared assumption goes unchallenged.` : `Traditional readings put the friction between ${ag} and ${bg}, since the two emphases can want different things from the same situation.`} This is a symbolic description offered as entertainment. It cannot identify what a specific couple actually argue about.`],
    [`Do I need both birth dates to check this?`,
     `Yes. The life path comes from a full date of birth, so both are needed to establish which pairing applies. Names are not used for life path compatibility, though the expression and soul urge numbers give a separate name-based comparison that some practitioners run alongside it.`],
    [`Should numerology decide whether to stay with someone?`,
     `No, and this needs saying plainly. A birth date contains no information about whether a relationship is right, safe or lasting. Using a compatibility number to justify leaving or staying means handing a significant decision to arithmetic. If a relationship question is genuinely troubling you, that belongs in a conversation with the person, or with a counsellor.`]
  ];
}

/* ---------------- zodiac sign ---------------- */
function zodiacFaqs(key) {
  const [name, dates, el, mod, ruler] = SIGN[key];
  const sameEl = Object.entries(SIGN).filter(([k, v]) => v[2] === el && k !== key).map(([, v]) => v[0]);
  return [
    [`What are the ${name} dates?`,
     `${name} runs from ${dates} in the tropical zodiac used by most Western astrology. The exact changeover shifts by up to a day between years, so anyone born at the very start or end of that range should check the year in question rather than assume. The sidereal zodiac used in Vedic astrology places the boundaries differently again.`],
    [`What element and modality is ${name}?`,
     `${name} is a ${el} sign and ${mod} in modality, ruled by ${ruler}. The element groups it with ${sameEl.join(', ')}, and the modality describes how the sign is said to engage: cardinal signs initiate, fixed signs sustain and mutable signs adapt. These three attributes are how traditional astrology classifies every sign.`],
    [`What rules ${name}?`,
     `${name} is ruled by ${ruler}. Rulership is a classical assignment rather than an observation, and several signs gained a modern co-ruler after the outer planets were discovered, which is why some sources list one ruler and others two. Neither version has evidence behind it; they are different conventions within the same tradition.`],
    [`How does ${name} relate to numerology?`,
     `They are separate systems. ${name} comes from the position of the sun at a moment in time; a numerology number comes from arithmetic on a date or a name. Neither predicts anything. The practical difference is that a numerology result can be checked by redoing the calculation, whereas an astrological reading cannot be verified the same way.`],
    [`Is the ${name} sun sign the whole picture in astrology?`,
     `No, and sun sign astrology is the most simplified form of the practice. A full chart also places the moon, the rising sign and the planets, and needs a birth time and location to do it. Sun sign columns exist because they need only a date. That convenience is why they are ubiquitous, not because they carry more meaning.`]
  ];
}

/* ---------------- zodiac compatibility ---------------- */
function zodiacCompatFaqs(a, b) {
  const [an, , ae, am] = SIGN[a];
  const [bn, , be, bm] = SIGN[b];
  const sameEl = ae === be, sameMod = am === bm;
  return [
    [`Are ${an} and ${bn} compatible?`,
     `${an} is ${ae} and ${bn} is ${be}. ${sameEl ? `Sharing the ${ae} element, traditional astrology reads them as understanding each other readily and risking the same blind spots.` : `Traditional astrology reads ${ae} and ${be} as different registers, describing the pairing as complementary or as needing translation depending on the source.`} No sun sign pairing predicts whether a relationship works, and treating one as though it does would be a poor basis for any decision.`],
    [`What elements are ${an} and ${bn}?`,
     `${an} is a ${ae} sign and ${bn} is a ${be} sign. ${sameEl ? `Same-element pairings are traditionally described as comfortable, since both approach situations in a similar register.` : `Element mixing is where most compatibility writing focuses, since ${ae} and ${be} are said to want different things from the same moment.`} Elements are a classification convention, not a measurement of anything.`],
    [`Do ${an} and ${bn} share a modality?`,
     `${sameMod ? `Yes, both are ${am}. Shared modality is traditionally read as similar pace: two ${am} signs engage a situation the same way, which is described as either reinforcing or as neither partner shifting first.` : `No. ${an} is ${am} and ${bn} is ${bm}, so traditional readings describe them as engaging at different speeds. Modality differences are read as pacing rather than as conflict.`}`],
    [`Is sun sign compatibility reliable?`,
     `No. Sun sign matching uses one factor out of a whole chart and ignores the moon, rising sign and everything else astrology itself considers relevant. Even within astrology it is regarded as the crudest form of comparison, and studies of couples have found no relationship between sun signs and relationship outcome or duration.`],
    [`What matters more than a ${an} and ${bn} pairing?`,
     `How two people communicate, whether they want the same things, and how they behave when they disagree. None of that is contained in a birth date. Compatibility writing is entertaining and it can prompt a useful conversation, which is a fair use of it. Deciding to start or end a relationship on it is not.`]
  ];
}

/* ---------------- plain number pages ---------------- */
function numberFaqs(n) {
  const [t, g] = NUM[n] || NUM[9];
  const isMaster = MASTER.includes(n);
  const reducesTo = isMaster ? digitsum(n) : null;
  return [
    [`What does the number ${n} mean in numerology?`,
     `Traditional numerology reads ${n} as ${t}: ${g}. ${isMaster ? `As a master number it is held rather than reduced to ${reducesTo}, and is read as an intensified form of that digit.` : `It appears as a life path, expression, soul urge, personality or birthday number, and the position changes the emphasis while the underlying theme stays the same.`} It is a symbolic description offered as entertainment rather than an assessment of anyone.`],
    [`Is ${n} a master number?`,
     `${isMaster ? `Yes. ${n} is one of the three master numbers, alongside the other two of 11, 22 and 33. It is held unreduced where it appears rather than becoming ${reducesTo}. Not every practitioner follows this convention, and some reduce everything, which is why results differ between sites.` : `No. The master numbers are 11, 22 and 33, and ${n} is an ordinary single digit. Master numbers are the only totals held unreduced during a calculation, so ${n} is always the endpoint of a reduction rather than a value that could have been reduced further.`}`],
    [`Where does ${n} appear in a full chart?`,
     `It can appear in any position: life path from the birth date, expression, soul urge and personality from the name, and birthday from the day of the month. Traditional readings treat the same number differently by position, so ${n} as a life path is read as a life theme while ${n} as a birthday number is read as a particular talent.`],
    [`What if ${n} appears more than once in my chart?`,
     `Traditional numerology reads repetition as emphasis rather than as multiplication, so a chart with ${n} in two positions is described as leaning strongly toward ${t}. It is not treated as doubly true or doubly strong. Where a number is absent from a chart entirely, that absence is read separately as a karmic lesson.`],
    [`Does ${n} mean anything about luck?`,
     `No. No number is lucky or unlucky, and traditions contradict one another about which numbers are favourable, which is a strong indication that none of them is describing something real. Sources presenting ${n} as a lucky number are usually moving toward an offer. Treat the theme as a reflective prompt and disregard anything sold as fortune.`]
  ];
}

/* ---------------- personal year ---------------- */
function pyFaqs(n) {
  const [t, g] = NUM[n] || NUM[9];
  const prev = n === 1 ? 9 : n - 1, next = n === 9 ? 1 : n + 1;
  return [
    [`What does personal year ${n} mean?`,
     `Traditional numerology reads personal year ${n} as ${t}: ${g}. It is one step in a nine-year cycle, following personal year ${prev} and leading into personal year ${next}. Unlike the life path, it changes every year, so this reading applies for twelve months rather than for life.`],
    [`How do I know if I am in personal year ${n}?`,
     `Reduce your birth day, reduce your birth month, reduce the calendar year, then add the three results and reduce again. If you get ${n}, this is your personal year. Most systems change it on 1 January and a minority change it on your birthday, which gives different answers for part of the year, so check which rule a site applies.`],
    [`What comes before and after personal year ${n}?`,
     `Personal year ${prev} precedes it and personal year ${next} follows. The cycle runs 1 to 9 and restarts, so ${n} recurs every nine years. Traditional readings put weight on the sequence rather than the individual year, describing ${n} as making sense in relation to what came before it.`],
    [`Should I plan my year around personal year ${n}?`,
     `No. A personal year cannot indicate whether a decision will succeed, when to change job, or whether to make a commitment. Traditional numerology offers the theme as a reflective prompt. Using it to time anything that matters means letting arithmetic on a birth date stand in for judgement about actual circumstances.`],
    [`Does personal year ${n} feel the same for everyone?`,
     `Everyone in personal year ${n} shares the same reading regardless of age, circumstances or life path, which is worth noticing. A framework that gives millions of people the same annual theme is describing something very broad, and broadness is what makes it feel applicable. Traditional practice reads it alongside the life path partly to narrow that.`]
  ];
}

module.exports = { angelFaqs, lpPyFaqs, lpCompatFaqs, zodiacFaqs, zodiacCompatFaqs, numberFaqs, pyFaqs, SIGN, NUM };
