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
};
