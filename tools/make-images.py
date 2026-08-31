#!/usr/bin/env python3
"""
Génère des variantes responsives (JPEG + WebP) à partir d'une image source.

  python3 tools/make-images.py SRC OUT_PREFIX --widths 2560,1600,960 --aspect 16:9 \
      [--anchor-y 0.28 --horizon 0.245] [--anchor-x 0.5] [--quality 80] [--webp-quality 78] \
      [--warm 0.04] [--saturation 1.08] [--contrast 1.0] [--sharpen 0]

  --aspect     ratio de sortie (w:h) ; le recadrage garde toute la largeur si possible
  --horizon    position (0-1) d'une ligne repère dans la SOURCE (ex. l'horizon)
  --anchor-y   position (0-1) où cette ligne doit tomber dans la SORTIE
  --anchor-x   centre horizontal du recadrage (0-1) quand la hauteur est limitante
  --warm       décalage chaud : +R / -B (0.04 = léger)
"""
import argparse, os, sys
from PIL import Image, ImageEnhance, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--widths', default='1600,960')
ap.add_argument('--aspect', default='16:10')
ap.add_argument('--horizon', type=float, default=None)
ap.add_argument('--anchor-y', type=float, default=0.5)
ap.add_argument('--anchor-x', type=float, default=0.5)
ap.add_argument('--quality', type=int, default=80)
ap.add_argument('--webp-quality', type=int, default=78)
ap.add_argument('--warm', type=float, default=0.0)
ap.add_argument('--saturation', type=float, default=1.0)
ap.add_argument('--contrast', type=float, default=1.0)
ap.add_argument('--brightness', type=float, default=1.0)
ap.add_argument('--sharpen', type=float, default=0.0)
ap.add_argument('--no-jpeg', action='store_true')
a = ap.parse_args()

im = Image.open(a.src).convert('RGB')
W, H = im.size
aw, ah = [float(x) for x in a.aspect.split(':')]
ratio = aw / ah
# boîte de recadrage : pleine largeur si la hauteur suffit, sinon pleine hauteur
if W / H >= ratio:
    ch = H; cw = int(round(H * ratio))
else:
    cw = W; ch = int(round(W / ratio))
# position verticale : aligne l'horizon source sur l'ancre de sortie
if a.horizon is not None:
    top = int(round(a.horizon * H - a.anchor_y * ch))
else:
    top = int(round((H - ch) * a.anchor_y))
top = max(0, min(H - ch, top))
left = int(round((W - cw) * a.anchor_x)); left = max(0, min(W - cw, left))
crop = im.crop((left, top, left + cw, top + ch))
if a.warm:
    r, g, b = crop.split()
    r = r.point(lambda v: min(255, int(v * (1 + a.warm))))
    b = b.point(lambda v: max(0, int(v * (1 - a.warm * 1.5))))
    crop = Image.merge('RGB', (r, g, b))
if a.saturation != 1: crop = ImageEnhance.Color(crop).enhance(a.saturation)
if a.contrast != 1: crop = ImageEnhance.Contrast(crop).enhance(a.contrast)
if a.brightness != 1: crop = ImageEnhance.Brightness(crop).enhance(a.brightness)

os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
for w in [int(x) for x in a.widths.split(',')]:
    h = int(round(w / ratio))
    out = crop.resize((w, h), Image.LANCZOS) if w < cw else crop.resize((w, h), Image.BICUBIC)
    if a.sharpen: out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=int(a.sharpen * 100), threshold=2))
    if not a.no_jpeg:
        out.save(f'{a.out}-{w}.jpg', 'JPEG', quality=a.quality, optimize=True, progressive=True, subsampling=2)
    out.save(f'{a.out}-{w}.webp', 'WEBP', quality=a.webp_quality, method=6)
    sizes = [f'{os.path.getsize(f"{a.out}-{w}.{ext}")//1024} Ko {ext}' for ext in (['webp'] if a.no_jpeg else ['jpg','webp'])]
    print(f'{a.out}-{w}  {w}x{h}  ' + ' / '.join(sizes))
print(f'crop: {cw}x{ch} @ ({left},{top}) from {W}x{H}')
