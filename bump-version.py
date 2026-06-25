#!/usr/bin/env python3
"""Cache-bust main.js and style.css across all HTML pages.

Run this before committing a deploy that changes main.js or style.css.
It stamps every <link>/<script> reference with a fresh ?v=<timestamp>,
so browsers fetch the new file immediately instead of waiting out
GitHub Pages' 10-minute asset cache.

Usage:  python3 bump-version.py
"""
import re, glob, datetime, sys

ver = datetime.datetime.now().strftime('%Y%m%d%H%M')
pat_css = re.compile(r'(href="/style\.css)(\?v=\d+)?(")')
pat_js  = re.compile(r'(src="/main\.js)(\?v=\d+)?(")')

changed = 0
for f in glob.glob('**/*.html', recursive=True):
    with open(f, encoding='utf-8') as fh:
        s = fh.read()
    new = pat_css.sub(r'\1?v=' + ver + r'\3', s)
    new = pat_js.sub(r'\1?v=' + ver + r'\3', new)
    if new != s:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(new)
        changed += 1

print(f'Bumped assets to ?v={ver} across {changed} HTML file(s).')
if changed == 0:
    print('No references found — check that pages link /style.css and /main.js.', file=sys.stderr)
