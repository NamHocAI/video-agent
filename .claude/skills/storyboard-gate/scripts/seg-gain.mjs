#!/usr/bin/env node
// Hạ (hoặc nâng) giọng của 1 đoạn cho độ lớn đoạn đó vào chuẩn, rồi đo LUFS + đỉnh thật từng đoạn trước/sau.
// Engine không có chỉnh giọng theo đoạn: chỉnh trên bản chép <storyboard>/_engine/assets/voice.wav (giữ voice.orig.wav),
// có dốc 50 ms ở 2 biên đoạn, rồi engine `audio` trộn lại với âm thanh người dùng đã chọn. Project gốc không đụng.
//   node seg-gain.mjs <storyboard> --seg D --target -13.1 [--max 3]      (chỉ đo: --measure)
// Ghi plan.voiceGain [{seg, db}] để bản dựng cuối dùng đúng mức này.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { VA, ENGINE, readJSON } from './lib.mjs';
import { loadBase, composeSpec, specText, pickStyle, applyStyle } from './cardspec.mjs';

const argv = process.argv.slice(2), opt = k => { const i = argv.indexOf('--' + k); return i < 0 ? null : argv[i + 1]; };
const dir = path.resolve(argv[0] || ''), planF = path.join(dir, 'plan.json'), plan = readJSON(planF), st = readJSON(path.join(dir, 'state.json'), {});
if (!plan) { console.log('usage: node seg-gain.mjs <storyboard> --seg D --target -13.1 | --measure'); process.exit(1); }
const PJ = path.join(dir, '_engine'), P = (...a) => path.join(PJ, ...a), ROOT = path.resolve(VA, '..');
const { mapper } = await import(pathToFileURL(path.join(ENGINE, 'lib/timeline.js')).href), m = mapper(readJSON(P('assets/timeline.json')));
const g30 = x => Math.round(x * 30) / 30, win = s => [g30(m(s.from)), g30(m(s.to))];

// spec = thẻ đang chọn + âm thanh đang chọn (state.json), cùng style với ảnh xem trước
applyStyle(PJ, VA, pickStyle(dir, plan));
const pick = Object.fromEntries(plan.segments.map(s => [s.id, st.segments?.[s.id]?.selected || s.default]));
const { spec, labels } = composeSpec(loadBase(path.resolve(VA, plan.project, 'source/spec.js')), plan, pick, plan.captionsReplace || [], m);
const snd = plan.sound.find(x => x.id === st.sound) || plan.sound[0];
Object.assign(spec, { music: snd.music, mix: { ...snd.mix }, sfx: snd.sfx });
fs.writeFileSync(P('source/spec.js'), specText(spec, labels));

const orig = P('assets/voice.orig.wav'); if (!fs.existsSync(orig)) fs.copyFileSync(P('assets/voice.wav'), orig);
function voiceWith(gains) {   // gains: [{a, b, db}] giờ short
  const ex = gains.length ? gains.reduce((e, { a, b, db }) => `(${e})*(1+(${Math.pow(10, db / 20).toFixed(5)}-1)*max(0,min(1,min((t-${a})/0.05,(${b}-t)/0.05))))`, '1') : '1';
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', orig, '-af', `volume='${ex}':eval=frame`, '-c:a', 'pcm_s24le', P('assets/voice.wav')], { encoding: 'utf8' });
  if (r.status) throw new Error(r.stderr);
}
function measure() {
  const r = spawnSync(process.execPath, [path.join(ENGINE, 'short.mjs'), 'audio', PJ], { encoding: 'utf8', cwd: ROOT });
  if (r.status) throw new Error('engine audio lỗi: ' + r.stderr.slice(-300));
  const eb = (ss, tt) => { const e = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...(ss != null ? ['-ss', String(ss), '-t', String(tt)] : []), '-i', P('assets/mix.wav'), '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
    const g = re => +(e.match(re)?.at(-1)?.match(/-?[\d.]+/)[0]); return { I: g(/I:\s+-?[\d.]+ LUFS/g), TP: g(/Peak:\s+-?[\d.]+ dBFS/g) }; };
  return { all: eb(), segs: plan.segments.map(s => { const [a, b] = win(s); return { seg: s.id, a, b, ...eb(a, b - a) }; }) };
}
const show = (t, r) => console.log(`${t}: cả video ${r.all.I} LUFS / đỉnh ${r.all.TP} dBTP · ` + r.segs.map(x => `${x.seg} ${x.I} / ${x.TP}`).join(' · '));

const keepGains = (plan.voiceGain || []).filter(g => g.seg !== opt('seg'));
const asWin = gs => gs.map(g => { const s = plan.segments.find(x => x.id === g.seg), [a, b] = win(s); return { a, b, db: g.db }; });
voiceWith(asWin(plan.voiceGain || []));
const before = measure(); show('TRƯỚC', before);
if (argv.includes('--measure')) process.exit(0);

const id = opt('seg'), target = +opt('target'), max = +(opt('max') || 3), seg = plan.segments.find(s => s.id === id);
if (!seg || !Number.isFinite(target)) { console.log('cần --seg và --target'); process.exit(1); }
let db = (plan.voiceGain || []).find(g => g.seg === id)?.db || 0, now = before, tries = [];
for (let k = 1; k <= max; k++) {
  const cur = now.segs.find(x => x.seg === id).I;
  if (cur <= target && cur >= target - 0.3) break;
  db = +(db + (target - cur)).toFixed(2);
  voiceWith(asWin([...keepGains, { seg: id, db }])); now = measure();
  tries.push({ lần: k, db, đoạn: now.segs.find(x => x.seg === id).I }); show(`LẦN ${k} (giọng đoạn ${id} ${db} dB)`, now);
}
plan.voiceGain = [...keepGains, { seg: id, db, why: `hạ độ lớn đoạn ${id} vào chuẩn -14 ±1 LUFS (đích ${target})` }];
fs.writeFileSync(planF, JSON.stringify(plan, null, 2));
const out = { at: new Date().toISOString(), sound: snd.id, seg: id, target, db, tries, before, after: now };
fs.writeFileSync(path.join(dir, 'loudness.json'), JSON.stringify(out, null, 2));
console.log(`đã ghi plan.voiceGain (${id}: ${db} dB) + loudness.json`);
