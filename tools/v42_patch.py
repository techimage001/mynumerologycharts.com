#!/usr/bin/env python3
"""v42 patch for mynumerologycharts.com.
Applies the Name Checker, its sitewide placements and the SEO fixes to an
already-built v41 site, in place. Safe to run twice: every step checks
whether it has already been applied.

    python3 tools/v42_patch.py /path/to/site
"""
import glob, json, os, re, sys, html, datetime

SITE = sys.argv[1] if len(sys.argv) > 1 else '.'
os.chdir(SITE)
DOMAIN = 'https://mynumerologycharts.com'
OLDV, NEWV = '35', '36'
log = []

def rd(p): return open(p, encoding='utf-8').read()
def wr(p, s): open(p, 'w', encoding='utf-8').write(s)
def esc(s): return html.escape(s, quote=True)
pages = sorted(glob.glob('*.html'))

# ------------------------------------------------------------------ 1. CSS
css = rd('assets/site.css')
if 'v42 Name Checker' not in css:
    wr('assets/site.css', css.rstrip() + '\n' + rd('tools/v42/name-checker.css'))
    log.append('site.css: Name Checker styles appended')

# ------------------------------------------------------------------ 2. nav, footer, cache version
NAV_OLD = '<a href="app.html">Create Chart</a>'
NAV_NEW = '<a href="app.html">Create Chart</a><a class="nav-new" href="name-checker.html">Name Checker</a>'
FOOT_OLD = '<a href="app.html">Complete Personal Dashboard</a>'
FOOT_NEW = '<a href="app.html">Complete Personal Dashboard</a><a href="name-checker.html">Name Checker</a>'
n_nav = n_foot = n_v = 0
for p in pages:
    s = rd(p); o = s
    if 'href="name-checker.html">Name Checker</a></nav>' not in s and 'nav-new' not in s and NAV_OLD in s:
        s = s.replace(NAV_OLD, NAV_NEW, 1); n_nav += 1
    if FOOT_OLD in s and FOOT_NEW not in s:
        s = s.replace(FOOT_OLD, FOOT_NEW, 1); n_foot += 1
    s2 = s.replace('assets/site.css?v=' + OLDV, 'assets/site.css?v=' + NEWV).replace('assets/site.js?v=' + OLDV, 'assets/site.js?v=' + NEWV)
    if s2 != s: n_v += 1; s = s2
    if s != o: wr(p, s)
log.append(f'nav link added on {n_nav} pages, footer link on {n_foot}, cache version {OLDV}->{NEWV} on {n_v}')

# ------------------------------------------------------------------ 3. SEO: number page titles and descriptions
NUM_TITLES = {}
for n in ['1','2','3','4','5','6','7','8','9','11','22','33']:
    p = f'number-{n}.html'
    s = rd(p)
    m = re.search(r'represents ([^.]+)\.', s)
    traits = (m.group(1) if m else '').strip()
    master = n in ('11', '22', '33')
    title = (f'Master Number {n} Meaning: Life Path, Name and Love' if master
             else f'Number {n} Meaning in Numerology: Life Path, Name and Love')
    desc = (f'What {n} means as your Life Path or name number: {traits}, '
            f'its strengths and pitfalls, love matches, and how to check if a name adds up to {n}.')
    if len(desc) > 155:
        desc = f'What {n} means as your Life Path or name number: {traits}, strengths, pitfalls and love matches.'
    NUM_TITLES[f'number-{n}'] = (title, desc)

def set_title_desc(s, title, desc):
    s = re.sub(r'<title>[^<]*</title>', '<title>' + esc(title) + '</title>', s, count=1)
    for pat in [r'(<meta name="description" content=")[^"]*(")', r'(<meta property="og:description" content=")[^"]*(")', r'(<meta name="twitter:description" content=")[^"]*(")']:
        s = re.sub(pat, lambda m: m.group(1) + esc(desc) + m.group(2), s, count=1)
    for pat in [r'(<meta property="og:title" content=")[^"]*(")', r'(<meta name="twitter:title" content=")[^"]*(")']:
        s = re.sub(pat, lambda m: m.group(1) + esc(title) + m.group(2), s, count=1)
    return s

