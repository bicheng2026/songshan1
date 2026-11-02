/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

/* 嵩山一号 · 工作站 —— 账号与个人空间（纯前端、零成本、数据存本机）
   注册 / 登录 / 退出；个人空间的数据（代码库 + 笔记库）按账号隔离，
   只存在访问者自己的浏览器 localStorage，绝不上传任何服务器。
   密码用 SHA-256(salt + 密码) 存哈希，明文不落地；salt 随机。 */
(function () {
  "use strict";
  const SX = window.SX;
  const ACC_KEY = "songshan1.accounts";
  const CUR_KEY = "songshan1.currentUser";
  const userKey = u => "songshan1.user." + u;

  function b64(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
  }
  async function sha256(str) {
    if (!(window.crypto && window.crypto.subtle)) {
      throw new Error("当前环境不支持加密（需在 https 或 localhost 下使用）");
    }
    const d = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return b64(d);
  }
  function loadAcc() {
    try { return JSON.parse(localStorage.getItem(ACC_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveAcc(o) { localStorage.setItem(ACC_KEY, JSON.stringify(o)); }
  function loadUser(u) {
    try {
      const d = JSON.parse(localStorage.getItem(userKey(u)));
      if (d && Array.isArray(d.codeLib) && Array.isArray(d.notes)) return d;
    } catch (e) { }
    return { codeLib: [], notes: [] };
  }
  function saveUser(u, d) { localStorage.setItem(userKey(u), JSON.stringify(d)); }

  const accounts = {
    async register(uname, pwd, display) {
      uname = (uname || "").trim();
      if (uname.length < 3) return { ok: false, msg: "用户名至少 3 个字符" };
      if ((pwd || "").length < 4) return { ok: false, msg: "密码至少 4 位" };
      const a = loadAcc();
      if (a[uname]) return { ok: false, msg: "用户名已被占用" };
      const salt = Math.random().toString(36).slice(2);
      const hash = await sha256(salt + pwd);
      a[uname] = { salt: salt, hash: hash, display: (display || uname).trim(), createdAt: new Date().toISOString() };
      saveAcc(a);
      localStorage.setItem(CUR_KEY, uname);
      return { ok: true };
    },
    async login(uname, pwd) {
      uname = (uname || "").trim();
      const a = loadAcc();
      const r = a[uname];
      if (!r) return { ok: false, msg: "用户不存在，请先注册" };
      const hash = await sha256(r.salt + pwd);
      if (hash !== r.hash) return { ok: false, msg: "密码错误" };
      localStorage.setItem(CUR_KEY, uname);
      return { ok: true };
    },
    logout() { localStorage.removeItem(CUR_KEY); },
    current() { return localStorage.getItem(CUR_KEY) || null; },
    display() {
      const c = this.current();
      if (!c) return null;
      const a = loadAcc();
      return (a[c] && a[c].display) || c;
    },
    list() { return Object.keys(loadAcc()); },
    /* —— 个人空间数据（按当前登录账号） —— */
    getUserData() {
      const c = this.current();
      if (!c) return null;
      return loadUser(c);
    },
    setUserData(d) {
      const c = this.current();
      if (!c) return;
      saveUser(c, d);
    },
    addCode(item) { const d = this.getUserData() || { codeLib: [], notes: [] }; d.codeLib.unshift(item); this.setUserData(d); },
    updateCode(id, item) {
      const d = this.getUserData(); if (!d) return;
      const i = d.codeLib.findIndex(x => x.id === id);
      if (i >= 0) { d.codeLib[i] = item; this.setUserData(d); }
    },
    delCode(id) {
      const d = this.getUserData(); if (!d) return;
      d.codeLib = d.codeLib.filter(x => x.id !== id); this.setUserData(d);
    },
    addNote(item) { const d = this.getUserData() || { codeLib: [], notes: [] }; d.notes.unshift(item); this.setUserData(d); },
    updateNote(id, item) {
      const d = this.getUserData(); if (!d) return;
      const i = d.notes.findIndex(x => x.id === id);
      if (i >= 0) { d.notes[i] = item; this.setUserData(d); }
    },
    delNote(id) {
      const d = this.getUserData(); if (!d) return;
      d.notes = d.notes.filter(x => x.id !== id); this.setUserData(d);
    }
  };

  SX.accounts = accounts;
})();
