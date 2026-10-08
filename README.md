# Thư mời tiệc tất niên H2T Media Group 2026 (demo)

Web tĩnh, chỉ dùng HTML + CSS + JS thuần.

## Chạy thử
Mở thư mục này bằng Antigravity (File → Open Folder), sau đó chạy một trong hai cách:
- Bấm chuột phải `index.html` → Open with Live Server (nếu đã cài extension), hoặc
- Mở terminal và chạy: `python3 -m http.server 5500`, rồi vào `http://localhost:5500`.

Mở trực tiếp file `index.html` bằng trình duyệt cũng được.

## Hai trang
| Trang | Dành cho | Địa chỉ |
|---|---|---|
| `index.html` | Khách mời | `index.html?to=Nguyễn Văn A` (tên khách hiện trong hiệu ứng) |
| `admin.html` | Người mời | Mật khẩu mặc định `h2t2026` (đổi trong `js/admin.js`) |

## Cấu trúc
```
index.html        thư mời cho khách
admin.html        trang chỉnh sửa + xem trước + tạo link
css/style.css     giao diện thư mời (bảng màu ở :root)
css/admin.css     giao diện admin
js/data.js        nội dung mặc định của thư mời
js/store.js       đọc/ghi dữ liệu
js/invite.js      dựng thư mời + hiệu ứng + file lịch .ics
js/admin.js       logic trang admin
images/           để ảnh của bạn (dùng đường dẫn images/ten-anh.jpg)
PROMPT.md         prompt dán vào Antigravity để hoàn thiện sản phẩm
```

## Hướng dẫn chỉnh màu (Theme)
Bạn có thể thay đổi màu sắc toàn bộ thư mời trong trang **admin**:
1. Chọn một trong các **Bộ màu có sẵn** để xem kết quả nhanh.
2. Bạn cũng có thể tùy biến từng vai trò màu (nền chính, chữ chính, màu nhấn...). Hệ thống sẽ tự động kiểm tra xem chữ có bị quá nhạt khó đọc không (độ tương phản) và gợi ý nút "Tự chỉnh giúp tôi" nếu cần.
3. Nếu ưng ý một phối màu, hãy bấm **Lưu bộ màu này** để dùng lại sau.

## Hướng dẫn sử dụng Clip giới thiệu
1. Bật **Hiện clip trên thư mời** ở trang admin.
2. Dán link video (YouTube, Vimeo, Google Drive) hoặc nhập đường dẫn file video (`media/clip.mp4`). **Ghi chú:** Với file MP4, nếu video nặng, hãy up lên YouTube ở chế độ không công khai. Nếu file nhỏ (< 25MB), bạn hãy bỏ video vào thư mục `media/` và dán đường dẫn `media/tên-file.mp4`.
3. Dùng **bộ chọn vị trí (sơ đồ thư mời)** để chèn video vào vị trí thích hợp: giữa các nội dung, đặt làm nền mờ cho phần Đầu trang, hoặc nút nổi ở góc màn hình. Chọn các thiết lập tỉ lệ và kiểu khung cho đồng bộ với giao diện.

## Lưu ý quan trọng về việc xuất bản bản chỉnh sửa
Trang admin lưu vào trình duyệt của người đang chỉnh (localStorage), nên khách mở link trên máy khác
sẽ **chưa thấy** thay đổi. Để mọi khách thấy bản mới:
1. Chỉnh màu, vị trí video và nội dung xong trong admin, bấm **Tải data.js**.
2. Thay file `js/data.js` bằng file vừa tải, rồi đưa lại lên hosting / Cloudflare Workers.
3. Ảnh muốn chia sẻ cho mọi khách nên chép vào thư mục `images/`, video nhỏ để vào `media/` và nhập bằng đường dẫn. Mật khẩu admin chỉ là khóa nhẹ phía trình duyệt.
Demo đặt ngày **16/01/2027** (tiệc tất niên cho năm 2026). Nếu tiệc diễn ra năm khác, đổi trong admin → Thời gian và lịch trình.

## Đưa lên Hosting Miễn phí
Bạn có thể dễ dàng chia sẻ thư mời bằng cách đẩy toàn bộ thư mục này (đã thay `js/data.js` mới) lên các dịch vụ hosting tĩnh miễn phí:

- **Netlify / Vercel:** 
  1. Đăng nhập Netlify Drop hoặc Vercel CLI/Web.
  2. Kéo thả toàn bộ thư mục `h2t-invitation` (chứa `index.html`) vào giao diện.
  3. Lấy link public và gửi cho khách.

- **GitHub Pages:**
  1. Tạo repo mới trên GitHub, upload toàn bộ các file.
  2. Vào `Settings` -> `Pages`, chọn nhánh `main` (hoặc `master`) ở phần *Source*.
  3. Link trang web sẽ là `https://<username>.github.io/<repo-name>/`.