for slug, (t, d) in NUM_TITLES.items():
    wr(slug + '.html', set_title_desc(rd(slug + '.html'), t, d))
log.append('rewrote title + description on 12 number pages')

# ------------------------------------------------------------------ 4. SEO: descriptions an earlier build cut off mid-sentence
FIXED_DESC = {
 'air-hand': 'Air hand palmistry: a square palm with long fingers. How to identify the shape, what it traditionally means and the limits of reading character from a hand.',
 'calculate-four-pinnacles': 'How to calculate the four Pinnacles: reduce your birth month, day and year, then add them in pairs. Worked example with every step shown.',
 'children-lines': 'Children lines palmistry: where the fine vertical lines sit, what tradition says about counting them, and why they cannot predict how many children you have.',
 'editorial-policy': 'How MyNumerologyCharts writes, checks, corrects and versions its calculation rules and interpretations, and how to report a mistake.',
 'life-path-vs-expression': 'Life Path vs Expression: one comes from your birth date, the other from your full name. What each describes and how to read them together.',
 'marriage-line': 'Marriage line palmistry: where the relationship lines sit, what one, two or no lines traditionally mean, and what a palm can and cannot tell you.',
 'mount-of-apollo': 'Mount of Apollo palmistry: the Sun mount below the ring finger, what raised and flat versions traditionally mean, and why it does not measure talent.',
 'mount-of-mercury': 'Mount of Mercury palmistry: the mound below the little finger, what raised and flat variations traditionally mean, and its link to the marriage lines.',
 'mount-of-moon': 'Mount of Moon palmistry: the Luna mount at the base of the palm, what full and flat variations traditionally mean, and its link with imagination.',
 'personal-year-guide': 'Personal Year guide: a one-year theme in a nine-year cycle, found by adding your birth month and day to the current year. Meanings for years 1 to 9.',
 'pinnacle-numbers-guide': 'Pinnacle numbers are four life-stage numbers calculated from your birth date. How to work them out, the ages they cover and what each one means.',
 'pinnacles-vs-personal-year': 'Pinnacles describe life-stage themes lasting years; the Personal Year is a one-year theme. How they differ and how to read them together.',
 'water-hand': 'Water hand palmistry: a long oval palm with long fingers. How to identify the shape, what it traditionally means and why the sensitivity reading is symbolic.',
}
def set_desc(s, desc):
    for pat in [r'(<meta name="description" content=")[^"]*(")', r'(<meta property="og:description" content=")[^"]*(")', r'(<meta name="twitter:description" content=")[^"]*(")']:
        s = re.sub(pat, lambda mm: mm.group(1) + esc(desc) + mm.group(2), s, count=1)
    return s
fixed = 0
for slug, d in FIXED_DESC.items():
    assert len(d) <= 158, (slug, len(d))
    wr(slug + '.html', set_desc(rd(slug + '.html'), d)); fixed += 1
for p in glob.glob('life-path-[0-9]-personal-year-[0-9].html'):
    s = rd(p)
    m = re.search(r'<meta name="description" content="([^"]*)"', s)
    d = html.unescape(m.group(1))
    if re.search(r'Focus, love and cautions for( the)?\.$', d):
        wr(p, set_desc(s, re.sub(r'Focus, love and cautions for( the)?\.$', 'Focus, love and cautions.', d))); fixed += 1
log.append(f'fixed {fixed} meta descriptions that were cut off mid-sentence')

