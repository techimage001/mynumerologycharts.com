/* Zodiac diagrams. One glyph plus a star pattern per sign, drawn as paths and
   circles so nothing is traced, licensed or fetched. Colours come from the
   theme variables, so they follow light and dark mode. viewBox 0 0 240 150. */

/* The twelve astrological characters, identical to the ones app.js and
   astrology.js already render in the dashboard. Drawing these by hand was the
   earlier mistake: the shapes came from memory and were wrong. Taken from the
   Unicode block they are correct by definition.
   U+FE0E is the text-presentation selector, which stops iOS substituting a
   colour emoji for the character. */
const VS = '\uFE0E';
const GLYPH_CHAR = {
  aries:'\u2648'+VS, taurus:'\u2649'+VS, gemini:'\u264A'+VS, cancer:'\u264B'+VS,
  leo:'\u264C'+VS, virgo:'\u264D'+VS, libra:'\u264E'+VS, scorpio:'\u264F'+VS,
  sagittarius:'\u2650'+VS, capricorn:'\u2651'+VS, aquarius:'\u2652'+VS, pisces:'\u2653'+VS
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
  const ch = GLYPH_CHAR[key], st = STARS[key], meta = SIGNMETA[key];
  const name = meta[0], creature = meta[1];
  const stars = st.s.map(function (a) { return '<circle class="z-star" cx="' + a[0] + '" cy="' + a[1] + '" r="' + a[2] + '"/>'; }).join('');
  return '<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" class="zodiac-svg" role="img" aria-label="Symbol and star pattern for ' + name + ', ' + creature + '">'
    + '<rect class="z-bg" x="0" y="0" width="240" height="150" rx="14"/>'
    + '<text class="z-glyph" x="86" y="76" text-anchor="middle" dominant-baseline="central">' + ch + '</text>'
    + '<path class="z-lines" d="' + st.l + '"/>'
    + stars
    + '</svg>';
}

module.exports = { zodiacSvg, SIGNMETA, GLYPH_CHAR };
