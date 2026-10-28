# Style: cindie-zhu

Chép từ https://www.instagram.com/reel/DYh0vdAv2_s/ (@cindie.zhu), đo lại từ đầu ngày 24/10/2026 (ghi đè bản đo trước). Áp lên trên `short-editing/references/style.md`: cái gì không ghi ở đây thì giữ như ở đó.

Định dạng gốc: talking head quay một mạch, video dạng danh sách ("7 skills"), graphic dán lên video. Kênh @namhocai là faceless (lồng tiếng + quay màn hình): màn hình quay chiếm cả khung, graphic dán lên y như vậy.

## Cắt
- Gần như một cảnh quay duy nhất: 3 lần đổi khung trong 72,7 s (scdet ngưỡng 12, ở giây 33,4 / 39,7 / 40,5), tức khoảng 18 s một cảnh.
- Nhịp nằm ở jump cut và graphic: 61 thay đổi hình trong 72,7 s ở ngưỡng 5, tức khoảng 1,2 s lại có một thứ đổi.
- Mọi khoảng lặng bị cắt: chỉ 1 khoảng lặng ≥ 0,25 s trong cả video. Không fade, không chuyển cảnh.

## Khung hình
- Mặt (đỉnh tóc đến cằm) chiếm 25 đến 30 % chiều cao khung, đo trên khoảng 10 ô ở 2 ảnh/giây. Mặt to hơn một chút khi người nói nghiêng về phía trước, không do zoom. Không punch-in, không push (`zoom.drift: 0`). Trần cho bản chép: mặt không quá 30 %, không punch-in.
- Faceless: crop `cam` vào vùng đang thao tác trên màn hình, giữ nguyên suốt; không zoom vào ra.

## Phụ đề
- Gốc: sans tròn kiểu Poppins SemiBold, trắng, chữ thường, khoảng 55 px trên khung 1080, bóng mờ nhẹ, ở ngang ngực (y khoảng 1480 / 1920).
- Mỗi từ hiện ra đúng lúc được nói (từ chưa nói còn mờ), tối đa 3 đến 4 từ một cụm.
- Bản chép: Inter 700 (Poppins không có dấu tiếng Việt), `rise` + `block: false`, `fullY: 1480`.

## Graphic và hình ảnh
- **Tiêu đề hook** (0 đến 4 s), góc trên: dòng nhỏ viết tay "how to turn", MỘT từ cực to màu nhấn ("Claude", serif đậm màu cam san hô), "into your", rồi nhãn giấy xé "creative studio". Bản chép: từ to dùng Archivo 800 màu #EF5D0C.
- **Nhãn giấy xé**: chữ marker đen trên dải giấy trắng mép răng cưa, nghiêng 2 đến 4°, cỡ chữ khoảng 90 px. Bật lên đúng từ đang nói, chồng lần lượt từng nhãn ("messaging", "hooks", "CTA"). Có lúc bị gạch đỏ ("No ~~Editing~~ needed").
- **Mục danh sách**: số trên ô giấy xé nhỏ + tên mục (serif đậm) trên dải giấy + dòng phụ viết tay bên dưới ("ads-extractor"). Nằm trên đầu (y 250 đến 450), có icon pixel phía trên. Sang mục mới thì xoá mục cũ.
- **Card ảnh hoặc màn hình**: mỗi lần một card chữ nhật, rộng 55 đến 70 % khung, giữa khung (y 600 đến 1000, che cả mặt), bật vào và cắt ra cứng. Ảnh meme, screenshot UI, trang GitHub, mockup điện thoại. Thường có nhãn giấy xé đè lên mép dưới.
- **CTA cuối**: nhãn giấy xé ("Skills") đè lên phụ đề ở ngực.

## Hook chia đôi (reel https://www.instagram.com/reel/DcfVitVBWKp/, đo 24/10/2026)
- Reel 33,6 s, 10 lần đổi khung (scdet 12), khoảng 3,4 s một cảnh. Không còn khoảng lặng nào ≥ 0,25 s. -14,1 LUFS, LRA 4,3 LU.
- 0 đến 5,6 s: nền là chính camera, phóng to và làm mờ rất mạnh, tối đi. Trên đó: dòng viết tay nhỏ "How to", dải giấy xé trắng với chữ serif đậm "Edit Videos", dòng "using" viết tay + "AI" màu nhấn đỏ. Dưới tiêu đề: thẻ trái cao (khoảng 42 % rộng, 44 % cao khung) là bản "AI" (người cắt rời trên collage giấy xé, chữ khổng lồ phía sau, sticker, bánh răng; đổi nền 3 lần trong 5 s), thẻ phải nhỏ (khoảng 23 % rộng) là bản "original". Mỗi thẻ có một dải giấy xé viết tay ở trên ("Gemini omni flash", "original").
- Sau đó cắt cứng sang camera nét toàn khung. Mặt chiếm khoảng 30 % khung, to hơn bản dựng thường.
- Thân bài: logo chip ở góc trên, nhãn giấy xé ("Graphic", "Cut", "Texture") kèm thẻ ảnh nhỏ, ảnh màn hình có ô đỏ và mũi tên, nhãn bước "How you do it:", CTA "Comment Edit" chữ to ở dưới.
- Âm thanh: không có nhạc nền (không có dải nhạc trên phổ), vài tiếng "ding" nhỏ theo nhóm ở khoảng giây 3,7 / 25 / 27 / 31.
- Bản chép (video-agent/edits/short-vid-tho-cindie-zhu, `source/hook.html`): nền mờ + dải "Cách dựng video bằng AI" + thẻ "bản dựng bằng AI" (chính take của bạn đóng khung trên giấy, 3 nền đổi ở giây 1,45 và 2,85, không cắt người ra vì chưa dùng cutout) + thẻ "gốc". Giờ nói và hình đồng bộ vì lấy khung từ chính take.
- Chưa làm được: người cắt rời thành nhân vật, chữ khổng lồ phía sau đầu, logo chip và CTA "Comment Edit" (video của bạn không nói CTA).

