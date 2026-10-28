# Style: chia-se-meo

Lấy từ reel @wipill (Mn Nhi): https://www.instagram.com/p/Dd_NUpGzqxk/ (91,8 s, 1080x1920, 30 fps), đo ngày 28/10/2026.
Dạng video: nói chuyện trước camera, chia sẻ mẹo / các bước (mẹo học, kinh nghiệm), chữ tiêu đề theo bước + sticker vẽ tay dễ thương.
Áp lên trên `style.md` của short-editing: cái gì không ghi ở đây thì giữ như ở đó.
Ảnh mẫu: `stills/` (t0.5 mở đầu có logo, t5.5 / t7.8 khung doodle toàn màn hình, t9.5 / t22 tiêu đề bước, t47.23 / t48.6 / t55.5 sticker và chữ bay quanh đầu, t91.6 kết).

## Cắt cảnh
- 32 lần cắt nhảy (jump cut, scdet 5) trong 91,8 s: trung bình **2,8 s / cảnh**. Cùng 1 khung hình, chỉ cắt bỏ đoạn thừa giữa câu.
- **Chỉ cắt thẳng**: không mờ dần, không chuyển cảnh.
- Mọi khoảng lặng bị cắt: khoảng nghỉ còn lại 0,1 đến 0,38 s.

## Khung hình và zoom
- **Toàn khung camera suốt video** (không chia đôi, không nền giấy). Máy đặt chân, không rung.
- Mặt (tóc tới cằm) **22 đến 32 % chiều cao khung, trung vị 24 %**; mắt ở 42 % từ trên xuống; khung cắt ở eo. **Phía trên đầu chừa ~30 % khung** cho tiêu đề.
- Zoom gần như không có: **2 lần trong 92 s** (0,22 lần / 10 s), nhảy 1,11x đúng lúc cắt rồi đẩy chậm tới hết cảnh (1,11 → 1,23 trong 0,9 s). Cảnh sau về 1,0.
- Bản copy: không zoom mặc định; tối đa 1 lần punch-in 1,1 cho khoảnh khắc đắt nhất của video, giữ tới lần cắt sau.

## Chữ (không có phụ đề chạy theo lời)
- **Không có phụ đề từng chữ.** Chỉ có chữ tiêu đề theo ý, đặt ở vùng trống phía trên đầu (y ~230 đến 560 trên 1920).
- Cấu trúc 1 khối, căn giữa, các dòng hiện dần **đúng lúc nói tới**:
  - nhãn nhỏ "Bước 1:" / "bước 2": chữ thường, ~44 px, đậm, y ~300
  - **tiêu đề lớn**: in hoa kiểu small caps (chữ đầu cao, các chữ sau thấp hơn), rất đậm, ~68 px, chiếm 55 đến 90 % bề ngang, y ~395. Chữ **gần đen #1C1C1C, viền dày màu bạc hà nhạt #DCF7F2** (~7 px) để nổi trên tường xám
  - dòng phụ: chữ thường, đậm vừa, ~44 px, màu bạc hà nhạt #DCF7F2 viền tối mảnh, y ~490. Có thể 2 dòng phụ.
- Font bản copy: tiêu đề **Sigmar** (`font-variant: small-caps` với chữ thường để ra kiểu small caps), nhãn và dòng phụ **Be Vietnam Pro Bold** (cả hai có dấu tiếng Việt, ở `assets/fonts/`).
- Cách hiện: bật ra cứng (1 khung hình), không mờ dần, không trượt. Đổi ý = cả khối thay ngay.
- **Danh sách**: tiêu đề nhỏ trong ngoặc "| so sánh: lúc mới học |" rồi các dòng "1. ...", "2. ..." nhỏ (~30 px), căn trái ở góc trên trái, mỗi dòng hiện đúng lúc nói.
- **Chữ bay quanh đầu**: từ khoá ngắn (2 đến 3 từ: "quá tải", "bị loãng", "lạc lối", "cơ chế / mechanism") ~34 px, nghiêng 10 đến 20°, đặt sát hai bên đầu, hiện lần lượt theo lời.
- **Gạch bỏ**: chữ trắng ở ngực ("ứng dụng kết quả") rồi 1 vòng tròn đỏ + dấu X đỏ đè lên khi nói "không phải".
- Chữ tiếng Anh nhỏ dưới từ tiếng Việt khi giải thích thuật ngữ ("nguyên lý / principle").

