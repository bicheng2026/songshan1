// 自动生成：_build/gen_myscripts.py（本机 R 代码资产盘点，已去重）
window.SX_MYSCRIPTS = [
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\代码.R",
    kb: 150, lines: 4094,
    title: "课程全量总代码（Class1–10）",
    track: "bulk", trackName: "Bulk RNA-seq",
    packages: ["tidyverse", "TCGAbiolinks", "DESeq2", "clusterProfiler", "WGCNA", "glmnet", "ConsensusClusterPlus", "survival", "survminer", "timeROC", "forestplot", "tableone", "ComplexHeatmap"],
    maturity: "跟练",
    summary: "十节课一气呵成的总代码：TCGA 下载、差异、富集、WGCNA、LASSO/诺模图、一致性聚类、TMB 瀑布图全都有，但每类只出现一次。",
    pitfalls: ["课上跟着敲过 ≠ 会独立用：WGCNA/LASSO/tableone 在本机其它脚本里从未二次出现"]
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\作业代码\\作业1.R",
    kb: 4.8, lines: 115,
    title: "TCGA-LUAD 下载与 counts/tpms 整理",
    track: "bulk", trackName: "Bulk RNA-seq",
    packages: ["tidyverse", "TCGAbiolinks"],
    maturity: "跑通",
    summary: "GDCquery → GDCdownload → GDCprepare → counts/tpm_unstrand → 01A/11A 拆分 → 写 6 个 txt。后续所有 TCGA 脚本的母版。",
    pitfalls: ["TCGA barcode 第 14-15 位是样本类型：01A 是肿瘤、11A 是癌旁，切样本必须靠它"]
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\作业代码\\作业2.R",
    kb: 3.9, lines: 112,
    title: "BTK 在 LUAD 的表达图与 GSEA",
    track: "bulk", trackName: "Bulk RNA-seq",
    packages: ["tidyverse", "DESeq2", "clusterProfiler", "enrichplot", "ggpubr"],
    maturity: "跑通",
    summary: "目标基因 T/N 柱状图 + 高低表达分组 DEG + GSEA，第一次尝试「一个基因撑起一小节」的套路。",
    pitfalls: []
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\作业代码\\作业3.R",
    kb: 6.1, lines: 148,
    title: "ESTIMATE + CIBERSORT + 相关性",
    track: "immune", trackName: "免疫浸润",
    packages: ["estimate", "e1071", "preprocessCore", "corrplot", "ggcorrplot", "ggstatsplot"],
    maturity: "跑通",
    summary: "免疫浸润四件套中的前两件 + 彩虹图 + 22 种细胞分组比较 + 相关性矩阵。",
    pitfalls: ["preprocessCore 在 Windows 上常需从源码编译，是 CIBERSORT 跑不起来最常见的卡点观"]
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\作业代码\\作业4.R",
    kb: 15, lines: 358,
    title: "LUAD 生存分析四件套",
    track: "surv", trackName: "生存分析",
    packages: ["survival", "survminer", "ggpubr", "ggsci"],
    maturity: "跑通",
    summary: "BTK/Immune/Stromal/ESTIMATE 各自中位数分组做 KM 曲线，附带临床信息整理。",
    pitfalls: ["surv_cutpoint 自动取截断是把双刃剑：它挑的是最显著的点，容易把显著性吹高"]
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\作业代码\\作业5.R",
    kb: 7.9, lines: 241,
    title: "按免疫/基质评分分组取交集做富集",
    track: "immune", trackName: "免疫浸润",
    packages: ["DESeq2", "clusterProfiler", "pheatmap", "org.Hs.eg.db"],
    maturity: "跑通",
    summary: "免疫高低组各做一次 DEG，取交集后再 GO/KEGG。取交集是压缩候选基因最朴素的办法。",
    pitfalls: []
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\作业代码\\作业6-1.R",
    kb: 3.8, lines: 83,
    title: "单/多因素 Cox 与森林图",
    track: "surv", trackName: "生存分析",
    packages: ["survival", "forestplot", "tidyverse"],
    maturity: "跑通",
    summary: "生存建模的标准收尾：先单因素筛，再多因素校正，最后森林图呈现 HR。",
    pitfalls: []
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\作业代码\\6-2.R",
    kb: 50, lines: 1328,
    title: "TCGA-COAD 完整毕设套路",
    track: "bulk", trackName: "Bulk RNA-seq",
    packages: ["TCGAbiolinks", "DESeq2", "ConsensusClusterPlus", "GSVA", "tableone", "ComplexHeatmap", "clusterProfiler"],
    maturity: "跑通",
    summary: "本组最完整地雷的实验设计：下载整理→ESTIMATE→m6A 基因表达与相关→临床表→TMB+oncoPrint→一致性聚类→基线表→cluster 间 DEG+GSEA→CIBERSORT/ssGSEA。",
    pitfalls: ["这是本机唯一一份「从下载写到讨论」的闭环脚本，值得反复拆解"]
  },
  {
    path: "E:\\苏州河一号\\生信课程\\SHENGXIN\\TCGA-STAD\\TMB\\基因分高低组画瀑布图.R",
    kb: 2.7, lines: 53,
    title: "CDKN3 高低组的 TOP30 突变瀑布图",
    track: "bulk", trackName: "Bulk RNA-seq",
    packages: ["ComplexHeatmap"],
    maturity: "跑通",
    summary: "oncoPrint + anno_oncoprint_barplot，突变谱可视化模板。",
    pitfalls: []
  },
  {
    path: "E:\\长江一号\\湘江一号\\一号\\一号.R",
    kb: 3.3, lines: 88,
    title: "R 语法第一天",
    track: "rbase", trackName: "R 基础",
    packages: ["tidyverse"],
    maturity: "跑通",
    summary: "赋值、==、setwd、read.table、substr、duplicated、inner_join、tribble。",
    pitfalls: []
  },
  {
    path: "E:\\长江一号\\湘江一号\\二号\\二号.R",
    kb: 18, lines: 344,
    title: "TCGA-STAD 下载到差异分析",
    track: "bulk", trackName: "Bulk RNA-seq",
    packages: ["tidyverse", "TCGAbiolinks", "DESeq2", "pheatmap", "ggpubr"],
    maturity: "跑通",
    summary: "STAD 下载→counts/tpms 提取→T/N DESeq2→热图→火山图。二号是最早自己跑通的完整链路。",
    pitfalls: ["setwd 跳迷宫（TCGA-STAD → .. → T_N_DEG）在后期项目里被 00_config.R 取代，对比着看很直观"]
  },
  {
    path: "E:\\长江一号\\湘江一号\\三号\\三号\\三号.R",
    kb: 30, lines: 564,
    title: "CDKN3 分组 DEG + GO/KEGG/GSEA",
    track: "bulk", trackName: "Bulk RNA-seq",
    packages: ["tidyverse", "DESeq2", "clusterProfiler", "enrichplot", "ggExtra", "ggpubr"],
    maturity: "跑通",
    summary: "T/N 柱状图、配对散点图（自写 ggExtra 美化版）、按 CDKN3 中位数分组 DEG→热图/火山图→富集。",
    pitfalls: ["脚本里有长段注释解释「富集结果为什么按 P 值排而不是按 Count 排」——这是真理解了，不是抄的"]
  },
  {
    path: "E:\\四号\\四号.R",
    kb: 20.6, lines: 469,
    title: "免疫浸润四件套",
    track: "immune", trackName: "免疫浸润",
    packages: ["estimate", "e1071", "GSVA", "xCell", "corrplot", "ggcorrplot", "ggstatsplot"],
    maturity: "跑通",
    summary: "ESTIMATE / CIBERSORT-LM22 / ssGSEA / xCell 全部算出，再按 CDKN3 高低分组出图；附相关性矩阵与 PDCD1/CD274/PDCD1LG2 检查点分析。",
    pitfalls: ["同一段「读数→中位数分组→ggboxplot+wilcox」在四号里原样复制了 5 次 —— 这是抽象成函数的最佳练习题", "四种浸润算法的结论不一致是常态：它们量纲不同、参考集不同，不要只挑好看的那个写进论文"]
  },
  {
    path: "E:\\膀胱癌_独立分析\\00_config.R",
    kb: 8.4, lines: 149,
    title: "GSE267718 唯一设置文件",
    track: "scrna", trackName: "单细胞",
    packages: ["（纯配置）"],
    maturity: "跑通",
    summary: "路径/物种/QC 阈值/降维参数/细胞类型 marker/目标基因/分组/CellChat 参数集中管理。",
    pitfalls: ["配置与逻辑分离这一步做对了：同一个 01_build_object.R 换 config 就能跑第二个数据集"]
  },
  {
    path: "E:\\膀胱癌_独立分析\\01_build_object.R",
    kb: 16, lines: 350,
    title: "Seurat 建对象到 UMAP",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "harmony", "patchwork", "dplyr"],
    maturity: "跑通",
    summary: "10x 读入→QC→merge→NormalizeData→FindVariableFeatures→ScaleData→PCA→RunHarmony→FindNeighbors→FindClusters→UMAP，缓存 rds。",
    pitfalls: ["harmony 去批次必须在 PCA 之后、FindNeighbors 之前插入，位置错了等于没去批次"]
  },
  {
    path: "E:\\膀胱癌_独立分析\\02_gene_celltype.R",
    kb: 10, lines: 212,
    title: "目标基因 × 细胞群定量",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "dplyr", "tidyr", "ggplot2"],
    maturity: "跑通",
    summary: "avg/pct/fold_change 三个维度 + DotPlot/FeaturePlot/VlnPlot/热图四张图。",
    pitfalls: []
  },
  {
    path: "E:\\膀胱癌_独立分析\\03_cellchat.R",
    kb: 11, lines: 260,
    title: "CellChat 分组通讯",
    track: "scrna", trackName: "单细胞",
    packages: ["CellChat", "Seurat", "patchwork"],
    maturity: "跑通",
    summary: "按组织来源与 BCG Pre/Post 分组，mergeCellChat → compareInteractions → rankNet。",
    pitfalls: []
  },
  {
    path: "E:\\膀胱癌_独立分析\\install_cellchat.R",
    kb: 3.8, lines: 82,
    title: "CellChat 离线安装器",
    track: "env", trackName: "环境与工程",
    packages: ["（无）"],
    maturity: "跑通",
    summary: "走 codeload 绕开 raw.githubusercontent 被墙的问题。",
    pitfalls: ["国内装 CellChat/Nichenet 类包，用 https://codeload.github.com/... 比 raw 稳得多"]
  },
  {
    path: "E:\\膀胱癌_双数据集\\01_build_object.R",
    kb: 12, lines: 281,
    title: "双数据集共用的建对象脚本",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "harmony", "patchwork"],
    maturity: "跑通",
    summary: "改成 `Rscript 01_build_object.R <数据集名>` 命令行传参，一套代码跑两个 GSE。",
    pitfalls: []
  },
  {
    path: "E:\\膀胱癌_双数据集\\04_target_markers.R",
    kb: 42, lines: 870,
    title: "OLFM4/NRP2/FAP 三 marker 专项",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "CellChat", "dplyr", "patchwork"],
    maturity: "跑通",
    summary: "UMAP+FeaturePlot+DotPlot+来源细胞判定+CellChat；记录了「三个基因不在 CellChat LR 库里」的实测结论，改用来源细胞为中心、阳性/阴性劈半再打标签两条替代路线。",
    pitfalls: ["OLFM4/NRP2/FAP 不在 CellChat 的配体-受体库里 —— 想查某基因能不能做通讯，先 检查它是否在 LRdb 里，别跑完了才发现是全零", "目标基因不在 LR 库时，替代路线是「以来源细胞为中心」的通讯分析，而不是硬算"]
  },
  {
    path: "E:\\膀胱癌_双数据集\\05_split_gene.R",
    kb: 12, lines: 262,
    title: "劈半 CellChat 拆进程",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "CellChat"],
    maturity: "跑通",
    summary: "把 04 拆成独立进程跑以规避 OOM。",
    pitfalls: ["人源 3.9 万细胞在 04 里跑到 NRP2 就 OOM —— CellChat 内存吃得很凶，大数据集要按基因拆进程或先抽样"]
  },
  {
    path: "E:\\膀胱癌_双数据集\\07_extend_markers.R",
    kb: 12, lines: 245,
    title: "复用 rds 扩到 12 个 marker",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "dplyr", "ggplot2"],
    maturity: "跑通",
    summary: "不重跑 CellChat，复用已存 rds，把 3 个 marker 扩到 12 个（SPP1 轴 + 免疫抑制髓系 + 检查点）并重算表格。",
    pitfalls: ["跑一次 CellChat 很贵，把对象存 rds 反复复用，比每次重跑划算得多"]
  },
  {
    path: "E:\\膀胱癌_双数据集\\config_GSE200139.R",
    kb: 5.4, lines: 117,
    title: "小鼠 anti-PD-1 配置（GSE200139）",
    track: "scrna", trackName: "单细胞",
    packages: ["（纯配置）"],
    maturity: "跑通",
    summary: "PMID 35626115，marker 用小鼠符号。",
    pitfalls: ["小鼠基因符号是 Xxx（首字母大写其余小写），人是全大写 XXX —— 跨物种转换用 babelgene，别手写"]
  },
  {
    path: "E:\\膀胱癌_双数据集\\config_GSE301651.R",
    kb: 5.2, lines: 117,
    title: "人膀胱癌 13 样本配置（GSE301651）",
    track: "scrna", trackName: "单细胞",
    packages: ["（纯配置）"],
    maturity: "跑通",
    summary: "PMID 41706539。",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\我要分析的数据.R",
    kb: 165, lines: 3154,
    title: "RILD 单文件 11 步全流程",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "dplyr", "clusterProfiler", "igraph", "patchwork", "pheatmap"],
    maturity: "跑通",
    summary: "读数据→QC→降维聚类→注释→肝小叶分区→DEG→富集→Hub→药物匹配→DRPS→汇总主图与图注。支持猪/大鼠/小鼠/人四物种、断点续跑、--resume。",
    pitfalls: ["支持断点续跑这一点很关键：单细胞流程动辄几小时，崩了要能从断点接"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\00_config.R",
    kb: 13, lines: 232,
    title: "RILD 全局设置文件",
    track: "scrna", trackName: "单细胞",
    packages: ["（纯配置）"],
    maturity: "跑通",
    summary: "路径/物种/QC/分区/DEG/富集/药物/DRPS 全部参数集中。",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\00_setup.R",
    kb: 5.3, lines: 104,
    title: "环境自检",
    track: "env", trackName: "环境与工程",
    packages: ["BiocManager"],
    maturity: "跑通",
    summary: "缺包只打印安装命令不硬装 —— 这个克制是对的。",
    pitfalls: ["环境脚本别自动 install.packages，会污染用户已有的包版本"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\01_load.R",
    kb: 24, lines: 486,
    title: "六种格式自动识别读入",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat", "Matrix", "zellkonverter"],
    maturity: "跑通",
    summary: "自动识别 10x 三件套 / h5 / h5ad / EBI / rds / csv 六种格式。",
    pitfalls: ["zellkonverter 依赖 Python basilica（ reticulate + conda），本机没配好 Python 就识别不了 h5ad", "hdf5r 是 h5 读入的老大难，Windows 上装不上就退回 10x 三件套"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\02_qc.R",
    kb: 6.4, lines: 120,
    title: "空液滴/doublet/高线粒体三害质控",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat"],
    maturity: "跑通",
    summary: "三害一起拦。",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\03_cluster.R",
    kb: 5.9, lines: 107,
    title: "标准化到 UMAP",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat"],
    maturity: "跑通",
    summary: "标准流程，含 Seurat v5 JoinLayers 的处理。",
    pitfalls: ["Seurat v5 里 layers 不 join 就跑 ScaleData 会报错，这是从 v4 升级最常见的翻车点"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\04_annotate.R",
    kb: 11, lines: 198,
    title: "细胞类型注释",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat"],
    maturity: "跑通",
    summary: "写明弃用 AddModuleScore 的理由。",
    pitfalls: ["AddModuleScore 在肝脏会给出荒谬结论：肝细胞本身高表达一堆基因，会把对照基因组稀释到失真 —— 肝脏数据别用默认模块评分，改用 zonation 的对比轴"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\05_zonation.R",
    kb: 11, lines: 191,
    title: "肝小叶 Zone1/2/3 判定",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat"],
    maturity: "跑通",
    summary: "用「对比轴」而非三区各自打分。",
    pitfalls: ["三个区分开打分会互相稀释，拉成一条 zone1↔zone3 的对比轴才稳定"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\06_deg.R",
    kb: 9, lines: 181,
    title: "双对比差异分析",
    track: "scrna", trackName: "单细胞",
    packages: ["Seurat"],
    maturity: "跑通",
    summary: "照射 vs 对照（分区内）+ Zone3 vs Zone1（处理内）。",
    pitfalls: ["分区内做处理效应、处理内做分区效应 —— 两个维度交叉，才能说清是放疗的锅还是分区的锅"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\07_enrich.R",
    kb: 10, lines: 205,
    title: "GO/KEGG 富集",
    track: "scrna", trackName: "单细胞",
    packages: ["clusterProfiler", "AnnotationDbi"],
    maturity: "跑通",
    summary: "",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\08_hub_ppi.R",
    kb: 8.4, lines: 158,
    title: "共表达网络替代 STRING Hub",
    track: "scrna", trackName: "单细胞",
    packages: ["igraph"],
    maturity: "脚手架",
    summary: "用离线的共表达网络算 Hub，避开 STRING 联网不稳定。",
    pitfalls: ["用共表达替代 PPI 是个好主意（离线可重复），但要说清两者的生物学含义不同：一个是共调控，一个是物理互作"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\09_drug.R",
    kb: 11, lines: 219,
    title: "靶点到药物的老药新用匹配",
    track: "drug", trackName: "药物重定位",
    packages: ["dplyr", "igraph"],
    maturity: "脚手架",
    summary: "内置参考药物表。",
    pitfalls: ["脚本头部自己写着「投稿前必须逐条核实」——内置药物表只能初筛，正式写进论文前要回 DrugBank/DGIdb 核实每条来源"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\10_drps.R",
    kb: 13, lines: 240,
    title: "DRPS 五维加权评分",
    track: "drug", trackName: "药物重定位",
    packages: ["dplyr"],
    maturity: "脚手架",
    summary: "靶点结合 30 / 疾病逆转 25 / 临床证据 20 / 成药性 15 / 机制合理 10。",
    pitfalls: ["五维权重的设定是拍的 —— 要做敏感性分析（换几套权重看排名是否稳定），否则审稿人一句「权重怎么定的」就答不上来"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\11_figures.R",
    kb: 13, lines: 237,
    title: "拼主图 + 自动生成图注",
    track: "writing", trackName: "写作与排版",
    packages: ["ggplot2", "patchwork"],
    maturity: "跑通",
    summary: "结果索引表 + 图注生成。",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\RUN_ALL.R",
    kb: 8.8, lines: 173,
    title: "1→11 一键串跑",
    track: "scrna", trackName: "单细胞",
    packages: ["（无）"],
    maturity: "跑通",
    summary: "rds 检查点。",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\lib\\utils.R",
    kb: 9.4, lines: 192,
    title: "日志/计时/IO 通用函数",
    track: "rbase", trackName: "R 基础",
    packages: ["（无）"],
    maturity: "跑通",
    summary: "log_step 带时间戳的进度 + 每步计时。",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\pipeline\\lib\\theme_pub.R",
    kb: 5, lines: 105,
    title: "Nature/Cell 风格 ggplot 主题",
    track: "viz", trackName: "可视化",
    packages: ["ggplot2"],
    maturity: "跑通",
    summary: "统一出图风格。",
    pitfalls: []
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\docking\\*",
    kb: 0, lines: 0,
    title: "分子对接脚本（PDB/配体准备、Vina 批量对接）",
    track: "drug", trackName: "药物重定位",
    packages: ["AutoDock Vina", "PyMOL"],
    maturity: "脚手架",
    summary: "体外部分的对接流程。",
    pitfalls: ["100 ns 分子动力学和 200 元档的轻量云算力不匹配 —— 要么缩短到 20-50 ns，要么换学校 HPC"]
  },
  {
    path: "E:\\嵩山一号\\项目执行包\\R_旧版_未验证\\*",
    kb: 62, lines: 0,
    title: "早期骨架 15 份（CMAP/GSVA/跨物种/DRPS 等）",
    track: "scrna", trackName: "单细胞",
    packages: ["clusterProfiler", "rDGIdb", "GSVA", "GEOquery", "limma", "babelgene", "TCGAbiolinks"],
    maturity: "未验证",
    summary: "对应申报书实验 4.1–4.10 的早期版本，被人认的条件下还需要校验。",
    pitfalls: ["CMAP/L1000 的 rgctx 包已经不好装，现在更推荐用 clue.io 官方 API 或 SignatureQuery"]
  },
  {
    path: "D:\\数据迁移\\Documents\\Codex\\2026-07-20\\ji\\东方一号\\02_R包一键安装脚本.R",
    kb: 4, lines: 77,
    title: "RILD 项目专属装包清单",
    track: "env", trackName: "环境与工程",
    packages: ["BiocManager"],
    maturity: "跑通",
    summary: "清华镜像 + install.packages/BiocManager::install 批处理。",
    pitfalls: []
  },
];
window.SX_SKILLMAP = [
  {
    "level": "已掌握",
    "items": "TCGA 下载整理 / DESeq2 / GO·KEGG·GSEA / 免疫浸润四件套 / 生存与 Cox / Seurat 全流程+harmony / CellChat / config 工程化",
    "note": ""
  },
  {
    "level": "浅尝辄止",
    "items": "WGCNA、LASSO+诺模图+校准曲线、ConsensusClusterPlus、tableone、TMB 瀑布图",
    "note": "课上跟敲过一次，从未独立复用到自己的课题"
  },
  {
    "level": "缺一环",
    "items": "ggplot2 原生图层手写、多重检验校正的统计直觉、批次效应（除 harmony 外没用过 limma removeBatchEffect / sva / ComBat）",
    "note": "高度依赖 ggpubr 封装"
  },
  {
    "level": "未接触",
    "items": "拟时序 monocle/traj、SCENIC、inferCNV、RNA velocity、空间转录组",
    "note": "这四个是单细胞进阶的分水岭"
  },
  {
    "level": "工程短板",
    "items": "renv 版本锁定、R Markdown/Quarto、git 版本管理、future.apply/foreach 并行",
    "note": "本机还不是一个 git 仓库"
  }
];
window.SX_GEMS = [
  "OLFM4/NRP2/FAP 不在 CellChat 的配体-受体库里 —— 查某基因能不能做通讯，先确认它在不在 LRdb。",
  "AddModuleScore 在肝脏会给出荒谬结论：肝细胞本身高表达一堆基因，会把对照基因稀释到失真。",
  "人源 3.9 万细胞跑 CellChat 到第三个基因就 OOM —— 大数据集要按基因拆进程或先抽样。",
  "Zonation 三区各自打分会互相稀释，拉成一条 zone1↔zone3 的对比轴才稳定。",
  "Seurat v5 里 layers 不 join 就跑 ScaleData 会报错。",
  "harmony 必须在 PCA 之后、FindNeighbors 之前插入。",
  "TCGA barcode 第 14-15 位：01A 是肿瘤、11A 是癌旁。",
  "小鼠基因符号 Xxx，人全大写 XXX —— 跨物种转换用 babelgene。",
  "preprocessCore 在 Windows 上常需源码编译，是 CIBERSORT 跑不起来的常见卡点。",
  "surv_cutpoint 自动取截断挑的是最显著的点，容易把显著性吹高。",
  "内置的参考药物表只能初筛，投稿前必须逐条回 DrugBank/DGIdb 核实。",
  "DRPS 五维权重是拍的，务必做敏感性分析（换权重看排名是否稳定）。",
  "100 ns 分子动力学和 200 元档轻量云算力不匹配，要么缩短到 20-50 ns，要么换学校 HPC。"
];
