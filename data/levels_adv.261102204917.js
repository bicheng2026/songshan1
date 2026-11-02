// 嵩山一号 · 科研工作站  关卡：空间 / MR / 毒理-药物 / 机器学习 / 写作
window.SX_LEVELS = (window.SX_LEVELS || []).concat([
  /* ============================ 空间转录组 ============================ */
  {
    id: "spatial-1", track: "spatial", title: "第十五关 · Spot 反卷积：这块组织里是谁在说话",
    story: "一个 spot 里装着 1-10 个细胞。要还原比例，最朴素的做法是用标记基因的打分。",
    goal: "理解 spot 反卷积的核心思路：标记基因集 -> 每个 spot 打分 -> 判定主导细胞类型。",
    tasks: [
      "score_mat：每个 spot x 每种细胞类型的打分矩阵（用标记基因 z-score 后求平均）",
      "region_call：每个 spot 判定的主导区域（Tumor / Stroma / Normal 三类）",
      "accuracy：与真实区域的一致率，应 > 0.6"
    ],
    datasets: ["spatial_spots"],
    starter: "# spatial_spots：484 个 spot，含 x/y 坐标、nCount、12 个基因、真实区域标签 region\nhead(spatial_spots)\n\nmarkers <- list(\n  Tumor  = c(\"EPCAM\", \"MKI67\", \"CDKN1A\"),\n  Stroma = c(\"COL1A1\", \"ACTA2\", \"COL3A1\"),\n  Normal = c(\"ALB\", \"CYP3A4\")\n)\nscore_mat <- ...\nregion_call <- ...\naccuracy <- ...\n",
    hints: [
      "基因表达在不同量级，先 scale() 做 z-score，否则高表达基因会吃掉所有权重。",
      "打分后每个 spot 取最高分那一类：apply(score_mat, 1, which.max)。",
      "真实标签在 spatial_spots$region 列，取值 Tumor_core / Margin / Normal；判定时请把 Tumor_core 视作 Tumor、Margin 视作 Stroma。"
    ],
    solution: "markers <- list(\n  Tumor  = c(\"EPCAM\", \"MKI67\", \"CDKN1A\"),\n  Stroma = c(\"COL1A1\", \"ACTA2\", \"COL3A1\"),\n  Normal = c(\"ALB\", \"CYP3A4\")\n)\ngene_cols <- unique(unlist(markers))\nexpr <- as.matrix(spatial_spots[, gene_cols])\nz <- scale(log1p(expr))\nscore_mat <- sapply(markers, function(gs) rowMeans(z[, gs, drop = FALSE]))\nrownames(score_mat) <- spatial_spots$spot_id\ncall3 <- colnames(score_mat)[apply(score_mat, 1, which.max)]\ntruth <- ifelse(spatial_spots$region == \"Tumor_core\", \"Tumor\",\n                ifelse(spatial_spots$region == \"Margin\", \"Stroma\", \"Normal\"))\nregion_call <- call3\naccuracy <- mean(region_call == truth)\n",
    check: "if (!exists(\"score_mat\")) return(\"缺少对象 score_mat\")\nif (!exists(\"region_call\")) return(\"缺少对象 region_call\")\nif (!exists(\"accuracy\")) return(\"缺少对象 accuracy\")\nif (nrow(score_mat) != 484) return(sprintf(\"score_mat 应有 484 行（每个 spot 一行），当前 %d\", nrow(score_mat)))\nif (length(region_call) != 484) return(sprintf(\"region_call 长度应为 484，当前 %d\", length(region_call)))\nif (!is.numeric(accuracy)) return(\"accuracy 应为数值\")\nif (accuracy < 0.6) return(sprintf(\"注释准确率 %.1f%%，低于 60%% —— 检查是不是忘了先做 z-score，或者 Tumor/Stroma 的判定与真实 region 映射错了\", accuracy * 100))\nif (length(unique(region_call)) < 3) return(sprintf(\"只叫出 %d 种区域，应能区分 3 种\", length(unique(region_call))))\nTRUE",
    xp: 130, star: 4
  },
  {
    id: "spatial-2", track: "spatial", title: "第十六关 · 空间自相关：Moran's I",
    story: "『表达在空间上不是随机的』这句话怎么量化？Moran's I 是标准答案。",
    goal: "手工计算 Moran's I，判断一个基因在空间上是否存在聚集模式。",
    tasks: [
      "morans_i：COL1A1 的空间自相关指数，应 > 0.3（显著的聚集模式）",
      "W：基于距离的邻接权重矩阵（距离 <= 1.5 视为邻居）",
      "顺便算 EPCAM 的 Moran's I 作为对照"
    ],
    datasets: ["spatial_spots"],
    starter: "# 坐标在 x / y 列\ncoords <- as.matrix(spatial_spots[, c(\"x\", \"y\")])\ndist_m <- as.matrix(dist(coords))\nW <- (dist_m <= 1.5 & dist_m > 0) * 1\n\nmoran <- function(x, W) {\n  # I = (n/S0) * sum_ij w_ij (x_i - xbar)(x_j - xbar) / sum_i (x_i - xbar)^2\n}\nmorans_i <- ...\n",
    hints: [
      "Moran's I 公式：n/S0 × Σ_ij w_ij(x_i−x̄)(x_j−x̄) / Σ_i(x_i−x̄)²，其中 S0 = Σ_ij w_ij。",
      "矩阵形式更快：z = x − mean(x)；I = (n/S0) × (z' W z) / (z' z)。注意要用 t(z) %*% W %*% z。",
      "I ≈ 0 表示随机，> 0 表示相似值聚集（本数据的三层结构应该给出明显正值）。"
    ],
    solution: "coords <- as.matrix(spatial_spots[, c(\"x\", \"y\")])\ndist_m <- as.matrix(dist(coords))\nW <- (dist_m <= 1.5 & dist_m > 0) * 1\nmoran <- function(x, W) {\n  n <- length(x)\n  S0 <- sum(W)\n  z <- x - mean(x)\n  (n / S0) * as.numeric(t(z) %*% W %*% z) / as.numeric(t(z) %*% z)\n}\nmorans_i  <- moran(spatial_spots$COL1A1, W)\nmorans_ep <- moran(spatial_spots$EPCAM, W)\n",
    check: "if (!exists(\"W\")) return(\"缺少对象：邻接权重矩阵 W\")\nif (!exists(\"morans_i\")) return(\"缺少对象 morans_i\")\nif (!is.numeric(morans_i) || is.na(morans_i)) return(\"morans_i 应为有效数值\")\nif (morans_i > 1.01 || morans_i < -1.01) return(sprintf(\"Moran's I 理论上一般落在 [-1,1]，当前 %.4f —— 检查 W 是否把自己也算成邻居（对角线要置 0）\", morans_i))\nif (morans_i < 0.3) return(sprintf(\"COL1A1 的 Moran's I = %.4f，低于 0.3 —— 检查邻居阈值（<=1.5）和公式里的 n/S0\", morans_i))\nTRUE",
    xp: 130, star: 4
  },

  /* ============================ 孟德尔随机化 ============================ */
  {
    id: "mr-1", track: "mr", title: "第十七关 · Wald ratio：一个 SNP 讲一个因果故事",
    story: "MR 的最小单元：一个工具变量 SNP，对暴露的效应 βx，对结局的效应 βy，因果估计就是 βy/βx。",
    goal: "手算 Wald ratio、标准误（Delta 法）与工具变量强度 F 统计量。",
    tasks: [
      "wald：data.frame，含 SNP / gene / beta_ratio / se_ratio / F_stat",
      "F = (beta_exposure / se_exposure)^2，F > 10 才算强工具变量",
      "报告弱工具变量（F < 10）的 SNP 数量"
    ],
    datasets: ["mr_dat"],
    starter: "# mr_dat：每个基因若干 SNP 的 exposure / outcome 效应\nnrow(mr_dat); head(mr_dat)\n\nwald <- data.frame(...)\n",
    hints: [
      "Wald ratio = beta_outcome / beta_exposure。",
      "标准误用 Delta 法近似：se_ratio ≈ se_outcome / |beta_exposure|（忽略 beta_x 的不确定性时的简化式）。",
      "p 值 = 2*pnorm(-abs(beta/se))；F 统计量 = (beta_exposure/se_exposure)^2。",
      "F < 10 叫弱工具变量，会产生向混杂方向的偏倚 —— 真实分析里必须剔除。"
    ],
    solution: "wald <- data.frame(\n  SNP        = mr_dat$SNP,\n  gene       = mr_dat$gene,\n  beta_ratio = mr_dat$beta_outcome / mr_dat$beta_exposure,\n  se_ratio   = mr_dat$se_outcome  / abs(mr_dat$beta_exposure),\n  F_stat     = (mr_dat$beta_exposure / mr_dat$se_exposure)^2,\n  stringsAsFactors = FALSE\n)\nwald$pval <- 2 * pnorm(-abs(wald$beta_ratio / wald$se_ratio))\nn_weak <- sum(wald$F_stat < 10)\n",
    check: "if (!exists(\"wald\")) return(\"缺少对象 wald\")\nneed <- c(\"SNP\", \"gene\", \"beta_ratio\", \"se_ratio\", \"F_stat\")\nmiss <- setdiff(need, names(wald))\nif (length(miss)) return(sprintf(\"wald 缺列：%s\", paste(miss, collapse = \", \")))\nif (nrow(wald) != nrow(mr_dat)) return(sprintf(\"wald 应有 %d 行（每个 SNP 一行），当前 %d\", nrow(mr_dat), nrow(wald)))\nif (any(!is.finite(wald$beta_ratio))) return(\"beta_ratio 有非有限值（NA/Inf），检查 beta_exposure 是否为 0\")\nif (any(wald$F_stat < 0)) return(\"F_stat 不应为负，检查平方是否写对\")\nif (exists(\"n_weak\") && n_weak != sum(wald$F_stat < 10)) return(\"n_weak 与 wald$F_stat 不一致\")\nTRUE",
    xp: 120, star: 3
  },
  {
    id: "mr-2", track: "mr", title: "第十八关 · IVW：把十几个 SNP 合成一个结论",
    story: "单个 SNP 噪声大。逆方差加权把所有 SNP 合并——这就是 MR 的主力方法。",
    goal: "手算 IVW（本质是固定效应 meta 分析），并理解权重为什么是 1/se²。",
    tasks: [
      "ivw：data.frame，每基因一行，含 gene / b / se / pval / nsnp",
      "SLC7A11 的 IVW 估计应显著为负（保护因素），PPARA 也应显著为负",
      "GPX4 / HMOX1 / CDKN1A 应不显著（真值为 0，这是数据设计的陷阱）"
    ],
    datasets: ["mr_dat"],
    starter: "# IVW 公式：b = sum(w * bx * by) / sum(w * bx^2)，w = 1/se_outcome^2\n# se = sqrt(1 / sum(w * bx^2))\nivw_one <- function(d) { ... }\n\nivw <- ...\n",
    hints: [
      "权重 w = 1/se_outcome²（结局的标准误，不是暴露的）。",
      "b = Σ(w·βx·βy) / Σ(w·βx²) ；se = sqrt(1 / Σ(w·βx²))。",
      "按 gene 拆分：split(mr_dat, mr_dat$gene)，再 do.call(rbind, lapply(...))。",
      "p = 2*pnorm(-abs(b/se))。"
    ],
    solution: "ivw_one <- function(d) {\n  w  <- 1 / d$se_outcome^2\n  bx <- d$beta_exposure; by <- d$beta_outcome\n  b  <- sum(w * bx * by) / sum(w * bx^2)\n  se <- sqrt(1 / sum(w * bx^2))\n  data.frame(gene = d$gene[1], b = b, se = se,\n             pval = 2 * pnorm(-abs(b / se)), nsnp = nrow(d),\n             stringsAsFactors = FALSE)\n}\nivw <- do.call(rbind, lapply(split(mr_dat, mr_dat$gene), ivw_one))\nivw <- ivw[order(ivw$pval), ]\n",
    check: "if (!exists(\"ivw\")) return(\"缺少对象 ivw\")\nneed <- c(\"gene\", \"b\", \"se\", \"pval\", \"nsnp\")\nmiss <- setdiff(need, names(ivw))\nif (length(miss)) return(sprintf(\"ivw 缺列：%s\", paste(miss, collapse = \", \")))\nif (nrow(ivw) != 8) return(sprintf(\"应对 8 个基因分别做 IVW，当前 %d 行\", nrow(ivw)))\nif (any(ivw$se <= 0)) return(\"标准误必须为正，检查 sqrt(1/sum(w*bx^2)) 是否写错\")\ns <- ivw[ivw$gene == \"SLC7A11\", ]\nif (nrow(s) != 1) return(\"没有找到 SLC7A11 的 IVW 结果\")\nif (!(s$b < 0)) return(sprintf(\"SLC7A11 的因果估计应为负（保护因素），当前 %.3f\", s$b))\nif (!(s$pval < 0.05)) return(sprintf(\"SLC7A11 应达到显著（p<0.05），当前 p=%.4f\", s$pval))\nif (length(unique(ivw$gene)) != 8) return(\"ivw 里 gene 应互不重复\")\nTRUE",
    xp: 150, star: 4
  },
  {
    id: "mr-3", track: "mr", title: "第十九关 · 稳健性三件套：Egger / 异质性 / 留一法",
    story: "审稿人一定问三句话：有没有多效性？SNP 之间一致吗？结果是不是靠单个 SNP 撑起来的？",
    goal: "手工实现 MR-Egger 回归、Cochran's Q 异质性检验、留一法敏感性分析。",
    tasks: [
      "egger：每基因的 Egger 截距与 p 值（截距显著≠0 提示存在定向多效性）",
      "het：Cochran's Q 与对应 p 值",
      "loo：PPARA 的留一法结果，去掉任一 SNP 后方向应保持一致"
    ],
    datasets: ["mr_dat"],
    starter: "# MR-Egger：by = b0 + b1 * bx + e，加权的加权最小二乘（w = 1/se_outcome^2）\n#   截距 b0 != 0  -> 存在定向多效性（pleiotropy）\n# Cochran Q = sum(w * (by - b_ivw * bx)^2)，自由度 = nsnp - 1\n# 留一法：逐个去掉 SNP 重算 IVW\negger <- ...\nhet <- ...\nloo <- ...\n",
    hints: [
      "Egger 回归就是 lm(by ~ bx, weights = w)，截距用 summary(fit)$coefficients[1, ] 取。",
      "注意 lm 的 weights 是 1/方差，正好就是 1/se_outcome²。",
      "Q 的 p 值用 pchisq(Q, df = nsnp - 1, lower.tail = FALSE)。",
      "留一法最简单：for (i in seq_len(nrow(d))) ivw_one(d[-i, ])。"
    ],
    solution: "egger_one <- function(d) {\n  w <- 1 / d$se_outcome^2\n  f <- lm(beta_outcome ~ beta_exposure, data = d, weights = w)\n  cf <- summary(f)$coefficients\n  data.frame(gene = d$gene[1], intercept = cf[1, 1], int_se = cf[1, 2],\n             int_p = cf[1, 4], slope = cf[2, 1], stringsAsFactors = FALSE)\n}\negger <- do.call(rbind, lapply(split(mr_dat, mr_dat$gene), egger_one))\n\nhet_one <- function(d) {\n  w <- 1 / d$se_outcome^2\n  b <- ivw_one(d)$b\n  Q <- sum(w * (d$beta_outcome - b * d$beta_exposure)^2)\n  data.frame(gene = d$gene[1], Q = Q, df = nrow(d) - 1,\n             p = pchisq(Q, df = nrow(d) - 1, lower.tail = FALSE),\n             stringsAsFactors = FALSE)\n}\nhet <- do.call(rbind, lapply(split(mr_dat, mr_dat$gene), het_one))\n\nd <- mr_dat[mr_dat$gene == \"PPARA\", ]\nloo <- do.call(rbind, lapply(seq_len(nrow(d)), function(i) {\n  o <- ivw_one(d[-i, ]); o$dropped <- d$SNP[i]; o\n}))\n",
    check: "if (!exists(\"egger\")) return(\"缺少对象 egger\")\nif (!exists(\"het\")) return(\"缺少对象 het\")\nif (!exists(\"loo\")) return(\"缺少对象 loo\")\nif (!all(c(\"gene\", \"intercept\", \"int_p\") %in% names(egger))) return(\"egger 应含 gene / intercept / int_p\")\nif (!all(c(\"gene\", \"Q\", \"p\") %in% names(het))) return(\"het 应含 gene / Q / p\")\nif (any(het$Q < 0)) return(sprintf(\"Cochran's Q 不能为负（%.3f），检查平方项\", min(het$Q)))\nif (!(\"PPARA\" %in% loo$gene)) return(\"loo 请针对 PPARA 做留一法\")\nif (nrow(loo) != sum(mr_dat$gene == \"PPARA\")) return(sprintf(\"PPARA 有 %d 个 SNP，留一法应得同样多行\", sum(mr_dat$gene == \"PPARA\")))\nif (length(unique(sign(loo$b))) != 1) return(sprintf(\"留一法结果方向不一致（有正有负），说明结果被某个 SNP 主导：%s\", paste(round(loo$b, 3), collapse = \", \")))\nTRUE",
    xp: 170, star: 5
  },
  {
    id: "mr-4", track: "mr", title: "第二十关 · 共定位：你俩到底是不是同一个信号",
    story: "MR 显著不等于因果。如果暴露和结局的 GWAS 信号来自两个相邻但不同的变异，MR 就是假阳性。共定位负责排这个雷。",
    goal: "理解 PP.H4 的含义，并用简化方法（双性状显著性 + 区域筛选）实现共定位初筛。",
    tasks: [
      "coloc：每基因一行，含 gene / n_snp / n_both_sig / flag（是否在两个性状上都达到全基因组显著）",
      "判据：区域内存在同时在两个性状上 p < 5e-8 的 SNP，视为存在共享信号",
      "输出哪些基因通过了共定位初筛"
    ],
    datasets: ["coloc_dat"],
    starter: "# coloc_dat：每个基因所在区域内的 SNP，含两个性状的 p 值\nnrow(coloc_dat); head(coloc_dat)\n\n# 正式流程用 coloc::coloc.abf()，这里手动实现初筛逻辑\ncoloc <- ...\n",
    hints: [
      "全基因组显著性阈值是 5e-8（GWAS 通用）。",
      "PP.H4 的严格定义是『两性状共享同一个因果变异』的后验概率，需要贝叶斯计算；这里我们做保守替代：区域内是否有 SNP 在两个性状上同时极显著。",
      "按 gene 分组：split(coloc_dat, coloc_dat$gene)。",
      "真实论文里，洪扬刚团队的做法是 coloc + PP.H4 > 0.5 才算通过 —— 这个方法学细节值得学。"
    ],
    solution: "coloc <- do.call(rbind, lapply(split(coloc_dat, coloc_dat$gene), function(d) {\n  both <- d$p_trait1 < 5e-8 & d$p_trait2 < 5e-8\n  data.frame(gene = d$gene[1], n_snp = nrow(d),\n             n_both_sig = sum(both), flag = as.integer(any(both)),\n             stringsAsFactors = FALSE)\n}))\npass_genes <- coloc$gene[coloc$flag == 1]\n",
    check: "if (!exists(\"coloc\")) return(\"缺少对象 coloc\")\nneed <- c(\"gene\", \"n_snp\", \"n_both_sig\", \"flag\")\nmiss <- setdiff(need, names(coloc))\nif (length(miss)) return(sprintf(\"coloc 缺列：%s\", paste(miss, collapse = \", \")))\nif (nrow(coloc) != 6) return(sprintf(\"coloc_dat 有 6 个基因，coloc 应有 6 行，当前 %d\", nrow(coloc)))\nif (!all(coloc$n_snp == 14)) return(\"每个基因的区域内应有 14 个 SNP\")\nif (any(coloc$n_both_sig > coloc$n_snp)) return(\"n_both_sig 不可能大于 n_snp，检查同时满足条件时是不是用了 | 而不是 &\")\nif (!all(coloc$flag %in% c(0, 1))) return(\"flag 应为 0/1 的数值\")\nTRUE",
    xp: 150, star: 4
  },

  /* ============================ 网络毒理学 / 药物重定位 ============================ */
  {
    id: "tox-1", track: "tox", title: "第二十一关 · 网络毒理学：找出共同打击 razboolenders",
    story: "环境污染物不是单独行动的。如果一个化合物同时靶向你的多个候选基因，它就是重点嫌疑对象。",
    goal: "实现化学品-基因网络的构建与共享化合物排序（UpSet 思路的手算版）。",
    tasks: [
      "chem_rank：data.frame，含 chemical / n_target（靶向的候选基因数）/ genes",
      "候选基因用 ctd_edc 中出现的基因",
      "找出同时靶向 >= 3 个候选基因的化合物（高危化合物）"
    ],
    datasets: ["ctd_edc"],
    starter: "# ctd_edc：gene - chemical - evidence 三列的互作表\nnrow(ctd_edc); head(ctd_edc)\nchem_rank <- ...\nhigh_risk <- ...\n",
    hints: [
      "先 table(ctd_edc$chemical) 看每个化合物连了多少基因。",
      "去重很关键：同一 (gene, chemical) 可能有多条 evidence 记录，先 ctd_edc[!duplicated(paste(gene, chemical)), ]。",
      "把基因名粘成一个字符串用 paste(collapse = \", \")。"
    ],
    solution: "edc <- ctd_edc[!duplicated(paste(ctd_edc$gene, ctd_edc$chemical)), ]\nsp <- split(edc$gene, edc$chemical)\nchem_rank <- data.frame(\n  chemical  = names(sp),\n  n_target  = sapply(sp, length),\n  genes     = sapply(sp, function(x) paste(x, collapse = \", \")),\n  stringsAsFactors = FALSE\n)\nchem_rank <- chem_rank[order(chem_rank$n_target, decreasing = TRUE), ]\nhigh_risk <- chem_rank[chem_rank$n_target >= 3, ]\n",
    check: "if (!exists(\"chem_rank\")) return(\"缺少对象 chem_rank\")\nif (!all(c(\"chemical\", \"n_target\", \"genes\") %in% names(chem_rank))) return(\"chem_rank 应含 chemical / n_target / genes 三列\")\nif (!exists(\"high_risk\")) return(\"缺少对象 high_risk（同时靶向 >=3 个基因的化合物）\")\nif (is.unsorted(rev(chem_rank$n_target))) return(\"chem_rank 请按 n_target 降序排列\")\nif (nrow(high_risk) < 3) return(sprintf(\"高危化合物（同时靶向>=3基因）应至少有 3 个，当前 %d\", nrow(high_risk)))\ntop <- chem_rank$chemical[1]\nif (!(top %in% c(\"Cadmium chloride\", \"Bisphenol A\", \"Arsenic trioxide\", \"DEHP\", \"Benzo[a]pyrene\"))) return(sprintf(\"排第一的应该是 Cd/BPA/砷/DEHP/苯并[a]芘这类广谱化合物，当前是 %s —— 检查是否忘了去重\", top))\nTRUE",
    xp: 130, star: 3
  },
  {
    id: "drug-1", track: "drug", title: "第二十二关 · 老药新用：把靶点变成能买的药",
    story: "你的课题终局：从差异基因走到能用Existing drug。这一步决定论文能不能落地。",
    goal: "实现候选基因 × 药物靶点的匹配打分，并优先输出已获批药物。",
    tasks: [
      "hits：data.frame，含 gene / drug / mechanism / status / score",
      "score 设计：已获批 Approved = 2 分，Phase III = 1.5，Phase II = 1，其余 0.5",
      "approved_hits：只保留已获批的匹配结果，并按 score 降序"
    ],
    datasets: ["drug_targets"],
    starter: "# drug_targets：gene / drug / mechanism / status / source\n# candidate 用你在差异分析里得到的 Up 基因（这里给一批候选基因）\ncandidate <- c(\"PPARA\", \"ACSL4\", \"HMOX1\", \"TGFB1\", \"YAP1\", \"TEAD1\", \"MET\", \"MERTK\", \"SLC7A11\", \"GPX4\", \"PTGS2\", \"CDKN1A\", \"TP53\", \"MDM2\")\n\nhits <- ...\napproved_hits <- ...\n",
    hints: [
      "取交集：drug_targets[drug_targets$gene %in% candidate, ]。",
      "打分用 ifelse 嵌套或者建一个对照表再 merge —— 后者更清晰、更好维护。",
      "真实流程里这步之后要做三件事：分子对接验证、文献核实、PheWAS 排脱靶风险。"
    ],
    solution: "candidate <- c(\"PPARA\", \"ACSL4\", \"HMOX1\", \"TGFB1\", \"YAP1\", \"TEAD1\", \"MET\",\n               \"MERTK\", \"SLC7A11\", \"GPX4\", \"PTGS2\", \"CDKN1A\", \"TP53\", \"MDM2\")\nscore_map <- data.frame(status = c(\"Approved\", \"Phase III\", \"Phase II\", \"Phase I\", \"Experimental\", \"Withdrawn\"),\n                        score = c(2, 1.5, 1, 0.8, 0.5, 0.1), stringsAsFactors = FALSE)\nhits <- drug_targets[drug_targets$gene %in% candidate, ]\nhits <- merge(hits, score_map, by = \"status\", all.x = TRUE)\nhits$score[is.na(hits$score)] <- 0.5\nhits <- hits[order(hits$score, decreasing = TRUE), ]\napproved_hits <- hits[hits$status == \"Approved\", ]\n",
    check: "if (!exists(\"hits\")) return(\"缺少对象 hits\")\nif (!all(c(\"gene\", \"drug\", \"status\", \"score\") %in% names(hits))) return(\"hits 应含 gene / drug / status / score\")\nif (!exists(\"approved_hits\")) return(\"缺少对象 approved_hits\")\nif (nrow(hits) == 0) return(\"一个都没匹配上，检查 candidate 的基因名是否与 drug_targets 完全一致（注意大小写）\")\nif (nrow(hits) > nrow(drug_targets)) return(\"hits 的行数超过了原始药物表，merge 时可能产生了笛卡尔积\")\nif (any(is.na(hits$score))) return(\"存在 NA 的 score，请给未匹配到的 status 兜底赋值\")\nif (!any(hits$gene == \"PPARA\" & grepl(\"Fenofibrate\", hits$drug))) return(\"PPARA 应匹配到 Fenofibrate（非诺贝特）—— 这是本课题最有代表性的老药新用候选\")\nif (nrow(approved_hits) < 5) return(sprintf(\"已获批药物匹配应至少有 5 条，当前 %d\", nrow(approved_hits)))\nTRUE",
    xp: 140, star: 3
  },

  /* ============================ 机器学习 / 统计建模 ============================ */
  {
    id: "ml-1", track: "ml", title: "第二十三关 · 分类器与 AUC：手算 ROC",
    story: "不做 glmnet，先用最朴素的逻辑回归 + 手算 AUC，搞懂 AUC 究竟在算什么。",
    goal: "理解 AUC = 随机抽一个正例和一个负例，模型给正例打分更高的概率。",
    tasks: [
      "fit：glm(group ~ ., family = binomial) 训练的逻辑回归模型（用 5 个基因做特征）",
      "auc：训练集上手工计算的 AUC，应 > 0.85",
      "用样本的预测概率作为打分"
    ],
    datasets: ["lihc_expr", "lihc_clin"],
    starter: "# 构造建模数据：样本为行，5 个基因为列，外加 label\nfeatures <- c(\"AFP\", \"GPC3\", \"ALB\", \"CYP3A4\", \"YAP1\")\ndat <- data.frame(label = ifelse(lihc_clin$group == \"Tumor\", 1, 0),\n                  t(lihc_expr[features, lihc_clin$sample]))\nfit <- glm(label ~ ., data = dat, family = binomial())\npred <- predict(fit, type = \"response\")\n\n# AUC = Wilcoxon 秩和 / (n_pos * n_neg)\nauc_fun <- function(score, y) { ... }\nauc <- ...\n",
    hints: [
      "注意转置：lihc_expr 是基因 x 样本，建模要样本 x 基因，用 t()。",
      "AUC 公式：auc = (sum(rank(score)[y==1]) - n_pos*(n_pos+1)/2) / (n_pos * n_neg)。",
      "等价于 wilcox.test(score[y==1], score[y==0])$statistic / (n_pos*n_neg)。"
    ],
    solution: "features <- c(\"AFP\", \"GPC3\", \"ALB\", \"CYP3A4\", \"YAP1\")\ndat <- data.frame(label = ifelse(lihc_clin$group == \"Tumor\", 1, 0),\n                  t(lihc_expr[features, lihc_clin$sample]))\nfit  <- glm(label ~ ., data = dat, family = binomial())\npred <- predict(fit, type = \"response\")\nauc_fun <- function(score, y) {\n  n1 <- sum(y == 1); n0 <- sum(y == 0)\n  r <- rank(score)\n  (sum(r[y == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0)\n}\nauc <- auc_fun(pred, dat$label)\n",
    check: "if (!exists(\"fit\")) return(\"缺少对象 fit（glm 逻辑回归模型）\")\nif (!exists(\"auc\")) return(\"缺少对象 auc\")\nif (!is.numeric(auc) || is.na(auc)) return(\"auc 应为有效数值\")\nif (auc < 0.5 || auc > 1.0001) return(sprintf(\"auc = %.3f 落在 [0,1] 之外，检查分子分母是否搞反\", auc))\nif (auc < 0.85) return(sprintf(\"auc = %.3f，低于 0.85 —— 用这 5 个特征（AFP/GPC3/ALB/CYP3A4/YAP1）应该能达到 0.9 以上\", auc))\nif (!inherits(fit, \"glm\")) return(\"fit 应为 glm 对象\")\nTRUE",
    xp: 140, star: 4
  },
  {
    id: "ml-2", track: "ml", title: "第二十四关 · 交叉验证：别被自己的训练集骗了",
    story: "在训练集上 AUC = 0.99 毫无意义。审稿人要看的是独立测试集。",
    goal: "实现 5 折交叉验证，并理解过拟合是怎么被看出来的。",
    tasks: [
      "cv_auc：5 折交叉验证的平均测试集 AUC",
      "auc_folds：每一折的测试集 AUC 向量（长度 5）",
      "cv_auc 应与 ml-1 的训练集 auc 接近（差距 < 0.15 说明没过拟合）"
    ],
    datasets: ["lihc_expr", "lihc_clin"],
    starter: "set.seed(20261030)\nfeatures <- c(\"AFP\", \"GPC3\", \"ALB\", \"CYP3A4\", \"YAP1\")\ndat <- data.frame(label = ifelse(lihc_clin$group == \"Tumor\", 1, 0),\n                  t(lihc_expr[features, lihc_clin$sample]))\nfolds <- sample(rep(1:5, length.out = nrow(dat)))\nauc_folds <- sapply(1:5, function(k) { ... })\ncv_auc <- mean(auc_folds)\n",
    hints: [
      "每折：train = folds != k，test = folds == k；在 train 上拟合，在 test 上预测并算 AUC。",
      "set.seed() 必须在划分折之前设置，否则每次结果都不一样。",
      "测试集 AUC 明显低于训练集 AUC = 过拟合；本数据 5 个强特征下差距应该很小。"
    ],
    solution: "set.seed(20261030)\nfeatures <- c(\"AFP\", \"GPC3\", \"ALB\", \"CYP3A4\", \"YAP1\")\ndat <- data.frame(label = ifelse(lihc_clin$group == \"Tumor\", 1, 0),\n                  t(lihc_expr[features, lihc_clin$sample]))\nfolds <- sample(rep(1:5, length.out = nrow(dat)))\nauc_folds <- sapply(1:5, function(k) {\n  tr <- dat[folds != k, ]; te <- dat[folds == k, ]\n  f <- glm(label ~ ., data = tr, family = binomial())\n  p <- predict(f, newdata = te, type = \"response\")\n  auc_fun(p, te$label)\n})\ncv_auc <- mean(auc_folds)\n",
    check: "if (!exists(\"auc_folds\")) return(\"缺少对象 auc_folds\")\nif (!exists(\"cv_auc\")) return(\"缺少对象 cv_auc\")\nif (length(auc_folds) != 5) return(sprintf(\"auc_folds 应有 5 个元素，当前 %d\", length(auc_folds)))\nif (any(is.na(auc_folds))) return(\"存在 NA 折 —— 某一折测试集可能只有 1 个类别，检查折数划分与样本是否足够\")\nif (cv_auc < 0.8) return(sprintf(\"交叉验证平均 AUC = %.3f，低于 0.8 —— 检查是不是把 label 取反了\", cv_auc))\nif (exists(\"auc\") && (auc - cv_auc) > 0.15) return(sprintf(\"训练集 AUC(%.3f) 比交叉验证(%.3f) 高出超过 0.15，存在过拟合\", auc, cv_auc))\nTRUE",
    xp: 160, star: 4
  },

  /* ============================ 论文写作 ============================ */
  {
    id: "wrt-1", track: "writing", title: "第二十五关 · 生成 SCI 表格：从数据框到投稿 ready",
    story: "审稿人第一眼看的就是 Table 1。手敲表格数字的人，迟早在修稿时被自己坑。",
    goal: "用代码从结果对象生成 Markdown 表格，保证数字与数据永远同步。",
    tasks: [
      "tbl_md：字符向量，每行是 Markdown 表格的一行",
      "内容：Top 10 差异基因（基因名 / logFC / P / adj.P），数值保留 3 位小数",
      "第一行为表头，第二行为分隔行"
    ],
    datasets: ["lihc_expr", "lihc_clin"],
    starter: "# 先做出 vol（参考第七关）\ntumor  <- lihc_clin$sample[lihc_clin$group == \"Tumor\"]\nnormal <- lihc_clin$sample[lihc_clin$group == \"Normal\"]\nvol <- data.frame(\n  logFC   = rowMeans(lihc_expr[, tumor]) - rowMeans(lihc_expr[, normal]),\n  P.Value = apply(lihc_expr, 1, function(x) t.test(x[tumor], x[normal])$p.value)\n)\nvol$adj.P.Val <- p.adjust(vol$P.Value, method = \"BH\")\ntop10 <- head(vol[order(vol$adj.P.Val), ], 10)\n\ntbl_md <- ...\ncat(tbl_md, sep = \"\\n\")\n",
    hints: [
      "Markdown 表格格式：| Gene | logFC | P | adj.P | 开头，第二行 | --- | --- | --- |。",
      "数值格式化用 sprintf(\"%.3f\", x)；P 值建议用科学计数法 sprintf(\"%.2e\", p)。",
      "用 paste0(\"|\", a, \"|\", b, \"|\") 拼，或者 apply 到每一行。"
    ],
    solution: "tumor  <- lihc_clin$sample[lihc_clin$group == \"Tumor\"]\nnormal <- lihc_clin$sample[lihc_clin$group == \"Normal\"]\nvol <- data.frame(\n  logFC   = rowMeans(lihc_expr[, tumor]) - rowMeans(lihc_expr[, normal]),\n  P.Value = apply(lihc_expr, 1, function(x) t.test(x[tumor], x[normal])$p.value)\n)\nvol$adj.P.Val <- p.adjust(vol$P.Value, method = \"BH\")\nvol$change <- ifelse(vol$adj.P.Val < 0.05 & abs(vol$logFC) > 1,\n                     ifelse(vol$logFC > 0, \"Up\", \"Down\"), \"NS\")\nvol$change <- factor(vol$change, levels = c(\"Up\", \"Down\", \"NS\"))\ntop10 <- head(vol[order(vol$adj.P.Val), ], 10)\nbody <- apply(top10, 1, function(r) paste0(\"| \", \"\", \" | \",\n        sprintf(\"%.3f\", as.numeric(r[\"logFC\"])), \" | \",\n        sprintf(\"%.2e\", as.numeric(r[\"P.Value\"])), \" | \",\n        sprintf(\"%.2e\", as.numeric(r[\"adj.P.Val\"])), \" |\"))\nbody <- paste0(\"| \", rownames(top10), body)\ntbl_md <- c(\"| Gene | logFC | P value | Adjusted P |\",\n            \"| --- | --- | --- | --- |\", body)\n",
    check: "if (!exists(\"tbl_md\")) return(\"缺少对象 tbl_md\")\nif (!is.character(tbl_md)) return(\"tbl_md 应为字符向量\")\nif (length(tbl_md) != 12) return(sprintf(\"tbl_md 应有 12 行（表头 + 分隔行 + 10 个基因），当前 %d\", length(tbl_md)))\nif (!all(startsWith(tbl_md, \"|\"))) return(\"每一行都应以竖线 | 开头\")\nif (!grepl(\"^\\\\|\\\\s*---\", gsub(\" \", \"\", tbl_md[2]))) return(sprintf(\"第 2 行应是 Markdown 分隔行（| --- | --- | ...），当前是：%s\", tbl_md[2]))\nif (!grepl(\"Gene\", tbl_md[1])) return(\"第一行表头应包含 Gene 列\")\nTRUE",
    xp: 120, star: 3
  },
  {
    id: "wrt-2", track: "writing", title: "第二十六关 · 图注生成器：让图自己解释自己",
    story: "一张图的图注要写清：画的是什么、怎么算的、哪个代表显著性、样本量多少。",
    goal: "用代码生成标准 Figure Legend，避免正文与图注数据打架。",
    tasks: [
      "legend_text：单个字符串，一段完整的图注（英文）",
      "必须包含：panel 说明、统计方法、样本量、显著性标记含义"
    ],
    datasets: ["lihc_expr", "lihc_clin"],
    starter: "# 用第六/七关的结果，printfuma 生成 figure legend\nnt <- sum(lihc_clin$group == \"Tumor\")\nnn <- sum(lihc_clin$group == \"Normal\")\nlegend_text <- sprintf(...)\ncat(legend_text)\n",
    hints: [
      "SCI 图注的标准四要素：(a) 每张 panel 画了什么；(b) 用什么方法/统计检验；(c) n 是多少；(d) 星号或字母代表什么。",
      "用 sprintf 把数字嵌进去，别手写 —— 数据一变图注自动更新。",
      "英文图注的固定句式：『Data are presented as mean ± SD. ***P < 0.001, by two-sided Student's t-test.』"
    ],
    solution: "nt <- sum(lihc_clin$group == \"Tumor\")\nnn <- sum(lihc_clin$group == \"Normal\")\nn_gene <- nrow(lihc_expr)\nlegend_text <- sprintf(paste0(\n  \"Figure X. Differential expression analysis between tumour and adjacent normal tissues in the TCGA-LIHC mini-cohort. \",\n  \"(A) Volcano plot of %d genes; red and blue dots denote significantly up- and down-regulated genes \",\n  \"(|log2FC| > 1 and BH-adjusted P < 0.05), respectively. \",\n  \"(B) Heatmap of the top variable genes across samples. \",\n  \"Group comparisons were performed using two-sided Student's t-test followed by Benjamini-Hochberg correction. \",\n  \"Sample sizes: %d tumour and %d normal specimens. Data are presented as mean +/- SD. \",\n  \"*P < 0.05, **P < 0.01, ***P < 0.001.\"),\n  n_gene, nt, nn)\ncat(legend_text, \"\\n\")\n",
    check: "if (!exists(\"legend_text\")) return(\"缺少对象 legend_text\")\nif (!is.character(legend_text)) return(\"legend_text 应为字符串\")\nif (nchar(legend_text) < 150) return(sprintf(\"图注只有 %d 个字符，太短了 —— 标准图注应包含 panel 说明、统计方法、样本量、显著性标记四部分\", nchar(legend_text)))\nif (!grepl(\"t-test\", legend_text, ignore.case = TRUE)) return(\"应说明使用的统计检验two-sided Student's t-test）\")\nif (!grepl(\"Benjamini|BH\", legend_text, ignore.case = TRUE)) return(\"应说明多重检验校正方法\")\nif (!grepl(\"40\", legend_text)) return(sprintf(\"应写明样本量（肿瘤 40 例）—— 用 sprintf 自动嵌入，不要手打数字\"))\nif (!grepl(\"P < 0.05|\\\\*\\\\*\\\\*\", legend_text, ignore.case = TRUE)) return(\"应说明显著性标记的含义\")\nTRUE",
    xp: 120, star: 3
  },

  /* ============================ BOSS ============================ */
  {
    id: "boss-1", track: "boss", title: "终章 BOSS · 老药新用迷你全流程",
    story: "导师把钥匙拍在桌上：『用这批数据，从损伤一路走到候选药物，写成一个可提交的结果块。』\n这是本站所有关卡的集合体 —— 也是你这个课题的真实路线图。",
    goal: "打通 DEG -> 富集 -> 机制定位 -> 药物匹配 -> 结果输出 的完整链路。",
    tasks: [
      "step1_deg：Zone3 处理 28 天 vs 对照的差异基因（含 logFC / adj.P）",
      "step2_enrich：基于 step1 的显著上调基因做 ORA，返回显著通路",
      "step3_drug：把富集/候选基因映射到已获批药物，输出可投的候选清单",
      "report：一个字符串，3-5 句话总结你发现的生物学故事"
    ],
    datasets: ["expr_mat", "expr_meta", "drug_targets"],
    starter: "# 这一关没有 starter hand-holding，只有任务。\n# 前 25 关的技能全部可以调用。\n#\n# step 1：Zone3 + 28天 vs Zone3 + 0天\n# step 2：显著上调基因 -> ORA（gmt 不在本关数据里，请从药物靶点与候选基因的对应关系入手，\n#          或直接用 += 这批基因去看violate 了哪些已知机制）\n# step 3：candidate gene x drug_targets 匹配，筛 Approved\n# step 4：用自然语言写出结论\n",
    hints: [
      "step1 复用 bulk-2 的做法，注意这里基因符号是首字母大写风格，而药物表是人的全大写 —— 需要 toupper() 转换。",
      "这一步的坑正是你课题里真实存在的坑：跨物种基因符号不一致。",
      "候选基因的筛选：adj.P < 0.05 且 |logFC| > 1。",
      "report 要有生物学叙事，不要只罗列基因名。"
    ],
    solution: "treat <- expr_meta$sample[expr_meta$zone == 3 & expr_meta$time == 28]\nctrl  <- expr_meta$sample[expr_meta$zone == 3 & expr_meta$time == 0]\nstep1_deg <- data.frame(\n  logFC   = rowMeans(expr_mat[, treat]) - rowMeans(expr_mat[, ctrl]),\n  P.Value = apply(expr_mat, 1, function(x) t.test(x[treat], x[ctrl])$p.value),\n  stringsAsFactors = FALSE)\nstep1_deg$adj.P <- p.adjust(step1_deg$P.Value, method = \"BH\")\n\ncandidate <- toupper(rownames(step1_deg)[step1_deg$adj.P < 0.05 & abs(step1_deg$logFC) > 1])\nstep2_enrich <- drug_targets[drug_targets$gene %in% candidate, ]\nstep2_enrich <- step2_enrich[order(step2_enrich$status), ]\n\nstep3_drug <- step2_enrich[step2_enrich$status == \"Approved\", c(\"gene\", \"drug\", \"mechanism\")]\nstep3_drug <- step3_drug[!duplicated(step3_drug$drug), ]\n\nreport <- paste0(\n  \"Zone 3 (pericentral) hepatocytes at day 28 after irradiation show sustained cell-cycle restraint \" ,\n  \"alongside late fibrogenic activation. Among the differentially expressed genes, several map to \" ,\n  \"clinically approved agents targeting PPARA/ACSL4-mediated lipid handling, TGFB1-driven fibrosis, \" ,\n  \"and Hippo-YAP signalling, nominating repositionable candidates for 损伤模型 intervention. \" ,\n  \"These in silico hypotheses require experimental validation in the rat 损伤模型 model.\")\n",
    check: "if (!exists(\"step1_deg\")) return(\"缺少对象 step1_deg\")\nif (!all(c(\"logFC\", \"P.Value\", \"adj.P\") %in% names(step1_deg))) return(\"step1_deg 应含 logFC / P.Value / adj.P\")\nif (!exists(\"step2_enrich\")) return(\"缺少对象 step2_enrich\")\nif (!exists(\"step3_drug\")) return(\"缺少对象 step3_drug\")\nif (!exists(\"report\")) return(\"缺少对象 report：请用自然语言写出生物学结论\")\nif (!is.character(report) || nchar(report) < 150) return(sprintf(\"report 应有 150 字符以上的完整叙述，当前 %d\", nchar(report)))\nif (nrow(step1_deg) != 51) return(sprintf(\"step1_deg 应覆盖全部 51 个基因，当前 %d\", nrow(step1_deg)))\nif (nrow(step3_drug) == 0) return(\"没有匹配到任何已获批药物 —— 记得把动物模型风格基因名 toupper() 后再匹配\")\nTRUE",
    xp: 300, star: 5, boss: true
  }
]);
