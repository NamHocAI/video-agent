#!/usr/bin/env node
// Bước Bắt đầu của cổng storyboard: đo take thật (mặt người, quay màn hình, giọng, nhịp, đoạn demo),
// kiểm tra 4 đầu vào bắt buộc, đề xuất 1 format chính + 1 dự phòng theo formats/ROUTER.md.
// Chỉ đọc take, không render, không sửa gì của engine. Mặt người: BlazeFace của engine (đọc model, không tải mới).
//   node start.mjs <take> [--slug x] [--script file.md] [--style name] [--broll dir] [--fps 2]
// Ghi: video-agent/storyboards/<slug>/start.json + start.md
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ENGINE = path.join(os.homedir(), '.claude/skills/short-editing/engine');
const FACE_MODEL = path.join(os.homedir(), '.claude/skills/short-editing/.runtime/models/blaze_face_short_range.tflite');
const VA = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '../../../../video-agent');

const argv = process.argv.slice(2), opt = k => { const i = argv.indexOf('--' + k); return i < 0 ? null : argv[i + 1]; };
const take = argv[0] && path.resolve(argv[0]);
if (!take || !fs.existsSync(take)) { console.log('usage: node start.mjs <take> [--slug x] [--script f] [--style n] [--broll dir]'); process.exit(1); }
const slug = opt('slug') || path.basename(take, path.extname(take)).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const FPS = +(opt('fps') || 2);
const out = path.join(VA, 'storyboards', slug);
fs.mkdirSync(out, { recursive: true });

const run = (cmd, args) => spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
const r1 = x => Math.round(x * 10) / 10, pct = x => Math.round(x * 100);

// ---- 1. ffprobe: độ dài, khung, tiếng
const probe = JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', take]).stdout);
const vs = probe.streams.find(s => s.codec_type === 'video'), hasAudio = probe.streams.some(s => s.codec_type === 'audio');
const dur = +probe.format.duration, W = vs.width, H = vs.height;
const orient = H > W * 1.1 ? 'dọc' : W > H * 1.1 ? 'ngang' : 'vuông';

// ---- 2. giọng: silencedetect (-35 dB, 0.3 s) -> các đoạn có tiếng
let voiced = [];
if (hasAudio) {
  const e = run('ffmpeg', ['-hide_banner', '-nostats', '-i', take, '-vn', '-af', 'silencedetect=n=-35dB:d=0.3', '-f', 'null', '-']).stderr;
  const st = [...e.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]), en = [...e.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  let t = 0;
  st.forEach((s, i) => { if (s - t > 0.15) voiced.push([t, s]); t = en[i] ?? dur; });
  if (dur - t > 0.15) voiced.push([t, dur]);
}
const voicedSec = voiced.reduce((a, [s, e]) => a + e - s, 0);
// lời nói có ngắt nghỉ; tiếng liền 1 mạch không nghỉ thường là nhạc/hiệu ứng. Chắc chắn chỉ khi có transcript
const pauses = Math.max(0, voiced.length - 1), speechLike = hasAudio && pauses >= Math.max(1, voicedSec / 8);
const loud = hasAudio ? +(run('ffmpeg', ['-hide_banner', '-nostats', '-i', take, '-vn', '-af', 'volumedetect', '-f', 'null', '-']).stderr.match(/mean_volume: ([-\d.]+)/)?.[1] ?? -99) : -99;

// transcript có sẵn (không chạy lại): edits/*/source.mp4 trùng cỡ file với take -> words-scribe.json / words.json
let words = null;
const size = fs.statSync(take).size;
for (const d of fs.existsSync(path.join(VA, 'edits')) ? fs.readdirSync(path.join(VA, 'edits')) : []) {
  const a = path.join(VA, 'edits', d, 'assets');
  if (fs.existsSync(path.join(a, 'source.mp4')) && fs.statSync(path.join(a, 'source.mp4')).size === size)
    for (const f of ['words.json', 'words-scribe.json']) if (fs.existsSync(path.join(a, f))) { words = { from: path.join('edits', d, 'assets', f), data: JSON.parse(fs.readFileSync(path.join(a, f), 'utf8')) }; break; }
  if (words) break;
}
const wordCount = words ? (Array.isArray(words.data) ? words.data : words.data.words || []).filter(w => (w.type ?? 'word') === 'word').length : null;

// ---- 3. nhịp hình: số cắt cảnh (scene > 0.3)
const sc = run('ffmpeg', ['-hide_banner', '-nostats', '-i', take, '-an', '-vf', "select='gt(scene,0.3)',showinfo", '-f', 'null', '-']).stderr;
const cuts = [...sc.matchAll(/pts_time:([\d.]+)/g)].map(m => +m[1]);

