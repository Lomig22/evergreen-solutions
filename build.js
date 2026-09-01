#!/usr/bin/env node
'use strict';
/**
 * build.js — générateur statique du site Green Solutions.
 * Zéro dépendance. Node ≥ 18.
 *
 *   node build.js                 → génère dist/ pour toutes les langues disponibles dans src/i18n/
 *   node build.js --langs=fr,en   → limite aux langues indiquées
 *   node build.js --serve[=8080]  → sert dist/ en local
 *   node build.js --watch         → reconstruit à chaque modification de src/
 *   SITE_URL=https://… node build.js → URL absolue pour canonical / hreflang / sitemap
 *
 * Voir README.md pour la syntaxe des templates et l'ajout d'une langue ou d'une page.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] === undefined ? true : m[2]] : [a, true];
}));

// ---------------------------------------------------------------- utilitaires
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const read = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => fs.existsSync(p);
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const hash = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function write(p, s) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); }
function copyDir(from, to, skip = () => false) {
  if (!exists(from)) return;
  for (const ent of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, ent.name), b = path.join(to, ent.name);
    if (skip(a, ent)) continue;
    if (ent.isDirectory()) copyDir(a, b, skip);
    else { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); }
  }
}
const log = (...m) => console.log('[build]', ...m);
const warn = (...m) => console.warn('[build] ⚠', ...m);

// ---------------------------------------------------------------- i18n (fallback FR + avertissements)
function collectLeaves(v, trail, acc) {
  if (isObj(v)) for (const k of Object.keys(v)) collectLeaves(v[k], `${trail}.${k}`, acc);
  else acc.push(trail);
}
/** Fusionne `over` (langue cible) sur `base` (FR). Toute feuille absente est reprise du FR et signalée. */
function mergeWithFallback(base, over, trail, missing) {
  if (Array.isArray(base)) {
    if (Array.isArray(over)) return over;
    missing.push(trail); return base;
  }
  if (!isObj(base)) return over === undefined ? (missing.push(trail), base) : over;
  const out = {};
  for (const k of Object.keys(base)) {
    const t = trail ? `${trail}.${k}` : k;
    const o = over ? over[k] : undefined;
    if (o === undefined) { out[k] = base[k]; collectLeaves(base[k], t, missing); }
    else if (isObj(base[k])) out[k] = mergeWithFallback(base[k], isObj(o) ? o : {}, t, missing);
    else out[k] = o;
  }
  if (over) for (const k of Object.keys(over)) if (!(k in out)) out[k] = over[k];
  return out;
}

// ---------------------------------------------------------------- mini moteur de templates
//  {{clé.chemin}}  {{{html brut}}}  {{#each liste}}…{{else}}…{{/each}}  {{#if cond}}…{{else}}…{{/if}}
//  {{#unless cond}}…{{/unless}}  {{> partial}}  {{! commentaire }}
//  helpers : {{url '/chemin/'}} {{asset '/assets/…'}} {{eq a b}} {{ne a b}} {{not a}} {{and a b}} {{or a b}}
//            {{lookup objet clé}} {{concat a b …}} {{json valeur}} {{nl2br texte}}
//  variables de boucle : {{this}} {{@index}} {{@index1}} {{@first}} {{@last}} {{@key}}
const TAG_SPLIT = /(\{\{\{[\s\S]*?\}\}\}|\{\{[\s\S]*?\}\})/;

