/* Adds the per-day distinction that actually exists: the digit pair and its
   order. Traditional numerology reads 12 (1 then 2) differently from 21
   (2 then 1) even though both reduce to 3 — the first digit is read as the
   leading quality and the second as the supporting one. This is a real
   distinction, not a paraphrase, and it is what separates same-digit days. */
const fs=require('fs'),path=require('path');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const LEAD={0:'a quiet, unforced quality that does not announce itself',
1:'initiative, taking the first step',2:'attentiveness to other people',3:'expression and putting things into words',
4:'method and doing things in order',5:'movement and appetite for change',6:'care and taking responsibility for others',
7:'analysis and needing to understand first',8:'organisation and working at scale',9:'perspective and seeing the whole'};
const SUPP={0:'without a second quality modifying it',1:'steadied by independence',2:'softened by co-operation',
3:'lifted by communication',4:'grounded by structure',5:'loosened by adaptability',6:'warmed by responsibility',
7:'deepened by reflection',8:'sharpened by ambition',9:'widened by perspective'};
let n=0;
for(let d=1;d<=31;d++){
  const f=path.join(__dirname,'..',`birthday-number-${d}.html`);
  if(!fs.existsSync(f)) continue;
  let s=fs.readFileSync(f,'utf8');
  if(s.includes('id="digit-order"')) continue;
  const ord=x=>x+(['th','st','nd','rd'][(x%100-20)%10]||['th','st','nd','rd'][x%100]||'th');
  const O=ord(d);
  let block;
  if(d<10){
    block=`<section class="extractable" id="digit-order"><h2>Why is the ${esc(O)} read as a single digit?</h2>`
     +`<p>The ${esc(O)} is one of the nine single-digit birth days, so there is no digit pair to order and no reduction step. Traditional numerology reads it as ${esc(LEAD[d])} expressed directly, without a second digit modifying it.</p>`
     +`<p>This is the practical difference between a single-digit day and a two-digit day reducing to the same number. Someone born on the ${esc(O)} and someone born on a later day that also reduces to ${d} share a birthday number, but only the ${esc(O)} carries it undiluted.</p></section>`;
  } else {
    const a=+String(d)[0], b=+String(d)[1];
    block=`<section class="extractable" id="digit-order"><h2>How does the digit order of ${d} affect the reading?</h2>`
     +`<p>The ${esc(O)} is made of ${a} followed by ${b}. Traditional numerology reads the first digit as the leading quality and the second as the one supporting it, so ${d} is read as ${esc(LEAD[a])}, ${esc(SUPP[b])}.</p>`
     +`<p>This is what distinguishes the ${esc(O)} from other days reducing to the same number. A day of ${b}${a} would carry the same reduced digit while reversing which quality leads, and traditional readings treat that reversal as a genuine difference rather than a technicality. It is the main reason each day of the month is read separately rather than only the nine reduced digits.</p></section>`;
  }
  s=s.replace('<section class="faq"',block+'<section class="faq"');
  fs.writeFileSync(f,s,'utf8'); n++;
}
console.log('digit-order section added to '+n+' pages');
