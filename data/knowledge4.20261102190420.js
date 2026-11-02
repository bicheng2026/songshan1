/* 嵩山一号 · 工作站 —— 知识库扩展：肝脏专病 + 人卫教材体系更广机制（第 4 批）
   覆盖：肝小叶分区 / RILD 分型 / 窦内皮毛细血管化 / 胆管反应 / 胆汁淤积 FXR-FGF19 /
        MASLD 与脂代谢 / 代谢重编程 / Nrf2 氧化应激 / CYP450 药物代谢 / 药物-靶点互作 /
        mTOR-PI3K-AKT / WNT-β-catenin / EMT / 细胞衰老 / 选择性自噬 / 肝免疫耐受 /
        肝内四角细胞通讯。每条都给可检索英文标签，便于挂真实文献（_build/know_cite.py）。 */
window.SX_KNOWLEDGE4 = [
  {
    id: "k4-01", domain: "liver", domainName: "肝脏专病", level: "基础",
    title: "肝小叶分区与 zone 异质性：为什么损伤总从中央带开始",
    tags: ["liver zonation", "zone 1", "zone 3", "centrilobular", "periportal", "oxygen gradient"],
    summary: "肝细胞不是均一的：从汇管区（zone 1）到中央静脉（zone 3）存在氧、营养、酶的梯度，决定了不同区对损伤的敏感度。",
    body: "【主线】肝小叶以中央静脉为圆心、汇管区在外周。zone 1（近汇管区）氧分压高、葡萄糖氧化为主、表达 Glut2/GS（谷氨酰胺合成酶）；zone 3（近中央静脉）氧分压最低、糖酵解和 CYP450 代谢最活跃、β-氧化和解毒负担重。这种分区由 Wnt/β-catenin（zone 1）与 β-catenin 抑制 + HNF4α（zone 3）等转录程序维持。\n\n【关键】zone 3 因为缺氧 + 高 CYP450 代谢 + 谷胱甘肽储备少，对药物毒性、缺血、铁过载最敏感——所以酒精性、药物性、缺血性肝损伤几乎都从中央带开始坏死。反过来 zone 1 对胆汁淤积和某些病毒感染更敏感。\n\n【和生信分析的连接】空间转录组最直观：看 GS（zone1 标志）、GLUL、CYP2E1/CYP3A（zone3 标志）在空间上的梯度分布；bulk 里若 zone3 标志整体偏低，提示中央带丢失。GSEA 看「缺氧」「糖酵解」「解毒」三类签名的区带偏向。",
    keyPoints: [
      "zone 1 富氧、解毒轻；zone 3 缺氧、CYP450 重、最易损",
      "分区由 Wnt/β-catenin 与 HNF4α 梯度共同维持",
      "RILD 的中央带坏死本质是 zone 3 优先受累",
      "空间转录组是看分区的金标准，bulk 会抹平梯度"
    ],
    testYourself: "同一份肝组织 bulk 转录组里 GS 和 CYP2E1 都高，能说明 zone 分布均匀吗？为什么空间数据更可信？",
    links: ["k4-02", "k4-03", "regen-02", "signaling-10"]
  },
  {
    id: "k4-02", domain: "liver", domainName: "肝脏专病", level: "进阶",
    title: "RILD 分型：经典型 vs 非经典型，以及 VOD/SOS",
    tags: ["RILD", "radiation-induced liver disease", "classic RILD", "non-classic RILD", "VOD", "SOS"],
    summary: "放射性肝损伤（RILD）有两种面目：经典型（腹水+肝大+碱性磷酸酶升高）和非经典型（转氨酶升高+肝萎缩），机制和治疗都不同。",
    body: "【主线】经典 RILD 表现为无症状性腹水、肝肿大、ALP 升高而转氨酶基本正常，常发生在放疗后数周，与静脉闭塞性病（VOD/SOS，内皮损伤→肝窦阻塞→门静脉高压）重叠。非经典 RILD 表现为转氨酶显著升高、肝萎缩，更像急性肝损伤，潜伏期更短。两者共同上游是肝窦内皮细胞（LSEC）对射线的极端敏感——内皮先死，肝细胞继发缺血坏死。\n\n【关键】LSEC 的辐射敏感性远高于肝细胞本身：低剂量就出现毛细血管化（去窗孔、基底膜沉积）。所以 RILD 本质是「血管/内皮病」继发「肝细胞病」，治疗上经典型以门脉减压/抗凝思路为主，非经典更接近一般肝损伤的保肝+抗炎。\n\n【和生信分析的连接】单细胞里应重点看 LSEC 群（PECAM1/CLDN5/PLVAP 标志）和 HSC 活化（ACTA2/COL1A1）；若 LSEC 窗孔相关基因（PLVAP、STAB1）下调、基底膜基因（COL4A1）上调，是毛细血管化的转录证据。WGCNA 可找「内皮损伤模块」。",
    keyPoints: [
      "经典 RILD = 腹水+ALP↑；非经典 = 转氨酶↑+肝萎缩",
      "共同上游是 LSEC 辐射敏感，内皮先损、肝继发缺血",
      "VOD/SOS 是经典 RILD 的核心病理，门脉高压为导向",
      "单细胞分析要优先盯 LSEC 与 HSC 两群"
    ],
    testYourself: "一个 RILD 样本单细胞里 PLVAP 低、COL4A1 高，这是毛细血管化还是正常？对放疗剂量意味着什么？",
    links: ["k4-01", "k4-03", "k4-17", "regen-04"]
  },
  {
    id: "k4-03", domain: "liver", domainName: "肝脏专病", level: "进阶",
    title: "肝窦内皮细胞（LSEC）毛细血管化：窗孔消失与基底膜沉积",
    tags: ["LSEC", "capillarization", "fenestration", "PLVAP", "sinusoidal", "fibrosis"],
    summary: "正常 LSEC 有大量窗孔、无基底膜，是物质交换的高速公路；病变后窗孔消失、铺上基底膜，变成普通毛细血管——这是肝纤维化的早期事件。",
    body: "【主线】LSEC 通过窗孔（fenestrae）让血浆与肝细胞直接接触，维持「窦状隙-肝细胞」的高效交换。慢性损伤（病毒、酒精、辐射、代谢）下，LSEC 失去窗孔（defenestration）、表达基底膜成分（COL4A1、LAMININ），并分泌促纤维化信号激活 HSC。这个过程叫毛细血管化，发生在纤维化明显之前。\n\n【关键】LSEC 是纤维化级联的「开关」：它一旦活化，就一边堵交通、一边喊 HSC 来铺胶原。所以抗纤维化策略里「保护/重编程 LSEC」是比直接压 HSC 更上游的靶点。STAB1、PLVAP、CD32b 是窗孔相关标志。\n\n【和生信分析的连接】用 scRNA 看 LSEC 亚群时，窗孔基因（PLVAP、STAB1、CLEC4G）与基底膜基因（COL4A1、LAMA1）的比值可作为「毛细血管化评分」；空间转录组可定位该评分在汇管区还是中央带更高。",
    keyPoints: [
      "窗孔消失 + 基底膜沉积 = 毛细血管化，早于明显纤维化",
      "LSEC 是纤维化级联的上游开关，先于 HSC 活化",
      "PLVAP/STAB1 低、COL4A1 高提示毛细血管化",
      "保护 LSEC 比直接压 HSC 更上游"
    ],
    testYourself: "想证明某候选药能逆转纤维化，从 LSEC 角度你应该重点看哪些基因恢复？",
    links: ["k4-02", "k4-17", "death-09", "regen-04"]
  },
  {
    id: "k4-04", domain: "liver", domainName: "肝脏专病", level: "进阶",
    title: "胆管反应（ductular reaction）：损伤后的胆道祖细胞应激",
    tags: ["ductular reaction", "CK7", "cholangiocyte", "progenitor", "biliary", "reactive"],
    summary: "胆管反应是肝损伤时胆小胆管（CK7+）增生形成的条索结构，既是修复尝试，也分泌促纤维化信号，是慢性肝病的普遍伴随现象。",
    body: "【主线】当肝细胞自身增殖受限（如严重损伤、衰老、代谢病），肝脏动员胆管旁卵圆细胞/祖细胞，沿汇管区形成 CK7+ 胆管反应。这些反应性胆管细胞分泌 IL-33、TGF-β、Wnt 等，既参与修复，也激活 HSC 和募集免疫细胞。\n\n【关键】胆管反应不是「好」或「坏」一刀切：轻度是代偿，重度且持续则推动纤维化与胆汁淤积。CK7 免疫组化是病理诊断的金标准；转录上 SOX9、KRT7、KRT19 高。\n\n【和生信分析的连接】单细胞里 CK7+ 群（SOX9/KRT7/KRT19）的比例升高即胆管反应信号；可计算「胆管反应评分」= 该群占比。注意它常与门管区炎症签名共现，做差异分析时要区隔「反应本身」和「伴随炎症」。",
    keyPoints: [
      "胆管反应是 CK7+ 祖细胞增生产生的修复/应激结构",
      "分泌 IL-33/TGF-β/Wnt，双刃：修复 + 促纤维化",
      "CK7/SOX9/KRT7/KRT19 是转录标志",
      "评分应看 CK7+ 群占比，并和门管炎症解耦"
    ],
    testYourself: "一个慢性损伤样本里 SOX9 群占比 15%（正常 ~2%），但 TGFB1 不高，怎么解读——是早期反应还是有纤维化风险？",
    links: ["k4-02", "k4-17", "immune-11", "tme-05"]
  },
  {
    id: "k4-05", domain: "metab", domainName: "代谢与胆汁", level: "进阶",
    title: "胆汁淤积：FXR / FGF19 轴与胆汁酸稳态",
    tags: ["cholestasis", "FXR", "FGF19", "bile acid", "NR1H4", "CYP7A1"],
    summary: "胆汁酸是信号分子也是毒性分子。FXR 核受体感知胆汁酸，诱导 FGF19 反馈抑制肝脏自身合成，构成核心负反馈环。",
    body: "【主线】胆汁酸在肝细胞内由胆固醇经 CYP7A1 合成，进入肠肝循环。回肠末端的胆汁酸激活肠上皮 FXR → 分泌 FGF19（人）/FGF15（鼠）入血 → 结合肝细胞 FGFR4/KLB → 抑制 CYP7A1 合成、诱导 BSEP 排泌。这是「多了就少造、并促进排出」的负反馈。\n\n【关键】FXR 激动剂（如奥贝胆酸）是胆汁淤积性肝病的治疗基础。若 FXR 或 FGF19 信号受阻（遗传或药物），胆汁酸在肝里蓄积 → 凋亡、炎症、瘙痒。SHP（NR0B2）是 FXR 下游的关键抑制因子。\n\n【和生信分析的连接】看 FXR 靶签名（FGF19、SHP/NR0B2、BSEP/ABCB11、OSTα/OSTβ）整体是否上调；CYP7A1 与 FGF19 应呈负相关。GSEA 看「胆汁酸代谢」「FXR 激活」签名。",
    keyPoints: [
      "FXR-FGF19 是胆汁酸合成的肠-肝负反馈主轴",
      "CYP7A1 受 FGF19 抑制，BSEP 受 FXR 诱导",
      "FXR 激动剂是胆汁淤积治疗基础",
      "FGF19 与 CYP7A1 负相关是核心可验证关系"
    ],
    testYourself: "某药处理后 CYP7A1 升高、FGF19 降低，这是缓解了还是加重了胆汁淤积风险？",
    links: ["k4-06", "k4-08", "signaling-06", "regen-03"]
  },
  {
    id: "k4-06", domain: "metab", domainName: "代谢与胆汁", level: "进阶",
    title: "MASLD 与 SREBP：脂代谢重编程的转录指挥",
    tags: ["MASLD", "NAFLD", "SREBP", "lipogenesis", "de novo lipogenesis", "steatosis"],
    summary: "代谢相关脂肪性肝病（MASLD）本质是肝细胞内脂质合成/氧化失衡，SREBP-1c 是「从头脂肪生成」的总开关。",
    body: "【主线】营养过剩时胰岛素升高、mTOR 与 LXR 活化，促使 SREBP-1c 成熟入核，启动 FASN、ACC、SCD1 等脂肪生成基因；同时 SREBP-2 推胆固醇合成。当脂质合成超过 VLDL 输出与 β-氧化能力，甘油三酯在肝细胞堆积 → 脂肪变。\n\n【关键】MASLD 不是「吃油多」这么简单，而是「从头脂肪生成（DNL）被长期开着」。PPARα（促 β-氧化）与 SREBP-1c（促合成）的拉锯决定脂肪变程度。进展到 MASH（脂肪性肝炎）才出现气球样变、炎症、纤维化。\n\n【和生信分析的连接】脂质生成签名（FASN、ACC/SCD1、SREBF1）与 β-氧化签名（CPT1A、PPARA、ACOX）的比值可做「脂肪变评分」；SREBF1 与 PPARA 负相关提示 DNL 占优。",
    keyPoints: [
      "SREBP-1c 是 DNL 总开关，长期开着导致脂肪变",
      "PPARα（氧化） vs SREBP-1c（合成）的拉锯定表型",
      "MASLD→MASH 才出现炎症纤维，是质变不是量变",
      "脂肪变评分 = 生成签名 / 氧化签名"
    ],
    testYourself: "一个样本 SREBF1 高但 CPT1A 也高，能直接判为脂肪变吗？还该看什么？",
    links: ["k4-07", "k4-05", "signaling-03", "regen-03"]
  },
  {
    id: "k4-07", domain: "metab", domainName: "代谢与胆汁", level: "基础",
    title: "代谢重编程：Warburg 效应与 OXPHOS 的双向切换",
    tags: ["Warburg", "glycolysis", "OXPHOS", "metabolic reprogramming", "HK2", "LDHA"],
    summary: "细胞在增殖时即使氧充足也偏好糖酵解（Warburg），快速供能并产出生物合成前体；这是肿瘤细胞也是活跃增殖肝细胞的共性。",
    body: "【主线】增殖细胞把葡萄糖走糖酵解（即便有 O2），好处是快、且中间产物可转去合成核苷酸/氨基酸/脂质。同时线粒体 OXPHOS 在需要时仍提供 ATP。肿瘤与再生肝细胞都表现出糖酵解上调（HK2、PFKM、LDHA、PKM2）而 OXPHOS 相对受抑。\n\n【关键】代谢重编程不是为了「多产 ATP」，而是为了「多产构件」。所以看代谢不能只看耗氧，要看通路流向。再生的肝细胞短期糖酵解高，成熟后回落；肿瘤则是持续高。\n\n【和生信分析的连接】计算糖酵解签名（HK2、LDHA、PKM2、SLC2A1）与 OXPHOS 签名（COX 亚基、NDUF、ATP5）的比值；与增殖签名（MKI67、PCNA）共变时才说明是「增殖驱动的重编程」而非单纯缺氧。",
    keyPoints: [
      "Warburg 的核心是供构件不是供能",
      "HK2/LDHA/PKM2 高 + OXPHOS 相对低 = 增殖态",
      "再生肝短期高、肿瘤持续高，动态不同",
      "要与增殖签名共变才能归因到增殖"
    ],
    testYourself: "zone 3 肝细胞糖酵解天然偏高，这和肿瘤的 Warburg 在解读上要怎么区分？",
    links: ["k4-01", "k4-06", "signaling-03", "regen-02"]
  },
  {
    id: "k4-08", domain: "metab", domainName: "代谢与胆汁", level: "进阶",
    title: "Nrf2 / Keap1：氧化应激的抗氧化总开关",
    tags: ["Nrf2", "KEAP1", "oxidative stress", "ROS", "NQO1", "HO-1", "antioxidant"],
    summary: "Nrf2 平时被 Keap1 扣在胞质降解；一旦氧化应激，Nrf2 入核启动一整批解毒/抗氧化基因（NQO1、HO-1、GCLC）。",
    body: "【主线】静息态 Keap1 作为 E3 适配器把 Nrf2 泛素化降解。ROS 或亲电子物质修饰 Keap1 的半胱氨酸 → 释放 Nrf2 → Nrf2 入核结合 ARE 元件 → 启动 NQO1、HMOX1(HO-1)、GCLC/GCLM（谷胱甘肽合成）、CAT 等。\n\n【关键】Nrf2 是「双刃」：适度激活保护肝细胞（尤其 zone 3 高 CYP450 区），但肿瘤里 Nrf2 持续激活会助长耐药与生存。KEAP1 突变或 NFE2L2 扩增都导致 constitutive 激活。\n\n【和生信分析的连接】Nrf2 靶签名（NQO1、HMOX1、GCLC、GCLM、TXN、TXNRD1）整体升高即「抗氧化程序被点燃」；NQO1/HMOX1 与 ROS 来源基因（NOX 家族）常共变，提示正在对抗氧化压力。",
    keyPoints: [
      "Keap1 降解 Nrf2，氧化应激释放之",
      "下游 NQO1/HO-1/谷胱甘肽合成是核心效应",
      "保护 zone 3，但肿瘤里持续激活助耐药",
      "靶签名整体升 = 抗氧化程序点燃"
    ],
    testYourself: "放疗后 RILD 样本 NQO1 和 HMOX1 都高，这是损伤加重还是细胞在自救？怎么结合形态判断？",
    links: ["k4-01", "k4-02", "death-03", "signaling-02"]
  },
  {
    id: "k4-09", domain: "pharm", domainName: "药物代谢", level: "基础",
    title: "CYP450 与药物代谢：DILI 的酶学基础",
    tags: ["CYP450", "CYP3A4", "CYP2E1", "DILI", "drug metabolism", "hepatotoxicity"],
    summary: "肝细胞靠 CYP450 把药物（尤其 zone 3 高表达的 CYP3A4/CYP2E1）代谢掉，但代谢中间体常具毒性，是药物性肝损伤（DILI）的核心机制。",
    body: "【主线】CYP450 氧化还原酶系催化药物 I 相代谢，多数药物经 CYP3A4（含量最高）、CYP2D6、CYP2C9/19、CYP2E1（乙醇/ acetaminophen 相关）转化。代谢产物经 II 相（UGT、GST、SULT）结合后排泄。问题是 I 相常产生亲电子/自由基中间体，若超出谷胱甘肽（GSH）缓冲，就共价修饰蛋白→损伤。\n\n【关键】zone 3 高 CYP450 + 低 GSH 储备，是「同一剂量药物 zone 3 更易中毒」的酶学原因。对乙酰氨基酚（APAP）过量即经 CYP2E1 生成 NAPQI，耗竭 GSH 后致中央带坏死——教科书级范例。\n\n【和生信分析的连接】可建「代谢能力评分」= CYP3A4/2E1/2D6 表达 − GSH 合成/清除基因（GCLC、GSTs）表达；该评分高提示解毒余量低、DILI 风险高。老药新用筛药时，CYP 诱导/抑制谱（DDI 风险）也要查。",
    keyPoints: [
      "CYP3A4/2E1 集中在 zone 3，是毒性代谢热点",
      "I 相产亲电中间体，靠 GSH 缓冲，超量即损伤",
      "APAP→NAPQI 经 CYP2E1 是 DILI 经典范例",
      "代谢能力评分 = CYP − GSH 系统，可量化 DILI 风险"
    ],
    testYourself: "某老药在 zone 3 高表达 CYP3A4 的细胞里毒性强，但在 GCLC 高的细胞里毒性弱，提示机制是什么？",
    links: ["k4-01", "k4-08", "k4-10", "death-03"]
  },
  {
    id: "k4-10", domain: "pharm", domainName: "药物代谢", level: "进阶",
    title: "药物-靶点互作与老药新用逻辑",
    tags: ["drug repurposing", "target", "binding", "DGIdb", "CMap", "off-target"],
    summary: "老药新用的本质：已知安全性的药，若能匹配到新靶点/新通路，就省下从头开发的安全关。关键是「药-靶」证据的强度与脱靶风险。",
    body: "【主线】逻辑有三种：① 机制驱动——已知某病由 X 通路驱动，找能抑制 X 的已上市药；② 签名反转——用 CMap/LINCS 看候选药在细胞里的转录签名是否与疾病签名相反（connectivity score 负）；③ 网络药理学——药多靶点映射到疾病基因网络，看富集。无论哪种，都要回到「这个药到底结合谁」的生化证据。\n\n【关键】脱靶（off-target）既是风险也是机会：很多老药的效果来自非原研靶点。DGIdb 可查药-靶关系与证据等级；分子对接（AutoDock Vina）给出结合构象与亲和打分，但属「可能性」不是「临床有效」。最终要靠本课题的细胞/动物验证。\n\n【和生信分析的连接】先把 RILD 关键基因/通路作为 query，在 DGIdb 找已知药-靶；再用 CMap 反查能反转该签名的化合物；最后用 WGCNA/LASSO（k7/k9）收敛到少数可成药特征，送对接。整条链就是「老药新用学习路径」。",
    keyPoints: [
      "三种逻辑：机制驱动 / 签名反转 / 网络药理学",
      "CMap connectivity score 负 = 可能反转疾病",
      "DGIdb 查药-靶证据等级，对接给结合构象",
      "脱靶既是风险也是机会，最终靠实验验证"
    ],
    testYourself: "CMap 说某药签名与 RILD 疾病签名强负相关，能不能直接宣布它能治 RILD？还差哪几步证据？",
    links: ["k4-09", "regen-04", "method-07", "signaling-10"]
  },
  {
    id: "k4-11", domain: "signaling", domainName: "经典通路", level: "基础",
    title: "mTOR / PI3K-AKT：生长与合成代谢的总闸门",
    tags: ["mTOR", "PI3K", "AKT", "growth", "protein synthesis", "rapamycin"],
    summary: "PI3K-AKT-mTOR 是细胞接收「有营养、有生长信号」后开启合成代谢、增殖的主轴；mTORC1 管翻译，mTORC2 管存活。",
    body: "【主线】生长因子/胰岛素经受体酪氨酸激酶 → PI3K 产 PIP3 → AKT 激活 → 抑制 TSC（解除对 Rheb 的抑制）→ mTORC1 活化 → 磷酸化 S6K1 与 4E-BP1，开启蛋白翻译与核糖体生成。mTORC2 则磷酸化 AKT 的疏水位点，形成正反馈并促存活。\n\n【关键】mTORC1 是营养/能量感应器：亮氨酸、葡萄糖、ATP 都往上推它；AMPK 在能量低时抑制它。所以它是连接「代谢状态」和「能否增殖」的枢纽——再生、肿瘤、肥大都绕不开。雷帕霉素（rapamycin）抑制 mTORC1。\n\n【和生信分析的连接】mTORC1 靶签名（RPS6KB1、EIF4EBP1、4EBP1、MYC 下游）升高提示通路开；看 AKT 通路要同时看 TSC1/2、PTEN（抑制方）与 AMPK 状态，单看 AKT 表达会误判。",
    keyPoints: [
      "mTORC1 管翻译/合成，mTORC2 管存活",
      "营养/能量感应枢纽，AMPK 逆向抑制之",
      "PTEN 缺失、TSC 突变都致 constitutive 激活",
      "看靶签名而非 AKT 本身表达更准"
    ],
    testYourself: "再生肝里 mTORC1 靶基因高，但同时 AMPK 也高，通路到底是开还是关？",
    links: ["k4-06", "k4-07", "signaling-03", "regen-02"]
  },
  {
    id: "k4-12", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "WNT / β-catenin：维持干细胞与分区的双刃剑",
    tags: ["WNT", "beta-catenin", "CTNNB1", "zonation", "stemness", "canonical"],
    summary: "经典 WNT 让 β-catenin 稳定入核驱动靶基因；它既维持肝干细胞/卵圆细胞身份、又决定 zone 1 分区，过度激活则与肝癌相关。",
    body: "【主线】无 WNT 时 β-catenin 被 APC/Axin/GSK3β 降解复合体磷酸化后降解。WNT 配体结合 Frizzled/LRP5/6 → 破坏该复合体 → β-catenin 稳定入核 → 与 TCF/LEF 结合启动靶基因（MYC、CCND1、GLUL、AXIN2）。\n\n【关键】在肝脏，WNT 活性梯度决定分区：zone 1（近门管）WNT 高 → β-catenin 高 → 表达谷氨酰胺合成酶；zone 3 低。卵圆细胞/胆管祖细胞也靠 WNT 维持干性。但 CTNNB1 突变致 β-catenin 持续激活，是肝细胞癌常见事件，且与_zone 1 型_肿瘤相关。\n\n【和生信分析的连接】WNT 靶签名（AXIN2、MYC、CCND1、GLUL、LGR5）升即通路激活；AXIN2 是经典报告基因。注意 β-catenin 蛋白稳定和 mRNA 不总一致，突变样本要查 CTNNB1 突变状态。",
    keyPoints: [
      "无 WNT 时 β-catenin 被 APC 复合体降解",
      "决定 zone 1 分区（GLUL/GS 高）",
      "维持祖细胞干性，但持续激活致肝癌",
      "AXIN2 是 WNT 激活的敏感报告基因"
    ],
    testYourself: "GLUL 在中央带低、门管区高，这符不符合 WNT 梯度？若某肿瘤只长在 zone 1 样区域，提示哪条通路？",
    links: ["k4-01", "k4-04", "signaling-10", "cancer-02"]
  },
  {
    id: "k4-13", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "EMT 上皮-间质转化：失去极性获得迁移",
    tags: ["EMT", "SNAIL", "TWIST", "ZEB", "E-cadherin", "migration", "fibrosis"],
    summary: "上皮细胞丢失 E-钙黏蛋白、获得间质标志（vimentin、N-cadherin），从「贴壁」变「会跑」——既与纤维化成纤维细胞来源有关，也是肿瘤转移的前提。",
    body: "【主线】TGF-β、Wnt、Notch 等信号诱导转录因子 SNAIL、SLUG、TWIST、ZEB1/2，它们直接抑制 CDH1（E-cadherin）并激活间质程序（VIM、CDH2、FN1、MMPs）。细胞失去顶-底极性、获得迁移与侵袭能力。\n\n【关键】EMT 在发育、伤口、纤维化里是生理性的「临时状态」，但完成转换的细胞若持续存在就推动疾病。肝脏里胆管上皮/卵圆细胞转分化、HSC 活化都带 EMT 色彩。注意 EMT 常是「部分」而非全有全无。\n\n【和生信分析的连接】EMT 评分 = (VIM+CDH2+FN1+ZEB1) − CDH1；SNAIL/SLUG/TWIST 转录因子高是驱动信号。GSEA「EPITHELIAL_MESENCHYMAL_TRANSITION」签名。但要警惕：bulk 里 CDH1 下降也可能只是细胞类型组成变了（间质细胞多了），需去卷积。",
    keyPoints: [
      "SNAIL/TWIST/ZEB 抑制 CDH1、启动间质程序",
      "纤维化与肿瘤转移共同借用 EMT 程序",
      "常是部分 EMT，不是全或无",
      "bulk 里 CDH1 降要排除细胞组成变化"
    ],
    testYourself: "样本 VIM 高、CDH1 低，直接判 EMT 够吗？还该看什么排除假阳性？",
    links: ["k4-04", "k4-17", "tme-05", "cancer-04"]
  },
  {
    id: "k4-14", domain: "death", domainName: "细胞死亡与应激", level: "进阶",
    title: "细胞衰老（senescence）与 SASP：停止分裂却不停分泌",
    tags: ["senescence", "SASP", "p16", "p21", "telomere", "aging", "secretory"],
    summary: "衰老细胞不再分裂，却持续分泌促炎促纤维化的 SASP 因子（IL-6、IL-1β、MMP），是慢性损伤的「发炎源」。",
    body: "【主线】端粒缩短、DNA 损伤、癌基因应激等激活 p53-p21 或 p16-Rb 通路，细胞周期永久停滞（G1 阻滞）。但衰老细胞不死的副作用是 SASP（senescence-associated secretory phenotype）：分泌 IL-6、IL-1β、CXCL 趋化因子、MMP、TGF-β。\n\n【关键】SASP 本是「召唤免疫清道夫来收尸」，但若免疫清除不力，这些细胞长期堆积就形成低度慢性炎症（inflammaging），驱动纤维化和肿瘤微环境。衰老肝细胞/ HSC 都参与肝病进展。Senolytics（清除衰老细胞）是新兴策略。\n\n【和生信分析的连接】衰老签名 = CDKN1A(p21)/CDKN2A(p16) + SASP 因子（IL6、IL1B、CXCL1/2、MMP3）；但 SASP 因子也来自其他炎症细胞，需单细胞定位到真正「停滞」的 cell（高 p21 且低增殖）。",
    keyPoints: [
      "p53-p21 / p16-Rb 致永久 G1 停滞",
      "SASP 持续分泌 IL-6/IL-1β/MMP，是发炎源",
      "免疫清不掉 → 慢性炎症 → 纤维化/肿瘤",
      "签名要定位到真正停滞的细胞，避免误判"
    ],
    testYourself: "某组细胞 IL6 很高但不表达 p21，能算衰老细胞吗？更可能是什么？",
    links: ["k4-08", "k4-17", "immune-11", "tme-01"]
  },
  {
    id: "k4-15", domain: "death", domainName: "细胞死亡与应激", level: "进阶",
    title: "选择性自噬：mitophagy 与 lipophagy 的精准回收",
    tags: ["autophagy", "mitophagy", "lipophagy", "PINK1", "Parkin", "SQSTM1", "selective"],
    summary: "自噬不止是「饿了吃自己」，更有选择性：mitophagy 专清受损线粒体，lipophagy 专清脂滴——两者对肝细胞稳态缺一不可。",
    body: "【主线】基础自噬由 ULK1 复合体启动、PI3K-III 产膜、LC3 脂化延展隔离膜成自噬体，最终与溶酶体融合降解。选择性自噬靠受体（SQSTM1/p62、OPTN、NDP52）把 cargo 连到 LC3：受损线粒体经 PINK1 累积招募 Parkin 泛素化，被受体识别 → mitophagy；脂滴表面 PLIN2/PLIN3 介导 lipophagy。\n\n【关键】肝细胞高度依赖 mitophagy 清除辐射/代谢损伤的线粒体（否则 ROS 失控），也依赖 lipophagy 降解脂滴（缺陷则脂肪变）。所以自噬是连接「损伤清除」与「代谢稳态」的枢纽。\n\n【和生信分析的连接】看自噬流不要用单一 LC3：应看 LC3B 与 p62/SQSTM1 反向（流通时 LC3B↑、p62↓）；mitophagy 看 PINK1/Parkin/BNIP3L；lipophagy 看 PLIN2/PLIN3 与脂生成基因关系。GSEA「autophagy」「mitophagy」签名。",
    keyPoints: [
      "选择性靠受体 p62/OPTN 把 cargo 连 LC3",
      "mitophagy 清受损线粒体（PINK1/Parkin）",
      "lipophagy 清脂滴（PLIN2/3 介导）",
      "看 LC3B 与 p62 反向才说明自噬流通"
    ],
    testYourself: "样本 LC3B 高但 p62 也高，自噬是增强了还是堵了？为什么？",
    links: ["k4-06", "k4-08", "death-02", "regen-03"]
  },
  {
    id: "k4-16", domain: "immune", domainName: "免疫与微环境", level: "进阶",
    title: "肝免疫耐受与自身免疫失衡：为什么肝脏「爱宽容」",
    tags: ["immune tolerance", "Kupffer", "Treg", "autoimmunity", "liver tolerance", "AIH"],
    summary: "肝脏是天然免疫特惠器官——经门静脉来的食物/肠菌抗原在这里被「习惯化」而非攻击。耐受崩溃就走向自身免疫性肝炎（AIH）或胆道病。",
    body: "【主线】肝脏通过多种机制维持耐受：Kupffer 细胞与肝窦内皮呈递抗原时倾向诱导 Treg 而非 Teff；肝内有大量耐受性 DC 与调节性巨噬细胞；门静脉血先经肝过滤，把少量抗原「稀释」掉全身反应。肝星状细胞、胆道上皮也参与。\n\n【关键】这种宽容是双刃：一方面减少不必要炎症（利于持续接触肠源抗原），另一方面也让肝转移瘤、慢性感染容易「躲」。当遗传易感性 + 肠漏/菌群紊乱 + 环境触发叠加，耐受转为攻击 → AIH、PBC、PSC。\n\n【和生信分析的连接】看 Treg 签名（FOXP3、IL2RA、CTLA4）与 Teff/细胞毒签名（IFNG、GZMB、CXCL9）的平衡；耐受态下 Treg 偏多、共刺激（CD80/86）低。单细胞可量化肝内 Treg/Teff 比值。",
    keyPoints: [
      "肝经门脉先过滤抗原，倾向诱导 Treg",
      "宽容双刃：少炎症也利于肿瘤/感染躲藏",
      "遗传+肠漏+触发 → 耐受崩溃 → AIH/PBC/PSC",
      "看 Treg/Teff 比值而非单一免疫标志"
    ],
    testYourself: "RILD 样本里 FOXP3 高、GZMB 也高，是耐受还是正在打仗？怎么区分？",
    links: ["k4-17", "k4-04", "immune-11", "tme-01"]
  },
  {
    id: "k4-17", domain: "liver", domainName: "肝脏专病", level: "进阶",
    title: "肝内四角通讯：肝细胞-Kupffer-HSC-窦内皮的对话",
    tags: ["cell crosstalk", "Kupffer", "HSC", "LSEC", "hepatocyte", "CellChat", "paracrine"],
    summary: "肝脏稳态是四种主要细胞用旁分泌/内分泌信号互相约定出来的。损伤时这张通讯网先乱，才表现为坏死、炎症、纤维化。",
    body: "【主线】肝细胞（代谢主力）↔ Kupffer（免疫哨兵，分泌 IL-6/TNF 启动再生）↔ HSC（基质工厂，被 TGF-β/PDGF 激活铺胶原）↔ LSEC（交换闸门，受损后毛细管化并信号改变）。举例：肝细胞损伤释放 DAMPs → Kupffer 激活分泌 TGF-β/PDGF → HSC 活化成肌成纤维细胞 → 沉积胶原；同时 LSEC 毛细血管化关闭交换。这是 RILD/纤维化的核心通讯环。\n\n【关键】这种「配体在一群、受体在另一群」的分工，只有单细胞和空间数据能看清。bulk 把四群混在一起，信号对不上细胞，容易得出假因果。CellChat 就是专门量化这种群间通讯的工具。\n\n【和生信分析的连接】用 scRNA 分四群后跑 CellChat，重点看 TGFB1-TGFBR、PDGF-PDGFR、CXCL-CXCR、IL6-IL6R 等配体-受体对的方向与强度；空间转录组可验证「配体群与受体群是否真相邻」——相邻才有物理通讯可能。",
    keyPoints: [
      "四角：肝细胞/Kupffer/HSC/LSEC 互相约定稳态",
      "损伤时 DAMPs→Kupffer→TGF-β/PDGF→HSC 活化→胶原",
      "配受体常跨群，必须单细胞/空间才看得清",
      "CellChat 量化群间通讯，空间验证相邻性"
    ],
    testYourself: "CellChat 显示 TGFB1（来自 Kupffer）强连 ACTA2+ HSC，但空间上两者不相邻，这个结果可信吗？",
    links: ["k4-02", "k4-03", "k4-16", "tme-05"]
  }
];
