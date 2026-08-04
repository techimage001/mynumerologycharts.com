// gen-extra.mjs — runs AFTER gen-clusters. Adds zodiac sign-pair compatibility,
// more angel numbers, and rewrites the thin v14 guide pages with real content.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZODIAC } from './lib/zodiac.mjs';
import { NUMBERS } from './lib/numbers.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ul = a => `<ul>${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const noDash = s => typeof s==='string' ? s.replace(/\s*\u2014\s*/g,', ').replace(/,\s*,/g,',').replace(/,\s*\./g,'.') : s;
const clampDesc = s => { s=String(s).replace(/\s+/g,' ').trim(); if(s.length>158)s=s.slice(0,155).replace(/\s+\S*$/,'')+'…'; while(s.length<52)s+=' A clear, plain-English explanation.'; return s.slice(0,160); };
const pages = [];
const add = p => { const q={index:true,...p}; for(const k of ['title','h1','description','answer','sections']) if(q[k]!==undefined) q[k]=noDash(q[k]); q.description=clampDesc(q.description); pages.push(q); };

// ---------- Zodiac sign-pair compatibility (78 unique pairs) ----------
const elementHarmony=(e1,e2)=>{
  if(e1===e2) return ['an easy, instinctive rapport','you share the same elemental language, so you understand each other quickly'];
  const pair=[e1,e2].sort().join('-');
  if(pair==='Air-Fire') return ['a lively, energising match','air feeds fire, so you spark ideas and action in each other'];
  if(pair==='Earth-Water') return ['a nurturing, stable match','water softens earth and earth grounds water, a naturally supportive blend'];
  if(pair==='Air-Water') return ['a tender but tricky mix','one leads with feeling and the other with thought, so translation is needed'];
  if(pair==='Earth-Fire') return ['a grounding but effortful mix','fire wants to move and earth wants to build, which can steady or frustrate'];
  if(pair==='Air-Earth') return ['a practical-meets-conceptual mix','ideas meet method, rewarding once you value the other approach'];
  if(pair==='Fire-Water') return ['a passionate but volatile mix','heat and depth can either warm or overwhelm, so pace matters'];
  return ['a mixed match','your elements ask you to meet in the middle'];
};
const modalityNote=(m1,m2)=> m1===m2
  ? `Both are ${m1.toLowerCase()} signs, so you approach change the same way, which can mean solidarity or a stand-off over who leads.`
  : `${m1} and ${m2} modalities balance each other: one initiates or holds while the other adapts, which smooths day-to-day life.`;
for(let i=0;i<ZODIAC.length;i++) for(let j=i+1;j<ZODIAC.length;j++){
  const a=ZODIAC[i], b=ZODIAC[j], [label,why]=elementHarmony(a.element,b.element);
  add({
    slug:`${a.slug}-${b.slug}-compatibility`, group:'Astrology',
    title:`${a.sign} and ${b.sign} Compatibility`,
    h1:`${a.sign} and ${b.sign} Compatibility`,
    description:`${a.sign} and ${b.sign} compatibility in love and life: a ${a.element.toLowerCase()} and ${b.element.toLowerCase()} pairing with ${label}.`,
    answer:`${a.sign} and ${b.sign} make ${label}. ${why.charAt(0).toUpperCase()+why.slice(1)}. ${a.sign} brings ${a.keyword}; ${b.sign} brings ${b.keyword}.`,
    sections:
      `<section><h2>${a.sign} and ${b.sign}: the overall match</h2><p>${esc(a.sign)} (${esc(a.element)}, ruled by ${esc(a.ruler)}) meets ${esc(b.sign)} (${esc(b.element)}, ruled by ${esc(b.ruler)}). Together they make ${esc(label)}, because ${esc(why)}.</p><p>${esc(modalityNote(a.quality,b.quality))}</p></section>`+
      `<section><h2>Where you click</h2><p>${esc(a.sign)} is ${esc(a.keyword)}, while ${esc(b.sign)} is ${esc(b.keyword)}. At your best, ${esc(a.love.replace(/^In love, /,''))} and ${esc(b.love.replace(/^In love, /,'').toLowerCase())}</p></section>`+
      `<section><h2>Where you may clash</h2><p>Tension can appear when ${esc(a.sign)}'s ${esc((a.challenges[0]||'habits').toLowerCase())} meets ${esc(b.sign)}'s ${esc((b.challenges[0]||'habits').toLowerCase())}. Naming the difference early keeps it from turning into a pattern.</p></section>`+
      `<section><h2>Advice for ${a.sign} and ${b.sign}</h2><p>Lead with the strengths above and treat the friction as something to manage rather than a verdict. Sun-sign compatibility describes broad tendencies from tropical date ranges, not fixed outcomes: any two signs can thrive with understanding and effort.</p></section>`
  });
}

