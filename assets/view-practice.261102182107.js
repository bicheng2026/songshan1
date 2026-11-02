/* 嵩山一号 · 工作站 —— 练习台：一边看视频一边敲代码
   左：B 站视频站内播放（iframe，可切换）；右：代码编辑器（默认 WebR，可切本机 R）
   含「下载 RStudio」入口与「本机 R 桥接脚本」下载（让别人也能用自己本机的完整 R） */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  // 本机 R 桥接脚本（内嵌）：用户下载后本机运行，网页即可用他自己的完整 R 跑代码
  const BRIDGE_R =
'# 嵩山一号 · 工作站 —— 本机 R 桥接\n' +
'# 让别人（或你自己）用电脑上的完整 R 环境来跑练习台右边的代码（能装包、读本地文件）\n' +
'# 用法（任选其一）：\n' +
'#   1) 双击本文件（用 Rscript 运行）\n' +
'#   2) 在 R / RStudio 里执行：  source("嵩山一号-本机R桥接.R")\n' +
'# 然后回到工作站练习台，点「连接本机 R」。\n' +
'if (!requireNamespace("httpuv", quietly = TRUE)) install.packages("httpuv")\n' +
'if (!requireNamespace("jsonlite", quietly = TRUE)) install.packages("jsonlite")\n' +
'library(httpuv); library(jsonlite)\n' +
'\n' +
'PORT <- 19810\n' +
'CORS <- list(\n' +
'  "Access-Control-Allow-Origin" = "*",\n' +
'  "Access-Control-Allow-Methods" = "GET,POST,OPTIONS",\n' +
'  "Access-Control-Allow-Headers" = "Content-Type"\n' +
')\n' +
'\n' +
'app <- list(\n' +
'  call = function(req) {\n' +
'    if (req$REQUEST_METHOD == "OPTIONS")\n' +
'      return(list(status = 200, headers = CORS, body = ""))\n' +
'    if (req$PATH_INFO == "/ping")\n' +
'      return(list(status = 200, headers = CORS, body = toJSON(list(ok = TRUE), auto_unbox = TRUE)))\n' +
'    if (req$PATH_INFO == "/run" && req$REQUEST_METHOD == "POST") {\n' +
'      body <- rawToChar(req$rook.input$read())\n' +
'      code <- tryCatch(fromJSON(body)$code, error = function(e) "")\n' +
'      result <- tryCatch({\n' +
'        out <- capture.output(eval(parse(text = code), envir = .GlobalEnv))\n' +
'        list(output = paste(out, collapse = "\\n"), error = "")\n' +
'      }, error = function(e) list(output = "", error = paste("错误:", e$message)))\n' +
'      return(list(status = 200, headers = CORS,\n' +
'                  body = toJSON(result, auto_unbox = TRUE)))\n' +
'    }\n' +
'    list(status = 404, headers = CORS, body = "not found")\n' +
'  }\n' +
')\n' +
'\n' +
'cat("本地 R 桥接已启动： http://127.0.0.1:", PORT, "\\n", sep = "")\n' +
'cat("回到工作站练习台，点「连接本机 R」即可使用。按 Ctrl+C 停止。\\n")\n' +
'runApp(app, port = PORT)\n';

  let backend = "webr"; // webr | local
  let localReady = false;

  function allVideos() {
    const V = window.SX_VIDEOS || { path: [], items: [] };
    const seen = {};
    const list = [];
    (V.path || []).forEach(p => { if (!seen[p.bv]) { seen[p.bv] = 1; list.push(p); } });
    (V.items || []).forEach(v => { if (!seen[v.bv]) { seen[v.bv] = 1; list.push(v); } });
    return list;
  }
  function playerUrl(bv) {
    return "https://player.bilibili.com/player.html?bvid=" + bv +
      "&page=1&high_quality=1&danmaku=0&autoplay=0";
  }

  function render(root) {
    const list = allVideos();
    const first = (list[0] || {}).bv || "BV1cs411j75B";
    let vTabs = list.map((v, i) =>
      '<button class="pv-tab' + (i === 0 ? " on" : "") + '" data-bv="' + E(v.bv) + '">' +
      (i + 1) + ". " + E(v.n || v.t || v.bv) + "</button>").join("");

    root.innerHTML =
      '<div class="page-head"><h2>练习台 · 一边看视频一边敲代码</h2>' +
      '<p class="hero-sub">左边放教学视频，右边写 R 代码并直接运行。默认用浏览器内的 R（WebR，打开即用）；' +
      '想用你本机完整 R（能装包、读本地文件），点右上「连接本机 R」。</p></div>' +
      '<div class="practice-bar" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center">' +
      '<div class="pv-tabs" style="display:flex;flex-wrap:wrap;gap:6px">' + vTabs + '</div>' +
      '<div class="practice-tools" style="display:flex;gap:8px;align-items:center">' +
      '<button class="btn sm" id="btnLocal">连接本机 R</button>' +
      '<button class="btn sm ghost" id="btnRstudio">下载 RStudio</button>' +
      '<span class="tiny muted" id="beStat"></span>' +
      '</div></div>' +
      '<div class="practice-split" style="display:flex;gap:14px;align-items:stretch;margin-top:10px">' +
      '<div class="pv-left" style="flex:0 0 44%">' +
      '<iframe id="pvFrame" style="width:100%;height:min(62vh,520px);border:1px solid var(--line,#2a2f3a);border-radius:8px;background:#000" ' +
      'src="' + playerUrl(first) + '" allowfullscreen="true" scrolling="no" frameborder="0"></iframe>' +
      '</div>' +
      '<div class="pv-right" style="flex:1;display:flex;flex-direction:column;min-width:0">' +
      '<div class="editor-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>写代码</b>' +
      '<div class="toolbar"><button class="btn primary sm" id="btnRun">运行 (Ctrl+Enter)</button>' +
      '<button class="btn ghost sm" id="btnClear">清空输出</button></div></div>' +
      '<textarea class="ed" id="pvCode" spellcheck="false" style="flex:1;min-height:240px;font-family:monospace" ' +
      'placeholder="在这里写 R 代码，Ctrl+Enter 运行。">' +
      E("# 先跑一遍感受一下\nx <- 1:10\nmean(x)\nsum(x^2)\n") + '</textarea>' +
      '<div class="out" id="pvOut" style="height:200px;overflow:auto;margin-top:8px">（运行后，R 的真实输出显示在这里）</div>' +
      '</div></div>' +
      '<div class="card" id="rstudioCard" style="margin-top:16px;display:none">' +
      '<div class="lv-title"><h3>下载并安装 R + RStudio（用你本机完整 R）</h3>' +
      '<span class="tag n">同学/别人都能照做</span></div>' +
      '<div class="small muted" style="margin:8px 0">网页默认用浏览器内精简 R（WebR）。想要完整功能（装任意包、读本地数据、跑重分析），' +
      '在你自己电脑上装 R + RStudio，再用下面的桥接脚本把本机 R 接进这个页面。</div>' +
      '<div class="grid g2" style="margin:10px 0">' +
      '<a class="read" href="https://cran.r-project.org/" target="_blank" rel="noopener"><b>R 语言（必装）&#8599;</b><span>选系统，一路下一步</span></a>' +
      '<a class="read" href="https://posit.co/download/rstudio-desktop/" target="_blank" rel="noopener"><b>RStudio Desktop（编辑器）&#8599;</b><span>装完 R 再装它</span></a>' +
      '</div>' +
      '<div class="note">步骤：① 装 R + RStudio（约 5 分钟）；② 点下方「下载桥接脚本」，本机双击用 Rscript 运行（或 R 里 source）；' +
      '③ 回本页点「连接本机 R」。之后右边代码就跑在你自己的 R 上。</div>' +
      '<div class="toolbar" style="margin-top:10px">' +
      '<button class="btn sm" id="btnDlBridge">下载桥接脚本（.R）</button>' +
      '<button class="btn sm ghost" id="btnCopyBridge">复制桥接脚本</button>' +
      '<a class="btn sm ghost" href="https://rstudio.com/products/rstudio/download/#download" target="_blank" rel="noopener">官方安装指引</a>' +
      '</div></div>';

    const frame = document.getElementById("pvFrame");
    root.querySelectorAll(".pv-tab").forEach(b => {
      b.onclick = () => {
        root.querySelectorAll(".pv-tab").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
        frame.src = playerUrl(b.getAttribute("data-bv"));
      };
    });

    const ed = document.getElementById("pvCode");
    const out = document.getElementById("pvOut");
    const runBtn = document.getElementById("btnRun");
    ed.onkeydown = e => { if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); doRun(); } };
    runBtn.onclick = doRun;
    document.getElementById("btnClear").onclick = () => { out.innerHTML = "（已清空）"; };

    function append(text, cls) {
      const pre = document.createElement("pre");
      pre.className = "out-raw" + (cls ? " " + cls : "");
      pre.textContent = text;
      out.appendChild(pre);
      out.scrollTop = out.scrollHeight;
    }

    async function doRun() {
      runBtn.disabled = true; runBtn.textContent = "运行中…";
      out.innerHTML = "";
      const code = ed.value;
      try {
        if (backend === "local" && localReady) {
          const r = await fetch("http://127.0.0.1:19810/run", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
          });
          const j = await r.json();
          if (j.output && j.output.trim()) append(j.output);
          else append("（这段代码没有打印输出）");
          if (j.error) append(j.error, "verdict err");
        } else {
          const res = await window.SXR.run(code, [], "", () => {});
          if (res.out && res.out.trim()) append(res.out);
          else append("（这段代码没有打印输出）");
          if (res.msg) append(res.msg, "verdict err");
        }
      } catch (e) {
        append("运行出错：" + (e && e.message || e), "verdict err");
      }
      runBtn.disabled = false; runBtn.textContent = "运行 (Ctrl+Enter)";
    }

    const btnLocal = document.getElementById("btnLocal");
    const beStat = document.getElementById("beStat");
    btnLocal.onclick = async () => {
      if (backend === "local" && localReady) {
        backend = "webr"; localReady = false;
        btnLocal.textContent = "连接本机 R";
        beStat.textContent = "已切回浏览器内 R";
        return;
      }
      beStat.textContent = "正在连接本机 R（127.0.0.1:19810）…";
      try {
        const r = await fetch("http://127.0.0.1:19810/ping", { method: "POST" });
        const j = await r.json();
        if (j && j.ok) {
          backend = "local"; localReady = true;
          btnLocal.textContent = "已连本机 R（点此切回）";
          beStat.textContent = "✓ 已用你本机的 R";
        } else throw new Error("bad");
      } catch (e) {
        beStat.innerHTML = '<span style="color:var(--accent,#e85)">连不上：请先在本机运行桥接脚本（见「下载 RStudio」里的步骤）</span>';
      }
    };

    const btnRs = document.getElementById("btnRstudio");
    const card = document.getElementById("rstudioCard");
    btnRs.onclick = () => { card.style.display = card.style.display === "none" ? "block" : "none"; };
    document.getElementById("btnDlBridge").onclick = () => {
      SX.download("嵩山一号-本机R桥接.R", BRIDGE_R, "text/plain");
    };
    document.getElementById("btnCopyBridge").onclick = () => {
      if (SX.copy(BRIDGE_R)) SX.toast("已复制桥接脚本，粘到 R 里 source 或直接存成 .R 运行");
    };
  }

  window.SXViewPractice = { render };
})();
