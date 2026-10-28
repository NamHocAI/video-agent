#!/usr/bin/env node
// Tua nhanh có đổi tốc (speed ramp) cho 1 clip B-roll, bằng ffmpeg (local, miễn phí). Engine không có tham số tốc độ
// cho broll, nên clip được dựng sẵn ở tốc độ mới rồi đưa vào spec như 1 media thường: xem trước và render dùng cùng file.
//   node speedramp.mjs <in.mp4> <out.mp4> "<từ giây>:<tốc độ>,<từ giây>:<tốc độ>..."   vd "0:0.8,1.2:2"
import { spawnSync } from 'node:child_process';

export function speedramp(src, out, ramp) {
  const dur = +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], { encoding: 'utf8' }).stdout;
  const pts = ramp.map(([t, k]) => [+t, +k]).sort((a, b) => a[0] - b[0]);
  const parts = pts.map(([t, k], i) => [t, Math.min(dur, pts[i + 1]?.[0] ?? dur), k]).filter(([a, b]) => b > a);
  const f = parts.map(([a, b, k], i) => `[0:v]trim=${a}:${b},setpts=(PTS-STARTPTS)/${k}[v${i}]`).join(';')
    + ';' + parts.map((_, i) => `[v${i}]`).join('') + `concat=n=${parts.length}:v=1:a=0,fps=30[o]`;
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-filter_complex', f, '-map', '[o]', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', out], { encoding: 'utf8' });
  if (r.status) throw new Error('ffmpeg speedramp lỗi: ' + r.stderr.slice(-300));
  const outDur = parts.reduce((s, [a, b, k]) => s + (b - a) / k, 0);
  return { in: dur, out: +outDur.toFixed(2), parts };
}

if (process.argv[1]?.endsWith('speedramp.mjs')) {
  const [src, out, spec] = process.argv.slice(2);
  console.log(JSON.stringify(speedramp(src, out, spec.split(',').map(x => x.split(':')))));
}
