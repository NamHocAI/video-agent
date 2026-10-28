# Style: kem-3d

Chép từ https://www.instagram.com/reel/De2Ap1yEUJ2/ (@guipaulinooo), đo ngày 26/10/2026. Áp lên trên `short-editing/references/style.md`: cái gì không ghi ở đây thì giữ như ở đó. Một reel, nên coi là một trường hợp riêng.

Định dạng gốc: faceless, chỉ có giọng đọc, toàn bộ là motion design trên nền giấy kem: các cửa sổ 3D nghiêng bay vào, chip đếm số, mascot nhỏ. Hợp kênh @namhocai (lồng tiếng + quay màn hình).

Gọi lại: `/short-editing <take> style kem-3d`.

## Mặc định bạn yêu cầu (26/10/2026)
- Video dọc 9:16, faceless, không camera.
- Độ dài theo giọng đọc: cắt hết khoảng lặng, kết thúc ở từ cuối.
- Âm thanh: CHỈ giọng bạn + nhạc nền nhỏ (-32 LUFS, nén xuống dưới giọng 60 %). Tiếng gốc của mọi clip trong `takes/` dùng làm hình đều tắt hẳn.
- Caption tiếng Việt 1 đến 3 từ, từ đang nói nằm trên khối cam chữ trắng.
- Luôn xuất kèm `.srt` (1 đến 3 từ một cue) cạnh file mp4.

## Cắt
- 0 điểm cắt cảnh trong 42,0 s (scdet ngưỡng 12 và 6): không có cảnh quay, chuyển ý bằng chuyển động (thẻ bay ra mờ đi, thẻ mới bay vào từ xa).
- Giọng: 6 khoảng lặng, 0,22 đến 0,37 s (cuối video 2,7 s im cho CTA). Nhịp nhanh: `pace.speed 1.05`, nghỉ câu 0,28 s.

## Khung hình
- Không mặt, không camera, không zoom, không push. Chỉ có thẻ lắc nhẹ (xoay ±1,6°) khi đứng yên.

## Phụ đề
- Gốc: sans đậm đen (kiểu SF Pro Heavy) khoảng 74 px, chữ sát nhau, tâm ở y 1330 / 1920 (69 %), câu xây từng từ (mỗi từ mờ hiện), từ khoá trên khối cam `#DC6331` bo nhỏ, chữ trắng. Không có caption trong 5 s đầu (tiêu đề đã nói cùng câu).
- Bản chép: engine `dim` + `curPill` (từ đang nói lên khối cam, theo yêu cầu của bạn), Inter 800 cỡ 74, tracking -0,045, 1 đến 3 từ, `captions.hide` trên hook.

## Graphic và hình ảnh
- **Nền**: kem `#F4EEE4`, quầng hồng đào lớn góc trên trái, quầng vàng nhạt bên phải, quầng xanh nhạt góc dưới phải, lưới chấm xám mờ 54 px. 6 đến 9 sticker nhỏ trôi chậm: sao cam và hồng viền trắng, chấm xanh và tím, mây trắng viền đứt nét màu.
- **Hook (0 đến 4 s)**: kicker chữ hoa cam giãn chữ có chấm tròn ở y 185, tiêu đề sans rất đậm sát chữ khoảng 92 px xây từng từ theo lời, MỘT cụm in nghiêng serif màu cam ("hour-long"). Dưới là cửa sổ video 3D nghiêng (thanh trình duyệt 3 chấm, nút play đỏ, thanh tiến trình, timecode mono, chip timecode cam) bay vào từ xa, đổi nội dung theo từng từ.
- **Thẻ**: cửa sổ trắng hoặc đen rộng khoảng 900 px, bo 26 px, bóng mềm sâu, nghiêng 3D, bay vào từ xa có blur (0,45 s), chồng lên nhau (thẻ mới nằm trước, lệch), rời đi bằng bay lên mờ đi. Mỗi 1 đến 2 s có gì đó đổi: số đếm, chữ gõ, chip rơi xuống, dấu tick.
- **Chip**: pill trắng có icon + số lớn đếm lên ("60,000 views"), chip đen có icon lịch ("In 2 days"), huy hiệu tròn logo thật viền cam, thanh prompt có nút gửi cam, chip file có tick xanh.
- **Mascot gốc**: con cua pixel (giống mascot của Anthropic). Bản chép: mascot riêng của kênh (spark san hô, `assets/components/buddy.js`), nhỏ, đậu trên góc thẻ, nhảy sang thẻ mới, đổi biểu cảm.
- **CTA gốc**: thẻ trắng "Comment" + nút cam "CARTOON" gõ từng chữ, dòng viết tay cam "the first 150 people get my full setup free", hàng mascot.

## Âm thanh
- Gốc: chỉ giọng, không nhạc (khoảng lặng đen tuyệt đối trên phổ), vài tiếng chuông ngắn trên các khoảnh khắc chốt (3,5 s, 32 đến 35 s, 36,5 s).
- Bản chép: giọng + nhạc nền nhỏ theo yêu cầu của bạn (`code-noir` cho Claude Code / xây dựng, `arpege` cho tin AI, `enquete` khi không chắc), chuông `bell` -14 chỉ ở 2 đến 3 điểm chốt. Không click mỗi lần thẻ vào, không whoosh.

## Màu
- Nhấn `#DC6331` (đo trên khối caption), mực `#1A1716`, nền `#F4EEE4`.
- Không grade (không có cảnh quay).

## Bỏ ra
- Con cua pixel: thay bằng mascot riêng của kênh.
- Ảnh hoạt hình của người khác: thay bằng video/ảnh của bạn trong thẻ.
- Serif nghiêng gốc (kiểu Instrument Serif) không có dấu tiếng Việt: thay bằng Noto Serif Display Italic (`assets/fonts`).

## short-editing áp dụng thế nào
- Copy `assets/components/scene.html` (và `buddy.js`) sang `source/`, viết lại các beat theo `files/words.md` (thời gian SHORT): hook tiêu đề + thẻ video, rồi mỗi ý một thẻ hoặc chồng thẻ. Capture `--size 1080x1920 --dur <độ dài short>` thành `assets/scene.mp4`, gắn `media.scene` + `{ type: 'overlay', media: 'scene', from: 0 }`.
- Clip từ `takes/` làm hình: trích khung (ffmpeg) vào `assets/` và chiếu trong thẻ, không bao giờ phát tiếng của clip.
- `music: { bed }`, `sfx.extra` bell trên 2 đến 3 điểm chốt, `captions.hide` trên hook, `mix.ceil -2.2` nếu true peak vượt -1.
- Xuất `output/short-<slug>.srt` sau `all`.
- Engine: `captions.curPill` và `captions.pillText` / `pillR` (thêm vào `runtime.js` dimCaption cho style này).
