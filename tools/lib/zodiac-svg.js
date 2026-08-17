/* Zodiac diagrams. One glyph plus a star pattern per sign, drawn as paths and
   circles so nothing is traced, licensed or fetched. Colours come from the
   theme variables, so they follow light and dark mode. viewBox 0 0 240 150. */

const GLYPH = {
  aries:      'M60 96 C60 62 68 46 82 46 C94 46 100 56 100 70 M100 96 C100 62 92 46 78 46',
  taurus:     'M62 52 C72 66 90 74 108 66 M108 66 C126 74 144 66 154 52 M108 70 a22 22 0 1 0 0.1 0',
  gemini:     'M66 50 L66 100 M104 50 L104 100 M56 50 L114 44 M56 100 L114 106',
  cancer:     'M58 62 C78 46 116 46 132 60 M132 60 a12 12 0 1 0 0.1 0 M132 88 C112 104 74 104 58 90 M58 90 a12 12 0 1 1 -0.1 0',
  leo:        'M74 100 a16 16 0 1 1 14 -24 C88 56 76 48 76 62 C76 84 100 92 112 78 C124 64 118 46 104 46',
  virgo:      'M56 46 L56 96 M56 56 C56 46 74 46 74 58 L74 96 M74 58 C74 46 92 46 92 58 L92 88 C92 100 106 102 114 92 M102 74 C120 66 126 88 110 100',
  libra:      'M56 100 L134 100 M56 86 L134 86 M72 86 C68 62 84 50 96 50 C110 50 124 64 120 86',
  scorpio:    'M52 46 L52 96 M52 56 C52 46 70 46 70 58 L70 96 M70 58 C70 46 88 46 88 58 L88 90 C88 100 100 104 108 96 L120 84 M120 84 L120 98 M120 84 L108 84',
  sagittarius:'M58 104 L124 44 M100 44 L126 44 L126 70 M78 68 L102 92',
  capricorn:  'M56 46 L56 92 M56 56 C56 46 74 46 74 58 L74 92 C74 46 96 46 100 62 C104 80 92 92 82 88 C96 96 116 92 116 76',
  aquarius:   'M56 62 L72 50 L88 62 L104 50 L120 62 L136 50 M56 92 L72 80 L88 92 L104 80 L120 92 L136 80',
  pisces:     'M66 44 C48 60 48 88 66 104 M126 44 C144 60 144 88 126 104 M58 74 L134 74'
};

/* Star patterns: [cx, cy, r] plus the lines joining them. Approximate,
   stylised arrangements rather than survey-accurate positions. */
const STARS = {
  aries:      { s: [[168,58,3],[190,50,2.4],[208,62,2],[196,80,1.8]], l: '168 58 L190 50 L208 62 L196 80' },
  taurus:     { s: [[164,74,3.2],[184,60,2.2],[202,52,2],[186,88,2],[206,92,1.8]], l: '202 52 L184 60 L164 74 L186 88 M164 74 L206 92' },
  gemini:     { s: [[168,48,2.8],[168,96,2.4],[200,44,2.8],[200,92,2.4]], l: '168 48 L168 96 M200 44 L200 92 M168 48 L200 44' },
  cancer:     { s: [[178,52,2.6],[196,66,2.2],[184,84,2],[166,74,1.8]], l: '178 52 L196 66 L184 84 L166 74 Z' },
  leo:        { s: [[166,88,3.2],[180,66,2.4],[198,54,2.6],[212,70,2],[196,86,1.8]], l: '166 88 L180 66 L198 54 L212 70 L196 86' },
  virgo:      { s: [[164,56,2.4],[184,68,3],[204,58,2.2],[192,88,2],[170,92,1.8]], l: '164 56 L184 68 L204 58 M184 68 L192 88 L170 92' },
  libra:      { s: [[170,54,2.6],[200,60,2.6],[180,84,2.2],[206,88,2]], l: '170 54 L200 60 L206 88 M200 60 L180 84' },
  scorpio:    { s: [[164,50,2.4],[178,62,2.8],[192,76,3.2],[206,88,2.2],[214,72,1.8]], l: '164 50 L178 62 L192 76 L206 88 L214 72' },
  sagittarius:{ s: [[164,88,2.6],[182,72,2.4],[200,58,3],[214,74,2],[196,86,1.8]], l: '164 88 L182 72 L200 58 L214 74 L196 86' },
  capricorn:  { s: [[164,56,2.6],[186,50,2.2],[206,66,2.4],[188,88,2.8],[168,78,2]], l: '164 56 L186 50 L206 66 L188 88 L168 78 Z' },
  aquarius:   { s: [[164,60,2.4],[182,52,2.6],[200,62,2.2],[186,80,2.8],[168,88,2]], l: '164 60 L182 52 L200 62 M182 52 L186 80 L168 88' },
  pisces:     { s: [[164,52,2.6],[182,66,2.2],[200,54,2.4],[196,86,2.6],[172,88,2]], l: '164 52 L182 66 L200 54 M182 66 L196 86 M182 66 L172 88' }
};

const SIGNMETA = {
  aries:['Aries','the ram','fire'], taurus:['Taurus','the bull','earth'],
  gemini:['Gemini','the twins','air'], cancer:['Cancer','the crab','water'],
  leo:['Leo','the lion','fire'], virgo:['Virgo','the maiden','earth'],
  libra:['Libra','the scales','air'], scorpio:['Scorpio','the scorpion','water'],
  sagittarius:['Sagittarius','the archer','fire'], capricorn:['Capricorn','the sea-goat','earth'],
  aquarius:['Aquarius','the water-bearer','air'], pisces:['Pisces','the fish','water']
};

function zodiacSvg(key) {
  const g = GLYPH[key], st = STARS[key], [name, creature] = SIGNMETA[key];
  const stars = st.s.map(([x, y, r]) => `<circle class="z-star" cx="${x}" cy="${y}" r="${r}"/>`).join('');
  return `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" class="zodiac-svg" role="img" aria-label="Symbol and star pattern for ${name}, ${creature}">
  <rect class="z-bg" x="0" y="0" width="240" height="150" rx="14"/>
  <path class="z-glyph" d="${g}"/>
  <path class="z-lines" d="${st.l}"/>
  ${stars}
</svg>`;
}

module.exports = { zodiacSvg, SIGNMETA, GLYPH };
