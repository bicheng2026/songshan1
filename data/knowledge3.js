/* 嵩山一号 · 工作站 —— 知识库扩展：通讯通路与细胞间信号（第 3 批）
   每条都给可检索的英文标签，便于挂真实文献（_build/know_cite.py）。 */
window.SX_KNOWLEDGE3 = [
  {
    id: "sig3-01", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "IL-6 / STAT3：肝再生启动的第一声号角",
    tags: ["IL-6", "STAT3", "liver regeneration", "Kupffer cell"],
    summary: "部分肝切除后 1 小时内 IL-6 就升高，它是把「组织缺了」翻译成「开始增殖」的第一道信号。",
    body: "【主线】肝切除后门脉压力骤变、肠道菌产物进入肝脏，Kupffer 细胞（肝内巨噬细胞）先被激活，分泌 TNF-α 和 IL-6。IL-6 结合肝细胞膜上的 gp130 受体复合物，激活 JAK，JAK 磷酸化 STAT3，STAT3 二聚化入核，启动 Cyclin D1、c-Myc、Bcl-xL 等靶基因——细胞从 G0 进入 G1。\n\n【关键】这条轴是「启动」而不是「持续」：IL-6 峰值在术后数小时，24 小时内回落。用抗体中和 IL-6 或敲除 STAT3，肝再生显著延迟但不会完全停止——因为还有 HGF、EGF、TNF 等并行通路在推。这也解释了为什么单基因敲除常常只看到「延迟」而不是「阻断」。\n\n【和生信分析的连接】转录组上应该看到术后早期（0.5-6 h）IL6、SOCS3、CCND1、MYC 上调，SOCS3 是这条通路的负反馈，它一起升高恰恰说明通路被激活过。GSEA 看 HALLMARK_IL6_JAK_STAT3_SIGNALING；如果只看到 SOCS3 高而 IL6 不高，考虑是别的因子（如 OSM、LIF）在激活同一通路。",
    keyPoints: [
      "Kupffer 细胞是 IL-6 的主要来源，不是肝细胞自己",
      "JAK-STAT3 的靶基因里 Cyclin D1 决定 G1/S 转换",
      "SOCS3 是负反馈，它升高是「通路刚被激活」的痕迹",
      "敲除这条轴通常只延迟、不阻断再生，因为有多条并行通路"
    ],
    testYourself: "术后 24 小时取肝组织做转录组，SOCS3 很高但 IL6 已经回落，这说明通路是开着还是关了？",
    links: ["regen-02", "signaling-06", "immune-11"]
  },
  {
    id: "sig3-02", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "Hippo-YAP/TAZ：器官大小的体积开关",
    tags: ["Hippo", "YAP", "TAZ", "organ size", "mechanotransduction"],
    summary: "Hippo 通路开 = YAP 被磷酸化降解 = 器官不长；Hippo 关 = YAP 入核 = 细胞增殖。肝脏再生就是把这个开关按住。",
    body: "【主线】MST1/2 磷酸化 LATS1/2，LATS 再磷酸化 YAP/TAZ，磷酸化的 YAP 被 14-3-3 扣在胞质里并走泛素化降解。当细胞密度低、机械张力高、或 GPCR 的 Rho 信号强时，LATS 被抑制，YAP 去磷酸化入核，与 TEAD1-4 结合，启动 CTGF、CYR61、ANKRD1 等靶基因。\n\n【关键】YAP 是「读机械」的：细胞铺展面积、基质硬度、甚至血流剪切力都能改变它的核质分布。所以体外实验里细胞密度不同，YAP 活性就不同，重复性差往往出在这里。另外 YAP 的核内定位（免疫荧光）和总蛋白量是两件事，只看 western 的总 YAP 会得出相反结论。\n\n【和生信分析的连接】YAP 激活的转录签名（CTGF/CCN2、CYR61/CCN1、AMOTL2、ANKRD1）比 YAP 本身表达量更能反映活性——因为调控发生在蛋白和定位层面。做 RILD 时如果 YAP1 mRNA 没变但签名基因集体上调，仍然可以判为通路激活。",
    keyPoints: [
      "Hippo 的核心是 LATS 对 YAP 的磷酸化，不是 YAP 的转录水平",
      "细胞密度、基质硬度、剪切力都会改变 YAP 定位",
      "看签名基因（CTGF、CYR61、ANKRD1）比看 YAP1 表达更可靠",
      "YAP 是再生与肿瘤的共同终点，做药物时要注意双向风险"
    ],
    testYourself: "同一批细胞，一组铺得很稀、一组长满皿，YAP 报告基因活性会差在哪一组？为什么？",
    links: ["regen-04", "tme-05", "signaling-10"]
  },
  {
    id: "sig3-03", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "CXCL12-CXCR4：把细胞叫到损伤现场的导航系统",
    tags: ["CXCL12", "CXCR4", "chemokine", "cell migration"],
    summary: "趋化因子不是「炎症因子」的同义词，它的本职是给细胞指方向：沿着浓度梯度往高处走。",
    body: "【主线】CXCL12（又叫 SDF-1）由损伤区的基质细胞、内皮细胞分泌，形成浓度梯度。表达 CXCR4 的细胞（造血干祖细胞、淋巴细胞、部分肿瘤细胞）顺着梯度迁移。这条轴在骨髓里负责把造血干细胞「扣住」，在肝损伤里负责招募祖细胞和免疫细胞。\n\n【关键】CXCL12 有两个受体：CXCR4 和 ACKR3（原 CXCR7）。ACKR3 不传导 G 蛋白信号，它的作用是「 scavenge」——把 CXCL12 吞掉降解，从而塑造梯度形状。所以 ACKR3 高表达不一定是「信号强」，可能反而是「信号被清掉」。这类「诱饵受体」在趋化因子系统里很常见。\n\n【和生信分析的连接】单细胞里 CXCL12 往往在基质细胞/内皮细胞，CXCR4 在免疫细胞——这是典型的「配体在一个细胞、受体在另一个细胞」，是 CellChat 里 cell-cell communication 的标准案例。做 bulk 时两者混在一起算平均表达，会完全掩盖这种分工。",
    keyPoints: [
      "趋化因子的作用是定向迁移，不是直接激活炎症",
      "ACKR3 是清道夫受体，高表达可能意味着配体被降解",
      "配体与受体常在不同细胞类型上，必须用单细胞或空间数据看",
      "CXCR4 拮抗剂（如 plerixafor）临床用于动员造血干细胞"
    ],
    testYourself: "肿瘤里 CXCL12 高、CXCR4 也高，能不能直接说「这条轴激活」？还需要看什么？",
    links: ["method-07", "immune-11", "tme-01"]
  },
  {
    id: "sig3-04", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "Fas/FasL 与 TNF：死亡受体通路",
    tags: ["Fas", "FasL", "TNF", "death receptor", "apoptosis"],
    summary: "外源凋亡通路：死亡配体结合死亡受体，直接组装 DISC 剪开 caspase-8，不需要经过线粒体。",
    body: "【主线】FasL 或 TNF 结合受体 → 受体三聚化 → 胞内 DD 结构域招募 FADD → FADD 招募 pro-caspase-8 → 形成 DISC → caspase-8 自剪切激活 → 直接剪开下游 caspase-3/7（I 型细胞），或剪 BID 放大到线粒体通路（II 型细胞）。\n\n【关键】TNF 的信号是「双面」的：结合 TNFR1 既可能走凋亡，也可能走 NF-κB 促存活和炎症——走哪条取决于 cIAP、RIPK1 的泛素化状态。所以 TNF 阻断剂在临床上主要抗炎，而不是促凋亡。肝细胞对 Fas 诱导的凋亡异常敏感，这也是暴发性肝炎的机制之一。\n\n【和生信分析的连接】FAS、FASLG、TNFSF10、CASP8 上调要结合 NFKB1/RELA 一起看：如果 NF-κB 靶基因也高，说明细胞在「挣扎求生」而不是单纯走向死亡。另外 caspase-8 的活性由 FLIP 竞争性抑制，FLIP 高表达时 DISC 组了也不一定死。",
    keyPoints: [
      "外源通路走 DISC-caspase-8，内源通路走线粒体-cyt c",
      "TNF-TNFR1 既可凋亡也可存活，取决于 RIPK1 泛素化",
      "肝细胞对 Fas 介导凋亡高度敏感",
      "FLIP 是 caspase-8 的竞争性抑制物，看 mRNA 时要一起看"
    ],
    testYourself: "同一个样本里 FAS 和 NFKB1 靶基因同时上调，你更倾向判断细胞在死还是在扛？",
    links: ["death-01", "death-10", "signaling-02"]
  },
  {
    id: "sig3-05", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "补体级联：C3a / C5a 在肝损伤与再生之间",
    tags: ["complement", "C5a", "C3a", "liver injury"],
    summary: "补体不只是免疫的「打孔队」，C3a 和 C5a 是两种强效趋化与激活信号，直接参与肝再生启动。",
    body: "【主线】补体三条激活路径（经典、旁路、凝集素）最后都汇聚到 C3 转化酶 → C3b 沉积（调理、膜攻击复合物） + C3a 释放；C5 转化酶切 C5 → C5b（起膜攻击复合物）+ C5a（最强趋化因子之一）。C5a 招募中性粒细胞和单核细胞，C3a 参与肝细胞增殖信号。\n\n【关键】肝脏是补体蛋白的主要合成器官，所以肝损伤时补体系统自身也「受伤」。研究里常看到的矛盾结论——补体敲除既报道「减轻损伤」也报道「延迟再生」——原因就在这里：C5a 介导的炎症有害，但 C3a/C5a 的促再生信号有益，敲掉整条通路等于两头一起切。\n\n【和生信分析的连接】补体基因（C1QA/B/C、C3、C5AR1、SERPING1）在 bulk 里常常跟着巨噬细胞签名一起变，很难分清是「补体激活」还是「巨噬细胞变多」。必须做去卷积或单细胞才能拆开。",
    keyPoints: [
      "C3a、C5a 是趋化/激活信号，C5b 才参与膜攻击复合物",
      "肝脏是补体蛋白主产地，肝损伤时补体系统本身也紊乱",
      "整体敲除会同时去掉有害炎症和有益再生信号，结论容易矛盾",
      "补体基因与巨噬细胞签名高度共变，需去卷积拆解"
    ],
    testYourself: "看到 C3、C1QA、C5AR1 同时上调，你怎么判断是补体通路激活还是巨噬细胞浸润增加？",
    links: ["immune-11", "tme-02", "method-21"]
  },
  {
    id: "sig3-06", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "腺苷-A2AR：缺氧微环境里的免疫刹车",
    tags: ["adenosine", "A2AR", "hypoxia", "immunosuppression"],
    summary: "缺氧 → ATP 外排 → CD39/CD73 把它逐步降解成腺苷 → 腺苷激活 A2A 受体，把 T 细胞按下去。",
    body: "【主线】细胞外 ATP 在 CD39 作用下变成 AMP，CD73 再把它变成腺苷。腺苷结合 T 细胞、NK 细胞上的 A2AR（高亲和力 Gs 偶联），升高胞内 cAMP，抑制 TCR 信号、减少 IFN-γ 和颗粒酶释放。这条轴在肿瘤中心缺氧区、在损伤后炎症消退期都开得很足。\n\n【关键】这是「炎症消退」的生理机制，不只是肿瘤逃逸的阴谋。所以 A2AR 阻断剂一方面能恢复抗肿瘤免疫，另一方面也可能加重自身炎症。判断这条通路是否活跃，看的是 CD39（ENTPD1）、CD73（NT5E）、ADORA2A 的组合，而不是单看腺苷——腺苷半衰期太短，测不到。\n\n【和生信分析的连接】ENTPD1、NT5E 在单细胞里常落在调节性 T 细胞、M2 巨噬、肿瘤相关成纤维上。如果这三个基因同时高，同时 IFN-γ 签名低，就是典型的「腺苷刹车」表型，也是 A2AR 药物的潜在获益人群画像。",
    keyPoints: [
      "腺苷由 CD39 + CD73 两步酶解产生，不是直接分泌",
      "A2AR 走 Gs-cAMP，抑制 TCR 信号与细胞因子释放",
      "这是炎症消退的生理机制，不纯是肿瘤逃逸",
      "用 ENTPD1/NT5E/ADORA2A 组合判断，不要试图测腺苷"
    ],
    testYourself: "一个肿瘤样本 ENTPD1、NT5E 高，IFNG 签名低，A2AR 阻断剂对它可能有效还是无效？理由是什么？",
    links: ["immune-11", "tme-01", "signaling-14"]
  },
  {
    id: "sig3-07", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "HGF-MET 与 EGFR：再生里的两条并行加速器",
    tags: ["HGF", "MET", "EGFR", "ERK", "hepatocyte proliferation"],
    summary: "IL-6/STAT3 负责「发令」，HGF-MET 和 EGFR 负责「供油」——它们直接推肝细胞进细胞周期。",
    body: "【主线】HGF 由肝星状细胞和内皮细胞分泌，结合肝细胞上的 MET（受体酪氨酸激酶），激活 Gab1-GRB2-SHP2-ERK 与 PI3K-AKT。EGFR 的配体（EGF、TGF-α、HB-EGF、AR）在术后被 MMP 从膜上剪下来（ shedding），形成自分泌环路。两条通路都汇聚到 ERK，推动 Cyclin D1 表达。\n\n【关键】这两个受体的信号强度由「配体剪切」控制，而不是配体表达量：HB-EGF 的 mRNA 不变，但 MMP 活性一高，释放的可溶配体就多。所以只做转录组，经常看不到 EGFR 通路的「激活」，只能看到它的靶基因（如 DUSP6、SPRY2、ETV4）上调——这三个基因是 ERK 活性的经典读数。\n\n【和生信分析的连接】DUSP6、SPRY2、ETV4、EPHA2 组成的 ERK 输出签名，比看 EGFR/HGF 本身可靠。做药物重定位时，如果候选药物是 MET 抑制剂，要意识到它同时会压住再生——在 RILD 场景下这不是好事。",
    keyPoints: [
      "HGF 由星状细胞和内皮分泌，MET 在肝细胞上，是典型的旁分泌",
      "EGFR 配体靠 MMP 剪切释放，mRNA 不变活性也能变",
      "DUSP6/SPRY2/ETV4 是 ERK 输出的可靠读数",
      "抑制 MET/EGFR 会同时抑制再生，做 RILD 药物要考虑这个副作用"
    ],
    testYourself: "为什么转录组里 EGFR 表达没变，却可能处在高度激活状态？",
    links: ["regen-02", "signaling-05", "regen-03"]
  },
  {
    id: "sig3-08", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "整合素-ECM-黏着斑：机械信号怎么变成转录信号",
    tags: ["integrin", "extracellular matrix", "focal adhesion", "mechanotransduction", "FAK"],
    summary: "细胞不是「泡在汤里」，它拉着基质。拉的力气大小，会通过 FAK、Rho、YAP 一路传到细胞核。",
    body: "【主线】整合素结合 ECM 配体后聚集成黏着斑，招募 FAK、Src、talin、vinculin。FAK 自磷酸化后激活 Rho-ROCK，提高肌动球蛋白收缩力；收缩力反过来拉紧整合素，形成正反馈。这套机械信号最终通过 LATS 抑制让 YAP 入核，把「基质很硬」翻译成「该增殖了」。\n\n【关键】体内和体外差得最远的就是这一条。塑料皿的硬度是 GPa 级，肝正常组织只有几百 Pa，肿瘤组织约 1-10 kPa。同一批细胞铺在塑料上，YAP 天生就是激活的——很多「体外有效、体内无效」的药就栽在这里。\n\n【和生信分析的连接】整合素/ECM 签名（ITGB1、ITGA5、FN1、COL1A1、LAMA4、THBS1）在 bulk 里与 CAF 签名高度共变，因为 CAF 就是主要产 ECM 的细胞。要做「机械转导」的判断，必须配单细胞或空间数据定位到具体细胞。",
    keyPoints: [
      "整合素没有激酶活性，靠招募 FAK/Src 传递信号",
      "Rho-ROCK-肌动球蛋白收缩是机械信号的中枢放大器",
      "培养皿硬度远高于肝组织，体外结论要打折",
      "ITGB1/FN1/COL1A1 与 CAF 签名共变，需细胞层面拆解"
    ],
    testYourself: "同一个基因敲低实验，在塑料皿上做出「抑制增殖」，为什么到动物体内可能看不到效果？",
    links: ["tme-05", "sig3-02", "tme-01"]
  },
  {
    id: "sig3-09", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "COX-2 与前列腺素：炎症怎么停下来",
    tags: ["COX-2", "prostaglandin", "inflammation resolution", "PGE2"],
    summary: "炎症消退不是「炎症自己累了」，是一套主动的脂质介质切换：从促炎的 PGE2/白三烯转向促消退的 lipoxin/resolvin。",
    body: "【主线】花生四烯酸经 COX-1/COX-2 变成 PGH2，再由各组织特异的合酶转成 PGE2、PGI2、TXA2。PGE2 走 EP2/EP4（Gs-cAMP）促血管扩张和免疫抑制，走 EP3（Gi）则相反。炎症后期，脂氧合酶（ALOX5/12/15）把底物导向 lipoxin、resolvin、maresin，主动终止炎症。\n\n【关键】COX-2 不是纯粹的「坏酶」：它在肝再生早期是必需的（PGE2 促进肝细胞增殖），长期抑制 COX-2 会延迟再生。这也是非甾体抗炎药在肝损伤患者身上要谨慎的原因。另外 PGE2 的净效应取决于 EP 受体亚型比例，不同细胞表达谱不同，结论可以完全相反。\n\n【和生信分析的连接】PTGS2（COX-2）、PTGES、HPGD、ALOX15 的相对关系能看出「炎症处在哪一期」：PTGS2/PTGES 高而 ALOX15 低 = 促炎期；反过来 = 消退期。这个比值比单看 PTGS2 有信息量。",
    keyPoints: [
      "炎症消退是主动的脂质介质切换，不是被动衰减",
      "PGE2 经 EP2/EP4 与 EP3 的效应相反，取决于受体谱",
      "COX-2 在肝再生早期有正向作用，不能一味抑制",
      "PTGS2/PTGES 与 ALOX15 的比值能反映炎症分期"
    ],
    testYourself: "为什么给肝损伤病人长期用 COX-2 抑制剂可能不利于恢复？",
    links: ["signaling-02", "regen-02", "immune-11"]
  },
  {
    id: "sig3-10", domain: "signaling", domainName: "经典通路", level: "进阶",
    title: "S1P：控制细胞「出不出得去」的脂质信号",
    tags: ["sphingosine-1-phosphate", "S1P", "vascular barrier", "lymphocyte egress"],
    summary: "S1P 在血液里浓度高、在组织里浓度低，这个梯度决定了淋巴细胞是留在淋巴结还是进入循环。",
    body: "【主线】S1P 由鞘氨醇在 SphK1/2 作用下生成，被 S1PR1-5（G 蛋白偶联）识别。S1PR1 促淋巴细胞离开淋巴结进入循环，S1PR2 促血管成熟与屏障稳定，S1PR3 参与血管张力。血液 S1P 浓度高（微摩尔级）、组织间液低，这个梯度是「细胞该往哪走」的地理信息。\n\n【关键】S1P 的浓度梯度由 S1P 裂解酶和脂质磷酸磷酸酶维持。任何扰动梯度的因素（感染、创伤、大手术）都会同时改变免疫细胞分布和血管通透性——这解释了为什么危重病人会出现「淋巴细胞减少但组织里炎症很重」。芬戈莫德（fingolimod）就是通过功能性拮抗 S1PR1 把淋巴细胞「锁」在淋巴结里。\n\n【和生信分析的连接】外周血转录组里 S1PR1 下降常反映「淋巴细胞再分布」，而不是「免疫功能下降」。做肝再生/放疗研究时如果用的是 PBMC，要注意这个混杂：手术或放疗本身就会让淋巴细胞亚群比例剧烈波动。",
    keyPoints: [
      "S1P 靠「血高组织低」的浓度梯度工作，不是靠局部浓度",
      "S1PR1 管淋巴细胞出淋巴结，S1PR2 管血管屏障",
      "梯度的维持依赖降解酶，创伤感染会同时打乱免疫分布和通透性",
      "PBMC 里 S1PR1 下降多半是细胞再分布，不是免疫抑制"
    ],
    testYourself: "病人术后外周血淋巴细胞骤降，S1PR1 也低，这更可能是免疫功能崩溃还是细胞重新分布？怎么验证？",
    links: ["immune-11", "sig3-03", "tme-02"]
  }
];
