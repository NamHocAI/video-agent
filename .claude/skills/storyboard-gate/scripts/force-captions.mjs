#!/usr/bin/env node
// Ép phụ đề theo kịch bản người dùng viết (khi họ yêu cầu), giữ timing của ASR: so 2 dãy từ (LCS), chỗ khác nhau thành
// cặp captions.replace của engine [chuỗi ASR, chữ kịch bản]. Không chạy lại transcript.
//   node force-captions.mjs <storyboard> <kịch bản.md|.txt> [--dry]   -> plan.json captionsReplace + in bảng đổi
import fs from 'node:fs';
import path from 'node:path';
import { readJSON } from './lib.mjs';

const [dirArg, scriptFile] = process.argv.slice(2), dir = path.resolve(dirArg || ''), planF = path.join(dir, 'plan.json'), plan = readJSON(planF);
if (!plan || !scriptFile || !fs.existsSync(scriptFile)) { console.log('usage: node force-captions.mjs <storyboard> <kịch bản> [--dry]'); process.exit(1); }
const tl = readJSON(path.join(dir, '_engine/assets/timeline.json'));
const asr = tl.words.map(w => w.text);
const script = fs.readFileSync(scriptFile, 'utf8').replace(/^#.*$/gm, '').split(/\s+/).filter(Boolean);
const key = w => w.normalize('NFC').replace(/^[“"'(]+|[.,!?;:…”"')]+$/g, '');   // so khớp bỏ dấu câu, GIỮ hoa/thường

// LCS trên khoá
const n = asr.length, mm = script.length, L = Array.from({ length: n + 1 }, () => new Int16Array(mm + 1));
for (let i = n - 1; i >= 0; i--) for (let j = mm - 1; j >= 0; j--) L[i][j] = key(asr[i]) === key(script[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
const pairs = [], notes = [];
let i = 0, j = 0;
while (i < n || j < mm) {
  if (i < n && j < mm && key(asr[i]) === key(script[j])) { i++; j++; continue; }
  const i0 = i, j0 = j;
  while ((i < n || j < mm) && !(i < n && j < mm && key(asr[i]) === key(script[j]))) { if (j >= mm || (i < n && L[i + 1][j] >= L[i][j + 1])) i++; else j++; }
  const a = asr.slice(i0, i), b = script.slice(j0, j);
  if (a.length && b.length) pairs.push([a.join(' '), b.join(' ').replace(/[.,!?;:…]+$/, '')]);
  else if (b.length && i0 > 0) pairs.push([asr[i0 - 1], key(asr[i0 - 1]) + ' ' + b.join(' ').replace(/[.,!?;:…]+$/, '')]);   // chữ kịch bản không được nói: gắn vào từ trước
  else if (a.length) notes.push(`ASR có "${a.join(' ')}" mà kịch bản không có (giữ nguyên, vì người nói có nói)`);
}
console.log(pairs.length ? pairs.map(([a, b]) => `  "${a}" -> "${b}"`).join('\n') : '  phụ đề đã khớp kịch bản');
for (const x of notes) console.log('  lưu ý: ' + x);
if (!process.argv.includes('--dry')) { plan.captionsReplace = pairs; plan.captionsScript = path.basename(scriptFile); fs.writeFileSync(planF, JSON.stringify(plan, null, 2)); console.log(`đã ghi ${pairs.length} cặp vào plan.json (captionsReplace)`); }
