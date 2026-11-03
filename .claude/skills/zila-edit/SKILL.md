---
name: zila-edit
description: Dựng video TikTok cho Zila Education (CTV editor) từ A đến Z theo style zila - đọc dòng giao việc trong sheet, tải file thô trên Drive (qua Chrome đã đăng nhập nếu bị khóa), tự tìm logo/ảnh trường, viết lớp chữ từ khung đã duyệt, dựng 1 lệnh, so với video mẫu, làm thumbnail, đặt tên đúng chuẩn Zila. Dùng khi người dùng nói Zila, video Zila, "điều kiện tuyển sinh", "review trường", gửi link sheet "THỐNG KÊ VIDEO & THÙ LAO CTV" hoặc thư mục Drive "CUNG ĐÌNH NAM x ZILA", hoặc tên trường Hàn Quốc kèm video thô.
---

# Video Zila (TikTok, talking-head)

Luật đầy đủ + bảng kiểm: `video-agent/styles/zila/STYLE.md` (đọc trước, đừng đọc lại các video cũ). Làm từ A đến Z, KHÔNG hỏi người dùng (CLAUDE.md). Trả lời tiếng Việt ngắn.

## 1. Đầu vào (tự lấy)
- Sheet giao việc: export CSV/xlsx (`/export?format=xlsx`), đọc cột Chủ đề, Brief, Kênh, Deadline; link "video mẫu tại đây" là hyperlink (openpyxl `cell.hyperlink`). Xoá bản sao ngay (có CCCD/STK). Mỗi video theo ĐÚNG mẫu của dòng nó.
- File thô trên Drive: `gdown <id>`; "Only the owner and editors" → mở `drive.google.com/file/d/<id>/view` trong Chrome của người dùng, `location.href` cho ra id thật có quyền, rồi `gdown <id thật> -O video-agent/takes/<slug>.mov`.
- Logo trường: `node ~/.claude/skills/short-editing/engine/short.mjs logo find <tên trường>` trước (kho logo), không có mới tìm: web chính thức trước (trang UI/symbol, `curl` + grep ảnh), Google Images trong Chrome nếu cần. Ảnh minh hoạ: web Zila → web trường → Pexels. Ghi `assets/images/NGUON.txt`.
- Video mẫu mới: chạy `/steal` rồi cập nhật STYLE.md (không tạo style khác).

## 2. Dựng (thư mục gốc dự án)
1. `node ~/.claude/skills/short-editing/engine/short.mjs init video-agent/edits/short-<slug> --source video-agent/takes/<slug>.mov --style zila/bien-the/goc` rồi `words ... vi`.
2. Chép `assets/fonts sfx logo` + `images/stk-so.png` (giấy xác nhận tiền gửi = sổ đóng băng) từ `styles/zila/assets` hoặc dự án trước.
3. `source/spec.js`: chép từ `edits/short-dh-ajou/source/spec.js`; sửa `cam` (mặt ~23 %: crop cao 3570 trên take 4K dọc, mắt ở 33 %), `cut` (lần nói hỏng, CTA lặp: giữ lần sau), `cutout` (con dấu trường sau đầu, kéo tới hết khối tiêu đề), `music` (lo-fi của style), `sfx` theo mốc lời: glitter cho tiêu đề, typing cho mỗi dòng gõ chữ, popup/popup-2 cho sticker/số, whoosh (MỞ→THÂN) + paper (THÂN→KẾT).
4. `prepare` 1 lần → `files/words.md` → tạo `source/stage-map.js` (MAP nguồn→short, xem dự án Ajou).
5. Lớp chữ: `init --style zila` đã tạo sẵn `source/stage.html` (vỏ) + `source/stage.data.js` (mẫu Kookmin); CHỈ sửa `stage.data.js` (chữ, mốc giây, ảnh; khối "Chuyên ngành" mẫu ở `edits/short-dh-ajou/source/stage.data.js`; cách viết: short-editing SKILL.md bước 3c): chữ theo LỜI NÓI, mỗi ý 1 ảnh đúng câu, khối tiêu đề ≥ 2 s; `window.TRANS = [{at: đổi MỞ→THÂN, d: 700}, {at: đổi THÂN→KẾT, d: 700}]` (giây nguồn): xé giấy RA 2 BÊN lộ người nói chấm in, như mẫu, không tấm màu che người nói.
6. Ảnh: `assets/images/school-behind.png` (vòng trắng 520 px ở x 270 y 150), 12 khung chấm in `assets/images/ht/00-11.jpg` từ `frames/cam` tại giây xé giấy (lệnh trong STYLE.md).
7. `bash video-agent/styles/zila/build.sh <slug> auto TIKTOK_<TenKhongDau>_<ddmmyy>_V1`: tự căn lại thời gian chữ (stage-map) theo nhịp mới. Không tua nhanh (speed 1.0).
8. `bash video-agent/styles/zila/thumb.sh <slug> <khung cười mắt mở> <logo trường> "Điều kiện tuyển sinh" "hệ D4-1" "ĐH <TRƯỜNG>" <tên>`.

## 3. Soát trước khi giao (bắt buộc)
- Trước tiên: `node ~/.claude/skills/short-editing/engine/short.mjs qa video-agent/edits/short-<slug>` (~15 s). Sửa hết LỖI rồi chạy lại; chỉ mở ảnh `stills/qa/<trang>/` của dòng nó báo, không chụp soát từng đoạn.
- Tấm ghép bản cuối cạnh video mẫu theo từng giây + 4 khung cỡ thật: mở đầu nhòe + gõ chữ, nhịp tự nhiên, nhạc lo-fi nhỏ, 2 chuyển cảnh MỞ→THÂN→KẾT bằng hình người nói, logo trường sau đầu, chữ 62–82 % chiều cao, sticker ảnh thật đúng câu, xé giấy chấm in động, CTA comment, KHÔNG logo góc, KHÔNG đường kẻ Canva.
- QC: h264 1080x1920, -14 ±1 LUFS, đỉnh ≤ -1 dBTP. Số liệu đọc lại từ lời nói (vd "sáu củ sáu" = 6.600.000 KRW) và nhắc người dùng rà.
- Tên: `TIKTOK_DieuKienTuyenSinhDHKookmin_021126_V1.mp4` (+ `_thumb.jpg`). Bản cũ cho vào Thùng rác, giữ file thô.
- Không tự điền sheet / tải lên Drive Zila.

## 4. Sau mỗi video
Tự review ngắn (chất lượng + token). Bài học chung → STYLE.md (1 dòng, đúng mục); bài học cho mọi style → `~/.claude/skills/steal/references/learnings.md`.
