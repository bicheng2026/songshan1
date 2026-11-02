/* 嵩山一号 · 找文献 —— 通道数据（加渠道只改这个文件）
   engines[]  检索引擎：tpl 里 {q} 替换成输入
   groups[]   通道：kind = oa / sub / help / tool
   wizard[]   拿不到全文的五步
   规矩：每条只留一句「怎么用」，不写「为什么」。 */
window.SX_LITPORTS = {
  v: 2,

  engines: [
    { n: "PubMed", tpl: "https://pubmed.ncbi.nlm.nih.gov/?term={q}", note: "查 PMID" },
    { n: "Europe PMC", tpl: "https://europepmc.org/search?query={q}", note: "查免费全文" },
    { n: "Google Scholar", tpl: "https://scholar.google.com/scholar?q={q}", note: "查被引" },
    { n: "百度学术", tpl: "https://xueshu.baidu.com/s?wd={q}", note: "国内直连" },
    { n: "Semantic Scholar", tpl: "https://www.semanticscholar.org/search?q={q}", note: "看 OA 标记" },
    { n: "OpenAlex", tpl: "https://openalex.org/works?filter=default.search:{q}", note: "可只筛 OA" },
    { n: "CORE", tpl: "https://core.ac.uk/search?q={q}", note: "找作者版" },
    { n: "BASE", tpl: "https://www.base-search.net/Search/Results?lookfor={q}", note: "欧洲仓储" },
    { n: "DOAJ", tpl: "https://doaj.org/search/articles?q={q}", note: "看刊是否 OA" },
    { n: "bioRxiv", tpl: "https://www.biorxiv.org/search/{q}", note: "早半年" },
    { n: "medRxiv", tpl: "https://www.medrxiv.org/search/{q}", note: "医学预印本" },
    { n: "arXiv", tpl: "https://arxiv.org/search/?query={q}&searchtype=all", note: "生信算法" },
    { n: "中国知网", tpl: "https://kns.cnki.net/kns8s/search?kw={q}", note: "需校内 IP" },
    { n: "万方", tpl: "https://s.wanfangdata.com.cn/paper?q={q}", note: "学位论文全" },
    { n: "维普", tpl: "https://qikan.cqvip.com/Qikan/Search/Index?key={q}", note: "老文章全" }
  ],

  groups: [
    {
      id: "oa", name: "开放获取 · 点开就有 PDF",
      items: [
        { n: "Europe PMC", u: "https://europepmc.org/", kind: "oa", tip: "检索框粘 DOI，命中就有全文" },
        { n: "PubMed Central", u: "https://pmc.ncbi.nlm.nih.gov/", kind: "oa", tip: "PubMed 摘要页右侧出现 Free PMC article 就能下" },
        { n: "Unpaywall", u: "https://unpaywall.org/products/extension", kind: "oa", tip: "装扩展，出版社页面出现绿锁即点" },
        { n: "OA.mg", u: "https://oa.mg/", kind: "oa", tip: "输 DOI，直接给 PDF" },
        { n: "OpenAlex", u: "https://openalex.org/", kind: "oa", tip: "本页「查免费版」就是查它" },
        { n: "CORE", u: "https://core.ac.uk/", kind: "oa", tip: "找作者自存版" },
        { n: "bioRxiv", u: "https://www.biorxiv.org/", kind: "oa", tip: "方法最新，免费" },
        { n: "medRxiv", u: "https://www.medrxiv.org/", kind: "oa", tip: "临床结果先出在这" },
        { n: "arXiv", u: "https://arxiv.org/", kind: "oa", tip: "q-bio 分类下找算法" }
      ]
    },
    {
      id: "cn", name: "中文库 · 校内 IP 直接下",
      items: [
        { n: "中国知网", u: "https://www.cnki.net/", kind: "sub", tip: "校外未认证只能看摘要" },
        { n: "万方", u: "https://www.wanfangdata.com.cn/", kind: "sub", tip: "知网下不到时试这里" },
        { n: "维普", u: "http://www.cqvip.com/", kind: "sub", tip: "八九十年代老文章最全" },
        { n: "百度学术", u: "https://xueshu.baidu.com/", kind: "oa", tip: "出现「免费下载」就点" },
        { n: "读秀", u: "https://www.duxiu.com/", kind: "sub", tip: "单章可单独传" },
        { n: "超星发现", u: "https://ss.zhizhen.com/", kind: "sub", tip: "认证后可下" },
        { n: "SinoMed", u: "http://www.sinomed.ac.cn/", kind: "oa", tip: "查中文综述靠它" }
      ]
    },
    {
      id: "org", name: "机构与文献传递 · 1-3 天到邮箱",
      items: [
        { n: "广西医科大学", u: "https://www.gxmu.edu.cn/", kind: "sub", tip: "主页 → 图书馆 → 电子资源" },
        { n: "CARSI 校外访问", u: "https://www.carsi.edu.cn/", kind: "sub", tip: "学号登录，等于在校内" },
        { n: "CALIS 文献传递", u: "http://www.calis.edu.cn/", kind: "help", tip: "一次几元，本校生常有补贴" },
        { n: "NSTL", u: "https://www.nstl.gov.cn/", kind: "help", tip: "填 DOI，几元，24 小时" },
        { n: "国家图书馆", u: "http://www.nlc.cn/", kind: "help", tip: "外文期刊存量大" }
      ]
    },
    {
      id: "help", name: "找作者 · 命中率最高",
      items: [
        { n: "科研通", u: "https://www.ablesci.com/", kind: "help", tip: "贴 DOI 发求助，当天给 PDF，免费" },
        { n: "ResearchGate", u: "https://www.researchgate.net/", kind: "help", tip: "文章页点 Request full-text" },
        { n: "掌桥科研", u: "https://www.zhangqiaokeyan.com/", kind: "help", tip: "知网下不到的硕博论文" },
        { n: "小木虫 文献求助版", u: "http://muchong.com/", kind: "help", tip: "附 DOI 就行" },
        { n: "给通讯作者写信", u: "", kind: "help", tip: "Could you share a copy of this paper for my reading? 附标题和 DOI，三句以内" }
      ]
    },
    {
      id: "tool", name: "工具 · 装一次，以后自动找",
      items: [
        { n: "EndNote Click", u: "https://endnote.com/product-details/endnote-click", kind: "tool", tip: "一键搜所有合法来源" },
        { n: "Zotero", u: "https://www.zotero.org/download/", kind: "tool", tip: "抓元数据，写论文自动出参考文献" },
        { n: "Connected Papers", u: "https://www.connectedpapers.com/", kind: "tool", tip: "输种子文献，看相关关系图" },
        { n: "Research Rabbit", u: "https://researchrabbitapp.com/", kind: "tool", tip: "按引用推下一篇" },
        { n: "文献鸟", u: "https://www.storkapp.me/", kind: "tool", tip: "关键词订阅，邮件推送" },
        { n: "SciSpace", u: "https://typeset.io/", kind: "tool", tip: "传 PDF 直接问" },
        { n: "Paper Digest", u: "https://www.paperdigest.org/", kind: "tool", tip: "一篇压成三句话" }
      ]
    }
  ],

  wizard: [
    { s: "第 1 步", t: "查合法免费版", d: "Unpaywall 绿锁、OA.mg、CORE、Europe PMC，三成文章这步就拿到。" },
    { s: "第 2 步", t: "看 Free PMC 标记", d: "PubMed 摘要页有标记的点进去就是整篇 PDF。" },
    { s: "第 3 步", t: "连学校身份", d: "VPN 或 CARSI，从图书馆进出版社。Elsevier、Springer、Wiley 大多这步解决。" },
    { s: "第 4 步", t: "发求助", d: "科研通贴 DOI，同时 ResearchGate 点 Request。一天内一般有人回。" },
    { s: "第 5 步", t: "文献传递", d: "CALIS 或 NSTL，几元，1-3 天。" }
  ]
};
