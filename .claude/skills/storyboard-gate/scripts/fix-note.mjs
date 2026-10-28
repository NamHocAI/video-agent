#!/usr/bin/env node
// Sửa đúng đoạn theo 1 ghi chú bút vẽ: vá thẻ trong plan.json, dựng lại ảnh xem trước CHỈ của thẻ đó, lưu ảnh trước/sau,
// ghi fixes.json (đã sửa gì), đánh dấu ghi chú đã sửa, mở lại đoạn đó để người dùng duyệt lại (version mới). Không xuất.
//   node fix-note.mjs <storyboard> --note <số thứ tự|id> --patch '<json gộp vào thẻ>' --what "<đã sửa gì>" [--card <id>]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { SKILL, readJSON } from './lib.mjs';
import { writeHandoff } from './memory.mjs';

const argv = process.argv.slice(2), opt = k => { const i = argv.indexOf('--' + k); return i < 0 ? null : argv[i + 1]; };
const dir = path.resolve(argv[0] || ''), planF = path.join(dir, 'plan.json'), stF = path.join(dir, 'state.json');
const plan = readJSON(planF), st = readJSON(stF), what = opt('what'), patch = JSON.parse(opt('patch') || 'null');
if (!plan || !st || !what || !patch) { console.log('usage: node fix-note.mjs <storyboard> --note <n|id> --patch <json> --what <mô tả> [--card <id>]'); process.exit(1); }
const notes = st.notes || [], key = opt('note'), note = notes.find(n => n.id === key) || notes[+key - 1];
if (!note) { console.log('không thấy ghi chú ' + key); process.exit(1); }
const seg = plan.segments.find(s => s.id === note.seg), card = seg.cards.find(c => c.id === (opt('card') || st.segments?.[seg.id]?.selected));
if (!card) { console.log('không thấy thẻ'); process.exit(1); }
const n = notes.indexOf(note) + 1, fx = path.join(dir, 'fx'), fd = path.join(fx, 'fixes'); fs.mkdirSync(fd, { recursive: true });
const before = `fx/fixes/note${n}-${card.id}-truoc.jpg`, after = `fx/fixes/note${n}-${card.id}-sau.jpg`;
if (fs.existsSync(path.join(fx, card.id + '.jpg'))) fs.copyFileSync(path.join(fx, card.id + '.jpg'), path.join(dir, before));

// vá thẻ: gộp nông, riêng extraScenes thì nối thêm
for (const [k, v] of Object.entries(patch)) card[k] = k === 'extraScenes' ? [...(card[k] || []), ...v] : v;
fs.writeFileSync(planF, JSON.stringify(plan, null, 2));
const run = (f, ...a) => spawnSync(process.execPath, [path.join(SKILL, 'scripts', f), ...a], { encoding: 'utf8', cwd: path.resolve(dir, '../../..') });
const r = run('preview.mjs', planF, '--only', 'fx', '--cards', card.id);
if (!readJSON(path.join(dir, 'preview.json'))?.fx?.[card.id]?.ok) { console.log('engine chưa vẽ được bản sửa:\n' + r.stdout + r.stderr); process.exit(2); }
fs.copyFileSync(path.join(fx, card.id + '.jpg'), path.join(dir, after));
run('qc.mjs', dir); run('build-wizard.mjs', planF);

const fixes = readJSON(path.join(dir, 'fixes.json'), []);
fixes.push({ note: note.id, n, seg: seg.id, segN: plan.segments.indexOf(seg) + 1, t: note.t, noteText: note.text, card: card.id, what, patch, before, after, at: new Date().toISOString() });
fs.writeFileSync(path.join(dir, 'fixes.json'), JSON.stringify(fixes, null, 2));
// state: ghi chú đã sửa, đoạn mở lại chờ duyệt (lần duyệt sau thành version mới ghi lý do), bản chốt cũ thành cũ
const s2 = readJSON(stF);
const nn = s2.notes.find(x => x.id === note.id); nn.fixed = { at: new Date().toISOString(), what };
const ss = s2.segments[seg.id]; ss.locked = false; ss.pendingFix = `sửa theo ghi chú ${n}: ${what}`;
if (s2.committedAt) s2.changedAfterCommit = true;
fs.writeFileSync(stF + '.tmp', JSON.stringify(s2, null, 2)); fs.renameSync(stF + '.tmp', stF);
writeHandoff(dir);
const q = readJSON(path.join(dir, 'qc.json'))?.cards.find(x => x.card === card.id);
console.log(`đã sửa đoạn ${plan.segments.indexOf(seg) + 1} (thẻ ${card.id}) theo ghi chú ${n} "${note.text}": ${what}`);
console.log(`ảnh trước: ${before} · ảnh sau: ${after} · soát lỗi: ${q ? (q.issues.length ? q.issues.join('; ') : 'không lỗi') : '-'}`);
