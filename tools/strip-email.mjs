// Post-build sweep: remove every VISIBLE email address and mailto: link from the
// built HTML and route people to the contact form instead. The address stays only
// in api/config.php (server-side), so the contact form still delivers to it.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const EMAIL = 'info@mynumerologycharts.com';
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));

const subs = [
  // "Email <mailto>. You can also use the form below." -> just the form
  [/Email <a[^>]*href="mailto:info@mynumerologycharts\.com"[^>]*>[^<]*<\/a>\.\s*You can also use the form below\./g, 'Use the form below.'],
  // "Email <mailto>" anywhere else -> "Use our contact form"
  [/Email <a[^>]*href="mailto:info@mynumerologycharts\.com"[^>]*>[^<]*<\/a>/g, 'Use <a href="contact.html">our contact form</a>'],
  // full mailto anchors -> contact form link
  [/<a[^>]*href="mailto:info@mynumerologycharts\.com"[^>]*>[^<]*<\/a>/g, '<a href="contact.html">our contact form</a>'],
  // any leftover mailto href
  [/mailto:info@mynumerologycharts\.com/g, 'contact.html'],
  // schema email field (safety – should already be a contactPoint)
  [/,"email":"info@mynumerologycharts\.com"/g, ''],
  [/"email":"info@mynumerologycharts\.com",/g, ''],
  // common visible phrasings, kept grammatical
  [/Email\s+info@mynumerologycharts\.com/g, 'Use our contact form'],
  [/Contact MyNumerologyCharts at info@mynumerologycharts\.com/g, 'Contact MyNumerologyCharts through our contact form'],
  [/\bat info@mynumerologycharts\.com/g, 'through our contact form'],
  [/\bto info@mynumerologycharts\.com/g, 'through our contact form'],
  [/Do not email\b/g, 'Do not send'],
  [/\bemail us\b/gi, 'contact us'],
  // catch-all: any remaining bare address
  [new RegExp(EMAIL.replace(/[.]/g, '\\.'), 'g'), 'our contact form'],
];

let changed = 0, before = 0, after = 0;
for (const f of files) {
  const p = path.join(root, f);
  let html = fs.readFileSync(p, 'utf8');
  before += (html.match(/info@mynumerologycharts\.com/g) || []).length;
  let out = html;
  for (const [re, rep] of subs) out = out.replace(re, rep);
  after += (out.match(/info@mynumerologycharts\.com/g) || []).length;
  if (out !== html) { fs.writeFileSync(p, out); changed++; }
}
console.log(`strip-email: processed ${files.length} pages, edited ${changed}, email strings ${before} -> ${after}`);
if (after > 0) { console.error('WARNING: email strings remain'); process.exit(1); }