// ---------- More angel numbers ----------
const EXTRA_ANGEL={
 '1000':['a powerful fresh start','One-thousand magnifies the new-beginning energy of 1 with the infinite potential of the zeros, a strong signal that a major new chapter is opening.','You are being encouraged to start boldly; the slate is clear and the potential is wide open.'],
 '1200':['steady progress toward purpose','Twelve-hundred blends new beginnings and partnership with limitless potential, a nudge to keep taking balanced steps toward what matters.','Keep moving forward with patience and faith; you are on the right track.'],
 '1230':['aligned creative momentum','One-two-three-zero pairs orderly progress with open potential, a sign your steady, sequential effort is supported.','Take the next simple step; progress is unfolding in the right order.'],
 '234':['building in the right order','Two-three-four is a sequence of cooperation, expression and structure, encouragement that you are assembling something solid step by step.','Trust the process and keep building; each piece is falling into place.'],
 '456':['forward movement and change','Four-five-six moves from structure through change to responsibility, a sign that steady effort is carrying you into a new, more caring phase.','A constructive change is underway; stay grounded as things shift.'],
 '700':['spiritual reassurance','Seven-hundred surrounds the seeker energy of 7 with infinite potential, a message that your inner work and intuition are supported.','You are on a meaningful inner path; keep trusting your own understanding.'],
 '900':['completion and release','Nine-hundred joins the completion of 9 with the open potential of the zeros, a gentle sign to release what is finished so something new can begin.','Let go of what has run its course; space is being made for the next chapter.'],
 '1201':['a fresh, faith-led step','Twelve-oh-one blends new beginnings, partnership and potential, a reminder to begin the next step with balance and trust.','Begin again with faith; a balanced new start is favoured.'],
 '1213':['optimistic growth','Twelve-thirteen pairs progress with creative transformation, a sign to stay positive as you grow through change.','Keep a hopeful outlook; your growth is being supported.'],
 '1112':['an awakening toward partnership','Eleven-twelve joins the intuitive gateway of 11 with the growth of 12, a call to trust your inspiration as a new connection or phase forms.','Trust your intuition; something meaningful is aligning.'],
 '1211':['manifestation through balance','Twelve-eleven blends progress with the manifestation gateway of 11, a nudge to keep your thoughts positive as things take shape.','Mind your focus; what you dwell on is forming.'],
 '333':null // placeholder guard, ignored
};
for(const [k,v] of Object.entries(EXTRA_ANGEL)){
  if(!v) continue;
  add({
    slug:`angel-number-${k}`, group:'Angel Numbers',
    title:`${k} Angel Number Meaning: ${v[0].replace(/^\w/,c=>c.toUpperCase())}`,
    h1:`${k} Angel Number Meaning`,
    description:`Seeing ${k}? The ${k} angel number is about ${v[0]}. What it means and why you keep seeing it.`,
    answer:`The ${k} angel number is a sign of ${v[0]}. ${v[1]}`,
    sections:
      `<section><h2>What the ${k} angel number means</h2><p>${esc(v[1])}</p></section>`+
      `<section><h2>Why you keep seeing ${k}</h2><p>${esc(v[2])}</p></section>`+
      `<section><h2>How to respond to ${k}</h2><p>Angel numbers are a modern spiritual idea rather than classical numerology. Treat ${k} as a prompt to pause and notice the theme it points to, then take one small, practical step, rather than as a fixed prediction.</p></section>`
  });
}

