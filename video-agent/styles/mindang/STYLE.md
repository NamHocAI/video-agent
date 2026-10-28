# Style: mindang

Học từ reel @mindang.com19: https://www.instagram.com/reel/De4D7stBc8T/ (42 s, 1080x1920, 30 fps), đo ngày 26/10/2026.
Áp lên trên `style.md` của short-editing: cái gì không ghi ở đây thì giữ như ở đó.
Không đụng tới `buildwithdarius-ai` và `kem-3d` (style lấy từ @guipaulinooo).
Ảnh mẫu: `stills/` (t1 = mở đầu, t6 = B-roll, t11 = so sánh đồng hồ, t17.5 / t21 = quay màn hình, t26 = đoạn phụ đề trên màn hình, t33.5 = kết quả nền tối, t36.5 / t38.5 / t40 = CTA).

## Cắt cảnh
- 10 lần đổi cảnh trong 42 s (scdet 12): trung bình **3,8 s / cảnh**. Cảnh ngắn nhất 1,7 s (B-roll), dài nhất 9,3 s (quay màn hình).
- **Chỉ cắt thẳng**: không mờ dần, không whip, không glitch. Bên trong một cảnh, các phần tử hiện mờ dần (.25 s), không trượt, không nảy.
- Mọi khoảng lặng bị cắt, nhịp nói nhanh nhưng không gấp (tốc độ ~1,05 đến 1,1).

## Khung hình và zoom
- Cảnh nói: người được **tách nền** đứng giữa đáy khung trên nền giấy kem, đỉnh tóc ~y 1090, mặt (tóc tới cằm) **24 đến 26 %** chiều cao khung, ngực bị mép dưới cắt. Không có phòng phía sau.
- **Không zoom** trên cảnh nói: cỡ mặt đứng yên suốt video, không punch-in, không đẩy chậm. Zoom chỉ nằm ở quay màn hình (zoom/pan chậm vào đúng chỗ đang nói).
- B-roll quay thật: mặt ~28 đến 32 %, máy cầm tay, không zoom thêm.

## Phụ đề
- Montserrat Bold ~62 px (cao chữ ~45 px trên 1080), chữ thường đầu câu viết hoa, 2 đến 4 từ, 1 dòng, căn giữa.
- Vị trí: **y ~1010** (giữa bảng phía trên và đỉnh đầu) trên nền giấy; **y ~1480** trên B-roll / nền tối.
- Màu: mực đen #191813 trên giấy, trắng có bóng mềm trên video. **Mỗi dòng 1 từ xanh** #2F7BDB (từ khoá, con số, tên công cụ).
- Cả cụm hiện cùng lúc khi câu tới (cắt thẳng, không khối nền, không viền); engine: `captions.style: band`, `bg: none`, `color` mực, `hi` xanh. Gốc có thêm hiệu ứng mờ → nét rất nhanh ở từ đầu, engine chưa làm được kiểu này khi hiện cả cụm.
- Đoạn nền tối / video: tắt phụ đề engine (`captions.hide`) và viết dòng trắng ngay trong component của đoạn đó ở y ~1480.

## Bảng, chữ, màn hình (nửa trên, y 230 đến 900)
- **Dòng tiêu đề serif**: Noto Serif Display đậm, mực đen, 1 từ nghiêng màu xanh ("Hỏi bài vs *Xong slide*", "Bộ *prompt*"). Có thể có chip đen tròn "vs" giữa hai vế.
- **Thẻ UI trắng** bo góc ~24 px, bóng rất nhẹ, logo thật (Gemini, Canva). Thẻ **đổi trạng thái theo lời nói**: đồng hồ chạy 0 giờ → 2 giờ → 3 giờ, slide lấp dần, ô check tick dần.
- **Sticker chữ**: cụm serif nghiêng xanh trong khung viền xanh mảnh nền trắng, nghiêng -3 đến -6°, bật ra đúng từ ("15 phút", "vài phút", "100+ trang", "càng rõ, càng sát"). Mỗi lúc 1 cái.
- **Đồng hồ**: mặt đồng hồ vẽ nét + số serif lớn ("*2* tiếng" → "*3* tiếng"), kim quay khi nói số.
- **Logo + logo**: "Gemini + Canva" hai ô logo thật có tên bên dưới.

