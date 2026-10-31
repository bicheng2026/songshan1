// 嵩山一号 · 科研工作站  关卡：基础 / Bulk / 单细胞
window.SX_LEVELS = [
  /* ============================ R 基础 ============================ */
  {
    id: "rbase-1", track: "rbase", title: "第一关 · 索引：从 54 个样本里揪出你要的那一批",
    story: "导师扔给你一张样本信息表，说：『把照射组和分区2第3天的样本先挑出来』。这是所有生信分析的起手式。",
    goal: "学会用逻辑表达式 + 方括号索引，从数据框里精确取子集。",
    tasks: [
      "ir_samples：所有照射组（group == \"IR\"）的样本编号，长度应为 45",
      "z2d3：Zone 2 + 第 3 天（zone == 2 且 time == 3）的样本编号，长度应为 3",
      "n_sham：对照组样本数（应为 9）"
    ],
    datasets: ["rild_meta"],
    starter: "# 数据已经帮你读好了：rild_meta\nhead(rild_meta)\nstr(rild_meta)\n\n# 1) 照射组样本编号\nir_samples <- ...\n\n# 2) Zone2 第3天\nz2d3 <- ...\n\n# 3) 对照组数量\nn_sham <- ...\n",
    hints: [
      "取值要用双等号 ==，单个等号 = 是赋值，在这会变成新建一列。",
      "两个条件同时满足用 & ；或者用 &&（但 && 只用于长度 1）。",
      "rild_meta$sample[条件] 就是『挑行取列』的标准写法。"
    ],
    solution: "ir_samples <- rild_meta$sample[rild_meta$group == \"IR\"]\nz2d3      <- rild_meta$sample[rild_meta$zone == 2 & rild_meta$time == 3]\nn_sham    <- sum(rild_meta$group == \"Sham\")\n",
    check: "if (!exists(\"ir_samples\")) return(\"缺少对象 ir_samples：请选择 IR 组的样本编号\")\nif (!exists(\"z2d3\")) return(\"缺少对象 z2d3\")\nif (!exists(\"n_sham\")) return(\"缺少对象 n_sham\")\nif (length(ir_samples) != 45) return(sprintf(\"ir_samples 应有 45 个，当前 %d 个\", length(ir_samples)))\nif (length(z2d3) != 3) return(sprintf(\"z2d3 应有 3 个：\", length(z2d3)))\nif (!all(startsWith(z2d3, \"Z2_d3\"))) return(\"z2d3 里的样本名应该都以 Z2_d3 开头（Z2_d3_r1..r3）\")\nif (n_sham != 9) return(sprintf(\"n_sham 应为 9，当前 %s\", n_sham))\nTRUE",
    xp: 30, star: 1
  },
  {
    id: "rbase-2", track: "rbase", title: "第二关 · 分组求均值：看懂组织分区的第一刀",
    story: "Zone 1/2/3 是肝脏的三个功能区。要比较它们，第一步是把每个区的基因表达汇总成一个数。",
    goal: "学会 tapply / aggregate / rowMeans 三种分组汇总写法，并理解它们等价。",
    tasks: [
      "z2_cols：所有 Zone 2 的样本列名（长度应为 18）",
      "zone2_mean：Zone 2 各基因的平均表达，长度 51 的命名向量",
      "Mki67 在 Zone2 的均值应落在 6–9 之间（如果你算出来离谱，回去检查索引是否取对）"
    ],
    datasets: ["rild_expr", "rild_meta"],
    starter: "# rild_expr：51 个基因 x 54 个样本（log2 尺度）\n# rild_meta：每个样本的 zone / time / group\nz2_cols    <- ...\nzone2_mean <- ...\n",
    hints: [
      "rild_expr 是矩阵，取列用 rild_expr[, z2_cols]。",
      "逐行求平均：rowMeans()，它对矩阵按行算均值，速度快还好读。",
      "也可以用 apply(rild_expr[, z2_cols], 1, mean)，但那是用循环，慢。"
    ],
    solution: "z2_cols    <- rild_meta$sample[rild_meta$zone == 2]\nzone2_mean <- rowMeans(rild_expr[, z2_cols])\n",
    check: "if (!exists(\"z2_cols\")) return(\"缺少对象 z2_cols\")\nif (!exists(\"zone2_mean\")) return(\"缺少对象 zone2_mean\")\nif (length(z2_cols) != 18) return(sprintf(\"z2_cols 应有 18 个（3 个时间点 x 3 重复 x 2? 实际 Zone2 共 18 列），当前 %d\", length(z2_cols)))\nif (length(zone2_mean) != 51) return(sprintf(\"zone2_mean 应有 51 个基因，当前 %d\", length(zone2_mean)))\nif (abs(zone2_mean[\"Mki67\"] - 7.5) > 1.2) return(sprintf(\"Mki67 的 Zone2 均值约 7.5，你算出来是 %.3f，检查是不是把样本选错了\", zone2_mean[\"Mki67\"]))\nTRUE",
    xp: 40, star: 1
  },
  {
    id: "rbase-3", track: "rbase", title: "第三关 · 二维汇总：一张表看懂时间 x 分区",
    story: "导师要看的不是一堆数，是一张表：横轴时间、纵轴分区、每个格子里是 Cdkn1a 的表达。",
    goal: "掌握 tapply（分组聚合）与 aggregate，并学会把结果整理成矩阵。",
    tasks: [
      "cd_mat：Cdkn1a 在 3 个 zone × 6 个 time 上的平均表达矩阵，3 行 6 列",
      "行名应为 Z1/Z2/Z3，列名 d0..d28",
      "你会发现 Zone3 的 Cdkn1a 最高最持久 —— 这就是论文的结论之一"
    ],
    datasets: ["rild_expr", "rild_meta"],
    starter: "# 目标：3 行 x 6 列的矩阵\n# 提示：tapply(向量, list(分组1, 分组2), FUN)\ncd_mat <- ...\n",
    hints: [
      "tapply(x, list(g1, g2), mean) 会自动把结果排成 g1 为行、g2 为列。",
      "注意顺序：tapply 的值向量顺序必须和分组向量的顺序一致，<｜hy_place▁holder▁no▁813｜>直接按样本顺序取。",
      "Zone3 第3天的值应该在 9 以上，明显高于 Zone2。"
    ],
    solution: "cd_vec <- as.numeric(rild_expr[\"Cdkn1a\", rild_meta$sample])\ncd_mat <- tapply(cd_vec, list(rild_meta$zone, rild_meta$time), mean)\n",
    check: "if (!exists(\"cd_mat\")) return(\"缺少对象 cd_mat\")\nif (!is.matrix(cd_mat)) return(\"cd_mat 应该是矩阵，用 tapply 出来的正好是矩阵\")\nif (!all(dim(cd_mat) == c(3, 6))) return(sprintf(\"cd_mat 应是 3 行 6 列，当前是 %d 行 %d 列\", nrow(cd_mat), ncol(cd_mat)))\nz3 <- cd_mat[\"3\", \"3\"]; z2 <- cd_mat[\"2\", \"3\"]\nif (is.na(z3) || is.na(z2)) return(\"索引取不到值：行名应是 1/2/3，列名应是 0/1/3/7/14/28\")\nif (!(z3 > z2)) return(sprintf(\"第3天 Zone3 (%.2f) 应高于 Zone2 (%.2f)，否则说明 Cdkn1a 取错了\", z3, z2))\nif (z3 < 8.5) return(sprintf(\"Zone3 第3天的 Cdkn1a 约在 9.5 附近，你算出 %.2f，检查分组是否错乱\", z3))\nTRUE",
    xp: 50, star: 2
  },
  {
    id: "rbase-4", track: "rbase", title: "第四关 · 写函数：把重复动作封装成武器",
    story: "你已经复制粘贴了三遍『算 log2FC』的代码。导师说：写成函数。",
    goal: "掌握 function 定义、默认参数、向量化思维；理解 logFC 的定义。",
    tasks: [
      "log2fc <- function(mat, cols_a, cols_b)：返回每个基因 log2(平均A / 平均B)",
      "用它算 Zone2 第3天 vs 第0天的 logFC：fc_z2d3",
      "Mki67 的 logFC 应为正数且 > 0.5（照射后 Zone2 增殖上调）"
    ],
    datasets: ["rild_expr", "rild_meta"],
    starter: "log2fc <- function(mat, cols_a, cols_b) {\n  # 待实现\n}\n\nfc_z2d3 <- ...\nfc_z2d3[\"Mki67\"]\n",
    hints: [
      "对数倍变化的定义是 log2(mean(A) / mean(B))，不是 mean(A) - mean(B)——因为数据已经是 log2 尺度了，两种写法数值一样，但概念要分清。",
      "函数里 rowMeans(mat[, cols_a]) - rowMeans(mat[, cols_b]) 是最简洁的写法（因为输入已是 log2）。",
      "如果 Mki67 是负的，说明你把 A 和 B 放反了。"
    ],
    solution: "log2fc <- function(mat, cols_a, cols_b) {\n  rowMeans(mat[, cols_a, drop = FALSE]) - rowMeans(mat[, cols_b, drop = FALSE])\n}\na <- rild_meta$sample[rild_meta$zone == 2 & rild_meta$time == 3]\nb <- rild_meta$sample[rild_meta$zone == 2 & rild_meta$time == 0]\nfc_z2d3 <- log2fc(rild_expr, a, b)\n",
    check: "if (!exists(\"log2fc\") || !is.function(log2fc)) return(\"请定义函数 log2fc\")\nif (!exists(\"fc_z2d3\")) return(\"缺少对象 fc_z2d3\")\nif (length(fc_z2d3) != 51) return(sprintf(\"fc_z2d3 应有 51 个基因，当前 %d\", length(fc_z2d3)))\nif (fc_z2d3[\"Mki67\"] <= 0.5) return(sprintf(\"Mki67 的 logFC 应 > 0.5（Zone2 照射后增殖上调），当前 %.3f\", fc_z2d3[\"Mki67\"]))\ntest <- tryCatch(log2fc(rild_expr, rild_meta$sample[1:3], rild_meta$sample[4:6]), error = function(e) e)\nif (inherits(test, \"error\")) return(sprintf(\"你的函数在只传 3 列时会报错：%s\", conditionMessage(test)))\nTRUE",
    xp: 60, star: 2
  },

  /* ============================ Bulk ============================ */
  {
    id: "bulk-1", track: "bulk", title: "第五关 · 宽表转长表：为作图准备数据",
    story: "作图软件不吃宽 matrix，只吃长表：一行一个观测、一列一个变量。",
    goal: "手工实现 wide -> long 变换，理解 tidy 数据的形状。",
    tasks: [
      "rild_long：data.frame，列名为 gene / sample / expr，共 51 x 54 = 2754 行",
      "合并上每条样本对应的 zone / time / group",
      "检查：Zone2 的 Mki67 平均表达约 7.4"
    ],
    datasets: ["rild_expr", "rild_meta"],
    starter: "# 不用 tidyr::pivot_longer，纯 base R 实现\nrild_long <- ...\n",
    hints: [
      "思路：先 expand 出所有 (gene, sample) 组合：expand.grid()。",
      "表达值用 as.vector(t(mat)) 或 as.vector(mat) —— 注意 R 是按列存的，别把行列顺序搞反。",
      "合并信息用 merge(rild_long, rild_meta, by = \"sample\")。"
    ],
    solution: "rild_long <- expand.grid(gene = rownames(rild_expr), sample = colnames(rild_expr),\n                          stringsAsFactors = FALSE)\nrild_long$expr <- as.vector(as.matrix(rild_expr))\nrild_long <- merge(rild_long, rild_meta, by = \"sample\")\n",
    check: "if (!exists(\"rild_long\")) return(\"缺少对象 rild_long\")\nif (!all(c(\"gene\", \"sample\", \"expr\") %in% names(rild_long))) return(\"rild_long 至少要包含三列：gene / sample / expr\")\nif (nrow(rild_long) != 2754) return(sprintf(\"应有 2754 行（51 基因 x 54 样本），当前 %d 行\", nrow(rild_long)))\nif (!all(c(\"zone\", \"time\", \"group\") %in% names(rild_long))) return(\"请再把 zone / time / group 合并进来（merge(rild_long, rild_meta, by=\\\"sample\\\")）\")\nsub <- subset(rild_long, gene == \"Mki67\" & zone == 2)\nif (abs(mean(sub$expr) - 7.4) > 1.0) return(sprintf(\"Zone2 的 Mki67 均值约 7.4，你算出 %.3f —— 极可能是转置方向搞反了\", mean(sub$expr)))\nTRUE",
    xp: 60, star: 2
  },
  {
    id: "bulk-2", track: "bulk", title: "第六关 · 手撕差异分析：t 检验 + BH 校正",
    story: "DESeq2 是黑箱。导师要求你先用最朴素的办法做一遍——以后才有底气说『我用 DESeq2 验证过』。",
    goal: "亲手实现逐基因 t 检验、logFC 计算、BH 多重检验校正，理解火山图背后的每一步。",
    tasks: [
      "deg：data.frame，行名是基因，含 logFC / P.Value / adj.P.Val 三列",
      "比较 Zone2 第3天（处理）vs 第0天（对照）",
      "Mki67 应显著上调，Cdkn1a 也应上调"
    ],
    datasets: ["rild_expr", "rild_meta"],
    starter: "# 1) 分组列名\ntreat <- rild_meta$sample[rild_meta$zone == 2 & rild_meta$time == 3]\nctrl  <- rild_meta$sample[rild_meta$zone == 2 & rild_meta$time == 0]\n\n# 2) 逐基因 t 检验（apply 或 for 循环）\n# 3) logFC = 处理均值 - 对照均值\n# 4) p.adjust(method = \"BH\")\ndeg <- ...\n",
    hints: [
      "逐基因检验：apply(mat, 1, function(x) t.test(x[treat], x[ctrl])$p.value)。",
      "注意 t.test 里传的是数值向量，不是列名——用 match() 把列名换成列序号。",
      "BH 校正一行搞定：p.adjust(p, method = \"BH\")。别用 Bonferroni，太保守。",
      "为什么不能直接对 counts 做 t 检验？因为 counts 是离散的、均值方差相关；本数据已是 log2，近似正态，所以这里可以先做。"
    ],
    solution: "treat <- rild_meta$sample[rild_meta$zone == 2 & rild_meta$time == 3]\nctrl  <- rild_meta$sample[rild_meta$zone == 2 & rild_meta$time == 0]\nmt <- rild_expr[, treat]; mc <- rild_expr[, ctrl]\ndeg <- data.frame(\n  logFC     = rowMeans(mt) - rowMeans(mc),\n  P.Value   = apply(rild_expr, 1, function(x) t.test(x[treat], x[ctrl])$p.value),\n  stringsAsFactors = FALSE\n)\ndeg$adj.P.Val <- p.adjust(deg$P.Value, method = \"BH\")\n",
    check: "if (!exists(\"deg\")) return(\"缺少对象 deg\")\nneed <- c(\"logFC\", \"P.Value\", \"adj.P.Val\")\nmiss <- setdiff(need, names(deg))\nif (length(miss)) return(sprintf(\"deg 缺少列：%s\", paste(miss, collapse = \", \")))\nif (nrow(deg) != 51) return(sprintf(\"deg 应有 51 行（全部基因），当前 %d\", nrow(deg)))\nif (any(is.na(deg$adj.P.Val))) return(\"adj.P.Val 里有 NA，检查 p.adjust 的输入是否有 NA\")\nm <- deg[\"Mki67\", ]\nif (m$logFC <= 0.5) return(sprintf(\"Mki67 应上调（logFC > 0.5），当前 %.3f\", m$logFC))\nif (!(\"Cdkn1a\" %in% rownames(deg) && deg[\"Cdkn1a\", \"logFC\"] > 0)) return(\"Cdkn1a 应上调，检查分组是否放反\")\nsig <- rownames(deg)[deg$adj.P.Val < 0.05 & abs(deg$logFC) > 1]\nif (length(sig) < 5) return(sprintf(\"显著基因（adj<0.05 且 |logFC|>1）应有不少（>=5），当前只有 %d\", length(sig)))\nTRUE",
    xp: 90, star: 3
  },
  {
    id: "bulk-3", track: "bulk", title: "第七关 · 火山图数据：把圈子 Juliet叫: 哪些基因值得写进论文",
    story: "火山图不是画图本身难，是『什么算显著』的判断难。",
    goal: "完成完整的差异分析流水线并给每个基因打标签（Up / Down / NS）。",
    tasks: [
      "vol：lihc_expr 的肿瘤 vs 癌旁差异结果，含 logFC / adj.P.Val / change",
      "change 是三分类因子：Up（上调）/ Down（下调）/ NS（不显著）",
      "阈值：|logFC| > 1 且 adj.P.Val < 0.05"
    ],
    datasets: ["lihc_expr", "lihc_clin"],
    starter: "# lihc_expr：72 个基因 x 60 个样本；lihc_clin：分组与随访\ntumor  <- lihc_clin$sample[lihc_clin$group == \"Tumor\"]\nnormal <- lihc_clin$sample[lihc_clin$group == \"Normal\"]\nvol <- ...\n",
    hints: [
      "这一步和上一关完全一样，区别在于样本更多（40 vs 20）。",
      "分类用 cut() 或 ifelse 嵌套；最清晰的写法是先用 ifelse 判显著性，再判方向。",
      "table(vol$change) 看一下三类各有多少 —— 如果全 NS，说明阈值定得太严或分组错了。"
    ],
    solution: "tumor  <- lihc_clin$sample[lihc_clin$group == \"Tumor\"]\nnormal <- lihc_clin$sample[lihc_clin$group == \"Normal\"]\nvol <- data.frame(\n  logFC     = rowMeans(lihc_expr[, tumor])  - rowMeans(lihc_expr[, normal]),\n  P.Value   = apply(lihc_expr, 1, function(x) t.test(x[tumor], x[normal])$p.value)\n)\nvol$adj.P.Val <- p.adjust(vol$P.Value, method = \"BH\")\nvol$change <- ifelse(vol$adj.P.Val < 0.05 & abs(vol$logFC) > 1,\n                     ifelse(vol$logFC > 0, \"Up\", \"Down\"), \"NS\")\nvol$change <- factor(vol$change, levels = c(\"Up\", \"Down\", \"NS\"))\n",
    check: "if (!exists(\"vol\")) return(\"缺少对象 vol\")\nif (!all(c(\"logFC\", \"adj.P.Val\", \"change\") %in% names(vol))) return(\"vol 需要含 logFC / adj.P.Val / change 三列\")\ntb <- table(vol$change)\nif (!all(c(\"Up\", \"Down\", \"NS\") %in% names(tb))) return(sprintf(\"change 应包含 Up/Down/NS，当前为：%s\", paste(names(tb), collapse = \",\")))\nif (tb[[\"Up\"]] < 3) return(sprintf(\"上调基因应至少有 3 个，当前 %d\", tb[[\"Up\"]]))\nif (tb[[\"Down\"]] < 3) return(sprintf(\"下调基因应至少有 3 个，当前 %d\", tb[[\"Down\"]]))\nif (\"YAP1\" %in% rownames(vol) && vol[\"YAP1\", \"logFC\"] <= 0) return(\"YAP1 在肿瘤里应上调，检查是否把肿瘤/癌旁放反了\")\nTRUE",
    xp: 90, star: 3
  },
  {
    id: "bulk-4", track: "bulk", title: "第八关 · 手撕富集分析：超几何分布与 BH",
    story: "『富集』听起来玄乎，本质就是一句话：我的候选基因里，落在这条通路上的比例，是不是高得不像巧合。",
    goal: "实现 ORA（Over-Representation Analysis）：2x2 表 + 超几何检验 + BH 校正。",
    tasks: [
      "enrich：data.frame，含 pathway / k（命中数）/ K（通路基因数）/ p / p.adjust",
      "用上一关筛出的 Up 基因（火山图里 change == \"Up\"）作为候选集",
      "基因集合 gmt 已读为一个 list；背景基因集 = lihc_expr 的全部基因"
    ],
    datasets: ["gmt", "lihc_expr", "lihc_clin"],
    starter: "# gmt：list，每项是一个字符向量（通路名 -> 基因）\nnames(gmt)\n\n# 候选基因（用上一关的 Up 基因即可）\ncandidate <- rownames(vol)[vol$change == \"Up\"]\n\n# 背景\nuniverse <- rownames(lihc_expr)\n\n# 逐通路超几何检验：phyper(k-1, K, N-K, n, lower.tail = FALSE)\nenrich <- ...\n",
    hints: [
      "超几何四个参数：phyper(k-1, K, N-K, n, lower.tail = FALSE)\n  K = 该通路在背景里的基因数；N = 背景总数；n = 候选基因数；k = 候选中落在该通路的条数。",
      "关键坑：通路基因必须先用 intersect(通路, 背景) 过滤，否则 K 会被高估，结果全乱。",
      "注意大小写：lihc_expr 的行名是全大写（如 TP53），gmt 里也是全大写 —— 但对别的数据集你可能需要 toupper()。"
    ],
    solution: "tumor  <- lihc_clin$sample[lihc_clin$group == \"Tumor\"]\nnormal <- lihc_clin$sample[lihc_clin$group == \"Normal\"]\nvol <- data.frame(\n  logFC   = rowMeans(lihc_expr[, tumor]) - rowMeans(lihc_expr[, normal]),\n  P.Value = apply(lihc_expr, 1, function(x) t.test(x[tumor], x[normal])$p.value)\n)\nvol$adj.P.Val <- p.adjust(vol$P.Value, method = \"BH\")\nvol$change <- ifelse(vol$adj.P.Val < 0.05 & abs(vol$logFC) > 1,\n                     ifelse(vol$logFC > 0, \"Up\", \"Down\"), \"NS\")\nvol$change <- factor(vol$change, levels = c(\"Up\", \"Down\", \"NS\"))\ncandidate <- rownames(vol)[vol$change == \"Up\"]\nuniverse  <- rownames(lihc_expr)\nn <- length(candidate); N <- length(universe)\nres <- do.call(rbind, lapply(names(gmt), function(pw) {\n  pw_genes <- intersect(gmt[[pw]], universe)\n  K <- length(pw_genes)\n  if (K == 0) return(NULL)\n  k <- length(intersect(candidate, pw_genes))\n  data.frame(pathway = pw, k = k, K = K, n = n, N = N,\n             p = phyper(k - 1, K, N - K, n, lower.tail = FALSE),\n             stringsAsFactors = FALSE)\n}))\nres$p.adjust <- p.adjust(res$p, method = \"BH\")\nenrich <- res[order(res$p), ]\n",
    check: "if (!exists(\"enrich\")) return(\"缺少对象 enrich\")\nneed <- c(\"pathway\", \"k\", \"K\", \"p\", \"p.adjust\")\nmiss <- setdiff(need, names(enrich))\nif (length(miss)) return(sprintf(\"enrich 缺列：%s\", paste(miss, collapse = \", \")))\nif (nrow(enrich) < 5) return(sprintf(\"至少应对 5 条以上通路做检验，当前 %d\", nrow(enrich)))\nif (any(enrich$p > 1 | enrich$p < 0)) return(sprintf(\"p 值应落在 [0,1]，检查 phyper 参数顺序是否正确（k-1, K, N-K, n）\"))\nif (!is.unsorted(rev(enrich$p)) && !is.unsorted(enrich$p)) return(\"enrich 建议按 p 值排序再输出\")\nsig <- enrich[enrich$p.adjust < 0.05, ]\nif (nrow(sig) < 1) return(\"应有至少 1 条通路 p.adjust < 0.05 —— 若没有，检查候选基因是否选太少\")\nTRUE",
    xp: 120, star: 4
  },
  {
    id: "bulk-5", track: "bulk", title: "第九关 · 手撕生存分析：KM 曲线与 log-rank",
    story: "survival 包一行出图，但导师问你『删失数据为什么不能直接算均值』——你要能答上来。",
    goal: "不用 survival 包，手写 Kaplan-Meier 乘积限估计 + log-rank 检验。",
    tasks: [
      "km_high / km_low：YAP1 高 / 低表达组的 KM 估计结果，各为 data.frame(time, surv)",
      "按 YAP1 表达中位数分组（仅用 Tumor 样本）",
      "logrank_p：对数秩检验的 p 值，应 < 0.05"
    ],
    datasets: ["lihc_expr", "lihc_clin"],
    starter: "# 只取有随访的肿瘤样本\ntumor <- lihc_clin[lihc_clin$group == \"Tumor\", ]\nyap   <- as.numeric(lihc_expr[\"YAP1\", tumor$sample])\ngroup <- ifelse(yap > median(yap), \"High\", \"Low\")\n\nkm_fit <- function(time, status) {\n  # 乘积限估计：S(t) = prod(1 - d_i / n_i)\n}\n\n# log-rank：对每个发生事件的时间点，累加 (O_i - E_i)\nlogrank_p <- ...\n",
    hints: [
      "KM 公式：把死亡时间点升序排列，S(t) = S(t_prev) × (1 - d_t / n_t)，其中 n_t = 到 t 时刻仍在随访的人数（含 t 时刻删失后再计入下一时刻）。",
      "log-rank 统计量：Σ(O_i − E_i) 的平方 / ΣV_i，服从自由度 1 的卡方。E_i = d_total × n_1/(n_1+n_2)，V_i = ... 用超几何方差。",
      "p 值用 pchisq(chi, df = 1, lower.tail = FALSE)。",
      "结果应该显示出：YAP1 高表达组预后更差。"
    ],
    solution: "km_fit <- function(time, status) {\n  ord <- order(time)\n  time <- time[ord]; status <- status[ord]\n  ut <- sort(unique(time[status == 1]))\n  s <- 1; out <- data.frame(time = 0, surv = 1)\n  for (t in ut) {\n    n <- sum(time >= t)\n    d <- sum(time == t & status == 1)\n    s <- s * (1 - d / n)\n    out <- rbind(out, data.frame(time = t, surv = s))\n  }\n  out\n}\ntumor <- lihc_clin[lihc_clin$group == \"Tumor\", ]\nyap   <- as.numeric(lihc_expr[\"YAP1\", tumor$sample])\ngrp   <- ifelse(yap > median(yap), \"High\", \"Low\")\nkm_high <- km_fit(tumor$os_time[grp == \"High\"], tumor$os_status[grp == \"High\"])\nkm_low  <- km_fit(tumor$os_time[grp == \"Low\"],  tumor$os_status[grp == \"Low\"])\n\nlogrank_test <- function(time, status, group) {\n  ut <- sort(unique(time[status == 1]))\n  O <- E <- V <- numeric(0)\n  for (t in ut) {\n    n1 <- sum(time >= t & group == \"High\"); n2 <- sum(time >= t & group == \"Low\")\n    n  <- n1 + n2\n    d1 <- sum(time == t & status == 1 & group == \"High\")\n    d  <- sum(time == t & status == 1)\n    if (n < 2) next\n    E <- c(E, d * n1 / n)\n    O <- c(O, d1)\n    V <- c(V, d * (n1 / n) * (n2 / n) * (n - d) / (n - 1))\n  }\n  chi <- sum(O - E)^2 / sum(V)\n  c(chi = chi, p = pchisq(chi, df = 1, lower.tail = FALSE))\n}\nlr <- logrank_test(tumor$os_time, tumor$os_status, grp)\nlogrank_p <- as.numeric(lr[\"p\"])\n",
    check: "if (!exists(\"km_high\") || !exists(\"km_low\")) return(\"缺少对象 km_high / km_low\")\nif (!exists(\"logrank_p\")) return(\"缺少对象 logrank_p\")\nfor (nm in c(\"km_high\", \"km_low\")) {\n  o <- get(nm)\n  if (!all(c(\"time\", \"surv\") %in% names(o))) return(sprintf(\"%s 应含 time / surv 两列\", nm))\n  if (abs(o$surv[1] - 1) > 1e-6) return(sprintf(\"%s 起始生存率应为 1，当前 %.3f\", nm, o$surv[1]))\n}\nif (!is.unsorted(rev(km_high$surv)) && !is.unsorted(km_low$surv)) return(\"KM 曲线应单调不增，检查连乘逻辑\")\nendpoint <- function(o) { i <- which(o$time <= 1000); o$surv[max(i, 1)] }\nif (!(endpoint(km_high) < endpoint(km_low))) return(sprintf(\"第1000天时 YAP1 高表达组生存率(%.3f)应低于低表达组(%.3f)\", endpoint(km_high), endpoint(km_low)))\nif (!(logrank_p < 0.05)) return(sprintf(\"log-rank p 应 < 0.05，当前 %.4f —— 检查 E/O/V 的计算\", logrank_p))\nTRUE",
    xp: 140, star: 4
  },

  /* ============================ 单细胞 ============================ */
  {
    id: "scrna-1", track: "scrna", title: "第十关 · 单细胞质控：三害过滤",
    story: "900 个细胞里混进了一群垃圾：空液滴（基因数极少）、破裂细胞（线粒体基因比例极高）。不滤掉它们，后面所有聚类都白做。",
    goal: "理解 QC 三个指标的含义，并写出过滤逻辑。",
    tasks: [
      "sc_qc：过滤后的细胞，保留 nFeature_RNA >= 200 且 percent_mt < 20",
      "n_removed：被剔除的细胞数（应在 50–150 之间）",
      "报告过滤前后细胞数"
    ],
    datasets: ["scrna_meta"],
    starter: "# scrna_meta：900 个细胞 + QC 指标 + 12 个标记基因 counts\nnrow(scrna_meta)\nsummary(scrna_meta[, c(\"nFeature_RNA\", \"percent_mt\")])\n\nsc_qc <- ...\n",
    hints: [
      "nFeature_RNA 是检出的基因数：太低说明是空液滴或细胞膜破了，内容物流失。",
      "percent_mt 是线粒体基因占比：高说明细胞濒死或破裂（胞质 RNA 流失，线粒体 RNA 相对富集）。",
      "两 Mohammed ' & 连接，注意每个条件都要加括号理解优先级。",
      "阈值不是死的：标准阈值 200/20%，但要看数据分布。"
    ],
    solution: "keep <- scrna_meta$nFeature_RNA >= 200 & scrna_meta$percent_mt < 20\nsc_qc <- scrna_meta[keep, ]\nn_removed <- sum(!keep)\n",
    check: "if (!exists(\"sc_qc\")) return(\"缺少对象 sc_qc\")\nif (!exists(\"n_removed\")) return(\"缺少对象 n_removed\")\nif (nrow(sc_qc) >= 900) return(\"一个都没过滤掉 —— 检查过滤条件是否写反了\")\nif (nrow(sc_qc) < 700) return(sprintf(\"过滤太狠了，只剩 %d 个细胞（应剩 800+）\", nrow(sc_qc)))\nif (n_removed < 50 || n_removed > 150) return(sprintf(\"剔除细胞数应在 50-150 之间，当前 %d\", n_removed))\nif (any(sc_qc$nFeature_RNA < 200)) return(\"sc_qc 里仍有 nFeature_RNA < 200 的细胞\")\nif (any(sc_qc$percent_mt >= 20)) return(\"sc_qc 里仍有 percent_mt >= 20 的细胞\")\nTRUE",
    xp: 80, star: 2
  },
  {
    id: "scrna-2", track: "scrna", title: "第十一关 · 手撕归一化：LogNormalize 到底算了什么",
    story: "Seurat 的 NormalizeData 只做了一件事：每个细胞除以自己的文库量，乘以 10000，再取对数。你自己写一遍。",
    goal: "实现 CPM-like 归一化 + log1p，理解为什么要做这一步。",
    tasks: [
      "norm_mat：归一化后的矩阵（细胞 x 基因），scale factor = 1e4",
      "每个细胞的原始 counts 总和差异很大，归一化后各细胞的总和应该接近 1e4（对数前）",
      "检查 Alb 在肝细胞里仍应是高值"
    ],
    datasets: ["scrna_meta"],
    starter: "gene_cols <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\",\n               \"Vegfa\", \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\",\n               \"Krt19\", \"Hgf\", \"Cd3e\")\ncounts <- as.matrix(scrna_meta[, gene_cols])\nnorm_mat <- ...\n",
    hints: [
      "归一化公式：log1p(counts / colSums(counts) * 1e4)。",
      "colSums(counts) 是每个细胞的文库量；注意这里细胞是行、基因是列，所以要按行求总和：rowSums()。",
      "为什么要除以文库量？因为测序深度不同，不校正则高深度细胞所有基因都虚高。",
      "为什么取对数？让方差稳定，避免少数极高表达基因主导后续 PCA。"
    ],
    solution: "gene_cols <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\",\n               \"Vegfa\", \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\",\n               \"Krt19\", \"Hgf\", \"Cd3e\")\ncounts <- as.matrix(scrna_meta[, gene_cols])\nlib_size <- rowSums(counts)\nnorm_mat <- log1p(t(t(counts) / lib_size * 1e4))\n",
    check: "if (!exists(\"norm_mat\")) return(\"缺少对象 norm_mat\")\nif (!is.matrix(norm_mat)) return(\"norm_mat 应是矩阵\")\nif (!all(dim(norm_mat) == dim(counts))) return(sprintf(\"norm_mat 维度应与 counts 一致（%d x %d）\", nrow(counts), ncol(counts)))\nif (max(norm_mat) > 12) return(sprintf(\"最大值 %.2f 偏高：确认用的是 log1p(CP10K)，不是原始 counts\", max(norm_mat)))\nif (max(norm_mat) < 2) return(\"数值太小，可能忘了乘 1e4 或忘了 log1p\")\ncv_before <- sd(counts[, \"Alb\"]) / mean(counts[, \"Alb\"])\ncv_after  <- sd(norm_mat[, \"Alb\"]) / mean(norm_mat[, \"Alb\"])\nif (cv_after > cv_before) return(\"归一化后 Alb 的变异系数反而变大了，检查是否按细胞（行）而非基因（列）求文库量\")\nTRUE",
    xp: 100, star: 3
  },
  {
    id: "scrna-3", track: "scrna", title: "第十二关 · 高变基因：找到真正携带信息的那批基因",
    story: "2 万个基因里大部分是管家基因，方差全都差不多。真正区分细胞类型的，是那批表达忽高忽低的。",
    goal: "理解均值-方差关系，用离散度（variance/mean）筛选 HVG。",
    tasks: [
      "hvg_stats：data.frame，含 gene / mean / var / disp（离散度 = var/mean）",
      "hvg：按离散度排序取前 8 个高变基因",
      "验证：Cd3e 或 Col1a1 这类细胞特异基因应该榜上有名"
    ],
    datasets: ["scrna_meta"],
    starter: "gene_cols <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\",\n               \"Vegfa\", \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\",\n               \"Krt19\", \"Hgf\", \"Cd3e\")\n# 建议先用第十关过滤后的数据 sc_qc，以及第十一关的 norm_mat\nhvg_stats <- ...\nhvg <- ...\n",
    hints: [
      "离散度 = 方差 / 均值。低表达的基因天然离散度高Zero inflation），所以要先卡一个最小表达量。",
      "更严谨的做法（Seurat vst）：先按表达量分箱，每箱内做 z-score，消除均值对方差的影响。",
      "本关为了简化，直接算 disp 排序；真实分析里请务必用 FindVariableFeatures。"
    ],
    solution: "gene_cols <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\",\n               \"Vegfa\", \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\",\n               \"Krt19\", \"Hgf\", \"Cd3e\")\ncounts <- as.matrix(scrna_meta[, gene_cols])\nlib <- rowSums(counts)\nnorm_mat <- log1p(t(t(counts) / lib * 1e4))\nhvg_stats <- data.frame(\n  gene = colnames(norm_mat),\n  mean = colMeans(norm_mat),\n  var  = apply(norm_mat, 2, var),\n  stringsAsFactors = FALSE\n)\nhvg_stats$disp <- hvg_stats$var / (hvg_stats$mean + 0.01)\nhvg_stats <- hvg_stats[order(hvg_stats$disp, decreasing = TRUE), ]\nhvg <- head(hvg_stats$gene, 8)\n",
    check: "if (!exists(\"hvg_stats\")) return(\"缺少对象 hvg_stats\")\nif (!all(c(\"gene\", \"mean\", \"var\", \"disp\") %in% names(hvg_stats))) return(\"hvg_stats 应含 gene/mean/var/disp 四列\")\nif (!exists(\"hvg\")) return(\"缺少对象 hvg\")\nif (length(hvg) != 8) return(sprintf(\"hvg 应包含 8 个基因名，当前 %d 个\", length(hvg)))\nif (!any(c(\"Cd3e\", \"Col1a1\", \"Acta2\", \"Krt19\", \"Cd68\", \"Pecam1\", \"Cdh5\") %in% hvg)) return(sprintf(\"高变基因里应该出现细胞类型特异基因（如 Cd3e/Col1a1/Krt19/Cd68），当前是：%s\", paste(hvg, collapse = \", \")))\nif (is.unsorted(rev(hvg_stats$disp))) return(\"hvg_stats 请按 disp 降序排列\")\nTRUE",
    xp: 100, star: 3
  },
  {
    id: "scrna-4", track: "scrna", title: "第十三关 · 降维与聚类：PCA + 层次聚类 + ARI 评分",
    story: "把 18 维压到 2 维，再聚成 6 类。但你怎么知道自己聚得对？——数据里藏着真相标签，用 ARI 打分。",
    goal: "手撕 PCA 与聚类，并用调整兰德指数（ARI）客观评估聚类质量。",
    tasks: [
      "pca_res：prcomp 的结果（先 scale）",
      "clusters：cutree(hclust(dist(PC1:5)), k = 6) 得到的聚类向量",
      "ari：调整兰德指数，应 > 0.45（说明聚类基本还原了真实细胞类型）"
    ],
    datasets: ["scrna_meta"],
    starter: "# 用 sc_qc（第十关）的数据，沿用 norm_mat\npca_res  <- ...\nclusters <- ...\n\n# ARI：需要自己写\nari <- ...\n\n# 交叉表看看和真相的对应\ntable(clusters, sc_qc$celltype)\n",
    hints: [
      "prcomp(norm_mat, scale. = TRUE, center = TRUE) —— scale 必须开，否则高表达基因主导。",
      "聚类用前 5–10 个 PC 就够，后面是噪声：pca_res$x[, 1:5]。",
      "ARI 公式：ARI = (Σ_ij C(n_ij,2) − [Σ_i C(a_i,2) Σ_j C(b_j,2)] / C(n,2)) / (½[Σ_i C(a_i,2) + Σ_j C(b_j,2)] − [Σ_i C(a_i,2) Σ_j C(b_j,2)] / C(n,2))",
      "C(n,2) = n*(n-1)/2 —— 组合数。"
    ],
    solution: "gene_cols <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\",\n                \"Vegfa\", \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\",\n                \"Krt19\", \"Hgf\", \"Cd3e\")\ncounts   <- as.matrix(scrna_meta[, gene_cols])\nlib      <- rowSums(counts)\nnorm_mat <- log1p(t(t(counts) / lib * 1e4))\nkeep   <- scrna_meta$nFeature_RNA >= 200 & scrna_meta$percent_mt < 20\nsc_qc  <- scrna_meta[keep, ]\nnorm_mat <- norm_mat[keep, ]\npca_res  <- prcomp(norm_mat, center = TRUE, scale. = TRUE)\nd  <- dist(pca_res$x[, 1:5])\nclusters <- cutree(hclust(d, method = \"ward.D2\"), k = 6)\n\ncomb2 <- function(n) n * (n - 1) / 2\nari <- function(cl, truth) {\n  tab <- table(cl, truth)\n  n   <- sum(tab)\n  sij <- sum(apply(tab, 1:2, comb2))\n  ai  <- sum(comb2(rowSums(tab)))\n  bj  <- sum(comb2(colSums(tab)))\n  num <- sij - ai * bj / comb2(n)\n  den <- (ai + bj) / 2 - ai * bj / comb2(n)\n  num / den\n}\nari <- ari(clusters, sc_qc$celltype)\n",
    check: "if (!exists(\"pca_res\")) return(\"缺少对象 pca_res\")\nif (!exists(\"clusters\")) return(\"缺少对象 clusters\")\nif (!exists(\"ari\")) return(\"缺少对象 ari：请计算调整兰德指数\")\nif (length(unique(clusters)) < 3) return(sprintf(\"聚类数只有 %d 类，k=6 时应接近 6 类\", length(unique(clusters))))\nif (!is.numeric(ari) || is.na(ari)) return(\"ari 应为数值且非 NA\")\nif (ari < 0.45) return(sprintf(\"ARI = %.3f，低于 0.45 —— 试试只用前 5 个 PC、并用 ward.D2 聚类\", ari))\nTRUE",
    xp: 150, star: 4
  },
  {
    id: "scrna-5", track: "scrna", title: "第十四关 · 细胞注释：让每个 cluster 有个名字",
    story: "聚类只是把相似的细胞堆在一起。真正的 work 是说出『这一堆是肝细胞、那一堆是内皮』。",
    goal: "基于标记基因的平均表达给每个 cluster 指派细胞类型，并评估准确率。",
    tasks: [
      "cluster_mean：每个 cluster x 每个标记基因的平均表达矩阵",
      "cluster_type：每个 cluster 对应的细胞类型（字符向量，长度=聚类数）",
      "accuracy：与真相标签的一致率，应 > 0.5"
    ],
    datasets: ["scrna_meta"],
    starter: "# 标记基因 -> 细胞类型 对照表（肝脏常用）\nmarkers <- list(\n  Hepatocyte     = c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\"),\n  Endothelial    = c(\"Pecam1\", \"Cdh5\", \"Kdr\"),\n  Stellate       = c(\"Acta2\", \"Col1a1\", \"Tgfb1\"),\n  Kupffer        = c(\"Cd68\", \"Ptprc\", \"Ccl2\"),\n  Cholangiocyte  = c(\"Krt19\", \"Hgf\"),\n  Lymphocyte     = c(\"Cd3e\", \"Ptprc\")\n)\ncluster_mean <- ...\ncluster_type <- ...\naccuracy     <- ...\n",
    hints: [
      "对每个 cluster，计算它在每个细胞类型标记集上的平均分，取最高分那个类型。",
      "注意 Ptprc（CD45）是泛免疫细胞标志，在 Kupffer 和 Lymphocyte 里都高 —— 这正是单注释会出错的地方。",
      "准确率 = mean(assigned[clusters] == sc_qc$celltype)。"
    ],
    solution: "gene_cols <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\",\n                \"Vegfa\", \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\",\n                \"Krt19\", \"Hgf\", \"Cd3e\")\ncounts   <- as.matrix(scrna_meta[, gene_cols])\nlib      <- rowSums(counts)\nnorm_mat <- log1p(t(t(counts) / lib * 1e4))\nkeep   <- scrna_meta$nFeature_RNA >= 200 & scrna_meta$percent_mt < 20\nsc_qc  <- scrna_meta[keep, ]\nnorm_mat <- norm_mat[keep, ]\nmarkers <- list(\n  Hepatocyte    = c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\"),\n  Endothelial   = c(\"Pecam1\", \"Cdh5\", \"Kdr\"),\n  Stellate      = c(\"Acta2\", \"Col1a1\", \"Tgfb1\"),\n  Kupffer       = c(\"Cd68\", \"Ptprc\", \"Ccl2\"),\n  Cholangiocyte = c(\"Krt19\", \"Hgf\"),\n  Lymphocyte    = c(\"Cd3e\", \"Ptprc\")\n)\ncluster_mean <- sapply(markers, function(gs) {\n  sapply(split(seq_len(nrow(norm_mat)), clusters),\n         function(ix) mean(norm_mat[ix, gs, drop = FALSE]))\n})\ncluster_type <- colnames(cluster_mean)[apply(cluster_mean, 1, which.max)]\nnames(cluster_type) <- rownames(cluster_mean)\nassigned <- cluster_type[as.character(clusters)]\naccuracy <- mean(assigned == sc_qc$celltype)\n",
    check: "if (!exists(\"cluster_mean\")) return(\"缺少对象 cluster_mean（cluster x marker 平均表达矩阵）\")\nif (!exists(\"cluster_type\")) return(\"缺少对象 cluster_type：每个 cluster 一个细胞类型名\")\nif (!exists(\"accuracy\")) return(\"缺少对象 accuracy\")\nif (!is.numeric(accuracy)) return(\"accuracy 应为数值\")\nif (accuracy < 0.5) return(sprintf(\"注释准确率 %.1f%%，低于 50%% —— 检查 score 矩阵的行列方向（应是 cluster 为行、细胞 type 为列）\", accuracy * 100))\nif (!all(cluster_type %in% c(\"Hepatocyte\", \"Endothelial\", \"Stellate\", \"Kupffer\", \"Cholangiocyte\", \"Lymphocyte\"))) return(\"cluster_type 的取值应来自给定的 6 种细胞类型\")\nif (length(unique(cluster_type)) < 3) return(sprintf(\"只注释出 %d 种细胞类型，应能区分出 4 种以上\", length(unique(cluster_type))))\nTRUE",
    xp: 150, star: 4
  }
];
