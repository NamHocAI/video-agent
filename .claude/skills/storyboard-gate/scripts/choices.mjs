// Chốt storyboard: lựa chọn -> choices.json, và mã tóm tắt dự phòng (khi server không ghi được file).
// Dùng chung cho server.mjs (nút Chốt) và commit.mjs (người dùng nhắn "chốt <mã>" trong chat).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const LET = 'ABCDEFGH';
const sum = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 6);

// lựa chọn gọn từ state.json (cũng là nội dung của mã)
export function selection(d, st) {
  return {
    slug: d.slug, preset: st.preset ?? null, sound: st.sound ?? null, motion: st.motion ?? null, cover: st.cover ?? null,
    segs: Object.fromEntries(d.segments.map(s => { const ss = st.segments?.[s.id] || {}, v = ss.versions?.at(-1);
      return [s.id, { card: ss.selected ?? s.default, locked: !!ss.locked, v: v?.v ?? 0, change: v?.change ?? '', media: ss.media || {} }]; })),
    notes: (st.notes || []).map(n => ({ seg: n.seg, t: n.t, text: n.text, path: n.path })),
  };
}

// còn gì chặn nút Chốt. Cờ đỏ tính lại từ file thật (flags = đoạn -> tư liệu thiếu)
export function blockers(d, sel, flags) {
  const b = [];
  for (const [id, f] of Object.entries(flags)) if (f.length) b.push(`Đoạn ${d.segments.findIndex(s => s.id === id) + 1} thiếu tư liệu: ${f.map(m => m.path).join(', ')}`);
  if (!sel.preset) b.push('Chưa chọn Màu + Font (Bước 1)');
  const open = d.segments.filter(s => !sel.segs[s.id]?.locked).map(s => d.segments.indexOf(s) + 1);
  if (open.length) b.push(`Chưa duyệt đoạn ${open.join(', ')} (Bước 2)`);
  if (!sel.sound) b.push('Chưa chọn Âm thanh (Bước 3)');
  if (!sel.motion) b.push('Chưa chọn Chuyển động (Bước 4)');
  if (!sel.cover) b.push('Chưa chọn ảnh bìa (Bước 5)');
  return b;
}

// choices.json: đủ để dựng tiếp mà không hỏi lại
export function buildChoices(d, sel, how) {
  const p = d.presets.find(x => x.id === sel.preset), snd = d.sound.find(x => x.id === sel.sound), mo = d.motion.find(x => x.id === sel.motion), cov = d.cover.find(x => x.id === sel.cover);
  return {
    version: 1, slug: d.slug, take: d.take, transcript: d.transcript, format: d.format, project: d.project,
    committedAt: new Date().toISOString(), committedBy: how,
    preset: p && { id: p.id, label: p.label, style: p.style, colors: p.colors, display: p.display, captions: p.captions, fonts: p.fonts.map(f => ({ name: f.name, file: f.file, ok: f.ok })) },
    segments: d.segments.map((s, i) => { const x = sel.segs[s.id], k = s.cards.findIndex(c => c.id === x.card), c = s.cards[k];
      return { n: i + 1, id: s.id, part: s.part, from: s.from, to: s.to, text: s.text,
        effect: { id: c.id, letter: LET[k], name: c.name, source: c.source, capcut: c.capcut, engine: c.engine, scene: c.scene ?? null,
          media: (c.media || []).map((m, j) => x.media[`${c.id}:${j}`] || m) },
        version: x.v, change: x.change }; }),
    sound: snd && { id: snd.id, name: snd.name, music: snd.music, mix: snd.mix, sfx: snd.sfx, measured: d.audio?.[snd.id] && { lufs: d.audio[snd.id].lufs, tp: d.audio[snd.id].tp } },
    motion: mo && { id: mo.id, name: mo.name, spec: mo.spec },
    cover: cov && { id: cov.id, src: cov.src, img: cov.img },
    notes: sel.notes.map((n, i) => ({ n: i + 1, seg: n.seg, segN: d.segments.findIndex(s => s.id === n.seg) + 1, t: n.t, text: n.text, path: n.path })),
    upgrades: d.upgrades || [],
    rule: 'Sửa theo timestamp hoặc bút vẽ: chỉ sửa storyboard rồi trình lại, KHÔNG xuất. Chỉ xuất khi người dùng chốt lại sau khi đã xem storyboard.',
  };
}

// ghi an toàn: file tạm -> đổi tên -> đọc lại so khớp
export function writeChoices(dir, obj) {
  const f = path.join(dir, 'choices.json'), txt = JSON.stringify(obj, null, 2);
  fs.writeFileSync(f + '.tmp', txt); fs.renameSync(f + '.tmp', f);
  const back = fs.readFileSync(f, 'utf8');
  if (back !== txt) throw new Error('đọc lại choices.json không khớp');
  JSON.parse(back);
  return { file: f, sha: sum(back) };
}

// mã tóm tắt: SB1-<base64url JSON>-<6 ký tự kiểm>. Nét bút gọn còn ≤ 24 điểm
export function encode(sel) {
  const thin = p => { const k = Math.max(1, Math.ceil(p.length / 24)); return p.filter((_, i) => i % k === 0 || i === p.length - 1).map(([x, y]) => [Math.round(x), Math.round(y)]); };
  const j = JSON.stringify({ ...sel, notes: sel.notes.map(n => ({ ...n, path: thin(n.path) })) }), b = Buffer.from(j).toString('base64url');
  return `SB1-${b}-${sum(j)}`;
}
export function decode(code) {
  const m = String(code).trim().match(/^SB1-([A-Za-z0-9_-]+)-([0-9a-f]{6})$/);
  if (!m) throw new Error('mã không đúng dạng SB1-...');
  const j = Buffer.from(m[1], 'base64url').toString('utf8');
  if (sum(j) !== m[2]) throw new Error('mã bị sai (kiểm tra không khớp), chép lại nguyên mã');
  return JSON.parse(j);
}
