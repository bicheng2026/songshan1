/* 嵩山一号 · 工作站 —— 通用课程（10 讲，参照本地录播课结构重排）
   每节：为什么 → 要点 → base R 可跑代码（+ 真实包写法）*/
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  function render(root) {
    const C = window.SX_COURSE;
    if (!C) { root.innerHTML = '<div class="card">课程数据没加载。</div>'; return; }

    const total = C.chapters.reduce((a, c) => a + c.subs.length, 0);
    const nRes = (C.resources || []).reduce((a, g) => a + g.items.length, 0);

    /* ---------- 左侧目录 ---------- */
    let side = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      "<b>目录</b><span class='tiny muted'>" + C.chapters.length + " 讲 / " + total + " 节</span></div>";
    C.chapters.forEach((ch, ci) => {
      side += '<div class="tk">' + E(ch.title.replace(/^第 \d+ 讲　/, "")) + "</div>";
      ch.subs.forEach((s, si) => {
        side += '<div class="lvrow" data-go="c' + ci + "-" + si + '"><span>&#9675;</span><span>' +
          E(s.t.replace(/^\d+\.\d+\s*/, "")) + "</span></div>";
      });
    });
    side += '<div class="tk" style="margin-top:10px">资源</div>' +
      '<div class="lvrow" data-go="res"><span>&#9675;</span><span>在线课程与文档（' + nRes + '）</span></div>';

    /* ---------- 顶部说明 ---------- */
    let main = '<div class="card"><b>这门课怎么用</b><div class="small" style="margin-top:8px">' +
      E(C.intro) + "</div>" +
      '<div class="note info" style="margin-top:10px">每节的灰框代码<b>只用 base R</b>，点按钮就能在本页跑出结果，用来把原理看明白。' +
      "标了「真实写法」的折叠块是装了包之后真正做分析时的代码，本站跑不了，但它才是你要写进脚本里的东西。" +
      "原理看过一遍，就去「代码道场」找同主题的关卡自己写——看懂 ≠ 会写。</div>" +
      '<div class="toolbar" style="margin-top:8px">' +
      '<a class="btn sm" href="#/dojo">去代码道场练手</a>' +
      '<a class="btn sm ghost" href="#/knowledge">查生物学机制</a></div></div>';

    /* ---------- 各讲 ---------- */
    C.chapters.forEach((ch, ci) => {
      main += '<div class="card" style="margin-top:16px"><h3 class="lv-title" style="margin:0 0 4px">' +
        E(ch.title) + "</h3>";
      if (ch.goal) main += '<div class="small muted" style="margin-bottom:6px">学完这讲：' + E(ch.goal) + "</div>";
      if (ch.watch && ch.watch.length) {
        main += '<div class="tiny" style="margin:6px 0 0">配套看：' +
          ch.watch.map(w => '<a href="' + E(w.u) + '" target="_blank" rel="noopener" style="margin-right:10px">' +
            E(w.n) + " &#8599;</a>").join("") + "</div>";
      }
      ch.subs.forEach((s, si) => {
        const id = "c" + ci + "-" + si;
        main += '<div id="' + id + '" style="margin-top:18px;padding-top:12px;border-top:1px solid var(--line)">' +
          "<b>" + E(s.t) + "</b>" +
          '<div class="note" style="margin-top:8px">' + E(s.why) + "</div>" +
          '<div class="margin-s"><b>要点</b><ol class="crit">' +
          s.pts.map(p => "<li>" + mdInline(p) + "</li>").join("") + "</ol></div>" +
          "<pre class='code'>" + E(s.code) + "</pre>" +
          '<button class="btn sm" data-run="' + id + '">在 R 里跑这一节的代码</button>';
        if (s.real) {
          main += '<details class="real" style="margin-top:10px"><summary>真实写法（需要 ' +
            E(s.real.pkg) + " 包，本站 R 跑不了）</summary>" +
            "<pre class='code'>" + E(s.real.code) + "</pre></details>";
        }
        main += '<div class="out" id="out-' + id + '" hidden></div></div>';
      });
      main += "</div>";
    });

    /* ---------- 资源 ---------- */
    main += '<div id="res" class="card" style="margin-top:20px"><h3 class="lv-title" style="margin:0 0 4px">' +
      "在线课程与文档</h3><div class='small muted'>全部链接都是逐个打开验证过的（返回 200 才算进来）。" +
      "视频课的标题、UP 主、播放量、时长取自 B 站接口，不是抄来的。</div>";
    (C.resources || []).forEach(g => {
      main += '<div style="margin-top:14px"><b style="color:var(--brand)">' + E(g.g) + "</b>" +
        '<div class="grid g2" style="margin-top:8px">' +
        g.items.map(it => '<div class="card" style="padding:10px">' +
          '<a href="' + E(it.u) + '" target="_blank" rel="noopener"><b style="font-size:13.5px">' +
          E(it.n) + "</b></a>" +
          '<div class="tiny muted" style="font-family:var(--mono);word-break:break-all">' + E(it.m || it.u) + "</div>" +
          (it.d ? '<div class="small" style="margin-top:4px">' + E(it.d) + "</div>" : "") +
          "</div>").join("") + "</div></div>";
    });
    main += "</div>";

    root.innerHTML =
      '<div class="page-head"><h2>通用课程</h2>' +
      "<p>按一篇生信文章的顺序排的 10 讲 " + total +
      " 节：counts 矩阵 → 差异分析 → 富集 → 免疫浸润 → 预后 → 分型/突变负荷 → 网络 → GEO 实战 → LASSO → 复现。" +
      "每节都有能在本页直接跑的 base R 版本，外加一段真实包写法。</p></div>" +
      '<div class="layout-2"><aside class="side card">' + side + "</aside><section>" + main + "</section></div>";

    /* ---------- 交互 ---------- */
    root.querySelectorAll("[data-go]").forEach(el => {
      el.onclick = () => {
        const t = document.getElementById(el.getAttribute("data-go"));
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });

    const flat = {};
    C.chapters.forEach((ch, ci) => ch.subs.forEach((s, si) => { flat["c" + ci + "-" + si] = s.code; }));

    root.querySelectorAll("[data-run]").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-run");
        const box = document.getElementById("out-" + id);
        box.hidden = false;
        box.textContent = "运行中…";
        btn.disabled = true;
        const r = await window.SXR.run(flat[id], [], "", m => { box.textContent = m; });
        btn.disabled = false;
        box.innerHTML = "";
        const pre = document.createElement("pre");
        pre.className = "out-raw";
        pre.textContent = (r.out && r.out.trim()) ? r.out : "（这段代码没有打印输出，R 只是执行了赋值）";
        box.appendChild(pre);
        if (r.msg) {
          const d = document.createElement("div");
          d.className = "verdict err";
          d.textContent = r.msg;
          box.appendChild(d);
        }
      };
    });
  }

  /* 要点里的 `代码` 与 **加粗** 轻量渲染 */
  function mdInline(s) {
    return E(s)
      .replace(/`([^`]+)`/g, "<code class='inline'>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  }

  window.SXViewCourse = { render };
})();