// ---- 4. khung hình mẫu: mặt người (BlazeFace) + dấu hiệu quay màn hình (mảng phẳng, cạnh sắc)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sbg-'));
run('ffmpeg', ['-y', '-loglevel', 'error', '-i', take, '-vf', `fps=${FPS},scale=640:-2`, '-q:v', '4', path.join(tmp, '%05d.jpg')]);
const frames = fs.readdirSync(tmp).filter(f => f.endsWith('.jpg')).sort();
const req = createRequire(path.join(ENGINE, 'package.json'));
const { chromium } = req('playwright-core');
const MP = path.dirname(req.resolve('@mediapipe/tasks-vision'));
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(fs.existsSync);
const PAGE = `<!doctype html><script type="module">import * as V from '/mp/vision_bundle.mjs'; window.V = V; window.READY = true;</script>`;
const TYPES = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.wasm': 'application/wasm', '.jpg': 'image/jpeg' };
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--disable-extensions', '--mute-audio'] });
let per;
try {
  const page = await browser.newPage();
  await page.route('http://sbg.local/**', route => {
    const u = new URL(route.request().url()), f = u.searchParams.get('f');
    if (u.pathname === '/') return route.fulfill({ body: PAGE, contentType: 'text/html' });
    const file = u.pathname === '/file' ? f : u.pathname.startsWith('/mp/') ? path.join(MP, decodeURIComponent(u.pathname.slice(4))) : null;
    if (!file || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ body: fs.readFileSync(file), contentType: TYPES[path.extname(file)] || 'application/octet-stream' });
  });
  const url = f => 'http://sbg.local/file?f=' + encodeURIComponent(f);
  await page.goto('http://sbg.local/');
  await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  await page.evaluate(async m => {
    const fs_ = await V.FilesetResolver.forVisionTasks('/mp/wasm');
    window.det = await V.FaceDetector.createFromOptions(fs_, { baseOptions: { modelAssetPath: m, delegate: 'CPU' }, runningMode: 'IMAGE', minDetectionConfidence: .5 });
  }, url(FACE_MODEL));
  per = [];
  for (const f of frames) per.push(await page.evaluate(async u => {
    const img = await createImageBitmap(await (await fetch(u)).blob()), w = img.width, h = img.height;
    const faces = det.detect(img).detections.filter(f => f.categories[0].score >= .8), big = faces.sort((a, b) => b.boundingBox.width - a.boundingBox.width)[0];
    const c = new OffscreenCanvas(w, h), x = c.getContext('2d'); x.drawImage(img, 0, 0); img.close();
    const d = x.getImageData(0, 0, w, h).data;
    // phẳng = |gradient| < 2 trên cả 2 hướng; sắc = > 60. Màn hình máy tính: nhiều phẳng + có cạnh sắc, ít nhiễu cảm biến
    let flat = 0, sharp = 0, n = 0, sat = 0, hist = new Set();
    for (let y = 1; y < h - 1; y += 2) for (let xx = 1; xx < w - 1; xx += 2) {
      const i = (y * w + xx) * 4, l = d[i] + d[i + 1] + d[i + 2];
      const gx = Math.abs(l - (d[i + 4] + d[i + 5] + d[i + 6])) / 3, gy = Math.abs(l - (d[i + 4 * w] + d[i + 4 * w + 1] + d[i + 4 * w + 2])) / 3;
      if (gx < 2 && gy < 2) flat++; if (gx > 60 || gy > 60) sharp++; n++;
      const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]); sat += mx ? (mx - mn) / mx : 0;
      hist.add((d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | d[i + 2] >> 4);
    }
    // da người: tâm khung mặt phải có màu da (R > G > B, R-B đủ lớn); mặt hoạt hình trắng/xám bị loại
    let skin = false;
    if (big) {
      const b = big.boundingBox, cx = Math.round(b.originX + b.width / 2), cy = Math.round(b.originY + b.height * .6);
      const k = (Math.min(h - 1, Math.max(0, cy)) * w + Math.min(w - 1, Math.max(0, cx))) * 4, R = d[k], G = d[k + 1], B = d[k + 2];
      skin = R > 60 && R > G && G > B && R - B > 15;
    }
    return { face: big && skin ? Math.round(big.boundingBox.height / h * 100) : 0, rawFace: !!big, faces: faces.length, flat: flat / n, sharp: sharp / n, sat: sat / n, colors: hist.size };
  }, url(path.join(tmp, f))));
} finally { await browser.close(); fs.rmSync(tmp, { recursive: true, force: true }); }

