# Prompt storyboard — bản đã sửa (Nam gửi 27/10, Muse vá thêm 3 chỗ nhỏ)

Bản này là bản chính để dùng. Gồm 1 khối Quy tắc chung (dán một lần ở đầu phiên) + 7 lượt dán theo giai đoạn (1, 2, 3a, 3b, 3c, 4, 5). Dán từng giai đoạn một, chỉ sau khi đã duyệt giai đoạn trước. Trước giai đoạn 1, kết nối thư mục `video-agent` bằng "Add folder" ở menu "+" cạnh ô nhập tin nhắn. Dán trong cùng 1 phiên Claude Code, cùng thư mục `video-agent` trên máy Nam.

3 chỗ nhỏ Muse vá thêm sau khi Nam gửi bản này (đánh dấu bằng câu thêm vào, không đổi ý chính): (1) Giai đoạn 3b — nút Chốt ở trạng thái chưa bấm được cho tới 3c; (2) Giai đoạn 4 — đo độ lớn giọng trên đoạn render thử; (3) Giai đoạn 5 — timing timeline lệch tối đa 0,1 giây và số lần kiểm chứng công cụ CapCut theo quy tắc chung.

Bản 1 lượt đầy đủ vẫn ở: `Cong_storyboard_duyet_truoc_khi_dung_Melvynx.md` (khối prompt + khối bổ sung VIP + mục 9 carousel/đầu vào + mục 11 story thứ 2). Bản chia lượt này là bản đang dùng.

---

## Quy tắc chung (dán một lần ở đầu phiên)

```text
QUY TẮC CHUNG CHO MỌI GIAI ĐOẠN (áp dụng cho đến khi tôi nói khác):
- Đây là SKILL chạy trong Claude Code trên máy tôi (Windows), thư mục video-agent. Không cài app riêng, không tài khoản, không cloud, không API, không công cụ trả phí, không HyperFrames. Không dùng tên hay thương hiệu của creator khác cho skill của tôi.
- Đừng đoán đường dẫn hay tên file. Chỗ nào không thấy thì nói rõ "không thấy", đừng bịa.
- Ưu tiên làm ở lớp local (thư mục video-agent, profile format, router chọn format). Không sửa lõi skill gốc nếu có cách khác. Trước khi sửa bất kỳ file nào, backup bản gốc vào video-agent/backups/<ngày>-storyboard-gate/ rồi mới sửa.
- Mỗi giai đoạn chỉ làm đúng phạm vi của giai đoạn đó. Xong thì DỪNG và báo lại: file đã sửa/thêm, backup ở đâu, chỗ nào không khớp với máy tôi và cách bạn xử lý. Không tự làm giai đoạn kế tiếp.
- Nếu một yêu cầu không khớp với cấu trúc thật trên máy tôi, nói rõ chỗ đó và cách xử lý, đừng tự làm khác mà không báo.
- Mỗi việc khó (nâng cấp engine, dựng hiệu ứng, ghi draft) thử tối đa 3 lần. Sau 3 lần chưa được thì DỪNG, báo đã thử gì + kết quả ra sao + phương án tương đương, rồi chờ tôi chọn. Không lặp vô hạn, không tự bỏ, không tự thay.
- Tiết kiệm token: tái dùng spec/transcript/timing đã có, không chạy lại thứ đã chạy.
```

## Giai đoạn 1 — Khảo sát + backup (chỉ đọc)

```text
GIAI ĐOẠN 1 — Khảo sát + backup. CHỈ ĐỌC và SAO LƯU, chưa làm tính năng mới, chưa sửa file skill nào.

Tôi đang dùng bộ skill edit Melvynx trong thư mục video-agent trên máy này.

1. Đọc cấu trúc thật trên máy tôi và báo đường dẫn đã thấy cho từng mục:
   - skill /short-editing nằm ở đâu;
   - kế hoạch edit (spec) lưu ở đâu;
   - engine render là file nào;
   - các style hiện có (kem-3d, mindang, buildwithdarius-ai, mặc định) và component/board/hiệu ứng của engine lưu ở đâu;
   - CapCut đã cài chưa, bản nào;
   - kho draft CapCut trên Windows nằm ở đâu.
   Chỗ nào không thấy thì ghi "không thấy", đừng đoán.

2. Backup vào video-agent/backups/<ngày>-storyboard-gate/:
   - toàn bộ file sẽ sửa về sau (bản gốc file skill, runtime.js nếu về sau động vào);
   - danh sách draft CapCut hiện có (chỉ SAO CHÉP danh sách và thư mục draft, không sửa, không xóa gì trong kho draft).
   Sau khi backup, kiểm tra bản backup mở/đọc lại được.

3. Báo lại: đường dẫn thật đã thấy, vị trí backup (kèm kết quả kiểm tra mở lại), bản đồ engine/style/component hiện có, và chỗ nào trong yêu cầu không khớp với máy tôi.

DỪNG ở đây, chờ tôi kiểm tra rồi mới làm giai đoạn tiếp theo.
```

