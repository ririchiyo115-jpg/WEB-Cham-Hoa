$(document).ready(function () {

    /* ==================== CẤU HÌNH ==================== */
    var CART_KEY = 'chamhoa_cart';   // tên lưu giỏ hàng trong trình duyệt
    var SHIP_FEE = 30000;            // phí ship cố định
    var FREE_SHIP_FROM = 500000;     // đơn từ mức này trở lên được miễn ship (đặt = 0 nếu không muốn miễn ship)

    /* ==================== HÀM DÙNG CHUNG ==================== */
    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch (e) { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateBadge();
    }

    function formatMoney(n) {
        return n.toLocaleString('en-US') + 'đ';   // 450000 -> 450,000đ (giống kiểu trên web)
    }

    function escapeHtml(text) {
        return $('<div>').text(text).html();
    }

    // Cập nhật số trên biểu tượng giỏ hàng ở header
    function updateBadge() {
        var total = 0;
        getCart().forEach(function (item) { total += item.qty; });
        $('.cart-badge').text(total);
    }

    // Thông báo nhỏ góc phải màn hình
    function showToast(message) {
        var $toast = $('<div>').text(message).css({
            position: 'fixed', top: '90px', right: '20px', zIndex: 9999,
            background: '#d96c8a', color: '#fff', padding: '12px 20px',
            borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            fontWeight: 'bold', display: 'none'
        }).appendTo('body');
        $toast.fadeIn(200).delay(1500).fadeOut(300, function () { $(this).remove(); });
    }

    /* ==================== NÚT + / - CHỌN SỐ LƯỢNG (trang chi tiết) ==================== */
    $(document).on('click', '.qty-plus', function () {
        var $input = $(this).closest('.qty-box').find('.qty-input');
        var v = parseInt($input.val()) || 1;
        if (v < 99) $input.val(v + 1);
    });

    $(document).on('click', '.qty-minus', function () {
        var $input = $(this).closest('.qty-box').find('.qty-input');
        var v = parseInt($input.val()) || 1;
        if (v > 1) $input.val(v - 1);
    });

    // Nếu người dùng tự gõ số vào ô thì kiểm tra lại cho hợp lệ
    $(document).on('change', '.qty-input', function () {
        var v = parseInt($(this).val());
        if (isNaN(v) || v < 1) v = 1;
        if (v > 99) v = 99;
        $(this).val(v);
    });

    /* ==================== THÊM VÀO GIỎ ==================== */
    $(document).on('click', '.btn-add-cart', function (e) {
        e.preventDefault();
        var $btn = $(this);

        // Lấy số lượng từ ô số lượng gần nút nhất; không có thì mặc định là 1
        var qty = parseInt($btn.closest('.qty-scope').find('.qty-input').val()) || 1;

        var item = {
            id: String($btn.data('id')),
            name: $btn.data('name'),
            price: parseInt($btn.data('price')),
            img: $btn.data('img'),
            qty: qty
        };

        var cart = getCart();
        var found = cart.find(function (i) { return i.id === item.id; });
        if (found) { found.qty = Math.min(99, found.qty + qty); }   // đã có -> cộng thêm số lượng
        else { cart.push(item); }                                    // chưa có -> thêm mới

        saveCart(cart);
        showToast('Đã thêm "' + item.name + '" vào giỏ hàng');
    });

    /* ==================== TRANG GIỎ HÀNG (cart.html) ==================== */
    function renderCart() {
        var $list = $('#cart-items');
        if ($list.length === 0) return;     // không phải trang giỏ hàng thì bỏ qua

        var cart = getCart();
        var html = '';
        var subtotal = 0;

        if (cart.length === 0) {
            $('#cart-content').hide();
            $('#cart-empty').show();
            return;
        }
        $('#cart-empty').hide();
        $('#cart-content').show();

        cart.forEach(function (item) {
            var lineTotal = item.price * item.qty;
            subtotal += lineTotal;
            html +=
                '<tr>' +
                  '<td class="align-middle">' +
                    '<div class="d-flex align-items-center">' +
                      '<img src="' + escapeHtml(item.img || '') + '" alt="" style="width:70px;height:70px;object-fit:cover;border-radius:10px;">' +
                      '<span class="ml-3 font-weight-bold">' + escapeHtml(item.name) + '</span>' +
                    '</div>' +
                  '</td>' +
                  '<td class="align-middle text-center">' + formatMoney(item.price) + '</td>' +
                  '<td class="align-middle">' +
                    '<div class="input-group mx-auto" style="width:130px;">' +
                      '<div class="input-group-prepend"><button class="btn btn-outline-secondary btn-sm cart-minus" data-id="' + item.id + '" type="button">−</button></div>' +
                      '<input type="text" class="form-control form-control-sm text-center" value="' + item.qty + '" readonly>' +
                      '<div class="input-group-append"><button class="btn btn-outline-secondary btn-sm cart-plus" data-id="' + item.id + '" type="button">+</button></div>' +
                    '</div>' +
                  '</td>' +
                  '<td class="align-middle text-center text-danger font-weight-bold">' + formatMoney(lineTotal) + '</td>' +
                  '<td class="align-middle text-center">' +
                    '<button class="btn btn-link text-danger cart-remove" data-id="' + item.id + '" title="Xóa khỏi giỏ"><i class="fas fa-trash-alt"></i></button>' +
                  '</td>' +
                '</tr>';
        });

        // Tính phí ship: miễn phí nếu đạt mức FREE_SHIP_FROM
        var ship = (FREE_SHIP_FROM > 0 && subtotal >= FREE_SHIP_FROM) ? 0 : SHIP_FEE;
        var total = subtotal + ship;

        $list.html(html);
        $('#cart-subtotal').text(formatMoney(subtotal));
        $('#cart-ship').text(ship === 0 ? 'Miễn phí' : formatMoney(ship));
        $('#cart-total').text(formatMoney(total));

        if (ship > 0 && FREE_SHIP_FROM > 0) {
            $('#ship-note').text('Mua thêm ' + formatMoney(FREE_SHIP_FROM - subtotal) + ' để được miễn phí giao hàng.');
        } else {
            $('#ship-note').text('');
        }
    }

    // Nút + trong giỏ
    $(document).on('click', '.cart-plus', function () {
        var id = String($(this).data('id'));
        var cart = getCart();
        cart.forEach(function (i) { if (i.id === id && i.qty < 99) i.qty++; });
        saveCart(cart);
        renderCart();
    });

    // Nút - trong giỏ (tối thiểu là 1, muốn bỏ thì bấm nút xóa)
    $(document).on('click', '.cart-minus', function () {
        var id = String($(this).data('id'));
        var cart = getCart();
        cart.forEach(function (i) { if (i.id === id && i.qty > 1) i.qty--; });
        saveCart(cart);
        renderCart();
    });

    // Nút xóa 1 sản phẩm
    $(document).on('click', '.cart-remove', function () {
        var id = String($(this).data('id'));
        var cart = getCart().filter(function (i) { return i.id !== id; });
        saveCart(cart);
        renderCart();
    });

    // Nút thanh toán (demo)
    $(document).on('click', '#btn-checkout', function () {
        alert('Cảm ơn bạn đã đặt hàng tại Chạm Hoa! Tổng thanh toán: ' + $('#cart-total').text());
        saveCart([]);
        renderCart();
    });

    /* ==================== KHỞI TẠO ==================== */
    updateBadge();
    renderCart();
});