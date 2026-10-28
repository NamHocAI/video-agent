---
name: storyboard-gate
description: Cổng storyboard trước khi dựng video. Chạy khi người dùng nói "tạo storyboard trước khi dựng video", "tạo storyboard", "storyboard trước", "lên storyboard", "phân tích take", hoặc tải video thô lên để dựng; và chạy MẶC ĐỊNH trước mọi lần /short-editing hay /editing một take. Bước Bắt đầu - đo take thật (% có mặt người, quay màn hình, hoạt hình, giọng nói, nhịp, đoạn demo), kiểm tra đầu vào (bắt buộc: video thô, video mẫu/màu/font; tùy chọn: kịch bản, B-roll), đề xuất 1 format chính + 1 dự phòng kèm bằng chứng. Chỉ bỏ qua cho đúng 1 video khi người dùng nói rõ.
argument-hint: "<take> [--script file.md] [--style tên] [--broll thư mục]"
---

# Cổng storyboard

Chạy local, không API, không tải gì mới. Trả lời tiếng Việt ngắn, dễ hiểu.

## Khi nào chạy
- Người dùng nói câu tự nhiên kiểu "tạo storyboard trước khi dựng video" + có take (vừa tải lên, hoặc trong `video-agent/takes/`).
- Mặc định trước `/short-editing` và `/editing` khi việc là dựng 1 take mới. Không cần gõ thêm gì.
- **Bỏ qua** chỉ khi người dùng nói rõ cho video đó (vd "bỏ qua storyboard video này"). Ghi `video-agent/storyboards/<slug>/SKIP.md` với câu họ nói, rồi để short-editing làm như cũ. Video sau vẫn bật cổng.
- Take đã có `storyboards/<slug>/start.json` và format đã duyệt: không chạy lại, đọc file đó.

## Bước Bắt đầu
1. Tìm take. Không đoán tên: không thấy file thì nói "không thấy" và liệt kê `takes/`.
2. Chạy (từ `video-agent/`):
   `node ../.claude/skills/storyboard-gate/scripts/start.mjs "<take>" [--script <file.md>] [--style <tên>] [--broll <thư mục>]`
   Ghi `video-agent/storyboards/<slug>/start.json` + `start.md`. Mất vài giây, không render.
3. Xem 1 contact sheet của take (ffmpeg `fps=1,tile`) để tự đối chiếu số đo với hình. Lệch thì nói rõ chỗ lệch.
4. Gửi người dùng nội dung `start.md`: bảng đo, đầu vào thiếu (❌), format chính + dự phòng và lý do.
5. **Kịch bản và B-roll không bắt buộc.**
   - Có kịch bản: nó là chuẩn. Chia đoạn theo phần của kịch bản, chọn hiệu ứng theo nội dung + ghi chú hình ảnh, phụ đề theo chữ kịch bản (`force-captions.mjs`). Lời nghe ra từ take chỉ lấy thời gian.
   - Không có kịch bản: dựng từ những gì có: lời nói trong take (transcript), giọng, quay màn hình/đoạn demo trong take, B-roll có sẵn trong `broll/` và `inputs/`. Nhắc người dùng rà tên riêng/số ở Bước 5.
   - Không có B-roll: dùng bảng/hiệu ứng của engine; thẻ nào cần B-roll mà chưa có thì chỉ thẻ đó bị cờ đỏ.
6. **Thiếu đầu vào bắt buộc thì dừng** (video thô, style/màu/font): chưa làm storyboard. Nói rõ còn thiếu gì, đặt vào đâu.
7. Người dùng xác nhận hoặc đổi format ngay ở đây: ghi vào `start.json` → `proposal.chosen`, không phân tích lại.

Luật chọn format: `video-agent/formats/ROUTER.md`. Format chưa có profile trong `formats/` thì nói rõ "chưa có profile".

## Wizard (sau khi format đã duyệt)
Thư mục: `video-agent/edits/short-<slug>/storyboard/`. Claude viết `plan.json` (đoạn theo transcript, 2-3 thẻ/đoạn chỉ từ scene engine có thật, 3 âm thanh, 3 chuyển động, vùng an toàn), rồi từ `video-agent/`:
1. `node ../.claude/skills/storyboard-gate/scripts/preview.mjs <storyboard>/plan.json` : engine vẽ từng thẻ lên khung thật (stills), trộn 3 mẫu âm thanh (audio), chia cụm phụ đề, lấy khung ảnh bìa. Thẻ không vẽ được → danh sách "cần nâng cấp engine".
2. `node ../.claude/skills/storyboard-gate/scripts/build-wizard.mjs <storyboard>/plan.json`
3. `node ../.claude/skills/storyboard-gate/scripts/server.mjs <storyboard> --port 4747` rồi mở http://127.0.0.1:4747/
Xem lại ảnh xem trước bằng mắt trước khi đưa cho người dùng.

