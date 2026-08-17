/* v28 generator — karmic debt cluster + name numerology cluster.

   Emits pages inside the existing site shell captured from a live v27 page,
   so head, nav, footer, cookie banner and signup modal are identical to every
   other page by construction rather than by copying.

   Run:  node tools/gen-v28.js
*/
const fs = require('fs');
const path = require('path');
const { KARMIC_DEBT } = require('./lib/new-pages-data.js');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://mynumerologycharts.com/';
const V = 27;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---- shell, lifted from an existing page so nothing drifts ---- */
const donor = fs.readFileSync(path.join(ROOT, 'karmic-lessons-calculator.html'), 'utf8');
const ICONS = donor.slice(donor.indexOf('<link rel="icon"'), donor.indexOf('<script type="application/ld+json">'));
const BODY_OPEN = donor.slice(donor.indexOf('<body>'), donor.indexOf('<main'));
let FOOTER = donor.slice(donor.indexOf('<footer'));

function head(p) {
  const title = `${p.title} | MyNumerologyCharts`;
  const url = SITE + p.slug + '.html';
  const d = esc(p.desc);
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>`
    + `<meta name="description" content="${d}">`
    + `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`
    + `<link rel="canonical" href="${url}"><meta name="theme-color" content="#5b2d6f">`
    + `<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${d}">`
    + `<meta property="og:url" content="${url}"><meta property="og:site_name" content="MyNumerologyCharts"><meta property="og:locale" content="en_GB">`
    + `<meta property="og:image" content="${SITE}assets/social-card.svg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`
    + `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${d}">`
    + `<meta name="twitter:image" content="${SITE}assets/social-card.svg">`
    + ICONS
    + `<script>try{const t=localStorage.getItem('mnc-theme');if(t)document.documentElement.dataset.theme=t}catch{}</script>`
    + `<link rel="stylesheet" href="assets/site.css?v=${V}">`
    + `<script type="application/ld+json">${JSON.stringify(graph(p))}</script></head>`;
}

function graph(p) {
  const url = SITE + p.slug + '.html';
  const g = [
    { '@type': 'Organization', '@id': SITE + '#organization', name: 'MyNumerologyCharts', url: SITE.slice(0, -1),
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: SITE + 'contact.html' } },
    { '@type': 'WebSite', '@id': SITE + '#website', url: SITE.slice(0, -1), name: 'MyNumerologyCharts',
      publisher: { '@id': SITE + '#organization' } },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumbs', itemListElement: p.crumbs.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.href })) },
    /* Article author is the Organization, never a named person, and carries no
       dates because the content is evergreen. */
    { '@type': 'Article', '@id': url + '#article', headline: p.title, description: p.desc,
      mainEntityOfPage: url, author: { '@id': SITE + '#organization' }, publisher: { '@id': SITE + '#organization' } }
  ];
  if (p.faqs && p.faqs.length) {
    g.push({ '@type': 'FAQPage', '@id': url + '#faq', mainEntity: p.faqs.map(f => ({
      '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) });
  }
  if (p.howto) {
    g.push({ '@type': 'HowTo', '@id': url + '#howto', name: p.howto.name,
      step: p.howto.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })) });
  }
  return { '@context': 'https://schema.org', '@graph': g };
}

function page(p) {
  const crumbs = p.crumbs.map((c, i) => i === p.crumbs.length - 1
    ? esc(c.name) : `<a href="${c.href}">${esc(c.name)}</a>`).join(' / ');

  let body = `<main id="main" class="container" data-page-slug="${p.slug}">`
    + `<div class="breadcrumbs">${crumbs}</div>`
    + `<header class="page-head"><p class="eyebrow">${esc(p.eyebrow)}</p><h1>${esc(p.h1)}</h1>`
    + `<p class="answer-block">${esc(p.answer)}</p></header>`;

  body += p.sections;

  if (p.howto) {
    body += `<section class="tool-cta"><h2>${esc(p.howto.name)}</h2><ol>`
      + p.howto.steps.map(s => `<li>${esc(s)}</li>`).join('')
      + `</ol><p><a class="btn btn-primary" href="app.html">Open the free complete chart</a></p></section>`;
  }

  if (p.faqs && p.faqs.length) {
    body += `<section class="faq" aria-labelledby="faq-${p.slug}"><h2 id="faq-${p.slug}">Questions people ask about ${esc(p.faqLabel || p.h1.toLowerCase())}</h2>`
      + p.faqs.map((f, i) => `<details id="q-${p.slug}-${i + 1}"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')
      + `</section>`;
  }

  if (p.related && p.related.length) {
    body += `<section class="related"><h2>Where to go next from ${esc(p.h1.toLowerCase())}</h2><div class="grid cards">`
      + p.related.map(r => `<article><h3><a href="${r[0]}">${esc(r[1])}</a></h3><p>${esc(r[2])}</p></article>`).join('')
      + `</div></section>`;
  }

  body += `</main>`;
  return head(p) + BODY_OPEN + body + FOOTER;
}

/* wrap any emitted table so it scrolls on mobile (v27 fix) */
function wrapTables(html) {
  if (!html || html.indexOf('<table') === -1) return html;
  return html.replace(/<table\b[\s\S]*?<\/table>/g, m =>
    '<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable table">' + m + '</div>');
}

module.exports = { page, wrapTables, esc, KARMIC_DEBT, SITE, ROOT };
