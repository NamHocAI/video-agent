# Format: faceless-broll (bản tối thiểu, chưa có take mẫu)

## Chấm điểm cao khi
- Gần như không có mặt người (< 10 %), không phải quay màn hình (< 30 %), không phải hoạt hình (< 30 %).
- Là cảnh quay thật, take có nhiều cắt cảnh sẵn (> 6 lần/phút).
- Có giọng nói (lời đọc trên B-roll).

## Đã biết
- Style `default` của bạn (từ /studio-setup) đã ghi: "giọng đọc trên quay màn hình / B-roll, không lộ mặt", không emoji, không dùng Archivo Black.
- B-roll phải là cảnh tự quay, không stock ngẫu nhiên, không AI video.

## Chưa đủ dữ liệu (không bịa)
- Trên máy **không thấy** take hay project faceless-broll nào để đo (project `short-chatgpt-plus-demo` là quay màn hình, không phải B-roll).
- Wizard dùng tạm: **style `default`** (màu, font, phụ đề), các board có sẵn trong engine. Nhịp cắt và bố cục lấy theo style.
- Có 1 take thật dạng này thì đo lại bằng `start.mjs` rồi điền các mục còn `null` trong `profile.json`.