## Quay màn hình
- Cắt thẳng sang UI thật **toàn khung** (nền gradient xanh nhạt của Gemini), zoom/pan chậm tới đúng nút/ô đang nói, con trỏ thật.
- Pill bước số ở góc trên trái: chấm xanh có số + "Tải tài liệu lên Gemini", "Dán prompt lên dàn ý", "Kêu Gemini tạo slide trên Canva".
- Bút dạ vàng tô từng dòng được nhắc + chip câu hỏi xanh ("môn gì?", "ai nghe?", "bao lâu?", "mấy slide?") hiện lần lượt theo lời.
- Phụ đề vẫn ở y ~1010, mực đen.

## B-roll
- Cảnh quay thật của chính người nói đang làm việc được kể (ngồi làm slide tới khuya), **cắt thẳng, toàn khung, 4 đến 6 s**, chuỗi 2 góc máy.
- Chip đồng hồ chạy ở góc trên phải ("☾ 22:40" → "03:58", pill đen bo tròn, chữ mono trắng) + nhãn giấy trắng góc trên trái chữ serif nghiêng xanh ("tối *khuya*", "copy *từng ý*", "căn *từng ô chữ*").
- Phụ đề trắng ở y ~1480.

## Cảnh kết quả
- Nền tối phẳng #191813, tiêu đề "✓ *Kết quả*" serif nghiêng xanh ở y ~330, màn hình kết quả (slide Canva) thành thẻ rộng ở giữa, phụ đề trắng y ~1480.

## CTA (5 s cuối)
- Trên người tách nền: thẻ checklist trắng "Bộ *prompt*" với ô tick lần lượt theo lời ("Lên dàn ý", "Thiết kế slide"), rồi bong bóng chat đen `comment "slide"` (từ khoá serif nghiêng), rồi thẻ quà tặng có tag xanh "miễn phí".

## Âm thanh
- Tách giọng (ElevenLabs isolation): giọng khi nói -17,4 dB, cả bản mix lúc giọng im -43,5 dB (3,3 s đo được) → **nhạc nền ~26 dB dưới giọng**, gần như không nghe thấy. Tổng -14,1 LUFS.
- Phổ âm: **không có hiệu ứng âm thanh** trên các lần cắt, sticker hay thẻ (không thấy vệt click/boom nào ở 4 lần cắt đã soi).

## Màu
- Giấy #F5F4EC có vân vải lanh rất mịn, mực #191813, nhấn xanh #2F7BDB, thẻ trắng #FFFFFF, nền tối #191813.
- Grade camera tự nhiên, sáng, không tương phản mạnh (`grade: true`).

## Bỏ ra
- Nội dung riêng của reel (Gemini, Canva, bộ prompt "slide"): chỉ lấy ngữ pháp, nội dung lấy từ lời người nói.
- Không chép 100 %: bảng nào cũng neo vào từ người nói thật nói.

## short-editing áp style này thế nào
- `layout.keys: [[0, 1920]]` + `cutout: {from: 0, to: <hết>, hard: true, scale, bottom}` (chỉnh scale/bottom cho mặt 24 đến 26 %, đỉnh tóc ~y 1090).
- Bảng nửa trên = component HTML (`assets/components/`) capture `--alpha`, gắn `overlay` layer stage; đổi bảng bằng cắt thẳng.
- `captions.emph` = 1 từ khoá mỗi dòng (hiện màu `captions.hi`); `captions.yKeys: [[0, 1010]]`; đoạn tối/video: `captions.hide` + phụ đề trắng trong component.
- B-roll: `broll` với `hard: true`; chip đồng hồ và nhãn giấy là overlay HTML.
- `music`: 1 bed êm, `mix.music` -40; `sfx`: không có gì.
