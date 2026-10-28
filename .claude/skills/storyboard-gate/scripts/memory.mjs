// Nhớ lựa chọn qua các video và qua reset phiên:
//  - preset theo format + style: video-agent/presets/<format>__<style>.json (màu/font, âm thanh, chuyển động)
//  - template theo video gốc: video-agent/storyboards/templates/<khoá take>.json (thẻ đã chốt của từng đoạn, theo giờ source)
//    -> short khác cắt từ cùng video: đoạn trùng giờ + trùng lời được dùng lại, chỉ duyệt đoạn khác
//  - HANDOFF.md trong thư mục storyboard: phiên Claude mới đọc là làm tiếp, không hỏi lại
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { VA, readJSON } from './lib.mjs';

export const presetFile = (format, style) => path.join(VA, 'presets', `${format}__${style}.json`);
export function takeKey(take) {
  const f = path.resolve(VA, take), fd = fs.openSync(f, 'r'), b = Buffer.alloc(1 << 20), n = fs.readSync(fd, b, 0, b.length, 0); fs.closeSync(fd);
  return crypto.createHash('sha1').update(String(fs.statSync(f).size)).update(b.subarray(0, n)).digest('hex').slice(0, 12);
}
export const templateFile = take => path.join(VA, 'storyboards/templates', takeKey(take) + '.json');

// sau khi chốt: lưu preset + template (choices = nội dung choices.json)
export function remember(d, choices) {
  const pf = presetFile(d.format, d.style); fs.mkdirSync(path.dirname(pf), { recursive: true });
  fs.writeFileSync(pf, JSON.stringify({ format: d.format, style: d.style, preset: choices.preset?.id, sound: choices.sound?.id, motion: choices.motion?.id,
    savedFrom: d.slug, savedAt: choices.committedAt }, null, 2));
  const tf = templateFile(d.take); fs.mkdirSync(path.dirname(tf), { recursive: true });
  const old = readJSON(tf, { segments: [] }), segs = choices.segments.map(x => ({ from: x.from, to: x.to, text: x.text, from_slug: d.slug, version: x.version,
    card: d.segments.find(s => s.id === x.id).cards.find(c => c.id === x.effect.id) }));
  const keep = old.segments.filter(o => !segs.some(s => Math.abs(s.from - o.from) < .3 && Math.abs(s.to - o.to) < .3));
  fs.writeFileSync(tf, JSON.stringify({ take: d.take, key: takeKey(d.take), updatedFrom: d.slug, updatedAt: choices.committedAt, segments: [...keep, ...segs] }, null, 2));
  return { preset: path.relative(VA, pf), template: path.relative(VA, tf) };
}

// lúc dựng wizard: gắn preset mặc định + đoạn dùng lại từ template (cùng giờ source ±0,3 s và cùng lời)
export function recall(plan) {
  const preset = readJSON(presetFile(plan.format, plan.style));
  const tpl = fs.existsSync(path.resolve(VA, plan.take)) ? readJSON(templateFile(plan.take)) : null;
  const norm = t => String(t || '').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
  for (const s of plan.segments) {
    const hit = tpl?.segments.find(o => Math.abs(o.from - s.from) < .3 && Math.abs(o.to - s.to) < .3 && (!s.text || norm(o.text) === norm(s.text)));
    if (!hit?.card) { delete s.reuse; continue; }
    if (!s.cards.some(c => c.id === hit.card.id)) s.cards.push({ ...hit.card, reused: true });
    s.reuse = { card: hit.card.id, from: hit.from_slug, version: hit.version };
  }
  return preset ? { preset: preset.preset, sound: preset.sound, motion: preset.motion, from: preset.savedFrom } : null;
}

