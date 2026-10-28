#!/usr/bin/env node
// Dự phòng sau nút Chốt: tự dựng THÀNH PHẨM (mp4 có tiếng) từ choices.json, chạy độc lập với Claude.
// Hết token giữa chừng vẫn có sản phẩm. server.mjs gọi nó (tách tiến trình) ngay khi bấm Chốt; chạy tay cũng được:
//   node auto-final.mjs <storyboard>          (từ thư mục video-agent)
// Các bước: render-seg --from-choices --dry (spec theo thẻ + style/biến thể đã chốt, cùng cách với ảnh xem trước)
//   -> thêm âm thanh + chuyển động đã chốt -> short.mjs all (render + audio + final) -> chép ra thanh-pham.mp4.
// Trạng thái: <storyboard>/thanh-pham.json (đang dựng / xong / lỗi), log: <storyboard>/thanh-pham.log
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const dir = path.resolve(process.argv[2] || '.'), PJ = path.join(dir, '_engine');
const sk = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const SHORT = path.join(process.env.USERPROFILE || process.env.HOME, '.claude/skills/short-editing/engine/short.mjs');
const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const ST = path.join(dir, 'thanh-pham.json'), LOG = path.join(dir, 'thanh-pham.log');
const status = o => fs.writeFileSync(ST, JSON.stringify({ ...readJSON(ST), ...o, at: new Date().toISOString() }, null, 2));
const log = s => fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${s}\n`);
const run = (args, cwd) => { log('$ node ' + args.join(' ')); const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8' }); log((r.stdout || '') + (r.stderr || '')); return r; };
const fail = (step, r) => { status({ status: 'lỗi', step, error: ((r?.stderr || r?.stdout || '') + '').slice(-400) }); log('LỖI ở ' + step); process.exit(1); };

const ch = readJSON(path.join(dir, 'choices.json'));
if (!ch) { console.log('chưa có choices.json (chưa chốt)'); process.exit(1); }
status({ status: 'đang dựng', step: 'spec', committedAt: ch.committedAt, file: null, error: null });

// 1. spec theo thẻ đã chốt + style/biến thể (render-seg --dry ghi _engine/source/spec.js, không render)
const VA = path.resolve(dir, '../../..');
let r = run([path.join(sk, 'render-seg.mjs'), dir, '--from-choices', '--dry'], VA);
if (r.status) fail('spec', r);

// 2. âm thanh + chuyển động đã chốt (render-seg chỉ ghép thẻ hình)
const extra = { ...(ch.motion?.spec || {}) };
for (const k of ['music', 'mix', 'sfx']) if (ch.sound?.[k]) extra[k] = ch.sound[k];
const specFile = path.join(PJ, 'source/spec.js');
fs.appendFileSync(specFile, `\n// auto-final: âm thanh + chuyển động đã chốt\nObject.assign(window.SPEC, ${JSON.stringify(extra)});\n`);

// 3. dựng cả video có tiếng (render + audio + final). pace đổi thì phải prepare lại timeline
status({ status: 'đang dựng', step: 'render' });
if (extra.pace) { r = run([SHORT, 'prepare', PJ], VA); if (r.status) fail('prepare', r); }
r = run([SHORT, 'all', PJ], VA);
if (r.status) fail('render', r);
const out = fs.readdirSync(path.join(PJ, 'output')).filter(f => f.endsWith('.mp4') && !f.startsWith('seg-'))
  .map(f => path.join(PJ, 'output', f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
if (!out) fail('render', { stderr: 'không thấy mp4 trong _engine/output' });

// 4. chép thành phẩm ra chỗ dễ thấy: <storyboard>/thanh-pham.mp4 và output/ của project gốc
const dst = path.join(dir, 'thanh-pham.mp4');
fs.copyFileSync(out, dst);
const proj = ch.project && path.resolve(VA, ch.project);
let projOut = null;
if (proj && fs.existsSync(proj)) { fs.mkdirSync(path.join(proj, 'output'), { recursive: true }); projOut = path.join(proj, 'output', `${path.basename(proj)}.mp4`); fs.copyFileSync(out, projOut); }
const qc = (r.stdout || '').split('\n').filter(l => /h264|LUFS|dBTP/.test(l)).slice(-2).join(' | ');
status({ status: 'xong', step: 'final', file: path.relative(VA, dst), projectFile: projOut && path.relative(VA, projOut), qc });
log('XONG -> ' + dst);
console.log('thành phẩm: ' + dst);
