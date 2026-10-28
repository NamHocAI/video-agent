# Format: talking-head

Style mặc định: **`mindang`** (`video-agent/styles/mindang/`), học từ reel @mindang.com19 https://www.instagram.com/reel/De4D7stBc8T/.
Số đo gốc nằm ở `styles/mindang/STYLE.md`, ảnh mẫu ở `styles/mindang/stills/`. Giá trị cho engine: `profile.json` cạnh file này.

Lệnh: `/short-editing <take> style mindang`, rồi viết `source/spec.js` theo đúng các mục dưới.
Đọc theo thứ tự: `styles/mindang/WORKFLOW.md` → `ENGINE.md` → file này. Không đọc lại tài liệu dài của skill.

---

## 1. Clip đầu vào

- 1 người nói thẳng vào camera, 15 đến 60 s, quay dọc (9:16, 1080x1920 trở lên), có tiếng.
- Đứng hoặc ngồi, **thấy rõ đầu và vai**, nền phía sau càng trơn càng tốt (tường sáng): người sẽ được tách nền, nền lộn xộn làm viền tách bị răng cưa.
- Đủ sáng mặt, mic gần (tiếng phòng vang làm nhận chữ sai).
- Có thì gửi kèm: quay màn hình của thứ được nói tới, B-roll tự quay của chính mình lúc làm việc, ảnh kết quả. Không có thì dùng bảng vẽ (mục 4).
- **Thiếu file thì báo**: trước khi edit, nói rõ file nào còn thiếu để video tốt hơn (B-roll, quay màn hình, ảnh kết quả, logo), nó sẽ chèn vào chỗ nào và tạm thay bằng gì. Không chặn việc edit: bạn trả lời "đang test" thì dùng bảng vẽ thay vào.
- Không hợp format này: 2 người nói, quay ngang toàn cảnh, video đã có phụ đề cứng.

## 2. Nhịp cắt

- **Cắt mọi khoảng lặng** (`tighten` của style), tốc độ 1,08. Giữ lần nói cuối cùng của câu bị nói lại (`cut`).
- **Đổi cảnh trung bình 3,5 đến 4 s** (gốc: 10 cắt / 42 s = 3,8 s). Đổi cảnh = đổi bảng ở nửa trên, hoặc sang màn hình / B-roll / nền tối. Không để 1 bảng đứng yên quá 6 s: bảng phải đổi trạng thái theo lời.
- Thứ tự gợi ý cho 30 đến 45 s: hook so sánh (0 đến 5 s) → nỗi đau / cách cũ (B-roll hoặc đồng hồ) → giải pháp từng bước (màn hình) → kết quả (nền tối) → CTA.

## 3. Chuyển cảnh

- **Chỉ cắt thẳng** (`cuts: 'hard'`): bảng, B-roll, màn hình, nền tối vào và ra trong 1 khung hình. Không fade, không whip, không glitch, không trượt.
- **Bên trong** một bảng: phần tử mới hiện mờ → nét trong ~.25 s, đúng từ được nói. Không nảy, không lắc.
- Người tách nền **đứng yên ở cùng 1 chỗ** suốt các cảnh nói, nên cắt giữa 2 bảng chỉ đổi nửa trên, mắt người xem không bị giật.

## 4. Chèn chữ, bảng, màn hình, B-roll

Vùng nửa trên y 230 đến 900 là sân khấu; y ~1010 là phụ đề; từ y ~1090 trở xuống là người. Không đặt gì lên mặt.

**a. Tiêu đề serif + thẻ UI (mặc định cho cảnh nói)**
- Dòng tiêu đề Noto Serif Display, mực đen, **1 từ nghiêng màu xanh** (vd "Ngày trước vs *Bây giờ*"). Chip tròn đen "vs" khi so sánh.
- Dưới tiêu đề 1 hoặc 2 thẻ trắng bo 24 px, bóng nhẹ, **logo thật**, nội dung thẻ thay đổi theo từ (số đếm, ô tick, thanh lấp dần).

**b. Sticker chữ** (nhấn mạnh 1 con số hoặc 1 cụm): serif nghiêng xanh trong khung viền xanh mảnh, nghiêng -3 đến -6°, bật ra đúng từ, chồng lên góc thẻ. Tối đa 1 cái mỗi bảng.

**c. Đồng hồ** (thời gian, "mất bao lâu"): mặt đồng hồ vẽ nét + số serif lớn ("*1* ngày" → "*2* tiếng"), kim quay khi nói số; số cũ bị gạch khi số mới đến.

**d. Quay màn hình** (khi có): cắt thẳng sang UI thật toàn khung, zoom/pan chậm vào đúng ô đang nói, pill bước "① Tải tài liệu lên…" góc trên trái, bút dạ vàng tô dòng được nhắc + chip câu hỏi xanh. Phụ đề giữ y ~1010.

