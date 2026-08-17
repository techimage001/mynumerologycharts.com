/* Rebuild the 31 birthday-number pages with per-day content.
   Every fact below is computed from the day itself, so the pages differ by
   construction rather than by paraphrase: the reduction chain, master-number
   status, karmic-debt route, and which other days share the reduced digit. */
const fs=require('fs'), path=require('path');
const {page,wrapTables,esc,ROOT}=require('./gen-v28.js');

const MASTER=[11,22], DEBT=[13,14,16,19];
const digitsum=n=>String(n).split('').reduce((a,c)=>a+ +c,0);
function chain(d){
  const steps=[]; let n=d;
  while(n>9 && !MASTER.includes(n)){ const s=digitsum(n); steps.push(`${String(n).split('').join(' + ')} = ${s}`); n=s; }
  return {final:n,steps};
}
const MEAN={1:['initiative','starting things and working independently'],2:['co-operation','working alongside others and reading a room'],
3:['expression','communicating, and making something people enjoy'],4:['structure','building something that lasts and holds up'],
5:['change','variety, movement and adapting quickly'],6:['responsibility','caring for people and holding things together'],
7:['analysis','understanding something properly before acting'],8:['scale','organising resources and working at size'],
9:['completion','finishing things and taking a broad view'],11:['heightened awareness','sensitivity to atmosphere, read as an intensified 2'],
22:['building at scale','turning a large idea into something concrete, read as an intensified 4']};

const pages=[];
for(let d=1; d<=31; d++){
  const c=chain(d);
  const isMaster=MASTER.includes(d);
  const isDebt=DEBT.includes(d);
  const red=c.final;
  const siblings=[];
  for(let x=1;x<=31;x++){ if(x!==d && chain(x).final===red) siblings.push(x); }
  const [theme,gloss]=MEAN[red]||MEAN[9];
  const ord=n=>n+(['th','st','nd','rd'][(n%100-20)%10]||['th','st','nd','rd'][n%100]||'th');
  const O=ord(d);

  const reduceLine = d<=9
    ? `Days 1 to 9 need no reduction, so the birthday number for the ${O} is simply ${d}.`
    : isMaster
      ? `${d} is held as a master number rather than reduced, so the birthday number for the ${O} is ${d} and not ${digitsum(d)}.`
      : `${c.steps.join(', then ')}. The birthday number for the ${O} is ${red}.`;

  const debtLine = isDebt
    ? `The ${O} is one of four days whose number is also a karmic debt number. ${d} passing through to ${red} carries the karmic debt ${d} reading in addition to the ordinary ${red} theme.`
    : `The ${O} carries no karmic debt reading, since ${d} is not one of the four karmic debt numbers 13, 14, 16 or 19.`;

  const sibLine = siblings.length
    ? `Days ${siblings.join(', ')} and the ${O} all reduce to ${red}, so they share the ${theme} theme. Traditional readings distinguish them by the route taken: a ${red} reached from ${d} is read with the flavour of ${d} still attached.`
    : `No other day of the month reduces to ${red}, which makes the ${O} the only birthday number carrying it.`;

  const faqs=[
    [`What is the birthday number for someone born on the ${O}?`,
     `${reduceLine} The month and year of birth play no part in this calculation at all, which is what separates the birthday number from the life path. Anyone born on the ${O} of any month in any year shares this birthday number.`],
    [`Does the ${O} reduce to a single digit?`,
     d<=9 ? `No reduction is needed. The ${O} is already a single digit, so the birthday number is ${d} as it stands. Reduction only applies to days from the 10th onward, where two digits are added together to reach a single figure or, in the case of the 11th and 22nd, held as master numbers.`
          : isMaster ? `No. ${d} is a master number in traditional numerology and is held unreduced, so the birthday number stays ${d} rather than becoming ${digitsum(d)}. Practitioners who reduce everything would read it as ${digitsum(d)} instead, which is a difference in convention rather than an arithmetic error.`
          : `Yes. ${c.steps.join(', then ')}, giving ${red}. The reduction is a single step for most days of the month. Only the 11th and 22nd are exceptions, being held as master numbers rather than reduced.`],
    [`Which other birth days share this number?`, sibLine],
    [`Is the ${O} connected to karmic debt?`, debtLine],
    [`What does birthday number ${red} traditionally mean?`,
     `Traditional numerology reads ${red} as ${theme}: ${gloss}. It is treated as a supporting number describing a particular talent rather than a whole life theme, which is the life path's role. Like every reading in numerology it is a symbolic prompt offered as entertainment, and it cannot indicate aptitude, career suitability or outcome.`]
  ];

  pages.push({d,O,red,isMaster,isDebt,siblings,theme,gloss,reduceLine,debtLine,sibLine,faqs,c});
}
module.exports={birthdayData:pages};
console.log('computed per-day data for '+pages.length+' days');
