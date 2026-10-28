// Dùng chung cho build-wizard.mjs và server.mjs: đường dẫn, kiểm tư liệu, Chrome headless của engine.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VA = path.resolve(SKILL, '../../../video-agent');
export const ENGINE = path.join(os.homedir(), '.claude/skills/short-editing/engine');
export const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(fs.existsSync);
export const rel = f => path.relative(VA, f).split(path.sep).join('/');
export const readJSON = (f, d = null) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };

// Tư liệu (B-roll, ảnh, quay màn hình) phải nằm trong inputs/ và ffprobe đọc được
export function checkMedia(p) {
  const abs = path.resolve(VA, p);
  if (!rel(abs).startsWith('inputs/')) return { path: p, ok: false, why: 'chưa nằm trong inputs/' };
  if (!fs.existsSync(abs)) return { path: p, ok: false, why: 'không thấy file' };
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', abs], { encoding: 'utf8' });
  return r.status ? { path: p, ok: false, why: 'file hỏng, ffprobe không đọc được' } : { path: p, ok: true, why: 'có, đọc được' };
}

// Mở Chrome headless (playwright-core của engine). /file?f= đọc file local, không mở cổng mạng
export async function withPage(fn, { width = 1200, height = 800 } = {}) {
  const { chromium } = createRequire(path.join(ENGINE, 'package.json'))('playwright-core');
  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--disable-extensions', '--mute-audio'] });
  try {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.route('http://sb.local/**', route => {
      const u = new URL(route.request().url()), f = u.searchParams.get('f');
      if (u.pathname === '/') return route.fulfill({ body: '<!doctype html><meta charset="utf-8"><body></body>', contentType: 'text/html' });
      if (!f || !fs.existsSync(f)) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ body: fs.readFileSync(f), contentType: 'application/octet-stream' });
    });
    await page.goto('http://sb.local/');
    return await fn(page);
  } finally { await browser.close(); }
}
export const fileURL = f => 'http://sb.local/file?f=' + encodeURIComponent(f);
