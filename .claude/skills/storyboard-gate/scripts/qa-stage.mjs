#!/usr/bin/env node
// Kiểm lỗi lớp chữ tự động (source/stage.html), thay cho việc chụp từng đoạn rồi nhìn bằng mắt.
// Chạy setT(t) mỗi --step giây trong Chrome không giao diện và đo trên DOM: chữ tràn khung 1080, chữ đè mặt (mặt dò bằng
// vision-web.mjs của engine trên assets/source.mp4, qua cam.crop của spec và MAP của stage-map.js), chữ ngoài vùng an toàn
// TikTok, font thiếu dấu tiếng Việt (glyph rơi về font dự phòng), decor hoặc chữ khác đè lên chữ (theo thứ tự vẽ + alpha
// của ảnh), ảnh bị phóng to quá cỡ gốc (mờ), logo quá nhỏ, file không tải được.
// Chỉ khung có lỗi mới được chụp: stills/qa/qa-<t>.jpg (540x960, footage thật bên dưới, khung đỏ = lỗi, vàng = mặt).
//   node .claude/skills/storyboard-gate/scripts/qa-stage.mjs <project> [--html source/stage.html] [--step 0.1] [--from s] [--to s] [--dur s]
//        [--shots 6] [--no-face]
// Vùng an toàn mặc định theo short-editing/references/shorts-codes.md; style ghi đè bằng "qa": {"safe": {...}} trong
// source/style.json (top, bottom, left, right, railX, railTop, railBottom). Thoát mã 1 khi có LỖI (cảnh báo thì không).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const ENGINE = process.env.SHORT_EDITING_ENGINE || path.join(os.homedir(), '.claude', 'skills', 'short-editing', 'engine');
const { CHROME, FFMPEG } = await import(pathToFileURL(path.join(ENGINE, 'platform.mjs')).href);
const { chromium } = createRequire(path.join(ENGINE, 'package.json'))('playwright-core');

