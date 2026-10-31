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

    /* ==================== THANH TOÁN (CHECKOUT) ==================== */
    // >>> NHÓM SỬA THÔNG TIN NHẬN TIỀN Ở ĐÂY <<<
    var BANK_ID = 'MB';                 // mã ngân hàng theo VietQR: MB, VCB, TCB, ACB, BIDV...
    var BANK_ACCOUNT = '0123456789';    // số tài khoản
    var BANK_OWNER = 'CHAM HOA';        // tên chủ tài khoản (không dấu)
    var WALLET_PHONE = '0900000000';    // số ví điện tử nhận tiền

    var TIME_SLOTS = [
        { label: '08:00 - 10:00', start: 8 },
        { label: '10:00 - 12:00', start: 10 },
        { label: '12:00 - 14:00', start: 12 },
        { label: '14:00 - 16:00', start: 14 },
        { label: '16:00 - 18:00', start: 16 },
        { label: '18:00 - 20:00', start: 18 }
    ];
    var PAY_NAMES = {
        cod: 'Thanh toán khi nhận hàng (COD)',
        qr: 'Chuyển khoản QR ngân hàng',
        wallet: 'Ví điện tử'
    };
    var orderCode = '';
    var checkoutTotal = 0;

    function toYMD(d) {
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }

    function calcTotals(cart) {
        var subtotal = 0;
        cart.forEach(function (i) { subtotal += i.price * i.qty; });
        var ship = (FREE_SHIP_FROM > 0 && subtotal >= FREE_SHIP_FROM) ? 0 : SHIP_FEE;
        return { subtotal: subtotal, ship: ship, total: subtotal + ship };
    }

    // Tạo khung giờ; nếu chọn giao hôm nay thì khóa các khung giờ quá gấp (cần cách hiện tại ít nhất 2 tiếng)
    function refreshSlots() {
        var date = $('#deliver-date').val();
        var now = new Date();
        var isToday = (date === toYMD(now));
        var $sel = $('#deliver-time');
        var current = $sel.val();
        $sel.empty().append('<option value="">-- Chọn khung giờ --</option>');
        TIME_SLOTS.forEach(function (s) {
            var off = isToday && (s.start - now.getHours() < 2);
            $sel.append('<option value="' + s.label + '"' + (off ? ' disabled' : '') + '>' + s.label + (off ? ' (đã quá gấp)' : '') + '</option>');
        });
        if (current && $sel.find('option[value="' + current + '"]:not(:disabled)').length) $sel.val(current);
    }

    function updatePaymentPanel() {
        var m = $('input[name="pay"]:checked').val();
        $('.pay-panel').hide();
        $('#pay-' + m).show();
        if (m === 'qr') {
            var url = 'https://img.vietqr.io/image/' + BANK_ID + '-' + BANK_ACCOUNT + '-compact2.png' +
                '?amount=' + checkoutTotal + '&addInfo=' + encodeURIComponent(orderCode) +
                '&accountName=' + encodeURIComponent(BANK_OWNER);
            $('#qr-img').attr('src', url);
        }
    }

    function buildCheckoutModal(t) {
        $('#checkoutModal').remove();
        var html = `
        <div class="modal fade" id="checkoutModal" tabindex="-1" role="dialog" data-backdrop="static">
          <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-bottom-0 pb-0">
                <h4 class="modal-title brand-text mx-auto">THANH TOÁN</h4>
                <button type="button" class="close position-absolute" style="right:15px;" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body p-4" id="checkout-body">
                <form id="checkout-form" novalidate>

                  <h6 class="font-weight-bold text-pink mb-3"><i class="fas fa-user mr-2"></i>1. Thông tin người đặt</h6>
                  <div class="form-row">
                    <div class="form-group col-md-4">
                      <label class="small font-weight-bold text-muted">Họ và tên *</label>
                      <input type="text" id="sender-name" class="form-control" required>
                      <div class="invalid-feedback">Vui lòng nhập họ tên.</div>
                    </div>
                    <div class="form-group col-md-4">
                      <label class="small font-weight-bold text-muted">Số điện thoại *</label>
                      <input type="tel" id="sender-phone" class="form-control" pattern="0[0-9]{9,10}" required>
                      <div class="invalid-feedback">Số điện thoại gồm 10-11 chữ số, bắt đầu bằng 0.</div>
                    </div>
                    <div class="form-group col-md-4">
                      <label class="small font-weight-bold text-muted">Email *</label>
                      <input type="email" id="sender-email" class="form-control" required>
                      <div class="invalid-feedback">Vui lòng nhập email hợp lệ.</div>
                    </div>
                  </div>

                  <hr>
                  <h6 class="font-weight-bold text-pink mb-3"><i class="fas fa-gift mr-2"></i>2. Thông tin người nhận hoa</h6>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label class="small font-weight-bold text-muted">Họ và tên người nhận *</label>
                      <input type="text" id="recv-name" class="form-control" required>
                      <div class="invalid-feedback">Vui lòng nhập tên người nhận.</div>
                    </div>
                    <div class="form-group col-md-6">
                      <label class="small font-weight-bold text-muted">Số điện thoại người nhận *</label>
                      <input type="tel" id="recv-phone" class="form-control" pattern="0[0-9]{9,10}" required>
                      <div class="invalid-feedback">Số điện thoại gồm 10-11 chữ số, bắt đầu bằng 0.</div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="small font-weight-bold text-muted">Địa chỉ giao hoa *</label>
                    <textarea id="recv-address" class="form-control" rows="2" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" required></textarea>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ giao hoa.</div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label class="small font-weight-bold text-muted">Ngày nhận hoa *</label>
                      <input type="date" id="deliver-date" class="form-control" min="${toYMD(new Date())}" required>
                      <div class="invalid-feedback">Vui lòng chọn ngày nhận từ hôm nay trở đi.</div>
                    </div>
                    <div class="form-group col-md-6">
                      <label class="small font-weight-bold text-muted">Khung giờ nhận hoa *</label>
                      <select id="deliver-time" class="form-control" required></select>
                      <div class="invalid-feedback">Vui lòng chọn khung giờ nhận hoa.</div>
                    </div>
                  </div>

                  <div class="custom-control custom-switch mb-1">
                    <input type="checkbox" class="custom-control-input" id="anonymous">
                    <label class="custom-control-label font-weight-bold" for="anonymous"><i class="fas fa-user-secret mr-1 text-pink"></i>Giao hoa ẩn danh</label>
                  </div>
                  <small class="form-text text-muted mb-3">Tên người đặt sẽ không được tiết lộ cho người nhận, để tạo bất ngờ.</small>

                  <div class="form-group">
                    <label class="small font-weight-bold text-muted">Lời nhắn trên thiệp (không bắt buộc)</label>
                    <textarea id="card-message" class="form-control" rows="3" maxlength="200" placeholder="Viết vài lời gửi đến người nhận..."></textarea>
                    <small class="text-muted"><span id="card-count">0</span>/200 ký tự. Thiệp được tặng miễn phí.</small>
                  </div>

                  <hr>
                  <h6 class="font-weight-bold text-pink mb-3"><i class="fas fa-wallet mr-2"></i>3. Phương thức thanh toán</h6>
                  <div class="custom-control custom-radio mb-2">
                    <input type="radio" id="pay-radio-cod" name="pay" value="cod" class="custom-control-input" checked required>
                    <label class="custom-control-label" for="pay-radio-cod">Thanh toán khi nhận hàng (COD)</label>
                  </div>
                  <div class="custom-control custom-radio mb-2">
                    <input type="radio" id="pay-radio-qr" name="pay" value="qr" class="custom-control-input">
                    <label class="custom-control-label" for="pay-radio-qr">Quét mã QR ngân hàng</label>
                  </div>
                  <div class="custom-control custom-radio mb-3">
                    <input type="radio" id="pay-radio-wallet" name="pay" value="wallet" class="custom-control-input">
                    <label class="custom-control-label" for="pay-radio-wallet">Ví điện tử (MoMo, ZaloPay, VNPay)</label>
                  </div>

                  <div id="pay-cod" class="pay-panel bg-light rounded p-3 mb-3 small">
                    Bạn kiểm tra hoa và thanh toán <strong>${formatMoney(t.total)}</strong> trực tiếp cho nhân viên giao hàng.
                  </div>
                  <div id="pay-qr" class="pay-panel bg-light rounded p-3 mb-3" style="display:none;">
                    <div class="row align-items-center">
                      <div class="col-sm-5 text-center mb-3 mb-sm-0">
                        <img id="qr-img" alt="Mã QR chuyển khoản" style="max-width:200px;width:100%;"
                             onerror="this.style.display='none';document.getElementById('qr-fallback').style.display='block';">
                        <div id="qr-fallback" class="small text-muted" style="display:none;">Không tải được mã QR, vui lòng chuyển khoản theo thông tin bên cạnh.</div>
                      </div>
                      <div class="col-sm-7 small">
                        <p class="mb-1">Ngân hàng: <strong>${BANK_ID}</strong></p>
                        <p class="mb-1">Số tài khoản: <strong>${BANK_ACCOUNT}</strong></p>
                        <p class="mb-1">Chủ tài khoản: <strong>${BANK_OWNER}</strong></p>
                        <p class="mb-1">Số tiền: <strong class="text-danger">${formatMoney(t.total)}</strong></p>
                        <p class="mb-0">Nội dung chuyển khoản: <strong class="text-pink">${orderCode}</strong></p>
                      </div>
                    </div>
                  </div>
                  <div id="pay-wallet" class="pay-panel bg-light rounded p-3 mb-3 small" style="display:none;">
                    <div class="form-group mb-2">
                      <label class="small font-weight-bold text-muted">Chọn ví</label>
                      <select id="wallet-type" class="form-control form-control-sm">
                        <option>MoMo</option><option>ZaloPay</option><option>VNPay</option>
                      </select>
                    </div>
                    Chuyển <strong class="text-danger">${formatMoney(t.total)}</strong> tới số <strong>${WALLET_PHONE}</strong>,
                    nội dung: <strong class="text-pink">${orderCode}</strong>.
                  </div>

                  <hr>
                  <div class="d-flex justify-content-between small mb-1"><span>Tạm tính</span><span>${formatMoney(t.subtotal)}</span></div>
                  <div class="d-flex justify-content-between small mb-1"><span>Phí giao hàng</span><span>${t.ship === 0 ? 'Miễn phí' : formatMoney(t.ship)}</span></div>
                  <div class="d-flex justify-content-between mb-4">
                    <strong>Tổng cộng</strong><strong class="text-danger" style="font-size:1.2rem;">${formatMoney(t.total)}</strong>
                  </div>
                  <button type="submit" class="btn btn-block custom-btn rounded-pill py-2">XÁC NHẬN ĐẶT HÀNG</button>
                </form>
              </div>
            </div>
          </div>
        </div>`;
        $('body').append(html);
        refreshSlots();
    }

    // Bấm nút "Xác nhận thanh toán" -> mở form
    $(document).on('click', '#btn-checkout, .btn-checkout', function () {
        var cart = getCart();
        if (cart.length === 0) { showToast('Giỏ hàng đang trống'); return; }
        var t = calcTotals(cart);
        checkoutTotal = t.total;
        orderCode = 'CH' + String(Date.now()).slice(-6);
        buildCheckoutModal(t);
        $('#checkoutModal').modal('show');
    });

    $(document).on('change', '#deliver-date', refreshSlots);
    $(document).on('change', 'input[name="pay"]', updatePaymentPanel);
    $(document).on('input', '#card-message', function () { $('#card-count').text($(this).val().length); });
    $(document).on('hidden.bs.modal', '#checkoutModal', function () {
        $(this).remove();
        renderCart();
    });

    // Gửi đơn hàng
    $(document).on('submit', '#checkout-form', function (e) {
        e.preventDefault();
        var form = this;
        $(form).addClass('was-validated');
        if (!form.checkValidity()) {
            $(form).find(':invalid').first().focus();
            return;
        }

        var cart = getCart();
        var t = calcTotals(cart);
        var method = $('input[name="pay"]:checked').val();
        var order = {
            code: orderCode,
            createdAt: new Date().toISOString(),
            items: cart,
            subtotal: t.subtotal, ship: t.ship, total: t.total,
            sender: { name: $('#sender-name').val().trim(), phone: $('#sender-phone').val().trim(), email: $('#sender-email').val().trim() },
            receiver: { name: $('#recv-name').val().trim(), phone: $('#recv-phone').val().trim(), address: $('#recv-address').val().trim() },
            deliverDate: $('#deliver-date').val(),
            deliverTime: $('#deliver-time').val(),
            anonymous: $('#anonymous').is(':checked'),
            message: $('#card-message').val().trim(),
            payment: method === 'wallet' ? PAY_NAMES.wallet + ' - ' + $('#wallet-type').val() : PAY_NAMES[method]
        };

        // Lưu đơn vào trình duyệt (demo, chưa có server) rồi xóa giỏ
        var orders = [];
        try { orders = JSON.parse(localStorage.getItem('chamhoa_orders')) || []; } catch (err) {}
        orders.push(order);
        localStorage.setItem('chamhoa_orders', JSON.stringify(orders));
        saveCart([]);

        // Màn hình đặt hàng thành công
        var dateParts = order.deliverDate.split('-');
        var successHtml =
            '<div class="text-center py-3">' +
              '<i class="fas fa-check-circle fa-4x text-pink mb-3"></i>' +
              '<h4 class="brand-text mb-2">Đặt hàng thành công!</h4>' +
              '<p class="text-muted mb-4">Mã đơn hàng: <strong class="text-dark">' + order.code + '</strong></p>' +
            '</div>' +
            '<div class="bg-light rounded p-3 small mb-3">' +
              '<p class="mb-1"><strong>Người nhận:</strong> ' + escapeHtml(order.receiver.name) + ' - ' + escapeHtml(order.receiver.phone) + '</p>' +
              '<p class="mb-1"><strong>Địa chỉ:</strong> ' + escapeHtml(order.receiver.address) + '</p>' +
              '<p class="mb-1"><strong>Thời gian nhận:</strong> ' + order.deliverTime + ', ngày ' + dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0] + '</p>' +
              '<p class="mb-1"><strong>Giao ẩn danh:</strong> ' + (order.anonymous ? 'Có' : 'Không') + '</p>' +
              (order.message ? '<p class="mb-1"><strong>Lời nhắn trên thiệp:</strong> ' + escapeHtml(order.message) + '</p>' : '') +
              '<p class="mb-1"><strong>Thanh toán:</strong> ' + escapeHtml(order.payment) + '</p>' +
              '<p class="mb-0"><strong>Tổng tiền:</strong> <span class="text-danger font-weight-bold">' + formatMoney(order.total) + '</span></p>' +
            '</div>' +
            (method !== 'cod' ? '<p class="small text-center text-muted">Vui lòng chuyển khoản với nội dung <strong>' + order.code + '</strong> để shop xác nhận đơn.</p>' : '') +
            '<a href="index.html" class="btn btn-block custom-btn rounded-pill py-2">VỀ TRANG CHỦ</a>';
        $('#checkout-body').html(successHtml);
        $('#checkoutModal .modal-title').text('CẢM ƠN BẠN');
    });

    /* ==================== KHỞI TẠO ==================== */
    updateBadge();
    renderCart();
});