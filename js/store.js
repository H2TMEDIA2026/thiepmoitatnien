/* Đọc / ghi dữ liệu thư mời. Ưu tiên bản chỉnh sửa trong trình duyệt, nếu không có thì dùng data.js */
(function () {
  var KEY = 'h2t_invite_v1';
  window.InviteStore = {
    KEY: KEY,
    defaults: function () { return JSON.parse(JSON.stringify(window.INVITE_DEFAULT)); },
    load: function () {
      var base = this.defaults();
      try {
        var raw = localStorage.getItem(KEY);
        if (raw) return Object.assign(base, JSON.parse(raw));
      } catch (e) {}
      return base;
    },
    save: function (data) { localStorage.setItem(KEY, JSON.stringify(data)); },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
})();