const RULES = `QUY TẮC CHUNG (người dùng đặt, áp dụng cho tới khi họ nói khác):
- Đây là SKILL chạy trong Claude Code trên máy người dùng (Windows), thư mục video-agent. Không cài app riêng, không tài khoản, không cloud, không API, không công cụ trả phí, không HyperFrames. Không dùng tên hay thương hiệu của creator khác cho skill.
- Đừng đoán đường dẫn hay tên file. Chỗ nào không thấy thì nói rõ "không thấy", đừng bịa.
- Ưu tiên làm ở lớp local (thư mục video-agent, profile format, router chọn format). Không sửa lõi skill gốc nếu có cách khác. Trước khi sửa bất kỳ file nào, backup bản gốc vào video-agent/backups/<ngày>-storyboard-gate/ rồi mới sửa.
- Mỗi giai đoạn chỉ làm đúng phạm vi. Xong thì DỪNG và báo: file đã sửa/thêm, backup ở đâu, chỗ nào không khớp với máy và cách xử lý.
- Yêu cầu không khớp cấu trúc thật thì nói rõ chỗ đó và cách xử lý.
- Việc khó (nâng cấp engine, dựng hiệu ứng, ghi draft) thử tối đa 3 lần; quá 3 lần thì DỪNG, báo đã thử gì + kết quả + phương án tương đương, chờ người dùng chọn.
- Tiết kiệm token: dùng lại spec/transcript/timing đã có, không chạy lại thứ đã chạy.
- Sửa theo timestamp hoặc bút vẽ: chỉ sửa storyboard rồi trình lại, KHÔNG xuất. Chỉ xuất khi người dùng chốt lại sau khi xem storyboard.
- Ảnh xem trước luôn theo preset đã chốt (đúng style của preset); đổi preset thì vẽ lại ảnh xem trước rồi mới so khớp với render.
- Độ lớn từng đoạn phải trong -14 ±1 LUFS, đỉnh thật <= -1 dBTP; đoạn lệch thì hạ/nâng riêng đoạn đó (seg-gain.mjs), ghi plan.voiceGain.
- Trả lời người dùng bằng tiếng Việt ngắn, dễ hiểu.`;

