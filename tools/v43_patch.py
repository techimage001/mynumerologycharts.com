#!/usr/bin/env python3
"""v43: everything free, Boy/Girl, middle-name finder, downloads and sharing,
anonymous usage counts. Edits the built site in place; safe to re-run."""
import glob, html, json, os, re, sys
os.chdir(sys.argv[1] if len(sys.argv) > 1 else '.')
rd = lambda p: open(p, encoding='utf-8').read()
def wr(p, s): open(p, 'w', encoding='utf-8').write(s)
esc = lambda s: html.escape(s, quote=True)
log = []

def tool_html(mode):
    return f'''<section class="nc-tool" id="nameChecker" data-mode="{mode}" aria-labelledby="ncTitle">
<h2 id="ncTitle">Compare names against a birth date</h2>
<div class="nc-modes" role="group" aria-label="What are you naming?"><button type="button" data-nc-mode="baby">Baby name</button><button type="button" data-nc-mode="middle">Middle name finder</button><button type="button" data-nc-mode="business">Business name</button><button type="button" data-nc-mode="married">Married or new name</button><button type="button" data-nc-mode="own">My own name</button></div>
<form class="nc-form" data-nc-form novalidate>
<div class="nc-sexrow" data-nc-sex-row><span class="nc-label">Baby is a</span><div class="nc-modes nc-sex-btns" role="group" aria-label="Baby is a"><button type="button" data-nc-sex="g">Girl</button><button type="button" data-nc-sex="b">Boy</button><button type="button" data-nc-sex="any">Not sure yet</button></div></div>
<div class="nc-grid"><label><span data-nc-dob-label>Date of birth</span><input type="date" data-nc-dob required></label>
<label>Numerology system<select data-nc-system><option value="pythagorean">Pythagorean (used across this site)</option><option value="chaldean">Chaldean</option></select></label></div>
<div class="nc-grid" data-nc-middle-row hidden><label>First name<input type="text" data-nc-first maxlength="40" autocomplete="off" placeholder="Olivia"></label><label>Surname <span class="nc-opt">(optional)</span><input type="text" data-nc-surname maxlength="40" autocomplete="off" placeholder="Okafor"></label></div>
<div><span class="nc-label" data-nc-names-label>Names</span><p class="nc-hint" data-nc-hint></p><div data-nc-names></div><button type="button" class="nc-addbtn" data-nc-add>+ Add another name</button></div>
<p class="nc-notice" role="note"><strong>For entertainment only.</strong> Scores are symbolic numerology, not facts or predictions about any person, baby, marriage or business. A name you love matters more than any score.</p>
<div class="nc-actions"><button type="submit" class="btn btn-primary">Rank these names</button><p class="nc-status" data-nc-status aria-live="polite"></p></div>
<p class="nc-small">Free, with the full working. Everything is calculated in your browser; names and dates are not sent to us or stored.</p>
</form>
<div class="nc-results" data-nc-results hidden aria-live="polite"></div>
</section>'''

n = 0
for p in glob.glob('*.html'):
    s = rd(p)
    m = re.search(r'<section class="nc-tool" id="nameChecker" data-mode="(\w+)".*?<div class="nc-results" data-nc-results hidden aria-live="polite"></div>\s*</section>', s, re.S)
    if not m or 'data-nc-sex-row' in m.group(0): continue
    s = s.replace(m.group(0), tool_html(m.group(1)))
    s = s.replace('assets/name-checker.js?v=1', 'assets/name-checker.js?v=2').replace('assets/name-checker-ui.js?v=1', 'assets/name-checker-ui.js?v=2')
    wr(p, s); n += 1
log.append(f'checker form updated on {n} pages')

# cache-bust site.css (styles appended below) and the mini widget
n = 0
for p in glob.glob('*.html'):
    s = rd(p); o = s
    s = s.replace('assets/site.css?v=36', 'assets/site.css?v=37').replace('assets/site.js?v=36', 'assets/site.js?v=37').replace('assets/name-mini.js?v=1', 'assets/name-mini.js?v=2')
    if s != o: wr(p, s); n += 1
log.append(f'cache version 36->37 on {n} pages')

css = rd('assets/site.css')
if 'v43 Name Checker' not in css:
    wr('assets/site.css', css.rstrip() + '\n' + rd('tools/v43/name-checker-v43.css'))
    log.append('site.css: v43 styles appended')

# name-checker.html: FAQ, schema and copy now that everything is free
p = 'name-checker.html'; s = rd(p)
REPL = [
 ('What does the full report add?', 'Is it really free?'),
 ('The full pairing table and letter working for every name, respellings that keep the sound and score higher, a side-by-side chart and a print-ready page you can save as a PDF. The ranking itself stays free.',
  'Yes. The ranking, the full working for every name, the respellings, the middle-name finder and the image and PDF downloads are all free. There is no account to create.'),
 ('No. The calculation runs in your browser. If you buy the full report, only your licence key is checked with our payment provider, Lemon Squeezy.',
  'No. The calculation runs in your browser. Images and PDFs are made on your device. If you share a link, the names travel inside the link itself and the date is only included if you tick the box.'),
 ('Free ranking. Optional full report.', 'Free, with downloads and sharing.'),
 ('Use it for a baby name shortlist, a business name, a married name or a new spelling of your own. The ranking is free and the working is always shown.',
  'Use it for a baby name shortlist, to find a middle name, or for a business name, a married name or a new spelling of your own. It is free, the working is always shown, and you can save the result as an image or PDF.'),
]
for a, b in REPL:
    s = s.replace(a, b).replace(esc(a), esc(b))
s = s.replace('<h1>Name Checker</h1>', '<h1>Name Checker: Free Name Numerology Comparison</h1>', 1)
s = s.replace('Is the score a prediction?</summary>', 'Is the score a prediction?</summary>', 1)
if 'Does a boy or girl change the score?' not in s:
    extra = ('<details><summary>Does choosing boy or girl change the score?</summary><p>No. Numerology works only from the letters and the date, so the numbers are the same whoever the name is for. Choosing boy or girl labels each name and decides which names the middle-name finder suggests. Labels come from public birth records covering about 16,000 names; a name outside that list is shown as not in our list rather than guessed.</p></details>')
    s = s.replace('<details><summary>Pythagorean or Chaldean?</summary>', extra + '<details><summary>Pythagorean or Chaldean?</summary>', 1)
wr(p, s)
log.append('name-checker.html copy updated for free')

# privacy: payments paragraph replaced by an accurate free-tool paragraph
p = 'privacy.html'; s = rd(p)
old = re.search(r'<section class="extractable"><h2>Payments for the Name Checker full report</h2>.*?</section>', s, re.S)
if old:
    s = s.replace(old.group(0), '<section class="extractable"><h2>The Name Checker</h2><p>The Name Checker is free and runs in your browser. Names and dates you type are not sent to us. Images and PDF reports are created on your device. When you share a result, the names travel inside the link, and the date of birth is only included if you choose. We count how often the tool and its buttons are used, as anonymous totals per day with no cookies and no personal details. To stop that counter being abused, a one-way scrambled form of your connection address is kept for up to 24 hours and then deleted.</p></section>')
    wr(p, s); log.append('privacy.html: Name Checker paragraph updated')

print('\n'.join(log))
