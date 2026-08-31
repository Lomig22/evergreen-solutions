#!/usr/bin/env python3
"""Assemble les tranches de shots.js et produit des JPG de revue découpés.
   python3 tools/stitch.py <outPrefix> [--maxw 760] [--slice 2500]"""
import sys, json, glob, os
from PIL import Image
pre = sys.argv[1]
maxw = int(sys.argv[sys.argv.index('--maxw')+1]) if '--maxw' in sys.argv else 760
sl = int(sys.argv[sys.argv.index('--slice')+1]) if '--slice' in sys.argv else 2500
meta = json.load(open(f'{pre}-meta.json'))
full = Image.new('RGB', (meta['width'], meta['H']), (246, 248, 243))
for i, y in enumerate(meta['offsets']):
    part = Image.open(f'{pre}-s{i}.png').convert('RGB')
    full.paste(part, (0, y))
for f in glob.glob(f'{pre}-s*.png'): os.remove(f)
full.save(f'{pre}-full.png')
scale = maxw / full.width
full.thumbnail((maxw, 10**6), Image.LANCZOS)
n = 0; y = 0
while y < full.height:
    full.crop((0, y, full.width, min(full.height, y + sl))).save(f'{pre}-v{n}.jpg', quality=78)
    y += sl; n += 1
print(f'{pre}: {meta["H"]}px, {n} vues')
