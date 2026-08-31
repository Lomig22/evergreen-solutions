#!/usr/bin/env python3
"""Post-traitement des fichiers de langue : téléphone insécable, vérifications de cohérence.
   python3 tools/i18n-post.py   (à lancer une fois toutes les langues livrées)"""
import json, glob, sys

PHONE = '+33 (0)6 44 83 55 09'
ok = True
for f in sorted(glob.glob('src/i18n/*.json')):
    d = json.load(open(f))
    lang = f.split('/')[-1].split('.')[0]
    # téléphone affiché : espaces insécables partout
    if 'org' in d and 'phoneDisplay' in d.get('org', {}):
        d['org']['phoneDisplay'] = PHONE
    # vérifications
    problems = []
    def walk(v, path):
        if isinstance(v, dict):
            for k, x in v.items(): walk(x, f'{path}.{k}')
        elif isinstance(v, list):
            for i, x in enumerate(v): walk(x, f'{path}[{i}]')
    slider = d.get('home', {}).get('hero', {}).get('sliderValue', '')
    if '{n}' not in slider: problems.append('home.hero.sliderValue sans {n}')
    for brand in ('EVERGREEN®', 'ECOFERT®', 'NAPEMA®'):
        if brand not in json.dumps(d, ensure_ascii=False): problems.append(f'marque absente : {brand}')
    if d.get('org', {}).get('email') != 'contact@evergreen-ecosorb.com': problems.append('org.email modifié')
    json.dump(d, open(f, 'w'), ensure_ascii=False, indent=2)
    status = 'OK' if not problems else 'PROBLÈMES: ' + '; '.join(problems)
    if problems: ok = False
    print(f'{lang}: {status}')
sys.exit(0 if ok else 1)
