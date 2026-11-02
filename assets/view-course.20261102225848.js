/* 嵩山一号 · 工作站 —— 通用课程（已合并「看视频」：视频清单按学习顺序排在课程顶部）
   第 0 讲从「1+1 怎么写」开始；每节默认折叠，点开才展开。
   每节两段代码：base R 能在本页直接跑（讲原理）；标了包名的「真实写法」讲实战。
   视频数据在 data/videos.261102210229.js；标题/时长/播放量取自 B 站官方接口。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  /* ---------- 视频块（原 view-video，现已并入本页顶部） ---------- */
  function av(bv) { return "https://www.bilibili.com/video/" + bv; }
  function mins(m) {
    if (!m) return "";
    if (m < 60) return m + " 分钟";
    const h = Math.floor(m / 60), r = m % 60;
    return h + " 小时" + (r ? " " + r + " 分" : "");
  }
  function plays(n) {
    if (!n) return "";
    return n >= 10000 ? (n / 10000).toFixed(1) + " 万播放" : n + " 播放";
  }
  function videoBlock() {
    const V = window.SX_VIDEOS;
    if (!V) return "";
    let h = '<div class="sec-h">配套视频 · 卡住了先看视频，别硬啃文字（按学习顺序排好）</div>';
    if (V.path && V.path.length) {
      h += '<div class="path">' + V.path.map(p =>
        '<a class="path-i" data-bv="' + E(p.bv) + '">' +
        '<span class="path-s">' + E(p.step) + "</span>" +
        "<b>" + E(p.t) + "</b>" +
        '<span class="path-d">' + E(p.d) + "</span></a>").join("") + "</div>";
    }
    h += '<div class="vlist">';
    (V.items || []).forEach((v, i) => {
      h += '<div class="vrow" id="v-' + E(v.bv) + '">' +
        '<div class="vno">' + String(i + 1).padStart(2, "0") + "</div>" +
        '<div class="vbody">' +
        '<div class="vtitle"><a href="' + av(v.bv) + '" target="_blank" rel="noopener">' + E(v.n) + " &#8599;</a>" +
        (v.tier ? '<span class="vtier">' + E(v.tier) + "</span>" : "") + "</div>" +
        '<div class="vmeta">' + E(v.up) + " · " + mins(v.mins) + " · " + plays(v.plays) + "</div>" +
        '<div class="vwhy">' + E(v.why) + "</div>" +
        '<a class="vurl" href="' + av(v.bv) + '" target="_blank" rel="noopener">bilibili.com/video/' + E(v.bv) + "</a>" +
        "</div>" +
        '<div class="vact"><a class="btn sm" href="' + av(v.bv) + '" target="_blank" rel="noopener">去 B 站看</a>' +
        '<button class="btn sm ghost pv-play" data-pv="' + E(v.bv) + '">放进练习台边看边练</button>' +
        '<span class="vwatch">' + E(v.watch || "") + "</span></div>" +
        "</div>";
    });
    h += "</div>";
    if (V.reads && V.reads.length) {
      h += '<div class="sec-h">不爱看视频的话，这几份文字教程更好</div><div class="reads">' +
        V.reads.map(r => '<a class="read" href="' + E(r.u) + '" target="_blank" rel="noopener">' +
          "<b>" + E(r.n) + " &#8599;</b><span>" + E(r.d) + "</span></a>").join("") + "</div>";
    }
    return h;
  }

  function chapters() {
    const C = window.SX_COURSE || { chapters: [], resources: [] };
    const all = (window.SX_COURSE0 ? [window.SX_COURSE0] : []).concat(C.chapters || []);
    return { list: all, resources: C.resources || [], intro: C.intro || "" };
  }

  function render(root) {
    const { list: CH, resources: RES, intro } = chapters();
    if (!CH.length) { root.innerHTML = '<div class="card">课程数据没加载。</div>'; return; }

    const total = CH.reduce((a, c) => a + c.subs.length, 0);

    /* ---------- 侧栏 ---------- */
    let side = '<div class="sidehead"><b>目录</b><span class="tiny muted">' +
      CH.length + " 讲 / " + total + " 节</span></div>";
    CH.forEach((ch, ci) => {
      side += '<div class="tk">' + E(shortTitle(ch.title)) + "</div>";
      ch.subs.forEach((s, si) => {
        side += '<div class="lvrow" data-go="' + ci + "-" + si + '"><span class="dot-s"></span><span>' +
          E(s.t.replace(/^\d+\.\d+\s*/, "")) + "</span></div>";
      });
    });

    /* ---------- 顶部 ---------- */
    let main = '<div class="hero">' +
      '<div class="hero-k">零基础 · 从第一行代码开始</div>' +
      "<h2>通用课程</h2>" +
      '<p class="hero-sub">' + E(intro.split("。")[0]) + "。</p>" +
      '<div class="hero-acts">' +
      '<a class="btn" href="#/dojo">去代码道场动手</a>' +
      '<a class="btn ghost" href="#/knowledge">查机制词典</a>' +
      "</div>" +
      '<div class="hero-tip">视频已按学习顺序排在页面顶部（先看视频，再往下读文字课）。每节都收起来了，<b>点标题才展开</b>。灰框里的代码能直接点按钮跑；' +
      "带包名的那段是真实写法，本站跑不了，但要写进脚本。</div>" +
      "</div>" +
      videoBlock() +
      '<div class="sec-h" style="margin-top:22px">边看边练 · 一边看视频一边敲代码</div>' +
      '<div id="practiceMount"></div>' +
      '<div class="toolbar" style="margin:14px 0 0">' +
      '<button class="btn sm ghost" id="expandAll">展开全部</button>' +
      '<button class="btn sm ghost" id="collapseAll">收起全部</button></div>';

    /* ---------- 各讲 ---------- */
    CH.forEach((ch, ci) => {
      main += '<section class="lec" id="lec' + ci + '">' +
        '<div class="lec-h"><span class="lec-no">' + pad(ci) + "</span>" +
        '<div class="lec-t"><h3>' + E(ch.title.replace(/^第 \d+ 讲　?/, "")) + "</h3>" +
        (ch.plain ? '<div class="lec-plain">' + E(ch.plain) + "</div>" : "") +
        (ch.goal ? '<div class="lec-goal">学完这讲：' + (Array.isArray(ch.goal) ? '<ul style="margin:6px 0 0 18px;padding:0;list-style:disc">' + ch.goal.map(g => '<li style="margin:2px 0">' + E(g) + "</li>").join("") + "</ul>" : E(ch.goal)) + "</div>" : "") +
        "</div></div>" +
        (ch.watch && ch.watch.length
          ? '<div class="lec-watch">配套看：' + ch.watch.map(w =>
            '<a href="' + E(w.u) + '" target="_blank" rel="noopener">' + E(w.n) + " &#8599;</a>").join("") + "</div>"
          : "") +
        (ch.rec && ch.rec.files && ch.rec.files.length
          ? '<div class="lec-watch">本课录播（小陈·123 网盘托管，免登录）文件名：' +
            ch.rec.files.map(f => '<code>' + E(f) + '</code>').join("、") +
            '；<a href="' + E(ch.rec.u) + '" target="_blank" rel="noopener">打开分享找同名文件 ↗</a></div>'
          : "") +
        (ch.refs && ch.refs.length
          ? '<details class="acc" style="margin:10px 0 2px"><summary>延伸资料（' + ch.refs.length +
            ' 条，官方教程 / 文档 / 数据工具）</summary>' + ch.refs.map(r =>
              '<div class="resi"><a href="' + E(r.u) + '" target="_blank" rel="noopener">' +
              E(r.n) + (r.t === "video" ? " ▶" : "") + " &#8599;</a>" +
              (r.d ? '<div class="resi-d">' + E(r.d) + "</div>" : "") + "</div>").join("") + "</details>"
          : "");

      ch.subs.forEach((s, si) => {
        const id = "c" + ci + "-" + si;
        const open = (ci === 0 && si === 0) ? " open" : "";
        main += '<details class="sec" id="' + id + '"' + open + ">" +
          "<summary>" + E(s.t) + "</summary>" +
          '<div class="sec-b">' +
          '<div class="why">' + E(s.why) + "</div>" +
          (s.vid ? '<div class="lec-watch">' + (s.vid.n ? E(s.vid.n) + "：" : "本节视频：") +
            '<a href="' + E(s.vid.u) + '" target="_blank" rel="noopener">打开小陈录播(123) ▶</a>' +
            (s.vid.files && s.vid.files.length ? '　本节点文件：' + s.vid.files.map(f => '<code>' + E(f) + '</code>').join("、") +
              '（在打开的文件夹里找这些文件名点开即可）' : "") + "</div>" : "") +
          '<div class="pts"><div class="pts-h">要点</div><ol class="crit">' +
          s.pts.map(p => "<li>" + mdInline(p) + "</li>").join("") + "</ol></div>" +
          "<pre class='code'>" + E(s.code) + "</pre>" +
          '<button class="btn sm" data-run="' + id + '">在 R 里跑这一节</button>' +
          (s.real ? '<details class="real"><summary>真实写法（需要 ' + E(s.real.pkg) +
            " 包，本站跑不了）</summary><pre class='code'>" + E(s.real.code) + "</pre></details>" : "") +
          '<div class="out" id="out-' + id + '" hidden></div>' +
          "</div></details>";
      });
      main += "</section>";
    });

    /* ---------- 资源（收起） ---------- */
    if (RES.length) {
      const n = RES.reduce((a, g) => a + g.items.length, 0);
      main += '<details class="acc" style="margin-top:26px"><summary>全部在线课程与文档（' + n +
        " 条，都已逐个打开验证过）</summary>";
      RES.forEach(g => {
        main += '<div class="resg"><div class="resg-h">' + E(g.g) + "</div>" +
          g.items.map(it => '<div class="resi"><a href="' + E(it.u) + '" target="_blank" rel="noopener">' +
            E(it.n) + "</a>" + (it.m ? '<span class="resi-m">' + E(it.m) + "</span>" : "") +
            (it.d ? '<div class="resi-d">' + E(it.d) + "</div>" : "") + "</div>").join("") +
          "</div>";
      });
      main += "</details>";
    }

    root.innerHTML = '<div class="layout-2"><aside class="side card">' + side +
      "</aside><div class='cmain'>" + main + "</div></div>";

    /* ---------- 交互 ---------- */
    root.querySelectorAll("[data-go]").forEach(el => {
      el.onclick = () => {
        const d = document.getElementById("c" + el.getAttribute("data-go"));
        if (!d) return;
        d.open = true;
        d.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
    const ea = root.querySelector("#expandAll"), ca = root.querySelector("#collapseAll");
    if (ea) ea.onclick = () => root.querySelectorAll("details.sec").forEach(d => d.open = true);
    if (ca) ca.onclick = () => root.querySelectorAll("details.sec").forEach(d => d.open = false);

    const flat = {};
    CH.forEach((ch, ci) => ch.subs.forEach((s, si) => { flat["c" + ci + "-" + si] = s.code; }));

    /* 课程包深链：从「学习路径」点「去学习」进来，自动定位并展开对应讲 */
    if (window.__sxFocusCourse) {
      const fid = window.__sxFocusCourse; window.__sxFocusCourse = null;
      const fi = CH.findIndex(ch => ch.id === fid);
      if (fi >= 0) {
        const sec = document.getElementById("lec" + fi);
        if (sec) {
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
          sec.querySelectorAll("details.sec").forEach(d => d.open = true);
        }
      }
    }

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
        pre.textContent = (r.out && r.out.trim()) ? r.out : "（这段代码没有打印输出，只是执行了赋值）";
        box.appendChild(pre);
        if (r.msg) {
          const d = document.createElement("div");
          d.className = "verdict err";
          d.textContent = r.msg;
          box.appendChild(d);
        }
      };
    });

    /* 视频「四步路径」点击定位到对应视频 */
    root.querySelectorAll("[data-bv]").forEach(el => {
      el.onclick = () => {
        const t = document.getElementById("v-" + el.getAttribute("data-bv"));
        if (!t) return;
        t.scrollIntoView({ behavior: "smooth", block: "center" });
        t.classList.add("flash");
        setTimeout(() => t.classList.remove("flash"), 1400);
      };
    });

    /* 练习台：把「边看边练」分屏区挂载进课程页（含连接本机 R / 状态显示） */
    const pm = document.getElementById("practiceMount");
    if (pm && window.SXViewPractice) {
      try { window.SXViewPractice.render(pm, { bare: true }); }
      catch (e) { pm.innerHTML = '<div class="card"><b>练习台加载出错</b><pre class="code">' + E(String(e && e.stack || e)) + "</pre></div>"; }
    }

    /* 视频列表「放进练习台」：把该视频装进练习台左边播放器并滚过去 */
    root.querySelectorAll(".pv-play").forEach(b => {
      b.onclick = () => {
        if (window.SXViewPractice.setVideo) window.SXViewPractice.setVideo(b.getAttribute("data-pv"));
        const m = document.getElementById("practiceMount");
        if (m) m.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    });
  }

  function shortTitle(t) { return t.replace(/^第 (\d+) 讲　?/, "第 $1 讲 · "); }
  function pad(i) { return i < 10 ? "0" + i : "" + i; }
  function mdInline(s) {
    return E(s)
      .replace(/`([^`]+)`/g, "<code class='inline'>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  }

  window.SXViewCourse = { render };
})();
