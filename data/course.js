/* 嵩山一号 · 工作站 —— 通用课程
   结构参照本地 10 讲录播课（50 个视频 / 342 个代码与课件文件）重排。
   每节两段代码：一段 base R 能在站内直接跑（讲原理），一段标了包名的真实写法（讲实战）。
   不依赖本课题数据。 */
window.SX_COURSE = {
  intro: "第 0 讲真的从零开始（1 + 1 怎么写、变量是什么）；之后 10 讲按「一篇生信文章从数据到成图」的顺序排：第 1 讲讲清 counts 矩阵是什么，第 2 讲跑通差异分析，3-4 讲把基因变成通路和细胞，5-6 讲把结果变成临床结论，7-10 讲网络、GEO 实战、模型和复现。每节都分两段代码：一段只用 base R，能在本页直接点「运行」看到结果（讲原理）；另一段标了真实包名的写法，讲真正做分析时怎么写。看懂原理再去跑真包，顺序反了只会抄代码。每讲下面都挂了对应的「小陈录播」（123 网盘托管、免登录）：文件名直接写在该讲里，点开分享找同名文件即可看；每课 PPT 课件（ClassN课件.pptx）和生信实战代码/数据（SHENGXIN 文件夹）也在同一分享里。B 站视频、官方教程、文档与数据工具，也不再堆在一个资源区，而是按主题拆开挂到对应的讲次「延伸资料」里。",
  
  chapters: [
    {
      id: "k1",
      title: "第 1 讲　生信是什么：counts 矩阵、Bulk 与单细胞",
      plain: "你下载到的那个大表格，格子里其实是「数到几条」，不是「表达高不高」。这讲只说清这一件事——搞明白了，后面的归一化、差异分析才不会越看越糊涂。",
      goal: "搞清「你拿到的到底是什么数」，后面的归一化、差异分析才有意义。",
      watch: [
        { n: "生信技能树《生信人应该这样学 R 语言》", u: "https://www.bilibili.com/video/BV1cs411j75B" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "class1-1.mp4",
        "class1-2.mp4"
        ]
      },
      refs: [
        { n: "Biomamba《手把手教你做单细胞转录组测序数据分析》", u: "https://www.bilibili.com/video/BV1S44y1b76Z", d: "单细胞最全的一套，配合单细胞专题看", t: "video" },
        { n: "生信幻想家《单细胞数据分析 标准分析流程》", u: "https://www.bilibili.com/video/BV1Ct421j7X3", d: "2026 年更新版，流程完整、节奏比上一套快", t: "video" },
        { n: "生信幻想家《空间转录组（结合单细胞）》", u: "https://www.bilibili.com/video/BV1To6FB1Ewm", d: "单细胞之后再上空间，先看这套建立直觉", t: "video" },
        { n: "未名阿《保姆级单细胞代码分析（1）质控·降维·聚类》", u: "https://www.bilibili.com/video/BV1yR4y1q7X4", d: "短，适合先跑通一遍再回头看长课", t: "video" },
        { n: "富贵 pic《单细胞测序 01 入门：数据读取与分析》", u: "https://www.bilibili.com/video/BV1Dh4y1D7m6", d: "最短的入门，看完知道单细胞在干什么", t: "video" },
        { n: "生信技能树-jimmy《单细胞亚群注释》", u: "https://www.bilibili.com/video/BV1mE421w7Te", d: "注释这一步最容易做错，专门看这一集", t: "video" },
        { n: "Seurat 官网", u: "https://satijalab.org/seurat/", d: "所有 Seurat 教程的入口，版本更新都在这", t: "doc" },
        { n: "Seurat PBMC3K 标准流程", u: "https://satijalab.org/seurat/articles/pbmc3k_tutorial", d: "单细胞的「Hello World」，必须亲手敲一遍", t: "doc" },
        { n: "Seurat 常用命令速查", u: "https://satijalab.org/seurat/articles/essential_commands", d: "对象结构、取子集、改 metadata 都在这里", t: "doc" },
        { n: "OSCA：单细胞分析 Bioconductor 书", u: "https://bioconductor.org/books/release/OSCA/", d: "最完整的免费单细胞教材，质量高于绝大多数中文课", t: "doc" },
        { n: "sc-best-practices", u: "https://www.sc-best-practices.org/", d: "专门讲「这一步为什么这么做、什么时候会错」", t: "doc" },
        { n: "Galaxy 单细胞专题", u: "https://training.galaxyproject.org/training-material/topics/single-cell/", d: "不写代码也能跑全流程，用来理解每一步在做什么", t: "doc" },
        { n: "Monocle3 官网", u: "https://cole-trapnell-lab.github.io/monocle3/", d: "轨迹推断的标准工具", t: "doc" },
        { n: "Harmony 快速上手", u: "https://portals.broadinstitute.org/harmony/articles/quickstart.html", d: "多样本整合最常用的方法之一", t: "doc" },
        { n: "CellChat 官方仓库", u: "https://github.com/jinworks/CellChat", d: "细胞通讯分析，vignette 在仓库 README 里", t: "doc" },
        { n: "R 官方入门手册", u: "https://cran.r-project.org/doc/manuals/r-release/R-intro.html", d: "遇到语法歧义时查这里，比搜索引擎准", t: "doc" },
        { n: "R for Data Science（2 版）", u: "https://r4ds.hadley.nz/", d: "dplyr/ggplot 的正统教材，免费在线", t: "doc" }
      ],
      subs: [
        {
          t: "1.1 一次转录组测序在测什么：counts 不是表达量",
          why: "你下载到的 counts 矩阵里，每个格子是「数到多少条 reads」，不是「这个基因表达多高」。理解这一点，后面所有归一化才有意义。",
          pts: [
            "行是基因，列是样本，格子里是**整数 count**。不同样本的列和差别可以到十倍，因为测序深度不同。",
            "归一化只做一件事：把「测得多」和「表达高」分开。CPM 除文库大小，TPM/FPKM 再除基因长度。",
            "counts 给 DESeq2/edgeR 用（它们要整数），log2(TPM+1) 给热图和相关分析用。两者不能混着喂。"
          ],
          code: `set.seed(1)
# 6 个基因 x 4 个样本，格子里的数是 reads 条数
cnt <- matrix(c(120, 40, 8, 300, 15, 2,
                130, 35, 11, 290, 18, 3,
                118, 44, 9, 310, 12, 4,
                125, 38, 10, 295, 16, 2), nrow = 6,
              dimnames = list(paste0("G", 1:6), paste0("S", 1:4)))
cnt

lib <- colSums(cnt)                       # 每个样本的文库大小
lib

round(sweep(cnt, 2, lib, "/") * 1e6, 1)   # CPM
round(log2(sweep(cnt, 2, lib, "/") * 1e6 + 1), 2)   # log2CPM，画图用这个`
        },
        {
          t: "1.2 Bulk 和单细胞的区别，决定你能问什么问题",
          why: "同样是「表达矩阵」，Bulk 的一列是一个组织，单细胞的一列是一个细胞。这个差别决定了你只能回答哪一类问题。",
          pts: [
            "Bulk 一列 = 上千个细胞的平均值。异质性被平均掉，只能回答「这块组织整体怎么样」。",
            "单细胞一列 = 一个细胞。行数从「2 万基因 x 几十样本」变成「2 万基因 x 几万细胞」，而且极度稀疏。",
            "所以：组间比较、预后模型用 Bulk；哪类细胞在变、细胞之间怎么通讯用单细胞。两者不能互相替代。"
          ],
          code: `set.seed(2)
# Bulk：6 基因 x 4 样本
bulk <- matrix(rpois(24, 50), nrow = 6,
               dimnames = list(paste0("G", 1:6), paste0("S", 1:4)))
dim(bulk)
mean(bulk == 0)

# 单细胞：同一个组织拆成 200 个细胞
sc <- matrix(rpois(6 * 200, 0.8), nrow = 6,
             dimnames = list(paste0("G", 1:6), paste0("C", 1:200)))
dim(sc)
mean(sc == 0)      # 稀疏度，真实数据常在 0.9 以上

rowMeans(bulk)     # Bulk 里每个基因的均值
rowMeans(sc)       # 单细胞 200 个细胞的均值，量级完全不同`
        },
        {
          t: "1.3 为什么这条流程非得用 R",
          why: "生信不是写软件，是「把统计方法接到数据上，再解释结果」。R 的包生态在这件事上仍然最全，而且论文方法段写的就是包名。",
          pts: [
            "Bioconductor 上两千多个包，DESeq2、edgeR、limma、Seurat、GSVA、CellChat 全在里面。",
            "一篇生信文章的方法段，本质就是一段 R 代码说明（包名 + 版本 + 参数 + 阈值）。复现别人的文章，就是把这些抄对。",
            "R 的短板是工程（大数据、并行、部署），但 Bulk 和单细胞这个数据量用不着。"
          ],
          code: `df <- data.frame(group = rep(c("tumor", "normal"), each = 3),
                 expr  = c(9.1, 8.7, 9.4, 6.2, 6.8, 6.1))
df

t.test(expr ~ group, data = df)              # 一行完成分组检验
aggregate(expr ~ group, data = df, mean)     # 分组均值
aggregate(expr ~ group, data = df, sd)       # 分组标准差`
        }
      ]
    },
    {
      id: "k2",
      title: "第 2 讲　TCGA 下载与差异分析",
      plain: "想知道「哪些基因变了」，就得会算这一笔。这讲不套包，先用手算的方式把 logFC 和 p 值算一遍，以后看到别人表里的数字，你能自己复算核对。",
      goal: "把「哪些基因变了」这件事算出来，并且知道每个数字是怎么来的。",
      watch: [
        { n: "生信技能树《转录组测序数据分析》", u: "https://www.bilibili.com/video/BV12s41137HY" },
        { n: "DESeq2 官方 vignette", u: "https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class2-1.mp4",
        "Class2-2.mp4",
        "Class2-3.mp4",
        "Class2-4.mp4"
        ]
      },
      refs: [
        { n: "GDC（TCGA 官方门户）", u: "https://portal.gdc.cancer.gov/", d: "TCGA 唯一的官方来源，别用二手整理版", t: "doc" },
        { n: "GEO", u: "https://www.ncbi.nlm.nih.gov/geo/", d: "查 GSE 号、下表达矩阵和临床信息", t: "doc" },
        { n: "UCSC Xena", u: "https://xenabrowser.net/", d: "同一队列的 TCGA 标准化数据，省掉一半预处理", t: "doc" },
        { n: "TCGAbiolinks（Bioconductor 官方）", u: "https://bioconductor.org/packages/release/bioc/html/TCGAbiolinks.html", d: "R 里直接下 TCGA 的标准入口，比网页点快且可复现", t: "doc" },
        { n: "UCSCXenaTools（rOpenSci）", u: "https://docs.ropensci.org/UCSCXenaTools/", d: "用代码从 Xena 拉数据，避免手动点错版本", t: "doc" },
        { n: "TCGA 下载-差异-预后 全流程避坑（巴典科研）", u: "http://mp.weixin.qq.com/s?__biz=MzAwMDc4MjYyMQ==&mid=2650921075&idx=1&sn=95c3d39d74ab05129544d6441cb578be&chksm=80420d970ede214e638a842c174b5bb23ba3d5fae5d590e3095feef7f211e49035d9186dd212#rd", d: "含样本筛选红线、FPKM→TPM、生存变量构建、审稿常见质疑", t: "doc" }
      ],
      subs: [
        {
          t: "2.1 TCGA 里到底有哪几套数：counts / FPKM / TPM",
          why: "同一个基因在 TCGA 里有三套数。拿错一套，整个下游都偏，而且错得很隐蔽——因为图还是画得出来。",
          pts: [
            "counts：整数，DESeq2/edgeR 的输入。FPKM/TPM：已经按长度和深度归一过，**不能**直接进 DESeq2。",
            "TPM 的好处是每个样本的 TPM 加起来一样，跨样本可比；FPKM 不是，所以现在基本被 TPM 取代。",
            "样本类型看 barcode 第 14-15 位：`01` 原发肿瘤、`11` 正常组织、`06` 转移。写筛选条件时按这个来。"
          ],
          code: `barcodes <- c("TCGA-05-4384-01A-01R-1755-07",
              "TCGA-05-4384-11A-01R-1755-07",
              "TCGA-05-4244-01A-01R-1107-07")
substr(barcodes, 14, 15)             # "01" 肿瘤 / "11" 正常
table(substr(barcodes, 14, 15))

# 从 counts 手算 TPM（原理演示，实际直接用现成 TPM）
cnt <- matrix(c(100, 300, 50, 20, 60, 400), nrow = 3,
              dimnames = list(paste0("G", 1:3), c("S1", "S2")))
len  <- c(1000, 2000, 500)           # 基因长度，单位 bp
rate <- cnt / len                    # 每 bp 的 reads
tpm  <- sweep(rate, 2, colSums(rate), "/") * 1e6
round(tpm, 1)
colSums(tpm)                         # 每个样本加起来都是 1e6`,
          real: {
            pkg: "DESeq2",
            code: `dds <- DESeqDataSetFromMatrix(countData = cnt, colData = coldata, design = ~ group)
dds <- DESeq(dds)
res <- results(dds, contrast = c("group", "tumor", "normal"))
res <- lfcShrink(dds, coef = "group_tumor_vs_normal", type = "apeglm")`
          }
        },
        {
          t: "2.2 差异分析到底在算什么",
          why: "logFC 是「两组平均表达差几倍」，p 值是「这个差相对于组内波动显不显眼」。两件事，回答两个不同问题。",
          pts: [
            "每组 3 例时，一个离群样本就能把 logFC 拉翻倍。所以必须同时看每组中位数和离散度，不能只看 p。",
            "低表达基因方差估不稳，会产生大量假阳性。DESeq2 用收缩（shrinkage）把它们的 logFC 往 0 拉，这就是 `lfcShrink` 那一步的意义。",
            "差异基因数量完全取决于阈值。写文章必须写清楚，常见写法是 |logFC| > 1 且 adj.P < 0.05。"
          ],
          code: `set.seed(3)
g1 <- c(9.2, 8.8, 9.5)                 # 肿瘤组 3 例
g2 <- c(6.1, 6.4, 5.9)                 # 正常组 3 例
log2(mean(g1) / mean(g2))              # logFC
t.test(g1, g2)$p.value

g1b <- c(9.2, 8.8, 11.5)               # 只把第三例换成离群值
log2(mean(g1b) / mean(g2))             # logFC 变了多少
t.test(g1b, g2)$p.value                # p 变了多少`
        },
        {
          t: "2.3 多重检验与 FDR：为什么 adj.P 比 P 大那么多",
          why: "一次检验两万个基因，就算一个都没差异，p < 0.05 也天然会给你一千个「显著」。FDR 就是把这条线重新画。",
          pts: [
            "Bonferroni：p 乘以检验次数。控「一个假阳性都不许有」，代价是几乎什么都检不出。",
            "BH（Benjamini-Hochberg）：把 p 排序后按秩次缩放，控「报出来的里面假的比例」。生信默认用它。",
            "p 值分布能自查：没有差异时 p 应均匀分布在 0-1；如果 0 附近堆成一座山，说明有真信号。"
          ],
          code: `set.seed(4)
p <- c(runif(90), runif(10, 0, 0.001))   # 90 个无差异 + 10 个真差异
sum(p < 0.05)                            # 朴素阈值抓到的
sum(p.adjust(p, method = "BH") < 0.05)   # BH 校正后剩下的
sum(p.adjust(p, method = "bonferroni") < 0.05)

hist(p, breaks = 20, main = "p 值分布自查", xlab = "p")`
        },
        {
          t: "2.4 火山图和热图，画的其实就是那几列数",
          why: "火山图横轴是效应量、纵轴是显著性；热图是标准化后的表达值。它们都不产生新信息，只是把上面算好的数换个坐标看。",
          pts: [
            "火山图纵轴用 `-log10(adj.P)`（越小越往上），横轴用 logFC（对称才有意义）。",
            "热图一定要先按行（基因）标准化，否则高表达基因吃掉整个色阶，别的基因全是一个色。",
            "聚类树本身就是结果：它告诉你哪些样本像、哪些基因同起同落。不要把它当装饰删掉。"
          ],
          code: `res <- data.frame(gene = paste0("G", 1:6),
                  logFC = c(3.1, -2.4, 0.3, 4.2, -0.2, 1.8),
                  padj  = c(1e-9, 1e-4, 0.7, 1e-12, 0.9, 0.02))
res$neglog <- -log10(res$padj)
res$dir <- ifelse(res$padj < 0.05 & abs(res$logFC) > 1,
                  ifelse(res$logFC > 0, "up", "down"), "ns")
res[order(-res$logFC), ]

# 热图的输入：按行做 z 标准化
m <- matrix(c(9,8,9,6,6,5,  3,4,3,7,8,7), nrow = 2, byrow = TRUE,
            dimnames = list(c("G1","G2"), paste0("S",1:6)))
round(t(scale(t(m))), 2)`
        }
      ]
    },
    {
      id: "k3",
      title: "第 3 讲　富集分析：ORA、背景集与 GSEA",
      plain: "一长串基因名看着头大，它其实只在说一件事：这些基因全挤在同一个功能上。这讲把富集 p 值拆成四个数，顺便解释为什么你和别人算出来的对不上。",
      goal: "知道富集 p 值是怎么算出来的，以及为什么你和别人算的不一样。",
      watch: [
        { n: "clusterProfiler 配套书", u: "https://yulab-smu.top/biomedical-knowledge-mining-book/" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class3-1.mp4",
        "Class3-2.mp4",
        "Class3-3.mp4",
        "Class3-4.mp4",
        "Class3-5.mp4",
        "Class3-6.mp4"
        ]
      },
      refs: [
        { n: "GSVA 官方 vignette", u: "https://bioconductor.org/packages/release/bioc/vignettes/GSVA/inst/doc/GSVA.html", d: "通路打分和 ssGSEA 的原始实现", t: "doc" },
        { n: "clusterProfiler（Bioconductor 官方）", u: "https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html", d: "包作者维护，版本最新，enrichGO/enrichKEGG/gseGO 都在这里", t: "doc" },
        { n: "Gene Ontology 官网", u: "http://geneontology.org/", d: "GO term 的权威解释，查注释来源", t: "doc" },
        { n: "KEGG 官网", u: "https://www.genome.jp/kegg/", d: "通路图的原始出处", t: "doc" },
        { n: "MSigDB（GSEA 官方基因集库）", u: "https://www.gsea-msigdb.org/gsea/msigdb/", d: "C2/C5/C6 等基因集，GSEA 的弹药库", t: "doc" },
        { n: "g:Profiler（在线 ORA，免代码）", u: "https://biit.cs.ut.ee/gprofiler/gost", d: "不写代码也能做富集，和 clusterProfiler 互相印证", t: "tool" },
        { n: "KEGG/GO/Reactome/DO/MSigDB 全套 GSEA 代码（基迪奥）", u: "http://mp.weixin.qq.com/s?__biz=MzA5NzQzOTgzMw==&mid=2651005004&idx=1&sn=2432c266946ab17d59324ba518b621e0&chksm=8af9046d5a73f73cc0b21b2522e11523b4a721051ed3e87736d898860347a7f0e36453005d1d#rd", d: "五类数据库的 GSEA 与可视化实例", t: "doc" }
      ],
      subs: [
        {
          t: "3.1 ORA 就是一个超几何检验",
          why: "富集分析听起来玄，落到公式上只有四个数：通路里共几个、差异基因几个、交集几个、全基因组几个。",
          pts: [
            "富集 p 值回答的是：从全基因组里随机抓这么多差异基因，落进这个通路 ≥ 现在这个数的概率有多大。",
            "四个数分别是 `M`（通路基因数）、`n`（差异基因数）、`k`（交集）、`N`（背景基因数）。",
            "通路大小会带偏：大通路天然容易显著，所以必须同时看 GeneRatio 和 BgRatio，不能只看 p。"
          ],
          code: `N <- 20000; M <- 200; n <- 500; k <- 25     # 背景 / 通路 / 差异 / 交集
phyper(k - 1, M, N - M, n, lower.tail = FALSE)

# 数字小的时候，用 2x2 列联表的 Fisher 精确检验算，结果一样
tiny <- matrix(c(3, 7, 5, 85), 2)
rownames(tiny) <- c("in_pathway", "not_in_pathway")
colnames(tiny) <- c("deg", "not_deg")
tiny
fisher.test(tiny)$p.value`
        },
        {
          t: "3.2 背景集选错，p 值能差几个数量级",
          why: "同一个差异基因列表，换个背景，p 值能从 1e-8 变成 0.3。这就是「复现不出别人富集结果」最常见的原因。",
          pts: [
            "背景应该是「这次实验里有机会被测到的基因」，也就是表达过滤后的基因，不是全基因组。",
            "物种注释版本（org.Hs.eg.db 的版本）不同，通路里的基因数会变，写文章要记版本号。",
            "clusterProfiler 里 `universe = rownames(expr)` 这一句最常被漏掉，漏了就等于用全基因组当背景。"
          ],
          code: `k <- 25; n <- 500; M <- 200
for (N in c(20000, 15000, 12000)) {
  p <- phyper(k - 1, M, N - M, n, lower.tail = FALSE)
  cat(sprintf("背景 %5d 个基因 -> p = %.3g\\n", N, p))
}`
        },
        {
          t: "3.3 GSEA 和 ORA 的本质差别",
          why: "ORA 先把基因砍成「显著/不显著」两堆，砍的那一刀就把信息丢了。GSEA 不砍，直接问「这个通路是不是集中在列表顶端」。",
          pts: [
            "GSEA 的输入是排好序的全基因列表（按 logFC 或 signal2noise），不需要定阈值。",
            "核心输出是 ES（富集分数）和 NES（校正通路大小之后）。NES 正 = 上调富集，负 = 下调富集。",
            "没有显著差异基因也能跑 GSEA。反过来，ORA 一旦阈值卡死，可能一个通路都得不到。"
          ],
          code: `set.seed(5)
genes <- paste0("G", 1:200)
stat  <- rnorm(200); names(stat) <- genes
stat  <- sort(stat, decreasing = TRUE)      # 按统计量排序的全基因列表
pathway <- sample(genes, 20)                # 假设的通路基因

hit <- names(stat) %in% pathway
w   <- abs(stat)                            # 加权：越靠两端的基因权重越大
es  <- cumsum(ifelse(hit, w, 0) / sum(w[hit]) -
              ifelse(hit, 0, 1) / sum(!hit))
max(es); min(es)                            # 偏离 0 最远的那一点就是 ES
which.max(abs(es))                          # 峰值出现在第几位`,
          real: {
            pkg: "clusterProfiler / fgsea",
            code: `gl <- sort(setNames(res$log2FoldChange, rownames(res)), decreasing = TRUE)
eg <- enrichGO(gene = deg, universe = rownames(expr), OrgDb = org.Hs.eg.db,
               keyType = "SYMBOL", ont = "BP", pAdjustMethod = "BH")
fg <- fgsea(pathways = msigdb_list, stats = gl, minSize = 15, maxSize = 500)`
          }
        }
      ]
    },
    {
      id: "k4",
      title: "第 4 讲　免疫浸润：反卷积、ssGSEA 与三种方法的坑",
      plain: "一块肿瘤里混着肿瘤细胞、免疫细胞、成纤维细胞，而测序只给你「整块的平均值」。这讲讲怎么把一个数拆回几份，以及为什么三种方法给出的根本不是同一样东西。",
      goal: "知道「免疫浸润」这三个字背后是三个完全不同的东西，不能混着说。",
      watch: [
        { n: "GSVA 官方 vignette", u: "https://bioconductor.org/packages/release/bioc/vignettes/GSVA/inst/doc/GSVA.html" },
        { n: "TIMER2.0（不写代码也能对结论）", u: "http://timer.cistrome.org/" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class4-1.mp4",
        "Class4-2.mp4",
        "Class4-3.mp4",
        "Class4-4.mp4",
        "Class4-5.mp4",
        "Class4-6.mp4"
        ]
      },
      refs: [
        { n: "CIBERSORTx 官网（反卷积算免疫细胞比例）", u: "https://cibersortx.stanford.edu/", d: "22 种免疫细胞的参考矩阵就在这里，注册后能跑网页版", t: "tool" },
        { n: "xCell 官网（ssGSEA 打分，64 种细胞）", u: "https://xcell.ucsf.edu/", d: "输出是富集分数不是百分比，别拿去做归一化", t: "tool" },
        { n: "TIMER2.0（按癌种优化的免疫浸润）", u: "http://timer.cistrome.org/", d: "不写代码也能对结论，和 CIBERSORT 不是一回事", t: "tool" },
        { n: "ESTIMATE（算免疫/基质评分）", u: "https://bioinformatics.mdanderson.org/estimate/", d: "肿瘤纯度估计算法的经典实现", t: "tool" },
        { n: "MCP-counter 官方仓库", u: "https://github.com/ebecht/MCPcounter", d: "8 种免疫 + 2 种基质细胞，简单直观", t: "doc" },
        { n: "GSVA 官方 vignette（ssGSEA 入口）", u: "https://bioconductor.org/packages/release/bioc/vignettes/GSVA/inst/doc/GSVA.html", d: "k4 正文里 ssGSEA 那段的直接手册", t: "doc" },
        { n: "看小果：CIBERSORT 与 xCell 两种 R 包演示（B 站专栏）", u: "https://www.bilibili.com/read/cv21535404/", d: "跟着敲一遍 CIBERSORT.R + LM22 的流程", t: "doc" }
      ],
      subs: [
        {
          t: "4.1 反卷积：把一个数拆回几种细胞",
          why: "一块肿瘤里混着肿瘤细胞、免疫细胞、成纤维细胞。测序只给你「整块的平均表达」，反卷积就是把一个数拆回几份。",
          pts: [
            "数学上是个线性方程组：整块表达 = Σ(细胞比例 × 该细胞在该基因上的表达)。解出来的系数就是比例。",
            "参考矩阵决定一切：CIBERSORT 用 LM22（22 种免疫细胞），xCell 用基因集打分。两者的结果**不能直接比较**。",
            "输出的是估计值，绝对值不可信，只有组间相对高低有意义。"
          ],
          code: `# 参考矩阵：两种细胞在 3 个标志基因上的表达
ref <- matrix(c(10, 1, 8,
                1, 12, 2), nrow = 3,
              dimnames = list(c("CD3D", "CD19", "LYZ"), c("Tcell", "Bcell")))
ref

obs <- c(6.1, 6.5, 5.2)                    # 观测到的一块组织的整块表达
fit <- lm(obs ~ ref[, 1] + ref[, 2] - 1)   # 无截距，解两个比例
coef(fit)
round(coef(fit) / sum(coef(fit)), 3)       # 归一成比例`
        },
        {
          t: "4.2 ssGSEA 不打分比例，只打「整体偏高还是偏低」",
          why: "ssGSEA 不算细胞比例。它看的是：这个细胞类型的标志基因，在这份样本里是不是整体排在前面。",
          pts: [
            "做法：样本内所有基因按表达排秩，看基因集成员落在秩里的位置是否系统性偏前或偏后，累加得到富集分。",
            "分数是相对的。同一批样本内可比，跨数据集（不同平台、不同归一化方式）不可比。",
            "关键坑：基因集之间高度重叠时分数会一起动。别把「免疫都高」解释成「每种免疫细胞都多」。"
          ],
          code: `set.seed(6)
expr <- setNames(rnorm(1000), paste0("G", 1:1000))
expr[c("G1","G5","G9","G20")] <- expr[c("G1","G5","G9","G20")] + 1.5

r   <- rank(expr)                  # 样本内排秩
set <- c("G1","G5","G9","G20")     # 假设的 T 细胞标志基因
mean(r[set])                       # 集合平均秩：越小说明越靠前
mean(r)                            # 对照：全体平均秩（应为 500 左右）`
        },
        {
          t: "4.3 三种方法各自的假设，混用就会写错结论",
          why: "ESTIMATE 给的是「浸润程度」的分，CIBERSORT 给的是比例，ssGSEA 给的是富集分。三样东西写在同一句结论里，审稿人一眼看出来。",
          pts: [
            "ESTIMATE：基于免疫/基质特征基因做单样本 GSEA，输出 ImmuneScore / StromalScore。只能排序，不能当比例。",
            "CIBERSORT：必须看置换检验的 PV 值。PV > 0.05 的样本其比例不可用，这一步很多人直接跳过。",
            "所有反卷积都假设「参考矩阵覆盖了实际存在的细胞类型」。缺一类，它的表达会被摊到其他类上，表现是「比例都很平均」。"
          ],
          code: `s <- data.frame(sample = paste0("S", 1:5),
                ESTIMATE = c(1200, 800, 1500, 400, 950),
                CIB_T    = c(0.31, 0.12, 0.45, 0.05, 0.22),
                ssGSEA_T = c(0.62, 0.28, 0.71, 0.11, 0.40))
round(cor(s[, -1]), 2)      # 三者相关性往往只有 0.5-0.7
rank(s$ESTIMATE); rank(s$CIB_T)   # 排序也不完全一致`
        }
      ]
    },
    {
      id: "k5",
      title: "第 5 讲　临床预后：生存数据、KM、COX 与 ROC",
      plain: "把表达量变成「高危 / 低危」，再画一条生存曲线。这讲会说明白 HR 和 AUC 各能说明什么、不能说明什么——这两句话写错，审稿人一眼就看出来。",
      goal: "把表达数据变成「高危/低危」，并且知道 HR、AUC 各自能说明什么、不能说明什么。",
      watch: [
        { n: "survival 包（CRAN）", u: "https://cran.r-project.org/web/packages/survival/index.html" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class5-1.mp4",
        "Class5-2.mp4",
        "Class5-3.mp4",
        "Class5-4.mp4",
        "Class5-5.mp4",
        "Class5-6.mp4"
        ]
      },
      refs: [
        { n: "survminer（画出版级 KM 曲线）", u: "https://cran.r-project.org/web/packages/survminer/", d: "ggsurvplot 的 pval/risk.table 参数都在这", t: "doc" },
        { n: "timeROC（时间依赖 ROC/AUC）", u: "https://cran.r-project.org/web/packages/timeROC/", d: "普通 ROC 不考虑时间，预后要用这个", t: "doc" },
        { n: "rms（列线图 nomogram 与校准）", u: "https://cran.r-project.org/web/packages/rms/", d: "nomogram、calibrate 都在里面", t: "doc" },
        { n: "KM plotter（在线生存分析，不用写代码）", u: "https://kmplot.com/", d: "拿基因名直接出 KM 图，先对结论再写 R", t: "tool" },
        { n: "【麦子】Cox 回归的 R 操作：单因素到多因素", u: "https://www.bilibili.com/video/av18918951/", d: "小姐姐带写代码，每一步都讲，初学者友好", t: "video" },
        { n: "R 语言复现 SCI：COX 预测模型全流程（B 站专栏）", u: "https://www.bilibili.com/read/cv28955507/", d: "筛选变量→列线图→校准→ROC→DCA 一气呵成", t: "doc" },
        { n: "How to run survival analysis in R（英文，但讲得最透）", u: "https://dissertationstatisticshelp.org/blog/survival-analysis-in-r", d: "censoring 怎么编码、PH 假设怎么检验，写错审稿人一眼看穿", t: "doc" }
      ],
      subs: [
        {
          t: "5.1 生存数据永远是两列：time 和 status",
          why: "status 里 1 是「死了/复发了」，0 是「随访结束时还活着」。这一列搞错，后面所有结论全反。",
          pts: [
            "time 的起点必须统一（确诊日或手术日），终点是事件发生或最后一次随访。起点不统一，整列时间都废。",
            "status = 0 叫删失：不是「没事件」，是「我们不知道后来怎样」。把它丢掉，等于把随访短的人当成活得好。",
            "最常见的错：把 days_to_death 的 NA 填成 0，于是一大批病人被当成「当天死亡」。"
          ],
          code: `surv <- data.frame(id = paste0("P", 1:6),
                   time = c(12, 30, 8, 60, 25, 45),
                   status = c(1, 0, 1, 0, 1, 0))
surv
mean(surv$status)                                    # 事件率 0.5

bad <- surv
bad$time[bad$status == 0] <- 0                       # 错误做法：删失填 0
mean(surv$time); mean(bad$time)                      # 差多少一目了然`
        },
        {
          t: "5.2 KM 曲线与 log-rank，手算一遍就懂了",
          why: "KM 曲线的做法很朴素：在每个事件时点，用「当时还在的人」算一次生存率，然后乘起来。删失者从这个时点之后退出风险集。",
          pts: [
            "中位生存时间 = 生存率跌破 0.5 的那个时点，不是平均时间。",
            "log-rank 比较的是两条曲线整段的「期望事件数 vs 实际事件数」，不是比较某个时间点的生存率。",
            "log-rank 的前提是风险比例大致恒定（PH 假设）。曲线交叉时它失效，应改用 RMST 或分段分析。"
          ],
          code: `km <- function(time, status) {
  t <- sort(unique(time[status == 1]))
  S <- 1
  out <- data.frame(t = t, nrisk = NA, d = NA, S = NA)
  for (i in seq_along(t)) {
    atrisk <- sum(time >= t[i])                  # 这个时点还在风险集里的人数
    d      <- sum(time == t[i] & status == 1)    # 这个时点发生事件的人数
    S      <- S * (1 - d / atrisk)               # 生存率乘一个因子
    out[i, ] <- list(t[i], atrisk, d, S)
  }
  out
}
km(c(12, 30, 8, 60, 25, 45), c(1, 0, 1, 0, 1, 0))`
        },
        {
          t: "5.3 COX 给的是 HR，不是「生存时间缩几倍」",
          why: "HR = 2 意思是「风险翻倍」，不是「活得短一半」。这两件事只有生存分布刚好是指数分布时才等价。",
          pts: [
            "HR 是「任一时刻的事件风险乘几倍」，它是整条风险曲线一起乘，不改变曲线形状（这就是 PH 假设）。",
            "多因素 COX 才能说「独立预后因素」。单因素显著、多因素不显著，说明它是被别的变量带出来的。",
            "PH 假设要检验（`cox.zph`）。p < 0.05 说明 HR 随时间在变，这时报一个固定 HR 是错的。"
          ],
          code: `risk <- data.frame(group = c("high","high","high","low","low","low"),
                   event = c(1, 1, 0, 1, 0, 0))
tab <- table(risk$group, risk$event)
tab
# 粗略风险比：高组事件率 / 低组事件率（真正的 COX 用 partial likelihood）
(tab[1, 2] / sum(tab[1, ])) / (tab[2, 2] / sum(tab[2, ]))`,
          real: {
            pkg: "survival",
            code: `fit <- coxph(Surv(time, status) ~ risk_score + age + stage, data = d)
summary(fit)          # exp(coef) 就是 HR
cox.zph(fit)          # PH 假设检验，p 要 > 0.05
survdiff(Surv(time, status) ~ group, data = d)   # log-rank`
          }
        },
        {
          t: "5.4 AUC 是区分度，不是准确率，更不是校准度",
          why: "AUC 的意思是：随机抽一个阳性、一个阴性，模型给阳性打分更高的概率。它完全不告诉你「预测 80% 的人里实际是不是 80%」——那是校准。",
          pts: [
            "AUC = 0.75 已经是中等偏好。临床模型 0.65-0.75 很常见，出现 0.95 基本意味着过拟合或数据泄漏。",
            "普通 ROC 把「3 年时仍存活」当阴性，忽略了随访长度。生存数据要用时间依赖 ROC。",
            "C-index 是 AUC 在生存数据上的推广。训练集 0.85、验证集 0.62 是典型的过拟合形状。"
          ],
          code: `score <- c(9, 8, 7, 6, 5, 4, 3, 2)
truth <- c(1, 1, 0, 1, 1, 0, 0, 0)

auc <- function(s, y) {
  pos <- s[y == 1]; neg <- s[y == 0]
  mean(outer(pos, neg, ">") + 0.5 * outer(pos, neg, "=="))
}
auc(score, truth)          # 全部阳性对都排对的概率

for (th in sort(unique(score))) {
  tpr <- mean(score[truth == 1] >= th)
  fpr <- mean(score[truth == 0] >= th)
  cat(sprintf("阈值 %d -> TPR %.2f  FPR %.2f\\n", th, tpr, fpr))
}`
        }
      ]
    },
    {
      id: "k6",
      title: "第 6 讲　一致性聚类、TMB 与基线资料表",
      plain: "分型、突变负荷、基线资料表，这三件事最容易被糊弄过去。这讲把它们做实：分型要稳得住、TMB 别算错分子分母、Table 1 不能只放 p 值。",
      goal: "把「分型」「突变负荷」「Table 1」这三件常被糊弄过去的事做扎实。",
      watch: [
        { n: "cBioPortal（查突变和拷贝数）", u: "https://www.cbioportal.org/" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class6-1.mp4",
        "Class6-2.mp4",
        "Class6-3.mp4",
        "Class6-4.mp4",
        "Class6-5.mp4",
        "Class6-6.mp4"
        ]
      },
      refs: [
        { n: "ConsensusClusterPlus（一致性聚类官方包）", u: "https://bioconductor.org/packages/release/bioc/html/ConsensusClusterPlus.html", d: "k 值稳定性图、一致性矩阵都它出", t: "doc" },
        { n: "maftools（突变全景 + TMB 计算）", u: "https://bioconductor.org/packages/release/bioc/html/maftools.html", d: "TMB 分子分母、棒棒糖图、signature 全在这", t: "doc" },
        { n: "tableone（基线资料 Table 1）", u: "https://cran.r-project.org/web/packages/tableone/", d: "别只放 p 值，分类/连续变量分层展示", t: "doc" },
        { n: "cBioPortal（查突变、拷贝数、分型）", u: "https://www.cbioportal.org/", d: "先看别人怎么做再动手，k6 三件事都能在这验证", t: "tool" },
        { n: "生信技能树：肿瘤突变数据分析（含 maftools，B 站）", u: "https://www.bilibili.com/video/BV1Sy4y1S7pz/", d: "下游统计可视化十几个小时，突变分析入门", t: "video" },
        { n: "使用 maftools 分析 TMB 和 MATH（排坑）", u: "https://www.bioinfo-scrounger.com/archives/645/", d: "TMB 每 Mb 突变数怎么算、bTMB 是什么，讲清楚了", t: "doc" }
      ],
      subs: [
        {
          t: "6.1 一致性聚类在评估「稳定性」",
          why: "普通聚类每换一次随机种子，分组就可能变。一致性聚类跑几百次重抽样，看「这两个样本有多少次被分到一起」，用稳定性反过来定 k。",
          pts: [
            "输入是「样本 x 样本」的一致性矩阵（共同出现的比例），不是表达矩阵。",
            "k 的选择看一致性矩阵有多「块状」——块内偏红、块间偏蓝、边界清晰，就说明这个 k 稳。",
            "k=2 和 k=3 都说得通时不要硬选。审稿人一定会问「你这个分型的生物学解释是什么」。"
          ],
          code: `set.seed(7)
x  <- matrix(rnorm(20 * 30), nrow = 20)      # 30 个样本 x 20 个基因
co <- matrix(0, 30, 30)
rownames(co) <- colnames(co) <- paste0("S", 1:30)

for (b in 1:100) {
  idx <- sample(30, 24)                      # 每次抽 80% 的样本
  cl  <- cutree(hclust(dist(t(x[, idx]))), k = 2)
  lab <- rep(NA, 30); lab[idx] <- cl
  for (i in 1:30) for (j in 1:30)
    if (!is.na(lab[i]) && !is.na(lab[j]))
      co[i, j] <- co[i, j] + (lab[i] == lab[j])
}
round(co[1:6, 1:6] / 100, 2)                 # 越接近 1 越常被分到一起`
        },
        {
          t: "6.2 TMB = 非同义突变数 / 外显子长度",
          why: "公式只有一行，但分子分母各有坑。分子算了同义突变、分母写错，TMB 能差一倍。",
          pts: [
            "只算体细胞突变（somatic），胚系不算。MAF 里要按 Variant_Classification 过滤掉 Silent / Intron / UTR。",
            "分母是外显子总长约 30-38 Mb（WES）。不同 panel 的基因数不同，panel-TMB 和 WES-TMB 不能直接比。",
            "TMB 高不等于免疫治疗一定有效。它是伴随诊断指标，不是疗效保证。"
          ],
          code: `maf <- data.frame(
  sample = c("S1","S1","S1","S1","S2","S2"),
  class  = c("Missense_Mutation","Silent","Nonsense_Mutation",
             "Intron","Missense_Mutation","Frame_Shift_Del"))

nonsyn <- c("Missense_Mutation","Nonsense_Mutation","Frame_Shift_Del",
            "Splice_Site","In_Frame_Del","In_Frame_Ins")
tmb <- sapply(split(maf, maf$sample), function(d)
  sum(d$class %in% nonsyn) / 38)       # 38 Mb 外显子
tmb`
        },
        {
          t: "6.3 基线资料表：目的是展示差异，不是证明可比",
          why: "Table 1 是给读者看「两组本来就不一样」，不是用 p 值证明「两组可以比」。只放 p 值不放原始数字，是最常见的低级错误。",
          pts: [
            "连续变量写 mean±SD 或 median(IQR)，必须说明用的是哪个；分类变量写 n(%)。",
            "组间比较：连续变量按正态性选 t 或 Wilcoxon，分类变量用卡方或 Fisher。别一律上 t 检验。",
            "标准化差异（SMD）比 p 值更适合看平衡，因为 p 值受样本量影响太大——大样本里 1 岁的差别也「显著」。"
          ],
          code: `set.seed(8)
d <- data.frame(arm = rep(c("A", "B"), each = 20),
                age = c(rnorm(20, 58, 9), rnorm(20, 61, 10)),
                sex = sample(c("M", "F"), 40, TRUE))

aggregate(age ~ arm, d, function(x) sprintf("%.1f±%.1f", mean(x), sd(x)))
tab <- table(d$arm, d$sex); tab
chisq.test(tab)$p.value

mA <- mean(d$age[d$arm == "A"]); mB <- mean(d$age[d$arm == "B"])
sA <- sd(d$age[d$arm == "A"]);   sB <- sd(d$age[d$arm == "B"])
(mA - mB) / sqrt((sA^2 + sB^2) / 2)      # SMD，|SMD| < 0.1 算平衡`
        }
      ]
    },
    {
      id: "k7",
      title: "第 7 讲　共表达网络、PPI 与 hub 基因",
      plain: "基因不是各干各的，是一群一群一起动。这讲讲清 WGCNA 里那个软阈值到底在干什么，以及为什么 hub 基因（连接最多的）不等于关键基因。",
      goal: "知道 WGCNA 的软阈值在干什么，以及为什么 hub 基因不等于关键基因。",
      watch: [
        { n: "WGCNA（CRAN 包主页，教程 PDF 在里面）", u: "https://cran.r-project.org/web/packages/WGCNA/index.html" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class7-1.mp4",
        "Class7-2.mp4",
        "Class7-3.mp4",
        "Class7-4.mp4",
        "Class7-5.mp4",
        "Class7-6.mp4"
        ]
      },
      refs: [
        { n: "STRING（蛋白互作网络）", u: "https://string-db.org/", d: "把候选基因丢进去，导出可给 Cytoscape 的边表", t: "tool" },
        { n: "Cytoscape（画网络图）", u: "https://cytoscape.org/", d: "WGCNA 导出的边表在这可视化，按模块/连通度上色", t: "tool" },
        { n: "clusterProfiler（富集 + 网络注释）", u: "https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html", d: "hub 基因到底富集在哪个通路，用它确认", t: "doc" },
        { n: "GeneMANIA（找功能相关基因）", u: "https://genemania.org/", d: "hub 基因的邻居是谁，互补 STRING", t: "tool" },
        { n: "igraph（R 里算节点度/中心性）", u: "https://igraph.org/r/", d: "不想开 Cytoscape 时，用它在 R 里算 degree/betweenness", t: "doc" },
        { n: "WGCNA 找 Hub 基因全流程拆解（含「值不值得做」）", u: "http://mp.weixin.qq.com/s?__biz=MzkzNTMwMDE0MQ==&mid=2247566349&idx=2&sn=ee8d44809448a520e93b7ba6ec26e03b&chksm=c3dfa2621e802aa73bc0735accb75e3461b72bd1975b3c0e3df41177c62a7b3d823800871608", d: "MM/GS 双高只是起点，怎么判断一个 hub 基因值得做，讲得最实在", t: "doc" },
        { n: "Gene Co-Expression Network Analysis with WGCNA（英文教程）", u: "https://indianelucidbiology.com/tutorials/gene-coexpression-network-wgcna-tutorial.html", d: "软阈值→模块→hub→导出 Cytoscape，参数怎么调都列了", t: "doc" }
      ],
      subs: [
        {
          t: "7.1 软阈值 β：把「相关强弱」按幂次放大",
          why: "共表达网络不该用「相关 > 0.8 就画条边」这种硬阈值——阈值一动网络就变。β 的作用是把连续的相关值映射成权重，保留强弱而不是一刀切。",
          pts: [
            "目标是把网络变成无标度网络：少数基因连很多边，多数基因连很少。生物网络确实长这样。",
            "选 β 的标准是「无标度拓扑拟合 R² 首次 ≥ 0.8（或 0.9）的最小幂次」。样本少时 β 会被迫取很大。",
            "β 越大，强相关被放大得越厉害，弱相关被压得越接近 0。这就是它替代硬阈值的方式。"
          ],
          code: `set.seed(9)
x <- matrix(rnorm(20 * 50), nrow = 20)          # 20 基因 x 50 样本
x[2, ] <- x[1, ] * 0.9 + rnorm(50, 0, 0.2)      # 人为造一对强相关基因

r <- cor(t(x)); diag(r) <- 0
for (b in c(1, 3, 6, 12)) {
  kk <- colSums(abs(r)^b)                       # β 次幂后的连通度
  cat(sprintf("β=%2d  最大 %.1f  中位 %.2f  最大/中位 %.1f\\n",
              b, max(kk), median(kk), max(kk) / median(kk)))
}`
        },
        {
          t: "7.2 模块 = 聚类 + 剪枝 + 合并",
          why: "WGCNA 的模块不是什么新东西：先按 TOM 相似度做层次聚类，再用动态剪枝把形状不稳的枝剪掉，最后把太像的模块合并。",
          pts: [
            "流程：TOM 相似度 → 层次聚类 → 动态剪枝（dynamic tree cut）→ 合并相似模块（`mergeCutHeight` 默认 0.25）。",
            "模块和表型的关联，用的是模块特征基因（ME，该模块的第一主成分）做相关，不是把模块里每个基因单独做。",
            "灰色模块（grey）是「没归进任何模块的」，不要在文章里当成一个模块来报。"
          ],
          code: `hc <- hclust(dist(x))      # 对基因聚类：行是基因，所以用 dist(x) 不是 dist(t(x))
cl <- cutree(hc, k = 3)
table(cl)

# 模块特征基因：该模块内基因的第一主成分
me <- sapply(sort(unique(cl)), function(g)
  prcomp(t(x[cl == g, , drop = FALSE]))$x[, 1])
colnames(me) <- paste0("ME", sort(unique(cl)))
round(cor(me), 2)      # 模块之间相关太高，说明该合并`
        },
        {
          t: "7.3 PPI 的 degree 高，只说明「被研究得多」",
          why: "STRING 的边是证据汇总分，不是实验测出来的亲和力。degree 高往往意味着这个基因热门、被报道得多，不等于它是因果驱动者。",
          pts: [
            "STRING 置信度 0.4 是低置信、0.7 是高置信。阈值不同，hub 名单就不同，文章必须写清楚用的是哪个。",
            "Cytoscape 的 cytoHubba 有十二种算法，会给你十二份 hub 名单。选哪个要有理由，不能挑最好看的。",
            "hub 基因必须回到表达数据里验证：它在差异基因里吗？它和预后相关吗？否则它只是网络图上的一个点。"
          ],
          code: `edges <- data.frame(
  a = c("YAP1","YAP1","CTNNB1","CTNNB1","SPP1","TFRC"),
  b = c("CTNNB1","TEAD1","AXIN2","TEAD1","CD44","ATF4"),
  score = c(0.91, 0.88, 0.77, 0.65, 0.72, 0.40))

sort(table(c(edges$a, edges$b)), decreasing = TRUE)   # 度中心性
nrow(subset(edges, score >= 0.7))                     # 换阈值，边数就变
nrow(subset(edges, score >= 0.4))`
        }
      ]
    },
    {
      id: "k8",
      title: "第 8 讲　GEO 实战：从 GSE 号到能分析的矩阵",
      plain: "手里只有一个 GSE 号，怎么把它变成一张能分析的干净矩阵。这讲给的是顺序——先查什么、再下什么、什么时候该停，别自己乱试。",
      goal: "拿到一个 GSE 号之后，知道按什么顺序把它变成干净的表达矩阵。",
      watch: [
        { n: "GEO 首页", u: "https://www.ncbi.nlm.nih.gov/geo/" },
        { n: "UCSC Xena（TCGA 标准化数据）", u: "https://xenabrowser.net/" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class8-1.mp4",
        "Class8-2.mp4",
        "Class8-3.mp4",
        "Class8-4.mp4",
        "Class8-5.mp4"
        ]
      },
      refs: [
        { n: "GDC（TCGA 官方门户）", u: "https://portal.gdc.cancer.gov/", d: "TCGA 唯一的官方来源，别用二手整理版", t: "doc" },
        { n: "GEOquery（Bioconductor 官方）", u: "https://bioconductor.org/packages/release/bioc/html/GEOquery.html", d: "getGEO 一把抓矩阵+临床，本课主包", t: "doc" },
        { n: "limma（Bioconductor 官方）", u: "https://bioconductor.org/packages/release/bioc/html/limma.html", d: "芯片/RNA-seq 差异与 normalize.quantiles 的来源", t: "doc" },
        { n: "sva（ComBat 批次校正）", u: "https://bioconductor.org/packages/release/bioc/html/sva.html", d: "合并多数据集前先消批次，本课 8.2 用", t: "doc" },
        { n: "GEOquery 实例（哈佛公开课）", u: "https://genomicsclass.github.io/book/pages/GEOquery.html", d: "getGEO/getGEOSuppFiles 的实战演示", t: "doc" },
        { n: "GEO 芯片全流程实战（博客园）", u: "https://www.cnblogs.com/henbio/p/19187697", d: "探针→ENTREZ→SYMBOL 去重，GSE69063 为例", t: "doc" },
        { n: "GEO2R（NCBI 在线）", u: "https://www.ncbi.nlm.nih.gov/geo/geo2r/", d: "不写代码先预览差异，核对完再进 R", t: "tool" }
      ],
      subs: [
        {
          t: "8.1 先看清这个 GSE 是什么结构",
          why: "复现别人的文章，第一步不是下数据，是搞清他用了哪几个号、什么平台、有没有生存信息。这一步做错，后面全白干。",
          pts: [
            "每个 GSE 都要问三件事：平台是什么（Affy / Agilent / RNA-seq）、有没有配对癌旁、有没有随访时间。",
            "平台不同 → 探针 ID 不同 → 必须用各自的注释包（hgu133a.db / hgu133plus2.db），不能按 ID 直接合并。",
            "有生存信息才能做预后模型；只有分组没随访的，只能做差异和富集。"
          ],
          code: `# 一个基因对应多个探针时的常规处理：保留表达均值最大的那个
probe <- data.frame(
  probe = c("1007_s_at","1053_at","117_at","121_at","1255_g_at"),
  gene  = c("DDR1","RFC2","HSPA6","PAX8","GUCA1A"),
  mean  = c(9.8, 7.1, 6.4, 8.9, 3.2))
probe[order(probe$gene, -probe$mean), ]
probe <- probe[!duplicated(probe$gene), ]   # 每个基因留一行
probe`
        },
        {
          t: "8.2 批次效应：PC1 常常就是「来自哪个数据集」",
          why: "两个数据集拼一起，前几个主成分里最大的那个往往不是生物学差异，而是「这批样本来自哪个 GSE」。不处理，聚类会先按数据集分开。",
          pts: [
            "先看：PCA 图上按数据集着色，如果完全分开就是有批次。再看批次是否和分组混杂。",
            "处理工具：ComBat（sva）、removeBatchEffect（limma）、Harmony（单细胞）。不能用 t 检验前「顺手」做一个。",
            "最危险的情况是「批次和分组完全重合」（A 全是肿瘤、B 全是正常）。这时任何校正都救不了，只能分开分析。"
          ],
          code: `set.seed(10)
a <- matrix(rnorm(100), nrow = 10) + 2      # 数据集 A，整体偏高 2
b <- matrix(rnorm(100), nrow = 10)          # 数据集 B
batch <- rep(c("A", "B"), each = 10)

pc <- prcomp(t(cbind(a, b)))$x
tapply(pc[, 1], batch, mean)                # PC1 上的批次差异

center_to <- function(m, target) m - apply(m, 1, median) + target
tgt <- median(apply(cbind(a, b), 1, median))
bc  <- cbind(center_to(a, tgt), center_to(b, tgt))
tapply(prcomp(t(bc))$x[, 1], batch, mean)   # 差异被压掉`
        },
        {
          t: "8.3 合并两个数据集前必须做的三件事",
          why: "合并不是 rbind。基因 ID、样本类型、表达尺度三样对不上，合出来的矩阵就是垃圾，而且照样能跑出结果。",
          pts: [
            "基因取**交集**不是并集，并确认 symbol 版本（别把新旧 symbol 当成两个不同基因）。",
            "尺度统一：都在 log2(TPM+1)，或都在 log2(RMA) 上。一个原始值一个 log 值，合起来全是假差异。",
            "去重样本：同一病人多次取样、同一数据重复上传，必须查 sample title 才能发现。"
          ],
          code: `a <- data.frame(gene = c("TP53","EGFR","MYC"), v = c(9, 8, 7))
b <- data.frame(gene = c("TP53","MYC","KRAS"), v = c(3, 5, 6))

intersect(a$gene, b$gene)          # 取交集，不是并集
m <- merge(a, b, by = "gene")
m
rownames(m) <- m$gene
m$gene <- NULL
as.matrix(m)`
        }
      ]
    },
    {
      id: "k9",
      title: "第 9 讲　LASSO 预后模型与数据泄漏",
      plain: "几百个候选基因、几十个病人，普通回归会把答案直接背下来。这讲讲 LASSO 怎么逼它只留几个，以及最容易让整个结果作废的那几个操作。",
      goal: "知道 LASSO 为什么能选基因，以及最容易把结果做废的那几个操作。",
      watch: [
        { n: "OSCA（第 5 章讲特征选择，通用）", u: "https://bioconductor.org/books/release/OSCA/" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class9-1.mp4",
        "Class9-2.mp4",
        "Class9-3.mp4",
        "Class9-4.mp4",
        "Class9-5.mp4",
        "Class9-6.mp4"
        ]
      },
      refs: [
        { n: "cBioPortal", u: "https://www.cbioportal.org/", d: "突变、拷贝数、生存一起查", t: "doc" },
        { n: "glmnet（CRAN 官方）", u: "https://cran.r-project.org/web/packages/glmnet/index.html", d: "LASSO-Cox 本包，cv.glmnet 选 λ", t: "doc" },
        { n: "timeROC（CRAN）", u: "https://cran.r-project.org/web/packages/timeROC/index.html", d: "时间依赖 AUC，报 1/3/5 年区分度", t: "doc" },
        { n: "survminer（CRAN）", u: "https://cran.r-project.org/web/packages/survminer/index.html", d: "ggsurvplot 画 KM，本课 9.3 出图", t: "doc" },
        { n: "ranger（随机生存森林）", u: "https://cran.r-project.org/web/packages/ranger/index.html", d: "LASSO 之外的备选模型，可做集成", t: "doc" },
        { n: "rms（校准曲线）", u: "https://cran.r-project.org/web/packages/rms/index.html", d: "calibrate 看模型校准，不只看区分度", t: "doc" },
        { n: "LASSO→多因素COX→风险评分→KM/ROC 全套（微信）", u: "http://mp.weixin.qq.com/s?__biz=MzIyNDI1MzgzOQ==&mid=2650400318&idx=1&sn=7c72b9353829d9c36cc0be43dda8719e&chksm=f01c84dec76b0dc8e2ef640226f949de3fdd647a9316edef4734747c73e602919e51170513da#rd", d: "从表达矩阵到风险评分的完整可运行代码", t: "doc" }
      ],
      subs: [
        {
          t: "9.1 LASSO 就是在回归上加一个 Σ|β| 惩罚",
          why: "几百个候选基因、几十个病人，普通回归会把答案背下来。LASSO 加一个惩罚，逼大部分系数变成 0，剩下的才是「被逼着留下来」的。",
          pts: [
            "λ 越大，留下的基因越少。λ = 0 就是普通回归。每个系数的解是「软阈值」：小于 λ 的直接归零。",
            "LASSO 在一组高度相关的基因里只会随机留一个。所以结果不稳定，要报「被选中频率」（bootstrapped LASSO）。",
            "别先从差异基因里挑 top10 再做模型——那是人为选择偏倚，不是 LASSO。"
          ],
          code: `soft <- function(z, l) sign(z) * max(abs(z) - l, 0)   # 软阈值
for (l in c(0, 0.5, 1, 2)) {
  cat(sprintf("λ=%.1f -> 系数 %.2f %.2f %.2f\\n",
              l, soft(3, l), soft(0.8, l), soft(-1.5, l)))
}`,
          real: {
            pkg: "glmnet",
            code: `set.seed(1)
cv <- cv.glmnet(x = t(expr_train), y = Surv(time, status),
                family = "cox", nfolds = 10)
plot(cv)
coef(cv, s = "lambda.min")     # 或 "lambda.1se"，更简的模型`
          }
        },
        {
          t: "9.2 λ 怎么选：lambda.min 还是 lambda.1se",
          why: "λ 不能拍脑袋。交叉验证会给你一条误差曲线，lambda.min 是误差最小的点，lambda.1se 是「误差在最小值一个标准误内、模型最简单的点」。",
          pts: [
            "lambda.min 拟合最好但基因多、容易过拟合；lambda.1se 基因少、更稳。临床模型一般报 1se。",
            "交叉验证必须在**训练集内部**做，绝不能包括验证集。否则 λ 是偷看答案选出来的。",
            "报告里要写：随机种子、fold 数、选了哪个 λ、最终几个基因。少一项都复现不了。"
          ],
          code: `set.seed(11)
lam <- 10^seq(-4, 1, length = 12)
err <- 0.6 + 0.3 * exp(-lam * 3) + 0.05 * lam + rnorm(12, 0, 0.01)
res <- data.frame(lambda = round(lam, 4), cv_err = round(err, 4))
res

res$lambda[which.min(res$cv_err)]                            # lambda.min
res$lambda[which(res$cv_err <= min(res$cv_err) + 0.01)][1]   # 更简的模型`
        },
        {
          t: "9.3 风险评分与数据泄漏",
          why: "风险评分 = Σ(系数 × 表达)。所有步骤——标准化、选基因、定系数、定切点——都必须在训练集里学出来，再原封不动套到验证集。",
          pts: [
            "最常见的泄漏：用全部样本做 scale 再拆分；用全部样本做差异分析再拆分；用验证集反复调阈值。",
            "验证集只做一次预测，不参与任何参数选择。「调了二十次报最好的一次」就是过拟合。",
            "结果要报：训练/验证各自的高危 vs 低危 HR、95%CI、log-rank p，加上 1/3/5 年时间依赖 AUC。缺一不可。"
          ],
          code: `coef <- c(TP53 = 0.31, MYC = 0.22, CTNNB1 = -0.18)
expr <- matrix(c(9, 8, 7,
                 10, 6, 8,
                 7, 9, 5), ncol = 3, byrow = TRUE,
               dimnames = list(paste0("P", 1:3), names(coef)))
expr

risk <- as.vector(expr %*% coef)      # 风险评分 = 表达 x 系数
names(risk) <- rownames(expr)
round(risk, 3)
ifelse(risk > median(risk), "high", "low")   # 常用切点：中位数`
        }
      ]
    },
    {
      id: "k10",
      title: "第 10 讲　文章复现：把上面九讲串成一篇",
      plain: "前面九讲都是零件，这一讲把它们拼成一篇论文的骨架。看完你会知道自己现在做到第几步、下一幅图该画什么、哪些数字必须对得上。",
      goal: "知道一篇生信文章的骨架长什么样，复现时按什么顺序对数字。",
      watch: [
        { n: "Biomamba《手把手教你做单细胞转录组分析》", u: "https://www.bilibili.com/video/BV1S44y1b76Z" }
      ],
      rec: {
        u: "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        files: [
        "Class10-1.mp4",
        "Class10-2.mp4",
        "Class10-3.mp4"
        ]
      },
      refs: [
        { n: "cBioPortal", u: "https://www.cbioportal.org/", d: "突变、拷贝数、生存一起查", t: "doc" },
        { n: "TIDE（免疫治疗反应预测）", u: "http://tide.dfci.harvard.edu/", d: "高低风险组的免疫反应差异，补 9.3 没讲的下游", t: "tool" },
        { n: "GEPIA2（在线表达/生存）", u: "http://gepia2.cancer-pku.cn/", d: "不写代码验证单基因表达与生存", t: "tool" },
        { n: "ICGC Data Portal（独立验证队列）", u: "https://dcc.icgc.org/", d: "跨数据集验证模型用，独立于 TCGA", t: "doc" },
        { n: "LASSO→外部验证→timeROC 完整范例", u: "http://cytoskeletonres.com/posts/building-a-robust-prognostic-model-integrating-lasso-regression-and-random-forest-with-cytoskeletal-genes", d: "从特征选择到时间依赖 AUC 的端到端范例", t: "doc" }
      ],
      subs: [
        {
          t: "10.1 九成生信文章是同一套骨架",
          why: "差异 → 富集 → 分型/免疫 → 预后模型 → 外部验证（可选加细胞实验）。看懂骨架，就知道自己现在做到第几步、下一步该干什么。",
          pts: [
            "Figure 1 通常是「数据来源 + 差异分析」；Figure 2-3 富集和通路；Figure 4 免疫或分型；Figure 5 预后模型；Figure 6 外部验证或细胞实验。",
            "每张图的卖点必须出现在标题里。图注要能独立读懂——不看正文也知道这张图在说什么。",
            "方法段要能让人照着做：包名 + 版本 + 参数 + 阈值。缺一项就算不合格。"
          ],
          code: `outline <- data.frame(
  fig = paste0("Fig", 1:6),
  job = c("数据与差异分析","富集与通路","免疫浸润与分型",
          "预后模型构建","外部验证","细胞/动物验证"),
  need = c("counts + 分组","差异基因","表达矩阵","生存数据","独立队列","实验"))
outline`
        },
        {
          t: "10.2 没有外部验证的模型，等于没做",
          why: "训练集 AUC 0.9 一点意义都没有——那是模型把自己的训练数据记住了。能说明问题的是：这套系数拿到另一个数据集、另一家医院，还灵不灵。",
          pts: [
            "外部验证必须是独立样本（不同数据集或不同中心），不能是同一批数据换个随机种子。",
            "验证要验三件事：风险分层还分得开吗（log-rank）、AUC 还在 0.6 以上吗、系数方向一致吗。",
            "临床意义比统计显著重要。高危组 5 年生存 30% vs 60% 才有用；差 0.1% 的「显著」没有意义。"
          ],
          code: `train_auc <- 0.86; valid_auc <- 0.64
gap <- train_auc - valid_auc
cat(sprintf("训练集 AUC %.2f，验证集 AUC %.2f，掉了 %.2f\\n", train_auc, valid_auc, gap))
if (gap > 0.15) cat("-> 典型过拟合，先减变量数再重做\\n")

c_train <- c(TP53 = 0.31, MYC = 0.22, CTNNB1 = -0.18)
c_valid <- c(TP53 = 0.28, MYC = 0.05, CTNNB1 = -0.11)
sign(c_train) == sign(c_valid)          # 方向必须一致`
        },
        {
          t: "10.3 复现清单：按这个顺序对数字",
          why: "复现不是「跑通就算」，是「每一个数字都能对上原文输出的那一行」。顺序反了会浪费大量时间在画图上。",
          pts: [
            "顺序：先 Table 1（样本数和基线），再差异基因数，再富集通路数，最后才碰图。",
            "原文没写参数时，用他报告的数字（基因数、p 值）做反向约束，一点点逼参数。",
            "复现失败最常见三个原因：数据版本不同、注释包版本不同、阈值没写清楚。"
          ],
          code: `ck <- data.frame(
  step  = c("Table1 样本数","差异基因数","富集通路数","模型基因数","外部验证 AUC"),
  paper = c(365, 1247, 38, 9, 0.71),
  mine  = c(365, 1180, 41, 9, 0.68))
ck$ok <- ck$paper == ck$mine
ck
cat(sprintf("对上的 %d / %d 项\\n", sum(ck$ok), nrow(ck)))`
        }
      ]
    }
  ]
};
