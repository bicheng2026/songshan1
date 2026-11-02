/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

/* 嵩山一号 · 工作站 —— 个人空间：我的代码库 + 我的笔记库（存本机） */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;
  let tab = "code";

  function render(root) {
    const cur = SX.accounts.current();
    if (!cur) {
      root.innerHTML = '<div class="card">请先 <a href="#/account">登录或注册</a> 才能使用个人空间。</div>';
      return;
    }
    const d = SX.accounts.getUserData() || { codeLib: [], notes: [] };
    const rerender = () => render(root);

    root.innerHTML =
      '<div class="page-head"><h2>个人空间</h2><p>账号 ' + E(cur) + ' · 代码库与笔记库只存你本机浏览器。</p></div>' +
      '<div class="toolbar" style="margin-bottom:14px">' +
        '<button class="btn sm ' + (tab === "code" ? "primary" : "") + '" id="tCode">我的代码库 (' + d.codeLib.length + ')</button>' +
        '<button class="btn sm ' + (tab === "notes" ? "primary" : "") + '" id="tNotes">我的笔记库 (' + d.notes.length + ')</button>' +
        '<button class="btn sm ghost" id="btnExportU">导出我的全部数据</button></div>' +
      '<div id="spaceBody"></div>';

    document.getElementById("tCode").onclick = () => { tab = "code"; rerender(); };
    document.getElementById("tNotes").onclick = () => { tab = "notes"; rerender(); };
    document.getElementById("btnExportU").onclick = () => {
      SX.download("songshan-我的空间.json", JSON.stringify({ account: cur, data: d }, null, 2), "application/json");
      SX.toast("已导出（含代码库与笔记库）");
    };

    const body = document.getElementById("spaceBody");
    if (tab === "code") drawCode(body, d, rerender);
    else drawNotes(body, d, rerender);
  }

  function drawCode(body, d, rerender) {
    body.innerHTML =
      '<div class="toolbar" style="margin-bottom:10px"><button class="btn primary sm" id="btnAddC">新增代码</button></div>' +
      '<div class="grid g2" id="cList"></div>';
    const list = document.getElementById("cList");
    list.innerHTML = d.codeLib.length
      ? d.codeLib.map(cardC).join("")
      : '<div class="card muted">还没有代码。点「新增代码」把自己的 R 片段存进来，只有你本机看得到。</div>';
    document.getElementById("btnAddC").onclick = () => editCode(null, d, rerender);
    list.querySelectorAll("[data-editC]").forEach(b => b.onclick = () => {
      const it = d.codeLib.find(x => x.id === b.getAttribute("data-editC")); editCode(it, d, rerender);
    });
    list.querySelectorAll("[data-delC]").forEach(b => b.onclick = () => {
      const id = b.getAttribute("data-delC");
      if (confirm("删除这段代码？")) { SX.accounts.delCode(id); SX.toast("已删除"); rerender(); }
    });
    list.querySelectorAll("[data-copyC]").forEach(b => b.onclick = () => {
      const it = d.codeLib.find(x => x.id === b.getAttribute("data-copyC")); SX.copy(it.code); SX.toast("已复制：" + it.title);
    });
  }

  function cardC(c) {
    return '<div class="card" style="display:flex;flex-direction:column;gap:6px">' +
      '<div style="display:flex;justify-content:space-between;gap:8px"><b>' + E(c.title) + '</b>' +
      (c.lang ? '<span class="tag">' + E(c.lang) + '</span>' : '') + '</div>' +
      '<div class="small muted">' + E((c.tags || []).join(" · ")) + '</div>' +
      '<pre class="code" style="max-height:160px">' + E(c.code) + '</pre>' +
      '<div class="toolbar" style="margin-top:auto">' +
        '<button class="btn sm" data-copyC="' + c.id + '">复制</button>' +
        '<button class="btn sm" data-editC="' + c.id + '">编辑</button>' +
        '<button class="btn sm danger" data-delC="' + c.id + '">删除</button></div></div>';
  }

  function editCode(it, d, rerender) {
    const isNew = !it;
    const o = it || { id: "c" + Date.now(), title: "", code: "", lang: "R", tags: [] };
    const body = document.getElementById("spaceBody");
    body.innerHTML =
      '<div class="card"><h3>' + (isNew ? "新增代码" : "编辑代码") + '</h3>' +
      '<input class="ed" id="eTitle" placeholder="标题" value="' + E(o.title) + '">' +
      '<input class="ed" id="eLang" placeholder="语言，如 R / Python" style="margin-top:8px" value="' + E(o.lang || "R") + '">' +
      '<input class="ed" id="eTags" placeholder="标签，逗号分隔" style="margin-top:8px" value="' + E((o.tags || []).join(", ")) + '">' +
      '<textarea class="ed" id="eCode" style="margin-top:8px;min-height:200px;font-family:monospace" spellcheck="false">' + E(o.code) + '</textarea>' +
      '<div class="toolbar" style="margin-top:10px"><button class="btn primary" id="eSave">保存</button>' +
      '<button class="btn" id="eCancel">取消</button></div></div>';
    document.getElementById("eCancel").onclick = rerender;
    document.getElementById("eSave").onclick = () => {
      o.title = document.getElementById("eTitle").value.trim();
      if (!o.title) { SX.toast("请填标题"); return; }
      o.lang = document.getElementById("eLang").value.trim();
      o.tags = document.getElementById("eTags").value.split(",").map(s => s.trim()).filter(Boolean);
      o.code = document.getElementById("eCode").value;
      o.at = new Date().toISOString();
      if (isNew) SX.accounts.addCode(o); else SX.accounts.updateCode(o.id, o);
      SX.toast("已保存"); rerender();
    };
  }

  function drawNotes(body, d, rerender) {
    body.innerHTML =
      '<div class="toolbar" style="margin-bottom:10px"><button class="btn primary sm" id="btnAddN">新增笔记</button>' +
      (d.notes.length ? '<button class="btn sm ghost" id="btnSeed">载入示例学习笔记（一号~四号）</button>' : '') + '</div>' +
      '<div class="grid g2" id="nList"></div>';
    const list = document.getElementById("nList");
    list.innerHTML = d.notes.length
      ? d.notes.map(cardN).join("")
      : '<div class="card muted">还没有笔记。点「新增笔记」，或「载入示例学习笔记」把 R 课配套学习笔记（一号~四号）灌进来。</div>';
    document.getElementById("btnAddN").onclick = () => editNote(null, d, rerender);
    const bs = document.getElementById("btnSeed");
    if (bs) bs.onclick = () => {
      const seed = window.SX_SEED_NOTES || [];
      seed.forEach(s => { if (!d.notes.find(x => x.seed === s.seed)) d.notes.unshift({
        id: "n" + Date.now() + Math.random().toString(36).slice(2, 6),
        title: s.title, body: s.body, tags: s.tags || [], seed: s.seed, at: new Date().toISOString()
      }); });
      SX.accounts.setUserData(d); SX.toast("已载入示例笔记（" + seed.length + " 条）"); rerender();
    };
    list.querySelectorAll("[data-editN]").forEach(b => b.onclick = () => {
      const it = d.notes.find(x => x.id === b.getAttribute("data-editN")); editNote(it, d, rerender);
    });
    list.querySelectorAll("[data-delN]").forEach(b => b.onclick = () => {
      const id = b.getAttribute("data-delN");
      if (confirm("删除这条笔记？")) { SX.accounts.delNote(id); SX.toast("已删除"); rerender(); }
    });
  }

  function cardN(n) {
    return '<div class="card" style="display:flex;flex-direction:column;gap:6px">' +
      '<div style="display:flex;justify-content:space-between;gap:8px"><b>' + E(n.title) + '</b>' +
      (n.seed ? '<span class="tag n">示例</span>' : '') + '</div>' +
      '<div class="small muted">' + E((n.tags || []).join(" · ")) + '</div>' +
      '<div class="note" style="max-height:140px;overflow:auto;white-space:pre-wrap;font-size:calc(13px * var(--fs))">' + E(n.body) + '</div>' +
      '<div class="toolbar" style="margin-top:auto">' +
        '<button class="btn sm" data-editN="' + n.id + '">编辑</button>' +
        '<button class="btn sm danger" data-delN="' + n.id + '">删除</button></div></div>';
  }

  function editNote(it, d, rerender) {
    const isNew = !it;
    const o = it || { id: "n" + Date.now() + Math.random().toString(36).slice(2, 6), title: "", body: "", tags: [] };
    const body = document.getElementById("spaceBody");
    body.innerHTML =
      '<div class="card"><h3>' + (isNew ? "新增笔记" : "编辑笔记") + '</h3>' +
      '<input class="ed" id="nTitle" placeholder="标题" value="' + E(o.title) + '">' +
      '<input class="ed" id="nTags" placeholder="标签，逗号分隔" style="margin-top:8px" value="' + E((o.tags || []).join(", ")) + '">' +
      '<textarea class="ed" id="nBody" style="margin-top:8px;min-height:240px" spellcheck="false">' + E(o.body) + '</textarea>' +
      '<div class="toolbar" style="margin-top:10px"><button class="btn primary" id="nSave">保存</button>' +
      '<button class="btn" id="nCancel">取消</button></div></div>';
    document.getElementById("nCancel").onclick = rerender;
    document.getElementById("nSave").onclick = () => {
      o.title = document.getElementById("nTitle").value.trim();
      if (!o.title) { SX.toast("请填标题"); return; }
      o.tags = document.getElementById("nTags").value.split(",").map(s => s.trim()).filter(Boolean);
      o.body = document.getElementById("nBody").value;
      o.at = new Date().toISOString();
      if (isNew) SX.accounts.addNote(o); else SX.accounts.updateNote(o.id, o);
      SX.toast("已保存"); rerender();
    };
  }

  window.SXViewSpace = { render };
})();
