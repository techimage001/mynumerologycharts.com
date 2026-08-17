const fs=require('fs'),path=require('path');
const {zodiacSvg,SIGNMETA}=require('./lib/zodiac-svg.js');
const ROOT=path.join(__dirname,'..');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const KEYS=Object.keys(SIGNMETA);

function fig(k){
  const [n,c,el]=SIGNMETA[k];
  return `<figure class="zodiac-figure">${zodiacSvg(k)}<figcaption>${esc(n)}, ${esc(c)}: the traditional glyph and a stylised star pattern. ${esc(n)} is a ${esc(el)} sign.</figcaption></figure>`;
}
let n=0;
function insert(f,html){
  const p=path.join(ROOT,f);
  if(!fs.existsSync(p)) return false;
  let s=fs.readFileSync(p,'utf8');
  if(s.includes('zodiac-figure')) return false;
  const m=s.match(/<header class="page-head">[\s\S]*?<\/header>/);
  if(!m) return false;
  s=s.replace(m[0], m[0]+html);
  fs.writeFileSync(p,s,'utf8'); return true;
}
// 12 sign pages, 12 horoscope pages, love/career pages
for(const k of KEYS){
  for(const f of [`zodiac-${k}.html`,`${k}-horoscope.html`,`${k}-love-horoscope.html`,`${k}-career-horoscope.html`]){
    if(insert(f,fig(k))) n++;
  }
}
// compatibility pages get both signs
for(let i=0;i<KEYS.length;i++) for(let j=i+1;j<KEYS.length;j++){
  const f=`${KEYS[i]}-${KEYS[j]}-compatibility.html`;
  if(insert(f,`<div class="zodiac-pair">${fig(KEYS[i])}${fig(KEYS[j])}</div>`)) n++;
}
console.log('zodiac diagrams added to '+n+' pages');