// ---------- Rewrite the thin guide pages with real content ----------
const GUIDES=[
 ['what-is-numerology','Learn','What Is Numerology? A Plain-English Guide','What is numerology?',
  'Numerology is the study of the meaning of numbers in a person\u2019s life, most often drawn from their birth date and full name.',
  [['What is numerology?','<p>Numerology is the belief that numbers carry meaning and that the numbers in your birth date and name describe patterns in your character and life. It is a symbolic system for reflection and self-knowledge, not a science.</p>'],
   ['Where do the numbers come from?','<p>Two sources: your <strong>date of birth</strong> gives your Life Path, Birthday and cycle numbers, and your <strong>full birth name</strong> gives your Expression, Soul Urge and Personality numbers. Each is reduced to a single digit, keeping the master numbers 11, 22 and 33.</p>'],
   ['What can it be used for?','<p>People use numerology to reflect on strengths and blind spots, to think about timing through the personal-year cycle, and as a gentle prompt for decisions. It works best as a mirror for reflection rather than a prediction of fixed events.</p>']]],
 ['how-to-calculate-life-path','Learn','How to Calculate Your Life Path Number','How do you calculate a Life Path number?',
  'To calculate your Life Path number, reduce your birth month, day and year to single digits, add the three results, then reduce again, keeping master numbers 11, 22 and 33.',
  [['The steps','<ol><li>Reduce the <strong>month</strong> to one digit (e.g. December, 12, becomes 1+2=3).</li><li>Reduce the <strong>day</strong> the same way.</li><li>Reduce the <strong>year</strong> (1990 becomes 1+9+9+0=19, then 1+9=10, then 1+0=1).</li><li>Add the three single digits and reduce once more.</li></ol>'],
   ['A worked example','<p>For 15 December 1990: month 12, 3; day 15, 6; year 1990, 1. Then 3+6+1=10, and 1+0=1, so the Life Path is 1.</p>'],
   ['Keeping master numbers','<p>If any step lands on 11, 22 or 33, stop there and keep it as a master number rather than reducing further. These carry a higher-octave version of their single-digit root.</p>']]],
 ['why-calculators-disagree','Learn','Why Numerology Calculators Disagree','Why do numerology calculators give different results?',
  'Numerology calculators disagree mainly because they use different letter systems (Pythagorean or Chaldean), treat the letter Y differently, or reduce master numbers at different stages.',
  [['Different letter systems','<p>The <strong>Pythagorean</strong> system assigns A to 1 through I to 9 and repeats, while the <strong>Chaldean</strong> system uses a different, sound-based set of values. A name number will often differ between the two.</p>'],
   ['The letter Y and master numbers','<p>Calculators disagree on whether Y is a vowel or consonant, which changes Soul Urge and Personality results. They also differ on whether to keep or reduce 11, 22 and 33 mid-calculation.</p>'],
   ['Which is right?','<p>Neither is objectively correct, because numerology is an interpretive system. What matters is using one consistent method. This site uses the Pythagorean system and keeps master numbers, and shows the working so you can follow every step.</p>']]],
 ['master-numbers','Learn','Master Numbers 11, 22 and 33 in Numerology','What are master numbers in numerology?',
  'Master numbers are 11, 22 and 33: double-digit numbers that are not reduced, because they carry a heightened, higher-octave version of the energy of 2, 4 and 6.',
  [['The three master numbers','<p>Numerology keeps three numbers unreduced. <strong>11</strong> is the intuitive (a higher octave of 2), <strong>22</strong> is the master builder (a higher octave of 4), and <strong>33</strong> is the master teacher (a higher octave of 6).</p>'],
   ['Greater potential, greater pressure','<p>Master numbers describe unusual potential, but also unusual intensity. An 11 can be deeply inspired yet prone to nervous tension; a 22 can build on a large scale yet feel great pressure; a 33 can serve selflessly yet risk taking on too much.</p>'],
   ['Reading a master number','<p>If your number is a master number, read both it and its single-digit root (11 and 2, 22 and 4, 33 and 6). Many people grow into the full master expression gradually rather than living it constantly.</p>']]],
 ['birth-name-vs-current-name','Learn','Birth Name vs Current Name in Numerology','Should you use your birth name or current name?',
  'Numerology traditionally uses your full birth name for the core reading, because it reflects the identity you were given at the start, while a current or changed name is read separately.',
  [['Why the birth name is the core','<p>Your full name at birth is treated as the blueprint, so the Expression, Soul Urge and Personality numbers are calculated from it. It represents the potential you were born with.</p>'],
   ['What a changed name shows','<p>A married, chosen or shortened name can be calculated separately to show how you present and operate now. It is read as an overlay on the birth-name blueprint rather than a replacement.</p>'],
   ['Which to enter here','<p>For the most traditional result, enter your full birth name. You can also run your current name to compare the two and see what each emphasises.</p>']]],
 ['life-path-vs-expression','Learn','Life Path vs Expression Number: The Difference','What is the difference between Life Path and Expression?',
  'Your Life Path comes from your birth date and describes the road your life tends to follow; your Expression comes from your full name and describes your natural talents and how you pursue that road.',
  [['Life Path: the road','<p>The Life Path is drawn from your date of birth. It describes the overall direction, lessons and opportunities that recur across your life.</p>'],
   ['Expression: the toolkit','<p>The Expression, or Destiny, number is drawn from the letters of your full birth name. It describes the abilities and style you bring to that journey.</p>'],
   ['Reading them together','<p>They work as a pair: the Life Path is where you are heading, the Expression is what you have to work with. When they align, the path feels natural; when they differ, each adds a distinct layer.</p>']]],
 ['soul-urge-number-guide','Learn','Soul Urge Number Guide (Heart\u2019s Desire)','What is a Soul Urge number?',
  'Your Soul Urge number, from the vowels of your full name, describes what you most deeply want, your inner motivation beneath outward goals.',
  [['What the Soul Urge reveals','<p>Also called the Heart\u2019s Desire, the Soul Urge is calculated from the vowels in your full birth name. It points to the wants and values that quietly drive you.</p>'],
   ['How to calculate it','<p>Keep only the vowels of your full name, give each its value 1 to 9, add them and reduce to a single digit, keeping master numbers. The letter Y is treated as a vowel when it is not next to another vowel.</p>'],
   ['Using it well','<p>Read the Soul Urge alongside your Expression and Personality numbers. The Expression is what you can do, the Personality is how you appear, and the Soul Urge is what you truly want underneath.</p>']]],
 ['pinnacle-numbers-guide','Learn','Pinnacle Numbers Guide in Numerology','What are Pinnacle numbers?',
  'Pinnacle numbers are four life-stage numbers, calculated from your birth date, that describe the main themes and opportunities of each phase of your life.',
  [['The four pinnacles','<p>Your life divides into four pinnacle periods. The first runs from birth to your mid-thirties, then three further phases of roughly nine years each. Each carries a number and a theme.</p>'],
   ['How they are found','<p>The pinnacles come from combining the reduced month, day and year of your birth in set pairs. The first pinnacle length depends on your Life Path number, so everyone\u2019s timing differs slightly.</p>'],
   ['Reading a pinnacle','<p>A pinnacle describes the kind of growth a period invites, not a fixed event. Read each alongside the matching Challenge number, which names the lesson to work through in that same phase.</p>']]],
 ['calculate-four-pinnacles','Learn','How to Calculate the Four Pinnacles','How do you calculate the four Pinnacles?',
  'To calculate the four Pinnacles, reduce your birth month, day and year, then add them in set pairs: month plus day, day plus year, the first two pinnacles added, and month plus year.',
  [['The four calculations','<ol><li><strong>First:</strong> reduced month + reduced day.</li><li><strong>Second:</strong> reduced day + reduced year.</li><li><strong>Third:</strong> first pinnacle + second pinnacle.</li><li><strong>Fourth:</strong> reduced month + reduced year.</li></ol><p>Reduce each result to a single digit, keeping master numbers.</p>'],
   ['The timing of each','<p>The first pinnacle lasts from birth until about age 36 minus your Life Path number. Each of the next three lasts roughly nine years, and the fourth runs for the rest of your life.</p>'],
   ['Let the tool do it','<p>Our free chart calculates all four Pinnacles, their ages and the matching Challenge numbers for you, and shows the working so you can check every step.</p>']]],
 ['pinnacles-vs-personal-year','Learn','Pinnacles vs Personal Year: What\u2019s the Difference','How are Pinnacles different from Personal Years?',
  'Pinnacles describe long life-stage themes lasting years, while the Personal Year is a shorter one-year cycle that repeats 1 to 9, so they work on different timescales.',
  [['Two different clocks','<p>The Pinnacles are long chapters, each lasting roughly nine years or more. The Personal Year turns over every year, cycling from 1 to 9 and starting again.</p>'],
   ['How they interact','<p>Think of the Pinnacle as the season and the Personal Year as the month within it. A given Personal Year 5 will feel different depending on which Pinnacle it falls inside.</p>'],
   ['Reading them together','<p>Use the Pinnacle for the big theme of this stage of life and the Personal Year for the near-term focus. Together they give both the horizon and the next step.</p>']]],
 ['challenge-numbers-guide','Learn','Challenge Numbers Guide in Numerology','What are Challenge numbers?',
  'Challenge numbers, calculated by subtracting parts of your birth date, name the main inner lessons to work through in each stage of life, alongside the Pinnacles.',
  [['What a Challenge number is','<p>Each Pinnacle period has a matching Challenge: a recurring difficulty or lesson that, once understood, becomes a strength. Challenge numbers are usually low (0 to 8).</p>'],
   ['How they are found','<p>Challenges come from the <em>difference</em> between the reduced parts of your birth date, rather than their sum. A 0 challenge suggests a lesson that is yours to define freely.</p>'],
   ['Working with a Challenge','<p>Read a Challenge as growth work, not a flaw. It names the tendency to watch during that life stage, and the quality you are being invited to develop.</p>']]],
 ['personal-year-guide','Learn','Personal Year Guide: The Nine-Year Cycle','What is a Personal Year?',
  'A Personal Year is a one-year theme in a repeating nine-year cycle, found by adding your birth month and day to the current year and reducing to a single digit.',
  [['The nine-year cycle','<p>Numerology runs in cycles of nine years. Each year carries a number from 1 (fresh starts) through 9 (completion), then the cycle begins again with a new 1.</p>'],
   ['How to find yours','<p>Add your birth month and birth day to the current year, then reduce to a single digit. That number is your Personal Year, and it colours the whole year\u2019s focus.</p>'],
   ['Using the cycle','<p>Knowing your Personal Year helps with timing: a 1 year favours starting, a 4 year favours building, a 9 year favours completing and releasing. Our free chart calculates yours and links to a full page for each number.</p>']]],
 ['numerology-compatibility-guide','Learn','Numerology Compatibility Guide','How does numerology compatibility work?',
  'Numerology compatibility compares two people\u2019s core numbers, most often their Life Path numbers, to describe how their natural patterns tend to blend in a relationship.',
  [['What is compared','<p>The most common comparison is Life Path to Life Path, since that describes each person\u2019s overall direction. Name numbers such as Expression and Soul Urge can be compared too for a fuller picture.</p>'],
   ['What a match really means','<p>A "high" match suggests two people whose tendencies naturally support each other; a "lower" match simply means more differences to understand. Neither predicts success or failure.</p>'],
   ['Using it well','<p>Read compatibility as a conversation starter about strengths and differences, not a verdict. Our free tool compares two birth dates and links to a full page for every Life Path pairing.</p>']]],
 ['pythagorean-numerology','Learn','Pythagorean Numerology Explained','What is Pythagorean numerology?',
  'Pythagorean numerology is the most common Western system, assigning the letters A to I the values 1 to 9 and then repeating, and reducing all results to single digits or master numbers.',
  [['The letter values','<p>In the Pythagorean system, A=1, B=2, up to I=9, then J starts again at 1, and so on to Z. Names are converted to numbers using this grid and reduced.</p>'],
   ['Why it is popular','<p>It is straightforward, consistent and easy to follow, which is why most Western numerology sites, including this one, use it. The working is simple enough to check by hand.</p>'],
   ['Pythagorean vs Chaldean','<p>The main alternative, the Chaldean system, uses different, sound-based values and never assigns 9 to a letter. The two often give different name numbers, so it is best to pick one and stay consistent.</p>']]],
 ['chaldean-vs-pythagorean','Learn','Chaldean vs Pythagorean Numerology','What is the difference between Chaldean and Pythagorean numerology?',
  'Pythagorean numerology assigns letters values 1 to 9 in order, while Chaldean numerology uses older, sound-based values from 1 to 8 and treats the name as it is actually used.',
  [['Pythagorean','<p>The Pythagorean system maps A to I as 1 to 9 and repeats. It is the common Western method, simple to calculate, and the one used on this site.</p>'],
   ['Chaldean','<p>The Chaldean system is older and sound-based. It assigns values 1 to 8 only (9 is treated as sacred and not given to a letter) and often uses the name a person actually goes by rather than the full birth name.</p>'],
   ['Which to use','<p>Neither is objectively correct. Pythagorean is easier and more widely used; Chaldean is favoured by those who prefer its older roots. The key is consistency, since mixing the two gives meaningless results.</p>']]]
];
for(const [slug,group,title,q,answer,secs] of GUIDES){
  add({ slug, group, title, h1:title.replace(/:.*/,'').replace(/\?$/,''),
    description:`${title}. ${answer.slice(0,90)}`,
    answer,
    sections: secs.map(([h,body])=>`<section><h2>${esc(h)}</h2>${body}</section>`).join('')
  });
}

