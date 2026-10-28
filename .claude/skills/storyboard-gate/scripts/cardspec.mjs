// Một spec cho mỗi thẻ hiệu ứng, dùng CHUNG cho ảnh xem trước (engine stills) và bản render (engine render):
// cấm làm 2 kiểu. Thẻ "đang dùng" = spec gốc; thẻ thư viện = spec gốc, tắt hiệu ứng cũ trong đoạn, thêm hiệu ứng của thẻ.
// Trường của thẻ: scene {type...} | broll [{media, from, to...}] | media2 {key: {src, width}} | labels {"chữ cứng": "chữ thay"}
// labels là tùy chọn runtime ở lớp local: spec.js chạy trong trang trước runtime, đổi đúng chuỗi được vẽ (fillText/measureText),
// không sửa lõi engine. Trong Node (vm, không có canvas) đoạn này không chạy.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const overlaps = (a, b, x, y) => a < y && b > x;

export function loadBase(specFile) {
  const text = fs.readFileSync(specFile, 'utf8');
  return () => { const window = {}; eval(text); return JSON.parse(JSON.stringify(window.SPEC)); };
}

// spec cuối cho cả video: áp thẻ đã chọn của từng đoạn lần lượt lên spec gốc (dùng cho render thành phẩm)
export function composeSpec(base, plan, pick, captionsReplace = [], m = t => t) {
  let sp = base(), labels = {};
  if (captionsReplace.length) sp.captions = { ...(sp.captions || {}), replace: [...(sp.captions?.replace || []), ...captionsReplace] };
  for (const seg of plan.segments) {
    const card = seg.cards.find(c => c.id === pick[seg.id]);
    if (!card) throw new Error(`đoạn ${seg.id}: không thấy thẻ ${pick[seg.id]}`);
    const r = cardSpec(() => sp, seg, card, [], m);
    sp = r.spec; Object.assign(labels, r.labels || {});
  }
  return { spec: sp, labels };
}

// m: đổi giờ source -> giờ short (mapper của engine), để tính offset của clip overlay
// card.extraScenes: lớp thêm do sửa theo ghi chú bút vẽ (fix-note.mjs), áp trên mọi kiểu thẻ
export function cardSpec(base, seg, card, captionsReplace = [], m = t => t) {
  const r = cardSpecInner(base, seg, card, captionsReplace, m);
  if (card.extraScenes?.length) r.spec.scenes = [...(r.spec.scenes || []), ...card.extraScenes.map(x => ({ from: seg.from, to: seg.to, ...x }))];
  return r;
}
function cardSpecInner(base, seg, card, captionsReplace, m) {
  const sp = base();
  if (captionsReplace.length) sp.captions = { ...(sp.captions || {}), replace: [...(sp.captions?.replace || []), ...captionsReplace] };
  if (card.source === 'đang dùng') return { spec: sp, labels: card.labels };
  // biến thể của bản đang dùng: giữ nguyên đoạn, chỉ đổi clip (vd bản tua nhanh của chính clip đó)
  if (card.keepBase) {
    if (card.media2) sp.media = { ...(sp.media || {}), ...card.media2 };
    for (const [a, b] of Object.entries(card.swapMedia || {})) sp.broll = (sp.broll || []).map(x => x.media === a && overlaps(x.from, x.to, seg.from, seg.to) ? { ...x, media: b } : x);
    return { spec: sp, labels: card.labels };
  }
  // hiệu ứng cũ (lớp overlay 'stage' chạy suốt video) bị cắt khỏi đoạn này; phần sau đoạn chạy tiếp đúng giờ của clip
  sp.scenes = sp.scenes.flatMap(x => {
    if (!(x.type === 'overlay' && x.media === 'stage' && overlaps(x.from ?? 0, x.to ?? 1e9, seg.from, seg.to))) return [x];
    const f = x.from ?? 0, t = x.to ?? 1e9;   // offset = giây trong clip (engine không đổi giờ offset), clip chạy theo giờ short
    return [...(f < seg.from ? [{ ...x, to: seg.from }] : []), ...(t > seg.to ? [{ ...x, from: seg.to, offset: +((x.offset ?? 0) + m(seg.to) - m(f)).toFixed(3) }] : [])];
  });
  sp.broll = (sp.broll || []).filter(b => !overlaps(b.from, b.to, seg.from, seg.to));
  if (sp.captions?.hide) sp.captions.hide = sp.captions.hide.filter(([a, b]) => !overlaps(a, b, seg.from, seg.to));
  if (card.media2) sp.media = { ...(sp.media || {}), ...card.media2 };
  if (card.broll) sp.broll.push(...card.broll.map(b => ({ from: seg.from, to: seg.to, ...b })));
  if (card.hideCaptions) sp.captions = { ...(sp.captions || {}), hide: [...(sp.captions?.hide || []), [seg.from, seg.to]] };
  if (card.scene) sp.scenes.push({ from: seg.from, to: seg.to, ...card.scene });
  return { spec: sp, labels: card.labels };
}

