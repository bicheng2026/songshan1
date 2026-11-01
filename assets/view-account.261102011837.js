/* 嵩山一号 · 工作站 —— 账号（登录 / 注册 / 退出）
   密码只在本机做哈希后存 localStorage，不上传。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  function field(id, label, ph, type, val) {
    return '<label class="fld"><span>' + label + "</span>" +
      '<input id="' + id + '" type="' + (type || "text") + '" placeholder="' + ph + '"' +
      (val ? ' value="' + E(val) + '"' : "") + "></label>";
  }

  function strengthHtml() {
    return '<div class="pw-bar" id="pwBar"><i></i><i></i><i></i><i></i></div>' +
      '<div class="tiny muted" id="pwTip" style="margin-top:6px">密码至少 4 位</div>';
  }

  function render(root) {
    const cur = SX.accounts.current();

    /* 已登录 */
    if (cur) {
      const name = SX.accounts.display() || cur;
      root.innerHTML =
        '<div class="page-head"><h2>账号</h2><p>已登录。数据只在这台浏览器里。</p></div>' +
        '<div class="card acct-card">' +
        '<div class="acct-top"><div class="acct-ava">' + E(String(name).slice(0, 1).toUpperCase()) + "</div>" +
        '<div><div class="acct-name">' + E(name) + '</div><div class="tiny muted">ID：' + E(cur) + "</div></div></div>" +
        '<div class="acct-note">代码库、笔记、论文草稿都存在本机，不上传服务器。换浏览器或清缓存会丢，重要内容用「个人空间 → 导出」备份。</div>' +
        '<div class="toolbar" style="margin-top:16px">' +
        '<a class="btn primary" href="#/space">进入个人空间</a>' +
        '<button class="btn" id="btnLogout">退出登录</button></div></div>';
      const bo = document.getElementById("btnLogout");
      if (bo) bo.onclick = () => {
        SX.accounts.logout();
        SX.toast("已退出");
        location.hash = "#/account";
      };
      return;
    }

    /* 未登录 */
    root.innerHTML =
      '<div class="page-head"><h2>账号</h2><p>注册一个，保存自己的代码库与笔记库。</p></div>' +
      '<div class="acct-grid">' +
      '<div class="card">' +
      '<div class="acct-h"><b>登录</b><span class="tiny muted">已有账号</span></div>' +
      field("lgU", "用户名", "输入用户名") +
      field("lgP", "密码", "输入密码", "password") +
      '<div class="tiny" id="lgMsg" style="color:var(--accent);min-height:18px;margin-top:8px"></div>' +
      '<button class="btn primary acct-btn" id="btnLogin">登录</button></div>' +

      '<div class="card">' +
      '<div class="acct-h"><b>注册</b><span class="tiny muted">两步就好</span></div>' +
      field("rgU", "用户名", "至少 3 个字符") +
      field("rgD", "昵称", "可留空") +
      field("rgP", "密码", "至少 4 位", "password") +
      strengthHtml() +
      field("rgP2", "确认密码", "再输一次", "password") +
      '<div class="tiny" id="rgMsg" style="color:var(--accent);min-height:18px;margin-top:8px"></div>' +
      '<button class="btn primary acct-btn" id="btnReg">注册并登录</button></div>' +
      "</div>" +
      '<div class="note" style="margin-top:18px">密码只在本机做哈希后存着，不上传。忘记密码没法找回，换一台电脑要重新注册。</div>';

    const rgP = document.getElementById("rgP");
    rgP.oninput = () => {
      const p = rgP.value;
      let lv = 0;
      if (p.length >= 4) lv = 1;
      if (p.length >= 8) lv = 2;
      if (p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p)) lv = 3;
      if (p.length >= 10 && /[^A-Za-z0-9]/.test(p)) lv = 4;
      const bar = document.getElementById("pwBar");
      bar.querySelectorAll("i").forEach((el, i) => el.classList.toggle("on", i < lv));
      bar.setAttribute("data-lv", lv);
      document.getElementById("pwTip").textContent =
        ["密码至少 4 位", "太短", "能用", "还不错", "很稳"][lv];
    };

    document.getElementById("btnLogin").onclick = async () => {
      const m = document.getElementById("lgMsg");
      m.textContent = "";
      const r = await SX.accounts.login(
        document.getElementById("lgU").value,
        document.getElementById("lgP").value);
      if (r.ok) { SX.toast("登录成功"); location.hash = "#/space"; }
      else m.textContent = r.msg;
    };

    document.getElementById("btnReg").onclick = async () => {
      const m = document.getElementById("rgMsg");
      m.textContent = "";
      const p1 = document.getElementById("rgP").value;
      const p2 = document.getElementById("rgP2").value;
      if (p1 !== p2) { m.textContent = "两次密码不一致"; return; }
      const r = await SX.accounts.register(
        document.getElementById("rgU").value, p1,
        document.getElementById("rgD").value);
      if (r.ok) { SX.toast("注册成功"); location.hash = "#/space"; }
      else m.textContent = r.msg;
    };
  }

  window.SXViewAccount = { render };
})();
