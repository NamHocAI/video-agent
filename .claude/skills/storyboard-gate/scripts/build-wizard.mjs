#!/usr/bin/env node
// Dựng trang wizard storyboard từ plan.json (Claude viết: đoạn + thẻ hiệu ứng). Không render video.
//   node build-wizard.mjs <video-agent/edits/short-<slug>/storyboard/plan.json>
// Ghi cạnh plan.json: data.json, index.html, stills/<đoạn>.jpg, fonts.json, fonts.png
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { SKILL, VA, ENGINE, rel, readJSON, checkMedia, fileURL } from './lib.mjs';
import { fontCheck, VI_CHARS } from './fontcheck.mjs';
import { recall, writeHandoff } from './memory.mjs';

const planFile = path.resolve(process.argv[2] || '');
const plan = readJSON(planFile);
if (!plan) { console.log('usage: node build-wizard.mjs <.../storyboard/plan.json>'); process.exit(1); }
const dir = path.dirname(planFile), A = p => path.resolve(VA, p);
fs.mkdirSync(path.join(dir, 'stills'), { recursive: true });

// ---- lời thoại từng đoạn từ transcript có sẵn (không chạy lại)
const tr = readJSON(A(plan.transcript));
const words = (tr?.words || tr || []).filter(w => (w.type ?? 'word') === 'word');
const say = (a, b) => words.filter(w => w.start >= a - .05 && w.start < b - .05).map(w => w.text).join(' ');

// ---- ảnh tĩnh thật từ take, giữa mỗi đoạn
for (const s of plan.segments) {
  const t = (s.from + s.to) / 2, out = path.join(dir, 'stills', `${s.id}.jpg`);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', t.toFixed(2), '-i', A(plan.take), '-frames:v', '1', '-vf', 'scale=360:-2', '-q:v', '3', out]);
  s.still = `stills/${s.id}.jpg`; s.stillAt = +t.toFixed(2); s.text = say(s.from, s.to);
}

// ---- 3 preset màu + font. Thẻ 1 = style mặc định do /studio-setup ghi trong video-agent/style.json
const current = readJSON(A('style.json'))?.default;
const fontFile = name => [path.join(ENGINE, 'fonts', name.replace(/ /g, '') + '.ttf'),
  ...fs.readdirSync(A('styles')).map(s => A(`styles/${s}/assets/fonts/${name.replace(/ /g, '')}.ttf`))].find(fs.existsSync);
const presets = plan.presets.map((p, i) => {
  const st = readJSON(A(`styles/${p.style}/style.json`)) || {}, c = st.colors || {};
  const fonts = [...new Set([st.display?.font, st.captions?.font, ...(p.extraFonts || [])].filter(Boolean))];
  return { id: p.id, label: i === 0 ? 'Phong cách hiện tại của bạn' : p.label, style: p.style, current: p.style === current, note: p.note,
    colors: { paper: c.paper || '#FFFFFF', ink: c.ink || '#111111', accent: c.accent, caption: st.captions?.color, captionBg: st.captions?.bg },
    display: { font: st.display?.font, weight: st.display?.weight }, captions: { font: st.captions?.font, weight: st.captions?.weight, upper: !!st.captions?.upper },
    fonts: fonts.map(f => ({ name: f, file: fontFile(f) && rel(fontFile(f)) })) };
});
const all = [...new Map(presets.flatMap(p => p.fonts).filter(f => f.file).map(f => [f.name, f])).values()];
const fc = await fontCheck(all.map(f => ({ name: f.name, file: f.file, url: fileURL(A(f.file)) })), path.join(dir, 'fonts.json'), path.join(dir, 'fonts.png'));
for (const p of presets) for (const f of p.fonts) { const r = fc.find(x => x.name === f.name); f.ok = !!r?.ok; f.missing = r?.missing.length ?? null; }

// ---- thẻ hiệu ứng: kiểm tư liệu ngay lúc dựng (server kiểm lại mỗi lần mở trang)
for (const s of plan.segments) for (const c of s.cards) c.mediaCheck = (c.media || []).map(checkMedia);

// kết quả xem trước của engine (preview.mjs): ảnh hiệu ứng, mẫu âm thanh, phụ đề, ảnh bìa
const pv = readJSON(path.join(dir, 'preview.json'), { fx: {}, audio: {}, captions: {}, cover: [], upgrades: [] });
for (const s of plan.segments) for (const c of s.cards) c.preview = pv.fx[c.id] || { ok: false, why: 'chưa chạy preview.mjs' };
const upgrades = [...(plan.upgrades || []), ...(pv.upgrades || [])];
const defaults = recall(plan);   // preset theo format+style, đoạn dùng lại từ template (chỉ trong data.json, không sửa plan.json)
const fixes = readJSON(path.join(dir, 'fixes.json'), []), qc = readJSON(path.join(dir, 'qc.json'));
const data = { ...plan, previewStyle: pv.style || plan.style, defaults, fixes, qc, upgrades, audio: pv.audio, captions: pv.captions, cover: pv.cover, presets, fontsChecked: fc.length, fontChars: VI_CHARS.length, start: readJSON(A(`storyboards/${plan.slug}/start.json`)), builtAt: new Date().toISOString() };
fs.writeFileSync(path.join(dir, 'data.json'), JSON.stringify(data, null, 2));
fs.copyFileSync(path.join(SKILL, 'wizard/index.html'), path.join(dir, 'index.html'));
try { writeHandoff(dir); } catch {}
console.log(`wizard: ${rel(dir)}/index.html  (${plan.segments.length} đoạn, ${presets.length} preset, ${fc.length} font đã kiểm)`);
for (const f of fc) console.log(`  font ${f.ok ? 'OK   ' : 'THIẾU'} ${f.name}${f.missing.length ? ` (${f.missing.length} chữ)` : ''}`);
