const fs=require('fs'),path=require('path'),{birthdayData}=require('./fix-birthday.js');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let done=0;
for(const b of birthdayData){
  const f=path.join(__dirname,'..',`birthday-number-${b.d}.html`);
  if(!fs.existsSync(f)) continue;
  let s=fs.readFileSync(f,'utf8');
  const slug=`birthday-number-${b.d}`;

  /* 1. drop the two templated sections */
  s=s.replace(/<section class="extractable"><h2>How should I use[\s\S]*?<\/section>/,'');
  s=s.replace(/<section class="faq"[\s\S]*?<\/section>/,'');

  /* 2. per-day calculation section, computed not written */
  const calc=`<section class="extractable"><h2>How is the birthday number for the ${b.O} worked out?</h2>`
    +`<p>${esc(b.reduceLine)}</p>`
    +`<table><thead><tr><th>Step</th><th>Result for the ${esc(b.O)}</th></tr></thead><tbody>`
    +`<tr><td>Day of birth</td><td>${b.d}</td></tr>`
    +`<tr><td>Reduction</td><td>${b.d<=9?'none needed':(b.isMaster?'held as a master number':esc(b.c.steps.join(', then ')))}</td></tr>`
    +`<tr><td>Birthday number</td><td>${b.red}</td></tr>`
    +`<tr><td>Master number</td><td>${b.isMaster?'yes':'no'}</td></tr>`
    +`<tr><td>Karmic debt route</td><td>${b.isDebt?'yes, '+b.d:'no'}</td></tr>`
    +`</tbody></table></section>`
    +`<section class="extractable"><h2>Which other birth days share this number?</h2><p>${esc(b.sibLine)}</p></section>`
    +`<section class="extractable"><h2>Does the ${esc(b.O)} carry a karmic debt?</h2><p>${esc(b.debtLine)}</p></section>`;

  /* 3. per-day FAQ */
  const faq=`<section class="faq" aria-labelledby="faq-${slug}"><h2 id="faq-${slug}">Questions people ask about being born on the ${esc(b.O)}</h2>`
    +b.faqs.map((q,i)=>`<details id="q-${slug}-${i+1}"><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join('')
    +`</section>`;

  s=s.replace('<section class="related">',calc+faq+'<section class="related">');

  /* 4. rebuild FAQPage schema from the new visible FAQs */
  s=s.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(m,j)=>{
    let g; try{ g=JSON.parse(j);}catch(e){return m;}
    const arr=g['@graph']||[];
    const idx=arr.findIndex(x=>x['@type']==='FAQPage');
    const node={'@type':'FAQPage','@id':`https://mynumerologycharts.com/${slug}.html#faq`,
      mainEntity:b.faqs.map(q=>({'@type':'Question',name:q[0],acceptedAnswer:{'@type':'Answer',text:q[1]}}))};
    if(idx>=0) arr[idx]=node; else arr.push(node);
    g['@graph']=arr;
    return '<script type="application/ld+json">'+JSON.stringify(g)+'</script>';
  });

  /* 5. wrap the new table for mobile */
  if(s.indexOf('table-scroll')===-1||true){
    s=s.replace(/<table\b[\s\S]*?<\/table>/g,m=>m.includes('table-scroll')?m:
      '<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable table">'+m+'</div>');
  }
  fs.writeFileSync(f,s,'utf8'); done++;
}
console.log('patched '+done+' birthday pages');
