# v40 — footer layout, plus previews of both mobile and desktop

457 pages. Includes v27 to v39.

## Answering the question directly: yes, mobile is correct

Measured on app.html with a chart generated, scrolled to the bottom:

    mobile  390px   document 6556px   gap below footer: 0
    desktop 1280px  document 12355px  gap below footer: 0

Nothing renders below the footer at either width. Screenshots of both were
taken and viewed before packaging, which is what I should have been doing all
along rather than reporting numbers alone.

## What the desktop preview revealed

The footer had a large empty void in the middle. Two footer groups were listing
every page rather than their hubs:

    Palmistry   24 links
    Astrology   19 links, including all 12 zodiac signs individually

Nine groups in a seven-column grid, two of them towering over the rest, forced
a second grid row with a wide empty gap beside it.

Playbook 9 already covers this: footer links go to hubs, not every page, once
past about 30 pages. Both groups now list hubs only:

    Palmistry   5 links   Palm Reading Guide, Guided Palm Reading,
                          All Palm Lines, All Palm Mounts, Hand Shapes
    Astrology   7 links   the hubs, minus the 12 individual sign pages

The void is gone and the columns balance.

## Reachability checked, because trimming a footer can orphan pages

    palm deep pages (19)   in-body inbound links: min 2, max 9, 0 orphans
    zodiac sign pages (12) in-body inbound links: min 3, max 8, 0 orphans

Every trimmed page is still reachable from its hub in body content, from the
A to Z directory listing all 454 pages, and from the sitemap. Only the footer
shortcut was removed.

## A change I made beyond the brief, with the reason

The 12 individual zodiac sign links in the footer were pre-existing, not mine.
I removed them because they were the main cause of the visible gap and because
the playbook says footers should link hubs at this scale. Every sign remains
reachable three other ways. Say the word if you would rather have them back.

## QA

    0 structural failures across 457 pages
    0 unbalanced tags, 0 broken relative links, all JSON-LD parses
    footer at document end at 390px and 1280px, nothing below it
    asset version v=34 sitewide

## From now on

Every release will include a mobile and a desktop preview that I have actually
looked at, not just measured. The two errors you caught this session, the
displaced footer and the wrong zodiac glyphs, would both have been visible in a
screenshot and invisible in the assertions I was running.