// probe: ghi lại mọi chữ engine vẽ (nội dung, cỡ px thật sau phép biến đổi, khung) để soát lỗi cỡ chữ / chồng nhau
const PROBE = `(function(){var P=CanvasRenderingContext2D.prototype,o=P.fillText;P.fillText=function(t,x,y){try{var m=this.getTransform(),px=parseFloat((this.font.match(/([\\d.]+)px/)||[])[1]||0),w=this.measureText(t).width,s=Math.hypot(m.a,m.b);if(String(t).trim()&&this.globalAlpha>.05)console.error('[sbg] '+JSON.stringify({t:String(t),px:Math.round(px*s*10)/10,x:Math.round(m.a*x+m.c*y+m.e),y:Math.round(m.b*x+m.d*y+m.f),w:Math.round(w*s),a:Math.round(this.globalAlpha*100)/100,font:this.font}))}catch(e){}return o.apply(this,arguments)}})();`;

export function specText(spec, labels, probe = false) {
  const L = labels && Object.keys(labels).length ? `window.SPEC_LABELS=${JSON.stringify(labels)};(function(){var M=window.SPEC_LABELS,P=CanvasRenderingContext2D.prototype;['fillText','strokeText','measureText'].forEach(function(k){var o=P[k];P[k]=function(t){var a=[].slice.call(arguments);if(Object.prototype.hasOwnProperty.call(M,t))a[0]=M[t];return o.apply(this,a)}})})();` : '';
  const pre = L || probe ? `if (typeof CanvasRenderingContext2D !== 'undefined') { ${probe ? PROBE : ''}${L} }\n` : '';
  return '// spec sinh tự động (storyboard-gate)\n' + pre + 'window.SPEC = ' + JSON.stringify(spec, null, 1) + ';\n';
}

// chuẩn bị tư liệu phái sinh của thẻ (vd tua nhanh): chạy 1 lần, giữ trong <project>/assets
export function prepCard(card, PJ, VA, run) {
  for (const p of card.prep || []) {
    const out = path.join(PJ, p.out), src = path.resolve(VA, p.src), tag = out + '.params.json', key = JSON.stringify({ ...p, srcMtime: fs.statSync(src).mtimeMs });
    if (fs.existsSync(out) && fs.existsSync(tag) && fs.readFileSync(tag, 'utf8') === key) continue;   // dựng lại khi đổi thông số hoặc file gốc
    run(p, src, out); fs.writeFileSync(tag, key);
  }
}

// Quy tắc: ảnh xem trước và bản render luôn theo style của preset đã chọn (đổi preset thì vẽ lại ảnh xem trước).
// Style lấy theo thứ tự: --style, preset đang chọn (state.json), preset đã chốt (choices.json), plan.style.
export function pickStyle(dir, plan, argStyle) {
  const rj = f => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
  const st = rj('state.json'), ch = rj('choices.json'), d = rj('data.json');
  const fromState = st?.preset && (d?.presets || plan.presets).find(p => p.id === st.preset)?.style;
  return argStyle || fromState || ch?.preset?.style || plan.style;
}
// chép style vào project nháp (engine đọc <project>/source/style.json); trả về true nếu style vừa đổi
export function applyStyle(PJ, VA, style) {
  const src = path.join(VA, 'styles', style, 'style.json'), dst = path.join(PJ, 'source/style.json');
  if (!fs.existsSync(src)) throw new Error('không thấy style ' + style);
  const a = fs.readFileSync(src, 'utf8'), b = fs.existsSync(dst) ? fs.readFileSync(dst, 'utf8') : '';
  if (a === b) return false;
  fs.writeFileSync(dst, a);
  stageVariant(PJ, JSON.parse(a).stageSrc);
  return true;
}
// biến thể của cùng 1 style (vd chia-se-meo/bien-the/hong): style.json có stageSrc = lớp chữ đã capture riêng cho biến thể.
// Chép nó thành assets/stage.mov của project nháp và trích lại khung media 'stage' (cùng lệnh với engine prepare).
function stageVariant(PJ, src) {
  if (!src) return;
  const from = path.join(PJ, src), to = path.join(PJ, 'assets/stage.mov'), fr = path.join(PJ, 'frames/media/stage');
  if (!fs.existsSync(from)) throw new Error('không thấy lớp chữ của biến thể: ' + src);
  fs.copyFileSync(from, to);
  fs.rmSync(fr, { recursive: true, force: true }); fs.mkdirSync(fr, { recursive: true });
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-threads', '4', '-i', to, '-vf', 'fps=30,scale=1080:-2:flags=lanczos,format=rgba', '-an', '-pix_fmt', 'rgba', '-start_number', '0', path.join(fr, '%05d.png')]);
}
