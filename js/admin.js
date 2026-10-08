/* Trang quản lý: chỉnh nội dung, ảnh, xem trước trực tiếp, tạo link theo khách */
(function () {
  /* Mật khẩu chỉ là khóa nhẹ phía trình duyệt. Hãy đổi trước khi dùng. */
  var PASSWORD = 'h2t2026';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var gate = $('#gate'), admin = $('#admin');

  /* ---------- đăng nhập ---------- */
  function unlock() { gate.hidden = true; admin.hidden = false; init(); }
  if (sessionStorage.getItem('h2t_admin') === '1') { unlock(); }
  else {
    gate.hidden = false;
    var tryLogin = function () {
      if ($('#gate-pass').value === PASSWORD) { sessionStorage.setItem('h2t_admin', '1'); unlock(); }
      else { $('#gate-err').hidden = false; $('#gate-pass').select(); }
    };
    $('#gate-btn').addEventListener('click', tryLogin);
    $('#gate-pass').addEventListener('keydown', function (e) { if (e.key === 'Enter') tryLogin(); });
  }

  var data, timer;
  var iframe = $('#preview');

  function setStatus(msg, bad) { var s = $('#status'); s.textContent = msg; s.classList.toggle('bad', !!bad); }

  function commit() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      try { InviteStore.save(data); setStatus('Đã lưu tự động trong trình duyệt này'); }
      catch (e) { setStatus('Không lưu được: bộ nhớ trình duyệt đã đầy. Hãy bớt ảnh tải lên hoặc dùng đường dẫn ảnh.', true); }
      pushPreview();
    }, 250);
  }
  function pushPreview() {
    if (iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'h2t-preview', data: data }, '*');
  }

  /* ---------- trường đơn giản ---------- */
  function bindSimple() {
    document.querySelectorAll('[data-k]').forEach(function (el) {
      var k = el.dataset.k;
      if (el.type === 'checkbox') el.checked = !!data[k]; else el.value = data[k] == null ? '' : data[k];
      el.oninput = el.onchange = function () {
        data[k] = el.type === 'checkbox' ? el.checked : el.value;
        commit();
      };
    });
  }

  /* ---------- lịch trình ---------- */
  function renderSchedule() {
    var box = $('#schedule'); box.innerHTML = '';
    data.schedule.forEach(function (s, i) {
      var row = document.createElement('div'); row.className = 'item';
      row.innerHTML = '<input aria-label="Giờ" placeholder="18:00"><input aria-label="Nội dung" placeholder="Nội dung"><button type="button" class="x" aria-label="Xóa mốc giờ">×</button>';
      var ins = row.querySelectorAll('input');
      ins[0].value = s.time; ins[1].value = s.text;
      ins[0].oninput = function () { s.time = ins[0].value; commit(); };
      ins[1].oninput = function () { s.text = ins[1].value; commit(); };
      row.querySelector('.x').onclick = function () { data.schedule.splice(i, 1); renderSchedule(); commit(); };
      box.appendChild(row);
    });
  }
  $('#add-schedule').onclick = function () { data.schedule.push({ time: '', text: '' }); renderSchedule(); commit(); };

  /* ---------- màu dress code ---------- */
  function renderColors() {
    var box = $('#colors'); box.innerHTML = '';
    data.dressColors.forEach(function (c, i) {
      var row = document.createElement('div'); row.className = 'item item--color';
      row.innerHTML = '<input type="color" aria-label="Màu"><input aria-label="Tên màu" placeholder="Tên màu"><button type="button" class="x" aria-label="Xóa màu">×</button>';
      var ins = row.querySelectorAll('input');
      ins[0].value = c.hex; ins[1].value = c.name;
      ins[0].oninput = function () { c.hex = ins[0].value; commit(); };
      ins[1].oninput = function () { c.name = ins[1].value; commit(); };
      row.querySelector('.x').onclick = function () { data.dressColors.splice(i, 1); renderColors(); commit(); };
      box.appendChild(row);
    });
  }
  $('#add-color').onclick = function () { data.dressColors.push({ name: '', hex: '#E3D3BE' }); renderColors(); commit(); };

  /* ---------- ảnh ---------- */
  function readImage(file, max, q) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onerror = reject;
      fr.onload = function () {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var r = Math.min(1, max / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', q));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  function imgField(sel, key, title, hint) {
    var box = $(sel);
    function paint() {
      var v = data[key];
      box.innerHTML = '<div class="ph"></div><div><strong>' + title + '</strong><span class="hint">' + hint + '</span>' +
        '<div class="acts"><label class="btn btn--small">Chọn ảnh<input type="file" accept="image/*" hidden></label>' +
        '<button type="button" class="btn btn--small btn--ghost" data-rm>Xóa ảnh</button></div></div>';
      if (v) box.querySelector('.ph').style.backgroundImage = 'url("' + v.replace(/"/g, '%22') + '")';
      box.querySelector('[data-rm]').hidden = !v;
      box.querySelector('input').onchange = function (e) {
        var f = e.target.files[0]; if (!f) return;
        readImage(f, 1800, 0.82).then(function (url) { data[key] = url; paint(); commit(); })
          .catch(function () { setStatus('Không đọc được ảnh này. Thử ảnh JPG hoặc PNG khác.', true); });
      };
      box.querySelector('[data-rm]').onclick = function () { data[key] = ''; paint(); commit(); };
    }
    paint();
  }

  function renderGallery() {
    var box = $('#gallery'); box.innerHTML = '';
    data.gallery.forEach(function (src, i) {
      var t = document.createElement('div'); t.className = 'thumb';
      t.style.backgroundImage = 'url("' + src.replace(/"/g, '%22') + '")';
      t.innerHTML = '<button type="button" class="x" aria-label="Xóa ảnh">×</button>';
      t.querySelector('.x').onclick = function () { data.gallery.splice(i, 1); renderGallery(); commit(); };
      box.appendChild(t);
    });
  }
  $('#gallery-file').onchange = function (e) {
    var files = Array.from(e.target.files);
    Promise.all(files.map(function (f) { return readImage(f, 1400, 0.8); })).then(function (urls) {
      data.gallery = data.gallery.concat(urls); renderGallery(); commit(); e.target.value = '';
    }).catch(function () { setStatus('Có ảnh không đọc được. Thử lại với ảnh JPG hoặc PNG.', true); });
  };
  $('#gallery-url-btn').onclick = function () {
    var v = $('#gallery-url').value.trim(); if (!v) return;
    data.gallery.push(v); $('#gallery-url').value = ''; renderGallery(); commit();
  };

  /* ---------- link theo khách ---------- */
  var lastLinks = [];
  $('#make-links').onclick = function () {
    var names = $('#guests').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    var base = new URL('index.html', location.href).href;
    var ul = $('#links'); ul.innerHTML = ''; lastLinks = [];
    if (!names.length) { ul.innerHTML = '<li><span>Nhập ít nhất một tên khách rồi bấm Tạo link.</span></li>'; return; }
    names.forEach(function (n) {
      var url = base + '?to=' + encodeURIComponent(n);
      lastLinks.push(n + '\t' + url);
      var li = document.createElement('li');
      li.innerHTML = '<b></b><span></span><button type="button" class="btn btn--small">Sao chép link</button>';
      li.querySelector('b').textContent = n;
      li.querySelector('span').textContent = url;
      li.querySelector('button').onclick = function (ev) { copy(url, ev.target); };
      ul.appendChild(li);
    });
  };
  $('#copy-all').onclick = function (ev) { if (lastLinks.length) copy(lastLinks.join('\n'), ev.target); };
  function copy(text, btn) {
    var old = btn.textContent;
    var done = function () { btn.textContent = 'Đã sao chép'; setTimeout(function () { btn.textContent = old; }, 1400); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {} ta.remove();
    }
  }

  /* ---------- xuất / nhập / khôi phục ---------- */
  $('#btn-export').onclick = function () {
    var text = '/* Dữ liệu thư mời — thay file js/data.js bằng file này để mọi khách thấy bản mới */\nwindow.INVITE_DEFAULT = ' + JSON.stringify(data, null, 2) + ';\n';
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/javascript;charset=utf-8' }));
    a.download = 'data.js'; document.body.appendChild(a); a.click(); a.remove();
    setStatus('Đã tải data.js. Chép file vào thư mục js/ để áp dụng cho mọi khách.');
  };
  $('#file-import').onchange = function (e) {
    var f = e.target.files[0]; if (!f) return;
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var t = String(fr.result);
        var obj = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
        data = Object.assign(InviteStore.defaults(), obj); fillAll(); commit(); setStatus('Đã nhập dữ liệu từ file');
      } catch (err) { setStatus('File không đúng định dạng. Hãy chọn file data.js hoặc .json đã xuất từ trang này.', true); }
      e.target.value = '';
    };
    fr.readAsText(f);
  };
  $('#btn-reset').onclick = function () {
    if (!confirm('Khôi phục toàn bộ nội dung về mặc định trong data.js? Các chỉnh sửa trong trình duyệt sẽ bị xóa.')) return;
    InviteStore.clear(); data = InviteStore.load(); fillAll(); pushPreview(); setStatus('Đã khôi phục nội dung mặc định');
  };
  $('#replay').onclick = function () { iframe.contentWindow.location.reload(); };

  function fillAll() {
    bindSimple(); renderSchedule(); renderColors(); renderGallery();
    imgField('#img-cover', 'coverImage', 'Ảnh nền đầu trang', 'Hiện mờ phía sau tên khách. Nên dùng ảnh ngang, tông sáng.');
    imgField('#img-intro', 'introImage', 'Ảnh khung vòm', 'Hiện phía trên lời mời. Nên dùng ảnh dọc.');
  }

  function init() {
    data = InviteStore.load();
    fillAll();
    iframe.addEventListener('load', pushPreview);
  }
})();
