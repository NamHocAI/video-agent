#!/usr/bin/env node
// Phương án dự phòng: người dùng nhắn "chốt <mã>" trong chat -> ghi choices.json từ mã (không cần server).
//   node commit.mjs <video-agent/edits/short-<slug>/storyboard> <mã SB1-...>
// Cờ đỏ được kiểm lại từ file thật; còn chặn thì không ghi.
import path from 'node:path';
import { readJSON, checkMedia } from './lib.mjs';
import { decode, blockers, buildChoices, writeChoices } from './choices.mjs';
import { remember, writeHandoff } from './memory.mjs';

const [dirArg, code] = process.argv.slice(2), dir = path.resolve(dirArg || '');
const d = readJSON(path.join(dir, 'data.json'));
if (!d || !code) { console.log('usage: node commit.mjs <storyboard> <mã SB1-...>'); process.exit(1); }
const sel = decode(code);
if (sel.slug !== d.slug) { console.log(`mã của video "${sel.slug}", không phải "${d.slug}"`); process.exit(1); }
const flags = Object.fromEntries(d.segments.map(s => { const x = sel.segs[s.id], c = s.cards.find(c => c.id === x?.card);
  if (!c) throw new Error(`mã có thẻ lạ ở đoạn ${s.id}`);
  return [s.id, (c.media || []).map((m, i) => checkMedia(x.media[`${c.id}:${i}`] || m)).filter(m => !m.ok)]; }));
const b = blockers(d, sel, flags);
if (b.length) { console.log('CHƯA CHỐT ĐƯỢC:\n- ' + b.join('\n- ')); process.exit(2); }
const choices = buildChoices(d, sel, 'mã trong chat'), r = writeChoices(dir, choices);
remember(d, choices); writeHandoff(dir);
console.log(`đã ghi ${r.file} (kiểm ${r.sha}), đọc lại khớp`);
