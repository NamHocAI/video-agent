#!/usr/bin/env node
// Xem trước bằng chính engine (không render video):
//  - mỗi thẻ hiệu ứng: engine `stills` vẽ khung giữa đoạn với đúng scene đó -> fx/<thẻ>.jpg
//  - 3 thẻ âm thanh: engine `audio` trộn giọng + bed + SFX -> audio/<id>.mp3 (mẫu ngắn) + số đo LUFS từng đoạn
//  - phụ đề: hàm captionChunks của engine, theo từng preset màu/font -> captions trong preview.json
//  - ảnh bìa: stills ở đoạn hook -> cover/*.jpg
//   node preview.mjs <.../storyboard/plan.json> [--only fx,audio,captions,cover]
// Làm trong bản sao nhẹ storyboard/_engine/ (frames/ là junction chỉ đọc tới project gốc). Không đụng project gốc.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { VA, ENGINE, readJSON } from './lib.mjs';
import { loadBase, cardSpec, specText, prepCard, pickStyle, applyStyle } from './cardspec.mjs';
import { speedramp } from './speedramp.mjs';

const planFile = path.resolve(process.argv[2] || ''), plan = readJSON(planFile);
if (!plan?.project) { console.log('usage: node preview.mjs <plan.json> (plan cần "project")'); process.exit(1); }
const oi = process.argv.indexOf('--only'), ONLY = oi < 0 ? null : process.argv[oi + 1].split(',');
const want = k => !ONLY || ONLY.includes(k);
const dir = path.dirname(planFile), SRC = path.resolve(VA, plan.project), PJ = path.join(dir, '_engine'), P = (...a) => path.join(PJ, ...a);
const ROOT = path.resolve(VA, '..');   // engine đọc style.font.src "video-agent/..." tính từ thư mục này
const SHORT = path.join(ENGINE, 'short.mjs'), log = (...a) => console.log('[preview]', ...a);
const out = readJSON(path.join(dir, 'preview.json'), { fx: {}, audio: {}, captions: {}, cover: [], upgrades: [] });

// ---- bản sao của project đã prepare (frames chép thật, không junction: prepare ở đây không được đụng project gốc)
if (!fs.existsSync(P('assets/timeline.json'))) {
  for (const d of ['source', 'files', 'assets', 'frames']) fs.cpSync(path.join(SRC, d), P(d), { recursive: true });   // cả source.mp4: prepare/render cần take gốc
}
const si = process.argv.indexOf('--style'), STYLE = pickStyle(dir, plan, si < 0 ? null : process.argv[si + 1]);
if (applyStyle(PJ, VA, STYLE)) log('style ->', STYLE, '(vẽ lại theo preset đã chọn)');
out.style = STYLE;
const base = loadBase(path.join(SRC, 'source/spec.js'));
const { mapper: _mapper } = await import(pathToFileURL(path.join(ENGINE, 'lib/timeline.js')).href), M = _mapper(readJSON(P('assets/timeline.json')));
const ci = process.argv.indexOf('--cards'), CARDS = ci < 0 ? null : process.argv[ci + 1].split(',');
const writeSpec = (s, labels, probe) => fs.writeFileSync(P('source/spec.js'), specText(s, labels, probe));
const engine = (...a) => { const r = spawnSync(process.execPath, [SHORT, ...a, PJ], { encoding: 'utf8', cwd: ROOT }); return { ok: !r.status, log: (r.stdout || '') + (r.stderr || '') }; };
// media mới (vd clip tua nhanh) cần prepare 1 lần để engine trích khung
const prepared = () => readJSON(P('.media-prepared.json'), Object.keys(base().media || {}));
function ensureMedia(spec, labels) {
  const need = Object.keys(spec.media || {}).filter(k => !prepared().includes(k));
  if (!need.length) return true;
  writeSpec(spec, labels); const r = engine('prepare');
  if (r.ok) fs.writeFileSync(P('.media-prepared.json'), JSON.stringify([...prepared(), ...need]));
  return r.ok;
}
const stills = (spec, srcTimes, labels) => {
  writeSpec(spec, labels, true);
  // giờ short căn đúng khung 30 fps, để ảnh xem trước so được 1-1 với khung của bản render
  const r = spawnSync(process.execPath, [SHORT, 'stills', PJ, ...srcTimes.map(t => (Math.round(M(t) * 30) / 30).toFixed(4))], { encoding: 'utf8', cwd: ROOT });
  const all = (r.stdout || '') + (r.stderr || ''), texts = all.split('\n').filter(l => l.includes('[sbg] ')).map(l => JSON.parse(l.slice(l.indexOf('[sbg] ') + 6)));
  const err = all.split('\n').filter(l => /pageerror|Error|error/.test(l) && !l.includes('[sbg]')).join(' ').slice(0, 300);
  const files = fs.existsSync(P('stills')) ? fs.readdirSync(P('stills')).filter(f => /^t\d.*\.jpg$/.test(f)).sort() : [];
  return { ok: !r.status && files.length === srcTimes.length && !err, files: files.map(f => P('stills', f)), err: err || (r.status ? 'engine thoát lỗi' : ''), texts };
};
const small = (from, to, w = 360) => spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', from, '-vf', `scale=${w}:-2`, '-q:v', '3', to]);
const keep = (from, id) => { small(from, path.join(dir, 'fx', id + '.jpg')); fs.copyFileSync(from, path.join(dir, 'fx/full', id + '.jpg')); };