## Giai đoạn 2 — Trigger + bước Bắt đầu + kiểm tra đầu vào

```text
GIAI ĐOẠN 2 — Trigger + bước Bắt đầu + kiểm tra đầu vào. Tiếp theo giai đoạn 1 (đã khảo sát + backup xong). Chưa làm wizard 5 bước, chưa render gì. Chỉ được THÊM file ở lớp local (profile format, router chọn format, file trigger); không sửa lõi skill gốc.

1. Trigger bằng câu tự nhiên, không cần lệnh gạch chéo: tôi tải video thô lên và gõ "tạo storyboard trước khi dựng video" thì skill phải chạy. Cổng storyboard cũng bật mặc định khi tôi chạy /short-editing, không cần gõ thêm gì. Chỉ bỏ qua cổng cho đúng 1 video khi tôi nói rõ.

2. Bước Bắt đầu: phân tích take thật gồm % thời lượng có mặt người, có quay màn hình không, có giọng nói không, nhịp/độ dài, đoạn nào là demo. Rồi đề xuất 1 format chính + 1 phương án dự phòng, mỗi cái kèm lý do bằng chứng lấy từ phân tích. Tôi xác nhận hoặc đổi format ngay ở bước này, không làm lại từ đầu.

3. Kiểm tra đầu vào bắt buộc trước khi làm storyboard: video thô + kịch bản chi tiết + video mẫu/màu/font thương hiệu + B-roll. Thiếu cái nào thì cờ rõ ngay ở bước Bắt đầu và chưa làm storyboard.

4. Chạy thử trigger trên 1 take thật ngắn trong takes/ (ưu tiên vid-tho-24s.mp4 nếu còn). Nếu không thấy file đó thì báo và chọn take ngắn khác trong takes/, nói rõ đã chọn cái nào. Cho tôi xem phân tích Bắt đầu.

DỪNG ở đây, chờ tôi duyệt format rồi mới làm wizard. Báo lại file nào đã thêm/sửa.
```

## Giai đoạn 3a — Khung wizard + Bước 1 + Bước 2

```text
GIAI ĐOẠN 3a — Khung wizard + Bước 1 + Bước 2. Tiếp theo giai đoạn 2 (đã duyệt format). CHƯA làm Bước 3, 4, 5 đầy đủ, CHƯA render, CHƯA xuất MP4/CapCut.

1. Khung: trang wizard chạy local (server local nhỏ của skill), lưu tại video-agent/edits/short-<slug>/storyboard/. Thứ tự: Bắt đầu → 1 Màu + Font → 2 Hiệu ứng → 3 Âm thanh → 4 Chuyển động → 5 Xem & chốt. Có nút Quay lại / Tiếp, ghi "Bước X trên 5". Các bước 3-5 để khung rỗng có tiêu đề, làm ở giai đoạn sau.

2. Bước 1 — Màu + Font: đúng 3 thẻ preset. Thẻ 1 bắt buộc là "Phong cách hiện tại của bạn" lấy từ /studio-setup. Mỗi thẻ có mẫu chữ + chấm màu. Thẻ đã chọn có viền vàng + nhãn "Đã chọn". Chỉ dùng font đã kiểm có dấu tiếng Việt (kiểm bằng cách render thử chuỗi có đủ dấu, báo kết quả).

3. Bước 2 — Hiệu ứng, chia theo từng đoạn theo transcript:
   - Mỗi đoạn có 2-3 thẻ hiệu ứng RIÊNG, đặt theo câu thoại của đoạn đó.
   - Mỗi thẻ có: ảnh tĩnh thật lấy từ take tại giữa đoạn, tên hiệu ứng, nhãn nguồn "(đang dùng)" / "(thư viện)", và nhãn CapCut (sửa được hay clip phẳng).
   - Đoạn nào dùng B-roll/ảnh/quay màn hình: kiểm tra file đó có thật trong inputs/ và link được không. Thiếu thì đánh dấu cờ đỏ ngay tại đoạn đó (việc khóa nút Chốt khi còn đoạn cờ đỏ làm ở giai đoạn 3c; nút Chốt chưa tồn tại ở giai đoạn này, không tự tạo nút sớm); cờ đỏ chỉ được gỡ khi tôi đổi tư liệu hoặc đổi hiệu ứng cho đoạn đó.
   - Gom đoạn theo phần (mở đầu / thân / kết), phân trang khi quá 8 đoạn.
   - Khóa theo từng đoạn: sửa 1 đoạn thì chỉ duyệt lại đoạn đó, các đoạn khác giữ nguyên lựa chọn đã chốt. Mỗi lần sửa chỉ tạo phiên bản mới cho đoạn đó (v1 → v2) và ghi rõ đã thay đổi gì.
   - Chỉ đưa vào thẻ những hiệu ứng engine hiện có dựng được. Hiệu ứng chưa có thì để sang giai đoạn 4, ghi vào danh sách "cần nâng cấp engine", đừng bỏ qua im lặng.

4. Chạy thử: làm Bước 1 + Bước 2 cho 1 take thật ngắn, mở trang local, cho tôi xem.

DỪNG, chờ tôi duyệt. Báo lại file đã thêm/sửa và cách chạy server local trên Windows.
```

