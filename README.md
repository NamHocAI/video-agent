# Video Agent

Bộ công cụ và cấu hình cho quy trình dựng video ngắn, với storyboard được duyệt trước khi render.

## Thành phần chính

- `.claude/skills/storyboard-gate/` — skill, wizard và script cho storyboard, preview, QC và render.
- `video-agent/formats/` — bộ định tuyến và hồ sơ format.
- Style và preset do người dùng tạo được lưu local trong `video-agent/styles/` và `video-agent/presets/`; chúng không thuộc mã nguồn chia sẻ trên GitHub.
- `video-agent/storyboards/templates/` — template dùng lại cho các take tương tự.

## Quy trình

1. Đọc [`CLAUDE.md`](CLAUDE.md) và [hướng dẫn storyboard](.claude/skills/storyboard-gate/SKILL.md).
2. Chọn take, format và style; tạo storyboard rồi xem ảnh preview trong wizard.
3. Chỉ render sau khi người dùng duyệt storyboard và chốt lựa chọn.
4. Kiểm tra thành phẩm theo hướng dẫn QC trong skill.

Các lệnh đầy đủ và quy tắc làm việc nằm trong `CLAUDE.md` và `SKILL.md`.

## Môi trường local

Repo chứa mã nguồn và tài liệu dùng chung. `.gitignore` loại file `.env`, video nguồn, media, storyboard đang làm, bản render, cùng style/preset do người dùng tạo. Các dữ liệu local này cần được giữ trên máy dựng. Yêu cầu công cụ và đường dẫn engine được ghi trong storyboard skill.

## Git

Commit author được cấu hình cho tài khoản GitHub `namhocai`. Không commit secrets, media nguồn hoặc output render vào repo này.