// ---- 1. hiệu ứng: mỗi thẻ = 1 spec (cardspec.mjs), engine stills vẽ khung giữa đoạn (hoặc previewAt)
if (want('fx')) {
  fs.mkdirSync(path.join(dir, 'fx/full'), { recursive: true });
  out.upgrades = (out.upgrades || []).filter(u => CARDS && !CARDS.includes(u.card));
  out.qc ??= {};
  const mid = s => (s.from + s.to) / 2;
  for (const s of plan.segments) for (const c of s.cards) {
    if (CARDS && !CARDS.includes(c.id)) continue;
    // thẻ đang dùng lấy clip có sẵn trong project, không chặn; thẻ thư viện cần tư liệu thật trong inputs/
    if (c.source !== 'đang dùng' && c.media?.some(m => !fs.existsSync(path.resolve(VA, m)))) { out.fx[c.id] = { ok: false, why: 'thiếu tư liệu nên engine chưa vẽ được (không phải lỗi engine)' }; log(c.id, 'thiếu tư liệu'); continue; }
    if (c.source !== 'đang dùng' && !c.scene && !c.broll && !c.keepBase) { out.fx[c.id] = { ok: false, why: 'thẻ chưa có tham số' }; out.upgrades.push({ seg: s.id, card: c.id, name: c.name, why: 'chưa phủ được lên ảnh xem trước: thiếu tham số' }); continue; }
    prepCard(c, PJ, VA, (p, src, dst) => { if (p.kind === 'speedramp') log(c.id, 'speedramp', JSON.stringify(speedramp(src, dst, p.ramp))); });
    const { spec, labels } = cardSpec(base, s, c, plan.captionsReplace || [], M);
    if (!ensureMedia(spec, labels)) { out.fx[c.id] = { ok: false, why: 'engine prepare lỗi với media mới' }; continue; }
    const at = c.previewAt ?? mid(s), r = stills(spec, [at], labels);
    if (r.ok) { keep(r.files[0], c.id); out.fx[c.id] = { ok: true, img: `fx/${c.id}.jpg`, full: `fx/full/${c.id}.jpg`, at, short: +(Math.round(M(at) * 30) / 30).toFixed(4), how: c.source === 'đang dùng' ? 'engine stills, spec hiện tại' : `engine stills, ${c.scene?.type || (c.keepBase ? 'biến thể spec hiện tại' : 'broll')}` }; out.qc[c.id] = r.texts; }
    else { out.fx[c.id] = { ok: false, why: r.err }; out.upgrades.push({ seg: s.id, card: c.id, name: c.name, why: 'engine chưa vẽ được lên ảnh xem trước: ' + r.err }); }
    log(c.id, out.fx[c.id].ok ? `ok (${r.texts.length} chữ)` : 'LỖI ' + out.fx[c.id].why);
  }
}

