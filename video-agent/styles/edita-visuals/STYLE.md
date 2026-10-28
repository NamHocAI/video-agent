# Style: edita-visuals

Chép từ https://www.instagram.com/reel/Det_wSMtGUe/ (@edita.visuals), đo ngày 25/10/2026. Áp lên trên `short-editing/references/style.md`: cái gì không ghi ở đây thì giữ như ở đó. **Bỏ thẻ "Storyboard" bên trái** theo yêu cầu: chỉ còn thẻ video đã dựng ở giữa.

Định dạng gốc: clip podcast hai người (người dẫn và khách) cắt dọc, đặt trong một thẻ điện thoại trên nền sáng; trong thẻ có chữ động từng từ, bảng tên người nói, thẻ chữ lớn và cảnh quay rộng chen vào. Đây là một reel duy nhất, chưa đối chiếu với reel thứ hai của kênh.

## Cắt
- 28,2 s: 26,1 s nội dung rồi 2,1 s thẻ đen im lặng. Máy dò đổi cảnh (scdet 12) chỉ bắt được 6 lần ở giây 1,2 / 1,8 / 1,9 / 3,6 / 7,0 / 8,1 vì khung ngoài không bao giờ đổi, chỉ nội dung trong thẻ đổi.
- Nội dung trong thẻ đổi 1,5 đến 3 s một lần: người nói, thẻ chữ lớn, cảnh rộng, thẻ giao diện chat.
- Cắt hết khoảng lặng (chỉ 1 khoảng lặng từ 0,25 s trở lên, chính là thẻ đen cuối). Không fade, không chuyển cảnh.

## Khung hình (1080 x 1920, 60 fps)
- Nền xám trắng rất nhạt, có những tia hình sao cam đào mờ (độ rộng khoảng 150 px) sau thẻ. Handle kênh ở góc trên phải (mép phải x 952, y 135), chữ xám đậm 36 px.
- Huy hiệu tối bo tròn "Opus 5.5" (x 389 đến 700, y 287 đến 406): logo hình sao cam bên trái, chữ trắng 50 px, khoảng cách chữ rất chặt. Bản chép: logo thật của Claude và tên mô hình thực sự đã dựng video này (Sonnet 5.5), không ghi tên mô hình khác.
- Thẻ video: 540 x 960 (đúng 9:16), bo góc khoảng 46 px, bóng mềm. Ở reel gốc thẻ nằm lệch phải (x 381 đến 921, y 423 đến 1383) để chừa chỗ cho thẻ Storyboard; bản chép đặt giữa khung (x 270 đến 810, y 423 đến 1383).
- Dòng CTA hai dòng ở y 1465 và 1540, chữ 66 px, khoảng cách chữ chặt, màu gần đen, từ khóa ngoặc kép màu cam đậm: "Follow & comment “CLAUDE”" / "for the full guide".
- Trong thẻ: mặt (đỉnh tóc đến cằm) chiếm khoảng 38 % chiều cao thẻ (19 % chiều cao khung). Thẻ không đổi kích thước, không punch-in, không push (`zoom.drift: 0`). Trần cho bản chép: mặt không quá 40 % chiều cao thẻ.
- Phía dưới thẻ video có một lớp tối dần để chữ trắng dễ đọc.

## Phụ đề và chữ trong thẻ
- Nằm ở 53 đến 60 % chiều cao thẻ: một dòng dẫn 2 đến 3 từ chữ trắng in hoa nhỏ (khoảng 30 px), rồi MỘT từ hoặc cặp từ nhấn to bên dưới: serif nghiêng đậm màu cam (khoảng 64 đến 78 px, kiểu Didone) hoặc chữ trắng đậm hẹp in hoa (khoảng 70 px). Từng từ hiện đúng lúc được nói, cụm đổi cứng.
- Bảng tên người nói (khi người đó xuất hiện lần đầu, khoảng 2 đến 3 s) ở khoảng 70 % chiều cao thẻ: thanh đứng màu cam, tên chữ mono đậm 36 px, vai trò chữ mono 17 px bên dưới, chữ chạy ra từng ký tự.
- Bản chép: Inter 600 cho dòng dẫn, Cambria in nghiêng đậm màu cam (có đủ dấu tiếng Việt) hoặc Archivo 900 hẹp cho từ nhấn, JetBrains Mono cho bảng tên.

