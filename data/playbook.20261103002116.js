/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

/* 嵩山一号 · 套路拆解 —— 14 条通用生信套路
   每个套路给：一句话说清干什么、四步流程、最常见的坑、几条真代表文献。
   代表作不写死：keys 是标题关键词，渲染时从论文库里实时匹配、按被引取前 4 篇，
   所以永远不会出现编出来的 DOI。 */
window.SX_PATTERNS = {
  intro: "套路是公开的，值钱的是把它跑通、并且知道自己踩的是哪个坑。下面 14 条覆盖生信文章九成以上的骨架，每条都能单独成文。",

  items: [
    {
      id: "deg", name: "差异表达 → 富集", tag: "入门",
      one: "两组差在哪些基因上，这些基因落在哪条通路。",
      steps: ["对齐分组与批次，做标准化", "DESeq2（counts）或 limma（芯片）出 DEG", "GO / KEGG / GSEA 三条一起看", "火山图 + 热图收尾"],
      keys: ["differential expression", "transcriptom", "rna-seq", "gene expression profil"],
      pitfall: "只报 p<0.05 不报 FDR，是审稿人第一刀。"
    },
    {
      id: "wgcna", name: "WGCNA 模块 + 性状关联", tag: "进阶",
      one: "把上万基因压成几个共表达模块，看哪个模块跟着性状走。",
      steps: ["样本聚类查离群", "选软阈值 β（看 R² 拐点）", "切模块，合并相似模块", "模块-性状相关 + 模块内 hub 基因"],
      keys: ["wgcna", "co-expression", "weighted gene"],
      pitfall: "样本少于 15 个别做，模块会碎成噪声。"
    },
    {
      id: "scrna", name: "单细胞图谱", tag: "主流",
      one: "把组织拆到细胞层面，说清有哪几群、各是什么身份。",
      steps: ["QC：线粒体比例、基因数、双细胞", "归一化 + 高变基因 + PCA", "聚类（分辨率按预期群数试）", "marker 注释，必要时 SingleR 交叉验证"],
      keys: ["single-cell", "single cell", "scrna-seq", "transcriptomic atlas"],
      pitfall: "注释只靠自动工具不做人工核对，细胞类型会整体错位。"
    },
    {
      id: "cellchat", name: "细胞通讯", tag: "加分",
      one: "哪类细胞在对哪类细胞发信号，处理后是强了还是弱了。",
      steps: ["按条件拆成多个对象", "配体-受体库选定（人/鼠不同）", "算通讯概率，过滤低表达", "两组差异通讯比较 + 圈图"],
      keys: ["cell-cell communication", "cellchat", "ligand-receptor", "intercellular"],
      pitfall: "不同条件一定要分开建对象再比较，合并后再拆会污染。"
    },
    {
      id: "traj", name: "轨迹 / 拟时序", tag: "加分",
      one: "细胞从一个状态走到另一个状态，谁在起点、谁在终点。",
      steps: ["挑出目标细胞亚群", "降维后建最小生成树", "定根节点（用已知 marker 校准）", "沿轨迹找变化基因，做热图"],
      keys: ["trajectory", "pseudotime", "monocle", "differentiation trajectory"],
      pitfall: "根节点随手定，整条轨迹的生物学解释就反了。"
    },
    {
      id: "spatial", name: "空间转录组", tag: "前沿",
      one: "把表达放回组织坐标，看区域之间差在哪。",
      steps: ["spot 级别 QC 与过滤", "空间聚类或区域注释", "区域间 DEG", "配 H&E 出空间叠加图"],
      keys: ["spatial transcriptom", "spatial", "visium", "spatially resolved"],
      pitfall: "一个 spot 里往往混着几种细胞，别当单细胞用。"
    },
    {
      id: "mr", name: "两样本孟德尔随机化", tag: "因果",
      one: "用遗传变异当工具变量，问暴露是否真的导致结局。",
      steps: ["选工具变量（p<5e-8，去 LD，算 F 值）", "harmonise 对齐等位基因", "IVW 主分析 + MR-Egger / 加权中位数", "敏感性：异质性、多效性、留一法"],
      keys: ["mendelian randomization", "mendelian randomisation", "causal inference", "instrumental variable"],
      pitfall: "F 值低于 10 的工具变量是弱工具，结论不成立。"
    },
    {
      id: "coloc", name: "共定位", tag: "因果",
      one: "eQTL 和 GWAS 信号是不是同一个因果变异。",
      steps: ["取同一区域的两套 summary stats", "对齐到同一参考面板", "跑 coloc（四条假设）", "看 PP.H4，并与 MR 互相印证"],
      keys: ["colocalization", "colocalisation", "eqtl"],
      pitfall: "只有一个 SNP 信号时 coloc 没有分辨力，别硬报。"
    },
    {
      id: "tox", name: "网络毒理学", tag: "选题",
      one: "化学物打到哪些基因，这些基因和疾病重不重叠。",
      steps: ["CTD / PubChem 拉暴露因素相关基因", "疾病转录组取交集", "STRING 建网 + 拓扑筛 hub", "富集 + 分子对接佐证"],
      keys: ["network toxicology", "toxicogenomic", "environmental exposure", "exposure"],
      pitfall: "交集基因多不等于有意义，先看交集是否显著富集。"
    },
    {
      id: "drug", name: "药物重定位", tag: "转化",
      one: "已有药物里，哪个正好打到这条通路。",
      steps: ["签名矩阵（上/下调基因）", "CMAP / LINCS 查反向匹配", "DGIdb / OpenTargets 查靶点-药关系", "分子对接或动力学做机制佐证"],
      keys: ["drug repurposing", "drug repositioning", "connectivity map", "therapeutic target"],
      pitfall: "对接打分只能做排序参考，不能当亲和力结论。"
    },
    {
      id: "ml", name: "机器学习预后模型", tag: "建模",
      one: "用一批基因算出风险分，把病人分高低两组。",
      steps: ["训练集/验证集先分好", "LASSO / RF / SVM-RFE 筛特征", "Cox 或 logistic 建模型", "ROC、校准曲线、外部验证"],
      keys: ["machine learning", "lasso", "prognostic model", "nomogram", "signature"],
      pitfall: "在全集上筛特征再做交叉验证，等于自己给自己泄题。"
    },
    {
      id: "immune", name: "免疫浸润 / 微环境", tag: "常规",
      one: "这批样本里各类免疫细胞占多少，和分组有没有关系。",
      steps: ["CIBERSORT / xCell / ESTIMATE 打分", "组间比较 + 相关性热图", "与目标基因做相关", "必要时用单细胞校验比例"],
      keys: ["immune infiltration", "tumor microenvironment", "cibersort", "immune cell"],
      pitfall: "不同算法给出的绝对值差别很大，只比组间趋势。"
    },
    {
      id: "perturb", name: "虚拟敲除 / 扰动预测", tag: "前沿",
      one: "把某个基因在计算上敲掉，看网络怎么变。",
      steps: ["建调控网络或 GRN", "选定靶基因，模拟敲除", "看下游基因与通路位移", "与真实敲除数据对照（如有）"],
      keys: ["perturbation", "in silico", "gene regulatory network", "knockout"],
      pitfall: "没有真实扰动数据校验时，只能作为假设，不能写成结论。"
    },
    {
      id: "chain", name: "多组学证据链", tag: "成文",
      one: "把上面几条串成一条链：暴露 → 交集 → 因果 → 细胞定位 → 药物。",
      steps: ["上游找一个新变量（暴露/干预）", "与疾病组学取交集压到百量级", "MR + 共定位给因果", "单细胞给定位，药物给出口"],
      keys: ["multi-omics", "integrative analysis", "evidence chain", "integrating"],
      pitfall: "链条每一环都要能独立站住，靠环数堆出来的文章一问就塌。"
    }
  ],

  redlines: [
    { t: "改数据、挑 p 值", d: "原始数据要能公开，图能重画出来。这条一旦破了，整篇文章作废。" },
    { t: "把相关写成因果", d: "只有 MR、共定位、干预实验能说因果，其余一律写 association。" },
    { t: "工具当结论", d: "对接打分、通路富集、机器学习重要性排序，都是排序，不是机制。" },
    { t: "引用没读过的文献", d: "每条引用至少看过摘要，否则很容易引到相反结论。" }
  ]
};
