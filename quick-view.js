$(document).ready(function () {

    /* =====================================
       1. TẠO KHUNG QUICK VIEW
    ===================================== */

    if ($('#quickViewOverlay').length === 0) {
        $('body').append(`
            <div class="qv-overlay" id="quickViewOverlay">
                <div class="qv-modal" role="dialog" aria-modal="true"
                     aria-label="Xem nhanh sản phẩm">

                    <button type="button" class="qv-close"
                            id="qvClose" aria-label="Đóng">&times;</button>

                    <div class="qv-content">
                        <div class="qv-image-wrap">
                            <img src="" alt="" class="qv-image" id="qvImage">
                        </div>

                        <div class="qv-info">
                            <h3 class="qv-title" id="qvName"></h3>
                            <div class="qv-price" id="qvPrice"></div>

                            <p class="qv-detail">
                                <strong>Màu sắc:</strong>
                                <span id="qvColor"></span>
                            </p>

                            <p class="qv-detail">
                                <strong>Loại hoa:</strong>
                                <span id="qvFlower"></span>
                            </p>

                            <label class="qv-qty-label">Số lượng</label>

                            <div class="qty-scope">
                                <div class="input-group qty-box qv-qty-box">
                                    <div class="input-group-prepend">
                                        <button class="btn btn-outline-secondary qty-minus"
                                                type="button">−</button>
                                    </div>

                                    <input type="text"
                                           class="form-control text-center qty-input"
                                           id="qvQuantity"
                                           value="1">

                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary qty-plus"
                                                type="button">+</button>
                                    </div>
                                </div>

                                <div class="qv-buy-row mt-3">
                                    <button type="button"
                                            class="btn qv-add-btn btn-add-cart rounded-pill px-4 py-2"
                                            id="qvAddCart">
                                        <i class="fas fa-cart-plus mr-1"></i>
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>

                            <a href="#" class="qv-detail-link" id="qvDetailLink">
                                Xem chi tiết sản phẩm
                                <i class="fas fa-arrow-right ml-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }


   


    /* =====================================
       3. LẤY THÔNG TIN SẢN PHẨM
    ===================================== */

    function layThongTinSanPham($item) {

        var $card = $item.find('.product-card').first();

        var $link = $card.find('a[href*="chi-tiet-sp.html?id="]').first();

        var href = $link.attr('href') || '';

        var match = href.match(/[?&]id=([^&]+)/);
        var id = match ? decodeURIComponent(match[1]) : '';

        var ten = $.trim($card.find('.card-title').first().text());

        var anh = $card.find('img.card-img-top').first().attr('src') || '';

        var gia = parseInt($item.attr('data-price'), 10) || 0;

        var mauSac = $item.attr('data-color') || 'Đang cập nhật';

        var loaiHoa = $item.attr('data-loaihoa') || 'Đang cập nhật';

        // Nếu thiếu dữ liệu cần thiết thì không mở Quick View
        if (!id || !ten || !anh || gia <= 0) {
            return null;
        }

        return {
            id: id,
            name: ten,
            img: anh,
            price: gia,
            color: mauSac,
            flower: loaiHoa,
            detailUrl: href
        };
    }


    /* =====================================
       4. MỞ QUICK VIEW
    ===================================== */

    function moQuickView($item) {

        var sp = layThongTinSanPham($item);

        if (!sp) return;

        // Đổ dữ liệu lên popup
        $('#qvImage').attr({
            src: sp.img,
            alt: sp.name
        });

        $('#qvName').text(sp.name);

        $('#qvPrice').text(
            sp.price.toLocaleString('en-US') + 'đ'
        );

        $('#qvColor').text(sp.color);
        $('#qvFlower').text(sp.flower);

        $('#qvDetailLink').attr('href', sp.detailUrl);

        // Reset số lượng về 1 mỗi lần mở
        $('#qvQuantity').val(1);

        // Gắn đúng dữ liệu mà cart.js đang sử dụng
        $('#qvAddCart').attr({
            'data-id': sp.id,
            'data-name': sp.name,
            'data-price': sp.price,
            'data-img': sp.img
        });

        $('#quickViewOverlay').addClass('qv-show');
        $('body').addClass('qv-no-scroll');
    }


    /* =====================================
       5. ĐÓNG QUICK VIEW
    ===================================== */

    function dongQuickView() {
        $('#quickViewOverlay').removeClass('qv-show');
        $('body').removeClass('qv-no-scroll');
    }

    $(document).on('click', '#qvClose', dongQuickView);

    // Bấm ra vùng nền tối để đóng
    $(document).on('click', '#quickViewOverlay', function (e) {
        if ($(e.target).is('#quickViewOverlay')) {
            dongQuickView();
        }
    });

    // Bấm ESC để đóng
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            dongQuickView();
        }
    });

    // Sau khi thêm vào giỏ, đóng popup
    // cart.js vẫn nhận sự kiện click và xử lý thêm sản phẩm
    $(document).on('click', '#qvAddCart', function () {
        setTimeout(function () {
            dongQuickView();
        }, 100);
    });


    /* =====================================
       6. HOVER 1 GIÂY ĐỂ HIỆN QUICK VIEW
    ===================================== */

    var hoverTimer = null;
    var currentItem = null;

    // Dùng mouseenter/mouseleave để không mở khi chỉ lướt nhanh qua sản phẩm
    $(document).on('mouseenter', '.product-item', function () {

        var $item = $(this);

        clearTimeout(hoverTimer);

        currentItem = $item;

        hoverTimer = setTimeout(function () {

            // Chỉ mở nếu chuột vẫn đang ở đúng sản phẩm
            if (currentItem && currentItem[0] === $item[0]) {
                moQuickView($item);
            }

        }, 1000);

    });

    $(document).on('mouseleave', '.product-item', function () {

        clearTimeout(hoverTimer);
        currentItem = null;

    });


    /* =====================================
       7. NÚT XEM NHANH
       Dành cho thiết bị cảm ứng và thao tác click
    ===================================== */

    $(document).on('click', '.qv-trigger', function (e) {

        e.preventDefault();
        e.stopPropagation();

        clearTimeout(hoverTimer);

        var $item = $(this).closest('.product-item');

        moQuickView($item);

    });


    /* =====================================
       8. CẬP NHẬT NÚT KHI DANH SÁCH THAY ĐỔI
    ===================================== */

    // Gọi lại để đảm bảo sản phẩm sau lọc/sắp xếp vẫn có nút.
    // MutationObserver theo dõi các sản phẩm được thêm vào danh sách.
    var productList = document.getElementById('product-list');

    if (productList && window.MutationObserver) {

        var observer = new MutationObserver(function () {
            khoiTaoQuickView();
        });

        observer.observe(productList, {
            childList: true,
            subtree: true
        });
    }

});