/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

/* 嵩山一号 · 出代码 —— 说需求，模型出 R 代码，当场跑
   接口走 OpenAI 兼容协议，密钥只存本机。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;
  const HKEY = "sx_gen_hist";

  const PRESETS = [
    { n: "DeepSeek", base: "https://api.deepseek.com/v1", model: "deepseek-chat" },
    { n: "硅基流动", base: "https://api.siliconflow.cn/v1", model: "Qwen/Qwen2.5-Coder-7B-Instruct" },
    { n: "智谱", base: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4-flash" },
    { n: "通义", base: "https://dashscope.aliyuncs.com/compatible-mode/v1", model: "qwen-plus" },
    { n: "月之暗面", base: "https://api.moonshot.cn/v1", model: "moonshot-v1-8k" },
    { n: "本机 Ollama", base: "http://localhost:11434/v1", model: "qwen2.5-coder" }
  ];

  const CHIPS = [
    "csv → t 检验 → 箱线图",
    "DESeq2 最小示例",
    "ggplot2 火山图",
    "KM 生存曲线"
  ];

  const SYS = [
    "你是 R 语言助教。按用户的需求写一段能直接运行的 R 代码。",
    "规则：",
    "1) 只用 base R 或明确写在注释里的包；不确定的包先注释掉。",
    "2) 代码要短，能跑通优先，关键行写一行中文注释。",
    "3) 如果用户没说数据，就自己用 set.seed + rnorm 造一小份示例数据，变量名写清楚。",
    "4) 需要出图就画，别只 print 数字。",
    "5) 只输出一个 ```r 代码块，前后不要解释。"
  ].join("\n");

  function cfg() {
    const s = SX.state.settings || {};
    if (!s.gen) s.gen = { base: "https://api.deepseek.com/v1", model: "deepseek-chat", key: "" };
    return s.gen;
  }

  function readHist() {
    try { return JSON.parse(localStorage.getItem(HKEY) || "[]"); } catch (e) { return []; }
  }
  function writeHist(arr) {
    try { localStorage.setItem(HKEY, JSON.stringify(arr.slice(0, 15))); } catch (e) { /* 满就满 */ }
  }

  function codeHtml(code) {
    return code.split("\n").map((l, i) =>
      '<div class="cl"><b>' + (i + 1) + "</b><span>" + E(l === "" ? " " : l) + "</span></div>").join("");
  }

  function render(root) {
    const c = cfg();

    root.innerHTML =
      '<div class="page-head gen-head"><h2>出代码</h2><p>说清要什么，出 R 代码，当场跑。</p></div>' +
      '<div class="gen-grid">' +

      '<div class="gen-main">' +
      '<div class="gen-stage">' +
      '<div class="gen-stage-h"><span class="gen-lbl">需求</span>' +
      '<span class="gen-stat" id="genStat">Ctrl + Enter 生成</span></div>' +
      '<textarea class="gen-ta" id="genAsk" spellcheck="false" placeholder="例：读一个 csv，按分组做 t 检验，画箱线图并标 p 值"></textarea>' +
      '<div class="gen-chips">' +
      CHIPS.map(s => '<button class="gen-chip" data-fill="' + E(s) + '">' + E(s) + "</button>").join("") +
      "</div>" +
      '<div class="gen-stage-f"><span class="gen-note">示例只填进框里，可以再改</span>' +
      '<button class="btn primary" id="genGo">生成代码</button></div>' +
      "</div>" +
      '<div id="genOut"></div>' +
      "</div>" +

      '<aside class="gen-side">' +
      '<div class="gen-panel">' +
      '<div class="gen-panel-h"><span>接口</span><span class="gen-dot" id="genDot"></span></div>' +
      '<div class="gen-pres">' +
      PRESETS.map((p, i) => '<button data-pre="' + i + '">' + E(p.n) + "</button>").join("") +
      "</div>" +
      '<label class="gen-f"><span>接口地址</span><input id="genBase" value="' + E(c.base) + '" placeholder="https://api.deepseek.com/v1"></label>' +
      '<label class="gen-f"><span>模型</span><input id="genModel" value="' + E(c.model) + '" placeholder="deepseek-chat"></label>' +
      '<label class="gen-f"><span>API Key</span><input id="genKey" type="password" value="' + E(c.key || "") + '" placeholder="sk-..."></label>' +
      '<div class="gen-note">走 OpenAI 兼容协议。密钥只写进这台电脑的浏览器。</div>' +
      "</div>" +
      '<div class="gen-panel">' +
      '<div class="gen-panel-h"><span>最近生成</span><button class="gen-clear" id="genClear">清空</button></div>' +
      '<div id="genHist"></div>' +
      "</div>" +
      "</aside>" +

      "</div>";

    const ask = document.getElementById("genAsk");
    const stat = document.getElementById("genStat");
    const out = document.getElementById("genOut");
    const goBtn = document.getElementById("genGo");

    out.innerHTML = '<div class="gen-empty">' +
      (c.key ? '结果会出现在这里。' : '先在右边填接口和 API Key，再写需求。') + '</div>';

    ask.onkeydown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); go(); }
    };
    goBtn.onclick = go;
    root.querySelectorAll("[data-fill]").forEach(b => {
      b.onclick = () => { ask.value = b.getAttribute("data-fill"); ask.focus(); };
    });

    /* 预设与字段 */
    root.querySelectorAll("[data-pre]").forEach(b => {
      b.onclick = () => {
        const p = PRESETS[+b.getAttribute("data-pre")];
        document.getElementById("genBase").value = p.base;
        document.getElementById("genModel").value = p.model;
        save();
        markPre(+b.getAttribute("data-pre"));
      };
    });
    function markPre(i) {
      root.querySelectorAll("[data-pre]").forEach(x => x.classList.toggle("on", +x.getAttribute("data-pre") === i));
    }
    function dot() {
      const d = document.getElementById("genDot");
      const k = document.getElementById("genKey").value.trim();
      d.classList.toggle("on", !!k);
      d.title = k ? "密钥已填" : "还没填密钥";
    }
    function save() {
      const g = cfg();
      g.base = document.getElementById("genBase").value.trim();
      g.model = document.getElementById("genModel").value.trim();
      g.key = document.getElementById("genKey").value.trim();
      SX.save();
      dot();
    }
    ["genBase", "genModel", "genKey"].forEach(id => {
      document.getElementById(id).onchange = save;
      document.getElementById(id).oninput = dot;
    });
    dot();
    const cur = PRESETS.findIndex(p => p.base === c.base);
    if (cur >= 0) markPre(cur);

    function histUi() {
      const arr = readHist();
      const box = document.getElementById("genHist");
      if (!arr.length) { box.innerHTML = '<div class="gen-note">还没生成过。</div>'; return; }
      box.innerHTML = arr.map((h, i) =>
        '<div class="gh-item" data-h="' + i + '">' +
        '<div class="gh-q">' + E(h.q) + "</div>" +
        '<div class="gh-t">' + E(h.model || "") + " · " + E(h.when || "") + "</div>" +
        "</div>").join("");
      box.querySelectorAll("[data-h]").forEach(el => {
        el.onclick = () => {
          const h = readHist()[+el.getAttribute("data-h")];
          if (!h) return;
          ask.value = h.q;
          show(h.code, h.q, h.model);
          stat.textContent = "从历史取回";
        };
      });
    }
    histUi();

    document.getElementById("genClear").onclick = () => {
      writeHist([]);
      histUi();
      SX.toast("已清空");
    };

    async function go() {
      const q = ask.value.trim();
      if (!q) { SX.toast("先说清要什么"); ask.focus(); return; }
      const g = cfg();
      if (!g.base) { SX.toast("先填接口地址"); document.getElementById("genBase").focus(); return; }

      goBtn.disabled = true;
      stat.textContent = "生成中…";
      out.innerHTML = '<div class="gen-wait"><span class="gen-spin"></span>等模型返回</div>';

      try {
        const resp = await fetch(g.base.replace(/\/+$/, "") + "/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + (g.key || "none")
          },
          body: JSON.stringify({
            model: g.model,
            temperature: 0.25,
            messages: [
              { role: "system", content: SYS },
              { role: "user", content: q }
            ]
          })
        });
        if (!resp.ok) throw new Error("接口返回 " + resp.status + " " + (await resp.text()).slice(0, 160));
        const j = await resp.json();
        const txt = (((j.choices || [])[0] || {}).message || {}).content || "";
        const code = pickCode(txt);
        if (!code) throw new Error("模型没给代码块");

        const when = new Date().toTimeString().slice(0, 5);
        show(code, q, g.model);
        stat.textContent = "生成完成";
        const arr = readHist();
        arr.unshift({ q: q, code: code, model: g.model, when: when });
        writeHist(arr);
        histUi();
      } catch (e) {
        out.innerHTML = '<div class="gen-err"><b>没拿到代码</b>' +
          '<div class="gen-note" style="margin-top:8px">' + E(String(e.message || e)) + "</div></div>";
        stat.textContent = "失败";
      }
      goBtn.disabled = false;
    }

    function pickCode(t) {
      const m = /```(?:r|R)?\s*\n([\s\S]*?)```/.exec(t);
      return (m ? m[1] : t).replace(/^\s*\n+|\s+$/g, "");
    }

    function show(code, q, model) {
      const lines = code.split("\n").length;
      out.innerHTML =
        '<div class="gen-result">' +
        '<div class="gen-result-h">' +
        '<span class="gen-file">snippet.R</span>' +
        '<span class="gen-meta">' + lines + " 行 · " + E(model || "") + "</span>" +
        '<div class="toolbar">' +
        '<button class="btn sm" id="genRun" style="border-color:var(--brand-line);color:var(--brand)">运行</button>' +
        '<button class="btn sm" id="genCopy">复制</button>' +
        '<button class="btn sm ghost" id="genDl">下载 .R</button>' +
        "</div></div>" +
        '<div class="gen-code">' + codeHtml(code) + "</div>" +
        '<div class="gen-term">' +
        '<div class="gen-term-h">输出</div>' +
        '<pre id="genRes">› 点「运行」，结果打在这里</pre>' +
        "</div></div>";

      document.getElementById("genCopy").onclick = () => { SX.copy(code); SX.toast("已复制"); };
      document.getElementById("genDl").onclick = () => SX.download("gen.R", "# 需求：" + q + "\n\n" + code);
      document.getElementById("genRun").onclick = async () => {
        const box = document.getElementById("genRes");
        const btn = document.getElementById("genRun");
        btn.disabled = true;
        box.textContent = "› 启动 R 运行时…";
        try {
          const run = window.SXR && window.SXR.run;
          if (!run) throw new Error("运行时没加载");
          const res = await run(code, [], null, m => { box.textContent = "› " + String(m).slice(-4000); });
          box.textContent = "› " + String((res && (res.output || res.out || res.text)) || "已执行，无文本输出。");
        } catch (e) {
          box.textContent = "› 运行失败：" + String(e.message || e);
        }
        btn.disabled = false;
      };
    }
  }

  window.SXViewGen = { render };
})();
