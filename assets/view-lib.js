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

  /* ==================== 代码库 ==================== */
  function codebank(root) {
    const all = window.SX_CODEBANK || [];
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

      root.innerHTML = head("代码库", "共 " + all.length + " 段可直接复用的 R 模板。每段都写明什么时候用、依赖哪些包、有哪些坑。点『复制』直接粘进 RStudio。") +
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
        "<b style=\"font-size:14px\">" + E(x.title) + "</b>" +
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
    const ps = window.SX_PAPERS || [];
    const stat = window.SX_PAPER_STAT || {};
    let q = "", tag = "ALL", field = "ALL", onlyArticle = false;

    const tags = {};
    ps.forEach(p => (p.tags || []).forEach(t => tags[t] = (tags[t] || 0) + 1));
    const tagList = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
    const fields = {};
    ps.forEach(p => fields[p.field] = (fields[p.field] || 0) + 1);
    const fieldList = Object.keys(fields).sort((a, b) => fields[b] - fields[a]);

    function draw() {
      const list = ps.filter(p =>
        (!q || (p.title + " " + p.titleCn + " " + p.journal + " " + p.authors).toLowerCase().indexOf(q) >= 0) &&
        (tag === "ALL" || (p.tags || []).indexOf(tag) >= 0) &&
        (field === "ALL" || p.field === field) &&
        (!onlyArticle || p.type === "Article"));
      root.innerHTML =
        head("论文库 · 洪扬刚论文全清单",
          "共 " + ps.length + " 篇（Europe PMC 检索式 \"Yanggang Hong\"）。这份清单的价值不在数量，而在于：你可以按方法标签反查「这一类题是怎么搭的」。" +
          "注意本模块的立场 —— 学方法，不学做法。") +
        '<div class="card" style="margin-bottom:12px">' +
        "<b>方法频次</b><div style=\"margin-top:6px\">" +
        Object.entries(stat.methodFreq || {}).slice(0, 12).map(([k, v]) =>
          '<span class="tag g">' + E(k) + " ×" + v + "</span>").join(" ") + "</div>" +
        '<div class="small muted" style="margin-top:6px">合计被引 ' +
        ps.reduce((a, b) => a + (b.cited || 0), 0) + " 次；其中通信/述评类 " +
        ps.filter(p => p.type === "Letter/Comment").length + " 篇，Article " +
        ps.filter(p => p.type === "Article").length + " 篇。</div></div>" +
        '<div class="search-bar">' +
        '<input type="search" id="qP" placeholder="搜索标题中文/英文、期刊、作者">' +
        '<select id="fTag"><option value="ALL">全部方法</option>' +
        tagList.map(t => '<option value="' + E(t) + '"' + (tag === t ? " selected" : "") + ">" + E(t) + " (" + tags[t] + ")</option>").join("") +
        "</select>" +
        '<select id="fField"><option value="ALL">全部领域</option>' +
        fieldList.map(t => '<option value="' + E(t) + '"' + (field === t ? " selected" : "") + ">" + E(t) + " (" + fields[t] + ")</option>").join("") +
        "</select>" +
        '<label class="small"><input type="checkbox" id="fArt"' + (onlyArticle ? " checked" : "") + "> 只看研究论文</label>" +
        "</div>" +
        '<div class="scroll"><table class="tbl" id="pTbl"></table></div>' +
        '<div class="small muted" style="margin-top:6px">IF 一栏只对有把握的期刊填了值，其余显示 —，不做猜测。</div>';

      const t = document.getElementById("pTbl");
      t.innerHTML = "<thead><tr><th style=\"width:34%\">标题</th><th>中文</th><th>期刊</th><th>年</th><th>被引</th><th>IF</th><th>类型</th><th>方法标签</th></tr></thead><tbody>" +
        list.map(p => "<tr>" +
          '<td><a href="https://doi.org/' + E(p.doi) + '" target="_blank" rel="noopener">' + E(p.title.length > 95 ? p.title.slice(0, 95) + "…" : p.title) + "</a></td>" +
          "<td>" + E(p.titleCn || "") + "</td>" +
          "<td>" + E(p.journal) + "</td><td>" + p.year + "</td><td>" + p.cited + "</td>" +
          "<td>" + (p.ifValue ? p.ifValue : "—") + "</td>" +
          '<td><span class="tag ' + (p.type === "Article" ? "g" : (p.type === "Letter/Comment" ? "n" : "y")) + '">' + E(p.type) + "</span></td>" +
          "<td>" + (p.tags || []).map(x => '<span class="tag n">' + E(x) + "</span>").join(" ") + "</td>" +
          "</tr>").join("") + "</tbody>";

      document.getElementById("qP").oninput = SX.debounce(() => {
        q = document.getElementById("qP").value.trim().toLowerCase(); draw();
      }, 250);
      document.getElementById("fTag").onchange = e => { tag = e.target.value; draw(); };
      document.getElementById("fField").onchange = e => { field = e.target.value; draw(); };
      document.getElementById("fArt").onchange = e => { onlyArticle = e.target.checked; draw(); };
    }
    draw();
  }

  /* ==================== 套路拆解 ==================== */
  function playbook(root) {
    const P = window.SX_PLAYBOOK || {};
    root.innerHTML = head("套路拆解", "") +
      '<div class="note bad"><b>先说立场：</b>' + E(P.core || "") + "</div>" +
      '<div class="card" style="margin-top:12px"><b>八步标准流水线</b>' +
      '<div class="scroll" style="margin-top:8px"><table class="tbl"><thead><tr><th>#</th><th>步骤</th><th>输入</th><th>工具</th><th>输出</th><th>要点</th></tr></thead><tbody>' +
      (P.sops || []).map(s => "<tr><td>" + s.step + "</td><td><b>" + E(s.name) + "</b></td><td>" + E(s.input) +
        "</td><td>" + E(s.tool) + "</td><td>" + E(s.output) + "</td><td class=\"small\">" + E(s.note) + "</td></tr>").join("") +
      "</tbody></table></div></div>" +
      '<div class="card" style="margin-top:12px"><b>' + E(P.caseStudy.title) + "</b>" +
      '<div class="small muted" style="margin:4px 0 8px">' + E(P.caseStudy.note) + "</div>" +
      (P.caseStudy.steps || []).map(s => '<div class="kv" style="margin:4px 0"><dt style="min-width:80px"><b>' + E(s.k) +
        "</b></dt><dd class=\"small\">" + E(s.v) + "</dd></div>").join("") +
      '<div class="note warn" style="margin-top:10px"><b>这篇的软肋（值得你引以为戒）：</b>' +
      (P.caseStudy.weaknesses || []).map(w => "<div>· " + E(w) + "</div>").join("") + "</div></div>" +
      '<div class="card" style="margin-top:12px"><b>怎么把这套搬到你的 RILD 课题上</b>' +
      '<div class="scroll" style="margin-top:8px"><table class="tbl"><thead><tr><th>原套路</th><th>换成</th><th>说明</th></tr></thead><tbody>' +
      (P.transfer || []).map(t => "<tr><td>" + E(t.from) + "</td><td><b>" + E(t.to) + "</b></td><td class=\"small\">" + E(t.note) + "</td></tr>").join("") +
      "</tbody></table></div></div>" +
      '<div class="card" style="margin-top:12px"><b style="color:var(--accent)">红线：这些不能碰</b>' +
      (P.redlines || []).map(r => '<div style="margin:8px 0"><b>· ' + E(r.t) + "</b>" +
        '<div class="small muted">' + E(r.d) + "</div></div>").join("") + "</div>" +
      '<div class="card" style="margin-top:12px"><b>五步使用法</b><ol style="margin:6px 0 0 18px;padding:0">' +
      (P.howToUse || []).map(x => '<li class="small">' + E(x) + "</li>").join("") + "</ol></div>";
  }

  /* ==================== 知识库 ==================== */
  function knowledge(root) {
    const K = window.SX_KNOWLEDGE || [];
    const dom = {};
    K.forEach(x => dom[x.domainName || x.domain] = x.domain);
    let curDom = "ALL", q = "", openId = null;

    function draw() {
      const list = K.filter(x => (curDom === "ALL" || x.domain === curDom) &&
        (!q || (x.title + x.summary + x.body + (x.tags || []).join(" ")).toLowerCase().indexOf(q) >= 0));
      root.innerHTML = head("知识库", "共 " + K.length + " 条机制与方法论条目，聚焦再生、癌症、放疗，以及生信方法背后的统计与假设。每条都带【和生信分析的连接】。") +
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
        "<b style=\"font-size:14px\">" + E(x.title) + "</b>" +
        '<span class="tag n">' + E(x.level || "") + "</span></div>" +
        '<div class="small" style="margin:4px 0;color:var(--brand)">' + E(x.summary || "") + "</div>" +
        '<div class="small muted">' + (x.tags || []).map(t => '<span class="tag">' + E(t) + "</span>").join(" ") + "</div>" +
        (openId === x.id ?
          '<div class="markdown-body" style="margin-top:8px;font-size:13.5px">' + SX.md(x.body || "") + "</div>" +
          (x.keyPoints ? '<div style="margin-top:8px"><b class="small">要点</b>' +
            x.keyPoints.map(k => '<div class="small">· ' + E(k) + "</div>").join("") + "</div>" : "") +
          (x.testYourself ? '<div class="note" style="margin-top:8px"><b class="small">自测：</b>' + E(x.testYourself) + "</div>" : "") +
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
      "本机 R 代码资产盘点：77 个 .R 文件，去重后 " + M.length + " 份独立内容。按成熟度标注了「跑通 / 跟练 / 脚手架 / 未验证」，踩坑注释单独抽出。") +
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
        "<b style=\"font-size:14px\">" + E(x.title) + "</b>" +
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

  /* ==================== 数据中心 ==================== */
  const SOURCES = [
    { g: "公共表达数据", items: [
      { n: "GEO（NCBI）", u: "https://www.ncbi.nlm.nih.gov/geo/", d: "芯片与测序表达谱最大仓库；用 GEOquery 或手动下 series matrix", r: "library(GEOquery)\ngset <- getGSEDataTables(\"GSE149614\")  # 或直接下 series matrix\n# 单细胞原始：GEO 页面上取 10x 三件套（barcodes/features/matrix）" },
      { n: "TCGA / GDC", u: "https://portal.gdc.cancer.gov/", d: "肿瘤多组学，含临床随访；TCGAbiolinks 是 R 里最顺手的方式", r: "library(TCGAbiolinks)\nquery <- GDCquery(project = \"TCGA-LIHC\", data.category = \"Transcriptome Profiling\",\n                  data.type = \"Gene Expression Quantification\",\n                  workflow.type = \"STAR - Counts\")\nGDCdownload(query); data <- GDCprepare(query)" },
      { n: "UCSC Xena", u: "https://xenabrowser.net/", d: "TCGA/GTEx 已整理好的矩阵，下载快，适合快速验证", r: "# 浏览器下载后读入\n.read <- function(f) read.csv(f, sep = \"\\t\", row.names = 1)" },
      { n: "Zenodo", u: "https://zenodo.org/", d: "你导师团队的大鼠 RILD 单细胞数据就存在这里", r: "# 从 Zenodo 下载 10x 三件套后\nlibrary(Seurat)\nobj <- Read10X(\"path/to/filtered_feature_bc_matrix/\")\nseu <- CreateSeuratObject(obj, project = \"RILD\", min.cells = 3, min.features = 200)" },
      { n: "GTEx", u: "https://gtexportal.org/", d: "正常组织表达，作为肿瘤分析的对照", r: "" }
    ]},
    { g: "遗传与因果推断", items: [
      { n: "FinnGen", u: "https://www.finngen.fi/en/access_results", d: "芬兰人群 GWAS 汇总统计，MR 结局常用", r: "library(TwoSampleMR)\nao <- available_outcomes()\nhead(subset(ao, grepl(\"liver|cancer\", trait, ignore.case = TRUE)))" },
      { n: "eQTLGen", u: "https://www.eqtlgen.org/", d: "血液 cis-eQTL，MR 暴露的常用来源", r: "# 下载 cis-eQTL 全量后按基因筛选\nexp <- read.csv(\"2019-12-11-cis-eQTLsFDR0.05-ProbeLevel-CohortsInfo.tsv\", sep = \"\\t\")" },
      { n: "IEU OpenGWAS", u: "https://gwas-api.mrcieu.ac.uk/", d: "MR Base，TwoSampleMR 直接对接", r: "library(TwoSampleMR)\nexp <- extract_instruments(outcomes = \"eqtl-a-ENSG000001...\")\nout <- extract_outcome_data(snps = exp$SNP, outcomes = \"ieu-b-4965\")" },
      { n: "OneK1K", u: "https://onek1k.org/", d: "14 类免疫细胞的单细胞 eQTL，做 sc-eQTL MR 的来源", r: "" },
      { n: "UK Biobank", u: "https://www.ukbiobank.ac.uk/", d: "大规模表型 GWAS；需申请", r: "" },
      { n: "AstraZeneca PheWAS", u: "https://azphewas.com/", d: "约 50 万外显子数据的全表型关联扫描，用于排脱靶风险", r: "" }
    ]},
    { g: "毒理与药物", items: [
      { n: "CTD 比较毒理基因组学", u: "https://ctdbase.org/", d: "化学品—基因—疾病互作，网络毒理学的核心数据源；支持从基因反查化学物", r: "# 下载 CTD 的 chem-gene 互作文件后\nedc <- read.csv(\"CTD_chem_gene_ixns.tsv\", sep = \"\\t\", comment.char = \"#\")" },
      { n: "TEDX 内分泌干扰物库", u: "https://endocrinedisruption.org/", d: "内分泌干扰物清单，网络毒理学常用起点", r: "" },
      { n: "DGIdb", u: "https://www.dgidb.org/", d: "药物—基因互作，老药新用匹配", r: "" },
      { n: "DrugBank", u: "https://go.drugbank.com/", d: "药物详细信息与适应症，投稿前核实用", r: "" },
      { n: "Open Targets", u: "https://platform.opentargets.org/", d: "靶点—疾病证据评分，给候选基因排优先级", r: "" },
      { n: "PubChem", u: "https://pubchem.ncbi.nlm.nih.gov/", d: "小分子结构与 SMILES，分子对接取配体", r: "" },
      { n: "RCSB PDB", u: "https://www.rcsb.org/", d: "蛋白结构，对接取受体。注意核对 UniProt 与物种", r: "" },
      { n: "CMap / LINCS L1000", u: "https://clue.io/", d: "药物扰动表达谱，用于「疾病签名反向匹配」", r: "" }
    ]}
  ];

  function data(root) {
    const D = window.SX_DATA || {};
    const keys = window.SX_DATA_KEYS || Object.keys(D);
    root.innerHTML = head("数据中心",
      "站内内置 " + keys.length + " 个练习数据集（离线可跑），以及常用公共数据源的入口与 R 读取代码。") +
      '<div class="card"><b>内置练习数据集</b>' +
      keys.map(k => {
        const csv = D[k].csv || "";
        const rows = csv.split("\n").length - 1;
        return '<div class="ds-row">' +
          "<div><b>" + E(k) + "</b>" +
          '<div class="tiny muted">' + E(D[k].desc) + " · " + rows + " 行</div></div>" +
          '<div class="toolbar">' +
          '<button class="btn sm" data-prev="' + E(k) + '">预览</button>' +
          '<button class="btn sm" data-dl="' + E(k) + '">下载 CSV</button>' +
          '<button class="btn sm" data-code="' + E(k) + '">R 读取代码</button>' +
          "</div></div>";
      }).join("") +
      '<div id="dsPrev"></div></div>' +
      SOURCES.map(g => '<div class="card" style="margin-top:12px"><b>' + E(g.g) + "</b>" +
        g.items.map(it => '<div class="ds-row">' +
          "<div><b>" + E(it.n) + "</b>" +
          '<div class="tiny muted">' + E(it.d) + "</div>" +
          '<div class="tiny"><a href="' + E(it.u) + '" target="_blank" rel="noopener">' + E(it.u) + "</a></div></div>" +
          '<div class="toolbar">' +
          '<a class="btn sm" href="' + E(it.u) + '" target="_blank" rel="noopener">打开</a>' +
          (it.r ? '<button class="btn sm" data-rcode="' + E(it.n) + '">R 代码</button>' : "") +
          "</div></div>").join("") + "</div>").join("");

    const prev = document.getElementById("dsPrev");
    document.querySelectorAll("[data-prev]").forEach(b => b.onclick = () => {
      const k = b.getAttribute("data-prev");
      const lines = (D[k].csv || "").split("\n").slice(0, 6);
      prev.innerHTML = '<div class="small" style="margin-top:8px"><b>' + E(k) + "</b> 前 5 行：" +
        "<pre class='code' style=\"max-height:180px\">" + E(lines.join("\n")) + "</pre></div>";
    });
    document.querySelectorAll("[data-dl]").forEach(b => b.onclick = () => {
      const k = b.getAttribute("data-dl");
      SX.download(k + ".csv", D[k].csv, "text/csv;charset=utf-8");
    });
    document.querySelectorAll("[data-code]").forEach(b => b.onclick = () => {
      const k = b.getAttribute("data-code");
      const rn = k.indexOf("_expr") >= 0 ? ", row.names = 1" : "";
      SX.copy(k + " <- read.csv(\"data/" + k + ".csv\", stringsAsFactors = FALSE" + rn + ")");
      SX.toast("读取代码已复制");
    });
    document.querySelectorAll("[data-rcode]").forEach(b => b.onclick = () => {
      const n = b.getAttribute("data-rcode");
      let code = "";
      SOURCES.forEach(g => g.items.forEach(it => { if (it.n === n) code = it.r; }));
      SX.copy(code); SX.toast("R 代码已复制");
    });
  }

  /* ==================== 数据仓库 ==================== */
  function vault(root) {
    root.innerHTML = head("我的数据仓库",
      "把 CSV / TSV 拖进来存在浏览器本地（IndexedDB），不上传任何服务器。可以用来存你自己跑出来的结果表、中间产物。") +
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

  window.SXViewLib = { codebank, papers, playbook, knowledge, scripts, data, vault };
})();