## Giai đoạn 3b — Bước 3 Âm thanh + Bước 4 Chuyển động + Bước 5 Xem

```text
GIAI ĐOẠN 3b — Bước 3, 4, 5. Tiếp theo giai đoạn 3a (khung + Bước 1 + Bước 2 đã duyệt). CHƯA làm bút vẽ và nút Chốt ghi file, CHƯA render, CHƯA xuất.

1. Bước 3 — Âm thanh: đúng 3 thẻ phong cách âm thanh chung cho cả video. Bấm nghe thử được 1 mẫu ngắn THẬT (tạo từ file âm thanh có sẵn trên máy, không dùng dịch vụ ngoài) rồi mới chọn. Giọng giữ chuẩn -14 LUFS. Hiện mức nhạc nền/SFX từng đoạn so với giọng: nhạc tự nhỏ khi có giọng, SFX chỉ ở điểm chốt, không át giọng.

2. Bước 4 — Chuyển động: 3 preset do bạn thiết kế từ khả năng THẬT của engine (đọc engine để biết nó làm được gì, liệt kê). Xem thử được bằng animation CSS trên ảnh tĩnh.

3. Bước 5 — Xem & chốt (chỉ phần hiển thị): tóm tắt đủ màu + font, hiệu ứng từng đoạn kèm thời gian + câu thoại, âm thanh, chuyển động. Hiện đúng chữ caption từng đoạn (kể cả câu có từ tiếng Anh, tên riêng, số, ngày sale) với cách ngắt dòng và từ tô màu thật. Hiện vùng an toàn của Reels/TikTok/Shorts để chữ/board không lọt vào vùng nút giao diện che. Cho tôi chọn 1 frame làm ảnh bìa/cover (frame ở hook).

4. Chạy thử: hoàn thiện đủ 5 bước cho 1 take thật ngắn, cho tôi xem. Nút "Chốt & dựng thành phẩm" ở bước cuối có thể hiện nhưng ở trạng thái chưa bấm được (mờ/khóa) và chưa ghi file (làm ở 3c).

DỪNG, chờ tôi duyệt. Báo lại file đã thêm/sửa.
```

## Giai đoạn 3c — Bút vẽ + choices.json + nút Chốt

```text
GIAI ĐOẠN 3c — Bút vẽ + cơ chế chốt. Tiếp theo giai đoạn 3b (đủ 5 bước đã duyệt). CHƯA render, CHƯA xuất MP4/CapCut.

1. Bút vẽ + ghim chú thích ở Bước 5: tôi khoanh vùng chưa ưng và ghi ghi chú ngắn. Mỗi ghi chú gắn đúng đoạn + thời gian, lưu cùng lựa chọn.

2. Nút "Chốt & dựng thành phẩm": khi bấm, lựa chọn (màu/font, hiệu ứng từng đoạn kèm phiên bản, âm thanh, chuyển động, ảnh bìa) + chú thích bút vẽ được ghi thành choices.json trong thư mục storyboard, để bạn đọc và dựng tiếp, không bắt tôi gõ lại. Nút Chốt bị KHÓA (không bấm được) khi còn bất kỳ đoạn nào đang cờ đỏ thiếu tư liệu; chỉ mở khóa khi mọi đoạn đã đủ tư liệu hoặc đã đổi hiệu ứng.

3. Phương án dự phòng nếu server local không ghi file chắc chắn được trên Windows: trang hiện mã tóm tắt lựa chọn ở Bước 5; tôi nhắn "chốt" + mã đó trong chat thì bạn ghi thành choices.json. Báo rõ bạn làm theo cách nào và đã test nút Chốt end-to-end chưa.

4. Quy tắc sửa: tôi sửa theo timestamp hoặc bút vẽ thì chỉ sửa storyboard rồi trình lại, KHÔNG xuất. Chỉ xuất khi tôi chốt sau khi đã xem storyboard.

5. Chạy thử: làm storyboard xong cho 1 take thật ngắn rồi DỪNG chờ lệnh, đừng tự xuất. Tôi sẽ chọn thử + khoanh bút vẽ thử + bấm Chốt thử để bạn kiểm tra choices.json ghi đúng chưa (đối chiếu từng trường với lựa chọn tôi đã bấm). Thử cố ý khóa nút: đổi tên tạm 1 file B-roll đang dùng, mở lại storyboard và kiểm tra đoạn đó cờ đỏ + nút Chốt bị khóa; trả lại tên file cũ và kiểm tra nút mở khóa lại. Ghi rõ kết quả thử này trong báo cáo.

Báo lại file đã thêm/sửa và cách chốt đã làm.
```

