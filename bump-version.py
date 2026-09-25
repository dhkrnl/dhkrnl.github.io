#!/usr/bin/env python3
"""Cache-bust main.js, home.js and style.css across all HTML pages, and stamp
the footer "Last updated" date with today's date.

Run this before every deploy (it keeps the footer date current), and always after
changing main.js, home.js or style.css. It stamps every <link>/<script> reference with a fresh ?v=<timestamp>,
so browsers fetch the new file immediately instead of waiting out
GitHub Pages' 10-minute asset cache.

Usage:  python3 bump-version.py
"""
import re, glob, datetime, sys

now = datetime.datetime.now()
ver = now.strftime('%Y%m%d%H%M')
pat_time = re.compile(r'<time datetime="[^"]*">[^<]*</time>')
time_tag = f'<time datetime="{now:%Y-%m-%d}">{now.day} {now:%b} {now.year}</time>'
pat_css = re.compile(r'(href="/style\.css)(\?v=\d+)?(")')
pat_js  = re.compile(r'(src="/(?:main|home)\.js)(\?v=\d+)?(")')

changed = 0
for f in glob.glob('**/*.html', recursive=True):
    with open(f, encoding='utf-8') as fh:
        s = fh.read()
    new = pat_css.sub(r'\1?v=' + ver + r'\3', s)
    new = pat_js.sub(r'\1?v=' + ver + r'\3', new)
    new = pat_time.sub(time_tag, new)
    if new != s:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(new)
        changed += 1

print(f'Bumped assets to ?v={ver} across {changed} HTML file(s).')
if changed == 0:
    print('No references found — check that pages link /style.css and /main.js.', file=sys.stderr)
