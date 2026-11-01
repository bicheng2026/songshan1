// 嵩山一号 · 科研工作站  论文写作台 / 套路拆解
window.SX_WRITING = {
  sections: [
    {
      id: "title", name: "Title 标题", xp: 20,
      must: ["点出核心变量（暴露/干预 + 结局）", "点出方法学特征（如单细胞、孟德尔随机化、多组学整合）", "给出研究性质（队列、横断面、生信分析）"],
      templates: [
        "Single-cell transcriptome-wide Mendelian randomization and colocalization reveal cell-specific mechanisms in {disease}.",
        "Integrative causal inference illuminates gene-environment interactions linking {exposure} to {disease}.",
        "Mapping the immune-genetic architecture of {phenotype}: a single-cell causal framework for biomarker discovery and therapeutic targeting.",
        "From zonation atlas to therapeutic atlas: {approach} identifies repurposable candidates for {disease}."
      ],
      pitfalls: ["不要把结论写成已经证明的因果（生信研究用 suggests / identifies / nominates）", "不要堆砌缩写，标题里最多 2 个领域内通用缩写", "中文期刊习惯的『基于…的研究』式标题，在 SCI 里是减分项"]
    },
    {
      id: "abstract", name: "Abstract 摘要", xp: 30,
      must: ["Background 1-2 句：已知什么、缺什么", "Methods 2-3 句：数据从哪来、用什么方法、做了什么验证", "Results 3-4 句：给出带数字的关键结果", "Conclusions 1-2 句：意义 + 边界"],
      templates: [
        "Background: {disease} remains a major clinical challenge. However, the {mechanism} underlying {phenotype} is poorly defined.",
        "Methods: We integrated {data1} and {data2}, and applied {method} to prioritise candidate {targets}. Sensitivity analyses including {sens} were performed.",
        "Results: A total of {n} candidate genes were identified. Mendelian randomization supported causal associations for {genes} (OR = {or}, 95% CI {ci}, P = {p}).",
        "Conclusions: Our findings nominate {genes} as candidate biomarkers and therapeutic targets for {disease}, warranting experimental validation."
      ],
      pitfalls: ["摘要里不要出现引用文献", "不要出现未在正文定义的缩写", "数字必须与正文完全一致 —— 这是修稿时最常见的低级错误"]
    },
    {
      id: "intro", name: "Introduction 引言", xp: 30,
      must: ["第一层：疾病的临床负担与未满足需求", "第二层：现有研究进展与已知机制", "第三层：明确指出 gap（现有研究的 3 个不足）", "第四层：本研究做什么、为什么这个方法能解决 gap", "第五层：研究假设与预期贡献"],
      templates: [
        "{disease} affects approximately {n} individuals annually and remains {clinical problem}.",
        "Previous studies have established that {known finding}. However, {gap 1}; moreover, {gap 2}.",
        "To address these gaps, we integrated {datasets} and applied {methods}, which enable {capability}.",
        "We hypothesised that {hypothesis}. Here we show that {main finding}."
      ],
      pitfalls: ["不要把 Introduction 写成教科书（机制细节留到 Discussion）", "gap 要写具体的『不知道什么』，不要写『研究较少』这种空话", "最后一段必须落到『本研究做什么』，不能停在前人综述"]
    },
    {
      id: "methods", name: "Methods 方法", xp: 30,
      must: ["数据来源与获取方式（数据库名 + 版本 + 访问日期 + 伦理）", "每一步分析的参数与阈值", "软件/包名称与版本号", "质控标准与剔除样本数", "统计方法与多重检验校正策略", "可重复性声明（代码/数据的可及性）"],
      templates: [
        "Publicly available data were retrieved from {database} (accession {id}) on {date}.",
        "Quality control was performed by excluding cells with {criteria}, resulting in {n} cells retained for downstream analysis.",
        "Differential expression analysis was performed using {tool} with thresholds of |log2FC| > {x} and Benjamini-Hochberg adjusted P < {y}.",
        "All analyses were conducted in R (version {v}) using the packages {pkgs}. Analysis code is available at {url}."
      ],
      pitfalls: ["只写『数据来自 GEO』不写 accession 号，审稿人会直接退回", "阈值必须写出来（|logFC|、adj.P、PPI score、coloc PP.H4）", "版本不写 = 不可重复，这是生信论文被质疑的重灾区"]
    },
    {
      id: "results", name: "Results 结果", xp: 30,
      must: ["每段一个结论，先给结论再给数据", "每张图对应一小节，图注自解释", "给出统计量（OR/HR/beta + CI + P），不只给 P", "阴性结果也要写（如『其余 4 个基因未显示性别差异』）"],
      templates: [
        "To identify {target}, we first {step}. This yielded {n} candidates (Fig. 1A).",
        "Among these, {gene} showed the strongest association ({stat} = {value}, 95% CI {ci}, P = {p}).",
        "We next examined whether {finding} was consistent across {stratification}. Notably, {observation}.",
        "Sensitivity analyses, including {method}, supported the robustness of these findings (Supplementary Fig. {x})."
      ],
      pitfalls: ["不要在这里解释机制（那是 Discussion 的事）", "『显著』必须伴随具体数值，不能只写 significantly increased", "不要把方法细节塞进 Results（放 Methods）"]
    },
    {
      id: "discussion", name: "Discussion 讨论", xp: 30,
      must: ["第一段：用 2-3 句复述最重要的发现（现在时）", "第二、三段：与已有文献对照（一致 / 不一致 + 解释）", "机制解释：把发现放进生物学框架", "临床/转化意义", "局限性 3-5 条（诚实、具体）", "结论与下一步"],
      templates: [
        "In this study, we integrated {data} to show that {main finding}.",
        "Our findings are consistent with prior reports that {literature}. In contrast, {conflict}, which may reflect {reason}.",
        "Several limitations should be acknowledged. First, {limitation 1}. Second, {limitation 2}. Third, {limitation 3}.",
        "In conclusion, {conclusion}. Future studies incorporating {next step} are warranted to validate these hypotheses."
      ],
      pitfalls: ["不要把 Results 换个说法再抄一遍", "不要用『首次发现』除非你真的做过系统检索", "局限性里必须包括：相关性不等于因果、公共数据的选择偏倚、人群外推性（欧洲 GWAS）"]
    },
    {
      id: "legend", name: "Figure legend 图注", xp: 20,
      must: ["每个 panel 画了什么", "统计方法与检验方向（two-sided）", "样本量 n", "误差棒含义（mean ± SD / SEM / 95% CI）", "显著性星号含义"],
      templates: [
        "(A) {panel description}. (B) {panel description}.",
        "Data are presented as mean ± SD. Group comparisons were performed using two-sided Student's t-test followed by Benjamini-Hochberg correction.",
        "Sample sizes: n = {n1} in the {group1} group and n = {n2} in the {group2} group.",
        "*P < 0.05, **P < 0.01, ***P < 0.001, ns = not significant."
      ],
      pitfalls: ["图注里不要出现结果解读（那属于正文）", "删失数据（生存曲线）必须说明删失定义", "箱线图的 whisker 定义要写明"]
    }
  ],

  sentences: {
    "转折与 gap": [
      "However, the causal direction of this association remains unresolved.",
      "Nevertheless, most existing evidence derives from bulk tissue, which masks cell-type-specific effects.",
      "Despite these advances, whether {A} contributes causally to {B} has not been systematically examined.",
      "A critical unresolved question is whether {finding} reflects causality or confounding."
    ],
    "方法与设计": [
      "We adopted a two-sample Mendelian randomization design using genetic variants as instrumental variables.",
      "To minimise confounding, we restricted the analysis to cis-eQTLs with F statistics > 10.",
      "Batch effects were corrected using Harmony prior to clustering.",
      "Colocalization was assessed to distinguish shared causal variants from linkage-driven signals."
    ],
    "结果与量化": [
      "Genetically predicted {exposure} was associated with a {x}% change in the odds of {outcome} (OR = {or}, 95% CI {ci}).",
      "The association remained consistent across all sensitivity analyses (Supplementary Table {x}).",
      "No evidence of directional pleiotropy was observed (MR-Egger intercept P = {p}).",
      "{gene} was predominantly expressed in {celltype}, as evidenced by single-cell profiling."
    ],
    "机制与意义": [
      "Collectively, these observations suggest a model in which {A} promotes {B} through {pathway}.",
      "Our results nominate {drug}, an approved agent, as a repositionable candidate for {disease}.",
      "These findings provide a mechanistic framework linking environmental exposure to {phenotype}."
    ],
    "局限与边界": [
      "The GWAS and eQTL data were derived predominantly from European-ancestry populations, which limits generalisability.",
      "Colocalization was not performed for all loci, and residual linkage confounding cannot be fully excluded.",
      "Single-cell data represent a cross-sectional snapshot and cannot capture dynamic regulatory changes.",
      "In the absence of experimental validation, causal inferences should be interpreted with caution."
    ]
  },

  checklists: {
    "生信论文通用自查": [
      "数据来源、accession、版本、访问日期全部写明",
      "每个分析步骤的阈值可追溯（|logFC|、adj.P、score、PP.H4）",
      "多重检验校正方式明确（BH / Bonferroni）",
      "所有软件与包标注版本号",
      "质控前后的样本/细胞数量都给出",
      "图注自带统计方法、样本量、显著性定义",
      "摘要与正文的数字完全一致",
      "局限性至少 3 条，且包含人群外推性",
      "声明代码与数据的可及性（GitHub / Zenodo）",
      "伦理与知情同意（涉及人类数据）"
    ],
    "STROBE-MR 要点（孟德尔随机化）": [
      "明确说明三个核心假设：关联性、独立性、排他性限制",
      "工具变量的筛选标准（P 值阈值、LD clumping 窗口与 r²、F 统计量）",
      "报告暴露与结局数据源、样本量、人群祖源",
      "主方法（IVW）之外至少给出一种敏感性方法（MR-Egger / weighted median）",
      "报告异质性检验（Cochran's Q 或 I²）",
      "报告多效性检验（MR-Egger intercept）",
      "报告留一法（leave-one-out）结果",
      "如做了共定位，报告 PP.H4 及其阈值",
      "声明弱工具变量的处理方式",
      "讨论人群祖源限制与外推性"
    ],
    "单细胞论文要点": [
      "质控三项阈值与过滤前后细胞数（nFeature、nCount、percent.mt）",
      "doublet 去除方法与参数",
      "批次效应处理（Harmony / CCA）与是否可视化批次混合效果",
      "聚类分辨率参数与聚类数选择依据",
      "细胞注释依据的 marker 基因清单（附参考文献）",
      "差异表达使用的方法及其统计假设（Wilcoxon / pseudobulk）",
      "是否使用 pseudobulk 避免伪重复（pseudo-replication）",
      "亚群比例比较是否做了合适的统计检验",
      "轨迹分析（如做）的假设与根节点选择依据",
      "原始数据的可及性与代码"
    ],
    "投稿前最后 10 分钟": [
      "图表编号与正文引用顺序一致",
      "所有缩写首次出现时给出全称",
      "Supplementary 材料编号与正文引用一致",
      "作者贡献声明与利益冲突声明",
      "参考文献格式统一（用文献管理器，别手改）",
      "Cover letter 点明创新点与适合本刊的理由",
      "确认通讯作者邮箱与 ORCID",
      "确认图表分辨率（≥300 dpi）与格式"
    ]
  }
};

