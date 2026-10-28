#!/usr/bin/env node
// Server local nhỏ của wizard (chỉ 127.0.0.1). Phục vụ thư mục storyboard + lưu lựa chọn từng đoạn vào state.json.
//   node server.mjs <video-agent/edits/short-<slug>/storyboard> [--port 4747]
// Khóa theo đoạn: chỉ sửa được đoạn đang mở; duyệt lại tạo phiên bản mới (v1 -> v2) và ghi đã đổi gì.
// Bút vẽ: ghi chú gắn đoạn + giờ (state.notes). Chốt: ghi choices.json, bị chặn khi còn cờ đỏ hoặc chưa chọn đủ.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { VA, readJSON, checkMedia } from './lib.mjs';
import { selection, blockers, buildChoices, writeChoices, encode } from './choices.mjs';
import { remember, writeHandoff } from './memory.mjs';

const dir = path.resolve(process.argv[2] || '.'), pi = process.argv.indexOf('--port'), PORT = pi < 0 ? 4747 : +process.argv[pi + 1];
if (!fs.existsSync(path.join(dir, 'data.json'))) { console.log('không thấy data.json, chạy build-wizard.mjs trước'); process.exit(1); }
const SF = path.join(dir, 'state.json');
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg' };

const data = () => readJSON(path.join(dir, 'data.json'));
function state() {
  const fresh = !fs.existsSync(SF), st = readJSON(SF, { preset: null, step: 0, segments: {} }), d = data();
  // video mới cùng format + style: lấy preset đã nhớ làm mặc định (âm thanh đã nghe ở video trước)
  if (fresh && d.defaults) { Object.assign(st, { preset: d.defaults.preset, sound: d.defaults.sound, motion: d.defaults.motion, defaultsFrom: d.defaults.from }); (st.heard ??= {})[d.defaults.sound] = true; }
  // đoạn trùng template của cùng video gốc: dùng lại thẻ đã chốt, khoá sẵn, chỉ duyệt đoạn khác
  for (const s of d.segments) st.segments[s.id] ??= s.reuse
    ? { selected: s.reuse.card, locked: true, media: {}, versions: [{ v: 1, card: s.reuse.card, media: {}, at: new Date().toISOString(), change: `dùng lại từ template (${s.reuse.from})` }] }
    : { selected: s.default, locked: false, media: {}, versions: [] };
  return st;
}
// đổi preset -> vẽ lại ảnh xem trước theo style mới (chạy nền), rồi dựng lại data.json
let drawing = null;
function redraw(style) {
  if (!style || style === data().previewStyle) return;
  drawing?.kill();
  const sk = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), plan = path.join(dir, 'plan.json');
  drawing = spawn(process.execPath, [path.join(sk, 'preview.mjs'), plan, '--only', 'fx,cover', '--style', style], { cwd: path.resolve(VA, '..'), stdio: 'ignore' });
  drawing.on('exit', code => { drawing = null; if (!code) spawn(process.execPath, [path.join(sk, 'qc.mjs'), dir], { stdio: 'ignore' }).on('exit', () => spawn(process.execPath, [path.join(sk, 'build-wizard.mjs'), plan], { stdio: 'ignore' })); });
  console.log('vẽ lại ảnh xem trước theo style', style);
}
const save = st => { fs.writeFileSync(SF + '.tmp', JSON.stringify(st, null, 2)); fs.renameSync(SF + '.tmp', SF); };

// cờ đỏ: thẻ đang chọn của đoạn cần tư liệu mà tư liệu thiếu. Gỡ được khi đổi tư liệu hoặc đổi hiệu ứng
function view() {
  const d = data(), st = state();
  for (const s of d.segments) {
    const ss = st.segments[s.id];
    for (const c of s.cards) c.mediaCheck = (c.media || []).map((m, i) => checkMedia(ss.media[`${c.id}:${i}`] || m));
    const sel = s.cards.find(c => c.id === ss.selected);
    s.flag = sel ? sel.mediaCheck.filter(m => !m.ok) : [];
  }
  const sel = selection(d, st);
  return { data: d, state: st, drawing: !!drawing, commit: { blockers: blockers(d, sel, Object.fromEntries(d.segments.map(s => [s.id, s.flag]))), code: encode(sel) } };
}