## Giai đoạn 4 — Nâng cấp engine + soi lỗi cũ + preset + resume

```text
GIAI ĐOẠN 4 — Nâng cấp engine + kiểm tra chất lượng. Tiếp theo giai đoạn 3c (wizard + chốt đã xong và test). Chưa xuất bản cuối.

1. QUY TẮC NÂNG CẤP: hiệu ứng nào đưa vào thẻ storyboard thì BẮT BUỘC dựng được. Trước khi đưa 1 hiệu ứng vào thẻ, kiểm tra engine có dựng được không. Nếu chưa có thì nâng cấp engine local (thêm component/template/tùy chọn runtime, backup trước), render thử đúng đoạn đó trên take thật, đối chiếu với bản xem trước; chỉ khi khớp mới đưa vào thẻ. Bản xem trước và bản render cuối dùng chung 1 component, cấm làm 2 kiểu.
   - "Khớp" nghĩa là: so ảnh tĩnh xem trước với khung hình đã render cùng timestamp; vị trí/kích thước chữ và board lệch không quá 8 px trên khung 1080x1920, đúng màu/font, không thiếu/không thừa phần tử. Báo số đo thật, không chỉ nói "khớp".
   - Mỗi hiệu ứng thử nâng cấp tối đa 3 lần. Sau đó vẫn không dựng được bằng stack local thì DỪNG, báo hiệu ứng nào, đã thử gì, render thử ra sao, phương án tương đương nào đã xây được, rồi chờ tôi chọn trong chat. Không tự bỏ, không tự thay.

2. Soi lỗi cũ trên storyboard: thẻ chồng nhau, caption gom sai thành 1 cụm, khung mờ đen, chữ trong board/terminal quá nhỏ (đặt ngưỡng cỡ chữ tối thiểu và báo cáo cỡ thật). Hiện đúng chữ caption từng đoạn để tôi rà tên riêng/số. Khi tôi yêu cầu, ép caption theo kịch bản tôi đã viết thay vì theo ASR.

3. Bút vẽ phải đổi được đoạn: mỗi ghi chú bút vẽ/ghim gắn đúng đoạn + thời gian, bạn sửa đúng đoạn đó, trình lại bản xem trước của đoạn đó và ghi rõ đã sửa gì. Không chỉ lưu ghi chú rồi dựng như cũ.

4. Nhớ lựa chọn thành preset theo từng style/format: video sau cùng style lấy preset đó làm mặc định, chỉ hỏi lại đoạn tôi muốn đổi. Lưu storyboard của 1 video dài thành template để các short cắt từ cùng video đó dùng lại, chỉ duyệt lại đoạn khác nhau. Storyboard chỉ dùng ảnh tĩnh + HTML, không render video, không tạo giọng mới, không chạy lại transcript nếu đã có timing.

5. Sống sót qua reset phiên: choices.json + 1 file handoff tóm tắt (đang ở bước nào, đã chốt gì, còn thiếu gì, lệnh chạy tiếp) phải đủ để phiên Claude mới đọc là dựng tiếp, không hỏi lại lựa chọn. File handoff phải ghi lại cả Quy tắc chung (skill chạy local trong Claude Code, không app riêng/cloud/API/công cụ trả phí/HyperFrames, ưu tiên lớp local, không sửa lõi skill nếu có cách khác, tối đa 3 lần thử việc khó) để phiên mới không quên sau khi reset. Render lỗi giữa chừng thì resume từ đúng chỗ lỗi theo checkpoint từng đoạn, không duyệt lại toàn bộ. Thử bằng cách giả lập: đọc lại chỉ từ 2 file đó và nói bạn sẽ làm gì tiếp.

6. Chạy thử: render thử đúng 1 đoạn có hiệu ứng vừa nâng cấp trên take thật, đối chiếu ảnh tĩnh xem trước với khung hình đã render, kiểm tra checklist lỗi cũ trên ảnh tĩnh, đo độ lớn giọng trên đoạn render thử (chuẩn -14 LUFS ±1, đỉnh thật ≤ -1 dBTP) và báo số đo.

DỪNG, báo lại: hiệu ứng nào phải nâng cấp engine mới làm được + render thử ra sao (kèm số đo lệch), file đã sửa/thêm, backup ở đâu.
```