// ---------- Per-sign horoscope pages (evergreen, link into the daily tool) ----------
for(const s of ZODIAC){
  const str=s.strengths.slice(0,3).map(x=>x.toLowerCase()).join(', ');
  const cha=s.challenges.slice(0,2).map(x=>x.toLowerCase()).join(' or ');
  add({
    slug:`${s.slug}-horoscope`, group:'Astrology',
    title:`${s.sign} Horoscope: Traits and Daily Themes`,
    h1:`${s.sign} Horoscope`,
    description:`${s.sign} horoscope: what the sign means, its daily themes in love and work, and a free personalised ${s.sign} reading for today.`,
    answer:`A ${s.sign} horoscope reflects the sign\u2019s ${s.keyword}. ${s.essence} For today, our free tool combines your ${s.sign} Sun sign with your numerology Personal Day for a personalised reading.`,
    sections:
      `<section><h2>What a ${esc(s.sign)} horoscope reflects</h2><p>${esc(s.sign)} is a ${esc(s.element)} sign ruled by ${esc(s.ruler)}. ${esc(s.essence)} That is the lens a ${esc(s.sign)} horoscope reads through.</p></section>`+
      `<section><h2>${esc(s.sign)} daily themes</h2><p>At its best, ${esc(s.sign)} energy shows up as being ${esc(str)}. Under pressure it can tip into ${esc(cha)}. A daily ${esc(s.sign)} horoscope is really about noticing which way today is pulling you.</p></section>`+
      `<section><h2>${esc(s.sign)} in love and relationships</h2><p>${esc(s.love)}</p></section>`+
      `<section><h2>Get today\u2019s personalised ${esc(s.sign)} horoscope</h2><p>A generic sun-sign horoscope is the same for everyone born under ${esc(s.sign)}. Our <a href="daily-horoscope.html">free daily horoscope</a> makes it personal by combining your ${esc(s.sign)} Sun sign with your numerology Personal Day, so the reading shifts with your own cycle. You can also build your full <a href="app.html">numerology and astrology chart</a> free.</p></section>`
  });
}
for(const s of ZODIAC){
  const wstr=s.strengths.slice(0,3).map(x=>x.toLowerCase()).join(', ');
  const wcha=s.challenges.slice(0,2).map(x=>x.toLowerCase()).join(' or ');
  add({ slug:`${s.slug}-love-horoscope`, group:'Astrology',
    title:`${s.sign} Love Horoscope: Romance and Relationships`,
    h1:`${s.sign} Love Horoscope`,
    description:`${s.sign} love horoscope: how ${s.sign} loves, relationship strengths and what to work on, plus a free personalised reading for today.`,
    answer:`A ${s.sign} love horoscope looks at how the sign shows up in romance. ${s.love} For today, our free tool personalises this using your numerology Personal Day.`,
    sections:
      `<section><h2>How ${esc(s.sign)} loves</h2><p>${esc(s.love)}</p></section>`+
      `<section><h2>${esc(s.sign)} relationship strengths</h2><p>In relationships, ${esc(s.sign)} tends to bring warmth through being ${esc(wstr)}. That is what a ${esc(s.sign)} love horoscope leans on when the day goes well.</p></section>`+
      `<section><h2>What ${esc(s.sign)} works on in love</h2><p>The growth edge for ${esc(s.sign)} in love is around being ${esc(wcha)}. Noticing it early keeps small frictions from turning into patterns.</p></section>`+
      `<section><h2>Today\u2019s personalised ${esc(s.sign)} love reading</h2><p>A generic ${esc(s.sign)} love horoscope is the same for everyone. Our <a href="daily-horoscope.html">free daily horoscope</a> personalises it with your numerology Personal Day, and you can build a full <a href="app.html">compatibility chart</a> free.</p></section>`
  });
  add({ slug:`${s.slug}-career-horoscope`, group:'Astrology',
    title:`${s.sign} Career Horoscope: Work, Money and Ambition`,
    h1:`${s.sign} Career Horoscope`,
    description:`${s.sign} career horoscope: work style, strengths on the job, money themes and a free personalised reading for today.`,
    answer:`A ${s.sign} career horoscope looks at how the sign works and earns. ${s.career} For today, our free tool personalises this using your numerology Personal Day.`,
    sections:
      `<section><h2>${esc(s.sign)} at work</h2><p>${esc(s.career)}</p></section>`+
      `<section><h2>${esc(s.sign)} strengths on the job</h2><p>At work, ${esc(s.sign)} tends to be ${esc(wstr)}. A ${esc(s.sign)} career horoscope reads the day through those strengths.</p></section>`+
      `<section><h2>Money and ambition for ${esc(s.sign)}</h2><p>Where ${esc(s.sign)} can trip up professionally is being ${esc(wcha)}. Keeping that in view helps with steady decisions about work and money.</p></section>`+
      `<section><h2>Today\u2019s personalised ${esc(s.sign)} career reading</h2><p>A generic ${esc(s.sign)} career horoscope applies to everyone. Our <a href="daily-horoscope.html">free daily horoscope</a> personalises it with your numerology Personal Day, and the full <a href="app.html">chart</a> shows your Expression and work-related numbers free.</p></section>`
  });
}
add({ slug:'zodiac-horoscopes', group:'Astrology',
  title:'Horoscopes by Zodiac Sign',
  h1:'Horoscopes by Zodiac Sign',
  description:'Free horoscopes for every zodiac sign, plus a personalised daily horoscope combining your Sun sign with your numerology Personal Day.',
  answer:'Choose your zodiac sign for its horoscope themes, or use the free daily horoscope tool for a personalised reading that combines your Sun sign with your numerology Personal Day.',
  sections:`<section><h2>Get today\u2019s personalised reading</h2><p>Our <a href="daily-horoscope.html">free daily horoscope</a> combines your Sun sign with your numerology Personal Day, so it is personal to you rather than the same for everyone born under your sign.</p></section><section><h2>Horoscopes by sign</h2><div class="grid cards link-cards">${ZODIAC.map(s=>`<article><h3><a href="${s.slug}-horoscope.html">${esc(s.sign)} Horoscope</a></h3></article>`).join('')}</div></section><section><h2>Love horoscopes by sign</h2><div class="grid cards link-cards">${ZODIAC.map(s=>`<article><h3><a href="${s.slug}-love-horoscope.html">${esc(s.sign)} Love</a></h3></article>`).join('')}</div></section><section><h2>Career horoscopes by sign</h2><div class="grid cards link-cards">${ZODIAC.map(s=>`<article><h3><a href="${s.slug}-career-horoscope.html">${esc(s.sign)} Career</a></h3></article>`).join('')}</div></section>` });

