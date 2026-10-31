/* 嵩山一号 · 工作站 —— 代码道场 */
(function () {
  "use strict";
  const SX = window.SX;

  const TRACKS = [
    { id: "rbase", name: "R 语言基础" },
    { id: "bulk", name: "Bulk RNA-seq" },
    { id: "scrna", name: "单细胞转录组" },
    { id: "spatial", name: "空间转录组" },
    { id: "mr", name: "孟德尔随机化" },
    { id: "tox", name: "网络毒理学" },
    { id: "drug", name: "药物重定位" },
    { id: "ml", name: "机器学习与统计建模" },
    { id: "writing", name: "写作与出图" },
    { id: "boss", name: "终章" }
  ];

  let cur = null;   // 当前关卡 id

  function trackName(id) {
    const t = TRACKS.find(x => x.id === id);
    return t ? t.name : id;
  }

  function render(root) {
    const levels = window.SX_LEVELS || [];
    if (!cur) {
      const firstUndone = levels.find(l => !(SX.state.levels[l.id] || {}).done);
      cur = (firstUndone || levels[0] || {}).id;
    }
    const lv = levels.find(l => l.id === cur) || levels[0];

    root.innerHTML =
      '<div class="page-head"><h2>代码道场</h2>' +
      '<p>浏览器里真跑 R（WebR，仅 base R，不依赖任何包）。每关都配了内置数据、提示、参考答案和自动判题。' +
      '打完一关解锁下一关，通关拿 XP。</p></div>' +
      '<div class="layout-2">' +
      '<aside class="side card" id="lvList"></aside>' +
      '<section id="lvMain"></section>' +
      '</div>';

    renderList();
    renderMain(lv);
  }

  function renderList() {
    const levels = window.SX_LEVELS || [];
    const box = document.getElementById("lvList");
    const done = SX.doneCount();
    let h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<b>关卡</b><span class="tiny muted">' + done + " / " + levels.length + "</span></div>" +
      '<div class="bar" style="margin-bottom:10px"><i style="width:' + Math.round(done / levels.length * 100) + '%"></i></div>';

    TRACKS.forEach(t => {
      const ls = levels.filter(l => l.track === t.id);
      if (!ls.length) return;
      h += '<div class="tiny muted" style="margin:10px 0 4px">' + SX.esc(t.name) + "</div>";
      ls.forEach(l => {
        const st = SX.state.levels[l.id] || {};
        const locked = !SX.isUnlocked(l.id);
        const cls = st.done ? "done" : (locked ? "locked" : "") + (l.boss ? " boss" : "");
        h += '<div class="lvrow" data-id="' + l.id + '" style="padding:6px 8px;border-radius:6px;cursor:pointer;' +
          (cur === l.id ? "background:var(--brand-soft);" : "") +
          (st.done ? "color:var(--brand);" : (locked ? "opacity:.5;" : "")) +
          'font-size:13px;display:flex;gap:6px;align-items:center">' +
          '<span>' + (st.done ? "&#10003;" : (locked ? "&#128274;" : "&#9675;")) + "</span>" +
          "<span>" + SX.esc(l.title.replace(/^第.关\s*·\s*/, "")) + "</span>" +
          '<span class="tiny muted" style="margin-left:auto">' + l.xp + "xp</span></div>";
      });
    });
    box.innerHTML = h;
    box.querySelectorAll(".lvrow").forEach(el => {
      el.onclick = () => { cur = el.getAttribute("data-id"); render(document.getElementById("view")); };
    });
  }

  function renderMain(lv) {
    const st = SX.state.levels[lv.id] || {};
    const locked = !SX.isUnlocked(lv.id);
    const code = (SX.state.codeDrafts && SX.state.codeDrafts[lv.id]) || lv.starter || "";

    const dsHtml = (lv.datasets || []).map(d =>
      '<span class="tag g">' + SX.esc(d) + "</span>").join(" ");

    document.getElementById("lvMain").innerHTML =
      '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
      "<h3 style=\"margin:0;font-size:16px\">" + SX.esc(lv.title) + "</h3>" +
      '<span class="tag n">' + SX.esc(trackName(lv.track)) + "</span>" +
      '<span class="tag y">难度 ' + "★".repeat(lv.star || 1) + "</span>" +
      '<span class="tag">' + lv.xp + " XP</span>" +
      (st.done ? '<span class="tag g">已通关</span>' : "") +
      "</div>" +
      (lv.story ? '<div class="note" style="margin-top:10px">' + SX.md(lv.story) + "</div>" : "") +
      '<div style="margin-top:10px"><b>目标：</b>' + SX.esc(lv.goal || "") + "</div>" +
      '<div style="margin-top:8px"><b>任务：</b><ol style="margin:4px 0 0 18px;padding:0">' +
      (lv.tasks || []).map(t => "<li>" + SX.esc(t) + "</li>").join("") + "</ol></div>" +
      '<div style="margin-top:8px" class="small muted">本关数据（已在 R 里预加载为同名变量）：' + dsHtml + "</div>" +
      "</div>" +

      '<div class="card" style="margin-top:14px">' +
      '<div class="editor-head">' +
      "<b>写代码</b>" +
      '<div class="toolbar">' +
      '<button class="btn primary" id="btnRun">运行并判题</button>' +
      '<button class="btn" id="btnHint">提示</button>' +
      '<button class="btn" id="btnSol">参考答案</button>' +
      '<button class="btn ghost sm" id="btnReset">重置</button>' +
      '<button class="btn ghost sm" id="btnCopy">复制到 RStudio</button>' +
      "</div></div>" +
      '<textarea class="ed" id="codeEd" spellcheck="false"></textarea>' +
      '<div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<span class="tiny muted" id="rStatus"></span>' +
      '<span class="tiny muted">Ctrl+Enter 运行</span>' +
      "</div>" +
      '<div class="out" id="outBox" style="margin-top:8px">（运行后显示输出）</div>' +
      '<div id="hintBox"></div><div id="solBox"></div>' +
      "</div>";

    const ed = document.getElementById("codeEd");
    ed.value = code;
    ed.oninput = SX.debounce(() => {
      SX.state.codeDrafts[lv.id] = ed.value; SX.save();
    }, 400);
    ed.onkeydown = e => {
      if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); doRun(lv, ed); }
    };

    document.getElementById("btnRun").onclick = () => doRun(lv, ed);
    document.getElementById("btnReset").onclick = () => { ed.value = lv.starter || ""; SX.state.codeDrafts[lv.id] = ed.value; SX.save(); };
    document.getElementById("btnCopy").onclick = () => {
      const pre = (lv.datasets || []).map(d => {
        const p = "~/<工作站>/data/" + d + ".csv";
        return "# " + d + " <- read.csv(\"" + p + "\"" + (d.indexOf("_expr") >= 0 ? ", row.names = 1" : "") + ")";
      }).join("\n");
      const txt = pre + "\n\n" + ed.value;
      if (SX.copy(txt)) SX.toast("已复制（含数据读取提示，自行改成你的实际路径）");
    };
    document.getElementById("btnHint").onclick = () => {
      const b = document.getElementById("hintBox");
      if (b.innerHTML) { b.innerHTML = ""; return; }
      b.innerHTML = '<details class="acc" open><summary>提示（' + (lv.hints || []).length + " 条)</summary>" +
        (lv.hints || []).map(x => "<div style=\"margin:6px 0\">" + SX.md(x) + "</div>").join("") + "</details>";
    };
    document.getElementById("btnSol").onclick = () => {
      const b = document.getElementById("solBox");
      if (b.innerHTML) { b.innerHTML = ""; return; }
      b.innerHTML = '<details class="acc" open><summary>参考答案</summary>' +
        "<pre class='code'>" + SX.esc(lv.solution || "") + "</pre>" +
        '<button class="btn sm" id="btnUseSol">填入编辑器</button></details>';
      document.getElementById("btnUseSol").onclick = () => { ed.value = lv.solution || ""; SX.toast("已填入，改一改再跑一遍效果更好"); };
    };

    if (window.SXR.status === "idle") {
      document.getElementById("rStatus").textContent = "点击『运行并判题』将首次加载 R 运行时（约 20-40 MB）";
    } else if (window.SXR.status === "failed") {
      document.getElementById("rStatus").innerHTML = '<span style="color:var(--accent)">R 运行时不可用（' + SX.esc(window.SXR.failMsg) + '）——可用『复制到 RStudio』继续</span>';
    }
  }

  async function doRun(lv, ed) {
    const outBox = document.getElementById("outBox");
    const rStat = document.getElementById("rStatus");
    const btn = document.getElementById("btnRun");
    btn.disabled = true; btn.textContent = "运行中…";
    outBox.textContent = "（执行中）";
    rStat.textContent = "正在执行…";

    const res = await window.SXR.run(
      ed.value,
      lv.datasets || [],
      lv.check || "",
      m => { rStat.textContent = m; }
    );

    outBox.innerHTML = "";
    if (res.out) {
      const d = document.createElement("div");
      d.textContent = res.out;
      outBox.appendChild(d);
    }
    if (res.ok) {
      const ok = document.createElement("div");
      ok.className = "ok";
      ok.textContent = "\n>> 判题通过";
      outBox.appendChild(ok);
      const before = SX.state.xp;
      const r = SX.award(lv.id, lv.xp, ed.value);
      SX.toast((r.total - before > 0 ? "+" + (r.total - before) + " XP，通关！" : "再次通过"));
      setTimeout(() => { render(document.getElementById("view")); }, 900);
    } else {
      const bad = document.createElement("div");
      bad.className = "err";
      bad.textContent = "\n>> 未通过：" + (res.msg || "");
      outBox.appendChild(bad);
      SX.toast("还差一点，看看提示");
      rStat.textContent = "未通过";
    }
    btn.disabled = false; btn.textContent = "运行并判题";
  }

  window.SXViewDojo = { render };
})();
