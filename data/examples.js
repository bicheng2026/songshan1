/* 嵩山一号 · 工作站 —— 前几关的「迷你示例」（同构的简化例子，先看懂再动手） */
window.SX_EXAMPLES = {
  "rbase-1": {
    why: "先用一个更简单的同类任务，把「挑行取列」这件事看明白",
    code:
      "# 一、先看清表长什么样\n" +
      "dim(rild_meta)        # 54 行 x 5 列\n" +
      "colnames(rild_meta)   # sample zone time rep group\n" +
      "head(rild_meta, 3)\n" +
      "\n" +
      "# 二、一个更简单的同类任务：挑出所有 Sham（对照组）样本\n" +
      "rild_meta$group == \"Sham\"          # 54 个 TRUE/FALSE\n" +
      "rild_meta$sample[rild_meta$group == \"Sham\"]\n" +
      "#  → \"Z1_d0_r1\" \"Z1_d0_r2\" \"Z1_d0_r3\" ... 共 9 个\n" +
      "\n" +
      "# 三、两个条件同时满足，用 & 连起来\n" +
      "rild_meta$sample[rild_meta$zone == 1 & rild_meta$time == 0]",
    tip: "看懂上面三行，本关就是把「Sham」换成「IR」、把 zone 1 换成 zone 2。"
  },

  "rbase-2": {
    why: "分组求均值的套路：先取列名 → 再取子矩阵 → 再按行求均值",
    code:
      "# 一、先取出某一组的样本列名\n" +
      "z1 <- rild_meta$sample[rild_meta$zone == 1]\n" +
      "head(z1, 3)      # \"Z1_d0_r1\" \"Z1_d0_r2\" \"Z1_d0_r3\"\n" +
      "\n" +
      "# 二、用这些列名去矩阵里切子矩阵\n" +
      "m1 <- rild_expr[, z1]      # 逗号前空着=所有基因，逗号后是列\n" +
      "dim(m1)                    # 51 个基因 x 18 个样本\n" +
      "\n" +
      "# 三、按行求均值（每个基因一个数）\n" +
      "z1_mean <- rowMeans(m1)\n" +
      "z1_mean[1:3]               # Acat1 ... 每个基因的均值",
    tip: "本关要的是 zone 2（不是 1），而且要求你同时造出 z2_cols 和 zone2_mean 两个对象。"
  },

  "rbase-3": {
    why: "先看一维的 tapply，再看二维的",
    code:
      "# 一、取一个基因在所有样本上的表达\n" +
      "x <- as.numeric(rild_expr[\"Alb\", ])\n" +
      "\n" +
      "# 二、一维分组：按 zone 求均值\n" +
      "tapply(x, rild_meta$zone, mean)\n" +
      "#        1        2        3\n" +
      "# 12.11717 12.19267 12.09339   ← 三个分区的 Alb 平均表达，差别很小\n" +
      "\n" +
      "# 三、二维分组：第二个参数换成 list()\n" +
      "tapply(x, list(rild_meta$zone, rild_meta$time), mean)\n" +
      "# 出来就是一个 3 行 x 6 列的矩阵：行=zone，列=time\n" +
      "# dim() 是 c(3, 6)，rownames 是 \"1\" \"2\" \"3\"，colnames 是 \"0\" \"1\" \"3\" \"7\" \"14\" \"28\"",
    tip: "本关把 Alb 换成 Cdkn1a，就是 cd_mat。行名是 zone 值（1/2/3）、列名是 time 值（0/1/3/7/14/28）；Cdkn1a 的三区整体均值是 8.07 / 8.11 / 9.16，其中 zone 3 在 d7 冲到 10.08——数字对不对，跑完自己核一遍。"
  },

  "rbase-4": {
    why: "从最简单的函数看起，再一步步加参数",
    code:
      "# 一、最简单：一个参数\n" +
      "add2 <- function(x) x + 2\n" +
      "add2(c(1, 2, 3))          # 3 4 5\n" +
      "\n" +
      "# 二、两个参数：算两组均值的差\n" +
      "diff_mean <- function(a, b) mean(a) - mean(b)\n" +
      "diff_mean(c(5, 7), c(1, 2))   # 4.5\n" +
      "\n" +
      "# 三、把 mean 换成 rowMeans，就能一次算很多基因\n" +
      "rowMeans(rild_expr[, c(\"Z2_d3_r1\")], drop = FALSE)",
    tip: "本关的 mat 是矩阵、cols_a/cols_b 是列名向量；返回的是每个基因一个差值，所以要用 rowMeans 而不是 mean。"
  },

  "bulk-1": {
    why: "宽转长的关键，是让「骨架的顺序」和「取值的顺序」对上",
    code:
      "# 一、拿一个 3 基因 x 2 样本的小矩阵练手\n" +
      "m <- matrix(1:6, nrow = 3,\n" +
      "            dimnames = list(c(\"g1\", \"g2\", \"g3\"), c(\"s1\", \"s2\")))\n" +
      "m\n" +
      "#    s1 s2\n" +
      "# g1  1  4\n" +
      "# g2  2  5\n" +
      "# g3  3  6\n" +
      "\n" +
      "# 二、造骨架：expand.grid 让第一个参数变得最快\n" +
      "sk <- expand.grid(gene = rownames(m), sample = colnames(m))\n" +
      "sk\n" +
      "#   gene sample\n" +
      "# 1   g1     s1\n" +
      "# 2   g2     s1\n" +
      "# 3   g3     s1\n" +
      "# 4   g1     s2 ...\n" +
      "\n" +
      "# 三、取值：as.vector 是「按列」展开，正好和骨架同序\n" +
      "as.vector(m)     # 1 2 3 4 5 6\n" +
      "sk$expr <- as.vector(m)\n" +
      "sk",
    tip: "这就是全部秘密：expand.grid 让 gene 变最快，as.vector 按列取也是 gene 变最快，所以能对上。加了 t() 就错位了。"
  },

  "bulk-2": {
    why: "先用一个 3 基因 × 6 样本的玩具矩阵，把「一个基因的 t 检验」看明白，再让它对每一行自动跑一遍",
    code:
      "# 一、先看真实数据：51 个基因 × 54 个样本，行是基因、列是样本\n" +
      "dim(rild_expr)\n" +
      "rild_expr[1:2, 1:3]\n" +
      "\n" +
      "# 二、3 基因 × 6 样本的玩具矩阵：前 3 列当对照，后 3 列当处理\n" +
      "toy <- matrix(c(10, 10.2, 10.1, 12, 12.4, 12.2,\n" +
      "                8,  8.3,  7.9,  8.1, 8.2, 9.9,\n" +
      "                5,  5.1,  4.9,  5,   5.2, 5.05),\n" +
      "              nrow = 3, byrow = TRUE,\n" +
      "              dimnames = list(c(\"A\", \"B\", \"C\"), paste0(\"s\", 1:6)))\n" +
      "\n" +
      "# 一个基因的差异分析，全部内容就是这一次 t 检验\n" +
      "t.test(toy[\"A\", 4:6], toy[\"A\", 1:3])$p.value   # 约 8e-05，两组差得很干净\n" +
      "\n" +
      "# 三、把「一次」变成「每一行」：apply 的第二个参数 1 = 按行走\n" +
      "p_toy <- apply(toy, 1, function(x) t.test(x[4:6], x[1:3])$p.value)\n" +
      "p_toy\n" +
      "p.adjust(p_toy, method = \"BH\")   # 3 个基因里最小的那个被放大 3 倍\n" +
      "\n" +
      "# logFC 同理：rowMeans 一次算完所有行（处理组 − 对照组）\n" +
      "rowMeans(toy[, 4:6]) - rowMeans(toy[, 1:3])",
    tip: "本关就是把 toy 换成 rild_expr、把 4:6 / 1:3 换成 treat / ctrl 这两组列名。真数据跑完：31 个基因 adj.P < 0.05（25 上调、6 下调），Mki67 的 logFC 约 1.17。"
  },

  "bulk-3": {
    why: "差异分析本身上一关已经会了，这一关新的只有一件事：给每个基因贴 Up / Down / NS 标签",
    code:
      "# 一、先看清输入：275 个基因 × 60 个样本，分组写在临床表里\n" +
      "dim(lihc_expr); table(lihc_clin$group)\n" +
      "\n" +
      "# 二、造 6 行假结果，只练「打标签」这一步\n" +
      "res <- data.frame(gene      = paste0(\"G\", 1:6),\n" +
      "                  logFC     = c(2.4, -1.8, 0.3, 3.1, -0.9, 0.05),\n" +
      "                  adj.P.Val = c(0.001, 0.02, 1e-04, 0.2, 0.6, 0.03))\n" +
      "res$change <- ifelse(res$adj.P.Val < 0.05 & abs(res$logFC) > 1,\n" +
      "                     ifelse(res$logFC > 0, \"Up\", \"Down\"), \"NS\")\n" +
      "res\n" +
      "table(res$change)      # Up 1 / Down 1 / NS 4\n" +
      "\n" +
      "# 三、同一个 ifelse 套到真数据上：两列都得先算出来\n" +
      "tumor  <- lihc_clin$sample[lihc_clin$group == \"Tumor\"]\n" +
      "normal <- lihc_clin$sample[lihc_clin$group == \"Normal\"]\n" +
      "lfc <- rowMeans(lihc_expr[, tumor]) - rowMeans(lihc_expr[, normal])\n" +
      "pv  <- apply(lihc_expr, 1, function(x) t.test(x[tumor], x[normal])$p.value)\n" +
      "adj <- p.adjust(pv, \"BH\")\n" +
      "table(ifelse(adj < 0.05 & abs(lfc) > 1, ifelse(lfc > 0, \"Up\", \"Down\"), \"NS\"))",
    tip: "注意是「且」不是「或」：|logFC| > 1 和 adj < 0.05 两个条件同时满足才算显著。真数据这批是 95 个 Up、21 个 Down，剩下 159 个 NS。"
  },

  "bulk-4": {
    why: "富集分析的数学只有一件事：超几何分布。先用 4 个数字手算一次，再看它怎么套到 18 条通路上",
    code:
      "# 一、先看基因集：18 条通路，每条就是一串基因名\n" +
      "length(gmt)\n" +
      "names(gmt)[1:3]\n" +
      "head(gmt[[1]], 6)\n" +
      "\n" +
      "# 二、一条通路的超几何检验，只要四个数字\n" +
      "#    背景 100 个基因，通路占 10 个，候选 20 个里命中 4 个\n" +
      "phyper(4 - 1, 10, 100 - 10, 20, lower.tail = FALSE)   # 0.11，算不上富集\n" +
      "#    命中数不变，但这条通路只有 5 个基因：小通路更容易富集\n" +
      "phyper(4 - 1, 5, 100 - 5, 20, lower.tail = FALSE)     # 0.0054，比上一条小 20 倍\n" +
      "\n" +
      "# 三、真数据：上调 95 个、背景 275 个，G2M 通路 20 个基因命中 18 个\n" +
      "phyper(18 - 1, 20, 275 - 20, 95, lower.tail = FALSE)  # 1.5e-07\n" +
      "#    写循环前最容易漏的一步：通路基因先跟背景取交集\n" +
      "pw <- intersect(gmt[[\"HALLMARK_G2M_CHECKPOINT\"]], rownames(lihc_expr))\n" +
      "length(pw)     # 20，这就是 K；剩下的 k、n、N 数一数就有",
    tip: "本关的 enrich 就是把这个 phyper 写进 lapply 跑 18 遍，再把 18 个 p 值一起 p.adjust(x, \"BH\")。K 忘了跟背景取交集，p 值会整体偏小。"
  },

  "bulk-5": {
    why: "KM 估计只是「每遇到一个事件，就把生存率乘一次 (1 − 当时死亡数/当时还在的人数)」，先用 6 个人走一遍",
    code:
      "# 一、先看随访表：os_time 是时间，os_status 里 1 = 死亡、0 = 删失\n" +
      "head(lihc_clin[, c(\"sample\", \"os_time\", \"os_status\")])\n" +
      "sum(lihc_clin$os_status)      # 60 个样本里 19 个事件\n" +
      "\n" +
      "# 二、6 个人的玩具随访，手推一次乘积限估计\n" +
      "tm <- c(2, 4, 6, 8, 10, 12); st <- c(1, 0, 1, 1, 0, 1)\n" +
      "# t=2：6 人还在随访，死 1 个 → S = 5/6；t=6：只剩 4 人，死 1 个 → 5/6 × 3/4\n" +
      "km1 <- function(tm, st) {\n" +
      "  s <- 1; out <- data.frame(time = 0, surv = 1)\n" +
      "  for (t in sort(unique(tm[st == 1]))) {\n" +
      "    n <- sum(tm >= t); d <- sum(tm == t & st == 1)\n" +
      "    s <- s * (1 - d / n)\n" +
      "    out <- rbind(out, data.frame(time = t, surv = s))\n" +
      "  }\n" +
      "  out\n" +
      "}\n" +
      "km1(tm, st)      # 最后一次事件只剩 1 人在随访，生存率直接掉到 0\n" +
      "\n" +
      "# 三、真数据只多一步「按表达量分组」，KM 函数原样照抄\n" +
      "tum <- lihc_clin[lihc_clin$group == \"Tumor\", ]\n" +
      "yap <- as.numeric(lihc_expr[\"YAP1\", tum$sample])\n" +
      "grp <- ifelse(yap > median(yap), \"High\", \"Low\")\n" +
      "km1(tum$os_time[grp == \"High\"], tum$os_status[grp == \"High\"])",
    tip: "真数据 40 个肿瘤样本按 YAP1 中位数一分为二，各 20 例；高危组 16 个事件、低危组 3 个，log-rank 卡方约 30，p ≈ 4e-08。"
  },

  "scrna-1": {
    why: "质控就是「两个阈值 + 一个与号」，先用 6 个细胞看清谁被留下、谁被扔掉",
    code:
      "# 一、先看细胞表：900 个细胞，QC 指标就在列里\n" +
      "dim(scrna_meta)\n" +
      "summary(scrna_meta[, c(\"nFeature_RNA\", \"percent_mt\")])\n" +
      "\n" +
      "# 二、6 个细胞的玩具，把两个阈值真正卡一遍\n" +
      "toy <- data.frame(cell         = paste0(\"c\", 1:6),\n" +
      "                  nFeature_RNA = c(120, 450, 880, 2100, 150, 640),\n" +
      "                  percent_mt   = c(28, 12, 8.5, 6.2, 35, 19))\n" +
      "toy$keep <- toy$nFeature_RNA >= 200 & toy$percent_mt < 20\n" +
      "toy\n" +
      "sum(toy$keep)      # 4 个留下：c2 c3 c4 c6\n" +
      "\n" +
      "# 三、真数据不需要循环，整列套上去就行\n" +
      "keep <- scrna_meta$nFeature_RNA >= 200 & scrna_meta$percent_mt < 20\n" +
      "sum(keep)          # 833 个细胞合格\n" +
      "sum(!keep)         # 67 个被剔除\n" +
      "table(scrna_meta$celltype[keep])",
    tip: "本关要交的 sc_qc 就是 scrna_meta[keep, ]，n_removed 就是 sum(!keep)。真数据里被扔掉的 67 个细胞大多是 nFeature 低于 200 的空液滴。"
  },

  "scrna-2": {
    why: "归一化只干一件事：把每个细胞的总量拉平到同一个数，再取对数。用 2 个细胞手算一遍最清楚",
    code:
      "# 一、先看原始 counts：18 个基因，细胞是行\n" +
      "g <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\", \"Vegfa\",\n" +
      "       \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\", \"Krt19\", \"Hgf\", \"Cd3e\")\n" +
      "cnt <- as.matrix(scrna_meta[, g])\n" +
      "head(rowSums(cnt))      # 每个细胞的文库量差得很远\n" +
      "\n" +
      "# 二、2 个细胞 × 3 个基因的玩具，手算一遍\n" +
      "toy <- matrix(c(10, 20, 70,\n" +
      "                1,  2,  7), nrow = 2, byrow = TRUE,\n" +
      "              dimnames = list(c(\"A\", \"B\"), c(\"g1\", \"g2\", \"g3\")))\n" +
      "rowSums(toy)               # 100 和 10，差 10 倍\n" +
      "toy / rowSums(toy) * 1e4   # 两行变得一模一样：1000 2000 7000\n" +
      "log1p(toy / rowSums(toy) * 1e4)   # 再压一下量级，这就是 LogNormalize\n" +
      "\n" +
      "# 三、真数据只多一个转置：counts 是 细胞×基因，要按细胞求和\n" +
      "norm <- log1p(t(t(cnt) / rowSums(cnt) * 1e4))\n" +
      "round(rowSums(expm1(norm))[1:3])   # 10000 10000 10000，转回去还是原比例\n" +
      "round(colMeans(norm)[1:3], 2)      # Alb 最高，肝细胞标志没被抹掉",
    tip: "本关的 norm_mat 就是这三行：先除文库量、乘 1e4、再 log1p。漏了转置会变成「按基因求和」，结果全是错的。"
  },

  "scrna-3": {
    why: "高变基因 = 算一个「离散度」再排序。先在小矩阵上把 mean / var / disp 三个数算出来，就不会怕公式",
    code:
      "# 一、先看几列 counts，感受一下基因之间的差别\n" +
      "head(scrna_meta[, c(\"Alb\", \"Cd3e\", \"Krt19\")], 3)\n" +
      "\n" +
      "# 二、3 个基因 × 6 个细胞的玩具，手算离散度\n" +
      "toy <- matrix(c(5, 5.1, 4.9, 5.05, 4.95, 5,\n" +
      "                0, 0,   0,   0,    3,    0,\n" +
      "                1, 3,   2,   4,    1,    3), nrow = 3, byrow = TRUE,\n" +
      "              dimnames = list(c(\"g1\", \"g2\", \"g3\"), NULL))\n" +
      "m <- rowMeans(toy); v <- apply(toy, 1, var)\n" +
      "cbind(mean = m, var = v, disp = v / (m + 0.01))\n" +
      "# g1 均值最高却 disp 几乎为 0；g2 均值最低、disp 反而最高（2.94）—— 这就是零膨胀\n" +
      "\n" +
      "# 三、真数据：同一列公式铺到 18 个基因上，再排序\n" +
      "g <- c(\"Alb\", \"Cps1\", \"Cyp2e1\", \"Glul\", \"Fga\", \"Pecam1\", \"Cdh5\", \"Kdr\", \"Vegfa\",\n" +
      "       \"Acta2\", \"Col1a1\", \"Tgfb1\", \"Cd68\", \"Ptprc\", \"Ccl2\", \"Krt19\", \"Hgf\", \"Cd3e\")\n" +
      "cnt  <- as.matrix(scrna_meta[, g])\n" +
      "nm   <- log1p(t(t(cnt) / rowSums(cnt) * 1e4))\n" +
      "disp <- apply(nm, 2, var) / (colMeans(nm) + 0.01)\n" +
      "head(sort(disp, decreasing = TRUE), 5)      # Krt19 / Cd68 / Cd3e / Acta2 / Col1a1",
    tip: "本关的 hvg_stats 就是 data.frame(gene, mean, var, disp)，hvg 是 head(排好序的 gene, 8)。注意 +0.01 那一下：不加会除以接近 0 的均值，算出无穷大。"
  },

  "scrna-4": {
    why: "聚类难的不是算法，是「怎么知道自己聚得对不对」。先用 5 个样本做一次交叉表，再看真数据",
    code:
      "# 一、备好归一化矩阵：细胞是行、基因是列\n" +
      "g   <- c(\"Alb\", \"Cps1\", \"Pecam1\", \"Col1a1\", \"Cd68\", \"Krt19\", \"Cd3e\")\n" +
      "cnt <- as.matrix(scrna_meta[, g])\n" +
      "nm  <- log1p(t(t(cnt) / rowSums(cnt) * 1e4))\n" +
      "dim(nm)          # 900 行细胞 × 7 列基因\n" +
      "\n" +
      "# 二、5 个样本玩一次「聚类 vs 真相」的交叉表\n" +
      "cl <- c(1, 1, 2, 2, 2)\n" +
      "tr <- c(\"A\", \"A\", \"B\", \"B\", \"B\")\n" +
      "table(cl, tr)                 # 对角线满格，就是聚得完美\n" +
      "table(c(1, 2, 2, 2, 2), tr)   # 把第 1 个样本分错，表格立刻歪\n" +
      "\n" +
      "# 三、真数据：scale → PCA → 只取前 5 个 PC → 层次聚类\n" +
      "pc  <- prcomp(nm, center = TRUE, scale. = TRUE)\n" +
      "head(pc$x[, 1:2], 3)          # 前两个主成分的坐标\n" +
      "cl6 <- cutree(hclust(dist(pc$x[, 1:5]), method = \"ward.D2\"), k = 6)\n" +
      "table(cl6, scrna_meta$celltype)",
    tip: "scale. = TRUE 不能省，否则 Alb 这种高表达基因会独占所有方差。切 6 个簇后交叉表基本是满格，ARI 会接近 1——这批模拟数据分得很开。"
  },

  "scrna-5": {
    why: "注释就是「每个簇在每个细胞类型的 marker 上打平均分，取最高分那一类」，先做一个 2×3 的小表",
    code:
      "# 一、先看 marker 对照表：名字是细胞类型，值是一串基因\n" +
      "markers <- list(Hepatocyte    = c(\"Alb\", \"Cps1\"),\n" +
      "                Endothelial   = c(\"Pecam1\", \"Cdh5\"),\n" +
      "                Stellate      = c(\"Acta2\", \"Col1a1\"),\n" +
      "                Kupffer       = c(\"Cd68\", \"Ptprc\"),\n" +
      "                Cholangiocyte = c(\"Krt19\"),\n" +
      "                Lymphocyte    = c(\"Cd3e\"))\n" +
      "str(markers)\n" +
      "\n" +
      "# 二、2 个 cluster × 3 个类型的玩具打分，每行取最大值就是标签\n" +
      "sc <- matrix(c(8, 1, 0,\n" +
      "               0, 7, 2), nrow = 2, byrow = TRUE,\n" +
      "             dimnames = list(c(\"cl1\", \"cl2\"), c(\"Hep\", \"Endo\", \"Stel\")))\n" +
      "colnames(sc)[apply(sc, 1, which.max)]      # \"Hep\" \"Endo\"\n" +
      "\n" +
      "# 三、真数据：先算每个簇在每个基因集上的平均分，再取最大\n" +
      "cnt <- as.matrix(scrna_meta[, unlist(markers)])\n" +
      "nm  <- log1p(t(t(cnt) / rowSums(cnt) * 1e4))\n" +
      "cl  <- cutree(hclust(dist(prcomp(nm, scale. = TRUE)$x[, 1:5]), method = \"ward.D2\"), k = 6)\n" +
      "cm  <- sapply(markers, function(gs) tapply(rowMeans(nm[, gs, drop = FALSE]), cl, mean))\n" +
      "cm\n" +
      "colnames(cm)[apply(cm, 1, which.max)]",
    tip: "本关的 cluster_mean 就是这张 cm 表，cluster_type 就是最后那行 apply。Ptprc 是泛免疫 marker，Kupffer 和 Lymphocyte 都会用它，所以 Cd68 和 Cd3e 才是区分的关键。"
  },

  "spatial-1": {
    why: "反卷积听起来玄，落地就三步：基因各自 z-score → 每类 marker 求平均 → 取最大分。先用 3 个 spot 走一遍",
    code:
      "# 一、先看 spot 表：484 个 spot，带坐标和真实分区\n" +
      "dim(spatial_spots)\n" +
      "table(spatial_spots$region)     # Normal / Margin / Tumor_core\n" +
      "\n" +
      "# 二、3 个 spot × 2 个基因的玩具：先标准化，再比大小\n" +
      "toy <- matrix(c(8, 2,\n" +
      "                7, 3,\n" +
      "                2, 9), nrow = 3, byrow = TRUE,\n" +
      "              dimnames = list(paste0(\"s\", 1:3), c(\"EPCAM\", \"ALB\")))\n" +
      "z <- scale(toy)            # 每一列（每个基因）单独标准化\n" +
      "round(z, 2)\n" +
      "apply(z, 1, which.max)     # 1 1 2：前两个 spot 是 EPCAM 高\n" +
      "\n" +
      "# 三、真数据：每类有 2~3 个基因，z-score 后按类求平均\n" +
      "mk <- list(Tumor  = c(\"EPCAM\", \"MKI67\", \"CDKN1A\"),\n" +
      "           Stroma = c(\"COL1A1\", \"ACTA2\", \"COL3A1\"),\n" +
      "           Normal = c(\"ALB\", \"CYP3A4\"))\n" +
      "z2   <- scale(log1p(as.matrix(spatial_spots[, unlist(mk)])))\n" +
      "sc2  <- sapply(mk, function(gs) rowMeans(z2[, gs, drop = FALSE]))\n" +
      "call <- colnames(sc2)[apply(sc2, 1, which.max)]\n" +
      "table(call, spatial_spots$region)",
    tip: "先 log1p 再 scale，是因为表达量差一个数量级，不压缩的话高表达基因会吃掉全部权重。真数据准确率约 0.97：312 个 Normal spot 里有 12 个被判成 Tumor（肿瘤核心边上那几个）。"
  },

  "mr-1": {
    why: "Wald ratio 只是「结局效应 ÷ 暴露效应」，标准误是「结局 SE ÷ |暴露效应|」，三个 SNP 就能算清楚",
    code:
      "# 一、先看汇总数据：一行 = 一个 SNP 对一个基因\n" +
      "dim(mr_dat)\n" +
      "head(mr_dat[, c(\"SNP\", \"gene\", \"beta_exposure\", \"beta_outcome\")])\n" +
      "\n" +
      "# 二、3 个 SNP 的玩具，手推一遍\n" +
      "bx <- c(0.30, 0.12, 0.05); sx <- c(0.05, 0.04, 0.06)\n" +
      "by <- c(-0.09, 0.03, 0.02); sy <- c(0.03, 0.02, 0.05)\n" +
      "ratio <- by / bx                   # -0.30  0.25  0.40\n" +
      "se_r  <- sy / abs(bx)              # 0.10   0.17  1.00\n" +
      "2 * pnorm(-abs(ratio / se_r))      # 0.003  0.134 0.689\n" +
      "(bx / sx)^2                        # 36.0   9.0   0.69 ← 后两个是弱工具\n" +
      "\n" +
      "# 三、真数据：同一套算式，一次铺到 59 行\n" +
      "wald <- data.frame(SNP   = mr_dat$SNP,\n" +
      "                   gene  = mr_dat$gene,\n" +
      "                   ratio = mr_dat$beta_outcome / mr_dat$beta_exposure,\n" +
      "                   F     = (mr_dat$beta_exposure / mr_dat$se_exposure)^2)\n" +
      "head(wald[order(wald$F), ], 3)     # F 最小的几个，估计最不可信\n" +
      "sum(wald$F < 10)                   # 59 个 SNP 里 7 个 F < 10",
    tip: "本关的 wald 就是这张表再加一列 se_ratio 和 pval。F < 10 的 SNP 要单独报出来——不是删掉了事，而是说明「结论对这几个 SNP 敏感」。"
  },

  "drug-1": {
    why: "老药新用第一步是「查表」：候选基因去靶点表里筛行，再按药物状态打一个分。4 行数据就能看清",
    code:
      "# 一、先看药物表：一行 = 一个「基因—药物」关系\n" +
      "dim(drug_targets)\n" +
      "table(drug_targets$status)\n" +
      "\n" +
      "# 二、4 行玩具：先按候选筛行，再 merge 一张打分表\n" +
      "hit <- data.frame(gene   = c(\"YAP1\", \"YAP1\", \"GPX4\", \"PPARA\"),\n" +
      "                  drug   = c(\"Verteporfin\", \"X\", \"Y\", \"Fenofibrate\"),\n" +
      "                  status = c(\"Approved\", \"Phase II\", \"Approved\", \"Approved\"))\n" +
      "score_map <- data.frame(status = c(\"Approved\", \"Phase III\", \"Phase II\", \"Experimental\"),\n" +
      "                        score  = c(2, 1.5, 1, 0.5))\n" +
      "hit2 <- merge(hit, score_map, by = \"status\", all.x = TRUE)\n" +
      "hit2[order(-hit2$score), ]\n" +
      "\n" +
      "# 三、真数据：先按候选基因筛，再 merge（顺序反过来也行）\n" +
      "cand <- c(\"PPARA\", \"GPX4\", \"SLC7A11\", \"YAP1\", \"HMOX1\", \"TP53\", \"MERTK\", \"MET\")\n" +
      "hits <- drug_targets[drug_targets$gene %in% cand, ]\n" +
      "hits <- merge(hits, score_map, by = \"status\", all.x = TRUE)\n" +
      "hits$score[is.na(hits$score)] <- 0.5      # 表里没写到的状态，给个底分\n" +
      "approved <- hits[hits$status == \"Approved\", ]\n" +
      "approved[order(-approved$score), ][1:3, c(\"gene\", \"drug\", \"mechanism\")]",
    tip: "用 merge 打分表而不是嵌套 ifelse：以后要加 Phase IV、加权重，只改 score_map 一行，逻辑不用动。approved_hits 就是最后那张筛出来的表。"
  },

  "ml-1": {
    why: "AUC 的定义就一句话：随机抽一个正例和一个负例，模型给正例打分更高的概率。5 个样本就能手算",
    code:
      "# 一、先看清方向：表达矩阵是 基因 × 样本，建模要转成 样本 × 基因\n" +
      "dim(lihc_expr)\n" +
      "table(lihc_clin$group)\n" +
      "\n" +
      "# 二、5 个样本的玩具，手算一次 AUC\n" +
      "pred <- c(0.9, 0.55, 0.6, 0.4, 0.2)\n" +
      "y    <- c(1, 1, 0, 0, 0)\n" +
      "r    <- rank(pred)                              # 5 3 4 2 1\n" +
      "n1 <- sum(y == 1); n0 <- sum(y == 0)\n" +
      "(sum(r[y == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0)   # 0.833\n" +
      "# 一个负例（0.6）压在了正例 0.55 上面，6 对里错 1 对 → 5/6 ≈ 0.833\n" +
      "\n" +
      "# 三、真数据：glm 出概率，再用同一个式子\n" +
      "feat <- c(\"AFP\", \"GPC3\", \"ALB\", \"CYP3A4\", \"YAP1\")\n" +
      "dat  <- data.frame(label = as.integer(lihc_clin$group == \"Tumor\"),\n" +
      "                   t(lihc_expr[feat, lihc_clin$sample]))\n" +
      "fit  <- glm(label ~ ., data = dat, family = binomial())\n" +
      "p    <- predict(fit, type = \"response\")\n" +
      "r    <- rank(p); n1 <- sum(dat$label == 1); n0 <- sum(dat$label == 0)\n" +
      "(sum(r[dat$label == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0)   # 0.95",
    tip: "训练集 AUC 0.95 是「回忆」，不是「预测」——下一关的交叉验证才是真实水平。另外 AUC 对类别不平衡不敏感，样本 40:20 时看着漂亮，不代表临床能用。"
  }
};
