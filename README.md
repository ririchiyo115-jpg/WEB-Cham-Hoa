# 🌸 Chạm Hoa — Website Bán Hoa Tươi Trực Tuyến
> *"Mang cảm xúc gửi trao"*
**Chạm Hoa** là dự án website chuyên cung cấp các dòng hoa tươi thiết kế theo chủ đề (Tình yêu, Tốt nghiệp, Khai trương)
## Thành viên thực hiện (Nhóm 4)

| STT | Họ và tên |
| 1 | Minh Hà |
| 2 | Bảo Hân |
| 3 | Kim Chi |
| 4 | Linh Chi |

## ✨ Tính năng nổi bật

* **Trang chủ (`index.html`):**
  * Giao diện hiện đại với Banner, dải cam kết dịch vụ, mục **Khám phá theo chủ đề**, **Top hoa bán chạy**, **Ưu đãi tuần này**, và **Tin tức & Mẹo vặt**.
  * Tích hợp **Pop-up khuyến mãi** tự động hiển thị và **Modal Đăng nhập / Đăng ký**.
  * Điều hướng trực tiếp từ các chủ đề, mục Bán chạy và Ưu đãi sang đúng danh mục tương ứng tại trang Cửa hàng.
* **Trang Cửa hàng (`products.html`):**
  * **Lọc sản phẩm theo danh mục:** Tất cả hoa, Hoa Tình Yêu, Hoa Tốt Nghiệp, Hoa Khai Trương, Top Bán Chạy, Hoa Khuyến Mãi (đồng bộ trạng thái qua `localStorage`).
  * **Tìm kiếm thông minh:** Lọc sản phẩm theo thời gian thực dựa trên tên bó hoa, màu sắc và loài hoa chính.
  * **Sắp xếp sản phẩm:** Theo thứ tự mặc định, giá thấp đến cao, hoặc giá cao xuống thấp.
* **Trang Chi tiết sản phẩm (`chi-tiet-sp.html`):**
  * Tự động tải dữ liệu chi tiết bó hoa dựa trên tham số URL (`?id=...`), tự động tính và hiển thị giá sau giảm.
  * Gợi ý **Sản phẩm tương tự** cùng nhóm dịp tặng.
  * Hỗ trợ điều chỉnh số lượng, thêm vào **Giỏ hàng** và lưu vào **Danh sách yêu thích (Wishlist)**.
* **Các trang tiện ích khác:** Giỏ hàng (`cart.html`), Yêu thích (`yeu-thich.html`), Tin tức (`news.html`), Về chúng tôi (`about.html`), Liên hệ (`contact.html`) và các trang chính sách hỗ trợ.


## 🛠️ Công nghệ sử dụng

* **Ngôn ngữ:** HTML5, CSS3, JavaScript (ES6)
* **Thư viện & Framework:** Bootstrap 4, jQuery 3.5, Font Awesome 5
* **Font chữ:** Google Fonts (`Nunito`, `Playfair Display`)
* **Lưu trữ phía trình duyệt:** `localStorage` (dùng cho giỏ hàng, danh sách yêu thích, ghi nhớ danh mục và từ khóa tìm kiếm)


## 📁 Cấu trúc thư mục chính
├── index.html               # Trang chủ
├── products.html            # Trang cửa hàng & bộ lọc sản phẩm
├── chi-tiet-sp.html         # Trang chi tiết sản phẩm động
├── cart.html                # Trang giỏ hàng
├── yeu-thich.html           # Trang danh sách hoa yêu thích
├── news.html                # Trang tin tức & bài viết chi tiết
├── about.html               # Trang giới thiệu
├── contact.html             # Trang liên hệ
├── main.css                 # File định dạng giao diện chính
├── main.js                  # Xử lý hiệu ứng, Pop-up & đồng bộ Wishlist
├── cart.js                  # Xử lý logic giỏ hàng
└── images/                  # Thư mục chứa hình ảnh sản phẩm & banner
