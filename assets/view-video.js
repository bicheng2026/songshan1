/* 嵩山一号 · 工作站 —— 看视频（视频课入口）
   数据在 data/videos.261102194846.js；标题/时长/播放量取自 B 站官方接口。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

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

    let html = '<div class="hero hero-sm">' +
      '<div class="hero-k">卡住了就看视频 · 别硬啃文字</div>' +
      "<h2>看视频</h2>" +
      '<p class="hero-sub">' + E(String(V.intro || "").split("。")[0]) + "</p></div>";

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

    /* 文字版 */
    if (V.reads && V.reads.length) {
      html += '<div class="sec-h">不爱看视频的话，这几份文字教程更好</div><div class="reads">' +
        V.reads.map(r => '<a class="read" href="' + E(r.u) + '" target="_blank" rel="noopener">' +
          "<b>" + E(r.n) + " &#8599;</b><span>" + E(r.d) + "</span></a>").join("") + "</div>";
    }

    html += '<div class="hero-tip" style="margin-top:22px">看不下去很正常——' +
      "视频只看个大概，理解发生在你自己敲错改对的时候。" +
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
