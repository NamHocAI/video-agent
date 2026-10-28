# Format: talking-head

Style mặc định: **`chia-se-meo`** (`video-agent/styles/chia-se-meo/`), học từ reel @wipill https://www.instagram.com/p/Dd_NUpGzqxk/.
Số đo gốc: `styles/chia-se-meo/STYLE.md`, ảnh mẫu: `styles/chia-se-meo/stills/`. Giá trị cho engine: `profile.json` cạnh file này.
Lệnh: `/short-editing <take> style chia-se-meo`. Video mẫu đã duyệt: `edits/short-lsq-dsq-chia-se-meo/` (spec + `source/stage.html`).
Mẫu lớp chữ: `styles/chia-se-meo/assets/components/stage.template.html`; script: `styles/chia-se-meo/scripts/` (map.sh, capture.sh, check.sh).

## 1. Clip đầu vào
- 1 người nói vào camera, quay dọc, có tiếng. Nhiều file quay nối tiếp nhau thì nối theo thứ tự thành 1 take (nghe trước để biết là phần nối tiếp hay quay lại).
- Thiếu file thì báo ngắn gọn (ảnh, quay màn hình), không chặn việc dựng.

## 2. Khung, nhịp
- Toàn khung camera suốt video, mặt ~20 đến 32 % chiều cao, mắt ~42 %, chừa ~30 % phía trên cho tiêu đề. Cắt mọi khoảng lặng, cắt thẳng.
- Phóng khung tối đa ~2 lần / 90 s, đặt ở 2 câu mạnh nhất của take, giữ tới câu sau.

## 3. Chữ, hình, chuyển động, âm thanh
- Chữ theo **lời nói thật**; từ nhấn ưu tiên hiện đúng lúc nói; lời chỉ hướng ("dưới đây") thì chữ/hình theo hướng đó. Không phụ đề chạy.
- Khối tiêu đề: nhãn "Bước N:" + tiêu đề Sigmar + dòng phụ, trong khoảng trống trên đầu.
- Đồ vật được nhắc mà take không có: **ảnh thật đúng ngữ cảnh** tách nền, sticker viền trắng. Doodle chỉ để trang trí.
- Mỗi đoạn 1 hành động gắn đúng câu nói (điện thoại rung, dấu đóng, OTP nhảy số...). Nhìn phát biết style: đúng font, bảng màu, kiểu sticker.
- Âm: lofi dưới giọng ~15 dB, ding mỗi bước, pop/thud/boom chỉ ở điểm chốt.

## 4. Tự soát trước khi đưa duyệt
- Chụp 1 khung mỗi đoạn trên footage thật: chữ 1 dòng không tràn mép, không che mặt, ảnh nhận ra ngay, trang trí không đè chữ, không có đoạn > 4 s chỉ có nhãn trơ trọi.
