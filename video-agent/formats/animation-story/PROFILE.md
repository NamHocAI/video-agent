# Format: animation-story (bản tối thiểu)

Học từ 1 project có thật trên máy: `edits/short-cartoon-tho-trang-v2/` (style `kem-3d`, 5 clip hoạt hình thỏ trong `takes/Đoạn demo *.mp4`).

## Chấm điểm cao khi
- Hoạt hình / đồ hoạ chiếm ≥ 60 % thời lượng (mảng phẳng > 35 %, màu đậm ≥ 0.18).
- Không có mặt người thật (0 %), quay màn hình < 10 %.
- Tiếng trong clip liền một mạch (nhạc), không giống lời nói → cần giọng đọc riêng.

## Đã biết (từ project mẫu)
- Toàn khung là giấy (`layout.keys [[0, 1920]]`), không có camera.
- Clip hoạt hình tắt tiếng, đặt trong component HTML của từng đoạn (file .mov có kênh alpha), gắn đúng từ đầu tiên của đoạn.
- Style mặc định: `kem-3d`.

## Chưa đủ dữ liệu (không bịa)
- Nhịp cắt, cỡ và vị trí phụ đề, mức nhạc riêng cho format này: chưa đo. Wizard dùng **giá trị của style `kem-3d`**.
- Giọng đọc: project mẫu dùng ElevenLabs (API), trái quy tắc local. Format này cần bạn tự thu giọng (rồi làm sạch bằng ffmpeg).
- Chưa có transcript cho các take hoạt hình → Bước 2 (chia đoạn theo lời) chỉ chạy được khi đã có giọng đọc + transcript.
