/* Master palm diagram.

   One drawing, used by all 24 palmistry pages. Every line and mount is its own
   element with an id, so a page highlights its own subject by setting
   data-hl on the wrapper — the CSS does the rest. This guarantees all 24
   diagrams stay consistent with each other, because there is only one drawing.

   Right hand, palm facing the viewer, thumb on the left. Code-drawn paths
   only: no photograph, no traced source, nothing licensed.

   viewBox is fixed and no width is set, so it scales to its container. The
   wrapper reserves aspect-ratio so it cannot cause layout shift on load. */

/* Palm diagram, rebuilt from measured proportions.

   The first version was drawn freehand and looked like a mitten: four
   near-identical stub fingers, a notch by the little finger, a thumb stuck on
   with no web, and a bulbous palm base. This one is constructed:

     palm length ~= finger length (a true 50/50 split)
     index 0.92, ring 0.96, little 0.76 of the middle finger
     finger widths: index 21, middle 22, ring 20, little 17
     one continuous outline rather than a palm with fingers laid on top,
     which is what produced the notch

   Right hand, palm toward the viewer, so the thumb is on the viewer's RIGHT
   and the little finger on the left. Every line and mount keeps its id, so a
   page highlights its own subject via data-hl on the wrapper. */
const PALM_SVG = `
<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" class="palm-svg" role="img">
  <title>Diagram of a right palm showing the major lines and mounts</title>

  <!-- one continuous outline: wrist, little, ring, middle, index, thumb, wrist -->
  <path class="p-outline" d="
    M 92 372
    C 83 348, 78 314, 79 284
    C 80 262, 84 244, 89 234
    C 90 226, 86 156, 86 142
    C 86 130, 104 130, 104 142
    C 104 156, 106 218, 108 226
    C 113 214, 115 106, 115 90
    C 115 78, 133 78, 133 90
    C 133 106, 137 206, 139 214
    C 141 204, 145 68, 145 52
    C 145 40, 163 40, 163 52
    C 163 68, 167 204, 169 212
    C 171 202, 175 90, 175 74
    C 175 62, 193 62, 193 74
    C 193 90, 197 220, 200 230
    C 205 242, 210 252, 215 258
    C 220 254, 238 226, 247 212
    C 253 202, 269 210, 264 222
    C 256 242, 238 274, 227 290
    C 223 314, 219 344, 211 366
    C 202 382, 176 388, 150 388
    C 124 388, 100 382, 92 372 Z" />

  <!-- mounts, drawn under the lines and kept faint -->
  <ellipse id="mount-of-venus"   class="p-mount" cx="188" cy="320" rx="31" ry="46"/>
  <ellipse id="mount-of-moon"    class="p-mount" cx="102" cy="322" rx="25" ry="42"/>
  <ellipse id="mount-of-jupiter" class="p-mount" cx="186" cy="250" rx="17" ry="14"/>
  <ellipse id="mount-of-saturn"  class="p-mount" cx="156" cy="242" rx="17" ry="14"/>
  <ellipse id="mount-of-apollo"  class="p-mount" cx="126" cy="246" rx="16" ry="13"/>
  <ellipse id="mount-of-mercury" class="p-mount" cx="100" cy="256" rx="14" ry="13"/>
  <ellipse id="mount-of-mars"    class="p-mount" cx="208" cy="288" rx="13" ry="17"/>
  <ellipse id="mount-of-mars-2"  class="p-mount" cx="87"  cy="292" rx="12" ry="18"/>

  <!-- major lines. Little finger is on the LEFT, thumb on the RIGHT. -->
  <path id="heart-line"     class="p-line" d="M 86 258 C 106 240, 138 232, 164 234 C 178 235, 189 240, 197 246"/>
  <path id="head-line"      class="p-line" d="M 204 276 C 180 268, 146 268, 121 278 C 106 284, 96 291, 90 298"/>
  <path id="life-line"      class="p-line" d="M 203 268 C 208 296, 203 330, 190 356 C 180 374, 168 382, 158 386"/>
  <path id="fate-line"      class="p-line" d="M 150 382 C 150 350, 151 310, 152 278 C 152 260, 153 250, 153 246"/>
  <path id="sun-line"       class="p-line" d="M 121 340 C 123 308, 126 276, 127 252"/>
  <path id="intuition-line" class="p-line" d="M 83 344 C 72 316, 72 282, 83 256 C 87 246, 91 240, 95 236"/>

  <g id="marriage-line" class="p-group">
    <path class="p-line p-fine" d="M 100 238 L 80 235"/>
    <path class="p-line p-fine" d="M 100 252 L 81 250"/>
  </g>
  <g id="children-lines" class="p-group">
    <path class="p-line p-hair" d="M 92 237 L 92 221"/>
    <path class="p-line p-hair" d="M 87 236 L 87 223"/>
    <path class="p-line p-hair" d="M 82 236 L 82 225"/>
  </g>

  <!-- finger and thumb creases -->
  <g class="p-crease">
    <path d="M 90 196 q 8 3 16 0"/><path d="M 91 218 q 8 3 15 0"/>
    <path d="M 116 166 q 8 3 16 0"/><path d="M 118 202 q 8 3 15 0"/>
    <path d="M 146 136 q 8 3 16 0"/><path d="M 148 186 q 8 3 15 0"/>
    <path d="M 176 158 q 8 3 16 0"/><path d="M 178 208 q 8 3 15 0"/>
    <path d="M 218 258 q 10 -6 17 -14"/>
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