## Thẻ chữ và hình chen vào
- Thẻ chữ lớn: nền trắng chấm bi, nửa mặt trời cam ở góc trên phải với vài đường mảnh đen tỏa ra, đầu mỗi đường có chấm cam; dòng to chữ đen cực đậm, khoảng cách chữ rất chặt (khoảng 125 px), dòng nhỏ 52 px có thanh nhấn màu cam dưới vài từ đầu.
- Thẻ giao diện chat: nền gradient cam đào mờ, thanh kem có ảnh đại diện nhỏ, ngày và dòng đang gõ ("Oh hey, can you pro|").
- Cảnh quay thật chen vào: cận đồng hồ, ghép logo công ty, chữ trên nền tối, hai cảnh rộng căn phòng. Bản chép thay bằng thẻ chữ và cảnh rộng của chính video.
- Thẻ chữ chỉ lặp lại những gì đang được nói, không thêm ý.

## Âm thanh
- Chỉ có giọng hai người, không nhạc nền. -14,1 LUFS, LRA 5,1 LU. Phổ âm thanh không có dải nhạc nào.
- Khoảng yên (5 % thấp nhất) ở -41,4 dB so với giọng khoảng -20,1 dB, tức cách 21 dB: là tiếng phòng thu đã khử nhiễu, không phải nhạc. Hai tiếng "ting" rất nhỏ ở khoảng giây 16 (lúc tin nhắn gửi đi trong thẻ chat) và giây 26. Chưa tách giọng bằng ElevenLabs nên chưa đo chính xác hơn.
- Bản chép: không nhạc (`music.mute: true`), không whoosh, không click khi cắt; nhiều nhất một tiếng `pop` rất nhẹ khi hiện thẻ chữ.