function act(a) {
  const st = state(), d = data(), seg = a.seg && d.segments.find(s => s.id === a.seg), ss = seg && st.segments[seg.id];
  const name = id => seg.cards.find(c => c.id === id)?.name || id;
  // mọi thay đổi lựa chọn sau lần chốt: đánh dấu bản chốt đã cũ (phải chốt lại mới được dựng)
  if (st.committedAt && !['step', 'heard', 'commit'].includes(a.type)) st.changedAfterCommit = true;
  if (a.type === 'step') st.step = a.step;
  else if (a.type === 'note') {
    const s2 = d.segments.find(s => s.id === a.seg), t = +a.t, text = String(a.text || '').trim().slice(0, 200);
    const pts = Array.isArray(a.path) ? a.path.filter(q => Array.isArray(q) && q.length === 2 && q.every(Number.isFinite)).map(([x, y]) => [Math.round(x), Math.round(y)]) : [];
    if (!s2) throw new Error('ghi chú phải gắn 1 đoạn');
    if (!(t >= s2.from - .01 && t <= s2.to + .01)) throw new Error(`giờ ghi chú phải nằm trong đoạn (${s2.from}-${s2.to} s)`);
    if (!text) throw new Error('ghi chú trống');
    if (pts.length < 2) throw new Error('chưa khoanh vùng');
    (st.notes ??= []).push({ id: Date.now().toString(36), seg: s2.id, t: Math.round(t * 100) / 100, text, path: pts, at: new Date().toISOString() });
  }
  else if (a.type === 'delnote') st.notes = (st.notes || []).filter(n => n.id !== a.id);
  else if (a.type === 'commit') {
    const v = (save(st), view());
    if (v.commit.blockers.length) throw new Error('Chưa chốt được: ' + v.commit.blockers.join('; '));
    const choices = buildChoices(d, selection(d, st), 'nút Chốt'), r = writeChoices(dir, choices);
    remember(d, choices);
    Object.assign(st, { committedAt: new Date().toISOString(), committedSha: r.sha, changedAfterCommit: false });
    // dự phòng: dựng thành phẩm ngay, tiến trình tách rời (sống tiếp khi Claude/phiên dừng) -> <storyboard>/thanh-pham.mp4
    const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
    const job = spawn(process.execPath, [path.join(here, 'auto-final.mjs'), dir], { cwd: VA, detached: true, stdio: 'ignore', windowsHide: true });
    job.unref();
  }
  else if (a.type === 'preset') { st.preset = a.id; redraw(d.presets.find(p => p.id === a.id)?.style); }
  else if (a.type === 'heard') (st.heard ??= {})[a.id] = true;
  else if (a.type === 'sound') { if (!st.heard?.[a.id]) throw new Error('Nghe thử mẫu này trước rồi mới chọn'); st.sound = a.id; }
  else if (a.type === 'motion') st.motion = a.id;
  else if (a.type === 'cover') st.cover = a.id;
  else if (!seg) throw new Error('không thấy đoạn ' + a.seg);
  else if (a.type === 'edit') ss.locked = false;
  else if (ss.locked) throw new Error(`đoạn ${seg.id} đang khóa, bấm "Sửa đoạn này" trước`);
  else if (a.type === 'select') { if (!seg.cards.some(c => c.id === a.card)) throw new Error('thẻ lạ'); ss.selected = a.card; }
  else if (a.type === 'media') ss.media[`${a.card}:${a.i}`] = String(a.path || '').trim();
  else if (a.type === 'approve') {
    const last = ss.versions.at(-1), media = Object.fromEntries(Object.entries(ss.media).filter(([k]) => k.startsWith(ss.selected + ':')));
    const changes = !last ? ['chốt lần đầu: ' + name(ss.selected)] : [
      ...(last.card !== ss.selected ? [`đổi hiệu ứng: ${name(last.card)} → ${name(ss.selected)}`] : []),
      ...Object.entries(media).filter(([k, v]) => last.media?.[k] !== v).map(([, v]) => `đổi tư liệu → ${v}`)];
    if (ss.pendingFix) { changes.unshift(ss.pendingFix); delete ss.pendingFix; }   // sửa theo ghi chú bút vẽ (fix-note.mjs)
    if (last && !changes.length) changes.push('duyệt lại, không đổi gì');
    if (!last || changes[0] !== 'duyệt lại, không đổi gì') ss.versions.push({ v: ss.versions.length + 1, card: ss.selected, media, at: new Date().toISOString(), change: changes.join('; ') });
    ss.locked = true;
  } else throw new Error('lệnh lạ ' + a.type);
  save(st);
  try { writeHandoff(dir); } catch (e) { console.log('handoff:', e.message); }
}

http.createServer((req, res) => {
  const send = (code, body, type = TYPES['.json']) => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/api/view') return send(200, JSON.stringify(view()));
    if (u.pathname === '/api/font') {   // chỉ file font, để thẻ mẫu chữ dùng đúng font của style
      const f = path.resolve(VA, u.searchParams.get('f') || '');
      if (!/\.(ttf|otf|woff2?)$/i.test(f) || !fs.existsSync(f)) return send(404, '', 'text/plain');
      return send(200, fs.readFileSync(f), 'font/' + path.extname(f).slice(1).toLowerCase());
    }
    if (u.pathname === '/api/act' && req.method === 'POST') {
      let b = ''; req.on('data', c => b += c);
      req.on('end', () => { try { act(JSON.parse(b)); send(200, JSON.stringify(view())); } catch (e) { send(400, JSON.stringify({ error: e.message })); } });
      return;
    }
    const f = path.resolve(dir, '.' + decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
    if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return send(404, 'không thấy', 'text/plain; charset=utf-8');
    send(200, fs.readFileSync(f), TYPES[path.extname(f)] || 'application/octet-stream');
  } catch (e) { send(500, JSON.stringify({ error: e.message })); }
}).listen(PORT, '127.0.0.1', () => console.log(`wizard: http://127.0.0.1:${PORT}/  (thư mục ${dir}, Ctrl+C để tắt)`));
