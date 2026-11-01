/* 嵩山一号 · 工作站 —— 阅读设置（字号 / 行距 / 留白 / 宽度）
   四根滑杆连续可调，比档位按钮好使；四个预设一键切到常见手感。
   存在 localStorage（百分数 / 像素），刷新与下次打开都记得；head 内联脚本负责首屏先套用。 */
(function () {
  "use strict";

  var LIM = {
    fs: { min: 85, max: 150, def: 100 },
    lh: { min: 150, max: 240, def: 205 },
    sp: { min: 80, max: 200, def: 140 },
    /* 宽度到顶就是铺满，中间值是内容区最大宽度（px） */
    w: { min: 960, max: 2400, def: 1440 }
  };
  var PRESETS = [
    { name: "紧凑", fs: 100, lh: 175, sp: 100, w: 1200 },
    { name: "标准", fs: 100, lh: 195, sp: 120, w: 1440 },
    { name: "宽松", fs: 100, lh: 205, sp: 140, w: 1640 },
    { name: "极宽", fs: 108, lh: 220, sp: 175, w: 2400 }
  ];
  var K = { fs: "sx_fs", lh: "sx_lh", sp: "sx_sp", w: "sx_w" };
  var KEYS = ["fs", "lh", "sp", "w"];

  var root = document.documentElement;
  var st = {
    fs: read("fs", root.getAttribute("data-fs")),
    lh: read("lh", root.getAttribute("data-lh")),
    sp: read("sp", root.getAttribute("data-sp")),
    w: read("w", root.getAttribute("data-w"))
  };

  function read(k, attr) {
    var v = parseInt(attr, 10);
    if (!isNaN(v) && v >= LIM[k].min && v <= LIM[k].max) return v;
    return LIM[k].def;
  }
  function clamp(k, v) {
    v = Math.round(Number(v) || 0);
    return Math.max(LIM[k].min, Math.min(LIM[k].max, v));
  }
  function apply(save) {
    root.style.setProperty("--fs", st.fs / 100);
    root.style.setProperty("--lh", st.lh / 100);
    root.style.setProperty("--sp", st.sp / 100);
    root.style.setProperty("--page-w", st.w >= LIM.w.max ? "none" : st.w + "px");
    root.setAttribute("data-fs", st.fs);
    root.setAttribute("data-lh", st.lh);
    root.setAttribute("data-sp", st.sp);
    root.setAttribute("data-w", st.w);
    if (save !== false) {
      KEYS.forEach(function (k) {
        try { localStorage.setItem(K[k], st[k]); } catch (e) { }
      });
    }
    paint();
  }

  /* ---------------- 面板 ---------------- */
  var pop = null, btn = null;

  function fmtFs(v) { return v + "%"; }
  function fmtLh(v) { return (v / 100).toFixed(2); }
  function fmtSp(v) { return "×" + (v / 100).toFixed(2); }
  function fmtW(v) { return v >= LIM.w.max ? "铺满" : v + "px"; }

  function row(k, label) {
    var fmt = { fs: fmtFs, lh: fmtLh, sp: fmtSp, w: fmtW }[k];
    var step = k === "w" ? 20 : 1;
    return '<div class="rp-row"><span class="rp-k">' + label + '</span>' +
      '<input class="rp-r" type="range" id="rp_' + k + '" min="' + LIM[k].min +
      '" max="' + LIM[k].max + '" step="' + step + '" value="' + st[k] + '" aria-label="' + label + '">' +
      '<span class="rp-v" id="rpv_' + k + '">' + fmt(st[k]) + '</span></div>';
  }

  function build() {
    btn = document.getElementById("readBtn");
    pop = document.createElement("div");
    pop.className = "readpop";
    pop.id = "readPop";
    pop.innerHTML =
      '<div class="rp-head"><b>阅读设置</b><a href="javascript:void 0" id="rpReset">恢复默认</a></div>' +
      row("fs", "字号") +
      row("lh", "行距") +
      row("sp", "留白") +
      row("w", "宽度") +
      '<div class="rp-presets" id="rpPre"></div>' +
      '<div class="rp-tip">拖到顺手为止，当场生效。宽度拉到最右是铺满屏。Ctrl + = / − 调字号，Ctrl + 0 复位。</div>';

    document.body.appendChild(pop);

    KEYS.forEach(function (k) {
      var el = document.getElementById("rp_" + k);
      if (el) el.addEventListener("input", function () {
        st[k] = clamp(k, el.value);
        apply();
      });
    });

    pop.addEventListener("click", function (e) {
      var p = e.target.closest("[data-pre]");
      if (p) {
        var pre = PRESETS[Number(p.getAttribute("data-pre"))];
        st.fs = pre.fs; st.lh = pre.lh; st.sp = pre.sp; st.w = pre.w;
        apply();
        return;
      }
      if (e.target.id === "rpReset") {
        st.fs = LIM.fs.def; st.lh = LIM.lh.def; st.sp = LIM.sp.def; st.w = LIM.w.def;
        apply();
      }
    });

    if (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var on = pop.classList.toggle("open");
        btn.classList.toggle("on", on);
        btn.setAttribute("aria-expanded", on ? "true" : "false");
      };
    }
    document.addEventListener("click", function (e) {
      if (!pop.classList.contains("open")) return;
      if (pop.contains(e.target) || (btn && btn.contains(e.target))) return;
      close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); return; }
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "=" || e.key === "+") { e.preventDefault(); st.fs = clamp("fs", st.fs + 4); apply(); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); st.fs = clamp("fs", st.fs - 4); apply(); }
      else if (e.key === "0") {
        e.preventDefault();
        st.fs = LIM.fs.def; st.lh = LIM.lh.def; st.sp = LIM.sp.def; st.w = LIM.w.def;
        apply();
      }
    });
  }

  function close() {
    if (!pop) return;
    pop.classList.remove("open");
    if (btn) { btn.classList.remove("on"); btn.setAttribute("aria-expanded", "false"); }
  }

  function paint() {
    if (!pop) return;
    var fmt = { fs: fmtFs, lh: fmtLh, sp: fmtSp, w: fmtW };
    KEYS.forEach(function (k) {
      var el = document.getElementById("rp_" + k);
      if (el && String(el.value) !== String(st[k])) el.value = st[k];
      var v = document.getElementById("rpv_" + k);
      if (v) v.textContent = fmt[k](st[k]);
    });
    var pre = document.getElementById("rpPre");
    if (pre) {
      pre.innerHTML = PRESETS.map(function (p, i) {
        var on = (p.fs === st.fs && p.lh === st.lh && p.sp === st.sp && p.w === st.w) ? " on" : "";
        return '<button type="button" class="rp-p' + on + '" data-pre="' + i + '">' + p.name + "</button>";
      }).join("");
    }
  }

  function boot() {
    build();
    apply(false);
    /* 第一次进站自动把面板摊开一次：不摊开，没人知道这几根滑杆在哪。
       手机上不自动摊——面板会盖住整个首屏。 */
    var first = false;
    try { first = !localStorage.getItem("sx_seen"); } catch (e) { }
    if (first && btn && pop && window.innerWidth > 760) {
      pop.classList.add("open");
      btn.classList.add("on");
      btn.setAttribute("aria-expanded", "true");
      try { localStorage.setItem("sx_seen", "1"); } catch (e) { }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.SXRead = { state: st, apply: apply, presets: PRESETS };
})();