// HANDOFF.md: đang ở bước nào, đã chốt gì, còn thiếu gì, lệnh chạy tiếp + quy tắc chung
export function writeHandoff(dir) {
  const d = readJSON(path.join(dir, 'data.json')), st = readJSON(path.join(dir, 'state.json'), { segments: {} }), ch = readJSON(path.join(dir, 'choices.json'));
  const rj = readJSON(path.join(dir, 'render.json'), { segs: {} }), fixes = readJSON(path.join(dir, 'fixes.json'), []);
  if (!d) return;
  const STEPS = ['Bắt đầu', 'Màu + Font', 'Hiệu ứng', 'Âm thanh', 'Chuyển động', 'Xem & chốt'], rel = p => path.relative(path.resolve(VA, '..'), p).split(path.sep).join('/');
  const segLines = d.segments.map((s, i) => { const ss = st.segments?.[s.id] || {}, c = s.cards.find(x => x.id === ss.selected), v = ss.versions?.at(-1), r = rj.segs[s.id];
    return `| ${i + 1} | ${s.from}-${s.to} s | ${c?.name || '-'} (${ss.selected || '-'}) | ${ss.locked ? 'v' + v?.v : 'chưa duyệt'}${ss.pendingFix ? ' · chờ duyệt bản sửa' : ''} | ${r ? r.status + (r.card ? ' (' + r.card + ')' : '') : '-'} |`; });
  const open = (st.notes || []).filter(n => !n.fixed), committed = ch && !st.changedAfterCommit;
  const missing = [];
  if (!st.preset) missing.push('màu + font'); if (!st.sound) missing.push('âm thanh'); if (!st.motion) missing.push('chuyển động'); if (!st.cover) missing.push('ảnh bìa');
  const notLocked = d.segments.filter(s => !st.segments?.[s.id]?.locked).map(s => d.segments.indexOf(s) + 1); if (notLocked.length) missing.push('duyệt đoạn ' + notLocked.join(', '));
  const flagged = d.segments.filter(s => { const c = s.cards.find(x => x.id === st.segments?.[s.id]?.selected); return (c?.media || []).some(m => !fs.existsSync(path.resolve(VA, (st.segments[s.id].media || {})[`${c.id}:0`] || m))); }).map(s => d.segments.indexOf(s) + 1);
  if (flagged.length) missing.push('tư liệu đoạn ' + flagged.join(', '));
  const sb = rel(dir), sk = '.claude/skills/storyboard-gate/scripts';
  const next = !committed
    ? [`node ${sk}/server.mjs ${sb} --port 4747   (mở http://127.0.0.1:4747/, người dùng xem + chốt)`, ...(open.length ? [`sửa theo ghi chú: node ${sk}/fix-note.mjs ${sb} --note <n> --patch '<json>' --what "<đã sửa gì>"`] : [])]
    : [`render từng đoạn (có checkpoint, chạy lại sẽ tiếp từ đoạn lỗi): node ${sk}/render-seg.mjs ${sb} --from-choices`, 'xuất MP4 + CapCut + carousel: giai đoạn 5, CHỈ khi người dùng bảo'];
  const md = `# HANDOFF storyboard: ${d.slug}
Cập nhật: ${new Date().toISOString()} · Đọc file này + choices.json là đủ để làm tiếp, KHÔNG hỏi lại lựa chọn đã chốt.

${RULES}

## Đang ở đâu
- Take: \`${d.take}\` · format ${d.format} · style ${d.style}
- Bước wizard đang mở: ${STEPS[st.step || 0]}
- Chốt: ${ch ? `có choices.json lúc ${ch.committedAt}${st.changedAfterCommit ? ' — NHƯNG có thay đổi sau lần chốt, phải chốt lại trước khi dựng' : ''}` : 'chưa chốt'}

## Đã chọn
- Ảnh xem trước đang theo style: ${d.previewStyle || '?'}${d.presets.find(p => p.id === st.preset)?.style && d.presets.find(p => p.id === st.preset).style !== d.previewStyle ? ' — KHÁC preset đang chọn, phải chạy preview.mjs để vẽ lại' : ' (đúng preset đang chọn)'}
- Chỉnh giọng theo đoạn: ${(d.voiceGain || []).map(g => `đoạn ${d.segments.findIndex(s => s.id === g.seg) + 1}: ${g.db} dB`).join(', ') || 'không'} (áp vào _engine/assets/voice.wav, bản gốc voice.orig.wav)
- Màu + font: ${d.presets.find(p => p.id === st.preset)?.label || 'chưa'} · Âm thanh: ${d.sound.find(x => x.id === st.sound)?.name || 'chưa'} · Chuyển động: ${d.motion.find(x => x.id === st.motion)?.name || 'chưa'} · Bìa: ${st.cover || 'chưa'}

| Đoạn | Giờ | Hiệu ứng | Duyệt | Render |
|---|---|---|---|---|
${segLines.join('\n')}

## Ghi chú bút vẽ
${(st.notes || []).map((n, i) => `- ${i + 1}. đoạn ${d.segments.findIndex(s => s.id === n.seg) + 1}, ${n.t} s: "${n.text}" → ${n.fixed ? 'đã sửa: ' + n.fixed.what : 'CHƯA SỬA'}`).join('\n') || '- không có'}
${fixes.length ? '\nĐã sửa: ' + fixes.map(f => `ghi chú ${f.n} (thẻ ${f.card}): ${f.what}`).join('; ') : ''}

## Còn thiếu
${missing.length ? missing.map(x => '- ' + x).join('\n') : '- không'}

## Lệnh chạy tiếp (chạy từ thư mục ${path.resolve(VA, '..')})
${next.map(x => '- `' + x.replace(/`/g, '') + '`').join('\n')}
`;
  fs.writeFileSync(path.join(dir, 'HANDOFF.md'), md);
}
