#!/usr/bin/env node
// Ảnh động (GIF) cho từng thẻ "đang dùng": dựng đoạn ở nửa độ phân giải trên footage thật (engine render, cùng spec
// với ảnh xem trước), rồi đổi sang GIF lặp 10 hình/giây, rộng 270 px. Ghi fx/gif/<thẻ>.gif và thêm `gif` vào preview.json.
//   node gif.mjs <storyboard>/plan.json [--max 12]      (từ thư mục video-agent; chạy sau preview.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const planFile = path.resolve(process.argv[2]), dir = path.dirname(planFile), PJ = path.join(dir, '_engine');
const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const plan = readJSON(planFile), pv = readJSON(path.join(dir, 'preview.json'));
if (!plan || !pv) { console.log('cần plan.json và preview.json (chạy preview.mjs trước)'); process.exit(1); }
const mi = process.argv.indexOf('--max'), MAX = mi < 0 ? 12 : +process.argv[mi + 1];   // giây GIF tối đa mỗi đoạn
const ENGINE = path.join(process.env.USERPROFILE || process.env.HOME, '.claude/skills/short-editing/engine'), SHORT = path.join(ENGINE, 'short.mjs');
const { mapper } = await import(pathToFileURL(path.join(ENGINE, 'lib/timeline.js')).href);
const m = mapper(readJSON(path.join(PJ, 'assets/timeline.json')));
const out = path.join(dir, 'fx/gif'); fs.mkdirSync(out, { recursive: true });
const g = x => Math.round(x * 30) / 30;

for (const s of plan.segments) {
  const c = s.cards.find(x => x.source === 'đang dùng') || s.cards[0];
  if (!pv.fx?.[c.id]?.ok) continue;
  const a = g(m(s.from)), b = g(Math.min(m(s.to), m(s.from) + MAX)), mp4 = path.join(out, `${c.id}.mp4`), gif = path.join(out, `${c.id}.gif`);
  const r = spawnSync(process.execPath, [SHORT, 'render', PJ, '--from', a.toFixed(3), '--to', b.toFixed(3), '--scale', '.5', '--out', mp4], { encoding: 'utf8' });
  if (r.status || !fs.existsSync(mp4)) { console.log(`[gif] ${c.id} lỗi render`); continue; }
  const f = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-vf', 'fps=10,scale=270:-2:flags=lanczos,split[x][y];[x]palettegen=max_colors=128[p];[y][p]paletteuse=dither=bayer:bayer_scale=4', '-loop', '0', gif]);
  fs.rmSync(mp4, { force: true });
  if (f.status) { console.log(`[gif] ${c.id} lỗi ffmpeg`); continue; }
  pv.fx[c.id].gif = `fx/gif/${c.id}.gif`;
  console.log(`[gif] ${c.id} ${(b - a).toFixed(1)}s ${(fs.statSync(gif).size / 1e6).toFixed(1)} MB`);
}
fs.writeFileSync(path.join(dir, 'preview.json'), JSON.stringify(pv, null, 2));
