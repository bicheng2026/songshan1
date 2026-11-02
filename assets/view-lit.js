/* 嵩山一号 · 工作站 —— 找文献（检索集合站）
   一条输入，三件事：站内有没有 / 网上哪儿能下 / 下不到找谁。
   纯静态：所有链接在本地拼，断网也能用；联网核查是可选按钮，只打 CORS 开放的接口。 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;
  const enc = encodeURIComponent;
  const LP = window.SX_LITPORTS || { engines: [], groups: [], wizard: [] };

  const lazyCache = {};
  function ensure(name, src) {
    if (window[name] !== undefined) return Promise.resolve();
    if (!lazyCache[name]) {
      lazyCache[name] = new Promise(resolve => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => { window[name] = []; resolve(); };
        document.head.appendChild(s);
      });
    }
    return lazyCache[name];
  }

  function normDoi(d) {
    return String(d || "").replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").trim().toLowerCase();
  }
  function fill(tpl, q) { return String(tpl || "").split("{q}").join(enc(q)); }
  function disp(u) { return u && u.length > 62 ? u.slice(0, 60) + "…" : (u || ""); }

  /* ---------- 输入识别：DOI / PMID / PMC / arXiv ---------- */
  function parseId(raw) {
    const s = String(raw || "").trim();
    if (!s) return null;
    let m = s.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/);
    if (m) return { type: "doi", v: m[0].replace(/[.,;\s]+$/, "") };
    m = s.match(/\bPMC\s*(\d{4,9})\b/i);
    if (m) return { type: "pmc", v: "PMC" + m[1] };
    m = s.match(/\b(?:PMID[:\s]*)?(\d{6,9})\b/i);
    if (m && (/pmid/i.test(s) || /^\d{6,9}$/.test(s))) return { type: "pmid", v: m[1] };
    m = s.match(/(\d{4}\.\d{4,5})(v\d+)?/);
    if (m && /arxiv/i.test(s)) return { type: "arxiv", v: m[0] };
    return null;
  }

  /* ---------- 标识符 → 全通道直达矩阵 ---------- */
  function idWindows(id) {
    const out = [];
    if (id.type === "doi") {
      const d = id.v;
      out.push({ k: "doi", n: "出版社官方页", u: "https://doi.org/" + d, d: "有订阅就直接下 PDF；没有就看摘要" });
      out.push({ k: "oa", n: "Unpaywall 查免费版", u: "https://api.unpaywall.org/v2/" + d + "?email=check@example.com", d: "返回 JSON，is_oa 为 true 就有合法免费版" });
      out.push({ k: "oa", n: "OpenAlex 查 OA 位置", u: "https://api.openalex.org/works/doi:" + d, d: "best_oa_location.pdf_url 就是 PDF 直链" });
      out.push({ k: "oa", n: "Europe PMC 查收录", u: "https://europepmc.org/search?query=" + enc('DOI:"' + d + '"'), d: "生命科学免费全文库，命中就有全文按钮" });
      out.push({ k: "free", n: "PubMed（按 DOI）", u: "https://pubmed.ncbi.nlm.nih.gov/?term=" + enc(d), d: "右侧有 Free PMC article 就是免费" });
      out.push({ k: "free", n: "Semantic Scholar", u: "https://www.semanticscholar.org/search?q=" + enc(d), d: "标了 Open Access PDF 的可直接下" });
      out.push({ k: "free", n: "Google Scholar", u: "https://scholar.google.com/scholar?q=" + enc(d), d: "右侧 [PDF] 链接往往是作者版" });
      out.push({ k: "free", n: "百度学术", u: "https://xueshu.baidu.com/s?wd=" + enc(d), d: "免费直连，有「免费下载」标记" });
      out.push({ k: "help", n: "科研通发求助", u: "https://www.ablesci.com/", d: "贴 DOI，志愿者当天给 PDF，免费" });
    } else if (id.type === "pmid") {
      const p = id.v;
      out.push({ k: "free", n: "PubMed 原文页", u: "https://pubmed.ncbi.nlm.nih.gov/" + p + "/", d: "看右侧有没有 Free PMC article" });
      out.push({ k: "oa", n: "Europe PMC", u: "https://europepmc.org/article/MED/" + p, d: "命中就有免费全文入口" });
      out.push({ k: "oa", n: "以 PMID 反查 DOI", u: "https://api.semanticscholar.org/graph/v1/paper/PMID:" + p + "?fields=title,externalIds,openAccessPdf", d: "JSON 里有 DOI 和 openAccessPdf" });
      out.push({ k: "free", n: "Google Scholar", u: "https://scholar.google.com/scholar?q=" + enc("PMID " + p), d: "找所有版本" });
      out.push({ k: "help", n: "科研通发求助", u: "https://www.ablesci.com/", d: "贴 PMID 也行" });
    } else if (id.type === "pmc") {
      const c = id.v;
      out.push({ k: "oa", n: "PMC 全文（可直接下）", u: "https://pmc.ncbi.nlm.nih.gov/articles/" + c + "/", d: "官方免费全文，这本来就是开放获取" });
      out.push({ k: "oa", n: "Europe PMC 全文 PDF", u: "https://europepmc.org/articles/" + c + "?pdf=render", d: "同一篇的 PDF 渲染页" });
      out.push({ k: "free", n: "PubMed 对应条目", u: "https://pubmed.ncbi.nlm.nih.gov/?term=" + enc(c), d: "看作者与期刊信息" });
    } else if (id.type === "arxiv") {
      const a = id.v;
      out.push({ k: "oa", n: "arXiv 摘要页", u: "https://arxiv.org/abs/" + a, d: "预印本，免费" });
      out.push({ k: "oa", n: "arXiv 直接下 PDF", u: "https://arxiv.org/pdf/" + a, d: "拿到就是全文" });
      out.push({ k: "free", n: "查是否已正式见刊", u: "https://scholar.google.com/scholar?q=" + enc(a), d: "见刊版可能补了审稿修改" });
    }
    return out;
  }

  const IDNAME = { doi: "DOI", pmid: "PMID", pmc: "PMC 号", arxiv: "arXiv 号" };

  function idBlockHtml(id) {
    const ws = idWindows(id);
    return '<div class="card lit-idcard">' +
      '<div class="lit-idhead"><span class="tag n">识别到 ' + IDNAME[id.type] + "</span><b>" + E(id.v) + "</b>" +
      '<button class="btn sm ghost" id="litCopyId">复制</button></div>' +
      '<div class="small muted" style="margin:2px 0 12px">每行都在查同一件事：哪儿能下。从绿标开始点。</div>' +
      ws.map(w =>
        '<div class="lit-port">' +
        '<div class="lit-port-l"><a class="lit-port-n k-' + w.k + '" href="' + E(w.u) + '" target="_blank" rel="noopener">' + E(w.n) + "</a>" +
        '<span class="lit-port-u">' + E(disp(w.u)) + '</span></div>' +
        '<div class="lit-port-d">' + E(w.d || "") + "</div></div>").join("") +
      "</div>";
  }

  /* ---------- 单篇通道 ---------- */
  function chanOf(p) {
    const doi = normDoi(p.doi);
    const EXT = window.SX_PAPER_EXT || {};
    const ext = doi ? EXT[doi] : null;
    const T = enc(p.title || "");
    const out = [];
    if (ext && ext.full) out.push({ k: ext.oa ? "oa" : "free", n: ext.oa ? "免费全文" : "全文入口", u: ext.full });
    if (doi) out.push({ k: "doi", n: "出版社原文", u: "https://doi.org/" + doi });
    out.push({ k: "free", n: "PubMed", u: "https://pubmed.ncbi.nlm.nih.gov/?term=" + (doi ? enc(doi) : T) });
    out.push({ k: "oa", n: "Europe PMC", u: "https://europepmc.org/search?query=" + (doi ? enc('DOI:"' + doi + '"') : T) });
    out.push({ k: "free", n: "谷歌学术", u: "https://scholar.google.com/scholar?q=" + T });
    out.push({ k: "free", n: "百度学术", u: "https://xueshu.baidu.com/s?wd=" + T });
    if (ext && ext.code) out.push({ k: "code", n: "代码", u: ext.code });
    return out;
  }

  /* ---------- 主渲染 ---------- */
  function render(root) {
    root.innerHTML =
      '<div class="page-head"><h2>找文献</h2><p>粘 DOI 或关键词，直接告诉你哪儿能下。</p></div>' +

      '<div class="lit-search">' +
      '<input id="litQ" type="search" autocomplete="off" placeholder="粘 DOI / PMID，或打关键词">' +
      '<button class="btn primary" id="litGo">查</button></div>' +
      '<div class="lit-egs"><span>试：</span>' +
      '<button class="lit-eg" data-eg="10.1016/j.jhep.2023.01.001">DOI</button>' +
      '<button class="lit-eg" data-eg="PMC4302049">PMC</button>' +
      '<button class="lit-eg" data-eg="single cell">关键词</button>' +
      "</div>" +

      '<div id="litId"></div>' +
      '<div id="litRes"></div>' +
      '<div id="litEng"></div>' +

      '<details class="acc" id="litAll"><summary><b>浏览全部论文</b>' +
      '<span class="tag n">3314 篇</span></summary><div id="litPapers"></div></details>' +
      portBlock() + wizardBlock() + customBlock();

    const inp = document.getElementById("litQ");
    const deb = SX.debounce ? SX.debounce(() => run(false), 260) : (() => run(false));
    inp.oninput = () => deb();
    inp.onkeydown = e => { if (e.key === "Enter") run(true); };
    document.getElementById("litGo").onclick = () => run(true);
    root.querySelectorAll("[data-eg]").forEach(b => {
      b.onclick = () => { inp.value = b.getAttribute("data-eg"); run(true); inp.focus(); };
    });

    bindCustom(root);
    const allD = document.getElementById("litAll");
    if (allD) allD.addEventListener("toggle", () => {
      if (allD.open && !allD.__done) {
        allD.__done = 1;
        if (window.SXViewLib && window.SXViewLib.papers) {
          window.SXViewLib.papers(document.getElementById("litPapers"));
        }
      }
    });
    RELOAD = () => {
      const i2 = document.getElementById("litQ");
      if (i2 && i2.value.trim() && !parseId(i2.value)) run(false);
    };
    loadIndex();
    run(false);

    function run(jump) {
      const raw = (document.getElementById("litQ").value || "").trim();
      const id = parseId(raw);
      const idBox = document.getElementById("litId");
      if (id) {
        idBox.innerHTML = idBlockHtml(id);
        const cb = document.getElementById("litCopyId");
        if (cb) cb.onclick = () => { SX.copy(id.v); SX.toast("已复制 " + id.v); };
        document.getElementById("litEng").innerHTML = engineBlockHtml(raw, "别的库");
      } else {
        idBox.innerHTML = "";
        document.getElementById("litEng").innerHTML = raw ? engineBlockHtml(raw, "去公开库搜") : engineIntroHtml();
      }
      if (!id) page = 1;
      drawRes(raw, id);
      // 手动查（回车/点按钮）时，结果若被滚出视口上方就拉回来，不打断输入
      if (jump === true) {
        const t = id ? document.getElementById("litId") : document.getElementById("litRes");
        if (t && t.getBoundingClientRect().top < 0) t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function drawRes(raw, id) {
      const box = document.getElementById("litRes");
      if (!raw) { box.innerHTML = idxReadyHtml(); return; }
      if (id) { box.innerHTML = ""; return; }
      if (!IDX) { box.innerHTML = '<div class="small muted">站内论文库正在载入…</div>'; return; }
      const q = raw.toLowerCase();
      let list = IDX.filter(p => p.blob.indexOf(q) >= 0);
      if (onlyFree) list = list.filter(p => { const f = chanOf(p)[0]; return f && f.k === "oa"; });
      list.sort((a, b) => (b.cited || 0) - (a.cited || 0));

      const total = list.length;
      const pages = Math.max(1, Math.ceil(total / PAGE));
      if (page > pages) page = pages;
      if (page < 1) page = 1;
      const from = (page - 1) * PAGE;
      shown = list.slice(from, from + PAGE);

      box.innerHTML =
        '<div class="lit-resbar"><b>站内命中 ' + total + " 篇</b>" +
        '<label class="small"><input type="checkbox" id="litFreeOnly"' + (onlyFree ? " checked" : "") + "> 只看有免费全文的</label>" +
        (pages > 1 ? '<span class="small muted">第 ' + (from + 1) + "–" + Math.min(from + PAGE, total) + " 条</span>" : "") +
        "</div>" +
        (total
          ? '<div class="lit-list">' + shown.map((p, i) => resCard(p, i)).join("") + "</div>" + pager(total, pages)
          : '<div class="card lit-empty"><b>站内没收录</b>' +
            '<div class="small muted" style="margin-top:6px">把 DOI 粘上去，或点下面的库搜「' + E(raw) + '」。</div></div>');

      const fo = document.getElementById("litFreeOnly");
      if (fo) fo.onchange = () => { onlyFree = fo.checked; page = 1; drawRes(raw, id); };
      box.querySelectorAll("[data-pg]").forEach(b => {
        b.onclick = () => {
          const v = b.getAttribute("data-pg");
          if (v === "prev") page--;
          else if (v === "next") page++;
          else page = +v;
          drawRes(raw, id);
          const t = document.getElementById("litRes");
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        };
      });
      box.querySelectorAll("[data-probe]").forEach(b => {
        b.onclick = () => doProbe(+b.getAttribute("data-probe"), b);
      });
      box.querySelectorAll("[data-copy]").forEach(b => {
        b.onclick = () => { SX.copy(b.getAttribute("data-copy")); SX.toast("DOI 已复制"); };
      });
    }

    function resCard(p, i) {
      const doi = normDoi(p.doi);
      const ch = chanOf(p);
      const free = ch[0] && ch[0].k === "oa";
      return '<div class="lit-row">' +
        '<div class="lit-t">' +
        (doi ? '<a href="https://doi.org/' + E(doi) + '" target="_blank" rel="noopener">' + E(p.title || "") + "</a>" : E(p.title || "")) +
        (free ? '<span class="tag g">免费</span>' : "") +
        (free ? "" : '<span class="tag n">要订阅</span>') +
        "</div>" +
        (p.titleCn ? '<div class="lit-cn">' + E(p.titleCn) + "</div>" : "") +
        '<div class="lit-m">' + E(p.journal || "—") + " · " + (p.year || "—") +
        " · 被引 " + (p.cited || 0) + (p.ifValue ? " · IF " + p.ifValue : "") +
        (doi ? ' · <span class="lit-doi">' + E(doi) + "</span>" : "") + "</div>" +
        '<div class="lit-acts">' +
        ch.map(c => '<a class="btn sm' + (c.k === "oa" ? " primary" : "") + '" href="' + E(c.u) + '" target="_blank" rel="noopener">' + E(c.n) + "</a>").join("") +
        (doi ? '<button class="btn sm ghost" data-probe="' + i + '">查免费版</button>' : "") +
        (doi ? '<button class="btn sm ghost" data-copy="' + E(doi) + '">复制 DOI</button>' : "") +
        "</div>" +
        '<div class="lit-probe" data-box="' + i + '"></div>' +
        "</div>";
    }

    /* 单篇联网核查：只打 CORS 开放的 OpenAlex 与 Europe PMC */
    async function doProbe(i, btn) {
      const p = shown[i];
      const doi = normDoi(p && p.doi);
      const box = document.querySelector('[data-box="' + i + '"]');
      if (!doi || !box) return;
      btn.disabled = true;
      box.innerHTML = '<span class="small muted">查 OpenAlex 与 Europe PMC…</span>';
      const found = [];
      const errs = [];
      try {
        const r = await fetch("https://api.openalex.org/works/doi:" + doi + "?mailto=lit@songshan1.local");
        if (r.ok) {
          const j = await r.json();
          const oa = j.open_access || {};
          if (oa.oa_url) found.push({ n: "OpenAlex（" + (oa.oa_status || "oa") + "）", u: oa.oa_url });
          (j.locations || []).forEach(l => {
            if (l && l.is_oa && l.pdf_url && found.length < 6) {
              found.push({ n: "OpenAlex · " + ((l.source && l.source.display_name) || "开放仓储"), u: l.pdf_url });
            }
          });
          if (!oa.is_oa) errs.push("OpenAlex 记录为非 OA");
        } else errs.push("OpenAlex 无此 DOI");
      } catch (e) { errs.push("OpenAlex 连不上（可能被网络拦了）"); }

      try {
        const u = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=" +
          enc('DOI:"' + doi + '"') + "&format=json&resultType=core&pageSize=1";
        const r2 = await fetch(u);
        if (r2.ok) {
          const j2 = await r2.json();
          const it = ((j2.resultList || {}).result || [])[0];
          if (it && it.pmcid) {
            found.push({ n: "Europe PMC · " + it.pmcid, u: "https://europepmc.org/articles/" + it.pmcid });
          } else if (it) errs.push("Europe PMC 有记录但无 PMC 全文");
          else errs.push("Europe PMC 没收录");
        }
      } catch (e) { errs.push("Europe PMC 连不上"); }

      const seen = {};
      const uniq = found.filter(x => { const k = (x.u || "").replace(/^https?:\/\//, ""); if (seen[k]) return false; seen[k] = 1; return !!x.u; });

      box.innerHTML = uniq.length
        ? '<div class="small"><b>查到 ' + uniq.length + " 个免费入口</b>" +
          (errs.length ? '<span class="muted">（' + E(errs.join("；")) + "）</span>" : "") + "</div>" +
          '<div class="lit-acts">' + uniq.map(x =>
            '<a class="btn sm primary" href="' + E(x.u) + '" target="_blank" rel="noopener">' + E(x.n) + "</a>").join("") + "</div>"
        : '<div class="small muted">没有免费全文。' + E(errs.join("；")) +
          '　<a href="https://www.gxmu.edu.cn/" target="_blank" rel="noopener">学校图书馆</a> · ' +
          '<a href="https://www.ablesci.com/" target="_blank" rel="noopener">科研通求助</a></div>';
      btn.disabled = false;
    }
  }

  /* ---------- 站内索引 ---------- */
  const PAGE = 20;
  let IDX = null, shown = [], page = 1, onlyFree = false, RELOAD = null;

  /* 翻页条：页数少就全列，多了用省略号夹住当前页 */
  function pager(total, pages) {
    if (pages <= 1) return "";
    const out = [];
    const add = n => out.push('<button class="btn sm' + (n === page ? " primary" : "") +
      '" data-pg="' + n + '">' + n + "</button>");
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) add(i);
    } else {
      add(1);
      if (page > 3) out.push('<span class="lit-pg-dot">…</span>');
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) add(i);
      if (page < pages - 2) out.push('<span class="lit-pg-dot">…</span>');
      add(pages);
    }
    return '<div class="lit-pager">' +
      '<button class="btn sm" data-pg="prev"' + (page <= 1 ? " disabled" : "") + ">上一页</button>" +
      out.join("") +
      '<button class="btn sm" data-pg="next"' + (page >= pages ? " disabled" : "") + ">下一页</button>" +
      '<span class="small muted">共 ' + total + " 条 · 第 " + page + "/" + pages + " 页</span></div>";
  }

  function loadIndex() {
    ensure("SX_PAPERS2", "data/papers2.261102204917.js").then(() => {
      const A = window.SX_PAPERS || [];
      const B = window.SX_PAPERS2 || [];
      const seen = {};
      const arr = [];
      A.concat(B).forEach(p => {
        const k = normDoi(p.doi) || String(p.title || "").toLowerCase();
        if (!k || seen[k]) return;
        seen[k] = 1;
        p.__d = normDoi(p.doi);
        p.blob = [p.title, p.titleCn, p.journal, p.authors, p.field, (p.tags || []).join(" "), p.doi]
          .filter(Boolean).join(" ").toLowerCase();
        arr.push(p);
      });
      arr.sort((a, b) => (b.cited || 0) - (a.cited || 0));
      IDX = arr;
      if (RELOAD) RELOAD();
    });
  }

  function idxReadyHtml() {
    return "";
  }

  /* ---------- 检索引擎矩阵 ---------- */
  function engineIntroHtml() {
    return '<div class="sec-h">十五个库</div>' +
      '<div class="lit-eng">' + (LP.engines || []).map(e =>
        '<a class="lit-engi" href="' + E(String(e.tpl).replace("{q}", "")) + '" target="_blank" rel="noopener">' +
        "<b>" + E(e.n) + "</b><span>" + E(e.note || "") + "</span></a>").join("") + "</div>";
  }

  function engineBlockHtml(q, title) {
    return '<div class="sec-h">' + E(title) + "</div>" +
      '<div class="lit-eng">' + (LP.engines || []).map(e =>
        '<a class="lit-engi" href="' + E(fill(e.tpl, q)) + '" target="_blank" rel="noopener">' +
        "<b>" + E(e.n) + "</b><span>" + E(e.note || "") + "</span></a>").join("") + "</div>";
  }

  /* ---------- 通道速查 ---------- */
  function portBlock() {
    return '<div class="sec-h">下载通道</div>' +
      (LP.groups || []).map((g, gi) =>
        '<details class="acc lit-grp"' + (gi === 0 ? " open" : "") + ">" +
        '<summary><b>' + E(g.name) + "</b>" +
        '<span class="tag n">' + (g.items || []).length + "</span></summary>" +
        (g.items || []).map(it =>
          '<div class="lit-port">' +
          '<div class="lit-port-l">' +
          (it.u
            ? '<a class="lit-port-n k-' + E(it.kind || "free") + '" href="' + E(it.u) + '" target="_blank" rel="noopener">' + E(it.n) + "</a>"
            : '<span class="lit-port-n k-' + E(it.kind || "free") + '">' + E(it.n) + "</span>") +
          (it.u ? '<span class="lit-port-u">' + E(disp(it.u.replace(/^https?:\/\//, ""))) + "</span>" : "") +
          "</div>" +
          (it.tip ? '<div class="lit-port-t">' + E(it.tip) + "</div>" : "") +
          "</div>").join("") +
        "</details>").join("");
  }

  /* ---------- 五步走 ---------- */
  function wizardBlock() {
    return '<div class="sec-h">下不到就照这个顺序</div>' +
      '<div class="lit-wiz">' + (LP.wizard || []).map(w =>
        '<div class="lit-wiz-i"><span class="lit-wiz-s">' + E(w.s) + "</span>" +
        "<b>" + E(w.t) + '</b><span class="small muted">' + E(w.d) + "</span></div>").join("") + "</div>";
  }

  /* ---------- 自定义通道（只存本机） ---------- */
  const CKEY = "sx_lit_custom";
  function getCustom() {
    try { return JSON.parse(localStorage.getItem(CKEY) || "[]"); } catch (e) { return []; }
  }
  function setCustom(a) { try { localStorage.setItem(CKEY, JSON.stringify(a)); } catch (e) { } }

  function customBlock() {
    return '<details class="acc lit-grp"><summary><b>自定义通道</b><span class="tag n">只存本机</span></summary>' +
      '<div class="small muted" style="margin:-6px 0 12px">没列到的来源自己加。链接可写 <code>{doi}</code>、<code>{q}</code>。只存本机。</div>' +
      '<div class="search-bar" style="margin-bottom:10px"><input id="litCName" placeholder="名字，例如 我的镜像">' +
      '<input id="litCUrl" placeholder="https://example.com/{doi}"></div>' +
      '<div class="toolbar"><button class="btn sm primary" id="litCAdd">加一条</button>' +
      '<button class="btn sm" id="litCExport">导出</button></div>' +
      '<div id="litCList" style="margin-top:12px"></div></details>';
  }

  function drawCustom() {
    const box = document.getElementById("litCList");
    if (!box) return;
    const a = getCustom();
    box.innerHTML = a.length
      ? a.map((x, i) =>
        '<div class="lit-port"><div class="lit-port-l"><span class="lit-port-n k-free">' + E(x.n) + "</span>" +
        '<span class="lit-port-u">' + E(x.u) + "</span></div>" +
        '<div class="lit-port-d"><a class="btn sm ghost" href="' + E(x.u) + '" target="_blank" rel="noopener">打开</a>' +
        '<button class="btn sm ghost" data-delc="' + i + '">删</button></div></div>').join("")
      : '<div class="small muted">还没有。</div>';
    box.querySelectorAll("[data-delc]").forEach(b => {
      b.onclick = () => {
        const arr = getCustom();
        arr.splice(+b.getAttribute("data-delc"), 1);
        setCustom(arr); drawCustom();
      };
    });
  }

  function bindCustom(root) {
    drawCustom();
    const add = document.getElementById("litCAdd");
    if (!add) return;
    add.onclick = () => {
      const n = (document.getElementById("litCName").value || "").trim();
      const u = (document.getElementById("litCUrl").value || "").trim();
      if (!n || !/^https?:\/\//i.test(u)) { SX.toast("名字要填，链接要以 http 开头"); return; }
      const arr = getCustom();
      arr.push({ n: n, u: u });
      setCustom(arr);
      document.getElementById("litCName").value = "";
      document.getElementById("litCUrl").value = "";
      drawCustom();
      SX.toast("已加：" + n);
    };
    const ex = document.getElementById("litCExport");
    if (ex) ex.onclick = () => {
      SX.download("找文献-自定义通道.json", JSON.stringify(getCustom(), null, 2), "application/json");
      SX.toast("已导出");
    };
  }

  window.SXViewLit = { render };
})();