## Âm thanh
- Âm lượng tổng -14,5 LUFS, LRA 3,4 LU (chỉ giọng nói, cắt hết khoảng lặng: 1 khoảng lặng ≥ 0,25 s ở -38 dB).
- Nhạc nền: không thấy dải nhạc đều nào trên phổ âm thanh, không có beat. Những khung gần như im có mức -53 dB (5 % thấp nhất) so với giọng khoảng -21 dB, nên nếu có nhạc thì thấp hơn giọng ít nhất 30 dB. Chưa tách giọng bằng ElevenLabs (tốn credit) nên chưa đo được chính xác. Bản chép: `mix.music: -40`, gần như không nghe thấy.
- Vài tiếng "ding/pop" nhỏ theo nhóm 3, đúng lúc nhãn chồng nhau (khoảng giây 27 đến 28 và 62 đến 65). Có một vệt rộng ở khoảng giây 35 (chưa xác định là gì). Không click khi cắt, không whoosh.
- Bản chép: `sfx.extra` `pop` nhỏ chỉ khi chồng nhãn, 2 đến 3 lần một video.

- Yêu cầu của bạn (24/10): muốn nhiều hiệu ứng âm thanh hơn reel gốc. Bản dựng thử có: pop khi mỗi card hiện, thud khi gạch chữ, bell khi thanh chạy xong và bảng việc tick hết, impact ở chữ "AI" của hook và câu cuối, glass-shatter ở "hoảng loạn". Không có tiếng click khi gõ, không whoosh liên tục.
- Hệ số của `sfx.extra` là tuyến tính (0,1 = nhẹ), không phải dB. `sfx.files` mới dùng dB.

## Màu
- Gốc: phòng trong nhà, ấm, tự nhiên, hơi tối. Faceless quay màn hình nên không áp grade (`grade` để trống).

## Bỏ ra
- Icon pixel con cua Claude (mascot của Anthropic): thay bằng logo thật của công cụ trong `assets/logos/`.
- Ảnh meme có bản quyền: thay bằng ảnh, screenshot của chính bạn, hoặc card dựng lại.
- Font serif đậm kiểu Cooper và Poppins: không có dấu tiếng Việt, thay bằng Archivo 800 và Inter 700.
- Tiếng ding khi từng item vào: chỉ giữ khi chồng nhãn (learnings: không chép tiếng click mỗi lần có thứ xuất hiện).

## Khung cắt của take (bài học 24/10)
- Bản dựng đầu tiên cắt chặt `cam.crop` [259, 379, 900, 1600] trên take bạn nghiêng người vào camera: mặt (đỉnh tóc đến cằm) lên 41 đến 52 % khung, trong khi reel gốc chỉ 25 đến 35 %. Nhìn bằng mắt thấy "gần giống" nhưng sai.
- Cách đo đúng: `node <short-editing>/engine/vision-web.mjs faces <project>/frames/cam out.json`, lấy chiều cao hộp giữa (median) và đỉnh, đối chiếu với một khung đầy đủ (đỉnh tóc đến cằm tính bằng px). Take này: khung [59, 85, 1294, 2300] cho mặt 30 đến 36 %.
- `frames/cam` đã được cắt theo `cam.crop`: các component dùng khung camera không cắt lần hai.

## short-editing áp dụng thế nào
- `layout.keys: [[0, 0]]` (đã có trong style): toàn màn hình suốt video.
- Nhãn giấy xé, mục danh sách, tiêu đề hook: copy `assets/components/stickers.html` sang `source/<tên>.html`, sửa `window.STICKERS` (τ = giây kể từ lúc component bắt đầu, lấy từ `files/words.md`), capture `--alpha`, gắn bằng scene `overlay`.
- Card ảnh, màn hình: board `img` hoặc `screen` ở `layer: 'over'`, rộng 600 đến 760 px, căn giữa y 800.
- Mỗi lần nói tên công cụ: logo thật, đúng từ đó.
