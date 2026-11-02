/* 嵩山一号 · 工作站 —— 代码库 / 论文库 / 知识库 / 我的代码本 / 数据中心 / 数据仓库 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  function head(t, p) {
    return '<div class="page-head"><h2>' + t + "</h2><p>" + p + "</p></div>";
  }
  function searchBar(id, ph) {
    return '<div class="search-bar"><input type="search" id="' + id + '" placeholder="' + ph + '"></div>';
  }

  /* 横条图：rows = [{k, v, s?}]，给了 s 就在数字后面接 "/s" */
  function vizBars(rows) {
    const max = Math.max.apply(null, rows.map(r => r.v).concat([1]));
    return '<div class="viz">' + rows.map(r =>
      '<div class="viz-r"><span class="viz-k">' + E(r.k) + "</span>" +
      '<span class="viz-b"><i style="width:' + Math.max(3, Math.round(r.v / max * 100)) + '%"></i></span>' +
      '<span class="viz-v">' + r.v + (r.s === undefined ? "" : "/" + r.s) + "</span></div>").join("") + "</div>";
  }

  /* 大块数据懒加载：进入对应页面时才拉，首屏保持轻 */
  const lazyCache = {};
  function ensure(globalName, src) {
    if (window[globalName] !== undefined) return Promise.resolve();
    if (!lazyCache[globalName]) {
      lazyCache[globalName] = new Promise(resolve => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => { window[globalName] = []; resolve(); };
        document.head.appendChild(s);
      });
    }
    return lazyCache[globalName];
  }

  /* ==================== 代码库 ==================== */
  function codebank(root) {
    root.innerHTML = head("代码库", "正在载入代码模板…");
    ensure("SX_CODEBANK2", "data/codebank2.261102194635.js").then(() => codebankDraw(root));
  }

  function codebankDraw(root) {
    const A = window.SX_CODEBANK || [];
    const B = window.SX_CODEBANK2 || [];
    const C = window.SX_CODEBANK3 || [];
    const seen = {};
    const all = [];
    A.concat(B).concat(C).forEach(x => {
      if (seen[x.id]) return;
      seen[x.id] = 1; all.push(x);
    });
    const tk = {};
    all.forEach(x => tk[x.trackName || x.track] = (tk[x.trackName || x.track] || 0) + 1);
    let filt = "ALL", q = "";

    function draw() {
      const list = all.filter(x => (filt === "ALL" || x.track === filt) &&
        (!q || (x.title + x.scene + (x.packages || []).join(" ") + (x.tags || []).join(" ")).toLowerCase().indexOf(q) >= 0));
      const chips = Object.keys(tk).map(k =>
        '<button class="btn sm" data-t="' + E(all.find(x => (x.trackName || x.track) === k).track) + '"' +
        ' style="' + (filt === all.find(x => (x.trackName || x.track) === k).track ? "background:var(--brand);color:#fff;border-color:var(--brand)" : "") + '">' +
        E(k) + " (" + tk[k] + ")</button>").join(" ");

      root.innerHTML = head("代码库", "共 " + all.length + " 段 R 模板，写明何时用、依赖哪些包。") +
        '<div class="search-bar" style="gap:4px"><button class="btn sm" data-t="ALL"' +
        (filt === "ALL" ? ' style="background:var(--brand);color:#fff;border-color:var(--brand)"' : "") +
        '>全部 (' + all.length + ")</button>" + chips + "</div>" +
        searchBar("qCode", "搜索标题 / 关键词 / 包名，例如 DESeq2、harmony、LASSO、ggpubr") +
        '<div class="grid g2" id="cbList"></div>';

      const box = document.getElementById("cbList");
      box.innerHTML = list.map(x => cardOf(x)).join("") ||
        '<div class="card muted">没有匹配的模板。</div>';
      box.querySelectorAll("[data-copy]").forEach(b => {
        b.onclick = () => {
          const it = all.find(y => y.id === b.getAttribute("data-copy"));
          SX.copy(it.code); SX.toast("已复制：" + it.title);
        };
      });
      box.querySelectorAll("[data-dl]").forEach(b => {
        b.onclick = () => {
          const it = all.find(y => y.id === b.getAttribute("data-dl"));
          SX.download(it.id + ".R", "# " + it.title + "\n# " + it.scene + "\n\n" + it.code);
        };
      });
      root.querySelectorAll("[data-t]").forEach(b => {
        b.onclick = () => { filt = b.getAttribute("data-t"); draw(); };
      });
      const inp = document.getElementById("qCode");
      inp.value = q;
      inp.oninput = SX.debounce(() => { q = inp.value.trim().toLowerCase(); draw(); const i2 = document.getElementById("qCode"); i2.focus(); }, 250);
    }

    function cardOf(x) {
      return '<div class="card" style="display:flex;flex-direction:column;gap:6px">' +
        '<div style="display:flex;gap:6px;align-items:flex-start;justify-content:space-between">' +
        "<b style=\"font-size:calc(16px * var(--fs))\">" + E(x.title) + "</b>" +
        '<span class="tag n">' + E(x.level || "") + "</span></div>" +
        '<div class="small muted">' + E(x.scene || "") + "</div>" +
        '<div>' + (x.packages || []).map(p => '<span class="tag">' + E(p) + "</span>").join(" ") + "</div>" +
        "<pre class='code' style=\"max-height:200px\">" + E(x.code) + "</pre>" +
        (x.notes && x.notes.length ? '<details class="acc"><summary>要点</summary>' +
          x.notes.map(n => "<div class=\"small\">· " + E(n) + "</div>").join("") + "</details>" : "") +
        (x.pitfalls && x.pitfalls.length ? '<div class="note warn small" style="margin:4px 0 0">' +
          x.pitfalls.map(n => "<div>· " + E(n) + "</div>").join("") + "</div>" : "") +
        '<div class="toolbar" style="margin-top:auto">' +
        '<button class="btn sm primary" data-copy="' + x.id + '">复制代码</button>' +
        '<button class="btn sm" data-dl="' + x.id + '">下载 .R</button>' +
        "</div></div>";
    }
    draw();
  }

  /* ==================== 论文库 ==================== */
  function papers(root) {
    root.innerHTML = head("论文库", "正在载入论文库（3000+ 篇，首次约 1-2 秒）…");
    ensure("SX_PAPERS2", "data/papers2.261102194635.js").then(() => papersDraw(root));
  }

  function papersDraw(root) {
    // 两批合并：第一批是洪扬刚论文全清单，第二批是分主题检索的扩充库
    const A = window.SX_PAPERS || [];
    const B = window.SX_PAPERS2 || [];
    const seen = {};
    const ps = [];
    A.concat(B).forEach(p => {
      const k = (p.doi || p.title || "").toLowerCase();
      if (!k || seen[k]) return;
      seen[k] = 1;
      ps.push(p);
    });

    let q = "", tag = "ALL", field = "ALL", onlyArticle = false, sortBy = "cited", limit = 300, years = 0;

    const tags = {}, fields = {};
    ps.forEach(p => {
      (p.tags || []).forEach(t => tags[t] = (tags[t] || 0) + 1);
      fields[p.field] = (fields[p.field] || 0) + 1;
    });
    const tagList = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
    const fieldList = Object.keys(fields).sort((a, b) => fields[b] - fields[a]);
    const totalCited = ps.reduce((a, b) => a + (b.cited || 0), 0);

    /* 年份按 5 年一档、领域取前 7，都出横条图 */
    function yearRows() {
      const b = {};
      ps.forEach(p => { if (!p.year) return; const k = Math.floor(p.year / 5) * 5; b[k] = (b[k] || 0) + 1; });
      const ks = Object.keys(b).map(Number).sort((x, y) => y - x).slice(0, 8);
      return ks.map(k => ({ k: k + "–" + String(k + 4).slice(2), v: b[k] }));
    }
    function fieldRows() {
      return fieldList.slice(0, 7).map(f => ({ k: f.length > 8 ? f.slice(0, 8) : f, v: fields[f] }));
    }
    function draw() {
      let list = ps.filter(p =>
        (!q || (p.title + " " + (p.titleCn || "") + " " + (p.journal || "") + " " + (p.authors || "") +
          " " + (p.tags || []).join(" ")).toLowerCase().indexOf(q) >= 0) &&
        (tag === "ALL" || (p.tags || []).indexOf(tag) >= 0) &&
        (field === "ALL" || p.field === field) &&
        (!years || (p.year && (2026 - p.year) <= years)) &&
        (!onlyArticle || p.type === "Article"));

      if (sortBy === "cited") list = list.slice().sort((a, b) => (b.cited || 0) - (a.cited || 0));
      else if (sortBy === "year") list = list.slice().sort((a, b) => (b.year || 0) - (a.year || 0));
      else if (sortBy === "if") list = list.slice().sort((a, b) => (b.ifValue || 0) - (a.ifValue || 0));

      const shown = list.slice(0, limit);
      root.innerHTML =
        head("论文库",
          "共 " + ps.length + " 篇，按方法标签反查。学方法，不学做法。") +
        '<div class="card" style="margin-bottom:16px">' +
        '<div class="small"><b>' + ps.length + "</b> 篇 · 合计被引 <b>" + totalCited.toLocaleString() +
        "</b> 次 · " + fieldList.length + " 个领域 · " + tagList.length + " 个方法标签</div>" +
        '<div class="viz-split" style="margin-top:4px">' +
        '<div><div class="viz-h">按年份 · 篇数</div>' + vizBars(yearRows()) + '</div>' +
        '<div><div class="viz-h">按领域 · 篇数</div>' + vizBars(fieldRows()) + '</div>' +
        '</div>' +
        '<div style="margin-top:14px">' +
        tagList.slice(0, 18).map(k =>
          '<span class="tag g">' + E(k) + " ×" + tags[k] + "</span>").join(" ") + "</div></div>" +
        '<div class="search-bar">' +
        '<input type="search" id="qP" placeholder="搜索标题、期刊、作者、方法关键词，例如 ferroptosis、spatial、J Hepatol">' +
        '<select id="fTag"><option value="ALL">全部方法</option>' +
        tagList.map(t => '<option value="' + E(t) + '"' + (tag === t ? " selected" : "") + ">" + E(t) + " (" + tags[t] + ")</option>").join("") +
        "</select>" +
        '<select id="fField"><option value="ALL">全部领域</option>' +
        fieldList.map(t => '<option value="' + E(t) + '"' + (field === t ? " selected" : "") + ">" + E(t) + " (" + fields[t] + ")</option>").join("") +
        "</select>" +
        '<select id="fSort">' +
        '<option value="cited"' + (sortBy === "cited" ? " selected" : "") + ">按被引排序</option>" +
        '<option value="year"' + (sortBy === "year" ? " selected" : "") + ">按年份排序</option>" +
        '<option value="if"' + (sortBy === "if" ? " selected" : "") + ">按 IF 排序</option>" +
        "</select>" +
        '<select id="fYear">' +
        '<option value="0"' + (years === 0 ? " selected" : "") + ">全部年份</option>" +
        '<option value="1"' + (years === 1 ? " selected" : "") + ">今年</option>" +
        '<option value="3"' + (years === 3 ? " selected" : "") + ">近 3 年</option>" +
        '<option value="5"' + (years === 5 ? " selected" : "") + ">近 5 年</option>" +
        '<option value="10"' + (years === 10 ? " selected" : "") + ">近 10 年</option>" +
        "</select>" +
        '<label class="small"><input type="checkbox" id="fArt"' + (onlyArticle ? " checked" : "") + "> 只看研究论文</label>" +
        "</div>" +
        '<div class="small muted" style="margin-bottom:8px">命中 <b>' + list.length + "</b> 篇，当前显示前 " +
        Math.min(limit, list.length) + " 篇。" +
        (list.length > limit ? "筛选更细一点能看全。" : "") + "</div>" +
        '<div class="scroll"><table class="tbl" id="pTbl"></table></div>' +
        (list.length > limit ? '<button class="btn" id="moreBtn" style="margin-top:12px">再显示 300 篇</button>' : "") +
        '<div class="small muted" style="margin-top:8px">IF 只对确有把握的期刊填了值，其余显示 —，不做猜测。</div>';

      const t = document.getElementById("pTbl");
      t.innerHTML = '<thead><tr><th style="width:44%">标题</th><th>期刊</th><th>年</th><th>被引</th><th>IF</th><th>领域</th><th>方法标签</th></tr></thead><tbody>' +
        shown.map(p => {
          const link = p.doi ? "https://doi.org/" + p.doi : "https://pubmed.ncbi.nlm.nih.gov/?term=" + encodeURIComponent(p.title);
          return "<tr>" +
            '<td><a href="' + E(link) + '" target="_blank" rel="noopener">' + E(p.title.length > 120 ? p.title.slice(0, 120) + "…" : p.title) + "</a></td>" +
            "<td>" + E(p.journal || "—") + "</td><td>" + (p.year || "—") + "</td>" +
            "<td>" + (p.cited || 0) + "</td><td>" + (p.ifValue || "—") + "</td>" +
            '<td><span class="tag n">' + E(p.field || "—") + "</span></td>" +
            "<td>" + (p.tags || []).map(x => '<span class="tag">' + E(x) + "</span>").join(" ") + "</td>" +
            "</tr>";
        }).join("") + "</tbody>";

      const qi = document.getElementById("qP");
      if (qi) {
        qi.value = q;
        qi.oninput = SX.debounce(() => {
          q = document.getElementById("qP").value.trim().toLowerCase(); limit = 300; draw();
          const el = document.getElementById("qP"); if (el) el.focus();
        }, 300);
      }
      document.getElementById("fTag").onchange = e => { tag = e.target.value; limit = 300; draw(); };
      document.getElementById("fField").onchange = e => { field = e.target.value; limit = 300; draw(); };
      document.getElementById("fSort").onchange = e => { sortBy = e.target.value; draw(); };
      document.getElementById("fYear").onchange = e => { years = +e.target.value; limit = 300; draw(); };
      document.getElementById("fArt").onchange = e => { onlyArticle = e.target.checked; limit = 300; draw(); };
      const mb = document.getElementById("moreBtn");
      if (mb) mb.onclick = () => { limit += 300; draw(); };
    }
    draw();
  }

  /* ==================== 套路拆解 ==================== */
  /* 每个套路挂的代表作不写死：按标题关键词从论文库实时匹配，按被引取前 4 篇，
     所以不会出现编出来的 DOI。 */
  function patRefs(keys, n) {
    const all = (window.SX_PAPERS || []).concat(window.SX_PAPERS2 || []);
    const seen = {};
    const hit = [];
    all.forEach(p => {
      const t = String(p.title || "").toLowerCase();
      if (!keys.some(k => t.indexOf(k) >= 0)) return;
      const id = (p.doi || t).toLowerCase();
      if (seen[id]) return;
      seen[id] = 1;
      hit.push(p);
    });
    hit.sort((a, b) => (b.cited || 0) - (a.cited || 0));
    return hit.slice(0, n);
  }

  function playbook(root) {
    root.innerHTML = head("套路拆解", "正在匹配代表作…");
    ensure("SX_PAPERS2", "data/papers2.261102194635.js").then(() => playbookDraw(root));
  }

  function playbookDraw(root) {
    const P = window.SX_PATTERNS || { items: [], redlines: [] };
    const items = P.items || [];

    root.innerHTML = head("套路拆解", (items.length) + " 条通用骨架，每条挂几篇真代表作。") +
      (P.intro ? '<div class="note">' + E(P.intro) + "</div>" : "") +
      items.map((it, i) => {
        const refs = patRefs(it.keys || [], 4);
        return '<details class="acc pat"' + (i === 0 ? " open" : "") + ">" +
          "<summary><b>" + E(it.name) + "</b>" +
          '<span class="tag n">' + E(it.tag || "") + "</span></summary>" +
          '<div class="small muted" style="margin:-4px 0 10px">' + E(it.one || "") + "</div>" +
          '<ol class="pat-steps">' + (it.steps || []).map(x => "<li>" + E(x) + "</li>").join("") + "</ol>" +
          (it.pitfall ? '<div class="note warn small" style="margin:10px 0 0">坑：' + E(it.pitfall) + "</div>" : "") +
          (refs.length
            ? '<div class="pat-refs"><div class="viz-h" style="margin:14px 0 6px">代表作 · ' + refs.length + " 篇</div>" +
              refs.map(p => {
                const doi = String(p.doi || "").replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
                const u = doi ? "https://doi.org/" + doi : "https://pubmed.ncbi.nlm.nih.gov/?term=" + encodeURIComponent(p.title || "");
                const meta = [p.journal, p.year, p.cited ? "被引 " + p.cited : ""].filter(Boolean).join(" · ");
                return '<div class="pat-ref"><a href="' + E(u) + '" target="_blank" rel="noopener">' +
                  E(String(p.title || "").replace(/\.$/, "")) + "</a>" +
                  '<span class="muted"> — ' + E(meta) + "</span></div>";
              }).join("") + "</div>"
            : "") +
          "</details>";
      }).join("") +
      ((P.redlines || []).length
        ? '<div class="card" style="margin-top:18px"><b style="color:var(--accent)">四条红线</b>' +
          P.redlines.map(r => '<div style="margin:10px 0"><b class="small">· ' + E(r.t) + "</b>" +
            '<div class="small muted">' + E(r.d) + "</div></div>").join("") + "</div>"
        : "");
  }

  /* ==================== 知识库 ==================== */
  function knowledge(root) {
    root.innerHTML = head("知识库", "正在载入机制条目…");
    ensure("SX_KNOWLEDGE2", "data/knowledge2.261102194635.js").then(() => knowledgeDraw(root));
  }

  /* 机制条目的真实参考文献：data/know_cite.261102194635.js（Europe PMC 检索所得）*/
  function refsOf(id) {
    const C = window.SX_KNOW_CITE || {};
    return C[id] || [];
  }
  function refsHtml(id) {
    const rs = refsOf(id);
    if (!rs.length) return "";
    return '<div class="note info" style="margin-top:10px"><b class="small">参考文献（真实可查）</b>' +
      rs.map(r => {
        const link = r.doi ? "https://doi.org/" + r.doi
          : (r.pmid ? "https://pubmed.ncbi.nlm.nih.gov/" + r.pmid + "/" : "");
        const t = E(r.title || "").replace(/\.$/, "");
        const meta = [r.journal, r.year, r.cited ? "被引 " + r.cited : ""].filter(Boolean).join(" · ");
        return '<div class="small" style="margin-top:4px">· ' +
          (link ? '<a href="' + E(link) + '" target="_blank" rel="noopener">' + t + "</a>" : t) +
          '<span class="muted"> — ' + E(meta) + "</span></div>";
      }).join("") + "</div>";
  }

  function knowledgeDraw(root) {
    const K = (window.SX_KNOWLEDGE || []).concat(window.SX_KNOWLEDGE2 || [], window.SX_KNOWLEDGE3 || [], window.SX_KNOWLEDGE4 || [], window.SX_KNOWLEDGE5 || []);
    const dom = {};
    K.forEach(x => dom[x.domainName || x.domain] = x.domain);
    let curDom = "ALL", q = "", openId = null;

    /* 每个域多少条、其中几条挂了真实文献 */
    function domStat() {
      return Object.keys(dom).map(n => {
        const items = K.filter(x => x.domain === dom[n]);
        return { k: n.length > 7 ? n.slice(0, 7) : n, v: items.length, s: items.filter(x => refsOf(x.id).length).length };
      }).sort((a, b) => b.v - a.v);
    }

    function draw() {
      const list = K.filter(x => (curDom === "ALL" || x.domain === curDom) &&
        (!q || (x.title + x.summary + x.body + (x.tags || []).join(" ")).toLowerCase().indexOf(q) >= 0));
      root.innerHTML = head("知识库", "共 " + K.length + " 条机制条目，每条带【和生信分析的连接】。") +
        '<div class="card" style="margin-bottom:18px">' +
        '<div class="viz-h" style="margin-top:0">' + Object.keys(dom).length + ' 个域 · 条目数 / 其中挂真实文献</div>' +
        vizBars(domStat()) + "</div>" +
        '<div class="search-bar">' +
        Object.keys(dom).map(n => '<button class="btn sm" data-d="' + E(dom[n]) + '"' +
          (curDom === dom[n] ? ' style="background:var(--brand);color:#fff;border-color:var(--brand)"' : "") + ">" +
          E(n) + " (" + K.filter(x => x.domain === dom[n]).length + ")</button>").join(" ") +
        "</div>" +
        searchBar("qK", "搜索机制关键词，例如 YAP、铁死亡、zone、p53、FDR、共定位") +
        '<div id="kList" class="grid g2"></div>';

      document.getElementById("kList").innerHTML = list.map(x =>
        '<div class="card" data-id="' + E(x.id) + '">' +
        '<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">' +
        "<b style=\"font-size:calc(16px * var(--fs))\">" + E(x.title) + "</b>" +
        '<span class="tag n">' + E(x.level || "") + "</span>" +
        (refsOf(x.id).length ? '<span class="tag g" title="已挂真实文献">文献</span>' : "") + "</div>" +
        '<div class="small" style="margin:4px 0;color:var(--brand)">' + E(x.summary || "") + "</div>" +
        '<div class="small muted">' + (x.tags || []).map(t => '<span class="tag">' + E(t) + "</span>").join(" ") + "</div>" +
        (openId === x.id ?
          '<div class="markdown-body" style="margin-top:10px;font-size:calc(15px * var(--fs))">' + SX.md(x.body || "") + "</div>" +
          (x.keyPoints ? '<div style="margin-top:8px"><b class="small">要点</b>' +
            x.keyPoints.map(k => '<div class="small">· ' + E(k) + "</div>").join("") + "</div>" : "") +
          (x.testYourself ? '<div class="note" style="margin-top:8px"><b class="small">自测：</b>' + E(x.testYourself) + "</div>" : "") +
          refsHtml(x.id) +
          '<button class="btn sm ghost" data-close="1">收起</button>'
          : '<button class="btn sm" data-open="' + E(x.id) + '" style="margin-top:8px">展开全文</button>') +
        "</div>").join("") || '<div class="card muted">没有匹配条目。</div>';

      document.querySelectorAll("[data-d]").forEach(b => b.onclick = () => { curDom = b.getAttribute("data-d"); draw(); });
      document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { openId = b.getAttribute("data-open"); draw(); });
      document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => { openId = null; draw(); });
      const inp = document.getElementById("qK");
      inp.value = q;
      inp.oninput = SX.debounce(() => { q = inp.value.trim().toLowerCase(); draw(); const i2 = document.getElementById("qK"); i2.focus(); }, 250);
    }
    draw();
  }

  /* ==================== 我的代码本 ==================== */
  function scripts(root) {
    const M = window.SX_MYSCRIPTS || [];
    const SK = window.SX_SKILLMAP || [];
    const G = window.SX_GEMS || [];
    let q = "";
    root.innerHTML = head("我的代码本",
      "77 个 .R 文件，去重后 " + M.length + " 份。") +
      '<div class="card" style="margin-bottom:12px"><b>掌握度矩阵</b>' +
      SK.map(s => '<div class="kv" style="margin:6px 0"><dt style="min-width:76px"><span class="tag ' +
        (s.level === "已掌握" ? "g" : (s.level === "工程短板" || s.level === "未接触" ? "r" : "y")) + '">' +
        E(s.level) + "</span></dt><dd class=\"small\">" + E(s.items) +
        (s.note ? ' <span class="muted">（' + E(s.note) + "）</span>" : "") + "</dd></div>").join("") + "</div>" +
      '<div class="note info"><b>踩坑金句（任何教程里都查不到的那种）</b>' +
      G.map(g => "<div class=\"small\">· " + E(g) + "</div>").join("") + "</div>" +
      searchBar("qM", "搜索路径、主题、包名") +
      '<div id="mList" class="grid g2"></div>';

    function draw() {
      const list = M.filter(x => !q || (x.path + x.title + x.summary + (x.packages || []).join(" ").toLowerCase()).indexOf(q) >= 0);
      document.getElementById("mList").innerHTML = list.map(x =>
        '<div class="card" style="display:flex;flex-direction:column;gap:6px">' +
        '<div style="display:flex;justify-content:space-between;gap:6px;align-items:flex-start">' +
        "<b style=\"font-size:calc(16px * var(--fs))\">" + E(x.title) + "</b>" +
        '<span class="tag ' + (x.maturity === "跑通" ? "g" : (x.maturity === "未验证" ? "r" : "y")) + '">' + E(x.maturity) + "</span></div>" +
        '<div class="tiny muted" style="font-family:var(--mono);word-break:break-all">' + E(x.path) + "</div>" +
        '<div class="tiny muted">' + (x.kb ? x.kb + " KB / " : "") + (x.lines ? x.lines + " 行" : "") +
        ' · <span class="tag n">' + E(x.trackName || x.track) + "</span></div>" +
        (x.summary ? '<div class="small">' + E(x.summary) + "</div>" : "") +
        (x.packages && x.packages.length ? '<div>' + x.packages.map(p => '<span class="tag">' + E(p) + "</span>").join(" ") + "</div>" : "") +
        (x.pitfalls && x.pitfalls.length ? '<div class="note bad small" style="margin:4px 0 0">' +
          x.pitfalls.map(p => "<div>· " + E(p) + "</div>").join("") + "</div>" : "") +
        '<div class="toolbar" style="margin-top:auto">' +
        '<button class="btn sm" data-path="' + E(x.path) + '">复制路径</button></div>' +
        "</div>").join("") || '<div class="card muted">没有匹配。</div>';
      document.querySelectorAll("[data-path]").forEach(b => b.onclick = () => { SX.copy(b.getAttribute("data-path")); SX.toast("路径已复制"); });
    }
    draw();
    document.getElementById("qM").oninput = SX.debounce(() => {
      q = document.getElementById("qM").value.trim().toLowerCase(); draw();
    }, 250);
  }

  /* ==================== 学习路径（课程包） ==================== */
  function paths(root) {
    const P = window.SX_PATHS || [];
    const C = window.SX_COURSE || { chapters: [] };
    const allCH = (window.SX_COURSE0 ? [window.SX_COURSE0] : []).concat(C.chapters || []);
    const titleOf = id => {
      const ch = allCH.find(x => x.id === id);
      return ch ? ch.title.replace(/^第 \d+ 讲　?/, "") : id;
    };
    if (!P.length) { root.innerHTML = '<div class="card">学习路径数据没加载。</div>'; return; }
    let cur = P[0].id;
    function draw() {
      const p = P.find(x => x.id === cur) || P[0];
      root.innerHTML = head("学习路径", "接到某类需求时，按这里串好的顺序点开课程，就是一套完整分析骨架。") +
        '<div class="search-bar">' + P.map(p2 =>
          '<button class="btn sm" data-p="' + E(p2.id) + '"' +
          (cur === p2.id ? ' style="background:var(--brand);color:#fff;border-color:var(--brand)"' : "") +
          ">" + E(p2.title) + "</button>").join(" ") + "</div>" +
        '<div class="card" style="margin-top:14px">' +
        "<h3 style=\"margin-top:0\">" + E(p.title) + "</h3>" +
        '<div class="lec-plain">' + E(p.plain) + "</div>" +
        (p.goal ? '<div class="lec-goal">走完这条路径你能：<ul style="margin:6px 0 0 18px;padding:0;list-style:disc">' +
          p.goal.map(g => '<li style="margin:2px 0">' + E(g) + "</li>").join("") + "</ul></div>" : "") +
        '<ol style="margin:14px 0 0;padding:0;list-style:none">' +
        p.steps.map((s, i) =>
          '<li style="display:flex;gap:12px;align-items:flex-start;padding:12px;border:1px solid var(--line);border-radius:8px;margin-bottom:10px;background:var(--panel)">' +
          '<span style="flex:0 0 26px;height:26px;border-radius:50%;background:var(--brand);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">' + (i + 1) + "</span>" +
          '<div style="flex:1"><b>' + E(titleOf(s.course)) + "</b>" +
          '<div class="small muted" style="margin:4px 0 8px">' + E(s.note) + "</div>" +
          '<a class="btn sm" href="#/course" data-go-course="' + E(s.course) + '">去学习 ↗</a></div></li>'
        ).join("") + "</ol></div>";
      document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { cur = b.getAttribute("data-p"); draw(); });
      document.querySelectorAll("[data-go-course]").forEach(a => a.onclick = () => {
        window.__sxFocusCourse = a.getAttribute("data-go-course");
      });
    }
    draw();
  }

  /* ==================== 数据中心 ==================== */
  // 数据源清单已外置到 data/sources.261102194635.js（window.SX_SOURCES），便于持续扩充
  const SOURCES = window.SX_SOURCES || [];
  function data(root) {
    const D = window.SX_DATA || {};
    const keys = window.SX_DATA_KEYS || Object.keys(D);
    const totalSrc = SOURCES.reduce((a, g) => a + g.items.length, 0);
    let q = "", openG = {};

    function draw() {
      const ql = q.trim().toLowerCase();
      const hit = (it) => !ql || (it.n + " " + it.d + " " + it.u).toLowerCase().indexOf(ql) >= 0;

      const srcHtml = SOURCES.map((g, gi) => {
        const items = g.items.filter(hit);
        if (!items.length) return "";
        const open = ql ? true : openG[gi] !== false;
        return '<div class="card" style="margin-top:16px">' +
          '<div class="src-head" data-g="' + gi + '">' +
          "<b>" + E(g.g) + '</b><span class="tiny muted">' + items.length + " 个</span>" +
          '<span class="tiny muted">' + (open ? "收起" : "展开") + "</span></div>" +
          '<div class="src-body"' + (open ? "" : ' style="display:none"') + ">" +
          items.map(it => '<div class="ds-row">' +
            "<div><b>" + E(it.n) + "</b>" +
            '<div class="small muted">' + E(it.d) + "</div>" +
            '<div class="tiny"><a href="' + E(it.u) + '" target="_blank" rel="noopener">' + E(it.u) + "</a></div></div>" +
            '<div class="toolbar">' +
            '<a class="btn sm" href="' + E(it.u) + '" target="_blank" rel="noopener">打开</a>' +
            (it.r ? '<button class="btn sm" data-rcode="' + E(it.n) + '">R 代码</button>' : "") +
            "</div></div>").join("") + "</div></div>";
      }).join("");

      root.innerHTML = head("数据中心",
        keys.length + " 个练习数据集，" + totalSrc + " 个公共数据源。") +
        '<div class="card"><b>内置练习数据集</b>' +
        '<div class="small muted" style="margin:4px 0 10px">这些是造出来的教学数据，结构和真实数据一致，可以离线跑。</div>' +
        keys.map(k => {
          const rows = (D[k].csv || "").split("\n").length - 1;
          return '<div class="ds-row">' +
            "<div><b>" + E(k) + "</b>" +
            '<div class="small muted">' + E(D[k].desc) + " · " + rows + " 行</div></div>" +
            '<div class="toolbar">' +
            '<button class="btn sm" data-prev="' + E(k) + '">预览</button>' +
            '<button class="btn sm" data-dl="' + E(k) + '">下载 CSV</button>' +
            '<button class="btn sm" data-code="' + E(k) + '">R 读取代码</button>' +
            "</div></div>";
        }).join("") +
        '<div id="dsPrev"></div></div>' +
        '<div class="search-bar" style="margin-top:20px">' +
        '<input type="search" id="qSrc" placeholder="搜数据源，例如 单细胞、甲基化、药物敏感、肝癌、eQTL">' +
        "</div>" + srcHtml;

      const qi = document.getElementById("qSrc");
      qi.value = q;
      qi.oninput = SX.debounce(() => {
        q = document.getElementById("qSrc").value;
        draw();
        const el = document.getElementById("qSrc");
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      }, 300);

      root.querySelectorAll(".src-head").forEach(h => h.onclick = () => {
        const gi = +h.getAttribute("data-g");
        openG[gi] = openG[gi] === false;
        draw();
      });

      const prev = document.getElementById("dsPrev");
      root.querySelectorAll("[data-prev]").forEach(b => b.onclick = () => {
        const k = b.getAttribute("data-prev");
        const lines = (D[k].csv || "").split("\n").slice(0, 6);
        prev.innerHTML = '<div class="small" style="margin-top:8px"><b>' + E(k) + "</b> 前 5 行：" +
          "<pre class='code' style=\"max-height:200px\">" + E(lines.join("\n")) + "</pre></div>";
      });
      root.querySelectorAll("[data-dl]").forEach(b => b.onclick = () => {
        const k = b.getAttribute("data-dl");
        SX.download(k + ".csv", D[k].csv, "text/csv;charset=utf-8");
      });
      root.querySelectorAll("[data-code]").forEach(b => b.onclick = () => {
        const k = b.getAttribute("data-code");
        const rn = k.indexOf("_expr") >= 0 ? ", row.names = 1" : "";
        SX.copy(k + " <- read.csv(\"data/" + k + ".csv\", stringsAsFactors = FALSE, check.names = FALSE" + rn + ")");
        SX.toast("读取代码已复制");
      });
      root.querySelectorAll("[data-rcode]").forEach(b => b.onclick = () => {
        const n = b.getAttribute("data-rcode");
        let code = "";
        SOURCES.forEach(g => g.items.forEach(it => { if (it.n === n) code = it.r; }));
        SX.copy(code); SX.toast("R 代码已复制");
      });
    }
    draw();
  }

  /* ==================== 数据仓库 ==================== */
  function vault(root) {
    root.innerHTML = head("我的数据仓库",
      "CSV 拖进来存本机浏览器，不上传。") +
      '<div class="card">' +
      '<div class="toolbar"><input type="file" id="vFile" accept=".csv,.tsv,.txt">' +
      '<button class="btn primary" id="vUp">上传并保存</button>' +
      '<span class="tiny muted">大文件建议先在本地切好再传；单个表建议 &lt; 20 MB</span></div>' +
      '<div id="vList" style="margin-top:10px"></div></div>';

    async function draw() {
      const all = await SX.vaultAll();
      document.getElementById("vList").innerHTML = all.length ?
        '<div class="scroll"><table class="tbl"><thead><tr><th>名称</th><th>行×列</th><th>保存时间</th><th>操作</th></tr></thead><tbody>' +
        all.map(x => "<tr><td><b>" + E(x.name) + "</b><div class=\"tiny muted\">" + E(x.id) + "</div></td>" +
          "<td>" + x.rows + " × " + x.cols + "</td><td class=\"tiny\">" + E(String(x.at || "").slice(0, 16)) + "</td>" +
          '<td><div class="toolbar">' +
          '<button class="btn sm" data-pv="' + E(x.id) + '">预览</button>' +
          '<button class="btn sm" data-rc="' + E(x.id) + '">R 代码</button>' +
          '<button class="btn sm" data-dl="' + E(x.id) + '">导出</button>' +
          '<button class="btn sm danger" data-rm="' + E(x.id) + '">删除</button>' +
          "</div></td></tr>").join("") + "</tbody></table></div><div id='vPrev'></div>"
        : '<div class="muted small">还没有存任何数据。</div>';

      document.querySelectorAll("[data-pv]").forEach(b => b.onclick = async () => {
        const r = await SX.vaultGet(b.getAttribute("data-pv"));
        document.getElementById("vPrev").innerHTML = '<div class="small" style="margin-top:8px"><b>前 5 行</b>' +
          "<pre class='code' style=\"max-height:200px\">" + E(String(r.csv).split("\n").slice(0, 6).join("\n")) + "</pre></div>";
      });
      document.querySelectorAll("[data-rc]").forEach(b => b.onclick = async () => {
        const r = await SX.vaultGet(b.getAttribute("data-rc"));
        SX.copy(r.name + " <- read.csv(\"" + r.name + ".csv\", stringsAsFactors = FALSE)\n# 共 " + r.rows + " 行 × " + r.cols + " 列");
        SX.toast("读取代码已复制");
      });
      document.querySelectorAll("[data-dl]").forEach(b => b.onclick = async () => {
        const r = await SX.vaultGet(b.getAttribute("data-dl"));
        SX.download(r.name + ".csv", r.csv, "text/csv;charset=utf-8");
      });
      document.querySelectorAll("[data-rm]").forEach(b => b.onclick = async () => {
        await SX.vaultDel(b.getAttribute("data-rm")); SX.toast("已删除"); draw();
      });
    }
    draw();

    document.getElementById("vUp").onclick = async () => {
      const f = document.getElementById("vFile").files[0];
      if (!f) { SX.toast("先选一个文件"); return; }
      const txt = await f.text();
      const sep = f.name.toLowerCase().endsWith(".tsv") ? "\t" : ",";
      const lines = txt.split(/\r?\n/).filter(x => x.length);
      const cols = lines.length ? lines[0].split(sep).length : 0;
      await SX.vaultPut({
        id: "t" + Date.now(), name: f.name.replace(/\.(csv|tsv|txt)$/i, ""),
        csv: txt, sep: sep, rows: lines.length, cols: cols, at: new Date().toISOString()
      });
      SX.toast("已保存：" + lines.length + " 行 × " + cols + " 列");
      draw();
    };
  }

  window.SXViewLib = { codebank, papers, playbook, knowledge, scripts, data, vault, paths };
})();
