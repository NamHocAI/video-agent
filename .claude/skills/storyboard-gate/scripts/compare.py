#!/usr/bin/env python
"""So ảnh xem trước (engine stills) với khung hình của bản render ở cùng thời điểm, trên khung 1080x1920.
  python compare.py <preview.jpg> <render.mp4> <giây trong file render> [probe.json]
In JSON: lệch vị trí từng vùng có nội dung (phase correlation, px), khung bao nội dung (vị trí/kích thước), màu, điểm ảnh khác.
Chuẩn "khớp": mọi vùng lệch <= 8 px, khung bao lệch <= 8 px, màu lệch nhỏ (<= 12/255 mỗi kênh), không thiếu/thừa phần tử."""
import json, subprocess, sys
import numpy as np

W, H, LIM = 1080, 1920, 8

def load(src, t=None):
    # khung thứ n = round(t*30): bốc đúng số khung, không để -ss làm tròn sang khung sau
    vf = (rf'select=eq(n\,{round(t * 30)}),' if t is not None else '') + f'scale={W}:{H}'
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-frames:v', '1', '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(np.float32)

def shift(a, b):
    """lệch (dx, dy) của b so với a, phase correlation, độ chính xác 1 px"""
    if a.std() < 4 or b.std() < 4: return None
    A, B = np.fft.fft2(a - a.mean()), np.fft.fft2(b - b.mean())
    R = A.conj() * B; R /= np.abs(R) + 1e-9
    c = np.abs(np.fft.ifft2(R)); y, x = np.unravel_index(c.argmax(), c.shape)
    h, w = a.shape
    return [int(x if x <= w // 2 else x - w), int(y if y <= h // 2 else y - h)]

def bbox(mask):
    # hàng/cột có >= 5 điểm nội dung đậm: bỏ vân giấy và điểm nhiễu lẻ ở ngưỡng (nén JPEG vs H.264)
    r, c = np.nonzero(mask.sum(1) >= 5)[0], np.nonzero(mask.sum(0) >= 5)[0]
    return None if not len(r) or not len(c) else [int(c.min()), int(r.min()), int(c.max()), int(r.max())]

pv, rv = load(sys.argv[1]), load(sys.argv[2], float(sys.argv[3]))
gp, gr = pv.mean(2), rv.mean(2)
bg = np.median(np.concatenate([gp[:40].ravel(), gp[-40:].ravel()]))   # nền = mép trên/dưới
mp, mr = np.abs(gp - bg) > 60, np.abs(gr - bg) > 60   # nội dung đậm: chữ, board, người (vân giấy < 60)
bp, br = bbox(mp), bbox(mr)
tiles = []
for ty in range(0, H, 240):
    for tx in range(0, W, 270):
        a, b = gp[ty:ty + 240, tx:tx + 270], gr[ty:ty + 240, tx:tx + 270]
        if a.std() < 8: continue
        s = shift(a, b)
        if s: tiles.append({'o': [tx, ty], 'dx': s[0], 'dy': s[1]})
probe = []
if len(sys.argv) > 4:
    for t in json.load(open(sys.argv[4], encoding='utf-8')):
        x0, y0 = max(0, t['x'] - 16), max(0, int(t['y'] - t['px'] * 1.1) - 16)
        x1, y1 = min(W, t['x'] + t['w'] + 16), min(H, int(t['y'] + t['px'] * .4) + 16)
        s = shift(gp[y0:y1, x0:x1], gr[y0:y1, x0:x1]) if x1 - x0 > 8 and y1 - y0 > 8 else None
        if s: probe.append({'t': t['t'], 'px': t['px'], 'dx': s[0], 'dy': s[1]})
d = np.abs(gp - gr)
both = mp & mr
col = (np.abs(pv[both].mean(0) - rv[both].mean(0)).round(1).tolist()) if both.any() else None
maxshift = max([max(abs(t['dx']), abs(t['dy'])) for t in tiles + probe] or [0])
bbd = max(abs(a - b) for a, b in zip(bp, br)) if bp and br else None
miss = int((mp & ~mr).sum()), int((mr & ~mp).sum())
res = {
    'vùng_có_nội_dung': len(tiles), 'lệch_vùng_tối_đa_px': maxshift,
    'khung_bao_xem_trước': bp, 'khung_bao_render': br, 'khung_bao_lệch_tối_đa_px': bbd,
    'màu_lệch_TB_rgb': col, 'chênh_xám_TB': round(float(d.mean()), 2), 'điểm_khác_>40': int((d > 40).sum()),
    'điểm_chỉ_có_ở_xem_trước': miss[0], 'điểm_chỉ_có_ở_render': miss[1], 'chữ_đo_riêng': probe,
}
res['khớp'] = bool(maxshift <= LIM and (bbd is None or bbd <= LIM) and (col is None or max(col) <= 12) and max(miss) < 0.002 * W * H)
print(json.dumps(res, ensure_ascii=False))
