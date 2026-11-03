# video-agent (lớp local)

## Cổng storyboard: bật mặc định
Trước khi dựng 1 take mới bằng `/short-editing` hoặc `/editing`, hoặc khi người dùng nói "tạo storyboard trước khi dựng video", chạy skill `storyboard-gate` trước. Skill nằm ở `.claude/skills/storyboard-gate/SKILL.md`, bắt đầu từ bước Bắt đầu. Thiếu đầu vào hoặc format chưa được duyệt thì chưa dựng.
Chỉ bỏ qua cho đúng 1 video khi người dùng nói rõ. Ghi `video-agent/storyboards/<slug>/SKIP.md`.
Router format: `video-agent/formats/ROUTER.md`.

## Làm từ A đến Z (mọi skill, người dùng 2026-11-02)
Cần tư liệu gì (ảnh, B-roll hợp lý, logo trường/app, font, video mẫu, file thô) thì tự lên mạng tìm và tải, ảnh Google cũng được miễn đẹp; file bị khóa thì thử Chrome đang đăng nhập của người dùng. Chỉ hỏi khi thật sự không lấy được.
Không hỏi người dùng nữa (2026-11-02: "từ giờ k hỏi t nữa"): cổng storyboard vẫn chạy để lưu lựa chọn, nhưng tự duyệt format + chọn mặc định rồi dựng tới bản cuối; người dùng xem bản cuối. Sau mỗi việc, tự review: chất lượng cần cải thiện gì, chỗ nào tốn token, rồi ghi bài học chung vào skill/style.
