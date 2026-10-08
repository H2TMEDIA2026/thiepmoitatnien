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
    
    // THEMES
    renderThemes();
    
    // VIDEO
    bindVideo();
  }

  /* ---------- THEMES & COLORS ---------- */
  var PRESETS = [
    { name: 'Nude (Mặc định)', c: { pearl: '#FBF8F3', linen: '#F1E9DF', sand: '#E6D8C6', taupe: '#7A685A', cocoa: '#33271F', gold: '#B38F5E', goldInk: '#7F5F35', goldSoft: '#DCC49A' } },
    { name: 'Trắng', c: { pearl: '#FFFFFF', linen: '#F7F7F7', sand: '#EAEAEA', taupe: '#7A7A7A', cocoa: '#222222', gold: '#D4AF37', goldInk: '#9E7E20', goldSoft: '#E5C875' } },
    { name: 'Champagne ấm', c: { pearl: '#FDFBF7', linen: '#F4EFE6', sand: '#E8DEC8', taupe: '#8B7F68', cocoa: '#4A402D', gold: '#C5A880', goldInk: '#917551', goldSoft: '#E2CAA6' } },
    { name: 'Hồng nude', c: { pearl: '#FBF6F6', linen: '#F3E8E9', sand: '#E2C8C9', taupe: '#85696B', cocoa: '#422A2D', gold: '#C89B9E', goldInk: '#9A666A', goldSoft: '#E5C1C3' } },
    { name: 'Xanh sage nhạt', c: { pearl: '#F6F8F6', linen: '#E8EFE8', sand: '#CFDDCF', taupe: '#6B7A6B', cocoa: '#2C3A2C', gold: '#8BA48B', goldInk: '#597259', goldSoft: '#B6CBB6' } },
    { name: 'Mocha đậm', c: { pearl: '#3A2F2B', linen: '#4A3C37', sand: '#291F1C', taupe: '#A69790', cocoa: '#FFF3EC', gold: '#C29B85', goldInk: '#E2BEA9', goldSoft: '#9C6F55' } }
  ];
  var ROLES = [
    { k: 'pearl', label: 'Nền chính' }, { k: 'linen', label: 'Nền phụ' }, { k: 'sand', label: 'Nền khối đậm' }, { k: 'cocoa', label: 'Nền tối' },
    { k: 'taupe', label: 'Chữ phụ' }, { k: 'gold', label: 'Màu nhấn' }, { k: 'goldInk', label: 'Màu nhấn đậm' }, { k: 'goldSoft', label: 'Màu nhấn (trên nền tối)' }
  ];
  var SECTIONS = [
    { k: 'loi-moi', label: 'Lời mời' }, { k: 'thoi-gian', label: 'Thời gian' }, { k: 'dia-diem', label: 'Địa điểm' }, { k: 'dress-code', label: 'Dress code' }, { k: 'hinh-anh', label: 'Hình ảnh' }, { k: 'cam-on', label: 'Cảm ơn' }
  ];
  
  function renderThemes() {
    var def = InviteStore.defaults().theme;
    if(!data.theme) data.theme = {};
    data.theme.colors = Object.assign({}, def.colors, data.theme.colors || {});
    data.theme.heroBg = Object.assign({}, def.heroBg, data.theme.heroBg || {});
    if(!data.theme.heroBg.colors) data.theme.heroBg.colors = [].concat(def.heroBg.colors);
    data.theme.sections = Object.assign({}, def.sections, data.theme.sections || {});
    
    // Presets
    var tBox = $('#theme-presets'); tBox.innerHTML = '';
    PRESETS.forEach(function(p) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'swatch'; btn.style.backgroundColor = p.c.pearl; btn.title = p.name;
      btn.onclick = function() { data.theme.colors = Object.assign({}, p.c); renderThemes(); commit(); };
      tBox.appendChild(btn);
    });
    
    // Colors
    var cBox = $('#theme-colors'); cBox.innerHTML = '';
    ROLES.forEach(function(r) {
      var row = document.createElement('div'); row.className = 'item item--color';
      row.innerHTML = '<input type="color" aria-label="'+r.label+'"><input aria-label="Hex"><span class="hint">'+r.label+'</span>';
      var ins = row.querySelectorAll('input');
      ins[0].value = data.theme.colors[r.k]; ins[1].value = data.theme.colors[r.k];
      ins[0].oninput = function() { data.theme.colors[r.k] = ins[0].value; ins[1].value = ins[0].value; checkContrast(); commit(); };
      ins[1].onchange = function() { data.theme.colors[r.k] = ins[1].value; ins[0].value = ins[1].value; checkContrast(); commit(); };
      cBox.appendChild(row);
    });
    checkContrast();
    
    // Hero Bg
    $('#hero-bg-type').value = data.theme.heroBg.type;
    $('#hero-bg-dir').hidden = data.theme.heroBg.type === 'color';
    $('#hero-bg-dir').value = data.theme.heroBg.dir || 'to bottom';
    $('#hero-bg-type').onchange = function() { data.theme.heroBg.type = this.value; renderThemes(); commit(); };
    $('#hero-bg-dir').onchange = function() { data.theme.heroBg.dir = this.value; renderThemes(); commit(); };
    
    var hBox = $('#hero-bg-colors'); hBox.innerHTML = '';
    var numColors = data.theme.heroBg.type === 'color' ? 1 : (data.theme.heroBg.type === 'gradient2' ? 2 : 3);
    for(let i=0; i<numColors; i++) {
      let inp = document.createElement('input'); inp.type = 'color';
      inp.value = data.theme.heroBg.colors[i] || '#FBF8F3';
      inp.oninput = function() { data.theme.heroBg.colors[i] = this.value; commit(); };
      hBox.appendChild(inp);
    }
    
    // Section Bgs
    var sBox = $('#section-bgs'); sBox.innerHTML = '';
    SECTIONS.forEach(function(s) {
      var row = document.createElement('div'); row.className = 'item';
      row.innerHTML = '<span class="hint">'+s.label+'</span><select><option value="pearl">Nền chính</option><option value="linen">Nền phụ</option><option value="sand">Nền khối đậm</option><option value="cocoa">Nền tối</option></select><div></div>';
      var sel = row.querySelector('select');
      sel.value = data.theme.sections[s.k] || 'pearl';
      sel.onchange = function() { data.theme.sections[s.k] = this.value; commit(); };
      sBox.appendChild(row);
    });
  }
  
  function getLum(hex) {
    var rgb = parseInt(hex.substring(1), 16);
    var a = [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255].map(function(v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  function getContrast(h1, h2) {
    var l1 = getLum(h1), l2 = getLum(h2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function checkContrast() {
    var c = data.theme.colors;
    var w = $('#contrast-warning');
    if (getContrast(c.cocoa, c.pearl) < 4.5 || getContrast(c.cocoa, c.linen) < 4.5) {
      w.innerHTML = '⚠️ Chữ chính trên nền sáng đang bị nhạt (< 4.5). <button class="btn btn--small btn--ghost" type="button" id="btn-fix-c1">Tự chỉnh giúp tôi</button>';
      w.hidden = false;
      $('#btn-fix-c1').onclick = function() { data.theme.colors.cocoa = getLum(c.pearl) > 0.5 ? '#111111' : '#EEEEEE'; renderThemes(); commit(); };
    } else if (getContrast(c.pearl, c.cocoa) < 4.5) {
      w.innerHTML = '⚠️ Chữ trên nền tối đang khó đọc. <button class="btn btn--small btn--ghost" type="button" id="btn-fix-c2">Tự chỉnh giúp tôi</button>';
      w.hidden = false;
      $('#btn-fix-c2').onclick = function() { data.theme.colors.cocoa = getLum(c.pearl) > 0.5 ? '#222222' : '#F8F8F8'; renderThemes(); commit(); };
    } else {
      w.hidden = true;
    }
  }

  $('#btn-reset-theme').onclick = function() {
    data.theme = InviteStore.defaults().theme; renderThemes(); commit();
  };
  $('#btn-save-theme').onclick = function() {
    data.theme.savedThemes = data.theme.savedThemes || [];
    data.theme.savedThemes.push(Object.assign({}, data.theme.colors));
    commit(); setStatus('Đã lưu bộ màu');
  };

  /* ---------- VIDEO ---------- */
  function bindVideo() {
    var def = InviteStore.defaults().video;
    if(!data.video) data.video = {};
    data.video = Object.assign({}, def, data.video);
    var v = data.video;
    
    $('#video-enabled').checked = v.enabled;
    $('#video-settings').hidden = !v.enabled;
    $('#video-enabled').onchange = function() { data.video.enabled = this.checked; $('#video-settings').hidden = !this.checked; commit(); };
    
    $('#video-source-type').value = v.sourceType || 'youtube';
    $('#video-url').value = v.url || '';
    $('#video-title').value = v.title || '';
    $('#video-caption').value = v.caption || '';
    $('#video-autoplay').checked = !!v.autoplay;
    $('#video-loop').checked = !!v.loop;
    $('#video-controls').checked = !!v.controls;
    $('#video-frame').value = v.frameStyle || 'arch';
    $('#video-ratio').value = v.aspectRatio || '16:9';
    imgField('#img-poster', 'videoPoster', 'Ảnh bìa video', '');
    data.videoPoster = v.poster; // binding for imgField
    
    var bindEvts = ['url', 'title', 'caption', 'frameStyle', 'aspectRatio', 'position'];
    bindEvts.forEach(function(k) {
      var el = $('#video-' + k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()));
      if (el) {
        el.value = v[k] || '';
        el.onchange = function() { 
          data.video[k] = this.value; commit(); 
          if(k === 'position') {
            setTimeout(function() {
              if(iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'h2t-scroll', pos: data.video.position }, '*');
            }, 100);
          }
        };
      }
    });

    $('#video-source-type').onchange = function() {
      var t = this.value;
      data.video.sourceType = t;
      $('#video-input-url').hidden = (t === 'upload');
      $('#video-input-upload').hidden = (t !== 'upload');
      commit();
    };
    $('#video-source-type').value = v.sourceType || 'youtube';
    $('#video-source-type').onchange();
    
    $('#video-file').onchange = function(e) {
      var f = e.target.files[0]; if(!f) return;
      if (f.size > 4 * 1024 * 1024) { setStatus('Video quá lớn, dung lượng tối đa 4MB.', true); e.target.value = ''; return; }
      var fr = new FileReader();
      fr.onload = function() { 
        data.video.url = fr.result; 
        $('#video-url').value = data.video.url; 
        commit(); 
        setStatus('Đã tải clip lên trình duyệt!'); 
      };
      fr.readAsDataURL(f);
    };

    ['autoplay', 'loop', 'controls'].forEach(function(k) {
      $('#video-' + k).onchange = function() { data.video[k] = this.checked; commit(); };
    });
  }
  function init() {
    data = InviteStore.load();
    fillAll();
    iframe.addEventListener('load', pushPreview);
  }
})();
