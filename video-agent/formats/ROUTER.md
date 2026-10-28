# Router chọn format (cổng storyboard)

Script `../.claude/skills/storyboard-gate/scripts/start.mjs` đo take rồi chấm điểm từng format. Điểm cao nhất = chính, nhì = dự phòng. Lý do luôn là số đo của take.

| Format | Có profile? | Chấm điểm cao khi |
|---|---|---|
| `talking-head` | có (`talking-head/`) | mặt người nhiều, take dọc, có giọng nói, ít quay màn hình |
| `screen-demo` | chưa | quay màn hình nhiều (mảng phẳng, màu nhạt), ít mặt người |
| `animation-story` | tối thiểu (`animation-story/`) | hoạt hình / đồ hoạ nhiều (mảng phẳng, màu đậm), không có người thật |
| `faceless-broll` | tối thiểu, chưa có take mẫu (`faceless-broll/`) | không mặt, không màn hình, không hoạt hình, cảnh quay thật cắt nhiều |

Cách đo:
- **Mặt người**: BlazeFace của engine (độ tin ≥ 0.8) + kiểm màu da ở giữa mặt, để loại mặt nhân vật hoạt hình. Lấy 2 khung/giây.
- **Quay màn hình / hoạt hình**: tỉ lệ điểm ảnh phẳng > 45 % (màn hình) hoặc > 35 % (hoạt hình). Độ bão hoà màu < 0.18 là màn hình, ≥ 0.18 là hoạt hình.
- **Giọng nói**: ưu tiên transcript có sẵn (không chạy lại). Không có transcript thì dùng ffmpeg silencedetect: tiếng có ngắt nghỉ là giống lời nói, tiếng liền một mạch có thể là nhạc. Phần này chỉ là ước đoán, báo đúng như vậy.
- **Nhịp**: số lần cắt cảnh sẵn trong take (scene > 0.3), và số từ/giây khi có transcript.

Thêm format mới: tạo `formats/<tên>/PROFILE.md` + `profile.json`, rồi đổi cột "Có profile?".
