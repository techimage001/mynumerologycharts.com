"""v43b: bold entertainment notices everywhere, Terms section, duplicate fixes.
Edits built HTML/JS/CSS in place. Safe to run once (guards against double-apply)."""
import glob, os, re, sys
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
NOTICE_TXT = ('<strong>For entertainment only.</strong> Scores are symbolic numerology, not facts or '
              'predictions about any person, baby, marriage or business. A name you love matters more than any score.')
NOTICE = '<p class="nc-notice" role="note">' + NOTICE_TXT + '</p>'
changed = []

# 1. Notice above the Check button on every page with the tool
for f in sorted(glob.glob('*.html')):
    s = open(f, encoding='utf-8').read(); o = s
    if 'data-nc-form' in s and 'class="nc-notice"' not in s:
        s = s.replace('<div class="nc-actions"><button type="submit"', NOTICE + '\n<div class="nc-actions"><button type="submit"', 1)
    # 2. Remove duplicated theme script + stylesheet in <head>
    th = "<script>try{const t=localStorage.getItem('mnc-theme');if(t)document.documentElement.dataset.theme=t}catch{}</script>"
    head, sep, rest = s.partition('</head>')
    for tag in (th,):
        while head.count(tag) > 1:
            i = head.rfind(tag); head = head[:i] + head[i + len(tag):]
    for css in set(re.findall(r'<link rel="stylesheet" href="assets/site\.css\?v=\d+">', head)):
        while head.count(css) > 1:
            i = head.rfind(css); head = head[:i] + head[i + len(css):]
    s = head + sep + rest
    # 3. Duplicate FAQ entry
    dup = re.search(r'(<details><summary>Does choosing boy or girl change the score\?</summary>.*?</details>)\1', s, re.S)
    if dup: s = s.replace(dup.group(0), dup.group(1))
    if s != o:
        open(f, 'w', encoding='utf-8').write(s); changed.append(f)

# Keep the form template in the earlier patch tool consistent
p = 'tools/v43_patch.py'; s = open(p, encoding='utf-8').read()
if 'nc-notice' not in s:
    s = s.replace('<div class="nc-actions"><button type="submit"', NOTICE + '\n<div class="nc-actions"><button type="submit"', 1)
    open(p, 'w', encoding='utf-8').write(s)

# 4. Results, image card and PDF
p = 'assets/name-checker-ui.js'; s = open(p, encoding='utf-8').read()
if 'nc-notice' not in s:
    s = s.replace("    var html = head + freeCards(rows)",
                  "    var html = head + '<p class=\"nc-notice\" role=\"note\">" + NOTICE_TXT.replace("'", "\\'") + "</p>' + freeCards(rows)", 1)
    s = s.replace("""    x.fillStyle = muted; x.font = '400 24px system-ui, sans-serif';
    x.fillText('A symbolic numerology reading, for entertainment.', 72, H - 118);""",
"""    x.fillStyle = ink; x.font = '800 28px system-ui, sans-serif';
    x.fillText('For entertainment only. A symbolic reading, not a prediction.', 72, H - 118);""", 1)
    s = s.replace("""    text(MODES[mode].title, '700 54px Georgia, serif', ink, 6);
    var showDate""", """    text(MODES[mode].title, '700 54px Georgia, serif', ink, 6);
    text('For entertainment only. Scores are symbolic numerology, not facts or predictions about any person, baby, marriage or business.', '800 24px system-ui, sans-serif', ink, 10);
    var showDate""", 1)
    s = s.replace("This is a symbolic reading for entertainment. It does not predict anything", "For entertainment only: it does not predict anything", 1)
    s = s.replace("+ freeCards(rows)\n      + '<p class=\"nc-small nc-method\">", "+ freeCards(rows)\n      + '<p class=\"nc-small nc-method\">", 1)
    open(p, 'w', encoding='utf-8').write(s); changed.append(p)

# 5. Mini widget (115 pages)
p = 'assets/name-mini.js'; s = open(p, encoding='utf-8').read()
if 'name-mini-note' not in s:
    s = s.replace("+ '<p class=\"name-mini-foot\">", "+ '<p class=\"name-mini-note\"><strong>For entertainment only.</strong> A symbolic number, not a prediction.</p>'\n      + '<p class=\"name-mini-foot\">", 1)
    open(p, 'w', encoding='utf-8').write(s); changed.append(p)

# 6. CSS
p = 'assets/site.css'; s = open(p, encoding='utf-8').read()
if '.nc-notice' not in s:
    s += ('\n/* v43b entertainment notices */\n'
          '.nc-notice{margin:14px 0;padding:12px 16px;border:2px solid var(--accent);border-radius:12px;background:var(--surface);color:var(--ink);font-size:1rem;line-height:1.5}\n'
          '.nc-notice strong{font-weight:800}\n'
          '.nc-results .nc-notice{margin-top:0}\n'
          '.name-mini-note{margin:10px 0 0;font-size:.92rem;color:var(--ink)}\n'
          '.name-mini-note strong{font-weight:800}\n')
    open(p, 'w', encoding='utf-8').write(s); changed.append(p)

# 7. Terms section
p = 'terms.html'; s = open(p, encoding='utf-8').read()
if 'id="name-checker-terms"' not in s:
    sec = ('<section id="name-checker-terms"><h2>Name Checker</h2>'
           '<p><strong>The Name Checker is for entertainment only.</strong> Its scores come from traditional numerology rules applied to the letters you type and the date you enter. '
           'They are symbolic, not facts, and they do not predict anything about a person, a child, a marriage or a business.</p>'
           '<p>A score is not a statement about any real person or organisation, and a lower score does not mean a name is bad, unlucky or unsuitable. '
           'Boy and girl labels come from public birth-record counts and describe how a name has mostly been used, not who may use it.</p>'
           '<p>You decide how to use the results. Do not rely on them for legal, medical, financial, business or family decisions. '
           'If you share a result, you are responsible for what you share and who you share it with. Please do not use the tool to mock or upset anyone.</p>'
           '<p>The Name Checker, its downloads and its sharing features are free to use.</p></section>')
    s = s.replace('<section><h2>How can I ask a question about this policy?</h2>', sec + '<section><h2>How can I ask a question about this policy?</h2>', 1)
    open(p, 'w', encoding='utf-8').write(s); changed.append(p)

print(len(changed), 'files changed'); print([c for c in changed if not c.endswith('.html') or c in ('terms.html', 'name-checker.html')])
