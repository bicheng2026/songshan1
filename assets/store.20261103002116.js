/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

/* 嵩山一号 · 工作站 —— 状态、存档、工具函数 */
(function () {
  "use strict";

  const KEY = "songshan1.state.v1";
  const DEFAULTS = {
    xp: 0,
    levels: {},          // levelId -> {done:true, code:"", at:"", runs:n}
    days: {},            // yyyy-mm-dd -> true
    drafts: {},          // 论文草稿 { title, sections:{} }
    snippets: {},        // 我的代码片段
    settings: {          // AI 导师
      provider: "deepseek",
      base: "https://api.deepseek.com/v1",
      model: "deepseek-chat",
      key: "",
      temp: 0.3
    },
    tutorChats: {},      // tutorId -> [{role, content}]
    codeDrafts: {},      // levelId -> code
    vaultMeta: []        // 上传数据集的元信息
  };

  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      const o = JSON.parse(raw);
      return Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), o);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { }
  }

  /* ---------------- 等级体系 ---------------- */
  const RANKS = [
    { xp: 0, name: "入门学徒", desc: "刚拿到 R 的钥匙" },
    { xp: 120, name: "数据搬运工", desc: "会读数据、会取子集" },
    { xp: 320, name: "差异分析匠", desc: "能自己跑通 DEG 与校正" },
    { xp: 620, name: "富集解读者", desc: "看得懂通路背后的生物学" },
    { xp: 1000, name: "单细胞游侠", desc: "能从 900 个细胞里认出谁是谁" },
    { xp: 1500, name: "因果推断者", desc: "知道相关不等于因果，也知道怎么逼近因果" },
    { xp: 2100, name: "老药猎手", desc: "能把靶点变成药" },
    { xp: 2800, name: "课题主笔", desc: "能独立写出一篇完整的 SCI" },
    { xp: 3700, name: "独立研究者", desc: "能自己提出问题并解决它" }
  ];
  function rankOf(xp) {
    let r = RANKS[0], next = null, i = 0;
    for (i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].xp) { r = RANKS[i]; next = RANKS[i + 1] || null; }
    }
    return { rank: r, next: next, idx: RANKS.indexOf(r) + 1 };
  }
  function progressPct(xp) {
    const r = rankOf(xp);
    if (!r.next) return 100;
    return Math.round((xp - r.rank.xp) / (r.next.xp - r.rank.xp) * 100);
  }

  /* ---------------- 进度 ---------------- */
  const ACHIEVEMENTS = [
    { id: "first_blood", name: "第一滴血", desc: "完成第一关", test: s => Object.keys(s.levels || {}).length >= 1 },
    { id: "bulk_master", name: "Bulk 通关", desc: "完成全部 Bulk RNA-seq 关卡", test: s => doneIn(s, "bulk") >= 5 },
    { id: "sc_master", name: "单细胞通关", desc: "完成全部单细胞关卡", test: s => doneIn(s, "scrna") >= 5 },
    { id: "mr_master", name: "因果推断者", desc: "完成全部孟德尔随机化关卡", test: s => doneIn(s, "mr") >= 4 },
    { id: "boss_down", name: "屠龙", desc: "击破终章 BOSS", test: s => (s.levels || {}).boss_1 && s.levels.boss_1.done },
    { id: "half", name: "半程", desc: "通关一半以上", test: s => Object.keys(s.levels || {}).length >= Math.ceil(totalLevels() / 2) },
    { id: "all_clear", name: "全通", desc: "全部关卡通过", test: s => Object.keys(s.levels || {}).length >= totalLevels() },
    { id: "writer", name: "动笔了", desc: "在写作台保存了第一段正文", test: s => Object.values((s.drafts || {})).some(d => d && Object.keys(d.sections || {}).length > 0) },
    { id: "streak3", name: "三日不断", desc: "连续 3 天进站", test: s => streakOf(s) >= 3 },
    { id: "xp1000", name: "千分", desc: "累计 1000 XP", test: s => (s.xp || 0) >= 1000 }
  ];
  function totalLevels() {
    return (window.SX_LEVELS || []).length;
  }
  function doneIn(s, track) {
    return (window.SX_LEVELS || []).filter(l => l.track === track && (s.levels || {})[l.id] && s.levels[l.id].done).length;
  }
  function doneCount(s) {
    return Object.values((s || S).levels || {}).filter(x => x.done).length;
  }
  function streakOf(s) {
    const days = Object.keys((s || S).days || {}).sort().reverse();
    if (!days.length) return 0;
    let n = 0;
    const today = new Date();
    for (let i = 0; i < 400; i++) {
      const d = new Date(today.getTime() - i * 86400000);
      const k = d.toISOString().slice(0, 10);
      if (days.indexOf(k) >= 0) n++;
      else if (i > 0) break;
    }
    return n;
  }
  function touchDay() {
    const k = new Date().toISOString().slice(0, 10);
    S.days[k] = true; save();
  }

  function award(levelId, xp, code) {
    if (!S.levels[levelId]) S.levels[levelId] = { done: false, at: "", runs: 0 };
    const L = S.levels[levelId];
    L.runs = (L.runs || 0) + 1;
    if (!L.done) {
      L.done = true;
      L.at = new Date().toISOString();
      S.xp += xp;
    }
    if (code) S.codeDrafts[levelId] = code;
    save();
    return { gained: xp, total: S.xp };
  }
  function achieved() {
    return ACHIEVEMENTS.filter(a => { try { return a.test(S); } catch (e) { return false; } });
  }
  function isUnlocked(levelId) {
    const ls = window.SX_LEVELS || [];
    const i = ls.findIndex(l => l.id === levelId);
    if (i <= 0) return true;
    const prev = ls[i - 1];
    return !!(S.levels[prev.id] && S.levels[prev.id].done) || !!(S.levels[levelId] && S.levels[levelId].done);
  }

  /* ---------------- 数据仓库（IndexedDB，存大表） ---------------- */
  const DB_NAME = "songshan_vault";
  let dbp = null;
  function idb() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("tables")) db.createObjectStore("tables", { keyPath: "id" });
      };
      r.onsuccess = e => res(e.target.result);
      r.onerror = e => rej(e);
    });
    return dbp;
  }
  async function vaultPut(rec) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction("tables", "readwrite");
      tx.objectStore("tables").put(rec);
      tx.oncomplete = () => { refreshMeta(); res(true); };
      tx.onerror = rej;
    });
  }
  async function vaultGet(id) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction("tables", "readonly");
      const q = tx.objectStore("tables").get(id);
      q.onsuccess = () => res(q.result); q.onerror = rej;
    });
  }
  async function vaultAll() {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction("tables", "readonly");
      const q = tx.objectStore("tables").getAll();
      q.onsuccess = () => res(q.result || []); q.onerror = rej;
    });
  }
  async function vaultDel(id) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction("tables", "readwrite");
      tx.objectStore("tables").delete(id);
      tx.oncomplete = () => { refreshMeta(); res(true); }; tx.onerror = rej;
    });
  }
  async function refreshMeta() {
    try { const a = await vaultAll(); S.vaultMeta = a.map(x => ({ id: x.id, name: x.name, rows: x.rows, cols: x.cols, at: x.at })); save(); }
    catch (e) { }
  }

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function copy(text) {
    try {
      navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) { return false; }
      document.body.removeChild(ta); return true;
    }
  }
  function download(name, text, mime) {
    const b = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg; t.style.display = "block";
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.style.display = "none"; }, 2200);
  }
  function md(s) {
    if (!s) return "";
    let h = esc(s);
    h = h.replace(/^### (.*)$/gm, "<h4>$1</h4>")
      .replace(/^## (.*)$/gm, "<h3>$1</h3>")
      .replace(/^# (.*)$/gm, "<h2>$1</h2>")
      .replace(/^&gt; (.*)$/gm, "<blockquote>$1</blockquote>")
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/`(.+?)`/g, "<code class='inline'>$1</code>")
      .replace(/^- (.*)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      .replace(/\n/g, "<br>");
    return h;
  }
  function debounce(fn, ms) {
    let t; return function () { clearTimeout(t); t = setTimeout(fn, ms || 300); };
  }

  /* ---------------- 导出 ---------------- */
  window.SX = {
    get state() { return S; },
    save, rankOf, progressPct, award, achieved, isUnlocked, doneCount, totalLevels,
    streakOf, touchDay, copy, download, toast, esc, md, debounce,
    vaultPut, vaultGet, vaultAll, vaultDel, refreshMeta,
    RANKS, ACHIEVEMENTS,
    reset() { S = JSON.parse(JSON.stringify(DEFAULTS)); save(); location.reload(); }
  };
  window.SX.touchDay();
})();
