/* 嵩山一号 · 工作站 —— 通用课程（8 章 26 节，全部可跑） */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  function render(root) {
    const C = window.SX_COURSE;
    if (!C) { root.innerHTML = '<div class="card">课程数据没加载。</div>'; return; }

    const total = C.chapters.reduce((a, c) => a + c.subs.length, 0);

    let side = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      "<b>目录</b><span class='tiny muted'>" + C.chapters.length + " 章 / " + total + " 节</span></div>";
    C.chapters.forEach((ch, ci) => {
      side += '<div class="tk">' + E(ch.title) + "</div>";
      ch.subs.forEach((s, si) => {
        side += '<div class="lvrow" data-go="c' + ci + "-" + si + '"><span>&#9675;</span><span>' +
          E(s.t.replace(/^\d+\.\d+\s*/, "")) + "</span></div>";
      });
    });

    let main = '<div class="card"><b>这门课怎么用</b><div class="small" style="margin-top:8px">' +
      E(C.intro) + "</div>" +
      '<div class="note" style="margin-top:10px">每节代码只用 R 自带数据集（mtcars / iris）或当场自造的小数据，' +
      "所以任何一台机器、任何一个 R 都能跑通。看懂一节，就去「代码道场」找同主题的关卡动手写一遍——" +
      "**看懂 ≠ 会写**，这一步不能省。</div></div>";

    C.chapters.forEach((ch, ci) => {
      main += '<div class="card" style="margin-top:16px"><h3 class="lv-title" style="margin:0 0 4px">' +
        E(ch.title) + "</h3>";
      ch.subs.forEach((s, si) => {
        const id = "c" + ci + "-" + si;
        main += '<div id="' + id + '" style="margin-top:18px;padding-top:12px;border-top:1px solid var(--line)">' +
          "<b>" + E(s.t) + "</b>" +
          '<div class="note" style="margin-top:8px">' + E(s.why) + "</div>" +
          '<div class="margin-s"><b>要点</b><ol class="crit">' +
          s.pts.map(p => "<li>" + mdInline(p) + "</li>").join("") + "</ol></div>" +
          "<pre class='code'>" + E(s.code) + "</pre>" +
          '<button class="btn sm" data-run="' + id + '">在 R 里跑这一节的代码</button>' +
          '<div class="out" id="out-' + id + '" hidden></div>' +
          "</div>";
      });
      main += "</div>";
    });

    root.innerHTML =
      '<div class="page-head"><h2>通用课程</h2>' +
      "<p>从「1+1 怎么写」到「怎么把结果整理成能投的表格」，8 章 " + total +
      " 节。不依赖本课题数据，只用 R 自带数据集和当场自造的小例子——换任何机器都能跑。</p></div>" +
      '<div class="layout-2"><aside class="side card">' + side + "</aside><section>" + main + "</section></div>";

    // 目录点击跳转
    root.querySelectorAll("[data-go]").forEach(el => {
      el.onclick = () => {
        const t = document.getElementById(el.getAttribute("data-go"));
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });

    // 逐节运行
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
