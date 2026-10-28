#!/usr/bin/env node
// Soát lỗi cũ trên storyboard (ảnh tĩnh + HTML, không render video):
//  - chữ quá nhỏ: chữ engine vẽ (probe của preview.mjs) + chữ trong component HTML (đo DOM ở đúng giây); ngưỡng MIN_PX
//  - chữ chồng nhau / đè lên phụ đề: hộp chữ giao nhau
//  - khung đen / mờ: độ sáng TB và độ nét (biến thiên Laplacian) trên ảnh cỡ thật
//  - phụ đề gom sai: 1 cụm vắt qua dấu câu cuối câu, hoặc quá số từ
//   node qc.mjs <storyboard>   -> <storyboard>/qc.json (+ in bảng tóm tắt)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { VA, ENGINE, readJSON, withPage } from './lib.mjs';

export const MIN_PX = 32, MIN_CAPTION_PX = 48;   // trên khung 1080x1920 (chữ 32 px ~ 1,7 % chiều cao khung)
const dir = path.resolve(process.argv[2] || ''), plan = readJSON(path.join(dir, 'plan.json')), pv = readJSON(path.join(dir, 'preview.json'));
if (!plan || !pv) { console.log('usage: node qc.mjs <storyboard> (cần plan.json + preview.json)'); process.exit(1); }
const PJ = path.join(dir, '_engine'), tl = readJSON(path.join(PJ, 'assets/timeline.json'));
const { mapper } = await import(pathToFileURL(path.join(ENGINE, 'lib/timeline.js')).href);
const m = mapper(tl);

// chữ trong component HTML "đang dùng" (overlay stage chạy theo giờ short), đo ở đúng giây của ảnh xem trước
const stageHtml = path.resolve(VA, plan.project, 'source/stage.html');
async function domTexts(times) {
  if (!fs.existsSync(stageHtml)) return {};
  return withPage(async page => {
    await page.goto(pathToFileURL(stageHtml).href); await page.evaluate(() => document.fonts.ready);
    const out = {};
    for (const [k, t] of Object.entries(times)) {
      out[k] = await page.evaluate(t => { window.setT(t); const r = [];
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n; (n = walk.nextNode());) { const s = n.textContent.trim(); if (!s) continue;
          const el = n.parentElement, cs = getComputedStyle(el); let op = 1, e = el;
          while (e) { const c = getComputedStyle(e); op *= +c.opacity; if (c.display === 'none' || c.visibility === 'hidden') op = 0; e = e.parentElement; }
          const rg = document.createRange(); rg.selectNodeContents(n); const b = rg.getBoundingClientRect();   // khung của riêng chữ, không phải cả thẻ
          if (op < .05 || !b.width) continue;
          const sc = new DOMMatrix(cs.transform === 'none' ? undefined : cs.transform).a || 1;
          r.push({ t: s.slice(0, 40), px: Math.round(parseFloat(cs.fontSize) * sc * 10) / 10, x: Math.round(b.x), y: Math.round(b.y + b.height * .8), w: Math.round(b.width), src: 'html' }); }
        return r; }, t);
    }
    return out;
  }, { width: 1080, height: 1920 });
}

// phụ đề engine: đúng cỡ phụ đề của style, nằm dưới sân khấu (y ~1010 trên giấy, ~1480 trên nền tối)
const capPx = readJSON(path.join(PJ, 'source/style.json'))?.captions?.size || 62;
const isCap = x => x.src !== 'html' && x.y > 950 && Math.abs(x.px - capPx) < 1;
const isWord = x => /[\p{L}\p{N}]/u.test(x.t);   // ký hiệu (→, •) không tính là chữ
// hộp chữ; dấu cách đầu chuỗi (vd " giờ") không phải nét chữ nên trừ ra
const box = x => { const lead = (x.t.match(/^\s*/)[0].length) * x.px * .28; return [x.x + lead, x.y - x.px * .8, x.x + x.w, x.y + x.px * .25]; };
const inter = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
function luma(f) {
  const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-vf', 'scale=540:960', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 26 }).stdout;
  let s = 0, lap = 0, n = 0; const W = 540, H = 960;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x, v = raw[i]; s += v; const l = 4 * v - raw[i - 1] - raw[i + 1] - raw[i - W] - raw[i + W]; lap += l * l; n++; }
  return { mean: +(s / n).toFixed(1), sharp: Math.round(lap / n) };
}

