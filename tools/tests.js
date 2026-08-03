'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();
let passed = 0;
let failed = 0;
const failures = [];
function ok(condition, message) {
  if (condition) passed += 1;
  else { failed += 1; failures.push(message); console.error('FAIL', message); }
}
function decode(s='') { return s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>'); }
function stripHtml(h='') { return decode(h.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()); }
function attrs(tag='') {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return out;
}
function firstTag(html, tag, predicate=()=>true) {
  const re = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
  for (const m of html.matchAll(re)) { const a=attrs(m[0]); if (predicate(a,m[0])) return {raw:m[0], attrs:a}; }
  return null;
}
function getTitle(html) { const m=html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i); return m?stripHtml(m[1]):''; }
function getMeta(html, name) { const t=firstTag(html,'meta',a=>(a.name||'').toLowerCase()===name.toLowerCase()); return t?(t.attrs.content||''):''; }
function getCanonical(html) { const t=firstTag(html,'link',a=>(a.rel||'').toLowerCase().split(/\s+/).includes('canonical')); return t?(t.attrs.href||''):''; }
function getJsonLd(html) {
  const blocks=[];
  const re=/<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) { const a=attrs('<script '+m[1]+'>'); if ((a.type||'').toLowerCase()==='application/ld+json') blocks.push(m[2].trim()); }
  return blocks;
}
function walkSchema(node, fn) { if (!node || typeof node!=='object') return; fn(node); if (Array.isArray(node)) node.forEach(x=>walkSchema(x,fn)); else Object.values(node).forEach(x=>walkSchema(x,fn)); }
function words(s) { return stripHtml(s).toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean); }
function shingles(a,n=5) { const s=new Set(); for(let i=0;i<=a.length-n;i++) s.add(a.slice(i,i+n).join(' ')); return s; }

