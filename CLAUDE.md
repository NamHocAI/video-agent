# video-agent (lớp local)

## Cổng storyboard: bật mặc định
Trước khi dựng 1 take mới bằng `/short-editing` hoặc `/editing`, hoặc khi người dùng nói "tạo storyboard trước khi dựng video", chạy skill `storyboard-gate` trước. Skill nằm ở `.claude/skills/storyboard-gate/SKILL.md`, bắt đầu từ bước Bắt đầu. Thiếu đầu vào hoặc format chưa được duyệt thì chưa dựng.
Chỉ bỏ qua cho đúng 1 video khi người dùng nói rõ. Ghi `video-agent/storyboards/<slug>/SKIP.md`.
Router format: `video-agent/formats/ROUTER.md`.
