# PROMPT CHO ANTIGRAVITY

> Cách dùng: mở thư mục dự án này trong Antigravity (File → Open Folder), mở Agent Manager / Agent panel,
> dán toàn bộ nội dung trong khối bên dưới. Nếu bạn đã cài **taste-skill** cho workspace, prompt sẽ gọi skill này
> ở bước thiết kế. Nếu chưa cài, vẫn chạy được: agent sẽ bám theo các nguyên tắc thẩm mỹ ghi sẵn trong prompt.

---

```
Bạn là lead designer kiêm front-end developer. Dự án trong workspace này là một DEMO thư mời tiệc tất niên
online (HTML + CSS + JavaScript thuần, không build, không framework, chạy được bằng cách mở index.html hoặc
bằng một static server). Nhiệm vụ: nâng demo này thành sản phẩm hoàn chỉnh, đẹp và dùng được thật.

## 0. Quy trình bắt buộc
1. Dùng skill **taste-skill** (nếu có trong workspace) cho toàn bộ quyết định UX/UI. Trước khi viết code, viết
   ngắn gọn một design plan gồm: bảng màu (4–6 màu có tên + mã hex), kiểu chữ và vai trò, ý tưởng bố cục
   (có wireframe ASCII), và 3 nguyên tắc riêng của dự án này. Tự rà lại plan: phần nào giống mẫu thư mời
   "ai cũng làm" thì sửa và nói rõ đã đổi gì.
2. Đọc toàn bộ code hiện có (index.html, admin.html, css/, js/) trước khi sửa. Giữ cấu trúc file, chỉ nâng cấp.
3. Sau khi làm xong, mở bằng trình duyệt trong Antigravity, chụp ảnh màn hình ở 390px (mobile) và 1440px
   (desktop), tự phê bình và sửa. Gửi lại bản tóm tắt những gì đã thay đổi.

## 1. Nội dung thư mời (giữ nguyên chữ, không tự thêm lời quảng cáo)
- H2T MEDIA GROUP
- YEAR END PARTY 2026 — TIỆC TẤT NIÊN
- Trân trọng kính mời — Ông/Bà: [tên khách]
- Đến tham dự Tiệc Tất niên cùng H2T MEDIA GROUP, nhìn lại hành trình một năm đã qua và chào đón năm mới với
  nhiều thành công, may mắn và thịnh vượng.
- Ngày 16 tháng 01 (mặc định năm 2027, vì là tiệc tất niên của năm 2026; sửa được trong admin)
  - 16:30–18:00 | Đón khách, check-in và tham gia các hoạt động chào mừng
  - 18:00 | Khai tiệc
- Nhà hàng Tiamo Phú Thịnh — Khu biệt thự Phú Thịnh, Đường số 2, P. Phú Thọ, TP. Hồ Chí Minh
- Dress code: Trắng · Be · Nude
- Để chương trình diễn ra ý nghĩa và tránh lãng phí, H2T MEDIA GROUP xin phép không nhận hoa chúc mừng.
- Sự hiện diện của Quý vị là niềm vinh hạnh đối với chúng tôi. Trân trọng cảm ơn!

## 2. Tone màu (bám theo dress code Trắng · Be · Nude)
Đây là một buổi tiệc thanh lịch, ấm, sáng. Màu của thư mời phải "mặc cùng" dress code của khách:
- Trắng ngọc trai  #FBF8F3 — nền chính
- Be nhạt          #F1E9DF — nền phụ
- Be đậm           #E6D8C6 — nền khối cảm ơn
- Nude             #D4B49C — màu nhấn mềm (swatch, chi tiết)
- Champagne        #B38F5E (chữ trên nền sáng dùng bản đậm #7F5F35 để đủ tương phản) — đường kẻ, chi tiết sang trọng
- Nâu cacao        #33271F — chữ chính và một khối nền tối duy nhất (phần ngày giờ) để tạo nhịp
Tránh: đỏ/vàng Tết cliché, gradient sặc sỡ, đen thuần, các màu ngoài bảng trên.
Có thể tinh chỉnh bảng màu nếu taste-skill đề xuất tốt hơn, nhưng phải giữ cảm giác trắng–be–nude.

## 3. Hiệu ứng (một khoảnh khắc chính, phần còn lại tiết chế)
- Khoảnh khắc chính ở đầu trang, theo thứ tự: sợi chỉ champagne rủ từ mép trên xuống → tên sự kiện thả từng
  chữ từ trên xuống → câu mời → TÊN KHÁCH thả từng ký tự từ trên xuống (có độ nảy nhẹ và mờ dần vào nét) → đường
  kẻ vàng vẽ ra dưới tên. Tổng thời lượng khoảng 4–5 giây.
- Các phần còn lại chỉ xuất hiện nhẹ khi cuộn (một kiểu duy nhất, không rải hiệu ứng khắp nơi).
- Tôn trọng prefers-reduced-motion. Mọi chữ phải đọc được ngay cả khi tắt hiệu ứng.
- Hiệu ứng dùng transform/opacity, mượt trên điện thoại tầm trung.

## 4. Hai trang
### Trang 1: index.html — thư mời gửi khách
- Tên khách lấy từ URL: index.html?to=Nguyễn%20Văn%20A. Không có tham số thì hiện "Quý khách".
- Các phần: Hero (hiệu ứng tên) → Lời mời (có thể kèm ảnh khung vòm) → Ngày giờ (lịch tháng đánh dấu ngày
  tiệc + timeline lịch trình + nút "Thêm vào lịch" tải file .ics + đếm ngược số ngày) → Địa điểm (địa chỉ, nút
  "Chỉ đường" mở Google Maps, bản đồ nhúng) → Dress code (3 vòng màu mẫu Trắng/Be/Nude) → Thư viện ảnh (có
  lightbox, ẩn nếu chưa có ảnh) → Lưu ý không nhận hoa + lời cảm ơn + nút xác nhận tham dự (ẩn nếu chưa có link).
- Thiết kế mobile-first (khách mở từ Zalo/Messenger trên điện thoại), vẫn đẹp trên desktop.
- Không có thanh menu, không có chữ thừa; mỗi phần chỉ làm một việc.

### Trang 2: admin.html — nơi người mời chỉnh thư mời
- Khóa mật khẩu đơn giản (PASSWORD trong js/admin.js, mặc định h2t2026). Ghi chú rõ đây chỉ là khóa nhẹ.
- Form chỉnh toàn bộ nội dung ở mục 1: tên đơn vị, tên sự kiện, lời mời, ngày/giờ, các mốc lịch trình
  (thêm/xóa), địa điểm + từ khóa Google Maps, màu dress code (thêm/xóa), lưu ý, lời cảm ơn, link xác nhận.
- Hình ảnh: ảnh nền đầu trang, ảnh khung vòm, thư viện ảnh (tải lên nhiều ảnh, tự nén bằng canvas, hoặc nhập
  đường dẫn ảnh trong thư mục images/), có nút xóa.
- Xem trước trực tiếp bên cạnh form (iframe + postMessage), có nút "Phát lại hiệu ứng".
- Tự lưu vào localStorage. Nút "Tải data.js" để xuất dữ liệu; nút "Nhập dữ liệu" và "Khôi phục mặc định".
- Công cụ tạo link theo tên khách: dán danh sách tên (mỗi dòng một tên) → sinh link index.html?to=... → sao chép
  từng link hoặc tất cả.
- Giao diện admin sạch, cùng tone màu với thư mời, dùng được trên laptop và điện thoại.

## 5. Ràng buộc kỹ thuật
- Chỉ HTML, CSS, JavaScript thuần. Không npm, không bundler, không thư viện UI. Font từ Google Fonts:
  Cormorant Garamond (tiêu đề, tên khách) + Be Vietnam Pro (nội dung). Cả hai hỗ trợ tiếng Việt có dấu đầy đủ.
- Code ngắn gọn, dễ đọc, có comment tiếng Việt ở các đoạn chính. Mọi dữ liệu người dùng nhập phải được escape
  khi render để tránh chèn mã.
- Truy cập được: độ tương phản chữ đạt chuẩn, focus nhìn thấy khi dùng bàn phím, alt/aria hợp lý, bấm được
  ở cỡ ngón tay trên mobile.
- Có thẻ meta robots noindex cho cả hai trang (thư mời là riêng tư).
- Chạy được khi mở trực tiếp file (file://) và khi deploy lên Netlify / Vercel / GitHub Pages.

## 6. Tiêu chí nghiệm thu (tự kiểm tra trước khi báo xong)
- [ ] Mở index.html?to=Trần Thị B thấy tên thả xuống đúng, dấu tiếng Việt không bị lệch.
- [ ] Không có cuộn ngang ở 360px, 390px, 768px, 1440px.
- [ ] Sửa nội dung trong admin thì khung xem trước đổi ngay; mở index.html trong cùng trình duyệt thấy bản mới.
- [ ] Tải data.js, thay vào js/data.js, mở bằng trình duyệt khác vẫn thấy bản mới.
- [ ] Nút "Thêm vào lịch" tải được file .ics đúng ngày giờ; nút "Chỉ đường" mở đúng địa chỉ.
- [ ] Bật reduced motion: không còn chuyển động, nội dung hiện đủ.
- [ ] Không có lỗi trong console.

Cuối cùng, viết README.md ngắn (tiếng Việt) hướng dẫn: cách chỉnh sửa, cách gửi link cho từng khách,
cách đưa lên hosting miễn phí.
```
