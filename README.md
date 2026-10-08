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

## Lưu ý quan trọng về việc lưu chỉnh sửa
Trang admin lưu vào trình duyệt của người đang chỉnh (localStorage), nên khách mở link trên máy khác
sẽ **chưa thấy** thay đổi. Để mọi khách thấy bản mới:
1. Chỉnh xong trong admin, bấm **Tải data.js**.
2. Thay file `js/data.js` bằng file vừa tải, rồi đưa lại lên hosting.
3. Ảnh muốn chia sẻ cho mọi khách nên chép vào thư mục `images/` và nhập bằng đường dẫn
   (ảnh tải trực tiếp trong admin chỉ nằm trong trình duyệt của bạn).

Mật khẩu admin chỉ là khóa nhẹ phía trình duyệt, không phải bảo mật thật. Nếu cần bảo mật,
hãy đặt trang admin sau một dịch vụ đăng nhập của hosting.

## Về ngày tổ chức
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
