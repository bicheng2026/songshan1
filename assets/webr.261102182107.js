/* 嵩山一号 · 工作站 —— 浏览器内 R 运行时（WebR）封装 */
(function () {
  "use strict";

  const CDN = "https://webr.r-wasm.org/latest/webr.mjs";
  const DIR = "/home/web_user";

  let webR = null;
  let status = "idle";        // idle | loading | ready | failed
  let failMsg = "";
  const loaded = new Set();

  async function init(onLog) {
    if (status === "ready" || status === "loading") return status;
    status = "loading";
    try {
      onLog && onLog("正在加载 R 运行时（约 20-40 MB，首次较慢）…");
      const mod = await import(CDN);
      // 本地 http.server 不带 COOP/COEP 头，crossOriginIsolated 为 false，
      // 默认的 SharedArrayBuffer 通道会直接失败。PostMessage 通道不需要跨源隔离。
      webR = new mod.WebR({ channelType: "PostMessage" });
      await webR.init();
      status = "ready";
      onLog && onLog("R 运行时就绪。");
    } catch (e) {
      status = "failed";
      failMsg = String(e && e.message ? e.message : e);
      onLog && onLog("R 运行时加载失败：" + failMsg);
    }
    return status;
  }

  async function putDataset(key, csv) {
    if (status !== "ready") return;
    if (loaded.has(key)) return;
    const p = DIR + "/sx_" + key + ".csv";
    try {
      // 必须按 UTF-8 字节写入：WebR 的 FS.writeFile 收到字符串时会走 UTF-16，
      // 落盘后 read.csv 会报 "embedded nulls"。用 TextEncoder 显式转字节最稳。
      const bytes = new TextEncoder().encode(csv);
      await webR.FS.writeFile(p, bytes);
      loaded.add(key);
    } catch (e) { }
  }

  function loaderCode(key) {
    const p = DIR + "/sx_" + key + ".csv";
    if (key === "gmt") {
      return ("gmt <- local({ l <- readLines('" + p + "', warn = FALSE)\n" +
        "  l <- l[nzchar(l)]\n" +
        "  out <- list()\n" +
        "  for (ln in l) { f <- strsplit(ln, '\\t', fixed = TRUE)[[1]]\n" +
        "    out[[f[1]]] <- f[-c(1, 2)] }\n" +
        "  out })\n");
    }
    const rn = key.indexOf("_expr") >= 0 ? ", row.names = 1" : "";
    return key + " <- read.csv('" + p + "', stringsAsFactors = FALSE, check.names = FALSE" + rn + ")\n";
  }

  /* 执行用户代码 + 检查脚本；返回 { ok, out, msg } */
  async function run(userCode, datasets, checkCode, onLog) {
    if (status !== "ready") {
      const s = await init(onLog);
      if (s !== "ready") return { ok: false, out: "", msg: "R 运行时不可用（" + (failMsg || "加载失败") + "）。可把代码复制到 RStudio 运行，或检查网络后重试。" };
    }
    try {
      for (const k of (datasets || [])) {
        await putDataset(k, window.SX_DATA[k].csv);
      }
      const pre = (datasets || []).map(loaderCode).join("\n");

      // 1) 运行用户代码，捕获 stdout 与错误
      const wrapped =
        ".sx_out <- paste(capture.output(tryCatch({\n" +
        pre + "\n" + userCode + "\n invisible(NULL)\n" +
        "}, error = function(e) cat('错误：', conditionMessage(e), '\\n'), " +
        "warning = function(w) cat('警告：', conditionMessage(w), '\\n'))), collapse = '\\n')\n";
      await webR.evalRVoid(wrapped);
      const out = await webR.evalRString(".sx_out");

      // 2) 运行检查脚本
      if (checkCode && checkCode.trim()) {
        const chk =
          ".sx_result <- tryCatch(local({\n" + checkCode + "\n}), " +
          "error = function(e) paste('检查脚本报错：', conditionMessage(e)))\n" +
          ".sx_result <- if (isTRUE(.sx_result)) 'PASS' else paste(.sx_result)\n";
        await webR.evalRVoid(chk);
        const res = await webR.evalRString(".sx_result");
        if (res === "PASS") return { ok: true, out: out, msg: "" };
        return { ok: false, out: out, msg: res };
      }
      return { ok: true, out: out, msg: "" };
    } catch (e) {
      return { ok: false, out: "", msg: "执行异常：" + String(e && e.message ? e.message : e) };
    }
  }

  /* 只求值一个表达式（用于小工具，如格式化） */
  async function evalExpr(code) {
    if (status !== "ready") return null;
    try { return await webR.evalRString(code); } catch (e) { return null; }
  }

  window.SXR = {
    get status() { return status; },
    get failMsg() { return failMsg; },
    init, run, evalExpr, putDataset
  };
})();