# ------------------------------------------------------------------ 5. the Name Checker tool markup
def tool_html(mode):
    return f'''<section class="nc-tool" id="nameChecker" data-mode="{mode}" aria-labelledby="ncTitle">
<h2 id="ncTitle">Compare names against a birth date</h2>
<div class="nc-modes" role="group" aria-label="What are you naming?"><button type="button" data-nc-mode="baby">Baby name</button><button type="button" data-nc-mode="business">Business name</button><button type="button" data-nc-mode="married">Married or new name</button><button type="button" data-nc-mode="own">My own name</button></div>
<form class="nc-form" data-nc-form novalidate>
<div class="nc-grid"><label><span data-nc-dob-label>Date of birth</span><input type="date" data-nc-dob required></label>
<label>Numerology system<select data-nc-system><option value="pythagorean">Pythagorean (used across this site)</option><option value="chaldean">Chaldean</option></select></label></div>
<div><span class="nc-label" data-nc-names-label>Names</span><p class="nc-hint" data-nc-hint></p><div data-nc-names></div><button type="button" class="nc-addbtn" data-nc-add>+ Add another name</button></div>
<div class="nc-actions"><button type="submit" class="btn btn-primary">Rank these names</button><p class="nc-status" data-nc-status aria-live="polite"></p></div>
<p class="nc-small">Everything is calculated in your browser. Names and dates are not sent to us or stored.</p>
</form>
<div class="nc-results" data-nc-results hidden aria-live="polite"></div>
</section>'''

SCRIPTS = '<script src="assets/name-checker.js?v=1" defer></script><script src="assets/name-checker-ui.js?v=1" defer></script>'
MINI = '<script src="assets/name-mini.js?v=1" defer></script>'

def add_scripts(s, tags):
    if tags in s: return s
    return s.replace('<script src="assets/site.js', tags + '<script src="assets/site.js', 1)

# ------------------------------------------------------------------ 6. name-checker.html (built from the baby page shell so it matches)
shell = rd('baby-name-numerology.html')
NC_TITLE = 'Name Checker: Compare Names With Numerology | MyNumerologyCharts'
NC_DESC = 'Rank baby names, business names or a married name against a birth date using Pythagorean or Chaldean numerology. Free ranking with the working shown.'
NC_CANON = DOMAIN + '/name-checker.html'
head = re.search(r'<head>.*?</head>', shell, re.S).group(0)
head = set_title_desc(head, NC_TITLE, NC_DESC)
head = head.replace(DOMAIN + '/baby-name-numerology.html', NC_CANON)
head = re.sub(r'<script type="application/ld\+json">.*?</script>', '', head, flags=re.S)
schema = {'@context': 'https://schema.org', '@graph': [
    {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': DOMAIN + '/'},
        {'@type': 'ListItem', 'position': 2, 'name': 'Name Numerology', 'item': DOMAIN + '/name-numerology.html'},
        {'@type': 'ListItem', 'position': 3, 'name': 'Name Checker', 'item': NC_CANON}]},
    {'@type': 'WebApplication', 'name': 'MyNumerologyCharts Name Checker', 'url': NC_CANON, 'applicationCategory': 'LifestyleApplication', 'operatingSystem': 'Any',
     'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'description': 'Free ranking. Optional full report.'}},
    {'@type': 'FAQPage', 'mainEntity': []}]}
