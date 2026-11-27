# Chạm Hoa

Website bán hoa tươi trực tuyến 

## Thành viên nhóm
1. Lê Minh Hà
2. Vũ Bảo Hân
3. Nguyễn Kim Chi
4. Ngô Thị Linh Chi

## Các chức năng chính

**Trang chủ (`index.html`)**
- Hiển thị banner, các chủ đề hoa (Tình yêu, Tốt nghiệp, Khai trương), top bán chạy, ưu đãi tuần này và bài viết tin tức.
- Bấm vào chủ đề, mục bán chạy hoặc ưu đãi sẽ chuyển thẳng sang đúng danh mục bên trang cửa hàng.
- Có pop-up ưu đãi và form đăng nhập/đăng ký.

**Cửa hàng (`products.html`)**
- Lọc sản phẩm theo từng danh mục, lưu lại mục đang chọn bằng `localStorage`.
- Tìm kiếm theo tên hoa, màu sắc và loại hoa.
- Sắp xếp theo giá (tăng dần, giảm dần hoặc mặc định).

**Chi tiết sản phẩm (`chi-tiet-sp.html`)**
- Lấy dữ liệu từng bó hoa theo `id` trên đường link, tự tính giá sau khi giảm.
- Gợi ý các bó hoa tương tự cùng dịp tặng.
- Chọn số lượng, thêm vào giỏ hàng và lưu vào danh sách yêu thích.

**Các trang khác**
- Giỏ hàng (`cart.html`), danh sách yêu thích (`yeu-thich.html`), tin tức (`news.html`), giới thiệu (`about.html`), liên hệ (`contact.html`) và các trang hướng dẫn/chính sách.

## Công nghệ sử dụng
- HTML, CSS, JavaScript
- Bootstrap 4, jQuery, Font Awesome
- Google Fonts (`Nunito`, `Playfair Display`)
- `localStorage` để lưu giỏ hàng, danh sách yêu thích, danh mục và từ khóa tìm kiếm

## Cấu trúc thư mục

```text
├── index.html          # Trang chủ
├── products.html       # Cửa hàng
├── chi-tiet-sp.html    # Chi tiết sản phẩm
├── cart.html           # Giỏ hàng
├── yeu-thich.html      # Danh sách yêu thích
├── news.html           # Tin tức
├── about.html          # Giới thiệu
├── contact.html        # Liên hệ
├── main.css            # CSS chính
├── main.js             # JS chung (hiệu ứng, pop-up, wishlist)
├── cart.js             # Xử lý giỏ hàng
├── chat.js             # Hỗ trợ chat
└── images/             # Ảnh sản phẩm và banner
```