// ---- 2. âm thanh: engine audio với từng phong cách; đo mix.wav (LUFS, true peak) và từng đoạn (giọng vs nhạc+SFX)
const ebur = f => { const e = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  return { I: +(e.match(/I:\s+([-\d.]+) LUFS/g)?.at(-1).match(/[-\d.]+/)[0]), TP: +(e.match(/Peak:\s+([-\d.]+) dBFS/g)?.at(-1).match(/[-\d.]+/)[0]) }; };
const segLufs = (f, a, b) => { const e = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-ss', String(a), '-t', String(Math.max(.5, b - a)), '-i', f, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const v = +(e.match(/I:\s+([-\d.]+) LUFS/g)?.at(-1).match(/[-\d.]+/)[0]); return Number.isFinite(v) && v > -70 ? v : null; };
const { mapper, captionChunks, mapSpec } = await import(pathToFileURL(path.join(ENGINE, 'lib/timeline.js')).href);
const tl = readJSON(P('assets/timeline.json')), m = mapper(tl);
if (want('audio')) {
  fs.mkdirSync(path.join(dir, 'audio'), { recursive: true });
  fs.mkdirSync(P('assets/sfx'), { recursive: true });
  for (const f of fs.readdirSync(path.join(ENGINE, '../assets/sfx'))) fs.copyFileSync(path.join(ENGINE, '../assets/sfx', f), P('assets/sfx', f));
  // giọng đã chuẩn hoá như engine (-16 LUFS trước master): đo từng đoạn trên voice.wav rồi bù cùng một mức
  const vI = ebur(P('assets/voice.wav')).I;
  for (const s of plan.sound) {
    const sp = base(); sp.music = s.music; sp.mix = { ...s.mix, stem: true }; sp.sfx = s.sfx;
    writeSpec(sp);
    const r = engine('audio');
    if (!r.ok) { out.audio[s.id] = { ok: false, why: r.log.slice(-300) }; log('audio', s.id, 'LỖI'); continue; }
    const mix = ebur(P('assets/mix.wav'));
    const [a, b] = (s.sample || plan.sampleSrc).map(t => m(t));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(a), '-t', String(b - a), '-i', P('assets/mix.wav'), '-af', 'afade=t=out:st=' + (b - a - .4).toFixed(2) + ':d=0.4', '-b:a', '160k', path.join(dir, 'audio', s.id + '.mp3')]);
    const segs = plan.segments.map(g => {
      const x = m(g.from), y = m(g.to), voice = segLufs(P('assets/voice.wav'), x, y), fx = segLufs(P('assets/fx.wav'), x, y);
      const v16 = voice == null ? null : +(voice + (-16 - vI)).toFixed(1);
      return { seg: g.id, voice: v16, bed: fx, under: v16 != null && fx != null ? +(v16 - fx).toFixed(1) : null,
        sfx: (s.sfx?.files || []).filter(f => f.at >= g.from && f.at < g.to).map(f => f.label || path.basename(f.src)) };
    });
    out.audio[s.id] = { ok: true, mp3: `audio/${s.id}.mp3`, lufs: mix.I, tp: mix.TP, segs };
    log('audio', s.id, `${mix.I} LUFS, TP ${mix.TP}`);
  }
}

// ---- 3. phụ đề: đúng hàm chia cụm của engine, cho từng preset (style) đã chọn được ở Bước 1
if (want('captions')) {
  for (const p of plan.presets) {
    const st = readJSON(path.resolve(VA, `styles/${p.style}/style.json`)), sp = mapSpec(base(), m);
    const cfg = { ...(st.captions || {}), ...(sp.captions || {}) };
    const chunks = captionChunks(tl.words, { ...cfg, hide: cfg.hide || [], replace: [...(cfg.replace || []), ...(plan.captionsReplace || [])] });
    out.captions[p.id] = { maxWords: cfg.maxWords ?? 3, upper: !!cfg.upper, hi: cfg.hi || st.colors?.accent, color: cfg.color, bg: cfg.bg, y: cfg.paperY,
      chunks: chunks.map(c => ({ start: +c.start.toFixed(2), words: c.words.map(w => ({ t: cfg.upper ? w.text.toUpperCase() : w.text, e: !!w.emph })) })) };
  }
  // giờ SOURCE của từng cụm (timeline.json: s0 = giờ source của từ) để gắn vào đoạn
  const toSrc = t => { let s = 0; for (const w of tl.words) if (w.start <= t + .01) s = w.s0; return s; };
  for (const c of Object.values(out.captions)) for (const ch of c.chunks) { ch.src = toSrc(ch.start); ch.seg = plan.segments.find(g => ch.src >= g.from - .01 && ch.src < g.to)?.id ?? plan.segments.at(-1).id; }
  log('captions', Object.entries(out.captions).map(([k, v]) => `${k}: ${v.chunks.length} cụm`).join(', '));
}

// ---- 4. ảnh bìa: khung ở đoạn hook (spec hiện tại)
if (want('cover')) {
  fs.mkdirSync(path.join(dir, 'cover'), { recursive: true });
  const hook = plan.segments[0], ts = plan.coverSrc || [.3, 1.3, 2.4, 3.5, 4.6].map(t => hook.from + t * (hook.to - hook.from) / 5);
  const r = stills(base(), ts);
  out.cover = r.ok ? ts.map((t, i) => { const f = `cover/c${i + 1}.jpg`; small(r.files[i], path.join(dir, f), 540); return { id: `c${i + 1}`, src: +t.toFixed(2), img: f }; }) : [];
  if (!r.ok) log('cover LỖI', r.err);
}

writeSpec(base());
fs.writeFileSync(path.join(dir, 'preview.json'), JSON.stringify(out, null, 2));
log('xong ->', path.relative(VA, path.join(dir, 'preview.json')));
