/* Master palm diagram.

   One drawing, used by all 24 palmistry pages. Every line and mount is its own
   element with an id, so a page highlights its own subject by setting
   data-hl on the wrapper — the CSS does the rest. This guarantees all 24
   diagrams stay consistent with each other, because there is only one drawing.

   Right hand, palm facing the viewer, thumb on the left. Code-drawn paths
   only: no photograph, no traced source, nothing licensed.

   viewBox is fixed and no width is set, so it scales to its container. The
   wrapper reserves aspect-ratio so it cannot cause layout shift on load. */

const PALM_SVG = `
<svg viewBox="0 0 300 390" xmlns="http://www.w3.org/2000/svg" class="palm-svg" role="img">
  <title id="palmTitle">Diagram of a right palm showing the major lines and mounts</title>

  <!-- hand outline -->
  <path class="p-outline" d="
    M 78 330
    C 70 300, 66 262, 70 232
    C 60 226, 44 214, 38 198
    C 32 182, 40 172, 52 176
    C 62 180, 74 192, 82 202
    C 84 190, 86 178, 88 168
    L 90 96 C 90 84, 108 84, 108 96
    L 110 150
    L 128 150
    L 130 74 C 130 62, 148 62, 148 74
    L 150 150
    L 168 152
    L 172 84 C 172 72, 190 72, 190 84
    L 188 154
    L 204 158
    L 212 112 C 214 100, 232 102, 230 114
    L 224 176
    C 230 200, 234 226, 232 254
    C 230 290, 216 320, 200 338
    C 180 352, 128 352, 104 346
    C 92 342, 82 338, 78 330 Z" />

  <!-- mounts, drawn under the lines -->
  <ellipse id="mount-of-venus"   class="p-mount" cx="108" cy="286" rx="34" ry="46"/>
  <ellipse id="mount-of-moon"    class="p-mount" cx="206" cy="288" rx="26" ry="40"/>
  <ellipse id="mount-of-jupiter" class="p-mount" cx="102" cy="172" rx="19" ry="16"/>
  <ellipse id="mount-of-saturn"  class="p-mount" cx="140" cy="168" rx="19" ry="16"/>
  <ellipse id="mount-of-apollo"  class="p-mount" cx="178" cy="172" rx="19" ry="16"/>
  <ellipse id="mount-of-mercury" class="p-mount" cx="212" cy="184" rx="17" ry="15"/>
  <ellipse id="mount-of-mars"    class="p-mount" cx="88"  cy="224" rx="16" ry="18"/>
  <ellipse id="mount-of-mars-2"  class="p-mount" cx="224" cy="238" rx="15" ry="20"/>

  <!-- major lines -->
  <path id="heart-line"     class="p-line" d="M 230 178 C 210 160, 176 150, 148 152 C 130 154, 116 160, 106 168"/>
  <path id="head-line"      class="p-line" d="M 80 206 C 104 200, 140 204, 170 214 C 190 220, 206 228, 216 236"/>
  <path id="life-line"      class="p-line" d="M 82 196 C 78 218, 80 246, 90 274 C 100 302, 112 322, 122 338"/>
  <path id="fate-line"      class="p-line" d="M 150 338 C 150 310, 149 268, 148 232 C 147 210, 146 194, 145 182"/>
  <path id="sun-line"       class="p-line" d="M 186 288 C 184 262, 182 232, 180 196"/>
  <path id="intuition-line" class="p-line" d="M 228 300 C 240 278, 240 250, 230 224 C 226 212, 222 202, 218 196"/>

  <!-- marriage and children lines, on the outer edge below the little finger -->
  <g id="marriage-line" class="p-group">
    <path class="p-line p-fine" d="M 232 168 L 250 166"/>
    <path class="p-line p-fine" d="M 233 180 L 249 179"/>
  </g>
  <g id="children-lines" class="p-group">
    <path class="p-line p-hair" d="M 238 168 L 238 156"/>
    <path class="p-line p-hair" d="M 243 167 L 243 157"/>
    <path class="p-line p-hair" d="M 247 167 L 247 159"/>
  </g>
</svg>`;

/* Labels used in the caption beneath the diagram, so the page still explains
   itself when images are off or a screen reader is in use. */
const PALM_LABEL = {
  'heart-line':     'the heart line, the uppermost horizontal line below the fingers',
  'head-line':      'the head line, running across the middle of the palm',
  'life-line':      'the life line, curving around the base of the thumb',
  'fate-line':      'the fate line, running up the centre of the palm',
  'sun-line':       'the sun line, running toward the base of the ring finger',
  'marriage-line':  'the marriage lines, on the outer edge below the little finger',
  'children-lines': 'the children lines, the fine vertical marks above the marriage lines',
  'intuition-line': 'the intuition line, curving on the outer edge of the palm',
  'mount-of-venus':   'the Mount of Venus, the large mound at the base of the thumb',
  'mount-of-jupiter': 'the Mount of Jupiter, below the index finger',
  'mount-of-saturn':  'the Mount of Saturn, below the middle finger',
  'mount-of-apollo':  'the Mount of Apollo, below the ring finger',
  'mount-of-mercury': 'the Mount of Mercury, below the little finger',
  'mount-of-mars':    'the two Mounts of Mars, above the thumb and on the opposite edge',
  'mount-of-moon':    'the Mount of Moon, at the base of the palm opposite the thumb'
};

module.exports = { PALM_SVG, PALM_LABEL };
