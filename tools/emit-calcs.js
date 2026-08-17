const fs=require('fs'), path=require('path');
const {page,wrapTables,esc,ROOT}=require('./gen-v28.js');
const {CALCS}=require('./lib/calculator-content.js');
const HOME={name:'Home',href:'index.html'}, CHUB={name:'Calculators',href:'calculators.html'};
const keys=Object.keys(CALCS);
let n=0;
for(const k of keys){
  const d=CALCS[k];
  const sibs=keys.filter(x=>x!==k).sort(()=>0).slice(0,3);
  // deterministic sibling pick, offset by index so pages don't all link to the same three
  const i=keys.indexOf(k);
  const rel=[keys[(i+1)%keys.length],keys[(i+4)%keys.length],keys[(i+7)%keys.length]].filter(x=>x!==k);
  const p={
    slug:k, title:d.h1, h1:d.h1, eyebrow:'Calculators',
    desc:d.desc.slice(0,155),
    crumbs:[HOME,CHUB,{name:d.h1,href:k+'.html'}],
    answer:d.answer, faqLabel:d.kw,
    sections:
      `<section class="extractable"><h2>What does the ${esc(d.kw)} need?</h2>`
      +`<table><thead><tr><th>Item</th><th>Detail</th></tr></thead><tbody>`
      +`<tr><td>Input required</td><td>${esc(d.input)}</td></tr>`
      +`<tr><td>Method</td><td>${esc(d.formula)}</td></tr>`
      +`</tbody></table></section>`
      +`<section class="extractable"><h2>How is the ${esc(d.kw.replace(' calculator',''))} worked out step by step?</h2><ol>`
      +d.example.map(x=>`<li>${esc(x)}</li>`).join('')
      +`</ol></section>`
      +`<section class="extractable"><h2>Why might another site give a different result?</h2><p>${esc(d.differs)}</p></section>`,
    howto:{name:`How do I use the ${d.h1}?`,steps:[
      `Enter ${d.input.toLowerCase().replace(/\.$/,'')}.`,
      'Create the result.',
      'Open the calculation details to see every intermediate total.',
      'Compare the working against the step-by-step example on this page.'
    ]},
    faqs:d.faqs,
    related:rel.map(r=>[r+'.html',CALCS[r].h1,`A different input and a different method: ${CALCS[r].input.toLowerCase().replace(/\.$/,'')}.`])
  };
  fs.writeFileSync(path.join(ROOT,k+'.html'),wrapTables(page(p)),'utf8');
  n++;
}
console.log('rewrote '+n+' calculator pages');
