/* 嵩山一号 · 找文献 —— 通道数据（想加/改渠道，只改这个文件，不用碰逻辑）
   字段说明：
   engines[]  检索引擎：tpl 里 {q} 会被替换成用户输入
   groups[]   速查通道：kind = oa(通常能直接下) / sub(要订阅或机构) / help(求助) / tool(工具)
   wizard[]   拿不到全文时的五步走
*/
window.SX_LITPORTS = {
  v: 1,

  engines: [
    { n: "PubMed", tpl: "https://pubmed.ncbi.nlm.nih.gov/?term={q}", note: "最常用。查 PMID、看有没有 Free PMC 标记" },
    { n: "Europe PMC", tpl: "https://europepmc.org/search?query={q}", note: "顺手看有没有免费全文；有 REST 接口" },
    { n: "Google Scholar", tpl: "https://scholar.google.com/scholar?q={q}", note: "查被引、查所有版本，国内需代理" },
    { n: "百度学术", tpl: "https://xueshu.baidu.com/s?wd={q}", note: "免费直连，能看被引和免费来源" },
    { n: "Semantic Scholar", tpl: "https://www.semanticscholar.org/search?q={q}", note: "标了 Open Access PDF 的能直接下" },
    { n: "OpenAlex", tpl: "https://openalex.org/works?filter=default.search:{q}", note: "免登录，可只看 OA" },
    { n: "CORE", tpl: "https://core.ac.uk/search?q={q}", note: "机构仓储聚合，常能找到作者版全文" },
    { n: "BASE", tpl: "https://www.base-search.net/Search/Results?lookfor={q}", note: "欧洲开放仓储大索引" },
    { n: "DOAJ", tpl: "https://doaj.org/search/articles?q={q}", note: "判断一本刊是不是正经开放获取" },
    { n: "bioRxiv", tpl: "https://www.biorxiv.org/search/{q}", note: "生物学预印本，比见刊早半年" },
    { n: "medRxiv", tpl: "https://www.medrxiv.org/search/{q}", note: "医学预印本" },
    { n: "arXiv", tpl: "https://arxiv.org/search/?query={q}&searchtype=all", note: "数理与生信方法预印本" },
    { n: "中国知网", tpl: "https://kns.cnki.net/kns8s/search?kw={q}", note: "中文核心，校内 IP 才能下全文" },
    { n: "万方", tpl: "https://s.wanfangdata.com.cn/paper?q={q}", note: "学位论文比知网全" },
    { n: "维普", tpl: "https://qikan.cqvip.com/Qikan/Search/Index?key={q}", note: "老牌中文期刊库" }
  ],

  groups: [
    {
      id: "oa",
      name: "开放获取 · 点开基本就有 PDF",
      note: "先查这里。查得到就不用求人，也不用连学校 VPN。",
      items: [
        { n: "Europe PMC", u: "https://europepmc.org/", kind: "oa",
          d: "生命科学最大的免费全文库之一。",
          tip: "检索框直接粘 DOI，写成 DOI:\"10.1016/j.xxx\" 命中率最高。" },
        { n: "PubMed Central（PMC）", u: "https://pmc.ncbi.nlm.nih.gov/", kind: "oa",
          d: "NIH 的全文库，收进来的都能自由下载。",
          tip: "PubMed 摘要页右侧出现 Free PMC article 就是免费，点进去有 PDF。" },
        { n: "Unpaywall", u: "https://unpaywall.org/", kind: "oa",
          d: "专门回答「这篇有没有合法免费版」。",
          tip: "装浏览器插件后，出版社页面右侧出现绿色小锁，点一下就跳到免费 PDF。" },
        { n: "OA.mg", u: "https://oa.mg/", kind: "oa",
          d: "只收能免费下的文章。",
          tip: "输 DOI 直接给 PDF 按钮，比翻出版社页面快。" },
        { n: "OpenAlex", u: "https://openalex.org/", kind: "oa",
          d: "免费开放学术图谱，能筛出 OA 版本。",
          tip: "本页单篇的「联网核查」就是查它，会直接把 pdf_url 抓出来。" },
        { n: "CORE", u: "https://core.ac.uk/", kind: "oa",
          d: "把全球机构仓储聚合起来。",
          tip: "出版社锁住的文章，这里常有作者自存的接收版。" },
        { n: "DOAJ", u: "https://doaj.org/", kind: "oa",
          d: "开放获取期刊目录。",
          tip: "判断一本刊是否正经 OA、有没有版面费陷阱。" },
        { n: "bioRxiv", u: "https://www.biorxiv.org/", kind: "oa",
          d: "生物学预印本。", tip: "方法最新、免费、可下载，引用时注明是 preprint。" },
        { n: "medRxiv", u: "https://www.medrxiv.org/", kind: "oa",
          d: "医学预印本。", tip: "临床相关的新结果常先出现在这。" },
        { n: "arXiv", u: "https://arxiv.org/", kind: "oa",
          d: "数理、计算、生信方法预印本。", tip: "q-bio 分类下找生信算法。" }
      ]
    },
    {
      id: "cn",
      name: "中文库 · 校园网或 VPN 内直接下载",
      note: "不在学校也能查，但下全文要过身份认证（看下一组的 CARSI）。",
      items: [
        { n: "中国知网 CNKI", u: "https://www.cnki.net/", kind: "sub",
          d: "中文期刊、硕博论文最全。", tip: "校外没认证只能看摘要和目录。" },
        { n: "万方数据", u: "https://www.wanfangdata.com.cn/", kind: "sub",
          d: "学位论文、会议论文齐全。", tip: "同一篇知网下不到时，万方常有。" },
        { n: "维普期刊", u: "http://www.cqvip.com/", kind: "sub",
          d: "老牌中文期刊库。", tip: "八九十年代的老文章这里更全。" },
        { n: "百度学术", u: "https://xueshu.baidu.com/", kind: "oa",
          d: "免费，聚合了各库入口。", tip: "结果页会出现「免费下载」的小标，直接点。" },
        { n: "读秀学术搜索", u: "https://www.duxiu.com/", kind: "sub",
          d: "查图书和章节。", tip: "书里的某一章能单独传，比买书划算。" },
        { n: "超星发现", u: "https://ss.zhizhen.com/", kind: "sub",
          d: "图书、期刊、论文一起搜。", tip: "认校外访问后可直接下。" },
        { n: "SinoMed 中国生物医学文献服务系统", u: "http://www.sinomed.ac.cn/", kind: "oa",
          d: "中文医学文献最全的检索库。", tip: "写中文综述、找国内同类研究靠它。" }
      ]
    },
    {
      id: "org",
      name: "机构与文献传递 · 正规路子，1-3 天到邮箱",
      note: "所有免费渠道都试过还没有，走这条。花钱很少，甚至免费。",
      items: [
        { n: "广西医科大学", u: "https://www.gxmu.edu.cn/", kind: "sub",
          d: "主页 → 图书馆 → 电子资源。",
          tip: "校外必须先用学校 VPN 或 CARSI 登录，否则知网只给看摘要。" },
        { n: "CARSI 校外访问", u: "https://www.carsi.edu.cn/", kind: "sub",
          d: "全国高校统一身份认证。",
          tip: "用学号登录后，在家也能用学校买的数据库，不用装 VPN。" },
        { n: "CALIS 文献传递", u: "http://www.calis.edu.cn/", kind: "help",
          d: "高校之间互借互传。", tip: "一次几块钱，多数学校对本校生有补贴。" },
        { n: "CASHL", u: "http://www.cashl.edu.cn/", kind: "help",
          d: "人文社科文献传递。", tip: "外文社科类找它。" },
        { n: "NSTL 国家科技图书文献中心", u: "https://www.nstl.gov.cn/", kind: "help",
          d: "国家级文献传递，按篇收费。", tip: "注册后填 DOI，通常几元、24 小时内发邮箱。" },
        { n: "国家图书馆", u: "http://www.nlc.cn/", kind: "help",
          d: "外文期刊存量大。", tip: "注册读者可在线申请文献传递。" },
        { n: "中科院文献情报中心", u: "http://www.las.cas.cn/", kind: "help",
          d: "科技类文献保障。", tip: "部分服务对外开放，需注册。" }
      ]
    },
    {
      id: "help",
      name: "作者与同行 · 等一两天，命中率最高",
      note: "期刊锁得再死，作者手里一定有 PDF。开口要，几乎没人拒绝。",
      items: [
        { n: "科研通（AbleSci）", u: "https://www.ablesci.com/", kind: "help",
          d: "国内最快的文献求助站，免费。",
          tip: "把 DOI 贴进去发一条求助，志愿者常当天就把 PDF 传上来。这是最省事的一招。" },
        { n: "ResearchGate", u: "https://www.researchgate.net/", kind: "help",
          d: "作者主页。", tip: "文章页点 Request full-text，作者本人会直接发到你邮箱。" },
        { n: "掌桥科研", u: "https://www.zhangqiaokeyan.com/", kind: "help",
          d: "中文文献代查代传。", tip: "知网下不到的硕博论文可以试。" },
        { n: "小木虫 · 文献求助版", u: "http://muchong.com/", kind: "help",
          d: "老牌学术论坛。", tip: "求助版长期有人接单，附上 DOI 就行。" },
        { n: "给通讯作者写信", u: "", kind: "help",
          d: "邮箱在 PubMed 摘要页和出版社页面都能找到。",
          tip: "模板一句话就够：I am a medical student working on radiation-induced liver injury and cannot access this paper. Could you kindly share a copy for my reading? 三句以内，附上文章标题和 DOI。" }
      ]
    },
    {
      id: "tool",
      name: "装上就自动告诉你哪能下（工具）",
      note: "一次装好，以后不用每次手动翻五个网站。",
      items: [
        { n: "Unpaywall 浏览器插件", u: "https://unpaywall.org/products/extension", kind: "tool",
          d: "在出版社页面自动找免费版。", tip: "Chrome/Edge 商店直接搜 Unpaywall 装。" },
        { n: "EndNote Click", u: "https://endnote.com/product-details/endnote-click", kind: "tool",
          d: "原 Kopernio，一键在所有合法来源找 PDF。", tip: "装上后出版社页面右下角会出现 PDF 按钮。" },
        { n: "Zotero", u: "https://www.zotero.org/download/", kind: "tool",
          d: "文献管理，一键抓元数据。", tip: "写作时自动生成参考文献，配合 Word 插件用。" },
        { n: "Connected Papers", u: "https://www.connectedpapers.com/", kind: "tool",
          d: "输入一篇种子文献，画出相关文献关系图。", tip: "找综述、找开山之作最快的方式。" },
        { n: "Research Rabbit", u: "https://researchrabbitapp.com/", kind: "tool",
          d: "按引用关系自动推荐下一篇该读的。", tip: "建一个 collection，把已读的丢进去，它会补全。" },
        { n: "Litmaps", u: "https://www.litmaps.com/", kind: "tool",
          d: "文献时间线图。", tip: "看一个领域什么时候起来的、谁在跟进。" },
        { n: "文献鸟 Storkapp", u: "https://www.storkapp.me/", kind: "tool",
          d: "关键词订阅，新文章自动发邮件。", tip: "订 RILD、hepatocyte heterogeneity 这类词，每周推送。" },
        { n: "SciSpace", u: "https://typeset.io/", kind: "tool",
          d: "上传 PDF 直接问它。", tip: "读不懂的段落选中就能解释，适合读方法部分。" },
        { n: "Paper Digest", u: "https://www.paperdigest.org/", kind: "tool",
          d: "把一篇论文压成三句话。", tip: "筛文献时先看摘要速览，再决定要不要精读。" }
      ]
    }
  ],

  wizard: [
    { s: "第 1 步", t: "先查有没有合法免费版",
      d: "装上 Unpaywall 或 EndNote Click，在出版社页面看有没有绿色标识；或者把 DOI 丢进 OA.mg、CORE、Europe PMC 各搜一次。约三成文章这一步就能拿到。" },
    { s: "第 2 步", t: "看 PubMed 有没有 Free PMC 标记",
      d: "PubMed 摘要页右侧写着 Free PMC article 的，点进去就有整篇 PDF，而且是官方允许下载的版本。" },
    { s: "第 3 步", t: "连上学校身份",
      d: "开学校 VPN，或者走 CARSI 用学号登录，再从图书馆电子资源进出版社。学校买过的刊，IP 认过就直接给 PDF。这一步能解决大部分 Elsevier、Springer、Wiley 的文章。" },
    { s: "第 4 步", t: "发求助，同时给作者写信",
      d: "科研通贴 DOI 发一条；同时在 ResearchGate 点 Request full-text。两条腿走路，一般 24 小时内有人回。这是命中率最高的一步。" },
    { s: "第 5 步", t: "最后走文献传递",
      d: "CALIS 或 NSTL 提交申请，几块钱，1-3 天发到邮箱。学校通常对本校生有补贴，甚至免费。论文里真有非它不可的一篇时，别在这一步上省时间。" }
  ]
};
