# Style: buildwithdarius-ai

Chép từ https://www.instagram.com/reel/DeiO5xyPcAp/ (@buildwithdarius.ai), đo ngày 24/10/2026. Áp lên trên `short-editing/references/style.md`: cái gì không ghi ở đây thì giữ như ở đó.

Định dạng gốc: tutorial faceless, chỉ có giọng đọc, toàn bộ là motion design trên nền giấy ("7 bước"). Hợp đúng kênh @namhocai (lồng tiếng + quay màn hình).

## Cắt
- 0 điểm cắt cảnh trong 73,2 s (scdet ngưỡng 12 và 5): không có cảnh quay, chỉ có motion design liên tục.
- Đổi bước bằng blur: tiêu đề cũ mờ đi rồi tiêu đề mới mờ hiện, không có cut cứng, không trượt.
- Giọng: 34 khoảng lặng, tổng 14,3 s, trung bình 0,42 s, dài nhất 2,4 s. Khoảng lặng giữa các câu được giữ lại, nhịp thở chậm rãi. Không tăng tốc (`pace.speed: 1.0`).

## Khung hình
- Không có mặt, không có camera. Chỉ nền giấy (`layout.seam: 1920`), không zoom, không push.

## Phụ đề
- Sans đậm kiểu SF Pro, màu đen, khoảng 44 px trên khung 1080, chữ thường, 2 đến 3 từ một cụm, ở y khoảng 1460 / 1920 (76 %).
- Mỗi từ mờ hiện khi được nói, từ sắp nói còn xám. Từ khoá (tên công cụ, động từ của bước) tô màu nhấn.
- Bản chép: Inter 700, cỡ 46, `rise` + `block: false`, `paperY: 1460`.

## Graphic và hình ảnh
- **Nền**: giấy kem `#F1ECE6`, vài vệt sáng hồng đào mờ trôi rất chậm.
- **Hook** (0 đến 5 s): nhãn nhỏ in hoa màu nhấn "A TUTORIAL FOR BEGINNERS", tiêu đề serif hẹp 3 dòng ở giữa khung, dòng cuối in nghiêng màu nhấn ("Claude Code✱"), rồi một thanh sóng âm. Sau đó "So *easy.*" có gạch chân vẽ tay, rồi số lớn "chỉ **7** bước" bằng serif nghiêng màu nhấn.
- **Mỗi bước**: thanh tiến trình 7 đoạn ở trên cùng (y 212), nhãn "STEP n" in hoa màu nhấn, tiêu đề serif hẹp khoảng 118 px canh trái, động từ thường + danh từ in nghiêng màu nhấn ("Add your *references*").
- **Thẻ chính**: dưới tiêu đề là MỘT giao diện dựng lại, rộng khoảng 900 px, trắng, bo 18 px, đổ bóng mềm. Gồm cửa sổ terminal Claude Code gõ lệnh, 3 thẻ video có logo Instagram/TikTok/YouTube, thẻ STYLE.md có checklist, công tắc kết nối app, lưới ảnh đang "Generating…". Thẻ đổi trạng thái theo từng từ.
- **CTA**: "Comment" serif lớn, từ khoá chữ trắng đậm trên nút màu nhấn bo tròn, bên dưới là 3 chip trắng có logo thật ("My video editing skill", "Apify connector"…) và dòng nhỏ "I'll send them to your DMs".

## Âm thanh
- Chỉ có giọng. Khoảng lặng là im lặng tuyệt đối trên phổ âm thanh: không nhạc nền, không hiệu ứng âm thanh, không click.
- Bản chép: `music.mute`, `sfx.mute`.

## Màu
- Màu nhấn gốc là cam đất `#C9604A`. Bản chép dùng màu thương hiệu `#EF5D0C` của bạn; muốn giống bản gốc hơn thì đổi `colors.accent` và `TUT.accent`.
- Không có grade (không có cảnh quay).

## Bỏ ra
- Font serif hẹp gốc (kiểu Instrument Serif) không có dấu tiếng Việt: thay bằng Noto Serif Display, độ rộng 62,5 %, có bản nghiêng (`assets/fonts/`).
- Ảnh video của người khác trong thẻ: thay bằng video quay màn hình hoặc ảnh của bạn.
- Logo Higgsfield, Apify: chỉ thêm khi bạn thật sự dùng các công cụ đó.

## short-editing áp dụng thế nào
- Khung: copy `assets/components/steps.html` sang `source/steps.html`, sửa `window.TUT` (hook, danh sách bước, `at` = thời gian SHORT lấy từ `files/words.md`), capture `--alpha --dur <độ dài short>`, gắn `overlay` từ 0.
- Video quay màn hình: actor `media` dạng thẻ trắng, rộng 900 đến 960 px, y khoảng 480 đến 1300, đổi khung khi sang bước mới.
- Claude Code: board item `term` có logo thật. Các UI khác: component HTML riêng (sub-agents.md).
