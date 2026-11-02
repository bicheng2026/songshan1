/* 嵩山一号 · 工作站 —— 文献汇总 + 对标与来源 */
(function () {
  "use strict";
  const SX = window.SX;
  const E = SX.esc;

  function head(t, p) {
    return '<div class="page-head"><h2>' + t + "</h2><p>" + p + "</p></div>";
  }

  function ext() {
    return window.SX_PAPER_EXT || {};
  }

  function linkFor(doi) {
    const e = ext()[(doi || "").toLowerCase()];
    if (e && e.full) return '<a class="btn ghost sm" href="' + E(e.full) + '" target="_blank" rel="noopener">全文</a>';
    return "";
  }

  function searchFor(title) {
    const q = (title || "").replace(/[^\w\s\-]/g, " ").split(/\s+/).slice(0, 6).join(" ");
    return '<a class="btn ghost sm" href="https://github.com/search?q=' +
      encodeURIComponent(q) + '&type=repositories" target="_blank" rel="noopener">找代码</a>';
  }

  /* ==================== 文献汇总 ==================== */
  function digest(root) {
    const D = window.SX_DIGEST;
    if (!D) { root.innerHTML = head("文献汇总", "数据还没生成。"); return; }
    const dirs = D.dirs || [];
    let h = head("文献汇总",
      "论文库按方向切四块，每块给体量、被引和代表作。") +
      '<div class="card"><div class="small"><b>' + D.total + "</b> 篇 · 合计被引 <b>" +
      D.totalCited.toLocaleString() + "</b> 次 · 覆盖 " + D.years[0] + "–" + D.years[1] + " 年</div>" +
      '<table class="tbl" style="margin-top:12px"><thead><tr><th>方向</th><th>篇数</th><th>占比</th>' +
      "<th>中位被引</th><th>近 5 年占比</th><th>代表作</th></tr></thead><tbody>" +
      dirs.map(d => "<tr><td><b>" + E(d.field) + "</b></td><td>" + d.n + "</td><td>" +
        (d.n / D.total * 100).toFixed(1) + "%</td><td>" + d.medianCited + "</td><td>" +
        Math.round(d.recent * 100) + "%</td><td class='small'>" + E(d.top[0] ? d.top[0].title.slice(0, 60) : "") +
        "…</td></tr>").join("") +
      "</tbody></table></div>";

    dirs.forEach((d, i) => {
      h += '<details class="acc"' + (i === 0 ? " open" : "") + '><summary>' + E(d.field) +
        " · " + d.n + " 篇 · Top " + d.top.length + "</summary>" +
        '<div class="small muted" style="margin:6px 0 8px">' + E(d.note) + "</div>" +
        '<table class="tbl"><thead><tr><th style="width:52%">标题</th><th>期刊</th><th>年</th>' +
        "<th>被引</th><th>链接</th></tr></thead><tbody>" +
        d.top.map(p => "<tr><td>" + E(p.title) + "</td><td class='small'>" + E(p.journal) + "</td><td>" +
          (p.year || "") + "</td><td>" + (p.cited || 0) + "</td><td>" + linkFor(p.doi) + searchFor(p.title) +
          "</td></tr>").join("") +
        "</tbody></table></details>";
    });

    h += '<div class="note" style="margin-top:14px"><b>关于「下载代码」：</b>论文配套代码绝大多数写在全文的 ' +
      "Data availability / Code availability 段里，直接批量抓会大量落空（试过：300 篇里能自动匹配到的几乎为零，" +
      "因为作者写法五花八门、仓库常换名）。所以这里给的是<b>全文直达 + 一键 GitHub 搜索</b>两条路，" +
      "比给你一堆 404 链接有用。真要批量收集，正确做法是按方向锁定 10~20 篇精读，逐篇手工登记仓库。</div>";
    root.innerHTML = h;
  }

  /* ==================== 对标与来源 ==================== */
  const REFS = [
    { name: "theislab/single-cell-best-practices", star: 1295, lang: "Jupyter",
      strong: "单细胞分析的最佳实践手册，每一步给“为什么这样做”和“什么情况别这样做”",
      take: "借它的「每条建议必须配反例」写法，做进了知识库和每关的 pitfalls" },
    { name: "nf-core/rnaseq", star: 1403, lang: "Nextflow",
      strong: "把 bulk RNA-seq 流程标准化到可复现：参数、版本、容器全锁死",
      take: "借它的「流程即文档」，做进了代码库每段的 scene + pitfalls 结构" },
    { name: "swirldev/swirl", star: 1222, lang: "R",
      strong: "在 R 里学 R：课程拆成小步，每步当场判对错，错了一步走不下去",
      take: "道场的判题卡点就是学它——但把课堂搬进了浏览器，且题目是本课题的真数据" },
    { name: "rstudio/learnr", star: 738, lang: "R",
      strong: "Rmd 交互教程，练习+即时反馈，作者可以只写题目不写判题代码",
      take: "借它的「练习与讲解交织」，但坚持手写判题脚本，因为要检查对象而不是选项" },
    { name: "exercism/exercism", star: 7599, lang: "多语言",
      strong: "练习 + 人工导师批改，强调“写完要有人给你指出坏味道”",
      take: "借它的导师制，做成了 AI 导师的「带上当前关卡题面+我的代码」一键提问" },
    { name: "galaxyproject/training-material", star: 368, lang: "HTML",
      strong: "教程库组织法：按主题→工具→场景三层索引，每篇都有数据与预期输出",
      take: "借它的「预期输出」思路，做成了每关的判题项与迷你示例的真实输出注释" },
    { name: "broadinstitute/gatk", star: 2010, lang: "Java",
      strong: "把“最佳实践”写成可执行流程 + 详尽文档，版本间差异写得极清楚",
      take: "借它的版本敏感意识，做进了「换包/换版本会怎样」的坑位注释" }
  ];

  function refs(root) {
    let h = head("对标与来源",
      "7 个影响了本站设计的 GitHub 项目，逐条写清借了什么。") +
      '<div class="card"><table class="tbl"><thead><tr><th style="width:22%">项目</th><th>★</th>' +
      "<th style='width:30%'>它强在哪</th><th>本站借了什么</th></tr></thead><tbody>" +
      REFS.map(r => "<tr><td><code class='inline'>" + E(r.name) + "</code><div class='tiny muted'>" +
        E(r.lang) + "</div></td><td>" + r.star + "</td><td class='small'>" + E(r.strong) +
        "</td><td class='small'>" + E(r.take) + "</td></tr>").join("") +
      "</tbody></table></div>";

    h += '<div class="card" style="margin-top:16px"><b>没照抄的三件事</b>' +
      '<ol class="crit"><li><b>不做「只讲不练」的教程。</b>上面几个项目多数是「讲完给你一段可跑代码」，' +
      "本站反过来：先给题和判题标准，代码你自己写，写错它告诉你差多少。</li>" +
      "<li><b>不追求流程全自动。</b>nf-core 那套 Nextflow 流程可复现性极强，但学习阶段会被封装挡住原理；" +
      "本站只有 base R，富集、log-rank、Moran's I、AUC 全让你手写一遍。</li>" +
      "<li><b>把通用课程和课题练习分成两条线。</b>swirl / learnr 教的是语言本身，本站也做了同样的事——" +
      "「通用课程」8 章 26 节只用 mtcars / iris 这类自带数据，任何人拿任何一台机器都能从头学；" +
      "而「代码道场」的题一律挂在本课题的真数据上（大鼠 RILD 三区六时间点、TCGA-LIHC、空间 spot、MR 汇总统计），" +
      "做完等于把课题预演了一遍。两条线不混，学基础时不被课题细节绊住，做课题时不用重新找数据。</li></ol>" +
      '<div class="note" style="margin-top:10px"><b>结论：</b>同类项目强在「内容组织」和「可复现」，' +
      "弱在「判题」和「跟具体课题绑定」。本站的差异点就压在后者——每一关都是可判真伪的操作，" +
      "而不是读完就算学过的章节。</div></div>";

    h += '<div class="card" style="margin-top:16px"><b>数据与方法来源</b>' +
      '<table class="tbl"><thead><tr><th>内容</th><th>来源</th></tr></thead><tbody>' +
      "<tr><td>论文元数据（3247 篇）</td><td>Europe PMC REST（24 个主题检索，按被引/日期排序）+ 论文订阅每日精读日报</td></tr>" +
      "<tr><td>全文链接 / 开放获取标记（300 篇）</td><td>Europe PMC core 接口（fullTextUrlList、isOpenAccess）</td></tr>" +
      "<tr><td>练习数据</td><td>按课题设计仿真的 RILD 大鼠三区 × 六时间点表达矩阵、TCGA-LIHC 子集、空间 spot、MR/coloc 汇总统计</td></tr>" +
      "<tr><td>机制条目（144 条）</td><td>按教科书与共识文献整理，每条标注「这对纯计算课题意味着什么」</td></tr>" +
      "<tr><td>代码模板（141 段）</td><td>按真实分析场景手写，逐段标注依赖包、适用场景与常见坑</td></tr>" +
      "</tbody></table></div>";
    root.innerHTML = h;
  }

  window.SXViewExtra = { digest, refs };
})();
