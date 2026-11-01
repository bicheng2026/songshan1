/* 嵩山一号 · 工作站 —— 视频课清单
   数据来源：B 站官方接口 api.bilibili.com/x/web-interface/view?bvid=…
   标题 / UP 主 / 时长 / 播放量都是接口返回的原始值，不是抄来的。
   顺序按「零基础该看的先后」排，step 是第几步。 */
window.SX_VIDEOS = {
  intro: "八套视频，按看的顺序排好了。不用挑，从上往下看就行。每一行都写了「为什么现在看它」和「大概多长时间」，卡在哪一步就回去看对应那一个。",
  path: [
    { step: "①", t: "先过 R 语言", d: "不会 R，后面全是天书。这套 590 分钟，看到「数据框」就够了，不用全看完。", bv: "BV1cs411j75B" },
    { step: "②", t: "再看转录组", d: "知道一份 RNA-seq 数据怎么变成差异基因表。看到「富集分析」为止。", bv: "BV12s41137HY" },
    { step: "③", t: "然后动手", d: "29 分钟，跟着敲一遍质控-降维-聚类。不用懂原理，先让代码跑起来。", bv: "BV1yR4y1q7X4" },
    { step: "④", t: "最后啃单细胞", d: "17 小时那套，当字典用。做一步查一步，不要试图一次看完。", bv: "BV1S44y1b76Z" }
  ],
  items: [
    {
      bv: "BV1cs411j75B", n: "生信人应该这样学 R 语言", up: "生信技能树-jimmy",
      mins: 590, plays: 551182, tier: "入门必看",
      why: "R 从装到用最系统的一套中文课。看前 40% 就够（基础语法、数据框、读文件），后面的绘图可以跳。",
      watch: "第 1-2 小时"
    },
    {
      bv: "BV12s41137HY", n: "转录组测序数据分析", up: "生信技能树-jimmy",
      mins: 331, plays: 549092, tier: "入门必看",
      why: "讲清一份 Bulk 数据从原始 counts 到差异基因、再到富集通路。第 2 到第 4 讲的内容它全包了。",
      watch: "第 3-4 小时"
    },
    {
      bv: "BV1yR4y1q7X4", n: "保姆级单细胞代码分析（1）：质控·降维·聚类", up: "未名阿-",
      mins: 29, plays: 57748, tier: "动手",
      why: "半小时跟敲一遍，先让单细胞流程在你手上跑通过一次。原理以后慢慢补。",
      watch: "半小时"
    },
    {
      bv: "BV1Dh4y1D7m6", n: "单细胞测序 01 入门：数据读取与分析", up: "富贵pic",
      mins: 18, plays: 13114, tier: "动手",
      why: "最短的一集。看完你就知道单细胞到底在干什么、数据长什么样。",
      watch: "20 分钟"
    },
    {
      bv: "BV1S44y1b76Z", n: "手把手教你做单细胞转录组测序数据分析", up: "Biomamba-生信基地",
      mins: 1033, plays: 508192, tier: "主力",
      why: "国内最全的一套单细胞长课，17 个小时。当字典用：做到哪一步就只看那一集。",
      watch: "按需查"
    },
    {
      bv: "BV1Ct421j7X3", n: "单细胞数据分析：标准分析流程（2026 更新）", up: "生信幻想家",
      mins: 293, plays: 291449, tier: "备选",
      why: "比上面那套新、节奏快。如果 17 小时那套嫌慢，用这套替代。",
      watch: "5 小时"
    },
    {
      bv: "BV1mE421w7Te", n: "单细胞亚群注释", up: "生信技能树-jimmy",
      mins: 21, plays: 4622, tier: "进阶",
      why: "注释这一步最容易做错，也最容易糊弄过去。专门花 20 分钟看这一集。",
      watch: "20 分钟"
    },
    {
      bv: "BV1To6FB1Ewm", n: "空间转录组（结合单细胞）", up: "生信幻想家",
      mins: 284, plays: 30894, tier: "进阶",
      why: "单细胞之后才上空间。先用这套建立直觉，别一上来就啃方法学。",
      watch: "5 小时"
    }
  ],
  /* 不习惯看视频的，这几份文字教程质量更高 */
  reads: [
    { n: "R for Data Science（免费在线）", u: "https://r4ds.hadley.nz/", d: "英文但极好读，配图多，讲的是「怎么用 R 处理数据」" },
    { n: "Seurat PBMC3K 官方流程", u: "https://satijalab.org/seurat/articles/pbmc3k_tutorial", d: "单细胞的 Hello World，照着抄一遍就能出图" },
    { n: "OSCA：单细胞分析书", u: "https://bioconductor.org/books/release/OSCA/", d: "免费、系统、比绝大多数中文课严谨" },
    { n: "sc-best-practices", u: "https://www.sc-best-practices.org/", d: "专讲「这一步为什么这么做、什么时候会错」" }
  ]
  ,
  /* 自己录的 R 课：托管在 123 网盘，免登录可看可下。
     share 是分享链接；code 是提取码（没有就留空字符串）。
     classes 里的文件名取自本地真实文件，访客在 123 分享里按文件名对得上。 */
  local: {
    title: "自己录的 R 课（小陈 · 10 课 50 集）",
    share: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
    code: "",
    note: "我（小陈）从零录的 R&RStudio 入门，从装环境到能自己跑代码，比 B 站那套更贴咱们课题。点上面按钮去 123 网盘，免登录。视频按 Class1–10 分文件夹；每课的 PPT 课件（ClassN课件.pptx）和一套生信实战代码与练习数据（SHENGXIN 文件夹，含 R 脚本、芯片/GSE、TCGA、CIBERSORT、生存分析等）都在同一个分享里，进去按需取用。",
    classes: [
      { cls: 1, files: [ {n:"class1-1.mp4", mb:124.8}, {n:"class1-2.mp4", mb:565.5} ] },
      { cls: 2, files: [ {n:"Class2-1.mp4", mb:52.2}, {n:"Class2-2.mp4", mb:302.2}, {n:"Class2-3.mp4", mb:657.6}, {n:"Class2-4.mp4", mb:890.3} ] },
      { cls: 3, files: [ {n:"Class3-1.mp4", mb:19.8}, {n:"Class3-2.mp4", mb:298.5}, {n:"Class3-3.mp4", mb:99.0}, {n:"Class3-4.mp4", mb:130.1}, {n:"Class3-5.mp4", mb:186.5}, {n:"Class3-6.mp4", mb:1039.5} ] },
      { cls: 4, files: [ {n:"Class4-1.mp4", mb:45.4}, {n:"Class4-2.mp4", mb:313.1}, {n:"Class4-3.mp4", mb:426.7}, {n:"Class4-4.mp4", mb:151.3}, {n:"Class4-5.mp4", mb:459.2}, {n:"Class4-6.mp4", mb:510.9} ] },
      { cls: 5, files: [ {n:"Class5-1.mp4", mb:20.0}, {n:"Class5-2.mp4", mb:489.0}, {n:"Class5-3.mp4", mb:433.0}, {n:"Class5-4.mp4", mb:352.4}, {n:"Class5-5.mp4", mb:565.5}, {n:"Class5-6.mp4", mb:284.1} ] },
      { cls: 6, files: [ {n:"Class6-1.mp4", mb:12.8}, {n:"Class6-2.mp4", mb:246.0}, {n:"Class6-3.mp4", mb:199.1}, {n:"Class6-4.mp4", mb:343.5}, {n:"Class6-5.mp4", mb:1036.9}, {n:"Class6-6.mp4", mb:216.0} ] },
      { cls: 7, files: [ {n:"Class7-1.mp4", mb:7.2}, {n:"Class7-2.mp4", mb:321.8}, {n:"Class7-3.mp4", mb:157.6}, {n:"Class7-4.mp4", mb:298.1}, {n:"Class7-5.mp4", mb:605.0}, {n:"Class7-6.mp4", mb:401.1} ] },
      { cls: 8, files: [ {n:"Class8-1.mp4", mb:8.2}, {n:"Class8-2.mp4", mb:907.2}, {n:"Class8-3.mp4", mb:628.6}, {n:"Class8-4.mp4", mb:767.7}, {n:"Class8-5.mp4", mb:368.1} ] },
      { cls: 9, files: [ {n:"Class9-1.mp4", mb:9.3}, {n:"Class9-2.mp4", mb:225.9}, {n:"Class9-3.mp4", mb:201.8}, {n:"Class9-4.mp4", mb:290.4}, {n:"Class9-5.mp4", mb:107.0}, {n:"Class9-6.mp4", mb:388.4} ] },
      { cls: 10, files: [ {n:"Class10-1.mp4", mb:11.2}, {n:"Class10-2.mp4", mb:1830.5}, {n:"Class10-3.mp4", mb:68.3} ] }
    ]
  }
};