**e. B-roll tự quay** (khi có): cắt thẳng toàn khung 4 đến 6 s, chip đồng hồ chạy góc trên phải (pill đen, chữ mono trắng), nhãn giấy trắng góc trên trái chữ serif nghiêng xanh ("tối *khuya*"). Phụ đề trắng y ~1480. Không có footage thật → dùng (c), **không dùng stock ngẫu nhiên, không AI video**.

**f. Cảnh kết quả**: nền tối #191813, "✓ *Kết quả*" serif nghiêng xanh, ảnh/màn hình kết quả thành thẻ rộng ở giữa, phụ đề trắng y ~1480.

**g. CTA**: checklist trắng (ô tick theo lời) + bong bóng chat đen `comment "TỪ KHOÁ"`, từ khoá serif nghiêng.

## 5. Phụ đề

- Montserrat Bold ~62 px, chữ thường (viết hoa đầu câu), **2 đến 4 từ, 1 dòng**, căn giữa.
- y ~1010 trên nền giấy (ngay trên đỉnh đầu), y ~1480 trên B-roll / nền tối.
- Mực đen trên giấy. Trên nền tối / video: tắt phụ đề engine ở đoạn đó và viết dòng trắng trong component của đoạn ấy (y ~1480).
- Hiện **cả cụm cùng lúc** khi câu tới, không khối nền, không viền (`captions.style: band`, `bg: none`).
- **Mỗi dòng đúng 1 từ xanh** (`captions.emph`): con số, tên công cụ, động từ chính. Không tô 2 từ cùng dòng. Từ nhấn hiện màu `captions.hi` (xanh).
- Tắt phụ đề (`captions.hide`) khi bảng đang hiện đúng những chữ đó to hơn.

## 6. Zoom khi nhấn mạnh

- **Không zoom vào mặt.** Gốc giữ cỡ mặt đứng yên 24 đến 26 % suốt video: không punch-in, không đẩy chậm (`zoom.drift: 0`, `zoom.keys` chỉ `[[0, 1]]`).
- Nhấn mạnh bằng **thứ khác**: từ xanh trong phụ đề, sticker bật ra, số đổi trên đồng hồ, cắt thẳng sang bảng mới.
- Zoom chỉ có trong **quay màn hình**: zoom/pan chậm (1 → 1,6 trong 2 đến 3 s) tới ô đang được nói, giữ yên khi tới nơi.

## 7. Nhạc nền và âm thanh

- Giọng là chính, -14 LUFS, đỉnh dưới -1 dBTP.
- **1 bed rất nhỏ**, ~26 dB dưới giọng (`mix.music: -40`), loại êm, không trống mạnh. Được phép tắt hẳn nếu bed nghe lộ.
- **Không hiệu ứng âm thanh**: không click khi cắt, không pop khi sticker, không whoosh (gốc không có cái nào).

## 8. Checklist rà cuối (trước khi gửi)

Chạy `short.mjs stills` trên mỗi beat + tạo ảnh so sánh với reel gốc, rồi rà từng dòng:

- [ ] Khung đầu tiên đã đọc được (tiêu đề + thẻ hiện sẵn ở t=0), không giấy trắng.
- [ ] Người tách nền sạch: không mất tay / tóc, không lem nền phòng quanh vai. Mặt 24 đến 26 % khung, đỉnh tóc ~y 1090, cằm không bị phụ đề đè.
- [ ] Không có zoom/punch-in nào trên mặt; cỡ mặt không đổi giữa các cảnh nói.
- [ ] Mọi chuyển cảnh là cắt thẳng; không có fade, whip, glitch.
- [ ] Đổi cảnh hoặc đổi trạng thái bảng mỗi 3 đến 4 s; không bảng nào đứng yên quá 6 s.
- [ ] Mỗi bảng neo vào 1 từ người nói thật nói; không chữ nào trên màn hình mà người không nói.
- [ ] Tiêu đề serif có đúng 1 từ nghiêng xanh; sticker tối đa 1 cái mỗi bảng.
- [ ] Phụ đề: Montserrat Bold, 1 dòng, 2 đến 4 từ, đúng 1 từ xanh, y ~1010 (giấy) / ~1480 (video), không đè bảng hay mặt, dấu tiếng Việt đúng.
- [ ] Logo là logo thật, không chữ cái trong vòng tròn, không emoji.
- [ ] Âm: -14 LUFS, đỉnh ≤ -1 dBTP, nhạc gần như không nghe, không SFX.
- [ ] Màu da tự nhiên (xem `stills/grade.jpg`), giấy kem không bị ngả xám.
- [ ] Không chữ nào nằm trong vùng an toàn bị UI che (dưới y 1500 bên phải 220 px, trên y 170).
- [ ] Không có gạch ngang dài (—) trong chữ trên màn hình.
