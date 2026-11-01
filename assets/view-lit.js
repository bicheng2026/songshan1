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
      '<div class="small muted" style="margin:2px 0 12px">下面每一行都是在查同一件事：这篇到底哪儿能下。从绿标那几行开始点，通常前三行就有答案。</div>' +
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
      '<div class="page-head"><h2>找文献</h2><p>一个框，三件事：<b>站里有没有</b>这篇、<b>网上哪儿能下</b>、<b>下不到找谁</b>。' +
      "题目、关键词、DOI、PMID、PMC 号都能粘。链接是当场拼出来的，断网也能用。</p></div>" +

      '<div class="lit-search">' +
      '<input id="litQ" type="search" autocomplete="off" placeholder="粘 DOI / PMID，或打关键词：RILD、hepatocyte heterogeneity、ferroptosis、放射诱导肝损伤">' +
      '<button class="btn primary" id="litGo">查</button></div>' +
      '<div class="small muted" style="margin:-8px 0 26px">现成例子：' +
      '<button class="lit-eg" data-eg="10.1016/j.jhep.2023.01.001">10.1016/j.jhep.2023.01.001</button>' +
      '<button class="lit-eg" data-eg="PMC4302049">PMC4302049</button>' +
      '<button class="lit-eg" data-eg="RILD single cell">RILD single cell</button>' +
      "</div>" +

      '<div id="litId"></div>' +
      '<div id="litEng"></div>' +
      '<div id="litRes"></div>' +

      portBlock() + wizardBlock() + customBlock();

    const inp = document.getElementById("litQ");
    const go = () => run();
    const deb = SX.debounce ? SX.debounce(go, 260) : go;
    inp.oninput = deb;
    inp.onkeydown = e => { if (e.key === "Enter") go(); };
    document.getElementById("litGo").onclick = go;
    root.querySelectorAll("[data-eg]").forEach(b => {
      b.onclick = () => { inp.value = b.getAttribute("data-eg"); run(); inp.focus(); };
    });

    bindCustom(root);
    RELOAD = () => {
      const i2 = document.getElementById("litQ");
      if (i2 && i2.value.trim() && !parseId(i2.value)) run();
    };
    loadIndex();
    run();

    function run() {
      const raw = (document.getElementById("litQ").value || "").trim();
      const id = parseId(raw);
      const idBox = document.getElementById("litId");
      if (id) {
        idBox.innerHTML = idBlockHtml(id);
        const cb = document.getElementById("litCopyId");
        if (cb) cb.onclick = () => { SX.copy(id.v); SX.toast("已复制 " + id.v); };
        document.getElementById("litEng").innerHTML = engineBlockHtml(raw, "带着这个标识符再去别的库核一遍");
      } else {
        idBox.innerHTML = "";
        document.getElementById("litEng").innerHTML = raw ? engineBlockHtml(raw, "带着这个词去公开库搜") : engineIntroHtml();
      }
      drawRes(raw, id);
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
      shown = list.slice(0, limit);

      box.innerHTML =
        '<div class="lit-resbar"><b>站内命中 ' + list.length + " 篇</b>" +
        '<label class="small"><input type="checkbox" id="litFreeOnly"' + (onlyFree ? " checked" : "") + "> 只看有免费全文的</label>" +
        (list.length > limit ? '<button class="btn sm" id="litMore">再显示 30 篇</button>' : "") +
        "</div>" +
        (list.length
          ? '<div class="lit-list">' + shown.map((p, i) => resCard(p, i)).join("") + "</div>"
          : '<div class="card lit-empty"><b>站内没收录这一篇</b>' +
            '<div class="small muted" style="margin-top:6px">站内是 3314 篇生信论文的固定清单，只含已收录的。两条路：' +
            "把 DOI 或 PMID 粘进上面的框（我给你所有能下的通道），或者点上面那排按钮带着「" + E(raw) + "」去公开库搜。" +
            "</div></div>");

      const fo = document.getElementById("litFreeOnly");
      if (fo) fo.onchange = () => { onlyFree = fo.checked; limit = 30; drawRes(raw, id); };
      const mb = document.getElementById("litMore");
      if (mb) mb.onclick = () => { limit += 30; drawRes(raw, id); };
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
      box.innerHTML = '<span class="small muted">在查 OpenAlex 与 Europe PMC…</span>';
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
        : '<div class="small muted">联网查过了，没有免费全文。' + E(errs.join("；")) +
          '　走两步：<a href="https://www.gxmu.edu.cn/" target="_blank" rel="noopener">进学校图书馆</a>，或者' +
          '<a href="https://www.ablesci.com/" target="_blank" rel="noopener">去科研通发求助</a>。</div>';
      btn.disabled = false;
    }
  }

  /* ---------- 站内索引 ---------- */
  let IDX = null, shown = [], limit = 30, onlyFree = false, RELOAD = null;

  function loadIndex() {
    ensure("SX_PAPERS2", "data/papers2.js").then(() => {
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
    return '<div class="card lit-empty"><b>上面那个框，三种用法</b>' +
      '<div class="small muted" style="margin-top:8px">' +
      "① 粘度 DOI / PMID / PMC 号 → 直接给你这张论文的所有下载通道，一行一行标好哪个能下。<br>" +
      "② 打关键词 → 先看站内 3 千多篇里有没有，再一键带去 PubMed、Europe PMC、知网等 15 个库。<br>" +
      "③ 只是想找某篇又不知道号 → 打题目里几个词，站内命中就直接点，没命中就用下面那排引擎。" +
      "</div></div>";
  }

  /* ---------- 检索引擎矩阵 ---------- */
  function engineIntroHtml() {
    return '<div class="sec-h">十五个库，一个词带过去</div>' +
      '<div class="small muted" style="margin-bottom:14px">上面输入框空着的时候，这排按钮就是纯入口。填了词，每个按钮都会把词带过去。</div>' +
      '<div class="lit-eng">' + (LP.engines || []).map(e =>
        '<a class="lit-engi" href="' + E(String(e.tpl).replace("{q}", "")) + '" target="_blank" rel="noopener">' +
        "<b>" + E(e.n) + "</b><span>" + E(e.note || "") + "</span></a>").join("") + "</div>" +
      '<div class="note small">检索式小抄：PubMed 里 <code>RILD AND single cell[Title/Abstract]</code> 比直接打两个词准得多；' +
      "要限定年份就加 <code>AND 2022:2026[dp]</code>。Europe PMC 支持 <code>DOI:\"10.xxxx/xxxx\"</code> 精确定位。</div>";
  }

  function engineBlockHtml(q, title) {
    return '<div class="sec-h">' + E(title) + "</div>" +
      '<div class="lit-eng">' + (LP.engines || []).map(e =>
        '<a class="lit-engi" href="' + E(fill(e.tpl, q)) + '" target="_blank" rel="noopener">' +
        "<b>" + E(e.n) + "</b><span>" + E(e.note || "") + "</span></a>").join("") + "</div>";
  }

  /* ---------- 通道速查 ---------- */
  function portBlock() {
    return '<div class="sec-h">下载通道速查 · 按顺序试，别乱撞</div>' +
      '<div class="small muted" style="margin-bottom:18px">五组，从上到下就是推荐顺序。第一组能解决就不用往下走。</div>' +
      (LP.groups || []).map((g, gi) =>
        '<details class="acc lit-grp"' + (gi === 0 ? " open" : "") + ">" +
        '<summary><b>' + E(g.name) + "</b>" +
        '<span class="tag n">' + (g.items || []).length + " 个</span></summary>" +
        '<div class="small muted" style="margin:-6px 0 10px">' + E(g.note || "") + "</div>" +
        (g.items || []).map(it =>
          '<div class="lit-port">' +
          '<div class="lit-port-l">' +
          (it.u
            ? '<a class="lit-port-n k-' + E(it.kind || "free") + '" href="' + E(it.u) + '" target="_blank" rel="noopener">' + E(it.n) + "</a>"
            : '<span class="lit-port-n k-' + E(it.kind || "free") + '">' + E(it.n) + "</span>") +
          (it.u ? '<span class="lit-port-u">' + E(disp(it.u.replace(/^https?:\/\//, ""))) + "</span>" : "") +
          "</div>" +
          '<div class="lit-port-d">' + E(it.d || "") + "</div>" +
          (it.tip ? '<div class="lit-port-t">' + E(it.tip) + "</div>" : "") +
          "</div>").join("") +
        "</details>").join("");
  }

  /* ---------- 五步走 ---------- */
  function wizardBlock() {
    return '<div class="sec-h">还是下不到？照这个顺序走，基本不会空手</div>' +
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
      '<div class="small muted" style="margin:-6px 0 12px">你信任的来源如果没在上面，自己加一条。链接里可以写 <code>{doi}</code> 和 <code>{q}</code>，' +
      "用的时候自动替换。这些内容只写进这台电脑的浏览器，不进代码库、不上传。</div>" +
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
      : '<div class="small muted">还没有。加一条之后，上面的站内结果不会自动用它；它的用途是你自己有个常去的站，把入口收在这一页。</div>';
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
