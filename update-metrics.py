#!/usr/bin/env python3
"""Refresh the research metrics shown across the site.

Citations, h-index and i10-index come from the Google Scholar profile the site
links to; the publication count is the number of entries listed on
/publications/. Every page shows these numbers (sidebar, home stats, publications
header, meta descriptions), so run this instead of editing them by hand:

    python3 update-metrics.py            # fetch from Scholar and rewrite the pages
    python3 update-metrics.py --check    # show what would change, write nothing
    python3 update-metrics.py 432 11 13  # set citations, h-index, i10 manually

Scholar occasionally blocks scripted requests; if the fetch fails, pass the
three numbers manually as above.
"""
import glob, re, sys, urllib.request

SCHOLAR = 'https://scholar.google.com/citations?user=kYDGsMAAAAAJ&hl=en'


def fetch_scholar():
    req = urllib.request.Request(SCHOLAR, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req, timeout=20).read().decode('utf-8', 'replace')
    cells = re.findall(r'gsc_rsb_std">(\d+)<', html)
    if len(cells) < 6:
        sys.exit('Could not parse Scholar metrics — pass them manually: update-metrics.py <cites> <h> <i10>')
    return int(cells[0]), int(cells[2]), int(cells[4])  # "All" column


args = [a for a in sys.argv[1:] if not a.startswith('--')]
check = '--check' in sys.argv
if len(args) == 3:
    cites, h, i10 = map(int, args)
else:
    cites, h, i10 = fetch_scholar()

pubs_html = open('publications/index.html', encoding='utf-8').read()
papers = len(re.findall(r'class="pub-item"', pubs_html))
print(f'citations={cites}  h-index={h}  i10={i10}  publications listed={papers}')

# label (as shown on the page) -> value
values = {'citations': cites, 'h-index': h, 'i10': i10, 'i10-index': i10,
          'papers': papers, 'publications': papers}
patterns = [
    r'(<span class="stat-n">)[^<]*(</span><span class="stat-l">{l}</span>)',
    r'(<div class="n">)[^<]*(</div><div class="l">{l}</div>)',
]

changed = 0
for f in glob.glob('**/*.html', recursive=True):
    if f.startswith('google'):
        continue
    s = orig = open(f, encoding='utf-8').read()
    for label, val in values.items():
        for p in patterns:
            s = re.sub(p.format(l=re.escape(label.capitalize() if label in ('citations', 'papers', 'publications') else label)),
                       lambda m: f'{m.group(1)}{val}{m.group(2)}', s)
    # publications page: inline count + meta descriptions
    s = re.sub(r"(pub-count-inline['\"]>)[^<]*", lambda m: f'{m.group(1)}{papers}', s)
    s = re.sub(r'(content=")(?:\d+\+?) (journal articles)', lambda m: f'{m.group(1)}{papers} {m.group(2)}', s)
    if s != orig:
        changed += 1
        print('  updated', f)
        if not check:
            open(f, 'w', encoding='utf-8').write(s)
print(f'{changed} file(s) {"would change" if check else "updated"}.')
