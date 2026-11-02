/* 嵩山一号 · 工作站 —— 路由与修炼地图 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  const NAV = [
    { id: "map", name: "修炼地图", group: "main", fn: map },
    { id: "course", name: "通用课程", group: "main", fn: () => window.SXViewCourse.render(document.getElementById("view")) },
    { id: "dojo", name: "代码道场", group: "main", fn: () => window.SXViewDojo.render(document.getElementById("view")) },
    { id: "practice", name: "练习台", group: "main", fn: () => window.SXViewPractice.render(document.getElementById("view")) },
    { id: "litfind", name: "找文献", group: "main", fn: () => window.SXViewLit.render(document.getElementById("view")) },
    { id: "gen", name: "出代码", group: "main", fn: () => window.SXViewGen.render(document.getElementById("view")) },
    { id: "knowledge", name: "知识库", group: "more", fn: () => window.SXViewLib.knowledge(document.getElementById("view")) },
    { id: "codebank", name: "代码库", group: "more", fn: () => window.SXViewLib.codebank(document.getElementById("view")) },
    { id: "playbook", name: "套路拆解", group: "more", fn: () => window.SXViewLib.playbook(document.getElementById("view")) },
    { id: "data", name: "数据中心", group: "more", fn: () => window.SXViewLib.data(document.getElementById("view")) },
    { id: "vault", name: "数据仓库", group: "more", fn: () => window.SXViewLib.vault(document.getElementById("view")) },
    { id: "path", name: "学习路径", group: "more", fn: () => window.SXViewLib.paths(document.getElementById("view")) },
    { id: "write", name: "论文写作台", group: "more", fn: () => window.SXViewWrite.write(document.getElementById("view")) },
    { id: "tutor", name: "AI 导师", group: "more", fn: () => window.SXViewWrite.tutor(document.getElementById("view")) },
    { id: "account", name: "账号", group: "more", fn: () => window.SXViewAccount.render(document.getElementById("view")) },
    { id: "space", name: "个人空间", group: "more", fn: () => window.SXViewSpace.render(document.getElementById("view")) }
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
    const PAGE_CLS = { course: " side-fixed", tutor: " tutor-wide" };
    v.className = "page" + (PAGE_CLS[item.id] || "");
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
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("hudXp", (s.xp || 0) + " XP");
    set("hudLevel", "Lv." + r.idx + " " + r.rank.name);
    set("hudStreak", SX.streakOf() + " 天");
  }

  /* ==================== 首页：训练闭环 + 站内实数 + 进度 ====================
     视觉是发布会式的（黑底、大标题、细线、大留白），但骨架是科研训练：
     先讲「学 → 练 → 查 → 写」这条闭环怎么走，再交代站里到底有多少可练的东西，
     最后才是个人进度与下一关。不放纯装饰内容。 */
  function map(root) {
    const s = SX.state;
    const r = SX.rankOf(s.xp || 0);
    const pct = SX.progressPct(s.xp || 0);
    const levels = window.SX_LEVELS || [];
    const done = SX.doneCount();
    const ach = SX.achieved();
    const next = levels.find(l => !(s.levels[l.id] || {}).done);
    const taskN = levels.reduce((a, l) => a + (l.tasks || []).length, 0);
    /* 机制库 / 论文库 / 代码库 的大块数据是懒加载的（进对应页面才拉，首屏保持轻）。
       首页用一份已知总量兜底；用户访问过对应页面后真实数据已在内存里，就自动取真实值。 */
    const DECLARED = { kn: 154, paper: 3314, cb: 141 };
    const knN = Math.max(DECLARED.kn,
      (window.SX_KNOWLEDGE || []).length + (window.SX_KNOWLEDGE2 || []).length + (window.SX_KNOWLEDGE3 || []).length);
    const citeN = Object.keys(window.SX_KNOW_CITE || {}).length;
    const paperN = Math.max(DECLARED.paper, (window.SX_PAPERS || []).length + (window.SX_PAPERS2 || []).length);
    const cbN = Math.max(DECLARED.cb, (window.SX_CODEBANK || []).length + (window.SX_CODEBANK2 || []).length + (window.SX_CODEBANK3 || []).length);
    const lecN = (window.SX_COURSE0 ? 1 : 0) + ((window.SX_COURSE || {}).chapters || []).length;
    const secN = ((window.SX_COURSE0 || {}).subs || []).length +
      ((window.SX_COURSE || {}).chapters || []).reduce((a, c) => a + (c.subs || []).length, 0);

    const TRACKS = [
      { id: "rbase", name: "R 语言基础" }, { id: "bulk", name: "Bulk RNA-seq" },
      { id: "scrna", name: "单细胞" }, { id: "spatial", name: "空间转录组" },
      { id: "mr", name: "孟德尔随机化" }, { id: "tox", name: "网络毒理学" },
      { id: "drug", name: "药物重定位" }, { id: "ml", name: "机器学习" },
      { id: "writing", name: "写作与出图" }, { id: "boss", name: "终章" }
    ];


    root.innerHTML =
      '<div class="hero">' +
      '<div class="hero-k">嵩山一号 · 科研训练工作站</div>' +
      "<h2>从零练到<br>能自己写出一篇生信论文。</h2>" +
      '<p class="hero-sub">这里不是资料站，是训练场。一条闭环走四遍：<b>学</b>一段原理 → <b>练</b>一遍代码 → ' +
      "<b>查</b>清楚背后的机制 → <b>写</b>成自己的结果。不用预习，也不用先去别处补课。</p>" +
      '<div class="hero-acts">' +
      '<a class="btn primary" href="#/course">打开课程（视频在顶部）</a>' +
      '<a class="btn" href="#/dojo">跳过铺垫，直接做第一关</a>' +
      "</div>" +
      '<div class="hero-tip">第一次来：先看完课程页顶部的「R 入门」视频，再读第 0、1 讲，然后做 rbase-1。</div>' +
      "</div>" +

      '<div class="sec-h">训练闭环 · 四步走完一轮，再走下一轮</div>' +
      '<div class="loop">' +
      '<a class="loop-i" href="#/course"><span class="loop-s">第一步 · 学</span><b>先看懂</b>' +
      '<span class="loop-d">8 个视频按「先 R → 再转录组 → 然后动手 → 最后单细胞」排好，不用自己挑。' +
      "不想看视频就读 " + lecN + " 讲 " + secN + " 节课程，每节先用一句大白话说清它在干什么。</span></a>" +
      '<a class="loop-i" href="#/dojo"><span class="loop-s">第二步 · 练</span><b>亲手跑通</b>' +
      '<span class="loop-d">' + levels.length + " 关 " + taskN + " 个任务，代码就在页面里跑，写完立刻判分。" +
      "错的时候不只说错了，还会告诉你错在哪个数字上、该往哪个方向改。</span></a>" +
      '<a class="loop-i" href="#/knowledge"><span class="loop-s">第三步 · 查</span><b>查证机制</b>' +
      '<span class="loop-d">' + knN + " 条机制条目，其中 " + citeN + " 条挂着真实文献，能点开原文核对；" +
      paperN + " 篇生信论文按被引次数排好，找方法、找靶点都在这一页。" +
      "下不到全文就进「找文献」，粘个 DOI，它把能下的通道全列出来。</span></a>" +
      '<a class="loop-i" href="#/write"><span class="loop-s">第四步 · 写</span><b>落成文字</b>' +
      '<span class="loop-d">把结果和机制拼成骨架，' +
      "写完直接搬进 Word。</span></a>" +
      "</div>" +

      '<div class="sec-h">站内实数 · 全部是自己可练、可查、可抄的东西</div>' +
      '<div class="assets">' +
      '<div class="asset"><b>' + lecN + " 讲</b><span>" + secN + " 节系统课程，从 1 + 1 怎么写开始</span></div>" +
      '<div class="asset"><b>' + levels.length + " 关</b><span>" + taskN + " 个动手任务，边写边判</span></div>" +
      '<div class="asset"><b>' + knN + " 条</b><span>机制词典，" + citeN + " 条挂真实文献</span></div>" +
      '<div class="asset"><b>' + paperN + " 篇</b><span>生信论文，按被引次数排序</span></div>" +
      '<div class="asset"><b>' + cbN + " 个</b><span>代码模板，一键复制到 RStudio</span></div>" +
      "</div>" +

      '<div class="sec-h">你现在的进度</div>' +
      '<div class="statline">' +
      "<span>Lv." + r.idx + " " + E(r.rank.name) + "</span>" +
      '<span class="bar"><i style="width:' + pct + '%"></i></span>' +
      "<span>" + (s.xp || 0) + " XP</span>" +
      "<span>通关 " + done + " / " + levels.length + "</span>" +
      "<span>连续 " + SX.streakOf() + " 天</span>" +
      "</div>" +

      (next
        ? '<div class="card nextcard"><span class="tiny muted">下一关</span>' +
          "<b style=\"font-size:calc(19px * var(--fs));display:block;margin:6px 0\">" + E(next.title) + "</b>" +
          '<div class="small muted">' + E(next.goal || "") + "</div>" +
          '<button class="btn primary sm" id="goNext" style="margin-top:10px">进入道场</button></div>'
        : '<div class="card nextcard"><b>' + levels.length + ' 关全部通关了</b><div class="small muted">去写作台把课题写出来。</div></div>') +

      '<details class="acc" style="margin-top:16px"><summary>更多（各轨道进度 · 成就 · 快捷键 · 进度备份）</summary>' +
      '<div class="grid g3" style="margin:6px 0 14px">' +
      TRACKS.map(t => {
        const ls = levels.filter(l => l.track === t.id);
        if (!ls.length) return "";
        const dn = ls.filter(l => (s.levels[l.id] || {}).done).length;
        return '<div><div style="display:flex;justify-content:space-between" class="small">' +
          "<span>" + E(t.name) + "</span><span class=\"muted\">" + dn + "/" + ls.length + "</span></div>" +
          '<div class="bar"><i style="width:' + Math.round(dn / ls.length * 100) + '%"></i></div></div>';
      }).join("") + "</div>" +
      '<div class="grid g4" style="margin-bottom:14px">' +
      SX.ACHIEVEMENTS.map(a => {
        const got = ach.indexOf(a) >= 0;
        return '<div class="lv ' + (got ? "done" : "locked") + '" style="padding:9px">' +
          "<b style=\"font-size:calc(15px * var(--fs))\">" + E(a.name) + "</b>" +
          '<div class="tiny muted">' + E(a.desc) + "</div></div>";
      }).join("") + "</div>" +
      '<div class="small muted">' +
      "Ctrl+Enter 运行代码（首次会加载 R 运行时，约 20-40 MB）· 代码库模板一键复制到 RStudio" +
      " · AI 导师默认 DeepSeek，也可连本机网关 · 数据仓库只存在本机浏览器，不上传" +
      "</div>" +
      '<div class="toolbar" style="margin-top:12px">' +
      '<button class="btn sm" id="btnExportAll">导出全部进度</button>' +
      '<button class="btn sm danger" id="btnReset">清空全部进度</button></div></details>';

    const gn = document.getElementById("goNext");
    if (gn) gn.onclick = () => go("dojo");
    const be = document.getElementById("btnExportAll");
    if (be) be.onclick = () => {
      SX.download("嵩山一号-进度存档.json", JSON.stringify(SX.state, null, 2), "application/json");
      SX.toast("已导出（含关卡进度、代码、论文草稿；不含 AI 密钥）");
    };
    const br = document.getElementById("btnReset");
    if (br) br.onclick = () => {
      if (confirm("确定清空全部进度？论文草稿与代码片段也会一并清除，且无法恢复。")) SX.reset();
    };
  }

  /* ==================== 启动 ==================== */
  function boot() {
    const main = NAV.filter(n => n.group === "main");
    const more = NAV.filter(n => n.group === "more");
    document.getElementById("nav").innerHTML =
      main.map(n => '<a href="#/' + n.id + '" data-id="' + n.id + '">' + E(n.name) + "</a>").join("") +
      '<span class="more" id="navMore"><a data-more="1">更多</a><span class="morebox">' +
      more.map(n => '<a href="#/' + n.id + '" data-id="' + n.id + '">' + E(n.name) + "</a>").join("") +
      '<span class="hudline"><span id="hudXp">0 XP</span><span id="hudLevel">Lv.1</span>' +
      '<span id="hudStreak">0 天</span></span>' +
      "</span></span>";
    const mEl = document.getElementById("navMore");
    mEl.querySelector("[data-more]").onclick = (e) => { e.stopPropagation(); mEl.classList.toggle("open"); };
    document.addEventListener("click", () => mEl.classList.remove("open"));

    /* 手机菜单：760px 以下导航收进全屏面板，点任一条自动收起 */
    const mb = document.getElementById("menuBtn");
    const closeM = () => { document.body.classList.remove("mnav"); if (mb) mb.textContent = "菜单"; };
    if (mb) mb.onclick = () => {
      const on = document.body.classList.toggle("mnav");
      mb.textContent = on ? "关闭" : "菜单";
    };
    document.getElementById("nav").addEventListener("click", (e) => {
      if (e.target.tagName === "A" && e.target.getAttribute("data-more") === null) closeM();
    });
    window.addEventListener("hashchange", closeM);
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
