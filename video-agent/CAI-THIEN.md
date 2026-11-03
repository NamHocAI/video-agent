# Danh sách rà soát và cải thiện bộ skill

Ghi ngày 2026-11-03. Thứ tự: A (tốc độ + token) → B (độ chắc, ít lỗi) → C (hiệu ứng, motion, làm sau).
Người dùng gọi số (vd "làm A1"), làm từng phần một, xong thì đánh dấu [x] và ghi kết quả đo (token/thời gian trước và sau).

## A. Tốc độ + token (làm trước)

- [x] **A1. Script kiểm lỗi tự động thay soát bằng mắt** (xong 2026-11-03, trong LÕI short-editing: `engine/qa.mjs`, lệnh `short.mjs qa`, `capture` tự chạy cho mọi style/mọi video; 10–15 s/video, cài lỗi thử bắt được cả 6 loại; chỉ đọc ảnh bị báo)
  Hiện tại AI chụp ảnh mỗi đoạn rồi nhìn, nên tốn token đọc ảnh và dễ sót.
  Làm script đo các lỗi: chữ tràn khung 1080, chữ đè mặt (dùng bộ dò mặt có sẵn), chữ đè vùng an toàn TikTok, font thiếu dấu tiếng Việt, decor đè chữ, ảnh logo mờ hoặc nhỏ.
  Chỉ khung bị báo lỗi mới cần xem ảnh.
- [x] **A2. `stage.html` không chép nguyên file mỗi video** (xong 2026-11-03, trong LÕI short-editing: runtime lớp chữ chung `engine/stage/runtime.js`, `init` tự tạo vỏ + dữ liệu; video chỉ còn `source/stage.data.js` 1,6–2,5 KB thay vì 17–19 KB; Zila chuyển xong, so 423 khung với bản gốc lệch 1 khung không thấy được. Style chia-se-meo cũ chưa chuyển, style mới làm theo cách này qua /steal)
  Mỗi video đang có một bản 17–26 KB và nhiều bản nháp (`v1`, `v1b`, `before-fx`).
  Đổi thành: mẫu của style + một file nhỏ chỉ ghi phần khác (chữ, mốc giờ, ảnh). Sửa thì chỉ đọc file nhỏ.
- [x] **A3. Đọc tài liệu theo phần** (xong 2026-11-03, LÕI short-editing: `engine/doc.mjs` + mục lục đầu scene-library.md / style-schema.md; 1 video điển hình đọc ~4 KB thay vì 66 KB, giảm ~93 %, khoảng 16k → 1k token)
  Chỉ đọc mục scene cần dùng trong `scene-library.md` (khoảng 16 nghìn token) và `style-schema.md`, không đọc cả file.
  Thêm mục lục ngắn ở đầu để tra.
- [ ] **A4. Gộp và rút gọn luật**
  Luật đang nằm rải ở CLAUDE.md, storyboard-gate, STYLE.md, memory, learnings của /steal, có chỗ lặp nhau.
  Gom về đúng một chỗ, bỏ phần trùng, câu ngắn lại.
- [ ] **A5. Không làm lại việc đã có**
  Transcript, cắt lặng, ảnh logo trường, ảnh capture đã có thì dùng lại (cache theo file và ngày), không chạy lại.
  Kiểm tra lại cache hiện có chỗ nào còn chạy thừa.
- [ ] **A6. Đo thời gian từng bước**
  In thời gian mỗi bước (chép lời, capture, render, kiểm lỗi) để biết chỗ chậm thật, rồi mới tối ưu đúng chỗ, ví dụ capture song song hoặc chụp ít khung hơn.
- [ ] **A7. Dọn file nháp sau khi chốt**
  Xóa hoặc nén các bản `stage.v*`, `_engine/` copy trong `storyboard/` sau khi video xong, để AI không đọc nhầm hoặc đọc thừa.

## B. Độ chắc, ít lỗi

- [ ] **B1. Bảng lỗi cũ thành checklist máy chạy**
  Các lỗi người dùng đã chê (chữ tràn, che mặt, chữ hiện trước lời, chữ tích tụ) chuyển thành test tự động trong A1, không chỉ ghi chữ trong skill.
- [ ] **B2. Resume khi render lỗi**
  Kiểm tra checkpoint từng đoạn có chạy thật không. Lỗi giữa chừng thì chạy tiếp đúng đoạn, không render lại hết.
- [ ] **B3. So khung với video mẫu (Zila)**
  Tự đo màu, cỡ chữ, vị trí so với video mẫu thay vì nhìn bằng mắt.
- [ ] **B4. Kiểm tư liệu tải về**
  Ảnh hoặc logo tải trên mạng: kiểm độ phân giải, nền trong suốt, đúng logo mới nhất trước khi dùng.

## C. Hiệu ứng, motion (làm sau)

- [ ] **C1. Kho component dùng lại**
  Gồm lower-third, logo bay vào, đếm số, so sánh 2 cột, bản đồ, mục lục.
  Mỗi cái có dòng "dùng khi / không dùng khi". Chọn theo nội dung từng đoạn, đoạn bình thường để sạch.
- [ ] **C2. Helper timeline** (kiểu "lúc 1s bay vào, 2s mờ") thay cho tự viết `setT(t)`. Code ngắn hơn, ít lỗi.
- [ ] **C3. Trang xem trước có thanh kéo thời gian**: người dùng tự kéo xem, chỉ báo giây lỗi.
- [ ] **C4. Chuyển cảnh**: 5–8 kiểu (wipe, zoom xuyên, che bằng hình), chỉ dùng khi đổi ý lớn.
- [ ] **C5. Motion graphic tự do**: intro, đoạn quảng cáo sản phẩm, khi content thật sự cần.
