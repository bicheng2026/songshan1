/* 嵩山一号 · 工作站 —— 阅读设置（字号 / 间距）
   两轴：字号 5 档（--fs）、间距 4 档（--sp 留白 + --lh 行高）。
   写进 localStorage，刷新与下次打开都记得；head 里的内联脚本负责首屏先应用，避免闪一下。 */
(function () {
  "use strict";

  var FS = [
    { name: "小", v: 0.90 },
    { name: "标准", v: 1.00 },
    { name: "大", v: 1.09 },
    { name: "特大", v: 1.18 },
    { name: "超大", v: 1.28 }
  ];
  var SP = [
    { name: "紧", sp: 0.92, lh: 1.66 },
    { name: "标准", sp: 1.06, lh: 1.80 },
    { name: "宽松", sp: 1.18, lh: 1.95 },
    { name: "特宽", sp: 1.32, lh: 2.10 }
  ];
  var K_FS = "sx_fs", K_SP = "sx_sp";

  var root = document.documentElement;
  var fi = intOf(root.getAttribute("data-fs"), 1, FS.length - 1);
  var si = intOf(root.getAttribute("data-sp"), 2, SP.length - 1);

  function intOf(v, d, max) {
    var n = parseInt(v, 10);
    if (isNaN(n) || n < 0 || n > max) return d;
    return n;
  }

  function apply(save) {
    var f = FS[fi], s = SP[si];
    root.style.setProperty("--fs", f.v);
    root.style.setProperty("--sp", s.sp);
    root.style.setProperty("--lh", s.lh);
    root.setAttribute("data-fs", fi);
    root.setAttribute("data-sp", si);
    if (save !== false) {
      try {
        localStorage.setItem(K_FS, fi);
        localStorage.setItem(K_SP, si);
      } catch (e) { }
    }
    paint();
  }

  /* ---------- 面板 ---------- */
  var pop = null, btn = null;

  function build() {
    btn = document.getElementById("readBtn");
    pop = document.createElement("div");
    pop.className = "readpop";
    pop.id = "readPop";
    pop.innerHTML =
      '<div class="rp-row"><span class="rp-k">字号</span>' +
      '<span class="rp-ctl"><button type="button" class="rp-step" data-fs="-1" aria-label="调小字号">A−</button>' +
      '<span class="rp-val" id="rpVal"></span>' +
      '<button type="button" class="rp-step" data-fs="1" aria-label="调大字号">A+</button></span></div>' +
      '<div class="rp-row"><span class="rp-k">间距</span>' +
      '<span class="rp-seg" id="rpSeg"></span></div>' +
      '<div class="rp-tip">Ctrl + = 调大 · Ctrl + − 调小 · Ctrl + 0 复位</div>' +
      '<div class="rp-tip"><a href="javascript:void 0" id="rpReset">恢复默认（标准字号 / 宽松间距）</a></div>';

    document.body.appendChild(pop);

    pop.addEventListener("click", function (e) {
      var st = e.target.closest("[data-fs]");
      if (st) {
        fi = Math.max(0, Math.min(FS.length - 1, fi + Number(st.getAttribute("data-fs"))));
        apply();
        return;
      }
      var sp = e.target.closest("[data-sp]");
      if (sp) {
        si = Number(sp.getAttribute("data-sp"));
        apply();
        return;
      }
      if (e.target.id === "rpReset") {
        fi = 1; si = 2; apply();
      }
    });

    if (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        pop.classList.toggle("open");
      };
      btn.setAttribute("aria-expanded", "false");
    }
    document.addEventListener("click", function (e) {
      if (!pop.classList.contains("open")) return;
      if (pop.contains(e.target) || (btn && btn.contains(e.target))) return;
      pop.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") pop.classList.remove("open");
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "=" || e.key === "+") { e.preventDefault(); fi = Math.min(FS.length - 1, fi + 1); apply(); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); fi = Math.max(0, fi - 1); apply(); }
      else if (e.key === "0") { e.preventDefault(); fi = 1; si = 2; apply(); }
    });
  }

  function paint() {
    if (!pop) return;
    var v = document.getElementById("rpVal");
    if (v) v.textContent = FS[fi].name + " · " + FS[fi].v.toFixed(2) + "×";
    var seg = document.getElementById("rpSeg");
    if (seg) {
      seg.innerHTML = SP.map(function (s, i) {
        return '<button type="button" class="rp-b' + (i === si ? " on" : "") + '" data-sp="' + i + '">' + s.name + "</button>";
      }).join("");
    }
    if (btn) btn.setAttribute("aria-expanded", pop.classList.contains("open") ? "true" : "false");
  }

  function boot() {
    build();
    apply(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.SXRead = { get fs() { return fi; }, get sp() { return si; }, apply: apply };
})();
