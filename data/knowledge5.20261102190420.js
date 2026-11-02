/* 嵩山一号 · 工作站 —— 知识库扩展：生物学机制全覆盖（第 5 批，k5 系列）
   目标：把「所有生物学相关的」主要机制家族补齐，参照人卫教材体系（细胞生物/生理/生化/
   病理/药理/免疫）。覆盖：细胞死亡五大亚型 + 交叉对话 / 八条主信号通路 / 四类代谢分支 /
   细胞器与蛋白稳态（线粒体动力学·ER应激·UPS·分子伴侣）/ 表观与转录（组蛋白·非编码RNA·
   染色质重塑）/ 细胞周期与DNA损伤 / 炎症小体 / 肠肝轴 / 血管生成 / 细胞粘附与ECM /
   旁自内分泌 / 肝纤维化 / 胆汁酸肠肝循环。每条给可检索英文标签，便于挂真实文献。 */
window.SX_KNOWLEDGE5 = [
  {
    id: "k5-01", domain: "death", domainName: "细胞死亡", level: "进阶",
    title: "铁死亡：GPX4 失守后的脂质过氧化雪崩",
    tags: ["ferroptosis", "GPX4", "ACSL4", "lipid peroxidation", "glutathione", "iron metabolism"],
    summary: "铁依赖、脂质过氧化驱动的非凋亡性死亡，在药物性肝损伤、缺血再灌注、MASLD/MASH 里极关键。",
    body: "【主线】铁死亡的核心是谷胱甘肽过氧化物酶 GPX4 失效 → 细胞膜多不饱和脂肪酸（尤其 ACSL4 活化的花生四烯酸磷脂）无法被还原 → 脂质过氧化物 LOOH 累积 → 膜破裂死亡。铁（Fe2+）经 Fenton 反应放大 ROS，是「铁依赖」来源；System Xc-（SLC7A11/SLC3A2）摄入胱氨酸合成 GSH，是其上游开关。\n\n【关键】与凋亡不同：不依赖 caspase、不形成凋亡小体，形态上是线粒体皱缩、膜密度增高。诱导剂 erastin/RSL3、抑制剂 ferrostatin-1/liproxstatin 是研究利器。肝细胞 GPX4 敲除即自发脂肪性肝炎，说明它是 MASH 驱动之一。\n\n【和生信分析的连接】用 FerrDb 等「铁死亡基因集」做 GSEA；看 GPX4、SLC7A11、ACSL4、FTH1 表达与互作；bulk 里 ACSL4 高 + GPX4 低提示铁死亡倾向；单细胞可算每细胞铁死亡评分。",
    keyPoints: [
      "GPX4 失守 + 铁依赖 ROS = 铁死亡主因",
      "System Xc-/SLC7A11 是上游胱氨酸摄入开关",
      "不依赖 caspase，形态以线粒体皱缩为特征",
      "肝脏里与 DILI、MASH、缺血再灌注强相关"
    ],
    testYourself: "某药物处理后 SLC7A11 下调、ACSL4 上调，从铁死亡角度判断它是保护还是促死？",
    links: ["k5-02", "k4-06", "k4-08", "death-09"]
  },
  {
    id: "k5-02", domain: "death", domainName: "细胞死亡", level: "进阶",
    title: "焦亡：Gasdermin 打洞的炎性程序性死亡",
    tags: ["pyroptosis", "gasdermin", "caspase-1", "inflammasome", "IL-1beta", "NLRP3"],
    summary: "焦亡是 caspase-1/11 切割 Gasdermin D 在质膜打孔、伴随 IL-1β/IL-18 释放的炎性死亡，是先天免疫的利刃。",
    body: "【主线】病原体相关分子模式（PAMP）或损伤相关模式（DAMP）激活炎症小体（如 NLRP3）→ 招募 ASC、活化 caspase-1 → 一方面切割 pro-IL-1β/pro-IL-18 成熟释放，另一方面切割 Gasdermin D（GSDMD）→ 其 N 端寡聚在质膜成孔 → 细胞肿胀、内容物（包括警报素）喷出，即焦亡。 caspase-11（鼠）/caspase-4/5（人）可直接识别胞质 LPS 走非经典途径。\n\n【关键】焦亡是「炎性」死亡：它放大免疫、招募中性粒细胞，但失控会致组织损伤（如急性肝炎、脓毒症）。GSDMD 孔可被 GSDME 在凋亡转导下替代执行。\n\n【和生信分析的连接】看 caspase-1、GSDMD、IL1B、IL18 及 NLRP3 炎症小体组件共表达；用「炎性死亡签名」做 GSEA；bulk 中 IL1B/IL18 高且 GSDMD 高提示焦亡活跃。",
    keyPoints: [
      "炎症小体→caspase-1→GSDMD 成孔是核心轴",
      "边死边释放 IL-1β/IL-18，属炎性死亡",
      "非经典途径由 caspase-4/5/11 识别胞质 LPS",
      "失控焦亡驱动急性肝炎、脓毒症等组织损伤"
    ],
    testYourself: "一个肝炎样本里 IL1B 很高但 GSDMD 不高，能否断定没有焦亡？还可能是什么死亡亚型混在其中？",
    links: ["k5-28", "k5-01", "immune-11", "k4-17"]
  },
  {
    id: "k5-03", domain: "death", domainName: "细胞死亡", level: "进阶",
    title: "坏死性凋亡：RIPK1/3-MLKL 的受控坏死",
    tags: ["necroptosis", "RIPK1", "RIPK3", "MLKL", "TNF", "cell death"],
    summary: "当 caspase-8 被抑制时，TNF 等可通过 RIPK1/3-MLKL 轴诱导一种有调控的、坏死样死亡，是凋亡的备份通道。",
    body: "【主线】TNF 结合 TNFR1 → 形成复合物 I（存活/NF-κB）；若 caspase-8 不足，RIPK1 与 RIPK3 通过 RHIM 结构域结合成「坏死小体（necrosome）」→ 磷酸化 MLKL → MLKL 寡聚转位至质膜成孔 → 坏死样死亡。这是细胞在凋亡被阻断时的「死亡兜底」。\n\n【关键】坏死性凋亡兼具坏死的形态（肿胀、膜破）和凋亡的调控性；在病毒性肝炎、缺血再灌注、炎症性肠病中被证实参与。抑制 MLKL 是核心干预点。\n\n【和生信分析的连接】看 RIPK1/RIPK3/MLKL 表达与磷酸化相关签名；与凋亡签名（CASP8、BCL2L1）做负相关解读；用「坏死性凋亡基因集」GSEA 评估通路活性。",
    keyPoints: [
      "caspase-8 受抑时 RIPK1/3-MLKL 接管死亡",
      "MLKL 磷酸化寡聚是执行终环",
      "形态像坏死，机制是受控的",
      "病毒性肝炎/缺血再灌注里被证实参与"
    ],
    testYourself: "用 caspase 抑制剂处理细胞后死亡反而增加，从坏死性凋亡角度怎么解释？该用哪类抑制剂验证？",
    links: ["k5-01", "k5-02", "k5-05", "death-09"]
  },
  {
    id: "k5-04", domain: "death", domainName: "细胞死亡", level: "进阶",
    title: "铜死亡：FDX1 与脂酰化 TCA 酶的铜依赖死亡",
    tags: ["cuproptosis", "FDX1", "lipoylation", "copper", "DLAT", "cell death"],
    summary: "铜死亡是 2022 年新定义的死亡方式：过量铜直接结合脂酰化线粒体酶，致蛋白毒性应激聚集而死亡。",
    body: "【主线】细胞内游离铜异常升高时，铜离子直接结合线粒体 TCA 循环中的脂酰化蛋白（如 DLAT、DLST 的硫辛酰化位点），使这些酶异常寡聚、聚集，并抑制呼吸链（FDX1 是脂酰化的上游调节者，也参与）。这种蛋白毒性应激触发一种不同于凋亡/铁死亡的快速死亡。\n\n【关键】铜死亡依赖「脂酰化」这一翻译后修饰，因此代谢状态（TCA 活性、硫辛酸代谢）决定敏感性；与铁死亡的铁依赖、GPX4 轴心完全无关，是独立机制。\n\n【和生信分析的连接】看 FDX1、DLAT、DLST 及硫辛酸代谢基因；用「铜死亡签名」GSEA；可算铜死亡评分并与铁死亡评分并列比较，避免把两种死亡混为一谈。",
    keyPoints: [
      "铜直接结合脂酰化 DLAT/DLST 致蛋白聚集",
      "FDX1 是脂酰化上游，决定敏感性",
      "依赖 TCA/硫辛酸代谢状态",
      "与铁死亡机制完全独立，需分开评分"
    ],
    testYourself: "一个样本铜死亡签名高但铁死亡签名低，治疗上能不能用 ferrostatin-1 挽救？为什么？",
    links: ["k5-01", "k4-08", "metab-07", "death-09"]
  },
  {
    id: "k5-05", domain: "death", domainName: "细胞死亡", level: "基础",
    title: "凋亡细化：内源/外源双途径与 Bcl-2 家族天平",
    tags: ["apoptosis", "caspase", "Bcl-2", "mitochondria", "cytochrome c", "death receptor"],
    summary: "凋亡是 caspase 级联驱动的受控死亡，分死亡受体（外源）和线粒体（内源）两条途径，由 Bcl-2 家族定生死。",
    body: "【主线】外源途径：FasL/TNF 结合死亡受体 → 招募 FADD → 活化 caspase-8 → 直接切割 caspase-3。内源途径：DNA 损伤/生长因子撤除等 → BH3-only 蛋白（BIM/PUMA）激活 BAX/BAK → 线粒体外膜透化（MOMP）→ 细胞色素 c 释放 → 凋亡体（Apaf-1+caspase-9）形成 → caspase-3。BCL-2/BCL-XL 抗凋亡、BAX/BAK 促凋亡，二者平衡决定细胞命运。\n\n【关键】凋亡是发育、免疫稳态、化疗敏感性的核心；caspase-3 是共同执行者。凋亡失败 → 癌变或耐药；过度凋亡 → 退行/组织萎缩。\n\n【和生信分析的连接】用 apoptosis 基因集 GSEA；看 BCL2/BCL2L1（抗）vs BAX/BAK1/PUMA（促）比值；bulk 里 CASP3 与 PARP 切割相关基因共变可提示活性。",
    keyPoints: [
      "外源走死亡受体→caspase-8；内源走线粒体→caspase-9",
      "Bcl-2 家族天平（抗/促）定生死",
      "caspase-3 是共同执行者",
      "凋亡失衡关联癌变、耐药与退行性疾病"
    ],
    testYourself: "BCL2 高表达但 BAX 也高，单看其中一个能判断凋亡倾向吗？为什么要用比值？",
    links: ["k5-03", "k5-27", "cancer-08", "k4-08"]
  },
  {
    id: "k5-06", domain: "death", domainName: "细胞死亡", level: "进阶",
    title: "细胞死亡的交叉对话：PANoptosis 与可塑性",
    tags: ["PANoptosis", "crosstalk", "innate immunity", "ZBP1", "cell death", "pyroptosis"],
    summary: "多种死亡方式并非孤立，炎症小体可同时激活焦亡/凋亡/坏死性凋亡形成 PANoptosome，呈现高度可塑性。",
    body: "【主线】传统认为凋亡、焦亡、坏死性凋亡各走各路，但近年发现 ZBP1、RIPK1、caspase-8 等分子能把三者耦合进「PANoptosome」复合体，在病毒感染、干扰素信号下同时触发三种死亡（PANoptosis）。这意味着一个刺激可多路并进，单一抑制剂常挡不住。\n\n【关键】死亡的「可塑性」提醒我们：机制研究不能只盯一个通路。治疗上常需组合抑制（如 caspase 抑制剂 + MLKL 抑制剂）。\n\n【和生信分析的连接】同时挂焦亡/凋亡/坏死性凋亡三套基因集做 GSEA，比较活性强弱；看 ZBP1、RIPK1、CASP8 共表达；用多死亡评分联合建模，比单一评分更贴近真实表型。",
    keyPoints: [
      "PANoptosome 可同时触发三种死亡",
      "ZBP1/RIPK1/caspase-8 是耦合节点",
      "单一死亡抑制剂常挡不住多路并进",
      "生信应多死亡签名联合，勿单打一"
    ],
    testYourself: "你用 GSEA 只看到凋亡签名显著，能否排除样本里没有焦亡？该怎么改进分析？",
    links: ["k5-02", "k5-03", "k5-05", "immune-11"]
  },
  {
    id: "k5-07", domain: "signaling", domainName: "信号通路", level: "基础",
    title: "MAPK/ERK 通路：RAS-RAF-MEK-ERK 的生长增殖轴",
    tags: ["MAPK", "ERK", "RAS", "RAF", "MEK", "proliferation"],
    summary: "MAPK/ERK 是把生长因子信号传到核内、驱动增殖分化的经典三级激酶 cascade，也是肿瘤高频突变轴。",
    body: "【主线】生长因子（EGF 等）结合 RTK → 活化 RAS（GDP→GTP）→ 招募 RAF（ARAF/BRAF/CRAF）→ 磷酸化 MEK1/2 → 磷酸化 ERK1/2 → 入核磷酸化转录因子（ELK1、MYC 等）驱动增殖。该轴还有 JNK/p38 两支（应激相关），与 ERK 分工。\n\n【关键】RAS/RAF 在多种癌症高频突变（如 BRAF V600E），是靶向药（BRAF/MEK 抑制剂）的靶点；但反馈环路（如ERK 负反馈 SHP2）常致耐药。\n\n【和生信分析的连接】用 KEGG MAPK 基因集 GSEA；看 EGFR-RAS-RAF-MEK-ERK 上下游共表达链；突变数据里关注 BRAF/RAS 状态；ERK 活性可用下游靶（DUSP 家族、FOS）近似评分。",
    keyPoints: [
      "RTK→RAS→RAF→MEK→ERK 三级 cascade 驱动增殖",
      "RAS/BRAF 高频突变，是靶向药靶点",
      "ERK 负反馈常导致靶向药耐药",
      "JNK/p38 是应激分支，与 ERK 分工"
    ],
    testYourself: "BRAF 抑制剂单用后 ERK 活性出现反弹，从反馈环路角度解释并给出联合用药思路。",
    links: ["k5-08", "k5-09", "k4-11", "cancer-08"]
  },
  {
    id: "k5-08", domain: "signaling", domainName: "信号通路", level: "基础",
    title: "JAK/STAT 通路：细胞因子到核内的直通车",
    tags: ["JAK-STAT", "JAK", "STAT", "cytokine", "interferon", "IL-6"],
    summary: "JAK/STAT 是干扰素、白介素等细胞因子最简洁的信号链：受体结合→JAK 磷酸化→STAT 二聚入核。",
    body: "【主线】细胞因子（IFN、IL-6、IL-2 等）结合 II 型细胞因子受体 → 受体相关 JAK（JAK1/2/3、TYK2）互相磷酸化 → 招募并磷酸化 STAT（STAT1/3/5 等）→ STAT 形成二聚体入核 → 调控靶基因。该通路短平快，是免疫与急性期反应的主干。\n\n【关键】STAT3 持续活化与肿瘤、炎症慢性化强相关；JAK 抑制剂（托法替布）已用于自身免疫病。负调控来自 SOCS 蛋白与 PIAS。\n\n【和生信分析的连接】用 interferon-γ/IL-6 response 基因集 GSEA；看 JAK-STAT 上下游（如 IL6→STAT3→SOCS3）共表达；STAT3 靶签名（MYC、BCL2L1、CCND1）可近似活性评分。",
    keyPoints: [
      "细胞因子→JAK→STAT 二聚入核，链路极短",
      "STAT3 持续活化关联肿瘤与慢性炎症",
      "SOCS 是负反馈刹车",
      "JAK 抑制剂已是自身免疫病常用药"
    ],
    testYourself: "IL-6 高但 STAT3 靶基因不高，可能卡在通路的哪一环？生信上如何区分「配体高」与「通路活化」？",
    links: ["k5-09", "k5-21", "immune-11", "k3-02"]
  },
  {
    id: "k5-09", domain: "signaling", domainName: "信号通路", level: "基础",
    title: "NF-κB 通路：炎症与存活的总开关",
    tags: ["NF-kB", "NFKB", "IKB", "inflammation", "survival", "cytokine"],
    summary: "NF-κB 是调控炎症、免疫、抗凋亡基因的核心转录因子，静息时被 IκB 锁在胞质，激活后入核。",
    body: "【主线】经典途径：TNF/IL-1/TLR 等激活 IKK 复合体 → 磷酸化 IκBα → IκB 被泛素化降解 → NF-κB（p50/p65） dimer 入核 → 启动 IL-6、TNF、BCL2L1 等靶基因。非经典途径经 NIK-IKKα 调控 p52/RelB，主要在淋巴细胞发育。\n\n【关键】NF-κB 同时促炎又促存活，是「慢性炎症→肿瘤」的关键桥；抑制它可抗炎但也削弱免疫监视。\n\n【和生信分析的连接】用 HALLMARK TNF-NF-κB signaling 基因集 GSEA；看 IκBα（NFKBIA）低 + 靶基因（TNF、IL6、BCL2L1）高提示活化；可算 NF-κB 活性评分与炎症签名叠加分析。",
    keyPoints: [
      "IκB 降解释放 NF-κB 入核是经典激活",
      "同时促炎 + 促存活，是炎症-肿瘤之桥",
      "非经典途径经 NIK-IKKα 调控 p52/RelB",
      "抑制需权衡抗炎与免疫监视"
    ],
    testYourself: "NFKBIA（IκBα）mRNA 升高但 NF-κB 靶基因也升高，矛盾吗？该看蛋白还是看反馈？",
    links: ["k5-08", "k5-28", "immune-11", "k4-17"]
  },
  {
    id: "k5-10", domain: "signaling", domainName: "信号通路", level: "基础",
    title: "TGF-β/Smad 通路：纤维化的总指挥",
    tags: ["TGF-beta", "TGFB", "Smad", "fibrosis", "EMT", "TGFBR"],
    summary: "TGF-β 通过 Smad 把信号送入核，是纤维化、EMT、免疫抑制的核心驱动，也是肝癌不良预后因素。",
    body: "【主线】TGF-β 结合 TβRII→招募 TβRI（ALK5）→磷酸化 R-Smad（Smad2/3）→与 Smad4 形成复合体入核→调控纤维化和生长停滞靶基因。Smad7 是抑制性 I-Smad 作负反馈。平行 MAPK/PI3K 支路也参与。\n\n【关键】TGF-β 双相：早期抑癌（生长停滞），晚期促纤维化、EMT、免疫逃逸；在肝纤维化里它是 HSC 活化的最强诱因。\n\n【和生信分析的连接】用 HALLMARK TGF-β signaling 基因集 GSEA；看 TGFB1 与 SMAD 靶（COL1A1、SERPINE1、PAI-1）共表达；可和 WNT、YAP 签名一起做「EMT 评分」。",
    keyPoints: [
      "TGF-β→Smad2/3-Smad4 入核驱动纤维化",
      "双相：早期抑癌，晚期促纤维化/EMT/逃逸",
      "Smad7 是负反馈 I-Smad",
      "肝纤维化里是 HSC 活化最强诱因"
    ],
    testYourself: "想用转录组证明某药抗纤维化，除了看 COL1A1 下降，还应看 TGF-β 通路哪些节点才叫「机制明确」？",
    links: ["k4-17", "k5-11", "k4-10", "tme-05"]
  },
  {
    id: "k5-11", domain: "signaling", domainName: "信号通路", level: "进阶",
    title: "Notch 通路：细胞命运与边界的决定者",
    tags: ["Notch", "Delta", "Jagged", "Hes", "cell fate", "differentiation"],
    summary: "Notch 是相邻细胞间直接接触的侧向信号，决定干/祖细胞的分化方向与组织边界，在肝胆管命运里关键。",
    body: "【主线】信号细胞表达 DSL 配体（Delta/Jagged）→ 结合邻近细胞 Notch 受体 → ADAM 金属蛋白酶 + γ-分泌酶依次切割释放 Notch 胞内段（NICD）→ NICD 入核与 CSL 结合 → 激活 HES/HEY 靶基因，抑制分化、维持祖状态或指定特定谱系。\n\n【关键】Notch 是「侧向抑制」经典机制：表达配体的细胞压制邻居的同向分化，形成斑驳边界。在肝胆系统，Notch 高推胆管命运、低推肝细胞命运；异常激活关联胆管癌。\n\n【和生信分析的连接】看 NICD 靶（HES1、HEY1）与 Notch 配体/受体共表达；用 Notch target 基因集 GSEA；单细胞里可追踪 Notch hi 的祖细胞群边界。",
    keyPoints: [
      "相邻细胞直接接触的 DSL-Notch 侧向信号",
      "NICD 入核调控 HES/HEY，决定分化方向",
      "侧向抑制形成组织斑驳边界",
      "肝胆里 Notch 高=胆管命运，低=肝细胞命运"
    ],
    testYourself: "肝损伤后胆管反应区 Notch 靶基因升高，这支持「胆管化生」还是「肝细胞再生」？",
    links: ["k4-04", "k4-10", "k5-10", "regen-04"]
  },
  {
    id: "k5-12", domain: "signaling", domainName: "信号通路", level: "进阶",
    title: "Hedgehog 通路：发育程序的再激活与纤维化",
    tags: ["Hedgehog", "SHH", "GLI", "Patched", "fibrosis", "development"],
    summary: "Hedgehog 在成体本应静默，其再激活驱动组织修复、纤维化与某些肿瘤，是发育程序的成人回响。",
    body: "【主线】静息时 Patched（PTCH1）抑制 Smoothened（SMO）；Hedgehog 配体结合 PTCH1 解除抑制 → SMO 活化 → 解除对 GLI 转录因子的抑制 → GLI 入核驱动靶基因（包括 PTCH1 自身反馈）。成体肝中 Hedgehog 主要由损伤肝细胞/胆管细胞分泌，作用于 HSC 与祖细胞。\n\n【关键】Hedgehog 再激活是肝纤维化与胆管反应的重要旁分泌信号；在基底细胞癌、髓母细胞瘤里是驱动突变所在（SMO/PTCH1 突变）。\n\n【和生信分析的连接】用 Hedgehog target（GLI1、PTCH1、HHIP）基因集 GSEA；看 SHH/IHH 配体与 HSC 活化签名共变；可算 Hedgehog 活性评分与 TGF-β 评分联用。",
    keyPoints: [
      "PTCH1 抑制 SMO，配体结合后解除→GLI 入核",
      "成体静默、损伤后再激活驱动修复与纤维化",
      "SMO/PTCH1 突变驱动某些肿瘤",
      "在肝是 HSC/祖细胞的重要旁分泌信号"
    ],
    testYourself: "成体肝里检测到 GLI1 高，但 SHH 不高，可能说明什么（自分泌 vs 旁分泌 vs 非经典激活）？",
    links: ["k4-17", "k4-04", "k5-10", "k5-11"]
  },
  {
    id: "k5-13", domain: "signaling", domainName: "信号通路", level: "进阶",
    title: "GPCR / cAMP-PKA 通路：最大受体超家族的快慢信号",
    tags: ["GPCR", "cAMP", "PKA", "G-protein", "beta-catenin", "signal transduction"],
    summary: "GPCR 是最大药物靶点家族，经 Gs/Gi/Gq 分叉为 cAMP-PKA 与 IP3/Ca2+ 两大二级信使系统。",
    body: "【主线】配体结合 GPCR → 换能 G 蛋白（Gs 升 cAMP、Gi 降 cAMP、Gq 升 IP3/DAG/Ca2+）→ cAMP 激活 PKA → 磷酸化 CREB 等调控代谢与基因；Gq 支则经 PLC→IP3 释钙、PKC 活化。同一受体可经 β-arrestin 走非经典通路。\n\n【关键】肝脏有众多 GPCR（肾上腺素、胰高血糖素、趋化因子受体）；cAMP-PKA 是糖异生、脂解的关键开关；GPCR 是约 1/3 上市药的靶点。\n\n【和生信分析的连接】看 cAMP/PKA 靶（CREB 靶、PGC1A 相关）基因集 GSEA；配体-受体分析中 GPCR 家族可作通讯对；用二级信使相关签名评估通路活性。",
    keyPoints: [
      "Gs/Gi/Gq 分叉为 cAMP-PKA 与 IP3-Ca2+ 两系",
      "β-arrestin 介导非经典 GPCR 信号",
      "cAMP-PKA 是糖异生/脂解关键开关",
      "GPCR 是最大药物靶点超家族"
    ],
    testYourself: "用转录组判断某 GPCR 是 Gs 还是 Gi 型激活，该看 cAMP 下游哪类靶基因的方向？",
    links: ["k5-19", "k4-08", "immune-11", "k5-07"]
  },
  {
    id: "k5-14", domain: "signaling", domainName: "信号通路", level: "基础",
    title: "HIF-1α / 缺氧信号：低氧下的生存重编程",
    tags: ["HIF-1alpha", "hypoxia", "VEGF", "angiogenesis", "oxygen", "HIF"],
    summary: "缺氧时 HIF-1α 稳定入核，全面重编程糖酵解、血管生成与存活，是肿瘤与组织缺血的核心适应机制。",
    body: "【主线】常氧下 HIF-1α 被脯氨酰羟化酶（PHD）羟化 → 被 VHL 识别泛素化降解。缺氧时 PHD 失活 → HIF-1α 稳定、入核与 HIF-1β 结合 → 激活糖酵解（GLUT1、LDHA）、血管生成（VEGF）、红细胞生成等靶基因。\n\n【关键】HIF 让细胞在缺氧气下「改吃糖、造血管、抗凋亡」。肿瘤利用它逃逸缺血、促血管生成；肝脏缺血再灌注、纤维化也见 HIF 异常。\n\n【和生信分析的连接】用 HALLMARK HYPOXIA 基因集 GSEA（含 VEGFA、LDHA、SLC2A1）；看 HIF 靶签名与糖酵解/血管生成签名共变；可算缺氧评分叠加空间分区分带解读。",
    keyPoints: [
      "常氧 PHD-VHL 降解 HIF-1α；缺氧则稳定入核",
      "重编程糖酵解、血管生成、抗凋亡",
      "肿瘤靠它逃逸缺血并促血管生成",
      "肝缺血再灌注/纤维化里亦见异常"
    ],
    testYourself: "空间转录组中央带 HIF 靶高、门管带低，符合分区理论吗？什么情况下会反过来？",
    links: ["k4-01", "k5-30", "k4-06", "regen-02"]
  },
  {
    id: "k5-15", domain: "metab", domainName: "代谢与胆汁", level: "进阶",
    title: "谷氨酰胺代谢：碳氮双供的「细胞汽油」",
    tags: ["glutamine", "glutaminolysis", "GLS", "TCA cycle", "alpha-ketoglutarate", "metabolism"],
    summary: "谷氨酰胺经谷氨酰胺酶转为谷氨酸、再转 α-酮戊二酸回补 TCA，为快速增殖细胞供碳、供氮、供抗氧化前体。",
    body: "【主线】谷氨酰胺是血浆最丰富游离氨基酸。GLS（谷氨酰胺酶）将其转为谷氨酸，谷氨酸经 GLUD1 或转氨转为 α-酮戊二酸（α-KG）回补 TCA（「回补反应 anaplerosis」）。这条 glutaminolysis 为增殖细胞提供能量、生物合成碳骨架与谷胱甘肽前体（半胱氨酸来自谷氨酸-半胱氨酸连接）。\n\n【关键】癌细胞（尤其 MYC 驱动）高度依赖谷氨酰胺，GLS 抑制剂是抗癌热点；它与 Warburg（糖酵解）互补供能。α-KG 还是表观修饰酶（去甲基化酶）的辅因子，把代谢与表观连起来。\n\n【和生信分析的连接】看 GLS、GLUD1、ASS1 及 TCA 回补相关基因；用 glutamine metabolism 基因集 GSEA；可把谷氨酰胺签名与糖酵解签名并列，刻画「代谢表型」。",
    keyPoints: [
      "谷氨酰胺→谷氨酸→α-KG 回补 TCA",
      "为增殖细胞供碳、氮、抗氧化前体",
      "MYC 驱动癌高度依赖，GLS 是靶点",
      "α-KG 桥接代谢与表观去甲基化"
    ],
    testYourself: "ASS1 低表达的肿瘤为何更依赖谷氨酰胺？生信上怎么用 GLS/ASS1 组合判断药物敏感性？",
    links: ["k4-06", "k5-16", "k5-23", "k5-17"]
  },
  {
    id: "k5-16", domain: "metab", domainName: "代谢与胆汁", level: "进阶",
    title: "脂肪酸 β-氧化与脂滴：能量的「蓄电池」",
    tags: ["fatty acid oxidation", "CPT1A", "lipid droplet", "beta-oxidation", "PLIN", "metabolism"],
    summary: "脂肪酸经 CPT1 入线粒体 β-氧化产能，多余脂质以脂滴（PLIN 包被）储存，失衡即脂肪变。",
    body: "【主线】脂肪酸活化成脂酰-CoA 后，由 CPT1（肉碱棕榈酰转移酶 1）搬运过线粒体外膜（受丙二酰-CoA 抑制，故 ACC 产物调控入口）→ 在线粒体基质经 β-氧化逐轮切下乙酰-CoA 供 TCA/酮体。盈余脂质以甘油三脂储于脂滴，由 PLIN 家族包被与调控水解。\n\n【关键】PPARα 是 β-氧化主转录开关；当 DNL（SREBP-1c）长期高于 β-氧化与 VLDL 输出 → 脂滴堆积 → 脂肪变（MASLD）。脂滴还是信号与蛋白质控平台。\n\n【和生信分析的连接】看 CPT1A、ACOX、PPARA（β-氧化）与 PLIN、FASN、SCD1（合成/脂滴）双向签名；用 fatty acid metabolism 基因集 GSEA；算「β-氧化/合成」比值评分。",
    keyPoints: [
      "CPT1 是脂肪酸入线粒体 β-氧化的闸门",
      "PPARα 是 β-氧化主开关",
      "脂滴（PLIN 包被）是脂质储能与信号平台",
      "DNL 长期高于氧化/输出 → 脂肪变"
    ],
    testYourself: "PPARA 高但 CPT1A 不高，能直接说 β-氧化活跃吗？转录与执行之间还差什么？",
    links: ["k4-06", "k5-15", "k5-17", "k5-19"]
  },
  {
    id: "k5-17", domain: "organelle", domainName: "细胞器与蛋白稳态", level: "进阶",
    title: "线粒体动力学：融合/分裂与线粒体自噬",
    tags: ["mitochondrial dynamics", "mitofusin", "DRP1", "mitophagy", "fission", "fusion"],
    summary: "线粒体通过 MFN/OPA1 融合与 DRP1 分裂维持网络形态，损伤时经 PINK1-Parkin 被线粒体自噬清除。",
    body: "【主线】融合由 MFN1/2（外膜）、OPA1（内膜）执行，连接不同线粒体的内容物、摊薄损伤；分裂由 DRP1 招募至外膜执行，利于隔离受损片段。当线粒体去极化（膜电位丧失），PINK1 稳定于外膜 → 招募 Parkin（E3）→ 泛素化外膜蛋白 → 被自噬受体（OPTN、NDP52）识别启动线粒体自噬（mitophagy）清除。\n\n【关键】融合/分裂失衡与衰老、神经退行、代谢病相关；DRP1 过度分裂致碎片化、能量崩溃。mitophagy 是质量控制的专用通道。\n\n【和生信分析的连接】看 MFN1/2、OPA1、DRP1、PINK1、PARK2 表达；用 mitochondrial fission/fusion、mitophagy 基因集 GSEA；可算「线粒体健康评分」与氧化磷酸化签名联用。",
    keyPoints: [
      "MFN/OPA1 融合，DRP1 分裂，维持网络",
      "去极化触发 PINK1-Parkin 线粒体自噬",
      "分裂过度→碎片化→能量崩溃",
      "是细胞器质量控制专用通道"
    ],
    testYourself: "PINK1 高但 Parkin 不高，能否判断线粒体自噬在进行？生信如何区分「损伤信号」与「清除执行」？",
    links: ["k5-15", "k5-21", "k5-26", "k4-08"]
  },
  {
    id: "k5-18", domain: "metab", domainName: "代谢与胆汁", level: "进阶",
    title: "一碳代谢与叶酸循环：甲基化的货币工厂",
    tags: ["one-carbon metabolism", "folate", "SAM", "methionine", "methylation", "SHMT"],
    summary: "一碳单位经叶酸/甲硫氨酸循环生成 SAM——体内最重要的甲基供体，直接连到 DNA/蛋白甲基化。",
    body: "【主线】膳食叶酸经 DHFR、SHMT 等转化为四氢叶酸载体上的一碳单位；与甲硫氨酸循环耦联：同型半胱氨酸 + 5-甲基-THF → 甲硫氨酸（由 MTR 催化）→ SAM（甲基供体）→ 甲基化反应后变 SAH → 再循环。SAM 是 DNA、RNA、蛋白、磷脂甲基化的统一货币。\n\n【关键】一碳代谢把「营养」直接变成「表观修饰力」。叶酸缺乏或 MTHFR 多态 → SAM 不足 → 全局低甲基化（伴某些位点高甲基化），关联发育、心血管与肿瘤。\n\n【和生信分析的连接】看 SHMT、MTHFR、MTR、MAT1A（肝 SAM 合成）表达；与 DNA 甲基化阵列或甲基化签名交叉验证；可把一碳代谢活性与表观修饰签名关联建模。",
    keyPoints: [
      "叶酸/甲硫氨酸循环产出 SAM 这一甲基货币",
      "SAM 是 DNA/RNA/蛋白统一甲基供体",
      "MTHFR 多态或叶酸缺→全局低甲基化",
      "把营养状态直接桥接到表观修饰"
    ],
    testYourself: "MTHFR 慢代谢基因型个体，在转录组上不一定看到差异却在甲基化阵列上显著，为什么？生信该怎么联合看？",
    links: ["k5-23", "k5-15", "k4-06", "k5-25"]
  },
  {
    id: "k5-19", domain: "metab", domainName: "代谢与胆汁", level: "基础",
    title: "糖异生与糖原代谢：血糖的肝内调度",
    tags: ["gluconeogenesis", "glycogen", "G6Pase", "PEPCK", "glucose", "liver metabolism"],
    summary: "肝脏通过糖异生（PEPCK/G6Pase）与糖原分解/合成维持血糖恒定，是代谢稳态的中枢调度器。",
    body: "【主线】饥饿时胰高血糖素/cAMP-PKA 与糖皮质激素上升 → 诱导 PEPCK、G6Pase 等糖异生酶 → 把乳酸、甘油、生糖氨基酸转为葡萄糖释放入血；同时胰高血糖素抑制糖原合成、促进糖原分解（GP 磷酸化酶）。胰岛素反向抑制糖异生、促进糖原合成（GS 激酶）。\n\n【关键】糖异生是肝独有（肾也可少量）；其失调关联空腹血糖、糖尿病与脂肪肝。G6Pase 缺陷即糖原累积病（von Gierke）。\n\n【和生信分析的连接】看 PEPCK（PCK1/2）、G6PC、GYS、PYGL 表达；用 gluconeogenesis 基因集 GSEA；可与胰岛素信号签名联用评估肝糖代谢状态。",
    keyPoints: [
      "PEPCK/G6Pase 是糖异生关键酶",
      "胰高血糖素升糖异生、胰岛素抑之",
      "肝是维持空腹血糖的中枢",
      "G6Pase 缺陷致糖原累积病"
    ],
    testYourself: "糖尿病肝样本里 PCK1 高但血胰岛素也高，该用「胰岛素抵抗」还是「代偿性上调」解读？生信如何区分？",
    links: ["k5-13", "k4-06", "k5-16", "k5-15"]
  },
  {
    id: "k5-20", domain: "organelle", domainName: "细胞器与蛋白稳态", level: "进阶",
    title: "内质网应激与未折叠蛋白反应（UPR）",
    tags: ["ER stress", "unfolded protein response", "PERK", "ATF6", "IRE1", "CHOP"],
    summary: "内质网蛋白折叠超载时，PERK/ATF6/IRE1 三条臂启动 UPR：先恢复稳态，失败则走向凋亡。",
    body: "【主线】错误折叠蛋白积累 → 三个跨膜感受器解离各自抑制物：PERK 磷酸化 eIF2α（全局翻译减速）、ATF6 切开入核、IRE1 剪接 XBP1。三者短期恢复折叠能力（上调 BiP/GRP78、折叠酶）；若持续，CHOP（由 PERK-ATF4 诱导）推动凋亡。\n\n【关键】UPR 是「先救后杀」的双相开关。在脂肪肝（脂毒）、放疗、某些药物毒性里 ER 应激是重要推手；XBP1 还与炎症、脂质代谢交叉。\n\n【和生信分析的连接】用 HALLMARK UNFOLDED PROTEIN RESPONSE 基因集 GSEA；看 HSPA5（BiP）、XBP1、DDIT3（CHOP）、ATF4 表达；可把 UPR 三臂分别评分看哪条占优。",
    keyPoints: [
      "PERK/ATF6/IRE1 三臂先恢复折叠后促凋亡",
      "CHOP 是持续应激走向死亡的执行者",
      "脂肪肝/放疗/药毒里 ER 应激是推手",
      "可与炎症、脂代谢签名交叉解读"
    ],
    testYourself: "HSPA5（BiP）高但 DDIT3（CHOP）不高，说明 UPR 处于哪一阶段？这时该期待修复还是死亡？",
    links: ["k5-21", "k5-22", "k4-08", "k5-05"]
  },
  {
    id: "k5-21", domain: "organelle", domainName: "细胞器与蛋白稳态", level: "基础",
    title: "泛素-蛋白酶体系统（UPS）：蛋白的定点拆解",
    tags: ["ubiquitin", "proteasome", "E3 ligase", "degradation", "UPS", "protein turnover"],
    summary: "UPS 用 E1-E2-E3 级联给蛋白贴泛素标签，送 26S 蛋白酶体降解，是调控蛋白水平最精细的开关。",
    body: "【主线】泛素激活酶 E1 → 结合酶 E2 → 连接酶 E3（决定特异性）把泛素从 C 端转移到靶蛋白赖氨酸；多聚泛素链（K48 为主）被 26S 蛋白酶体识别降解。不同泛素链（K63 等）还参与信号、自噬、DNA 修复。去泛素化酶（DUB）反向回收标签。\n\n【关键】UPS 控制细胞周期（cyclin 降解）、转录因子（IkB、HIF）、质控（错误折叠蛋白）。E3（如 MDM2 降解 p53）是药物热点（PROTAC 即借 E3 降解靶蛋白）。\n\n【和生信分析的连接】看 E3 连接酶（如 MDM2、FBXW7、β-TrCP）与靶基因共表达；用 ubiquitin-proteasome 基因集 GSEA；可分析 DUB 表达谱推断降解倾向。",
    keyPoints: [
      "E1-E2-E3 级联贴泛素，26S 蛋白酶体降解",
      "K48 链主降解，K63 链主信号/自噬",
      "控制周期、转录因子、蛋白质控",
      "E3 是 PROTAC 等新药的核心借力点"
    ],
    testYourself: "某癌里 MDM2 高、TP53 低，这支持「UPS 过度降解 p53」还是「TP53 突变」？生信怎么区分？",
    links: ["k5-26", "k5-27", "k5-22", "k5-05"]
  },
  {
    id: "k5-22", domain: "organelle", domainName: "细胞器与蛋白稳态", level: "基础",
    title: "蛋白稳态与分子伴侣：HSP 的折叠防线",
    tags: ["proteostasis", "chaperone", "HSP70", "HSP90", "heat shock", "protein folding"],
    summary: "分子伴侣（HSP70/90 等）协助蛋白正确折叠、防止聚集，是细胞对抗应激、维持蛋白组健康的防线。",
    body: "【主线】新生或应激解折叠的蛋白由 HSP70（协同 co-chaperone HSP40/DNAJB1、核苷酸交换因子）抓住并 ATP 依赖地重折叠；HSP90 守护大量信号蛋白（激酶、转录因子、受体）的成熟与稳定。未折叠则转 UPS 或自噬。整体平衡称蛋白稳态（proteostasis）。\n\n【关键】HSP90 抑制剂（如 geldanamycin）使客户蛋白降解，是抗癌策略；HSP 本身还是 DAMPs，参与免疫。衰老/疾病中 proteostasis 崩溃是共同特征。\n\n【和生信分析的连接】看 HSPA1A/HSP90AA1 等 chaperone 表达；用 HALLMARK HEAT SHOCK 基因集 GSEA；可把伴侣签名与 UPR、自噬签名合并成「蛋白稳态评分」。",
    keyPoints: [
      "HSP70/90 是折叠与成熟的两大主力",
      "HSP90 客户蛋白多为癌驱动，是靶点",
      "伴侣失败转 UPS/自噬清除",
      "proteostasis 崩溃是衰老/疾病共性"
    ],
    testYourself: "热休克基因集高，但 ER 应激签名不高，能说明是「蛋白毒性」还是「单纯应激预热」？怎么进一步区分？",
    links: ["k5-20", "k5-21", "k5-26", "k4-08"]
  },
  {
    id: "k5-23", domain: "epigen", domainName: "表观与转录", level: "进阶",
    title: "组蛋白修饰：乙酰化与甲基化的「组蛋白密码」",
    tags: ["histone acetylation", "HDAC", "HAT", "histone methylation", "chromatin", "epigenetics"],
    summary: "组蛋白尾巴的乙酰化/甲基化由 writer/eraser 动态调控，决定染色质开放与基因开关，是表观层的总旋钮。",
    body: "【主线】HAT 给组蛋白加乙酰基（中和正电、松染色质、促转录）；HDAC 去乙酰基（紧染色质、抑转录）。甲基化由 HMT（如 EZH2 写 H3K27me3、SUV39H 写 H3K9me3）与去甲基酶（KDM）调控，不同位点含义相反（H3K4me3 活化、H3K27me3 抑制）。这些标记构成「组蛋白密码」。\n\n【关键】表观修饰可逆、可作药（HDAC 抑制剂已用于血癌）；EZH2 突变/过表达推肿瘤；组蛋白密码与 DNA 甲基化、染色质重塑协同。\n\n【和生信分析的连接】用 HAT/HDAC、Polycomb（H3K27me3）靶基因集 GSEA；看 EZH2、HDAC 家族表达并与 RNA 水平关联；可把组蛋白修饰（若有无酶法数据）映射到开放/沉默区域。",
    keyPoints: [
      "HAT 松染色质、HDAC 紧染色质",
      "H3K4me3 活化、H3K27me3 抑制，含义相反",
      "表观可逆，HDAC/EZH2 抑制剂已成药",
      "与 DNA 甲基化、重塑协同成调控网"
    ],
    testYourself: "EZH2 高但 H3K27me3 靶基因没下降，可能意味着什么（write/read/erase 失衡）？",
    links: ["k5-24", "k5-18", "k5-25", "k4-06"]
  },
  {
    id: "k5-24", domain: "epigen", domainName: "表观与转录", level: "进阶",
    title: "非编码 RNA：miRNA / lncRNA / circRNA 的调控层",
    tags: ["miRNA", "lncRNA", "circRNA", "noncoding RNA", "post-transcriptional", "epigenetics"],
    summary: "非编码 RNA 不编码蛋白却广泛调控：miRNA 降解/抑制靶 mRNA，lnc/circ 作海绵、支架或表观引导。",
    body: "【主线】miRNA 由 Drosha/Dicer 加工成 ~22nt，加载 RISC（AGO2）引导互补 mRNA 降解或翻译抑制，是转录后「微调」。lncRNA 可在染色质水平（引导 PRC2 到位点）、转录水平（与 TF 互作）或转录后（ceRNA 海绵吸附 miRNA）调控。circRNA 闭环稳定、常作 miRNA sponge。\n\n【关键】三者构成庞大的转录后调控网，且互相嵌套（ceRNA 网络）。在肝里 miR-122 是肝细胞身份标志、与 HCV 生命周期相关；诸多 lnc 参与脂肪变与肝癌。\n\n【和生信分析的连接】用 miRNA target 富集（TargetScan/miRDB 背景集）；看 lnc/circ 与 mRNA 共表达推断 ceRNA；可把 miRNA 表达谱与 mRNA 反向相关联做「调控推断」。",
    keyPoints: [
      "miRNA 走 RISC 降解/抑制靶 mRNA",
      "lncRNA 多层面调控，常作 ceRNA 海绵",
      "circRNA 闭环稳定，多作 miRNA sponge",
      "miR-122 是肝细胞身份标志"
    ],
    testYourself: "发现某 lncRNA 与 miRNA X 和靶基因 Y 三者正相关，能否直接断定它是 ceRNA？还缺什么证据？",
    links: ["k5-23", "k5-25", "k4-06", "k5-18"]
  },
  {
    id: "k5-25", domain: "epigen", domainName: "表观与转录", level: "进阶",
    title: "染色质重塑与表观三件套协同",
    tags: ["chromatin remodeling", "SWI/SNF", "reader writer eraser", "nucleosome", "epigenetics"],
    summary: "ATP 依赖的重塑复合体（SWI/SNF）挪动核小体，与 writer/reader/eraser 共同决定基因可及性。",
    body: "【主线】染色质状态由三层协同决定：① DNA 甲基化（沉默）；② 组蛋白修饰（密码）；③ ATP 依赖重塑复合体（如 SWI/SNF、ISWI、CHD、INO80）消耗 ATP 滑动/弹出核小体改变可及性。表观「阅读器-书写器-擦除器」（reader-writer-eraser）循环维护这些标记。\n\n【关键】SWI/SNF 亚基（ARID1A/B、SMARCA2/4）频发突变于肿瘤，凸显重塑是癌_gatekeeper；表观药物常组合（去甲基化剂 + HDACi）以协同松染色质。\n\n【和生信分析的连接】结合 ATAC/DNAme/scATAC 数据看核小体定位与可及性；用 SWI/SNF target、Polycomb 靶基因集 GSEA；可把重塑复合体突变/表达与开放染色质特征关联。",
    keyPoints: [
      "重塑复合体挪核小体，决定可及性",
      "与 DNAme、组蛋白修饰三层协同",
      "SWI/SNF 亚基频发癌突变，是 gatekeeper",
      "表观药常组合以协同松染色质"
    ],
    testYourself: "ATAC 显示某增强子开放但基因不表达，问题更可能在「染色质」还是「转录机器」？生信下一步看什么？",
    links: ["k5-23", "k5-24", "k5-18", "k4-06"]
  },
  {
    id: "k5-26", domain: "cycle", domainName: "细胞周期与损伤", level: "基础",
    title: "细胞周期与检查点：CDK/cyclin 的钟摆",
    tags: ["cell cycle", "CDK", "cyclin", "checkpoint", "G1/S", "G2/M"],
    summary: "细胞周期由 cyclin 周期性升降驱动 CDK，经 G1/S、G2/M 两大检查点把控，是增殖与癌的核心节律。",
    body: "【主线】G1 期 Cyclin D-CDK4/6 磷酸化 Rb 释放 E2F → S 期基因；Cyclin E-CDK2 推过 G1/S 检查点；S 期 Cyclin A-CDK2 行 DNA 复制；G2/M 由 Cyclin B-CDK1 把控，受纺锤体检查点（SAC）监视。检查点激酶（CHK1/2）在损伤时叫停。\n\n【关键】周期机器失控即癌变（Cyclin D 扩增、CDK 过活、Rb 失活）；CDK4/6 抑制剂已是乳腺癌等标准疗法。检查点是放化疗诱导凋亡的「闸门」。\n\n【和生信分析的连接】用 cell cycle（G2M、E2F）基因集 GSEA；看 Cyclin/CDK 表达与 Rb-E2F 轴；可算增殖评分（Ki67/MKI67、TOP2A）与周期相位打分（Cyclin 表达推断 G1/S/G2）。",
    keyPoints: [
      "cyclin 升降驱动 CDK，过两大检查点",
      "Rb-E2F 轴是 G1→S 的总闸",
      "失控即癌变，CDK4/6 抑制剂已成药",
      "检查点是放化疗诱导死亡的闸门"
    ],
    testYourself: "某药把细胞拦在 G2/M，从 Cyclin B-CDK1 与 SAC 角度，你该去看哪些基因确认是真「拦在 G2」而非假象？",
    links: ["k5-27", "k5-21", "cancer-08", "k4-11"]
  },
  {
    id: "k5-27", domain: "cycle", domainName: "细胞周期与损伤", level: "基础",
    title: "DNA 损伤与修复（DDR）：基因组的守门人",
    tags: ["DNA damage", "ATM", "ATR", "DNA repair", "homologous recombination", "p53"],
    summary: "DNA 双链断裂激活 ATM/ATR-p53 轴：轻则暂停周期修复，重则 p53 启动衰老或凋亡，是放疗/化疗的根基。",
    body: "【主线】双链断裂（DSB）由 MRN 复合体感知 → 激活 ATM（及 ATR 应对复制压力）→ 磷酸化 H2AX（γH2AX 焦点）、CHK1/2 → 暂停周期；同时启动修复：同源重组（HR，需 BRCA1/2、RAD51，用于 S/G2）或非同源末端连接（NHEJ，用于 G1）。p53 被 ATM/CHK2 稳定 → 修复失败则诱导衰老/凋亡。\n\n【关键】DDR 是放疗杀伤肿瘤的根本机制；BRCA 缺陷使 HR 失效，可用 PARP 抑制剂（合成致死） Targeting。DDR 缺陷也驱动突变积累与癌变。\n\n【和生信分析的连接】用 DNA repair、γH2AX signature 基因集 GSEA；看 ATM/ATR/CHK1/2、BRCA1/2、TP53 表达与突变；放疗响应可关联 DDR 评分。",
    keyPoints: [
      "ATM/ATR 感知损伤→暂停周期并启动修复",
      "HR（BRCA/RAD51）与 NHEJ 两条修复路",
      "p53 决定修复 or 衰老/凋亡",
      "是放疗根基，BRCA 缺陷可用 PARP 抑制剂"
    ],
    testYourself: "BRCA1 缺陷的肿瘤对 PARP 抑制剂敏感，从「合成致死」解释；生信上怎么用 DDR 基因状态预测放疗/化疗响应？",
    links: ["k5-26", "k5-05", "k5-21", "regen-04"]
  },
  {
    id: "k5-28", domain: "immune", domainName: "免疫与炎症", level: "进阶",
    title: "炎症小体与 NLRP3：天然免疫的引爆器",
    tags: ["inflammasome", "NLRP3", "caspase-1", "IL-1beta", "innate immunity", "pyroptosis"],
    summary: "NLRP3 等炎症小体感知危险信号后组装 ASC-caspase-1，既切 IL-1β 又驱动焦亡，是炎症的中央引爆器。",
    body: "【主线】NLR 家族感受器（NLRP3、NLRC4、AIM2）识别 PAMP/DAMP（如 ATP、尿酸结晶、胞质 DNA）→ 经 ASC 接头招募并活化 caspase-1 → 加工 IL-1β/IL-18 并切割 GSDMD 触发焦亡。NLRP3 还需「 priming（NF-κB 上调 NLRP3/IL-1β 前体）」+「激活（钾外流/线粒体 ROS）」两步。\n\n【关键】过度活跃的 NLRP3 关联痛风、动脉粥样硬化、MASLD 炎症、自身炎症病；IL-1 抑制剂（卡那单抗）已用于这些病。它是连接「损伤信号→炎症爆发」的枢纽。\n\n【和生信分析的连接】看 NLRP3、ASC/PYCARD、CASP1、IL1B/IL18 共表达；用 inflammasome 基因集 GSEA；与焦亡/IL-1 response 签名叠加评估炎症小体活性。",
    keyPoints: [
      "NLRP3 需 priming + 激活两步才引爆",
      "caspase-1 既切 IL-1β 又切 GSDMD 焦亡",
      "过度活跃关联痛风/动脉粥样/脂肪性炎症",
      "IL-1 抑制剂已用于相关炎症病"
    ],
    testYourself: "一个样本 IL1B 高但 NLRP3 不高，可能是 non-canonical（caspase-4/11）还是上游 priming 不同？生信怎么分？",
    links: ["k5-02", "k5-09", "k4-17", "immune-11"]
  },
  {
    id: "k5-29", domain: "immune", domainName: "免疫与炎症", level: "进阶",
    title: "肠肝轴：菌群-内毒素-胆汁酸的三角对话",
    tags: ["gut-liver axis", "dysbiosis", "LPS", "TLR4", "microbiome", "bile acid"],
    summary: "门静脉把肠道菌群产物（LPS、胆汁酸、代谢物）直送肝脏，菌群失调是脂肪肝、肝炎、肝癌的重要推手。",
    body: "【主线】约 70% 肝血流来自门静脉，携带肠道吸收的菌群产物。健康时肠屏障+库普弗细胞（Kupffer）清除内毒素；失调（dysbiosis）时 LPS 经 TLR4 激活 Kupffer 与 LSEC → 释放 TNF/IL-6 → 炎症与脂肪变。菌群还代谢胆汁酸、胆碱（如产生 TMAO 前体），反向调节肝代谢。\n\n【关键】肠漏 + 菌群失衡是 MASLD、酒精性肝病、 HCC 进展的放大器；FXR（肠源 FGF19）与胆汁酸循环是肠肝对话主轴之一。\n\n【和生信分析的连接】若有菌群数据可看 LPS/TLR4 靶签名（LBP、CD14、TLR4）与炎症共变；用「微生物相关代谢」基因集（胆汁酸、胆碱）GSEA；可把肠源信号评分叠加肝损伤签名。",
    keyPoints: [
      "门静脉直送菌群产物，肠肝本一体",
      "LPS-TLR4 是菌群→肝炎症的主轴",
      "菌群代谢胆汁酸/胆碱反向调肝代谢",
      "肠漏+失调放大脂肪肝/肝炎/肝癌"
    ],
    testYourself: "肝样本 LBP/CD14 高但 TLR4 不高，能直接说「肠源 LPS 驱动炎症」吗？还可能是哪条内毒素通路？",
    links: ["k4-05", "k4-08", "k5-09", "immune-11"]
  },
  {
    id: "k5-30", domain: "microenv", domainName: "微环境与基质", level: "基础",
    title: "血管生成：VEGF 指挥的「 tip-stalk 」分工",
    tags: ["angiogenesis", "VEGF", "VEGFR", "tip cell", "hypoxia", "blood vessel"],
    summary: "缺氧经 HIF 诱导 VEGF，驱动内皮「尖端-柄部」分工出芽形成新血管，是肿瘤与创伤修复的命脉。",
    body: "【主线】缺氧（HIF-1α）→ VEGF 分泌 → 结合内皮 VEGFR2 → 激活下游促存活/迁移信号。内皮细胞经 Notch 侧向抑制分化为「tip cell（领跑、丝状伪足）」与「stalk cell（跟从、管腔形成）」，以出芽方式生成新血管。成熟还需周细胞（PDGFRβ）包绕。\n\n【关键】肿瘤靠血管生成获氧供与转移通道，抗 VEGF（贝伐珠单抗）是经典抗血管药；过度血管正常化反而改善药物递送。RILD 中窦状隙毛细血管化也涉及血管重塑。\n\n【和生信分析的连接】用 HALLMARK VEGF/KRAS/HYPOXIA 相关基因集 GSEA；看 VEGFA、VEGFR（KDR/FLT1）、Notch 靶共表达；可算血管生成评分与缺氧评分并列。",
    keyPoints: [
      "缺氧→VEGF→内皮出芽，tip/stalk 分工",
      "Notch 侧向抑制决定内皮角色",
      "抗 VEGF 是经典抗血管疗法",
      "血管正常化可改善药物递送"
    ],
    testYourself: "抗 VEGF 后肿瘤缺氧评分不降反升，从「血管正常化失败/盗血」角度解释，生信该看哪些伴随特征？",
    links: ["k5-14", "k5-11", "k4-03", "tme-05"]
  },
  {
    id: "k5-31", domain: "microenv", domainName: "微环境与基质", level: "进阶",
    title: "细胞粘附与细胞外基质：integrin 介导的双向信号",
    tags: ["extracellular matrix", "integrin", "focal adhesion", "ECM", "mechanotransduction", "collagen"],
    summary: "细胞通过 integrin 黏附 ECM、传递「由外向内/由内向外」双向信号，ECM 成分与硬度直接塑造细胞行为。",
    body: "【主线】integrin（αβ 异二聚体）连接胞外 ECM（胶原、纤连蛋白、层粘连蛋白）与胞内骨架/FAK-SRC 复合体，传递机械与生化双向信号：胞外→内（FAK 磷酸化→存活/增殖），胞内→外（细胞收缩改 ECM）。ECM 硬度经 YAP/TAZ（Hippo 下游）影响转录。\n\n【关键】ECM 不仅是支架：其成分（胶原/透明质酸）与硬度决定分化、干性、药物渗透。肝纤维化就是 ECM（胶原）异常堆积；integrin 是抗纤维化/抗癌的潜在靶点。\n\n【和生信分析的连接】看 integrin 家族、ECM 基因（COL1A1、FN1、LAMA）、FAK（PTK2）表达；用 ECM/receptor interaction、focal adhesion 基因集 GSEA；可把基质硬度相关签名与 YAP 评分联用。",
    keyPoints: [
      "integrin 双向传信号，连 ECM 与骨架",
      "ECM 硬度经 YAP/TAZ 塑转录",
      "纤维化=胶原等 ECM 异常堆积",
      "integrin/FAK 是抗纤维化潜在靶点"
    ],
    testYourself: "基质硬度高、YAP 核定位相关基因高，但 integrin 表达不高，能排除粘附信号主导吗？还可能经哪条机械通路？",
    links: ["k4-17", "k4-10", "k5-30", "tme-05"]
  },
  {
    id: "k5-32", domain: "microenv", domainName: "微环境与基质", level: "基础",
    title: "旁分泌/自分泌/内分泌：细胞通讯的三类语言",
    tags: ["paracrine", "autocrine", "endocrine", "ligand receptor", "cell communication", "juxtacrine"],
    summary: "细胞靠分泌信号近距（旁/自）或远距（内分泌）对话，是单细胞通讯分析与组织稳态的基础语言。",
    body: "【主线】① 旁分泌：信号细胞分泌因子作用于邻近细胞（如 TGF-β 由 HSC 旁分泌促纤维化）；② 自分泌：作用于自身（如肿瘤细胞 IL-6 自分泌促存活）；③ 内分泌：经血液远距作用（如肝分泌 IGF-1、FGF19 入血）。还有 juxtacrine（膜结合配体-受体直接接触，如 Notch/Delta）。\n\n【关键】同一分子可多模式切换；解析「谁分泌、谁接收、作用多远」是单细胞配体-受体分析的核心问题。通讯失衡（自分泌环路、旁分泌放大）驱动病理。\n\n【和生信分析的连接】用 CellChat/NicheNet 等配体-受体库做 scRNA 通讯推断；区分自分泌（同群高表达配体+受体）vs 旁分泌（跨群）；可把通讯强度与空间邻近（cell2location）叠加。",
    keyPoints: [
      "旁分泌近距、自分泌自身、内分泌远距",
      "juxtacrine 是膜接触式（Notch/Delta）",
      "同一分子可多模式切换",
      "通讯推断是单细胞分析核心问题"
    ],
    testYourself: "scRNA 里 A 群配体高、B 群受体高，就一定是 A→B 旁分泌吗？还可能漏掉哪些解读维度？",
    links: ["k5-11", "k4-17", "k5-08", "k5-10"]
  },
  {
    id: "k5-33", domain: "liver", domainName: "肝脏专病", level: "进阶",
    title: "肝纤维化：HSC 活化与 ECM 沉积的级联",
    tags: ["liver fibrosis", "hepatic stellate cell", "TGF-beta", "collagen", "MMP", "TIMPs"],
    summary: "慢性损伤下静息 HSC 转活化为肌成纤维细胞，成为 ECM 工厂，是纤维化不可逆转折的关键细胞。",
    body: "【主线】正常 HSC（储脂、维甲酸）在 PDGF/TGF-β/炎症因子刺激下活化→获得增殖、迁移、收缩能力，转为肌成纤维细胞（α-SMA/ACTA2+），大量分泌 I/III 型胶原与 TIMP（抑制 MMP 降解）→ ECM 净积累。同时 LSEC 毛细血管化、胆管反应共同推波。\n\n【关键】HSC 是纤维化 ECM 的主要来源；TGF-β（k5-10）是最强活化信号，PDGF 是最强促增殖信号。纤维化的「可逆窗」在 HSC 活化早期，晚期形成稳定瘢痕。\n\n【和生信分析的连接】看 HSC 活化签名（ACTA2、COL1A1、TAGLN）与 TIMP/MMP 比值；用 fibrosis/HALLMARK TGF-β 基因集 GSEA；单细胞里追踪 HSC 从静息（Lrat+）到活化（Acta2+）的轨迹。",
    keyPoints: [
      "HSC 活化是纤维化 ECM 的主要来源",
      "TGF-β 促活化、PDGF 促增殖",
      "TIMP↑/MMP↓ → ECM 净积累",
      "早期可逆，晚期成稳定瘢痕"
    ],
    testYourself: "想证明某药抗纤维化，单看 COL1A1 下降够吗？从 HSC 活化 vs ECM 降解两端，还该补哪些指标才算机制完整？",
    links: ["k4-03", "k4-17", "k5-10", "k4-04"]
  },
  {
    id: "k5-34", domain: "system", domainName: "系统生理", level: "进阶",
    title: "胆汁酸肠肝循环：代谢-信号-菌群的交汇",
    tags: ["bile acid", "enterohepatic circulation", "FXR", "FGF19", "gut-liver", "cholesterol"],
    summary: "胆汁酸在肝合成、胆囊储存、肠重吸收、肝再摄取的闭环，既是消化液也是串起代谢与信号的核心分子。",
    body: "【主线】肝细胞内胆固醇经 CYP7A1 合成初级胆汁酸→随胆汁入肠助脂类乳化吸收→回肠末端约 95% 被 ASBT 重吸收、经门静脉回肝（肠肝循环）；回肠胆汁酸激活 FXR→FGF19 入血抑制肝 CYP7A1（负反馈，见 k4-05）。少量逃出的胆汁酸被菌群转为次级胆汁酸（如 DCA、LCA）。\n\n【关键】胆汁酸是「消化 + 信号（FXR/TGR5）+ 菌群调节」三位一体；循环打断（回肠切除、胆汁淤积）会致脂肪泻、胆汁酸池改变与肝损伤。它是肠肝轴（k5-29）的核心介质。\n\n【和生信分析的连接】看胆汁酸合成（CYP7A1、CYP8B1）、转运（ASBT/SLC10A2、BSEP/ABCB11、OSTα/β）、FXR 靶（FGF19、SHP）全链路；用 bile acid metabolism 基因集 GSEA；可算「合成 vs 重吸收 vs 反馈」平衡评分。",
    keyPoints: [
      "肝合成→肠乳化→回肠重吸收→肝再摄取闭环",
      "FXR-FGF19 是合成负反馈主轴",
      "菌群把初级转次级胆汁酸",
      "三位一体：消化+信号+菌群调节"
    ],
    testYourself: "回肠切除患者胆汁酸池缩小，从 CYP7A1 反馈与脂肪吸收两端解释肝肠会出现什么连锁变化？",
    links: ["k4-05", "k5-29", "k4-08", "k4-01"]
  }
];