const argv = process.argv.slice(2), pos = argv.filter((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').match(/^--(html|step|from|to|dur|shots)$/));
const flag = (k, d) => { const i = argv.indexOf('--' + k); return i < 0 ? d : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
if (!pos[0]) { console.log('usage: node qa-stage.mjs <project> [--html source/stage.html] [--step 0.1] [--from s] [--to s] [--dur s] [--shots 6] [--no-face]'); process.exit(2); }
const PROJ = path.resolve(pos[0]), P = (...a) => path.join(PROJ, ...a);
const HTML = path.resolve(PROJ, flag('html', 'source/stage.html')), STEP = +flag('step', 0.1), SHOTS = +flag('shots', 6);
const W = 1080, H = 1920, t0 = Date.now();

// ---- time: setT takes SHORT time, the camera is in SOURCE time (stage-map.js: MAP = [[source, short], ...])
let MAP = null;
const mapFile = path.join(path.dirname(HTML), 'stage-map.js');
if (fs.existsSync(mapFile)) { const m = fs.readFileSync(mapFile, 'utf8').match(/MAP\s*=\s*(\[\[[\s\S]*?\]\])/); if (m) MAP = JSON.parse(m[1]); }
const toSrc = t => {
  if (!MAP) return t;
  if (t <= MAP[0][1]) return MAP[0][0];
  for (let i = 1; i < MAP.length; i++) if (t <= MAP[i][1]) { const [a, b] = [MAP[i - 1], MAP[i]]; return a[0] + (b[0] - a[0]) * (t - a[1]) / Math.max(b[1] - a[1], 1e-6); }
  return MAP.at(-1)[0];
};
const DUR = +flag('dur', 0) || (MAP ? MAP.at(-1)[1] : 0);
if (!DUR) { console.log('Không biết độ dài: thêm --dur <giây> (không có stage-map.js).'); process.exit(2); }
const FROM = +flag('from', 0), TO = Math.min(+flag('to', DUR), DUR);

// ---- safe zone (style can override)
let safe = { top: 220, bottom: 1500, left: 0, right: W, railX: 940, railTop: 900, railBottom: 1700 };
try { safe = { ...safe, ...(JSON.parse(fs.readFileSync(P('source', 'style.json'), 'utf8')).qa?.safe || {}) }; } catch {}

// ---- faces: source.mp4 at 5 fps through cam.crop -> 540x960 -> vision-web faces, cached in files/qa-faces.json
const FPS_FACE = 5;
function faces() {
  if (flag('no-face', false)) return null;
  const src = P('assets', 'source.mp4');
  if (!fs.existsSync(src)) { console.log('  (bỏ qua mặt: không có assets/source.mp4)'); return null; }
  const spec = fs.existsSync(P('source', 'spec.js')) ? fs.readFileSync(P('source', 'spec.js'), 'utf8') : '';
  const cm = spec.match(/cam\s*:\s*\{\s*crop\s*:\s*\[([^\]]+)\]/), crop = cm ? cm[1].split(',').map(Number) : null;
  const st = fs.statSync(src), key = `${st.size}-${st.mtimeMs}-${crop}`, cache = P('files', 'qa-faces.json');
  try { const c = JSON.parse(fs.readFileSync(cache, 'utf8')); if (c.key === key) return c.rows; } catch {}
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-faces-'));
  const vf = `fps=${FPS_FACE},${crop ? `crop=${crop[2]}:${crop[3]}:${crop[0]}:${crop[1]},` : `crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',`}scale=540:960`;
  let r = spawnSync(FFMPEG, ['-v', 'error', '-i', src, '-vf', vf, '-q:v', '5', path.join(tmp, '%05d.jpg')], { stdio: 'inherit' });
  if (r.status) throw new Error('ffmpeg: không trích được khung camera');
  const out = path.join(tmp, 'faces.json');
  r = spawnSync(process.execPath, [path.join(ENGINE, 'vision-web.mjs'), 'faces', tmp, out], { stdio: ['ignore', 'ignore', 'inherit'] });
  if (r.status) throw new Error('vision-web faces lỗi');
  const rows = JSON.parse(fs.readFileSync(out, 'utf8')).map(f => f && f[2] > 0 ? f.slice(0, 4).map(v => Math.round(v * 2)) : null);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(P('files'), { recursive: true }); fs.writeFileSync(cache, JSON.stringify({ key, rows }));
  return rows;
}
const faceRows = faces();
// the detector box runs eyebrows to chin (= the face, an error to cover); `around` adds the forehead and the cheeks (a warning)
const faceAt = t => { const f = faceRows?.[Math.min(faceRows.length - 1, Math.round(toSrc(t) * FPS_FACE))]; if (!f) return null; const [cx, cy, w, h] = f;
  return { x: cx - w / 2, y: cy - h / 2, w, h, around: { x: cx - w * .6, y: cy - h * .8, w: w * 1.2, h: h * 1.3 } }; };

// ---- fonts: which code points a .ttf/.otf really has (cmap format 4 or 12); null for woff/woff2 (canvas test then)
const cmaps = new Map();
function cmapOf(file) {
  if (cmaps.has(file)) return cmaps.get(file);
  let has = null;
  try {
    const b = fs.readFileSync(file), tag = b.toString('latin1', 0, 4);
    if (tag !== 'wOFF' && tag !== 'wOF2') {
      let cm = -1; for (let i = 0; i < b.readUInt16BE(4); i++) if (b.toString('latin1', 12 + 16 * i, 16 + 16 * i) === 'cmap') cm = b.readUInt32BE(20 + 16 * i);
      const subs = []; for (let j = 0; j < b.readUInt16BE(cm + 2); j++) { const r = cm + 4 + 8 * j; subs.push({ p: b.readUInt16BE(r), e: b.readUInt16BE(r + 2), o: cm + b.readUInt32BE(r + 4) }); }
      const pick = subs.find(x => b.readUInt16BE(x.o) === 12) || subs.find(x => b.readUInt16BE(x.o) === 4 && (x.p === 3 || x.p === 0));
      if (pick && b.readUInt16BE(pick.o) === 12) {
        const n = b.readUInt32BE(pick.o + 12), g = []; for (let i = 0; i < n; i++) { const q = pick.o + 16 + 12 * i; g.push([b.readUInt32BE(q), b.readUInt32BE(q + 4)]); }
        has = c => g.some(([a, z]) => c >= a && c <= z);
      } else if (pick) {
        const o = pick.o, seg = b.readUInt16BE(o + 6) / 2, E = o + 14, S = E + 2 * seg + 2, D = S + 2 * seg, R = D + 2 * seg;
        has = c => { for (let i = 0; i < seg; i++) { if (c > b.readUInt16BE(E + 2 * i)) continue; const st = b.readUInt16BE(S + 2 * i); if (c < st) return false;
          const ro = b.readUInt16BE(R + 2 * i), d = b.readUInt16BE(D + 2 * i); if (!ro) return ((c + d) & 0xffff) !== 0;
          const gi = b.readUInt16BE(R + 2 * i + ro + 2 * (c - st)); return gi !== 0; } return false; };
      }
    }
  } catch {}
  cmaps.set(file, has); return has;
}
const num = w => w === 'bold' ? 700 : w === 'normal' ? 400 : +w;

// ---- page: every file through one fake http origin, so images are same-origin (alpha readable) and paths resolve
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const toURL = f => 'http://stage.local/' + encodeURI(path.resolve(f).replace(/\\/g, '/').replace(/^\//, ''));
const fromURL = u => { const p = decodeURIComponent(new URL(u).pathname).slice(1); return process.platform === 'win32' ? p : '/' + p; };
const engineFonts = fs.readFileSync(path.join(ENGINE, 'short.html'), 'utf8').match(/@font-face[^}]*\}/g).join('\n').replace(/url\('fonts\//g, `url('${toURL(path.join(ENGINE, 'fonts'))}/`);

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--disable-extensions', '--mute-audio'] });
const issues = new Map(), missing = new Set();
const add = (lvl, kind, who, text, t, detail, box) => {
  const k = `${lvl}|${kind}|${who}`;
  if (!issues.has(k)) issues.set(k, { lvl, kind, who, text, times: [], detail, box, worst: 0 });
  const it = issues.get(k); it.times.push(t); if ((text || '').length > (it.text || '').length) it.text = text;
  if (detail.score >= it.worst) { it.worst = detail.score; it.detail = detail; it.box = box; it.at = t; }
};
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('  pageerror:', e.message));
  await page.route('http://stage.local/**', route => {
    const f = fromURL(route.request().url());
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { missing.add(path.relative(PROJ, f)); return route.fulfill({ status: 404, body: '' }); }
    return route.fulfill({ body: fs.readFileSync(f), contentType: TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
  });
  await page.goto(toURL(HTML));
  await page.addStyleTag({ content: engineFonts + '\n* { pointer-events: auto !important; }' });
  await page.evaluate(() => Promise.all([...document.fonts].map(f => f.load().catch(() => {}))).then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {})))));
  if (!(await page.evaluate(() => typeof window.setT === 'function'))) throw new Error('stage.html không có window.setT(t)');

  await page.evaluate(() => {
    const alpha = new Map();   // img src -> {w, h, data} at <= 256 px, to know where a sticker is really painted
    const alphaOf = img => {
      if (!alpha.has(img.src)) {
        try { const k = Math.min(1, 256 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
          const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height); alpha.set(img.src, { w: c.width, h: c.height, d: x.getImageData(0, 0, c.width, c.height).data }); }
        catch { alpha.set(img.src, null); }
      }
      return alpha.get(img.src);
    };
    const ink = document.createElement('canvas').getContext('2d');
    const opacity = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
    const visible = el => {
      if (!el.getClientRects().length) return false;
      if (getComputedStyle(el).visibility !== 'visible') return false;
      let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity;
      return o > .05;
    };
    const name = el => { let e = el; while (e && !e.id) e = e.parentElement; return e ? '#' + e.id : el.tagName.toLowerCase(); };
    const solid = c => c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c);
    // is `el` actually painted at (x, y)? (empty boxes and transparent sticker pixels let what is under show through)
    const paints = (el, x, y, textAt) => {
      if (textAt.has(el)) return textAt.get(el).some(r => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
      const tag = el.tagName.toLowerCase();
      if (tag === 'svg' && !(el.parentElement && el.parentElement.closest('svg'))) return solid(getComputedStyle(el).backgroundColor);
      if (el instanceof SVGElement) return true;
      if (tag === 'img') { const a = alphaOf(el), r = el.getBoundingClientRect(); if (!a) return true;
        const px = Math.floor((x - r.left) / r.width * a.w), py = Math.floor((y - r.top) / r.height * a.h);
        return px >= 0 && py >= 0 && px < a.w && py < a.h && a.d[(py * a.w + px) * 4 + 3] > 40; }
      if (tag === 'canvas' || tag === 'video') return true;
      const cs = getComputedStyle(el);
      return solid(cs.backgroundColor) || cs.backgroundImage !== 'none' || (parseFloat(cs.borderTopWidth) > 0 && solid(cs.borderTopColor));
    };
    window.__qa = () => {
      const texts = new Map(), wk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n; (n = wk.nextNode());) {
        const s = n.nodeValue.replace(/ /g, ' ').trim(), el = n.parentElement;
        if (!s || !el || el.closest('script,style') || !visible(el)) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        const cs = getComputedStyle(el), pad = (parseFloat(cs.webkitTextStrokeWidth) || 0) / 2;
        // a Range rect is the font's content area (ascent + descent): cut it to the real ink of these glyphs
        ink.font = cs.font; const im = ink.measureText(s), fa = im.fontBoundingBoxAscent, fd = im.fontBoundingBoxDescent;
        const rs = [...rg.getClientRects()].filter(r => r.width > 1 && r.height > 1).map(r => { const k = r.height / Math.max(1, fa + fd);
          return { left: r.left - pad, right: r.right + pad, top: r.top + k * (fa - im.actualBoundingBoxAscent) - pad, bottom: r.top + k * (fa + im.actualBoundingBoxDescent) + pad }; });
        if (!rs.length) continue;
        if (!texts.has(el)) texts.set(el, { el, rects: [], str: '' });
        const T = texts.get(el); T.rects.push(...rs); T.str += (T.str ? ' ' : '') + n.nodeValue.replace(/ /g, ' ');
        T.op = opacity(el); T.font = { family: cs.fontFamily, weight: cs.fontWeight, style: cs.fontStyle };
      }
      const textAt = new Map([...texts].map(([el, T]) => [el, T.rects]));
      const out = { texts: [], imgs: [], covers: [] };
      for (const T of texts.values()) {
        const b = T.rects.reduce((a, r) => ({ left: Math.min(a.left, r.left), top: Math.min(a.top, r.top), right: Math.max(a.right, r.right), bottom: Math.max(a.bottom, r.bottom) }), { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 });
        out.texts.push({ who: name(T.el), str: T.str.trim().slice(0, 40), full: T.str, box: b, rects: T.rects, font: T.font, op: T.op });
        // what is painted above this text: sample a grid in every line box, take the topmost painted element there
        let hit = 0, all = 0; const by = new Map();
        for (const r of T.rects) for (let i = 1; i <= 6; i++) for (let j = 1; j <= 3; j++) {
          const x = r.left + (r.right - r.left) * i / 7, y = r.top + (r.bottom - r.top) * j / 4; if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue; all++;
          const top = document.elementsFromPoint(x, y).find(e => e !== document.body && e !== document.documentElement && paints(e, x, y, textAt));
          if (!top || top === T.el || T.el.contains(top) || top.contains(T.el) || name(top) === name(T.el)) continue;   // same component: its own design
          hit++; const k = name(top) + (textAt.has(top) ? ' (chữ)' : ''); by.set(k, (by.get(k) || 0) + 1);
        }
        if (all && hit / all > .08) { const [k] = [...by].sort((a, b) => b[1] - a[1])[0]; out.covers.push({ who: name(T.el), str: T.str.trim().slice(0, 40), by: k, share: hit / all, box: b }); }
      }
      for (const img of document.querySelectorAll('img')) {
        if (!visible(img)) continue;
        const r = img.getBoundingClientRect();
        if (r.width * r.height > innerWidth * innerHeight * .7) continue;   // full-screen B-roll / transition frames
        out.imgs.push({ who: name(img), src: img.getAttribute('src'), w: r.width, h: r.height, nw: img.naturalWidth, nh: img.naturalHeight, logo: /logo/i.test(img.getAttribute('src') + ' ' + img.id + ' ' + img.className), box: { left: r.left, top: r.top, right: r.right, bottom: r.bottom } });
      }
      return out;
    };
    window.__faces = () => { const out = [];
      for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch { continue; }
        for (const r of rules) if (r instanceof CSSFontFaceRule) { const m = r.style.getPropertyValue('src').match(/url\(\s*["']?([^"')]+)/);
          if (m) out.push({ fam: r.style.getPropertyValue('font-family').replace(/["']/g, '').trim(), w: (r.style.getPropertyValue('font-weight') || '400').trim(), style: (r.style.getPropertyValue('font-style') || 'normal').trim(), url: new URL(m[1], sh.href || location.href).href }); } }
      return out; };
    // fonts: a char the font lacks falls back, so it measures differently against two different fallbacks
    window.__glyphs = async (fam, weight, style, chars) => {
      const first = fam.split(',')[0].trim(), spec = `${style} ${weight} 100px ${first}`;
      await document.fonts.load(spec, chars).catch(() => {});
      const loaded = [...document.fonts].some(f => f.family.replace(/["']/g, '') === first.replace(/["']/g, '') && f.status === 'loaded');
      const x = document.createElement('canvas').getContext('2d'), m = f => { x.font = f; return c => x.measureText(c).width; };
      const a = m(`${spec}, monospace`), b = m(`${spec}, serif`);
      return { loaded, generic: /^(serif|sans-serif|monospace|cursive|fantasy|system-ui)$/.test(first), miss: [...new Set(chars)].filter(c => c.trim() && Math.abs(a(c) - b(c)) > .01) };
    };
  });

  // ---- sweep
  const fonts = new Map();
  const ov = (a, b) => Math.max(0, Math.min(a.right, b.x + b.w) - Math.max(a.left, b.x)) * Math.max(0, Math.min(a.bottom, b.y + b.h) - Math.max(a.top, b.y));
  let n = 0;
  for (let t = FROM; t <= TO + 1e-6; t = +(t + STEP).toFixed(4)) {
    n++;
    await page.evaluate(t => window.setT(t), t);
    const s = await page.evaluate(() => window.__qa()), face = faceAt(t);
    for (const x of s.texts) {
      const b = x.box, k = `${x.font.family}|${x.font.weight}|${x.font.style}`;
      fonts.set(k, (fonts.get(k) || '') + x.full);
      if (x.op < .5) continue;   // still fading in or out
      if (b.left < 0 || b.right > W || b.top < 0 || b.bottom > H) add('LỖI', 'chữ tràn khung', x.who, x.str, t, { score: Math.max(-b.left, b.right - W, -b.top, b.bottom - H), msg: `x ${Math.round(b.left)}–${Math.round(b.right)}, y ${Math.round(b.top)}–${Math.round(b.bottom)}` }, b);
      else if (b.left < 24 || b.right > W - 24) add('cảnh báo', 'chữ sát mép', x.who, x.str, t, { score: 24 - Math.min(b.left, W - b.right), msg: `cách mép ${Math.round(Math.min(b.left, W - b.right))} px` }, b);
      const out = [b.top < safe.top && `trên ${safe.top}`, b.bottom > safe.bottom && `dưới ${safe.bottom}`, b.left < safe.left && `trái ${safe.left}`,
        b.right > safe.railX && b.bottom > safe.railTop && b.top < safe.railBottom && `cột nút bên phải (x > ${safe.railX})`].filter(Boolean);
      if (out.length) add('cảnh báo', 'ngoài vùng an toàn TikTok', x.who, x.str, t, { score: 1, msg: out.join(', ') }, b);
      if (face) { const a = x.rects.reduce((s, r) => s + ov(r, face), 0), e = x.rects.reduce((s, r) => s + ov(r, face.around), 0);
        if (a > 400) add('LỖI', 'chữ đè mặt', x.who, x.str, t, { score: a, msg: `${Math.round(a)} px² trên mắt-mũi-miệng` }, b);
        else if (e > 400) add('cảnh báo', 'chữ sát mặt (trán, má)', x.who, x.str, t, { score: e, msg: `${Math.round(e)} px² trên trán/má` }, b); }
    }
    for (const c of s.covers) add(c.by.endsWith('(chữ)') ? 'LỖI' : 'cảnh báo', c.by.endsWith('(chữ)') ? 'chữ chồng chữ' : 'decor đè chữ', c.who, c.str, t, { score: c.share, msg: `${c.by} che ${Math.round(c.share * 100)} %` }, c.box);
    for (const m of s.imgs) {
      if (!m.nw) { add('LỖI', 'ảnh không tải được', m.who, m.src, t, { score: 1, msg: m.src }, m.box); continue; }
      const k = Math.max(m.w / m.nw, m.h / m.nh);
      if (k > 1.5) add(k > 2.5 ? 'LỖI' : 'cảnh báo', 'ảnh bị phóng to (mờ)', m.who, m.src, t, { score: k, msg: `gốc ${m.nw}x${m.nh}, hiện ${Math.round(m.w)}x${Math.round(m.h)} (x${k.toFixed(1)})` }, m.box);
      if (m.logo && Math.min(m.w, m.h) < 90) add('cảnh báo', 'logo quá nhỏ', m.who, m.src, t, { score: 1, msg: `${Math.round(m.w)}x${Math.round(m.h)} px` }, m.box);
      if (face && !m.logo && ov(m.box, face) > face.w * face.h * .25) add('cảnh báo', 'ảnh che mặt', m.who, m.src, t, { score: ov(m.box, face), msg: `che ${Math.round(ov(m.box, face) / (face.w * face.h) * 100)} % mặt` }, m.box);
    }
  }
  const faceRules = await page.evaluate(() => window.__faces());
  for (const [k, chars] of fonts) {
    const [family, weight, style] = k.split('|'), g = await page.evaluate(a => window.__glyphs(...a), [family, weight, style, chars]);
    const fam = family.split(',')[0].trim(), bare = fam.replace(/["']/g, '');
    // the @font-face the browser would pick: same family, weight inside its range or the nearest one
    const cands = faceRules.filter(f => f.fam === bare).map(f => { const [lo, hi = lo] = f.w.split(/\s+/).map(num); const w = num(weight);
      return { ...f, d: (w < lo ? lo - w : w > hi ? w - hi : 0) + (f.style === style ? 0 : 1000) }; }).sort((a, b) => a.d - b.d);
    const has = cands[0] && cmapOf(fromURL(cands[0].url));
    if (has) g.miss = [...new Set(chars)].filter(c => c.trim() && c.codePointAt(0) > 32 && !has(c.codePointAt(0)));
    if (!g.generic && !g.loaded) add('LỖI', 'font không tải được', fam, `${weight}`, 0, { score: 1, msg: `${fam} ${weight}: chữ đang hiện bằng font dự phòng` });
    else if (g.miss.length) add('LỖI', 'font thiếu ký tự', fam, `${weight}`, 0, { score: g.miss.length, msg: `${fam} ${weight} thiếu: ${g.miss.join(' ')}` });
    if (chars !== chars.normalize('NFC')) add('cảnh báo', 'chữ dạng tổ hợp (NFD)', fam, '', 0, { score: 1, msg: 'dấu tách rời ký tự, nên chuẩn hóa NFC' });
  }
  for (const f of missing) add('LỖI', 'file không có', f, '', 0, { score: 1, msg: f });

  // ---- report, ranges merged
  const ranges = ts => ts.reduce((a, t) => { const l = a.at(-1); if (l && t - l[1] <= STEP * 1.6) l[1] = t; else a.push([t, t]); return a; }, []).map(([a, b]) => a === b ? `${a.toFixed(1)}s` : `${a.toFixed(1)}–${b.toFixed(1)}s`).join(', ');
  for (const i of issues.values()) if (i.lvl === 'LỖI' && i.times.length && i.times[0] + i.times.length > 0 && i.times.length * STEP < .25 && /tràn|chồng|mặt/.test(i.kind)) { i.lvl = 'cảnh báo'; i.kind += ' (thoáng qua)'; }
  const list = [...issues.values()].sort((a, b) => (a.lvl === 'LỖI' ? 0 : 1) - (b.lvl === 'LỖI' ? 0 : 1) || a.times[0] - b.times[0]);
  const err = list.filter(i => i.lvl === 'LỖI').length;
  const qaDir = P('stills', 'qa'); fs.rmSync(qaDir, { recursive: true, force: true }); fs.mkdirSync(qaDir, { recursive: true });

  // ---- shots: only frames with a problem, worst moment of each, footage underneath
  const shots = new Map();
  for (const it of list.filter(i => i.box && i.at != null).slice(0, 999)) { const t = +it.at.toFixed(2); if (!shots.has(t) && shots.size < SHOTS) shots.set(t, []); shots.get(t)?.push(it); }
  for (const [t, its] of shots) {
    const bg = path.join(os.tmpdir(), `qa-bg-${process.pid}-${t.toFixed(2)}.jpg`), spec = fs.existsSync(P('source', 'spec.js')) ? fs.readFileSync(P('source', 'spec.js'), 'utf8') : '';
    const cm = spec.match(/cam\s*:\s*\{\s*crop\s*:\s*\[([^\]]+)\]/), c = cm && cm[1].split(',').map(Number);
    const hasSrc = fs.existsSync(P('assets', 'source.mp4')) && !spawnSync(FFMPEG, ['-v', 'error', '-y', '-ss', String(toSrc(t)), '-i', P('assets', 'source.mp4'), '-frames:v', '1', '-vf', `${c ? `crop=${c[2]}:${c[3]}:${c[0]}:${c[1]},` : ''}scale=${W}:${H}`, '-q:v', '4', bg]).status;
    await page.evaluate(t => window.setT(t), t);
    const face = faceAt(t);
    await page.evaluate(([bg, boxes, face]) => {
      document.body.style.background = bg ? `url("${bg}") center/cover` : '#808080';
      const o = document.createElement('div'); o.id = '__qaov'; o.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none';
      for (const [b, col] of [...boxes.map(b => [b, '#ff2d2d']), ...(face ? [[{ left: face.x, top: face.y, right: face.x + face.w, bottom: face.y + face.h }, '#ffd400']] : [])]) {   // red = problem, yellow = face
        const d = document.createElement('div'); d.style.cssText = `position:absolute;left:${b.left - 6}px;top:${b.top - 6}px;width:${b.right - b.left + 12}px;height:${b.bottom - b.top + 12}px;border:6px solid ${col};box-sizing:border-box`; o.appendChild(d);
      }
      document.body.appendChild(o);
    }, [hasSrc ? toURL(bg) : null, its.map(i => i.box), face]);
    const png = path.join(os.tmpdir(), `qa-shot-${process.pid}.png`);
    await page.screenshot({ path: png });
    await page.evaluate(() => { document.getElementById('__qaov')?.remove(); document.body.style.background = ''; });
    const out = path.join(qaDir, `qa-${t.toFixed(2)}.jpg`);
    spawnSync(FFMPEG, ['-v', 'error', '-y', '-i', png, '-vf', 'scale=540:960', '-q:v', '4', out]);
    for (const i of its) i.shot = path.relative(PROJ, out).replace(/\\/g, '/');
    fs.rmSync(png, { force: true }); fs.rmSync(bg, { force: true });
  }

  console.log(`QA ${path.relative(process.cwd(), HTML)}: ${n} khung (${FROM}–${TO.toFixed(2)}s, bước ${STEP}s), mặt ${faceRows ? 'có' : 'bỏ qua'}, ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  if (!list.length) console.log('Không thấy lỗi. Không cần xem ảnh.');
  for (const i of list) console.log(`${i.lvl === 'LỖI' ? 'LỖI     ' : 'cảnh báo'} ${i.kind} | ${i.who}${i.text ? ` "${i.text}"` : ''} | ${i.times[0] || i.times.length > 1 ? ranges(i.times) : '—'} | ${i.detail.msg}${i.shot ? ` | ${i.shot}` : ''}`);
  console.log(`=> ${err} lỗi, ${list.length - err} cảnh báo${shots.size ? `, ${shots.size} ảnh cần xem trong stills/qa/` : ''}`);
  fs.writeFileSync(path.join(qaDir, 'qa.json'), JSON.stringify({ html: path.relative(PROJ, HTML), step: STEP, from: FROM, to: TO, safe, issues: list.map(({ box, ...i }) => ({ ...i, ranges: ranges(i.times), times: undefined })) }, null, 1));
  process.exitCode = err ? 1 : 0;
} finally { await browser.close(); }