## Sticker và hình
- **Khung doodle vẽ tay toàn màn hình** (mặt trời cười, cầu vồng, mây, hoa cúc, bướm, tim, mèo nét bút sáp, sao lấp lánh) cho khoảnh khắc vui / kết quả tốt ("Trên 8.0", "NHƯNG CHƯA HẾT..."): 1 đến 2 s, khoảng 3 lần trong 92 s. Người vẫn ở giữa, doodle ở viền.
- **Sao vàng viền vẽ tay** (5 đến 6 cái) rải quanh người khi đang liệt kê, lấp lánh nhẹ.
- **Ảnh meme** (mèo, ếch Pepe, "you are my GOAT"): ~25 đến 35 % bề ngang, không viền, bật ra cứng ở cạnh người, 1 đến 2 s. Bản copy: KHÔNG chép meme của người khác; dùng ảnh/sticker của chính bạn hoặc doodle tự vẽ.
- **Logo thật** khi nhắc tên trường / app (logo BK ở mở đầu, góc trên phải, ~12 % bề ngang).

## Mở đầu (2 s đầu) và kết
- Mở đầu: dòng nhỏ viết tay "hồi đại học (lúc chưa có a.i)" góc trên trái + logo thật góc trên phải + câu hứa ở ngực, 3 dòng căn giữa: "Cách mình vừa **LÀM 2 JOB** / phụ đóng học phí / & đạt **3.2 GPA**" (từ khoá vàng #F5E642 in hoa kiểu small caps, phần còn lại trắng) + "(vừa đủ)" nhỏ.
- Kết: tiêu đề ý cuối ("ONE NIGHT FOR ALL") rồi vài giây mặt cười không chữ, sticker meme nhỏ ở góc dưới trái ở khung cuối. Không có thẻ CTA.

## Âm thanh
- **Nhạc nền lofi nhẹ** (pad + bass giữ nốt, không trống mạnh), ~83 BPM, vào từ 0,9 s và chạy tới hết, không ngắt. Nằm **~15 dB dưới giọng** (giọng -16,3 dBFS, nhạc trong khoảng lặng ~ -31 dBFS). Bản copy: `assets/music/lofi-nuit.mp3` (tự tạo, 74 BPM, không bản quyền), `mix.music -30`.
- Tổng -14,0 LUFS, đỉnh -3 dBTP, giọng nén mạnh, sáng, khử ồn.
- Gốc có ~2 tiếng / 10 s (ding/chime, whoosh+thud, bloop, click, 1 riser); chỉ 1/3 số lần cắt có tiếng; boom chỉ 2 lần (8,8 s và 21,7 s).
- Bản copy giữ phần đắt, bỏ phần gây ồn (theo learnings của /steal): **ding (`bell`) khi một "Bước N" mới hiện**, **pop khi khung doodle / sticker bật ra**, **1 boom (`assets/sfx/impact-boom.mp3`) cho khoảnh khắc lớn nhất**. Tổng 3 đến 5 tiếng một short. Không whoosh, không click, không riser.

## Màu
- Sáng, mềm, ít bão hoà, kiểu pastel: độ sáng trung bình Y ~142/255, bão hoà ~10 (rất thấp), da hồng nhẹ, ảnh mềm (có filter làm đẹp).
- Bản copy: sáng lên nhẹ, tương phản giảm chút, bão hoà giảm ít, **không kéo đỏ/cam khỏi da** (`grade` trong style.json). So màu da với `stills/t9.5.jpg` trước khi giao.

## Bỏ ra
- Meme và ảnh của người khác: thay bằng ảnh của bạn hoặc doodle tự vẽ.
- Whoosh, click, riser, bloop ở mỗi lần hiện chữ: gây ồn (đã bị chê ở style trước).
- Nội dung riêng (học BK, GPA): chỉ lấy ngữ pháp dựng, chữ lấy từ lời bạn nói thật.

## short-editing áp dụng thế nào
- `layout.keys: [[0, 0]]` (toàn camera), `captions.hide: [[0, <hết>]]` trong spec: không phụ đề chạy.
- Toàn bộ chữ tiêu đề, danh sách, chữ bay, doodle, sao: **1 component HTML trong suốt** `source/stage.html` (như `short-vid-tho-24s-mindang`), capture `--alpha`, gắn bằng scene `overlay` từ 0 tới hết. Fonts lấy từ `assets/fonts/` của style.
- Mỗi ý của lời nói = 1 khối tiêu đề (nhãn + tiêu đề + dòng phụ), mỗi dòng hiện đúng giây của từ đó (giờ SHORT từ `files/words.md`).
- `cam.crop` chọn để mặt (tóc tới cằm) ~24 % chiều cao khung, mắt ở ~42 %, chừa 30 % phía trên cho chữ.
- Âm: `sfx.extra` = `bell` ở mỗi "Bước N", `pop` ở mỗi khung doodle; `sfx.files` = 1 `impact-boom` ở khoảnh khắc lớn nhất.
