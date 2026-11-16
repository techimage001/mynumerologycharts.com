<?php
/* ============================================================
   SITE PROFILE: MyNumerologyCharts
   ------------------------------------------------------------
   The only file that tells the Bulk Content Optimiser anything
   about this website. The engine (in /bco, outside public_html)
   is identical on every site.

   No passwords or API keys here. Those live in the engine's
   database in /bco-data, outside public_html.

   Links in the header and footer are ABSOLUTE (/app.html, not
   app.html) because articles live at /blog/<slug>/.
   ============================================================ */

$v = 36;   /* match ?v= on assets/site.css sitewide */

return [

    /* ---------- Identity ---------- */
    'site_name'  => 'MyNumerologyCharts',
    'site_url'   => 'https://mynumerologycharts.com',
    'brand_html' => 'MyNumerology<em style="color:#c79245;font-style:normal">Charts</em>',
    'author'     => 'MyNumerologyCharts',
    'schema_logo'=> 'https://mynumerologycharts.com/favicon-512.png',

    /* ---------- Where generated content is written ---------- */
    'blog_path'    => '/blog',
    'page_path'    => '/p',
    'uploads_path' => '/uploads/blog',

    /* ---------- Blog landing copy ---------- */
    'blog_h1'        => 'The MyNumerologyCharts Blog',
    'blog_intro'     => 'Clear, honest writing about numerology: names, numbers, cycles and compatibility, with the working shown and no fortune-telling.',
    'blog_seo_title' => 'Numerology Blog: Names, Numbers and Cycles Explained',
    'blog_seo_desc'  => 'Plain-English numerology articles on name numbers, baby and business names, Life Path, personal years and compatibility, with every calculation shown.',
    'related_heading'=> 'Keep reading',

    /* ---------- Look ---------- */
    'theme_color'    => '#5b2d6f',
    'og_default'     => 'https://mynumerologycharts.com/assets/social-card.svg',
    'body_class'     => 'bco-blog',
    'brand_rgb'       => [0x5B, 0x2D, 0x6F],
    'brand_rgb_dark'  => [0x3C, 0x17, 0x49],
    'brand_rgb_gold'  => [0xC7, 0x92, 0x45],
    'brand_rgb_paper' => [0xF8, 0xF5, 0xF0],

    'head_extra' => <<<HTML
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48.png" sizes="48x48">
<link rel="icon" href="/favicon-96.png" sizes="96x96">
<link rel="icon" href="/favicon-192.png" sizes="192x192">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script>try{const t=localStorage.getItem('mnc-theme');if(t)document.documentElement.dataset.theme=t}catch{}</script>
<link rel="stylesheet" href="/assets/site.css?v={$v}">
<link rel="stylesheet" href="/assets/blog.css?v={$v}">
HTML,

    'header_html' => <<<'HTML'
<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="brand" href="/"><svg class="brand-mark" viewBox="0 0 128 128" role="img" aria-label="MyNumerologyCharts logo"><defs><linearGradient id="mncgA" x1="18" y1="12" x2="112" y2="118" gradientUnits="userSpaceOnUse"><stop stop-color="#7a2f8f"/><stop offset="1" stop-color="#3c1749"/></linearGradient></defs><circle cx="64" cy="64" r="60" fill="url(#mncgA)"/><circle cx="64" cy="64" r="44" fill="none" stroke="#f3d77c" stroke-width="4" opacity=".95"/><path d="M64 24 72.8 51.2 101 52 78.6 69.2 86.6 96 64 80 41.4 96 49.4 69.2 27 52l28.2-.8Z" fill="#fff7d6"/><circle cx="64" cy="64" r="9" fill="#f0c85b"/><circle cx="99" cy="40" r="5" fill="#fff"/></svg>MyNumerologyCharts</a><button class="menu-btn" data-menu aria-expanded="false" aria-label="Open menu">&#9776;</button><nav class="nav" aria-label="Main navigation"><a href="/app.html">Create Chart</a><a class="nav-new" href="/name-checker.html">Name Checker</a><a href="/calculators.html">Calculators</a><a href="/learn.html">Learn</a><a href="/blog/">Blog</a><a href="/astrology.html">Astrology</a><a href="/palm-reading.html">Palmistry</a><a class="btn btn-primary" href="/app.html">Free Chart</a></nav><button class="icon-btn" data-theme-toggle aria-label="Toggle light and dark theme" aria-pressed="false">&#9680;</button></div></header>
HTML,

    'footer_html' => <<<'HTML'
<footer class="site-footer"><div class="container"><div class="footer-brand"><div><a class="footer-logo" href="/index.html"><svg class="brand-mark" viewBox="0 0 128 128" role="img" aria-label="MyNumerologyCharts logo"><defs><linearGradient id="mncgB" x1="18" y1="12" x2="112" y2="118" gradientUnits="userSpaceOnUse"><stop stop-color="#7a2f8f"/><stop offset="1" stop-color="#3c1749"/></linearGradient></defs><circle cx="64" cy="64" r="60" fill="url(#mncgB)"/><circle cx="64" cy="64" r="44" fill="none" stroke="#f3d77c" stroke-width="4" opacity=".95"/><path d="M64 24 72.8 51.2 101 52 78.6 69.2 86.6 96 64 80 41.4 96 49.4 69.2 27 52l28.2-.8Z" fill="#fff7d6"/><circle cx="64" cy="64" r="9" fill="#f0c85b"/><circle cx="99" cy="40" r="5" fill="#fff"/></svg>MyNumerologyCharts</a><p>Clear calculations, integrated Sun-sign insights and practical reflection in one personal dashboard.</p></div><div><a class="btn btn-primary" href="/app.html">Create Your Personal Chart</a></div></div><div class="footer-directory"><details open><summary>Create Your Chart</summary><div><a href="/app.html">Complete Personal Dashboard</a><a href="/name-checker.html">Name Checker</a><a href="/app.html#compatibility">Compare Two Birthdays</a><a href="/calculators.html">All Calculators</a><a href="/core-numbers.html">Core Numbers</a><a href="/timing-cycles.html">Current Cycles</a><a href="/pinnacles-challenges.html">Pinnacles & Challenges</a></div></details><details open><summary>Numerology Calculators</summary><div><a href="/life-path-calculator.html">Life Path</a><a href="/birthday-number-calculator.html">Birthday Number</a><a href="/attitude-number-calculator.html">Attitude Number</a><a href="/expression-number-calculator.html">Expression Number</a><a href="/soul-urge-calculator.html">Soul Urge</a><a href="/personality-number-calculator.html">Personality Number</a><a href="/personal-year-calculator.html">Personal Year</a><a href="/pinnacles-calculator.html">Pinnacles</a><a href="/challenge-numbers-calculator.html">Challenges</a></div></details><details open><summary>Number Meanings</summary><div><a href="/number-meanings.html">Number Meanings Hub</a><a href="/number-1.html">Numbers 1–9</a><a href="/number-11.html">Master Number 11</a><a href="/number-22.html">Master Number 22</a><a href="/number-33.html">Master Number 33</a><a href="/master-numbers.html">Master Numbers Guide</a><a href="/a-z.html">A–Z Directory</a></div></details><details open><summary>Explore by Number</summary><div><a href="/life-path-numbers.html">Life Path Meanings</a><a href="/angel-numbers.html">Angel Numbers</a><a href="/numerology-compatibility.html">Compatibility Pairs</a><a href="/personal-years.html">Personal Years</a><a href="/birthday-numbers.html">Birthday Numbers</a><a href="/name-numerology.html">Name Numerology</a><a href="/lucky-numbers-numerology.html">Lucky Numbers</a><a href="/life-path-personal-year.html">Life Path in Each Year</a></div></details><details open><summary>Karmic Debt &amp; Names</summary><div><a href="/karmic-debt-numbers.html">Karmic Debt Numbers</a><a href="/karmic-debt-13.html">Karmic Debt 13</a><a href="/karmic-debt-14.html">Karmic Debt 14</a><a href="/karmic-debt-16.html">Karmic Debt 16</a><a href="/karmic-debt-19.html">Karmic Debt 19</a><a href="/baby-name-numerology.html">Baby Name Numerology</a><a href="/business-name-numerology.html">Business Name Numerology</a><a href="/name-numerology.html">Name Numerology Hub</a><a href="/karmic-lessons-calculator.html">Karmic Lessons</a></div></details><details open><summary>Palmistry</summary><div><a href="/palm-reading.html">Palm Reading Guide</a><a href="/palm-reading-guide.html">Guided Palm Reading</a><a href="/palm-lines.html">All Palm Lines</a><a href="/heart-line.html">Heart Line</a><a href="/head-line.html">Head Line</a><a href="/life-line.html">Life Line</a><a href="/fate-line.html">Fate Line</a><a href="/sun-line.html">Sun Line</a><a href="/marriage-line.html">Marriage Line</a><a href="/children-lines.html">Children Lines</a><a href="/intuition-line.html">Intuition Line</a><a href="/palm-mounts.html">All Palm Mounts</a><a href="/mount-of-venus.html">Mount of Venus</a><a href="/mount-of-jupiter.html">Mount of Jupiter</a><a href="/mount-of-saturn.html">Mount of Saturn</a><a href="/mount-of-apollo.html">Mount of Apollo</a><a href="/mount-of-mercury.html">Mount of Mercury</a><a href="/mount-of-mars.html">Mounts of Mars</a><a href="/mount-of-moon.html">Mount of Moon</a><a href="/hand-shapes.html">Hand Shapes</a><a href="/earth-hand.html">Earth Hand</a><a href="/air-hand.html">Air Hand</a><a href="/fire-hand.html">Fire Hand</a><a href="/water-hand.html">Water Hand</a></div></details><details open><summary>Astrology</summary><div><a href="/astrology.html">Astrology Centre</a><a href="/zodiac-compatibility.html">Zodiac Compatibility</a><a href="/daily-horoscope.html">Daily Horoscope</a><a href="/zodiac-horoscopes.html">Horoscopes by Sign</a><a href="/sun-sign-calculator.html">Sun Sign Calculator</a><a href="/sun-sign-compatibility.html">Sun Sign Compatibility</a><a href="/life-path-sun-sign.html">Life Path + Sun Sign</a><a href="/zodiac-aries.html">Aries</a><a href="/zodiac-taurus.html">Taurus</a><a href="/zodiac-gemini.html">Gemini</a><a href="/zodiac-cancer.html">Cancer</a><a href="/zodiac-leo.html">Leo</a><a href="/zodiac-virgo.html">Virgo</a><a href="/zodiac-libra.html">Libra</a><a href="/zodiac-scorpio.html">Scorpio</a><a href="/zodiac-sagittarius.html">Sagittarius</a><a href="/zodiac-capricorn.html">Capricorn</a><a href="/zodiac-aquarius.html">Aquarius</a><a href="/zodiac-pisces.html">Pisces</a></div></details><details open><summary>Learn Numerology</summary><div><a href="/learn.html">Learning Centre</a><a href="/what-is-numerology.html">Numerology for Beginners</a><a href="/how-to-calculate-life-path.html">How Calculations Work</a><a href="/methodology.html">Methodology</a><a href="/pythagorean-numerology.html">Pythagorean System</a><a href="/birth-name-vs-current-name.html">Name Numerology</a><a href="/personal-year-guide.html">Life Cycles</a><a href="/numerology-compatibility-guide.html">Compatibility Guide</a><a href="/faq.html">FAQ</a></div></details><details open><summary>Combined Insights</summary><div><a href="/life-path-sun-sign.html">Life Path + Sun Sign</a><a href="/app.html#compatibility">Compare Two Birthdays</a><a href="/numerology-and-astrology.html">Numerology + Astrology</a><a href="/personality-number-guide.html">Personality Insight</a><a href="/pinnacles-challenges.html">Strengths & Challenges</a><a href="/app.html#visualProfile">Visual Dashboard</a><a href="/app.html">Audio Chart Report</a></div></details></div><nav class="footer-legal" aria-label="Legal"><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/editorial-policy.html">Editorial Policy</a><a href="/privacy.html">Privacy Policy</a><a href="/cookie-policy.html">Cookie Policy</a><a href="/terms.html">Terms</a><a href="/accessibility.html">Accessibility</a><a href="/data-deletion.html">Delete My Account</a><a href="/sitemap.xml">XML Sitemap</a></nav><div class="footer-bottom"><span>© MyNumerologyCharts</span><span>For entertainment purposes only. Not professional advice. You are responsible for your decisions and actions.</span></div></div></footer>
<aside class="cookie-banner" hidden aria-label="Cookie choices"><strong>Cookie choices</strong><p>Necessary storage keeps the app working. Optional analytics is off unless you agree. We use no advertising cookies.</p><div class="actions"><button class="btn btn-primary" data-consent="accept">Accept optional analytics</button><button class="btn btn-secondary" data-consent="reject">Reject optional cookies</button><button class="btn btn-secondary" data-consent="manage">Manage choices</button></div></aside><div class="cookie-modal" hidden role="dialog" aria-modal="true" aria-labelledby="cookieTitle"><div class="cookie-panel"><h2 id="cookieTitle">Manage cookie choices</h2><label><input type="checkbox" checked disabled> Necessary storage</label><label><input id="analyticsConsent" type="checkbox"> Optional analytics</label><p>No advertising or advertising cookies are used.</p><div class="actions"><button class="btn btn-primary" data-consent="save">Save choices</button><button class="btn btn-secondary" data-consent="close">Close</button></div></div></div>
HTML
        . '<script src="/assets/name-mini.js?v=1" defer></script><script src="/assets/site.js?v=' . $v . '" defer></script>',

    /* ---------- Block at the foot of every article ----------
       The mini Name Checker: readers type a name and see its number
       straight away, then go on to the full checker. */
    'cta_html' => '<aside class="post-cta"><h2>Choosing a name?</h2>'
        . '<p>Rank a baby name shortlist, a business name or a married name against a birth date. The ranking is free and every number is shown.</p>'
        . '<div data-name-mini data-mode="own" data-src="blog" data-title="Type a name to see what it adds up to"></div>'
        . '<p class="post-cta-alt">Or <a href="/app.html">create your complete numerology chart</a>, free.</p></aside>',

    /* ---------- Starter categories, seeded once ---------- */
    'categories' => [
        ['Name Numerology',        'name-numerology',        'How names turn into numbers: baby names, spellings, nicknames and what the letters add up to.'],
        ['Baby Names',             'baby-names',             'Name meanings and numbers for parents comparing a shortlist, with the working shown.'],
        ['Business Names',         'business-names',         'Trading names, brand names and what their numbers add up to, without the hype.'],
        ['Marriage & Name Changes','marriage-and-name-changes','Taking a new surname, double-barrelling or going back to a birth name, and what changes in the numbers.'],
        ['Life Path & Core Numbers','life-path-and-core-numbers','Life Path, Expression, Soul Urge and the other core numbers explained clearly.'],
        ['Cycles & Timing',        'cycles-and-timing',      'Personal years, months, pinnacles and the nine-year cycle.'],
        ['Compatibility',          'compatibility',          'How two charts compare, number by number, and what traditions say about each pairing.'],
    ],

    /* ---------- Defaults the Settings screen starts from ---------- */
    'country'          => 'UK',
    'word_min'         => 1400,
    'word_max'         => 2600,
    'default_status'   => 'draft',

    /* Off: numerology is for entertainment, and stuffing an article with
       government citations would misrepresent it. */
    'authority_mode'   => '0',

    'homepage_anchor'  => 'free numerology chart and name checker',
    'default_audience' => 'Curious adults in the UK and US: parents choosing baby names, people changing their name, small business owners, numerology beginners reading on a phone',

    'house_rules' => "Numerology is presented as a symbolic tradition for entertainment. Never claim it predicts events, health, wealth, a child's future or a relationship's success, and never use fear (\"unlucky\", \"dangerous number\", \"bad name\").\n"
        . "Use the Pythagorean letter chart (A J S = 1 ... I R = 9) unless the article is explicitly about Chaldean. Keep master numbers 11, 22 and 33 unreduced. Show the working for any example calculation, step by step, and double-check every sum.\n"
        . "Never tell a reader they must change their name or that a spelling will bring luck. A name someone loves and can live with matters more than any number: say so where it fits.\n"
        . "No medical, legal or financial advice. No invented statistics, studies, experts or quotes.\n"
        . "Where a reader would naturally want to compare names, mention the free Name Checker at /name-checker.html once, in passing, never as a hard sell.\n"
        . "Avoid the phrases 'educational', 'self-reflection', 'personal insight' and 'lucky numbers'. British English.",

    /* ---------- Internal linking ---------- */
    'internal_links' => 'scan',   /* reads the real .html files, so no URL is ever invented */
    'always_link'    => [
        ['url' => '/name-checker.html', 'title' => 'Name Checker: compare names against a birth date'],
        ['url' => '/app.html',          'title' => 'Free complete numerology chart'],
    ],
];