// ---------- Zodiac compatibility hub ----------
const zPairs = pages.filter(p=>p.group==='Astrology' && /-compatibility$/.test(p.slug));
add({ slug:'zodiac-compatibility', group:'Astrology',
  title:'Zodiac Compatibility: Every Sun-Sign Pairing',
  h1:'Zodiac Sign Compatibility',
  description:'How every zodiac sign pairs with the others in love and life. Browse all sun-sign compatibility combinations from Aries to Pisces.',
  answer:'Zodiac compatibility compares two sun signs by element, modality and ruling planet to describe how their energies tend to blend. This hub links to a page for every sign-pair combination.',
  sections:`<section><h2>Browse every sign pairing</h2><p>Choose a combination to see where two signs click, where they clash, and how to make the pairing work.</p><div class="grid cards link-cards">${zPairs.map(p=>`<article><h3><a href="${p.slug}.html">${esc(p.h1)}</a></h3></article>`).join('')}</div></section>` });

add({ slug:'lucky-numbers-numerology', group:'Learn',
  title:'Lucky Numbers in Numerology: How to Find Yours',
  h1:'Lucky Numbers in Numerology',
  description:'How to find your lucky numbers in numerology from your birth date, what each number means, and a free tool that calculates them for you.',
  answer:'Your lucky numbers in numerology come from your own chart, mainly your Life Path, Birthday and Personal Day numbers, rather than being chosen at random. This page explains how to find them and what they mean.',
  sections:
    `<section><h2>What are lucky numbers in numerology?</h2><p>In numerology, your lucky numbers are not random. They are the core numbers of your own chart, the ones that repeat across your Life Path, Birthday and current cycle. Numbers that echo your chart are said to feel supportive to you, which is why they are personal rather than universal.</p></section>`+
    `<section><h2>How to find your lucky numbers</h2><ol><li><strong>Life Path number</strong>, from your full date of birth, your single most important number.</li><li><strong>Birthday number</strong>, the day of the month you were born.</li><li><strong>Personal Day number</strong>, which changes daily and sets the tone for today.</li><li>Where the same digit appears in more than one of these, it carries extra weight for you.</li></ol></section>`+
    `<section><h2>What your lucky numbers mean</h2><p>Each number from 1 to 9 carries a theme, from the leadership of 1 to the completion of 9. Read the meaning of each on our <a href="life-path-numbers.html">Life Path meaning</a> pages to see what your own lucky numbers point to.</p></section>`+
    `<section><h2>Get your lucky numbers free</h2><p>Our free <a href="app.html">numerology chart</a> calculates your Life Path, Birthday and Personal Day numbers and shows your lucky numbers for today, with the arithmetic behind each so you can check it. The <a href="daily-horoscope.html">daily horoscope</a> refreshes them each day.</p></section>`
});

