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