function parse(src, name) {
  const root = { type: 'root', children: [] };
  const stack = [root];
  const cur = () => stack[stack.length - 1];
  const push = (n) => { const c = cur(); (c.inElse ? c.elseChildren : c.children).push(n); };
  for (const part of src.split(TAG_SPLIT)) {
    if (!part) continue;
    if (!part.startsWith('{{')) { push({ type: 'text', value: part }); continue; }
    if (part.startsWith('{{{')) { push({ type: 'raw', expr: part.slice(3, -3).trim() }); continue; }
    const inner = part.slice(2, -2).trim();
    if (inner.startsWith('!')) continue;
    let m;
    if ((m = inner.match(/^#(each|if|unless)\s+([\s\S]+)$/))) {
      const n = { type: m[1] === 'each' ? 'each' : 'if', negate: m[1] === 'unless', expr: m[2].trim(), children: [], elseChildren: [], inElse: false };
      push(n); stack.push(n); continue;
    }
    if (inner === 'else') { cur().inElse = true; continue; }
    if (/^\/(each|if|unless)$/.test(inner)) {
      if (stack.length < 2) throw new Error(`${name}: {{${inner}}} sans bloc ouvert`);
      stack.pop(); continue;
    }
    if (inner.startsWith('>')) { push({ type: 'partial', name: inner.slice(1).trim() }); continue; }
    push({ type: 'var', expr: inner });
  }
  if (stack.length !== 1) throw new Error(`${name}: bloc {{#${cur().type}}} non fermé`);
  return root;
}

function tokenize(expr) {
  const out = [];
  const re = /'([^']*)'|"([^"]*)"|(\S+)/g;
  let m;
  while ((m = re.exec(expr))) {
    if (m[1] !== undefined) out.push({ lit: m[1] });
    else if (m[2] !== undefined) out.push({ lit: m[2] });
    else if (/^-?\d+(\.\d+)?$/.test(m[3])) out.push({ lit: Number(m[3]) });
    else if (m[3] === 'true' || m[3] === 'false') out.push({ lit: m[3] === 'true' });
    else out.push({ ref: m[3] });
  }
  return out;
}
function getPath(obj, segs) {
  let v = obj;
  for (const s of segs) { if (v === null || v === undefined) return undefined; v = v[s]; }
  return v;
}
function lookup(ref, scopes) {
  if (ref.startsWith('@')) {
    for (let i = scopes.length - 1; i >= 0; i--) {
      const s = scopes[i];
      if (s.index === undefined) continue;
      switch (ref) {
        case '@index': return s.index;
        case '@index1': return s.index + 1;
        case '@first': return s.index === 0;
        case '@last': return s.index === s.length - 1;
        case '@key': return s.key;
        default: return undefined;
      }
    }
    return undefined;
  }
  if (ref === 'this' || ref === '.') return scopes[scopes.length - 1].value;
  const segs = ref.split('.');
  for (let i = scopes.length - 1; i >= 0; i--) {
    const v = getPath(scopes[i].value, segs);
    if (v !== undefined) return v;
  }
  return undefined;
}
function evaluate(expr, scopes, env, optional) {
  let e = expr.trim();
  if (e.startsWith('(') && e.endsWith(')')) e = e.slice(1, -1).trim();
  const toks = tokenize(e);
  if (!toks.length) return undefined;
  const resolve = (t) => ('lit' in t ? t.lit : lookup(t.ref, scopes));
  if (toks.length === 1) {
    const v = resolve(toks[0]);
    if (v === undefined && !optional && 'ref' in toks[0]) env.missing.add(toks[0].ref);
    return v;
  }
  const helper = toks[0].ref;
  const a = toks.slice(1).map(resolve);
  switch (helper) {
    case 'url': return env.url(String(a[0] ?? ''), a[1]);
    case 'asset': return String(a[0] ?? '');
    case 'eq': return String(a[0]) === String(a[1]);
    case 'ne': return String(a[0]) !== String(a[1]);
    case 'not': return !a[0];
    case 'and': return a.every(Boolean);
    case 'or': return a.some(Boolean);
    case 'gt': return Number(a[0]) > Number(a[1]);
    case 'lt': return Number(a[0]) < Number(a[1]);
    case 'lookup': return a[0] == null ? undefined : a[0][a[1]];
    case 'concat': return a.map((x) => (x == null ? '' : x)).join('');
    case 'json': return JSON.stringify(a[0]);
    case 'nl2br': return escapeHtml(a[0] ?? '').replace(/\n/g, '<br>');
    default: throw new Error(`helper inconnu : ${helper} (dans « ${expr} »)`);
  }
}
function renderNodes(nodes, scopes, env) {
  let out = '';
  for (const n of nodes) {
    switch (n.type) {
      case 'text': out += n.value; break;
      case 'var': { const v = evaluate(n.expr, scopes, env); if (v !== undefined && v !== null) out += escapeHtml(v); break; }
      case 'raw': { const v = evaluate(n.expr, scopes, env); if (v !== undefined && v !== null) out += String(v); break; }
      case 'partial': out += renderNodes(env.partial(n.name).children, scopes, env); break;
      case 'if': {
        const v = evaluate(n.expr, scopes, env, true);
        const truthy = Array.isArray(v) ? v.length > 0 : !!v;
        out += renderNodes(truthy !== n.negate ? n.children : n.elseChildren, scopes, env);
        break;
      }
      case 'each': {
        const v = evaluate(n.expr, scopes, env, true);
        let arr = [];
        if (Array.isArray(v)) arr = v.map((value) => ({ value }));
        else if (isObj(v)) arr = Object.entries(v).map(([key, value]) => ({ value, key }));
        if (!arr.length) { out += renderNodes(n.elseChildren, scopes, env); break; }
        arr.forEach((item, index) => {
          out += renderNodes(n.children, scopes.concat([{ value: item.value, index, length: arr.length, key: item.key }]), env);
        });
        break;
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- construction
function build() {
  const t0 = Date.now();
  const site = readJSON(path.join(SRC, 'site.json'));
  const SITE_URL = (process.env.SITE_URL
    || (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
    || site.url).replace(/\/$/, '');

  // langues disponibles = celles dont le JSON existe
  const wanted = args.langs ? String(args.langs).split(',') : site.langs.map((l) => l.code);
  // une langue n'est construite que si son JSON existe ET est valide : un fichier cassé ne doit jamais faire échouer le déploiement
  const i18n = {};
  const langs = site.langs.filter((l) => {
    if (!wanted.includes(l.code)) return false;
    const file = path.join(SRC, 'i18n', `${l.code}.json`);
    if (!exists(file)) { warn(`langue ${l.code} ignorée : src/i18n/${l.code}.json introuvable`); return false; }
    try { i18n[l.code] = readJSON(file); return true; }
    catch (e) {
      if (l.code === site.defaultLang) throw new Error(`src/i18n/${l.code}.json (langue source) est invalide : ${e.message}`);
      warn(`langue ${l.code} ignorée : src/i18n/${l.code}.json invalide (${e.message})`); return false;
    }
  });
  const base = i18n[site.defaultLang] || readJSON(path.join(SRC, 'i18n', `${site.defaultLang}.json`));
  // données partagées entre langues (src/data/*.json → ctx.data.<nom>)
  const data = {};
  const dataDir = path.join(SRC, 'data');
  if (exists(dataDir)) for (const f of fs.readdirSync(dataDir)) if (f.endsWith('.json')) data[path.basename(f, '.json')] = readJSON(path.join(dataDir, f));

  // assets : CSS et JS concaténés + hachés
  fs.rmSync(DIST, { recursive: true, force: true });
  const css = site.css.map((f) => `/* ---- ${f} ---- */\n${read(path.join(SRC, 'assets/css', f))}`).join('\n');
  const js = site.js.map((f) => `/* ---- ${f} ---- */\n${read(path.join(SRC, 'assets/js', f))}`).join('\n');
  const cssName = `/assets/css/site.${hash(css)}.css`;
  const jsName = `/assets/js/site.${hash(js)}.js`;
  write(path.join(DIST, cssName), css);
  write(path.join(DIST, jsName), js);
  copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'), (p, ent) =>
    ent.name.startsWith('_') || ent.name === 'css' || ent.name === 'js' || ent.name === '.DS_Store' || ent.name === 'LICENSES');
  copyDir(path.join(SRC, 'static'), DIST, (p, ent) => ent.name === '.DS_Store');

  // partials + templates (analysés une fois)
  const partialCache = new Map();
  const partial = (name) => {
    if (!partialCache.has(name)) {
      const p = path.join(SRC, 'partials', `${name}.html`);
      if (!exists(p)) throw new Error(`partial introuvable : ${name}`);
      partialCache.set(name, parse(read(p), `partials/${name}.html`));
    }
    return partialCache.get(name);
  };
  const templateCache = new Map();
  const template = (file) => {
    if (!templateCache.has(file)) templateCache.set(file, parse(read(path.join(SRC, 'templates', file)), `templates/${file}`));
    return templateCache.get(file);
  };
  const layout = parse(read(path.join(SRC, 'templates', '_layout.html')), 'templates/_layout.html');

  const prefixOf = (code) => (code === site.defaultLang ? '' : `/${code}`);
  const urls = [];
  let pageCount = 0;

  for (const lang of langs) {
    const missing = [];
    const strings = lang.code === site.defaultLang ? base : mergeWithFallback(base, i18n[lang.code], '', missing);
    if (missing.length) warn(`${lang.code} : ${missing.length} clé(s) manquante(s), repli FR → ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}`);
    const prefix = prefixOf(lang.code);
    const env = {
      missing: new Set(),
      partial,
      url: (p, code) => `${prefixOf(code || lang.code)}${p}`,
    };

    for (const page of site.pages) {
      if (page.defaultOnly && lang.code !== site.defaultLang) continue;
      const pageStrings = (strings.pages && strings.pages[page.id]) || {};
      const alternates = site.langs
        .filter((l) => langs.find((x) => x.code === l.code) && !page.defaultOnly)
        .map((l) => ({ ...l, href: `${SITE_URL}${prefixOf(l.code)}${page.path}`, path: `${prefixOf(l.code)}${page.path}`, current: l.code === lang.code }));
      const pageUrl = `${SITE_URL}${prefix}${page.path}`;
      const product = page.product && strings.products ? strings.products[page.product] : undefined;
      const ctx = {
        ...strings,
        site: { ...site, url: SITE_URL, name: (strings.site && strings.site.name) || site.name },
        lang: lang.code,
        locale: lang.locale,
        dir: lang.dir,
        isRtl: lang.dir === 'rtl',
        isDefaultLang: lang.code === site.defaultLang,
        langPrefix: prefix,
        page: { ...page, url: pageUrl, is: { [page.id]: true }, key: page.product, ...pageStrings },
        product,
        data,
        alternates,
        xDefault: `${SITE_URL}${page.path}`,
        assets: { css: cssName, js: jsName },
        year: new Date().getFullYear(),
        jsonld: buildJsonLd({ site, SITE_URL, strings, lang, page, pageUrl, product }),
      };
      const scopes = [{ value: ctx }];
      const content = renderNodes(template(page.template).children, scopes, env);
      const html = renderNodes(layout.children, [{ value: { ...ctx, content } }], env);
      const outFile = page.output ? path.join(DIST, prefix.replace(/^\//, ''), page.output) : path.join(DIST, prefix.replace(/^\//, ''), page.path.replace(/^\//, ''), 'index.html');
      write(outFile, html);
      pageCount++;
      if (!page.noindex && !page.defaultOnly) urls.push({ loc: pageUrl, alternates, xDefault: `${SITE_URL}${page.path}` });
    }
    if (env.missing.size) warn(`${lang.code} : variables non résolues dans les templates → ${[...env.missing].slice(0, 12).join(', ')}${env.missing.size > 12 ? '…' : ''}`);
  }

  // sitemap + robots
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map((u) =>
    `  <url>\n    <loc>${u.loc}</loc>\n${u.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.code}" href="${a.href}"/>`).join('\n')}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${u.xDefault}"/>\n  </url>`).join('\n')}\n</urlset>\n`;
  write(path.join(DIST, 'sitemap.xml'), sitemap);
  write(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /mentions-legales/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  log(`${pageCount} pages · ${langs.map((l) => l.code).join(', ')} · ${SITE_URL} · ${Date.now() - t0} ms`);
}

function buildJsonLd({ site, SITE_URL, strings, lang, page, pageUrl, product }) {
  const org = strings.org || {};
  const blocks = [];
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: SITE_URL + (lang.code === site.defaultLang ? '/' : `/${lang.code}/`),
    logo: `${SITE_URL}/assets/img/brand/logo.png`,
    description: org.description,
    slogan: org.slogan,
    telephone: org.phone,
    email: org.email,
    address: org.address ? { '@type': 'PostalAddress', ...org.address } : undefined,
    contactPoint: org.contactName ? { '@type': 'ContactPoint', contactType: 'sales', name: org.contactName, telephone: org.phone, email: org.email, availableLanguage: site.langs.map((l) => l.code) } : undefined,
  });
  if (product && product.jsonld) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.jsonld.name,
      description: product.jsonld.description,
      brand: { '@type': 'Brand', name: site.name },
      manufacturer: { '@type': 'Organization', name: site.name },
      category: product.jsonld.category,
      url: pageUrl,
      image: product.jsonld.image ? `${SITE_URL}${product.jsonld.image}` : undefined,
    });
  }
  const clean = (o) => JSON.parse(JSON.stringify(o));
  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(clean(b))}</script>`).join('\n');
}

// ---------------------------------------------------------------- serveur local + watch
function serve(port) {
  const http = require('http');
  const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let file = path.join(DIST, p);
    if (!exists(file) && exists(file + '/index.html')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
    if (!exists(file) || fs.statSync(file).isDirectory()) { file = path.join(DIST, '404.html'); res.statusCode = 404; }
    if (!exists(file)) { res.statusCode = 404; return res.end('404'); }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  }).listen(port, () => log(`serveur → http://localhost:${port}/`));
}

function watch() {
  let timer;
  fs.watch(SRC, { recursive: true }, (evt, file) => {
    clearTimeout(timer);
    timer = setTimeout(() => { try { build(); } catch (e) { console.error('[build] ✖', e.message); } }, 120);
  });
  log('surveillance de src/ …');
}

try { build(); } catch (e) { console.error('[build] ✖', e.stack || e.message); if (!args.serve && !args.watch) process.exit(1); }
if (args.serve) serve(Number(args.serve) || 8080);
if (args.watch) watch();