// ---------- Merge (override guides + append zodiac/angel) ----------
const dataPath=path.join(root,'data','pages.json');
const existing=JSON.parse(fs.readFileSync(dataPath,'utf8'));
const genBySlug=new Map(pages.map(p=>[p.slug,p]));
const OVERRIDE=new Set(GUIDES.map(g=>g[0]));
const merged=existing.map(e=>(OVERRIDE.has(e.slug)&&genBySlug.has(e.slug))?genBySlug.get(e.slug):e);
const have=new Set(merged.map(p=>p.slug));
const fresh=pages.filter(p=>!have.has(p.slug));
// link the new angel numbers into the existing angel hub
const extraAngel=fresh.filter(p=>p.group==='Angel Numbers');
const angelHub=merged.find(p=>p.slug==='angel-numbers');
if(angelHub&&extraAngel.length){angelHub.sections+=`<section><h2>More angel number meanings</h2><div class="grid cards link-cards">${extraAngel.map(p=>`<article><h3><a href="${p.slug}.html">${esc(p.h1)}</a></h3></article>`).join('')}</div>`;}
fs.writeFileSync(dataPath, JSON.stringify([...merged,...fresh],null,2));
const byGroup={}; fresh.forEach(p=>byGroup[p.group]=(byGroup[p.group]||0)+1);
console.log('gen-extra: overrode',[...OVERRIDE].filter(s=>have.has(s)).length,'guides; added',fresh.length,'new:',JSON.stringify(byGroup));
