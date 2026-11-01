/* 嵩山一号 · 工作站 —— 路由与修炼地图 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  const NAV = [
    { id: "map", name: "修炼地图", group: "main", fn: map },
    { id: "video", name: "看视频", group: "main", fn: () => window.SXViewVideo.render(document.getElementById("view")) },
    { id: "course", name: "通用课程", group: "main", fn: () => window.SXViewCourse.render(document.getElementById("view")) },
    { id: "dojo", name: "代码道场", group: "main", fn: () => window.SXViewDojo.render(document.getElementById("view")) },
    { id: "knowledge", name: "知识库", group: "main", fn: () => window.SXViewLib.knowledge(document.getElementById("view")) },
    { id: "papers", name: "论文库", group: "main", fn: () => window.SXViewLib.papers(document.getElementById("view")) },
    { id: "codebank", name: "代码库", group: "more", fn: () => window.SXViewLib.codebank(document.getElementById("view")) },
    { id: "digest", name: "文献汇总", group: "more", fn: () => window.SXViewExtra.digest(document.getElementById("view")) },
    { id: "playbook", name: "套路拆解", group: "more", fn: () => window.SXViewLib.playbook(document.getElementById("view")) },
    { id: "refs", name: "对标与来源", group: "more", fn: () => window.SXViewExtra.refs(document.getElementById("view")) },
    { id: "scripts", name: "我的代码本", group: "more", fn: () => window.SXViewLib.scripts(document.getElementById("view")) },
    { id: "data", name: "数据中心", group: "more", fn: () => window.SXViewLib.data(document.getElementById("view")) },
    { id: "vault", name: "数据仓库", group: "more", fn: () => window.SXViewLib.vault(document.getElementById("view")) },
    { id: "write", name: "论文写作台", group: "more", fn: () => window.SXViewWrite.write(document.getElementById("view")) },
    { id: "tutor", name: "AI 导师", group: "more", fn: () => window.SXViewWrite.tutor(document.getElementById("view")) }
  ];

  function go(id) {
    location.hash = "#/" + id;
  }

  function route() {
    const h = (location.hash || "#/map").replace(/^#\/?/, "");
    const item = NAV.find(n => n.id === h) || NAV[0];
    document.querySelectorAll("#nav a").forEach(a => {
      a.classList.toggle("on", a.getAttribute("data-id") === item.id);
    });
    const mo = document.getElementById("navMore");
    if (mo) mo.querySelector("[data-more]").classList.toggle("on", item.group === "more");
    const v = document.getElementById("view");
    v.innerHTML = "";
    try { item.fn(v); } catch (e) {
      v.innerHTML = '<div class="card"><b>页面加载出错</b><pre class="code">' + E(String(e && e.stack || e)) + "</pre></div>";
    }
    hud();
    window.scrollTo(0, 0);
  }

  function hud() {
    const s = SX.state;
    const r = SX.rankOf(s.xp || 0);
    document.getElementById("hudXp").textContent = (s.xp || 0) + " XP";
    document.getElementById("hudLevel").textContent = "Lv." + r.idx + " " + r.rank.name;
    document.getElementById("hudStreak").textContent = SX.streakOf() + " 天";
  }

  /* ==================== 修炼地图 ==================== */
  function map(root) {
    const s = SX.state;
    const r = SX.rankOf(s.xp || 0);
    const pct = SX.progressPct(s.xp || 0);
    const levels = window.SX_LEVELS || [];
    const done = SX.doneCount();
    const ach = SX.achieved();
    const next = levels.find(l => !(s.levels[l.id] || {}).done);

    const TRACKS = [
      { id: "rbase", name: "R 语言基础" }, { id: "bulk", name: "Bulk RNA-seq" },
      { id: "scrna", name: "单细胞" }, { id: "spatial", name: "空间转录组" },
      { id: "mr", name: "孟德尔随机化" }, { id: "tox", name: "网络毒理学" },
      { id: "drug", name: "药物重定位" }, { id: "ml", name: "机器学习" },
      { id: "writing", name: "写作与出图" }, { id: "boss", name: "终章" }
    ];

    root.innerHTML =
      '<div class="page-head"><h2>修炼地图</h2>' +
      "<p>嵩山一号 · 科研工作站。看论文、写代码、下数据、存数据、学机制、练论文、排版投稿、问导师 —— 都在这个站里。</p></div>" +

      '<div class="grid g3" style="margin-bottom:14px">' +
      '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
      "<b style=\"font-size:16px\">Lv." + r.idx + " " + E(r.rank.name) + "</b>" +
      '<span class="tag y">' + (s.xp || 0) + " XP</span></div>" +
      '<div class="small muted" style="margin:2px 0 8px">' + E(r.rank.desc) + "</div>" +
      '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="tiny muted" style="margin-top:4px">' +
      (r.next ? "距离「" + E(r.next.name) + "」还差 " + (r.next.xp - s.xp) + " XP" : "已满级") + "</div>" +
      "</div>" +
      '<div class="card"><b>今日进度</b>' +
      '<div style="margin-top:8px" class="small">通关 <b>' + done + " / " + levels.length + "</b> 关</div>" +
      '<div class="bar" style="margin:6px 0"><i style="width:' + Math.round(done / levels.length * 100) + '%"></i></div>' +
      '<div class="small">连续进站 <b>' + SX.streakOf() + "</b> 天</div>" +
      '<div class="small muted" style="margin-top:4px">成就 <b>' + ach.length + " / " + SX.ACHIEVEMENTS.length + "</b></div>" +
      "</div>" +
      '<div class="card"><b>下一关</b>' +
      (next ? '<div style="margin-top:8px"><b style="font-size:14px">' + E(next.title) + "</b>" +
        '<div class="small muted" style="margin:4px 0">' + E(next.goal || "") + "</div>" +
        '<button class="btn primary sm" id="goNext">进入道场</button></div>'
        : '<div class="small muted" style="margin-top:8px">全部通关了。去写作台把课题写出来。</div>') +
      "</div></div>" +

      '<div class="card" style="margin-bottom:14px"><b>各轨道进度</b><div class="grid g3" style="margin-top:8px">' +
      TRACKS.map(t => {
        const ls = levels.filter(l => l.track === t.id);
        if (!ls.length) return "";
        const dn = ls.filter(l => (s.levels[l.id] || {}).done).length;
        return '<div><div style="display:flex;justify-content:space-between" class="small">' +
          "<span>" + E(t.name) + "</span><span class=\"muted\">" + dn + "/" + ls.length + "</span></div>" +
          '<div class="bar"><i style="width:' + Math.round(dn / ls.length * 100) + '%"></i></div></div>';
      }).join("") + "</div></div>" +

      '<div class="card"><b>成就</b><div class="grid g4" style="margin-top:8px">' +
      SX.ACHIEVEMENTS.map(a => {
        const got = ach.indexOf(a) >= 0;
        return '<div class="lv ' + (got ? "done" : "locked") + '" style="padding:10px">' +
          "<b style=\"font-size:13px\">" + (got ? "" : "") + E(a.name) + "</b>" +
          '<div class="tiny muted">' + E(a.desc) + "</div></div>";
      }).join("") + "</div></div>" +

      '<div class="card" style="margin-top:14px"><b>快捷键与用法</b>' +
      '<div class="small" style="margin-top:6px">' +
      "· 代码道场：Ctrl+Enter 运行；首次运行会从网络加载 R 运行时（约 20-40 MB），之后秒开<br>" +
      "· 代码库：所有模板一键复制到 RStudio；站内数据是教学用的模拟数据，真数据从数据中心下<br>" +
      "· AI 导师：默认 DeepSeek，填 Key 即可用；本机网关 localhost:8899 也能连<br>" +
      "· 论文写作台：自动保存，可导出 Markdown 或打印成 PDF<br>" +
      "· 数据仓库：文件只存在你这台机器的浏览器里，不上传任何服务器" +
      "</div>" +
      '<div class="toolbar" style="margin-top:10px">' +
      '<button class="btn sm" id="btnExportAll">导出全部进度</button>' +
      '<button class="btn sm danger" id="btnReset">清空全部进度</button></div></div>';

    const gn = document.getElementById("goNext");
    if (gn) gn.onclick = () => go("dojo");
    document.getElementById("btnExportAll").onclick = () => {
      SX.download("嵩山一号-进度存档.json", JSON.stringify(SX.state, null, 2), "application/json");
      SX.toast("已导出（含关卡进度、代码、论文草稿；不含 AI 密钥）");
    };
    document.getElementById("btnReset").onclick = () => {
      if (confirm("确定清空全部进度？论文草稿与代码片段也会一并清除，且无法恢复。")) SX.reset();
    };
  }

  /* ==================== 启动 ==================== */
  function boot() {
    const main = NAV.filter(n => n.group === "main");
    const more = NAV.filter(n => n.group === "more");
    document.getElementById("nav").innerHTML =
      main.map(n => '<a href="#/' + n.id + '" data-id="' + n.id + '">' + E(n.name) + "</a>").join("") +
      '<span class="more" id="navMore"><a data-more="1">更多 ▾</a><span class="morebox">' +
      more.map(n => '<a href="#/' + n.id + '" data-id="' + n.id + '">' + E(n.name) + "</a>").join("") +
      "</span></span>";
    const mEl = document.getElementById("navMore");
    mEl.querySelector("[data-more]").onclick = (e) => { e.stopPropagation(); mEl.classList.toggle("open"); };
    document.addEventListener("click", () => mEl.classList.remove("open"));
    // 主题：默认深色，可一键切换
    const tb = document.getElementById("themeBtn");
    if (tb) {
      const set = (t) => {
        document.documentElement.setAttribute("data-theme", t);
        tb.textContent = t === "dark" ? "◐" : "◑";
        tb.title = t === "dark" ? "切换到浅色" : "切换到深色";
        try { localStorage.setItem("sx_theme", t); } catch (e) { }
      };
      set(localStorage.getItem("sx_theme") || "dark");
      tb.onclick = () => set(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }
    window.addEventListener("hashchange", route);
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
