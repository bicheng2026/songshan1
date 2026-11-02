/*!
 * 嵩山一号 · 科研训练工作站　v1.0
 * Copyright (c) 2026 江德胜　保留所有权利 (All Rights Reserved)
 * 未经著作权人书面许可，不得复制、修改、分发或用于商业用途。
 * 第三方文献、数据集、软件包的著作权归各自权利人所有，详见 COPYRIGHT.md。
 */

window.SX_CODEBANK = [
  {
    id: "rbase-01",
    track: "rbase",
    trackName: "R 语言基础",
    title: "分析项目骨架与路径管理（here + fs）",
    level: "基础",
    tags: ["项目结构","here","路径管理","可重复性"],
    packages: ["here","fs","readr"],
    scene: "刚开一个新课题，想先把目录、输入输出路径、随机种子一次性搭好，保证换台电脑脚本也能直接跑通。",
    code: `# ============================================================
# 01 项目骨架：所有路径以项目根目录为锚点，杜绝 setwd
# ============================================================
library(here)
library(fs)
library(readr)

# 用 i_am 声明本脚本身份：若当前目录不在项目内会直接报错提醒
here::i_am("analysis/01_build_project.R")

# 一次性建立标准目录，已存在时不会报错
dirs <- c("data/raw", "data/processed", "results/figures",
          "results/tables", "analysis", "docs")
fs::dir_create(here::here(dirs))

# 输入输出路径统一写在最前面，后面全程引用变量，不写绝对路径
f_raw  <- here::here("data/raw/GSE12345_counts.csv")
f_out  <- here::here("data/processed/expr_matrix.rds")

# 读入表达矩阵：readr 不会把字符串偷偷转成因子
expr_tbl <- readr::read_csv(f_raw, show_col_types = FALSE)

# 第一列是基因名，转成行名后变为矩阵，方便下游 limma / DESeq2 使用
expr_mat <- expr_tbl |>
  tibble::column_to_rownames("gene_id") |>
  as.matrix()

# 做个基本体检：维度、缺失值、是否有重复基因
dim(expr_mat)
sum(is.na(expr_mat))
any(duplicated(rownames(expr_mat)))

# 保存为 rds，保留矩阵结构和行名，比 csv 更保真
saveRDS(expr_mat, file = f_out)

# 固定随机种子并记录运行环境，保证结果可复现
set.seed(20240101)
writeLines(capture.output(sessionInfo()), here::here("results/tables/sessionInfo_01.txt"))`,
    notes: [
      "绝对路径是生信最常见的翻车点：一旦换电脑或换合作者，脚本全线报错。here 包以 .Rproj 或 .git 所在层作为项目根，路径永远相对。",
      "中间结果一律存 rds 而不是 csv：csv 会丢掉行名、因子水平和矩阵维度信息。",
      "每个分析脚本开头都跑一遍 sessionInfo 存档，半年后回看能知道当时用的是哪个版本的 DESeq2 / Seurat。"
    ],
    pitfalls: [
      "不要用 setwd()，这是 R 可重复性第一大禁忌。",
      "Windows 下路径分隔符要写成正斜杠，或者用 file.path 拼接，反斜杠会被当成转义符。",
      "here::i_am 里的路径写错会直接报错，这是它故意的设计，用来强制你核对目录结构。"
    ],
    next: ["rbase-02", "bulk-02", "writing-01"]
  },
  {
    id: "rbase-02",
    track: "rbase",
    trackName: "R 语言基础",
    title: "表格读入、合并与写出（readr / data.table）",
    level: "基础",
    tags: ["数据读入","fread","长宽转换","临床信息"],
    packages: ["data.table","readr","dplyr","tidyr"],
    scene: "手上有表达矩阵和一份临床随访表，需要按样本 ID 对齐、把宽表转长表，最后导出给下游或 supplement table。",
    code: `# ============================================================
# 02 多来源表格的读入、对齐与写出
# ============================================================
library(data.table)
library(dplyr)
library(tidyr)
library(readr)

# 大文件（几百 MB 的 counts）用 fread，比 read_csv 快数倍
cnt <- data.table::fread("data/raw/GSE14520_counts.csv", data.table = FALSE)
cli <- readr::read_csv("data/raw/clinical_followup.csv", show_col_types = FALSE)

# 统一命名口径：TCGA 的样本条码只有前 12 位代表患者
cli <- cli |>
  dplyr::mutate(sample_id = substr(TCGA_barcode, 1, 12)) |>
  dplyr::distinct(sample_id, .keep_all = TRUE)

# 检查两边能否对得上：这一步省略的话后面会出现大量 NA
length(intersect(colnames(cnt)[-1], cli$sample_id))
setdiff(colnames(cnt)[-1], cli$sample_id)

# 宽表转长表，方便 ggplot2 直接画图
cnt_long <- cnt |>
  tidyr::pivot_longer(cols = -gene_id, names_to = "sample_id", values_to = "count") |>
  dplyr::left_join(cli, by = "sample_id") |>
  dplyr::filter(!is.na(count))

# 按生存状态汇总每个基因的平均表达（示例分组汇总）
gene_summary <- cnt_long |>
  dplyr::group_by(gene_id, vital_status) |>
  dplyr::summarise(mean_cnt = mean(count, na.rm = TRUE), .groups = "drop") |>
  tidyr::pivot_wider(names_from = vital_status, values_from = mean_cnt)

# 导出：write_csv 默认不写行名，需要行名时要先 column_to_rownames 的逆操作
readr::write_csv(gene_summary, "results/tables/TableS1_gene_summary.csv")
data.table::fwrite(gene_summary, "results/tables/TableS1_gene_summary_fast.csv")`,
    notes: [
      "fread 的 data.table = FALSE 参数可以返回 data.frame，避免混用 dplyr 时出现奇怪的行为。",
      "合并前务必先看 setdiff，确认样本匹配情况；TCGA 条码截取 12 位是常见操作，注意原发肿瘤和复发样本的 -01A / -02A 区别。",
      "长表适合画图，宽表适合做矩阵运算，pivot_longer 和 pivot_wider 是来回切换的开关。"
    ],
    pitfalls: [
      "write_csv 会丢弃行名，想保留行名要用 tibble::rownames_to_column 先转成列。",
      "Excel 打开 csv 时基因名如 SEPT9、MARCH1 会被自动转成日期，写文件后不要再用 Excel 另存。",
      "left_join 时如果右边有重复 key，结果行数会膨胀，用 distinct 或专门检查重复。"
    ],
    next: ["rbase-03", "bulk-01", "ml-04"]
  },
  {
    id: "rbase-03",
    track: "rbase",
    trackName: "R 语言基础",
    title: "tidyverse 数据操作五件套与分组汇总",
    level: "基础",
    tags: ["dplyr","过滤","分组汇总","case_when"],
    packages: ["dplyr","tidyr","stringr"],
    scene: "拿到差异表达结果表，需要按阈值筛选显著基因、打上下调标签、按分组统计数量并挑出每个分组的 top 基因。",
    code: `# ============================================================
# 03 差异结果表的筛选、标注与分组汇总
# ============================================================
library(dplyr)
library(tidyr)
library(stringr)

deg <- readRDS("data/processed/deg_limma.rds")   # 含 logFC, P.Value, adj.P.Val, gene

# 1) 筛选 + 标注上下调：case_when 比多层 ifelse 清晰得多
deg_sig <- deg |>
  dplyr::filter(!is.na(adj.P.Val)) |>
  dplyr::mutate(
    direction = dplyr::case_when(
      adj.P.Val < 0.05 & logFC >  1 ~ "Up",
      adj.P.Val < 0.05 & logFC < -1 ~ "Down",
      TRUE                          ~ "NS"
    ),
    neg_log10P = -log10(P.Value)
  )

# 2) 分组计数，看阈值是否合适（太少或太多都要回头调）
deg_sig |>
  dplyr::count(direction, sort = TRUE)

# 3) 每组按 |logFC| 取前 10 个基因，用于后续热图或表格展示
top10 <- deg_sig |>
  dplyr::filter(direction != "NS") |>
  dplyr::group_by(direction) |>
  dplyr::slice_max(order_by = abs(logFC), n = 10, with_ties = FALSE) |>
  dplyr::ungroup()

# 4) 基因名清洗：去掉 Ensembl ID 的版本号
deg_sig <- deg_sig |>
  dplyr::mutate(gene_clean = stringr::str_remove(gene, "\\\\.[0-9]+$"))

# 5) 复核是否与预期基因集一致
length(intersect(deg_sig$gene_clean, top10$gene_clean))`,
    notes: [
      "case_when 的 TRUE ~ 分支相当于 else，必须写在最后，否则会覆盖前面的条件。",
      "slice_max / slice_min 是取每组 top N 最简洁的写法，比 old school 的 do + head 更快。",
      "Ensembl ID 带版本号（ENSG0000012345.6）是常态，做 ID 转换或比对前必须去掉小数点及后面的数字。"
    ],
    pitfalls: [
      "filter 遇到 NA 会把整行丢掉，想保留要显式写 is.na(x) | 条件。",
      "group_by 之后忘记 ungroup，后续 mutate 会在组内计算，结果让人一头雾水。",
      "group_by 分组后再取值要看清 replace 的语境，取错组是静默发生、很难察觉的错误。"
    ],
    next: ["rbase-04", "bulk-06", "viz-02"]
  },
  {
    id: "rbase-04",
    track: "rbase",
    trackName: "R 语言基础",
    title: "批量处理：apply 家族与 purrr 循环",
    level: "进阶",
    tags: ["purrr","批循环","批量建模","并行"],
    packages: ["purrr","dplyr","furrr"],
    scene: "要对几十个基因分别做 Cox 回归，或者对多个数据集重复同一套分析流程，不想写复制粘贴的糊代码。",
    code: `# ============================================================
# 04 批量循环：把一个流程套用到一堆对象上
# ============================================================
library(purrr)
library(dplyr)
library(survival)

expr  <- readRDS("data/processed/expr_matrix.rds")   # 基因 x 样本
surv  <- readRDS("data/processed/surv_df.rds")       # 含 time, status

# 1) 构造模型公式列表，每个基因一个公式
gene_vec <- c("TP53", "BAX", "CDKN1A", "GADD45A")
fml_list <- purrr::set_names(gene_vec) |>
  purrr::map(~ as.formula(paste0("Surv(time, status) ~ ", .x)))

# 2) 把表达值并到生存数据里（只取这批基因）
dat <- surv |>
  dplyr::mutate(dplyr::across(dplyr::all_of(gene_vec),
                              ~ as.numeric(expr[.x, sample_id])))

# 3) 批量拟合 Cox 模型，安全版：单个基因失败不会中断整轮循环
fit_all <- purrr::map(fml_list, function(f) {
  tryCatch(coxph(f, data = dat), error = function(e) NULL)
})

# 4) 提取结果成一张干净的表（compact 自动丢掉失败项）
cox_res <- fit_all |>
  purrr::compact() |>
  purrr::map_dfr(~ broom::tidy(.x, conf.int = TRUE, exponentiate = TRUE),
                 .id = "gene")

# 5) 数据量大时可切换到多线程，语法几乎不变
future::plan(future::multisession, workers = 4)
cox_res_par <- furrr::future_map(fml_list,
                                 ~ summary(coxph(.x, data = dat))$coefficients[1, ],
                                 .options = furrr::furrr_options(seed = 2024))
future::plan(future::sequential)

cox_res |>
  dplyr::filter(term != "") |>
  dplyr::arrange(p.value)`,
    notes: [
      "map / map_dfr / map_chr 分别返回列表、按行合并的数据框、字符向量，选对后缀能省掉 do.call(rbind) 的麻烦。",
      "循环体里包一层 tryCatch 是生信批量分析的保命操作：100 个基因里有 1 个表达全零也不会导致整晚白跑。",
      "furrr 可以把 map 直接升级为并行版，plan(multisession) 在 Windows 上也能用。"
    ],
    pitfalls: [
      "map (列表) 和 map_df (数据框) 的返回类型不同，混用会导致列名错乱或静默丢数据。",
      "并行时每个 worker 是独立环境，需要显式用 .options 传种子，否则结果不可复现。",
      "Windows 的并行依赖 multisession 而不是 multicore，Linux/Mac 才能用 multicore。"
    ],
    next: ["rbase-05", "ml-01", "bulk-10"]
  },
  {
    id: "rbase-05",
    track: "rbase",
    trackName: "R 语言基础",
    title: "自定义函数、向量化与错误调试",
    level: "进阶",
    tags: ["自定义函数","debug","向量化","scopy"],
    packages: ["assertthat","cli","testthat"],
    scene: "有一段清洗逻辑要在多个数据集上反复用，想封装成函数并加上输入校验，出问题能快速定位。",
    code: `# ============================================================
# 05 把重复逻辑封装成函数，并做基本的输入校验
# ============================================================
library(assertthat)
library(cli)

# 通用函数：输入矩阵 + 分组向量，返回经过过滤的对数化矩阵
normalize_matrix <- function(mat, group = NULL, min_count = 10,
                             method = c("logCPM", "logTPM", "none")) {
  # 先校验输入，错误早暴露比结果出错好得多
  assertthat::assert_that(is.matrix(mat),
                          msg = "输入必须是矩阵，请用 as.matrix 转换")
  assertthat::assert_that(!any(is.na(mat)),
                          msg = "矩阵中存在 NA，请先处理缺失值")
  method <- match.arg(method)

  # 第一步：过滤低表达基因（至少在 50% 样本里有表达）
  keep <- rowSums(mat >= min_count) >= (0.5 * ncol(mat))
  cli::cli_alert_info("保留基因数：{sum(keep)} / {nrow(mat)}")
  mat_f <- mat[keep, , drop = FALSE]

  # 第二步：按所选方法归一化。logCPM 依赖 edgeR，logTPM 需外部提供长度
  out <- switch(method,
    logCPM = log2(edgeR::cpm(mat_f) + 1),
    logTPM = log2(sweep(mat_f, 2, colSums(mat_f), "/") * 1e6 + 1),
    none   = mat_f
  )
  return(out)
}

# 调用函数：注意名字不要和 base 里的已有函数重名
expr_mat <- readRDS("data/processed/expr_matrix.rds")
log_mat  <- normalize_matrix(expr_mat, method = "logCPM", min_count = 10)

# 调试三件套：traceback 看报错栈，browser 进入现场
# debugonce(normalize_matrix)   # 只调试下一次调用
# options(error = recover)      # 报错后可选择进入任意一层环境

# 简单测试：函数行为符合预期再投入正式分析
stopifnot(nrow(log_mat) <= nrow(expr_mat))
stopifnot(all(log_mat >= 0))`,
    notes: [
      "assert_that 写在函数开头，能在数据格式不对的瞬间报错，而不是在三十行以后给出一个诡异的 NaN。",
      "match.arg 实现参数的部分匹配和默认值，比手写一串 if-else 优雅。",
      "debugonce + browser + traceback 是定位 bug 最快的三个工具，比到处 print 高效。"
    ],
    pitfalls: [
      "自定义函数不要叫 data、df、mean 这类基础名字，容易遮蔽同名函数。",
      "函数里直接引用全局变量是隐患，一旦换了环境就失效，参数化才是正解。",
      "return 一定要显式写，否则函数返回最后一个表达式的值，改动代码时容易悄悄变掉。"
    ],
    next: ["rbase-06", "bulk-03", "ml-02"]
  },
  {
    id: "rbase-06",
    track: "rbase",
    trackName: "R 语言基础",
    title: "包管理与环境快照（renv / pacman 风格）",
    level: "基础",
    tags: ["renv","包管理","BiocManager","环境复现"],
    packages: ["renv","BiocManager"],
    scene: "课题做到一半换了电脑，或者要把分析环境交给师妹复现，需要锁定所有包的版本。",
    code: `# ============================================================
# 06 依赖管理与环境复现
# ============================================================
# 第一次使用 renv：初始化项目私有库
# renv::init()                 # 会建立 renv.lock 与 renv/ 目录

# 日常开发：装包后拍一次快照，记录精确版本
# renv::snapshot()

# 换机器时：一条命令还原完全相同的环境
# renv::restore()

# ---------- 生信包的安装姿势（与 CRAN 不同） ----------
if (!requireNamespace("BiocManager", quietly = TRUE))
  install.packages("BiocManager")

BiocManager::install(c("DESeq2", "edgeR", "limma", "clusterProfiler",
                       "org.Hs.eg.db", "ComplexHeatmap", "GSVA"),
                     ask = FALSE, update = FALSE)

BiocManager::install("Seurat", ask = FALSE, update = FALSE)

# GitHub 上的开发版（示例：IOBR 免疫浸润工具箱）
# remotes::install_github("iobio/IOBR")

# ---------- 批量加载并检查缺失包 ----------
pkgs <- c("tidyverse", "data.table", "DESeq2", "clusterProfiler", "survival")
miss <- setdiff(pkgs, rownames(installed.packages()))
if (length(miss) > 0) stop("以下包未安装：", paste(miss, collapse = ", "))

invisible(lapply(pkgs, library, character.only = TRUE))

# 查看关键包版本并存档，投稿时 reviewer 常问
vers <- sapply(pkgs, function(p) as.character(utils::packageVersion(p)))
write.csv(data.frame(package = names(vers), version = vers),
          "results/tables/package_versions.csv", row.names = FALSE)

# 检查是否有函数被其他包遮蔽（常见于 dplyr::filter 与 stats::filter）
search()
conflicts()`,
    notes: [
      "renv 的核心是 renv.lock 文件，把它和 .Rproj 一起放进 Git 仓库，环境就能 100% 复现。",
      "生信包必须走 BiocManager::install 而不是 install.packages，后者会从 CRAN 拉到错误或过期的版本。",
      "每次投稿前导出一张包版本表，审稿人要求补方法学时可以直接贴。"
    ],
    pitfalls: [
      "renv::snapshot 会把环境里所有包都记录进去，建议在项目专用库里跑，避免污染。",
      "Bioconductor 每年两次大版本更新，跨版本混装 CRAN 包会导致 S4 方法找不到。",
      "library(dplyr) 之后 stats::filter 会被同名遮蔽，遇到奇怪报错时用 dplyr::filter 显式指名。",
      "renv 项目里切换 R 大版本会导致所有包重装，建议锁死 R 版本后再 restore。"
    ],
    next: ["writing-01", "bulk-01", "viz-01"]
  },
  {
    id: "bulk-01",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "GEO 数据集下载与芯片数据整理",
    level: "基础",
    tags: ["GEO","GEOquery","探针注释","芯片"],
    packages: ["GEOquery","Biobase","tidyverse"],
    scene: "在 GEO 上找到一个目标数据集（例如 GSE14520），想把它的表达矩阵下载下来、按 tumor/normal 分组，并把探针 ID 换成基因 symbol。",
    code: `# 数据来源：NCBI GEO (https://www.ncbi.nlm.nih.gov/geo/)
library(GEOquery)
library(Biobase)
library(dplyr)
library(tibble)

# 1) 下载 Series Matrix，destdir 会缓存，重复运行不再联网
gset <- GEOquery::getGSE("GSE14520", destdir = "data/raw")[[1]]
# 2) 拆出表达矩阵与样本描述表，先用 colnames 看看分组字段叫什么
expr  <- Biobase::exprs(gset)
pdata <- Biobase::pData(gset)
# 3) 从表型字段里抢救出分组信息，不同数据集的字段名差别很大
grp <- pdata |>
  tibble::rownames_to_column("gsm") |>
  dplyr::mutate(group = dplyr::case_when(
    grepl("tumor", characteristics_ch1, ignore.case = TRUE) ~ "Tumor",
    grepl("non|normal", characteristics_ch1, ignore.case = TRUE) ~ "Normal",
    TRUE ~ NA_character_
  )) |>
  dplyr::filter(!is.na(group))
# 4) 拿平台注释表，把探针映射到基因 symbol
gpl   <- GEOquery::getGEO("GPL3921", destdir = "data/raw")
annot <- GEOquery::Table(gpl)
probe2gene <- data.frame(probe_id = annot$ID,
                         symbol   = annot[["Gene Symbol"]],
                         stringsAsFactors = FALSE)

# 5) 探针合并到基因：一个基因多个探针时取均值
expr_gene <- expr |>
  as.data.frame() |>
  tibble::rownames_to_column("probe_id") |>
  dplyr::inner_join(probe2gene, by = "probe_id") |>
  dplyr::filter(!is.na(symbol), symbol != "") |>
  dplyr::group_by(symbol) |>
  dplyr::summarise(dplyr::across(dplyr::where(is.numeric), ~ mean(.x, na.rm = TRUE)),
                   .groups = "drop") |>
  tibble::column_to_rownames("symbol") |>
  as.matrix()
# 6) 判断是否需要 log2：未取对数的芯片数据上限通常远大于 50
if (max(expr_gene, na.rm = TRUE) > 50) expr_gene <- log2(expr_gene + 1)
# 7) 只保留有分组信息的样本并分别保存
expr_final <- expr_gene[, intersect(colnames(expr_gene), grp$gsm), drop = FALSE]
saveRDS(expr_final, "data/processed/GEO_expr_symbol.rds")
saveRDS(grp,        "data/processed/GEO_group.rds")`,
    notes: [
      "getGSE 返回的是一个列表，一个 GSE 里可能有多个 GPL 平台，跨平台数据集必须拆开分别处理。",
      "characteristics_ch1 是 GEO 表型里最常见也最混乱的字段，拿到手务必先 table 或 head 看一眼真实取值。",
      "多个探针对应同一基因时取均值比取第一个探针稳健；若追求严谨可改取表达量最高的探针（jetset 包的思路）。"
    ],
    pitfalls: [
      "注释表的列名带空格（Gene Symbol），用反引号取列会和各种模板/脚本冲突，用 [[]] 索引更稳。",
      "同一个基因 symbol 有时是空字符串却不是 NA，需要同时过滤 NA 和空串。",
      "不要重复 log2：部分上传者已经提交过 log 值，二次取对数会把倍数关系彻底压扁。"
    ],
    next: ["bulk-02", "bulk-05", "bulk-06"]
  },
  {
    id: "bulk-02",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "TCGA 数据下载与配对样本整理",
    level: "基础",
    tags: ["TCGA","TCGAbiolinks","GDC","counts"],
    packages: ["TCGAbiolinks","SummarizedExperiment","tidyverse"],
    scene: "手上有 TCGA-LIHC 项目，想直接拉到 STAR-counts 的原始计数矩阵，并拆出肿瘤与癌旁配对样本做后续差异分析。",
    code: `# 数据来源：GDC Data Portal (https://portal.gdc.cancer.gov/)
library(TCGAbiolinks)
library(SummarizedExperiment)
library(dplyr)

# 1) 构建查询：workflow.type 选 STAR - Counts 才能拿到原始整数计数
query <- TCGAbiolinks::GDCquery(
  project            = "TCGA-LIHC",
  data.category      = "Transcriptome Profiling",
  data.type          = "Gene Expression Quantification",
  workflow.type      = "STAR - Counts",
  legacy             = FALSE,
  access             = "open"
)

# 2) 下载并整理成 SummarizedExperiment 对象（耗时较久，建议后台跑）
TCGAbiolinks::GDCdownload(query, files.per.chunk = 20, method = "api")
tcga <- TCGAbiolinks::GDCprepare(query, save = TRUE,
                                 save.filename = "data/raw/LIHC_counts.rda")

# 3) 取计数矩阵，STAR 流程给出多个 assay，unstranded 最常用
cnts  <- SummarizedExperiment::assay(tcga, "unstranded")
cdata <- SummarizedExperiment::colData(tcga) |> as.data.frame()
identical(rownames(cdata), colnames(cnts))   # 必须 TRUE 才能往下走

# 4) 按样本类型拆出肿瘤与癌旁
table(cdata$sample_type, useNA = "ifany")
sel_tumor  <- cdata$sample_type == "Primary Tumor"
sel_normal <- cdata$sample_type == "Solid Tissue Normal"

# 5) TCGA barcode 前 12 位代表患者，据此找配对样本
cdata$patient <- substr(cdata$barcode, 1, 12)
paired <- intersect(cdata$patient[sel_tumor], cdata$patient[sel_normal])
cat("配对患者数：", length(paired), "\\n")

# 6) 只保留配对样本，行名改成 12 位患者编号方便后面做配对检验
keep <- which(cdata$patient %in% paired)
cnts_paired <- cnts[, keep, drop = FALSE]
meta_paired <- cdata[keep, c("barcode", "patient", "sample_type", "vital_status",
                             "days_to_death", "days_to_last_follow_up")]
colnames(cnts_paired) <- meta_paired$patient
# 7) 清理 Ensembl ID 版本号（部分流程会带 .1 之类的后缀）
rownames(cnts_paired) <- sub("\\\\.[0-9]+$", "", rownames(cnts_paired))
saveRDS(cnts_paired, "data/processed/TCGA_LIHC_paired_counts.rds")
saveRDS(meta_paired, "data/processed/TCGA_LIHC_paired_meta.rds")`,
    notes: [
      "一定要用 workflow.type = STAR - Counts / HTSeq - Counts，FPKM 或 FPKM-UQ 不能进 DESeq2。",
      "TCGA barcode 有固定编码规则：第 14-15 位 01 是原发灶、11 是癌旁、06 是转移灶，做配对时必须核对。",
      "生存数据在 GDC 里有 days_to_death 与 days_to_last_follow_up 两个字段，多数情况下取二者较大值作为随访时间。"
    ],
    pitfalls: [
      "GDCdownload 在国内网络环境经常中断，建议挂后台并保留 destdir 缓存，不要每次重跑。",
      "TCGA 的癌旁样本只有几十例，配对分析样本量会骤降，写方法学时要把样本数交代清楚。",
      "assay 名称随版本可能变化（unstranded / stranded_first / stranded_second），不确定时先 assayNames(tcga) 看一眼。"
    ],
    next: ["bulk-03", "bulk-05", "bulk-10"]
  },
  {
    id: "bulk-03",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "Counts 转 CPM / FPKM / TPM",
    level: "进阶",
    tags: ["归一化","TPM","edgeR","DESeq2","基因长度"],
    packages: ["edgeR","DESeq2","SummarizedExperiment","GenomicFeatures","GenomicRanges","purrr"],
    scene: "有原始 counts 矩阵，审稿人要求给出 TPM 做组间表达量展示，同时需要 CPM 过滤低表达基因。",
    code: `library(edgeR)
library(DESeq2)
library(GenomicFeatures)
library(purrr)

cnts <- readRDS("data/processed/TCGA_LIHC_paired_counts.rds")

# 1) CPM：校正测序深度，edgeR 一行搞定
cpm_mat <- edgeR::cpm(cnts, log = FALSE, prior.count = 0)
# 习惯用法：log2(CPM + 1)，加 1 是为了避免出现负无穷
logcpm  <- edgeR::cpm(cnts, log = TRUE, prior.count = 2)

# 2) 过滤低表达：常用阈值是「在半数以上样本中 CPM > 1」
keep <- rowSums(cpm_mat > 1) >= (0.5 * ncol(cpm_mat))
cnts_f <- cnts[keep, , drop = FALSE]

# 3) FPKM：需要基因长度，DESeq2 的 fpkm 会自动用 mcols 里的 basepairs
se <- SummarizedExperiment::SummarizedExperiment(
  assays = list(counts = cnts_f),
  colData = data.frame(row.names = colnames(cnts_f)))
GenomicRanges::mcols(se)$basepairs <- gene_len[rownames(cnts_f)]   # 见下一步
fpkm_mat <- DESeq2::fpkm(DESeqDataSet(se, design = ~ 1), robust = TRUE)

# 4) 自己算 TPM：核心是「先除长度，再按列归一到一百万」
counts_to_tpm <- function(counts, len_bp) {
  stopifnot(identical(rownames(counts), names(len_bp)))
  rate <- counts / (len_bp / 1000)                 # 每 kb 的 reads 数
  tpm  <- sweep(rate, 2, colSums(rate), "/") * 1e6 # 归一化到百万
  return(tpm)
}

# 5) 从 GTF 提取非冗余外显子长度作为有效长度（比转录本跨度更准）
txdb  <- GenomicFeatures::makeTxDbFromGFF("data/raw/gencode.v39.annotation.gtf.gz",
                                          format = "gtf")
exons <- GenomicFeatures::exonsBy(txdb, by = "gene")
gene_len <- purrr::map_dbl(GenomicRanges::reduce(exons),
                           ~ sum(GenomicRanges::width(.x)))
names(gene_len) <- sub("\\\\.[0-9]+$", "", names(gene_len))
tpm_mat <- counts_to_tpm(cnts_f, gene_len[rownames(cnts_f)])

saveRDS(list(cpm = logcpm, fpkm = fpkm_mat, tpm = log2(tpm_mat + 1)),
        "data/processed/normalized_matrices.rds")`,
    notes: [
      "CPM 只校正深度，TPM 同时校正基因长度，FPKM/RPKM 先校深度后校长度；TPM 的每列总和恒为一百万，跨样本可比性最好。",
      "GTF 里的 gene_id 通常带版本号，而表达矩阵可能不带，匹配前必须统一 strip 掉小数点后缀。",
      "「非冗余外显子长度」要用 reduce 合并重叠外显子后再求和，否则同一外显子会被重复计算。"
    ],
    pitfalls: [
      "edgeR::cpm 的 log = TRUE 默认 prior.count = 0.25，做热图建议改成 prior.count = 2 让低表达基因不至于爆出极端值。",
      "自己算 TPM 时 len_bp 必须与矩阵行名顺序完全一致，否则结果全错却不报错。",
      "不同 GTF 版本（GENCODE vs Ensembl）的 gene_id 前缀可能不同，混用会导致大半基因匹配失败。"
    ],
    next: ["bulk-04", "bulk-05", "bulk-06"]
  },
  {
    id: "bulk-04",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "基因 ID 转换与跨物种同源映射",
    level: "基础",
    tags: ["ID转换","clusterProfiler","AnnotationDbi","同源基因"],
    packages: ["clusterProfiler","org.Hs.eg.db","AnnotationDbi","dplyr"],
    scene: "矩阵行名是 Ensembl ID，而富集分析或 WB 验证需要 symbol / Entrez ID，甚至要把人的基因映射到小鼠做动物实验验证。",
    code: `library(clusterProfiler)
library(org.Hs.eg.db)
library(AnnotationDbi)
library(dplyr)

mat  <- readRDS("data/processed/TCGA_LIHC_paired_counts.rds")
genes <- sub("\\\\.[0-9]+$", "", rownames(mat))

# 1) bitr：适合把一个基因向量同时转成多种 ID，自动丢掉无法映射的
eg <- clusterProfiler::bitr(genes,
                            fromType = "ENSEMBL",
                            toType   = c("SYMBOL", "ENTREZID"),
                            OrgDb    = org.Hs.eg.db)
dim(eg)
# multiSummary = TRUE 可查看一对多的具体情况
# bitr(genes, "ENSEMBL", "SYMBOL", org.Hs.eg.db, multiSummary = TRUE)

# 2) mapIds：适合直接给矩阵改行名，multiVals 控制一对多怎么处理
sym <- AnnotationDbi::mapIds(org.Hs.eg.db,
                             keys      = genes,
                             column    = "SYMBOL",
                             keytype   = "ENSEMBL",
                             multiVals = "first")

# 3) 替换行名并去重，重复 symbol 取表达均值
mat_sym <- mat
rownames(mat_sym) <- ifelse(is.na(sym), genes, sym)
mat_sym <- rowsum(mat_sym, rownames(mat_sym), reorder = FALSE) /
  as.integer(table(rownames(mat_sym)))
sum(duplicated(rownames(mat_sym)))   # 应等于 0

# 4) 反查：从 symbol 拿 GO / pathway 注释，这就是富集分析的底层数据
go_df <- AnnotationDbi::select(org.Hs.eg.db,
                               keys    = head(eg$ENTREZID, 200),
                               columns = c("SYMBOL", "GO", "ONTOLOGY"),
                               keytype = "ENTREZID") |>
  dplyr::filter(ONTOLOGY == "BP")

# 5) 人 -> 小鼠同源基因（需要联网查 MGI，离线可用 homologene 包替代）
# mm <- biomaRt::getBM(attributes = c("external_gene_name"),
#                      filters = "external_gene_name",
#                      values = eg$SYMBOL, mart = human_mart)
# 若已装 homologene 包，可用 homologene::convert_homologene(genes, inTax = 9606, outTax = 10090)

saveRDS(mat_sym, "data/processed/expr_symbol.rds")`,
    notes: [
      "bitr 处理的是向量，会直接丢弃无法映射的 ID；mapIds 会保留全部索引并返回 NA，二者适用场景不同。",
      "rowsum 加除法是最快的「重复行名取均值」写法，比 group_by + summarise 快很多，大矩阵上差别明显。",
      "Entrez ID 做富集分析命中率通常高于 symbol，因为注释库本身以 Entrez 为锚点。"
    ],
    pitfalls: [
      "bitr 遇到一对多映射时会静默保留多行，导致后面基因数变多，用 multiSummary = TRUE 检查一下。",
      "convert_homologene 依赖网络且一次只能查一个方向，结果要抽样人工核对几个关键基因。",
      "Ensembl ID 不带版本号时 mapIds 反而匹配率更高，务必先统一 strip 版本。"
    ],
    next: ["bulk-08", "bulk-09", "viz-03"]
  },
  {
    id: "bulk-05",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "DESeq2 差异表达分析完整流程",
    level: "进阶",
    tags: ["DESeq2","差异分析","配对设计","lfcShrink"],
    packages: ["DESeq2","apeglm","dplyr","tibble","readr"],
    scene: "有 TCGA 或自测的 counts 矩阵与分组信息（含配对设计），要跑标准的负二项差异分析并导出可投稿的差异基因表。",
    code: `library(DESeq2)
library(apeglm)
library(dplyr)
cnts <- readRDS("data/processed/TCGA_LIHC_paired_counts.rds")
meta <- readRDS("data/processed/TCGA_LIHC_paired_meta.rds")
# 1) 构造 colData，样本顺序必须与 counts 列顺序严格一致
coldata <- meta |>
  dplyr::mutate(sample_type = factor(sample_type)) |>
  tibble::column_to_rownames("barcode")
coldata <- coldata[colnames(cnts), , drop = FALSE]
stopifnot(identical(rownames(coldata), colnames(cnts)))
# 2) 设置对照组为参考水平，这步决定 log2FC 的正负方向
coldata$sample_type <- relevel(coldata$sample_type, ref = "Solid Tissue Normal")
# 3) 建对象：配对设计把 patient 加进 design 以吸收个体差异
dds <- DESeq2::DESeqDataSetFromMatrix(
  countData = round(as.matrix(cnts)),
  colData   = coldata,
  design    = ~ patient + sample_type
)
# 4) 过滤低表达基因，能显著加快运行并减轻多重检验负担
keep <- rowSums(DESeq2::counts(dds) >= 10) >= 5
dds  <- dds[keep, , drop = FALSE]
# 5) 核心一步：估计离散度并做 Wald 检验
dds <- DESeq2::DESeq(dds)
DESeq2::resultsNames(dds)          # 想要哪一列对比，从这里抄名字
# 6) 提取结果并做收缩，apeglm 对低计数基因更稳健
res_raw <- DESeq2::results(dds, name = "sample_type_Primary_Tumor_vs_Solid_Tissue_Normal")
res <- DESeq2::lfcShrink(dds, coef = "sample_type_Primary_Tumor_vs_Solid_Tissue_Normal",
                         res = res_raw, type = "apeglm")
# 7) 转成整洁数据框并标注上下调
deg <- res |>
  as.data.frame() |>
  tibble::rownames_to_column("gene") |>
  dplyr::mutate(threshold = dplyr::case_when(
    padj < 0.05 & log2FoldChange >=  1 ~ "Up",
    padj < 0.05 & log2FoldChange <= -1 ~ "Down",
    TRUE ~ "NS")) |>
  dplyr::arrange(padj)
summary(res)
DESeq2::plotMA(res, ylim = c(-6, 6))
saveRDS(deg, "data/processed/deg_deseq2.rds")
readr::write_csv(deg, "results/tables/TableS2_DEG_DESeq2.csv")`,
    notes: [
      "design = ~ patient + sample_type 是配对分析的标准写法，patient 作为 blocking factor 会吸收患者基线差异。",
      "lfcShrink 只用于展示和排序，不应用来判断显著性；显著性仍看未收缩结果的 padj。",
      "raw p 值用 pvalue，校正后的用 padj；写论文时报告的是 padj，而不是 pvalue。",
      "log2FoldChange 是 log2 倍数，转换成 Fold Change 是 2^log2FoldChange，不是直接乘以某个系数。"
    ],
    pitfalls: [
      "忘记 relevel 会得到符号相反的 log2FC，上下调全反是方向上最常见的低级错误。",
      "round() 一下 counts：GDC 的 STAR counts 偶尔带小数，DESeq2 会直接报错。",
      "结果表里 padj 列可能存在 NA，那是被 independent filtering 过滤掉的基因，说明该基因计数太低无法评判。"
    ],
    next: ["bulk-06", "viz-02", "bulk-08"]
  },
  {
    id: "bulk-06",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "limma 差异分析（芯片与 voom 双方案）",
    level: "进阶",
    tags: ["limma","voom","eBayes","makeContrasts"],
    packages: ["limma","edgeR","dplyr","readr"],
    scene: "数据是芯片或对数值矩阵（不适合负二项模型），或者审稿人要求用 limma-voom 交叉验证 DESeq2 的结果。",
    code: `library(limma)
library(edgeR)
library(dplyr)
expr <- readRDS("data/processed/GEO_expr_symbol.rds")
grp  <- readRDS("data/processed/GEO_group.rds")
# ---------- 方案一：芯片 / 已取对数的矩阵 ----------
# 1) 样本对齐，顺序错了后面全是无声的错误
common <- intersect(colnames(expr), grp$gsm)
expr <- expr[, common, drop = FALSE]
grp  <- grp[match(common, grp$gsm), ]
grp$group <- factor(grp$group, levels = c("Normal", "Tumor"))
# 2) 无截距设计矩阵：每个组一个系数，方便后面任意两两比较
design <- model.matrix(~ 0 + group, data = grp)
colnames(design) <- c("Normal", "Tumor")

# 3) 线性拟合 + 对比 + 经验贝叶斯收缩方差
fit  <- limma::lmFit(expr, design)
contr <- limma::makeContrasts(Tumor - Normal, levels = design)
fit2 <- limma::contrasts.fit(fit, contr) |>
  limma::eBayes()
deg_chip <- limma::topTable(fit2, coef = 1, number = Inf,
                            adjust.method = "BH") |>
  tibble::rownames_to_column("gene")
# ---------- 方案二：RNA-seq counts 走 voom ----------
cnts <- readRDS("data/processed/TCGA_LIHC_paired_counts.rds")
dge  <- edgeR::DGEList(counts = cnts)
keep <- edgeR::filterByExpr(dge, group = grp$group)
dge  <- dge[keep, , keep.lib.sizes = FALSE]
design_v <- model.matrix(~ 0 + group, data = grp)
colnames(design_v) <- c("Normal", "Tumor")
# voom 会估计 log-CPM 的均值-方差关系并给出权重
v <- limma::voom(dge, design_v, plot = TRUE)
fitv <- limma::lmFit(v, design_v) |>
  limma::contrasts.fit(limma::makeContrasts(Tumor - Normal, levels = design_v)) |>
  limma::eBayes()
deg_voom <- limma::topTable(fitv, coef = 1, number = Inf) |>
  tibble::rownames_to_column("gene")
# 交叉验证：两套方法的一致性是审稿人爱看的证据
common_g <- intersect(deg_chip$gene, deg_voom$gene)
cor.test(deg_chip$logFC[match(common_g, deg_chip$gene)],
         deg_voom$logFC[match(common_g, deg_voom$gene)],
         method = "spearman")`,
    notes: [
      "~ 0 + group 的无截距设计让每个组都有独立系数，后续换 contrast 不需要重跑 lmFit。",
      "eBayes 借全基因信息收缩单个基因的方差，这是 limma 在小样本下依然稳健的原因。",
      "voom 的 plot = TRUE 会画出均值-方差趋势图，曲线形状本身就是一个 QC 信号：剧烈锯齿说明数据有问题。"
    ],
    pitfalls: [
      "topTable 默认 sort.by = B，导出时如果用 number = Inf 且没注意行序，容易漏掉最显著的基因。",
      "voom 要求输入是原始 counts，喂已经 log 过的数据会得到完全错误的结果。",
      "makeContrasts 的名字要和 design 的列完全一致，拼错会报 levels 不匹配的错。"
    ],
    next: ["bulk-05", "bulk-07", "viz-02"]
  },
  {
    id: "bulk-07",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "差异结果三件套：火山图、热图与 PCA",
    level: "基础",
    tags: ["火山图","热图","PCA","pheatmap","ggrepel"],
    packages: ["ggplot2","ggrepel","pheatmap","RColorBrewer","dplyr"],
    scene: "差异分析跑完了，需要快速产出三张用于初稿的图：火山图看整体分布、热图看样本是否被分组驱动、PCA 看有没有离群样本。",
    code: `library(ggplot2)
library(ggrepel)
library(pheatmap)
library(RColorBrewer)
library(dplyr)

deg  <- readRDS("data/processed/deg_deseq2.rds")
expr <- readRDS("data/processed/normalized_matrices.rds")$tpm
meta <- readRDS("data/processed/TCGA_LIHC_paired_meta.rds")

# 1) 火山图：先去掉 padj 为 NA 的行，否则标签会出现在无穷远处
deg_p <- deg |> dplyr::filter(!is.na(padj), !is.na(log2FoldChange))
deg_p$label <- ifelse(deg_p$gene %in% c("TP53", "BAX", "CDKN1A", "GADD45A"),
                      deg_p$gene, NA)
p1 <- ggplot(deg_p, aes(log2FoldChange, -log10(padj), colour = threshold)) +
  geom_point(size = 1.2, alpha = .75) +
  scale_colour_manual(values = c(Up = "#d73027", Down = "#4575b4", NS = "#d9d9d9")) +
  geom_vline(xintercept = c(-1, 1), linetype = "dashed", colour = "grey50") +
  geom_hline(yintercept = -log10(0.05), linetype = "dashed", colour = "grey50") +
  geom_text_repel(aes(label = label), na.rm = TRUE, max.overlaps = 30, size = 3) +
  theme_classic(base_size = 12) +
  labs(x = "log2 fold change", y = "-log10 adjusted P")
ggsave("results/figures/Fig1_volcano.pdf", p1, width = 5, height = 4.5)

# 2) 热图：取最显著的 50 个基因，按行做 z-score
top50 <- deg_p |>
  dplyr::filter(threshold != "NS") |>
  dplyr::slice_min(order_by = padj, n = 50, with_ties = FALSE)
mat_h <- expr[intersect(rownames(expr), top50$gene), , drop = FALSE]
anno  <- data.frame(Type = meta$sample_type[
  match(colnames(mat_h), meta$patient)])
rownames(anno) <- colnames(mat_h)

pheatmap::pheatmap(mat_h, scale = "row", annotation_col = anno,
                   show_colnames = FALSE, treeheight_row = 0,
                   color = colorRampPalette(rev(brewer.pal(9, "RdBu")))(100),
                   filename = "results/figures/Fig1_heatmap.pdf",
                   width = 6, height = 5)
# 3) PCA：检查批次和离群样本的最佳方式
pca <- prcomp(t(expr), center = TRUE, scale. = FALSE)
pcs <- data.frame(pca$x[, 1:2], Type = anno$Type[match(rownames(pca$x), rownames(anno))])
p2 <- ggplot(pcs, aes(PC1, PC2, colour = Type)) +
  geom_point(size = 2.5) + stat_ellipse(level = 0.9, linewidth = 0.5) +
  theme_classic(base_size = 12)
ggsave("results/figures/Fig1_pca.pdf", p2, width = 4.5, height = 4)`,
    notes: [
      "火山图的阈值线要画出来，否则读者无法判断你的 cutoff 到底卡在哪里。",
      "热图里 scale = row 是必须的，否则 TPM 量级差异会把上下调完全淹没。",
      "PCA 不看 pc1/pc2 的绝对值大小，看的是样本是否按生物学分组聚拢；如果按测序批次分开，说明有批次效应需要处理。"
    ],
    pitfalls: [
      "-log10(0) 会得到 Inf，padj 为 0 或被过滤的 NA 必须先处理。",
      "pheatmap 的 annotation_col 行名必须和矩阵列名完全一致，否则报 rownames not found。",
      "prcomp(t(expr)) 是对样本做 PCA，别忘了转置，否则会得到「基因的主成分」这种毫无意义的图。"
    ],
    next: ["viz-01", "viz-02", "bulk-08"]
  },
  {
    id: "bulk-08",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "GO/KEGG 富集分析与 GSEA",
    level: "进阶",
    tags: ["clusterProfiler","ORA","GSEA","enrichplot","GSVA"],
    packages: ["clusterProfiler","org.Hs.eg.db","enrichplot","dplyr","readr"],
    scene: "拿到几百个差异基因，想知道它们集中在哪些通路上，并且需要 GSEA 这种不依赖硬阈值的侧证。",
    code: `library(clusterProfiler)
library(org.Hs.eg.db)
library(enrichplot)
library(GSVA)
library(dplyr)
deg <- readRDS("data/processed/deg_deseq2.rds")
# 1) 先把 symbol 转成 Entrez ID，富集分析以 Entrez 为锚点命中率最高
id_map <- clusterProfiler::bitr(deg$gene, fromType = "SYMBOL",
                                toType = "ENTREZID", OrgDb = org.Hs.eg.db)
deg <- deg |> dplyr::inner_join(id_map, by = c(gene = "SYMBOL"))
# 2) ORA 超几何检验：先看 GO 的生物过程分支
ego <- clusterProfiler::enrichGO(gene         = unique(deg$ENTREZID),
                                 universe     = unique(deg$ENTREZID),
                                 OrgDb        = org.Hs.eg.db,
                                 ont          = "BP",
                                 pAdjustMethod = "BH",
                                 qvalueCutoff = 0.05,
                                 readable     = TRUE)
# 3) KEGG 通路（需要联网，新版本会拉 KEGG 最新注释）
ekegg <- clusterProfiler::enrichKEGG(gene = unique(deg$ENTREZID),
                                     organism = "hsa",
                                     pvalueCutoff = 0.05)
# 4) simplify 去掉重复 GO terms，让条形图不至于全是同义词
ego2 <- clusterProfiler::simplify(ego, cutoff = 0.7, by = "p.adjust",
                                  select_fun = min)
# 5) GSEA：不设阈值，用全部基因按 log2FC 排序做检验
glist <- deg$log2FoldChange
names(glist) <- deg$ENTREZID
glist <- sort(glist[!duplicated(names(glist))], decreasing = TRUE)
gsea_res <- clusterProfiler::gseGO(geneList = glist, OrgDb = org.Hs.eg.db,
                                   ont = "BP", minGSSize = 10, maxGSSize = 500,
                                   pvalueCutoff = 0.05, verbose = FALSE)
# KEGG 版：clusterProfiler::gseKEGG(glist, organism = "hsa")

# 6) 出图：气泡图、网络图、GSEA 山脊图
p_dot <- enrichplot::dotplot(ego2, showCategory = 15) + ggplot2::theme_classic()
p_net <- enrichplot::cnetplot(ego2, categorySize = "pvalue", foldChange = glist)
p_rid <- enrichplot::ridgeplot(gsea_res, showCategory = 15)
ggplot2::ggsave("results/figures/Fig2_GO_dotplot.pdf", p_dot, width = 6, height = 5)

# 7) 导出富集结果表， Suppl 表格与下游作图都从这里取数
readr::write_csv(as.data.frame(ego2), "results/tables/TableS3_GO_BP.csv")
readr::write_csv(as.data.frame(gsea_res), "results/tables/TableS3b_GSEA_GO.csv")`,
    notes: [
      "ORA 只检验你筛出来的那批基因，GSEA 用的是全排序基因列表，二者互为补充，投稿时一起给出更有说服力。",
      "readable = TRUE 会把 Entrez ID 换回 symbol 显示，非常推荐，省掉再做一次转换。",
      "GSVA 能把「基因 x 样本」矩阵换成「通路 x 样本」矩阵，做法见 bulk-10 的 ssgseaParam 那段。"
    ],
    pitfalls: [
      "universe 应该设为你检测到的全部基因（背景），不设默认为基因组全部基因，会高估显著性。",
      "enrichKEGG 需要联网且 KEGG 偶有维护，跑不通时可用 msigdbr 的 C2/CP 集合做离线替代。",
      "GSVA 新版改成 gsvaParam 传参，老教程里的 gsva(expr = , gset.idx.list = ) 会告警，但结果一致。"
    ],
    next: ["bulk-09", "viz-03", "tox-02"]
  },
  {
    id: "bulk-09",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "WGCNA 加权共表达网络与模块-性状关联",
    level: "高级",
    tags: ["WGCNA","共表达","软阈值","hub基因"],
    packages: ["WGCNA","dplyr","ggplot2"],
    scene: "想在没有任何先验假设的情况下从表达矩阵里挖出共表达模块，并把模块与临床性状（分期、评分、暴露剂量等）关联起来找到关键模块。",
    code: `library(WGCNA)
library(dplyr)

logmat <- readRDS("data/processed/normalized_matrices.rds")$tpm
traits <- readRDS("data/processed/TCGA_LIHC_paired_meta.rds")

# 1) 基因太多时的常用取舍：按表达变异度取 top 5000，兼顾算力与信息量
mads <- apply(logmat, 1, mad)
datExpr <- t(logmat[names(sort(mads, decreasing = TRUE)[1:5000]), ])
# WGCNA 要求行是样本、列是基因，且与 traits 行顺序一致
common <- intersect(rownames(datExpr), traits$patient)
datExpr <- datExpr[common, ]
traits  <- traits[match(common, traits$patient), ]

# 2) 检查是否有离群样本，这一步往往救命
tree <- stats::hclust(stats::dist(datExpr), method = "average")
plot(tree, main = "Sample clustering to detect outliers")
# abline(h = 60000, col = "red")   # 若有明显离群枝，用 cutHeight 去掉
# 3) 选择软阈值：目标是让网络接近无标度，fit 到 0.85 左右的最小 power
powers <- c(1:20, seq(22, 30, by = 2))
sft <- WGCNA::pickSoftThreshold(datExpr, powerVector = powers,
                                networkType = "unsigned", verbose = 5)
softPower <- sft$powerEstimate
if (is.na(softPower)) softPower <- 6   # 拟合不好时常备这个经验值
# 4) 一步法建模块，maxBlockSize 大于 5000 基因时需要分块
net <- WGCNA::blockwiseModules(datExpr, power = softPower,
                               networkType = "unsigned",
                               TOMType = "unsigned",
                               minModuleSize = 30,
                               reassignThreshold = 0,
                               mergeCutHeight = 0.25,
                               numericLabels = TRUE,
                               pamRespectsDendro = FALSE,
                               saveTOMs = TRUE,
                               verbose = 3)
moduleColors <- WGCNA::labels2colors(net$colors)
plotDendroAndColors(net$dendrograms[[1]], moduleColors[net$blockGenes[[1]]],
                    "Module colors", dendroLabels = FALSE, hang = 0.03)
# 5) 模块与性状的相关矩阵，找和你关心的表型最相关的那几个模块
MEs <- net$MEs
trait_num <- traits |> dplyr::select(where(is.numeric)) |> as.data.frame()
rownames(trait_num) <- traits$patient
moduleTraitCor  <- WGCNA::cor(MEs, trait_num, use = "p")
moduleTraitPval <- WGCNA::corPvalueStudent(moduleTraitCor, nrow(datExpr))
write.csv(round(moduleTraitCor, 3), "results/tables/WGCNA_module_trait_cor.csv")`,
    notes: [
      "软阈值的选择标准是把网络变成近似无标度拓扑（scale-free topology），pickSoftThreshold 会同时给出诊断图。",
      "datExpr 必须是「样本 x 基因」，方向和常规表达矩阵相反，这是新手最常犯的方向错误。",
      "mergeCutHeight = 0.25 是官方推荐的合并阈值，调大会让模块变少变粗，调小会让模块碎成一地。"
    ],
    pitfalls: [
      "样本数少于 15 时 WGCNA 结果非常不稳，审稿人通常会质疑；样本太少建议改走 GSVA 或相关性网络。",
      "blockwiseModules 很吃内存，5000 基因 x 500 样本大约需要数 GB，跑之前先关掉其他大对象。",
      "traits 里如果有字符列要先筛掉，cor 遇到非数值会直接崩溃。"
    ],
    next: ["bulk-08", "bulk-10", "viz-03"]
  },
  {
    id: "bulk-10",
    track: "bulk",
    trackName: "Bulk RNA-seq",
    title: "肿瘤免疫微环境评估：ssGSEA / ESTIMATE / CIBERSORT",
    level: "进阶",
    tags: ["免疫浸润","ssGSEA","CIBERSORT","ESTIMATE","GSVA"],
    packages: ["GSVA","estimate","dplyr","readr"],
    scene: "想说明某个基因或通路与免疫浸润程度有关，需要给每个样本打出免疫细胞丰度和基质/免疫评分。",
    code: `library(GSVA)
library(dplyr)
expr <- readRDS("data/processed/normalized_matrices.rds")$tpm   # 已 log2(TPM+1)
meta <- readRDS("data/processed/TCGA_LIHC_paired_meta.rds")
# ---------- 方案一：ssGSEA（最常用，无需外部文件） ----------
# 免疫细胞 marker 集合，可按需补充；这是最简版手写集合
immune_sets <- list(
  Tcell      = c("CD3D", "CD3E", "CD2", "IL7R", "LCK", "TRBC2"),
  CD8_T      = c("CD8A", "CD8B", "GZMK", "GZMA", "CCL5"),
  NK         = c("NKG7", "GNLY", "KLRD1", "PRF1", "GZMB"),
  Bcell      = c("MS4A1", "CD79A", "CD79B", "IGHM"),
  Macrophage = c("CD68", "CD163", "CSF1R", "AIF1", "TYROBP"),
  Neutrophil = c("FCGR3B", "CSF3R", "S100A12", "MNDA"),
  Endothelial = c("PECAM1", "VWF", "CDH5", "KDR")
)
immune_sets <- lapply(immune_sets, function(g) intersect(g, rownames(expr)))
ssgsea_param <- GSVA::ssgseaParam(expr = expr, geneSets = immune_sets,
                                  minSize = 3, normalize = TRUE)
ssgsea_score <- GSVA::gsva(ssgsea_param)
# ---------- 方案二：ESTIMATE（需单独安装 estimate 包） ----------
# estimate::filterCommonGenes(input.ds = expr, output.ds = "estimate_input.gct", id = "GeneSymbol")
# estimate::estimateScore(input.ds = "estimate_input.gct",
#                         output.ds = "estimate_score.gct",
#                         platform = "illumina")
# ---------- 方案三：CIBERSORT（需到官网注册获取 LM22.txt 与 CIBERSORT.R） ----------
# source("data/tools/CIBERSORT.R")
# tpm_out <- data.frame(Gene = rownames(expr), expr, check.names = TRUE)
# write.table(tpm_out, "data/processed/mixture_tpm.txt", sep = "\\t", row.names = FALSE)
# cs <- CIBERSORT("data/tools/LM22.txt", "data/processed/mixture_tpm.txt",
#                 perm = 1000, QN = TRUE)
# 按分组比较免疫浸润差异（Wilcoxon 秩和检验）
anno <- data.frame(Type = meta$sample_type[match(colnames(ssgsea_score), meta$patient)])
colnames(ssgsea_score) <- gsub("Primary Tumor", "Tumor", anno$Type)
cmp <- apply(ssgsea_score, 1, function(x) {
  wilcox.test(x[colnames(ssgsea_score) == "Tumor"],
              x[colnames(ssgsea_score) == "Solid Tissue Normal"],
              paired = FALSE)$p.value
})
res <- data.frame(cell = rownames(ssgsea_score), p = cmp) |>
  dplyr::mutate(padj = p.adjust(p, "BH"))
saveRDS(ssgsea_score, "data/processed/ssgsea_immune.rds")
readr::write_csv(res, "results/tables/TableS4_immune_infiltration.csv")`,
    notes: [
      "三种方法口径不同：CIBERSORT 给的是绝对比例（同一样本内各类细胞加和为一），ssGSEA 给的是相对活性分（只能横向比较同一类细胞），ESTIMATE 给的是间质/免疫/肿瘤纯度三分。",
      "ssGSEA 用 original signature 时需要输入 TPM/RPKM 而不是 raw counts，否则 kernel density 估计会失真。",
      "lm22 / ESTIMATE 这类外部依赖文件不能公开发布，写投稿材料时要注明获取方式。"
    ],
    pitfalls: [
      "GSVA 新版用 ssgseaParam 传参，legacy 的 gsva(method = 'ssgsea') 仍能跑但会告警。",
      "基因名大小写必须和表达矩阵一致，全部大写是通用做法，混用会静默降低打分。",
      "CIBERSORT 的输出 p 值是整体的解卷积显著性，不是每个细胞的 p 值，别误用在图上。"
    ],
    next: ["bulk-08", "viz-03", "scrna-07"]
  },
  {
    id: "scrna-01",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "10x Genomics 数据读入与 Seurat 对象构建",
    level: "基础",
    tags: ["Seurat","Read10X","多样本","merge"],
    packages: ["Seurat","dplyr"],
    scene: "手里有 Cell Ranger 跑完的 filtered_feature_bc_matrix 文件夹（一个或多个样本），要建成 Seurat 对象开始分析。",
    code: `library(Seurat)
library(dplyr)

# ---------- 单样本读入 ----------
# Read10X 自动识别 barcodes.tsv.gz / features.tsv.gz / matrix.mtx.gz
counts <- Seurat::Read10X(data.dir = "data/raw/sample_L1/filtered_feature_bc_matrix/")
# 多组学样本（GEX + ADT + HTO）会返回列表，只取基因表达那一项
if (is.list(counts)) counts <- counts[["Gene Expression"]]

obj1 <- Seurat::CreateSeuratObject(counts = counts,
                                   project  = "demo",
                                   min.cells = 3,        # 至少在 3 个细胞里表达
                                   min.features = 200)   # 至少检出 200 个基因
obj1@meta.data[1:5, ]

# ---------- 多样本批量读入并合并 ----------
sample_vec <- c(Ctrl = "data/raw/ctrl/filtered_feature_bc_matrix/",
                IRR  = "data/raw/irr/filtered_feature_bc_matrix/")

obj_list <- lapply(names(sample_vec), function(nm) {
  ct  <- Seurat::Read10X(data.dir = sample_vec[[nm]])
  if (is.list(ct)) ct <- ct[["Gene Expression"]]
  obj <- Seurat::CreateSeuratObject(ct, project = nm,
                                    min.cells = 3, min.features = 200)
  obj$condition <- nm                                  # 分组信息写进 metadata
  obj$barcode_orig <- colnames(obj)                    # 保留原始 barcode 备用
  return(obj)
})
names(obj_list) <- names(sample_vec)

# merge 时给细胞加前缀，避免不同样本的 barcode 撞名
merged <- merge(x = obj_list[[1]], y = obj_list[-1],
                add.cell.ids = names(sample_vec))

# 基本体检：细胞数、基因数、各样本细胞占比
dim(merged)
table(merged$condition)
merged@meta.data |>
  dplyr::count(orig.ident, condition, name = "n_cell")

saveRDS(merged, "data/processed/seurat_raw.rds")`,
    notes: [
      "min.features = 200 过滤掉的是空液滴或濒死细胞，min.cells 过滤掉的是几乎没人表达的基因，二者缺一不可。",
      "add.cell.ids 一定要加，否则合并后不同样本的同名 barcode 会发生覆盖事故。",
      "metadata 里 orig.ident 默认等于 project，merge 之后不再更新，分组信息建议自己另建一列。"
    ],
    pitfalls: [
      "Read10X 的目录必须指向 filtered_feature_bc_matrix 这一层，指到上层会报文件找不到。",
      "10x 不同版本的文件后缀不同（v2 是 genes.tsv，v3 是 features.tsv.gz），不要手动解压更不要手动改名。",
      "merge 后 starvation 语境下，counts slot 仍保留整数计数，千万不要先 NormalizeData 再 merge。"
    ],
    next: ["scrna-02", "scrna-03"]
  },
  {
    id: "scrna-02",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "质控过滤与双细胞去除（DoubletFinder）",
    level: "基础",
    tags: ["QC","线粒体","双细胞","DoubletFinder"],
    packages: ["Seurat","DoubletFinder","dplyr"],
    scene: "刚拿到原始对象，需要按 nFeature / 线粒体比例剔除低质量细胞和死细胞，再剔除 PCR 造成的双细胞（doublet）。",
    code: `library(Seurat)
library(DoubletFinder)
# 1) 计算 QC 指标：人和小鼠的线粒体基因前缀不同（MT- / mt-）
seu <- readRDS("data/processed/seurat_raw.rds")
seu[["percent.mt"]]   <- Seurat::PercentageFeatureSet(seu, pattern = "^MT-")
seu[["percent.ribo"]] <- Seurat::PercentageFeatureSet(seu, pattern = "^RP[SL]")
# 2) 先看分布再定阈值，任何人给的固定数字都不如自己数据集的一张图
p1 <- Seurat::VlnPlot(seu, features = c("nFeature_RNA", "nCount_RNA", "percent.mt"),
                      ncol = 3, pt.size = 0.1)
p1
# 3) 自适应阈值：中位数加 3 倍中位绝对偏差，对不同批次更稳健
mad_cut <- function(x, nmads = 3) stats::median(x) + nmads * stats::mad(x)
mt_cut  <- mad_cut(seu$percent.mt)
nf_cut  <- mad_cut(seu$nFeature_RNA)
cat("线粒体阈值:", round(mt_cut, 2), "| 基因数上限:", round(nf_cut, 0), "\\n")
seu_f <- subset(seu, subset = nFeature_RNA > 200 &
                  nFeature_RNA < nf_cut &
                  nCount_RNA   > 500 &
                  percent.mt   < mt_cut)
# 4) DoubletFinder 要求对象已完成标准化降维，所以先走一遍标准流程
seu_f <- seu_f |>
  Seurat::NormalizeData(verbose = FALSE) |>
  Seurat::FindVariableFeatures(verbose = FALSE) |>
  Seurat::ScaleData(verbose = FALSE) |>
  Seurat::RunPCA(verbose = FALSE) |>
  Seurat::RunUMAP(dims = 1:20, verbose = FALSE) |>
  Seurat::FindNeighbors(dims = 1:20, verbose = FALSE) |>
  Seurat::FindClusters(resolution = 0.5, verbose = FALSE)
# 5) 扫描参数寻找最优 pK，再估计期望双细胞数
sweep_res <- DoubletFinder::paramSweep_v3(seu_f, PCs = 1:20, sct = FALSE)
sweep_sum <- DoubletFinder::summarizeSweep(sweep_res, GT = FALSE)
bcmvn     <- DoubletFinder::find.pK(sweep_sum)
pK_best   <- as.numeric(as.character(bcmvn$pK[which.max(bcmvn$BCmetric)]))
nExp_poi  <- round(0.008 * ncol(seu_f))            # 10x 约每 1000 细胞含 8 个
# 6) 正式打双细胞标签，DF.classifications_... 是新增的 metadata 列
seu_f <- DoubletFinder::doubletFinder_v3(seu_f, PCs = 1:20, pN = 0.25,
                                         pK = pK_best, nExp = nExp_poi,
                                         reuse.pANN = FALSE, sct = FALSE)
df_col <- grep("^DF.classifications", colnames(seu_f@meta.data), value = TRUE)[1]
table(seu_f@meta.data[[df_col]])
keep_cells <- colnames(seu_f)[seu_f@meta.data[[df_col]] == "Singlet"]
seu_clean  <- subset(seu_f, cells = keep_cells)
saveRDS(seu_clean, "data/processed/seurat_qc.rds")`,
    notes: [
      "percent.mt 高通常代表细胞破裂、胞质 mRNA 流失；percent.ribo 高代表翻译活跃的细胞群，不一定是坏数据，别一刀切。",
      "MAD 自适应阈值比固定阈值（如 mt < 10%）更适合不同组织，写方法学时也更经得起追问。",
      "期望双细胞率随上样量上升，10x 官方的经验值大约是每 1000 个细胞产生 0.8% 双联体，具体要跟着上样回收率调整。"
    ],
    pitfalls: [
      "RunPCA 之前必须先 NormalizeData + FindVariableFeatures + ScaleData，跳过任何一步 DoubletFinder 都会报错。",
      "find.pK 报错时多半是找不到极值，把 paramSweep_v3 的 PCs 减小或调整 sweep 参数再试。",
      "grep 出来的 DF.classifications 列名带随机后缀，每次运行都不同，不要写死列名。"
    ],
    next: ["scrna-03", "scrna-04"]
  },
  {
    id: "scrna-03",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "Seurat v5 标准流程：归一化→HVG→PCA→UMAP→聚类",
    level: "基础",
    tags: ["Seurat","NormalizeData","FindVariableFeatures","UMAP","聚类"],
    packages: ["Seurat","dplyr","patchwork"],
    scene: "QC 之后拿到了干净细胞，要按 Seurat 标准流程完成降维聚类，并选出合适的分辨率。",
    code: `library(Seurat)
library(dplyr)
library(patchwork)

seu <- readRDS("data/processed/seurat_qc.rds")

# 1) 归一化：每个细胞除以总计数再乘 10000，最后取自然对数
seu <- Seurat::NormalizeData(seu, normalization.method = "LogNormalize",
                             scale.factor = 1e4, verbose = FALSE)

# 2) 找高变基因：这些基因承载了绝大部分细胞异质性信息
seu <- Seurat::FindVariableFeatures(seu, selection.method = "vst",
                                    nfeatures = 2000, verbose = FALSE)
top10 <- head(Seurat::VariableFeatures(seu), 10)
Seurat::VariableFeaturePlot(seu) + Seurat::LabelPoints(points = top10, repel = TRUE)

# 3) 标准化并回归掉不想要的技术变异（线粒体比例、细胞周期）
seu <- Seurat::ScaleData(seu,
                         features = Seurat::VariableFeatures(seu),
                         vars.to.regress = "percent.mt", verbose = FALSE)

# 4) PCA 降维，ElbowPlot 用来决定保留多少个主成分
seu <- Seurat::RunPCA(seu, features = Seurat::VariableFeatures(seu),
                      npcs = 50, verbose = FALSE)
Seurat::ElbowPlot(seu, ndims = 50)
Seurat::DimHeatmap(seu, dims = 1:12, cells = 500, balanced = TRUE)

# 5) UMAP 非线性降维（dims 取值应与 elbow 拐点接近，一般 20-30）
seu <- Seurat::RunUMAP(seu, dims = 1:30, reduction = "pca",
                       verbose = FALSE, seed.use = 2024)

# 6) 建邻接图并聚类，resolution 越大簇越碎
seu <- Seurat::FindNeighbors(seu, dims = 1:30, verbose = FALSE)
for (res in seq(0.2, 1.0, by = 0.2)) {
  seu <- Seurat::FindClusters(seu, resolution = res, verbose = FALSE,
                              cluster.name = paste0("RNA_snn_res.", res))
}

# 7) 对比不同分辨率：如果同一个生物学群体被劈成两半，说明分辨率调高了
p_dims <- Seurat::DimPlot(seu, reduction = "umap", group.by = c("RNA_snn_res.0.2", "RNA_snn_res.1"),
                          label = TRUE)
p_dims

# 8) 保存带多分辨率标签的对象，方便后续挑选
saveRDS(seu, "data/processed/seurat_reduced.rds")`,
    notes: [
      "LogNormalize 的 scale.factor = 1e4 是历史惯例，对绝大多数数据集都够用，不需要反复纠结这个参数。",
      "vars.to.regress = percent.mt 能压掉死亡细胞的伪孤岛；但如果你的生物学问题恰好跟代谢相关，回归反而会吃掉真实信号。",
      "resolution 不是越大越好：肝组织常见 5-10 个大群，取 0.4-0.6 通常足够，超过 1.0 往往只是把同一个细胞类型切成「一坨左」和「一坨右」。"
    ],
    pitfalls: [
      "ScaleData 只对 VariableFeatures 做标准化就够，全基因做会让内存和时间翻倍却没什么收益。",
      "RunUMAP 有随机性，不设 seed.use 的话每次图形都略有不同，写论文时要固定种子。",
      "聚类个数不等于细胞类型个数，别急着拿 20 个 cluster 去讲 20 种细胞，先做完 marker 检查再下结论。"
    ],
    next: ["scrna-04", "scrna-05", "spatial-03"]
  },
  {
    id: "scrna-04",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "Harmony 批次整合并评估整合效果",
    level: "进阶",
    tags: ["Harmony","批次矫正","多样本","RunHarmony"],
    packages: ["harmony","Seurat","patchwork","ggplot2","dplyr"],
    scene: "多个样本/多个批次的数据合并后明显按样本分开而不是按细胞类型聚拢，需要在不丢失生物学变异的前提下消除批次效应。",
    code: `library(Seurat)
library(harmony)
library(patchwork)

seu <- readRDS("data/processed/seurat_reduced.rds")   # 已 NormalizeData + RunPCA

# 1) 整合前自检：sample 如果在 UMAP 上完全分开，说明批次效应压过了生物学信号
p_before <- Seurat::DimPlot(seu, reduction = "umap", group.by = "condition") +
  ggplot2::ggtitle("Before Harmony")
p_before

# 2) Harmony 作用在 PCA 之后：它对低维嵌入做软 k-means 迭代矫正
seu <- harmony::RunHarmony(seu,
                           group.by.vars = c("orig.ident", "condition"),
                           reduction.use = "pca",
                           theta = 2,          # theta 越大矫正越激进
                           max.iter = 20,
                           plot_convergence = TRUE,
                           verbose = FALSE)
# 矫正结果存为名称为 harmony 的新 reduction
Seurat::Reductions(seu)

# 3) 之后所有的降维聚类都改用 harmony 嵌入，不能再用原始 pca
seu <- seu |>
  Seurat::RunUMAP(reduction = "harmony", dims = 1:30,
                  reduction.name = "umap_harmony", verbose = FALSE) |>
  Seurat::FindNeighbors(reduction = "harmony", dims = 1:30, verbose = FALSE) |>
  Seurat::FindClusters(resolution = 0.5, cluster.name = "harmony_clusters",
                       verbose = FALSE)

# 4) 整合效果评估视角一：不同样本是否混合
p_after <- Seurat::DimPlot(seu, reduction = "umap_harmony", group.by = "condition") +
  ggplot2::ggtitle("After Harmony")

# 5) 整合效果评估视角二：各 cluster 的样本构成是否均衡
prop_df <- table(seu$harmony_clusters, seu$condition) |>
  prop.table(margin = 1) |>
  as.data.frame()
colnames(prop_df) <- c("cluster", "condition", "prop")

p_after
head(prop_df, 12)

saveRDS(seu, "data/processed/seurat_harmony.rds")`,
    notes: [
      "Harmony 的输入必须是已完成 PCA 的对象，它矫正的是低维嵌入而不是表达矩阵本身。",
      "theta 是多样性正则化惩罚强度，theta = 0 几乎不矫正，theta > 3 可能过度矫正把稀有亚群抹平。",
      "过度矫正的危险信号：本应分开的细胞类型（比如 T 细胞和肝细胞）在 UMAP 上挤成一团，这时候要把 theta 调小。"
    ],
    pitfalls: [
      "整合之后忘记把下游所有调用的 reduction 改成 harmony，等于白整合一场。",
      "某一个 batch 里细胞数太少（少于 100）时 Harmony 几乎学不到该批次的分布，甚至直接报错，太小的样本建议先在 merge 层面合并。",
      "做差异表达时绝不能用 harmony 矫正后的表达值，那是合成度高的数据；DESeq2/pseudobulk 必须回到原始 counts。"
    ],
    next: ["scrna-05", "scrna-06", "scrna-08"]
  },
  {
    id: "scrna-05",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "细胞类型注释：SingleR 自动 + marker 人工复核",
    level: "进阶",
    tags: ["SingleR","注释","DotPlot","AddModuleScore"],
    packages: ["Seurat","SingleR","celldex","SingleCellExperiment","dplyr"],
    scene: "聚类完成了，需要把每个 cluster 命名成肝细胞、Kupffer 细胞、内皮细胞这些真实身份。",
    code: `library(Seurat)
library(SingleR)
library(celldex)
library(dplyr)
seu <- readRDS("data/processed/seurat_harmony.rds")
Idents(seu) <- "harmony_clusters"
# ---------- 一、SingleR 自动注释（依赖参考数据集） ----------
ref <- celldex::HumanPrimaryCellAtlasData()   # 首次会联网下载并缓存到 ExperimentHub
sce <- Seurat::as.SingleCellExperiment(seu)
pred <- SingleR::SingleR(test = sce, ref = ref, labels = ref$label.main,
                         clusters = seu$harmony_clusters)
# 按 cluster 回贴标签
singleR_map <- stats::setNames(pred$labels, rownames(pred))
seu$celltype_singleR <- singleR_map[as.character(seu$harmony_clusters)]
# ---------- 二、经典 marker 人工复核：自动化再准也要过一遍 DotPlot ----------
markers <- list(
  Hepatocyte    = c("ALB", "CYP3A4", "APOA1", "TF"),
  Cholangiocyte = c("KRT19", "KRT7", "EPCAM", "CFTR"),
  Endothelial   = c("PECAM1", "VWF", "KDR", "CDH5"),
  Kupffer       = c("CD163", "C1QA", "VSIG4", "C1QB"),
  HSC           = c("ACTA2", "COL1A1", "PDGFRB", "TAGLN"),
  Tcell         = c("CD3D", "CD3E", "IL7R", "TRAC"),
  Bcell         = c("MS4A1", "CD79A", "IGHM", "JCHAIN")
)
Seurat::DotPlot(seu, features = markers, group.by = "harmony_clusters") +
  Seurat::RotatedAxis() + ggplot2::theme_bw()
# ---------- 三、用打分法给每个细胞直接打身份（适合跨数据集复用） ----------
# AddModuleScore 会新增一列 <name><编号>，编号对应原始 list 的顺序
seu <- Seurat::AddModuleScore(seu, features = markers, name = "ct_", nbin = 24)
score_cols <- grep("^ct_", colnames(seu@meta.data), value = TRUE)
idx_max <- apply(seu@meta.data[, score_cols], 1, which.max)
seu$celltype_score <- sub("^ct_", "", score_cols[idx_max])
# 交叉表是检查「自动注释 vs 打分注释」是否一致的关键一步
table(seu$celltype_score, seu$celltype_singleR)
# ---------- 四、人工定案：按 DotPlot 结果把 cluster 编号命名成真实身份 ----------
seu$celltype <- dplyr::case_when(
  seu$harmony_clusters %in% c(0, 1, 4) ~ "Hepatocyte",
  seu$harmony_clusters %in% c(3)       ~ "Endothelial",
  seu$harmony_clusters %in% c(6)       ~ "Kupffer",
  seu$harmony_clusters %in% c(7)       ~ "Tcell",
  TRUE                                 ~ seu$celltype_score
)
saveRDS(seu, "data/processed/seurat_annotated.rds")`,
    notes: [
      "SingleR 是「最省事的第一步」，但它参考的是健康组织图谱，肿瘤或损伤样本的预测准确度会下降，人工复核永远不能省。",
      "DotPlot 同时展示「表达该基因的细胞比例（点大小）」和「平均表达量（颜色）」，比单看 FeaturePlot 更能判断一个 cluster 的身份。",
      "AddModuleScore 是按 abundance bins 做对照基因匹配的，结果受数据整体分布影响，只建议在 marker 集足够特异时用它批量打标。"
    ],
    pitfalls: [
      "SingleR 的 clusters 参数要传字符或因子；传错了会对每个细胞单独预测，慢到怀疑人生。",
      "celldex 参考集需要联网下载，离线机器要提前用 ExperimentHub 缓存到本地并写好 path。",
      "AddModuleScore 对 marker 数量敏感，某个 cluster 只有 2-3 个基因会导致评分不稳定，marker 数量建议 4 个以上。"
    ],
    next: ["scrna-06", "scrna-07", "spatial-03"]
  },
  {
    id: "scrna-06",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "FindMarkers 差异分析与伪 bulk DESeq2",
    level: "进阶",
    tags: ["FindMarkers","伪bulk","AggregateExpression","DESeq2"],
    packages: ["Seurat","DESeq2","dplyr","purrr","tibble","readr","clusterProfiler","org.Hs.eg.db"],
    scene: "想比较处理组与对照组在同一细胞类型内的表达差异；Wilcoxon 太粗糙被审稿人质疑时，改用伪 bulk 做 DESeq2。",
    code: `library(Seurat)
library(DESeq2)
library(dplyr)
library(clusterProfiler)
seu <- readRDS("data/processed/seurat_annotated.rds")
# ---------- 一、Seurat 原生 FindMarkers（细胞水平的 Wilcoxon） ----------
Idents(seu) <- "condition"
dge_wilcox <- Seurat::FindMarkers(seu, ident.1 = "IRR", ident.2 = "Ctrl",
                                  subset.ident = "Hepatocyte",
                                  logfc.threshold = 0.25,
                                  min.pct = 0.1,
                                  test.use = "wilcox",
                                  verbose = FALSE) |>
  tibble::rownames_to_column("gene") |>
  dplyr::arrange(p_val_adj)
head(dge_wilcox, 20)
# ---------- 二、伪 bulk：同一份(celltype x condition)把细胞计数加起来 ----------
# group.by 的顺序决定拼接列名的顺序，这里得到形如 IRR_Hepatocyte 的列名
pb <- Seurat::AggregateExpression(seu, assays = "RNA", slot = "counts",
                                  group.by = c("condition", "celltype"),
                                  return.seurat = FALSE)
pb_counts <- round(as.matrix(pb[["RNA"]]))   # 需要每个条件至少 3 个重复样本才严谨
# ---------- 三、按细胞类型拆开分别做 DESeq2 ----------
run_pb_deseq <- function(mat, cell_type, ref_group = "Ctrl") {
  cols <- grep(paste0("_", cell_type, "$"), colnames(mat), value = TRUE)
  cnt  <- mat[, cols, drop = FALSE]
  cd   <- data.frame(row.names = cols,
                     condition = sub("_.*$", "", cols))
  if (length(unique(cd$condition)) < 2) return(NULL)
  cd$condition <- stats::relevel(factor(cd$condition), ref = ref_group)
  dds <- DESeq2::DESeqDataSetFromMatrix(round(cnt), cd, design = ~ condition)
  keep <- rowSums(DESeq2::counts(dds) >= 10) >= 2
  dds <- dds[keep, ]
  dds <- DESeq2::DESeq(dds, quiet = TRUE)
  res <- DESeq2::results(dds, contrast = c("condition", "IRR", ref_group))
  out <- res |>
    as.data.frame() |>
    tibble::rownames_to_column("gene") |>
    dplyr::mutate(celltype = cell_type)
  return(out)
}
pb_res <- purrr::map_dfr(c("Hepatocyte", "Endothelial", "Kupffer"),
                         ~ run_pb_deseq(pb_counts, .x))
pb_sig <- pb_res |>
  dplyr::filter(!is.na(padj), padj < 0.05, abs(log2FoldChange) > 1)
# ---------- 四、导出结果：显著差异基因可接着送去 clusterProfiler 富集 ----------
saveRDS(pb_res, "data/processed/pseudobulk_deg.rds")
readr::write_csv(pb_sig, "results/tables/TableS5_pseudobulk_DEG.csv")
# ego <- clusterProfiler::enrichGO(gene = unique(pb_sig$gene), OrgDb = org.Hs.eg.db)`,
    notes: [
      "Wilcoxon 把每个细胞当独立样本，会严重低估方差、虚高显著性；伪 bulk 把每个样本聚成一列，才符合 DESeq2 的重复假设。",
      "伪 bulk 至少需要每组 3 个生物学重复的样本；只有 1 例 vs 1 例时，DESeq2 的 dispersion 估计基本不可信。",
      "两套方法都做、然后汇报一致性，是应对审稿人「单细胞差异不严谨」质疑的标准打法。"
    ],
    pitfalls: [
      "AggregateExpression 默认用的是 data slot，要加 slot = counts 才能拿到整数计数。",
      "group.by 传多个字段时列名会按输入顺序拼接，取子集时别搞反了条件顺序。",
      "伪 bulk 的矩阵往往只有两三列，务必满足每组的最低重复数；样本太少时考虑换 MAST 或在 FindMarkers 里加 latent.vars。"
    ],
    next: ["scrna-07", "bulk-08", "viz-02"]
  },
  {
    id: "scrna-07",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "CellChat 细胞间通讯网络分析",
    level: "高级",
    tags: ["CellChat","配体-受体","通讯网络","netVisual"],
    packages: ["CellChat","Seurat","patchwork","dplyr"],
    scene: "想说明处理后两类细胞之间的配体-受体信号增强了，需要定量不同细胞类型间的通讯强度并画出网络图。",
    code: `library(CellChat)
library(Seurat)
library(patchwork)
library(dplyr)
seu <- readRDS("data/processed/seurat_annotated.rds")
# 1) CellChat 需要归一化后的表达矩阵 + 带 celltype 列的 metadata
data.use <- Seurat::GetAssayData(seu, assay = "RNA", slot = "data")
meta.use <- seu@meta.data[, c("celltype", "condition"), drop = FALSE]
colnames(meta.use) <- c("celltype", "condition")
# 2) 按条件拆成两个 CellChat 对象（对照组 vs 处理组）
make_cc <- function(cells) {
  CellChat::createCellChat(object = data.use[, cells],
                           meta = meta.use[cells, , drop = FALSE],
                           group.by = "celltype")
}
cc_ctrl <- make_cc(which(meta.use$condition == "Ctrl"))
cc_irr  <- make_cc(which(meta.use$condition == "IRR"))
object_list <- list(Ctrl = cc_ctrl, IRR = cc_irr)
# 3) 载入人类配体-受体数据库（小鼠用 CellChatDB.mouse）
CellChatDB <- CellChatDB.human
# 4) 对每个对象跑标准四步：过表达基因 -> 过表达互作 -> 概率计算 -> 过滤
object_list <- lapply(object_list, function(cc) {
  cc@DB <- CellChatDB
  cc <- CellChat::subsetData(cc)                      # 只保留库里的基因
  cc <- CellChat::identifyOverExpressedGenes(cc)
  cc <- CellChat::identifyOverExpressedInteractions(cc)
  cc <- CellChat::computeCommunProb(cc, type = "triMean", population.size = TRUE)
  cc <- CellChat::filterCommunication(cc, min.cells = 10)
  return(cc)
})
# 5) 合并对象做对照组 vs 处理组的差异通讯比较
cc_merge <- CellChat::mergeCellChat(object_list, add.names = names(object_list))
gg1 <- CellChat::netVisual_diffInteraction(cc_merge, weight.scale = TRUE)
gg2 <- CellChat::netVisual_circle(cc_merge$net$count[[1]],
                                  vertex.weight = table(cc_merge@idents$Ctrl),
                                  weight.scale = TRUE, title.name = "Ctrl total")
# 6) 挑一条感兴趣的通路画气泡图：一端的配体、另一端的受体全在这
CellChat::netVisual_bubble(cc_merge, comparison = c(1, 2),
                           sources.use = "Kupffer",
                           targets.use = c("Hepatocyte", "Endothelial"),
                           signaling = "MIF", remove.isolate = TRUE)
# 7) 导出差异通讯表格给 supplementary material
diff_lr <- CellChat::rankNetPair(cc_merge, mode = "comparison", doNET = TRUE)
head(diff_lr, 20)`,
    notes: [
      "cellchat 的核心是「谁发给谁、发了什么、强度多少」，配体-受体数据库可以按需 subset 到特定 signaling（比如只看分泌型信号）。",
      "群体大小 population.size = TRUE 会把细胞数量纳入概率计算，样本构成差异大时推荐开启。",
      "差异通讯比较必须在同样的 celltype 组成下做，某个条件里缺失的细胞类型要先剔除。"
    ],
    pitfalls: [
      "createCellChat 的 meta 行名必须与表达矩阵列名完全一致，否则 gene 匹配全乱。",
      "每个细胞类型的细胞数不能太少（建议至少 10-20），太小的群算出来的概率没有意义。",
      "CellChatDB 更新频繁，投稿时务必记录 CellChat 与 DB 的版本号，不同版本结果可能有差异。"
    ],
    next: ["scrna-08", "bulk-10", "viz-04"]
  },
  {
    id: "scrna-08",
    track: "scrna",
    trackName: "单细胞转录组",
    title: "Monocle3 拟时序 / 轨迹分析",
    level: "高级",
    tags: ["monocle3","拟时序","learn_graph","order_cells"],
    packages: ["monocle3","Seurat","dplyr","readr"],
    scene: "想描述肝细胞从正常状态走向损伤/衰老状态的过程，需要在 UMAP 上建发育轨迹并给出每个细胞的拟时序值。",
    code: `library(monocle3)
library(Seurat)
library(dplyr)
seu <- readRDS("data/processed/seurat_hep_sub.rds")   # 肝细胞亚群
# 1) monocle3 需要三张表：表达矩阵、细胞 metadata、基因 metadata
counts <- Seurat::GetAssayData(seu, assay = "RNA", slot = "counts")
cell_meta   <- seu@meta.data[, "condition", drop = FALSE]
gene_meta   <- data.frame(gene_short_name = rownames(counts),
                          row.names = rownames(counts))
# 2) 构建 cell_data_set 对象
cds <- monocle3::new_cell_data_set(expression_matrix = counts,
                                   cell_metadata     = cell_meta,
                                   gene_metadata     = gene_meta)
# 3) 预处理：标准化 + PCA 降维，num_dim 参考 Seurat 里的 PC 数
cds <- monocle3::preprocess_cds(cds, num_dim = 50, method = "PCA")
# 4) 如果样本间批次效应明显，先用对齐（类似 Harmony 的互斥聚类策略）
if (length(unique(cell_meta$condition)) > 1) {
  cds <- monocle3::align_cds(cds, alignment_group = "condition")
}
# 5) UMAP 降维与聚类
cds <- monocle3::reduce_dimension(cds, reduction_method = "UMAP",
                                  preprocess_method = "PCA",
                                  umap.n_neighbors = 15L, umap.min_dist = 0.1)
cds <- monocle3::cluster_cells(cds, resolution = 1e-3)
# 6) 学习主图结构（principal graph），这是 lin 轨迹的骨架
cds <- monocle3::learn_graph(cds, use_partition = FALSE, close_loop = FALSE)
# 7) 定根节点。可以手工给 root cell 名，也可以让画图工具交互式点选
root_cells <- colnames(cds)[which(cds@colData$condition == "Ctrl")]
cds <- monocle3::order_cells(cds, root_cells = root_cells)
# 8) 可视化：按拟时序、按细胞类型、按条件三种视角
p_time <- monocle3::plot_cells(cds, color_cells_by = "pseudotime",
                               label_cell_groups = FALSE, graph_label_size = 3)
p_type <- monocle3::plot_cells(cds, color_cells_by = "condition",
                               trajectory_graph_segment_size = 0.8)
p_time + p_type
# 9) 取出拟时序结果回到 Seurat 里继续做下游分析
pseudo <- monocle3::pseudotime(cds)
seu$pseudotime <- pseudo[match(colnames(seu), names(pseudo))]
# 10) 找随拟时序变化的基因（q 值用于多重检验校正）
pt_genes <- monocle3::graph_test(cds, neighbor_graph = "principal_graph",
                                 cores = 4)
pt_sig <- pt_genes |>
  dplyr::filter(q_value < 1e-4) |> dplyr::arrange(morans_I)
saveRDS(seu, "data/processed/seurat_pseudotime.rds")
readr::write_csv(pt_sig, "results/tables/TableS6_pseudotime_genes.csv")`,
    notes: [
      "拟时序回答的是「细胞沿着某条连续谱排在哪一段」，但方向需要你自己指定根节点，这是一个生物学假设而非计算结果。",
      "learn_graph 的 use_partition = FALSE 会让全数据共用一张图；如果明显有两个互不相干的分区，应该设 TRUE。",
      "order_cells 之后每个细胞都有一个 pseudotime 值，把它写回 Seurat metadata 就能画散点、做相关性。",
      "graph_test 用的 Moran's I 衡量基因表达在轨迹邻接结构上的空间自相关，值越高表示越贴合轨迹走向。"
    ],
    pitfalls: [
      "monocle3 的输入必须是原始 counts，喂归一化数据会让 semi-supervised 步骤直接失效。",
      "order_cells 报错多半是主图有孤立分区，需要先 plot_cells(cds, label_groups_by_cluster=FALSE) 看图形是否连通。",
      "学习图之前的 UMAP 质量和 min_dist 会显著影响轨迹形状，不要让任意的默认参数主导你的生物学结论。"
    ],
    next: ["scrna-07", "viz-02", "ml-03"]
  },
  {
    id: "spatial-01",
    track: "spatial",
    trackName: "空间转录组",
    title: "10x Visium 数据读入与空间表达可视化",
    level: "基础",
    tags: ["Visium","Load10X_Spatial","SpatialFeaturePlot","空转"],
    packages: ["Seurat","dplyr"],
    scene: "拿到 Space Ranger 输出的 Visium 切片，想快速把基因表达和聚类结果投回到组织切片图像上，看有没有解剖结构上的规律。",
    code: `library(Seurat)
library(dplyr)

# 明确 Space Ranger 的输出结构：filtered_feature_bc_matrix.h5 + spatial/ 目录
dir.use <- "data/raw/visium_L1"
list.files(dir.use)
list.files(file.path(dir.use, "spatial"))

# 1) 读入空间数据：会自动挂载图片与 spot 坐标
brain <- Seurat::Load10X_Spatial(data.dir  = dir.use,
                                 filename  = "filtered_feature_bc_matrix.h5",
                                 assay     = "Spatial",
                                 slice     = "L1")

# 2) 先看切片元信息：图像名、scale factor、spot 坐标范围
names(brain@images)
brain@images$L1@scale.factors
head(brain@images$L1@coordinates)

# 3) 按标准流程处理："Tissue CytAssist" 也可以用 SCTransform
brain <- Seurat::NormalizeData(brain, assay = "Spatial", verbose = FALSE)
brain <- Seurat::FindVariableFeatures(brain, nfeatures = 2000, verbose = FALSE)
brain <- Seurat::ScaleData(brain, verbose = FALSE)
brain <- Seurat::RunPCA(brain, npcs = 30, verbose = FALSE)
brain <- brain |>
  Seurat::FindNeighbors(dims = 1:30, verbose = FALSE) |>
  Seurat::FindClusters(resolution = 0.6, verbose = FALSE) |>
  Seurat::RunUMAP(dims = 1:30, verbose = FALSE)

# 4) 空间层面表达可视化：文件建议用 big size factor 覆盖点径
Seurat::SpatialFeaturePlot(brain, features = c("ALB", "CYP3A4", "CYP2E1"),
                           pt.size.factor = 2.2, ncol = 3, alpha = c(0.2, 1))

# 5) 聚类结果投到切片上，判断 cluster 是否贴合解剖结构
Seurat::SpatialDimPlot(brain, label = TRUE, label.size = 3, repel = TRUE)

# 6) 针对感兴趣区域做局部放大：crop = TRUE 后按图像坐标裁剪
Seurat::SpatialDimPlot(brain, crop = TRUE,
                       ymin = 300, ymax = 900, xmin = 200, xmax = 800,
                       label = TRUE, label.size = 3)

# 7) 保存对象供后续反卷积使用
saveRDS(brain, "data/processed/visium_seurat.rds")`,
    notes: [
      "Visium 的每个 spot 直径 55 微米，通常包含 1-10 个细胞，所以它测的是「一小团细胞的混合信号」而不是单细胞。",
      "SpatialDimPlot 和 UMAP DimPlot 必须对着看：空间上成片但 UMAP 上分散，提示有位置效应而非单纯的细胞异质性。",
      "pt.size.factor 调大能让 spot 覆盖更多面积，适合低分辨率的图片；调小适合密集的 HD 数据。"
    ],
    pitfalls: [
      "Load10X_Spatial 报 h5 找不到时，先确认 lowres 图片是否也在 spatial 目录里，缺图会直接报错。",
      "slice 参数决定了 image 的名字，多切片合并时靠它区分，最好与目录名保持一致。",
      "crop = TRUE 的裁剪坐标用的是像素坐标系而不是 spot 行列，正式出图前一定要先预览一遍。"
    ],
    next: ["spatial-02", "spatial-03", "scrna-05"]
  },
  {
    id: "spatial-02",
    track: "spatial",
    trackName: "空间转录组",
    title: "Giotto 框架下的 Visium 分析与绘图",
    level: "进阶",
    tags: ["Giotto","Visium","createGiottoVisiumObject","spatPlot2D"],
    packages: ["Giotto","here","data.table"],
    scene: "想用 Giotto 而不是 Seurat 处理空转数据，因为它的空间网络、邻域分析工具链更完整，出图也更接近 publication 风格。",
    code: `library(Giotto)

# 1) Giotto 需要先登记本机的 Python 环境（LEIDEN 聚类走 Python）
instr <- Giotto::createGiottoInstructions(
  save_plot = TRUE, show_plot = FALSE,
  save_dir  = here::here("results/figures"),
  python_path = Sys.which("python3")[[1]]
)

# 2) 一条命令读入 Visium：自动匹配 filtered matrix、图片与坐标文件
gobject <- Giotto::createGiottoVisiumObject(
  visium_dir        = here::here("data/raw/visium_L1"),
  expr_data         = "raw",      # raw = 不过滤；filtered = 只用组织内 spot
  gene_column_index = 2,          # 2 = symbol, 1 = Ensembl ID
  instructions      = instr
)
# 3) QC：同时过滤低表达的 spot 和低频基因
gobject <- Giotto::filterGiotto(gobject = gobject,
                                expression_threshold = 1,
                                feat_det_in_min_cells = 10,
                                min_det_feats_per_cell = 100)
# 4) 归一化 + 统计 QC 指标
gobject <- Giotto::normalizeGiotto(gobject = gobject, scalefactor = 6000,
                                   verbose = 2)
gobject <- Giotto::addStatistics(gobject = gobject)
# 5) 高变基因 + PCA + UMAP + Leiden 聚类
feat_meta <- Giotto::fDataDT(gobject)
feat_use  <- feat_meta[perc_cells > 3 & total_expr > 20, feat_ID]
gobject <- Giotto::runPCA(gobject = gobject, feats_to_use = feat_use,
                          expression_values = "scaled", center = TRUE,
                          scale_unit = FALSE, ncp = 30)
gobject <- Giotto::runUMAP(gobject = gobject, dimensions_to_use = 1:15)
gobject <- Giotto::createNearestNetwork(gobject = gobject,
                                        dimensions_to_use = 1:15, k = 15)
gobject <- Giotto::doLeidenCluster(gobject = gobject, resolution = 0.5,
                                   n_iterations = 1000, name = "leiden_clus")
# 6) 把结果投回切片，支持 x,y 两种方向的可视化
Giotto::spatPlot2D(gobject = gobject, cell_color = "leiden_clus",
                   point_size = 2.5, save_plot = TRUE, point_border_stroke = 0.05)
Giotto::spatDimPlot2D(gobject = gobject, cell_color = "leiden_clus",
                      dim_reduction_to_use = "umap", point_size = 1.5)
Giotto::spatFeatPlot2D(gobject = gobject,
                       feats = c("ALB", "CYP3A4", "CYP2E1"),
                       point_size = 2.5, scale_alpha = TRUE)
saveRDS(gobject, here::here("data/processed/giotto_visium.rds"))`,
    notes: [
      "Giotto 的核心对象是 giotto object，里面同时存了表达矩阵、空间坐标、空间网络和分析结果，比零散的矩阵更好管理。",
      "leiden 聚类走的是 Python 的 leidenalg 或 igraph，必须先配置好 python_path，否则会卡在这一步。",
      "gene_column_index = 2 表示取 features.tsv 的第二列（symbol），用 Ensembl 版本时要改成 1 并另外做转换。"
    ],
    pitfalls: [
      "Giotto 的 Python 依赖是最大的安装门槛，建议用 conda 建专用环境后再把 python_path 写进 instructions。",
      "createGiottoVisiumObject 对目录结构要求严格，必须包含 tissue_positions 与 scalefactors_json.json。",
      "R 会话里同时加载 Giotto 和 Seurat 会有函数名冲突，建议用 Giotto:: 显式限定。"
    ],
    next: ["spatial-03", "spatial-04", "scrna-03"]
  },
  {
    id: "spatial-03",
    track: "spatial",
    trackName: "空间转录组",
    title: "Spot 反卷积：RCTD 把单细胞比例映射到切片",
    level: "高级",
    tags: ["反卷积","spacexr","RCTD","细胞类型比例"],
    packages: ["spacexr","Seurat","dplyr"],
    scene: "有了同组织或近似组织的单细胞参考，想知道每个 Visium spot 里各细胞类型占多少比例，从而在空间上定位关键细胞群。",
    code: `library(spacexr)
library(Seurat)
library(dplyr)

brain <- readRDS("data/processed/visium_seurat.rds")
seu_ref <- readRDS("data/processed/seurat_annotated.rds")

# 1) 构造参考：count 矩阵 + 细胞类型向量（向量名必须是 cell barcode）
ref_counts <- Seurat::GetAssayData(seu_ref, assay = "RNA", slot = "counts")
ct_vec <- setNames(as.character(seu_ref$celltype), colnames(seu_ref))
# 去掉未注释与数量过少的细胞类型
ct_vec <- ct_vec[ct_vec != "Unknown"]
ct_cts <- names(table(ct_vec))[table(ct_vec) >= 25]
ct_vec <- ct_vec[ct_vec %in% ct_cts]

reference <- spacexr::Reference(ref_counts[, names(ct_vec)], ct_vec, num_cores = 4)

# 2) 构造空间对象：coords 行名必须与 counts 列名一致
sp_counts <- Seurat::GetAssayData(brain, assay = "Spatial", slot = "counts")
coords <- brain@images$L1@coordinates[, c("imagerow", "imagecol")]
coords <- data.frame(x = coords$imagecol, y = coords$imagerow,
                     row.names = rownames(coords))
common <- intersect(colnames(sp_counts), rownames(coords))
sp_counts <- sp_counts[, common, drop = FALSE]
coords <- coords[common, , drop = FALSE]

puck <- spacexr::SpatialRNA(coords, sp_counts)

# 3) 建 RCTD 对象并运行：doublet 模式允许每个 spot 含两种细胞类型
rctd.obj <- spacexr::create.RCTD(puck, reference, max_cores = 4)
rctd.obj <- spacexr::run.RCTD(rctd.obj, doublet_mode = "doublet",
                              max_cores = 4)

# 4) 提取细胞类型比例矩阵（spot x type）并写回 Seurat
weights <- rctd.obj@results$weights            # 各类类型的占比
weights <- weights[colnames(brain), , drop = FALSE]
weights <- weights[, colSums(weights) > 0, drop = FALSE]

brain[["CTweights"]] <- Seurat::CreateAssayObject(counts = t(weights))
Seurat::DefaultAssay(brain) <- "CTweights"
# 5) 把每种细胞类型的丰度画到切片上
Seurat::SpatialFeaturePlot(brain, features = head(rownames(brain[["CTweights"]]), 4),
                           pt.size.factor = 2.2, ncol = 2)
saveRDS(brain, "data/processed/visium_rctd.rds")
saveRDS(rctd.obj@results, "data/processed/rctd_full_results.rds")`,
    notes: [
      "RCTD 用泊松-对数正态模型同时估计细胞类型比例和平台效应，是目前 spot 层面反卷积公认效果最好的方法之一。",
      "参考数据集与目标空转数据的组织来源越接近越好；跨组织借用参考会产生严重的比例偏移。",
      "doublet_mode 选 singlet 时每个 spot 只允一种主导类型，Visium 这种 55 微米的 spot 通常应该用 doublet。"
    ],
    pitfalls: [
      "Reference 的细胞类型必须与 count 矩阵列名严格对应，少一个或顺序错都会导致报错。",
      "空间坐标与表达矩阵的细胞名如果不一致，SpatialRNA 会静默构造出空对象，后面全是 NaN。",
      "反卷积结果不是绝对计数而是相对比例，解释时别说成『该 spot 有 30 个 Kupffer 细胞』。"
    ],
    next: ["spatial-04", "spatial-01", "bulk-10"]
  },
  {
    id: "spatial-04",
    track: "spatial",
    trackName: "空间转录组",
    title: "空间可变基因与邻域共定位分析",
    level: "高级",
    tags: ["空间可变基因","binSpect","邻域富集","空间网络"],
    packages: ["Giotto","Seurat","dplyr","readr"],
    scene: "已经拿到了切片上的聚类结果，想找出哪些基因的表达具有空间趋势，并检验两类细胞是否在空间上互相靠近或互斥。",
    code: `library(Giotto)
library(dplyr)
gobject <- readRDS("data/processed/giotto_visium.rds")
# 1) 先建空间邻居网络：Delaunay 三角剖分是最常用的邻接定义
gobject <- Giotto::createSpatialNetwork(gobject = gobject,
                                        method = "Delaunay",
                                        delaunay_distance = "auto",
                                        minimum_k = 2,
                                        maximum_distance_delaunay = 50)
# 2) 空间可变基因筛查：binSpect 有 rank 与 kmeans 两种打分思路
gobject <- Giotto::binSpect(gobject, bin_method = "rank",
                            calc_hub = TRUE, hub_min_int = 5,
                            do_fisher_test = TRUE,
                            spatial_network_name = "Delaunay_network")
gobject <- Giotto::binSpect(gobject, bin_method = "kmeans",
                            calc_hub = TRUE, do_fisher_test = TRUE,
                            spatial_network_name = "Delaunay_network")
# 3) 取出结果表：不同 Giotto 版本的得分列名略有差异，先用 grep 定位
feat_meta <- Giotto::fDataDT(gobject)
rank_cols <- grep("rank$", colnames(feat_meta), value = TRUE)
score_col <- rank_cols[1]
stopifnot(length(score_col) > 0)
feat_meta <- feat_meta[order(-feat_meta[[score_col]])]
svg_top <- head(feat_meta$feat_ID, 20)
print(svg_top)
# 4) 可视化前几个 SVG：空间自相关越强，图上越像成片色块
Giotto::spatFeatPlot2D(gobject = gobject, feats = svg_top[1:6],
                       point_size = 2.5, scale_alpha = TRUE, ncol = 3)
# 5) 邻域富集：观察/期望比 > 1 表示两类细胞在空间上互相吸引
cpes <- Giotto::cellProximityEnrichment(
  gobject = gobject,
  cluster_column = "leiden_clus",
  spatial_network_name = "Delaunay_network",
  number_of_simulations = 1000,
  adjust_method = "fdr",
  seed_number = 2024
)
cpes$enrichm_res <- dplyr::arrange(cpes$enrichm_res, -PI_VALUE)
head(cpes$enrichm_res, 15)
# 6) 用柱状图 / 网络图展示细胞间的空间邻接倾向
Giotto::cellProximityBarplot(gobject = gobject, CPES = cpes,
                             min_orig_ints = 5, min_sec_ints = 5)
Giotto::cellProximityNetwork(gobject = gobject, CPES = cpes,
                             min_int_cells = 5, remove_self_edges = TRUE)
readr::write_csv(cpes$enrichm_res, "results/tables/TableS7_spatial_neighbors.csv")`,
    notes: [
      "空间可变基因（SVG）区别于普通高变基因：它衡量的是表达是否具有空间自相关，而不是单纯的方差大小。",
      "Delaunay 网络假设近邻互为邻居，适合连续切片；kNN 网络更适合稀疏或不连续的组织区域。",
      "邻域富集的零假设是随机分布，PI_VALUE > 1 表示两类细胞倾向于挨在一起，< 1 表示相互排斥。"
    ],
    pitfalls: [
      "binSpect 对 spot 数目很敏感，样本点太少时几乎所有基因都会被判为显著，必须结合阈值和肉眼目测。",
      "细胞数目极不平衡的类型之间做邻域富集容易产生假阳性，建议先给参与的 cluster 设细胞数下限。",
      "binSpect 需要足够的内存，两三万 spot 以上建议先 aggregate 或分块处理。"
    ],
    next: ["spatial-01", "spatial-03", "scrna-07"]
  },
  {
    id: "mr-01",
    track: "mr",
    trackName: "孟德尔随机化",
    title: "TwoSampleMR 完整正向分析流程",
    level: "进阶",
    tags: ["TwoSampleMR","MR","GWAS","harmonise"],
    packages: ["TwoSampleMR","dplyr","readr"],
    scene: "想论证某个可修饰暴露（如转氨酶、炎症因子、血脂）与肝病结局之间是否存在因果支持，而不是简单的相关性。",
    code: `# 数据来源：IEU OpenGWAS (https://gwas-api.mrcieu.ac.uk/)，需先注册获取 token
library(TwoSampleMR)
library(dplyr)

# 1) 注册认证：新版 OpenGWAS API 强制要求 token
# 先在 https://api.opengwas.io/ 申请，把返回的 jwt 写进 ~/.Renviron：
# OPENGWAS_JWT=xxxxx
ieugwasr::get_opengwas_jwt()

# 2) 检索可用的暴露 GWAS（可用 "" 通配符，速度较慢，建议一次查完存本地）
ao <- TwoSampleMR::available_outcomes()
saveRDS(ao, "data/raw/opengwas_catalog.rds")
cand <- ao |>
  dplyr::filter(grepl("alanine aminotransferase", trait, ignore.case = TRUE),
                category == "Continuous") |>
  dplyr::select(id, trait, nsnp, sample_size, population, year)
head(cand)

# 3) 提取工具变量：p1 是全基因组显著阈值，clump 做连锁不平衡修剪
exp_dat <- TwoSampleMR::extract_instruments(
  outcomes = cand$id[1],
  p1 = 5e-8, clump = TRUE, r2 = 0.001, kb = 10000
)
stopifnot(nrow(exp_dat) > 0)

# 4) 提取结局 GWAS 里这些 SNP 的效应，proxies 用于补 rsq 的替代 SNP
out_dat <- TwoSampleMR::extract_outcome_data(
  snps = exp_dat$SNP, outcomes = "ieu-b-4950",   # 示例：肝癌结局
  proxies = TRUE, rsq = 0.8, align_alleles = 1
)
# 5) 等位基因协同对齐：action = 2 会同时处理回文与非回文 SNP
dat <- TwoSampleMR::harmonise_data(exposure_dat = exp_dat,
                                   outcome_dat  = out_dat, action = 2)
table(dat$mr_keep)
# 6) 主分析：五种方法的结果应当方向一致
res <- TwoSampleMR::mr(dat)
TwoSampleMR::mr_method_list()
# 7) 二分类结局要把 beta 转成 OR（95% CI）
res_or <- TwoSampleMR::generate_odds_ratios(res)
# 8) 导出主方法（IVW）结果
main <- res |>
  dplyr::filter(method == "Inverse variance weighted") |>
  dplyr::mutate(NSNP_used = nrow(dat[dat$mr_keep, ]))
readr::write_csv(res_or, "results/tables/TableS8_MR_results.csv")
res_or`,
    notes: [
      "三大核心假设：相关性（IV 与暴露强相关）、独立性（IV 不经混杂因素影响结局）、排他性（IV 只能通过暴露影响结局）。",
      "action = 2 是最稳妥的 harmonise 策略：它会把回文且非 A/T 或 C/G 能推断的 SNP 直接剔除。",
      "IVW 是默认主方法，但它的前提是不过度多效性；必须用 MR-Egger、加权中位数做一致性佐证。"
    ],
    pitfalls: [
      "没有 token 时 available_outcomes 会返回 401 报错，先跑 get_opengwas_jwt 再重试。",
      "暴露与结局样本如果存在重叠（均为 UK Biobank），会有样本重叠偏倚，应选不同队列的 GWAS。",
      "工具变量少于 3 个时 MR-Egger 的截距检验几乎没有检验效能，不要用它的 p 值下结论。"
    ],
    next: ["mr-02", "mr-03", "mr-04"]
  },
  {
    id: "mr-02",
    track: "mr",
    trackName: "孟德尔随机化",
    title: "工具变量筛选、LD 修剪与强度评估",
    level: "高级",
    tags: ["IV","LD修剪","F统计量","Steiger"],
    packages: ["TwoSampleMR","dplyr","data.table"],
    scene: "手上有来自 FinnGen/UK Biobank 的原始 GWAS 汇总统计，需要自己从原始数据做工具变量筛选、LD 修剪和弱工具变量剔除。",
    code: `library(TwoSampleMR)
library(dplyr)
library(data.table)

# 1) 读入原始汇总统计：必须是 effect size 形式（beta + se），不能是 z score
gwas <- data.table::fread("data/raw/gwas_exposure.txt.gz")

# 2) 用 format_data 把任意来源的 GWAS 规范成 TwoSampleMR 的格式
exp_raw <- TwoSampleMR::format_data(
  dat = gwas,
  type = "exposure",
  snp_col = "rsid", beta_col = "beta", se_col = "se",
  effect_allele_col = "alt", other_allele_col = "ref",
  eaf_col = "af_alt", pval_col = "pval",
  chr_col = "chrom", pos_col = "pos",
  samplesize_col = "n_complete_samples",
  phenotype_col = "exposure_name",
  gene_col = "nearest_genes",
  log_pval = FALSE
)

# 3) 全基因组显著性筛选 + 弱工具变量剔除（F 统计量近似为 beta^2 / se^2）
exp_sig <- exp_raw |>
  dplyr::mutate(F_stat = (beta.exposure / se.exposure)^2) |>
  dplyr::filter(pval.exposure < 5e-8, F_stat > 10)

# 常见的兜底：联动不平衡修剪（需要 plink 二进制文件，本地或 Token 二选一）
# exp_clumped <- TwoSampleMR::clump_data(exp_sig, clump_kb = 10000,
#                                        clump_r2 = 0.001, pop = "EUR")
# 离线替代：读入自制的 LD 参考文件或用 plink --clump 预先处理好

# 4) 剔除与结局混杂相关的 SNP：PhenoScanner 需联网，也可手工查表剔除
# phenoscanner::phenoscanner(snpquery = exp_sig$SNP, proxies = "EUR", r2 = 0.8)

# 5) Steiger 定向检验：确认这个 SNP 解释的暴露方差大于结局方差
dat <- TwoSampleMR::harmonise_data(exp_sig, out_dat_from_file, action = 2)
steiger_res <- TwoSampleMR::steiger_filtering(dat)
dat_ok <- dat[dat$SNP %in% steiger_res$SNP[steiger_res$steiger_dir_ok], ]

# 6) 用 directionality_test 做整体因果方向确认
TwoSampleMR::directionality_test(dat_ok)
# 7) 再次计算 IV 强度：R2 与 F，nAuthority 样本量不足时 F 会被低估
dat_final <- TwoSampleMR::add_metadata(dat_ok)
message("最终工具变量数：", nrow(dat_final))
saveRDS(dat_final, "data/processed/mr_harmonised.rds")`,
    notes: [
      "F 统计量大于 10 是弱工具变量的经验阈值；低于此值的 IV 会带来严重的向零偏倚。",
      "LD 修剪的阈值通常是 r2 < 0.001 且物理距离 10000 kb，这个标准源自 GWAS  catalog 的通用做法。",
      "Steiger 检验能识别出「因果方向搞反了」的情况：如果 SNP 解释结局的方差比暴露还多，方向很可能是反的。"
    ],
    pitfalls: [
      "format_data 的列名映射错一位就会导致全部 beta 变成 NA，务必先用 head 核对该 GWAS 文件的实际列名。",
      "clump_data 依赖 LD reference panel，Linux 上要准备 plink 二进制，Windows 上最省事的办法是用 API clump。",
      "自动剔除混淆 SNP 时不要贪多，剔掉一半 IV 会让结果变得难以解释。"
    ],
    next: ["mr-01", "mr-03", "mr-04"]
  },
  {
    id: "mr-03",
    track: "mr",
    trackName: "孟德尔随机化",
    title: "异质性、多效性检验与敏感性可视化",
    level: "高级",
    tags: ["异质性","多效性","leave-one-out","漏斗图"],
    packages: ["TwoSampleMR","ggplot2","dplyr","readr"],
    scene: "IVW 结果显著但审稿人质疑可靠性，需要拿出异质性检验、多效性检验、逐个剔除分析和漏斗图这一整套敏感性分析。",
    code: `library(TwoSampleMR)
library(ggplot2)
library(dplyr)

dat <- readRDS("data/processed/mr_harmonised.rds")

# 1) 异质性检验：Q 统计量显著说明不同 SNP 给出的效应差异过大
het <- TwoSampleMR::mr_heterogeneity(dat,method = "mr_egger_regression",
                                     method2 = "inverse_variance_weighted") 
het |> dplyr::filter(method %in% c("MR Egger", "Inverse variance weighted"))

# 2) 多效性检验：MR-Egger 的截距项不为零，说明存在定向多效性
pleio <- TwoSampleMR::mr_pleiotropy_test(dat)
print(pleio)
# 截距 p > 0.05 才支持「没有显著的定向多效性」

# 3) 单个 SNP 的 MR 估计：看是否所有 SNP 的效应方向一致
single <- TwoSampleMR::mr_singlesnp(dat, parameters = TwoSampleMR::default_parameters())

# 4) 逐个剔除分析：理想结果是随便去掉哪个 SNP，总效应都稳定
loo <- TwoSampleMR::mr_leaveoneout(dat, parameters = TwoSampleMR::default_parameters())

res <- TwoSampleMR::mr(dat)

# 5) 三张必出的图：散点图、逐个剔除森林图、漏斗图
p_scatter <- TwoSampleMR::mr_scatter_plot(res, dat)
p_forest  <- TwoSampleMR::mr_forest_plot(TwoSampleMR::mr_leaveoneout_plot(loo))
p_funnel  <- TwoSampleMR::mr_funnel_plot(single)

dir.create("results/figures/MR", showWarnings = FALSE, recursive = TRUE)
# mr_save_plot 可以直接把 ggplot 或 ggplot list 写成文件
TwoSampleMR::mr_save_plot(p_scatter, "results/figures/MR/Fig_MR_scatter.pdf")
TwoSampleMR::mr_save_plot(p_funnel,  "results/figures/MR/Fig_MR_funnel.pdf")
# mr_forest_plot 返回的是 list of ggplot，取第一层用 ggsave 导出
ggplot2::ggsave("results/figures/MR/Fig_MR_loo.pdf", p_forest[[1]],
                width = 6, height = 5)
# 6) 若异质性明显，固定效应与随机效应 IVW 要一起报告
res_all <- TwoSampleMR::mr(dat,
                           method_list = c("mr_ivw_fe", "mr_ivw_mre",
                                           "mr_egger_regression",
                                           "mr_weighted_median",
                                           "mr_weighted_mode"))
res_or <- TwoSampleMR::generate_odds_ratios(res_all)
readr::write_csv(het, "results/tables/TableS9_MR_heterogeneity.csv")
res_or`,
    notes: [
      "IVW 固定效应的前提是所有 SNP 估计同一个因果效应；异质性显著时应改用 IVW 随机效应模型。",
      "MR-Egger 的 intercept 检验是判断定向多效性最常用的方法，但它牺牲了统计效能，结果解释要谨慎。",
      "漏斗图左右明显不对称通常是多效性的视觉线索，但不能只凭它下结论，必须配合 MR-Egger 截距检验。"
    ],
    pitfalls: [
      "mr_scatter_plot 的第一个参数是 mr 分析结果而不是 harmonised 数据，顺序搞反会报找不到列。",
      "mr_save_plot 默认分辨率只有 100 dpi，投稿前用 high_res = TRUE 或者手动 ggsave 重出。",
      "leave-one-out 出现某 SNP 一剔除结果就翻转，说明结论被单一 SNP 驱动，这是必须如实报告的。"
    ],
    next: ["mr-04", "mr-02", "writing-01"]
  },
  {
    id: "mr-04",
    track: "mr",
    trackName: "孟德尔随机化",
    title: "贝叶斯共定位（coloc）与反向 MR",
    level: "高级",
    tags: ["coloc","共定位","反向MR","PP.H4"],
    packages: ["coloc","TwoSampleMR","dplyr","data.table","readr"],
    scene: "MR 提示暴露与结局有关联，想进一步确认两者是否由同一个因果变异驱动，同时排除「结局反过来导致暴露」的可能。",
    code: `library(coloc)
library(TwoSampleMR)
library(dplyr)
library(data.table)
# ---------- 一、贝叶斯共定位 ----------
gwas1 <- data.table::fread("data/raw/gwas_exposure.txt.gz")
gwas2 <- data.table::fread("data/raw/gwas_outcome.txt.gz")
# 1) 构造 coloc 格式的 dataset：必须与 random list 的字段名完全一致
mk_dataset <- function(gw, type = "quant", region = NULL) {
  if (!is.null(region)) {
    gw <- gw[chrom == region$chr & pos >= region$start & pos <= region$end]
  }
  list(snp = gw$rsid, position = gw$pos, chrom = gw$chrom,
       beta = gw$beta, varbeta = gw$se^2,
       pvalues = gw$pval, N = unique(gw$n_complete_samples)[1],
       type = type, sdY = 1)
}
d1 <- mk_dataset(gwas1, "quant", list(chr = 2, start = 1e8, end = 1.2e8))
d2 <- mk_dataset(gwas2, "cc",    list(chr = 2, start = 1e8, end = 1.2e8))
# 2) 先验：单个性状关联概率 1e-4，共有因果变异 1e-5
coloc_res <- coloc::coloc.abf(dataset1 = d1, dataset2 = d2,
                              p1 = 1e-4, p2 = 1e-4, p12 = 1e-5)
names(coloc_res$summary)
# 3) 判读标准：PP.H4 > 0.8 表示支持「同一个因果变异驱动两个信号」
pp <- coloc_res$summary[c("PP.H0.abf", "PP.H1.abf", "PP.H2.abf",
                          "PP.H3.abf", "PP.H4.abf")]
print(round(as.numeric(pp), 4))
# 4) 多个区域批量跑，最后按 PP.H4 排序留表格
regions <- list(list(chr = 2, start = 1e8, end = 1.2e8),
                list(chr = 12, start = 5e6, end = 8e6))
pp_all <- lapply(regions, function(rg) {
  a <- mk_dataset(gwas1, "quant", rg); b <- mk_dataset(gwas2, "cc", rg)
  rr <- tryCatch(coloc::coloc.abf(a, b, p1 = 1e-4, p2 = 1e-4, p12 = 1e-5),
                 error = function(e) NULL)
  if (is.null(rr)) return(NULL)
  data.frame(chr = rg$chr, start = rg$start, end = rg$end,
             PP.H4 = as.numeric(rr$summary["PP.H4.abf"]))
})
readr::write_csv(dplyr::bind_rows(pp_all),
                 "results/tables/TableS10_coloc_PP.H4.csv")
# ---------- 二、反向 MR：把结局当暴露重跑一遍 ----------
rev_exp <- TwoSampleMR::extract_instruments(outcomes = "ieu-b-4950",
                                            p1 = 5e-8, clump = TRUE,
                                            r2 = 0.001, kb = 10000)
rev_out <- TwoSampleMR::extract_outcome_data(snps = rev_exp$SNP,
                                             outcomes = "ieu-a-1060")
rev_dat <- TwoSampleMR::harmonise_data(rev_exp, rev_out, action = 2)
rev_res <- TwoSampleMR::mr(rev_dat)
# 若正向显著而反向不显著，因果方向的支持力度就大大增加
forward <- readRDS("data/processed/mr_res_forward.rds")
dplyr::bind_rows(forward = forward, reverse = rev_res, .id = "direction") |>
  dplyr::filter(method == "Inverse variance weighted")`,
    notes: [
      "PP.H4 是「两个性状共享同一个因果变异」的后验概率，PP.H3 则是「两个不同的因果变异」。",
      "共定位分析是基于一段基因组区域的，必须先把 GWAS 按 LD block 或基因座范围切窗，直接扔全基因组数据毫无意义。",
      "反向 MR 是排除反向因果最直观的办法：把结局当作暴露重跑，若结果不显著，方向支持度大幅提升。"
    ],
    pitfalls: [
      "coloc 对 dataset 的字段名要求严格，改名或漏 sdY、N 都会直接报错。",
      "缺失 MAF 信息时 coloc 会用默认值 0.1，这会显著影响 PP 估计，务必提供真实 MAF。",
      "反向 MR 的 IV 选择同样要遵循同样的显著性阈值，否则两边标准不一致，无法比较。"
    ],
    next: ["mr-03", "mr-01", "bulk-09"]
  },
  {
    id: "tox-01",
    track: "tox",
    trackName: "网络毒理学与暴露组",
    title: "CTD 化学物-基因互作数据提取与差异基因交集",
    level: "基础",
    tags: ["CTD","网络毒理学","暴露","交集"],
    packages: ["data.table","dplyr","readr"],
    scene: "想搞清楚某个环境暴露（电离辐射、四氯化碳、药物）会扰动哪些基因，并把它和自己测序得到的差异基因取交集，作为后续网络毒理学的起点。",
    code: `# 数据来源：Comparative Toxicogenomics Database http://ctdbase.org/downloads/
# 需要下载的文件：CTD_chem_gene_ixns.tsv.gz（化学物-基因互作）
library(data.table)
library(dplyr)
library(readr)
# 1) CTD 文件开头有 35 行以 # 起始的注释，fread 的 skip 可直达表头行
ctd <- data.table::fread("data/raw/CTD_chem_gene_ixns.tsv.gz",
                         skip = "#ChemicalName",
                         sep = "\\t", header = TRUE, quote = "", fill = TRUE,
                         showProgress = FALSE)
names(ctd)
nrow(ctd)
# 2) 限定人类。Organism 列格式如 "Homo sapiens|9606| NCBI:txid9606"
ctd_human <- ctd |>
  dplyr::filter(grepl("9606", Organism)) |>
  dplyr::select(ChemicalName, ChemicalID, CasRN, GeneSymbol, GeneID,
                InteractionActions, PubMedIDs)
length(unique(ctd_human$ChemicalName))
length(unique(ctd_human$GeneSymbol))
# 3) 指定关注的暴露：电离辐射、四氯化碳、顺铂等
keywords <- c("ionizing radiation", "carbon tetrachloride", "cisplatin")
chem_sub <- ctd_human |>
  dplyr::filter(grepl(paste(keywords, collapse = "|"),
                      ChemicalName, ignore.case = TRUE))
# 4) InteractionActions 里出现 expression 表示确实报道了表达层面的改变
chem_expr <- chem_sub |>
  dplyr::filter(grepl("expression", InteractionActions, ignore.case = TRUE))
# 5) 和自己测到的差异基因取交集
deg <- readRDS("data/processed/deg_deseq2.rds")
deg_sig <- deg |>
  dplyr::filter(!is.na(padj), padj < 0.05, abs(log2FoldChange) > 0.5)
overlap <- intersect(unique(chem_expr$GeneSymbol), deg_sig$gene)
cat("交集基因数:", length(overlap), "\\n", "暴露相关基因总数:", nrow(chem_expr), "\\n")
# 6) 按化学物统计命中数，挑出最相关的前几个化学物
rank_tab <- chem_expr |>
  dplyr::count(ChemicalName, name = "n_gene") |>
  dplyr::arrange(dplyr::desc(n_gene))
head(rank_tab, 15)
# 7) 导出交集表，附 publication 证据
out <- chem_expr |>
  dplyr::filter(GeneSymbol %in% overlap) |>
  dplyr::left_join(deg_sig |> dplyr::select(gene, log2FoldChange, padj),
                   by = c(GeneSymbol = "gene")) |>
  dplyr::arrange(padj)
readr::write_csv(out, "results/tables/TableS11_exposure_gene_overlap.csv")`,
    notes: [
      "CTD 是循证程度最高的化学物-基因数据库之一，每条关系都带 PubMed ID，写讨论时可以逐个追溯原始文献。",
      "CTD 的 Organism 字段混着多物种数据，不做 9606 过滤的话小鼠结果会混进人类分析里。",
      "InteractionActions 是多值字段（用管道符分隔），「影响表达」和「影响甲基化」「结合」等机制要区分开。"
    ],
    pitfalls: [
      "fread 读到 CTD 文件容易因注释行的 # 导致表头识别错，用 skip = '#ChemicalName' 直接跳到真实表头。",
      "CTD 完整文件解压后可达数 GB，提前用 Linux 命令按物种筛一遍再读入 R 会省很多时间。",
      "GeneSymbol 可能为空或与旧别名不一致，与自己的表达矩阵匹配时建议再用 org.Hs.eg.db 校验一次。"
    ],
    next: ["tox-02", "tox-03", "bulk-08"]
  },
  {
    id: "tox-02",
    track: "tox",
    trackName: "网络毒理学与暴露组",
    title: "自定义基因集做化学物富集与暴露组扰动评估",
    level: "进阶",
    tags: ["enricher","自定义基因集","CTD","STRING","PPI"],
    packages: ["clusterProfiler","enrichplot","STRINGdb","dplyr","tidyr","ggplot2","readr"],
    scene: "把 CTD 的化学物-基因关系当作自定义基因集，用 enricher 找出最能解释你这批差异基因的暴露因子，并把候选基因放进 STRING 做 PPI 网络。",
    code: `# 依赖 tox-01 产出的 CTD 数据；STRINGdb 需要联网
library(clusterProfiler)
library(dplyr)
library(readr)
library(STRINGdb)

ctd_human <- readRDS("data/processed/ctd_human.rds")
deg  <- readRDS("data/processed/deg_deseq2.rds")
# 1) 把 CTD 关系整理成 enricher 需要的 TERM2GENE 两列格式
term2gene <- ctd_human |>
  dplyr::filter(grepl("expression", InteractionActions, ignore.case = TRUE)) |>
  dplyr::select(term = ChemicalName, gene = GeneSymbol) |>
  dplyr::distinct() |>
  dplyr::filter(term != "", !is.na(gene))
# 2) 只保留基因数适中的化学物集合，太小的没统计意义，太大的没特异性
term_size <- term2gene |> dplyr::count(term)
term2gene <- term2gene |> dplyr::semi_join(term_size |> dplyr::filter(n >= 5, n <= 500), by = "term")
# 3) 准备基因列表与背景：差异基因 + 全部检测到表达的基因
gene_use   <- unique(deg$gene[deg$padj < 0.05 & deg$log2FoldChange > 0])
background <- deg$gene
enr_chem <- clusterProfiler::enricher(gene = gene_use, universe = background,
                                   TERM2GENE = term2gene,
                                   TERM2NAME = NULL,
                                   pAdjustMethod = "BH",
                                   pvalueCutoff = 0.05,
                                   qvalueCutoff = 0.2)
dim(enr_chem)
as.data.frame(enr_chem)[1:10, c("Description", "GeneRatio", "p.adjust")]
# 4) 出图并导出
p <- enrichplot::dotplot(enr_chem, showCategory = 20, font.size = 10) +
  ggplot2::theme_classic(base_size = 11)
ggplot2::ggsave("results/figures/Fig3_chemical_enrich.pdf", p, width = 6.5, height = 5)
readr::write_csv(as.data.frame(enr_chem), "results/tables/TableS12_chemical_enrich.csv")
# 5) 把排名靠前的暴露基因送进 STRING 看互作关系
hit <- as.data.frame(enr_chem) |>
  dplyr::filter(p.adjust < 0.05) |>
  dplyr::mutate(gene = strsplit(geneID, "/")) |>
  tidyr::unnest(gene)
string_db <- STRINGdb::STRINGdb$new(version = "11.5", species = 9606,
                                    score_threshold = 400, input_directory = "data/raw")
mapped <- string_db$map(data.frame(gene = unique(hit$gene)), "gene",
                        removeUnmappedRows = TRUE)
ppi <- string_db$get_interactions(mapped$STRING_id)
head(ppi, 10)
readr::write_csv(ppi, "results/tables/TableS13_string_ppi.csv")`,
    notes: [
      "enricher 是 clusterProfiler 的通用接口，任何自我构建的 two-column TERM2GENE 都可以做超几何检验。",
      "universe 一定要设成你实际检测到的基因（例如 RNA-seq 里表达量足够的所有基因），不设会让所有通路虚高显著。",
      "STRINGdb 的 score_threshold 400 代表中等置信度，想更严格可以提到 700。"
    ],
    pitfalls: [
      "STRINGdb 初始化时会要求下载物种的别名文件，离线机器要提前准备好本地数据目录。",
      "化学物集合大小悬殊，基因数很小（比如 3 个）的化学物很容易撞显著性，必须设 minGSSize 下限。",
      "geneID 是斜杠分隔的拼接字符串，后续处理要先 strsplit 拆开，不然会得到一堆奇怪的列名。"
    ],
    next: ["tox-01", "tox-03", "bulk-08"]
  },
  {
    id: "tox-03",
    track: "tox",
    trackName: "网络毒理学与暴露组",
    title: "化学物-基因-疾病三元网络的构建与可视化",
    level: "高级",
    tags: ["igraph","ggraph","网络分析","hub基因"],
    packages: ["igraph","tidygraph","ggraph","dplyr","readr"],
    scene: "想把「化学物 → 靶基因 → 疾病表型」的关系画成一张网络图，并计算拓扑参数（度、介数、模块）找出核心靶点。",
    code: `library(igraph)
library(tidygraph)
library(ggraph)
library(dplyr)
library(readr)
# 1) 读入两张边表：化学物-基因、基因-疾病（后者可从 CTD chem_disease / gene_disease 得到）
edge_cg <- readr::read_csv("data/processed/ctd_chem_gene_edges.csv", show_col_types = FALSE)
edge_gd <- readr::read_csv("data/processed/ctd_gene_disease_edges.csv", show_col_types = FALSE)
# 2) 统一列名并给边赋予类型，方便后续按类型着色
edges <- dplyr::bind_rows(
  edge_cg |> dplyr::transmute(from = ChemicalName, to = GeneSymbol, type = "chemical-gene"),
  edge_gd |> dplyr::transmute(from = GeneSymbol,   to = DiseaseName, type = "gene-disease")
) |>
  dplyr::filter(!is.na(from), !is.na(to), from != "", to != "")
# 3) 节点表：显式声明每个节点的类别
nodes <- dplyr::bind_rows(
  data.frame(name = unique(edges$from), stringsAsFactors = FALSE),
  data.frame(name = unique(edges$to),   stringsAsFactors = FALSE)
) |>
  dplyr::distinct() |>
  dplyr::mutate(category = dplyr::case_when(
    name %in% edge_gd$DiseaseName ~ "Disease",
    name %in% edge_cg$ChemicalName ~ "Chemical",
    TRUE ~ "Gene"
  ))
# 4) 构建 igraph 对象并根据节点类别排除非法边（避免基因-基因被误连）
g <- igraph::graph_from_data_frame(d = edges, directed = FALSE, vertices = nodes)
igraph::E(g)$weight <- 1
# 5) 拓扑参数：degree、betweenness 是找 hub gene 最常用的两个指标
igraph::V(g)$degree       <- igraph::degree(g)
igraph::V(g)$betweenness  <- round(igraph::betweenness(g, normalized = TRUE), 4)
igraph::V(g)$closeness    <- igraph::closeness(g, normalized = TRUE)
hub <- igraph::as_data_frame(g, what = "vertices") |>
  dplyr::filter(category == "Gene") |>
  dplyr::arrange(dplyr::desc(degree)) |>
  dplyr::slice_head(n = 20)
readr::write_csv(hub, "results/tables/TableS14_network_hub_genes.csv")
# 6) 出图：三种布局任选，fruchterman-reingold 适合中小规模网络
set.seed(1234)
p <- ggraph::ggraph(g, layout = "fr") +
  ggraph::geom_edge_link(ggplot2::aes(edge_colour = type), alpha = 0.4,
                         show.legend = FALSE) +
  ggraph::geom_node_point(ggplot2::aes(size = degree, fill = category),
                          shape = 21, colour = "white") +
  ggraph::geom_node_text(ggplot2::aes(label = name), repel = TRUE, size = 2.5) +
  ggplot2::scale_size_continuous(range = c(2, 8)) +
  ggplot2::theme_void() +
  ggplot2::theme(legend.position = "right")
ggplot2::ggsave("results/figures/Fig4_tox_network.pdf", p, width = 8, height = 6)`,
    notes: [
      "ggraph 走的是 grammar of graphics 语法：geom_edge_* 画边、geom_node_* 画点，比 base igraph plot 更容易定制。",
      "degree（连接数）直观但不区分重要性，betweenness（介数）能找出位于不同模块之间起到桥梁作用的基因。",
      "网络规模超过几百个节点时几乎看不清标签，应该先做子网络（例如只保留 hub 及其直接邻居）再出图。"
    ],
    pitfalls: [
      "graph_from_data_frame 会把 nodes 表里出现的所有行都当节点，重复行会导致节点数暴涨，必须先 distinct。",
      "layout = 'fr' 每次跑都有随机性，要固定随机种子，否则两次导出的图形完全对不上。",
      "双向绑定树或存在自环（from == to）时某些 layout 会报错，建图前先过滤。"
    ],
    next: ["tox-02", "drug-01", "viz-04"]
  },
  {
    id: "drug-01",
    track: "drug",
    trackName: "药物重定位与分子对接数据",
    title: "DGIdb 药物-基因互作数据整理与 DEG 反向匹配",
    level: "基础",
    tags: ["DGIdb","药物靶点","重定位","网络"],
    packages: ["data.table","dplyr","readr","DT"],
    scene: "想从差异基因里找哪些是可以被已有药物 targeting 的靶点，为后续老药新用（drug repurposing）提供候选列表。",
    code: `# 数据来源：DGIdb https://www.dgidb.org/downloads （interactions.tsv）
library(data.table)
library(dplyr)
library(readr)
# 1) 读入药物-基因互作表。DGIdb 每三个月更新一次，务必记录下载日期
dgi <- data.table::fread("data/raw/dgidb_interactions.tsv", sep = "\\t",
                         quote = "", fill = TRUE, showProgress = FALSE)
names(dgi)
nrow(dgi)
# 2) 通常只保留人类已批准的或明确标注的互作
dgi_h <- dgi |>
  dplyr::filter(grepl("Homo sapiens", sources_for_interaction) |
                  grepl("9606", sources_for_interaction))
# 3) 与自己的差异基因（或核心网络 hub 基因）取交集
deg <- readRDS("data/processed/deg_deseq2.rds")
targets <- deg |>
  dplyr::filter(!is.na(padj), padj < 0.05, abs(log2FoldChange) > 1) |>
  dplyr::pull(gene) |>
  unique()
hit <- dgi_h |>
  dplyr::filter(gene_name %in% targets) |>
  dplyr::select(drug_name, gene_name, interaction_claim_source,
                interaction_types, drug_concept_id)
# 4) 方向性很重要：激动剂和抑制剂的意义完全相反，必须分开统计
hit_dir <- hit |>
  dplyr::mutate(direction = dplyr::case_when(
    grepl("inhibitor", interaction_types, ignore.case = TRUE) ~ "inhibitor",
    grepl("agonist",   interaction_types, ignore.case = TRUE) ~ "agonist",
    TRUE ~ "other"
  ))
# 5) 策略：上调基因找抑制剂，下调基因找激动剂，这才是「逆转表达」的候选药
deg_dir <- deg |>
  dplyr::filter(!is.na(padj), padj < 0.05) |>
  dplyr::select(gene, log2FoldChange)
candidate <- hit_dir |>
  dplyr::left_join(deg_dir, by = c(gene_name = "gene")) |>
  dplyr::filter(direction == "inhibitor" & log2FoldChange > 1 |
                  direction == "agonist" & log2FoldChange < -1)
# 6) 按药物被命中的靶点数排序，命中的越多越值得优先做实验
rank_drug <- candidate |>
  dplyr::count(drug_name, name = "n_target") |>
  dplyr::arrange(dplyr::desc(n_target))
head(rank_drug, 20)
readr::write_csv(candidate, "results/tables/TableS15_drug_candidates.csv")
# DT::datatable(candidate)   # 在 RStudio 里交互式查看更方便`,
    notes: [
      "药物重定位的核心逻辑是「逆转疾病表达谱」：疾病里上调的基因用抑制剂，下调的基因用激动剂。",
      "DGIdb 汇总了 DrugBank、ChEMBL、TTD 等几十个来源的证据，同时保留 interaction_types 方便筛选。",
      "「有药物报道」不等于「有已上市药物」，写论文时要把 approval status 单独标注出来。"
    ],
    pitfalls: [
      "DGIdb 的 interaction_types 是一条记录里可以同时写多个类型、用词也不统一，aspirin 之类作用广泛的药物容易混进来。",
      "只按基因名匹配会漏掉别名，建议先过一遍 org.Hs.eg.db 做统一。",
      "不要直接把命中的药当作结论，这只是计算筛选，还需要做表达验证或文献支持。"
    ],
    next: ["drug-02", "drug-03", "tox-02"]
  },
  {
    id: "drug-02",
    track: "drug",
    trackName: "药物重定位与分子对接数据",
    title: "LINCS L1000 反向表达匹配（CMap 思路）",
    level: "高级",
    tags: ["LINCS","CMap","connectivity score","cmapR"],
    packages: ["cmapR","dplyr","purrr","readr","data.table"],
    scene: "想模仿 CMap 的经典做法：用自己的疾病表达签名去 LINCS L1000 里找「表达模式正好相反」的小分子，从而得到候选治疗方案。",
    code: `# 数据来源：CLUE https://clue.io/data/CMap2020#LINCS2020 （需注册下载 gctx）
library(cmapR)
library(dplyr)
library(purrr)
library(readr)

# 1) 读入 LINCS level 5 的差异表达谱（行是基因，列是扰动签名）
hist_file   <- "data/raw/LINCS/lincs_gene_info.txt.gz"
l5_file     <- "data/raw/LINCS/LINCS2020_LDS_allINST.gctx"
sample_meta <- data.table::fread("data/raw/LINCS/sig_info.txt.gz")

# 2) 精简读入：只取我们关心的 gene 空间，gctx 文件太大不能全量加载
gene_info <- data.table::fread(hist_file)
rids_use  <- gene_info$pr_gene_id[gene_info$pr_is_lm == 1]   # landmark 基因约 978 个

cid_sel <- sample_meta$sig_id[sample_meta$pert_type == "trt_cp" &
                                sample_meta$cmap_name != ""]
ds_sub  <- cmapR::parse_gctx(l5_file, rid = rids_use, cid = head(cid_sel, 2000))
mat     <- ds_sub@mat        # gene x signature 的 z-score 矩阵
cdesc   <- ds_sub@cdesc      # 列注释：cell / pert_iname / dose / time

# 3) 自己的疾病签名：上调与下调基因列表
deg <- readRDS("data/processed/deg_deseq2.rds") |>
  dplyr::filter(!is.na(padj), padj < 0.05) |>
  dplyr::arrange(desc(abs(log2FoldChange)))
up_sig   <- head(deg$gene[deg$log2FoldChange >  1], 150)
down_sig <- head(deg$gene[deg$log2FoldChange < -1], 150)

# 4) 换成 ENTREZ 或 LM 基因空间后再取交集
up_use   <- intersect(up_sig,   rownames(mat))
down_use <- intersect(down_sig, rownames(mat))
# 5) connectivity score：上调基因在该药物下的 z 越低、下调基因越高，则越「反向」
score <- colMeans(mat[up_use, , drop = FALSE]) -
  colMeans(mat[down_use, , drop = FALSE])
cs_tbl <- data.frame(sig_id = names(score), score = score) |>
  dplyr::left_join(sample_meta, by = "sig_id") |>
  dplyr::arrange(score)      # 最负的说明最能逆转疾病表达
head(cs_tbl[, c("pert_iname", "cell_id", "dose_um", "pert_dose_unit", "score")], 20)
# 6) 按化合物求平均：同一药物的多个剂量/细胞系应合并后再排名
drug_rank <- cs_tbl |>
  dplyr::filter(!is.na(pert_iname)) |>
  dplyr::group_by(pert_iname) |>
  dplyr::summarise(mean_cs = mean(score), n_sig = dplyr::n()) |>
  dplyr::arrange(mean_cs)
readr::write_csv(drug_rank, "results/tables/TableS16_lincs_drug_rank.csv")`,
    notes: [
      "LINCS L1000 只实测了 978 个 landmark 基因，其余基因是通过推断补齐的，做签名交集会损失一部分信息是正常的。",
      "level 5 的数据是同一个扰动在多个批次上平均后的 moderated z-score，比 level 3 更适合直接算 connectivity。",
      "负的连接分代表该药物表达方向与疾病相反，即潜在的逆转疾病表型的候选。"
    ],
    pitfalls: [
      "gctx 文件动辄几十 GB，一定要用 rid / cid 参数做子集读取，全量读入会直接撑爆内存。",
      "基因名空间要统一：LINCS 用的是 probe id 或 Entrez，把 symbol 直接扔进去会一个都匹配不上。",
      "多个细胞系的结果不要直接平均，最好报告每个细胞系各自的结果，避免某个细胞系主导排序。"
    ],
    next: ["drug-01", "drug-03", "ml-01"]
  },
  {
    id: "drug-03",
    track: "drug",
    trackName: "药物重定位与分子对接数据",
    title: "AutoDock Vina 结果批量整理与结合能筛选",
    level: "基础",
    tags: ["分子对接","AutoDock Vina","结合能","批量解析"],
    packages: ["stringr","dplyr","purrr","ggplot2","readr"],
    scene: "用 Autodock Vina 对接了几十个配体，结果散落在各个 .pdbqt / log 文件里，需要批量提取结合能与 RMSD 并排出最有前途的几个。",
    code: `library(stringr)
library(dplyr)
library(purrr)
library(ggplot2)
# Vina 的输出样例行：
# REMARK VINA RESULT:    -8.3      0.000      0.000
# 第二列是结合能(kcal/mol)，后两列是下界与上界的 RMSD
extract_vina <- function(file) {
  lines <- readLines(file, warn = FALSE)
  hits  <- grep("^REMARK VINA RESULT", lines, value = TRUE)
  if (length(hits) == 0) return(NULL)
  m <- stringr::str_match(hits,
        "REMARK VINA RESULT:\\\\s+(-?[0-9.]+)\\\\s+([0-9.]+)\\\\s+([0-9.]+)")
  data.frame(
    ligand    = tools::file_path_sans_ext(basename(file)),
    mode      = seq_len(nrow(m)),
    affinity  = as.numeric(m[, 2]),
    rmsd_lb   = as.numeric(m[, 3]),
    rmsd_ub   = as.numeric(m[, 4])
  )
}
files <- list.files(path = "data/raw/vina_results",
                    pattern = "\\\\.pdbqt$", full.names = TRUE)
message("待处理对接结果文件数：", length(files))
vina_all <- purrr::map_dfr(files, ~ purrr::possibly(extract_vina, NULL)(.x))
stopifnot(!is.null(vina_all), nrow(vina_all) > 0)
# 1) 每个配体取其最佳构象（结合能最低）
best <- vina_all |>
  dplyr::group_by(ligand) |>
  dplyr::slice_min(order_by = affinity, n = 1, with_ties = FALSE) |>
  dplyr::ungroup() |>
  dplyr::arrange(affinity)
# 2) 经验阈值：小于 -7 kcal/mol 通常被认为有较好结合活性
best <- best |>
  dplyr::mutate(qc = dplyr::case_when(
    affinity <= -8   ~ "strong",
    affinity <= -7   ~ "moderate",
    TRUE             ~ "weak"
  ))
table(best$qc)
# 3) 一致性检查：好的对接结果里前几个 mode 的结合能应当相差不大，且 rmsd 较小
spread <- vina_all |>
  dplyr::group_by(ligand) |>
  dplyr::summarise(top1 = min(affinity),
                   top3 = sort(affinity)[3],
                   max_rmsd_ub = max(rmsd_ub), .groups = "drop") |>
  dplyr::mutate(convergence_ok = (top3 - top1) < 1.0 & max_rmsd_ub < 2.0)
best %>% dplyr::left_join(spread, by = "ligand") -> best_rich
readr::write_csv(best_rich, "results/tables/TableS17_vina_summary.csv")
# 4) 可视化：把命中靶点的结合能排序画成柱状图
p <- ggplot2::ggplot(dplyr::filter(best, affinity <= -7),
                     ggplot2::aes(x = stats::reorder(ligand, affinity),
                                  y = affinity, fill = qc)) +
  ggplot2::geom_col(width = .7) +
  ggplot2::geom_hline(yintercept = -8, linetype = "dashed", colour = "grey40") +
  ggplot2::coord_flip() +
  ggplot2::theme_classic(base_size = 11) +
  ggplot2::labs(x = NULL, y = "Binding affinity (kcal/mol)")
ggplot2::ggsave("results/figures/Fig5_vina_ranking.pdf", p,
                width = 6, height = 0.25 * nrow(dplyr::filter(best, affinity <= -7)) + 2)`,
    notes: [
      "AutoDock Vina 的结合能是经验打分函数的估计值，一般 -7 kcal/mol 以下算有结合、-8 以下算结合较好，但不能当作真实解离常数。",
      "每个配体输出多个 pose，默认第一个就是最优构象；把多个 mode 的分布也存下来能判断收敛性。",
      "同一个口袋多次对接（不同随机种子）结果如果差异超过 1 kcal/mol，说明参数设置或构象采样不足。"
    ],
    pitfalls: [
      "pdbqt 里 VINA RESULT 行格式为固定宽度解析，正则写成 \\\\s+ 比按字符位置切分更稳健。",
      "文件路径带空格或中文时 list.files 仍能处理，但传给外部程序要用 shQuote 包一层。",
      "对接不代表真实结合，务必配合分子动力学模拟或体外实验，投稿时不该把纯打分当作主要证据。"
    ],
    next: ["drug-01", "tox-03", "viz-01"]
  },
  {
    id: "ml-01",
    track: "ml",
    trackName: "机器学习与生存建模",
    title: "LASSO Cox 回归筛选预后基因并构建风险评分",
    level: "进阶",
    tags: ["LASSO","glmnet","Cox","交叉验证","风险评分"],
    packages: ["glmnet","survival","dplyr","ggplot2"],
    scene: "手里有几十到几百个候选基因，想用 LASSO 惩罚 Cox 模型压缩到十几个关键基因，并给每个样本算一个连续的风险评分。",
    code: `library(glmnet)
library(survival)
library(dplyr)
library(ggplot2)
expr <- readRDS("data/processed/normalized_matrices.rds")$tpm
surv <- readRDS("data/processed/surv_df.rds")       # 含 time, status, sample_id
cand <- readRDS("data/processed/pseudobulk_deg.rds") |>
  dplyr::filter(padj < 0.05) |>
  dplyr::pull(gene) |>
  unique()
# 1) 构造模型矩阵：行是样本、列是基因， COX 需要 x 与 censored y
common <- intersect(surv$sample_id, colnames(expr))
x <- t(expr[intersect(cand, rownames(expr)), common])
x <- x[surv$sample_id[match(common, surv$sample_id)], , drop = FALSE]
y <- survival::Surv(surv$time, surv$status)
head(x[, 1:3]); print(head(y, 3))
# 2) 交叉验证找最优 lambda：type.measure = "C" 用 Harrell C 作为准则
set.seed(2024)
cvfit <- glmnet::cv.glmnet(x, y, family = "cox", alpha = 1, nfolds = 10,
                           standardize = TRUE, type.measure = "C")
plot(cvfit)
cvfit$lambda.min; cvfit$lambda.1se
# 3) 两个 lambda 的取舍：模型更精简用 1se，预测更准用 min
for (s in c("lambda.min", "lambda.1se")) {
  co <- coef(cvfit, s = s)
  cat(s, "选出基因数：", sum(as.vector(co) != 0), "\\n")
}
coef_min <- coef(cvfit, s = "lambda.min")
selected <- rownames(coef_min)[as.vector(coef_min) != 0]
# 4) 用选定基因重新拟合无惩罚的多因素 Cox，作为最终模型
dat_model <- data.frame(time = surv$time, status = surv$status,
                        x[, selected, drop = FALSE])
fit_final <- survival::coxph(survival::Surv(time, status) ~ ., dat_model)
summary(fit_final)
# 5) 风险评分 = 线性预测值，可直接用于后续分层
risk <- as.numeric(predict(fit_final, type = "lp"))
names(risk) <- rownames(x)
saveRDS(list(model = fit_final, genes = selected, risk = risk),
        "data/processed/lasso_cox_model.rds")
# 6) 每个基因的系数条形图，交代正负方向
coef_fig <- coef_min[selected, , drop = TRUE]
ggplot2::ggplot(data.frame(gene = names(coef_fig), beta = coef_fig),
                ggplot2::aes(stats::reorder(gene, beta), beta, fill = beta > 0)) +
  ggplot2::geom_col() + ggplot2::coord_flip() + ggplot2::theme_classic() +
  ggplot2::labs(x = NULL, y = "LASSO coefficient") +
  ggplot2::theme(legend.position = "none")`,
    notes: [
      "LASSO 的 alpha = 1 是纯 lasso，alpha = 0 是 ridge，介于两者之间是 elastic net；做特征筛选一定要用 1。",
      "lambda.1se 选出的模型更精简（交叉验证误差在一个标准误以内的最简模型），更适合讲生物学故事。",
      "存活时间和删失信息要用 Surv(time, status) 包装起来，直接把 status 当连续因变量会得到无意义的结果。"
    ],
    pitfalls: [
      "x 必须是数值矩阵且不含 NA，基因全是不表达导致的全零列会让 glmnet 报错。",
      "cross-validation 有随机性，必须设 seed 且报告 nfold，否则别人复现不了你的 lambda。",
      "从 LASSO 挑出的基因再放回同一个数据集做 Cox 会高估效能，严格的做法需要在独立队列验证。"
    ],
    next: ["ml-02", "ml-03", "ml-05"]
  },
  {
    id: "ml-02",
    track: "ml",
    trackName: "机器学习与生存建模",
    title: "caret 框架下的随机森林与 SVM 特征选择",
    level: "进阶",
    tags: ["randomForest","SVM","caret","交叉验证","变量重要性"],
    packages: ["caret","dplyr","ggplot2","pROC","readr"],
    scene: "需要做分类任务（例如肿瘤 vs 癌旁、高危 vs 低危），并希望用随机森林和支持向量机交叉比较，同时得到变量重要性排序。",
    code: `library(caret)
library(dplyr)
library(ggplot2)

expr <- readRDS("data/processed/normalized_matrices.rds")$tpm
meta <- readRDS("data/processed/TCGA_LIHC_paired_meta.rds")

# 1) 构造二分类数据：行样本、列基因，标签必须命名为因子且水平顺序有意义
x <- t(expr[sample(rownames(expr), 2000), intersect(colnames(expr), meta$patient)])
lab_raw <- meta$sample_type[match(rownames(x), meta$patient)]
keepx <- !is.na(lab_raw)
x <- x[keepx, ]; lab_raw <- lab_raw[keepx]
y <- factor(ifelse(lab_raw == "Primary Tumor", "Tumor", "Normal"),
            levels = c("Normal", "Tumor"))
table(y)
# 2) 切分训练集/测试集，createDataPartition 会保持两类的比例
set.seed(2024)
tr_idx <- caret::createDataPartition(y, p = 0.7, list = FALSE)
x_tr <- x[tr_idx, ]; x_te <- x[-tr_idx, ]
y_tr <- y[tr_idx];    y_te <- y[-tr_idx]
# 3) 统一的重抽样策略：重复 5 折交叉验证 + 保留预测结果便于画 ROC
ctrl <- caret::trainControl(method = "repeatedcv", number = 5, repeats = 3,
                            classProbs = TRUE, savePredictions = "final",
                            summaryFunction = caret::twoClassSummary)
# 4) 随机森林：ntree 越大越稳定，代价是时间
rf_fit <- caret::train(x_tr, y_tr, method = "rf", metric = "ROC",
                       trControl = ctrl, tuneLength = 5, importance = TRUE)
print(rf_fit)
rf_varimp <- caret::varImp(rf_fit, scale = FALSE)
# 5) SVM 用线性核，它比高斯核更不容易过拟合，也更容易解释权重
svm_fit <- caret::train(x_tr, y_tr, method = "svmLinear2", metric = "ROC",
                        trControl = ctrl, tuneLength = 5)
# 6) 测试集上比较：cross-validation 的 AUC 往往偏乐观
p_rf  <- predict(rf_fit,  x_te, type = "prob")[, "Tumor"]
p_svm <- predict(svm_fit, x_te, type = "prob")[, "Tumor"]
cm <- caret::confusionMatrix(predict(rf_fit, x_te), y_te)
print(cm)
pROC::auc(pROC::roc(y_te, p_rf))
pROC::auc(pROC::roc(y_te, p_svm))
# 7) 取重要性 top 20 的基因，与 LASSO 结果取交集更稳
top_imp <- data.frame(gene = rownames(rf_varimp$importance)) |>
  dplyr::mutate(importance = rf_varimp$importance[[1]]) |>
  dplyr::arrange(dplyr::desc(importance)) |>
  dplyr::slice_head(n = 20)
readr::write_csv(top_imp, "results/tables/TableS18_RF_varImportance.csv")`,
    notes: [
      "caret 的价值在于把几十种算法统一成 train() 一个接口，换算法只需要改 method 参数。",
      "classProbs = TRUE 加上 twoClassSummary 才能用 ROC 而不是 Accuracy 来挑超参数，样本不均衡时尤其重要。",
      "随机森林的变量重要性有两种口径：基于不纯度下降的和基于置换的，后者更可靠但更慢。"
    ],
    pitfalls: [
      "y 的水平顺序决定 predict prob 的列名，写错会取到错误的概率列。",
      "必须在训练集之外留出独立测试集，否则 reported AUC 等于在高估的成绩。",
      "基因数远大于样本数时 SVM 容易过拟合，先用 LASSO 或方差过滤降到几百个特征再进去。"
    ],
    next: ["ml-01", "ml-03", "viz-01"]
  },
  {
    id: "ml-03",
    track: "ml",
    trackName: "机器学习与生存建模",
    title: "ROC 曲线、AUC 计算与时间依赖 ROC（timeROC）",
    level: "进阶",
    tags: ["ROC","AUC","pROC","timeROC","生存结局"],
    packages: ["pROC","timeROC","survival","dplyr","ggplot2"],
    scene: "构建了一个连续型的风险评分或生物标志物，需要给出 AUC 及其置信区间，并回答「预测 3 年生存能力如何」这类时间相关问题。",
    code: `library(pROC)
library(timeROC)
library(survival)
library(dplyr)

# 场景说明：一组样本有两个候选指标（风险评分 riskscore、某基因表达 gsva）
dat <- readRDS("data/processed/prognostic_dat.rds")   # 含 time, status, riskscore, gene_x
head(dat)

# ---------- 一、普通 ROC（二分类结局） ----------
# 只保留status 明确的样本，用 AUC 反映单项指标的判别能力
roc_score <- pROC::roc(response = dat$status, predictor = dat$riskscore,
                       quiet = TRUE, ci = TRUE, auc.polygon = TRUE)
pROC::auc(roc_score)
pROC::ci.auc(roc_score, method = "bootstrap", boot.n = 1000)

# 多指标模型比较：两种相关型 ROC 的检验差异
roc_gene  <- pROC::roc(dat$status, dat$gene_x, quiet = TRUE)
pROC::roc.test(roc_score, roc_gene, method = "delong")

pROC::ggroc(list(RiskScore = roc_score, GeneX = roc_gene), legacy.axes = TRUE) +
  ggplot2::geom_segment(ggplot2::aes(x = 0, y = 0, xend = 1, yend = 1),
                        linetype = "dashed", colour = "grey60") +
  ggplot2::theme_classic(base_size = 12)

# ---------- 二、时间依赖 ROC（结局含删失） ----------
# timeROC 的 cause 必须与 status 里代表事件的取值一致，通常 1 = 死亡
tr <- timeROC::timeROC(T = dat$time, delta = dat$status,
                       marker = dat$riskscore,
                       cause = 1,               # 1 代表关心的结局（死亡）
                       weighting = "marginal",  # 考虑删失的边际 KM 加权
                       times = c(365, 1095, 1825),
                       ROC = TRUE, iid = TRUE)
tr$AUC
timeROC::confint(tr, level = 0.95)$CI_AUC
timeROC::confint(tr, level = 0.95)$CB_AUC

# 4) 输出每个时间点的 AUC 表格，用于 manuscript
auc_tab <- data.frame(time_day = tr$times, AUC = as.numeric(tr$AUC))
print(auc_tab)

# 5) 把整条 timeROC 曲线画出来
plot(tr, time = 1095, col = "#e6550d", lwd = 2,
     title = FALSE, legacy.axes = TRUE, grid = TRUE)`,
    notes: [
      "普通 ROC 忽略随访时间，对生存数据不合适；timeROC 处理的正是「在某时间点之前是否发生事件」的判别问题。",
      "timeROC 的 weighting = marginal 使用 Kaplan-Meier 逆概率加权来处理删失，是体外验证的标准做法。",
      "AUC 在 0.7-0.8 之间算中等判别力，超过 0.85 在真实世界数据里很罕见，遇到异常高值要回头查数据泄漏。"
    ],
    pitfalls: [
      "status 里 0/1 的含义各个数据库定义相反，TCGA 的 vital_status 为 Deceased 才对应事件，务必核对。",
      "iid = TRUE 才能算置信区间，但会显著变慢，样本上千时建议先 iid = FALSE 探路。",
      "用同一个数据集构建 marker 又评估 AUC 会严重高估，理想是用独立验证队列或至少做交叉验证。"
    ],
    next: ["ml-01", "ml-04", "ml-05"]
  },
  {
    id: "ml-04",
    track: "ml",
    trackName: "机器学习与生存建模",
    title: "多因素 Cox 回归与森林图绘制",
    level: "进阶",
    tags: ["Cox","森林图","broom","多因素","HR"],
    packages: ["survival","broom","dplyr","purrr","ggplot2","readr"],
    scene: "要证明某个风险评分或基因表达在校正了年龄、分期、分级之后依然是独立预后因素，需要多因素 Cox 与一张森林图。",
    code: `library(survival)
library(broom)
library(dplyr)
library(ggplot2)
dat <- readRDS("data/processed/prognostic_dat.rds")   # time, status + 临床 + riskscore
str(dat)
# 1) 先把要校正的临床变量处理成合适的形式
dat <- dat |>
  dplyr::mutate(
    age_group = factor(dplyr::case_when(age < 60 ~ "less than 60",
                                        TRUE      ~ "60 and above"),
                       levels = c("less than 60", "60 and above")),
    stage = factor(stage),
    grade = factor(grade)
  )
# 2) 单因素 Cox 先过一遍，筛出真正有希望的变量
formula_uni <- list(
  age = "Surv(time, status) ~ age",
  stage = "Surv(time, status) ~ stage",
  riskscore = "Surv(time, status) ~ riskscore"
)
uni_res <- purrr::map_dfr(formula_uni, function(fstring) {
  fit <- survival::coxph(stats::as.formula(fstring), data = dat)
  broom::tidy(fit, exponentiate = TRUE, conf.int = TRUE) |>
    dplyr::mutate(f = fstring)
}, .id = "name")
# 3) 多因素 Cox：把候选变量一起放进去，看谁还独立
fit_multi <- survival::coxph(
  survival::Surv(time, status) ~ age_group + stage + grade + riskscore,
  data = dat)
summary(fit_multi)
# 4) 整理成森林图需要的数据框：exp(coef) 是 HR，exponentiate 会自动给平方
tab_multi <- broom::tidy(fit_multi, exponentiate = TRUE, conf.int = TRUE) |>
  dplyr::filter(term != "(Intercept)") |>
  dplyr::mutate(sig = ifelse(p.value < 0.05, "Yes", "No"))
print(tab_multi)
# 5) 画森林图：HR = 1 的参考线是灵魂
p <- ggplot2::ggplot(tab_multi,
                     ggplot2::aes(x = estimate, y = stats::reorder(term, estimate))) +
  ggplot2::geom_vline(xintercept = 1, linetype = "dashed", colour = "grey50") +
  ggplot2::geom_errorbarh(ggplot2::aes(xmin = conf.low, xmax = conf.high),
                          height = 0.15, linewidth = 0.6) +
  ggplot2::geom_point(size = 2.5, shape = 22, fill = "#4d4d4d") +
  ggplot2::scale_x_log10() +
  ggplot2::labs(x = "Hazard Ratio (95% CI)", y = NULL) +
  ggplot2::theme_classic(base_size = 12)
ggplot2::ggsave("results/figures/Fig6_cox_forest.pdf", p, width = 5.5, height = 3.5)
readr::write_csv(tab_multi, "results/tables/TableS19_multivariate_cox.csv")`,
    notes: [
      "exponentiate = TRUE 让 broom 直接返回 HR 而不是原始系数，95% CI 也同时做了指数变换。",
      "森林图的横轴用对数刻度（scale_x_log10）才能让向上/向下相同倍数的效应视觉对称。",
      "单因素显著而多因素不显著的变量，通常是被其它变量（多半是分期）所解释，这本身就是有价值的结论。"
    ],
    pitfalls: [
      "分类变量的第一个水平是参考水平，务必确认它是不是你想要的那个参照组。",
      "有 NA 的 Covariate 会导致该样本的整行被无声剔除，多因素模型的样本数常常悄悄变少。",
      "变量太多（比如十个基因同时进模型）时 Cox 会因过拟合给出荒谬的 HR，先做降维再拟合。"
    ],
    next: ["ml-01", "ml-05", "viz-02"]
  },
  {
    id: "ml-05",
    track: "ml",
    trackName: "机器学习与生存建模",
    title: "最佳切点分组、生存曲线与风险三联图",
    level: "基础",
    tags: ["survminer","KM曲线","最佳切点","surv_cutpoint"],
    packages: ["survminer","survival","dplyr","readr","patchwork"],
    scene: "有了连续型风险评分，想用数据驱动的方式（而不是人为二分）把样本分成高危/低危两组，画出带 p 值和风险表的 KM 曲线。",
    code: `library(survminer)
library(survival)
library(dplyr)

dat <- readRDS("data/processed/prognostic_dat.rds")
dat$time_year <- dat$time / 365        # 换算成以年为单位的随访时间

# 1) 用 maximally selected rank statistics 找最佳切点，避免主观二分
res_cut <- survminer::surv_cutpoint(dat, time = "time", event = "status",
                                    variables = "riskscore",
                                    minprop = 0.2)
summary(res_cut)
plot(res_cut, palette = "npg")         # 最大值越尖锐说明切点越明确

# 2) 按切点把连续变量变成分类变量
res_cat <- survminer::surv_categorize(res_cut)
table(res_cat$riskscore)
head(res_cat[, c("time_year", "status", "riskscore")])

# 3) 生存拟合与 log-rank 检验
fit <- survival::survfit(survival::Surv(time_year, status) ~ riskscore,
                         data = res_cat)
survival::survdiff(survival::Surv(time_year, status) ~ riskscore, data = res_cat)

# 4) 标准三联图：KM 曲线 + 风险人数表 + 累积事件数
p <- survminer::ggsurvplot(
  fit, data = res_cat,
  pval = TRUE, pval.method = TRUE,
  conf.int = TRUE, risk.table = TRUE, ncensor.plot = FALSE,
  tables.height = 0.25,
  palette = c("#00AFBB", "#E7B800"),
  xlab = "Time (years)", ylab = "Overall survival",
  legend.title = "Risk group", legend.labs = c("Low", "High"),
  break.time.by = 1, surv.scale = "percent"
)
# 4b) 单独提取其中的两个 ggplot 图层，方便自定义排布
p$plot      # KM 曲线本身
p$table     # 下方的 at-risk 人数表

# 5) 导出矢量图：用 patchwork 把曲线与人数表上下拼合
library(patchwork)
ggplot2::ggsave("results/figures/Fig7_KM_riskgroup.pdf",
                p$plot / p$table + patchwork::plot_layout(heights = c(2.5, 1)),
                width = 6, height = 6)
readr::write_csv(res_cat, "results/tables/TableS20_risk_group.csv")`,
    notes: [
      "surv_cutpoint 用最大对数秩统计量找切点，属于有监督的 dichotomization，比按中位数二分更有统计依据。",
      "风险人数表（numbers at risk）是 KM 图的标配，没有它读者无法判断尾部估计是否可靠。",
      "p 值只说明两组曲线有差异，不代表模型预测力强；搭配 AUC 和风险评分分布图才算完整。"
    ],
    pitfalls: [
      "最佳切点是在当前数据集上挑选的，会高估区分度，外部验证时切点不一定成立。",
      "follow-up 时间单位搞错（天 vs 月 vs 年）会让 KM 图的时间轴完全不可信。",
      "样本量少于 50 时分出的高水平组可能只有几个人，KM 图尾部的置信区间会宽到没有意义。"
    ],
    next: ["ml-01", "ml-03", "viz-02"]
  },
  {
    id: "viz-01",
    track: "viz",
    trackName: "统计作图与可视化",
    title: "箱线图、小提琴图与配对图的正确画法",
    level: "基础",
    tags: ["ggplot2","箱线图","小提琴图","配对箱线图","显著性标注"],
    packages: ["ggplot2","ggpubr","ggsignif","dplyr"],
    scene: "要比较两个或多个组的某指标（基因表达、免疫评分、临床指标），并且样本之间是配对设计，需要一张符合期刊规范的图。",
    code: `library(ggplot2)
library(ggpubr)
library(ggsignif)
library(dplyr)

# 示例数据：gene expression per sample with group and patient id
dat <- readRDS("data/processed/gene_group_dat.rds")   # value, group, patient
str(dat)

# 1) 箱线图 + 抖动点：这是最推荐的默认形式
p1 <- ggplot2::ggplot(dat, ggplot2::aes(group, value, fill = group)) +
  ggplot2::geom_boxplot(width = 0.55, outlier.shape = NA, alpha = 0.65) +
  ggplot2::geom_jitter(width = 0.12, size = 1.4, alpha = 0.7) +
  ggplot2::scale_fill_manual(values = c("#4DBBD5FF", "#E64B35FF")) +
  ggplot2::theme_classic(base_size = 13) +
  ggplot2::labs(x = NULL, y = "Expression (log2 TPM)") +
  ggplot2::theme(legend.position = "none")
p1

# 2) 小提琴 + 内嵌箱线图：想同时展示分布形状和分位数时用
p2 <- ggplot2::ggplot(dat, ggplot2::aes(group, value, fill = group)) +
  ggplot2::geom_violin(trim = FALSE, alpha = 0.5) +
  ggplot2::geom_boxplot(width = 0.15, fill = "white", outlier.shape = NA) +
  ggplot2::theme_classic(base_size = 13) +
  ggplot2::theme(legend.position = "none")
p2
# 3) 配对设计必须画连线，否则把最强的统计学证据丢掉了
p3 <- ggplot2::ggplot(dat, ggplot2::aes(group, value, group = patient)) +
  ggplot2::geom_line(colour = "grey70", linewidth = 0.4) +
  ggplot2::geom_point(size = 2, ggplot2::aes(colour = group)) +
  ggplot2::theme_classic(base_size = 13) +
  ggplot2::labs(x = NULL, y = "Expression (log2 TPM)")
p3
# 4) 加显著性标注：map_signif_level 会把 p 自动换成星号
p4 <- p1 +
  ggsignif::geom_signif(comparisons = list(c("Normal", "Tumor")),
                        test = "wilcox.test", textsize = 5,
                        map_signif_level = TRUE, tip_length = 0.01,
                        vjust = 0.1)
p4
# 5) 配对数据的 Wilcoxon 结果与图一致，一并写进图注
ggpubr::compare_means(value ~ group, data = dat, method = "wilcox.test",
                      paired = TRUE, group.by = "group")
ggplot2::ggsave("results/figures/Fig8_group_compare.pdf", p1,
                width = 3.2, height = 3.4, units = "in", dpi = 300)`,
    notes: [
      "箱线图默认会把超过 1.5 IQR 的点画成异常值，再叠加抖动点就会重复，所以要把 outlier.shape 设为 NA。",
      "配对数据必须用连线或前后箭头表达，因为配对检验的效能来自「同一个患者的差值」，图上看不出来等于浪费设计。",
      "小提琴图的信息量最大但需要足够的样本量，每个组少于 10 个样本时核密度估计会很不稳定。"
    ],
    pitfalls: [
      "geom_jitter 的 width 太大会让点跑到另一个组的位置上，宁小勿大。",
      "显著性标注的默认 y 位置经常压到数据上，用 y_position 参数手工抬高一截。",
      "不要用两个不同 y 轴的图表达两组不可比的量纲，拆成两张并列面板更诚实。"
    ],
    next: ["viz-02", "viz-04", "bulk-07"]
  },
  {
    id: "viz-02",
    track: "viz",
    trackName: "统计作图与可视化",
    title: "相关性矩阵计算与热图展示",
    level: "基础",
    tags: ["相关性","corrplot","热图","ComplexHeatmap"],
    packages: ["corrplot","RColorBrewer","dplyr","ggplot2"],
    scene: "想展示几十个基因（或免疫细胞)两两之间的相关性结构，需要一张带相关系数与显著性标记的热图。",
    code: `library(corrplot)
library(RColorBrewer)
library(dplyr)

expr <- readRDS("data/processed/normalized_matrices.rds")$tpm
genes_use <- c("TP53", "BAX", "CDKN1A", "GADD45A", "MDM2", "ATM",
               "CD68", "C1QA", "CD8A", "PECAM1")
genes_use <- intersect(genes_use, rownames(expr))

# 1) 计算相关性矩阵：数据不服从正态时 Spearman 更稳健
M <- cor(t(expr[genes_use, ]), method = "spearman", use = "pairwise.complete.obs")
dim(M); range(M)

# 2) corrplot 可以同时给出系数矩阵与显著性矩阵
test_res <- corrplot::cor.mtest(t(expr[genes_use, ]), conf.level = 0.95)
p_mat <- test_res$p

corrplot::corrplot(M, method = "color", type = "upper", order = "hclust",
                   tl.col = "black", tl.srt = 45, tl.cex = 0.9,
                   col = RColorBrewer::brewer.pal(n = 8, name = "RdBu") |> rev(),
                   addCoef.col = "black", number.cex = 0.6,
                   insig = "blank", p.mat = p_mat, sig.level = 0.05,
                   mar = c(0, 0, 1, 0))

# 3) 只想给显著相关的格子加星号时，把 addCoef 关掉改画 "*"
corrplot::corrplot(M, method = "square", type = "full", tl.cex = 0.85,
                   addCoefasPercent = FALSE, insig = "label_sig",
                   p.mat = p_mat, sig.level = c(.001, .01, .05),
                   pch.cex = 0.9, pch.col = "black")

# 4) 想完全掌控外观时用 ggplot 重画：先把矩阵摊成三列表
cor_long <- expand.grid(gene_a = rownames(M), gene_b = colnames(M),
                        KEEP.OUT.ATTRS = FALSE)
cor_long$r <- as.vector(M)
cor_long$p <- as.vector(p_mat)
cor_long <- cor_long |>
  dplyr::mutate(sig = ifelse(!is.na(p) & p < 0.05, "*", ""))
p <- ggplot2::ggplot(cor_long, ggplot2::aes(gene_a, gene_b, fill = r)) +
  ggplot2::geom_tile(colour = "white") +
  ggplot2::geom_text(ggplot2::aes(label = sig), size = 3) +
  ggplot2::scale_fill_distiller(palette = "RdBu", limits = c(-1, 1)) +
  ggplot2::coord_equal() +
  ggplot2::theme_minimal(base_size = 11) +
  ggplot2::theme(axis.text.x = ggplot2::element_text(angle = 45, hjust = 1))
ggplot2::ggsave("results/figures/Fig9_corr_heatmap.pdf", p, width = 5, height = 4.5)`,
    notes: [
      "相关性不等于因果，基因共表达经常是因为它们共同参与同一条通路或受到同一转录因子调控。",
      "corrplot 的 insig = 'blank' 会把不显著的格子留白，比把星星打满整张图更实用。",
      "type = 'upper' 只画上半个三角形，信息不重复且留出更多空间显示标签。"
    ],
    pitfalls: [
      "cor 的输入是「变量 x 样本」矩阵，表达矩阵是反着的，一定要转置，否则得到的是样本间的相关性。",
      "缺失值会让 cor 返回 NA 连锁全失败，记得设 use = 'pairwise.complete.obs'。",
      "pch / addCoef 的字体在高相关数时会糊成一团，基因超过 30 个不推荐画出具体数值。"
    ],
    next: ["viz-01", "viz-04", "bulk-09"]
  },
  {
    id: "viz-03",
    track: "viz",
    trackName: "统计作图与可视化",
    title: "富集结果可视化：条形图、气泡图与网络图",
    level: "进阶",
    tags: ["enrichplot","clusterProfiler","cnetplot","treeplot"],
    packages: ["clusterProfiler","enrichplot","ggplot2","dplyr","tibble"],
    scene: "GO/KEGG 富集已经跑完，需要挑出最能表达故事的图：主表用气泡图，涉及通路-基因关系用网络图，太多冗余 term 用树图。",
    code: `library(clusterProfiler)
library(enrichplot)
library(ggplot2)
library(dplyr)

edo <- readRDS("data/processed/enrich_GO_BP.rds")   # enrichResult 对象

# 1) 条形图：按 -log10(p.adjust) 排序，最省版面
p_bar <- enrichplot::barplot(edo, showCategory = 10) +
  ggplot2::theme_classic(base_size = 12) +
  ggplot2::labs(title = "GO Biological Process")

# 2) 气泡图：横向 GeneRatio、纵向 -log10(p.adjust)，点大小是基因计数
p_dot <- enrichplot::dotplot(edo, showCategory = 15, font.size = 10) +
  ggplot2::scale_color_gradient(low = "#2166ac", high = "#b2182b") +
  ggplot2::theme_classic(base_size = 11)

# 3) 先用 pairwise_similarity 做去冗余，再决定是否出网络图
edo_simple <- clusterProfiler::simplify(edo, cutoff = 0.7, by = "p.adjust")

# 4) cnetplot：通路与基因的二分网络，直观显示哪些基因被多个通路共享
p_net <- enrichplot::cnetplot(edo_simple, showCategory = 6,
                              node_label = "all", cex_category = 1.2,
                              color_category = "#8da0cb", color_gene = "#fc8d62")
fold_change <- readRDS("data/processed/deg_deseq2.rds") |>
  dplyr::select(gene, log2FoldChange) |>
  tibble::deframe()
p_net2 <- enrichplot::cnetplot(edo_simple, foldChange = fold_change,
                               showCategory = 6, circular = FALSE)

# 5) emapplot：把通路按基因重叠度做成网络，相似通路自动聚在一起
p_emap <- enrichplot::emapplot(clusterProfiler::pairwise_termsim(edo),
                               showCategory = 30, layout = "kk")

# 6) GSEA 结果单独一张山脊图
gse <- readRDS("data/processed/gsea_res.rds")
p_ridge <- enrichplot::ridgeplot(gse, showCategory = 12)

ggplot2::ggsave("results/figures/Fig10_enrich_dotplot.pdf", p_dot, width = 6, height = 5)
ggplot2::ggsave("results/figures/Fig10_enrich_cnet.pdf", p_net2, width = 7, height = 5)`,
    notes: [
      "气泡图的三个视觉通道可以同时表达 GeneRatio、校正后 p 值和基因计数，信息密度最高，是最受审稿人欢迎的形式。",
      "GO terms 天然高度重叠，直接画 20 个通路往往讲的是同一件事，务必先 simplify 或 pairwise_termsim。",
      "cnetplot 传 foldChange 后基因节点会染色，一眼就能看出某通路是整体上调还是下调。"
    ],
    pitfalls: [
      "enrichplot 与 clusterProfiler 的版本必须匹配，混装不同 Bioconductor 版本会报 S4 method 找不到。",
      "cnetplot 的 foldChange 必须是带基因名的数值向量，传 data.frame 会静默失效。",
      "树图/网络图节点过多时会完全看不清，showCategory 一般控制在 10 以内。"
    ],
    next: ["bulk-08", "viz-04", "tox-02"]
  },
  {
    id: "viz-04",
    track: "viz",
    trackName: "统计作图与可视化",
    title: "patchwork 组合图、ggsci 配色与投稿级导出",
    level: "进阶",
    tags: ["patchwork","ggsci","拼图","配色","导出"],
    packages: ["patchwork","ggsci","ggplot2","dplyr"],
    scene: "需要把 4-6 张子图拼成 Figure 3，加上 A/B/C 分图标签、统一图例并一次性导出 300 dpi 的矢量图。",
    code: `library(ggplot2)
library(patchwork)
library(ggsci)

p1 <- readRDS("data/processed/fig_p1.rds")
p2 <- readRDS("data/processed/fig_p2.rds")
p3 <- readRDS("data/processed/fig_p3.rds")
p4 <- readRDS("data/processed/fig_p4.rds")

# 1) ggsci 提供各大期刊的配色：NPG / AAAS / NEJM / Lancet / JAMA
p1 <- p1 + ggsci::scale_color_npg(name = NULL)
p2 <- p2 + ggsci::scale_fill_aaas(name = NULL)
p3 <- p3 + ggsci::scale_color_lancet(name = NULL)

# 2) patchwork 的运算符：并排 | ，上下 / ，嵌套用括号
layout <- (p1 | p2) / (p3 | p4)
layout

# 3) 加 A/B/C 标签：tag_levels 支持 A / a / 1 / i
layout <- layout + patchwork::plot_annotation(
  tag_levels = "A", tag_prefix = "", tag_suffix = "",
  title = expression(bold("Figure 3"))) &
  ggplot2::theme_classic(base_size = 11)

# 4) 统一图例：guides = 'collect' 会把重复的图例合并到一侧
p1 <- p1 + ggplot2::theme(legend.position = "top")
p2 <- p2 + ggplot2::theme(legend.position = "top")
combined <- p1 + p2 + patchwork::plot_layout(guides = "collect") &
  ggplot2::theme(legend.direction = "horizontal")
combined

# 5) 控制每个子图的相对宽度，通常条形图需要更宽
(p1 + p2) + patchwork::plot_layout(widths = c(1, 2))

# 6) 导出：矢量 pdf + 位图 png 双份，graphic device 需手动打开 closed
ggplot2::ggsave("results/figures/Figure3.pdf", combined,
                width = 180, height = 120, units = "mm", device = "pdf")
ggplot2::ggsave("results/figures/Figure3.png", combined,
                width = 180, height = 120, units = "mm", dpi = 300)

# 7) 中文乱码处理：Windows 可指定字体，或导出后转 PDF
# showtext::font_add("Song", "simSun.ttf")
# ggplot2::theme(text = ggplot2::element_text(family = "Song"))`,
    notes: [
      "patchwork 的 & 运算符把主题应用到所有子图，+ 只对当前对象生效，这是最容易混的地方。",
      "ggsci 的 npg / aaas / lancet / nejm 配色都是期刊官方调色板，直接借用可以省掉挑颜色的时间。",
      "导出 pdf 用的是 pdf devices，会内嵌字体；中文写作环境建议提前配好字体或改用 Cairo 设备。"
    ],
    pitfalls: [
      "width/height 的单位默认是英寸，写 units = 'mm' 更符合期刊的版面要求。",
      "tag_levels 加的是 ggplot 的 tag，若子图本身已有标题会重叠，先用 labs(title=NULL) 清掉。",
      "Windows 下中文字体导出到 PDF 经常变成方块，最稳的做法是 showtext 注册字体，或者用 Cairo 设备。"
    ],
    next: ["viz-01", "viz-03", "writing-01"]
  },
  {
    id: "viz-05",
    track: "viz",
    trackName: "统计作图与可视化",
    title: "反制图鉴：那些让审稿人皱眉的常见画法",
    level: "基础",
    tags: ["可视化规范","柱状图陷阱","双Y轴","饼图","截断轴"],
    packages: ["ggplot2","patchwork","dplyr"],
    scene: "论文作图反反复复被打回，想系统对照「错误示范 vs 正确示范」，把常见的可视化陷阱一次性避掉。",
    code: `library(ggplot2)
library(patchwork)
library(dplyr)
set.seed(42)
dat <- data.frame(
  group = rep(c("Normal", "Tumor"), each = 30),
  value = c(rnorm(30, 5, 1.2), rnorm(30, 7.5, 2.8))
)
grp <- rep(paste0("P", 1:30), times = 2)
dat$patient <- grp
# 反例一：柱状图 + 均值标准误棒，把分布信息完全藏起来了
bad1 <- ggplot2::ggplot(dat, ggplot2::aes(group, value, fill = group)) +
  ggplot2::geom_col(ggplot2::aes(y = mean(value)), width = .6) +
  ggplot2::ggtitle("Bad: bar plot hides everything") +
  ggplot2::theme_classic() + ggplot2::theme(legend.position = "none")
good1 <- ggplot2::ggplot(dat, ggplot2::aes(group, value, fill = group)) +
  ggplot2::geom_boxplot(width = .4, outlier.shape = NA) +
  ggplot2::geom_jitter(width = .1, size = 1.2, alpha = .7) +
  ggplot2::ggtitle("Good: show the distribution") +
  ggplot2::theme_classic() + ggplot2::theme(legend.position = "none")
# 反例二：截断纵轴夸大差异
bad2 <- good1 + ggplot2::coord_cartesian(ylim = c(6.5, 8)) +
  ggplot2::ggtitle("Bad: truncated axis")
# 反例三：双 Y 轴强行把量纲不同的两件事放在一起
bad3 <- ggplot2::ggplot(dat, ggplot2::aes(patient, value)) +
  ggplot2::geom_point() +
  ggplot2::scale_y_continuous(name = "Expression",
                              sec.axis = ggplot2::sec_axis(~ . * 10, name = "Another scale")) +
  ggplot2::ggtitle("Bad: dual Y axis") + ggplot2::theme_classic()
good3 <- ggplot2::ggplot(dat, ggplot2::aes(patient, value, group = group)) +
  ggplot2::geom_line(colour = "grey70") +
  ggplot2::geom_point(ggplot2::aes(colour = group)) +
  ggplot2::facet_wrap(~ group, scales = "free_y") +
  ggplot2::ggtitle("Good: facets instead") +
  ggplot2::theme_classic() +
  ggplot2::theme(axis.text.x = ggplot2::element_blank())
# 反例四：类目过多还画饼图
pie_dat <- data.frame(cat = paste0("Term", 1:8), pct = c(35, 25, 12, 10, 8, 5, 3, 2))
bad4 <- ggplot2::ggplot(pie_dat, ggplot2::aes(x = "", y = pct, fill = cat)) +
  ggplot2::geom_col() + ggplot2::coord_polar("y") +
  ggplot2::ggtitle("Bad: too many pie slices") + ggplot2::theme_void()
good4 <- ggplot2::ggplot(pie_dat, ggplot2::aes(stats::reorder(cat, pct), pct)) +
  ggplot2::geom_col(fill = "#4DBBD5FF") + ggplot2::coord_flip() +
  ggplot2::labs(x = NULL, y = "Percentage") +
  ggplot2::ggtitle("Good: ordered bar") + ggplot2::theme_classic()
# 一次性导出对比图，组会讨论时非常好用
(bad1 | good1) / (bad4 | good4) +
  patchwork::plot_annotation(tag_levels = "A")
ggplot2::ggsave("results/figures/Fig11_bad_vs_good.pdf",
                (bad1 | good1) / (bad4 | good4), width = 10, height = 8)`,
    notes: [
      "柱状图加均值标准误棒（dynamite plot）是最常被吐槽的图：它既看不出分布也看不出异常值，样本方差的信息全部丢失。",
      "双 Y 轴会让两条曲线的相对高低变成刻意摆布的结果，同一横轴下不同量纲应该改用分面。",
      "超过 5 个类别就不要用饼图了，人的眼睛判断角度远不如判断长度准确。"
    ],
    pitfalls: [
      "coord_cartesian 缩放不会丢数据，但 coord_* 的 ylim 会直接裁掉点，两者行为完全不同。",
      "分面 scales = 'free_y' 时要写清楚是自由标度，否则读者会误以为两组绝对量纲一致。",
      "颜色超过 8 种人眼就难区分了，分类变量多时用位置或标注来区分，不要全靠颜色。"
    ],
    next: ["viz-01", "viz-04", "writing-01"]
  },
  {
    id: "writing-01",
    track: "writing",
    trackName: "可重复化排版（rmarkdown/quarto）",
    title: "用代码生成 Quarto/R Markdown 稿件并渲染中文 PDF",
    level: "基础",
    tags: ["quarto","rmarkdown","tinytex","中文PDF","CTeX"],
    packages: ["rmarkdown","quarto","tinytex","here","systemfonts","dplyr"],
    scene: "想把分析过程直接写成稿件，插图和表格自动跟上数据更新，并且要能导出含中文投稿信式的 PDF。",
    code: `library(rmarkdown)
library(tinytex)
# 0) 一遍装好 LaTeX：中文必须用 xelatex 而不是 pdflatex
if (!tinytex:::is_tinytex()) tinytex::install_tinytex()
tinytex::tlmgr_install(c("ctex", "xeCJK", "booktabs", "geometry", "fancyhdr"))
# 1) 构造 YAML 与正文。注意这里用 intToUtf8(96) 生成围栏字符，
#    避免在本文件中出现成对的反引号导致代码字符串提前结束
bt <- intToUtf8(rep(96, 3))
lines <- c(
  "---",
  "title: '差异表达的转录组机制研究'",
  "author: '某某某'",
  "date: today",
  "format:",
  "  pdf:",
  "    documentclass: ctexart",
  "    latex-engine: xelatex",
  "    fig-width: 6",
  "    fig-height: 4.5",
  "    toc: true",
  "    toc-depth: 2",
  "    number-sections: true",
  "    keep-tex: true",
  "bibliography: refs.bib",
  "---",
  "",
  paste0(bt, "{r setup, include=FALSE}"),
  "knitr::opts_chunk$set(echo = FALSE, message = FALSE, warning = FALSE,",
  "                      dev = 'cairo_pdf', fig.align = 'center')",
  "library(tidyverse)",
  bt,
  "",
  "## 背景",
  "",
  "处理引起的组织损伤是限制剂量提升的首要因素。",
  "",
  paste0(bt, "{r fig-volcano, fig.cap = '差异表达火山图', fig.width = 6}"),
  "knitr::include_graphics('results/figures/Fig1_volcano.pdf')",
  bt,
  "",
  paste0(bt, "{r tbl-deg}"),
  "readr::read_csv('results/tables/TableS2_DEG_DESeq2.csv') |>",
  "  dplyr::slice_head(n = 10) |>",
  "  knitr::kable(caption = '差异最显著的前 10 个基因')",
  bt
)
writeLines(lines, here::here("docs", "manuscript.qmd"))
# 2) 渲染：第一次会下载一些 LaTeX 包，耐心等待
quarto::quarto_render(input = here::here("docs", "manuscript.qmd"),
                      quiet = FALSE)
# 3) 如果是旧项目用 .Rmd，这条等价
rmarkdown::render(input = "docs/manuscript.Rmd",
                  output_format = "pdf_document",
                  latex_engine = "xelatex",
                  clean = FALSE)   # clean = FALSE 保留中间 tex 便于排错
# 4) 中文常见报错多半是缺字体：检查系统里有没有可用的中文字体
systemfonts::system_fonts() |>
  dplyr::filter(grepl("SimSun|Songti|Noto Sans CJK|Heiti", family)) |>
  dplyr::distinct(family)`,
    notes: [
      "中文 PDF 三件套：documentclass 用 ctexart、引擎用 xelatex、生成临时文件 keep-tex 便于排错。",
      "fig stepping：每个 chunk 用 opts_chunk 统一关掉 message 和 warning，只保留结果。",
      "keep-tex = TRUE 是排查中文乱码和包冲突的唯一路径，.tex 文件里能直接看到报错位置。"
    ],
    pitfalls: [
      "tinytex 装包要用 tlmgr_install，直接安装 MikTeX 或 TeX Live 会和 R 自己的路径打架。",
      "Windows 中文宋体缺失会让 PDF 里出现方块字，缺少字体时优先装 simsun 或改用 Adobe 字体。",
      "不要手动改动中间生成的 .tex 文件，改了也会被下次渲染覆盖。"
    ],
    next: ["writing-02", "writing-03", "viz-04"]
  },
  {
    id: "writing-02",
    track: "writing",
    trackName: "可重复化排版（rmarkdown/quarto）",
    title: "参数化报告、批量渲染与 flexdashboard 看板",
    level: "进阶",
    tags: ["参数化报告","rmarkdown::render","缓存","flexdashboard"],
    packages: ["rmarkdown","flexdashboard","purrr","dplyr"],
    scene: "同一个分析想对 20 个基因各出一份报告，或者想做一个能翻页/切换筛选的交互看板给导师看。",
    code: `library(rmarkdown)
library(flexdashboard)
library(purrr)
library(dplyr)
# ---------- 一、参数化报告 ----------
# 1) 用 draft 生成带 params 声明的模板骨架
rmarkdown::draft(file = "docs/report_template.Rmd",
                 template = "html_document", package = "rmarkdown", edit = FALSE)
# 2) 在模板的 YAML 里声明参数，正文里用 params$gene 引用：
#    params:
#      gene: "TP53"
#      cohort: "TCGA-LIHC"
genes <- c("TP53", "BAX", "CDKN1A", "GADD45A")
render_one <- function(g, cohort = "TCGA-LIHC") {
  rmarkdown::render(
    input       = "docs/report_template.Rmd",
    params      = list(gene = g, cohort = cohort),
    output_file = paste0("report_", cohort, "_", g, ".html"),
    output_dir  = "results/reports",
    envir       = new.env(),          # 独立环境，避免变量互相污染
    quiet       = TRUE
  )
}
# 3) 批量渲染：逐基因出报告，出错的基因不会中断全部任务
walk_res <- purrr::walk(genes, ~ tryCatch(render_one(.x),
                                          error = function(e) message(.x, " 失败：", e$message)))
# ---------- 二、加速：knitr 缓存 ----------
# 在 setup chunk 里加上这三行，长耗时计算只跑一次
# knitr::opts_chunk$set(cache = TRUE, cache.path = "cache/", autodep = TRUE,
#                      cache.lazy = FALSE)          # 注意 Windows 上要关掉 lazy load
# knitr::opts_chunk$set(cache.extra = file.mtime("data/processed/expr.rds"))
# ---------- 三、flexdashboard 交互看板 ----------
rmarkdown::draft(file = "docs/dash.Rmd", template = "flex_dashboard",
                 package = "flexdashboard", edit = FALSE)
# 看板的典型 chunk 写法（示意行，需粘到 dash.Rmd 里）：
# Input {.sidebar}
# selectInput("gene", "选择基因：", choices = rownames(expr))
# Column {data-width=650}
# ## 该基因在各组的表达
# renderPlot({ ggplot2::qplot(...) })
rmarkdown::run("docs/dash.Rmd")   # 本地起一个小 server 预览
# ---------- 四、同样的逻辑也可以批量出 PDF ----------
purrr::walk(genes, function(g) {
  tryCatch(rmarkdown::render("docs/report_template.Rmd",
                             params = list(gene = g),
                             output_format = "pdf_document",
                             output_file = file.path("results/reports", paste0(g, ".pdf")),
                             quiet = TRUE),
           error = function(e) NULL)
})`,
    notes: [
      "参数化是同一个分析换输入重复出结果的正确姿势，比复制 20 份 Rmd 文件更容易维护。",
      "render 的 envir = new.env() 会让每个渲染干净开始，避免上一个基因的变量泄漏到下一个报告。",
      "flexdashboard 的 three-level 结构：page > {row/column} > ### 每个图一个标题层级。"
    ],
    pitfalls: [
      "render 默认在全局环境执行，如果不指定 envir，报告里会用到控制台里残留的临时变量，别人复现不出来。",
      "cache.lazy = TRUE 在 Windows 上会锁住 .rdb 文件导致后续报错，务必设 FALSE。",
      "flexdashboard 的 selectInput 依赖 shiny 运行时，放到静态服务器上会失效，需要搭配 shiny-server 或托管服务发布。"
    ],
    next: ["writing-01", "writing-03", "rbase-06"]
  },
  {
    id: "writing-03",
    track: "writing",
    trackName: "可重复化排版（rmarkdown/quarto）",
    title: "文献检索与参考文献管理",
    level: "基础",
    tags: ["参考文献","RefManageR","easyPubMed","DOI","bib"],
    packages: ["RefManageR","rcrossref","easyPubMed","dplyr","purrr","stringr","readr"],
    scene: "写论文时需要从 PubMed/DOI 批量抓取文献信息，规范生成 .bib，并统计引用了哪些期刊、多少篇以及一些辅助表格。",
    code: `library(RefManageR)
library(rcrossref)
library(easyPubMed)
library(dplyr)
library(readr)

# ---------- 一、从 DOI 生成 bibtex ----------
dois <- c("10.1038/s41586-020-2649-2", "10.1097/hep.0000000000000245")
bib_txt <- rcrossref::cr_cn(dois = dois, format = "bibtex")   # 返回 bibentry 对象
print(bib_txt, .opts = list(style = "text", bib.style = "authoryear"))
RefManageR::WriteBib(as.BibEntry(bib_txt), "refs_auto.bib")

# ---------- 二、从 PubMed 批量检索 ----------
query <- "radiation induced liver disease[Title/Abstract] AND 2015:2024[DP]"
pm_xml <- easyPubMed::fetch_pubmed_data(pubmed_query_string = query, retmax = 200)
records <- easyPubMed::articles_to_list(pm_xml)
lit_tbl <- purrr::map_dfr(records, function(a) {
  tryCatch(easyPubMed::article_to_df(a, max_chars = -1, getAuthors = FALSE),
           error = function(e) NULL)
})
names(lit_tbl)
lit_tbl |>
  dplyr::select(title, journal, year, pmid, doi) |>
  dplyr::arrange(dplyr::desc(year)) |>
  dplyr::slice_head(n = 10)
readr::write_csv(lit_tbl, "results/tables/TableS21_literature.csv")

# ---------- 三、管理本地 bib 文件 ----------
bib <- RefManageR::ReadBib("refs.bib")
length(bib)
RefManageR::SearchBib(bib, "radiotherapy")                # 按关键词检索
RefManageR::SearchBib(bib, year > 2020 & journal = "Nature")  # 支持表达式过滤
# ---------- 四、自动生成投稿设备表：引用过的期刊统计 ----------
journal_tab <- RefManageR::as.data.frame(bib) |>
  dplyr::count(journal, sort = TRUE)
print(head(journal_tab, 10))
# ---------- 五、在 Rmd/quarto 里引用 ----------
# 正文写成 [@knoll2018] 或 @knoll2018，渲染时自动排版
# 配合 csl 文件切换期刊格式：
# https://www.zotero.org/styles （搜索目标期刊名下载 csl）
# ---------- 六、检查 bib 是否被完全引用（quarto 会提示 unused entries） ----------
refs_used <- unique(unlist(stringr::str_extract_all(
  readLines("docs/manuscript.qmd"), "@[A-Za-z0-9]+")))
refs_used <- sub("^@", "", refs_used)
setdiff(names(bib), refs_used)   # 未被正文引用的条目`,
    notes: [
      "rcrossref::cr_cn 能直接从 DOI 生成格式正确的 bibtex，比手动抄录文献信息少出错得多。",
      "easyPubMed 的 article_to_df 会把一篇文献压成一行数据框，非常适合做文献计量或快速筛选。",
      "csl 文件决定引文排版风格，中文投稿通常需要国家标准的 GB/T 7714 格式 csl。"
    ],
    pitfalls: [
      "PubMed 对短时间高频请求有限流，大批量抓取要加 Sys.sleep 缓冲。",
      "crossref 有时候会返回非标准的 journal 名缩写，最后投稿前要人工核对一遍。",
      "RefManageR 的过滤表达式里 journal = 是精确匹配，想模糊搜索要用 %~% 或 SearchBib。"
    ],
    next: ["writing-01", "writing-02", "rbase-06"]
  }
];
