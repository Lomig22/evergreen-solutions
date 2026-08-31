#!/usr/bin/env python3
"""Vérifie liens internes, images, srcset, ancres et fichiers référencés dans dist/."""
import re, os, sys, glob
DIST='dist'
errors=[]
pages=glob.glob(f'{DIST}/**/*.html', recursive=True)
def exists(path):
    p=path.split('#')[0].split('?')[0]
    if not p or p.startswith(('http','mailto:','tel:','data:')): return True
    f=os.path.join(DIST, p.lstrip('/'))
    return os.path.exists(f) or os.path.exists(os.path.join(f,'index.html'))
for page in pages:
    html=open(page, encoding='utf8').read()
    for attr in ('href','src','poster'):
        for m in re.finditer(rf'{attr}="([^"]+)"', html):
            u=m.group(1)
            if not exists(u): errors.append(f'{page}: {attr} → {u}')
    for m in re.finditer(r'srcset="([^"]+)"', html):
        for part in m.group(1).split(','):
            u=part.strip().split(' ')[0]
            if u and not exists(u): errors.append(f'{page}: srcset → {u}')
    for m in re.finditer(r'<use href="#([^"]+)"', html):
        if f'id="{m.group(1)}"' not in html: errors.append(f'{page}: symbole SVG manquant #{m.group(1)}')
print(f'{len(pages)} pages analysées')
if errors:
    print(f'{len(errors)} problème(s) :'); [print(' ', e) for e in errors[:40]]
    sys.exit(1)
print('aucun lien mort, aucune ressource manquante')