## Chốt
- Bước 5: người dùng khoanh vùng + ghi chú (gắn đoạn + giây) rồi bấm "Chốt & dựng thành phẩm". Server ghi `<storyboard>/choices.json` (file tạm → đổi tên → đọc lại so khớp).
- Nút Chốt khóa khi còn đoạn cờ đỏ thiếu tư liệu, đoạn chưa duyệt, hoặc chưa chọn màu/âm thanh/chuyển động/ảnh bìa. Server cũng chặn, không chỉ giao diện.
- Dự phòng: người dùng nhắn `chốt SB1-...` (mã ở Bước 5) → chạy `node ../.claude/skills/storyboard-gate/scripts/commit.mjs <storyboard> "<mã>"`. Mã có số kiểm, sai 1 ký tự là từ chối.
- Đọc `choices.json` để dựng tiếp, không hỏi lại lựa chọn. Có ghi chú bút vẽ → sửa đúng đoạn đó trước.
- **Lưới an toàn (người dùng 28/10):** bấm Chốt (hoặc `commit.mjs`) → server chạy `scripts/auto-final.mjs <storyboard>` tách rời: dựng `<storyboard>/thanh-pham.mp4` có tiếng (trạng thái `thanh-pham.json`, log `thanh-pham.log`), để hết token giữa chừng vẫn có sản phẩm.
- **Còn token thì vẫn làm ĐỦ các bước như cũ**, bản tự dựng không thay thế: sửa ghi chú bút vẽ → render từng đoạn + `compare.py` (≤ 8 px, màu ≤ 12/255) → `seg-gain.mjs` (-14 ±1 LUFS, ≤ -1 dBTP) → so với video mẫu (bước 5 của /steal nếu là video thử style) → xem 1 khung full-size của bản cuối → mới giao. Bản tự dựng chỉ giao khi phiên trước bị dừng; khi đó nói rõ "bản tự dựng, chưa qua soát".

## Quy tắc người dùng đã nhắc (28/10, áp mọi video)
- **Mỗi lần người dùng chê / nhắc lỗi: sửa luôn vào skill** (SKILL.md này, learnings của /steal, STYLE.md của style), không chỉ sửa video đang làm. Backup trước.
- **Màu + font = 3 biến thể của CÙNG style** (`styles/<style>/bien-the/<v>/style.json`, mỗi biến thể có `stageSrc` = lớp chữ capture riêng; `cardspec.applyStyle` tự đổi lớp chữ). Không đưa style khác vào lựa chọn.
- **Chữ trên màn hình theo lời nói thật**; kịch bản chỉ để hiểu ý, trừ khi take khớp kịch bản 100 %. Ưu tiên cho từ nhấn hiện đúng lúc nói tới thay vì hiện trước lời (hấp dẫn hơn: "số lạ?" rồi "bình tĩnh" khi nói "bình tĩnh"); tùy đoạn, không bắt buộc. Không đưa lên màn hình câu người nói không nói ở đoạn đó. Lời chỉ hướng ("dưới đây", "bên này", "ở trên") thì chữ/hình đặt và chỉ đúng hướng đó (vd mũi tên chỉ xuống + chữ ở dưới).
- **Chuyển động sáng tạo theo take**, không preset mặc định: mỗi đoạn có 1 hành động gắn đúng câu nói (điện thoại rung khi "cuộc gọi", dấu đóng khi "lừa đảo"...). Thẻ "motion" chỉ là nền (cắt, phóng), phần chính nằm trong lớp chữ. Âm thanh, ảnh, chuyển động: có lý do + giữ người xem, không chèn cho có.
- **Tự soát khung trước khi đưa duyệt** (chụp 1 khung/đoạn ghép lên footage thật, xem bằng mắt), sửa hết rồi mới mở cho người dùng:
  - chữ trên sticker / con dấu / viên số: 1 dòng (`white-space: nowrap`), nằm trọn trong khung 1080, không tràn mép
  - không che mặt: đặt ở khoảng trống hai bên đầu hoặc trên đầu, theo vị trí mặt thật của take
  - ảnh vật thể phải nhận ra ngay ở cỡ nhỏ; ảnh mờ nghĩa (tờ giấy trơn) thì thêm dấu hiệu theo lời nói (nét bút viết lên sổ...)
  - khung doodle / trang trí không đè lên chữ: chữ nào bị đè thì ẩn đi hoặc dời chỗ
  - Ngoại lệ chỉ khi người dùng yêu cầu rõ.
