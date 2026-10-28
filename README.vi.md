# Video Agent — dựng video ngắn có storyboard duyệt trước, cho Claude Code

[English](README.md) · **Tiếng Việt** · [简体中文](README.zh-CN.md)

Bộ công cụ cho Claude Code dựng video dọc (1080×1920) từ một take nói chuyện trước camera. Học style từ một reel mẫu, lên storyboard vẽ trên chính cảnh quay của bạn, chờ bạn duyệt rồi mới render. Mọi thứ chạy trên máy với Node, ffmpeg và Chrome: không dịch vụ trả phí, không tải video lên đâu cả.

## Cách hoạt động

Không bước nào tốn thời gian trước khi bạn duyệt một bước rẻ.

| bước | bạn thấy | bạn quyết định |
|---|---|---|
| 0. Style | reel mẫu được đo từng cảnh: nhịp cắt, cỡ mặt, zoom, tiêu đề, mức nhạc, tiếng hiệu ứng | tên style |
| 1. Bắt đầu | take của bạn được đo (tỉ lệ có mặt, giọng, nhịp, quay màn hình) và format đề xuất kèm bằng chứng | giữ hoặc đổi format |
| 2. Storyboard | mỗi đoạn có ảnh **và GIF động trên footage thật**, 2–3 biến thể màu/font của style, lựa chọn âm thanh, chuyển động, ảnh bìa | duyệt từng đoạn, hoặc vẽ ghi chú lên khung |
| 3. Chốt | thành phẩm tự dựng trong tiến trình riêng | — |
| 4. Soát | so bản render với ảnh xem trước, âm lượng từng đoạn, đặt cạnh reel mẫu, 1 khung full-size | ghi chú → sửa |

## Có sẵn gì

- **Cổng storyboard** (`.claude/skills/storyboard-gate/`): bật mặc định trước mọi lần dựng. Đo take, đề xuất format, dựng trang duyệt local (`http://127.0.0.1:4747`), chỉ xuất video sau khi bấm **Chốt & dựng thành phẩm**.
- **Một spec cho cả xem trước lẫn render** (`cardspec.mjs`): duyệt gì thì render đúng cái đó.
- **Ảnh xem trước động** (`gif.mjs`): mỗi đoạn dựng nửa độ phân giải trên footage thật, lặp thành GIF.
- **Biến thể của style**: mỗi style có 2–3 biến thể màu/font (`styles/<style>/bien-the/<biến-thể>/`); đổi biến thể là ảnh xem trước vẽ lại theo biến thể đó.
- **Lưới an toàn** (`auto-final.mjs`): bấm Chốt là thành phẩm tự dựng, phiên làm việc dừng giữa chừng vẫn có video. Phiên còn chạy thì vẫn soát đủ các bước.
- **Render có checkpoint** (`render-seg.mjs`): đoạn lỗi thì chạy lại tiếp từ đúng đoạn đó.
- **Soát chất lượng** (`qc.mjs`, `seg-gain.mjs`, `compare.py`): chữ dưới 32 px, chồng chữ, vùng an toàn, −14 ±1 LUFS và ≤ −1 dBTP mỗi đoạn, khớp xem trước với render (≤ 8 px, ≤ 12/255).
- **Hồ sơ format** (`video-agent/formats/`): bộ định tuyến và hồ sơ từng format: `talking-head`, `faceless-broll`, `animation-story`.

## Nguyên tắc dựng

Rút ra từ những bản dựng bị chê thật, đã ghi vào skill để lần sau đúng từ đầu:

- **Chữ trên màn hình theo lời nói thật**, không theo kịch bản; từ nhấn hiện đúng lúc được nói. Nói "dưới đây" thì chữ nằm dưới, có mũi tên.
- **Đồ vật được nhắc mà take không có thì dùng ảnh thật đúng ngữ cảnh** (hộ chiếu Việt Nam cho người Việt, đúng trường được nhắc), tách nền thành sticker theo kiểu của style.
- **Chuyển động sáng tạo theo take**: mỗi đoạn một hành động gắn với câu nói (điện thoại rung khi nói "cuộc gọi", dấu đóng khi nói "lừa đảo"), không dùng preset chung.
- **Nhìn là biết style**: đúng font, bảng màu, cách hiện chữ; không thêm gì ngoài style.
- **Tự soát trước khi đưa duyệt**: chữ không tràn mép, không che mặt, trang trí không đè chữ.

## Cài đặt

Cần: [Claude Code](https://claude.com/claude-code), Node 20+, ffmpeg, yt-dlp, Python 3. Engine dựng (`short-editing`) và các skill chung nằm ở `~/.claude/skills/`; máy mới thì chạy `/studio-setup` một lần.

```bash
git clone https://github.com/NamHocAI/video-agent.git
cd video-agent
```

## Sử dụng

Trong Claude Code:

```text
/steal <link reel mẫu>                        # học style mới
/short-editing <take> style <tên-style>       # dựng 1 video (cổng storyboard chạy trước)
```

Chạy tay từng bước, từ thư mục `video-agent/`:

```bash
node ../.claude/skills/storyboard-gate/scripts/start.mjs takes/<take>.mp4 --style <tên-style>
node ../.claude/skills/storyboard-gate/scripts/preview.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/gif.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/build-wizard.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/server.mjs edits/short-<slug>/storyboard --port 4747
```

Dựng lại thành phẩm sau khi đã chốt:

```bash
node ../.claude/skills/storyboard-gate/scripts/auto-final.mjs edits/short-<slug>/storyboard
```

## Cấu trúc repo

```text
.
├── CLAUDE.md                          # quy tắc dự án cho Claude Code (cổng storyboard bật mặc định)
├── .claude/skills/storyboard-gate/
│   ├── SKILL.md                       # quy trình đầy đủ + các quy tắc người dùng đã đặt
│   ├── scripts/                       # start · preview · gif · build-wizard · server · cardspec
│   │                                  # render-seg · auto-final · qc · seg-gain · compare.py · …
│   └── wizard/index.html              # trang duyệt
└── video-agent/
    ├── formats/                       # ROUTER.md + hồ sơ từng format
    └── storyboards/templates/         # template đoạn dùng lại cho take cùng nguồn
```

Chỉ giữ trên máy, không push: `styles/`, `takes/`, `edits/`, `inputs/`, `presets/`, `backups/`, mọi file `.env`, và toàn bộ media (video, âm thanh, ảnh, font, bản render).

## Đóng góp

Chỉ commit mã nguồn và tài liệu. Không secrets, không media nguồn, không bản render.
