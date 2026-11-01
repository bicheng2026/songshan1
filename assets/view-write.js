/* 嵩山一号 · 工作站 —— 论文写作台 / AI 导师 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  /* ==================== 论文写作台 ==================== */
  let draftId = "main";

  function write(root) {
    const W = window.SX_WRITING || {};
    const st = SX.state;
    if (!st.drafts[draftId]) st.drafts[draftId] = { title: "", sections: {} };
    const d = st.drafts[draftId];

    root.innerHTML =
      '<div class="page-head"><h2>论文写作台</h2>' +
      "<p>按 IMRaD 逐节写，自动存本机，可导出 Markdown。" +
      "" +
      '<div class="layout-2">' +
      '<aside class="side">' +
      '<div class="card"><b>标题</b>' +
      '<input type="text" id="dTitle" style="width:100%;margin-top:6px" placeholder="论文标题" value="' + E(d.title || "") + '">' +
      '<div class="toolbar" style="margin-top:8px">' +
      '<button class="btn sm primary" id="dExport">导出 Markdown</button>' +
      '<button class="btn sm" id="dPrint">排版打印 / 存 PDF</button>' +
      '<button class="btn sm ghost" id="dCopy">复制全文</button>' +
      "</div></div>" +
      '<div class="card" style="margin-top:12px"><b>章节</b><div id="secList"></div></div>' +
      '<div class="card" style="margin-top:12px"><b>自查清单</b>' +
      Object.keys(W.checklists || {}).map(k =>
        '<details class="acc"><summary>' + E(k) + "</summary>" +
        (W.checklists[k] || []).map(x => '<label class="small" style="display:block;margin:3px 0">' +
          '<input type="checkbox"> ' + E(x) + "</label>").join("") + "</details>").join("") +
      "</div>" +
      "</aside>" +
      '<section><div class="card"><div id="secHead"></div>' +
      '<textarea class="ed" id="dBody" style="min-height:420px" placeholder="在这里写正文。支持 Markdown。"></textarea>' +
      '<div class="small muted" style="margin-top:6px" id="dCount"></div>' +
      "</div>" +
      '<div class="card" style="margin-top:12px"><b>图注生成器</b>' +
      '<div class="grid g3" style="margin-top:8px">' +
      '<input type="text" id="lgA" placeholder="Panel A 画了什么">' +
      '<input type="text" id="lgB" placeholder="Panel B 画了什么">' +
      '<input type="text" id="lgN" placeholder="样本量，如 40 / 20">' +
      "</div>" +
      '<div class="toolbar" style="margin-top:8px">' +
      '<button class="btn primary sm" id="lgGen">生成图注</button>' +
      '<button class="btn sm" id="lgCopy">复制</button></div>' +
      "<pre class='code' id=\"lgOut\" style=\"display:none;margin-top:8px\"></pre></div>" +
      "</section></div>";

    let sec = Object.keys((W.sections || [])[0] ? {} : {}) [0] || (W.sections || [])[0];
    let curSec = (W.sections || [])[0] ? (W.sections[0].id) : "";

    function drawSecs() {
      document.getElementById("secList").innerHTML = (W.sections || []).map(s =>
        '<div class="lvrow" data-s="' + E(s.id) + '" style="padding:6px 8px;border-radius:6px;cursor:pointer;font-size:calc(14.5px * var(--fs));' +
        (curSec === s.id ? "background:var(--brand-soft);" : "") +
        'display:flex;justify-content:space-between;align-items:center">' +
        "<span>" + E(s.name) + "</span>" +
        '<span class="tiny muted">' + ((d.sections || {})[s.id] ? "已写" : "") + "</span></div>").join("");
      document.querySelectorAll("[data-s]").forEach(b => b.onclick = () => {
        curSec = b.getAttribute("data-s"); syncBody(); drawSecs();
      });

      const s = (W.sections || []).find(x => x.id === curSec);
      if (!s) return;
      document.getElementById("secHead").innerHTML =
        "<b>" + E(s.name) + "</b>" +
        '<div class="small muted" style="margin:4px 0 8px"><b>必须包含：</b>' +
        (s.must || []).map(x => '<span class="tag g">' + E(x) + "</span>").join(" ") + "</div>" +
        '<details class="acc"><summary>可用句式</summary>' +
        (s.templates || []).map(t => '<div class="small" style="margin:4px 0;cursor:pointer" data-tpl="' + E(t) + '">' +
          E(t) + ' <span class="tiny muted">（点击插入）</span></div>').join("") + "</details>" +
        '<div class="note warn small" style="margin-top:6px">' + (s.pitfalls || []).map(x => "<div>· " + E(x) + "</div>").join("") + "</div>";
      document.querySelectorAll("[data-tpl]").forEach(el => el.onclick = () => {
        const ta = document.getElementById("dBody");
        ta.value += (ta.value ? "\n" : "") + el.getAttribute("data-tpl") + "\n";
        ta.focus(); saveBody();
      });
    }

    function syncBody() {
      const ta = document.getElementById("dBody");
      ta.value = (d.sections || {})[curSec] || "";
      updateCount();
    }
    function saveBody() {
      d.sections[curSec] = document.getElementById("dBody").value;
      const c = (document.getElementById("dBody").value || "").length;
      document.getElementById("dCount").textContent = "本节 " + c + " 字符 · 已自动保存";
      SX.save();
    }
    function updateCount() {
      const c = (document.getElementById("dBody").value || "").length;
      document.getElementById("dCount").textContent = "本节 " + c + " 字符";
    }

    const ta = document.getElementById("dBody");
    ta.oninput = SX.debounce(saveBody, 400);
    document.getElementById("dTitle").oninput = SX.debounce(function () {
      d.title = this.value; SX.save();
    }, 400);

    drawSecs(); syncBody();

    function fullText() {
      let t = "# " + (d.title || "（未命名）") + "\n\n";
      (W.sections || []).forEach(s => {
        const body = (d.sections || {})[s.id];
        if (body && body.trim()) t += "## " + s.name.split(" ")[0] + "\n\n" + body.trim() + "\n\n";
      });
      return t;
    }
    document.getElementById("dExport").onclick = () => {
      SX.download((d.title || "manuscript") + ".md", fullText());
    };
    document.getElementById("dCopy").onclick = () => { SX.copy(fullText()); SX.toast("全文已复制"); };
    document.getElementById("dPrint").onclick = () => {
      const w = window.open("", "_blank");
      w.document.write("<html><head><meta charset='utf-8'><title>" + E(d.title || "manuscript") + "</title>" +
        "<style>body{font-family:'Times New Roman',serif;max-width:760px;margin:40px auto;line-height:1.9;font-size:12pt}" +
        "h1{font-size:18pt;text-align:center}h2{font-size:14pt;margin-top:22px;border-bottom:1px solid #ccc;padding-bottom:4px}" +
        "pre{background:#f5f5f5;padding:8px;white-space:pre-wrap}</style></head><body>" +
        fullText().replace(/^# (.*)$/gm, "<h1>$1</h1>").replace(/^## (.*)$/gm, "<h2>$1</h2>")
          .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>") +
        "</body></html>");
      w.document.close();
      setTimeout(() => w.print(), 400);
    };

    document.getElementById("lgGen").onclick = () => {
      const a = document.getElementById("lgA").value || "(A) 待填写";
      const b = document.getElementById("lgB").value || "(B) 待填写";
      const n = document.getElementById("lgN").value || "n = ___ / ___";
      const txt = "Figure X. " + a + " " + b + "\n" +
        "Group comparisons were performed using two-sided Student's t-test followed by Benjamini-Hochberg correction. " +
        "Sample sizes: " + n + ". Data are presented as mean +/- SD. *P < 0.05, **P < 0.01, ***P < 0.001.\n" +
        "缩写：本图所有缩写需在首次出现处给出全称。";
      const o = document.getElementById("lgOut");
      o.style.display = "block"; o.textContent = txt;
    };
    document.getElementById("lgCopy").onclick = () => {
      const o = document.getElementById("lgOut");
      if (o.textContent) { SX.copy(o.textContent); SX.toast("图注已复制"); }
    };
  }

  /* ==================== AI 导师 ==================== */
  let tutorId = "mentor-proj";

  function tutor(root) {
    const T = window.SX_TUTORS || [];
    const P = window.SX_PROVIDERS || [];
    const st = SX.state.settings;

    root.innerHTML =
      '<div class="page-head"><h2>AI 导师（DeepSeek）</h2>' +
      "<p>8 个预设角色，都按你的背景写好。密钥只存本机。</p></div>" +
      '<div class="layout-2">' +
      '<aside class="side">' +
      '<div class="card"><b>模型设置</b>' +
      '<div style="margin-top:8px"><label class="tiny muted">服务商</label>' +
      '<select id="pvSel" style="width:100%">' +
      P.map(p => '<option value="' + E(p.id) + '"' + (st.provider === p.id ? " selected" : "") + ">" + E(p.name) + "</option>").join("") +
      "</select></div>" +
      '<div style="margin-top:6px"><label class="tiny muted">API Base</label>' +
      '<input type="text" id="pvBase" style="width:100%" value="' + E(st.base) + '"></div>' +
      '<div style="margin-top:6px"><label class="tiny muted">模型</label>' +
      '<input type="text" id="pvModel" style="width:100%" list="mdlList" value="' + E(st.model) + '">' +
      '<datalist id="mdlList">' + P.map(p => (p.models || []).map(m => '<option value="' + E(m) + '"></option>').join("")).join("") + "</datalist></div>" +
      '<div style="margin-top:6px"><label class="tiny muted">API Key（只存本机 localStorage）</label>' +
      '<input type="text" id="pvKey" style="width:100%" placeholder="sk-..." value="' + E(st.key || "") + '"></div>' +
      '<div style="margin-top:6px"><label class="tiny muted">温度 ' + st.temp + '</label>' +
      '<input type="range" id="pvTemp" min="0" max="1" step="0.1" value="' + st.temp + '" style="width:100%"></div>' +
      '<div class="toolbar" style="margin-top:8px"><button class="btn sm primary" id="pvSave">保存设置</button>' +
      '<button class="btn sm ghost" id="pvTest">测试连通</button></div>' +
      '<div class="tiny muted" id="pvNote" style="margin-top:6px"></div></div>' +
      '<div class="card" style="margin-top:12px"><b>导师角色</b><div id="tutorList"></div></div>' +
      "</aside>" +
      '<section class="card">' +
      '<div class="editor-head"><b id="tName"></b>' +
      '<div class="toolbar">' +
      '<button class="btn sm" id="tCtx">插入当前上下文</button>' +
      '<button class="btn sm ghost" id="tClear">清空对话</button></div></div>' +
      '<div id="chatBox" style="height:460px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:12px;background:var(--panel-alt)"></div>' +
      '<div style="margin-top:10px;display:flex;gap:8px">' +
      '<textarea id="chatIn" rows="3" style="flex:1" placeholder="把你的代码、报错、草稿粘进来，然后回车发送（Shift+Enter 换行）"></textarea>' +
      '<button class="btn primary" id="chatSend" style="align-self:flex-end;height:38px">发送</button></div>' +
      '<div class="tiny muted" style="margin-top:6px" id="chatStat"></div>' +
      "</section></div>";

    const curP = P.find(p => p.id === st.provider) || P[0];
    document.getElementById("pvNote").textContent = curP.note || "";

    function drawTutors() {
      document.getElementById("tutorList").innerHTML = T.map(t =>
        '<div class="lvrow" data-t="' + E(t.id) + '" style="padding:8px;border-radius:6px;cursor:pointer;' +
        (tutorId === t.id ? "background:var(--brand-soft);" : "") + '">' +
        "<div style=\"font-size:calc(14.5px * var(--fs))\"><b>" + E(t.name) + "</b></div>" +
        '<div class="tiny muted">' + E(t.desc) + "</div></div>").join("");
      document.querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
        tutorId = b.getAttribute("data-t"); drawTutors(); drawChat();
      });
      const t = T.find(x => x.id === tutorId) || T[0];
      document.getElementById("tName").textContent = t.name + " · " + t.desc;
    }

    function drawChat() {
      const t = T.find(x => x.id === tutorId);
      const msgs = SX.state.tutorChats[tutorId] || [];
      const box = document.getElementById("chatBox");
      if (!msgs.length) {
        box.innerHTML = '<div class="muted small">已加载「' + E(t.name) + '」。可以直接问，或者点下面任意一条开场：</div>' +
          '<div style="margin-top:8px">' + (t.starters || []).map(s =>
            '<button class="btn sm" data-st="' + E(s) + '" style="margin:3px 4px 3px 0">' + E(s) + "</button>").join("") + "</div>";
        box.querySelectorAll("[data-st]").forEach(b => b.onclick = () => {
          document.getElementById("chatIn").value = b.getAttribute("data-st");
          document.getElementById("chatIn").focus();
        });
        return;
      }
      box.innerHTML = msgs.map(m =>
        '<div style="margin:10px 0">' +
        '<div class="tiny muted" style="margin-bottom:2px">' + (m.role === "user" ? "你" : E(t.name)) + "</div>" +
        '<div class="' + (m.role === "user" ? "" : "") + '" style="white-space:pre-wrap;font-size:calc(15px * var(--fs));' +
        (m.role === "user" ? "background:#eef4f2;border-radius:8px;padding:8px 10px" : "") + '">' +
        (m.role === "user" ? E(m.content) : SX.md(m.content)) + "</div></div>").join("");
      box.scrollTop = box.scrollHeight;
    }

    drawTutors(); drawChat();

    document.getElementById("pvSave").onclick = () => {
      const s = SX.state.settings;
      s.provider = document.getElementById("pvSel").value;
      s.base = document.getElementById("pvBase").value.trim().replace(/\/+$/, "");
      s.model = document.getElementById("pvModel").value.trim();
      s.key = document.getElementById("pvKey").value.trim();
      s.temp = parseFloat(document.getElementById("pvTemp").value);
      SX.save(); SX.toast("设置已保存到本机");
    };
    document.getElementById("pvSel").onchange = e => {
      const p = P.find(x => x.id === e.target.value);
      if (p) {
        document.getElementById("pvBase").value = p.base;
        document.getElementById("pvModel").value = p.defaultModel || "";
        document.getElementById("pvNote").textContent = p.note || "";
      }
    };
    document.getElementById("tClear").onclick = () => {
      SX.state.tutorChats[tutorId] = []; SX.save(); drawChat();
    };
    document.getElementById("tCtx").onclick = () => {
      const ta = document.getElementById("dBody");
      let ctx = "";
      if (ta && ta.value) ctx = "【我在写作台里的当前正文】\n" + ta.value;
      else ctx = "（写作台暂无内容）";
      const ci = document.getElementById("chatIn");
      ci.value = ctx + "\n\n我的问题："; ci.focus();
      SX.toast("已插入写作台内容");
    };

    const inp = document.getElementById("chatIn");
    inp.onkeydown = e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };
    document.getElementById("chatSend").onclick = send;

    document.getElementById("pvTest").onclick = async () => {
      const s = SX.state.settings;
      const stat = document.getElementById("chatStat");
      stat.textContent = "测试中…";
      try {
        const r = await call(s, [{ role: "user", content: "回复两个字：正常" }], 0);
        stat.textContent = "连通正常，模型回复：" + (r || "").slice(0, 40);
      } catch (e) {
        stat.innerHTML = '<span style="color:var(--accent)">失败：' + E(String(e.message || e)) + "</span>";
      }
    };

    async function call(s, messages, temp) {
      const url = s.base.replace(/\/+$/, "") + "/chat/completions";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (s.key || "") },
        body: JSON.stringify({ model: s.model, messages: messages, temperature: temp, stream: false })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error("HTTP " + res.status + "：" + t.slice(0, 200));
      }
      const j = await res.json();
      const c = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      return c || (j && j.choices && j.choices[0] && j.choices[0].text) || "（无回复内容）";
    }

    async function send() {
      const s = SX.state.settings;
      const t = T.find(x => x.id === tutorId);
      const text = inp.value.trim();
      if (!text) return;
      if (!s.key && s.provider !== "xianfeng") {
        SX.toast("先在左侧填 API Key（DeepSeek 官网可免费申请）"); return;
      }
      if (!s.model) { SX.toast("先填模型名"); return; }

      if (!SX.state.tutorChats[tutorId]) SX.state.tutorChats[tutorId] = [];
      const hist = SX.state.tutorChats[tutorId];
      hist.push({ role: "user", content: text });
      inp.value = "";
      drawChat();

      const stat = document.getElementById("chatStat");
      stat.textContent = "导师正在思考…";
      try {
        const msgs = [{ role: "system", content: t.system }].concat(
          hist.slice(-12).map(m => ({ role: m.role, content: m.content })));
        const reply = await call(s, msgs, s.temp);
        hist.push({ role: "assistant", content: reply });
        SX.save(); drawChat();
        stat.textContent = "完成（" + (reply || "").length + " 字）";
      } catch (e) {
        stat.innerHTML = '<span style="color:var(--accent)">请求失败：' + E(String(e.message || e)) +
          "。检查 API Base / Key / 模型名，或本机网关是否启动。</span>";
      }
    }
  }

  window.SXViewWrite = { write, tutor };
})();
