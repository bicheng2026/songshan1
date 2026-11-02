/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

/* 嵩山一号 · 工作站 —— 知识库扩展：课题工具链补全（第 6 批，7 条）
   补齐课题实验链上的方法学空白：分子对接 / 分子动力学 / 可药性 / RNA velocity /
   WGCNA 共表达模块 / PPI 网络 / 细胞外囊泡。每条给可检索英文标签，便于挂真实文献。 */
window.SX_KNOWLEDGE6 = [
  {
    id: "method-29", domain: "method", domainName: "生信方法论", level: "进阶",
    title: "分子对接：Vina 怎么把一个分子「摆」进蛋白口袋",
    tags: ["molecular docking", "AutoDock Vina", "scoring function", "binding pose", "docking"],
    summary: "对接是在靶蛋白口袋里搜索小分子的可能姿态并打分——它是「猜 pose 的初筛」，不是「测结合」。",
    body: "【主线】分子对接 = 在靶蛋白结合口袋里搜索小分子的可能构象与取向（pose），再用打分函数给每个 pose 估个分。Vina 的打分函数是经验的：氢键、疏水接触、扭转熵罚等加权组合，输出单位近似 kcal/mol，越负表示越「可能结合」。构象搜索用迭代局部搜索，不穷举也不做真物理采样。三大陷阱：①打分函数不等于结合自由能，-7 和 -9 不代表真结合能差 2 kcal/mol，只代表相对排序；②口袋准备决定一半成败——水分子、金属离子、辅因子留不留，口袋中心与盒子大小定错，全白算；③对接一般不处理柔性侧链与诱导契合，真命中可能被漏掉。\n\n【和生信分析的连接】课题实验 9-10 用 Vina 筛老药：hub 基因产物 → PDB 挑结构（YAP1 用 3KYS/4RE1/6GEY，p53 用 1TUP；选结构前先去 RCSB 核对，别信申报书转抄的 ID）→ 下载小分子 SDF → 加氢、质子化状态按 pH 7.4 → 批量对接 → 按结合能排序 → PyMOL 看关键残基氢键。解读时只把对接当「初筛排序」，进阶结论要靠 MD 与文献佐证。",
    keyPoints: [
      "对接 = 构象搜索 + 经验打分，不是物理能量",
      "打分只能排先后，不能直接下结论",
      "口袋准备与盒子定义决定一半成败",
      "阳性对照（已知配体）必须先跑通再批量筛"
    ],
    testYourself: "为什么同一化合物对 6CSH 和 3KYS 两个「YAP1 结构」会给出完全不同的结合能？（提示：6CSH 在 RCSB 里根本不是 YAP1）",
    links: ["method-30", "method-31", "k4-10", "cancer-18"]
  },
  {
    id: "method-30", domain: "method", domainName: "生信方法论", level: "进阶",
    title: "分子动力学：给对接结果做「体检」——力场、RMSD 与结合自由能",
    tags: ["molecular dynamics", "GROMACS", "force field", "RMSD", "MM-PBSA", "binding free energy"],
    summary: "把蛋白-配体复合物放进原子级「电影」里跑几十纳秒，看它稳不稳、口袋塌没塌、配体跑没跑。",
    body: "【主线】MD = 用经验力场（蛋白用 AMBER ff14SB/CHARMM36，小分子配体用 GAFF）描述原子间作用，以 1-2 fs 步长积分牛顿方程，模拟复合物在溶剂盒子里的运动。跑完看三件套：①RMSD——蛋白骨架与配体的均方根位移是否收敛（收敛 = 体系稳定的第一道关）；②RMSF——哪些残基动得厉害；③关键氢键/盐桥随时间的存续率。结合自由能用 MM/PBSA 或 MM/GBSA 从轨迹近似估计——比对接打分更有物理依据，但绝对值仍不可靠，只适合比「相对差」（突变前后、两个配体之间）。\n\n【和生信分析的连接】课题里 Vina 挑出的 top 命中要跑短程 MD 复核：搭建体系 → 加水加离子 → 能量最小化 → NVT/NPT 平衡 → 取样分析。算力现实要先算账：100 ns 大体系在轻量云上不现实，先 20-50 ns 看稳定性趋势，或申请 HPC。MD 稳定性 + 对接排序 + 文献证据三者一致，才值得写进结论。",
    keyPoints: [
      "力场是 MD 的物理规则，蛋白/配体各配各的",
      "RMSD 收敛 = 体系稳定的第一道关",
      "MM/PBSA 只比相对、不求绝对",
      "时长与算力预算先对齐再动手"
    ],
    testYourself: "对接打分 -11 kcal/mol 的化合物，MD 跑到 30 ns 配体滑出口袋——它该进下一轮吗？为什么？",
    links: ["method-29", "k4-10", "cancer-18"]
  },
  {
    id: "method-31", domain: "method", domainName: "生信方法论", level: "进阶",
    title: "可药性：为什么有些靶点天生适合做药，有些再重要也做不了",
    tags: ["druggability", "drug target", "DGIdb", "DrugBank", "ligandability", "therapeutic window"],
    summary: "靶点重要 ≠ 能做药：口袋能不能被小分子稳定占据、治疗窗够不够、药进不进得了细胞，决定它有没有药可筛。",
    body: "【主线】可药性看三层：①结构层——口袋要「深、闭合、疏水 patch 丰富」，小分子能稳定占据且竞争性结合可行（ligandability）；②生物学层——抑制它疾病是否好转（有效性），正常组织能不能扛住（治疗窗）；③技术层——胞内靶点要小分子能透膜，胞外/分泌靶点更适合抗体类生物药。DGIdb 把基因与 DrugBank、PharmGKB 等药物数据库连起来，回答的是「这个靶点有没有现成或在研药物」，不回答「它好不好打」——后者要回到结构口袋本身。\n\n【和生信分析的连接】课题的「治疗图谱」一步 = 给 hub 靶点过三道筛：PPI 中心性（重要吗）→ 单细胞表达定位（哪种细胞在表达、分泌还是膜上）→ DGIdb/DrugBank 查现成药物（有没有老药可重定位）。三道全过的靶点才值得写进讨论。注意 Fga 这类分泌蛋白：它重要，但它是「发货到血里的」，不是等着小分子进细胞打的靶。",
    keyPoints: [
      "重要性与可药性是两件事",
      "DGIdb 答「有没有药」，不答「好不好打」",
      "治疗窗 = 有效性 − 毒性的差额",
      "分泌/膜/胞内靶点的武器类型不同"
    ],
    testYourself: "Fga 在 PPI 里 degree 很高，为什么它不适合当分子对接靶点？换成什么策略干预它更合理？",
    links: ["method-29", "method-34", "k4-10", "cancer-18"]
  },
  {
    id: "method-32", domain: "method", domainName: "生信方法论", level: "进阶",
    title: "RNA velocity：给拟时序装上方向感",
    tags: ["RNA velocity", "spliced unspliced", "scVelo", "trajectory", "driver gene"],
    summary: "用「还没剪接完的前体 mRNA」当时间戳，推断每个细胞此刻正在往哪个状态走——拟时序给地图，velocity 给方向。",
    body: "【主线】单细胞测序能同时测到剪切成熟的 mRNA（spliced）和还没剪完的前体（unspliced）。某基因 unspliced 偏多 = 转录本正在路上、表达即将升高；unspliced 偏少 = 表达在回落。把全基因组这个「供需偏差」拟合成速度场，就是 RNA velocity：在 UMAP 上画出箭头，指示每个细胞即将走向的状态。它与拟时序互补——拟时序只给「谁像谁」的排序，velocity 额外给「谁正在变成谁」。局限：三种模型（稳态 / dynamical / 深度学习）对稀疏数据与 dropout 敏感，速度是估计不是实测；dynamical 模式还能顺带挑出 driver gene，但那也是推断。\n\n【和生信分析的连接】课题想回答「损伤后肝细胞是走向去分化、代偿增殖还是死亡」，velocity 是比拟时序更强的方向性证据：对 regen-12 那群 SOX9 阳性的「返祖」细胞跑 scVelo，看它们的箭头指向去分化态还是回到成熟态，结论会比单纯的 pseudotime 排序硬得多。",
    keyPoints: [
      "unspliced/spliced 比值 = 基因当下的趋势",
      "拟时序给「地图」，velocity 给「方向」",
      "模型选型影响箭头稳健性，结论要换模型复验",
      "driver gene 是推断，不是实锤"
    ],
    testYourself: "某群细胞在拟时序上排最末端，但 velocity 箭头显示它们在「回流」——两种解释各是什么？怎么用 DOG/crossing 验证？",
    links: ["method-06", "regen-12", "regen-02", "method-19"]
  },
  {
    id: "method-33", domain: "method", domainName: "生信方法论", level: "进阶",
    title: "WGCNA：从几万个基因里揪出「和性状一起动」的模块与 hub",
    tags: ["WGCNA", "co-expression network", "hub gene", "module eigengene", "soft threshold"],
    summary: "按「跨样本共同起落」把基因聚成模块，找出与损伤性状最挂钩的模块，再从模块里挑 hub——课题靶点池的第一道流水线。",
    body: "【主线】WGCNA 的流程：多样本表达矩阵 → 算基因两两相关 → 用「软阈值 β」把相关系数幂次化转成邻接度（好处：不硬砍弱相关，网络还能逼近无标度分布）→ 层次聚类切模块 → 用模块第一主成分（module eigengene, ME）代表整个模块 → ME 与性状（剂量/时间/损伤评分）相关 → 锁定目标模块 → 模块内按 kME（与 ME 的相关）或连通度挑 hub。三个坑：样本量少于 15 模块不稳；批次混杂会造出假模块；共表达不等于调控关系，模块解释要回到功能富集。\n\n【和生信分析的连接】课题实验 2 用 WGCNA 找 RILD 相关模块：输入 counts 先做 VST 标准化（别用原始 counts），性状用剂量与时间点；输出的「损伤相关模块 hub list」就是下一站 PPI（method-34）的候选池。hub 判定别用差异倍数——hub 是网络位置概念，不是表达量概念。",
    keyPoints: [
      "软阈值 β 让网络逼近无标度，而不是硬性砍边",
      "module eigengene = 模块的脸面，用它对性状",
      "hub = kME / 连通度，与差异倍数无关",
      "样本 < 15 别做 WGCNA；先校正批次"
    ],
    testYourself: "turquoise 模块与损伤评分 r=0.83，但它的 GO 富集全是核糖体基因——下一步该怀疑什么、查什么？",
    links: ["method-34", "method-02", "method-19", "cancer-18"]
  },
  {
    id: "method-34", domain: "method", domainName: "生信方法论", level: "进阶",
    title: "PPI 网络：STRING 上的边是什么证据级别，hub 蛋白怎么定",
    tags: ["protein-protein interaction", "STRING", "Cytoscape", "degree", "MCC", "CytoHubba"],
    summary: "STRING 的边不是「实测结合」，而是七类证据的加权分——先懂三档置信阈值，再谈挑 hub。",
    body: "【主线】蛋白互作网络把基因产物连成图。STRING 的边由七类证据加权合并：实验验证、数据库收录、共表达、基因组邻近、基因融合、文本挖掘、同源；总分 0.15-1.0，常用 0.4（中）/0.7（高）/0.9（最高）三档卡边。hub 判定常用 degree（连边数），或 CytoHubba 的 MCC/closeness/bottleneck 等中心性算法——不同算法给出的 top10 不完全重合，取交集更稳。陷阱：文本挖掘与共表达贡献的边是间接证据，「热门基因」会被推成假 hub；某基因 degree 高还可能只因为它研究得多。判 hub 前先和背景度分布比一比。\n\n【和生信分析的连接】课题实验 3 的标准动作：WGCNA hub list（method-33）→ STRING 限物种、卡 0.7 高置信 → Cytoscape 导入 → CytoHubba MCC 取 top10 → 这才是分子对接的最终靶点短名单（method-29）。两道手工清理别忘：分泌蛋白（如 Fga）剔出对接名单；同一基因家族冗余成员合并考虑。",
    keyPoints: [
      "STRING 边 = 七类证据加权，不是实测结合",
      "0.4 / 0.7 / 0.9 是三档常用置信阈值",
      "hub 用 degree 与 MCC 交叉验证，别只看连线好看",
      "热门基因 ≠ 真 hub，要对照背景度分布"
    ],
    testYourself: "一个基因被 WGCNA 判为 hub，导入 STRING 后 degree=0——可能是什么原因？这一步该查什么再下结论？",
    links: ["method-33", "method-31", "method-29", "k4-10"]
  },
  {
    id: "regen-24", domain: "regen", domainName: "肝脏再生", level: "进阶",
    title: "细胞外囊泡：肝损伤-再生对话里的「漂流瓶」与药筛新载体",
    tags: ["extracellular vesicles", "exosomes", "RAB27", "CD63", "intercellular communication", "liver"],
    summary: "细胞用 30-150 nm 的小囊泡给邻居「快递」miRNA 和蛋白——肝细胞、Kupffer、HSC 之间都在用，也是无细胞疗法的候选载体。",
    body: "【主线】细胞外囊泡（EV）家族中，外泌体（exosome，多泡体内体来源，30-150 nm）与微囊泡（microvesicle，质膜出芽，100-1000 nm）出身不同，文献里常被混称。EV 携带 miRNA/lncRNA、蛋白与脂质，被受体细胞内吞后改写其行为：损伤肝细胞的 EV 能让巨噬细胞极化，间充质基质细胞来源的 EV 在多种肝损伤模型里减轻纤维化——这是「无细胞疗法」的热点：比输活细胞安全、可冻存运输，但剂量标准化与靶向递送仍是坎。发货机器有遗传学抓手：RAB27A/B 控分泌，CD63/CD81/ALIX 是常用标志。\n\n【和生信分析的连接】纯计算课题里 EV 的三条用法：①在 scRNA 里看 EV 机器基因（RAB27A/B、CD63、CD81、ALIX/PDCD6IP）在哪些细胞群高表达，推断「谁在发货、谁可能收货」；②把数据库收录的 EV 富集 miRNA 靶基因与自己的差异基因/hub 取交集，看「快递内容」是否落在自己的损伤轴上；③给老药筛选加一条机制解释支线——候选药是否「上调保护性 EV 信号 / 下调促纤维化 EV」。方向验证可配 CellChat（method-07）的通路-受体推断。",
    keyPoints: [
      "EV = 细胞间快递，货是 miRNA/蛋白/脂质",
      "外泌体（内体来源）与微囊泡（膜出芽）出身不同",
      "RAB27A/B、CD63 是数据里能抓的「快递机器」",
      "无细胞疗法热但标准化未解决，别当定论引用"
    ],
    testYourself: "scRNA 里肝细胞群 RAB27B/CD63 高表达、巨噬细胞群却富集 EV 靶基因的响应信号——这提示什么通讯方向？用 CellChat 怎么设计验证？",
    links: ["tme-03", "regen-23", "method-07", "regen-01"]
  }
];
