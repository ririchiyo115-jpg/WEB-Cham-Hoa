$(document).ready(function() {
    // 1. Hiệu ứng làm mờ và trượt lên cho banner ở trang chủ
    $('.banner-content').css({'opacity': 0, 'transform': 'translateY(30px)'});
    
    setTimeout(function() {
        $('.banner-content').css({
            'transition': 'all 1s ease', 
            'opacity': 1, 
            'transform': 'translateY(0)'
        });
    }, 200);

    // 2. Hiệu ứng thanh Header (Nav) dính chặt và đổi kiểu khi cuộn chuột
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) { 
            $('.navbar').addClass('py-2 shadow-sm'); 
        } else { 
            $('.navbar').removeClass('py-2 shadow-sm'); 
        }
    });
});
// Tự động đồng bộ số lượng hoa yêu thích trên thanh menu ở mọi trang
function dongBoSoLuongYeuThich() {
    const ds = JSON.parse(localStorage.getItem('wishlistHoa')) || [];
    document.querySelectorAll('.header-wishlist-count').forEach(function(el) {
        el.innerText = ds.length;
    });
}
dongBoSoLuongYeuThich();
document.addEventListener('DOMContentLoaded', dongBoSoLuongYeuThich);
window.addEventListener('pageshow', dongBoSoLuongYeuThich);


// TỰ ĐỘNG HIỂN THỊ POP-UP KHUYẾN MÃI 

$(document).ready(function() {
    // Đợi 2 giây sau khi web load xong thì tự động hiện pop-up
    setTimeout(function() {
        $('#promoModal').modal('show');
    }, 2000);
});


// XỬ LÝ ĐĂNG KÝ, ĐĂNG NHẬP & LƯU TRẠNG THÁI (LOCALSTORAGE)
$(document).ready(function() {
    // 1. Hàm cập nhật giao diện nút Đăng nhập trên Header
    function capNhatHeaderAuth() {
        const userHienTai = JSON.parse(localStorage.getItem('userDangNhap'));
        const $btnLogin = $('a[data-target="#loginModal"]');

        if (userHienTai) {
            // Đã đăng nhập: đổi chữ thành "Chào, [Tên]" và bỏ mở modal
            $btnLogin.removeAttr('data-toggle data-target');
            $btnLogin.attr('title', 'Bấm để đăng xuất');
            $btnLogin.html(`<i class="fas fa-user-check fa-lg text-pink mr-1"></i><span class="d-none d-xl-inline small">Chào, ${userHienTai.hoTen}</span>`);

            // Bấm vào tên để đăng xuất
            $btnLogin.off('click.logout').on('click.logout', function(e) {
                e.preventDefault();
                if (confirm('Bạn có muốn đăng xuất không?')) {
                    localStorage.removeItem('userDangNhap');
                    location.reload();
                }
            });
        }
    }

    // Chạy ngay khi vừa load trang
    capNhatHeaderAuth();

    // 2. Xử lý form ĐĂNG KÝ
    $('#registerModal form').on('submit', function(e) {
        e.preventDefault();
        const hoTen = $(this).find('input[type="text"]').val().trim();
        const email = $(this).find('input[type="email"]').val().trim();
        const matKhau = $(this).find('input[type="password"]').val().trim();

        let dsTaiKhoan = JSON.parse(localStorage.getItem('dsTaiKhoan')) || [];

        // Kiểm tra trùng email
        if (dsTaiKhoan.some(u => u.email === email)) {
            alert('Email này đã được đăng ký!');
            return;
        }

        // Lưu tài khoản mới
        dsTaiKhoan.push({ hoTen, email, matKhau });
        localStorage.setItem('dsTaiKhoan', JSON.stringify(dsTaiKhoan));

        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        $(this)[0].reset();
        $('#registerModal').modal('hide');
        $('#loginModal').modal('show');
    });

    // 3. Xử lý form ĐĂNG NHẬP
    $('#loginModal form').on('submit', function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val().trim();
        const matKhau = $(this).find('input[type="password"]').val().trim();

        const dsTaiKhoan = JSON.parse(localStorage.getItem('dsTaiKhoan')) || [];
        const user = dsTaiKhoan.find(u => u.email === email && u.matKhau === matKhau);

        if (user) {
            localStorage.setItem('userDangNhap', JSON.stringify(user));
            alert('Đăng nhập thành công! Chào mừng ' + user.hoTen);
            $('#loginModal').modal('hide');
            capNhatHeaderAuth();
        } else {
            alert('Sai email hoặc mật khẩu!');
        }
    });
    // 4. Xử lý form QUÊN MẬT KHẨU
    $('#forgotPasswordForm').on('submit', function(e) {
        e.preventDefault();
        const email = $('#forgotEmail').val().trim();
        const matKhauMoi = $('#newPassword').val().trim();

        let dsTaiKhoan = JSON.parse(localStorage.getItem('dsTaiKhoan')) || [];
        const viTri = dsTaiKhoan.findIndex(u => u.email === email);

        if (viTri === -1) {
            alert('Không tìm thấy tài khoản nào với email này!');
            return;
        }

        // Cập nhật mật khẩu mới và lưu lại vào localStorage
        dsTaiKhoan[viTri].matKhau = matKhauMoi;
        localStorage.setItem('dsTaiKhoan', JSON.stringify(dsTaiKhoan));

        alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        $(this)[0].reset();
        $('#forgotPasswordModal').modal('hide');
        $('#loginModal').modal('show');
    });
});