FAQ = [
    ('Is the score a prediction?', 'No. It shows how a name number pairs with birth numbers under traditional numerology families. It is symbolic and for entertainment. It cannot tell you how a child, a business or a marriage will turn out, and a name you love and can live with matters more than any score.'),
    ('How is the score worked out?', 'Each name gives an Expression number (all letters), a Soul Urge (vowels) and a Personality number (consonants). These are paired with the Life Path and Birthday number from the date. Same number scores 100, same root 95, same family (1-5-7, 2-4-8, 3-6-9) 82 and contrast 55. The weighted result is shown on a 40 to 100 scale, so contrast is never presented as failure.'),
    ('Pythagorean or Chaldean?', 'Pythagorean is the system used everywhere else on this site and is the default. Chaldean uses a different letter chart and is popular in India. The two can give different numbers for the same name, which is expected. Our guide to why calculators disagree explains it.'),
    ('What does the full report add?', 'The full pairing table and letter working for every name, respellings that keep the sound and score higher, a side-by-side chart and a print-ready page you can save as a PDF. The ranking itself stays free.'),
    ('Do you store the names I type?', 'No. The calculation runs in your browser. If you buy the full report, only your licence key is checked with our payment provider, Lemon Squeezy.'),
]
schema['@graph'][2]['mainEntity'] = [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in FAQ]
head = head.replace('</head>', '<script type="application/ld+json">' + json.dumps(schema, separators=(',', ':')) + '</script></head>')
body_open = shell[shell.index('<body>'):shell.index('<main')]
after_main = shell[shell.index('</main>') + len('</main>'):]
main = ('<main id="main" class="container" data-page-slug="name-checker"><div class="breadcrumbs"><a href="index.html">Home</a> / <a href="name-numerology.html">Name Numerology</a> / Name Checker</div>'
        '<header class="page-head"><p class="eyebrow">Name Numerology</p><h1>Name Checker</h1>'
        '<p class="answer-block">Choosing between names? Enter a birth date and up to ten names, and the checker ranks them by how their numbers pair with that date. Use it for a baby name shortlist, a business name, a married name or a new spelling of your own. The ranking is free and the working is always shown.</p></header>'
        + tool_html('baby') +
        '<section class="extractable"><h2>Questions about the Name Checker</h2>' + ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in FAQ) + '</section>'
        '<section class="extractable"><h2>Related guides</h2><ul><li><a href="baby-name-numerology.html">Baby name numerology</a></li><li><a href="business-name-numerology.html">Business name numerology</a></li><li><a href="birth-name-vs-current-name.html">Birth name vs current name</a></li><li><a href="chaldean-vs-pythagorean.html">Chaldean vs Pythagorean</a></li><li><a href="why-calculators-disagree.html">Why calculators disagree</a></li></ul></section>'
        '</main>')
nc = '<!doctype html><html lang="en-GB">' + head + body_open + main + after_main
nc = add_scripts(nc, SCRIPTS)
nc = re.sub(r'<script>window\.MNC_PAGES=.*?</script>', '', nc, flags=re.S)
wr('name-checker.html', nc)
log.append('created name-checker.html')

# ------------------------------------------------------------------ 7. full tool on the existing name landing pages
LANDING = {'baby-name-numerology': 'baby', 'business-name-numerology': 'business', 'birth-name-vs-current-name': 'married', 'name-numerology': 'own'}
for slug, mode in LANDING.items():
    p = slug + '.html'; s = rd(p)
    if 'id="nameChecker"' in s: continue
    i = s.index('</header>', s.index('class="page-head"')) + len('</header>')
    s = s[:i] + tool_html(mode) + s[i:]
    wr(p, add_scripts(s, SCRIPTS))
log.append('full checker embedded on ' + ', '.join(LANDING))

# ------------------------------------------------------------------ 8. mini checker on high-impression and high-click pages
def mini(mode, src, title):
    return f'<div data-name-mini data-mode="{mode}" data-src="{src}" data-title="{esc(title)}"></div>'

MINI_PAGES = {}
for n in ['1','2','3','4','5','6','7','8','9','11','22','33']:
    MINI_PAGES[f'number-{n}'] = ('own', f'Does your name add up to {n}? Type it and see.')
MINI_PAGES.update({
    'marriage-line': ('married', 'Changing your surname after marriage? See what your new name adds up to.'),
    'pinnacles-calculator': ('own', 'Your pinnacles come from your birth date. Your name numbers come from you: check yours.'),
    'birthday-number-calculator': ('own', 'Now see what your name adds up to.'),
    'expression-number-calculator': ('own', 'Weighing up a different spelling or a new name? Compare them.'),
    'soul-urge-calculator': ('own', 'Compare spellings of a name side by side.'),
    'personality-number-calculator': ('own', 'Compare spellings of a name side by side.'),
    'chaldean-vs-pythagorean': ('own', 'See a name in both systems at once.'),
    'why-calculators-disagree': ('own', 'Check a name in both systems at once.'),
    'lucky-numbers-numerology': ('own', 'What number does your name add up to?'),
    'master-numbers': ('own', 'Does your name add up to a master number?'),
})
for f in glob.glob('life-path-number-*.html'):
    MINI_PAGES[f[:-5]] = ('own', 'Your Life Path is fixed. See how your name pairs with it.')
