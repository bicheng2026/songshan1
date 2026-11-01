/* 嵩山一号 · 工作站 —— 前几关的「迷你示例」（同构的简化例子，先看懂再动手） */
window.SX_EXAMPLES = {
  "rbase-1": {
    why: "先用一个更简单的同类任务，把「挑行取列」这件事看明白",
    code:
      "# 一、先看清表长什么样\n" +
      "dim(expr_meta)        # 54 行 x 5 列\n" +
      "colnames(expr_meta)   # sample zone time rep group\n" +
      "head(expr_meta, 3)\n" +
      "\n" +
      "# 二、一个更简单的同类任务：挑出所有 Sham（对照组）样本\n" +
      "expr_meta$group == \"Ctrl\"          # 54 个 TRUE/FALSE\n" +
      "expr_meta$sample[expr_meta$group == \"Ctrl\"]\n" +
      "#  → \"Z1_d0_r1\" \"Z1_d0_r2\" \"Z1_d0_r3\" ... 共 9 个\n" +
      "\n" +
      "# 三、两个条件同时满足，用 & 连起来\n" +
      "expr_meta$sample[expr_meta$zone == 1 & expr_meta$time == 0]",
    tip: "看懂上面三行，本关就是把「Sham」换成「IR」、把 zone 1 换成 zone 2。"
  },

  "rbase-2": {
    why: "分组求均值的套路：先取列名 → 再取子矩阵 → 再按行求均值",
    code:
      "# 一、先取出某一组的样本列名\n" +
      "z1 <- expr_meta$sample[expr_meta$zone == 1]\n" +
      "head(z1, 3)      # \"Z1_d0_r1\" \"Z1_d0_r2\" \"Z1_d0_r3\"\n" +
      "\n" +
      "# 二、用这些列名去矩阵里切子矩阵\n" +
      "m1 <- expr_mat[, z1]      # 逗号前空着=所有基因，逗号后是列\n" +
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
      "x <- as.numeric(expr_mat[\"Alb\", ])\n" +
      "\n" +
      "# 二、一维分组：按 zone 求均值\n" +
      "tapply(x, expr_meta$zone, mean)\n" +
      "#        1        2        3\n" +
      "# 12.11717 12.19267 12.09339   ← 三个分区的 Alb 平均表达，差别很小\n" +
      "\n" +
      "# 三、二维分组：第二个参数换成 list()\n" +
      "tapply(x, list(expr_meta$zone, expr_meta$time), mean)\n" +
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
      "rowMeans(expr_mat[, c(\"Z2_d3_r1\")], drop = FALSE)",
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
      "dim(expr_mat)\n" +
      "expr_mat[1:2, 1:3]\n" +
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
    tip: "本关就是把 toy 换成 expr_mat、把 4:6 / 1:3 换成 treat / ctrl 这两组列名。真数据跑完：31 个基因 adj.P < 0.05（25 上调、6 下调），Mki67 的 logFC 约 1.17。"
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
  },

  "spatial-2": {
    why: "先用 9 个格子把 Moran's I 的公式走一遍，再换成 484 个 spot 的真数据",
    code:
      "# 一、9 个 spot 摆成 3x3（真数据 484 个，道理一样）\n" +
      "v <- matrix(c(1, 1, 2,\n" +
      "              1, 9, 2,\n" +
      "              1, 2, 2), nrow = 3, byrow = TRUE)\n" +
      "v\n" +
      "# 中间那个 9 被 1 包围 → 空间离群点，Moran's I 会被拉成负数\n" +
      "\n" +
      "# 二、把「谁是邻居」写成矩阵：上下左右算邻居，对角线不算\n" +
      "nb  <- matrix(0, 9, 9)\n" +
      "pos <- expand.grid(row = 1:3, col = 1:3)\n" +
      "for (i in 1:9) for (j in 1:9) {\n" +
      "  if (abs(pos$row[i] - pos$row[j]) + abs(pos$col[i] - pos$col[j]) == 1) nb[i, j] <- 1\n" +
      "}\n" +
      "sum(nb)     # 12 条有向边：四角各 2 条、边中各 3 条、中心 4 条\n" +
      "\n" +
      "# 三、Moran's I 只有一句定义：邻居乘积之和 / 离差平方和（再乘 n/S0）\n" +
      "z <- as.numeric(v) - mean(as.numeric(v))\n" +
      "I <- (9 / sum(nb)) * (t(z) %*% nb %*% z) / sum(z^2)\n" +
      "I           # 负数：高值旁边全是低值，说明不是聚集而是离群\n" +
      "\n" +
      "# 四、换真数据：距离 <= 1.5 算邻居，其余照抄上面三行\n" +
      "d  <- as.matrix(dist(spatial_spots[, c(\"x\", \"y\")]))\n" +
      "W  <- (d <= 1.5) * 1; diag(W) <- 0\n" +
      "z2 <- spatial_spots$COL1A1 - mean(spatial_spots$COL1A1)\n" +
      "(484 / sum(W)) * (t(z2) %*% W %*% z2) / sum(z2^2)",
    tip: "真数据 COL1A1 的 I 明显 > 0.3，是成片聚集而不是随机撒的；换 EPCAM 算一遍作对照，值会低一些（上皮标记更贴区位，但没胶原那么成片）。注意 W 一定要把对角线置 0，否则自己和自己算邻居，I 会被虚高。"
  },

  "mr-2": {
    why: "IVW 说穿了就是「比值 + 加权平均」，先用 3 个 SNP 手算，再对每个基因 batch 一遍",
    code:
      "# 一、3 个 SNP 的玩具：bx 是工具变量对暴露的效应，by 是对结局的效应\n" +
      "bx <- c(0.20, 0.10, 0.40)\n" +
      "by <- c(0.10, 0.055, 0.18)\n" +
      "sx <- c(0.02, 0.02, 0.04)\n" +
      "sy <- c(0.03, 0.03, 0.05)\n" +
      "\n" +
      "ratio <- by / bx\n" +
      "ratio        # 每个 SNP 各自给一个因果估计，三个都接近 0.5\n" +
      "\n" +
      "# 二、权重为什么是 1/se^2：se 用比值法的 Delta 近似\n" +
      "se_r <- sqrt(sy^2 / bx^2 + by^2 * sx^2 / bx^4)\n" +
      "w    <- 1 / se_r^2\n" +
      "round(w, 1)  # bx 越大、se 越小，权重越高——大效应 SNP 说话更算数\n" +
      "\n" +
      "# 三、IVW = 加权平均，本质是固定效应 meta 分析\n" +
      "sum(w * ratio) / sum(w)      # 合成后的因果估计\n" +
      "1 / sqrt(sum(w))             # 合成估计的标准误\n" +
      "\n" +
      "# 四、真数据：同一套，只是先按基因分组\n" +
      "d <- mr_dat[mr_dat$gene == \"SLC7A11\", ]\n" +
      "r <- d$beta_outcome / d$beta_exposure\n" +
      "w2 <- 1 / (d$se_outcome^2 / d$beta_exposure^2)\n" +
      "b  <- sum(w2 * r) / sum(w2)\n" +
      "c(b = b, se = 1 / sqrt(sum(w2)), p = 2 * pnorm(-abs(b * sqrt(sum(w2)))))",
    tip: "真数据里 SLC7A11 和 PPARA 的 IVW 估计显著为负（保护因素），而 GPX4 / HMOX1 / CDKN1A 不显著——这是数据故意埋的坑：不显著不等于没关系，可能是工具变量太弱或真值为 0。判题要的是每基因一行，所以外层再套一层 lapply 走 split(mr_dat, mr_dat$gene)。"
  },

  "mr-3": {
    why: "三个稳健性检验都只是一个 lm 或一个求和，先用 5 个 SNP 看清残差怎么用",
    code:
      "# 一、5 个 SNP 的玩具：故意让截距不为 0（存在定向多效性）\n" +
      "bx <- c(0.10, 0.15, 0.20, 0.25, 0.30)\n" +
      "by <- c(0.06, 0.09, 0.10, 0.14, 0.19)\n" +
      "sy <- c(0.02, 0.02, 0.02, 0.02, 0.02)\n" +
      "\n" +
      "# 二、Egger：by 对 bx 做加权回归，看截距是否显著偏离 0\n" +
      "fit <- lm(by ~ bx, weights = 1 / sy^2)\n" +
      "summary(fit)$coefficients\n" +
      "# 截距那一行的 p 值就是「有没有定向多效性」的答案\n" +
      "\n" +
      "# 三、Cochran's Q：残差按权重平方求和，自由度 = SNP 数 - 1\n" +
      "res <- residuals(fit)\n" +
      "Q   <- sum((res / sy)^2)\n" +
      "c(Q = Q, df = length(bx) - 1, p = pchisq(Q, length(bx) - 1, lower.tail = FALSE))\n" +
      "\n" +
      "# 四、留一法：每次去掉一个 SNP，看合并方向会不会翻\n" +
      "loo <- sapply(seq_along(bx), function(i) {\n" +
      "  r <- by[-i] / bx[-i]; w <- 1 / (sy[-i]^2 / bx[-i]^2)\n" +
      "  sum(w * r) / sum(w)\n" +
      "})\n" +
      "round(loo, 3)    # 五个值同号，才叫稳健；有一个翻号就要单独解释那个 SNP",
    tip: "真数据把玩具换成 mr_dat[mr_dat$gene == \"PPARA\", ] 就能跑全套。Q 的 p < 0.05 说明 SNP 之间不一致（异质性），此时优先看 IVW 的随机效应版本或直接报 Egger；留一法只要方向一致，结论就能写。"
  },

  "mr-4": {
    why: "共定位初筛不需要跑 colc，先把「两个性状都显著」这件事数清楚",
    code:
      "# 一、玩具：一个基因 6 个 SNP，两列 p 值\n" +
      "toy <- data.frame(snp = paste0(\"rs\", 1:6),\n" +
      "                  p1  = c(1e-9, 1e-10, 0.2, 3e-9, 0.4, 1e-12),\n" +
      "                  p2  = c(1e-9, 0.3,   1e-11, 4e-9, 0.5, 0.2))\n" +
      "toy$both <- toy$p1 < 5e-8 & toy$p2 < 5e-8\n" +
      "toy\n" +
      "sum(toy$both)     # 2 个位点两边都显著 → 有共享信号的迹象\n" +
      "\n" +
      "# 二、真数据的做法：按基因分组，数「双显著」的位点数\n" +
      "cg <- split(coloc_dat, coloc_dat$gene)\n" +
      "out <- do.call(rbind, lapply(cg, function(d) {\n" +
      "  data.frame(gene = d$gene[1],\n" +
      "             n_snp = nrow(d),\n" +
      "             n_both_sig = sum(d$p_trait1 < 5e-8 & d$p_trait2 < 5e-8))\n" +
      "}))\n" +
      "out$flag <- out$n_both_sig > 0\n" +
      "out[order(-out$n_both_sig), ]",
    tip: "这是「初筛」不是「共定位」：p 值双显著只能说两个信号在同一区域，不能证明是同一个因果变异——真正的 PP.H4 要考虑 LD 和先验。真数据里每个基因都是 14 个 SNP，SLC7A11 有 2 个双显著、ACSL4 和 PPARA 各 3 个，GPX4 / YAP1 / HMOX1 是 0，正好对上「有信号 / 没信号」两组。"
  },

  "tox-1": {
    why: "网络毒理学的核心只是一张「化合物 × 基因」的 0/1 表和一次按行求和",
    code:
      "# 一、玩具：3 个化合物 × 4 个基因的命中表\n" +
      "toy <- data.frame(\n" +
      "  chemical = c(\"BPA\", \"BPA\", \"Cd\", \"Cd\", \"DEHP\"),\n" +
      "  gene     = c(\"GPX4\", \"ACSL4\", \"GPX4\", \"SLC7A11\", \"ACSL4\"))\n" +
      "toy\n" +
      "\n" +
      "# 二、按化合物数「打到几个候选基因」\n" +
      "n_tar <- tapply(toy$gene, toy$chemical, function(g) length(unique(g)))\n" +
      "n_tar                 # BPA 2、Cd 2、DEHP 1\n" +
      "\n" +
      "# 三、把基因名也拼进去，方便直接看是哪几个\n" +
      "agg <- do.call(rbind, lapply(split(toy, toy$chemical), function(d) {\n" +
      "  data.frame(chemical = d$chemical[1],\n" +
      "             n_target = length(unique(d$gene)),\n" +
      "             genes    = paste(sort(unique(d$gene)), collapse = \"/\"))\n" +
      "}))\n" +
      "agg[order(-agg$n_target), ]\n" +
      "\n" +
      "# 四、真数据：同一套逻辑，只是表更大（30 个基因 × 15 个化合物）\n" +
      "nrow(ctd_edc); length(unique(ctd_edc$gene)); length(unique(ctd_edc$chemical))",
    tip: "真数据里 15 个化合物中有 11 个同时打到 >= 3 个候选基因，排前三的是 Bisphenol A、Cadmium chloride、DEHP——这类「多靶点化合物」才是网络毒理学要重点讨论的对象。注意先去重再计数，同一化合物—基因对在 ctd_edc 里可能重复出现。"
  },

  "ml-2": {
    why: "交叉验证就是把「切一刀」重复 5 次，先用 12 个样本手切一遍看清折是怎么分的",
    code:
      "# 一、12 个样本，手工标 5 折（真数据按 sample 取模就行）\n" +
      "set.seed(1)\n" +
      "y   <- rep(c(0, 1), 6)\n" +
      "fold <- rep(1:5, length.out = 12)\n" +
      "table(fold, y)     # 先确认每一折里正负样本都有，否则该折 AUC 无意义\n" +
      "\n" +
      "# 二、一折长什么样：第 1 折当测试集，其余当训练集\n" +
      "te <- which(fold == 1); tr <- setdiff(seq_along(y), te)\n" +
      "length(tr); length(te)\n" +
      "\n" +
      "# 三、循环 5 次，每次记一个测试集 AUC\n" +
      "x  <- c(1.2, 0.4, 1.5, 0.6, 1.1, 0.5, 1.4, 0.3, 1.3, 0.55, 1.6, 0.45)\n" +
      "auc1 <- function(score, label) {\n" +
      "  pos <- score[label == 1]; neg <- score[label == 0]\n" +
      "  mean(outer(pos, neg, \">\") + 0.5 * outer(pos, neg, \"==\"))\n" +
      "}\n" +
      "sapply(1:5, function(k) {\n" +
      "  tr2 <- fold != k\n" +
      "  fit <- glm(y[tr2] ~ x[tr2], family = binomial)\n" +
      "  pr  <- predict(fit, newdata = data.frame(x = x[!tr2]), type = \"response\")\n" +
      "  auc1(pr, y[!tr2])\n" +
      "})",
    tip: "真数据的关键差别只有一处：预测变量是基因表达（可能几十个），所以训练集里一定要用 scale() 的参数去 transform 测试集，不能各算各的——这就是数据泄漏，也是「训练集 AUC 0.99、测试集 0.6」的元凶。5 折平均 AUC 与 ml-1 的训练集 AUC 差在 0.15 以内，说明没过拟合。"
  },

  "wrt-1": {
    why: "投稿表格的规矩是「数字由代码生成」，先用 3 行小表把 sprintf 拼表头这一步走通",
    code:
      "# 一、3 行小结果表\n" +
      "res <- data.frame(gene = c(\"TFRC\", \"SPP1\", \"YAP1\"),\n" +
      "                  logFC = c(3.069, 3.432, 3.070),\n" +
      "                  p = c(8.4e-12, 2.2e-10, 1.8e-10),\n" +
      "                  adj = c(2.3e-09, 2.1e-08, 2.1e-08))\n" +
      "\n" +
      "# 二、Markdown 表格 = 表头 + 分隔行 + 每行数据\n" +
      "tbl <- c(\"| Gene | logFC | P | adj.P |\",\n" +
      "         \"|---|---:|---:|---:|\",\n" +
      "         sprintf(\"| %s | %.3f | %.2e | %.2e |\", res$gene, res$logFC, res$p, res$adj))\n" +
      "cat(tbl, sep = \"\\n\")\n" +
      "\n" +
      "# 三、想直接贴进 Word：分隔行换成空行，制表符隔开\n" +
      "write.table(res, \"top_deg.tsv\", sep = \"\\t\", quote = FALSE, row.names = FALSE)",
    tip: "真数据要先把 deg 按 adj.P 排序取前 10，再走同样的 sprintf。三个格式符记牢：%.3f 给 logFC、%.2e 给 p 值（写成 2.3e-09 比 0.0000000023 干净）、%s 给基因名。表格数字手抄一次，后面改分析就得改三处，迟早对不上。"
  },

  "wrt-2": {
    why: "图注是可以模板化的：把「样本量、统计方法、显著性标记」做成变量，正文就永远不会和图注打架",
    code:
      "# 一、把图注里会变的数字先存成变量\n" +
      "n_tumor  <- sum(lihc_clin$group == \"Tumor\")\n" +
      "n_normal <- sum(lihc_clin$group == \"Normal\")\n" +
      "method   <- \"two-sided Welch t-test with Benjamini-Hochberg correction\"\n" +
      "\n" +
      "# 二、模板：panel 说明 + 统计方法 + 样本量 + 显著性含义，四件套缺一不可\n" +
      "legend_text <- paste0(\n" +
      "  \"Figure 1. Differential expression between tumour and adjacent normal liver. \",\n" +
      "  \"(A) Volcano plot of all genes; dashed lines mark |logFC| > 1 and adjusted P < 0.05. \",\n" +
      "  \"(B) Heatmap of the top 50 genes ranked by adjusted P. \",\n" +
      "  \"n = \", n_tumor, \" tumour and \", n_normal, \" adjacent normal samples. \",\n" +
      "  \"P values were calculated by \", method, \". \",\n" +
      "  \"* adjusted P < 0.05; ** < 0.01; *** < 0.001; ns, not significant.\"\n" +
      ")\n" +
      "nchar(legend_text)      # 一段话，控制在 60 词以内，审稿人不会嫌长\n" +
      "cat(legend_text)",
    tip: "真数据是 40 个肿瘤 + 20 个癌旁，所以 n = 40 / 20 这两个数由变量算出来，别手打。图注最容易犯的错是写「n = 60 patients」——样本是 60 个，但病人只有 40 个（癌旁不是另一个病人），这种错审稿人一眼就看出来。"
  },

  "boss-1": {
    why: "终章没有新知识，就是把前面几关的输出接起来：DEG → 富集 → 药物匹配，20 行串完",
    code:
      "# 第一步：DEG（Zone3 照后 28 天 vs 对照），就是 bulk-2 那套\n" +
      "treat <- expr_meta$sample[expr_meta$zone == 3 & expr_meta$time == 28]\n" +
      "ctrl  <- expr_meta$sample[expr_meta$group == \"Ctrl\"]\n" +
      "p  <- apply(expr_mat, 1, function(x) t.test(x[treat], x[ctrl])$p.value)\n" +
      "fc <- rowMeans(expr_mat[, treat]) - rowMeans(expr_mat[, ctrl])\n" +
      "deg <- data.frame(gene = rownames(expr_mat), logFC = fc,\n" +
      "                  adj.P = p.adjust(p, \"BH\"), stringsAsFactors = FALSE)\n" +
      "up  <- deg$gene[deg$adj.P < 0.05 & deg$logFC > 1]\n" +
      "length(up)          # 这一步的输出，就是下一步的输入\n" +
      "\n" +
      "# 第二步：富集（bulk-4 的 phyper 套到每个基因集上，这里只看候选基因落没落在集合里）\n" +
      "hit <- sapply(gmt, function(g) sum(up %in% g))\n" +
      "head(sort(hit, decreasing = TRUE), 3)\n" +
      "\n" +
      "# 第三步：药物匹配（drug-1 的 merge），只要已获批的\n" +
      "cand <- merge(data.frame(gene = up), drug_targets, by = \"gene\")\n" +
      "cand <- cand[cand$status == \"Approved\", ]\n" +
      "cand[order(cand$gene), c(\"gene\", \"drug\", \"mechanism\")]",
    tip: "这一关判的是「链路通不通」而不是「结果漂不漂亮」：step1 的 deg 必须是 data.frame 且含 adj.P，step2 的富集要基于 step1 的 up 基因（不能另起炉灶），step3 的候选清单必须来自 step2/step1 的基因。三段之间只要有一处手工抄数字，整条链路就断了。"
  }
};