## Giai đoạn 5 — Xuất sau chốt: MP4 + draft CapCut + carousel

```text
GIAI ĐOẠN 5 — Xuất sau chốt, chạy đầu cuối. Tiếp theo giai đoạn 4. Chỉ xuất sau khi tôi chốt storyboard.

1. Từ cùng lựa chọn đã chốt (choices.json), xuất cả 3:
   (a) MP4 bằng engine Melvynx kèm .srt, đúng hiệu ứng từng đoạn đã chốt, kể cả hiệu ứng vừa nâng cấp;
   (b) project draft CapCut sửa được;
   (c) carousel nháp: mỗi đoạn → 1 slide, cùng màu/font đã chốt, xuất file ảnh, KHÔNG tự đăng.
   Nếu carousel không làm được thì vẫn giao MP4 + CapCut và báo rõ, không im lặng bỏ qua.

2. Xuất CapCut:
   - ĐÓNG CapCut trước khi ghi draft.
   - Kiểm tra bản backup danh sách draft (giai đoạn 1) mở lại được. CHỈ THÊM project mới, tuyệt đối không ghi đè hay xóa draft cũ.
   - Chọn đúng 1 công cụ trong: capcut-cli / skill capcut-edit của renezander030, hoặc capcut-cli bản Python. Kiểm chứng nó còn tồn tại, chạy được trên Windows và tương thích đúng bản CapCut của tôi (cấu trúc draft đổi theo bản) rồi mới dùng — tối đa 3 lần kiểm chứng cho mỗi công cụ theo quy tắc chung. Nếu cả hai đều không chạy được thì DỪNG và báo, đừng tự tìm công cụ khác hay tự viết bộ ghi draft.
   - Draft gồm: clip đã cắt đúng thứ tự/timing/tốc độ, giọng + nhạc/SFX, caption dạng text sửa được, B-roll/ảnh đúng track và thời điểm.
   - Hiệu ứng HTML không có dạng tương đương 1-1 trong CapCut: ghi rõ từng thẻ sang CapCut dạng sửa được hay clip phẳng, không nói giống hệt MP4.
   - Dùng đúng lệnh đăng ký draft để project hiện trong danh sách project CapCut, đặt tên theo slug video. Draft không tự xuất MP4; xuất cuối là tôi bấm Export trong CapCut.

3. Chạy thử đầu cuối với 1 take thật ngắn: làm storyboard xong thì DỪNG chờ lệnh, đừng tự xuất. Sau khi tôi duyệt, xuất MP4 + draft CapCut + carousel nháp, rồi mở CapCut kiểm tra: timeline khớp storyboard (timing từng đoạn lệch tối đa 0,1 giây), caption sửa được, media không mất link, carousel có đúng số slide bằng số đoạn, và draft mở được trong đúng bản CapCut đang cài.

4. Báo lại đầy đủ:
   - file đã sửa/thêm, backup ở đâu;
   - hiệu ứng nào phải nâng cấp engine mới làm được + render thử ra sao;
   - storyboard test ở đâu, take nào đã test;
   - tên project CapCut + cách mở; công cụ CapCut đã dùng + cách đã kiểm chứng;
   - 8 điểm VIP, mỗi điểm ghi "đã làm + đã test ra sao" hoặc "chưa làm + vì sao": (1) kiểm tra tư liệu, (2) khóa từng đoạn, (3) vùng an toàn + bìa, (4) template dùng lại, (5) sống sót qua reset + resume, (6) âm lượng từng đoạn, (7) caption Việt/Anh/số, (8) bút vẽ đổi đúng đoạn;
   - chỗ nào trong yêu cầu không khớp với cấu trúc thật trên máy tôi và cách bạn xử lý.
```
