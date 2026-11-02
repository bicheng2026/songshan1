/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

/* 嵩山一号 · 工作站 —— 全局悬浮 AI 导师 */
(function () {
  "use strict";
  const SX = window.SX;

  let open = false;
  let busy = false;
  let curTutor = null;

  const DEFAULT_TUTOR = "mentor-r";

  function tutors() { return window.SX_TUTORS || []; }
  function providers() { return window.SX_PROVIDERS || []; }

  function draft() { return SX.state.dockMsgs || (SX.state.dockMsgs = []); }

  /* 取当前页面能带进对话的上下文 */
  function contextOf() {
    const h = (location.hash || "").replace(/^#\/?/, "");
    const parts = [];
    parts.push("【当前页面】" + (h || "地图"));
    if (h.indexOf("dojo") === 0) {
      const lv = (window.SX_LEVELS || []).find(l => l.id === SX.state.curLevel) ||
        (window.SX_LEVELS || [])[0];
      const code = SX.state.codeDrafts && SX.state.codeDrafts[lv.id];
      if (lv) {
        parts.push("【当前关卡】" + lv.title);
        parts.push("【本关目标】" + (lv.goal || ""));
        if (lv.tasks && lv.tasks.length) parts.push("【判题要求】\n- " + lv.tasks.join("\n- "));
      }
      if (code) parts.push("【我编辑器里的代码】\n```r\n" + code + "\n```");
      const ob = document.getElementById("outBox");
      if (ob && ob.textContent && ob.textContent.indexOf("运行后") < 0) {
        parts.push("【上一次运行的输出】\n" + ob.textContent.slice(0, 1200));
      }
    } else if (h.indexOf("write") === 0) {
      const ta = document.getElementById("dBody");
      if (ta && ta.value) parts.push("【写作台里的正文】\n" + ta.value.slice(0, 3000));
    } else if (h.indexOf("codebank") === 0) {
      const q = document.getElementById("qCode");
      if (q && q.value) parts.push("【我正在找的代码】" + q.value);
    }
    return parts.join("\n\n");
  }

  function el(id) { return document.getElementById(id); }

  function build() {
    if (el("sxDock")) return;
    const b = document.createElement("button");
    b.className = "sxDock";
    b.id = "sxDock";
    b.innerHTML = '<span class="dot"></span>问导师';
    document.body.appendChild(b);

    const p = document.createElement("div");
    p.className = "sxPanel";
    p.id = "sxPanel";
    p.innerHTML =
      '<div class="sxHead">' +
      '<b>AI 导师</b>' +
      '<select id="sxRole"></select>' +
      '<span class="sp"></span>' +
      '<button class="btn ghost sm" id="sxCfgBtn">设置</button>' +
      '<button class="btn ghost sm" id="sxClose">&times;</button>' +
      "</div>" +
      '<div class="sxBody" id="sxBody"></div>' +
      '<div class="sxFoot">' +
      '<textarea id="sxIn" placeholder="问点什么……（Enter 发送，Shift+Enter 换行）"></textarea>' +
      '<div class="row">' +
      '<button class="btn primary sm" id="sxSend">发送</button>' +
      '<button class="btn sm" id="sxCtx">带上当前页面</button>' +
      '<button class="btn ghost sm" id="sxClear">清空</button>' +
      '<span class="tiny muted" id="sxStat"></span>' +
      "</div></div>";
    document.body.appendChild(p);

    b.onclick = () => toggle();
    el("sxClose").onclick = () => toggle(false);
    el("sxSend").onclick = send;
    el("sxClear").onclick = () => {
      SX.state.dockMsgs = []; SX.save(); draw();
    };
    el("sxCtx").onclick = () => {
      const t = el("sxIn");
      t.value = contextOf() + "\n\n我的问题：";
      t.focus();
    };
    el("sxCfgBtn").onclick = openCfg;

    const inp = el("sxIn");
    inp.onkeydown = e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    const sel = el("sxRole");
    const T = tutors();
    sel.innerHTML = T.map(t => '<option value="' + t.id + '">' + SX.esc(t.name) + "</option>").join("");
    curTutor = SX.state.dockTutor || DEFAULT_TUTOR;
    if (!T.some(t => t.id === curTutor)) curTutor = T[0] ? T[0].id : "";
    sel.value = curTutor;
    sel.onchange = () => { curTutor = sel.value; SX.state.dockTutor = curTutor; SX.save(); };
  }

  function toggle(v) {
    open = v === undefined ? !open : !!v;
    el("sxPanel").classList.toggle("open", open);
    el("sxDock").style.display = open ? "none" : "flex";
    if (open) { draw(); setTimeout(() => el("sxIn").focus(), 60); }
  }

  function openCfg() {
    const s = SX.state.settings;
    const P = providers();
    el("sxBody").innerHTML =
      '<div class="card" style="padding:14px">' +
      "<b>接一个模型</b>" +
      '<div class="tiny muted" style="margin:6px 0 12px">密钥只存在你这台机器的浏览器里，只发往你填的地址。' +
      "DeepSeek 在 platform.deepseek.com 申请 key，充 10 块钱能跑很久。</div>" +
      '<div class="small">供应商</div>' +
      '<select id="sxProv" style="width:100%;margin:4px 0 10px">' +
      P.map(p => '<option value="' + SX.esc(p.id) + '"' + (s.provider === p.id ? " selected" : "") + ">" +
        SX.esc(p.name) + "</option>").join("") + "</select>" +
      '<div class="small">API Base</div>' +
      '<input type="text" id="sxBase" style="width:100%;margin:4px 0 10px" value="' + SX.esc(s.base) + '">' +
      '<div class="small">模型名</div>' +
      '<input type="text" id="sxModel" style="width:100%;margin:4px 0 10px" value="' + SX.esc(s.model) + '">' +
      '<div class="small">API Key</div>' +
      '<input type="text" id="sxKey" style="width:100%;margin:4px 0 12px" placeholder="sk-..." value="' + SX.esc(s.key) + '">' +
      '<div class="row" style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn primary sm" id="sxSave">保存</button>' +
      '<button class="btn sm" id="sxTest">测试连通</button>' +
      '<button class="btn ghost sm" id="sxBack">返回对话</button>' +
      '<span class="tiny muted" id="sxCfgStat"></span></div></div>';

    el("sxProv").onchange = () => {
      const p = P.find(x => x.id === el("sxProv").value);
      if (p) {
        el("sxBase").value = p.base || el("sxBase").value;
        el("sxModel").value = (p.models && p.models[0]) || el("sxModel").value;
      }
    };
    el("sxSave").onclick = () => {
      s.provider = el("sxProv").value;
      s.base = el("sxBase").value.trim();
      s.model = el("sxModel").value.trim();
      s.key = el("sxKey").value.trim();
      SX.save(); SX.toast("已保存到本机"); draw();
    };
    el("sxBack").onclick = draw;
    el("sxTest").onclick = async () => {
      el("sxCfgStat").textContent = "测试中…";
      try {
        const r = await call([{ role: "user", content: "回复两个字：正常" }], 0);
        el("sxCfgStat").textContent = "通了：" + String(r).slice(0, 30);
      } catch (e) {
        el("sxCfgStat").innerHTML = '<span style="color:var(--accent)">失败：' +
          SX.esc(String(e.message || e)).slice(0, 120) + "</span>";
      }
    };
  }

  function draw() {
    const body = el("sxBody");
    if (!body) return;
    const msgs = draft();
    if (!msgs.length) {
      const t = tutors().find(x => x.id === curTutor);
      body.innerHTML = '<div class="sxMsg sys"><div class="bub">当前角色：<b>' +
        SX.esc(t ? t.name : "导师") + "</b><br>" + SX.esc(t ? t.desc : "") +
        "</div></div>" +
        '<div class="sxMsg sys"><div class="bub">它知道你的水平、你的课题、你踩过的坑，直接问就行。' +
        "点「带上当前页面」会把当前关卡的题目和你写的代码一起发过去。</div></div>";
      return;
    }
    body.innerHTML = msgs.map(m =>
      '<div class="sxMsg ' + (m.role === "user" ? "me" : "ai") + '"><div class="bub">' +
      SX.esc(m.content) + "</div></div>").join("");
    body.scrollTop = body.scrollHeight;
  }

  async function call(messages, temp) {
    const s = SX.state.settings;
    const url = String(s.base || "").replace(/\/+$/, "") + "/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (s.key || "") },
      body: JSON.stringify({ model: s.model, messages: messages, temperature: temp, stream: false })
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error("HTTP " + res.status + "：" + t.slice(0, 160));
    }
    const j = await res.json();
    const c = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    return c || "（无回复内容）";
  }

  async function send() {
    if (busy) return;
    const s = SX.state.settings;
    const inp = el("sxIn");
    const text = (inp.value || "").trim();
    if (!text) return;
    if (!s.key && s.provider !== "xianfeng") {
      openCfg();
      SX.toast("先填一个 API Key（点「设置」）");
      return;
    }
    const t = tutors().find(x => x.id === curTutor);
    const msgs = draft();
    msgs.push({ role: "user", content: text });
    inp.value = "";
    busy = true;
    el("sxStat").textContent = "思考中…";
    draw();

    try {
      const payload = [{ role: "system", content: (t ? t.system : "你是生物信息学导师") }]
        .concat(msgs.slice(-12).map(m => ({ role: m.role, content: m.content })));
      const reply = await call(payload, s.temp);
      msgs.push({ role: "assistant", content: reply });
      SX.save(); draw();
      el("sxStat").textContent = "完成（" + reply.length + " 字）";
    } catch (e) {
      el("sxStat").innerHTML = '<span style="color:var(--accent)">失败：' +
        SX.esc(String(e.message || e)).slice(0, 100) + "</span>";
      msgs.push({ role: "assistant", content: "（请求失败）" + String(e.message || e) });
      draw();
    }
    busy = false;
  }

  /* 记录当前关卡，供上下文注入用 */
  function watchRoute() {
    const m = /^#\/dojo\/(.+)$/.exec(location.hash || "");
    if (m) SX.state.curLevel = m[1];
  }

  window.addEventListener("hashchange", watchRoute);
  document.addEventListener("DOMContentLoaded", () => { build(); watchRoute(); });
  if (document.readyState !== "loading") { build(); watchRoute(); }

  window.SXDock = { open: () => { build(); toggle(true); }, close: () => toggle(false) };
})();