// màn hình máy tính: nhiều mảng phẳng, màu nhạt (UI trắng/xám/đen). Hoạt hình/đồ hoạ: phẳng nhưng màu đậm
per.forEach(p => { p.screen = !p.face && p.flat > 0.45 && p.sat < 0.18; p.anim = !p.face && !p.screen && p.flat > 0.35 && p.sat >= 0.18; });
if (argv.includes('--debug')) per.forEach((p, i) => console.log(i / FPS, JSON.stringify(p)));
const animFrac = per.filter(p => p.anim).length / per.length;
const faceFrac = per.filter(p => p.face).length / per.length, screenFrac = per.filter(p => p.screen).length / per.length;
const faceSize = per.filter(p => p.face).map(p => p.face).sort((a, b) => a - b)[Math.floor(per.filter(p => p.face).length / 2)] || 0;

// đoạn demo = các dải liền nhau >= 1.5 s không có mặt người (màn hình, B-roll, hoạt hình...)
const runs = [];
per.forEach((p, i) => {
  const kind = p.face ? 'mặt' : p.screen ? 'màn hình' : p.anim ? 'hoạt hình/đồ hoạ' : 'cảnh quay không mặt';
  const t = i / FPS, last = runs.at(-1);
  if (last && last.kind === kind) last.end = t + 1 / FPS; else runs.push({ kind, start: t, end: t + 1 / FPS });
});
const demos = runs.filter(r => r.kind !== 'mặt' && r.end - r.start >= 1.5).map(r => ({ ...r, start: r1(r.start), end: r1(Math.min(r.end, dur)) }));

// ---- 5. đầu vào bắt buộc
const scriptFile = opt('script') || ['scripts', 'inputs'].flatMap(d => fs.existsSync(path.join(VA, d)) ? fs.readdirSync(path.join(VA, d)).filter(f => f.endsWith('.md') && f.includes(slug)).map(f => path.join(VA, d, f)) : [])[0] || null;
const styleName = opt('style') || JSON.parse(fs.readFileSync(path.join(VA, 'style.json'), 'utf8')).default;
const styleDir = path.join(VA, 'styles', styleName);
const styleRef = fs.existsSync(path.join(styleDir, 'stills')) || fs.existsSync(path.join(styleDir, 'STYLE.md'));
const brollDir = opt('broll') || path.join(VA, 'broll');
const brollN = fs.existsSync(brollDir) ? fs.readdirSync(brollDir, { recursive: true }).filter(f => /\.(mp4|mov|mkv|webm|jpg|png)$/i.test(f)).length : 0;
const inputs = [
  { name: 'Video thô', ok: true, note: path.relative(VA, take) },
  // kịch bản và B-roll KHÔNG bắt buộc: có thì dùng làm chuẩn; không có thì dựng từ lời nói trong take, giọng, B-roll có sẵn
  { name: 'Kịch bản', optional: true, ok: !!scriptFile, note: scriptFile ? path.relative(VA, scriptFile) : 'không có (tùy chọn): dựng theo lời nói trong take, giọng và B-roll có sẵn; bạn rà tên riêng/số ở Bước 5' },
  { name: 'Video mẫu / màu / font thương hiệu', ok: fs.existsSync(styleDir) && styleRef, note: fs.existsSync(styleDir) ? `style ${styleName}${styleRef ? '' : ' (thiếu STYLE.md / stills mẫu)'}` : `không thấy styles/${styleName}` },
  { name: 'B-roll', optional: true, ok: brollN > 0, note: brollN ? `${brollN} file trong ${path.relative(VA, brollDir) || brollDir}` : 'chưa có (tùy chọn): dùng bảng/hiệu ứng của engine; thẻ nào cần B-roll mới bị cờ đỏ ở Bước 2' },
];

