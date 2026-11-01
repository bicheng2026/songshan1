/* 嵩山一号 · 工作站 —— 登录 / 注册 / 退出 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  function render(root) {
    const cur = SX.accounts.current();
    if (cur) {
      root.innerHTML =
        '<div class="page-head"><h2>账号</h2><p>已登录。</p></div>' +
        '<div class="card">' +
        '<div class="lv-title"><h3>' + E(SX.accounts.display()) + '</h3><span class="tag n">' + E(cur) + '</span></div>' +
        '<div class="small muted" style="margin-top:8px">代码库与笔记库只存在你这台浏览器的本机，不上传服务器。换浏览器或清缓存会丢，记得用「个人空间 → 导出」备份。</div>' +
        '<div class="toolbar" style="margin-top:12px">' +
        '<a class="btn primary" href="#/space">进入个人空间</a>' +
        '<button class="btn" id="btnLogout">退出登录</button></div></div>';
      const bo = document.getElementById("btnLogout");
      if (bo) bo.onclick = () => { SX.accounts.logout(); SX.toast("已退出"); location.hash = "#/account"; };
      return;
    }
    root.innerHTML =
      '<div class="page-head"><h2>账号</h2><p>注册一个账号，就能在本机保存自己的代码库与笔记库（不上传服务器，仅存你这台浏览器）。</p></div>' +
      '<div class="layout-2">' +
      '<div class="card"><h3>登录</h3>' +
        '<input class="ed" id="lgU" placeholder="用户名">' +
        '<input class="ed" id="lgP" type="password" placeholder="密码" style="margin-top:8px">' +
        '<div class="toolbar" style="margin-top:10px"><button class="btn primary" id="btnLogin">登录</button></div>' +
        '<div class="small muted" id="lgMsg"></div></div>' +
      '<div class="card"><h3>注册</h3>' +
        '<input class="ed" id="rgU" placeholder="用户名（≥3 字符）">' +
        '<input class="ed" id="rgD" placeholder="昵称（可选）" style="margin-top:8px">' +
        '<input class="ed" id="rgP" type="password" placeholder="密码（≥4 位）" style="margin-top:8px">' +
        '<input class="ed" id="rgP2" type="password" placeholder="确认密码" style="margin-top:8px">' +
        '<div class="toolbar" style="margin-top:10px"><button class="btn primary" id="btnReg">注册并登录</button></div>' +
        '<div class="small muted" id="rgMsg"></div></div>' +
      '</div>';
    document.getElementById("btnLogin").onclick = async () => {
      const r = await SX.accounts.login(
        document.getElementById("lgU").value,
        document.getElementById("lgP").value);
      if (r.ok) { SX.toast("登录成功"); location.hash = "#/space"; }
      else document.getElementById("lgMsg").textContent = r.msg;
    };
    document.getElementById("btnReg").onclick = async () => {
      const p1 = document.getElementById("rgP").value, p2 = document.getElementById("rgP2").value;
      if (p1 !== p2) { document.getElementById("rgMsg").textContent = "两次密码不一致"; return; }
      const r = await SX.accounts.register(
        document.getElementById("rgU").value, p1,
        document.getElementById("rgD").value);
      if (r.ok) { SX.toast("注册成功"); location.hash = "#/space"; }
      else document.getElementById("rgMsg").textContent = r.msg;
    };
  }

  window.SXViewAccount = { render };
})();