// ---------------------------------------------------------------- 套路拆解
window.SX_PLAYBOOK = {
  core: "洪扬刚的方法本身没有秘密：全部是公开数据库 + 现成统计方法。真正的可迁移资产是那条『多组学交集 → 因果推断 → 细胞定位 → 药物重定位』的证据链，以及把同一条链换疾病复用的工程化能力。方法可学，行为不可学。",
  sops: [
    { step: 1, name: "暴露/干预基因集获取", input: "CTD / TEDX / 毒理数据库、或差异分析结果", tool: "CTD、TEDX、ChEMBL", output: "候选基因池（数千 → 数百）", note: "这一步决定选题的新颖度：换一个暴露因素就是一篇新文章。" },
    { step: 2, name: "与疾病转录组取交集", input: "候选基因池 + TCGA/GEO 差异基因", tool: "DESeq2 / limma", output: "交集基因（数百）", note: "最朴素的压缩手段，代价是丢失上下文特异性。" },
    { step: 3, name: "功能与网络模块", input: "交集基因", tool: "Metascape、STRING + MCODE、clusterProfiler", output: "通路 + 功能模块", note: "先富集再分模块，比直接看图更容易讲出故事。" },
    { step: 4, name: "因果推断", input: "cis-eQTL（暴露）+ GWAS（结局）", tool: "TwoSampleMR、coloc", output: "少数通过 MR 与共定位的基因", note: "MR 是这套流水线里唯一的『因果』成分，也是拉开与灌水差距的地方。" },
    { step: 5, name: "细胞定位", input: "候选基因 + scRNA-seq", tool: "Seurat / SingleR", output: "细胞类型特异表达", note: "把组织层面的结论下沉到细胞层面，是免费的加分项。" },
    { step: 6, name: "表型与安全性扫描", input: "候选基因", tool: "AstraZeneca PheWAS Portal", output: "脱靶风险清单", note: "PheWAS 是假设生成，不是假设检验，必须如实表述。" },
    { step: 7, name: "药物重定位", input: "候选基因", tool: "DGIdb / OpenTargets / DrugBank", output: "已获批药物清单", note: "论文从『发现』跳到『可转化』的一步，也是本课题的最终目标。" },
    { step: 8, name: "分层与补充分析", input: "候选基因 + 临床信息", tool: "Wilcoxon、Cox", output: "性别/分期/生存差异", note: "成本低、信息量大，能挖出被平均值掩盖的差异。" }
  ],
  caseStudy: {
    title: "案例拆解：内分泌干扰物 → 肝细胞癌（npj Gut and Liver, 2026）",
    note: "这篇是理解整套打法最好的样本，而且它研究的对象就是肝脏 —— 与这类课题同一器官。",
    steps: [
      { k: "起点", v: "不做『肿瘤 vs 正常』，而是引入环境暴露（EDCs）作为上游变量 —— 用新维度制造新颖性。" },
      { k: "交集", v: "5797 个 EDC 响应基因 × 946 个 HCC 差异基因 → 513 个候选。" },
      { k: "模块", v: "PPI + MCODE 拆出 14 个功能模块，把杂乱网络压缩成可解释的几条功能轴。" },
      { k: "因果", v: "eQTLGen（cis-eQTL）+ FinnGen R12（HCC GWAS）做两样本 MR，317 个合格工具变量的基因里筛出 5 个。" },
      { k: "反向溯源", v: "用 CTD 反查：哪些化学物作用于这 5 个基因？苯并[a]芘命中全部 5 个，18 种化合物命中 ≥3 个。" },
      { k: "分层", v: "ESR1 呈现性别二态：正常肝女性高于男性，肿瘤中反而更低 —— 论文里最有故事性的一点。" },
      { k: "表型", v: "PheWAS 提示 TP53I3 与泌尿/肾脏表型相关，给基因补了系统生物学背景。" },
      { k: "定位", v: "GSE149614（71,840 细胞）：SOCS2 在内皮，PLIN2 在髓系 —— 完成组织到细胞的下沉。" }
    ],
    weaknesses: [
      "eQTL 与 GWAS 均来自欧洲人群，外推性受限",
      "PheWAS 是假设生成，文中未对 PheWAS 信号再做 MR 二次验证",
      "单细胞只做了 marker 可视化，没有往下做调控网络或拟时序",
      "样本量仅 10 例 HCC，细胞比例受取样偏差影响"
    ]
  },
  transfer: [
    { from: "内分泌干扰物（EDC）", to: "电离辐射 / 剂量", note: "把『暴露因素』换成物理因素：辐射剂量—基因响应—损伤结局，逻辑完全同构。这正是这类课题的位置。" },
    { from: "肝细胞癌（HCC）", to: "损伤与再生", note: "把『疾病结局』从肿瘤换成损伤与再生，结局变量从发病变为损伤程度与再生能力。" },
    { from: "污染物—基因网络", to: "分区—基因网络（Zone1/2/3）", note: "你已有分区图谱，交集逻辑可以直接换成『分区特异基因 × 处理响应基因』。" },
    { from: "单细胞定位到内皮/髓系", to: "定位到 Zone2 增殖群 / Zone3 脆弱群", note: "你已经知道 Zone3 最脆弱、Zone2 负责再生，这是比多数纯生信课题更硬的先验。" },
    { from: "DGIdb 老药匹配", to: "铁死亡/PPARα/YAP 轴的已获批药物", note: "非诺贝特（PPARα）、吡非尼酮（抗纤维化）、维替泊芬（YAP-TEAD）都是现成的可写候选。" }
  ],
  redlines: [
    { t: "同一套代码换疾病批量产出", d: "把方法当模板复用是能力，把结论当模板复用是学术不端。每换一个疾病，都必须重新论证这个疾病为什么值得研究、机制解释是否成立。" },
    { t: "大量 Letter / Comment 充数", d: "学术通信有正当价值，但用它把发表数堆到异常水平，等于把自己的学术信用打折。评价论文质量看的是 article，不是总数。" },
    { t: "本科生频繁担任通讯作者", d: "通讯作者要对数据真实性、伦理、撤稿承担最终责任。这个身份不是荣誉，是责任，没有指导能力就不该挂。" },
    { t: "MR 不做共定位就下因果结论", d: "没有 coloc / SMR 的 MR 结论，在审稿人眼里只是『相关性 + 一个假设』。这是方法学硬伤，不是风格问题。" },
    { t: "把生信推断说成机制证明", d: "『提示（suggest）』与『证明（demonstrate）』之间有生物学鸿沟。用词必须精确，否则就是误导。" },
    { t: "P 值挖掘到显著为止", d: "换阈值、换分组、换校正方法直到出显著结果，这叫 p-hacking，不是分析。" }
  ],
  howToUse: [
    "第一步：在【论文库】里按方法标签筛出同类型文章，读 3 篇的 Methods，抄出它们的阈值与敏感性分析清单。",
    "第二步：在【套路拆解】里确认自己的证据链缺哪一环，缺因果推断就补 MR，缺细胞定位就补单细胞。",
    "第三步：在【代码库】里找对应模板，改成自己的数据；在【代码道场】里先用内置小数据跑通，再上真实数据。",
    "第四步：在【论文写作台】按 IMRaD 逐节写，写完过一遍【自查清单】。",
    "第五步：把草稿丢给 AI 导师（审稿人模式），让它挑刺，改完再交真人导师。"
  ]
};
