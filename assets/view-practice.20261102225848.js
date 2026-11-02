/* 嵩山一号 · 工作站 —— 练习台：一边看视频一边敲代码
   左：B 站视频站内播放（iframe，可切换）；右：代码编辑器
   默认用浏览器内 R（WebR，打开即用）；可一键切到「本机 R」（更强大，能装包、读本地文件）
   傻瓜化：提供单文件 .bat 启动器（双击即用，自动找 R），网页三步指引。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  // ===== 本机 R 桥接脚本（R 源码，自动生成）=====
  // 让别人（或你自己）用电脑上的完整 R 跑练习台右边代码
  const BRIDGE_R = [
    "# Songshan Workstation - local R bridge (auto-generated, do not edit)",
    "# Lets the webpage run code on your own full R (install packages, read local files)",
    "options(repos = c(CRAN = \"https://cloud.r-project.org\"))",
    "if (!requireNamespace(\"httpuv\", quietly = TRUE)) install.packages(\"httpuv\")",
    "if (!requireNamespace(\"jsonlite\", quietly = TRUE)) install.packages(\"jsonlite\")",
    "library(httpuv)",
    "library(jsonlite)",
    "PORT <- 19810",
    "CORS <- list(",
    "  \"Access-Control-Allow-Origin\" = \"*\",",
    "  \"Access-Control-Allow-Methods\" = \"GET,POST,OPTIONS\",",
    "  \"Access-Control-Allow-Headers\" = \"Content-Type\",",
    "  \"Access-Control-Allow-Private-Network\" = \"true\"",
    ")",
    "app <- list(",
    "  call = function(req) {",
    "    if (req$REQUEST_METHOD == \"OPTIONS\")",
    "      return(list(status = 200, headers = CORS, body = \"\"))",
    "    if (req$PATH_INFO == \"/ping\")",
    "      return(list(status = 200, headers = CORS,",
    "                  body = toJSON(list(ok = TRUE,",
    "                                     rversion = paste(R.version$major, R.version$minor, sep = \".\"),",
    "                                     rhome = R.home()), auto_unbox = TRUE)))",
    "    if (req$PATH_INFO == \"/run\" && req$REQUEST_METHOD == \"POST\") {",
    "      body <- rawToChar(req$rook.input$read())",
    "      code <- tryCatch(fromJSON(body)$code, error = function(e) \"\")",
    "      result <- tryCatch({",
    "        .sx_e <- parse(text = code)",
    "        out <- capture.output(",
    "          for (.sx_i in seq_along(.sx_e)) {",
    "            .sx_v <- withVisible(eval(.sx_e[[.sx_i]], envir = .GlobalEnv))",
    "            if (.sx_v$visible) print(.sx_v$value)",
    "          })",
    "        list(output = paste(out, collapse = \"\\n\"), error = \"\")",
    "      }, error = function(e) list(output = \"\", error = paste(\"错误:\", e$message)))",
    "      return(list(status = 200, headers = CORS,",
    "                  body = toJSON(result, auto_unbox = TRUE)))",
    "    }",
    "    list(status = 404, headers = CORS, body = \"not found\")",
    "  }",
    ")",
    "cat(\"Local R bridge started: http://127.0.0.1:\", PORT, \"\\n\", sep = \"\")",
    "cat(\"Back on the workstation practice page, click 'Connect' to use it. Press Ctrl+C (or close RStudio session) to stop.\\n\")",
    "runServer(\"127.0.0.1\", PORT, app)"
  ].join("\n");

  // 把 R 源码 base64 编码（UTF-8 安全），塞进 .bat 由本机 PowerShell 解码写出
  function b64(s) { return btoa(unescape(encodeURIComponent(s))); }
  const BRIDGE_B64 = b64(BRIDGE_R);

  // ===== 一键启动器（Windows .bat，自动找 R + 解码写出桥接 + 运行）=====
  const LAUNCH_BAT = "\uFEFF" + [
    "@echo off",
    "chcp 65001 >nul",
    "title Songshan R Launcher",
    "",
    "echo ============================================",
    "echo   嵩山一号 · 本机 R 一键启动器",
    "echo ============================================",
    "echo",
    "echo   这个小程序会：自动找到你电脑上「能用的」R，开一个本地服务，",
    "echo   让网页上的代码跑在你自己的 R 上（能装任意包、读本地文件）。",
    "echo",
    "echo   用法：双击本文件  -  保持黑窗口开着  -  回网页等它自动连上",
    "echo",
    "set \"RHOME=\"",
    "call :findR",
    "if not defined RHOME (",
    "  echo  [没找到能用的 R] 请先安装 R： https://cran.r-project.org/",
    "  echo  装好后再双击本文件即可。",
    "  pause",
    "  exit /b 1",
    ")",
    "echo  找到可用的 R： %RSCRIPT%",
    "echo",
    "echo  正在准备桥接脚本……",
    "powershell -NoProfile -ExecutionPolicy Bypass -Command \"[IO.File]::WriteAllBytes([IO.Path]::Combine($env:TEMP,'sx_bridge.R'), [Convert]::FromBase64String('' + BRIDGE_B64 + ''))\"",
    "\"%SystemRoot%\\System32\\findstr.exe\" /c:\"runServer\" \"%TEMP%\\sx_bridge.R\" >nul 2>nul || echo  [提示] 桥接脚本不是最新版，请重新点「一键连接本机 R」下载新启动器。",
    "echo  正在启动本机 R 桥接服务……",
    "echo  （请保持这个黑窗口开着，关掉网页就断开连接）",
    "echo",
    "\"%RSCRIPT%\" --vanilla \"%TEMP%\\sx_bridge.R\"",
    "echo",
    "echo  桥接已停止（窗口可关闭）。",
    "pause",
    "exit /b 0",
    "",
    ":findR",
    "set \"CAND=\"",
    "for /f \"tokens=2,*\" %%a in ('%SystemRoot%\\System32\\reg.exe query \"HKLM\\Software\\R-core\\R\" /v InstallPath 2^>nul ^| %SystemRoot%\\System32\\find.exe \"InstallPath\"') do set \"CAND=%%b\"",
    "call :test",
    "if defined RHOME goto :eof",
    "for /f \"tokens=2,*\" %%a in ('%SystemRoot%\\System32\\reg.exe query \"HKCU\\Software\\R-core\\R\" /v InstallPath 2^>nul ^| %SystemRoot%\\System32\\find.exe \"InstallPath\"') do set \"CAND=%%b\"",
    "call :test",
    "if defined RHOME goto :eof",
    "set \"CAND=D:\\R461real\"",
    "call :test",
    "if defined RHOME goto :eof",
    "set \"CAND=D:\\R461\"",
    "call :test",
    "if defined RHOME goto :eof",
    "set \"CAND=C:\\Program Files\\R\"",
    "call :test",
    "goto :eof",
    "",
    ":test",
    "if not defined CAND goto :eof",
    "set \"RS=%CAND%\\bin\\Rscript.exe\"",
    "if not exist \"%RS%\" set \"RS=%CAND%\\bin\\x64\\Rscript.exe\"",
    "if not exist \"%RS%\" goto :eof",
    "\"%RS%\" --vanilla -e \"cat('sxok')\" 2>nul | %SystemRoot%\\System32\\find.exe \"sxok\" >nul",
    "if errorlevel 1 goto :eof",
    "set \"RHOME=%CAND%\"",
    "set \"RSCRIPT=%RS%\"",
    "goto :eof"
  ].join("\r\n");

  let backend = "webr"; // webr | local
  let localReady = false;
  let localInfo = null;

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

  // 页面是不是「本地版」（localhost / 127.0.0.1 / file://）。
  // 云端 HTTPS 页也能连本机 R：桥接已回复 Private-Network 预检头（Chrome/Edge 放行）。
  function isLocalPage() {
    const h = location.hostname;
    return location.protocol !== "https:" && (h === "localhost" || h === "127.0.0.1" || h === "" || h === "[::1]");
  }

  function render(root, opts) {
    const list = allVideos();
    const first = (list[0] || {}).bv || "BV1cs411j75B";
    const local = isLocalPage();

    const head = (!opts || !opts.bare)
      ? '<div class="page-head"><h2>练习台 · 一边看视频一边敲代码</h2>' +
        '<p class="hero-sub">左边放教学视频（上方下拉框随便换），右边写 R 代码并直接运行。默认用浏览器内的 R（WebR，打开即用）。' +
        '想要更强大（装任意包、读本地文件），点右上「一键连接本机 R」。</p></div>'
      : '';
    root.innerHTML = head +
      '<div class="practice-bar" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center">' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">' +
      '<label class="tiny muted" for="pvSel" style="white-space:nowrap">左边视频随便换：</label>' +
      '<select id="pvSel" class="btn sm" style="max-width:340px;padding:4px 8px">' +
      list.map((v, i) => '<option value="' + E(v.bv) + '">' + (i + 1) + ". " + E(v.n || v.t || v.bv) + "</option>").join("") +
      '</select></div>' +
      '<div class="practice-tools" style="display:flex;gap:8px;align-items:center">' +
      '<button class="btn primary sm" id="btnLocal">一键连接本机 R</button>' +
      '<button class="btn sm ghost" id="btnRstudio">还没装 R？</button>' +
      '<span class="tiny muted" id="beStat"></span>' +
      '</div></div>' +
      (local ? "" :
      '<div class="note" style="margin-top:10px"><b>用云端页面也能连你自己电脑的 R</b>：点右边「一键连接本机 R」，双击下载的启动器（保持黑窗口开着），网页会自动连上。' +
      '如果个别浏览器拦截，再用工作站文件夹里的「启动工作站.bat」打开本地版连，效果相同。</div>') +
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
      '<div class="lv-title"><h3>怎么装 R + RStudio（第一次用）</h3>' +
      '<span class="tag n">只需装一次</span></div>' +
      '<div class="small muted" style="margin:8px 0">如果你电脑还没装 R，照下面装好，之后用「用我本机 R」就免费用完整功能。</div>' +
      '<div class="grid g2" style="margin:10px 0">' +
      '<a class="read" href="https://cran.r-project.org/" target="_blank" rel="noopener"><b>R 语言（必装）&#8599;</b><span>选系统，一路下一步</span></a>' +
      '<a class="read" href="https://posit.co/download/rstudio-desktop/" target="_blank" rel="noopener"><b>RStudio Desktop（编辑器）&#8599;</b><span>装完 R 再装它</span></a>' +
      '</div>' +
      '<div class="note">装好 R 后，回到本页点「一键连接本机 R」：它会自动下载启动器，你双击那个启动器（保持黑窗口开着），网页会自动连上，代码就跑在你本机 R 上。</div>' +
      '</div>';

    const frame = document.getElementById("pvFrame");
    const sel = document.getElementById("pvSel");
    sel.onchange = () => { frame.src = playerUrl(sel.value); };

    // 外部（课程页视频列表）也能换视频
    function setVideo(bv) {
      if (!bv) return;
      sel.value = bv;
      if (!sel.value) sel.value = first;
      frame.src = playerUrl(sel.value);
    }
    if (root) root._sxSetVideo = setVideo;

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

    let pollTimer = null;
    function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

    function setStat() {
      if (backend === "local" && localInfo) {
        beStat.innerHTML = "✓ 已用你本机 R " + (localInfo.rversion || "") +
          (localInfo.rhome ? "  (" + localInfo.rhome + ")" : "");
        beStat.style.color = "var(--ok, #4caf50)";
      } else {
        beStat.textContent = "当前：浏览器内 R（点「一键连接本机 R」可用你电脑的完整 R）";
        beStat.style.color = "";
      }
    }

    async function tryConnect() {
      const urls = ["http://127.0.0.1:19810/ping", "http://localhost:19810/ping"];
      for (const u of urls) {
        try {
          const r = await fetch(u, { method: "POST" });
          const j = await r.json();
          if (j && j.ok) {
            backend = "local"; localReady = true; localInfo = j;
            btnLocal.textContent = "已用本机 R（点此切回）";
            setStat();
            return true;
          }
        } catch (e) {}
      }
      return false;
    }

    btnLocal.onclick = async () => {
      if (backend === "local" && localReady) {
        backend = "webr"; localReady = false; localInfo = null; stopPoll();
        btnLocal.textContent = "一键连接本机 R";
        setStat();
        return;
      }
      beStat.textContent = "正在连接本机 R…";
      if (await tryConnect()) { SX.toast("已切换到你本机的 R"); return; }
      // 没连上：自动下载启动器并轮询，用户只需双击刚下载的 .bat，网页会自动连上
      // （云端页面同样适用：桥接服务端已带 Private-Network 预检头，浏览器放行后即连上）
      SX.download("嵩山一号-本机R启动器.bat", LAUNCH_BAT, "application/octet-stream");
      beStat.innerHTML = '<span style="color:var(--accent,#e85)">已下载启动器，请双击它（保持黑窗口开着），网页会自动连上。' +
        '若 1 分钟后仍没连上，多半是浏览器拦了，改用「启动工作站.bat」打开本地版再连。</span>';
      stopPoll();
      pollTimer = setInterval(async () => {
        if (await tryConnect()) { stopPoll(); SX.toast("已切换到你本机的 R"); }
      }, 1500);
    };

    const btnRs = document.getElementById("btnRstudio");
    const card = document.getElementById("rstudioCard");
    btnRs.onclick = () => { card.style.display = card.style.display === "none" ? "block" : "none"; };

    // 进入页面先探测本机 R 是否已连（已启动则直接显示「已用你本机 R」）
    setStat();
    tryConnect();
  }

  // 给课程页用：把「边看边练」里的左边视频换成指定 BV 号
  window.SXViewPractice = {
    render,
    setVideo(bv) {
      const pm = document.getElementById("practiceMount");
      if (pm && pm._sxSetVideo) pm._sxSetVideo(bv);
    }
  };
})();