const cards = plan.segments.flatMap(s => s.cards.map(c => ({ s, c }))).filter(({ c }) => pv.fx[c.id]?.ok);
const dom = await domTexts(Object.fromEntries(cards.filter(({ c }) => c.source === 'đang dùng' || c.keepBase).map(({ c }) => [c.id, pv.fx[c.id].short ?? m(pv.fx[c.id].at)])));
const rows = [];
for (const { s, c } of cards) {
  const texts = [...(pv.qc?.[c.id] || []), ...(dom[c.id] || [])], board = texts.filter(x => !isCap(x)), caps = texts.filter(isCap);
  const issues = [], small = board.filter(x => isWord(x) && x.px < MIN_PX), smallCap = caps.filter(x => x.px < MIN_CAPTION_PX);
  if (small.length) issues.push(`chữ nhỏ dưới ${MIN_PX}px: ${small.map(x => `"${x.t}" ${x.px}px`).join(', ')}`);
  if (smallCap.length) issues.push(`phụ đề dưới ${MIN_CAPTION_PX}px`);
  const over = [];
  for (let i = 0; i < board.length; i++) for (let j = i + 1; j < board.length; j++) { const a = box(board[i]), b = box(board[j]), k = inter(a, b), mn = Math.min((a[2] - a[0]) * (a[3] - a[1]), (b[2] - b[0]) * (b[3] - b[1]));
    const sameLine = Math.abs(board[i].y - board[j].y) < 3, dx = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);   // cùng dòng: hộp đo theo độ rộng chuẩn của chữ, lấn <= 10 % cỡ chữ là khoảng sát bình thường
    if (board[i].t !== board[j].t && mn > 0 && (sameLine ? dx > Math.max(4, .1 * Math.min(board[i].px, board[j].px)) : k / mn > .3)) over.push(`"${board[i].t}" chồng "${board[j].t}"`); }
  for (const b of board) for (const cp of caps) if (inter(box(b), box(cp)) > 0) over.push(`"${b.t}" đè phụ đề "${cp.t}"`);
  if (over.length) issues.push('chồng nhau: ' + [...new Set(over)].slice(0, 4).join('; '));
  const L = luma(path.join(dir, pv.fx[c.id].full));
  const words = board.filter(isWord);
  rows.push({ seg: s.id, card: c.id, name: c.name, minBoardPx: words.length ? Math.min(...words.map(x => x.px)) : null, inClipOnly: !words.length && (c.source === 'đang dùng' || c.keepBase) && !!c.media, minCaptionPx: caps.length ? Math.min(...caps.map(x => x.px)) : null,
    texts: board.length, htmlMeasured: !!dom[c.id], luma: L.mean, sharp: L.sharp, issues });
}
const med = rows.map(r => r.sharp).sort((a, b) => a - b)[rows.length >> 1] || 1;
for (const r of rows) { if (r.luma < 18) r.issues.push(`khung gần đen (sáng TB ${r.luma})`); if (r.sharp < med * .25) r.issues.push(`khung có thể mờ (độ nét ${r.sharp}, trung vị ${med})`); }

// phụ đề: cụm vắt qua cuối câu, quá số từ
const capIssues = {};
for (const [pid, cap] of Object.entries(pv.captions || {})) capIssues[pid] = cap.chunks.flatMap(ch => {
  const w = ch.words.map(x => x.t), bad = [];
  if (w.length > cap.maxWords) bad.push(`quá ${cap.maxWords} từ`);
  if (w.slice(0, -1).some(x => /[.?!…]$/.test(x))) bad.push('vắt qua cuối câu');
  return bad.length ? [{ seg: ch.seg, text: w.join(' '), issues: bad }] : [];
});
const res = { at: new Date().toISOString(), MIN_PX, MIN_CAPTION_PX, cards: rows, captions: capIssues };
fs.writeFileSync(path.join(dir, 'qc.json'), JSON.stringify(res, null, 2));
for (const r of rows) console.log(`${r.issues.length ? '⚠' : '✓'} ${r.card} ${r.name}: chữ board nhỏ nhất ${r.minBoardPx ?? (r.inClipOnly ? 'không đo được (chữ nằm trong clip video)' : '-')}${r.minBoardPx ? 'px' : ''}${r.htmlMeasured ? ' (có đo HTML)' : ''}, phụ đề ${r.minCaptionPx ?? '-'}px, sáng ${r.luma}, nét ${r.sharp}${r.issues.length ? ' · ' + r.issues.join(' · ') : ''}`);
for (const [pid, l] of Object.entries(capIssues)) console.log(`phụ đề ${pid}: ${l.length ? l.map(x => `[${x.seg}] "${x.text}" ${x.issues.join(', ')}`).join(' | ') : 'không có cụm gom sai'}`);