## Màu
- Nền sáng trung tính, điểm nhấn cam (#E8714A). Video trong thẻ giữ màu tự nhiên (không áp `grade`).

## Bỏ ra
- Thẻ "Storyboard" (hình phác thảo nét đen của từng cảnh) và nhãn của nó: theo yêu cầu.
- Tên mô hình "Opus 5.5": thay bằng mô hình thật đã dựng (không tự nhận một mô hình khác).
- Cảnh quay thật chen vào (đồng hồ, logo công ty): không có trong video của bạn.
- Từ khóa "CLAUDE": thay bằng từ khóa của hướng dẫn bạn gửi (mặc định "EDIT").

## short-editing áp dụng thế nào
- `layout.card` = {x 270, y 423, w 540, h 960, r 46} và `paper.bg: 'clean'`; `captions.hide [[0, 999]]` vì chữ do `edita.html` vẽ.
- Khung quanh thẻ (nền, tia, huy hiệu, handle, CTA, lỗ cho thẻ camera) và mọi thứ trong thẻ (bảng tên, chữ động, thẻ chữ) nằm trong MỘT component alpha: copy `assets/components/edita.html` sang `source/edita.html`, điền `window.EDITA` từ `files/words.md` (thời điểm tính theo giây của bản dựng), `capture --alpha`, `prepare` lại, gắn bằng scene `overlay` từ 0 đến hết.
- Khung camera trong thẻ: `cam.crop` cho cả khung hình, `eyes` ở mắt người nói, `layout.card.zoom` để mặt chiếm khoảng 38 % chiều cao thẻ; đo bằng `vision-web.mjs faces`, không đo bằng mắt.
- Chỉ dùng đoạn mà người nói được quay liền một cảnh (engine giữ một khung cắt cho cả video); không dùng đoạn đổi giữa hai máy quay.
- Thứ tự dựng: `prepare` với spec CHƯA có media lớp phủ; chạy `assets/components/gen_edita.py <dự án> <plan.json> pre` để tạo `edita-config.js`; `capture` `edita.html`; chạy lại `gen_edita.py` không có `pre` (ghi spec có lớp phủ); `prepare` lại (bắt buộc sau mỗi lần capture); `all`. Không để mục `music` trong spec (style tắt nhạc).
- Mọi cụm chữ, thẻ và nhãn minh hoạ được đặt theo những từ người nói thật sự nói (file `plan-example.json` liệt kê từng cụm, thẻ, nhãn theo câu chữ), nên đổi đoạn cắt hay bóc băng lại không cần sửa giờ bằng tay.
- Nếu lấy podcast từ YouTube: tải bản có sẵn mp4 + m4a (định dạng 137 + 140), cắt đoạn bằng ffmpeg trên file đã tải; tải theo `--download-sections` ở định dạng DASH có thể đứng rất lâu. Nhiều Shorts podcast đã có phụ đề đốt sẵn, logo kênh và đổi máy quay nên chồng với chữ động của style này: ưu tiên đoạn gốc quay liền một máy.

## Phần thêm so với reel (theo yêu cầu "hấp dẫn và đặc sắc hơn")
- Sóng âm chạy theo mức giọng thật (30 giá trị mỗi giây lấy từ `voice.wav`) ở đáy thẻ, thanh tiến độ cam dưới thẻ, câu trích mở đầu ở đầu thẻ (đúng lời khách, hiện trước khi được nói), chip nguồn ở góc thẻ và dòng nguồn ở cuối khung (ghi nguồn kênh), tia hình sao xoay chậm, huy hiệu "thở" nhẹ, dòng CTA trượt vào.
- Nhãn minh hoạ nhỏ nổi cạnh mặt đúng từ khoá (lịch, bánh răng, vòng quay trở lại, dấu tick, cửa hàng, túi mua sắm) và hình minh hoạ trong thẻ chữ (đội nhóm, biểu đồ tăng trưởng, thùng hàng, túi mua sắm). Tất cả vẽ bằng code (`edita-icons.js`), không dùng logo hay nhân vật có sẵn.
- Chữ từng từ có hiệu ứng bật nhỏ và vệt nhấn cam quét dưới từ lớn.

## Kết quả dựng thử (25/10/2026)
- Nguồn: podcast VIETSUCCESS "Phạm Chí Nhu - CEO Coolmate" (Blue Venture Series EP17), đoạn khoảng 10:20 đến 10:46, khách mời quay liền một cảnh, 1080p. 25,9 s thô thành 18,8 s sau khi bỏ nửa câu đầu và khoảng lặng. Dự án: `video-agent/edits/short-podcast-coolmate-edita`.
- Số đo: -14,0 LUFS, true peak -1,4 dBTP. Mặt (đỉnh tóc đến cằm) trung vị 38 % chiều cao thẻ (reel gốc khoảng 38 %), thấp nhất 31 %, đỉnh 43 % trong vài khoảnh khắc khi khách nghiêng người (đo bằng máy dò mặt, đối chiếu với một khung đo tay). Thẻ không đổi kích thước. 10 cụm chữ, 3 thẻ chữ, 6 nhãn minh hoạ.
- Âm thanh: giọng khách, 3 tiếng whoosh rất nhỏ vào mỗi thẻ chữ và vài tiếng pop nhẹ khi thẻ hoặc nhãn hiện. Log của engine vẫn in dòng "bed -28 LUFS" dù style tắt nhạc; phổ âm thanh của bản xuất chỉ có giọng, chưa xác nhận bằng tai.
- Lệch reel: reel có thêm cảnh quay thật chen vào (đồng hồ, logo công ty, cảnh rộng hai người) và người dẫn chương trình; podcast này chỉ có một cảnh khách mời nên thay bằng thẻ chữ và nhãn minh hoạ.
- Quyền sử dụng: clip thuộc kênh VIETSUCCESS, chỉ dùng để thử style; cần xin phép trước khi đăng.