- **Nhìn phát biết style**: hiệu ứng mới dùng đúng font, bảng màu, cách hiện (vd hiện cứng) và kiểu sticker của style; không thêm màu, kiểu chuyển cảnh hay kiểu chữ ngoài style.
- **Đồ vật được nhắc mà take không có**: ảnh thật đúng ngữ cảnh (hộ chiếu Việt Nam, đúng trường được nhắc), tách nền, làm sticker viền trắng. Nguồn nào cũng được nhưng phải đẹp, hợp style + cảnh quay; ghi `NGUON.txt`; ghép thử 1 khung trước khi gắn.
- **Ảnh xem trước dạng GIF** chạy trên footage: `node <scripts>/gif.mjs <storyboard>/plan.json` sau `preview.mjs` (server tự chạy khi đổi biến thể).

## Quy tắc sửa
Người dùng sửa theo timestamp hoặc bút vẽ: chỉ sửa storyboard (plan.json → preview.mjs → build-wizard.mjs) rồi trình lại. **KHÔNG xuất.** Chỉ xuất khi người dùng bấm Chốt (hoặc gửi mã) sau khi đã xem storyboard mới. Sửa sau khi chốt → trang báo "Có thay đổi sau lần chốt", phải chốt lại.

## Ảnh xem trước theo preset (quy tắc)
- Ảnh xem trước LUÔN theo style của preset đã chọn/đã chốt. So khớp xem trước với render khác style thì không có nghĩa.
- Đổi preset trên trang: server tự chạy lại `preview.mjs --style <style>` + `qc.mjs` + `build-wizard.mjs` (chạy nền, trang báo đang vẽ lại). Chạy tay: `node <scripts>/preview.mjs <plan.json> --only fx,cover --style <style>`.
- `render-seg.mjs` và `seg-gain.mjs` dùng cùng style đó.

## Độ lớn từng đoạn
- Chuẩn: mỗi đoạn -14 ±1 LUFS, đỉnh thật ≤ -1 dBTP. Đo + chỉnh: `node <scripts>/seg-gain.mjs <storyboard> --measure` hoặc `--seg D --target -13.1` (tối đa 3 vòng). Chỉnh trên `_engine/assets/voice.wav` (bản gốc `voice.orig.wav`), ghi `plan.voiceGain`, kết quả ở `loudness.json`.

## Nâng cấp hiệu ứng (quy tắc)
- Hiệu ứng vào thẻ phải dựng được. Mỗi thẻ = 1 spec (`cardspec.mjs`), dùng CHUNG cho ảnh xem trước và render. Cấm làm 2 kiểu.
- Engine thiếu thì nâng cấp ở lớp local trước (không sửa lõi): tùy chọn `labels` (đổi chữ cứng), clip dựng sẵn bằng ffmpeg (`speedramp.mjs`), `extraScenes`, `keepBase` + `swapMedia`.
- Render thử đúng đoạn: `node <scripts>/render-seg.mjs <storyboard> --pick D=D3 --segs D`, rồi so: `python <scripts>/compare.py <fx/full/thẻ.jpg> <_engine/output/seg-D.mp4> <giây trong file> [probe.json]`. Khớp = lệch ≤ 8 px, màu ≤ 12/255, không thiếu/thừa phần tử. Báo số đo.
- Tối đa 3 lần mỗi hiệu ứng, quá thì dừng, báo, chờ chọn.

## Soát lỗi, phụ đề, bút vẽ
- `node <scripts>/qc.mjs <storyboard>`: chữ < 32 px (phụ đề < 48 px), chồng chữ/đè phụ đề, khung đen/mờ, phụ đề gom sai. Thẻ có lỗi hiện ⚠ trên trang.
- Ép phụ đề theo kịch bản (chỉ khi người dùng yêu cầu): `node <scripts>/force-captions.mjs <storyboard> <kịch bản.md>`, rồi `preview.mjs ... --only captions,fx` + build.
- Ghi chú bút vẽ: `node <scripts>/fix-note.mjs <storyboard> --note <n> --patch '<json>' --what "<đã sửa gì>"`. Sửa đúng thẻ của đoạn đó, ảnh trước/sau, mở lại đoạn để duyệt (version mới ghi lý do). Xem ảnh sau bằng mắt; QC báo chồng thì sửa vị trí.

## Nhớ + làm tiếp
- Chốt → `video-agent/presets/<format>__<style>.json` (preset mặc định cho video sau) + `video-agent/storyboards/templates/<khoá take>.json` (short khác cùng video gốc: đoạn trùng giờ + lời được dùng lại, khoá sẵn).
- `HANDOFF.md` trong thư mục storyboard tự cập nhật sau mỗi thao tác: đọc nó + `choices.json` là làm tiếp được, có cả Quy tắc chung.
- Render thành phẩm: `render-seg.mjs <storyboard> --from-choices` (checkpoint từng đoạn trong `render.json`, chạy lại sẽ tiếp từ đoạn lỗi).

## Chưa có
Xuất MP4 cuối có tiếng, draft CapCut, carousel (giai đoạn 5).
