/* 嵩山一号 · 出代码 —— 说需求，大模型出 R 代码，可在浏览器里直接跑
   接口全部走 OpenAI 兼容格式，预设了几家，也能自己填。密钥只存本机。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  /* 预设只是填 base 和 model，key 还是得自己填 */
  const PRESETS = [
    { n: "DeepSeek", base: "https://api.deepseek.com/v1", model: "deepseek-chat" },
    { n: "硅基流动", base: "https://api.siliconflow.cn/v1", model: "Qwen/Qwen2.5-Coder-7B-Instruct" },
    { n: "智谱", base: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4-flash" },
    { n: "通义千问", base: "https://dashscope.aliyuncs.com/compatible-mode/v1", model: "qwen-plus" },
    { n: "月之暗面", base: "https://api.moonshot.cn/v1", model: "moonshot-v1-8k" },
    { n: "本机 Ollama", base: "http://localhost:11434/v1", model: "qwen2.5-coder" },
    { n: "自定义", base: "", model: "" }
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

  function render(root) {
    const c = cfg();
    root.innerHTML =
      '<div class="page-head"><h2>出代码</h2><p>说清要干什么，出 R 代码，拿到就能跑。</p></div>' +

      '<div class="gen-box">' +
      '<textarea class="gen-ta" id="genAsk" spellcheck="false" placeholder="例：读一个 csv，按分组做 t 检验，画箱线图并标 p 值"></textarea>' +
      '<div class="gen-bar">' +
      '<button class="btn primary" id="genGo">生成代码</button>' +
      '<span class="small muted" id="genStat">Ctrl+Enter 生成</span>' +
      '<button class="btn ghost sm" id="genCfgBtn">接口设置</button>' +
      "</div></div>" +

      '<details class="acc" id="genCfg"' + (c.key ? "" : " open") + ">" +
      '<summary><b>接口设置</b><span class="tag n">只存本机</span></summary>' +
      '<div class="search-bar" style="margin-bottom:10px">' +
      '<select id="genPre">' + PRESETS.map((p, i) =>
        '<option value="' + i + '">' + E(p.n) + "</option>").join("") + "</select>" +
      "</div>" +
      '<div class="search-bar" style="margin-bottom:10px">' +
      '<input id="genBase" placeholder="接口地址，如 https://api.deepseek.com/v1" value="' + E(c.base) + '">' +
      "</div>" +
      '<div class="search-bar" style="margin-bottom:10px">' +
      '<input id="genModel" placeholder="模型名" value="' + E(c.model) + '">' +
      '<input id="genKey" type="password" placeholder="API Key" value="' + E(c.key) + '">' +
      "</div>" +
      '<div class="small muted">走 OpenAI 兼容协议，任何能返回 chat/completions 的服务都能接。密钥只写进这台电脑的浏览器。</div>' +
      "</details>" +

      '<div id="genOut"></div>';

    const ask = document.getElementById("genAsk");
    ask.onkeydown = e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); go(); } };
    document.getElementById("genGo").onclick = go;
    document.getElementById("genCfgBtn").onclick = () => {
      const d = document.getElementById("genCfg");
      d.open = !d.open;
      if (d.open) d.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const pre = document.getElementById("genPre");
    pre.onchange = () => {
      const p = PRESETS[+pre.value];
      if (p.base) {
        document.getElementById("genBase").value = p.base;
        document.getElementById("genModel").value = p.model;
        save();
      }
    };
    ["genBase", "genModel", "genKey"].forEach(id => {
      const el = document.getElementById(id);
      el.onchange = save;
    });

    function save() {
      const g = cfg();
      g.base = document.getElementById("genBase").value.trim();
      g.model = document.getElementById("genModel").value.trim();
      g.key = document.getElementById("genKey").value.trim();
      SX.save();
    }

    async function go() {
      const q = ask.value.trim();
      const out = document.getElementById("genOut");
      const stat = document.getElementById("genStat");
      if (!q) { SX.toast("先说清要什么"); return; }
      const g = cfg();
      if (!g.base) { SX.toast("先填接口地址"); document.getElementById("genCfg").open = true; return; }

      document.getElementById("genGo").disabled = true;
      stat.textContent = "生成中…";
      out.innerHTML = '<div class="card"><span class="small muted">正在等模型返回…</span></div>';

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
        show(code, q);
        stat.textContent = "生成完成";
      } catch (e) {
        out.innerHTML = '<div class="card"><b>没拿到代码</b><div class="small muted" style="margin-top:6px">' +
          E(String(e.message || e)) + "</div></div>";
        stat.textContent = "失败";
      }
      document.getElementById("genGo").disabled = false;
    }

    function pickCode(t) {
      const m = /```(?:r|R)?\s*\n([\s\S]*?)```/.exec(t);
      return (m ? m[1] : t).trim();
    }

    function show(code, q) {
      const out = document.getElementById("genOut");
      out.innerHTML =
        '<div class="card">' +
        '<div class="editor-head"><b>生成结果</b><div class="toolbar">' +
        '<button class="btn primary sm" id="genRun">在浏览器里跑</button>' +
        '<button class="btn sm" id="genCopy">复制</button>' +
        '<button class="btn sm" id="genDl">下载 .R</button>' +
        "</div></div>" +
        '<pre class="code" id="genCode">' + E(code) + "</pre>" +
        '<div class="out" id="genRes">（点「在浏览器里跑」，结果显示在这）</div>' +
        '<div class="small muted" style="margin-top:8px">图不会在网页里渲染，跑通后把代码粘进 RStudio 出图。</div>' +
        "</div>";

      document.getElementById("genCopy").onclick = () => { SX.copy(code); SX.toast("已复制"); };
      document.getElementById("genDl").onclick = () => SX.download("gen.R", "# 需求：" + q + "\n\n" + code);
      document.getElementById("genRun").onclick = async () => {
        const box = document.getElementById("genRes");
        const btn = document.getElementById("genRun");
        btn.disabled = true;
        box.textContent = "启动 R 运行时…";
        try {
          const run = window.SXR && window.SXR.run;
          if (!run) throw new Error("运行时没加载");
          const res = await run(code, [], null, m => { box.textContent = String(m).slice(-4000); });
          box.textContent = String((res && (res.output || res.out || res.text)) || "已执行，无文本输出。");
        } catch (e) {
          box.textContent = "运行失败：" + String(e.message || e);
        }
        btn.disabled = false;
      };
    }
  }

  window.SXViewGen = { render };
})();
