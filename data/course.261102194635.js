/* 嵩山一号 · 工作站 —— 通用课程
   结构参照本地 10 讲录播课（50 个视频 / 342 个代码与课件文件）重排。
   每节两段代码：一段 base R 能在站内直接跑（讲原理），一段标了包名的真实写法（讲实战）。
   不依赖本课题数据。 */
window.SX_COURSE = {
  "intro": "第 0 讲真的从零开始（1 + 1 怎么写、变量是什么）；之后分四段：第一段入门（k1 讲清你拿到的是什么数）；第二段 Bulk RNA-seq 主线（k2 下载差异 → k3 富集 → k4 免疫 → bk 主公笔记实战串讲 → k5 预后 → k6 聚类/TMB/基线 → k7 共表达/PPI/hub → k8 GEO 实战 → k9 LASSO → k10 复现 → gsva 通路评分进阶）；第三段单细胞（sc Seurat 实操）；第四段前沿专题（mr 孟德尔随机化、multiom 多组学、epispatial 表观空间、dr 老药新用、np 网络药理学）。每节分两段代码：一段只用 base R 能在站内直接跑（讲原理），另一段标了真实包名的写法（讲实战）。看懂原理再去跑真包，顺序反了只会抄代码。各讲都挂了对应的小陈录播（bk 专章内嵌）与「延伸资料」。",
  "chapters": [
    {
      "id": "k1",
      "title": "第 1 讲　生信是什么：counts 矩阵、Bulk 与单细胞",
      "plain": "你下载到的那个大表格，格子里其实是「数到几条」，不是「表达高不高」。这讲只说清这一件事——搞明白了，后面的归一化、差异分析才不会越看越糊涂。",
      "goal": "搞清「你拿到的到底是什么数」，后面的归一化、差异分析才有意义。",
      "watch": [
        {
          "n": "生信技能树《生信人应该这样学 R 语言》",
          "u": "https://www.bilibili.com/video/BV1cs411j75B"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "class1-1.mp4",
          "class1-2.mp4"
        ]
      },
      "refs": [
        {
          "n": "Biomamba《手把手教你做单细胞转录组测序数据分析》",
          "u": "https://www.bilibili.com/video/BV1S44y1b76Z",
          "d": "单细胞最全的一套，配合单细胞专题看",
          "t": "video"
        },
        {
          "n": "生信幻想家《单细胞数据分析 标准分析流程》",
          "u": "https://www.bilibili.com/video/BV1Ct421j7X3",
          "d": "2026 年更新版，流程完整、节奏比上一套快",
          "t": "video"
        },
        {
          "n": "生信幻想家《空间转录组（结合单细胞）》",
          "u": "https://www.bilibili.com/video/BV1To6FB1Ewm",
          "d": "单细胞之后再上空间，先看这套建立直觉",
          "t": "video"
        },
        {
          "n": "未名阿《保姆级单细胞代码分析（1）质控·降维·聚类》",
          "u": "https://www.bilibili.com/video/BV1yR4y1q7X4",
          "d": "短，适合先跑通一遍再回头看长课",
          "t": "video"
        },
        {
          "n": "富贵 pic《单细胞测序 01 入门：数据读取与分析》",
          "u": "https://www.bilibili.com/video/BV1Dh4y1D7m6",
          "d": "最短的入门，看完知道单细胞在干什么",
          "t": "video"
        },
        {
          "n": "生信技能树-jimmy《单细胞亚群注释》",
          "u": "https://www.bilibili.com/video/BV1mE421w7Te",
          "d": "注释这一步最容易做错，专门看这一集",
          "t": "video"
        },
        {
          "n": "Seurat 官网",
          "u": "https://satijalab.org/seurat/",
          "d": "所有 Seurat 教程的入口，版本更新都在这",
          "t": "doc"
        },
        {
          "n": "Seurat PBMC3K 标准流程",
          "u": "https://satijalab.org/seurat/articles/pbmc3k_tutorial",
          "d": "单细胞的「Hello World」，必须亲手敲一遍",
          "t": "doc"
        },
        {
          "n": "Seurat 常用命令速查",
          "u": "https://satijalab.org/seurat/articles/essential_commands",
          "d": "对象结构、取子集、改 metadata 都在这里",
          "t": "doc"
        },
        {
          "n": "OSCA：单细胞分析 Bioconductor 书",
          "u": "https://bioconductor.org/books/release/OSCA/",
          "d": "最完整的免费单细胞教材，质量高于绝大多数中文课",
          "t": "doc"
        },
        {
          "n": "sc-best-practices",
          "u": "https://www.sc-best-practices.org/",
          "d": "专门讲「这一步为什么这么做、什么时候会错」",
          "t": "doc"
        },
        {
          "n": "Galaxy 单细胞专题",
          "u": "https://training.galaxyproject.org/training-material/topics/single-cell/",
          "d": "不写代码也能跑全流程，用来理解每一步在做什么",
          "t": "doc"
        },
        {
          "n": "Monocle3 官网",
          "u": "https://cole-trapnell-lab.github.io/monocle3/",
          "d": "轨迹推断的标准工具",
          "t": "doc"
        },
        {
          "n": "Harmony 快速上手",
          "u": "https://portals.broadinstitute.org/harmony/articles/quickstart.html",
          "d": "多样本整合最常用的方法之一",
          "t": "doc"
        },
        {
          "n": "CellChat 官方仓库",
          "u": "https://github.com/jinworks/CellChat",
          "d": "细胞通讯分析，vignette 在仓库 README 里",
          "t": "doc"
        },
        {
          "n": "R 官方入门手册",
          "u": "https://cran.r-project.org/doc/manuals/r-release/R-intro.html",
          "d": "遇到语法歧义时查这里，比搜索引擎准",
          "t": "doc"
        },
        {
          "n": "R for Data Science（2 版）",
          "u": "https://r4ds.hadley.nz/",
          "d": "dplyr/ggplot 的正统教材，免费在线",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "1.1 一次转录组测序在测什么：counts 不是表达量",
          "why": "你下载到的 counts 矩阵里，每个格子是「数到多少条 reads」，不是「这个基因表达多高」。理解这一点，后面所有归一化才有意义。",
          "pts": [
            "行是基因，列是样本，格子里是**整数 count**。不同样本的列和差别可以到十倍，因为测序深度不同。",
            "归一化只做一件事：把「测得多」和「表达高」分开。CPM 除文库大小，TPM/FPKM 再除基因长度。",
            "counts 给 DESeq2/edgeR 用（它们要整数），log2(TPM+1) 给热图和相关分析用。两者不能混着喂。"
          ],
          "code": "set.seed(1)\n# 6 个基因 x 4 个样本，格子里的数是 reads 条数\ncnt <- matrix(c(120, 40, 8, 300, 15, 2,\n                130, 35, 11, 290, 18, 3,\n                118, 44, 9, 310, 12, 4,\n                125, 38, 10, 295, 16, 2), nrow = 6,\n              dimnames = list(paste0(\"G\", 1:6), paste0(\"S\", 1:4)))\ncnt\n\nlib <- colSums(cnt)                       # 每个样本的文库大小\nlib\n\nround(sweep(cnt, 2, lib, \"/\") * 1e6, 1)   # CPM\nround(log2(sweep(cnt, 2, lib, \"/\") * 1e6 + 1), 2)   # log2CPM，画图用这个"
        },
        {
          "t": "1.2 Bulk 和单细胞的区别，决定你能问什么问题",
          "why": "同样是「表达矩阵」，Bulk 的一列是一个组织，单细胞的一列是一个细胞。这个差别决定了你只能回答哪一类问题。",
          "pts": [
            "Bulk 一列 = 上千个细胞的平均值。异质性被平均掉，只能回答「这块组织整体怎么样」。",
            "单细胞一列 = 一个细胞。行数从「2 万基因 x 几十样本」变成「2 万基因 x 几万细胞」，而且极度稀疏。",
            "所以：组间比较、预后模型用 Bulk；哪类细胞在变、细胞之间怎么通讯用单细胞。两者不能互相替代。"
          ],
          "code": "set.seed(2)\n# Bulk：6 基因 x 4 样本\nbulk <- matrix(rpois(24, 50), nrow = 6,\n               dimnames = list(paste0(\"G\", 1:6), paste0(\"S\", 1:4)))\ndim(bulk)\nmean(bulk == 0)\n\n# 单细胞：同一个组织拆成 200 个细胞\nsc <- matrix(rpois(6 * 200, 0.8), nrow = 6,\n             dimnames = list(paste0(\"G\", 1:6), paste0(\"C\", 1:200)))\ndim(sc)\nmean(sc == 0)      # 稀疏度，真实数据常在 0.9 以上\n\nrowMeans(bulk)     # Bulk 里每个基因的均值\nrowMeans(sc)       # 单细胞 200 个细胞的均值，量级完全不同"
        },
        {
          "t": "1.3 为什么这条流程非得用 R",
          "why": "生信不是写软件，是「把统计方法接到数据上，再解释结果」。R 的包生态在这件事上仍然最全，而且论文方法段写的就是包名。",
          "pts": [
            "Bioconductor 上两千多个包，DESeq2、edgeR、limma、Seurat、GSVA、CellChat 全在里面。",
            "一篇生信文章的方法段，本质就是一段 R 代码说明（包名 + 版本 + 参数 + 阈值）。复现别人的文章，就是把这些抄对。",
            "R 的短板是工程（大数据、并行、部署），但 Bulk 和单细胞这个数据量用不着。"
          ],
          "code": "df <- data.frame(group = rep(c(\"tumor\", \"normal\"), each = 3),\n                 expr  = c(9.1, 8.7, 9.4, 6.2, 6.8, 6.1))\ndf\n\nt.test(expr ~ group, data = df)              # 一行完成分组检验\naggregate(expr ~ group, data = df, mean)     # 分组均值\naggregate(expr ~ group, data = df, sd)       # 分组标准差"
        }
      ]
    },
    {
      "id": "k2",
      "title": "第 2 讲　TCGA 下载与差异分析",
      "plain": "想知道「哪些基因变了」，就得会算这一笔。这讲不套包，先用手算的方式把 logFC 和 p 值算一遍，以后看到别人表里的数字，你能自己复算核对。",
      "goal": "把「哪些基因变了」这件事算出来，并且知道每个数字是怎么来的。",
      "watch": [
        {
          "n": "生信技能树《转录组测序数据分析》",
          "u": "https://www.bilibili.com/video/BV12s41137HY"
        },
        {
          "n": "DESeq2 官方 vignette",
          "u": "https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class2-1.mp4",
          "Class2-2.mp4",
          "Class2-3.mp4",
          "Class2-4.mp4"
        ]
      },
      "refs": [
        {
          "n": "GDC（TCGA 官方门户）",
          "u": "https://portal.gdc.cancer.gov/",
          "d": "TCGA 唯一的官方来源，别用二手整理版",
          "t": "doc"
        },
        {
          "n": "GEO",
          "u": "https://www.ncbi.nlm.nih.gov/geo/",
          "d": "查 GSE 号、下表达矩阵和临床信息",
          "t": "doc"
        },
        {
          "n": "UCSC Xena",
          "u": "https://xenabrowser.net/",
          "d": "同一队列的 TCGA 标准化数据，省掉一半预处理",
          "t": "doc"
        },
        {
          "n": "TCGAbiolinks（Bioconductor 官方）",
          "u": "https://bioconductor.org/packages/release/bioc/html/TCGAbiolinks.html",
          "d": "R 里直接下 TCGA 的标准入口，比网页点快且可复现",
          "t": "doc"
        },
        {
          "n": "UCSCXenaTools（rOpenSci）",
          "u": "https://docs.ropensci.org/UCSCXenaTools/",
          "d": "用代码从 Xena 拉数据，避免手动点错版本",
          "t": "doc"
        },
        {
          "n": "TCGA 下载-差异-预后 全流程避坑（巴典科研）",
          "u": "http://mp.weixin.qq.com/s?__biz=MzAwMDc4MjYyMQ==&mid=2650921075&idx=1&sn=95c3d39d74ab05129544d6441cb578be&chksm=80420d970ede214e638a842c174b5bb23ba3d5fae5d590e3095feef7f211e49035d9186dd212#rd",
          "d": "含样本筛选红线、FPKM→TPM、生存变量构建、审稿常见质疑",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "2.1 TCGA 里到底有哪几套数：counts / FPKM / TPM",
          "why": "同一个基因在 TCGA 里有三套数。拿错一套，整个下游都偏，而且错得很隐蔽——因为图还是画得出来。",
          "pts": [
            "counts：整数，DESeq2/edgeR 的输入。FPKM/TPM：已经按长度和深度归一过，**不能**直接进 DESeq2。",
            "TPM 的好处是每个样本的 TPM 加起来一样，跨样本可比；FPKM 不是，所以现在基本被 TPM 取代。",
            "样本类型看 barcode 第 14-15 位：`01` 原发肿瘤、`11` 正常组织、`06` 转移。写筛选条件时按这个来。"
          ],
          "code": "barcodes <- c(\"TCGA-05-4384-01A-01R-1755-07\",\n              \"TCGA-05-4384-11A-01R-1755-07\",\n              \"TCGA-05-4244-01A-01R-1107-07\")\nsubstr(barcodes, 14, 15)             # \"01\" 肿瘤 / \"11\" 正常\ntable(substr(barcodes, 14, 15))\n\n# 从 counts 手算 TPM（原理演示，实际直接用现成 TPM）\ncnt <- matrix(c(100, 300, 50, 20, 60, 400), nrow = 3,\n              dimnames = list(paste0(\"G\", 1:3), c(\"S1\", \"S2\")))\nlen  <- c(1000, 2000, 500)           # 基因长度，单位 bp\nrate <- cnt / len                    # 每 bp 的 reads\ntpm  <- sweep(rate, 2, colSums(rate), \"/\") * 1e6\nround(tpm, 1)\ncolSums(tpm)                         # 每个样本加起来都是 1e6",
          "real": {
            "pkg": "DESeq2",
            "code": "dds <- DESeqDataSetFromMatrix(countData = cnt, colData = coldata, design = ~ group)\ndds <- DESeq(dds)\nres <- results(dds, contrast = c(\"group\", \"tumor\", \"normal\"))\nres <- lfcShrink(dds, coef = \"group_tumor_vs_normal\", type = \"apeglm\")"
          }
        },
        {
          "t": "2.2 差异分析到底在算什么",
          "why": "logFC 是「两组平均表达差几倍」，p 值是「这个差相对于组内波动显不显眼」。两件事，回答两个不同问题。",
          "pts": [
            "每组 3 例时，一个离群样本就能把 logFC 拉翻倍。所以必须同时看每组中位数和离散度，不能只看 p。",
            "低表达基因方差估不稳，会产生大量假阳性。DESeq2 用收缩（shrinkage）把它们的 logFC 往 0 拉，这就是 `lfcShrink` 那一步的意义。",
            "差异基因数量完全取决于阈值。写文章必须写清楚，常见写法是 |logFC| > 1 且 adj.P < 0.05。"
          ],
          "code": "set.seed(3)\ng1 <- c(9.2, 8.8, 9.5)                 # 肿瘤组 3 例\ng2 <- c(6.1, 6.4, 5.9)                 # 正常组 3 例\nlog2(mean(g1) / mean(g2))              # logFC\nt.test(g1, g2)$p.value\n\ng1b <- c(9.2, 8.8, 11.5)               # 只把第三例换成离群值\nlog2(mean(g1b) / mean(g2))             # logFC 变了多少\nt.test(g1b, g2)$p.value                # p 变了多少"
        },
        {
          "t": "2.3 多重检验与 FDR：为什么 adj.P 比 P 大那么多",
          "why": "一次检验两万个基因，就算一个都没差异，p < 0.05 也天然会给你一千个「显著」。FDR 就是把这条线重新画。",
          "pts": [
            "Bonferroni：p 乘以检验次数。控「一个假阳性都不许有」，代价是几乎什么都检不出。",
            "BH（Benjamini-Hochberg）：把 p 排序后按秩次缩放，控「报出来的里面假的比例」。生信默认用它。",
            "p 值分布能自查：没有差异时 p 应均匀分布在 0-1；如果 0 附近堆成一座山，说明有真信号。"
          ],
          "code": "set.seed(4)\np <- c(runif(90), runif(10, 0, 0.001))   # 90 个无差异 + 10 个真差异\nsum(p < 0.05)                            # 朴素阈值抓到的\nsum(p.adjust(p, method = \"BH\") < 0.05)   # BH 校正后剩下的\nsum(p.adjust(p, method = \"bonferroni\") < 0.05)\n\nhist(p, breaks = 20, main = \"p 值分布自查\", xlab = \"p\")"
        },
        {
          "t": "2.4 火山图和热图，画的其实就是那几列数",
          "why": "火山图横轴是效应量、纵轴是显著性；热图是标准化后的表达值。它们都不产生新信息，只是把上面算好的数换个坐标看。",
          "pts": [
            "火山图纵轴用 `-log10(adj.P)`（越小越往上），横轴用 logFC（对称才有意义）。",
            "热图一定要先按行（基因）标准化，否则高表达基因吃掉整个色阶，别的基因全是一个色。",
            "聚类树本身就是结果：它告诉你哪些样本像、哪些基因同起同落。不要把它当装饰删掉。"
          ],
          "code": "res <- data.frame(gene = paste0(\"G\", 1:6),\n                  logFC = c(3.1, -2.4, 0.3, 4.2, -0.2, 1.8),\n                  padj  = c(1e-9, 1e-4, 0.7, 1e-12, 0.9, 0.02))\nres$neglog <- -log10(res$padj)\nres$dir <- ifelse(res$padj < 0.05 & abs(res$logFC) > 1,\n                  ifelse(res$logFC > 0, \"up\", \"down\"), \"ns\")\nres[order(-res$logFC), ]\n\n# 热图的输入：按行做 z 标准化\nm <- matrix(c(9,8,9,6,6,5,  3,4,3,7,8,7), nrow = 2, byrow = TRUE,\n            dimnames = list(c(\"G1\",\"G2\"), paste0(\"S\",1:6)))\nround(t(scale(t(m))), 2)"
        }
      ]
    },
    {
      "id": "k3",
      "title": "第 3 讲　富集分析：ORA、背景集与 GSEA",
      "plain": "一长串基因名看着头大，它其实只在说一件事：这些基因全挤在同一个功能上。这讲把富集 p 值拆成四个数，顺便解释为什么你和别人算出来的对不上。",
      "goal": "知道富集 p 值是怎么算出来的，以及为什么你和别人算的不一样。",
      "watch": [
        {
          "n": "微生信：clusterProfiler / GSEA 实操（B 站）",
          "u": "https://www.bilibili.com/video/BV12X4y117ob"
        },
        {
          "n": "通路富集可视化（B 站）",
          "u": "https://www.bilibili.com/video/BV1CZ421H7u3"
        },
        {
          "n": "clusterProfiler 配套书",
          "u": "https://yulab-smu.top/biomedical-knowledge-mining-book/"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class3-1.mp4",
          "Class3-2.mp4",
          "Class3-3.mp4",
          "Class3-4.mp4",
          "Class3-5.mp4",
          "Class3-6.mp4"
        ]
      },
      "refs": [
        {
          "n": "GSVA 官方 vignette",
          "u": "https://bioconductor.org/packages/release/bioc/vignettes/GSVA/inst/doc/GSVA.html",
          "d": "通路打分和 ssGSEA 的原始实现",
          "t": "doc"
        },
        {
          "n": "clusterProfiler（Bioconductor 官方）",
          "u": "https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html",
          "d": "包作者维护，版本最新，enrichGO/enrichKEGG/gseGO 都在这里",
          "t": "doc"
        },
        {
          "n": "Gene Ontology 官网",
          "u": "http://geneontology.org/",
          "d": "GO term 的权威解释，查注释来源",
          "t": "doc"
        },
        {
          "n": "KEGG 官网",
          "u": "https://www.genome.jp/kegg/",
          "d": "通路图的原始出处",
          "t": "doc"
        },
        {
          "n": "MSigDB（GSEA 官方基因集库）",
          "u": "https://www.gsea-msigdb.org/gsea/msigdb/",
          "d": "C2/C5/C6 等基因集，GSEA 的弹药库",
          "t": "doc"
        },
        {
          "n": "g:Profiler（在线 ORA，免代码）",
          "u": "https://biit.cs.ut.ee/gprofiler/gost",
          "d": "不写代码也能做富集，和 clusterProfiler 互相印证",
          "t": "tool"
        },
        {
          "n": "KEGG/GO/Reactome/DO/MSigDB 全套 GSEA 代码（基迪奥）",
          "u": "http://mp.weixin.qq.com/s?__biz=MzA5NzQzOTgzMw==&mid=2651005004&idx=1&sn=2432c266946ab17d59324ba518b621e0&chksm=8af9046d5a73f73cc0b21b2522e11523b4a721051ed3e87736d898860347a7f0e36453005d1d#rd",
          "d": "五类数据库的 GSEA 与可视化实例",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "3.1 ORA 就是一个超几何检验",
          "why": "富集分析听起来玄，落到公式上只有四个数：通路里共几个、差异基因几个、交集几个、全基因组几个。",
          "pts": [
            "富集 p 值回答的是：从全基因组里随机抓这么多差异基因，落进这个通路 ≥ 现在这个数的概率有多大。",
            "四个数分别是 `M`（通路基因数）、`n`（差异基因数）、`k`（交集）、`N`（背景基因数）。",
            "通路大小会带偏：大通路天然容易显著，所以必须同时看 GeneRatio 和 BgRatio，不能只看 p。"
          ],
          "code": "N <- 20000; M <- 200; n <- 500; k <- 25     # 背景 / 通路 / 差异 / 交集\nphyper(k - 1, M, N - M, n, lower.tail = FALSE)\n\n# 数字小的时候，用 2x2 列联表的 Fisher 精确检验算，结果一样\ntiny <- matrix(c(3, 7, 5, 85), 2)\nrownames(tiny) <- c(\"in_pathway\", \"not_in_pathway\")\ncolnames(tiny) <- c(\"deg\", \"not_deg\")\ntiny\nfisher.test(tiny)$p.value"
        },
        {
          "t": "3.2 背景集选错，p 值能差几个数量级",
          "why": "同一个差异基因列表，换个背景，p 值能从 1e-8 变成 0.3。这就是「复现不出别人富集结果」最常见的原因。",
          "pts": [
            "背景应该是「这次实验里有机会被测到的基因」，也就是表达过滤后的基因，不是全基因组。",
            "物种注释版本（org.Hs.eg.db 的版本）不同，通路里的基因数会变，写文章要记版本号。",
            "clusterProfiler 里 `universe = rownames(expr)` 这一句最常被漏掉，漏了就等于用全基因组当背景。"
          ],
          "code": "k <- 25; n <- 500; M <- 200\nfor (N in c(20000, 15000, 12000)) {\n  p <- phyper(k - 1, M, N - M, n, lower.tail = FALSE)\n  cat(sprintf(\"背景 %5d 个基因 -> p = %.3g\\n\", N, p))\n}"
        },
        {
          "t": "3.3 GSEA 和 ORA 的本质差别",
          "why": "ORA 先把基因砍成「显著/不显著」两堆，砍的那一刀就把信息丢了。GSEA 不砍，直接问「这个通路是不是集中在列表顶端」。",
          "pts": [
            "GSEA 的输入是排好序的全基因列表（按 logFC 或 signal2noise），不需要定阈值。",
            "核心输出是 ES（富集分数）和 NES（校正通路大小之后）。NES 正 = 上调富集，负 = 下调富集。",
            "没有显著差异基因也能跑 GSEA。反过来，ORA 一旦阈值卡死，可能一个通路都得不到。"
          ],
          "code": "set.seed(5)\ngenes <- paste0(\"G\", 1:200)\nstat  <- rnorm(200); names(stat) <- genes\nstat  <- sort(stat, decreasing = TRUE)      # 按统计量排序的全基因列表\npathway <- sample(genes, 20)                # 假设的通路基因\n\nhit <- names(stat) %in% pathway\nw   <- abs(stat)                            # 加权：越靠两端的基因权重越大\nes  <- cumsum(ifelse(hit, w, 0) / sum(w[hit]) -\n              ifelse(hit, 0, 1) / sum(!hit))\nmax(es); min(es)                            # 偏离 0 最远的那一点就是 ES\nwhich.max(abs(es))                          # 峰值出现在第几位",
          "real": {
            "pkg": "clusterProfiler / fgsea",
            "code": "gl <- sort(setNames(res$log2FoldChange, rownames(res)), decreasing = TRUE)\neg <- enrichGO(gene = deg, universe = rownames(expr), OrgDb = org.Hs.eg.db,\n               keyType = \"SYMBOL\", ont = \"BP\", pAdjustMethod = \"BH\")\nfg <- fgsea(pathways = msigdb_list, stats = gl, minSize = 15, maxSize = 500)"
          }
        }
      ]
    },
    {
      "id": "k4",
      "title": "第 4 讲　免疫浸润：反卷积、ssGSEA 与三种方法的坑",
      "plain": "一块肿瘤里混着肿瘤细胞、免疫细胞、成纤维细胞，而测序只给你「整块的平均值」。这讲讲怎么把一个数拆回几份，以及为什么三种方法给出的根本不是同一样东西。",
      "goal": "知道「免疫浸润」这三个字背后是三个完全不同的东西，不能混着说。",
      "watch": [
        {
          "n": "免疫细胞浸润分析 CIBERSORT 法（B 站）",
          "u": "https://www.bilibili.com/video/BV1ud4y1e7kH"
        },
        {
          "n": "GSVA 官方 vignette",
          "u": "https://bioconductor.org/packages/release/bioc/vignettes/GSVA/inst/doc/GSVA.html"
        },
        {
          "n": "TIMER2.0（不写代码也能对结论）",
          "u": "http://timer.cistrome.org/"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class4-1.mp4",
          "Class4-2.mp4",
          "Class4-3.mp4",
          "Class4-4.mp4",
          "Class4-5.mp4",
          "Class4-6.mp4"
        ]
      },
      "refs": [
        {
          "n": "CIBERSORTx 官网（反卷积算免疫细胞比例）",
          "u": "https://cibersortx.stanford.edu/",
          "d": "22 种免疫细胞的参考矩阵就在这里，注册后能跑网页版",
          "t": "tool"
        },
        {
          "n": "xCell 官网（ssGSEA 打分，64 种细胞）",
          "u": "https://xcell.ucsf.edu/",
          "d": "输出是富集分数不是百分比，别拿去做归一化",
          "t": "tool"
        },
        {
          "n": "TIMER2.0（按癌种优化的免疫浸润）",
          "u": "http://timer.cistrome.org/",
          "d": "不写代码也能对结论，和 CIBERSORT 不是一回事",
          "t": "tool"
        },
        {
          "n": "ESTIMATE（算免疫/基质评分）",
          "u": "https://bioinformatics.mdanderson.org/estimate/",
          "d": "肿瘤纯度估计算法的经典实现",
          "t": "tool"
        },
        {
          "n": "MCP-counter 官方仓库",
          "u": "https://github.com/ebecht/MCPcounter",
          "d": "8 种免疫 + 2 种基质细胞，简单直观",
          "t": "doc"
        },
        {
          "n": "GSVA 官方 vignette（ssGSEA 入口）",
          "u": "https://bioconductor.org/packages/release/bioc/vignettes/GSVA/inst/doc/GSVA.html",
          "d": "k4 正文里 ssGSEA 那段的直接手册",
          "t": "doc"
        },
        {
          "n": "看小果：CIBERSORT 与 xCell 两种 R 包演示（B 站专栏）",
          "u": "https://www.bilibili.com/read/cv21535404/",
          "d": "跟着敲一遍 CIBERSORT.R + LM22 的流程",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "4.1 反卷积：把一个数拆回几种细胞",
          "why": "一块肿瘤里混着肿瘤细胞、免疫细胞、成纤维细胞。测序只给你「整块的平均表达」，反卷积就是把一个数拆回几份。",
          "pts": [
            "数学上是个线性方程组：整块表达 = Σ(细胞比例 × 该细胞在该基因上的表达)。解出来的系数就是比例。",
            "参考矩阵决定一切：CIBERSORT 用 LM22（22 种免疫细胞），xCell 用基因集打分。两者的结果**不能直接比较**。",
            "输出的是估计值，绝对值不可信，只有组间相对高低有意义。"
          ],
          "code": "# 参考矩阵：两种细胞在 3 个标志基因上的表达\nref <- matrix(c(10, 1, 8,\n                1, 12, 2), nrow = 3,\n              dimnames = list(c(\"CD3D\", \"CD19\", \"LYZ\"), c(\"Tcell\", \"Bcell\")))\nref\n\nobs <- c(6.1, 6.5, 5.2)                    # 观测到的一块组织的整块表达\nfit <- lm(obs ~ ref[, 1] + ref[, 2] - 1)   # 无截距，解两个比例\ncoef(fit)\nround(coef(fit) / sum(coef(fit)), 3)       # 归一成比例"
        },
        {
          "t": "4.2 ssGSEA 不打分比例，只打「整体偏高还是偏低」",
          "why": "ssGSEA 不算细胞比例。它看的是：这个细胞类型的标志基因，在这份样本里是不是整体排在前面。",
          "pts": [
            "做法：样本内所有基因按表达排秩，看基因集成员落在秩里的位置是否系统性偏前或偏后，累加得到富集分。",
            "分数是相对的。同一批样本内可比，跨数据集（不同平台、不同归一化方式）不可比。",
            "关键坑：基因集之间高度重叠时分数会一起动。别把「免疫都高」解释成「每种免疫细胞都多」。"
          ],
          "code": "set.seed(6)\nexpr <- setNames(rnorm(1000), paste0(\"G\", 1:1000))\nexpr[c(\"G1\",\"G5\",\"G9\",\"G20\")] <- expr[c(\"G1\",\"G5\",\"G9\",\"G20\")] + 1.5\n\nr   <- rank(expr)                  # 样本内排秩\nset <- c(\"G1\",\"G5\",\"G9\",\"G20\")     # 假设的 T 细胞标志基因\nmean(r[set])                       # 集合平均秩：越小说明越靠前\nmean(r)                            # 对照：全体平均秩（应为 500 左右）"
        },
        {
          "t": "4.3 三种方法各自的假设，混用就会写错结论",
          "why": "ESTIMATE 给的是「浸润程度」的分，CIBERSORT 给的是比例，ssGSEA 给的是富集分。三样东西写在同一句结论里，审稿人一眼看出来。",
          "pts": [
            "ESTIMATE：基于免疫/基质特征基因做单样本 GSEA，输出 ImmuneScore / StromalScore。只能排序，不能当比例。",
            "CIBERSORT：必须看置换检验的 PV 值。PV > 0.05 的样本其比例不可用，这一步很多人直接跳过。",
            "所有反卷积都假设「参考矩阵覆盖了实际存在的细胞类型」。缺一类，它的表达会被摊到其他类上，表现是「比例都很平均」。"
          ],
          "code": "s <- data.frame(sample = paste0(\"S\", 1:5),\n                ESTIMATE = c(1200, 800, 1500, 400, 950),\n                CIB_T    = c(0.31, 0.12, 0.45, 0.05, 0.22),\n                ssGSEA_T = c(0.62, 0.28, 0.71, 0.11, 0.40))\nround(cor(s[, -1]), 2)      # 三者相关性往往只有 0.5-0.7\nrank(s$ESTIMATE); rank(s$CIB_T)   # 排序也不完全一致"
        }
      ]
    },
    {
      "id": "bk",
      "title": "专题 · Bulk RNA-seq 专章：从 counts 到免疫浸润（整合你的一号~四号 + 小陈录播）",
      "plain": "你的一号~四号笔记（R 基础、TCGA/DESeq2、GO-KEGG/GSEA、ESTIMATE/CIBERSORT/ssGSEA/xCell）就是一套完整的 bulk RNA-seq 主线。本章把它们整章串起来动手跑一遍。【与 k2/k3/k4 的关系，先看这段】k2（TCGA 下载与差异）、k3（富集 ORA/GSEA）、k4（免疫浸润）三讲已经把每个环节的「原理」讲透——为什么这么算、坑在哪。本章不重复原理，而是跟着主公笔记和小陈视频把整条流程真正跑通：每一步都给一段 base R 能直接跑的原理代码，和一段标了真实包名的实战写法。原理卡壳就回去翻对应 k 讲，本章价值在「完整走通 + 小陈录播」。配套视频全部用小陈自己的录播（123 网盘，免登录）。文件与本专章各节对应：class1-1/1-2 = R 基础（第1节）；Class2-1~4 = TCGA 下载与差异分析（第2节）；Class3-1~6 = 富集 / GSEA（第3、4节）；Class4-1~6 = 免疫浸润（第5节）。点开分享链接后，按文件名对应到对应小节即可。",
      "goal": [
        "能从 TCGA/GEO 拿到原始 counts 矩阵，并完成 Ensembl/探针 ID → 基因名 的转换",
        "能用 DESeq2 跑通差异分析，说清归一化、离散度估计、Wald 检验各自在干什么",
        "能自己画出火山图和热图，并解释阈值线代表什么",
        "能做 ORA 富集和 GSEA，知道两者问的根本不是同一个问题",
        "能用 ESTIMATE/CIBERSORT/ssGSEA/xCell 反卷积免疫浸润，并分清比例与分数"
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "class1-1.mp4",
          "class1-2.mp4",
          "Class2-1.mp4",
          "Class2-2.mp4",
          "Class2-3.mp4",
          "Class2-4.mp4",
          "Class3-1.mp4",
          "Class3-2.mp4",
          "Class3-3.mp4",
          "Class3-4.mp4",
          "Class3-5.mp4",
          "Class3-6.mp4",
          "Class4-1.mp4",
          "Class4-2.mp4",
          "Class4-3.mp4",
          "Class4-4.mp4",
          "Class4-5.mp4",
          "Class4-6.mp4"
        ]
      },
      "refs": [
        {
          "n": "DESeq2 官方 vignette",
          "u": "https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html",
          "d": "差异分析金标准，design/lfcShrink 参数都在这",
          "t": "doc"
        },
        {
          "n": "clusterProfiler（Bioconductor 官方）",
          "u": "https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html",
          "d": "enrichGO/enrichKEGG/gseGO 都在这里",
          "t": "doc"
        },
        {
          "n": "CIBERSORTx 官网",
          "u": "https://cibersortx.stanford.edu/",
          "d": "22 种免疫细胞参考矩阵，注册后跑网页版",
          "t": "tool"
        },
        {
          "n": "xCell 官网",
          "u": "https://xcell.ucsf.edu/",
          "d": "64 种细胞 ssGSEA 打分，输出是分数不是百分比",
          "t": "tool"
        }
      ],
      "subs": [
        {
          "t": "1 · 拿到 counts 矩阵：下载、整理与 ID 转换",
          "vid": { "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d", "n": "本节录播", "files": ["class1-1.mp4", "class1-2.mp4"] },
          "why": "你拿到的表格格子是「这个数在多少条 reads 里」，不是「表达高不高」。TCGA 给 Ensembl ID（带版本号 ENSG0000xxx.1），GEO 芯片给探针 ID，都得先转成基因名才能往下做。",
          "pts": [
            "TCGA 用 TCGAbiolinks 下 STAR - Counts（原始计数），绝不拿 TPM/FPKM 喂 DESeq2",
            "Ensembl ID 先 sub 掉版本号再 mapIds 转 SYMBOL",
            "芯片探针用注释包（如 hgu133plus2.db）或 AnnotationDbi 转",
            "表达矩阵行=基因、列=样本，分组信息单独成表，别混一起"
          ],
          "code": "set.seed(1)\n# 读入原始 counts（行=基因/探针，列=样本）\ncnt <- read.delim(\"counts.txt\", row.names = 1, check.names = FALSE)\ndim(cnt)\n\n# Ensembl ID 常带版本号，先统一去掉（ENSG000001.1 -> ENSG000001）\nrownames(cnt) <- sub(\"\\..*\", \"\", rownames(cnt))\n\n# ID 转换本质：一次按关键列的两表连接\n# 真实用 AnnotationDbi::mapIds；这里用 base R 演示结构\nref <- data.frame(ENSEMBL = c(\"ENSG00001\",\"ENSG00002\"),\n                  SYMBOL = c(\"ABC\",\"DEF\"))\nexpr_sym <- merge(data.frame(ENSEMBL = rownames(cnt)[1:2]),\n                  ref, by = \"ENSEMBL\", all.x = TRUE)\nexpr_sym",
          "real": {
            "pkg": "TCGAbiolinks + org.Hs.eg.db",
            "code": "library(TCGAbiolinks)\nquery <- GDCquery(project = \"TCGA-LIHC\",\n                  data.category = \"Transcriptome Profiling\",\n                  data.type = \"Gene Expression Quantification\",\n                  workflow.type = \"STAR - Counts\")\nGDCdownload(query); se <- GDCprepare(query)\ncnt <- assay(se)                        # 原始 counts，直接喂 DESeq2\nlibrary(org.Hs.eg.db)\nsym <- mapIds(org.Hs.eg.db,\n              keys = sub(\"\\..*\", \"\", rownames(cnt)),\n              keytype = \"ENSEMBL\", column = \"SYMBOL\")"
          }
        },
        {
          "t": "2 · DESeq2 差异分析：count → DEG list",
          "vid": { "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d", "n": "本节录播", "files": ["Class2-1.mp4", "Class2-2.mp4", "Class2-3.mp4", "Class2-4.mp4"] },
          "why": "差异分析本质是对每个基因做「两组计数是否真的不同」的假设检验，同时估计归一化因子抵消文库大小，再用负二项分布建模离散度。",
          "pts": [
            "DESeqDataSetFromMatrix 吃原始 counts，design = ~ group",
            "pre-filter 去掉低表达基因，减少多重检验负担",
            "results + lfcShrink（apeglm）得到收缩后的 log2FC",
            "padj<0.05 且 |log2FC|>1 是常用显著阈值"
          ],
          "code": "set.seed(1)\ng <- c(rpois(20, 100), rpois(20, 200))   # 某基因：正常20、肿瘤20\ngrp <- rep(c(\"N\",\"T\"), each = 20)\n# 原理1：log2 倍数变化 ≈ 两组均值比\nlog2FC <- log2(mean(g[grp==\"T\"]) / mean(g[grp==\"N\"]))\n# 原理2：两组是否真不同，用 t 检验看 p 值\nt.test(g ~ grp)$p.value",
          "real": {
            "pkg": "DESeq2",
            "code": "library(DESeq2)\ndds <- DESeqDataSetFromMatrix(countData = cnt, colData = meta,\n                              design = ~ group)\nkeep <- rowSums(counts(dds) >= 10) >= 5\ndds <- dds[keep, ]\ndds$group <- relevel(factor(dds$group), ref = \"normal\")\ndds <- DESeq(dds)\nres <- lfcShrink(dds, coef = \"group_tumor_vs_normal\", type = \"apeglm\")\ndeg <- subset(as.data.frame(res), padj < 0.05 & abs(log2FoldChange) > 1)"
          }
        },
        {
          "t": "3 · 火山图与热图：把差异结果画出来",
          "vid": { "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d", "n": "本节录播", "files": ["Class3-1.mp4", "Class3-2.mp4", "Class3-3.mp4", "Class3-4.mp4", "Class3-5.mp4", "Class3-6.mp4"] },
          "why": "火山图一眼看「又显著又变化大」的基因；热图看一批基因在样本间的表达模式。两者都是差异分析的门面。",
          "pts": [
            "火山图 x=log2FC, y=-log10(padj)，画阈值线",
            "用 ggrepel 标关键基因名，别让点糊成一团",
            "热图先做 z-score 归一，再按样本/基因聚类",
            "热图行数别太多，挑 top DEG 或某通路基因"
          ],
          "code": "set.seed(3)\nn <- 300\nlfc <- rnorm(n, 0, 2); padj <- p.adjust(runif(n), method = \"BH\")\n# 火山图\nplot(lfc, -log10(padj), pch = 16, cex = 0.7,\n     col = ifelse(padj < 0.05 & abs(lfc) > 1, \"red\", \"grey\"),\n     xlab = \"log2FC\", ylab = \"-log10(adj P)\")\nabline(v = c(-1,1), lty = 2); abline(h = -log10(0.05), lty = 2)\n# 热图\nmat <- matrix(rnorm(50*8), 50, 8)\nheatmap(mat, scale = \"row\")",
          "real": {
            "pkg": "ggplot2 + ggrepel + pheatmap",
            "code": "library(ggplot2); library(ggrepel); library(pheatmap)\nvolcano <- ggplot(res.df, aes(x = log2FoldChange, y = -log10(padj),\n       color = change)) + geom_point() + geom_vline(xintercept = c(-1,1)) +\n       geom_hline(yintercept = -log10(0.05)) +\n       geom_text_repel(data = subset(res.df, padj < 0.05 & abs(log2FoldChange)>1),\n                       aes(label = SYMBOL))\npheatmap(mat_z, scale = \"row\", cluster_rows = TRUE, show_rownames = FALSE)"
          }
        },
        {
          "t": "4 · 富集分析：ORA 与 GSEA 根本不是一回事",
          "vid": { "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d", "n": "本节录播（与第3节同批视频）", "files": ["Class3-1.mp4", "Class3-2.mp4", "Class3-3.mp4", "Class3-4.mp4", "Class3-5.mp4", "Class3-6.mp4"] },
          "why": "ORA（超几何检验）问的是「差异基因里某个通路的基因是不是扎堆了」；GSEA 问的是「按表达变化排好序的全基因列表里，某通路的基因是不是整体靠前」。一个只看显著基因，一个用全基因排名。",
          "pts": [
            "ORA 用 enrichGO/enrichKEGG，背景集要选对",
            "GSEA 输入是排序后的全基因列表 + 基因集，不是只喂 DEG",
            "p 值要对多重检验做校正（qvalue/FDR）",
            "两种结果别混着说，结论口径不同"
          ],
          "code": "pathway_genes <- 200; total_genes <- 20000\ndeg_genes <- 1500; deg_in_pathway <- 60\n# ORA：差异基因里某通路基因是否扎堆（超几何检验）\nphyper(deg_in_pathway - 1, pathway_genes,\n       total_genes - pathway_genes, deg_genes, lower.tail = FALSE)\n# GSEA 思想：把全基因按 log2FC 排序，看某通路是否整体靠前\nrank <- sort(lfc, decreasing = TRUE, index.return = TRUE)$ix",
          "real": {
            "pkg": "clusterProfiler + org.Hs.eg.db",
            "code": "library(clusterProfiler); library(org.Hs.eg.db)\nego <- enrichGO(gene = deg_symbols, OrgDb = org.Hs.eg.db,\n                ont = \"BP\", pAdjustMethod = \"BH\", qvalueCutoff = 0.05)\nego <- pairwise_termsim(ego)\nekk <- enrichKEGG(gene = deg_entrez, organism = \"hsa\")\ngsea <- gseGO(geneList = ranked_lfc, OrgDb = org.Hs.eg.db, ont = \"BP\")"
          }
        },
        {
          "t": "5 · 免疫浸润：ESTIMATE / CIBERSORT / ssGSEA / xCell",
          "vid": { "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d", "n": "本节录播", "files": ["Class4-1.mp4", "Class4-2.mp4", "Class4-3.mp4", "Class4-4.mp4", "Class4-5.mp4", "Class4-6.mp4"] },
          "why": "一块组织混着多种细胞，测序只给混合平均值。反卷积就是用一份「参考特征」把混合信号拆回各细胞类型的占比/分数。四种方法给的东西不一样：ESTIMATE 给基质/免疫分数，CIBERSORT 给 22 种免疫细胞比例，ssGSEA/xCell 给富集分数（不是百分比）。",
          "pts": [
            "CIBERSORT 输出比例（加起来≈1），需网页版或自带 LM22 矩阵",
            "ssGSEA/xCell 输出富集分数，别拿去归一化当比例",
            "ESTIMATE 分数高≠细胞多，只是表达谱像",
            "三种结果当三件不同的事，不能互相替代"
          ],
          "code": "set.seed(5)\n# 反卷积思想：混合信号 = 各细胞类型特征 x 比例\nM <- matrix(runif(6*3), 6, 3)        # 3 种细胞的 6 基因特征\ntrue_prop <- c(0.5, 0.3, 0.2)\nmix <- M %*% true_prop               # 混合表达\nest <- solve(M, mix)                 # 反推比例\nround(est, 2)",
          "real": {
            "pkg": "ESTIMATE + CIBERSORT + GSVA",
            "code": "library(ESTIMATE)\nscores <- estimateScore(t(expr.matrix), platform = \"illumina\")\n# CIBERSORT 用官方 R 脚本 + 参考矩阵 LM22\nsource(\"CIBERSORT.R\")\nres <- CIBERSORT(\"LM22.txt\", \"expr.txt\")\nlibrary(GSVA); library(GSEABase)\nss <- gsva(as.matrix(expr), geneSets, method = \"ssgsea\")"
          }
        },
        {
          "t": "6 · 相关性热图与接回单细胞",
          "vid": { "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d", "n": "本节衔接单细胞，无单独录播（复用第5节视频即可）", "files": [] },
          "why": "算基因间/样本间相关性是 bulk 里最常做的探索；做完 bulk，再上单细胞看「哪些细胞在驱动这些信号」，两层的结论才闭环。",
          "pts": [
            "cor() 算相关性，heatmap 可视化",
            "相关性≠因果，别拿 r 当机制证据",
            "bulk 看到的差异，去单细胞里定位到具体细胞群",
            "本课题 RILD 里，bulk 差异 + 单细胞分区定位 = 治疗图谱"
          ],
          "code": "cors <- cor(t(mat))                  # 基因间相关性（mat 行=基因）\nheatmap(cors, cex = 0.6)\nheatmap(cor(mat))                    # 样本间相关性",
          "real": {
            "pkg": "Seurat",
            "code": "library(Seurat)\nIdents(sc) <- sc$celltype\n# 把 bulk 差异基因拿去单细胞验证：哪群细胞在驱动\nVlnPlot(sc, features = head(deg_symbols), group.by = \"celltype\")"
          }
        }
      ]
    },
    {
      "id": "k5",
      "title": "第 5 讲　临床预后：生存数据、KM、COX 与 ROC",
      "plain": "把表达量变成「高危 / 低危」，再画一条生存曲线。这讲会说明白 HR 和 AUC 各能说明什么、不能说明什么——这两句话写错，审稿人一眼就看出来。",
      "goal": "把表达数据变成「高危/低危」，并且知道 HR、AUC 各自能说明什么、不能说明什么。",
      "watch": [
        {
          "n": "列线图 / Nomogram 绘制细节（B 站）",
          "u": "https://www.bilibili.com/video/BV1HP1FBSE6q"
        },
        {
          "n": "【麦子】Cox 回归 R 操作（B 站）",
          "u": "https://www.bilibili.com/video/av18918951"
        },
        {
          "n": "survival 包（CRAN）",
          "u": "https://cran.r-project.org/web/packages/survival/index.html"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class5-1.mp4",
          "Class5-2.mp4",
          "Class5-3.mp4",
          "Class5-4.mp4",
          "Class5-5.mp4",
          "Class5-6.mp4"
        ]
      },
      "refs": [
        {
          "n": "survminer（画出版级 KM 曲线）",
          "u": "https://cran.r-project.org/web/packages/survminer/",
          "d": "ggsurvplot 的 pval/risk.table 参数都在这",
          "t": "doc"
        },
        {
          "n": "timeROC（时间依赖 ROC/AUC）",
          "u": "https://cran.r-project.org/web/packages/timeROC/",
          "d": "普通 ROC 不考虑时间，预后要用这个",
          "t": "doc"
        },
        {
          "n": "rms（列线图 nomogram 与校准）",
          "u": "https://cran.r-project.org/web/packages/rms/",
          "d": "nomogram、calibrate 都在里面",
          "t": "doc"
        },
        {
          "n": "KM plotter（在线生存分析，不用写代码）",
          "u": "https://kmplot.com/",
          "d": "拿基因名直接出 KM 图，先对结论再写 R",
          "t": "tool"
        },
        {
          "n": "【麦子】Cox 回归的 R 操作：单因素到多因素",
          "u": "https://www.bilibili.com/video/av18918951/",
          "d": "小姐姐带写代码，每一步都讲，初学者友好",
          "t": "video"
        },
        {
          "n": "R 语言复现 SCI：COX 预测模型全流程（B 站专栏）",
          "u": "https://www.bilibili.com/read/cv28955507/",
          "d": "筛选变量→列线图→校准→ROC→DCA 一气呵成",
          "t": "doc"
        },
        {
          "n": "How to run survival analysis in R（英文，但讲得最透）",
          "u": "https://dissertationstatisticshelp.org/blog/survival-analysis-in-r",
          "d": "censoring 怎么编码、PH 假设怎么检验，写错审稿人一眼看穿",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "5.1 生存数据永远是两列：time 和 status",
          "why": "status 里 1 是「死了/复发了」，0 是「随访结束时还活着」。这一列搞错，后面所有结论全反。",
          "pts": [
            "time 的起点必须统一（确诊日或手术日），终点是事件发生或最后一次随访。起点不统一，整列时间都废。",
            "status = 0 叫删失：不是「没事件」，是「我们不知道后来怎样」。把它丢掉，等于把随访短的人当成活得好。",
            "最常见的错：把 days_to_death 的 NA 填成 0，于是一大批病人被当成「当天死亡」。"
          ],
          "code": "surv <- data.frame(id = paste0(\"P\", 1:6),\n                   time = c(12, 30, 8, 60, 25, 45),\n                   status = c(1, 0, 1, 0, 1, 0))\nsurv\nmean(surv$status)                                    # 事件率 0.5\n\nbad <- surv\nbad$time[bad$status == 0] <- 0                       # 错误做法：删失填 0\nmean(surv$time); mean(bad$time)                      # 差多少一目了然"
        },
        {
          "t": "5.2 KM 曲线与 log-rank，手算一遍就懂了",
          "why": "KM 曲线的做法很朴素：在每个事件时点，用「当时还在的人」算一次生存率，然后乘起来。删失者从这个时点之后退出风险集。",
          "pts": [
            "中位生存时间 = 生存率跌破 0.5 的那个时点，不是平均时间。",
            "log-rank 比较的是两条曲线整段的「期望事件数 vs 实际事件数」，不是比较某个时间点的生存率。",
            "log-rank 的前提是风险比例大致恒定（PH 假设）。曲线交叉时它失效，应改用 RMST 或分段分析。"
          ],
          "code": "km <- function(time, status) {\n  t <- sort(unique(time[status == 1]))\n  S <- 1\n  out <- data.frame(t = t, nrisk = NA, d = NA, S = NA)\n  for (i in seq_along(t)) {\n    atrisk <- sum(time >= t[i])                  # 这个时点还在风险集里的人数\n    d      <- sum(time == t[i] & status == 1)    # 这个时点发生事件的人数\n    S      <- S * (1 - d / atrisk)               # 生存率乘一个因子\n    out[i, ] <- list(t[i], atrisk, d, S)\n  }\n  out\n}\nkm(c(12, 30, 8, 60, 25, 45), c(1, 0, 1, 0, 1, 0))"
        },
        {
          "t": "5.3 COX 给的是 HR，不是「生存时间缩几倍」",
          "why": "HR = 2 意思是「风险翻倍」，不是「活得短一半」。这两件事只有生存分布刚好是指数分布时才等价。",
          "pts": [
            "HR 是「任一时刻的事件风险乘几倍」，它是整条风险曲线一起乘，不改变曲线形状（这就是 PH 假设）。",
            "多因素 COX 才能说「独立预后因素」。单因素显著、多因素不显著，说明它是被别的变量带出来的。",
            "PH 假设要检验（`cox.zph`）。p < 0.05 说明 HR 随时间在变，这时报一个固定 HR 是错的。"
          ],
          "code": "risk <- data.frame(group = c(\"high\",\"high\",\"high\",\"low\",\"low\",\"low\"),\n                   event = c(1, 1, 0, 1, 0, 0))\ntab <- table(risk$group, risk$event)\ntab\n# 粗略风险比：高组事件率 / 低组事件率（真正的 COX 用 partial likelihood）\n(tab[1, 2] / sum(tab[1, ])) / (tab[2, 2] / sum(tab[2, ]))",
          "real": {
            "pkg": "survival",
            "code": "fit <- coxph(Surv(time, status) ~ risk_score + age + stage, data = d)\nsummary(fit)          # exp(coef) 就是 HR\ncox.zph(fit)          # PH 假设检验，p 要 > 0.05\nsurvdiff(Surv(time, status) ~ group, data = d)   # log-rank"
          }
        },
        {
          "t": "5.4 AUC 是区分度，不是准确率，更不是校准度",
          "why": "AUC 的意思是：随机抽一个阳性、一个阴性，模型给阳性打分更高的概率。它完全不告诉你「预测 80% 的人里实际是不是 80%」——那是校准。",
          "pts": [
            "AUC = 0.75 已经是中等偏好。临床模型 0.65-0.75 很常见，出现 0.95 基本意味着过拟合或数据泄漏。",
            "普通 ROC 把「3 年时仍存活」当阴性，忽略了随访长度。生存数据要用时间依赖 ROC。",
            "C-index 是 AUC 在生存数据上的推广。训练集 0.85、验证集 0.62 是典型的过拟合形状。"
          ],
          "code": "score <- c(9, 8, 7, 6, 5, 4, 3, 2)\ntruth <- c(1, 1, 0, 1, 1, 0, 0, 0)\n\nauc <- function(s, y) {\n  pos <- s[y == 1]; neg <- s[y == 0]\n  mean(outer(pos, neg, \">\") + 0.5 * outer(pos, neg, \"==\"))\n}\nauc(score, truth)          # 全部阳性对都排对的概率\n\nfor (th in sort(unique(score))) {\n  tpr <- mean(score[truth == 1] >= th)\n  fpr <- mean(score[truth == 0] >= th)\n  cat(sprintf(\"阈值 %d -> TPR %.2f  FPR %.2f\\n\", th, tpr, fpr))\n}"
        }
      ]
    },
    {
      "id": "k6",
      "title": "第 6 讲　一致性聚类、TMB 与基线资料表",
      "plain": "分型、突变负荷、基线资料表，这三件事最容易被糊弄过去。这讲把它们做实：分型要稳得住、TMB 别算错分子分母、Table 1 不能只放 p 值。",
      "goal": "把「分型」「突变负荷」「Table 1」这三件常被糊弄过去的事做扎实。",
      "watch": [
        {
          "n": "肿瘤突变数据分析：maftools / TMB / 突变全景图（B 站）",
          "u": "https://www.bilibili.com/video/BV1Sy4y1S7pz"
        },
        {
          "n": "cBioPortal（查突变和拷贝数）",
          "u": "https://www.cbioportal.org/"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class6-1.mp4",
          "Class6-2.mp4",
          "Class6-3.mp4",
          "Class6-4.mp4",
          "Class6-5.mp4",
          "Class6-6.mp4"
        ]
      },
      "refs": [
        {
          "n": "ConsensusClusterPlus（一致性聚类官方包）",
          "u": "https://bioconductor.org/packages/release/bioc/html/ConsensusClusterPlus.html",
          "d": "k 值稳定性图、一致性矩阵都它出",
          "t": "doc"
        },
        {
          "n": "maftools（突变全景 + TMB 计算）",
          "u": "https://bioconductor.org/packages/release/bioc/html/maftools.html",
          "d": "TMB 分子分母、棒棒糖图、signature 全在这",
          "t": "doc"
        },
        {
          "n": "tableone（基线资料 Table 1）",
          "u": "https://cran.r-project.org/web/packages/tableone/",
          "d": "别只放 p 值，分类/连续变量分层展示",
          "t": "doc"
        },
        {
          "n": "cBioPortal（查突变、拷贝数、分型）",
          "u": "https://www.cbioportal.org/",
          "d": "先看别人怎么做再动手，k6 三件事都能在这验证",
          "t": "tool"
        },
        {
          "n": "生信技能树：肿瘤突变数据分析（含 maftools，B 站）",
          "u": "https://www.bilibili.com/video/BV1Sy4y1S7pz/",
          "d": "下游统计可视化十几个小时，突变分析入门",
          "t": "video"
        },
        {
          "n": "使用 maftools 分析 TMB 和 MATH（排坑）",
          "u": "https://www.bioinfo-scrounger.com/archives/645/",
          "d": "TMB 每 Mb 突变数怎么算、bTMB 是什么，讲清楚了",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "6.1 一致性聚类在评估「稳定性」",
          "why": "普通聚类每换一次随机种子，分组就可能变。一致性聚类跑几百次重抽样，看「这两个样本有多少次被分到一起」，用稳定性反过来定 k。",
          "pts": [
            "输入是「样本 x 样本」的一致性矩阵（共同出现的比例），不是表达矩阵。",
            "k 的选择看一致性矩阵有多「块状」——块内偏红、块间偏蓝、边界清晰，就说明这个 k 稳。",
            "k=2 和 k=3 都说得通时不要硬选。审稿人一定会问「你这个分型的生物学解释是什么」。"
          ],
          "code": "set.seed(7)\nx  <- matrix(rnorm(20 * 30), nrow = 20)      # 30 个样本 x 20 个基因\nco <- matrix(0, 30, 30)\nrownames(co) <- colnames(co) <- paste0(\"S\", 1:30)\n\nfor (b in 1:100) {\n  idx <- sample(30, 24)                      # 每次抽 80% 的样本\n  cl  <- cutree(hclust(dist(t(x[, idx]))), k = 2)\n  lab <- rep(NA, 30); lab[idx] <- cl\n  for (i in 1:30) for (j in 1:30)\n    if (!is.na(lab[i]) && !is.na(lab[j]))\n      co[i, j] <- co[i, j] + (lab[i] == lab[j])\n}\nround(co[1:6, 1:6] / 100, 2)                 # 越接近 1 越常被分到一起"
        },
        {
          "t": "6.2 TMB = 非同义突变数 / 外显子长度",
          "why": "公式只有一行，但分子分母各有坑。分子算了同义突变、分母写错，TMB 能差一倍。",
          "pts": [
            "只算体细胞突变（somatic），胚系不算。MAF 里要按 Variant_Classification 过滤掉 Silent / Intron / UTR。",
            "分母是外显子总长约 30-38 Mb（WES）。不同 panel 的基因数不同，panel-TMB 和 WES-TMB 不能直接比。",
            "TMB 高不等于免疫治疗一定有效。它是伴随诊断指标，不是疗效保证。"
          ],
          "code": "maf <- data.frame(\n  sample = c(\"S1\",\"S1\",\"S1\",\"S1\",\"S2\",\"S2\"),\n  class  = c(\"Missense_Mutation\",\"Silent\",\"Nonsense_Mutation\",\n             \"Intron\",\"Missense_Mutation\",\"Frame_Shift_Del\"))\n\nnonsyn <- c(\"Missense_Mutation\",\"Nonsense_Mutation\",\"Frame_Shift_Del\",\n            \"Splice_Site\",\"In_Frame_Del\",\"In_Frame_Ins\")\ntmb <- sapply(split(maf, maf$sample), function(d)\n  sum(d$class %in% nonsyn) / 38)       # 38 Mb 外显子\ntmb"
        },
        {
          "t": "6.3 基线资料表：目的是展示差异，不是证明可比",
          "why": "Table 1 是给读者看「两组本来就不一样」，不是用 p 值证明「两组可以比」。只放 p 值不放原始数字，是最常见的低级错误。",
          "pts": [
            "连续变量写 mean±SD 或 median(IQR)，必须说明用的是哪个；分类变量写 n(%)。",
            "组间比较：连续变量按正态性选 t 或 Wilcoxon，分类变量用卡方或 Fisher。别一律上 t 检验。",
            "标准化差异（SMD）比 p 值更适合看平衡，因为 p 值受样本量影响太大——大样本里 1 岁的差别也「显著」。"
          ],
          "code": "set.seed(8)\nd <- data.frame(arm = rep(c(\"A\", \"B\"), each = 20),\n                age = c(rnorm(20, 58, 9), rnorm(20, 61, 10)),\n                sex = sample(c(\"M\", \"F\"), 40, TRUE))\n\naggregate(age ~ arm, d, function(x) sprintf(\"%.1f±%.1f\", mean(x), sd(x)))\ntab <- table(d$arm, d$sex); tab\nchisq.test(tab)$p.value\n\nmA <- mean(d$age[d$arm == \"A\"]); mB <- mean(d$age[d$arm == \"B\"])\nsA <- sd(d$age[d$arm == \"A\"]);   sB <- sd(d$age[d$arm == \"B\"])\n(mA - mB) / sqrt((sA^2 + sB^2) / 2)      # SMD，|SMD| < 0.1 算平衡"
        }
      ]
    },
    {
      "id": "k7",
      "title": "第 7 讲　共表达网络、PPI 与 hub 基因",
      "plain": "基因不是各干各的，是一群一群一起动。这讲讲清 WGCNA 里那个软阈值到底在干什么，以及为什么 hub 基因（连接最多的）不等于关键基因。",
      "goal": "知道 WGCNA 的软阈值在干什么，以及为什么 hub 基因不等于关键基因。",
      "watch": [
        {
          "n": "WGCNA 加权共表达网络全流程（B 站）",
          "u": "https://www.bilibili.com/video/BV1aT421v7kZ"
        },
        {
          "n": "高级转录组分析与 R 可视化（含 WGCNA，B 站）",
          "u": "https://www.bilibili.com/video/BV1rD4y1272a"
        },
        {
          "n": "WGCNA（CRAN 包主页，教程 PDF 在里面）",
          "u": "https://cran.r-project.org/web/packages/WGCNA/index.html"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class7-1.mp4",
          "Class7-2.mp4",
          "Class7-3.mp4",
          "Class7-4.mp4",
          "Class7-5.mp4",
          "Class7-6.mp4"
        ]
      },
      "refs": [
        {
          "n": "STRING（蛋白互作网络）",
          "u": "https://string-db.org/",
          "d": "把候选基因丢进去，导出可给 Cytoscape 的边表",
          "t": "tool"
        },
        {
          "n": "Cytoscape（画网络图）",
          "u": "https://cytoscape.org/",
          "d": "WGCNA 导出的边表在这可视化，按模块/连通度上色",
          "t": "tool"
        },
        {
          "n": "clusterProfiler（富集 + 网络注释）",
          "u": "https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html",
          "d": "hub 基因到底富集在哪个通路，用它确认",
          "t": "doc"
        },
        {
          "n": "GeneMANIA（找功能相关基因）",
          "u": "https://genemania.org/",
          "d": "hub 基因的邻居是谁，互补 STRING",
          "t": "tool"
        },
        {
          "n": "igraph（R 里算节点度/中心性）",
          "u": "https://igraph.org/r/",
          "d": "不想开 Cytoscape 时，用它在 R 里算 degree/betweenness",
          "t": "doc"
        },
        {
          "n": "WGCNA 找 Hub 基因全流程拆解（含「值不值得做」）",
          "u": "http://mp.weixin.qq.com/s?__biz=MzkzNTMwMDE0MQ==&mid=2247566349&idx=2&sn=ee8d44809448a520e93b7ba6ec26e03b&chksm=c3dfa2621e802aa73bc0735accb75e3461b72bd1975b3c0e3df41177c62a7b3d823800871608",
          "d": "MM/GS 双高只是起点，怎么判断一个 hub 基因值得做，讲得最实在",
          "t": "doc"
        },
        {
          "n": "Gene Co-Expression Network Analysis with WGCNA（英文教程）",
          "u": "https://indianelucidbiology.com/tutorials/gene-coexpression-network-wgcna-tutorial.html",
          "d": "软阈值→模块→hub→导出 Cytoscape，参数怎么调都列了",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "7.1 软阈值 β：把「相关强弱」按幂次放大",
          "why": "共表达网络不该用「相关 > 0.8 就画条边」这种硬阈值——阈值一动网络就变。β 的作用是把连续的相关值映射成权重，保留强弱而不是一刀切。",
          "pts": [
            "目标是把网络变成无标度网络：少数基因连很多边，多数基因连很少。生物网络确实长这样。",
            "选 β 的标准是「无标度拓扑拟合 R² 首次 ≥ 0.8（或 0.9）的最小幂次」。样本少时 β 会被迫取很大。",
            "β 越大，强相关被放大得越厉害，弱相关被压得越接近 0。这就是它替代硬阈值的方式。"
          ],
          "code": "set.seed(9)\nx <- matrix(rnorm(20 * 50), nrow = 20)          # 20 基因 x 50 样本\nx[2, ] <- x[1, ] * 0.9 + rnorm(50, 0, 0.2)      # 人为造一对强相关基因\n\nr <- cor(t(x)); diag(r) <- 0\nfor (b in c(1, 3, 6, 12)) {\n  kk <- colSums(abs(r)^b)                       # β 次幂后的连通度\n  cat(sprintf(\"β=%2d  最大 %.1f  中位 %.2f  最大/中位 %.1f\\n\",\n              b, max(kk), median(kk), max(kk) / median(kk)))\n}"
        },
        {
          "t": "7.2 模块 = 聚类 + 剪枝 + 合并",
          "why": "WGCNA 的模块不是什么新东西：先按 TOM 相似度做层次聚类，再用动态剪枝把形状不稳的枝剪掉，最后把太像的模块合并。",
          "pts": [
            "流程：TOM 相似度 → 层次聚类 → 动态剪枝（dynamic tree cut）→ 合并相似模块（`mergeCutHeight` 默认 0.25）。",
            "模块和表型的关联，用的是模块特征基因（ME，该模块的第一主成分）做相关，不是把模块里每个基因单独做。",
            "灰色模块（grey）是「没归进任何模块的」，不要在文章里当成一个模块来报。"
          ],
          "code": "hc <- hclust(dist(x))      # 对基因聚类：行是基因，所以用 dist(x) 不是 dist(t(x))\ncl <- cutree(hc, k = 3)\ntable(cl)\n\n# 模块特征基因：该模块内基因的第一主成分\nme <- sapply(sort(unique(cl)), function(g)\n  prcomp(t(x[cl == g, , drop = FALSE]))$x[, 1])\ncolnames(me) <- paste0(\"ME\", sort(unique(cl)))\nround(cor(me), 2)      # 模块之间相关太高，说明该合并"
        },
        {
          "t": "7.3 PPI 的 degree 高，只说明「被研究得多」",
          "why": "STRING 的边是证据汇总分，不是实验测出来的亲和力。degree 高往往意味着这个基因热门、被报道得多，不等于它是因果驱动者。",
          "pts": [
            "STRING 置信度 0.4 是低置信、0.7 是高置信。阈值不同，hub 名单就不同，文章必须写清楚用的是哪个。",
            "Cytoscape 的 cytoHubba 有十二种算法，会给你十二份 hub 名单。选哪个要有理由，不能挑最好看的。",
            "hub 基因必须回到表达数据里验证：它在差异基因里吗？它和预后相关吗？否则它只是网络图上的一个点。"
          ],
          "code": "edges <- data.frame(\n  a = c(\"YAP1\",\"YAP1\",\"CTNNB1\",\"CTNNB1\",\"SPP1\",\"TFRC\"),\n  b = c(\"CTNNB1\",\"TEAD1\",\"AXIN2\",\"TEAD1\",\"CD44\",\"ATF4\"),\n  score = c(0.91, 0.88, 0.77, 0.65, 0.72, 0.40))\n\nsort(table(c(edges$a, edges$b)), decreasing = TRUE)   # 度中心性\nnrow(subset(edges, score >= 0.7))                     # 换阈值，边数就变\nnrow(subset(edges, score >= 0.4))"
        }
      ]
    },
    {
      "id": "k8",
      "title": "第 8 讲　GEO 实战：从 GSE 号到能分析的矩阵",
      "plain": "手里只有一个 GSE 号，怎么把它变成一张能分析的干净矩阵。这讲给的是顺序——先查什么、再下什么、什么时候该停，别自己乱试。",
      "goal": "拿到一个 GSE 号之后，知道按什么顺序把它变成干净的表达矩阵。",
      "watch": [
        {
          "n": "jimmy：GEO 数据挖掘实战（三阴性乳腺癌，B 站）",
          "u": "https://www.bilibili.com/video/BV1dy4y1C7jz"
        },
        {
          "n": "GEO 表达芯片数据处理（B 站）",
          "u": "https://www.bilibili.com/video/av26731585"
        },
        {
          "n": "GEO 首页",
          "u": "https://www.ncbi.nlm.nih.gov/geo/"
        },
        {
          "n": "UCSC Xena（TCGA 标准化数据）",
          "u": "https://xenabrowser.net/"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class8-1.mp4",
          "Class8-2.mp4",
          "Class8-3.mp4",
          "Class8-4.mp4",
          "Class8-5.mp4"
        ]
      },
      "refs": [
        {
          "n": "GDC（TCGA 官方门户）",
          "u": "https://portal.gdc.cancer.gov/",
          "d": "TCGA 唯一的官方来源，别用二手整理版",
          "t": "doc"
        },
        {
          "n": "GEOquery（Bioconductor 官方）",
          "u": "https://bioconductor.org/packages/release/bioc/html/GEOquery.html",
          "d": "getGEO 一把抓矩阵+临床，本课主包",
          "t": "doc"
        },
        {
          "n": "limma（Bioconductor 官方）",
          "u": "https://bioconductor.org/packages/release/bioc/html/limma.html",
          "d": "芯片/RNA-seq 差异与 normalize.quantiles 的来源",
          "t": "doc"
        },
        {
          "n": "sva（ComBat 批次校正）",
          "u": "https://bioconductor.org/packages/release/bioc/html/sva.html",
          "d": "合并多数据集前先消批次，本课 8.2 用",
          "t": "doc"
        },
        {
          "n": "GEOquery 实例（哈佛公开课）",
          "u": "https://genomicsclass.github.io/book/pages/GEOquery.html",
          "d": "getGEO/getGEOSuppFiles 的实战演示",
          "t": "doc"
        },
        {
          "n": "GEO 芯片全流程实战（博客园）",
          "u": "https://www.cnblogs.com/henbio/p/19187697",
          "d": "探针→ENTREZ→SYMBOL 去重，GSE69063 为例",
          "t": "doc"
        },
        {
          "n": "GEO2R（NCBI 在线）",
          "u": "https://www.ncbi.nlm.nih.gov/geo/geo2r/",
          "d": "不写代码先预览差异，核对完再进 R",
          "t": "tool"
        }
      ],
      "subs": [
        {
          "t": "8.1 先看清这个 GSE 是什么结构",
          "why": "复现别人的文章，第一步不是下数据，是搞清他用了哪几个号、什么平台、有没有生存信息。这一步做错，后面全白干。",
          "pts": [
            "每个 GSE 都要问三件事：平台是什么（Affy / Agilent / RNA-seq）、有没有配对癌旁、有没有随访时间。",
            "平台不同 → 探针 ID 不同 → 必须用各自的注释包（hgu133a.db / hgu133plus2.db），不能按 ID 直接合并。",
            "有生存信息才能做预后模型；只有分组没随访的，只能做差异和富集。"
          ],
          "code": "# 一个基因对应多个探针时的常规处理：保留表达均值最大的那个\nprobe <- data.frame(\n  probe = c(\"1007_s_at\",\"1053_at\",\"117_at\",\"121_at\",\"1255_g_at\"),\n  gene  = c(\"DDR1\",\"RFC2\",\"HSPA6\",\"PAX8\",\"GUCA1A\"),\n  mean  = c(9.8, 7.1, 6.4, 8.9, 3.2))\nprobe[order(probe$gene, -probe$mean), ]\nprobe <- probe[!duplicated(probe$gene), ]   # 每个基因留一行\nprobe"
        },
        {
          "t": "8.2 批次效应：PC1 常常就是「来自哪个数据集」",
          "why": "两个数据集拼一起，前几个主成分里最大的那个往往不是生物学差异，而是「这批样本来自哪个 GSE」。不处理，聚类会先按数据集分开。",
          "pts": [
            "先看：PCA 图上按数据集着色，如果完全分开就是有批次。再看批次是否和分组混杂。",
            "处理工具：ComBat（sva）、removeBatchEffect（limma）、Harmony（单细胞）。不能用 t 检验前「顺手」做一个。",
            "最危险的情况是「批次和分组完全重合」（A 全是肿瘤、B 全是正常）。这时任何校正都救不了，只能分开分析。"
          ],
          "code": "set.seed(10)\na <- matrix(rnorm(100), nrow = 10) + 2      # 数据集 A，整体偏高 2\nb <- matrix(rnorm(100), nrow = 10)          # 数据集 B\nbatch <- rep(c(\"A\", \"B\"), each = 10)\n\npc <- prcomp(t(cbind(a, b)))$x\ntapply(pc[, 1], batch, mean)                # PC1 上的批次差异\n\ncenter_to <- function(m, target) m - apply(m, 1, median) + target\ntgt <- median(apply(cbind(a, b), 1, median))\nbc  <- cbind(center_to(a, tgt), center_to(b, tgt))\ntapply(prcomp(t(bc))$x[, 1], batch, mean)   # 差异被压掉"
        },
        {
          "t": "8.3 合并两个数据集前必须做的三件事",
          "why": "合并不是 rbind。基因 ID、样本类型、表达尺度三样对不上，合出来的矩阵就是垃圾，而且照样能跑出结果。",
          "pts": [
            "基因取**交集**不是并集，并确认 symbol 版本（别把新旧 symbol 当成两个不同基因）。",
            "尺度统一：都在 log2(TPM+1)，或都在 log2(RMA) 上。一个原始值一个 log 值，合起来全是假差异。",
            "去重样本：同一病人多次取样、同一数据重复上传，必须查 sample title 才能发现。"
          ],
          "code": "a <- data.frame(gene = c(\"TP53\",\"EGFR\",\"MYC\"), v = c(9, 8, 7))\nb <- data.frame(gene = c(\"TP53\",\"MYC\",\"KRAS\"), v = c(3, 5, 6))\n\nintersect(a$gene, b$gene)          # 取交集，不是并集\nm <- merge(a, b, by = \"gene\")\nm\nrownames(m) <- m$gene\nm$gene <- NULL\nas.matrix(m)"
        }
      ]
    },
    {
      "id": "k9",
      "title": "第 9 讲　LASSO 预后模型与数据泄漏",
      "plain": "几百个候选基因、几十个病人，普通回归会把答案直接背下来。这讲讲 LASSO 怎么逼它只留几个，以及最容易让整个结果作废的那几个操作。",
      "goal": "知道 LASSO 为什么能选基因，以及最容易把结果做废的那几个操作。",
      "watch": [
        {
          "n": "列线图 / LASSO / Cox 预测模型（B 站）",
          "u": "https://www.bilibili.com/video/BV1HP1FBSE6q"
        },
        {
          "n": "【麦子】Cox 回归 R 操作（B 站）",
          "u": "https://www.bilibili.com/video/av18918951"
        },
        {
          "n": "OSCA（第 5 章讲特征选择，通用）",
          "u": "https://bioconductor.org/books/release/OSCA/"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class9-1.mp4",
          "Class9-2.mp4",
          "Class9-3.mp4",
          "Class9-4.mp4",
          "Class9-5.mp4",
          "Class9-6.mp4"
        ]
      },
      "refs": [
        {
          "n": "cBioPortal",
          "u": "https://www.cbioportal.org/",
          "d": "突变、拷贝数、生存一起查",
          "t": "doc"
        },
        {
          "n": "glmnet（CRAN 官方）",
          "u": "https://cran.r-project.org/web/packages/glmnet/index.html",
          "d": "LASSO-Cox 本包，cv.glmnet 选 λ",
          "t": "doc"
        },
        {
          "n": "timeROC（CRAN）",
          "u": "https://cran.r-project.org/web/packages/timeROC/index.html",
          "d": "时间依赖 AUC，报 1/3/5 年区分度",
          "t": "doc"
        },
        {
          "n": "survminer（CRAN）",
          "u": "https://cran.r-project.org/web/packages/survminer/index.html",
          "d": "ggsurvplot 画 KM，本课 9.3 出图",
          "t": "doc"
        },
        {
          "n": "ranger（随机生存森林）",
          "u": "https://cran.r-project.org/web/packages/ranger/index.html",
          "d": "LASSO 之外的备选模型，可做集成",
          "t": "doc"
        },
        {
          "n": "rms（校准曲线）",
          "u": "https://cran.r-project.org/web/packages/rms/index.html",
          "d": "calibrate 看模型校准，不只看区分度",
          "t": "doc"
        },
        {
          "n": "LASSO→多因素COX→风险评分→KM/ROC 全套（微信）",
          "u": "http://mp.weixin.qq.com/s?__biz=MzIyNDI1MzgzOQ==&mid=2650400318&idx=1&sn=7c72b9353829d9c36cc0be43dda8719e&chksm=f01c84dec76b0dc8e2ef640226f949de3fdd647a9316edef4734747c73e602919e51170513da#rd",
          "d": "从表达矩阵到风险评分的完整可运行代码",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "9.1 LASSO 就是在回归上加一个 Σ|β| 惩罚",
          "why": "几百个候选基因、几十个病人，普通回归会把答案背下来。LASSO 加一个惩罚，逼大部分系数变成 0，剩下的才是「被逼着留下来」的。",
          "pts": [
            "λ 越大，留下的基因越少。λ = 0 就是普通回归。每个系数的解是「软阈值」：小于 λ 的直接归零。",
            "LASSO 在一组高度相关的基因里只会随机留一个。所以结果不稳定，要报「被选中频率」（bootstrapped LASSO）。",
            "别先从差异基因里挑 top10 再做模型——那是人为选择偏倚，不是 LASSO。"
          ],
          "code": "soft <- function(z, l) sign(z) * max(abs(z) - l, 0)   # 软阈值\nfor (l in c(0, 0.5, 1, 2)) {\n  cat(sprintf(\"λ=%.1f -> 系数 %.2f %.2f %.2f\\n\",\n              l, soft(3, l), soft(0.8, l), soft(-1.5, l)))\n}",
          "real": {
            "pkg": "glmnet",
            "code": "set.seed(1)\ncv <- cv.glmnet(x = t(expr_train), y = Surv(time, status),\n                family = \"cox\", nfolds = 10)\nplot(cv)\ncoef(cv, s = \"lambda.min\")     # 或 \"lambda.1se\"，更简的模型"
          }
        },
        {
          "t": "9.2 λ 怎么选：lambda.min 还是 lambda.1se",
          "why": "λ 不能拍脑袋。交叉验证会给你一条误差曲线，lambda.min 是误差最小的点，lambda.1se 是「误差在最小值一个标准误内、模型最简单的点」。",
          "pts": [
            "lambda.min 拟合最好但基因多、容易过拟合；lambda.1se 基因少、更稳。临床模型一般报 1se。",
            "交叉验证必须在**训练集内部**做，绝不能包括验证集。否则 λ 是偷看答案选出来的。",
            "报告里要写：随机种子、fold 数、选了哪个 λ、最终几个基因。少一项都复现不了。"
          ],
          "code": "set.seed(11)\nlam <- 10^seq(-4, 1, length = 12)\nerr <- 0.6 + 0.3 * exp(-lam * 3) + 0.05 * lam + rnorm(12, 0, 0.01)\nres <- data.frame(lambda = round(lam, 4), cv_err = round(err, 4))\nres\n\nres$lambda[which.min(res$cv_err)]                            # lambda.min\nres$lambda[which(res$cv_err <= min(res$cv_err) + 0.01)][1]   # 更简的模型"
        },
        {
          "t": "9.3 风险评分与数据泄漏",
          "why": "风险评分 = Σ(系数 × 表达)。所有步骤——标准化、选基因、定系数、定切点——都必须在训练集里学出来，再原封不动套到验证集。",
          "pts": [
            "最常见的泄漏：用全部样本做 scale 再拆分；用全部样本做差异分析再拆分；用验证集反复调阈值。",
            "验证集只做一次预测，不参与任何参数选择。「调了二十次报最好的一次」就是过拟合。",
            "结果要报：训练/验证各自的高危 vs 低危 HR、95%CI、log-rank p，加上 1/3/5 年时间依赖 AUC。缺一不可。"
          ],
          "code": "coef <- c(TP53 = 0.31, MYC = 0.22, CTNNB1 = -0.18)\nexpr <- matrix(c(9, 8, 7,\n                 10, 6, 8,\n                 7, 9, 5), ncol = 3, byrow = TRUE,\n               dimnames = list(paste0(\"P\", 1:3), names(coef)))\nexpr\n\nrisk <- as.vector(expr %*% coef)      # 风险评分 = 表达 x 系数\nnames(risk) <- rownames(expr)\nround(risk, 3)\nifelse(risk > median(risk), \"high\", \"low\")   # 常用切点：中位数"
        }
      ]
    },
    {
      "id": "k10",
      "title": "第 10 讲　文章复现：把上面九讲串成一篇",
      "plain": "前面九讲都是零件，这一讲把它们拼成一篇论文的骨架。看完你会知道自己现在做到第几步、下一幅图该画什么、哪些数字必须对得上。",
      "goal": "知道一篇生信文章的骨架长什么样，复现时按什么顺序对数字。",
      "watch": [
        {
          "n": "Biomamba《手把手教你做单细胞转录组分析》",
          "u": "https://www.bilibili.com/video/BV1S44y1b76Z"
        }
      ],
      "rec": {
        "u": "https://4007218689.share.123pan.cn/123pan/2rzowh-GFk6d",
        "files": [
          "Class10-1.mp4",
          "Class10-2.mp4",
          "Class10-3.mp4"
        ]
      },
      "refs": [
        {
          "n": "cBioPortal",
          "u": "https://www.cbioportal.org/",
          "d": "突变、拷贝数、生存一起查",
          "t": "doc"
        },
        {
          "n": "TIDE（免疫治疗反应预测）",
          "u": "http://tide.dfci.harvard.edu/",
          "d": "高低风险组的免疫反应差异，补 9.3 没讲的下游",
          "t": "tool"
        },
        {
          "n": "GEPIA2（在线表达/生存）",
          "u": "http://gepia2.cancer-pku.cn/",
          "d": "不写代码验证单基因表达与生存",
          "t": "tool"
        },
        {
          "n": "ICGC Data Portal（独立验证队列）",
          "u": "https://dcc.icgc.org/",
          "d": "跨数据集验证模型用，独立于 TCGA",
          "t": "doc"
        },
        {
          "n": "LASSO→外部验证→timeROC 完整范例",
          "u": "http://cytoskeletonres.com/posts/building-a-robust-prognostic-model-integrating-lasso-regression-and-random-forest-with-cytoskeletal-genes",
          "d": "从特征选择到时间依赖 AUC 的端到端范例",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "10.1 九成生信文章是同一套骨架",
          "why": "差异 → 富集 → 分型/免疫 → 预后模型 → 外部验证（可选加细胞实验）。看懂骨架，就知道自己现在做到第几步、下一步该干什么。",
          "pts": [
            "Figure 1 通常是「数据来源 + 差异分析」；Figure 2-3 富集和通路；Figure 4 免疫或分型；Figure 5 预后模型；Figure 6 外部验证或细胞实验。",
            "每张图的卖点必须出现在标题里。图注要能独立读懂——不看正文也知道这张图在说什么。",
            "方法段要能让人照着做：包名 + 版本 + 参数 + 阈值。缺一项就算不合格。"
          ],
          "code": "outline <- data.frame(\n  fig = paste0(\"Fig\", 1:6),\n  job = c(\"数据与差异分析\",\"富集与通路\",\"免疫浸润与分型\",\n          \"预后模型构建\",\"外部验证\",\"细胞/动物验证\"),\n  need = c(\"counts + 分组\",\"差异基因\",\"表达矩阵\",\"生存数据\",\"独立队列\",\"实验\"))\noutline"
        },
        {
          "t": "10.2 没有外部验证的模型，等于没做",
          "why": "训练集 AUC 0.9 一点意义都没有——那是模型把自己的训练数据记住了。能说明问题的是：这套系数拿到另一个数据集、另一家医院，还灵不灵。",
          "pts": [
            "外部验证必须是独立样本（不同数据集或不同中心），不能是同一批数据换个随机种子。",
            "验证要验三件事：风险分层还分得开吗（log-rank）、AUC 还在 0.6 以上吗、系数方向一致吗。",
            "临床意义比统计显著重要。高危组 5 年生存 30% vs 60% 才有用；差 0.1% 的「显著」没有意义。"
          ],
          "code": "train_auc <- 0.86; valid_auc <- 0.64\ngap <- train_auc - valid_auc\ncat(sprintf(\"训练集 AUC %.2f，验证集 AUC %.2f，掉了 %.2f\\n\", train_auc, valid_auc, gap))\nif (gap > 0.15) cat(\"-> 典型过拟合，先减变量数再重做\\n\")\n\nc_train <- c(TP53 = 0.31, MYC = 0.22, CTNNB1 = -0.18)\nc_valid <- c(TP53 = 0.28, MYC = 0.05, CTNNB1 = -0.11)\nsign(c_train) == sign(c_valid)          # 方向必须一致"
        },
        {
          "t": "10.3 复现清单：按这个顺序对数字",
          "why": "复现不是「跑通就算」，是「每一个数字都能对上原文输出的那一行」。顺序反了会浪费大量时间在画图上。",
          "pts": [
            "顺序：先 Table 1（样本数和基线），再差异基因数，再富集通路数，最后才碰图。",
            "原文没写参数时，用他报告的数字（基因数、p 值）做反向约束，一点点逼参数。",
            "复现失败最常见三个原因：数据版本不同、注释包版本不同、阈值没写清楚。"
          ],
          "code": "ck <- data.frame(\n  step  = c(\"Table1 样本数\",\"差异基因数\",\"富集通路数\",\"模型基因数\",\"外部验证 AUC\"),\n  paper = c(365, 1247, 38, 9, 0.71),\n  mine  = c(365, 1180, 41, 9, 0.68))\nck$ok <- ck$paper == ck$mine\nck\ncat(sprintf(\"对上的 %d / %d 项\\n\", sum(ck$ok), nrow(ck)))"
        }
      ]
    },
    {
      "id": "gsva",
      "title": "专题 · 通路评分进阶：GSVA / ssGSEA 给每个样本打「通路活性」",
      "plain": "前几讲你算的是「基因层面的差异」（哪条基因在两组间变了）。但课题真正关心的是「哪条通路、哪个生物学过程在肝细胞里整体被激活还是抑制」——这要用样本级打分。GSVA、ssGSEA 把每个样本变成「一条通路一个分数」，下游就能做差异通路、热图、和表型相关。RILD 肝细胞分区、损伤-再生轨迹，本质就是比较不同群的通路活性，这正是「治疗图谱」里分区图谱的量化底座。本章接 k3（富集）的方法，但把视角从「基因集是否过代表」换成「样本层面的活性强度」。",
      "goal": [
        "说清 GSVA/ssGSEA 与 ORA/GSEA 的本质区别：前者给样本级连续分数，后者给组间显著性",
        "能跑通 GSVA 得到 通路×样本 矩阵，并做差异通路与热图",
        "能把通路评分接到 RILD 肝细胞亚群，比较分区/损伤-再生通路的活性差异"
      ],
      "refs": [
        {
          "n": "GSVA（Bioconductor 官方）",
          "u": "https://bioconductor.org/packages/release/bioc/html/GSVA.html",
          "d": "gsva() 主函数与参数说明",
          "t": "doc"
        },
        {
          "n": "msigdb 基因集",
          "u": "https://www.gsea-msigdb.org/gsea/msigdb/",
          "d": "Hallmark/KEGG/GO 基因集下载，注意 species 与 ID 类型",
          "t": "data"
        },
        {
          "n": "Hänzelmann et al. 2013（GSVA 原文）",
          "u": "https://doi.org/10.1186/1471-2105-14-7",
          "d": "方法学出处",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "1 · GSVA / ssGSEA 在算什么：从基因集到样本分数",
          "why": "ORA/GSEA 给你一个「这个基因集是否显著」的 p 值；GSVA/ssGSEA 给每个样本一个连续分数，表示「这个样本里该通路的活性是高还是低」。前者是组间比较，后者是样本级画像——后者才能拿去做热图、聚类和与临床变量相关。",
          "pts": [
            "GSVA 用核密度估计把表达秩转成分数；ssGSEA 是单样本 GSEA，不打比例只打整体偏高偏低（和 k4 里说的一致）",
            "基因集用 msigdb 的 c2/c5（Hallmark/KEGG/GO），注意 species 和 ID 类型对齐",
            "k3 的 ORA 看「显著基因是否富集」，本章看「样本活性」，二者互补不替代"
          ],
          "code": "# 原理（base R）：把一个样本的表达向量对某个基因集算一个秩统计量\nexpr <- c(2.1, 5.3, 0.8, 4.4, 1.2)          # 某样本 5 个基因的表达\ngene_set <- c(TRUE, TRUE, FALSE, TRUE, FALSE) # 某通路包含其中 3 个\n# 把整个样本的表达排秩，基因集内外的秩和差异就是「活性」的雏形\nranked <- rank(expr); sum(ranked[gene_set]) - sum(ranked[!gene_set])\n\n# 真实写法（gsva 包）：一份表达矩阵 + 一份基因集列表\nlibrary(GSVA); library(GSEABase)\n# gset <- getGmt(\"h.all.v7.2.symbols.gmt\")  # Hallmark 基因集\n# mat 行=基因 列=样本；并行、kcdf=\"Gaussian\" 用于芯片/RNA-seq 计数\n# gsva_mat <- gsva(as.matrix(mat), gset, kcdf=\"Gaussian\", parallel.sz=2)\n# 行=通路 列=样本，每个值就是该样本该通路的活性分数"
        },
        {
          "t": "2 · 从打分矩阵到差异通路与热图",
          "why": "gsva 跑完得到 matrix：行=通路，列=样本。接下来就是你熟悉的差异分析套路：找哪些通路在两组间分数不同，画热图看样本聚类。",
          "pts": [
            "对 gsva_mat 按分组做 t 检验 / limma，找差异通路（和 k2 的差异分析同一套逻辑）",
            "pheatmap 画 通路×样本 热图，行是通路、列是样本，能直接看出样本分型",
            "通路分数可替代基因表达拿去做 k9 的 LASSO 模型（输入维度从万级基因降到百级通路）"
          ],
          "code": "# 原理（base R）：两组样本在某条通路的分数，算均值差与 t 统计量\ng1 <- c(0.4, 0.6, 0.5); g2 <- c(-0.3, -0.5, -0.4)\nmean(g1) - mean(g2); (mean(g1)-mean(g2))/sqrt(var(g1)/3 + var(g2)/3)\n\n# 真实写法：limma 找差异通路 + pheatmap 出图\nlibrary(limma); library(pheatmap)\n# design <- model.matrix(~ group)            # group: 损伤 vs 再生\n# fit <- lmFit(gsva_mat, design); fit <- eBayes(fit)\n# top <- topTable(fit, coef=2, number=20)    # 差异通路\n# pheatmap(gsva_mat[rownames(top), ], scale=\"row\", show_rownames=TRUE)"
        },
        {
          "t": "3 · 接到 RILD：肝细胞分区 / 损伤-再生通路活性比较",
          "why": "把上面套到课题：用已解析的 RILD 肝细胞亚群（pericentral / periportal / 损伤区）做 GSVA，比较哪条代谢/增殖/应激通路在哪些区高。这就是「治疗图谱」从分区图谱走到治疗图谱的量化底座。",
          "pts": [
            "输入可以是 Seurat 对象的表达矩阵（sc 讲过的），也可以是 bulk 分区的平均表达",
            "比较「损伤区 vs 再生区」的 Hallmark 通路分数：比如 E2F_TARGETS、MTORC1、OXIDATIVE_PHOSPHORYLATION",
            "分数差异要和 k7 的 hub 基因、k5 的预后信号交叉看，避免单方法下结论"
          ],
          "code": "# 真实写法：在亚群注释后的表达矩阵上跑 GSVA 并比较\n# sub_mat  行=基因 列=细胞；cell_type 向量标记每个细胞属于哪个分区\n# gsva_sub <- gsva(as.matrix(sub_mat), gset, kcdf=\"Gaussian\")\n# 按 cell_type 聚合到「分区均值」，得到 通路×分区 矩阵\n# tapply 或 aggregate 按 cell_type 求均值 -> agg_mat\n# 画 分区×通路 热图，一眼看出哪条通路在损伤区被激活\n# pheatmap(agg_mat, scale=\"column\")"
        }
      ]
    },
    {
      "id": "sc",
      "title": "专题 · 单细胞 Seurat 实操：从 count 矩阵到细胞通讯",
      "plain": "课题组做的是 RILD 肝细胞单细胞，这一讲专门带你用 R（Seurat）把一张 10x 矩阵跑成带注释的细胞分群，再顺手跑一遍细胞通讯（CellChat）。不依赖本课题数据，用 Seurat 自带的 pbmc3k 当练习对象，跑通了你再换成自己的数据。",
      "goal": [
        "能独立用 Read10X / CreateSeuratObject 把 10x 输出读成 Seurat 对象",
        "能解释 QC 三个指标（nFeature / nCount / percent.mt）各自在卡什么并定阈值",
        "能跑通 归一化 → 高变基因 → PCA → UMAP → 聚类 的标准链路",
        "会用 marker 基因 + SingleR 给 cluster 注释，而不是瞎猜",
        "能跑通 CellChat 细胞通讯并看懂一张通讯网络图"
      ],
      "watch": [
        {
          "n": "Biomamba《手把手教你做单细胞转录组测序数据分析》",
          "u": "https://www.bilibili.com/video/BV1S44y1b76Z"
        },
        {
          "n": "生信幻想家《单细胞数据分析 标准分析流程》",
          "u": "https://www.bilibili.com/video/BV1Ct421j7X3"
        },
        {
          "n": "未名阿《保姆级单细胞代码分析（1）质控·降维·聚类》",
          "u": "https://www.bilibili.com/video/BV1yR4y1q7X4"
        },
        {
          "n": "生信技能树-jimmy《单细胞亚群注释》",
          "u": "https://www.bilibili.com/video/BV1mE421w7Te"
        },
        {
          "n": "生信技能树《细胞通讯 CellChat 系列》",
          "u": "https://www.bilibili.com/video/BV1Ab4y1W7qx"
        },
        {
          "n": "生信基地《Seurat V5 标准流程 + Harmony 多样本实战》",
          "u": "https://www.bilibili.com/video/BV1Yz4216787"
        },
        {
          "n": "生信技能树《拟时序分析 monocle 系列》",
          "u": "https://www.bilibili.com/video/BV1br4y1x7Hf"
        }
      ],
      "refs": [
        {
          "n": "Seurat 官网",
          "u": "https://satijalab.org/seurat/",
          "d": "所有 Seurat 教程入口，版本更新都在这",
          "t": "doc"
        },
        {
          "n": "Seurat PBMC3K 标准流程",
          "u": "https://satijalab.org/seurat/articles/pbmc3k_tutorial",
          "d": "单细胞「Hello World」，必须亲手敲一遍",
          "t": "doc"
        },
        {
          "n": "Seurat 常用命令速查",
          "u": "https://satijalab.org/seurat/articles/essential_commands",
          "d": "对象结构、取子集、改 meta 都在这里",
          "t": "doc"
        },
        {
          "n": "OSCA：单细胞分析 Bioconductor 书",
          "u": "https://bioconductor.org/books/release/OSCA/",
          "d": "最完整的免费单细胞教材",
          "t": "doc"
        },
        {
          "n": "sc-best-practices",
          "u": "https://www.sc-best-practices.org/",
          "d": "专门讲「这一步为什么这么做、什么时候会错」",
          "t": "doc"
        },
        {
          "n": "SingleR（自动注释）",
          "u": "https://bioconductor.org/packages/release/bioc/html/SingleR.html",
          "d": "用参考数据集给 cluster 自动打细胞类型",
          "t": "doc"
        },
        {
          "n": "sctransform 归一化",
          "u": "https://bioconductor.org/packages/release/bioc/html/sctransform.html",
          "d": "建模技术噪声的归一化，替代 log 归一",
          "t": "doc"
        },
        {
          "n": "Harmony 快速上手",
          "u": "https://portals.broadinstitute.org/harmony/articles/quickstart.html",
          "d": "多样本整合去批次最常用",
          "t": "doc"
        },
        {
          "n": "CellChat 官方仓库",
          "u": "https://github.com/jinworks/CellChat",
          "d": "细胞通讯分析，vignette 在 README",
          "t": "doc"
        },
        {
          "n": "CellChat 教程（Nature Protocols）",
          "u": "https://www.nature.com/articles/s41596-021-00534-2",
          "d": "从对象构建到网络可视化的完整流程",
          "t": "doc"
        },
        {
          "n": "DoubletFinder（双细胞检测）",
          "u": "https://github.com/chris-mcginnis-ucsf/DoubletFinder",
          "d": "10x 双细胞剔除，建对象后第一步就做",
          "t": "doc"
        },
        {
          "n": "Monocle3（拟时序）",
          "u": "https://cole-trapnell-lab.github.io/monocle3/",
          "d": "轨迹推断，看细胞状态连续变化",
          "t": "doc"
        },
        {
          "n": "生信技能树 单细胞专栏",
          "u": "https://www.bilibili.com/video/BV1mE421w7Te",
          "d": "jimmy 团队的系列实操视频",
          "t": "video"
        }
      ],
      "subs": [
        {
          "t": "sc.1 读入 10x 数据并建成 Seurat 对象",
          "why": "10x 输出是三个文件（barcodes / features / matrix.mtx.gz）。Read10X 把它们读成稀疏矩阵，CreateSeuratObject 再包成 Seurat 对象——之后所有分析都在这个对象里。",
          "pts": [
            "Seurat 对象是「带抽屉的盒子」：counts 在 @assays$RNA@counts，归一化结果在 @data，降维在 @reductions。先看结构再动手。",
            "如果是从 GEO 下到的表达矩阵（行为基因、列为细胞），也能直接 CreateSeuratObject(mat)，不一定非要是 10x。",
            "min.cells / min.features 是第一次粗筛：一个基因只在 3 个细胞里出现，留着没意义；一个细胞只测到 200 个基因，大概率是空 droplet。"
          ],
          "code": "# 读 10x 标准输出目录（含 barcodes.tsv / features.tsv / matrix.mtx.gz）\nlibrary(Seurat)\npbmc <- Read10X(data.dir = \"pbmc3k/filtered_gene_bc_matrices/hg19/\")\nso <- CreateSeuratObject(counts = pbmc,\n                         project = \"pbmc3k\",\n                         min.cells = 3,\n                         min.features = 200)\n\n# 看一下对象长什么样\nso\nso@assays$RNA@counts[1:5, 1:5]\ndim(so)                      # 基因数 x 细胞数\n\n# 从现成矩阵直接建（GEO 下载的 expr_mat 也可）\n# so2 <- CreateSeuratObject(counts = expr_mat, project = \"myGEO\")"
        },
        {
          "t": "sc.2 质控 QC：三个指标各自卡什么",
          "why": "单细胞最容易被垃圾细胞带偏。QC 就盯三个数：每个细胞测到多少基因（nFeature_RNA）、测到多少 UMI（nCount_RNA）、线粒体基因占比（percent.mt）。",
          "pts": [
            "nFeature_RNA 太低 = 空 droplet 或死细胞；太高 = 双细胞（两个细胞挤一个 barcode）。",
            "percent.mt 高 = 死细胞（线粒体 RNA 漏出来）。肝细胞本身代谢高，阈值可以比免疫细胞的 5-10% 略宽，但要有理由。",
            "阈值没有标准答案，看小提琴图分布、在拐点处切，并写进方法部分。",
            "课题背景：RILD 肝细胞，percent.mt 按文献常用 10-20% 起步，nFeature 按分布切，别照抄别人的数。"
          ],
          "code": "so[[\"percent.mt\"]] <- PercentageFeatureSet(so, pattern = \"^MT-\")\n\n# 小提琴图看分布，再定切点\nVlnPlot(so, features = c(\"nFeature_RNA\", \"nCount_RNA\", \"percent.mt\"), ncol = 3)\n\n# 过滤：线粒体 < 20%，基因数 200-6000（按你的图调）\nso <- subset(so, subset = nFeature_RNA > 200 & nFeature_RNA < 6000 & percent.mt < 20)\n\n# 顺手做双细胞检测（10x 必做）\n# library(DoubletFinder)\n# so <- doubletFinder(so, PCs = 1:15, pN = 0.25, pK = 0.09)"
        },
        {
          "t": "sc.3 归一化与挑高变基因",
          "why": "不同细胞测序深度差很多，先归一化把深度抹平；再挑出在细胞间波动最大的那批基因（高变基因），后面的 PCA 只在这些基因上做。",
          "pts": [
            "LogNormalize（默认）：log(1 + 总数归一化后的表达)。简单但假设所有细胞同样多噪声。",
            "sctransform：建模每个基因的均值-方差关系，对技术噪声更稳，推荐用。",
            "高变基因不是「差异基因」，只是「在细胞间变化大、值得拿去做降维」的基因，默认 2000 个。"
          ],
          "code": "# 方式一：标准 log 归一化\nso <- NormalizeData(so, normalization.method = \"LogNormalize\", scale.factor = 10000)\nso <- FindVariableFeatures(so, selection.method = \"vst\", nfeatures = 2000)\n\n# 方式二（推荐）：sctransform，一步完成归一化 + 高变\n# so <- SCTransform(so, vars.to.regress = \"percent.mt\")\n\n# 看挑出来的高变基因\ntop <- head(VariableFeatures(so), 20)\nplot1 <- VariableFeaturePlot(so)\nLabelPoints(plot1, points = top, repel = TRUE)"
        },
        {
          "t": "sc.4 降维：PCA -> UMAP",
          "why": "2 万基因没法画。先 ScaleData（中心化、回归掉深度/线粒体影响），再 PCA 压到几十个主成分，最后 UMAP 压到 2 维给你看分群。",
          "pts": [
            "ScaleData 这一步会把深度和线粒体比例「回归掉」，否则降维会被这些技术因素主导。",
            "PCA 用多少 PC？看 ElbowPlot 拐点，一般取 10-30。取少了丢信息，取多了把噪声当信号。",
            "UMAP 是「看」用的，不是「算」用的。聚类和差异仍然在 PCA 空间做。"
          ],
          "code": "so <- ScaleData(so, vars.to.regress = c(\"nCount_RNA\", \"percent.mt\"))\nso <- RunPCA(so, features = VariableFeatures(object = so))\nElbowPlot(so)              # 拐点处决定用前几个 PC\n\nso <- RunUMAP(so, dims = 1:15)\nDimPlot(so, reduction = \"umap\", label = TRUE)\n\n# 顺带存一下 PCA 结果\nso <- RunTSNE(so, dims = 1:15)   # tSNE 备选，UMAP 通常更稳"
        },
        {
          "t": "sc.5 聚类：resolution 决定分几群",
          "why": "聚类不是直接对细胞做，而是先建一个「细胞-细胞相似图」（基于前 N 个 PC），再用图聚类切成 community。resolution 越大，切得越细。",
          "pts": [
            "FindNeighbors 用前 dims 个 PC 建图；FindClusters 切图。",
            "resolution 没有标准值：0.4 粗、0.8 中、1.2 细。先 0.8，看分群是否有生物学意义再调。",
            "cluster 数不是越多越好。一个 cluster 里混着两种细胞类型，比多切几个空 cluster 更糟。"
          ],
          "code": "so <- FindNeighbors(so, dims = 1:15)\nso <- FindClusters(so, resolution = 0.8)\n\n# 看每个 cluster 多少细胞\ntable(so$seurat_clusters)\n\n# 调 resolution 重跑，对比分群\n# so <- FindClusters(so, resolution = 0.4)\n# DimPlot(so, reduction = \"umap\", label = TRUE)"
        },
        {
          "t": "sc.6 注释：marker 基因 + SingleR，别瞎猜",
          "why": "聚类只给你 0/1/2/3 编号，不知道是什么细胞。用每个 cluster 高表达的基因（marker）判断身份；嫌手累就用 SingleR 自动注释，再人工核对。",
          "pts": [
            "FindAllMarkers 对每个 cluster 做差异（默认 Wilcoxon），挑 logFC 大、padj 小的基因当 marker。",
            "肝细胞 Markers（贴合 RILD 课题）：Alb / Hnf4a 肝细胞，Krt19 胆管上皮，Pecam1/CD31 内皮，Cd68/Adgre1 巨噬，Col1a1 成纤维，Epcam 上皮。",
            "SingleR 用参考数据集（如 Human Primary Cell Atlas）自动打类型，快但可能粗，关键 cluster 一定手查 marker 复核。",
            "注释用新列存：so$celltype <- ...，别覆盖 seurat_clusters。"
          ],
          "code": "markers <- FindAllMarkers(so, only.pos = TRUE, min.pct = 0.25, logfc.threshold = 0.25)\n# 看每个 cluster 前 2 个 marker\ntop_mk <- markers %>% group_by(cluster) %>% top_n(2, avg_log2FC)\n\n# 可视化确认\nDotPlot(so, features = c(\"ALB\", \"HNF4A\", \"KRT19\", \"PECAM1\", \"CD68\", \"COL1A1\")) + RotatedAxis()\nFeaturePlot(so, features = c(\"ALB\", \"CD68\"))\n\n# SingleR 自动注释\nlibrary(SingleR)\nref <- celldex::HumanPrimaryCellAtlasData()\npred <- SingleR(test = so@assays$RNA@data, ref = ref, labels = ref$label.main)\nso$celltype_pred <- pred$pruned.labels\ntable(so$celltype_pred)"
        },
        {
          "t": "sc.7 多样本批次整合（Harmony）",
          "why": "如果数据来自多个样本/批次，不整合的话 UMAP 会先按「哪个样本」分团，而不是按「什么细胞」分团。Harmony 把批次效应压掉、保留生物学差异。",
          "pts": [
            "先做标准降维到 PCA，再 RunHarmony 在 PCA 上纠正批次，后面聚类/UMAP 用 harmony 降维。",
            "不是所有数据都要整合：单样本或批次影响很小时，强行整合会抹掉真实差异。先看不整合的图再决定。",
            "Seurat v4 也有 IntegrateData 流程，但 Harmony 更快、对大矩阵更友好。"
          ],
          "code": "library(harmony)\nso <- RunPCA(so, features = VariableFeatures(object = so))\nso <- RunHarmony(so, group.by.vars = \"orig.ident\", dims.use = 1:15)\nso <- RunUMAP(so, reduction = \"harmony\", dims = 1:15)\nso <- FindNeighbors(so, reduction = \"harmony\", dims = 1:15)\nso <- FindClusters(so, resolution = 0.8)\nDimPlot(so, reduction = \"umap\", label = TRUE) + NoLegend()"
        },
        {
          "t": "sc.8 细胞通讯 CellChat：谁在跟谁说话",
          "why": "分完群只是第一步。CellChat 用配体-受体数据库算：哪两个 cell type 之间在大量「发信号」，信号网络里谁是 hub。这直接对应课题「损伤-再生机制」里细胞间的对话。",
          "pts": [
            "输入是表达矩阵 + 每个细胞的 cell type 注释（so$celltype）。",
            "computeCommunProb 算通讯概率，filterCommunication 去掉弱信号，aggregateNet 汇总成网络。",
            "netVisual 出网络图，netAnalysis_signalingRole 找发送/接收 hub。",
            "配体-受体库默认 human，鼠数据要用 CellChatDB.mouse。课题是鼠 RILD 数据，记得换库。"
          ],
          "code": "library(CellChat)\ncellchat <- createCellChat(object = so@assays$RNA@data,\n                           meta = so@meta.data,\n                           group.by = \"celltype\")\ncellchat <- setIdent(cellchat, ident.use = \"celltype\")\ncellchat <- subsetData(cellchat)\n\n# 用鼠数据库（课题是鼠 RILD）；人是 CellChatDB.human\ncellchat@DB <- CellChatDB.mouse\ncellchat <- subsetDB(cellchat, high.thr = 0.1)\n\ncellchat <- computeCommunProb(cellchat, type = \"triMean\")\ncellchat <- filterCommunication(cellchat, min.cells = 10)\ncellchat <- aggregateNet(cellchat)\n\n# 看整体网络和 hub\nnetVisual(cellchat, layout = \"circle\")\nnetAnalysis_signalingRole(cellchat, pattern = \"outgoing\")\nnetAnalysis_signalingRole_network(cellchat, signaling = \"TGFb\", width = 8)"
        },
        {
          "t": "sc.9 可视化导出：把分群结果交给下游",
          "why": "分完群要出图、要存档，还要把 cluster 级别的矩阵导出给下游分析（GSVA、WGCNA、差异），形成「单细胞 → 通路 → 网络」的闭环。",
          "pts": [
            "DimPlot / VlnPlot / FeaturePlot / DoHeatmap 是四类常用出图，pdf 保存最稳。",
            "导出的 cluster 平均表达矩阵，可以直接喂给课题现有的 GSVA / WGCNA 脚本，不必重造轮子。",
            "所有阈值、参数、Seurat 版本都记进方法部分——单细胞可重复性的命门就在这。"
          ],
          "code": "pdf(\"sc_figs.pdf\", width = 10)\nDimPlot(so, reduction = \"umap\", label = TRUE)\nVlnPlot(so, features = c(\"ALB\", \"CD68\"), ncol = 2)\nFeaturePlot(so, features = c(\"HNF4A\", \"KRT19\"))\nDoHeatmap(so, features = top_mk$gene[1:30]) + NoLegend()\ndev.off()\n\n# 导出 cluster 平均表达矩阵，喂给下游 GSVA / WGCNA\navg <- AverageExpression(so, assays = \"RNA\", slot = \"data\")$RNA\nwrite.csv(avg, \"cluster_avg_expr.csv\")\n\n# 导出带注释的 metadata\nwrite.csv(so@meta.data, \"cell_annotations.csv\")"
        }
      ]
    },
    {
      "id": "mr",
      "title": "专题 · 孟德尔随机化（MR）：用遗传变异做「天然随机对照」",
      "plain": "一句话讲清 MR 逻辑——把 SNP 当工具变量，把「暴露→结局」的因果推断变成「基因→暴露→结局」的连锁推理，绕开混杂和反向因果。课题里可用来验证「某通路/基因 → RILD 风险」到底是因果还是相关。这是「观察数据里挖因果」最常用的方法之一，和 k2 差异分析、k5 预后模型是互补关系：那些是看关联，MR 是看因果方向。",
      "goal": [
        "能用自己的话讲清 MR 三类核心假设（工具变量相关性、独立性、排他性）",
        "能装 TwoSampleMR 并从 IEU OpenGWAS 直接拉暴露/结局的 GWAS 摘要数据",
        "能跑通 IVW 主分析，并配 Egger / 加权中位数做交叉验证",
        "能读懂 MR 散点图、漏斗图、留一图，并据此判断结果可不可信",
        "能指出 MR 的坑：弱工具变量、人群分层、一暴露多结局带来的假阳性"
      ],
      "watch": [
        {
          "n": "孟德尔随机化 入门到实战（BV1pn52zxECu）",
          "u": "https://www.bilibili.com/video/BV1pn52zxECu"
        },
        {
          "n": "TwoSampleMR 跑通全流程（BV1SM411L7Xu）",
          "u": "https://www.bilibili.com/video/BV1SM411L7Xu"
        },
        {
          "n": "MR 敏感性分析与作图（BV1ED421L7jQ）",
          "u": "https://www.bilibili.com/video/BV1ED421L7jQ"
        },
        {
          "n": "孟德尔随机化 选题与发文套路（BV1MmpMeWEzW）",
          "u": "https://www.bilibili.com/video/BV1MmpMeWEzW"
        },
        {
          "n": "MR 常见误区与审稿人问题（BV1EM4y1f7F6）",
          "u": "https://www.bilibili.com/video/BV1EM4y1f7F6"
        }
      ],
      "refs": [
        {
          "n": "TwoSampleMR（官方包）",
          "u": "https://mrcieu.github.io/TwoSampleMR/",
          "d": "拉 IEU OpenGWAS 数据 + 跑 IVW/Egger 的核心包，必装",
          "t": "doc"
        },
        {
          "n": "IEU OpenGWAS（数据门户）",
          "u": "https://gwas.mrcieu.ac.uk/",
          "d": "几千个现成 GWAS 摘要，直接按 ID 拉，不用自己下原始数据",
          "t": "tool"
        },
        {
          "n": "MR-Base / MRInstruments",
          "u": "https://mrcieu.github.io/MRInstruments/",
          "d": "已整理好的暴露/结局仪器变量库",
          "t": "doc"
        },
        {
          "n": "STROBE-MR（报告规范）",
          "u": "https://www.strobe-mr.org/",
          "d": "MR 文章怎么写方法、怎么报结果，照着填",
          "t": "doc"
        },
        {
          "n": "FUMA（功能注释）",
          "u": "https://fuma.ctglab.nl/",
          "d": "把显著 SNP 注释到基因/通路，出图漂亮",
          "t": "tool"
        },
        {
          "n": "Radial MR（稳健方法）",
          "u": "https://mrcieu.github.io/RadialMR/",
          "d": "对离群 SNP 更稳的 IVW 变体",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "mr.1 原理：为什么 SNP 能当「天然随机对照」",
          "why": "随机对照试验（RCT）贵且慢，很多暴露根本不能随机给人上。MR 借用一个事实：你从父母那随机分到哪个 allele，相当于被「随机分组」了，且不受后天混杂影响。",
          "pts": [
            "三个假设：① 相关性——SNP 与暴露强相关（F 统计量 > 10 才算强工具）；② 独立性——SNP 与混杂无关；③ 排他性——SNP 只经暴露影响结局，不走别的路。",
            "因果效应 ≈ (SNP→结局的效应) ÷ (SNP→暴露的效应)，这就是 Wald 比值。",
            "MR 解决的是「反向因果」：到底是 A 导致 B，还是 B 导致 A？用基因当起点，因果方向就定了。"
          ],
          "code": "# 假想数据：SNP 对暴露效应 beta_x，对结局效应 beta_y\nbeta_x <- 0.30; se_x <- 0.04\nbeta_y <- 0.12; se_y <- 0.05\n\n# Wald 比值估计因果效应（暴露每变动 1 单位，结局变多少）\nmr_effect <- beta_y / beta_x\nmr_effect\n\n# 强工具检验：F = (beta_x / se_x)^2，> 10 才算强\nF_stat <- (beta_x / se_x)^2\nF_stat   # 几万，远强于阈值"
        },
        {
          "t": "mr.2 实战：从 OpenGWAS 拉数据跑 IVW",
          "why": "TwoSampleMR 把最麻烦的「找工具变量 + 数据对齐」都封装好了。你只要给暴露和结局的 GWAS ID，它自动 harmonize（对齐效应等位基因）。",
          "pts": [
            "暴露和结局必须来自「不同样本」的两项 GWAS（two-sample），否则会低估误差。",
            "harmonise_data 会自动剔除回文 SNP、对齐链方向——这步不做，结果全是错的。",
            "主分析用 mr_ivw（逆方差加权），再配 mr_egger_regression 和 mr_weighted_median 交叉验证方向是否一致。"
          ],
          "code": "library(TwoSampleMR)\n\n# 拉暴露（示例：BMI，ukb-b-19953）的工具变量\nexposure <- extract_instruments(outcomes = \"ukb-b-19953\", p1 = 5e-8)\n\n# 拉结局（示例：冠心病，ieu-a-7）在这些 SNP 上的效应\noutcome <- extract_outcome_data(snps = exposure$SNP, outcomes = \"ieu-a-7\")\n\n# 对齐效应等位基因（最关键的一步）\ndat <- harmonise_data(exposure, outcome)\n\n# 跑多种方法\nres <- mr(dat, method_list = c(\"mr_ivw\", \"mr_egger_regression\", \"mr_weighted_median\"))\nres"
        },
        {
          "t": "mr.3 敏感性分析：结果到底信不信得过",
          "why": "MR 最容易翻车在「水平多效性」——某个 SNP 除了经暴露，还走别的路影响结局。这一步就是用几张图把这种风险暴露出来。",
          "pts": [
            "异质性 Cochran Q：SNP 间效应差异太大（p<0.05）说明工具变量不齐，IVW 不可靠。",
            "MR-Egger 截距：显著 ≠ 0 提示存在水平多效性，Egger 能部分纠正。",
            "留一图（leave-one-out）：逐个剔除 SNP 重算，若去掉某一个结果就塌了，说明结论只靠那一个 SNP，不稳健。",
            "多重检验：一个暴露去撞几百个结局，必然有假阳性——要 FDR 校正，别报 raw p。"
          ],
          "code": "# 异质性 + 多效性 + 留一\nhet  <- mr_heterogeneity(dat)\npleio <- mr_pleiotropy_test(dat)\nloo  <- mr_leaveoneout(dat)\n\nhet; pleio; loo\n\n# 出图：散点（看方向）、漏斗（看对称）、留一（看稳健）\nmr_scatter_plot(res, dat)\nmr_funnel_plot(res)\nmr_leaveoneout_plot(loo)"
        }
      ]
    },
    {
      "id": "multiom",
      "title": "专题 · 多组学整合：把转录组、表观、蛋白组拼成一张图",
      "plain": "单一组学只看一个层面：转录组看「哪些基因在表达」，甲基化看「开关怎么被拨」，蛋白组看「最终干了多少活」。整合分析把多个矩阵联合降维，找跨组学的共同驱动因子。课题里可把 scRNA + 空间 + 临床表型一起整合，挖出 RILD 的分型轴，而不是各看各的。",
      "goal": [
        "能解释「横向整合（同样本多组学）」和「纵向整合（不同层面对应）」的区别",
        "能用 mixOmics 的 DIABLO 做多组学联合分类/预测",
        "能用 MOFA2 把多模态数据压成少数隐因子，并解释每个因子代表什么",
        "能读懂相关性圆图、碎石图、样本散点图",
        "能判断多组学整合何时真有生物学意义、何时只是炫技凑图"
      ],
      "watch": [
        {
          "n": "mixOmics 官方 DIABLO 教程（视频+代码）",
          "u": "https://mixomics.org/mixdiablo/"
        },
        {
          "n": "MOFA2 官方 workshop（多组学因子分析）",
          "u": "https://raw.githack.com/bioFAM/MOFA2/master/doc/MOFA_example.html"
        },
        {
          "n": "10x Multiome（同一细胞同时测 ATAC+RNA）产品页",
          "u": "https://www.10xgenomics.com/products/single-cell-multiome"
        }
      ],
      "refs": [
        {
          "n": "mixOmics（DIABLO/sPLS-DA）",
          "u": "https://mixomics.org/",
          "d": "多组学联合降维与分类最常用 R 包，教程极全",
          "t": "doc"
        },
        {
          "n": "MOFA2（多组学因子分析）",
          "u": "https://github.com/bioFAM/MOFA2",
          "d": "把任意多模态数据压成少数隐因子，适合找共同驱动",
          "t": "doc"
        },
        {
          "n": "MultiAssayExperiment（数据结构）",
          "u": "https://bioconductor.org/packages/release/bioc/html/MultiAssayExperiment.html",
          "d": "多组学数据的标准容器，MOFA/很多包都吃它",
          "t": "doc"
        },
        {
          "n": "10x Multiome 分析流程",
          "u": "https://www.10xgenomics.com/resources/analysis-guides/multiome",
          "d": "同一细胞同时测 RNA+ATAC 的官方流程",
          "t": "doc"
        },
        {
          "n": "iCluster（肿瘤多组学分型）",
          "u": "https://www.bioconductor.org/packages/release/bioc/html/iClusterPlus.html",
          "d": "经典的多组学联合聚类方法",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "multiom.1 概念：整合到底在整合什么",
          "why": "多组学不是把几张图摆一起。整合的前提是你想回答「哪些因子同时驱动了多个层面的变化」——比如一组基因高表达、同时启动子去甲基化、同时蛋白升高，才叫一个协调事件。",
          "pts": [
            "横向整合：同一批样本测了 mRNA + methyl + miRNA，找它们之间的协同关系。",
            "纵向整合：不同层面但对应于同一生物学过程（如 scRNA 和空间），把注释对齐。",
            "降维是核心：每个组学矩阵都高维，先压成少数「组分/因子」，再看这些组分怎么跨组学耦合。"
          ],
          "code": "# 用 base R 直观看「两个矩阵是否共享信号」\n# 假设 X(基因表达) 和 Y(甲基化) 都按样本对齐\ncor_shared <- cor(X[, 1:5], Y[, 1:5], method = \"spearman\")\nround(cor_shared, 2)\n\n# 若某基因表达 与 其启动子甲基化 强负相关 -> 表观调控实锤\n# 多组学整合就是把这个直觉自动扩展到全基因组、多组学"
        },
        {
          "t": "multiom.2 DIABLO：多组学联合分类",
          "why": "DIABLO 是 mixOmics 里专门针对「多组学 + 已知分组」的算法，一边降维一边让不同组学往同一分类方向上对齐。适合做「用多组学预测 RILD 分型」这类任务。",
          "pts": [
            "design 矩阵控制组学之间的「耦合强度」：对角 0，非对角是惩罚权重（0.1 起步，越大越强制对齐）。",
            "keepX 控制每层保留多少特征，要调参：太大过拟合，太小丢信号。",
            "plotIndiv 看样本在联合空间的分布，分组分得开 = 整合有效。"
          ],
          "code": "library(mixOmics)\ndata(breast.TCGA)\n\n# 三个组学矩阵 + 一个分组标签\nX <- list(mRNA  = breast.TCGA$data.train$mrna,\n          meth  = breast.TCGA$data.train$methyl,\n          mirna = breast.TCGA$data.train$mirna)\nY <- breast.TCGA$data.train$subtype\n\ndesign <- matrix(0.1, ncol = 3, nrow = 3); diag(design) <- 0\n\nsgccda.res <- block.splsda(X, Y,\n  ncomp = 2,\n  keepX = list(mRNA = c(50,50), meth = c(30,30), mirna = c(20,20)),\n  design = design)\n\nplotIndiv(sgccda.res, group = Y, legend = TRUE,\n  title = \"多组学联合空间（DIABLO）\")"
        },
        {
          "t": "multiom.3 MOFA：把多模态压成少数隐因子",
          "why": "MOFA 不要求你先有分组标签。它假设所有组学都由少数几个「隐因子」驱动，自动把这些因子解出来。你再去看因子 1 主要被哪些基因/甲基化位点贡献，就能命名这个因子的生物学含义（如「炎症轴」「再生轴」）。",
          "pts": [
            "plot_variance_explained 看前几个因子解释了多少方差——太多因子才解释一点，说明数据噪声大。",
            "每个因子是一组特征的加权组合，权重大的特征就是该因子的「代表」。",
            "因子可以和临床表型（如 RILD 严重度）做相关，挑出与表型挂钩的因子重点挖。"
          ],
          "code": "library(MOFA2)\n\n# mae 是 MultiAssayExperiment（多个 assay 同样本对齐）\n# 训练（model 会存到磁盘）\n# mofa_model <- create_mofa(multiome_data) %>% \n#   prepare_mofa() %>% run_mofa()\n# save_model(mofa_model, \"model.h5\")\n\n# 读回已训练模型后看：\nplot_variance_explained(mofa_model)\n# 因子 1 贡献最大的特征（基因/峰）\ntop <- get_weights(mofa_model, factor = 1, view = \"mRNA\",\n                   abs = TRUE) %>% head(20)\ntop"
        }
      ]
    },
    {
      "id": "epispatial",
      "title": "专题 · 表观遗传与空间转录组：从调控开关到组织定位",
      "plain": "bulk 和 scRNA 告诉我们「哪些基因在表达」，但看不到两件事：① 基因「开关」是怎么被调控的（甲基化、染色质开放）；② 基因「在哪表达」（组织里的空间位置）。表观（ChAMP/ATAC-seq）补调控，空间转录组（10x Visium / Seurat）补定位。两者补足本课题「分区图谱→治疗图谱」里最缺的调控与定位信息。",
      "goal": [
        "能讲清 DNA 甲基化与基因沉默、ATAC-seq 峰与开放染色质的关系",
        "能用 ChAMP 跑通甲基化 450k/850k 标准流程并挑差异甲基化位点",
        "能用 ATAC-seq 找差异开放区域并注释到近端基因",
        "能用 Seurat 读 10x Visium 做空间降维/聚类/因子分析",
        "能把空间 spot 的注释和 scRNA 细胞类型对齐（锚定整合）"
      ],
      "watch": [
        {
          "n": "ATAC-seq 数据分析实战（BV1C7411C7ez）",
          "u": "https://www.bilibili.com/video/BV1C7411C7ez"
        },
        {
          "n": "表观调控组学联合分析实战（av77098514）",
          "u": "https://www.bilibili.com/video/av77098514"
        },
        {
          "n": "Seurat 空间转录组手册（BV181wezqEgK）",
          "u": "https://www.bilibili.com/video/BV181wezqEgK"
        }
      ],
      "refs": [
        {
          "n": "ChAMP（甲基化分析）",
          "u": "https://www.bioconductor.org/packages/release/bioc/html/ChAMP.html",
          "d": "450k/850k 甲基化阵列一站式流程，含归一化/批次/DMP/DMR",
          "t": "doc"
        },
        {
          "n": "minfi（甲基化底层）",
          "u": "https://bioconductor.org/packages/release/bioc/html/minfi.html",
          "d": "ChAMP 的底层，想自己控流程时看",
          "t": "doc"
        },
        {
          "n": "ATACseqQC（ATAC 质控）",
          "u": "https://bioconductor.org/packages/release/bioc/html/ATACseqQC.html",
          "d": "ATAC 特有的插入片段/核小体周期性质控",
          "t": "doc"
        },
        {
          "n": "Signac（ATAC 单细胞）",
          "u": "https://stuartlab.org/signac/",
          "d": "和 Seurat 同作者，单细胞 ATAC 标准工具",
          "t": "doc"
        },
        {
          "n": "Seurat Spatial（空间转录组）",
          "u": "https://satijalab.org/seurat/articles/spatial_vignette.html",
          "d": "10x Visium 标准流程，读切片图+表达一起",
          "t": "doc"
        },
        {
          "n": "10x Visium 官方文档",
          "u": "https://www.10xgenomics.com/platforms/visium",
          "d": "空转数据格式与实验设计说明",
          "t": "doc"
        },
        {
          "n": "SpatialExperiment / spatialLIBD",
          "u": "https://bioconductor.org/packages/release/bioc/html/SpatialExperiment.html",
          "d": "空转数据的 Bioconductor 标准容器与数据集",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "epi.1 原理：调控开关与空间定位各自看什么",
          "why": "表达量高不代表「这个基因被主动开着」。甲基化把启动子 CpG 岛罩住，基因就沉默；ATAC-seq 测染色质开放程度，开放区才允许转录因子结合。空间转录组则把表达量贴回组织切片坐标，看「这个基因在肝小叶中央带还是汇管区高」。",
          "pts": [
            "DNA 甲基化（尤其启动子 CpG 岛）高 → 转录抑制；去甲基化 → 激活。",
            "ATAC-seq 峰 = 开放染色质 ≈ 转录因子可结合区；峰位置注释到近端基因即候选调控靶点。",
            "空间转录组保留组织坐标，能复现「分区」——本课题「分区图谱」最直接的数据类型。"
          ],
          "code": "# 概念验证：甲基化与表达的反向关系\n# 假设 meth(样本×基因启动子甲基化), expr(同样本×基因表达)\ncor_vec <- numeric(ncol(expr))\nfor (g in 1:ncol(expr))\n  cor_vec[g] <- cor(meth[, g], expr[, g], method = \"spearman\")\n\n# 多数基因启动子甲基化 vs 表达 呈负相关\nmean(cor_vec < 0)   # 比例，预期远高于 0.5"
        },
        {
          "t": "epi.2 甲基化 / ATAC 实战",
          "why": "甲基化阵列（450k/850k）最成熟，ChAMP 一条龙；ATAC-seq 看开放染色质，Signac 接 Seurat 生态。两者都能产出「差异调控特征」，喂给 k5 预后模型或 k7 WGCNA 做上游。",
          "pts": [
            "ChAMP 流程：load → norm(BMIQ/quantile) → 批次校正 → champ.MVP/SVD → champ.DMP 挑差异位点。",
            "甲基化位点(DMP)和区域(DMR)要分开看；DMR 更有生物学意义但计算更重。",
            "ATAC 先 FindMarkers(assay='peaks') 找差异开放峰，再用职位注释把峰映射到基因。"
          ],
          "code": "library(ChAMP)\n# 甲基化 450k 标准流程\nmyLoad <- champ.load(\"~/methy_raw\", arraytype = \"450K\")\nmyNorm <- champ.norm(myLoad, method = \"BMIQ\")\nmyMVP  <- champ.MVP(myNorm, adjPVal = 0.05)\nDMP    <- champ.DMP(myNorm, pheno = myLoad$pd$Sample_Group)\nhead(DMP[order(DMP$P.Value), ])\n\n# ATAC-seq（单细胞）差异开放峰\nlibrary(Signac)\nda <- FindMarkers(atac_obj, ident.1 = \"treat\", ident.2 = \"ctrl\",\n                  assay = \"peaks\", test.use = \"LR\")\nhead(da)"
        },
        {
          "t": "epi.3 空间转录组：把表达贴回组织",
          "why": "10x Visium 每个 spot 既测表达又带组织切片坐标。Seurat 能一边做常规降维聚类，一边画 SpatialPlot 把簇贴回切片，直接看「哪个区是再生、哪个区是损伤」。再和 scRNA 锚定，就能给每个 spot 标上细胞类型组成。",
          "pts": [
            "Load10X_Spatial 同时读表达矩阵和组织图像；SCTransform 做空转专属归一化。",
            "SpatialPlot(vis, label=TRUE) 看簇在组织里的空间分布，是「分区图谱」的直视图。",
            "FindTransferAnchors(reference=sc_obj, query=vis) 把 scRNA 的细胞类型注释迁移到空间 spot，得到「每个位置是什么细胞」。"
          ],
          "code": "library(Seurat)\n# 读 10x Visium（表达 + 切片图）\nvis <- Load10X_Spatial(data.dir = \"visium/\",\n                       filename = \"filtered_feature_bc_matrix.h5\")\nvis <- SCTransform(vis, assay = \"Spatial\")\nvis <- RunPCA(vis) %>% RunUMAP(dims = 1:15)\nvis <- FindNeighbors(vis, dims = 1:15) %>% FindClusters()\n\n# 空间分布图（簇贴回组织）\nSpatialPlot(vis, label = TRUE)\n\n# 把 scRNA 注释迁移到空间 spot\nanchors <- FindTransferAnchors(reference = sc_obj, query = vis,\n  features = VariableFeatures(sc_obj),\n  reference.assay = \"SCT\", query.assay = \"SCT\")\nvis <- AddMetaData(vis, metadata = TransferData(\n  anchors, refdata = sc_obj$celltype))\nSpatialPlot(vis, group.by = \"celltype\")"
        }
      ]
    },
    {
      "id": "dr",
      "title": "专题 · 老药新用：从药物-靶点库到反向找药与虚拟筛选",
      "plain": "课题叫「老药新用筛选」，但前面 10 讲和 bk 全是「表达→通路→细胞」的分析，没有一步是「怎么找到那个老药」。本章补这个核心缺口：先用 DGIdb/DrugBank/TTD 把「靶点→已知药物」列清楚，再用 CMAP/LINCS 反向——拿你关心的基因签名（比如某条损伤-再生通路的差异基因）去海量药物扰动数据库里找「能把这签名逆转」的药，最后用 AutoDock Vina（课题 docking 实验）做蛋白-配体对接打分验证可药性。三步：已知关系 → 反向预测 → 结构验证。",
      "goal": [
        "能用 DGIdb/DrugBank/TTD 把候选靶点对应的已知成药列清楚，并区分作用方向",
        "能用 CMAP/LINCS 拿基因签名反向找到「逆转病理状态」的候选老药",
        "能用 AutoDock Vina 做蛋白-配体对接，理解 affinity 与虚拟筛选的基本流程"
      ],
      "refs": [
        {
          "n": "DGIdb 官网",
          "u": "https://dgidb.org/",
          "d": "疾病-基因-药物交互，可批量查询",
          "t": "tool"
        },
        {
          "n": "LINCS / CLUE",
          "u": "https://clue.io/",
          "d": "海量药物扰动表达谱，反向找药入口",
          "t": "data"
        },
        {
          "n": "AutoDock Vina",
          "u": "https://vina.scripps.edu/",
          "d": "课题 docking 实验同款对接工具",
          "t": "tool"
        }
      ],
      "subs": [
        {
          "t": "1 · 药物-靶点互作库：DGIdb / DrugBank / TTD",
          "why": "老药新用第一步是「这个靶点已经被哪些药打过」。DGIdb 专做疾病-基因-药物交互，DrugBank 是药物字典，TTD 是治疗靶点库。把你的候选靶点（比如从 WGCNA hub 或差异基因来的）丢进去，直接拿到成药清单。",
          "pts": [
            "DGIdb 有 R 包 dgidb；也可以抓 web API 批量查",
            "注意「相互作用类型」：抑制剂/激动剂/调节剂，方向决定老药是该上调还是下调你的靶点",
            "结果要去重：同一个药在不同库名字不同，用 DrugBank ID 归并"
          ],
          "code": "# 真实写法：DGIdb R 包查询候选靶点对应的已知药物\n# install.packages(\"dgidb\"); library(dgidb)\n# queries <- c(\"TP53\",\"CTNNB1\",\"YAP1\")        # 你的候选靶点\n# res <- query_dgidb(genes=queries)           # 返回 基因-药物-相互作用类型\n# drugs <- as.data.frame(res)                 # drug_name / interaction_type\n# table(drugs$interaction_type)               # 抑制剂 vs 激动剂 分布\n\n# 无网络时退路：读本地 TTD/DrugBank 导出 csv\n# ttd <- readr::read_csv(\"TTD_target_drug.csv\"); dplyr::filter(ttd, Target %in% queries)"
        },
        {
          "t": "2 · CMAP / LINCS 反向找药：用基因签名找能逆转的药物",
          "why": "你手上有一条签名（比如损伤组 vs 再生组的上调/下调基因）。CMAP/LINCS 收集了上千种药物处理细胞的表达谱。把你的签名和这些药物签名做相关性，负相关强的药 = 能「逆转」你病理状态的老药候选。",
          "pts": [
            "签名要分 up/down 两列；Connectivity Score 负=逆转，正=协同病理",
            "LINCS 用 978 个 landmark 基因，注意 ID 映射（接 k2 的 ID 转换）",
            "这步和 k9 模型不同：它是「药物扰动数据库查询」不是「预测模型」"
          ],
          "code": "# 真实写法：用 signatureSearch 在 LINCS/CMAP 上做反向找药\n# install.packages(\"signatureSearch\"); library(signatureSearch)\n# sig_up   <- c(\"GENEA\",\"GENEB\",...)           # 损伤中上调\n# sig_down <- c(\"GENEC\",\"GENED\",...)           # 损伤中下调\n# 调用 CMAP 的 GESS（基于排名的连通性打分）\n# res <- cmap(t_up=sig_up, t_down=sig_down, sortby=\"pvalue\")\n# res[1:10,]                                   # 顶部候选药 + connectivity score\n\n# 轻量演示：拿一条签名和一个药物扰动向量算秩相关\ncor(rank(sig_vector), rank(drug_perturbation), method=\"spearman\")  # 负=逆转"
        },
        {
          "t": "3 · 分子对接与虚拟筛选入门（AutoDock Vina）",
          "why": "反向找出的候选药，得验证它真能结合你的靶点蛋白。用 AutoDock Vina（课题实验 9/10 用的就是它）做蛋白-配体对接，affinity 越低结合越好；批量对接就是虚拟筛选。",
          "pts": [
            "需要受体 pdbqt + 配体 pdbqt（小分子要加氢、转 pdbqt）",
            "grid box 要框住结合口袋，框错了分数没意义",
            "Vina 是命令行工具，R/Python 只负责整理输入和读结果"
          ],
          "code": "# 真实写法：在 R 里调用 Vina 并解析对接结果（需本机装 Vina）\nreceptor <- \"target.pdbqt\"; ligand <- \"drug.pdbqt\"; box <- \"config.txt\"\ncmd <- sprintf(\"vina --receptor %s --ligand %s --config %s --out out.pdbqt\",\n               receptor, ligand, box)\n# system(cmd)                                 # 跑对接\n# out <- readLines(\"out.pdbqt\")               # 解析 best mode 的 affinity\n# 多配体虚拟筛选：对 ligands 列表循环 system(vina ...)，收集 affinity 排序取 top"
        }
      ]
    },
    {
      "id": "np",
      "title": "专题 · 网络药理学：成分-靶点-通路一张网",
      "plain": "老药新用常配网络药理学：先把一味药/一个化合物的成分找出来，再预测每个成分打哪些靶点，把靶点做通路富集（接 k3），最后把「成分-靶点-通路」连成网络看核心节点。它和 dr 章互补：dr 是「靶点已知药」，np 是「从成分反推靶点与通路」，适合天然产物/复方。",
      "goal": [
        "能用 SwissTargetPrediction / TCMSP / PharmMapper 把化合物预测到靶点，并做 ID 归并",
        "能用 k3 的 clusterProfiler 对预测靶点做 GO/KEGG/Reactome 富集",
        "能用 igraph 构建并分析 成分-靶点-通路 网络，找出核心节点"
      ],
      "refs": [
        {
          "n": "SwissTargetPrediction",
          "u": "http://www.swisstargetprediction.ch/",
          "d": "按 2D/3D 相似度预测靶点",
          "t": "tool"
        },
        {
          "n": "TCMSP",
          "u": "https://tcmspw.com/",
          "d": "中药成分-靶点-通路一体化库",
          "t": "data"
        },
        {
          "n": "clusterProfiler（接 k3）",
          "u": "https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html",
          "d": "富集分析，已在 k3 讲透",
          "t": "doc"
        }
      ],
      "subs": [
        {
          "t": "1 · 成分-靶点预测：SwissTargetPrediction / TCMSP / PharmMapper",
          "why": "给你一个化合物（比如某中药单体），它打哪些人源靶点？SwissTargetPrediction 按 2D/3D 相似度预测，TCMSP 偏中药成分，PharmMapper 反向对接。输出是靶点列表，要过滤可靠性。",
          "pts": [
            "输入是 SMILES 或化合物名；输出带概率/得分，设阈值过滤",
            "靶点要去重并统一到 SYMBOL/ENTREZ（接 k2 的 ID 转换）",
            "预测靶点≠实验验证靶点，只能当假设"
          ],
          "code": "# 真实写法：读入预测结果并做 ID 归并\n# stp <- readr::read_csv(\"swiss_targets.csv\")   # compound, target, probability\n# stp <- dplyr::filter(stp, probability >= 0.5) # 阈值过滤\n# 用 org.Hs.eg.db 把 target symbol 统一\n# library(org.Hs.eg.db)\n# entrz <- mapIds(org.Hs.eg.db, keys=stp$target, column=\"ENTREZID\", keytype=\"SYMBOL\")\n# stp$entrez <- entrz; unique(stp$target)        # 去重后的候选靶点集"
        },
        {
          "t": "2 · 靶点-通路富集（接 k3）",
          "why": "拿到一批预测靶点，用 k3 的 clusterProfiler 做 GO/KEGG/Reactome 富集，就知道这个药「大概调控哪些通路」。",
          "pts": [
            "背景集用全预测靶点集或全基因组，别用错（k3.2 强调过）",
            "KEGG 看具体通路，GO BP 看生物学过程，Reactome 看反应链",
            "富集结果和 dr 章的反向找药结果交叉，重叠的通路更可信"
          ],
          "code": "# 真实写法：对预测靶点做 KEGG + GO 富集（接 k3）\nlibrary(clusterProfiler); library(org.Hs.eg.db)\n# ego <- enrichGO(gene=stp$entrez, OrgDb=org.Hs.eg.db,\n#                ont=\"BP\", pAdjustMethod=\"fdr\", pvalueCutoff=0.05)\n# ekg <- enrichKEGG(gene=stp$entrez, organism=\"hsa\", pvalueCutoff=0.05)\n# head(ego, 10); head(ekg, 10)"
        },
        {
          "t": "3 · 成分-靶点-通路网络构建与可视化",
          "why": "把「成分→靶点→通路」三元关系连成网络，度高的靶点/成分就是核心节点（和 k7 的 hub 思路一致）。igraph 能算度中心性，Cytoscape 出图。",
          "pts": [
            "网络里「一个成分多靶点、一个靶点多通路」才是网络药理学的价值",
            "核心节点去和 dr 章的已知药靶点交叉验证",
            "igraph 构图后导出 graphml 给 Cytoscape 精细出图"
          ],
          "code": "# 真实写法：igraph 构三边网络 + 度中心性\nlibrary(igraph)\n# edges <- rbind(cbind(compound, target), cbind(target, pathway))  # 三边关系\n# g <- graph.data.frame(edges, directed=FALSE)\n# deg <- degree(g); sort(deg, decreasing=TRUE)[1:10]   # top 核心节点\n# V(g)$type <- bipartite.mapping(g)$type               # 区分成分/靶点/通路\n# write.graph(g, \"network.graphml\", format=\"graphml\")  # 导给 Cytoscape"
        }
      ]
    }
  ]
};
