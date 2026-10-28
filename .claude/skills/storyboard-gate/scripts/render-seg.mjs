#!/usr/bin/env node
// Render theo từng đoạn, có checkpoint: lỗi giữa chừng thì chạy lại sẽ tiếp từ đúng đoạn lỗi, không làm lại đoạn đã xong.
// Spec = composeSpec (cardspec.mjs): CÙNG cách dựng spec với ảnh xem trước.
//   node render-seg.mjs <storyboard> [--pick D=D3,...] [--segs D,E] [--from-choices] [--scale 1] [--dry]
// Ghi: <storyboard>/_engine/output/seg-<đoạn>.mp4 và <storyboard>/render.json (checkpoint từng đoạn)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { VA, ENGINE, readJSON } from './lib.mjs';
import { loadBase, composeSpec, specText, prepCard, pickStyle, applyStyle } from './cardspec.mjs';
import { speedramp } from './speedramp.mjs';
import { writeHandoff } from './memory.mjs';

const argv = process.argv.slice(2), opt = k => { const i = argv.indexOf('--' + k); return i < 0 ? null : argv[i + 1]; };
const dir = path.resolve(argv[0] || ''), plan = readJSON(path.join(dir, 'plan.json'));
if (!plan) { console.log('usage: node render-seg.mjs <storyboard> [--pick D=D3] [--segs D] [--from-choices] [--dry]'); process.exit(1); }
const PJ = path.join(dir, '_engine'), P = (...a) => path.join(PJ, ...a), ROOT = path.resolve(VA, '..'), SHORT = path.join(ENGINE, 'short.mjs');
const { mapper } = await import(pathToFileURL(path.join(ENGINE, 'lib/timeline.js')).href), m = mapper(readJSON(P('assets/timeline.json')));
const base = loadBase(path.resolve(VA, plan.project, 'source/spec.js'));
const STYLE = pickStyle(dir, plan, opt('style')); applyStyle(PJ, VA, STYLE);   // cùng style với ảnh xem trước

// lựa chọn: choices.json đã chốt, hoặc thẻ "đang dùng", rồi --pick đè lên
const ch = argv.includes('--from-choices') ? readJSON(path.join(dir, 'choices.json')) : null;
if (argv.includes('--from-choices') && !ch) { console.log('chưa có choices.json (chưa chốt)'); process.exit(1); }
const pick = Object.fromEntries(plan.segments.map(s => [s.id, ch?.segments.find(x => x.id === s.id)?.effect.id ?? s.cards.find(c => c.source === 'đang dùng')?.id ?? s.default]));
for (const kv of (opt('pick') || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); pick[k] = v; }
const { spec, labels } = composeSpec(base, plan, pick, plan.captionsReplace || [], m);
for (const s of plan.segments) prepCard(s.cards.find(c => c.id === pick[s.id]), PJ, VA, (p, src, out) => { if (p.kind === 'speedramp') speedramp(src, out, p.ramp); });
const text = specText(spec, labels), sha = x => crypto.createHash('sha1').update(x).digest('hex').slice(0, 10), hash = sha(text);
// checkpoint theo từng đoạn: chỉ đổi khi thẻ của đoạn đó, spec gốc, phụ đề ép hoặc nhãn đổi (đoạn khác đổi không làm render lại đoạn này)
const baseHash = sha(fs.readFileSync(path.resolve(VA, plan.project, 'source/spec.js'), 'utf8'));
const segHash = s => sha(JSON.stringify(['grid30', baseHash, STYLE, s.from, s.to, s.cards.find(c => c.id === pick[s.id]), plan.captionsReplace || [], labels]));
fs.writeFileSync(P('source/spec.js'), text);

const RJ = path.join(dir, 'render.json'), ck = readJSON(RJ, { segs: {} });
const save = () => { fs.writeFileSync(RJ, JSON.stringify(ck, null, 2)); try { writeHandoff(dir); } catch {} };
const engine = (...a) => spawnSync(process.execPath, [SHORT, ...a], { encoding: 'utf8', cwd: ROOT });
// media mới trong spec (vd clip tua nhanh): prepare 1 lần
const prep = readJSON(P('.media-prepared.json'), Object.keys(base().media || {})), need = Object.keys(spec.media || {}).filter(k => !prep.includes(k));
if (need.length && !argv.includes('--dry')) { const r = engine('prepare', PJ); if (r.status) { console.log('prepare lỗi:', r.stderr.slice(-300)); process.exit(1); } fs.writeFileSync(P('.media-prepared.json'), JSON.stringify([...prep, ...need])); }

const segs = (opt('segs') || plan.segments.map(s => s.id).join(',')).split(','), scale = opt('scale') || '1';
console.log(`style ${STYLE} · spec ${hash} · thẻ: ${plan.segments.map(s => s.id + '=' + pick[s.id]).join(' ')}`);
fs.mkdirSync(P('output'), { recursive: true });
for (const id of segs) {
  const s = plan.segments.find(x => x.id === id), c = ck.segs[id], out = P('output', `seg-${id}.mp4`);
  const h = segHash(s);
  if (c?.status === 'xong' && c.hash === h && c.scale === scale && fs.existsSync(out)) { console.log(`đoạn ${id}: đã xong (checkpoint), bỏ qua`); continue; }
  if (argv.includes('--dry')) { console.log(`đoạn ${id}: SẼ render (${c ? 'checkpoint ' + c.status + (c.hash !== h ? ', thẻ/spec của đoạn đã đổi' : '') : 'chưa có checkpoint'})`); continue; }
  // biên đoạn căn đúng lưới 30 khung/giây: khung render trùng khung ảnh xem trước, ghép các đoạn không lệch
  const g = x => Math.round(x * 30) / 30, a = g(m(s.from)), b = g(m(s.to)), t0 = Date.now();
  ck.segs[id] = { status: 'đang render', hash: h, scale, from: +a.toFixed(3), to: +b.toFixed(3), card: pick[id], at: new Date().toISOString() }; save();
  const r = engine('render', PJ, '--from', a.toFixed(3), '--to', b.toFixed(3), '--scale', scale, '--out', out);
  if (r.status || !fs.existsSync(out)) { ck.segs[id] = { ...ck.segs[id], status: 'lỗi', error: (r.stderr || r.stdout).slice(-400) }; save(); console.log(`đoạn ${id}: LỖI, dừng. Chạy lại lệnh này sẽ tiếp từ đoạn ${id}.`); process.exit(2); }
  ck.segs[id] = { ...ck.segs[id], status: 'xong', file: path.relative(dir, out), sec: +((Date.now() - t0) / 1000).toFixed(1) }; save();
  console.log(`đoạn ${id}: xong ${ck.segs[id].sec}s -> ${ck.segs[id].file}`);
}
