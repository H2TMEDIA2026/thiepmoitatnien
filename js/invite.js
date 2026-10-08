/* Trang thư mời dành cho khách: index.html?to=Tên khách */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var isPreview = params.get('preview') === '1';
  var WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  var current = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function nl2br(s) { return esc(s).replace(/\n/g, '<br>'); }
  function pad(n) { return String(n).padStart(2, '0'); }

  /* Tách chữ để thả từng ký tự từ trên xuống */
  function dropText(text) {
    var i = 0;
    return String(text).normalize('NFC').split(/\s+/).filter(Boolean).map(function (w) {
      return '<span class="w">' + Array.from(w).map(function (ch) {
        return '<span class="ch" style="--i:' + (i++) + '">' + esc(ch) + '</span>';
      }).join('') + '</span>';
    }).join(' ');
  }

  function parseDate(str) {
    var p = String(str).split('-').map(Number);
    return { y: p[0], m: p[1], d: p[2], date: new Date(p[0], p[1] - 1, p[2]) };
  }

  function calendar(dt) {
    var first = new Date(dt.y, dt.m - 1, 1);
    var offset = (first.getDay() + 6) % 7; // tuần bắt đầu từ Thứ Hai
    var total = new Date(dt.y, dt.m, 0).getDate();
    var cells = '';
    for (var i = 0; i < offset; i++) cells += '<span></span>';
    for (var d = 1; d <= total; d++) cells += '<span' + (d === dt.d ? ' class="on"' : '') + '>' + d + '</span>';
    var heads = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(function (x) { return '<b>' + x + '</b>'; }).join('');
    return '<div class="cal" role="img" aria-label="Lịch tháng ' + dt.m + ' năm ' + dt.y + ', ngày ' + dt.d + ' được đánh dấu">' +
      '<p class="cal-title">Tháng ' + pad(dt.m) + ' năm ' + dt.y + '</p>' +
      '<div class="cal-grid" aria-hidden="true">' + heads + cells + '</div></div>';
  }

  function countdown(dt) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var n = Math.round((dt.date - today) / 864e5);
    if (n > 0) return 'Còn ' + n + ' ngày nữa';
    if (n === 0) return 'Hôm nay là ngày diễn ra tiệc';
    return '';
  }

  function render(data, opts) {
    opts = opts || {};
    current = data;
    document.body.classList.toggle('instant', !!opts.instant);

    var guest = (params.get('to') || '').trim() || data.defaultGuest || 'Quý khách';
    var dt = parseDate(data.date);
    var weekday = WEEKDAYS[dt.date.getDay()];
    var cd = countdown(dt);
    var mapQ = data.mapQuery || (data.venue + ' ' + data.address);
    var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQ);
    var embedUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(mapQ) + '&output=embed';

    var coverStyle = data.coverImage ? ' style="--cover:url(\'' + data.coverImage.replace(/'/g, '%27') + '\')"' : '';

    var html = '';

    /* ---------- HERO ---------- */
    html += '<header class="hero' + (data.coverImage ? ' has-cover' : '') + '"' + coverStyle + '>' +
      '<svg class="arches" viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
      '<path d="M30 600V210a170 170 0 0 1 340 0v390"/><path d="M54 600V210a146 146 0 0 1 292 0v390"/><path d="M78 600V210a122 122 0 0 1 244 0v390"/></svg>' +
      '<div class="thread" aria-hidden="true"></div>' +
      '<div class="hero-inner">' +
        '<p class="brand fade" style="--d:1.1s">' + esc(data.brand) + '</p>' +
        '<h1 class="event" style="--base:1.35s" aria-label="' + esc(data.eventName) + '">' + dropText(data.eventName) + '</h1>' +
        '<p class="subtitle fade" style="--d:2.3s">' + esc(data.subtitle) + '</p>' +
        '<p class="invite-label fade" style="--d:2.8s">' + esc(data.inviteLabel) + '</p>' +
        '<div class="guest">' +
          (data.guestPrefix ? '<span class="guest-prefix fade" style="--d:3.1s">' + esc(data.guestPrefix) + '</span>' : '') +
          '<span class="guest-name" style="--base:3.3s" aria-label="' + esc(guest) + '">' + dropText(guest) + '</span>' +
          '<span class="guest-rule" aria-hidden="true"></span>' +
        '</div>' +
      '</div>' +
      '<a class="scroll-cue fade" style="--d:4.6s" href="#loi-moi" aria-label="Cuộn xuống"><i></i></a>' +
    '</header>';

    /* ---------- LỜI MỜI ---------- */
    html += '<section class="sec sec--pearl" id="loi-moi"><div class="wrap wrap--s center">' +
      (data.introImage ? '<figure class="arch-photo reveal"><img src="' + esc(data.introImage) + '" alt="" loading="lazy"></figure>' : '') +
      '<p class="lead reveal">' + nl2br(data.intro) + '</p>' +
    '</div></section>';

    /* ---------- THỜI GIAN ---------- */
    var timeline = (data.schedule || []).map(function (s) {
      return '<li><span class="t-time">' + esc(s.time) + '</span><span class="t-text">' + esc(s.text) + '</span></li>';
    }).join('');
    html += '<section class="sec sec--cocoa" id="thoi-gian"><div class="wrap">' +
      '<div class="center reveal"><h2 class="h2">Ngày ' + pad(dt.d) + ' tháng ' + pad(dt.m) + '</h2>' +
      '<p class="sub">' + weekday + ', năm ' + dt.y + '</p>' +
      (cd ? '<p class="count">' + cd + '</p>' : '') + '</div>' +
      '<div class="when-grid reveal">' + calendar(dt) +
        '<ol class="timeline">' + timeline + '</ol></div>' +
      '<div class="center reveal"><button type="button" class="btn btn--on-dark" id="add-cal">Thêm vào lịch</button></div>' +
    '</div></section>';

    /* ---------- ĐỊA ĐIỂM ---------- */
    html += '<section class="sec sec--pearl" id="dia-diem"><div class="wrap wrap--s center">' +
      '<div class="reveal"><h2 class="h2 h2--dark">' + esc(data.venue) + '</h2>' +
      '<address class="address">' + nl2br(data.address) + '</address>' +
      '<a class="btn" href="' + mapsUrl + '" target="_blank" rel="noopener">Chỉ đường</a></div>' +
      (data.showMap ? '<div class="map reveal"><iframe title="Bản đồ ' + esc(data.venue) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + embedUrl + '"></iframe></div>' : '') +
    '</div></section>';

    /* ---------- DRESS CODE ---------- */
    var names = (data.dressColors || []).map(function (c) { return esc(c.name); }).join(' · ');
    var sw = (data.dressColors || []).map(function (c) {
      return '<li><i style="--c:' + esc(c.hex) + '"></i><span>' + esc(c.name) + '</span></li>';
    }).join('');
    html += '<section class="sec sec--linen" id="dress-code"><div class="wrap wrap--s center reveal">' +
      '<h2 class="h2 h2--dark">' + esc(data.dressTitle) + '</h2>' +
      '<p class="sub sub--dark">' + names + '</p>' +
      '<ul class="swatches">' + sw + '</ul>' +
      (data.dressNote ? '<p class="small">' + nl2br(data.dressNote) + '</p>' : '') +
    '</div></section>';

    /* ---------- THƯ VIỆN ẢNH ---------- */
    if (data.gallery && data.gallery.length) {
      html += '<section class="sec sec--pearl" id="hinh-anh"><div class="wrap"><div class="gallery reveal">' +
        data.gallery.map(function (src) {
          return '<button type="button" class="g-item" data-src="' + esc(src) + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>';
        }).join('') + '</div></div></section>';
    }

    /* ---------- LƯU Ý + CẢM ƠN ---------- */
    html += '<section class="sec sec--sand" id="cam-on"><div class="wrap wrap--s center reveal">' +
      '<p class="note">' + nl2br(data.note) + '</p>' +
      '<p class="lead lead--sm">' + nl2br(data.thanks) + '</p>' +
      '<p class="closing">' + esc(data.closing) + '</p>' +
      (data.rsvpLink ? '<a class="btn btn--solid" href="' + esc(data.rsvpLink) + '" target="_blank" rel="noopener">' + esc(data.rsvpLabel || 'Xác nhận tham dự') + '</a>' : '') +
    '</div></section>';

    html += '<footer class="foot"><p>' + esc(data.brand) + ' · ' + esc(data.eventName) + '</p></footer>';

    app.innerHTML = html;
    bind(opts.instant);
  }

  function bind(instant) {
    /* hiệu ứng xuất hiện khi cuộn */
    var els = app.querySelectorAll('.reveal');
    if (instant || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.15 });
      els.forEach(function (el) { io.observe(el); });
    }

    /* Hiệu ứng Parallax (Độ sâu) cho phần Hero */
    if (!instant && window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var heroInner = app.querySelector('.hero-inner');
      var arches = app.querySelector('.arches');
      window.addEventListener('scroll', function () {
        var sy = window.scrollY;
        if (sy < window.innerHeight) {
          if (heroInner) heroInner.style.transform = 'translateY(' + (sy * 0.25) + 'px)';
          if (arches) arches.style.transform = 'translateX(-50%) translateY(' + (sy * 0.45) + 'px)';
        }
      }, { passive: true });
    }

    /* thêm vào lịch (.ics) */
    var btn = document.getElementById('add-cal');
    if (btn) btn.addEventListener('click', downloadIcs);

    /* xem ảnh lớn */
    var lb = document.getElementById('lightbox');
    app.querySelectorAll('.g-item').forEach(function (b) {
      b.addEventListener('click', function () {
        lb.querySelector('img').src = b.dataset.src;
        if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
      });
    });
  }

  function downloadIcs() {
    var d = current, dt = parseDate(d.date);
    var day = dt.y + pad(dt.m) + pad(dt.d);
    var t = function (s) { return String(s || '00:00').replace(':', '') + '00'; };
    var esc2 = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); };
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//H2T Media Group//Year End Party//VI', 'BEGIN:VEVENT',
      'UID:' + day + '-h2t-year-end-party@h2t',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:' + day + 'T' + t(d.timeStart),
      'DTEND:' + day + 'T' + t(d.timeEnd),
      'SUMMARY:' + esc2(d.subtitle + ' ' + d.brand),
      'LOCATION:' + esc2(d.venue + ', ' + d.address.replace(/\n/g, ' ')),
      'DESCRIPTION:' + esc2(d.eventName + '. Dress code: ' + (d.dressColors || []).map(function (c) { return c.name; }).join(', ')),
      'END:VEVENT', 'END:VCALENDAR'
    ];
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'tiec-tat-nien-h2t.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* đóng lightbox khi bấm ra ngoài / nút × */
  var lightbox = document.getElementById('lightbox');
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.tagName === 'BUTTON') { lightbox.close ? lightbox.close() : lightbox.removeAttribute('open'); }
  });

  /* xem trước trực tiếp từ trang admin */
  if (isPreview) {
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent || !e.data || e.data.type !== 'h2t-preview') return;
      render(Object.assign(window.InviteStore.defaults(), e.data.data), { instant: true });
    });
  }

  render(window.InviteStore.load(), {});
})();
