/* ==========================================================
   CHẠM HOA - CỬA SỔ LIVECHAT
   Chỉ cần thêm  <script src="chat.js"></script>  vào cuối mỗi trang.
   Không cần sửa HTML/CSS, widget tự tạo giao diện.
   ========================================================== */
(function () {
    'use strict';

    /* ==================== CẤU HÌNH (sửa theo shop) ==================== */
    var CFG = {
        name: 'Chạm Hoa',
        hotline: '1900 2006',
        email: 'cskh@chamhoa.vn',
        address: 'Học viện Ngân hàng, 12 Chùa Bộc, Hà Nội',
        openHours: '07:00 - 21:00 (Thứ 2 - Chủ Nhật)',
        shipInfo: 'Phí giao hàng là 30,000đ, miễn phí cho đơn từ 500,000đ. Shop giao hoa từ 08:00 đến 20:00, đơn giao trong ngày cần đặt trước ít nhất 2 tiếng.'
    };
    var KEY = 'chamhoa_chat';             // lịch sử chat
    var LEAD_KEY = 'chamhoa_chat_leads';  // số điện thoại khách để lại
    var OPEN_KEY = 'chamhoa_chat_open';   // trạng thái đóng/mở
    var SEEN_KEY = 'chamhoa_chat_seen';   // đã mở chat lần nào chưa

    /* ==================== KỊCH BẢN TRẢ LỜI TỰ ĐỘNG ==================== */
    // keys: từ khóa KHÔNG DẤU, chữ thường. Luật đứng trước được ưu tiên.
    var RULES = [
        { keys: ['nhan vien', 'tu van vien', 'gap nguoi', 'nguoi that', 'goi lai'],
          text: 'Mình sẽ chuyển bạn tới nhân viên tư vấn. Bạn để lại số điện thoại ở đây, hoặc gọi hotline ' + CFG.hotline + ' (' + CFG.openHours + ') nhé.' },
        { keys: ['gio mo cua', 'mo cua', 'may gio', 'dong cua', 'lam viec'],
          text: 'Shop mở cửa ' + CFG.openHours + '.' },
        { keys: ['thanh toan', 'cod', 'qr', 'momo', 'zalopay', 'vnpay', 'chuyen khoan', 'tra tien'],
          text: 'Chạm Hoa hỗ trợ 3 cách thanh toán: nhận hàng trả tiền (COD), quét mã QR ngân hàng và ví điện tử (MoMo, ZaloPay, VNPay).' },
        { keys: ['an danh', 'bat ngo', 'giau ten'],
          text: 'Khi thanh toán, bạn bật "Giao hoa ẩn danh", tên người đặt sẽ không được tiết lộ cho người nhận để tạo bất ngờ.' },
        { keys: ['thiep', 'loi nhan', 'loi chuc'],
          text: 'Chạm Hoa tặng thiệp miễn phí. Ở bước thanh toán bạn viết lời nhắn (tối đa 200 ký tự), shop sẽ gửi kèm bó hoa.' },
        { keys: ['phi ship', 'phi giao', 'ship', 'van chuyen', 'giao hang', 'giao hoa', 'bao lau', 'mien phi'],
          text: CFG.shipInfo },
        { keys: ['sinh nhat', 'tinh yeu', 'khai truong', 'tot nghiep', 'goi y', 'tu van', 'nen tang', 'tang gi', 'loai hoa', 'mau hoa'],
          text: 'Bạn có thể xem toàn bộ mẫu hoa theo chủ đề (tình yêu, sinh nhật, khai trương, tốt nghiệp...) tại Cửa hàng. Cho mình biết dịp tặng và ngân sách, mình sẽ gợi ý thêm nhé.',
          link: ['products.html', 'Xem cửa hàng'] },
        { keys: ['gia', 'bao nhieu', 'bang gia', 'tien'],
          text: 'Giá từng bó hoa được ghi rõ trong trang Cửa hàng. Bạn có thể cho mình biết ngân sách để mình gợi ý nhé.',
          link: ['products.html', 'Xem cửa hàng'] },
        { keys: ['tuoi', 'bao quan', 'heo', 'ben'],
          text: 'Hoa của Chạm Hoa được cắm tươi mỗi ngày, cam kết tươi trên 3 ngày. Bạn có thể xem mẹo giữ hoa lâu héo trong mục Tin tức.' },
        { keys: ['dia chi', 'o dau', 'cua hang o', 'ban do', 'duong di'],
          text: 'Chạm Hoa ở ' + CFG.address + '.' },
        { keys: ['hotline', 'so dien thoai', 'sdt', 'lien he', 'email', 'goi dien'],
          text: 'Bạn liên hệ hotline ' + CFG.hotline + ' hoặc email ' + CFG.email + ' nhé.' },
        { keys: ['doi tra', 'hoan tien', 'huy don', 'huy hang', 'khieu nai', 'bi loi'],
          text: 'Mình rất tiếc nếu có điều chưa hài lòng. Bạn gọi hotline ' + CFG.hotline + ' hoặc để lại số điện thoại ở đây để nhân viên hỗ trợ bạn sớm nhất.' },
        { keys: ['cam on', 'thanks', 'thank'],
          text: 'Rất vui được hỗ trợ bạn! Chúc bạn chọn được bó hoa ưng ý.' },
        { keys: [' chao ', ' hi ', 'hello', 'xin chao', 'alo'],
          text: 'Chào bạn! Mình có thể giúp gì cho bạn ạ?' }
    ];
    var FALLBACK = 'Mình chưa hiểu rõ câu hỏi này. Bạn thử chọn một gợi ý bên dưới, hoặc để lại số điện thoại để nhân viên liên hệ lại, hoặc gọi hotline ' + CFG.hotline + ' nhé.';
    var WELCOME = 'Chào bạn! Mình là trợ lý của ' + CFG.name + '. Bạn cần mình hỗ trợ gì ạ?';
    var QUICK = ['Phí giao hàng', 'Giờ mở cửa', 'Thanh toán', 'Giao hoa ẩn danh', 'Gợi ý hoa', 'Gặp nhân viên'];

    /* ==================== TIỆN ÍCH ==================== */
    function load(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
    function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    function hhmm(ts) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
    function normalize(t) {
        return ' ' + t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
            .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    }
    function findPhone(t) {
        var m = t.replace(/[\s.\-]/g, '').match(/(?:\+84|0)\d{9,10}/);
        return m ? m[0] : null;
    }
    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function getReply(userText) {
        var phone = findPhone(userText);
        if (phone) {
            var leads = load(LEAD_KEY, []);
            leads.push({ phone: phone, note: userText, at: new Date().toISOString() });
            save(LEAD_KEY, leads);
            return { text: 'Cảm ơn bạn! Chạm Hoa đã ghi nhận số ' + phone + ', nhân viên sẽ liên hệ lại với bạn sớm nhất.' };
        }
        var n = normalize(userText);
        for (var i = 0; i < RULES.length; i++) {
            for (var j = 0; j < RULES[i].keys.length; j++) {
                var k = RULES[i].keys[j];
                // so khớp nguyên từ/cụm từ (key có sẵn dấu cách đầu thì giữ nguyên)
                if (n.indexOf(k.charAt(0) === ' ' ? k : ' ' + k + ' ') !== -1) {
                    return { text: RULES[i].text, link: RULES[i].link };
                }
            }
        }
        return { text: FALLBACK };
    }

    /* ==================== GIAO DIỆN ==================== */
    var CSS = '' +
    '.ch-chat-btn{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;border:none;background:#d96c8a;color:#fff;font-size:26px;cursor:pointer;z-index:1030;box-shadow:0 6px 18px rgba(217,108,138,.5);transition:transform .2s,background .2s;display:flex;align-items:center;justify-content:center;padding:0}' +
    '.ch-chat-btn:hover{transform:scale(1.08);background:#b8506d}' +
    '.ch-chat-badge{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:#ff4757;color:#fff;font-size:12px;font-weight:bold;display:flex;align-items:center;justify-content:center;border:2px solid #fff;padding:0 4px}' +
    '.ch-chat-panel{position:fixed;right:20px;bottom:92px;width:350px;max-width:calc(100vw - 20px);height:500px;max-height:calc(100vh - 110px);background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.25);z-index:1030;display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(20px) scale(.95);pointer-events:none;transition:opacity .2s,transform .2s;font-family:"Nunito",sans-serif;color:#5c4d51}' +
    '.ch-chat-panel.ch-open{opacity:1;transform:none;pointer-events:auto}' +
    '.ch-chat-head{background:#d96c8a;color:#fff;padding:12px 14px;display:flex;align-items:center}' +
    '.ch-chat-avatar{width:40px;height:40px;border-radius:50%;background:#fff;color:#d96c8a;display:flex;align-items:center;justify-content:center;font-size:20px;margin-right:10px;flex-shrink:0}' +
    '.ch-chat-title{flex:1;line-height:1.25}' +
    '.ch-chat-title b{display:block;font-size:15px}' +
    '.ch-chat-title small{font-size:12px;opacity:.95}' +
    '.ch-chat-title small:before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#7CFC9A;margin-right:5px}' +
    '.ch-chat-icon{background:none;border:none;color:#fff;font-size:16px;cursor:pointer;padding:6px;opacity:.9}' +
    '.ch-chat-icon:hover{opacity:1}' +
    '.ch-chat-body{flex:1;overflow-y:auto;padding:14px;background:#fdfbf7}' +
    '.ch-chat-row{display:flex;margin-bottom:10px}' +
    '.ch-chat-row.ch-me{justify-content:flex-end}' +
    '.ch-chat-msg{max-width:80%;padding:9px 13px;border-radius:16px;font-size:14px;line-height:1.45;word-wrap:break-word;white-space:pre-wrap}' +
    '.ch-bot .ch-chat-msg{background:#fff;border:1px solid #f0e4e7;border-bottom-left-radius:4px;color:#5c4d51}' +
    '.ch-me .ch-chat-msg{background:#d96c8a;color:#fff;border-bottom-right-radius:4px}' +
    '.ch-chat-time{display:block;font-size:10px;opacity:.6;margin-top:3px}' +
    '.ch-chat-link{display:inline-block;margin-top:6px;padding:5px 12px;border-radius:14px;background:#f8cdda;color:#b8506d!important;font-weight:bold;font-size:13px;text-decoration:none!important}' +
    '.ch-chat-typing span{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:#d96c8a;animation:ch-blink 1.2s infinite}' +
    '.ch-chat-typing span:nth-child(2){animation-delay:.2s}.ch-chat-typing span:nth-child(3){animation-delay:.4s}' +
    '@keyframes ch-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}' +
    '.ch-chat-quick{display:flex;gap:6px;overflow-x:auto;padding:8px 10px;background:#fff;border-top:1px solid #f0e4e7;scrollbar-width:none}' +
    '.ch-chat-quick::-webkit-scrollbar{display:none}' +
    '.ch-chat-chip{flex-shrink:0;border:1px solid #d96c8a;background:#fff;color:#d96c8a;border-radius:16px;padding:4px 11px;font-size:12.5px;cursor:pointer;white-space:nowrap}' +
    '.ch-chat-chip:hover{background:#d96c8a;color:#fff}' +
    '.ch-chat-form{display:flex;padding:10px;background:#fff;border-top:1px solid #f0e4e7}' +
    '.ch-chat-input{flex:1;border:1px solid #e0d5d7;border-radius:20px;padding:8px 14px;font-size:14px;outline:none;color:#5c4d51;background:#fff;min-width:0}' +
    '.ch-chat-input:focus{border-color:#d96c8a;box-shadow:0 0 0 .15rem rgba(217,108,138,.2)}' +
    '.ch-chat-send{width:38px;height:38px;margin-left:8px;border:none;border-radius:50%;background:#d96c8a;color:#fff;cursor:pointer;flex-shrink:0;padding:0}' +
    '.ch-chat-send:hover{background:#b8506d}' +
    '@media(max-width:480px){.ch-chat-panel{right:10px;bottom:84px;width:calc(100vw - 20px);height:calc(100vh - 100px)}.ch-chat-btn{right:14px;bottom:14px}}';

    function init() {
        if (document.getElementById('ch-chat-root')) return;

        var style = el('style'); style.textContent = CSS; document.head.appendChild(style);

        var root = el('div'); root.id = 'ch-chat-root';

        // Nút tròn
        var btn = el('button', 'ch-chat-btn');
        btn.type = 'button'; btn.title = 'Chat với ' + CFG.name; btn.setAttribute('aria-label', 'Mở cửa sổ chat');
        btn.innerHTML = '<i class="fas fa-comment-dots"></i>';
        var badge = el('span', 'ch-chat-badge', '1');
        btn.appendChild(badge);

        // Khung chat
        var panel = el('div', 'ch-chat-panel');
        panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Chat với ' + CFG.name);

        var head = el('div', 'ch-chat-head');
        var avatar = el('div', 'ch-chat-avatar'); avatar.innerHTML = '<i class="fas fa-seedling"></i>';
        var title = el('div', 'ch-chat-title');
        title.appendChild(el('b', '', 'Trợ lý ' + CFG.name));
        title.appendChild(el('small', '', 'Hỗ trợ trực tuyến'));
        var clearBtn = el('button', 'ch-chat-icon'); clearBtn.type = 'button'; clearBtn.title = 'Xóa cuộc trò chuyện';
        clearBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        var closeBtn = el('button', 'ch-chat-icon'); closeBtn.type = 'button'; closeBtn.title = 'Thu nhỏ';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        head.appendChild(avatar); head.appendChild(title); head.appendChild(clearBtn); head.appendChild(closeBtn);

        var body = el('div', 'ch-chat-body');

        var quick = el('div', 'ch-chat-quick');
        QUICK.forEach(function (q) {
            var c = el('button', 'ch-chat-chip', q); c.type = 'button';
            c.addEventListener('click', function () { send(q); });
            quick.appendChild(c);
        });

        var form = el('form', 'ch-chat-form'); form.autocomplete = 'off';
        var input = el('input', 'ch-chat-input'); input.type = 'text'; input.placeholder = 'Nhập tin nhắn...'; input.maxLength = 300;
        var sendBtn = el('button', 'ch-chat-send'); sendBtn.type = 'submit'; sendBtn.title = 'Gửi';
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        form.appendChild(input); form.appendChild(sendBtn);

        panel.appendChild(head); panel.appendChild(body); panel.appendChild(quick); panel.appendChild(form);
        root.appendChild(panel); root.appendChild(btn);
        document.body.appendChild(root);

        /* ---------- Hiển thị tin nhắn ---------- */
        var history = load(KEY, []);

        function scrollDown() { body.scrollTop = body.scrollHeight; }

        function renderMsg(m) {
            var row = el('div', 'ch-chat-row ' + (m.from === 'me' ? 'ch-me' : 'ch-bot'));
            var bubble = el('div', 'ch-chat-msg');
            bubble.appendChild(document.createTextNode(m.text));
            if (m.link) {
                bubble.appendChild(document.createElement('br'));
                var a = el('a', 'ch-chat-link', m.link[1]); a.href = m.link[0];
                bubble.appendChild(a);
            }
            bubble.appendChild(el('span', 'ch-chat-time', hhmm(m.t)));
            row.appendChild(bubble);
            body.appendChild(row);
            scrollDown();
        }

        function addMsg(from, text, link) {
            var m = { from: from, text: text, t: Date.now() };
            if (link) m.link = link;
            history.push(m);
            if (history.length > 60) history = history.slice(-60);
            save(KEY, history);
            renderMsg(m);
        }

        function showTyping() {
            var row = el('div', 'ch-chat-row ch-bot');
            var bubble = el('div', 'ch-chat-msg ch-chat-typing');
            bubble.innerHTML = '<span></span><span></span><span></span>';
            row.appendChild(bubble); body.appendChild(row); scrollDown();
            return row;
        }

        var busy = false;
        function send(text) {
            text = (text || '').trim();
            if (!text || busy) return;
            addMsg('me', text);
            busy = true;
            var typing = showTyping();
            var reply = getReply(text);
            setTimeout(function () {
                body.removeChild(typing);
                addMsg('bot', reply.text, reply.link);
                busy = false;
            }, 600 + Math.min(reply.text.length * 8, 900));
        }

        function resetChat() {
            history = [];
            save(KEY, history);
            body.innerHTML = '';
            addMsg('bot', WELCOME);
        }

        if (history.length === 0) {
            history.push({ from: 'bot', text: WELCOME, t: Date.now() });
            save(KEY, history);
        }
        history.forEach(renderMsg);

        /* ---------- Đóng / mở ---------- */
        function setOpen(open) {
            panel.classList.toggle('ch-open', open);
            try { sessionStorage.setItem(OPEN_KEY, open ? '1' : '0'); } catch (e) {}
            if (open) {
                localStorage.setItem(SEEN_KEY, '1');
                badge.style.display = 'none';
                btn.firstChild.className = 'fas fa-chevron-down';
                setTimeout(function () { scrollDown(); input.focus(); }, 220);
            } else {
                btn.firstChild.className = 'fas fa-comment-dots';
            }
        }

        if (localStorage.getItem(SEEN_KEY)) badge.style.display = 'none';
        var isOpen = false;
        btn.addEventListener('click', function () { isOpen = !isOpen; setOpen(isOpen); });
        closeBtn.addEventListener('click', function () { isOpen = false; setOpen(false); });
        clearBtn.addEventListener('click', function () { if (window.confirm('Xóa toàn bộ cuộc trò chuyện?')) resetChat(); });
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var v = input.value; input.value = '';
            send(v);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) { isOpen = false; setOpen(false); }
        });

        // Giữ nguyên trạng thái mở khi chuyển trang trong cùng một phiên
        try { if (sessionStorage.getItem(OPEN_KEY) === '1') { isOpen = true; setOpen(true); } } catch (e) {}
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();