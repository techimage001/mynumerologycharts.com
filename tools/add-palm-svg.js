const fs=require('fs'),path=require('path');
const {PALM_SVG,PALM_LABEL}=require('./lib/palm-svg.js');
const ROOT=path.join(__dirname,'..');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* page slug -> element id it should highlight */
const MAP={
  'heart-line':'heart-line','head-line':'head-line','life-line':'life-line','fate-line':'fate-line',
  'sun-line':'sun-line','marriage-line':'marriage-line','children-lines':'children-lines',
  'intuition-line':'intuition-line',
  'mount-of-venus':'mount-of-venus','mount-of-jupiter':'mount-of-jupiter','mount-of-saturn':'mount-of-saturn',
  'mount-of-apollo':'mount-of-apollo','mount-of-mercury':'mount-of-mercury','mount-of-mars':'mount-of-mars',
  'mount-of-moon':'mount-of-moon',
  'palm-reading':null,'palm-lines':null,'palm-mounts':null,'palm-reading-guide':null,
  'hand-shapes':null,'earth-hand':null,'air-hand':null,'fire-hand':null,'water-hand':null
};

function figure(hl){
  let svg=PALM_SVG;
  if(hl){
    // mark the highlighted element active, and mars highlights both mounts
    const ids = hl==='mount-of-mars' ? ['mount-of-mars','mount-of-mars-2'] : [hl];
    for(const id of ids){
      svg=svg.replace(new RegExp(`(id="${id}"\\s+class=")([^"]*)`), '$1$2 is-active');
    }
  }
  const label = hl ? PALM_LABEL[hl] : null;
  const aria = label
    ? `Diagram of a right palm with ${label} highlighted`
    : 'Diagram of a right palm showing the major lines and mounts';
  svg = svg.replace('role="img"', `role="img" aria-label="${esc(aria)}"`);
  const cap = label
    ? `The highlighted line shows ${label}. The other lines are drawn faintly for context. This is a schematic diagram: real hands vary considerably in where the lines sit and how deeply they are marked.`
    : `A schematic right palm showing the major lines and the mounts. Real hands vary considerably in where the lines sit, how long they run and how deeply they are marked.`;
  return `<figure class="palm-figure"${hl?` data-hl="${hl}"`:''}>${svg}<figcaption>${esc(cap)}</figcaption></figure>`;
}

let n=0;
for(const [slug,hl] of Object.entries(MAP)){
  const f=path.join(ROOT,slug+'.html');
  if(!fs.existsSync(f)) continue;
  let s=fs.readFileSync(f,'utf8');
  if(s.includes('palm-figure')) continue;
  // place it directly after the answer block so it is visible without scrolling
  // must target the PAGE heading block, not the site header
  const m=s.match(/<header class="page-head">[\s\S]*?<\/header>/);
  if(!m){ console.log('  SKIP (no page-head): '+slug); continue; }
  s=s.replace(m[0], m[0]+figure(hl));
  fs.writeFileSync(f,s,'utf8'); n++;
}
console.log('palm diagram added to '+n+' pages');