for f in glob.glob('life-path-[0-9]-personal-year-[0-9].html'):
    MINI_PAGES[f[:-5]] = ('own', 'Your numbers are set at birth. Your name is not. See how yours pairs with your Life Path.')

n_mini = 0
for slug, (mode, title) in MINI_PAGES.items():
    p = slug + '.html'
    if not os.path.exists(p): continue
    s = rd(p)
    if 'data-name-mini' in s: continue
    head_end = s.index('</header>', s.index('class="page-head"')) + len('</header>')
    nxt = s.find('</section>', head_end)
    i = nxt + len('</section>') if nxt > 0 and nxt < s.index('</main>') else head_end
    s = s[:i] + mini(mode, slug, title) + s[i:]
    wr(p, add_scripts(s, MINI)); n_mini += 1
log.append(f'mini checker added to {n_mini} pages')

# ------------------------------------------------------------------ 9. homepage card and app hook
s = rd('index.html')
if 'nc-home-card' not in s:
    card = ('<section class="nc-home-card"><div><p class="eyebrow">New</p><h2>Choosing a name?</h2>'
            '<p>Rank a baby name shortlist, a business name or a married name against a birth date. See every number and the working behind it. The ranking is free.</p>'
            '<a class="btn btn-primary" href="name-checker.html?src=home">Open the Name Checker</a></div>'
            + mini('baby', 'home', 'Try a name now') + '</section>')
    anchor = '</section>'
    i = s.index(anchor, s.index('hero-actions')) + len(anchor)
    s = s[:i] + card + s[i:]
    wr('index.html', add_scripts(s, MINI))
    log.append('homepage card added')
s = rd('app.html')
if 'name-app-hook.js' not in s:
    wr('app.html', add_scripts(s, '<script src="assets/name-app-hook.js?v=1" defer></script>'))
    log.append('app.html: name prompt under results')

# ------------------------------------------------------------------ 10. privacy note for payments
s = rd('privacy.html')
if 'Lemon Squeezy' not in s:
    note = ('<section class="extractable"><h2>Payments for the Name Checker full report</h2><p>The Name Checker ranking is free. If you buy the optional full report, '
            'the payment is taken by Lemon Squeezy, which acts as the merchant of record and handles your card details, billing address and receipt under its own privacy policy. '
            'We never see or store card details. To unlock the report we send only your licence key to Lemon Squeezy to check it is valid, and keep a key on your device so you do not have to enter it again.</p></section>')
    i = s.rindex('</section>', 0, s.index('</main>')) + len('</section>')
    wr('privacy.html', s[:i] + note + s[i:])
    log.append('privacy.html: payment paragraph added')

# ------------------------------------------------------------------ 11. sitemap, llms.txt, robots
sm = rd('sitemap.xml')
today = datetime.date.today().isoformat()
if 'name-checker.html' not in sm:
    sm = sm.replace('</urlset>', f'<url><loc>{DOMAIN}/name-checker.html</loc><lastmod>{today}</lastmod></url></urlset>')
    wr('sitemap.xml', sm)
ll = rd('llms.txt')
if 'name-checker.html' not in ll:
    wr('llms.txt', ll.rstrip() + f'\n- {DOMAIN}/name-checker.html: {NC_DESC}\n')
rb = rd('robots.txt')
if 'sitemap-blog.xml' not in rb:
    wr('robots.txt', rb.rstrip() + f'\nSitemap: {DOMAIN}/sitemap-blog.xml\n')
log.append('sitemap, llms.txt and robots.txt updated')

# ------------------------------------------------------------------ 12. pages.json, so a future rebuild keeps the new titles
pj = json.load(open('data/pages.json', encoding='utf-8'))
for p in pj:
    if p['slug'] in NUM_TITLES:
        p['title'], p['description'] = NUM_TITLES[p['slug']]
json.dump(pj, open('data/pages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

print('\n'.join(log))