// ---- 6. đề xuất format (luật ở formats/ROUTER.md)
const formats = fs.readdirSync(path.join(VA, 'formats'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const ev = {
  face: `có mặt người ${pct(faceFrac)} % thời lượng${faceFrac ? `, mặt cao ~${faceSize} % khung` : ''}`,
  screen: `quay màn hình ${pct(screenFrac)} %`,
  voice: !hasAudio ? 'không có track tiếng' : wordCount ? `có giọng nói (transcript ${wordCount} từ)` : speechLike ? `có tiếng ${pct(voicedSec / dur)} %, ngắt nghỉ ${pauses} lần, giống lời nói` : `có tiếng ${pct(voicedSec / dur)} % nhưng liền 1 mạch, ${pauses} chỗ nghỉ: nhiều khả năng nhạc/hiệu ứng, chưa thấy giọng nói rõ`,
  anim: `hoạt hình/đồ hoạ ${pct(animFrac)} %`,
  orient: `${W}x${H} ${orient}, ${r1(dur)} s`,
};
const cand = [];
const add = (format, score, why) => cand.push({ format, ready: formats.includes(format), score, why });
add('talking-head', faceFrac * 2 + (orient === 'dọc' ? .5 : 0) + (voicedSec / dur > .5 ? .5 : 0) - screenFrac,
  [ev.face, ev.voice, ev.orient]);
add('screen-demo', screenFrac * 2 + (1 - faceFrac) * .5 + (voicedSec / dur > .3 ? .3 : 0),
  [ev.screen, ev.face, ev.voice]);
add('animation-story', animFrac * 2 - screenFrac + (speechLike ? 0 : .2),
  [ev.anim, ev.face, ev.voice]);
add('faceless-broll', (1 - faceFrac) * 1.5 - screenFrac - animFrac + (voicedSec / dur > .3 ? .3 : 0) + (cuts.length / dur * 60 > 6 ? .3 : 0),
  [ev.face, `${cuts.length} cắt cảnh sẵn trong take (${r1(cuts.length / dur * 60)}/phút)`, ev.voice]);
cand.sort((a, b) => b.score - a.score);
const [main, backup] = cand;

const res = {
  take: path.relative(VA, take), slug, dur: r1(dur), size: [W, H], orient, fps_sample: FPS,
  face: { share: pct(faceFrac), medianHeightPct: faceSize },
  screen: { share: pct(screenFrac) },
  anim: { share: pct(animFrac) },
  voice: { hasAudio, speechLike: !!(wordCount || speechLike), pauses, share: hasAudio ? pct(voicedSec / dur) : 0, segments: voiced.map(([s, e]) => [r1(s), r1(e)]), meanDb: loud },
  pace: { cuts: cuts.map(r1), cutsPerMin: r1(cuts.length / dur * 60), wordsPerSec: wordCount ? r1(wordCount / voicedSec) : null, transcript: words?.from || null },
  demos, inputs, missing: inputs.filter(i => !i.ok && !i.optional).map(i => i.name),
  proposal: { main, backup },
};
fs.writeFileSync(path.join(out, 'start.json'), JSON.stringify(res, null, 2));

const fmt = c => `**${c.format}**${c.ready ? '' : ' (chưa có profile trong formats/, sẽ phải tạo)'}: ${c.why.join('; ')}`;
const md = `# Bắt đầu: ${res.take}

| Đo | Kết quả |
|---|---|
| Khung, độ dài | ${ev.orient} |
| Có mặt người | ${res.face.share} %${faceSize ? ` (mặt cao ~${faceSize} % khung)` : ''} |
| Quay màn hình | ${res.screen.share} % |
| Hoạt hình / đồ hoạ | ${res.anim.share} % |
| Giọng nói | ${ev.voice}${hasAudio ? `, mức TB ${loud} dB` : ''} |
| Nhịp | ${cuts.length} cắt cảnh sẵn (${res.pace.cutsPerMin}/phút)${res.pace.wordsPerSec ? `, ${res.pace.wordsPerSec} từ/s (transcript có sẵn)` : ', chưa có transcript (không chạy lại ở bước này)'} |
| Đoạn không có mặt người | ${demos.length ? demos.map(d => `${d.start}-${d.end} s (${d.kind})`).join(', ') : 'không có'} |

## Đầu vào (❌ bắt buộc còn thiếu · ➖ tùy chọn chưa có)
${inputs.map(i => `- ${i.ok ? '✅' : i.optional ? '➖' : '❌'} ${i.name}: ${i.note}`).join('\n')}
${res.missing.length ? `\n**Thiếu ${res.missing.length}: ${res.missing.join(', ')}. Chưa làm storyboard cho tới khi đủ (hoặc bạn nói rõ bỏ qua).**` : '\nĐủ đầu vào.'}

## Đề xuất format
1. Chính: ${fmt(main)}
2. Dự phòng: ${fmt(backup)}

Xác nhận hoặc đổi format ngay ở đây.
`;
fs.writeFileSync(path.join(out, 'start.md'), md);
console.log(md);
console.log(`(đã ghi ${path.relative(VA, out)}/start.json + start.md)`);