const titles = new Map();
const descriptions = new Map();
const mainTexts = [];
const prohibited = [
  /\beducational\b/i, /\beducation\b/i, /\bself[- ]reflection\b/i,
  /\bpersonal reflection\b/i, /\breflection purposes?\b/i, /\beducational purposes?\b/i,
  /\bdaily insight\b/i, /\btoday[’']s personal insight\b/i, /\bpersonal insight\b/i,
  /\blucky numbers\b/i, /\btoday[’']s colour\b/i, /\blisten to today[’']s insight\b/i
];
const exactDisclaimer = 'For entertainment purposes only. Not professional advice. You are responsible for your decisions and actions.';

for (const file of htmlFiles) {
  const full = path.join(root,file);
  const html = fs.readFileSync(full,'utf8');
  const visible = stripHtml(html);
  const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)].length;
  ok(h1s===1, `${file}: exactly one H1 (found ${h1s})`);

  const title = getTitle(html);
  ok(title.length>=8 && title.length<=70, `${file}: title length 8–70 (found ${title.length})`);
  if (titles.has(title)) ok(false, `${file}: duplicate title also used by ${titles.get(title)}`); else { titles.set(title,file); ok(true, `${file}: unique title`); }

  const desc = getMeta(html,'description');
  ok(desc.length>=50 && desc.length<=160, `${file}: description length 50–160 (found ${desc.length})`);
  if (descriptions.has(desc)) ok(false, `${file}: duplicate description also used by ${descriptions.get(desc)}`); else { descriptions.set(desc,file); ok(true, `${file}: unique description`); }

  const expectedCanonical = file==='index.html' ? 'https://mynumerologycharts.com/' : `https://mynumerologycharts.com/${file}`;
  ok(getCanonical(html)===expectedCanonical, `${file}: canonical equals ${expectedCanonical}`);
  ok(getMeta(html,'viewport')!=='', `${file}: viewport meta present`);
  ok(visible.includes(exactDisclaimer), `${file}: exact short disclaimer present`);

  for (const rx of prohibited) ok(!rx.test(visible), `${file}: prohibited visible wording absent (${rx.source})`);

  const imgs=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>attrs(m[0]));
  ok(imgs.every(a=>Object.prototype.hasOwnProperty.call(a,'alt') && a.alt.trim().length>0), `${file}: every image has meaningful alt text`);

  const jsonBlocks=getJsonLd(html);
  ok(jsonBlocks.length>0, `${file}: JSON-LD present`);
  let breadcrumbFound=false;
  for (let i=0;i<jsonBlocks.length;i++) {
    let data;
    try { data=JSON.parse(jsonBlocks[i]); ok(true, `${file}: JSON-LD block ${i+1} parses`); }
    catch(e) { ok(false, `${file}: JSON-LD block ${i+1} parses (${e.message})`); continue; }
    walkSchema(data,node=>{
      const types=Array.isArray(node['@type'])?node['@type']:[node['@type']];
      if(types.includes('BreadcrumbList')) {
        breadcrumbFound=true;
        const items=node.itemListElement;
        ok(Array.isArray(items)&&items.length>=1, `${file}: BreadcrumbList has itemListElement`);
        if(Array.isArray(items)) items.forEach((it,idx)=>{
          ok(it && it['@type']==='ListItem', `${file}: breadcrumb ${idx+1} is ListItem`);
          ok(Number(it.position)===idx+1, `${file}: breadcrumb ${idx+1} position is sequential`);
          ok(typeof it.name==='string'&&it.name.trim()!=='', `${file}: breadcrumb ${idx+1} has name`);
          ok(typeof it.item==='string'&&/^https:\/\/mynumerologycharts\.com\//.test(it.item), `${file}: breadcrumb ${idx+1} has absolute item URL`);
        });
      }
    });
  }
  if(file!=='404.html') ok(breadcrumbFound, `${file}: BreadcrumbList present`);

  const main=(html.match(/<main\b[\s\S]*?<\/main>/i)||[''])[0];
  ok(main!=='', `${file}: main landmark present`);
  mainTexts.push([file,shingles(words(main),5)]);

  // Internal links: ignore fragments, mail, phone, data, JavaScript and absolute external URLs.
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const a=attrs(m[0]); const href=(a.href||'').trim();
    if(!href || /^(#|mailto:|tel:|javascript:|data:|https?:\/\/)/i.test(href)) continue;
    const clean=href.split('#')[0].split('?')[0]; if(!clean) continue;
    const target=clean.startsWith('/') ? path.resolve(root, clean.slice(1)) : path.resolve(path.dirname(full),clean);
    ok(fs.existsSync(target), `${file}: internal link exists (${href})`);
  }

  // FAQ markup is optional. When present, require usable matching questions and answers.
  const faqSection=(html.match(/<section\b[^>]*class=["'][^"']*\bfaq\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i)||[''])[0];
  if(faqSection) {
    const qs=[...faqSection.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map(x=>stripHtml(x[1]));
    const answers=[...faqSection.matchAll(/<details\b[^>]*>[\s\S]*?<summary\b[^>]*>[\s\S]*?<\/summary>([\s\S]*?)<\/details>/gi)].map(x=>words(x[1]).length);
    ok(qs.length>=3, `${file}: FAQ has at least 3 questions (found ${qs.length})`);
    ok(new Set(qs.map(q=>q.toLowerCase())).size===qs.length, `${file}: FAQ questions are unique within page`);
    ok(answers.length===qs.length && answers.every(n=>n>=25), `${file}: FAQ answers are present and substantive`);
  }
}

// Near-duplicate main content check; threshold intentionally catches copied pages while allowing common layout/legal text.
let maxJaccard=0, closestPair='';
for(let i=0;i<mainTexts.length;i++) for(let j=i+1;j<mainTexts.length;j++) {
  const A=mainTexts[i][1],B=mainTexts[j][1]; let inter=0; for(const x of A) if(B.has(x)) inter++;
  const union=A.size+B.size-inter; const score=union?inter/union:0;
  if(score>maxJaccard){maxJaccard=score; closestPair=`${mainTexts[i][0]} / ${mainTexts[j][0]}`;}
  ok(score<=0.75, `content similarity <= 0.75 (${score.toFixed(3)}: ${mainTexts[i][0]} vs ${mainTexts[j][0]})`);
}

const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
for(const bot of ['Googlebot','Bingbot','OAI-SearchBot','ChatGPT-User','PerplexityBot','Claude-SearchBot','GPTBot','Google-Extended']) ok(robots.includes(`User-agent: ${bot}`), `robots.txt includes ${bot}`);
const keyFile=fs.readdirSync(root).find(f=>/^[a-f0-9]{32}\.txt$/.test(f));
ok(!!keyFile,'IndexNow key file present');
ok(fs.existsSync(path.join(root,'tools/submit-index.js')),'IndexNow submission script present');

const pages=JSON.parse(fs.readFileSync(path.join(root,'data/pages.json'),'utf8'));
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const expected=htmlFiles.filter(f=>f!=='404.html' && !/noindex/i.test(getMeta(fs.readFileSync(path.join(root,f),'utf8'),'robots'))).length;
ok(sitemapUrls.length===expected, `sitemap has one URL per indexable HTML page (${sitemapUrls.length}/${expected})`);
ok(new Set(sitemapUrls).size===sitemapUrls.length,'sitemap URLs are unique');
ok(pages.length>=80,'data/pages.json contains complete page catalogue');

const css=fs.readFileSync(path.join(root,'assets/site.css'),'utf8');
ok(/box-sizing\s*:\s*border-box/i.test(css),'CSS includes border-box sizing');
ok(/(?:input|select|textarea)[\s\S]{0,600}width\s*:\s*100%/i.test(css),'CSS constrains form controls to width 100%');
ok(/overflow-x\s*:\s*auto/i.test(css),'CSS supports horizontal table overflow on narrow screens');
ok(/@media\s*\([^)]*max-width/i.test(css),'CSS contains responsive mobile breakpoint');

for (const js of ['assets/site.js','assets/app.js','assets/daily-horoscope.js']) {
  const p=path.join(root,js); ok(fs.existsSync(p),`${js} exists`);
  if(fs.existsSync(p)) { const r=spawnSync(process.execPath,['--check',p],{encoding:'utf8'}); ok(r.status===0,`${js} passes JavaScript syntax check${r.status===0?'':': '+(r.stderr||r.stdout).trim()}`); }
}

const result={files:htmlFiles.length,passed,failed,maxJaccard:+maxJaccard.toFixed(4),closestPair};
console.log(JSON.stringify(result,null,2));
if(failures.length) process.exit(1);
