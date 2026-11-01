/* 嵩山一号 · 工作站 —— 看视频（视频课入口）
   数据在 data/videos.js；标题/时长/播放量取自 B 站官方接口。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  /* 本地 R 课（123 网盘）区块样式，首次渲染时注入一次 */
  const LOC_CSS = ".loc-note{margin:10px 0 14px;opacity:.85;line-height:1.7}.loc-list{margin:14px 0 0;display:flex;flex-direction:column;gap:8px}.loc-cls{border:1px solid rgba(128,128,128,.35);border-radius:8px;padding:8px 12px;background:rgba(128,128,128,.04)}.loc-cls>summary{cursor:pointer;display:flex;align-items:center;gap:12px;list-style:none;padding:2px 0}.loc-cls>summary::-webkit-details-marker{display:none}.loc-cls-n{font-weight:600}.loc-meta{font-size:.85em;opacity:.6}.loc-files{margin-top:8px;display:flex;flex-direction:column;gap:4px}.loc-file{display:flex;justify-content:space-between;gap:16px;font-size:.9em;border-top:1px dashed rgba(128,128,128,.3);padding:4px 0}.lf-s{opacity:.6;white-space:nowrap;font-variant-numeric:tabular-nums}";
  function injectCss() {
    if (document.getElementById("sx-loc-css")) return;
    var s = document.createElement("style");
    s.id = "sx-loc-css";
    s.textContent = LOC_CSS;
    document.head.appendChild(s);
  }

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

  function render(root) {
    const V = window.SX_VIDEOS;
    if (!V) { root.innerHTML = '<div class="card">视频清单没加载。</div>'; return; }

    let html = '<div class="hero">' +
      '<div class="hero-k">卡住了就看视频 · 别硬啃文字</div>' +
      "<h2>看视频</h2>" +
      '<p class="hero-sub">' + E(V.intro) + "</p></div>";

    /* 四步路径 */
    if (V.path && V.path.length) {
      html += '<div class="path">' + V.path.map(p =>
        '<a class="path-i" data-bv="' + E(p.bv) + '">' +
        '<span class="path-s">' + E(p.step) + "</span>" +
        "<b>" + E(p.t) + "</b>" +
        '<span class="path-d">' + E(p.d) + "</span></a>").join("") + "</div>";
    }

    /* 视频列表 */
    html += '<div class="vlist">';
    V.items.forEach((v, i) => {
      html += '<div class="vrow" id="v-' + E(v.bv) + '">' +
        '<div class="vno">' + String(i + 1).padStart(2, "0") + "</div>" +
        '<div class="vbody">' +
        '<div class="vtitle"><a href="' + av(v.bv) + '" target="_blank" rel="noopener">' + E(v.n) + " &#8599;</a>" +
        (v.tier ? '<span class="vtier">' + E(v.tier) + "</span>" : "") + "</div>" +
        '<div class="vmeta">' + E(v.up) + " · " + mins(v.mins) + " · " + plays(v.plays) + "</div>" +
        '<div class="vwhy">' + E(v.why) + "</div>" +
        '<a class="vurl" href="' + av(v.bv) + '" target="_blank" rel="noopener">bilibili.com/video/' + E(v.bv) + "</a>" +
        "</div>" +
        '<div class="vact"><a class="btn sm" href="' + av(v.bv) + '" target="_blank" rel="noopener">去 B 站看</a>' +
        '<span class="vwatch">' + E(v.watch || "") + "</span></div>" +
        "</div>";
    });
    html += "</div>";

    /* 本地 R 课（123 网盘托管） */
    if (V.local && V.local.classes && V.local.classes.length) {
      injectCss();
      const L = V.local;
      html += '<div class="sec-h">' + E(L.title) + "</div>";
      html += '<p class="loc-note">' + E(L.note) + "</p>";
      html += '<a class="btn" href="' + E(L.share) + '" target="_blank" rel="noopener">去 123 网盘看全部（免登录）' + (L.code ? " · 提取码 " + E(L.code) : "") + " &#8599;</a>";
      html += '<div class="loc-list">';
      L.classes.forEach(function (c) {
        const total = c.files.reduce(function (s, f) { return s + f.mb; }, 0);
        const sizeStr = total >= 1024 ? (total / 1024).toFixed(2) + " GB" : total.toFixed(1) + " MB";
        html += '<details class="loc-cls"><summary><span class="loc-cls-n">第 ' + c.cls + " 课</span>" +
          '<span class="loc-meta">' + c.files.length + " 集 · " + sizeStr + "</span></summary>";
        html += '<div class="loc-files">';
        c.files.forEach(function (f) {
          const fs = f.mb >= 1024 ? (f.mb / 1024).toFixed(2) + " GB" : f.mb.toFixed(1) + " MB";
          html += '<div class="loc-file"><span class="lf-n">' + E(f.n) + '</span><span class="lf-s">' + fs + "</span></div>";
        });
        html += "</div></details>";
      });
      html += "</div>";
    }

    /* 文字版 */
    if (V.reads && V.reads.length) {
      html += '<div class="sec-h">不爱看视频的话，这几份文字教程更好</div><div class="reads">' +
        V.reads.map(r => '<a class="read" href="' + E(r.u) + '" target="_blank" rel="noopener">' +
          "<b>" + E(r.n) + " &#8599;</b><span>" + E(r.d) + "</span></a>").join("") + "</div>";
    }

    html += '<div class="hero-tip" style="margin-top:22px">看不下去很正常——' +
      "视频只用来「先知道有这回事」。真正的理解发生在你自己敲错、报错、改对的那几分钟里。" +
      "看完一段就去 <a href='#/course'>课程</a> 跑一遍对应代码，或者去 <a href='#/dojo'>道场</a> 做一关。</div>";

    root.innerHTML = html;

    root.querySelectorAll("[data-bv]").forEach(el => {
      el.onclick = () => {
        const t = document.getElementById("v-" + el.getAttribute("data-bv"));
        if (!t) return;
        t.scrollIntoView({ behavior: "smooth", block: "center" });
        t.classList.add("flash");
        setTimeout(() => t.classList.remove("flash"), 1400);
      };
    });
  }

  window.SXViewVideo = { render };
})();
