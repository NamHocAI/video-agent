#!/usr/bin/env node
// Kiểm font có đủ dấu tiếng Việt: render thử từng chữ có dấu trong Chrome. Chữ do chính font vẽ thì độ rộng
// không đổi khi đổi font dự phòng (Courier New / Times New Roman); thiếu glyph thì trình duyệt mượn font dự phòng.
//   node fontcheck.mjs <out.json> <out.png> <Tên=đường/dẫn.ttf> ...
import fs from 'node:fs';
import { withPage, fileURL } from './lib.mjs';

const VOW = ['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y'], TONE = ['', '̀', '́', '̉', '̃', '̣'];
export const VI_CHARS = [...new Set([...VOW.flatMap(v => TONE.map(t => (v + t).normalize('NFC'))), 'đ'].flatMap(c => [c, c.toUpperCase()]))];
export const SAMPLE = 'Thật sự nhanh: Ở đây mình đã chỉnh ảnh, ước mơ ĐƯỢC ỦNG HỘ, ỷ lại, Ứng dụng, quá đỗi.';

export async function fontCheck(fonts, outJson, outPng) {
  const res = await withPage(async page => {
    const r = await page.evaluate(async ({ fonts, chars }) => {
      const out = {};
      for (const f of fonts) {
        try { const ff = new FontFace(f.name, `url(${f.url})`); await ff.load(); document.fonts.add(ff); }
        catch { out[f.name] = { loaded: false, missing: chars }; continue; }
        // vẽ từng chữ với 2 font dự phòng khác hẳn nhau rồi so điểm ảnh: khác nhau = chữ đó không do font này vẽ
        const cv = new OffscreenCanvas(120, 120), c = cv.getContext('2d', { willReadFrequently: true });
        const draw = (ch, fb) => { c.clearRect(0, 0, 120, 120); c.font = `64px "${f.name}", ${fb}`; c.fillText(ch, 20, 90); return c.getImageData(0, 0, 120, 120).data; };
        const missing = chars.filter(ch => {
          const x = draw(ch, '"Courier New", monospace'), y = draw(ch, '"Times New Roman", serif');
          for (let i = 3; i < x.length; i += 4) if (Math.abs(x[i] - y[i]) > 40) return true;
          return false;
        });
        out[f.name] = { loaded: true, missing };
      }
      return out;
    }, { fonts: fonts.map(f => ({ name: f.name, url: f.url })), chars: VI_CHARS });
    // ảnh render thử để nhìn tận mắt
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>${fonts.map(f => `@font-face{font-family:"${f.name}";src:url(${f.url})}`).join('')}
      body{margin:0;padding:16px;background:#fff;font:14px sans-serif}div{margin:0 0 10px}b{display:block;color:#888;font:12px monospace}</style>
      ${fonts.map(f => `<div><b>${f.name}${r[f.name]?.missing.length ? ` (thiếu ${r[f.name].missing.length} chữ)` : ' (đủ dấu)'}</b><span style="font:32px '${f.name}'">${SAMPLE}</span></div>`).join('')}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: outPng, fullPage: true });
    return r;
  });
  const rows = fonts.map(f => ({ name: f.name, file: f.file, ok: !!res[f.name]?.loaded && !res[f.name].missing.length, missing: res[f.name]?.missing || [] }));
  fs.writeFileSync(outJson, JSON.stringify({ tested: VI_CHARS.length, sample: SAMPLE, fonts: rows }, null, 2));
  return rows;
}

if (process.argv[1]?.endsWith('fontcheck.mjs')) {
  const [outJson, outPng, ...pairs] = process.argv.slice(2);
  const fonts = pairs.map(p => { const [name, file] = p.split('='); return { name, file, url: fileURL(file) }; });
  for (const r of await fontCheck(fonts, outJson, outPng)) console.log(`${r.ok ? 'OK  ' : 'THIẾU'} ${r.name}${r.missing.length ? ': ' + r.missing.join('') : ''}`);
}
