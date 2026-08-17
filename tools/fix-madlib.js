const fs=require('fs'),path=require('path'),glob=require('fs');
const F=require('./lib/cluster-faqs.js');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const ROOT=path.join(__dirname,'..');
const files=fs.readdirSync(ROOT).filter(f=>f.endsWith('.html'));

function faqsFor(n){
  let m;
  if((m=n.match(/^angel-number-(\d+)$/))) return F.angelFaqs(+m[1]);
  if((m=n.match(/^life-path-(\d+)-personal-year-(\d+)$/))) return F.lpPyFaqs(+m[1],+m[2]);
  if((m=n.match(/^life-path-(\d+)-and-(\d+)-compatibility$/))) return F.lpCompatFaqs(+m[1],+m[2]);
  if((m=n.match(/^life-path-(\d+)-compatibility$/))) return F.lpCompatFaqs(+m[1],+m[1]);
  if((m=n.match(/^life-path-number-(\d+)$/))) return F.numberFaqs(+m[1]);
  if((m=n.match(/^number-(\d+)$/))) return F.numberFaqs(+m[1]);
  if((m=n.match(/^personal-year-(\d+)$/))) return F.pyFaqs(+m[1]);
  if((m=n.match(/^zodiac-([a-z]+)$/)) && F.SIGN[m[1]]) return F.zodiacFaqs(m[1]);
  if((m=n.match(/^([a-z]+)-([a-z]+)-compatibility$/)) && F.SIGN[m[1]] && F.SIGN[m[2]]) return F.zodiacCompatFaqs(m[1],m[2]);
  return null;
}

let replaced=0, stripped=0;
for(const f of files){
  const p=path.join(ROOT,f);
  let s=fs.readFileSync(p,'utf8');
  if(!s.includes('How does MyNumerologyCharts explain')) continue;
  const slug=f.slice(0,-5);
  const faqs=faqsFor(slug);

  // remove templated sections
  s=s.replace(/<section class="extractable"><h2>How should I use[\s\S]*?<\/section>/,'');
  s=s.replace(/<section class="faq"[\s\S]*?<\/section>/,'');

  if(faqs){
    const blk=`<section class="faq" aria-labelledby="faq-${slug}"><h2 id="faq-${slug}">${esc('Questions people ask')}</h2>`
      +faqs.map((q,i)=>`<details id="q-${slug}-${i+1}"><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join('')
      +`</section>`;
    if(s.includes('<section class="related">')) s=s.replace('<section class="related">',blk+'<section class="related">');
    else s=s.replace('</main>',blk+'</main>');
    replaced++;
  } else stripped++;

  // rebuild or drop FAQPage schema to match what is now visible
  s=s.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(mm,j)=>{
    let g; try{g=JSON.parse(j);}catch(e){return mm;}
    let arr=(g['@graph']||[]).filter(x=>x['@type']!=='FAQPage');
    if(faqs) arr.push({'@type':'FAQPage','@id':`https://mynumerologycharts.com/${slug}.html#faq`,
      mainEntity:faqs.map(q=>({'@type':'Question',name:q[0],acceptedAnswer:{'@type':'Answer',text:q[1]}}))});
    g['@graph']=arr;
    return '<script type="application/ld+json">'+JSON.stringify(g)+'</script>';
  });
  fs.writeFileSync(p,s,'utf8');
}
console.log(`replaced with per-entity FAQs: ${replaced}`);
console.log(`stripped (no computable facts, schema removed too): ${stripped}`);
