/* 嵩山一号 · 工作站 —— 代码道场 */
(function () {
  "use strict";
  const SX = window.SX;

  const TRACKS = [
    { id: "rbase", name: "R 语言基础", why: "不会这些，后面的每一关都写不动" },
    { id: "bulk", name: "Bulk RNA-seq", why: "转录组差异分析的标准流程" },
    { id: "scrna", name: "单细胞转录组", why: "从矩阵到细胞类型" },
    { id: "spatial", name: "空间转录组", why: "把表达放回组织坐标" },
    { id: "mr", name: "孟德尔随机化", why: "用遗传变异做因果推断" },
    { id: "tox", name: "网络毒理学", why: "化学物—基因—疾病三角" },
    { id: "drug", name: "药物重定位", why: "老药新用的打分逻辑" },
    { id: "ml", name: "机器学习与统计建模", why: "建模、验证、别作弊" },
    { id: "writing", name: "写作与出图", why: "把结果变成能投的稿子" },
    { id: "boss", name: "终章", why: "一条完整的课题链路" }
  ];

  let cur = null;

  function trackName(id) {
    const t = TRACKS.find(x => x.id === id);
    return t ? t.name : id;
  }

  /* 从任务描述里抠出「你要造出来的对象名」，形如 `ir_samples：...` */
  function outputsOf(lv) {
    const out = [];
    (lv.tasks || []).forEach(t => {
      const m = /^([A-Za-z_][A-Za-z0-9_.]*)\s*[：:]/.exec(t);
      if (m) out.push(m[1]);
    });
    return out;
  }

  function guideHtml() {
    const closed = SX.state.guideClosed;
    return '<div class="card guide' + (closed ? " folded" : "") + '" id="guideCard">' +
      '<div class="guide-head"><b>第一次来？四步就懂了</b>' +
      '<button class="btn ghost sm" id="guideToggle">' + (closed ? "展开" : "收起") + "</button></div>" +
      '<div class="guide-body">' +
      '<div class="step"><span class="num">1</span><div><b>看例子</b>：每关「目标」下面都挂着一个<b>同类的小例子</b>——它比本关简单一圈，但用的是同一个套路。' +
      "先点『在 R 里跑一遍这个例子』，看真输出长什么样，再往下走。不会编程的人从这里开始，不要直接看本关的题。</div></div>" +
      '<div class="step"><span class="num">2</span><div><b>看题</b>：下面「本关要干什么」写清了这一关在真实分析里解决什么问题、你要造出哪几个对象。' +
      "数据已经替你读进 R 了，变量名就是数据名（比如 <code class='inline'>rild_expr</code>）。</div></div>" +
      '<div class="step"><span class="num">3</span><div><b>填空</b>：编辑器里已经预置好半成品代码，每个 <code class="inline">...</code> 都是一处填空。' +
      "把 <code class='inline'>...</code> 换成你的答案，别的行不用动。</div></div>" +
      '<div class="step"><span class="num">4</span><div><b>跑</b>：按 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 或点「运行并判题」。' +
      "下方会显示 R 的<b>真实输出</b>，然后判题脚本在 R 里逐条检查你造的对象对不对——没过会直接告诉你哪一项差了、差多少。</div></div>" +
      '<div class="note" style="margin-top:8px">卡住了按顺序来：<b>提示</b>（四层递进，从公式讲到为什么）→ 自己再试一次 → ' +
      '<b>参考答案</b>（建议先自己写一遍再看，看完要把答案删掉重写一次，否则等于没学）。</div>' +
      '<div class="tiny muted" style="margin-top:6px">这一关过了会自动解锁下一关，并拿 XP。进度存在你自己的浏览器里。</div>' +
      "</div></div>";
  }

  function render(root) {
    const levels = window.SX_LEVELS || [];
    if (!cur) {
      const firstUndone = levels.find(l => !(SX.state.levels[l.id] || {}).done);
      cur = (firstUndone || levels[0] || {}).id;
    }
    const lv = levels.find(l => l.id === cur) || levels[0];
    if (lv) SX.state.curLevel = lv.id;

    root.innerHTML =
      '<div class="page-head"><h2>代码道场</h2>' +
      "<p>在浏览器里真跑 R（WebAssembly 版 R 4.6.0，只有 base R，不装任何包）。" +
      "每关配了数据、提示、参考答案和自动判题；打完一关解锁下一关。</p></div>" +
      guideHtml() +
      '<div class="layout-2">' +
      '<aside class="side card" id="lvList"></aside>' +
      '<section id="lvMain"></section>' +
      "</div>";

    const gb = document.getElementById("guideToggle");
    if (gb) gb.onclick = () => {
      SX.state.guideClosed = !SX.state.guideClosed; SX.save();
      render(root);
    };

    renderList();
    renderMain(lv);
  }

  function renderList() {
    const levels = window.SX_LEVELS || [];
    const box = document.getElementById("lvList");
    const done = SX.doneCount();
    let h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      "<b>关卡</b><span class=\"tiny muted\">" + done + " / " + levels.length + "</span></div>" +
      '<div class="bar" style="margin-bottom:10px"><i style="width:' + Math.round(done / levels.length * 100) + '%"></i></div>';

    TRACKS.forEach(t => {
      const ls = levels.filter(l => l.track === t.id);
      if (!ls.length) return;
      const dn = ls.filter(l => (SX.state.levels[l.id] || {}).done).length;
      h += '<div class="tk">' + SX.esc(t.name) + '<span>' + dn + "/" + ls.length + "</span></div>";
      ls.forEach(l => {
        const st = SX.state.levels[l.id] || {};
        const locked = !SX.isUnlocked(l.id);
        h += '<div class="lvrow' + (cur === l.id ? " on" : "") + (st.done ? " done" : "") +
          (locked ? " locked" : "") + '" data-id="' + l.id + '" title="' + SX.esc(l.title) + '">' +
          "<span>" + (st.done ? "&#10003;" : (locked ? "&#128274;" : "&#9675;")) + "</span>" +
          "<span>" + SX.esc(l.title.replace(/^第.关\s*·\s*/, "")) + "</span>" +
          '<span class="xp">' + l.xp + "</span></div>";
      });
    });
    box.innerHTML = h;
    box.querySelectorAll(".lvrow").forEach(el => {
      el.onclick = () => { cur = el.getAttribute("data-id"); render(document.getElementById("view")); };
    });
  }

  function renderMain(lv) {
    const st = SX.state.levels[lv.id] || {};
    const code = (SX.state.codeDrafts && SX.state.codeDrafts[lv.id]) || lv.starter || "";
    const outs = outputsOf(lv);
    const dsHtml = (lv.datasets || []).map(d => '<span class="tag g">' + SX.esc(d) + "</span>").join(" ");
    const ex = (window.SX_EXAMPLES || {})[lv.id];

    const exHtml = ex ?
      '<details class="acc ex" open><summary>先看一个同类的小例子（比本关简单，能直接跑）</summary>' +
      '<div class="small muted" style="margin-bottom:8px">' + SX.esc(ex.why) + "</div>" +
      "<pre class='code'>" + SX.esc(ex.code) + "</pre>" +
      '<div class="note" style="margin-top:8px">' + SX.esc(ex.tip) + "</div>" +
      '<button class="btn sm" id="btnRunEx">在 R 里跑一遍这个例子</button>' +
      "</details>" : "";

    document.getElementById("lvMain").innerHTML =
      '<div class="card">' +
      '<div class="lv-title"><h3>' + SX.esc(lv.title) + "</h3>" +
      '<span class="tag n">' + SX.esc(trackName(lv.track)) + "</span>" +
      '<span class="tag y">难度 ' + "★".repeat(lv.star || 1) + "</span>" +
      '<span class="tag">' + lv.xp + " XP</span>" +
      (st.done ? '<span class="tag g">已通关</span>' : "") +
      "</div>" +
      (lv.story ? '<div class="note" style="margin-top:12px">' + SX.md(lv.story) + "</div>" : "") +
      '<h4 class="sec">本关要干什么</h4>' +
      '<div><b>目标：</b>' + SX.esc(lv.goal || "") + "</div>" +
      exHtml +
      '<div class="margin-s"><b>判题会逐条检查下面 ' + (lv.tasks || []).length + ' 项：</b>' +
      '<ol class="crit">' + (lv.tasks || []).map(t => "<li>" + SX.md(t) + "</li>").join("") + "</ol></div>" +
      (outs.length ? '<div class="margin-s small">你需要造出这些对象：' +
        outs.map(o => "<code class='inline'>" + SX.esc(o) + "</code>").join(" ") + "</div>" : "") +
      '<div class="margin-s small muted">本关数据（已预加载为同名变量）：' + dsHtml + "</div>" +
      "</div>" +

      '<div class="card" style="margin-top:16px">' +
      '<div class="editor-head"><b>写代码</b>' +
      '<div class="toolbar">' +
      '<button class="btn primary" id="btnRun">运行并判题</button>' +
      '<button class="btn" id="btnHint">提示</button>' +
      '<button class="btn" id="btnSol">参考答案</button>' +
      '<button class="btn ghost sm" id="btnReset">重置</button>' +
      '<button class="btn ghost sm" id="btnCopy">复制到 RStudio</button>' +
      "</div></div>" +
      '<div class="hint-line">把代码里的 <code class="inline">...</code> 换成你的答案，然后 <kbd>Ctrl</kbd>+<kbd>Enter</kbd></div>' +
      '<textarea class="ed" id="codeEd" spellcheck="false"></textarea>' +
      '<div class="runbar"><span class="tiny muted" id="rStatus"></span>' +
      '<span class="tiny muted">Ctrl+Enter 运行</span></div>' +
      '<div class="out" id="outBox">（运行后，R 的真实输出会显示在这里）</div>' +
      '<div id="hintBox"></div><div id="solBox"></div>' +
      "</div>";

    const ed = document.getElementById("codeEd");
    ed.value = code;
    ed.oninput = SX.debounce(() => { SX.state.codeDrafts[lv.id] = ed.value; SX.save(); }, 400);
    ed.onkeydown = e => {
      if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); doRun(lv, ed); }
    };

    document.getElementById("btnRun").onclick = () => doRun(lv, ed);
    document.getElementById("btnReset").onclick = () => {
      ed.value = lv.starter || "";
      SX.state.codeDrafts[lv.id] = ed.value; SX.save();
    };
    document.getElementById("btnCopy").onclick = () => {
      const pre = (lv.datasets || []).map(d => {
        const p = "data/" + d + ".csv";
        return "# " + d + " <- read.csv(\"" + p + "\"" +
          (d.indexOf("_expr") >= 0 ? ", row.names = 1, check.names = FALSE" : ", check.names = FALSE") + ")";
      }).join("\n");
      const txt = pre + "\n\n" + ed.value;
      if (SX.copy(txt)) SX.toast("已复制（含数据读取行，路径改成你自己的）");
    };
    document.getElementById("btnHint").onclick = () => {
      const b = document.getElementById("hintBox");
      if (b.innerHTML) { b.innerHTML = ""; return; }
      b.innerHTML = '<details class="acc" open><summary>提示（' + (lv.hints || []).length + " 条，从公式讲到为什么）</summary>" +
        (lv.hints || []).map((x, i) => '<div class="hint-item"><span class="hn">' + (i + 1) + "</span>" + SX.md(x) + "</div>").join("") +
        "</details>";
    };
    document.getElementById("btnSol").onclick = () => {
      const b = document.getElementById("solBox");
      if (b.innerHTML) { b.innerHTML = ""; return; }
      b.innerHTML = '<details class="acc" open><summary>参考答案（先自己写一遍再看）</summary>' +
        "<pre class='code'>" + SX.esc(lv.solution || "") + "</pre>" +
        '<button class="btn sm" id="btnUseSol">填入编辑器</button></details>';
      document.getElementById("btnUseSol").onclick = () => {
        ed.value = lv.solution || "";
        SX.toast("已填入。建议看完删掉，凭记忆重写一次");
      };
    };

    if (window.SXR.status === "idle") {
      document.getElementById("rStatus").textContent = "首次运行要下载 R 运行时（约 11 MB），等 20-80 秒";
    } else if (window.SXR.status === "failed") {
      document.getElementById("rStatus").innerHTML =
        '<span style="color:var(--accent)">R 运行时不可用（' + SX.esc(window.SXR.failMsg) +
        "）——可用『复制到 RStudio』在自己电脑上跑</span>";
    }

    const be = document.getElementById("btnRunEx");
    if (be) be.onclick = async () => {
      be.disabled = true; be.textContent = "运行中…";
      const r = await window.SXR.run(ex.code, lv.datasets || [], "", m => {
        document.getElementById("rStatus").textContent = m;
      });
      be.disabled = false; be.textContent = "再跑一遍这个例子";
      const box = document.getElementById("outBox");
      box.innerHTML = "";
      const pre = document.createElement("pre");
      pre.className = "out-raw";
      pre.textContent = (r.out && r.out.trim()) ? r.out : "（这段代码没有打印输出）";
      box.appendChild(pre);
      if (r.msg) {
        const d = document.createElement("div");
        d.className = "verdict err";
        d.textContent = r.msg;
        box.appendChild(d);
      }
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  async function doRun(lv, ed) {
    const outBox = document.getElementById("outBox");
    const rStat = document.getElementById("rStatus");
    const btn = document.getElementById("btnRun");
    btn.disabled = true; btn.textContent = "运行中…";
    outBox.textContent = "（执行中）";
    rStat.textContent = "正在执行…";

    const res = await window.SXR.run(ed.value, lv.datasets || [], lv.check || "",
      m => { rStat.textContent = m; });

    outBox.innerHTML = "";
    if (res.out && res.out.trim()) {
      const pre = document.createElement("pre");
      pre.className = "out-raw";
      pre.textContent = res.out;
      outBox.appendChild(pre);
    }
    if (res.ok) {
      const ok = document.createElement("div");
      ok.className = "verdict ok";
      ok.innerHTML = "<b>判题通过</b>：你造出的对象全部符合预期。";
      outBox.appendChild(ok);
      const before = SX.state.xp;
      const r = SX.award(lv.id, lv.xp, ed.value);
      SX.toast(r.total - before > 0 ? "+" + (r.total - before) + " XP，通关！" : "再次通过");
      setTimeout(() => { render(document.getElementById("view")); }, 900);
    } else {
      const bad = document.createElement("div");
      bad.className = "verdict err";
      bad.innerHTML = "<b>还没通过</b>：<span>" + SX.esc(res.msg || "") + "</span>" +
        '<div class="small muted" style="margin-top:4px">这句话是判题脚本给出的具体差距，照着改就行；' +
        "实在改不动就点「提示」。</div>";
      outBox.appendChild(bad);
      SX.toast("还差一点，看提示");
      rStat.textContent = "未通过";
    }
    btn.disabled = false; btn.textContent = "运行并判题";
  }

  window.SXViewDojo = { render };
})();
