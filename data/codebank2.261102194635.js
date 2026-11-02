/* 嵩山一号 · 代码库第二批：90 条 R 模板（由 _build/gen_codebank2.py 生成，勿手改） */
window.SX_CODEBANK2 = [
  {
    "id": "io-01",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "GEO 批量下载：series matrix 抓取与表达矩阵整理",
    "level": "常用",
    "tags": [
      "GEO",
      "GEOquery",
      "批量下载",
      "芯片"
    ],
    "packages": [
      "GEOquery",
      "Biobase",
      "dplyr",
      "purrr",
      "tibble"
    ],
    "scene": "手上有三五个 GSE 号要逐个下下来做验证集，不想在网页上一个个点下载、再手工拼表。",
    "code": "# ============================================================\n# 01 批量抓 GEO series matrix → 表达矩阵 + 表型表\n# ============================================================\nlibrary(GEOquery)\nlibrary(Biobase)\nlibrary(dplyr)\nlibrary(purrr)\n\ngse_ids <- c(\"GSE14520\", \"GSE76427\", \"GSE54236\")\ngeo_dir <- \"data/raw/geo\"\ndir.create(geo_dir, showWarnings = FALSE, recursive = TRUE)\n\n# 单个数据集：getGPL = FALSE 先不拉注释文件（动辄几十 MB）\nfetch_one <- function(id, dir) {\n  gset <- getGEO(id, GSEMatrix = TRUE, getGPL = FALSE,\n                 destdir = dir, AnnotGPL = FALSE)\n  # 多平台时 getGEO 返回 list，挑样本数最多的那个平台\n  if (is.list(gset)) gset <- gset[[which.max(vapply(gset, ncol, integer(1)))]]\n  ex <- Biobase::exprs(gset)\n  # 不同芯片有的存 log2、有的存原始荧光值：用最大值粗判后统一到 log2\n  if (max(ex, na.rm = TRUE) > 50) ex <- log2(ex + 1)\n  pd <- Biobase::pData(gset)\n  keep_col <- intersect(c(\"geo_accession\", \"title\", \"source_name_ch1\",\n                          \"characteristics_ch1\"), colnames(pd))\n  list(expr = ex,\n       pheno = pd[, keep_col, drop = FALSE],\n       platform = Biobase::annotation(gset))\n}\n\ngeo_list <- lapply(gse_ids, fetch_one, dir = geo_dir)\nnames(geo_list) <- gse_ids\nsaveRDS(geo_list, file.path(geo_dir, \"geo_batch.rds\"))\n\n# 一次性体检：维度、平台、标题里能否看出分组\npurrr::imap_dfr(geo_list, ~ tibble::tibble(\n  gse      = .y,\n  n_gene   = nrow(.x$expr),\n  n_sample = ncol(.x$expr),\n  platform = .x$platform,\n  title_hint = paste(head(unique(.x$pheno$title), 2), collapse = \" | \")\n)) %>% print()",
    "notes": [
      "series matrix 里的数值已经是作者上传时归一化过的，拿到后不要再跑 normalizeBetweenArrays 二次归一化。",
      "getGPL 默认 TRUE 会连注释包一起下，批量下载时先关掉，后面真正需要探针注释时再单独 getGEO(filename=)。",
      "log 判据用最大值 > 50 是经验值：芯片原始荧光强度动辄上万，log2 后一般不超过 20。"
    ],
    "pitfalls": [
      "同一个 GSE 重新下载会用 destdir 里的旧缓存，作者更新过矩阵你也不知道；怀疑数据变了就换目录或删缓存。",
      "多平台 GSE 直接 exprs(gset) 会报错 'no applicable method'，因为拿到的是 list 不是 ExpressionSet。",
      "不同 GSE 的探针 ID 体系不一样（GPL570 vs GPL96），必须先各自注释成 gene symbol 才能取交集，绝对不能按行号 merge。"
    ],
    "next": [
      "io-09",
      "bulk-11",
      "io-08"
    ]
  },
  {
    "id": "io-02",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "TCGA GDC 下载与整理：STAR-Counts 到 counts/TPM 矩阵",
    "level": "常用",
    "tags": [
      "TCGA",
      "TCGAbiolinks",
      "GDC",
      "counts"
    ],
    "packages": [
      "TCGAbiolinks",
      "SummarizedExperiment",
      "dplyr"
    ],
    "scene": "要跑 TCGA 泛癌差异分析或生存分析，第一步是把 GDC 上的 STAR-Counts 拉下来并对齐临床信息。",
    "code": "# ============================================================\n# 02 TCGA-LUAD：下载 STAR-Counts 并整理成标准三件套\n# ============================================================\nlibrary(TCGAbiolinks)\nlibrary(SummarizedExperiment)\nlibrary(dplyr)\n\nquery <- GDCquery(\n  project       = \"TCGA-LUAD\",\n  data.category = \"Transcriptome Profiling\",\n  data.type     = \"Gene Expression Quantification\",\n  workflow.type = \"STAR - Counts\",\n  sample.type   = c(\"Primary Tumor\", \"Solid Tissue Normal\")\n)\n\n# method = \"api\" 比默认的 gdc-client 省事；断了重跑会跳过已下载文件\nGDCdownload(query, directory = \"data/raw/gdc\", method = \"api\", files.per.chunk = 50)\ngdc <- GDCprepare(query, directory = \"data/raw/gdc\")\n\ncnt <- assay(gdc, \"unstranded\")        # 原始 counts，喂 DESeq2/edgeR\ntpm <- assay(gdc, \"tpm_unstrand\")      # 已按长度+测序深度归一，跨样本可比\nrownames(cnt) <- rownames(tpm) <- sub(\"\\\\..*$\", \"\", rownames(cnt))  # 去 ENSG 版本号\n\nanno <- as.data.frame(rowData(gdc))[, c(\"gene_id\", \"gene_name\", \"gene_type\")]\nanno$gene_id <- sub(\"\\\\..*$\", \"\", anno$gene_id)\n\ncli <- as.data.frame(colData(gdc))\ncli$sample16 <- substr(cli$barcode, 1, 16)   # TCGA-XX-XXXX-01A 级别\ncli$patient  <- substr(cli$barcode, 1, 12)\ncli$group    <- ifelse(cli$sample_type == \"Primary Tumor\", \"Tumor\", \"Normal\")\n\n# 只保留蛋白编码基因（做 lncRNA 就别过滤）\npc <- anno$gene_type == \"protein_coding\"\ncnt_pc <- round(cnt[pc, , drop = FALSE])\ntpm_pc <- tpm[pc, , drop = FALSE]\nrownames(cnt_pc) <- rownames(tpm_pc) <- anno$gene_name[pc]\n\n# 同一患者可能有多个 aliquot，按患者去重（保留表达中位数最高的那次）\nord <- order(cli$patient, -colSums(cnt_pc))\ncnt_pc <- cnt_pc[, ord]; tpm_pc <- tpm_pc[, ord]; cli <- cli[ord, ]\ndup <- duplicated(cli$patient)\ncnt_pc <- cnt_pc[, !dup]; tpm_pc <- tpm_pc[, !dup]; cli <- cli[!dup, ]\n\nsaveRDS(list(counts = cnt_pc, tpm = tpm_pc, coldata = cli, anno = anno),\n        \"data/processed/tcga_luad.rds\")\ntable(cli$group)",
    "notes": [
      "STAR-Counts 的 unstranded 就是基因级 read count，不需要再跑 summarizeOverlaps。",
      "TPM 与 counts 必须来自同一个 workflow（都是 STAR - Counts），混用 HTSeq-FPKM 会得到两套不可比的矩阵。",
      "临床信息在 colData 里只有最基础的字段，分期、生存时间要另外用 GDCquery_clinic(project, 'clinical') 拉。"
    ],
    "pitfalls": [
      "FPKM/TPM 不能直接喂 DESeq2，它要求整数 count，会报 'counts must be integers'。",
      "barcode 前 12 位才是 patient，用 16 位当 patient ID 会把同一患者算成多个独立样本。",
      "按 patient 去重时如果不排序，留下哪个 aliquot 是随机的，重复分析结果会漂；要固定排序规则。"
    ],
    "next": [
      "bulk-11",
      "bulk-15",
      "io-09"
    ]
  },
  {
    "id": "io-03",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "10x 三件套读取与多样本合并（Read10X）",
    "level": "常用",
    "tags": [
      "10x",
      "Read10X",
      "Seurat",
      "多样本"
    ],
    "packages": [
      "Seurat",
      "Matrix",
      "dplyr"
    ],
    "scene": "测序公司给回来的是每个样本一个 filtered_feature_bc_matrix 文件夹，要把它们读进来合成一个对象。",
    "code": "# ============================================================\n# 03 读取 10x 三件套（barcodes/features/matrix）并合并多样本\n# ============================================================\nlibrary(Seurat)\nlibrary(Matrix)\nlibrary(dplyr)\n\nsample_dirs <- c(\n  Ctrl_1  = \"data/raw/GSE188711/Ctrl_1\",\n  Ctrl_2  = \"data/raw/GSE188711/Ctrl_2\",\n  Treat_1 = \"data/raw/GSE188711/Treat_1\"\n)\nstopifnot(all(dir.exists(sample_dirs)))\n\n# gene.column = 2 取 gene symbol（=1 是 Ensembl ID，做 SCENIC/inferCNV 时更稳）\nmats <- lapply(sample_dirs, function(d) {\n  Read10X(data.dir = d, gene.column = 2, strip.suffix = TRUE)\n})\n# 先看每个样本的基因数/细胞数是否量级正常，某个样本异常低通常是路径指错了\nprint(vapply(mats, function(m) paste(dim(m), collapse = \" x \"), character(1)))\n\n# Seurat v5：直接传 list，每个样本自动成为一层 layer\nobj <- CreateSeuratObject(counts = mats, project = \"SX\", min.cells = 3, min.features = 200)\nobj$sample <- sub(\"_[ACGT]+(-\\\\d+)?$\", \"\", colnames(obj))  # 去掉 barcode 后缀\nobj$group  <- ifelse(grepl(\"Treat\", obj$sample), \"Treat\", \"Ctrl\")\n\n# 基础质控指标\nobj[[\"percent.mt\"]] <- PercentageFeatureSet(obj, pattern = \"^MT-\")\nobj[[\"percent.rb\"]] <- PercentageFeatureSet(obj, pattern = \"^RP[SL]\")\nsummary(obj$nFeature_RNA)\nsummary(obj$percent.mt)\n\n# 分层的质控阈值（不同样本线粒体比例差异很大，一刀切会误删整块细胞）\nobj <- subset(obj, subset = nFeature_RNA > 200 & nFeature_RNA < 6000 & percent.mt < 20)\nobj <- NormalizeData(obj, verbose = FALSE)\n\n# v5 里多个 layer 必须先合并，否则 FindMarkers 只在第一层里找\nobj <- JoinLayers(obj)\ntable(obj$sample)",
    "notes": [
      "gene.column = 2 得到 symbol 便于读，但重名基因会被加 -1 后缀；需要唯一 ID 的下游（SCENIC、inferCNV）建议用 gene.column = 1。",
      "min.cells = 3 会直接删掉在少于 3 个细胞中检出的基因，饿死低表达但关键的转录因子，做 TF 分析时可放宽到 1。",
      "Seurat v5 的 JoinLayers 是必做步骤，忘了它 FindMarkers 会只在最后一个 layer 上算，结果和预期差很多。"
    ],
    "pitfalls": [
      "老版本 Seurat（v4）不支持 list 输入，会报 'counts' 维度不一致，得用 merge() 或 Reduce。",
      "10x 的 barcode 在不同样本之间会重复（都是 AAACCTGAGAAACCAT-1），合并后必须靠 sample 前缀或 add.cell.ids 区分。",
      "脏数据里 -1 后缀（如 TP53-1）表示重复 symbol，用 symbol 做行名会让下游按基因取行时取错。"
    ],
    "next": [
      "scrna-09",
      "scrna-10",
      "io-04"
    ]
  },
  {
    "id": "io-04",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "h5ad 转 Seurat：Python 注释好的单细胞接回 R",
    "level": "进阶",
    "tags": [
      "h5ad",
      "anndata",
      "zellkonverter",
      "格式转换"
    ],
    "packages": [
      "zellkonverter",
      "SingleCellExperiment",
      "Seurat",
      "SeuratDisk"
    ],
    "scene": "合作者用 scanpy 做完聚类和注释存成 .h5ad，你想在 R 里接着用 Seurat 画图或跑 CellChat。",
    "code": "# ============================================================\n# 04 h5ad <-> Seurat：把 Python 那边的对象搬回 R\n# ============================================================\nlibrary(zellkonverter)\nlibrary(SingleCellExperiment)\nlibrary(Seurat)\n\n# reader = \"R\" 走 HDF5Array，不占内存；默认的 basilisk 需要 conda 环境\nsce <- readH5AD(\"data/raw/GSE188711_annotated.h5ad\", reader = \"R\")\nprint(assayNames(sce))   # 常见：counts / logcounts / X / scaledata\nprint(head(colData(sce)))\n\n# h5ad 里真正能当 counts 用的通常是 counts 层；只有 X 时先判断取值范围\nif (\"counts\" %in% assayNames(sce)) {\n  obj <- as.Seurat(sce, counts = \"counts\", data = \"logcounts\")\n} else {\n  x <- assay(sce, \"X\")\n  stopifnot(min(x, na.rm = TRUE) >= 0)               # 有负值说明是 scale 过的，不能当 counts\n  obj <- CreateSeuratObject(counts = x, meta.data = as.data.frame(colData(sce)))\n}\n\n# 把 scanpy 的聚类、细胞类型、UMAP 一起搬过来\nobj$seurat_clusters <- factor(obj$leiden)\nobj$celltype       <- factor(obj$cell_type)\numap <- reducedDim(sce, \"X_umap\")\nif (!is.null(umap)) obj[[\"umap\"]] <- CreateDimReducObject(embeddings = umap,\n                                                          key = \"UMAP_\", assay = \"RNA\")\n\n# 退路：zellkonverter 装不上时用 SeuratDisk（先转 h5seurat）\n# SeuratDisk::Convert(\"x.h5ad\", dest = \"x.h5seurat\", overwrite = TRUE)\n# obj <- SeuratDisk::LoadH5Seurat(\"x.h5seurat\", assays = \"RNA\", reductions = \"umap\")\n\nsaveRDS(obj, \"data/processed/obj_from_py.rds\")",
    "notes": [
      "h5ad 的 X 可能已经被 scanpy 做过 scale（存在负值），这种矩阵不能当 counts 用，只能当 data。",
      "anndata 的 categorical 列会变成 R 的 factor，水平顺序未必和 scanpy 里一致，画图前用 levels() 核对。",
      "scanpy 的 UMAP 存在 obsm['X_umap']，zellkonverter 会映射成 reducedDim(sce, 'X_umap')，不会自动变成 Seurat 的 umap。"
    ],
    "pitfalls": [
      "SeuratDisk 的 Convert 对 h5ad 只认较老的 anndata 格式，新版 scanpy 写的文件会报 'Unable to open link'。",
      "readH5AD 默认 reader='R' 有时读不了稀疏矩阵的编码方式，报错时改用 reader='zellkonverter' 或先在 python 里 X = X.astype('float32')。",
      "转完直接 FindMarkers 前要确认 obj 的默认 assay 是 RNA 而不是 SCT，否则 logFC 口径完全不同。"
    ],
    "next": [
      "scrna-09",
      "scrna-13",
      "scrna-16"
    ]
  },
  {
    "id": "io-05",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "大文件分块读取：几百 MB 的 TSV 不进内存也能聚合",
    "level": "进阶",
    "tags": [
      "分块读取",
      "readr",
      "内存",
      "大矩阵"
    ],
    "packages": [
      "readr",
      "dplyr"
    ],
    "scene": "拿到一个 8 GB 的泛癌表达矩阵，机器只有 16 GB 内存，直接 read.delim 会当场卡死。",
    "code": "# ============================================================\n# 05 分块读大表：只保留关心的基因，边读边聚合\n# ============================================================\nlibrary(readr)\nlibrary(dplyr)\n\nf <- \"data/raw/pan_cancer_tpm.tsv\"          # 假设第一列是 gene_id，其余全是样本\nkeep_genes <- readLines(\"data/raw/gene_whitelist.txt\")\n\n# 1) 先只读表头，看清列数（read_tsv 的 n_max = 0 只解析列名，不读数据）\nhdr <- names(read_tsv(f, n_max = 0, show_col_types = FALSE))\ncat(\"列数：\", length(hdr), \"\\n\")\n\n# 2) 用环境变量做累加器（回调函数没有返回值给外部，只能靠闭包）\nacc <- new.env(parent = emptyenv())\nacc$sum <- NULL\nacc$n   <- 0L\n\ncb <- DataFrameCallback$new(function(chunk, pos) {\n  sub <- chunk[chunk[[1]] %in% keep_genes, , drop = FALSE]\n  if (nrow(sub) == 0) return(NULL)\n  m <- as.matrix(sub[, -1, drop = FALSE])\n  s <- rowSums(m, na.rm = TRUE)\n  names(s) <- sub[[1]]\n  if (is.null(acc$sum)) {\n    acc$sum <- s\n  } else {\n    # 同一个基因可能出现在多个 chunk 里（基因重复注释），按名字累加\n    add <- intersect(names(acc$sum), names(s))\n    acc$sum[add] <- acc$sum[add] + s[add]\n    newg <- setdiff(names(s), names(acc$sum))\n    acc$sum <- c(acc$sum, s[newg])\n  }\n  acc$n <- acc$n + ncol(m)\n  NULL                                     # 返回 NULL 表示不额外收集数据\n})\n\n# 3) 必须显式给 col_types，否则 readr 只拿前 1000 行猜类型，后面出现字符就整列作废\nread_tsv_chunked(f, cb, chunk_size = 100000,\n                 col_types = cols(.default = col_double(), gene_id = col_character()))\n\nmean_expr <- acc$sum / acc$n\nsaveRDS(mean_expr, \"data/processed/keep_gene_mean.rds\")\nlength(mean_expr)",
    "notes": [
      "chunk 是按行切的，所以同一个基因不会跨块；但基因重复出现时会分在不同块里，累加逻辑要按名字对齐。",
      "col_types 里的 .default 一次管住所有列，比逐列写 cols() 省事，也不怕列数上千。",
      "readr 的分块比 data.table::fread 的 skip/nrows 更省内存，fread 再怎么样也要先把整列类型猜一遍。"
    ],
    "pitfalls": [
      "回调函数里改全局变量必须用 <<- 或环境对象，用 <- 只在函数内部生效，读到最后 acc 还是空的。",
      "不给 col_types 时 readr 会先读 1000 行猜类型，猜错后报 'parsing failures'，而且只报前几条。",
      "DataFrameCallback 必须真的返回 data.frame 或 NULL，返回别的东西会静默丢掉那些块。"
    ],
    "next": [
      "io-06",
      "rbase-09",
      "io-09"
    ]
  },
  {
    "id": "io-06",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "Excel 多 sheet 读写：附件表格的批量进出",
    "level": "常用",
    "tags": [
      "Excel",
      "readxl",
      "openxlsx",
      "多sheet"
    ],
    "packages": [
      "readxl",
      "openxlsx",
      "purrr",
      "dplyr",
      "writexl"
    ],
    "scene": "期刊补充材料是一个十几张 sheet 的 xlsx，要逐张读出来看，最后还要把结果按 sheet 写回去交差。",
    "code": "# ============================================================\n# 06 Excel 多 sheet 读入 / 写出\n# ============================================================\nlibrary(readxl)\nlibrary(openxlsx)\nlibrary(purrr)\nlibrary(dplyr)\n\nf <- \"data/raw/Supplementary_Tables.xlsx\"\nsheets <- excel_sheets(f)\nprint(sheets)\n\n# guess_max 要大：默认只看前 1000 行，长表里混个 \"NA\" 就把整列变字符\nlst <- map(sheets, ~ read_excel(f, sheet = .x, guess_max = 100000))\nnames(lst) <- sheets\nprint(map_int(lst, nrow))\n\ndeg  <- lst[[\"Table S3\"]]\ncli  <- lst[[\"Table S1\"]]\n\n# ---- 写多 sheet ----\nwb <- createWorkbook()\naddWorksheet(wb, \"DEG\")\nwriteData(wb, \"DEG\", deg, withFilter = TRUE, keepNA = FALSE)\nfreezePane(wb, \"DEG\", firstRow = TRUE)\nsetColWidths(wb, \"DEG\", cols = seq_len(ncol(deg)), widths = \"auto\")\n\naddWorksheet(wb, \"Clinical\")\nwriteData(wb, \"Clinical\", cli)\n\n# 条件格式：把 logFC 大于 1 的行标红，审稿人要一眼看出上调基因\nnegStyle <- createStyle(fontColour = \"#9C0006\", bgFill = \"#FFC7CE\")\nconditionalFormatting(wb, \"DEG\", cols = 2, rows = 2:(nrow(deg) + 1),\n                      rule = \">1\", style = negStyle)\nsaveWorkbook(wb, \"results/tables/Supplementary_v2.xlsx\", overwrite = TRUE)\n\n# 轻量方案：writexl 一句把命名 list 全部写成 sheet（不带格式）\n# writexl::write_xlsx(lst, \"results/tables/all_sheets.xlsx\")",
    "notes": [
      "read_excel 的 sheet 参数可以给序号也可以给名字，写循环时用名字更稳，因为插入新 sheet 会改变序号。",
      "keepNA = FALSE 让空值在 Excel 里显示为空白而不是 #N/A，交稿时更干净。",
      "openxlsx 直接写 data.frame 不需要 Java，比 xlsx 包（依赖 rJava）在 Windows 上成功率高得多。"
    ],
    "pitfalls": [
      "合并单元格读进来只有左上角有值，其余是 NA，读之前先在 Excel 里取消合并或按需 fill。",
      "Excel 里长数字（如 20 位的 rsID）会被读成科学计数法丢掉精度，读的时候要用 col_types = 'text'。",
      "guess_max 不够大时，前 1000 行全是数字、后面出现 '≤0.5' 这种字符，整列会静默变成文本型。"
    ],
    "next": [
      "report-03",
      "io-07",
      "report-01"
    ]
  },
  {
    "id": "io-07",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "缺失值诊断与处理：删除 / 填充 / 多重插补",
    "level": "常用",
    "tags": [
      "缺失值",
      "mice",
      "naniar",
      "插补"
    ],
    "packages": [
      "naniar",
      "mice",
      "dplyr",
      "VIM"
    ],
    "scene": "临床表里有年龄、BMI、分期各种缺失，直接丢样本损失太大，随便填中位数又会被审稿人质疑。",
    "code": "# ============================================================\n# 07 缺失值：先看清分布，再决定丢还是补\n# ============================================================\nlibrary(naniar)\nlibrary(dplyr)\nlibrary(mice)\n\ndf <- readRDS(\"data/processed/clinical_clean.rds\")\n\n# 1) 诊断：每个变量的缺失比例 + 缺失模式\nmiss_var_summary(df) %>% filter(n_miss > 0) %>% print(n = 50)\nvis_miss(df, warn_large_data = FALSE)\n\n# 2) 缺失 > 40% 的变量直接丢弃（信息量太低，补出来全是噪声）\ndrop_vars <- miss_var_summary(df) %>% filter(pct_miss > 40) %>% pull(variable)\nd1 <- df %>% select(-any_of(drop_vars))\n\n# 3) 结局/分组缺失的样本删掉（不能补，补了就是编数据）\nd2 <- d1 %>% filter(!is.na(group), !is.na(OS_time))\n\n# 4) 简单填充：数值用中位数，分类用众数（只用于描述性分析）\nmed_fill <- function(x) ifelse(is.na(x), median(x, na.rm = TRUE), x)\nmode_fill <- function(x) {\n  ux <- na.omit(x); ifelse(is.na(x), ux[which.max(table(ux))], x)\n}\nd3 <- d2 %>%\n  mutate(across(where(is.numeric), med_fill),\n         across(where(is.character), mode_fill))\n\n# 5) 正式建模建议用 MICE 多重插补，再 pool 结果\nvars <- c(\"group\", \"age\", \"bmi\", \"stage\", \"smoking\")\nimp  <- mice(d2[, vars], m = 5, method = \"pmm\", seed = 20240101, printFlag = FALSE)\nfit  <- with(imp, glm(group ~ age + bmi + stage + smoking, family = binomial))\nsummary(pool(fit))",
    "notes": [
      "先看缺失模式再动手：如果某个变量只在对照组缺失，那它本身就是混杂，不是随机缺失（MNAR），插补也救不回来。",
      "MICE 补 5 套之后要用 with() + pool() 合并，直接 complete(imp, 1) 只取一套等于放弃了不确定性估计。",
      "method = 'pmm' 适合连续变量，二分类用 'logreg'，无序多分类用 'polyreg'，全用 pmm 会插出 1.5 个分期这种鬼值。"
    ],
    "pitfalls": [
      "中位数填充会压缩方差，让所有 p 值系统性偏小，只能在描述性表格里用。",
      "mice 遇到只有单一取值的列会报错或直接跳过，跑之前先 drop 掉零方差的列。",
      "is.na() 对 NaN 也返回 TRUE，但 'NA' 字符串、'-'、'--' 这些占位符不会被识别成缺失，要先用 na_if 统一。"
    ],
    "next": [
      "stats-06",
      "report-01",
      "io-06"
    ]
  },
  {
    "id": "io-08",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "基因 ID 转换：symbol / Ensembl / Entrez 互转",
    "level": "常用",
    "tags": [
      "ID转换",
      "org.Hs.eg.db",
      "bitr",
      "同源基因"
    ],
    "packages": [
      "org.Hs.eg.db",
      "clusterProfiler",
      "AnnotationDbi",
      "babelgene",
      "dplyr"
    ],
    "scene": "富集分析要 Entrez ID、GSEA 要按表达量排序的 symbol、合作者给的又是带版本号的 Ensembl，来回倒腾。",
    "code": "# ============================================================\n# 08 三种常用 ID 互转 + 小鼠人源同源映射\n# ============================================================\nlibrary(org.Hs.eg.db)\nlibrary(clusterProfiler)\nlibrary(AnnotationDbi)\nlibrary(dplyr)\n\ngenes <- c(\"TP53\", \"EGFR\", \"MYC\", \"ENSG00000141510.17\", \"P53\")\n\n# 1) 去 Ensembl 版本号（带 .17 的话匹配率直接归零）\nids <- sub(\"\\\\..*$\", \"\", genes)\n\n# 2) bitr：失败的行会被静默丢掉，必须自己核对丢了哪些\nmap <- bitr(ids, fromType = \"SYMBOL\", toType = c(\"ENSEMBL\", \"ENTREZID\", \"GENENAME\"),\n            OrgDb = org.Hs.eg.db)\nsetdiff(ids, map$SYMBOL)          # 找不到的（\"P53\" 是老别名，不在 SYMBOL 里）\n\n# 3) 别名/旧符号要用 alias 键再查一次\nalias_hit <- AnnotationDbi::select(org.Hs.eg.db, keys = \"P53\",\n                                   keytype = \"ALIAS\", columns = c(\"SYMBOL\", \"ENTREZID\"))\n\n# 4) 一对多时按需去重（一个 symbol 可能对应多个 Entrez）\nmap1 <- map %>% distinct(SYMBOL, .keep_all = TRUE)\n\n# 5) 把表达矩阵行名从 symbol 换成 Entrez\nexpr <- readRDS(\"data/processed/expr_log2.rds\")\nidx  <- match(rownames(expr), map1$SYMBOL)\nexpr_e <- expr[!is.na(idx), , drop = FALSE]\nrownames(expr_e) <- map1$ENTREZID[idx[!is.na(idx)]]\nexpr_e <- expr_e[!duplicated(rownames(expr_e)), , drop = FALSE]\n\n# 6) 小鼠 → 人（做动物模型验证时必用）\n# mouse_sym <- c(\"Trp53\", \"Egfr\")\n# human_map <- babelgene::orthologs(genes = mouse_sym, species = \"mouse\", human = TRUE)\nsaveRDS(expr_e, \"data/processed/expr_entrez.rds\")",
    "notes": [
      "org.Hs.eg.db 只收录有注释记录的基因，lncRNA 和新命名基因大量缺失，做 lncRNA 分析要换 org.Hs.eg.db 的 ENSEMBL 键或直接用 Ensembl BioMart。",
      "bitr 内部就是 AnnotationDbi::select 加去重，返回的永远是 data.frame，一对多会展开成多行。",
      "babelgene 的同源表覆盖度比 biomaRt 好且不需要联网，做小鼠验证首选它。"
    ],
    "pitfalls": [
      "ENSEMBL ID 带版本号（ENSG00000141510.17）时 %in% 永远匹配不上，先 sub('\\\\..*$','',x) 去版本。",
      "把 symbol 换成 Entrez 后如果有重复，直接赋 rownames 会报 'duplicate row.names'，必须先 unique。",
      "大小写敏感：'Tp53' 是人 TP53 的小鼠写法，直接拿去 org.Hs.eg.db 查是查不到的。"
    ],
    "next": [
      "bulk-18",
      "io-09",
      "scrna-16"
    ]
  },
  {
    "id": "io-09",
    "track": "io",
    "trackName": "数据读写与清洗",
    "title": "重复基因名折叠：多探针合并成一行",
    "level": "常用",
    "tags": [
      "重复基因",
      "collapseRows",
      "avereps",
      "探针"
    ],
    "packages": [
      "WGCNA",
      "limma",
      "data.table"
    ],
    "scene": "芯片数据一个基因对应好几个探针，行名不唯一，做 WGCNA 或差异分析时会直接报错。",
    "code": "# ============================================================\n# 09 一个基因多行 → 折叠成唯一行，三种取舍标准\n# ============================================================\nlibrary(WGCNA)\nlibrary(limma)\nlibrary(data.table)\n\nexpr  <- readRDS(\"data/processed/expr_probe.rds\")   # 行名是探针 ID\ngenes <- readRDS(\"data/processed/probe2gene.rds\")   # 与 expr 行一一对应的 symbol\nstopifnot(length(genes) == nrow(expr))\ncat(\"重复基因数：\", sum(duplicated(genes)), \"\\n\")\n\n# ---- 方法 1：WGCNA::collapseRows，按平均表达最高的探针做代表 ----\ncoll <- collapseRows(datET = expr, rowGroup = genes, rowID = rownames(expr),\n                     method = \"MaxMean\", connectivityBasedCollapsing = FALSE)\nexpr_maxmean <- coll$datETcollapsed\n# method 可选：MaxMean（默认，推荐）/ maxRowVariance / average / keepAll\n\n# ---- 方法 2：limma::avereps，多个探针直接取平均 ----\nexpr_mean <- avereps(expr, ID = genes)\n\n# ---- 方法 3：data.table 取方差最大的那条（更看重变异信息）----\ndt <- data.table(probe = rownames(expr), gene = genes, expr)\ndt[, v := apply(as.matrix(.SD), 1, var), .SDcols = setdiff(names(dt), c(\"probe\", \"gene\"))]\nsetorder(dt, gene, -v)\ndt1 <- dt[!duplicated(gene)]\nexpr_var <- as.matrix(dt1[, setdiff(names(dt1), c(\"probe\", \"gene\", \"v\")), with = FALSE])\nrownames(expr_var) <- dt1$gene\n\n# 三个结果行数应该一致，可以互相校验\nc(nrow(expr_maxmean), nrow(expr_mean), nrow(expr_var))\nstopifnot(!any(duplicated(rownames(expr_maxmean))))\nsaveRDS(expr_maxmean, \"data/processed/expr_gene_level.rds\")",
    "notes": [
      "MaxMean 是 WGCNA 作者推荐的默认策略：在“保留高表达”和“保留差异信息”之间折中。",
      "avereps 对 log2 后的数据取平均比较合理，对原始 counts 取平均会破坏整数性，得先转 log 或直接用 collapseRows。",
      "折叠标准会改变下游差异基因列表，方法要在方法学部分写清楚，不能默默换。"
    ],
    "pitfalls": [
      "直接 unique(rownames) 只保留第一条探针，等于按行号随机选，结果不可复现且可能挑到设计很差的探针。",
      "collapseRows 返回的是 list（含 datETcollapsed / group2row / selectedRow），不是矩阵，忘了 $datETcollapsed 会报错。",
      "折叠之后行数变了，之前算好的差异结果、模块基因索引全部失效，必须重跑而不是拼接。"
    ],
    "next": [
      "bulk-11",
      "bulk-17",
      "io-08"
    ]
  },
  {
    "id": "rbase-07",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "apply 家族速查：lapply / sapply / vapply / mapply / apply",
    "level": "常用",
    "tags": [
      "apply",
      "循环",
      "向量化",
      "list"
    ],
    "packages": [
      "base"
    ],
    "scene": "想把 for 循环换成一行，但总记不清哪个 apply 返回向量、哪个返回 list、哪个要传多个参数。",
    "code": "# ============================================================\n# 07 apply 家族：五种返回形态一次记住\n# ============================================================\nset.seed(1)\nmat <- matrix(rnorm(20), nrow = 5, dimnames = list(paste0(\"g\", 1:5), paste0(\"s\", 1:4)))\nlst <- list(a = 1:3, b = 4:6, c = 7:8)\n\n# lapply：输入 list/向量，永远返回 list（最保险，不会因为长度不一报错）\nlapply(lst, mean)\n\n# sapply：同上但会尝试简化成向量/矩阵 —— 方便，但可能悄悄改变类型\nsapply(lst, mean)          # 返回命名向量\nsapply(lst, range)         # 长度不一致 → 退化成 2 x 3 矩阵（按列填）\n\n# vapply：必须声明返回类型和长度，长度不符直接报错 —— 写函数/包时用这个\nvapply(lst, function(x) c(n = length(x), m = mean(x)), numeric(2))\n\n# apply：对矩阵的行(1)或列(2)套函数，返回向量或矩阵\napply(mat, 1, mean)                       # 每行均值 = 每个基因的平均表达\napply(mat, 2, function(x) sum(x > 0))     # 每列正数个数\n\n# mapply：多参数同时按位置遍历（Map 是它的 list 版）\nmapply(function(x, k) x * k, lst, c(1, 10, 100), SIMPLIFY = FALSE)\n\n# 常用快捷版：rowMeans / colSums / rowSums 比 apply 快一个数量级\nidentical(unname(rowMeans(mat)), unname(apply(mat, 1, mean)))\n\n# 需要注意的坑：apply 会先把矩阵转成同类型，混了字符就全变字符\nmixed <- cbind(num = 1:3, txt = c(\"a\", \"b\", \"c\"))\napply(mixed, 1, function(r) r[[\"num\"]])   # 结果全是字符 \"1\" \"2\" \"3\"",
    "notes": [
      "sapply 的自动简化是把双刃剑：输入长度不一时会退化成矩阵，按列填充，极易看错行列含义。",
      "vapply 的 FUN.VALUE 不是多余的限制，它保证空输入时也能返回正确的空对象，是写健壮函数的关键。",
      "rowMeans/colSums 是编译好的 C 实现，处理 2 万 × 500 的矩阵比 apply 快几十倍。"
    ],
    "pitfalls": [
      "apply 对 data.frame 会先 as.matrix，只要有一列是字符，整个表都变字符矩阵。",
      "lapply 之后接 unlist 会丢掉名字结构，长度不一时还可能静默拼错；要保留结构用 vapply 或 purrr::map_*。",
      "apply(mat, 1, ...) 在只有一行的矩阵上会退化成对每个元素操作，返回长度变成列数。"
    ],
    "next": [
      "rbase-08",
      "rbase-11",
      "rbase-09"
    ]
  },
  {
    "id": "rbase-08",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "split-apply-combine：分组汇总的三条路子",
    "level": "常用",
    "tags": [
      "分组汇总",
      "split",
      "aggregate",
      "tapply"
    ],
    "packages": [
      "base",
      "dplyr"
    ],
    "scene": "要按细胞类型、按分组、按病人分别算均值/计数，for 循环写起来又臭又长。",
    "code": "# ============================================================\n# 08 分组 → 计算 → 合并：base / dplyr / data.table 三种写法\n# ============================================================\ndf <- readRDS(\"data/processed/clinical.rds\")   # 含 group / stage / age / OS_time\n\n# ---- 1) base：split + lapply + do.call(rbind) ----\nby_group <- split(df, df$group)\nres1 <- do.call(rbind, lapply(names(by_group), function(g) {\n  d <- by_group[[g]]\n  data.frame(group = g, n = nrow(d), age_mean = mean(d$age, na.rm = TRUE))\n}))\nrownames(res1) <- NULL\n\n# tapply：一进一出，适合单变量聚合\ntapply(df$age, df$group, median, na.rm = TRUE)\n\n# aggregate：公式接口，一次算多个变量\naggregate(cbind(age, OS_time) ~ group + stage, data = df, FUN = mean, na.rm = TRUE)\n\n# ---- 2) dplyr：可读性最好 ----\nlibrary(dplyr)\nres2 <- df %>%\n  group_by(group, stage) %>%\n  summarise(n = n(), age_mean = mean(age, na.rm = TRUE),\n            os_median = median(OS_time, na.rm = TRUE), .groups = \"drop\")\n\n# ---- 3) data.table：大数据最快，语法最短 ----\nlibrary(data.table)\ndt <- as.data.table(df)\nres3 <- dt[, .(n = .N, age_mean = mean(age, na.rm = TRUE)), by = .(group, stage)]\n\n# 三份结果互相对一下，确认口径一致\nprint(res2)\nmerge(res2, res3, by = c(\"group\", \"stage\"), suffixes = c(\"_dplyr\", \"_dt\"))",
    "notes": [
      "summarise 之后一定要 .groups = 'drop'，否则结果还是分组 tibble，后续 merge 会报莫名其妙的错。",
      "data.table 的 .N 是本组行数，.SD 是本组数据子集，.SDcols 指定只看哪几列。",
      "分组变量里有 NA 时，dplyr 会把它当成一个 NA 组保留，aggregate 默认直接丢掉，两者结果行数会不同。"
    ],
    "pitfalls": [
      "aggregate 的 FUN 作用在每个数值列上，公式右边有字符列会直接报错。",
      "split 对 factor 会保留空水平（返回长度为 0 的元素），统计时容易多出 n=0 的组。",
      "dplyr 的 n() 只能在 summarise/mutate 里用，写成 length(x) 在分组里结果一样但语义不同。"
    ],
    "next": [
      "rbase-09",
      "stats-02",
      "report-01"
    ]
  },
  {
    "id": "rbase-09",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "data.table 快速聚合与原地更新（:=）",
    "level": "进阶",
    "tags": [
      "data.table",
      "聚合",
      "原地修改",
      "大数据"
    ],
    "packages": [
      "data.table"
    ],
    "scene": "几百万行的 GWAS 汇总表或表达长表，dplyr 跑得慢，想换 data.table 又怕语法看不懂。",
    "code": "# ============================================================\n# 09 data.table 核心语法：DT[i, j, by] 三板斧\n# ============================================================\nlibrary(data.table)\n\ndt <- fread(\"data/raw/gwas_summary.tsv\")   # 比 read.delim 快 5~10 倍\nsetDTthreads(0)                            # 0 = 用满所有核心\n\n# i：行筛选（条件直接写，不用 which）\ndt[pval < 5e-8]\n\n# j：列运算，.() 等价于 list()\ndt[, .(n_snp = .N, min_p = min(pval)), by = .(chr)]\n\n# := 原地新增/修改列，不复制整张表（内存友好）\ndt[, maf_bin := cut(maf, c(0, 0.01, 0.05, 0.1, 0.5))]\ndt[, `:=`(bp_mb = bp / 1e6, neglogp = -log10(pval))]\n\n# 按组算完直接写回原表（比 dplyr 的 group_by + mutate 快很多）\ndt[, chr_mean := mean(beta, na.rm = TRUE), by = chr]\n\n# .SD + .SDcols：只对指定列做运算\nnum_cols <- c(\"beta\", \"se\", \"pval\")\ndt[, lapply(.SD, function(x) round(mean(x, na.rm = TRUE), 4)), .SDcols = num_cols, by = chr]\n\n# 排序与去重：setkey 建索引后，后续按该列筛选会自动走二分查找\nsetkey(dt, chr, bp)\ndt[.(1, 1000000:2000000), on = c(\"chr\", \"bp\")]     # 取 1 号染色体某区间\nsetorder(dt, chr, pval)\ndt_unique <- unique(dt, by = \"rsid\")\n\n# 与 data.frame 互转（回 ggplot 时常用）\ndf <- as.data.frame(dt)",
    "notes": [
      ":= 是引用语义，dt 被就地改了，函数里传进去也一样会改外部对象，需要副本时用 copy(dt)。",
      ".SD 默认包含除 by 列以外的所有列，列很多时一定要加 .SDcols，否则内存和速度都会崩。",
      "setkey 会按索引列重排整张表，之后 dt 的行顺序变了，靠行号取值的代码会出错。"
    ],
    "pitfalls": [
      "在函数里对传入的 data.table 用 := 会污染调用方的对象，这是 data.table 最经典的“副作用”事故。",
      "fread 默认会把 'NA'、'' 读成 NA，但 'NULL'、'-' 不会，需要 na.strings 参数显式指定。",
      "混用 dplyr 与 data.table 时，dt %>% filter(...) 返回的是 data.table，但某些泛型方法不认，建议统一用一种。"
    ],
    "next": [
      "io-05",
      "rbase-08",
      "mr-05"
    ]
  },
  {
    "id": "rbase-10",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "嵌套列表的操作：展开、取深度、拼回数据框",
    "level": "进阶",
    "tags": [
      "list",
      "嵌套",
      "flatten",
      "purrr"
    ],
    "packages": [
      "purrr",
      "tibble",
      "dplyr"
    ],
    "scene": "批量跑完 20 个数据集，结果是 list of list，想把里面第 3 层的某个数值全部提出来拼成一张表。",
    "code": "# ============================================================\n# 10 嵌套 list：从“俄罗斯套娃”里把数据抠出来\n# ============================================================\nlibrary(purrr)\nlibrary(tibble)\nlibrary(dplyr)\n\n# 模拟：每个数据集跑出 list(fit = ..., stats = list(auc=, n=), deg = data.frame)\nres <- list(\n  GSE1 = list(fit = \"m1\", stats = list(auc = 0.81, n = 120),\n              deg = data.frame(gene = c(\"TP53\", \"EGFR\"), logFC = c(1.2, -0.8))),\n  GSE2 = list(fit = \"m2\", stats = list(auc = 0.76, n = 98),\n              deg = data.frame(gene = c(\"MYC\", \"KRAS\"), logFC = c(0.9, 1.5)))\n)\n\n# 逐层取：[[ ]] 取内容，[ ] 取子列表\nres[[\"GSE1\"]][[\"stats\"]][[\"auc\"]]\nmap_dbl(res, c(\"stats\", \"auc\"))            # 等价于对每个元素取 $stats$auc\n\n# 拼成一张表：一个数据集一行\nmap_dfr(res, ~ tibble(auc = .x$stats$auc, n = .x$stats$n), .id = \"gse\")\n\n# 深度操作：map_depth 在指定层级做变换\nmap_depth(res, 2, names)                   # 看第 2 层每个 list 的字段名\n\n# 把里面所有 deg 表拼成一个大表，同时加上来源列\ndeg_all <- map_dfr(res, \"deg\", .id = \"gse\")\ndeg_all\n\n# 不规则 list：先 flatten 再处理；NULL 会被 list_rbind 直接跳过\nflat <- list(a = list(1, 2), b = list(3))\nlist_rbind(map(flat, ~ tibble(v = unlist(.x)))) \n\n# 递归遍历：找出所有名字叫 \"auc\" 的叶子\nfind_key <- function(x, key = \"auc\") {\n  if (is.list(x)) {\n    hit <- if (key %in% names(x)) x[[key]]\n    c(hit, unlist(lapply(x, find_key, key = key)))\n  }\n}\nfind_key(res)",
    "notes": [
      "[[ 和 $ 是取值，[ 是取子集：对 list 用 [1] 拿到的是长度为 1 的 list，不是元素本身，这是最常见的类型错误来源。",
      "map_dfr(..., .id = 'gse') 会自动用外层名字新建一列，省掉手动加来源变量的步骤。",
      "map_chr(res, c('stats','auc')) 这种“路径向量”写法比 function(x) x$stats$auc 简洁得多。"
    ],
    "pitfalls": [
      "list 元素长度不一致时 map_dfr 仍然能拼（短的自动补 NA），但 map_cfr 之类的简化函数会直接报错。",
      "NULL 在 list 里会被 unlist 静默丢掉，导致结果长度和你以为的不一致；要保留就用 list(NULL) 包一层。",
      "递归函数忘了写 base case 会无限递归爆栈，处理深层结构时先 print(str(x, max.level = 2)) 看清结构。"
    ],
    "next": [
      "rbase-11",
      "scrna-15",
      "report-05"
    ]
  },
  {
    "id": "rbase-11",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "apply 与 purrr 对照：批量建模的标准写法",
    "level": "进阶",
    "tags": [
      "purrr",
      "map",
      "walk",
      "safely"
    ],
    "packages": [
      "purrr",
      "dplyr",
      "broom",
      "tibble"
    ],
    "scene": "要对 10 个基因分别跑 Cox 回归，中间有的基因全是 0 会报错，希望失败的跳过、成功的拼成一张结果表。",
    "code": "# ============================================================\n# 11 批量建模：apply 写法 vs purrr 写法，外加错误处理\n# ============================================================\nlibrary(purrr)\nlibrary(dplyr)\nlibrary(broom)\nlibrary(survival)\n\nexpr <- readRDS(\"data/processed/expr_log2.rds\")\ncli  <- readRDS(\"data/processed/clinical.rds\")\ngenes <- c(\"TP53\", \"EGFR\", \"MYC\", \"KRAS\", \"NONEXIST\")\n\nrun_cox <- function(g, expr, cli) {\n  if (!g %in% rownames(expr)) stop(\"基因不在矩阵里: \", g)\n  d <- data.frame(time = cli$OS_time, status = cli$OS_status,\n                  x = as.numeric(expr[g, cli$sample]))\n  fit <- coxph(Surv(time, status) ~ x, data = d)\n  tidy(fit, exponentiate = TRUE, conf.int = TRUE)\n}\n\n# ---- base 写法：tryCatch 手动兜住错误 ----\nbase_res <- lapply(genes, function(g) {\n  out <- tryCatch(run_cox(g, expr, cli), error = function(e) NULL)\n  if (is.null(out)) return(NULL)\n  cbind(gene = g, out)\n})\ndo.call(rbind, base_res)\n\n# ---- purrr 写法：safely 把结果和错误分开装 ----\nsafe_cox <- safely(run_cox, otherwise = NULL)\npurrr_res <- map(genes, safe_cox, expr = expr, cli = cli)\n\nok  <- purrr_res %>% map(\"result\") %>% compact() %>% list_rbind()\nbad <- purrr_res %>% map_lgl(~ is.null(.x$result))\ndata.frame(gene = genes[bad], reason = map_chr(purrr_res[bad], ~ conditionMessage(.x$error)))\n\n# 需要保留基因名时用 set_names + map_dfr(.id)\nok2 <- map_dfr(set_names(genes, genes), ~ {\n  r <- tryCatch(run_cox(.x, expr, cli), error = function(e) NULL)\n  if (is.null(r)) return(NULL)\n  r\n}, .id = \"gene\")\n\n# walk：只为了副作用（存文件、画图），不收集返回值\n# walk(genes, ~ ggsave(paste0(\"results/figures/\", .x, \".pdf\"), plot_gene(.x)))",
    "notes": [
      "safely 返回 list(result=, error=)，把成功与失败分流，比在循环里 if (inherits(x,'try-error')) 干净得多。",
      "compact() 会一次性删掉所有 NULL 元素，是 safely / possibly 之后的标准收尾动作。",
      "map_dfr(set_names(x, x), ..., .id='gene') 是批量建模最省事的组合：既保留来源名又拼成表。"
    ],
    "pitfalls": [
      "tryCatch 里只写 error 不写 finally，出错时中间变量会滞留，长时间批量跑容易吃满内存。",
      "map_dfr 里返回 NULL 的元素会被直接跳过（不是补 NA），最后基因数和输入对不上，要单独统计失败数。",
      "批量 coxph 时如果某个基因方差为 0，会报 'NA/NaN/Inf in foreign function call'，这属于正常跳过而不是代码 bug。"
    ],
    "next": [
      "stats-06",
      "ml-06",
      "bulk-11"
    ]
  },
  {
    "id": "rbase-12",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "因子与顺序控制：别让 R 把对照组装反了",
    "level": "常用",
    "tags": [
      "factor",
      "levels",
      "relevel",
      "forcats"
    ],
    "packages": [
      "forcats",
      "dplyr"
    ],
    "scene": "差异分析结果里 logFC 全是反的，或者 ggplot 的柱子顺序按字母排而不是按分期从轻到重。",
    "code": "# ============================================================\n# 12 因子：水平顺序决定谁当对照、决定图的排列\n# ============================================================\nlibrary(forcats)\nlibrary(dplyr)\n\ncli <- readRDS(\"data/processed/clinical.rds\")\nstr(cli$group)      # 读进来常是 chr，\"Control\" < \"Treatment\" 按字母序\n\n# 1) 显式指定水平：第一个水平就是回归/差异分析的参照组\ncli$group <- factor(cli$group, levels = c(\"Control\", \"Treatment\"))\nlevels(cli$group)\n\n# 2) 分期这种有序变量要用 ordered，或者手动给全顺序\ncli$stage <- factor(cli$stage, levels = c(\"I\", \"II\", \"III\", \"IV\"), ordered = TRUE)\n\n# 3) 只想换参照组：relevel（不改变其他水平的相对顺序）\ncli$group <- relevel(cli$group, ref = \"Treatment\")\n\n# 4) forcats：按频数/按数值重排，画图时最常用\ncli$stage <- fct_relevel(cli$stage, \"I\", \"II\", \"III\", \"IV\")\ncli %>% count(stage) %>%\n  mutate(stage = fct_reorder(stage, n)) %>%      # 按 n 排序（默认升序，图里是从下往上）\n  arrange(stage)\n\n# 5) 合并稀有的水平\ncli$stage3 <- fct_collapse(cli$stage, Early = c(\"I\", \"II\"), Late = c(\"III\", \"IV\"))\n\n# 6) 数值型分组：cut 之后一定要自己排好序\ncli$age_grp <- cut(cli$age, breaks = c(0, 50, 65, Inf),\n                   labels = c(\"<50\", \"50-65\", \">65\"), right = FALSE)\nlevels(cli$age_grp)\n\n# 验证：建模前打印一次 design 矩阵，确认对照方向\n# model.matrix(~ group, data = cli) %>% head()\ntable(cli$group, useNA = \"ifany\")",
    "notes": [
      "levels 的第一个元素就是参照组，DESeq2 的 results() 默认比较的是 levels[2] vs levels[1]。",
      "ordered = TRUE 会让 poly 对比而不是 treatment 对比，做回归时要留意 coef 名字变成 .L/.Q/.C。",
      "fct_relevel 只调顺序不改标签，fct_recode 才是改标签，两者别混。"
    ],
    "pitfalls": [
      "把因子转成字符再转回因子，水平会按字母重排，之前设好的参照组全丢。",
      "read.csv 默认 stringsAsFactors = FALSE（R 4.0 起），但 readxl 读进来的字符列有时仍带隐藏空格，'Control ' 和 'Control' 会被当成两个水平。",
      "cut 默认 right = TRUE，边界值 50 会被分到 (0,50] 而不是 (50,65]，分组边界要和临床定义对齐。"
    ],
    "next": [
      "bulk-11",
      "viz-06",
      "stats-02"
    ]
  },
  {
    "id": "rbase-13",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "日期时间处理：随访时间、生存时间与时间窗",
    "level": "常用",
    "tags": [
      "日期",
      "lubridate",
      "生存时间",
      "时间差"
    ],
    "packages": [
      "lubridate",
      "dplyr"
    ],
    "scene": "临床表里是 '2019/3/5' 这种混合格式的入院、出院、末次随访日期，要算随访月和生存状态。",
    "code": "# ============================================================\n# 13 日期：解析 → 求差 → 切时间窗\n# ============================================================\nlibrary(lubridate)\nlibrary(dplyr)\n\ncli <- readRDS(\"data/processed/clinical_raw.rds\")\nglimpse(cli[, c(\"diagnosis_date\", \"last_follow\", \"death_date\")])\n\n# 1) 解析：同一列里混着多种格式时用 parse_date_time 给候选顺序\ncli <- cli %>%\n  mutate(\n    dx   = parse_date_time(diagnosis_date, orders = c(\"ymd\", \"dmy\", \"Y/m/d\")),\n    fu   = parse_date_time(last_follow,    orders = c(\"ymd\", \"dmy\", \"Y/m/d\")),\n    dod  = parse_date_time(death_date,     orders = c(\"ymd\", \"dmy\", \"Y/m/d\"))\n  )\n\n# 2) 生存时间：死亡者用死亡日期，存活者用末次随访日期\ncli <- cli %>%\n  mutate(\n    end_date = if_else(!is.na(dod), dod, fu),\n    os_month = as.numeric(difftime(end_date, dx, units = \"days\")) / 30.4375,\n    os_status = if_else(!is.na(dod), 1L, 0L)\n  ) %>%\n  filter(os_month > 0)          # 时间为 0 或负数的样本必须剔除\n\n# 3) 常见派生变量\ncli <- cli %>%\n  mutate(\n    dx_year  = year(dx),\n    dx_month = floor_date(dx, \"month\"),\n    age_at_dx = as.numeric(difftime(dx, birth_date, units = \"days\")) / 365.25,\n    fu_year  = as.numeric(difftime(fu, dx, units = \"days\")) / 365.25\n  )\n\n# 4) 时间窗：按诊断后 1 年、3 年截断（做 landmark 分析）\ncli <- cli %>%\n  mutate(os_1y = pmin(os_month, 12),\n         ev_1y = if_else(os_month <= 12 & os_status == 1, 1L, 0L))\n\nsummary(cli$os_month)\ntable(cli$os_status, useNA = \"ifany\")",
    "notes": [
      "difftime 的 units 只能是 days/weeks/auto，月要自己除 30.4375（平均月长），直接用 months 会得到整数月，丢精度。",
      "parse_date_time 给多个 orders 时会按顺序尝试，全部失败就返回 NA，解析完必须统计 NA 比例。",
      "存活者的末次随访日期才是删失时间，用今天或数据截止日期当删失点会人为拉长随访。"
    ],
    "pitfalls": [
      "Excel 导出的日期是 1899-12-30 起算的序列号，as.Date(45000, origin='1899-12-30') 才能转对。",
      "as.Date('2019/3/5') 能识别，as.Date('2019年3月5日') 直接 NA，中文日期必须先 gsub 掉汉字。",
      "difftime 返回的是 difftime 类对象，参与算术前要 as.numeric，否则单位会互相干扰。"
    ],
    "next": [
      "stats-06",
      "ml-06",
      "report-01"
    ]
  },
  {
    "id": "rbase-14",
    "track": "rbase",
    "trackName": "R 语言基础",
    "title": "正则清洗：从脏字符串里抠出分组和数值",
    "level": "常用",
    "tags": [
      "正则",
      "stringr",
      "清洗",
      "提取"
    ],
    "packages": [
      "stringr",
      "dplyr",
      "tidyr"
    ],
    "scene": "表型列写着 'Male, 62 years, Stage IIIA' 这种大杂烩，要拆成性别、年龄、分期三个干净变量。",
    "code": "# ============================================================\n# 14 正则：抽取、替换、拆分，一步到位\n# ============================================================\nlibrary(stringr)\nlibrary(dplyr)\nlibrary(tidyr)\n\nx <- c(\"Male, 62 years, Stage IIIA\", \"Female, 55 years, Stage I\",\n       \"male,  70years,  stage IIB \", \"NA\", \"Female, unknown, Stage IV\")\n\n# 1) 统一大小写、压掉多余空格与制表符\nx_clean <- x %>% str_squish() %>% str_to_lower()\nx_clean\n\n# 2) 抽取数值：先想清楚“数字后面跟什么”再写正则\nage <- as.numeric(str_extract(x_clean, \"\\\\d+(?=\\\\s*years)\"))\nsex <- str_extract(x_clean, \"^(male|female)\")\nstage <- str_extract(x_clean, \"stage\\\\s*([iv]+[abc]?)\") %>% str_remove(\"stage\\\\s*\")\n\n# 3) 一次抽多个字段：str_match 返回矩阵，正则里用括号分组\nm <- str_match(x_clean, \"(male|female)[,;\\\\s]+(\\\\d+|unknown)\\\\s*years\")\ndata.frame(sex = m[, 2], age_raw = m[, 3])\n\n# 4) 替换：把各种占位符统一成真正的 NA\nna_pat <- \"^(na|n/a|unknown|not available|-|--|none)$\"\ndf <- data.frame(raw = x_clean)\ndf <- df %>% mutate(raw2 = if_else(str_detect(raw, na_pat), NA_character_, raw))\n\n# 5) 拆分：把 \"Stage IIIA\" 拆成主分期和亚分期\ndf %>% tidyr::extract(raw, into = c(\"T\", \"N\", \"M\"),\n                      regex = \"stage\\\\s*(iv|iii|ii|i)([abc]?)(\\\\d?)\", remove = FALSE)\n\n# 6) 常用字符类速查\nstr_detect(\"TP53-AS1\", \"^TP53\")        # 前缀\nstr_detect(c(\"IL-6\", \"IL6\"), \"IL-?6\")  # 可选连字符\nstr_remove_all(\"a1b2c3\", \"\\\\d\")        # 去掉所有数字\nstr_replace_all(\"GSE 123 456\", \"\\\\s+\", \"\")  # 去空白",
    "notes": [
      "R 里写正则要双反斜杠：\\d 表示数字，写成 \\d 会被字符串解析吃掉（R 会报 unrecognized escape）。",
      "str_extract 只返回第一个匹配，要全部匹配用 str_extract_all（返回 list）。",
      "先 str_squish + str_to_lower 做标准化，能挡掉一半的脏数据问题。"
    ],
    "pitfalls": [
      "gsub 默认区分大小写，且 pattern 里 . 匹配任意字符，写 'N/A' 会误伤 'NXA'，要转义成 \\\\. 或用 fixed = TRUE。",
      "str_match 匹配失败时对应行返回 NA 而不是报错，忘了检查 NA 比例就会带着一堆空值往下跑。",
      "'62years' 中间没空格时，\\\\d+\\\\s*years 能匹配，但 '\\\\d+ years' 就匹配不上，空格要用 \\\\s* 而不是硬写一个空格。"
    ],
    "next": [
      "io-07",
      "io-06",
      "rbase-12"
    ]
  },
  {
    "id": "bulk-11",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "差异分析主力：DESeq2 从 counts 到可发表结果表",
    "level": "常用",
    "tags": [
      "差异表达",
      "DESeq2",
      "apeglm",
      "counts"
    ],
    "packages": [
      "DESeq2",
      "apeglm",
      "tibble",
      "dplyr",
      "ggplot2"
    ],
    "scene": "手上是 TCGA 或自测的基因级 count 矩阵，要做肿瘤 vs 正常的两组差异分析并导出完整结果表。",
    "code": "# ============================================================\n# 11 DESeq2 标准流程：过滤 → 建模 → 收缩 → 导出\n# ============================================================\nlibrary(DESeq2)\nlibrary(apeglm)\nlibrary(dplyr)\nlibrary(tibble)\n\ndat <- readRDS(\"data/processed/tcga_luad.rds\")\ncnt <- dat$counts\ncli <- dat$coldata\nstopifnot(identical(colnames(cnt), rownames(cli)))     # 样本顺序必须严格一致\n\n# 分组因子：第一个水平是对照组\ncli$group <- factor(cli$group, levels = c(\"Normal\", \"Tumor\"))\ntable(cli$group)\n\ndds <- DESeqDataSetFromMatrix(countData = round(cnt),   # 必须是整数\n                              colData   = cli,\n                              design    = ~ group)\n# 低表达过滤：至少在 3 个样本里 count >= 10，能显著提高检验功效\nkeep <- rowSums(counts(dds) >= 10) >= 3\ndds  <- dds[keep, ]\ncat(\"过滤后基因数：\", nrow(dds), \"\\n\")\n\ndds <- DESeq(dds, fitType = \"parametric\")\nres <- results(dds, contrast = c(\"group\", \"Tumor\", \"Normal\"), alpha = 0.05)\nsummary(res)\n\n# logFC 收缩：低表达基因的 logFC 会被压向 0，火山图和排序更稳\nres <- lfcShrink(dds, contrast = c(\"group\", \"Tumor\", \"Normal\"),\n                 res = res, type = \"apeglm\")\n\nout <- as.data.frame(res) %>%\n  rownames_to_column(\"gene\") %>%\n  arrange(padj) %>%\n  filter(!is.na(padj))\n\nwrite.csv(out, \"results/tables/DEG_tumor_vs_normal.csv\", row.names = FALSE)\n\n# 标准化表达（给热图/免疫浸润用，不要给差异分析用）\nnorm_cnt <- counts(dds, normalized = TRUE)\nvsd <- vst(dds, blind = FALSE)\nsaveRDS(list(res = out, norm = norm_cnt, vsd = assay(vsd)),\n        \"results/tables/deseq2_bundle.rds\")\n\n# 快速看整体：PCA + 样本距离\nplotPCA(vsd, intgroup = \"group\")",
    "notes": [
      "设计公式 ~ group 只校正分组；如果有批次或性别混杂，应写成 ~ batch + group，否则差异基因里混着批次效应。",
      "lfcShrink 的 apeglm 只支持 coef，用 contrast 时要传 res 参数；ashr 更慢但更稳。",
      "vst 的 blind = FALSE 会用设计公式估计离散度，做无监督聚类时才用 blind = TRUE。"
    ],
    "pitfalls": [
      "counts 里有小数（TPM/FPKM 或 RSEM expected count 未取整）会直接报 'counts must be integers'，round 一下或改用 tximport 的 countsFromAbundance='no'。",
      "样本顺序不一致不会报错但结果是错的：DESeq2 只按列名匹配，colData 行名和 counts 列名必须完全一致。",
      "过滤阈值太松（比如 rowSums(counts) > 0）会留下一堆全 0 基因，离散度估计被拉偏，padj 分布异常。"
    ],
    "next": [
      "bulk-12",
      "bulk-24",
      "bulk-25"
    ]
  },
  {
    "id": "bulk-12",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "limma-voom：大样本量芯片/RNA-seq 的经典差异分析",
    "level": "常用",
    "tags": [
      "limma",
      "voom",
      "差异表达",
      "线性模型"
    ],
    "packages": [
      "limma",
      "edgeR",
      "dplyr"
    ],
    "scene": "样本量上百（TCGA 泛癌、UK Biobank 类数据），DESeq2 跑得慢且过度保守，想用 limma 的线性模型框架。",
    "code": "# ============================================================\n# 12 limma-voom：count → logCPM → 加权最小二乘\n# ============================================================\nlibrary(limma)\nlibrary(edgeR)\nlibrary(dplyr)\n\ncnt <- readRDS(\"data/processed/tcga_luad.rds\")$counts\ncli <- readRDS(\"data/processed/tcga_luad.rds\")$coldata\ncli$group <- factor(cli$group, levels = c(\"Normal\", \"Tumor\"))\n\ndge <- DGEList(counts = round(cnt), group = cli$group)\n# filterByExpr 会根据组大小和文库大小自动定阈值，比手写 rowSums 靠谱\nkeep <- filterByExpr(dge, design = model.matrix(~ group, data = cli))\ndge  <- dge[keep, , keep.lib.sizes = FALSE]\ndge  <- calcNormFactors(dge, method = \"TMM\")\n\ndesign <- model.matrix(~ 0 + group, data = cli)\ncolnames(design) <- levels(cli$group)\n\nv <- voom(dge, design, plot = TRUE)          # 顺手看均值-方差趋势是否被拉平\nfit <- lmFit(v, design)\ncontr <- makeContrasts(Tumor - Normal, levels = design)\nfit2 <- contrasts.fit(fit, contr)\nfit2 <- eBayes(fit2, trend = TRUE, robust = TRUE)\n\ntt <- topTable(fit2, number = Inf, adjust.method = \"BH\", sort.by = \"P\")\nhead(tt)\nwrite.csv(tt, \"results/tables/DEG_limma_voom.csv\")\n\n# 一次比较多组：把对比写成一个矩阵，一次性出所有结果\n# contr2 <- makeContrasts(A - B, A - C, B - C, levels = design)\n# fit3 <- eBayes(contrasts.fit(lmFit(v, design), contr2))\n# decideTests(fit3) %>% summary()\n\n# 需要校正批次时：把 batch 加进 design，limma 会当作协变量处理\n# design <- model.matrix(~ 0 + group + batch, data = cli)",
    "notes": [
      "voom 的 plot = TRUE 一定要开：如果均值-方差曲线是平的或反的，说明数据本身有问题（比如已经是 log 值或归一化过的）。",
      "trend = TRUE 让方差随表达量变化，robust = TRUE 降低离群样本的影响，两者在真实数据上通常都要开。",
      "大样本时 limma 的 eBayes 比 DESeq2 快一个数量级，且对低表达基因不那么保守。"
    ],
    "pitfalls": [
      "voom 之后再 log2 转换是错的，voom 输出的 E 已经是 log2 CPM。",
      "design 用 ~ 0 + group 和用 ~ group 的对比定义完全不同：前者可以直接写 Tumor - Normal，后者只能写 grouptumor。",
      "filterByExpr 依赖 group 信息，分组传错（比如传了数值）会过滤掉大量本该保留的基因。"
    ],
    "next": [
      "bulk-13",
      "bulk-14",
      "bulk-18"
    ]
  },
  {
    "id": "bulk-13",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "edgeR 准似然检验：小样本 RNA-seq 的稳妥选择",
    "level": "进阶",
    "tags": [
      "edgeR",
      "QL",
      "差异表达",
      "小样本"
    ],
    "packages": [
      "edgeR",
      "dplyr"
    ],
    "scene": "每组只有 3 个样本，DESeq2 的 Wald 检验过于保守，想用 edgeR 的 QL F 检验拿到更合理的假阳性控制。",
    "code": "# ============================================================\n# 13 edgeR：QL F 检验（小样本首选）\n# ============================================================\nlibrary(edgeR)\nlibrary(dplyr)\n\ncnt <- readRDS(\"data/processed/mouse_liver_counts.rds\")\ncli <- readRDS(\"data/processed/mouse_liver_cli.rds\")\ncli$group <- factor(cli$group, levels = c(\"WT\", \"KO\"))\n\ndge <- DGEList(counts = cnt, group = cli$group)\nkeep <- filterByExpr(dge)\ndge <- dge[keep, , keep.lib.sizes = FALSE]\ndge <- calcNormFactors(dge)\n\ndesign <- model.matrix(~ group, data = cli)\n\n# 估计离散度：BCV 图能看出批内重复性，BCV > 0.3 通常说明样本异质性大\ndge <- estimateDisp(dge, design, robust = TRUE)\nplotBCV(dge)\n\nfit <- glmQLFit(dge, design, robust = TRUE)\nqlf <- glmQLFTest(fit, coef = 2)              # coef = 2 就是 groupKO\nres <- topTags(qlf, n = Inf, sort.by = \"PValue\")$table\nhead(res)\n\n# 若要做“任一方向都算显著”的全局检验，用 coef = 全部\n# qlf_all <- glmQLFTest(fit, coef = 1:2)\n\nwrite.csv(res, \"results/tables/DEG_edgeR_QL.csv\")\n# 分类结果（1=上调，-1=下调，0=不显著）\ndec <- decideTests(qlf, p.value = 0.05, lfc = 1)\nsummary(dec)\n\n# 与经典 LRT 对比：QL 在小样本下通常 p 值更大但更可信\n# lrt <- glmLRT(glmFit(dge, design), coef = 2)",
    "notes": [
      "robust = TRUE 让离散度估计对离群基因不敏感，代价是慢一点，基因数上万时值得。",
      "glmQLFit 会做经验贝叶斯收缩，所以 3 vs 3 的小样本也能得到稳定的离散度估计，这是它优于普通 glm 的核心。",
      "decideTests 的 lfc 参数是 log2 尺度，lfc = 1 表示 2 倍变化。"
    ],
    "pitfalls": [
      "calcNormFactors 之后不要去改 dge$counts，归一化因子存在 samples$norm.factors 里，改了 counts 会让后续模型全错。",
      "coef 是 design 矩阵的列号，加了协变量后分组可能不在第 2 列，要用 grep('group', colnames(design)) 定位。",
      "filterByExpr 在每组样本数 < 3 时会自动放宽阈值，此时过滤结果对下游影响很大，要人工看一眼保留了多少基因。"
    ],
    "next": [
      "bulk-12",
      "bulk-11",
      "bulk-15"
    ]
  },
  {
    "id": "bulk-14",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "批次效应校正：ComBat / ComBat-seq / SVA",
    "level": "进阶",
    "tags": [
      "批次效应",
      "ComBat",
      "sva",
      "去批次"
    ],
    "packages": [
      "sva",
      "limma",
      "ggplot2"
    ],
    "scene": "数据来自 3 个不同中心或 2 次测序，PCA 上按批次分成了两坨，差异基因一半是批次造成的。",
    "code": "# ============================================================\n# 14 批次校正：芯片用 ComBat，count 用 ComBat-seq，未知因素用 SVA\n# ============================================================\nlibrary(sva)\nlibrary(limma)\nlibrary(ggplot2)\n\nexpr <- readRDS(\"data/processed/expr_log2_all.rds\")   # 已 log2 且归一化\ncli  <- readRDS(\"data/processed/clinical_all.rds\")\ncli$batch <- factor(cli$batch)\ncli$group <- factor(cli$group)\n\n# ---- 0) 先看批次有多严重 ----\npca <- prcomp(t(expr[order(apply(expr, 1, var), decreasing = TRUE)[1:2000], ]), scale. = TRUE)\nplot(pca$x[, 1:2], col = cli$batch, pch = 19, main = \"校正前\")\n\n# ---- 1) 芯片/已归一化表达：ComBat ----\n# mod 必须包含你要保留的生物学变量，否则分组效应会被一起抹掉\nmod <- model.matrix(~ group, data = cli)\nexpr_cb <- ComBat(dat = expr, batch = cli$batch, mod = mod, par.prior = TRUE)\n\n# ---- 2) 原始 counts：ComBat-seq（负二项，输出仍是 count）----\n# cnt_cb <- ComBat_seq(counts = round(cnt), batch = cli$batch, group = cli$group)\n\n# ---- 3) 批次未知（比如建库日期、操作者未记录）：SVA 估 surrogate variable ----\nmod0 <- model.matrix(~ 1, data = cli)\nsv   <- num.sv(expr, mod, method = \"leek\")     # 建议几个 SV\nsvaobj <- svaseq(expr, mod, mod0, n.sv = sv)\ndesign <- cbind(mod, svaobj$sv)                # 把 SV 当协变量塞进设计矩阵\n\n# ---- 4) 校正后再看一次 ----\npca2 <- prcomp(t(expr_cb[order(apply(expr_cb, 1, var), decreasing = TRUE)[1:2000], ]), scale. = TRUE)\nplot(pca2$x[, 1:2], col = cli$batch, pch = 19, main = \"校正后\")\n\nsaveRDS(expr_cb, \"data/processed/expr_combat.rds\")",
    "notes": [
      "ComBat 的 mod 里必须放**要保留**的变量（分组），放错会把真实差异当批次抹掉。",
      "ComBat 处理的是 log2 尺度数据；count 数据先用 vst/logCPM，或者直接用 ComBat-seq。",
      "批次和分组完全共线（比如所有对照都在批次 1）时任何方法都救不了，只能重新设计实验。"
    ],
    "pitfalls": [
      "对已经标准化过的矩阵再做 ComBat，会出现负值且分布异常，PCA 上反而更差。",
      "ComBat-seq 要求输入整数 count，传 TPM 会报错或给出无意义结果。",
      "用 SVA 校正后再做差异分析，p 值会偏小（自由度被高估），报结果时要在方法里说明用了 SV。"
    ],
    "next": [
      "bulk-12",
      "bulk-19",
      "scrna-12"
    ]
  },
  {
    "id": "bulk-15",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "CPM / TPM / FPKM 换算与低表达过滤",
    "level": "常用",
    "tags": [
      "归一化",
      "TPM",
      "FPKM",
      "过滤"
    ],
    "packages": [
      "edgeR",
      "dplyr"
    ],
    "scene": "要拿 TPM 画热图、算免疫浸润，或者要在方法学部分交代清楚自己用的是哪种归一化。",
    "code": "# ============================================================\n# 15 三种归一化的定义与互转（附基因长度获取）\n# ============================================================\nlibrary(edgeR)\nlibrary(dplyr)\n\ncnt <- readRDS(\"data/processed/counts.rds\")        # 基因 × 样本，整数\ngene_len <- readRDS(\"data/processed/gene_length.rds\")  # 与 cnt 行对应，单位 bp\n\n# ---- CPM：只校正测序深度，不考虑基因长度 ----\ncpm_mat <- cpm(cnt, log = FALSE, prior.count = 0)\nlog_cpm <- cpm(cnt, log = TRUE, prior.count = 1)   # 加 1 避免 log(0)\n\n# ---- TPM：先按长度归一（RPK），再按总和归一，跨样本可比 ----\nrpk <- cnt / (gene_len / 1000)\ntpm <- sweep(rpk, 2, colSums(rpk), \"/\") * 1e6\ncolSums(tpm)                                        # 每列都应该是 1e6\n\n# ---- FPKM：先按深度归一，再按长度归一（历史遗留，跨样本不完全可比）----\nfpkm <- sweep(rpk, 2, colSums(cnt) / 1e6, \"/\")\n\n# ---- 低表达过滤：三种常见口径 ----\nkeep1 <- rowSums(cnt >= 10) >= 3                    # 至少 3 个样本 count >= 10\nkeep2 <- rowMeans(cpm_mat) > 1                      # 平均 CPM > 1\nkeep3 <- filterByExpr(DGEList(cnt))                 # edgeR 官方推荐\ndata.frame(keep1 = sum(keep1), keep2 = sum(keep2), keep3 = sum(keep3))\n\n# ---- 常用下游格式 ----\nlog2_tpm <- log2(tpm + 1)                           # 热图/聚类\nzscore   <- t(scale(t(log2_tpm)))                   # 按基因标准化，热图必用\n\nsum(is.na(zscore))                                  # 全 0 方差基因会产生 NaN\nsaveRDS(list(tpm = tpm, log2tpm = log2_tpm, z = zscore),\n        \"data/processed/norm_bundle.rds\")",
    "notes": [
      "TPM 每列之和恒为 1e6，FPKM 不是，这是判断代码写没写错最快的办法。",
      "热图必须做基因层面的 z-score，否则高表达基因会主导颜色；scale 后要检查 NaN（方差为 0 的行）。",
      "免疫浸润（CIBERSORT/ESTIMATE）一般用 TPM 或线性尺度表达，不要用 z-score。"
    ],
    "pitfalls": [
      "基因长度表必须和表达矩阵行一一对应且同版本注释，用错版本会让 TPM 系统性偏移。",
      "log2(TPM + 1) 里的 +1 是伪计数，做倍数比较时必须两端都加，只加一边会导致比值失真。",
      "用 normalizeBetweenArrays 处理 RNA-seq 是错误的（那是芯片方法），RNA-seq 应该走 TMM/TPM。"
    ],
    "next": [
      "bulk-11",
      "bulk-20",
      "bulk-24"
    ]
  },
  {
    "id": "bulk-16",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "WGCNA 共表达网络：软阈值、模块与表型关联",
    "level": "进阶",
    "tags": [
      "WGCNA",
      "共表达",
      "模块",
      "hub基因"
    ],
    "packages": [
      "WGCNA",
      "dplyr",
      "ggplot2"
    ],
    "scene": "想从表达矩阵里找出协同变化的一群基因（模块），并看哪个模块和临床分期、生存最相关。",
    "code": "# ============================================================\n# 16 WGCNA：从表达矩阵到模块-性状关联与 hub 基因\n# ============================================================\nlibrary(WGCNA)\nlibrary(dplyr)\noptions(stringsAsFactors = FALSE)\nenableWGCNAThreads()\n\ndatExpr <- t(readRDS(\"data/processed/expr_log2_tpm.rds\"))   # WGCNA 要 样本 × 基因\ndatTraits <- readRDS(\"data/processed/clinical.rds\")[, c(\"stage_num\", \"age\", \"OS_month\")]\n\n# 1) 剔除离群样本与低质量基因\ngsg <- goodSamplesGenes(datExpr, verbose = 0)\ndatExpr <- datExpr[gsg$goodSamples, gsg$goodGenes]\n# 层次聚类看有没有明显离群的样本，cutHeight 按树高定\nsampleTree <- hclust(dist(datExpr), method = \"average\")\nplot(sampleTree, main = \"Sample clustering\", sub = \"\", xlab = \"\")\n# cutreeStatic(sampleTree, cutHeight = 60, minSize = 10)\n\n# 2) 软阈值：挑第一个 R^2 达到 0.85 的 power\nsft <- pickSoftThreshold(datExpr, powerVector = c(1:10, 12, 14, 16), networkType = \"unsigned\")\nprint(sft$powerEstimate)\nplot(sft$fitIndices[, 1], -sign(sft$fitIndices[, 3]) * sft$fitIndices[, 2],\n     xlab = \"soft threshold (power)\", ylab = \"scale free topology R^2\"); abline(h = 0.85, col = \"red\")\n\n# 3) 一步建网 + 找模块\nnet <- blockwiseModules(datExpr, power = sft$powerEstimate,\n                        TOMType = \"unsigned\", minModuleSize = 30,\n                        mergeCutHeight = 0.25, numericLabels = TRUE,\n                        pamRespectsDendro = FALSE, saveTOMs = FALSE, verbose = 0)\ntable(net$colors)\nmoduleColors <- labels2colors(net$colors)\n\n# 4) 模块与性状相关（关键一步）\nMEs <- moduleEigengenes(datExpr, moduleColors)$eigengenes\nMEs <- orderMEs(MEs)\nmoduleTraitCor <- cor(MEs, datTraits, use = \"p\")\nmoduleTraitPvalue <- corPvalueStudent(moduleTraitCor, nrow(datExpr))\nlabeledHeatmap(Matrix = moduleTraitCor, xLabels = names(datTraits),\n               yLabels = names(MEs), ySymbols = names(MEs), colorLabels = FALSE,\n               colors = blueWhiteRed(50), textMatrix = signif(moduleTraitPvalue, 2),\n               setStdMargins = FALSE, cex.text = 0.6, zlim = c(-1, 1))\n\n# 5) 从目标模块里挑 hub 基因（|kME| 高且连通度高）\ngeneModuleMembership <- cor(datExpr, MEs, use = \"p\")\ntarget <- \"turquoise\"\nkME <- geneModuleMembership[, paste0(\"ME\", target)]\nhub <- names(sort(kME, decreasing = TRUE))[1:50]\nwrite.csv(data.frame(gene = hub, kME = kME[hub]),\n          \"results/tables/wgcna_hub_turquoise.csv\", row.names = FALSE)",
    "notes": [
      "WGCNA 的输入是 log2 尺度、已过滤的表达矩阵，且必须是 样本 × 基因（和常规矩阵相反）。",
      "blockwiseModules 的 minModuleSize 决定模块粒度：30 适合几千基因，1 万多基因可以设 50~100。",
      "模块-性状关联用的是模块特征基因（ME）而不是模块内基因均值，ME 就是第一主成分。"
    ],
    "pitfalls": [
      "pickSoftThreshold 返回的 powerEstimate 可能是 NA（没有 power 达到阈值），此时手动选 12~20 并说明理由。",
      "样本量小于 15 时 WGCNA 的网络极不稳定，文献里的“模块”基本不可复现。",
      "traits 里含字符列（如分期 'III'）会直接报错，必须先转成数值或哑变量。"
    ],
    "next": [
      "bulk-17",
      "viz-07",
      "bulk-11"
    ]
  },
  {
    "id": "bulk-17",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "GO / KEGG 过表达富集（ORA）与结果精简",
    "level": "常用",
    "tags": [
      "GO",
      "KEGG",
      "clusterProfiler",
      "富集分析"
    ],
    "packages": [
      "clusterProfiler",
      "org.Hs.eg.db",
      "enrichplot",
      "DOSE"
    ],
    "scene": "拿到几百个差异基因，想知道它们集中在哪些通路，并画一张能放进文章的富集气泡图。",
    "code": "# ============================================================\n# 17 ORA：enrichGO / enrichKEGG → simplify → 出图出表\n# ============================================================\nlibrary(clusterProfiler)\nlibrary(org.Hs.eg.db)\nlibrary(enrichplot)\nlibrary(dplyr)\n\ndeg <- read.csv(\"results/tables/DEG_tumor_vs_normal.csv\")\nsig <- deg %>% filter(padj < 0.05, abs(logFC) > 1)\ngenes <- bitr(sig$gene, fromType = \"SYMBOL\", toType = \"ENTREZID\", OrgDb = org.Hs.eg.db)\ncat(\"输入\", nrow(sig), \"个，成功映射\", nrow(genes), \"个\\n\")\n\n# ---- GO：三个本体分开跑，不要一锅端 ----\nego_bp <- enrichGO(gene = genes$ENTREZID, OrgDb = org.Hs.eg.db, keyType = \"ENTREZID\",\n                   ont = \"BP\", pAdjustMethod = \"BH\",\n                   pvalueCutoff = 0.05, qvalueCutoff = 0.2, readable = TRUE)\nego_bp <- simplify(ego_bp, cutoff = 0.7, by = \"p.adjust\", select_fun = min)  # 去冗余\ndotplot(ego_bp, showCategory = 15, split = \".sign\") + facet_grid(. ~ .sign)\n\n# ---- KEGG：要联网，organism 用三字母代码 ----\nekegg <- enrichKEGG(gene = genes$ENTREZID, organism = \"hsa\",\n                    pvalueCutoff = 0.05, qvalueCutoff = 0.2)\nekegg <- setReadable(ekegg, OrgDb = org.Hs.eg.db, keyType = \"ENTREZID\")\n\n# ---- 导出：数据框直接进补充材料 ----\nwrite.csv(as.data.frame(ego_bp), \"results/tables/GO_BP.csv\", row.names = FALSE)\nwrite.csv(as.data.frame(ekegg),  \"results/tables/KEGG.csv\", row.names = FALSE)\n\n# ---- 上下调分开做，避免方向被稀释 ----\nup   <- sig %>% filter(logFC > 1)  %>% pull(gene)\ndown <- sig %>% filter(logFC < -1) %>% pull(gene)\ncompareCluster(geneClusters = list(Up = up, Down = down),\n               fun = \"enrichKEGG\", organism = \"hsa\") %>% dotplot(showCategory = 10)",
    "notes": [
      "simplify 用语义相似度去掉高度冗余的 GO 条目，一篇论文里 BP 结果留 10~15 条就够。",
      "readable = TRUE 会把 Entrez 转回 gene symbol，方便直接读表；但对结果本身没有影响。",
      "上调和下调基因分开富集，混在一起会互相稀释，尤其是通路方向相反的疾病。"
    ],
    "pitfalls": [
      "enrichKEGG 每次调用都会联网拉 KEGG 数据库，断网或 KEGG 限流时直接报错，可用 clusterProfiler::download_KEGG 提前缓存。",
      "背景基因集默认是全基因组，如果你的数据只测到了 2 万个蛋白编码基因，应该显式传 universe。",
      "pvalueCutoff 与 qvalueCutoff 同时生效，两个都要满足才保留，容易误以为没结果。"
    ],
    "next": [
      "bulk-18",
      "io-08",
      "bulk-19"
    ]
  },
  {
    "id": "bulk-18",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "GSEA：fgsea 与 clusterProfiler 两条实现路线",
    "level": "进阶",
    "tags": [
      "GSEA",
      "fgsea",
      "gseGO",
      "MSigDB"
    ],
    "packages": [
      "fgsea",
      "clusterProfiler",
      "org.Hs.eg.db",
      "msigdbr",
      "ggplot2"
    ],
    "scene": "差异基因只有几十个，ORA 富集不出东西；想用全基因排序做 GSEA，看通路整体是激活还是抑制。",
    "code": "# ============================================================\n# 18 GSEA：先把全基因排好序，再算富集分数\n# ============================================================\nlibrary(fgsea)\nlibrary(clusterProfiler)\nlibrary(org.Hs.eg.db)\nlibrary(msigdbr)\nlibrary(dplyr)\nlibrary(ggplot2)\n\ndeg <- read.csv(\"results/tables/DEG_tumor_vs_normal.csv\")\n\n# 1) 排序向量：用 shrunken logFC 或 stat 列，名字必须是基因\nranks <- deg$logFC\nnames(ranks) <- deg$gene\nranks <- sort(ranks[!is.na(ranks)], decreasing = TRUE)\nranks <- ranks[!duplicated(names(ranks))]\n\n# 2) 基因集：MSigDB Hallmark（50 条，最稳）\nhallmark <- msigdbr(species = \"Homo sapiens\", collection = \"H\")\npathways <- split(hallmark$gene_symbol, hallmark$gs_name)\n\nset.seed(20240101)\nfg <- fgsea(pathways = pathways, stats = ranks,\n            minSize = 15, maxSize = 500, eps = 0)\nfg <- fg %>% arrange(padj)\nhead(fg[, c(\"pathway\", \"NES\", \"padj\", \"size\")])\n\n# 3) 出图：经典 GSEA 曲线 + NES 条形图\nplotEnrichment(pathways[[\"HALLMARK_E2F_TARGETS\"]], ranks)\nplotGseaTable(pathways[fg$pathway[1:5]], ranks, fg, gseaParam = 0.5)\n\nggplot(fg %>% filter(padj < 0.05) %>% mutate(path = reorder(pathway, NES)),\n       aes(NES, path, fill = NES > 0)) +\n  geom_col() + scale_fill_manual(values = c(\"#2E86AB\", \"#D1495B\")) +\n  theme_bw() + labs(y = NULL, fill = \"Activated\")\n\n# 4) 另一条路线：clusterProfiler 的 gseGO（不用自己准备基因集）\ngl <- deg$logFC; names(gl) <- deg$gene\ngl <- sort(gl, decreasing = TRUE)\neg <- gseGO(geneList = gl, OrgDb = org.Hs.eg.db, keyType = \"SYMBOL\",\n            ont = \"BP\", minGSSize = 15, pvalueCutoff = 0.05, verbose = FALSE)\ndotplot(eg, showCategory = 15, split = \".sign\")",
    "notes": [
      "排序指标优先用 DESeq2 的 stat（= logFC/SE），比裸 logFC 更稳；没有 stat 时用收缩后的 logFC。",
      "minSize/maxSize 决定只保留多大基因集的通路，默认 15~500 是 MSigDB 场景的经验值。",
      "NES 的符号才是方向：NES > 0 表示该通路在表型组里整体上调，不要只看 padj。"
    ],
    "pitfalls": [
      "ranks 里有重复基因名（多探针/多转录本）会让 fgsea 报错或给出错误结果，必须先按绝对值最大去重。",
      "MSigDB 的基因集是全基因组的，如果你的平台只测了 2 万个基因，通路大小会被高估，NES 有偏。",
      "fgsea 的 eps = 0 会跑得很慢（精确计算），基因集多时保持默认 1e-10 更快。"
    ],
    "next": [
      "bulk-17",
      "bulk-19",
      "bulk-25"
    ]
  },
  {
    "id": "bulk-19",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "GSVA 与 ssGSEA：把通路/细胞类型变成样本级打分",
    "level": "进阶",
    "tags": [
      "GSVA",
      "ssGSEA",
      "通路打分",
      "免疫细胞"
    ],
    "packages": [
      "GSVA",
      "limma",
      "pheatmap",
      "dplyr"
    ],
    "scene": "不想只做“有没有富集”，而是想给每个样本算一个通路活性分数，再拿去做生存分析或相关性分析。",
    "code": "# ============================================================\n# 19 GSVA / ssGSEA：样本 × 通路 的打分矩阵\n# ============================================================\nlibrary(GSVA)\nlibrary(limma)\nlibrary(pheatmap)\n\nexpr <- readRDS(\"data/processed/expr_log2_tpm.rds\")   # 基因 × 样本，log2 尺度\nexpr <- expr[!duplicated(rownames(expr)), ]\n\n# 基因集：可以用 MSigDB，也可以自己整理成 list\ngmt <- msigdbr::msigdbr(species = \"Homo sapiens\", collection = \"H\")\ngene_sets <- split(gmt$gene_symbol, gmt$gs_name)\n\n# ---- 新版 GSVA（>= 1.52）参数对象写法 ----\nparam <- gsvaParam(exprData = as.matrix(expr), geneSets = gene_sets,\n                   kcdf = \"Gaussian\", minSize = 15, maxSize = 500)\ngsva_mat <- gsva(param, verbose = FALSE)\n\n# ---- ssGSEA：更适合免疫细胞浸润打分，输出是相对富集分数 ----\nsparam <- ssgseaParam(exprData = as.matrix(expr), geneSets = gene_sets, normalize = TRUE)\nssgsea_mat <- gsva(sparam, verbose = FALSE)\n\n# 老版本 GSVA（< 1.52）的写法：\n# gsva_mat <- gsva(as.matrix(expr), gene_sets, method = \"gsva\", kcdf = \"Gaussian\")\n\n# ---- 下游：通路分数做组间比较 ----\ncli <- readRDS(\"data/processed/clinical.rds\")\ncli$group <- factor(cli$group, levels = c(\"Normal\", \"Tumor\"))\ndesign <- model.matrix(~ group, data = cli)\nfit <- eBayes(lmFit(gsva_mat[, rownames(cli)], design))\ntopTable(fit, coef = 2, number = 20, sort.by = \"P\")\n\n# ---- 热图：只画差异最大的 30 条通路 ----\ndif <- topTable(fit, coef = 2, number = 30)\npheatmap(gsva_mat[dif$ID, ], scale = \"row\", annotation_col = cli[\"group\"],\n         show_rownames = TRUE, fontsize_row = 8,\n         filename = \"results/figures/gsva_heatmap.pdf\", width = 7, height = 8)\n\nsaveRDS(list(gsva = gsva_mat, ssgsea = ssgsea_mat), \"results/tables/pathway_scores.rds\")",
    "notes": [
      "kcdf 的选择取决于数据：log2 芯片/TPM 用 'Gaussian'，原始 count 用 'Poisson'。",
      "GSVA 输出的是相对排名分数（约 -1~1），不是表达量，不能跨数据集直接比较绝对值。",
      "ssGSEA 的分数依赖样本内排序，所以同一通路在不同样本间的可比性优于 GSVA，但同样不能跨平台比较。"
    ],
    "pitfalls": [
      "新版 GSVA 用 gsvaParam()/ssgseaParam()，老代码 gsva(expr, sets, method=...) 在新版会报 deprecated 错误。",
      "表达矩阵里有重复基因名会让 GSVA 直接报错 'duplicate gene names'，先 collapse。",
      "minSize 设太小（< 10）会得到极不稳定的分数，通路里只有 3 个基因时排序噪声主导结果。"
    ],
    "next": [
      "bulk-20",
      "bulk-23",
      "bulk-21"
    ]
  },
  {
    "id": "bulk-20",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "CIBERSORT 免疫浸润：22 种免疫细胞比例",
    "level": "常用",
    "tags": [
      "CIBERSORT",
      "免疫浸润",
      "LM22",
      "IOBR"
    ],
    "packages": [
      "IOBR",
      "e1071",
      "preprocessCore",
      "ggplot2"
    ],
    "scene": "想算每个样本里 22 种免疫细胞的相对比例，看肿瘤和正常、高低下高危组之间的免疫浸润差异。",
    "code": "# ============================================================\n# 20 CIBERSORT：LM22  signature 反卷积\n# ============================================================\nlibrary(IOBR)          # 一站式封装，省去手工整理 LM22\nlibrary(ggplot2)\nlibrary(dplyr)\n\nexpr <- readRDS(\"data/processed/expr_tpm.rds\")   # 线性尺度 TPM，不要 log、不要 z-score\nexpr <- expr[!duplicated(rownames(expr)), ]\n\n# IOBR 的 cibersort 会调用原始 CIBERSORT.R，perm 是置换次数\ncib <- deconvo_tme(eset = expr, method = \"cibersort\",\n                   arrays = FALSE, perm = 100, absolute = FALSE)\n# 返回前几列是 ID/方法名，后面 22 列是细胞比例\ncell_cols <- colnames(cib)[-(1:3)]\nhead(cib[, c(\"ID\", cell_cols[1:5])])\n\n# 每一行比例和应该接近 1（CIBERSORT 会做归一化）\nsummary(rowSums(cib[, cell_cols]))\n\n# ---- 与分组关联 ----\ncli <- readRDS(\"data/processed/clinical.rds\")\ndf <- merge(cib, cli[, c(\"sample\", \"group\")], by.x = \"ID\", by.y = \"sample\")\ndf_long <- tidyr::pivot_longer(df, cols = all_of(cell_cols),\n                               names_to = \"cell\", values_to = \"frac\")\nggplot(df_long, aes(cell, frac, fill = group)) +\n  geom_boxplot(outlier.size = 0.3) +\n  theme_bw() + theme(axis.text.x = element_text(angle = 45, hjust = 1)) +\n  labs(x = NULL, y = \"Estimated fraction\")\n\n# ---- 差异检验（比例数据不服从正态，用 Wilcoxon + BH）----\nres <- df_long %>% group_by(cell) %>%\n  summarise(p = wilcox.test(frac ~ group)$p.value, .groups = \"drop\") %>%\n  mutate(padj = p.adjust(p, \"BH\")) %>% arrange(padj)\n\n# ---- 手工调用原始脚本的替代方案 ----\n# source(\"CIBERSORT.R\")   # 从 Newman 实验室申请后拿到\n# res <- CIBERSORT(sig_matrix = \"LM22.txt\", mixture_file = \"expr.txt\", perm = 100, QN = FALSE)\nwrite.csv(cib, \"results/tables/cibersort_fraction.csv\", row.names = FALSE)",
    "notes": [
      "CIBERSORT 要求输入线性尺度表达（TPM/RPKM），log 转换会让反卷积结果系统性偏移。",
      "QN = FALSE（不跑分位数归一化）在 RNA-seq 上通常更准，芯片数据才开 QN。",
      "比例和为 1 是成分数据，做统计时严格来说要用 CLR 变换或专门成分方法，直接 t 检验会偏高显著。"
    ],
    "pitfalls": [
      "CIBERSORT.R 有使用许可，论文里必须引用 Newman et al. 2015，商业用途需申请。",
      "混合矩阵里如果有大量基因缺失（比如只测了 5000 个基因），反卷积方程欠定，p 值会全是 0 且比例失真。",
      "同一个 sample 在表达矩阵里重复出现，merge 后会一对多，比例被复制，统计结果翻倍。"
    ],
    "next": [
      "bulk-21",
      "bulk-22",
      "bulk-23"
    ]
  },
  {
    "id": "bulk-21",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "ESTIMATE：肿瘤纯度与微环境评分",
    "level": "常用",
    "tags": [
      "ESTIMATE",
      "肿瘤纯度",
      "基质评分",
      "免疫评分"
    ],
    "packages": [
      "estimate",
      "survival",
      "survminer",
      "dplyr"
    ],
    "scene": "要用 ESTIMATEScore / ImmuneScore / StromalScore 做免疫分型，或把肿瘤纯度当成协变量校正。",
    "code": "# ============================================================\n# 21 ESTIMATE：三个评分 + 肿瘤纯度，接着做生存\n# ============================================================\nlibrary(estimate)\nlibrary(dplyr)\nlibrary(survival)\nlibrary(survminer)\n\nexpr <- readRDS(\"data/processed/expr_tpm.rds\")\n# estimate 要求输入矩阵文件，先落盘再读（它内部是 C/Fortran）\nwrite.table(expr, \"tmp_expr_for_estimate.txt\", sep = \"\\t\", quote = FALSE, col.names = NA)\nfilterCommonGenes(input.f = \"tmp_expr_for_estimate.txt\",\n                  output.f = \"tmp_expr_common.txt\", id = \"GeneSymbol\")\nestimateScore(input.ds = \"tmp_expr_common.txt\",\n              output.ds = \"tmp_expr_estimate.txt\", platform = \"illumina\")\nscores <- read.table(\"tmp_expr_estimate.txt\", sep = \"\\t\", skip = 2, header = TRUE, row.names = 1)\nscores <- t(scores[, -1])                       # 转成 样本 × 3\ncolnames(scores) <- c(\"StromalScore\", \"ImmuneScore\", \"ESTIMATEScore\")\nscores <- as.data.frame(scores)\nscores$TumorPurity <- cos(0.6049872018 + 0.0001467884 * scores$ESTIMATEScore)\n\n# ---- 合并临床，按 ImmuneScore 中位数分高低危 ----\ncli <- readRDS(\"data/processed/clinical.rds\")\ndf <- merge(scores, cli[, c(\"sample\", \"OS_time\", \"OS_status\")],\n            by.x = \"row.names\", by.y = \"sample\")\ndf$immune_grp <- ifelse(df$ImmuneScore > median(df$ImmuneScore), \"High\", \"Low\")\n\nfit <- survfit(Surv(OS_time, OS_status) ~ immune_grp, data = df)\nggsurvplot(fit, data = df, pval = TRUE, risk.table = TRUE,\n           palette = c(\"#2E86AB\", \"#D1495B\"))\n\ncoxph(Surv(OS_time, OS_status) ~ ImmuneScore + age + stage, data = merge(df, cli)) %>% summary()\n\nunlink(c(\"tmp_expr_for_estimate.txt\", \"tmp_expr_common.txt\", \"tmp_expr_estimate.txt\"))",
    "notes": [
      "platform 参数要和数据来源一致：芯片用 'affymetrix'，RNA-seq 用 'illumina'，选错会让评分整体偏移。",
      "ESTIMATEScore = StromalScore + ImmuneScore，数值越高表示非肿瘤成分越多、纯度越低。",
      "肿瘤纯度公式是文献给出的经验式，只能当参考，做校正时建议用 ABSOLUTE 或 ASCAT 的结果做敏感性分析。"
    ],
    "pitfalls": [
      "estimate 包不在 CRAN 主库，要 BiocManager::install('estimate')，且已停止更新，某些 R 版本编译会失败。",
      "read.table 的 skip = 2 是 ESTIMATE 输出格式固定的两行表头，文件格式一变就全错位。",
      "estimateScore 对全 0 行很敏感，输入前要把低表达基因过滤掉，否则会出现 NA 分数。"
    ],
    "next": [
      "bulk-20",
      "ml-06",
      "stats-06"
    ]
  },
  {
    "id": "bulk-22",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "xCell：64 种细胞类型的富集打分",
    "level": "进阶",
    "tags": [
      "xCell",
      "免疫浸润",
      "ssGSEA",
      "微环境"
    ],
    "packages": [
      "xCell",
      "pheatmap",
      "dplyr"
    ],
    "scene": "CIBERSORT 只覆盖免疫细胞，还想看内皮细胞、成纤维细胞等基质细胞的相对富集。",
    "code": "# ============================================================\n# 22 xCell：基于 ssGSEA 的 64 种细胞富集分数\n# ============================================================\nlibrary(xCell)\nlibrary(pheatmap)\nlibrary(dplyr)\n\nexpr <- readRDS(\"data/processed/expr_tpm.rds\")\nexpr <- expr[!duplicated(rownames(expr)), ]\n\n# rnaseq = TRUE 会做 spillover 校正（RNA-seq 专用）；芯片数据用 FALSE\nxc <- xCellAnalysis(expr, rnaseq = TRUE, spill = TRUE, alpha = 0.5, parallel.sz = 4)\ndim(xc)          # 64 × 样本\nxc <- t(xc)      # 转成 样本 × 细胞类型\n\n# 分数是相对值，只可比大小，不可当比例\nsummary(xc[, 1:4])\n\n# ---- 和 ESTIMATE / CIBERSORT 互相印证 ----\nest <- read.csv(\"results/tables/estimate_scores.csv\", row.names = 1)\ncor(xc[, \"ImmuneScore\"], est[rownames(xc), \"ImmuneScore\"], method = \"spearman\")\n\n# ---- 热图：只画变异最大的 20 种细胞 ----\ntop_cells <- names(sort(apply(xc, 2, sd), decreasing = TRUE))[1:20]\npheatmap(t(xc[, top_cells]), scale = \"row\", cluster_cols = TRUE,\n         annotation_col = readRDS(\"data/processed/clinical.rds\")[\"group\"],\n         filename = \"results/figures/xcell_heatmap.pdf\", width = 9, height = 7)\n\n# ---- 差异：每个细胞类型做一次 Wilcoxon ----\ncli <- readRDS(\"data/processed/clinical.rds\")\ndf <- merge(as.data.frame(xc), cli[, c(\"sample\", \"group\")],\n            by.x = \"row.names\", by.y = \"sample\")\nres <- lapply(setdiff(colnames(xc), \"ImmuneScore\"), function(ct) {\n  data.frame(cell = ct, p = wilcox.test(df[[ct]] ~ df$group)$p.value)\n}) %>% bind_rows() %>% mutate(padj = p.adjust(p, \"BH\")) %>% arrange(padj)\nwrite.csv(xc, \"results/tables/xcell_scores.csv\")",
    "notes": [
      "xCell 的分数是 ssGSEA 富集分数的变换，不是细胞比例，不能直接说“T 细胞占 30%”。",
      "spill = TRUE 会做 spillover 补偿，代价是不同细胞类型的分数互相拉扯，绝对值会变。",
      "xCell 内置的 ImmuneScore 与 ESTIMATE 的 ImmuneScore 高度相关（Spearman 常 > 0.85），可以互为验证。"
    ],
    "pitfalls": [
      "xCell 的基因名要求是 symbol 且不能有版本号，Ensembl ID 输入会报 'no overlap'。",
      "parallel.sz 设太大在 Windows 上会爆内存（默认会 fork），建议 4 以内或设 1。",
      "稀疏表达矩阵（大量 0）会让 ssGSEA 排名失去意义，先过滤低表达基因。"
    ],
    "next": [
      "bulk-20",
      "bulk-23",
      "bulk-19"
    ]
  },
  {
    "id": "bulk-23",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "IOBR 一站式免疫微环境分析（多方法并行）",
    "level": "进阶",
    "tags": [
      "IOBR",
      "免疫微环境",
      "多方法",
      "TME"
    ],
    "packages": [
      "IOBR",
      "ggplot2",
      "dplyr",
      "survival"
    ],
    "scene": "审稿人要求至少两种反卷积方法互相验证，一个个装包调参太累，想一次性跑完 CIBERSORT/EPIC/quantiseq/xCell。",
    "code": "# ============================================================\n# 23 IOBR：一次调用跑多种反卷积，结果自动对齐\n# ============================================================\nlibrary(IOBR)\nlibrary(dplyr)\nlibrary(ggplot2)\n\nexpr <- readRDS(\"data/processed/expr_tpm.rds\")\nexpr <- expr[!duplicated(rownames(expr)), ]\n\n# 支持的 method：cibersort / epic / quantiseq / xcell / mcpcounter /\n#                estimate / timer / ips / cibersort_abs ...\ntme <- deconvo_tme(eset = expr,\n                   method = c(\"cibersort\", \"epic\", \"quantiseq\", \"xcell\", \"mcpcounter\"),\n                   perm = 100, arrays = FALSE, tumor = TRUE)\nnames(tme)          # 每种方法一个数据框\ndim(tme$cibersort)\n\n# 统一成“样本 × 细胞”的表，比较两种方法对同一类细胞是否一致\ncib  <- tme$cibersort[, c(\"ID\", \"T_cells_CD8\", \"Macrophages_M0\")]\nepic <- tme$epic[, c(\"ID\", \"CD8_T_cell\", \"Macrophage\")]\nchk  <- merge(cib, epic, by = \"ID\")\ncor.test(chk$T_cells_CD8, chk$CD8_T_cell, method = \"spearman\")\n\n# 多次合并成一张大表（每种方法若干列），一起导出补充材料\nmerge_all <- function(lst) Reduce(function(a, b) merge(a, b, by = \"ID\", all = TRUE), lst)\nbig <- merge_all(list(cib, epic, tme$mcpcounter[, c(\"ID\", \"CD8_T_cells\")]))\n\n# 与分组关联\ncli <- readRDS(\"data/processed/clinical.rds\")\ndf  <- merge(big, cli[, c(\"sample\", \"group\")], by.x = \"ID\", by.y = \"sample\")\nggplot(df, aes(group, T_cells_CD8, fill = group)) +\n  geom_boxplot(outlier.size = 0.3) + theme_bw() +\n  labs(x = NULL, y = \"CIBERSORT estimated CD8 T cell\")\n\n# IOBR 还提供基于多方法的 TME 分型（版本差异较大，跑不通就手动按分数聚类）\n# tme_class <- IOBR::tme_classification(eset = expr, is_array = FALSE)\n# table(tme_class$TME_class)\n\nwrite.csv(big, \"results/tables/tme_multi_method.csv\", row.names = FALSE)",
    "notes": [
      "多方法并行的价值在于“交叉验证”：CIBERSORT 与 EPIC 对 CD8 T 细胞估计的相关系数通常 > 0.7 才敢下结论。",
      "不同方法的输出细胞类型命名不统一（B_cells_naive vs B_cell），要自己建映射表再合并。",
      "IOBR 的 deconvo_tme 会自动做基因名对齐与去重，但输入必须是线性尺度表达。"
    ],
    "pitfalls": [
      "method 传向量时部分方法需要联网（timer 要下参考集），断网会中途失败，建议分次跑。",
      "IOBR 版本迭代快，函数参数名变动频繁（arrays/tumor/perm），报错时先 ?deconvo_tme 看当前签名。",
      "xcell 方法在 IOBR 里跑得很慢（单线程），基因数上万时可能几十分钟，不要以为是卡死。"
    ],
    "next": [
      "bulk-20",
      "bulk-21",
      "bulk-22"
    ]
  },
  {
    "id": "bulk-24",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "差异基因热图：pheatmap 与 ComplexHeatmap 两套写法",
    "level": "常用",
    "tags": [
      "热图",
      "pheatmap",
      "ComplexHeatmap",
      "z-score"
    ],
    "packages": [
      "pheatmap",
      "ComplexHeatmap",
      "circlize",
      "dplyr"
    ],
    "scene": "要从 3000 个差异基因里挑 top50 画一张“肿瘤 vs 正常泾渭分明”的热图放进正文。",
    "code": "# ============================================================\n# 24 热图：z-score + 注释条 + 双向聚类\n# ============================================================\nlibrary(pheatmap)\nlibrary(ComplexHeatmap)\nlibrary(circlize)\nlibrary(dplyr)\n\nexpr <- readRDS(\"data/processed/expr_log2_tpm.rds\")\ndeg  <- read.csv(\"results/tables/DEG_tumor_vs_normal.csv\")\ncli  <- readRDS(\"data/processed/clinical.rds\")\n\n# 1) 挑基因：按 padj 取前 50 个上调 + 前 50 个下调\ntop_up   <- deg %>% filter(logFC > 0) %>% arrange(padj) %>% head(50) %>% pull(gene)\ntop_down <- deg %>% filter(logFC < 0) %>% arrange(padj) %>% head(50) %>% pull(gene)\ngenes <- intersect(c(top_up, top_down), rownames(expr))\n\nmat <- expr[genes, cli$sample]\nmat_z <- t(scale(t(mat)))                 # 按基因 z-score，热图必做\nmat_z[mat_z > 2]  <- 2                    # 截断极端值，避免一个样本吃掉整个色阶\nmat_z[mat_z < -2] <- -2\n\nann_col <- data.frame(group = cli$group, row.names = cli$sample)\nann_row <- data.frame(direction = ifelse(genes %in% top_up, \"Up\", \"Down\"),\n                      row.names = genes)\n\n# ---- 方案 A：pheatmap，写论文够用 ----\npheatmap(mat_z, cluster_cols = TRUE, cluster_rows = TRUE,\n         annotation_col = ann_col, annotation_row = ann_row,\n         annotation_colors = list(group = c(Normal = \"#2E86AB\", Tumor = \"#D1495B\"),\n                                  direction = c(Up = \"#C0392B\", Down = \"#2980B9\")),\n         color = colorRampPalette(c(\"#2166AC\", \"white\", \"#B2182B\"))(100),\n         show_rownames = FALSE, show_colnames = FALSE,\n         fontsize = 9, border_color = NA,\n         filename = \"results/figures/deg_heatmap.pdf\", width = 6, height = 7)\n\n# ---- 方案 B：ComplexHeatmap，能加更多层（比如突变、临床分期）----\nha <- HeatmapAnnotation(group = cli$group,\n                        col = list(group = c(Normal = \"#2E86AB\", Tumor = \"#D1495B\")))\nHeatmap(mat_z, name = \"z-score\", top_annotation = ha,\n        show_row_names = FALSE, show_column_names = FALSE,\n        column_split = cli$group,          # 按分组切一刀，视觉上更清楚\n        row_split = ann_row$direction,\n        cluster_column_slices = TRUE,\n        heatmap_legend_param = list(title = \"Exp (z)\"))",
    "notes": [
      "z-score 必须在基因（行）方向做：scale(t(mat)) 是对每行标准化，直接 scale(mat) 会变成对样本标准化，图会完全反。",
      "截断到 ±2 是为了让色阶不被个别极端样本撑爆，截断前后要在图注里写清楚。",
      "column_split 比单纯聚类更适合分组明确的场景，能直接看出两组的分界。"
    ],
    "pitfalls": [
      "pheatmap 的 filename 参数会按英寸出图，width/height 不设会挤成一团。",
      "矩阵里有 NA 时 pheatmap 会画成白色空格但不报错，画之前 rowSums(is.na(mat)) 检查一下。",
      "行名重复会让 pheatmap 报 'duplicate row.names'，取子集前先 unique。"
    ],
    "next": [
      "bulk-25",
      "viz-07",
      "report-05"
    ]
  },
  {
    "id": "bulk-25",
    "track": "bulk",
    "trackName": "Bulk RNA-seq",
    "title": "火山图：阈值、标签与上下调配色",
    "level": "常用",
    "tags": [
      "火山图",
      "ggplot2",
      "ggrepel",
      "差异基因"
    ],
    "packages": [
      "ggplot2",
      "ggrepel",
      "dplyr",
      "ggsci"
    ],
    "scene": "要一张能直接投稿的火山图，标出 top10 基因、标清阈值线、上下调配色统一。",
    "code": "# ============================================================\n# 25 火山图：logFC vs -log10(padj)，带标签与阈值线\n# ============================================================\nlibrary(ggplot2)\nlibrary(ggrepel)\nlibrary(dplyr)\nlibrary(ggsci)\n\ndeg <- read.csv(\"results/tables/DEG_tumor_vs_normal.csv\")\nlfc_cut <- 1; p_cut <- 0.05\n\ndf <- deg %>%\n  filter(!is.na(padj), !is.na(logFC)) %>%\n  mutate(\n    neglogp = -log10(padj),\n    change = case_when(logFC >  lfc_cut & padj < p_cut ~ \"Up\",\n                       logFC < -lfc_cut & padj < p_cut ~ \"Down\",\n                       TRUE ~ \"NS\"),\n    change = factor(change, levels = c(\"Up\", \"Down\", \"NS\"))\n  )\ntable(df$change)\n\n# 标签：只标最显著的 10 个，避免糊成一团\nlab_df <- df %>% filter(change != \"NS\") %>% arrange(padj) %>% head(10)\n\np <- ggplot(df, aes(logFC, neglogp, color = change)) +\n  geom_point(size = 1.2, alpha = 0.7) +\n  scale_color_manual(values = c(Up = \"#D1495B\", Down = \"#2E86AB\", NS = \"grey75\")) +\n  geom_vline(xintercept = c(-lfc_cut, lfc_cut), linetype = \"dashed\", color = \"grey40\") +\n  geom_hline(yintercept = -log10(p_cut), linetype = \"dashed\", color = \"grey40\") +\n  geom_text_repel(data = lab_df, aes(label = gene), size = 3,\n                  max.overlaps = 20, show.legend = FALSE,\n                  segment.color = \"grey50\", min.segment.length = 0) +\n  labs(x = expression(log[2]~\"fold change\"), y = expression(-log[10]~\"(adjusted P)\"),\n       color = NULL) +\n  annotate(\"text\", x = max(df$logFC) * 0.9, y = max(df$neglogp) * 0.95,\n           label = paste0(\"Up: \", sum(df$change == \"Up\")), color = \"#D1495B\", size = 3.5) +\n  annotate(\"text\", x = min(df$logFC) * 0.9, y = max(df$neglogp) * 0.95,\n           label = paste0(\"Down: \", sum(df$change == \"Down\")), color = \"#2E86AB\", size = 3.5) +\n  theme_bw(base_size = 12) +\n  theme(panel.grid.minor = element_blank(), legend.position = \"top\")\n\nggsave(\"results/figures/volcano.pdf\", p, width = 6, height = 6)",
    "notes": [
      "y 轴用 -log10(padj) 而不是 pvalue：前者已经多重检验校正，审稿人不会再追问。",
      "geom_text_repel 的 max.overlaps 太小会导致标签被静默丢弃，宁可选少一点基因也不要靠它硬撑。",
      "legend.position = 'top' 配 ggsave 的宽高比，能避免图例把点挤到一边。"
    ],
    "pitfalls": [
      "用 -log10(p) 画图但正文写 padj < 0.05，属于图表与描述不一致，容易被要求重做。",
      "logFC 为 0 且 padj 极小的点会贴在 y 轴上，看上去像异常值，其实是低表达基因被收缩到 0。",
      "标基因时用 symbol 列里含 NA 的行，geom_text_repel 会报警告并跳过。"
    ],
    "next": [
      "bulk-24",
      "viz-09",
      "report-05"
    ]
  },
  {
    "id": "scrna-09",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "单细胞质控：指标、分布与 MAD 自动阈值",
    "level": "常用",
    "tags": [
      "质控",
      "percent.mt",
      "MAD",
      "双细胞"
    ],
    "packages": [
      "Seurat",
      "ggplot2",
      "patchwork",
      "dplyr"
    ],
    "scene": "不同样本的细胞数、基因数差别很大，固定阈值会误删整批细胞，想用数据驱动的方式定阈值。",
    "code": "# ============================================================\n# 09 质控：先把分布看清楚，再决定砍哪里\n# ============================================================\nlibrary(Seurat)\nlibrary(dplyr)\nlibrary(ggplot2)\nlibrary(patchwork)\n\nobj <- readRDS(\"data/processed/obj_raw.rds\")     # 已合并多样本、未过滤\n\n# 三个核心指标\nobj[[\"percent.mt\"]] <- PercentageFeatureSet(obj, pattern = \"^MT-\")\nobj[[\"percent.hb\"]] <- PercentageFeatureSet(obj, pattern = \"^HB[AB]\")\nobj[[\"percent.rb\"]] <- PercentageFeatureSet(obj, pattern = \"^RP[SL]\")\n\n# 1) 每个样本一列小提琴图，一眼看出哪个样本测序质量差\nVlnPlot(obj, features = c(\"nFeature_RNA\", \"nCount_RNA\", \"percent.mt\"),\n        group.by = \"sample\", pt.size = 0, ncol = 3)\n\n# 2) 用 MAD 定阈值（中位数 ± 3 倍绝对中位差），比固定 200/6000 稳\nmad_cut <- function(x, n = 3) {\n  m <- median(x); s <- mad(x)\n  c(low = m - n * s, high = m + n * s)\n}\ncut_feat <- mad_cut(obj$nFeature_RNA); cut_feat\ncut_mt   <- mad_cut(obj$percent.mt)\n\n# 3) 过滤：同时限制基因数、count 数、线粒体比例\nobj <- subset(obj,\n              subset = nFeature_RNA > max(200, cut_feat[\"low\"]) &\n                       nFeature_RNA < cut_feat[\"high\"] &\n                       percent.mt  < max(10, cut_mt[\"high\"]))\n\n# 4) 至少表达该基因的细胞数（基因层面过滤，减少稀疏噪声）\ncnt <- GetAssayData(obj, layer = \"counts\")\nobj <- obj[rownames(cnt)[Matrix::rowSums(cnt > 0) >= 3], ]\n\n# 5) 过滤前后对照表\ndata.frame(before = length(colnames(readRDS(\"data/processed/obj_raw.rds\"))),\n           after = ncol(obj), gene_after = nrow(obj))\ntable(obj$sample)",
    "notes": [
      "MAD 阈值对批次差异敏感，样本量差 10 倍时建议按样本分别算再取并集或交集，方法学里要交代。",
      "percent.hb 高（> 5%）说明红细胞污染，常见于全血或组织消化不完全的样本。",
      "基因层面过滤（至少在 3 个细胞中检出）能显著减小对象体积，对下游降维几乎无影响。"
    ],
    "pitfalls": [
      "percent.mt 阈值一刀切 20% 会误删心肌、肝这类高线粒体组织，文献里 5%~30% 都有，要看组织类型。",
      "subset 后 obj 的 meta.data 还留着旧因子水平，画图时会出现空组，用 droplevels 清理。",
      "nCount_RNA 与 nFeature_RNA 高度相关，两个都设阈值等于重复过滤，容易过杀。"
    ],
    "next": [
      "scrna-10",
      "scrna-11",
      "scrna-13"
    ]
  },
  {
    "id": "scrna-10",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "双细胞检测：DoubletFinder 标准流程",
    "level": "进阶",
    "tags": [
      "双细胞",
      "DoubletFinder",
      "doublet",
      "质控"
    ],
    "packages": [
      "DoubletFinder",
      "Seurat",
      "ggplot2"
    ],
    "scene": "10x 数据里 5%~10% 的液滴其实包了两个细胞，不剔除会在聚类里形成假的“中间态”亚群。",
    "code": "# ============================================================\n# 10 DoubletFinder：按样本分别检测并剔除双细胞\n# ============================================================\nlibrary(Seurat)\nlibrary(DoubletFinder)\n\nobj <- readRDS(\"data/processed/obj_qc.rds\")\nsamples <- unique(obj$sample)\n\n# DoubletFinder 对抗原数据敏感，建议按样本单独跑\nobj_list <- lapply(samples, function(s) {\n  sub <- subset(obj, subset = sample == s)\n  sub <- NormalizeData(sub) %>% FindVariableFeatures() %>%\n    ScaleData() %>% RunPCA(verbose = FALSE)\n  sub <- FindNeighbors(sub, dims = 1:20) %>% FindClusters(resolution = 0.3)\n\n  # 1) 参数扫描：pK 在 0.005~0.3 之间选 BCmetric 最大的\n  sweep <- paramSweep(sub, PCs = 1:20, sct = FALSE)\n  stats <- summarizeSweep(sweep, GT = FALSE)\n  pk <- find.pK(stats)\n  best_pk <- as.numeric(as.character(pk$pK[which.max(pk$BCmetric)]))\n\n  # 2) 预期双细胞数：10x 经验值，每 1000 个细胞约 0.8%\n  nExp <- round(ncol(sub) * 0.008 * (ncol(sub) / 1000))\n  nExp <- max(nExp, round(ncol(sub) * 0.05))     # 兜底下限 5%\n\n  # 3) 跑 DF，注意它会在 meta.data 里新建一列 DF.classifications_*\n  sub <- doubletFinder(sub, PCs = 1:20, pN = 0.25, pK = best_pk, nExp = nExp)\n  df_col <- grep(\"DF.classifications\", colnames(sub@meta.data), value = TRUE)\n  sub$doublet <- sub@meta.data[[df_col[length(df_col)]]]\n  sub\n})\nnames(obj_list) <- samples\ntable(do.call(c, lapply(obj_list, function(x) x$doublet)))\n\n# 4) 合并并只留 singlet\nobj_clean <- merge(obj_list[[1]], obj_list[-1])\nobj_clean <- subset(obj_clean, subset = doublet == \"Singlet\")\nsaveRDS(obj_clean, \"data/processed/obj_singlet.rds\")",
    "notes": [
      "pK 一定要用 find.pK 挑，写死 0.09 是网上抄来的默认值，换个数据集就不合适。",
      "nExp 的估计依赖上样细胞数，10x 官方给的 0.8%/1000 细胞是期望双细胞率，实际应按上样量换算。",
      "每个样本单独跑再合并，比全量一起跑准确得多，因为双细胞率与上样密度直接相关。"
    ],
    "pitfalls": [
      "doubletFinder 每次运行都会新增一列 DF.classifications_0.25_0.09_xxx，多次运行后列名带不同后缀，取列时要取最后一列。",
      "跑 DF 之前必须先 FindClusters，没有聚类结果会直接报错。",
      "SCT 变换后的对象要传 sct = TRUE，否则 pN/pK 扫描的假设不成立，结果不可信。"
    ],
    "next": [
      "scrna-11",
      "scrna-12",
      "scrna-09"
    ]
  },
  {
    "id": "scrna-11",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "SCTransform：单细胞专用的方差稳定变换",
    "level": "常用",
    "tags": [
      "SCTransform",
      "归一化",
      "高变基因",
      "v2"
    ],
    "packages": [
      "Seurat",
      "glmGamPoi"
    ],
    "scene": "用 LogNormalize 后高变基因里全是线粒体和核糖体基因，或者细胞间测序深度差异很大压不住。",
    "code": "# ============================================================\n# 11 SCTransform v2：正则化负二项回归 + 方差稳定\n# ============================================================\nlibrary(Seurat)\nlibrary(glmGamPoi)\n\nobj <- readRDS(\"data/processed/obj_singlet.rds\")\n\n# v2 版本对大数据集更快更稳（需要 glmGamPoi 包加速）\nobj <- SCTransform(obj,\n                   vst.flavor = \"v2\",\n                   vars.to.regress = c(\"percent.mt\"),   # 只回归真正想控制的协变量\n                   variable.features.n = 3000,\n                   return.only.var.genes = FALSE,\n                   verbose = TRUE)\n\n# 检查：高变基因里还有没有线粒体/核糖体\ntop10 <- head(VariableFeatures(obj), 10)\ntop10\nsum(grepl(\"^MT-|^RP[SL]\", top10))\n\nVariableFeaturePlot(obj) + LabelPoints(plot = last_plot(), points = top10, repel = TRUE)\n\n# 下游统一用 SCT assay\nobj <- RunPCA(obj, assay = \"SCT\", npcs = 50, verbose = FALSE)\nElbowPlot(obj, ndims = 50)\n\n# 需要回到 counts 做差异分析/伪bulk时：\n# cnt <- GetAssayData(obj, assay = \"RNA\", layer = \"counts\")\n\n# 多数据集合并后再 SCT：v5 里可直接 IntegrateLayers(method = SCTIntegration)\nsaveRDS(obj, \"data/processed/obj_sct.rds\")",
    "notes": [
      "vars.to.regress 只放真正的技术噪声（percent.mt、nCount_RNA），把所有想研究的东西都回归掉会抹平生物学信号。",
      "SCTransform 之后默认 assay 是 SCT，FindMarkers 要指定 assay = 'SCT' 或 recorrect_umi = FALSE 才和文献可比。",
      "return.only.var.genes = FALSE 会保留全部基因的校正表达，做热图/通路打分时需要它。"
    ],
    "pitfalls": [
      "SCT 的 scale.data 只包含 3000 个高变基因，直接拿它画全基因热图会报 'subscript out of bounds'。",
      "vst.flavor = 'v2' 需要 Seurat >= 4.3，老版本没有这个参数会报 unused argument。",
      "SCT 与 LogNormalize 的结果不能混着比较，两套流程给出的差异基因列表差别不小。"
    ],
    "next": [
      "scrna-12",
      "scrna-13",
      "scrna-16"
    ]
  },
  {
    "id": "scrna-12",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "Harmony 整合：消除样本批次又不抹掉细胞类型",
    "level": "常用",
    "tags": [
      "Harmony",
      "整合",
      "批次",
      "降维"
    ],
    "packages": [
      "harmony",
      "Seurat",
      "ggplot2"
    ],
    "scene": "多个样本各自聚成一坨，同一类细胞在不同样本里分开了，需要在 PCA 之后做整合。",
    "code": "# ============================================================\n# 12 Harmony：在 PCA 空间里按样本校正，不用找锚点\n# ============================================================\nlibrary(Seurat)\nlibrary(harmony)\nlibrary(ggplot2)\n\nobj <- readRDS(\"data/processed/obj_sct.rds\")\nobj <- RunPCA(obj, assay = \"SCT\", npcs = 50, verbose = FALSE)\n\n# 整合前：按样本上色，通常能看到明显分层\nDimPlot(obj, reduction = \"pca\", group.by = \"sample\", shuffle = TRUE) + NoLegend()\n\n# 关键参数：group.by.vars 放批次变量（样本/批次/患者）\nobj <- RunHarmony(obj,\n                  group.by.vars = \"sample\",\n                  reduction.use = \"pca\",\n                  dims.use = 1:30,\n                  assay.use = \"SCT\",\n                  theta = 2,            # 校正强度，越大越激进\n                  lambda = 1,\n                  max_iter = 20,\n                  verbose = TRUE)\n\n# 整合后：用 harmony 降维做 UMAP 与聚类\nobj <- RunUMAP(obj, reduction = \"harmony\", dims = 1:30, reduction.name = \"umap\")\nobj <- FindNeighbors(obj, reduction = \"harmony\", dims = 1:30)\nobj <- FindClusters(obj, resolution = 0.5)\n\nDimPlot(obj, reduction = \"umap\", group.by = c(\"sample\", \"seurat_clusters\"), ncol = 2)\n\n# 定量评估：整合前后同种细胞在样本间的混合程度\n# 常用指标：kBET / LISI / scib（R 里可用 kbet 或 lisi 包）\nsaveRDS(obj, \"data/processed/obj_harmony.rds\")",
    "notes": [
      "theta 越大校正越强，但过大会把真实的亚群差异也抹平；默认 2 在多数数据上安全。",
      "Harmony 只改降维坐标，不改表达矩阵，所以下游差异分析仍然要用原始 counts。",
      "group.by.vars 里放的是批次，不是细胞类型；放错变量等于人为消灭生物学差异。"
    ],
    "pitfalls": [
      "Harmony 之后仍然用 reduction = 'pca' 聚类，等于白做，FindNeighbors 必须指定 harmony。",
      "样本间细胞类型组成差异极大时（比如一个样本几乎没有 T 细胞），Harmony 会强行对齐，产生假亚群。",
      "dims.use 用满 1:50 常导致过校正，30 维左右是常见折中。"
    ],
    "next": [
      "scrna-13",
      "scrna-14",
      "scrna-17"
    ]
  },
  {
    "id": "scrna-13",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "FindClusters 分辨率调优：不是越大越好",
    "level": "常用",
    "tags": [
      "聚类",
      "resolution",
      "clustree",
      "亚群"
    ],
    "packages": [
      "Seurat",
      "clustree",
      "ggplot2",
      "dplyr"
    ],
    "scene": "不知道该把 resolution 设成多少，0.5 出来 8 个簇，1.2 出来 20 个簇，到底哪个才“对”。",
    "code": "# ============================================================\n# 13 聚类分辨率：扫一遍 + clustree 看稳定性\n# ============================================================\nlibrary(Seurat)\nlibrary(clustree)\nlibrary(ggplot2)\n\nobj <- readRDS(\"data/processed/obj_harmony.rds\")\n\n# 1) 一次算多个分辨率（FindNeighbors 只需跑一次）\nobj <- FindNeighbors(obj, reduction = \"harmony\", dims = 1:30)\nobj <- FindClusters(obj, resolution = seq(0.1, 1.5, by = 0.1))\n\n# 2) clustree：看不同分辨率之间簇的从属关系\nclustree(obj, prefix = \"SCT_snn_res.\") +\n  theme(legend.position = \"bottom\")\n\n# 3) 每个分辨率下各簇的细胞数，避免出现 5 个细胞的“簇”\nres_cols <- grep(\"_snn_res\\\\.\", colnames(obj@meta.data), value = TRUE)\nsapply(res_cols, function(cl) length(unique(obj@meta.data[[cl]])))\n\n# 4) 选定的分辨率单独存成一列，后续都用它\nobj$cluster <- obj$SCT_snn_res.0.6\nIdents(obj) <- \"cluster\"\n\n# 5) 判断依据：每个簇是否有独特的 marker（都能找到 marker 才算合理）\nmarkers <- FindAllMarkers(obj, only.pos = TRUE, min.pct = 0.25, logfc.threshold = 0.25)\nmarkers %>% group_by(cluster) %>% slice_max(avg_log2FC, n = 3) %>% print(n = 60)\n\nDimPlot(obj, reduction = \"umap\", label = TRUE, repel = TRUE)\nsaveRDS(obj, \"data/processed/obj_clustered.rds\")",
    "notes": [
      "resolution 越大簇越多，但只代表切得更细，不代表更“准”，最终要用 marker 基因和生物学可解释性来定。",
      "clustree 里箭头交叉严重（细胞大量换簇）说明该分辨率不稳定，不宜采用。",
      "FindClusters 的随机种子（random.seed）会影响结果，论文里要写清 Seurat 版本与随机种子。"
    ],
    "pitfalls": [
      "把 resolution 当成“亚群数量旋钮”，硬调到想要的簇数（比如非要 9 个），是最常见的自欺欺人做法。",
      "FindAllMarkers 默认只比较当前 Idents 与其余所有簇，换 Idents 后结果完全不同，跑之前先确认 Idents。",
      "SCT assay 下 FindAllMarkers 的 logFC 与 RNA assay 不可直接比，换 assay 会得到不同数量的 marker。"
    ],
    "next": [
      "scrna-14",
      "scrna-16",
      "scrna-22"
    ]
  },
  {
    "id": "scrna-14",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "SingleR 自动注释：用参考数据集给簇贴标签",
    "level": "常用",
    "tags": [
      "SingleR",
      "注释",
      "celldex",
      "参考集"
    ],
    "packages": [
      "SingleR",
      "celldex",
      "Seurat",
      "SingleCellExperiment"
    ],
    "scene": "聚类做完了但不知道每个簇是什么细胞，想先用参考数据集自动打一遍标签，再人工核对。",
    "code": "# ============================================================\n# 14 SingleR：HPCA / 免疫参考集自动注释\n# ============================================================\nlibrary(SingleR)\nlibrary(celldex)\nlibrary(Seurat)\nlibrary(SingleCellExperiment)\n\nobj <- readRDS(\"data/processed/obj_clustered.rds\")\n\n# 1) 参考集：HPCA 覆盖 37 种正常细胞；免疫数据用 DatabaseImmuneCellExpressionData\nref <- celldex::HumanPrimaryCellAtlasData()\n# ref <- celldex::DatabaseImmuneCellExpressionData()\n\n# 2) 用 log-normalized 表达（不要在 SCT 的 scale 数据上跑）\ntest <- GetAssayData(obj, assay = \"RNA\", layer = \"data\")\n\n# 3) 逐细胞注释：label.main 粗标签，label.fine 细标签\npred <- SingleR(test = test, ref = ref, labels = ref$label.main,\n                clusters = obj$cluster,      # 按簇注释，比逐细胞稳定得多\n                de.method = \"wilcox\")\n\n# 4) 看每个簇的标签与打分，pruned 表示该簇的标签可信度不足\nprint(pred)\ntable(pred$labels)\nplotScoreHeatmap(pred)\n\n# 5) 只保留通过剪枝的标签，其余标记为 Unknown 留给人工判断\nobj$singler_main <- pred$labels[match(obj$cluster, rownames(pred))]\nobj$singler_main[!pred$pruned] <- \"Unknown\"\n\nDimPlot(obj, reduction = \"umap\", group.by = \"singler_main\", label = TRUE, repel = TRUE)\n\n# 6) 用经典 marker 交叉验证（一定要做这一步）\nFeaturePlot(obj, features = c(\"CD3D\", \"MS4A1\", \"CD14\", \"NKG7\", \"COL1A1\"), ncol = 3)\nsaveRDS(obj, \"data/processed/obj_singler.rds\")",
    "notes": [
      "clusters 参数让 SingleR 先按簇取平均再注释，结果比逐细胞注释稳定很多，也快得多。",
      "pruned 为 FALSE 表示该簇的标签区分度不够，应标记为 Unknown 而不是硬套一个名字。",
      "HPCA 是正常组织参考集，肿瘤细胞常被错误注释成“上皮细胞/成纤维细胞”，需要人工复核。"
    ],
    "pitfalls": [
      "把 SCT 的 scale.data（已中心化、含负值）传给 SingleR 会得到毫无意义的结果，必须用 RNA assay 的 data 层。",
      "参考集与测试数据的基因名版本不一致（symbol vs Ensembl）会导致匹配率极低，先统一命名。",
      "不同参考集给出的标签体系完全不同（HPCA vs Monaco），跨数据集比较前要建映射表。"
    ],
    "next": [
      "scrna-15",
      "scrna-16",
      "scrna-22"
    ]
  },
  {
    "id": "scrna-15",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "手动注释：marker 打分与批量核对",
    "level": "常用",
    "tags": [
      "手动注释",
      "marker",
      "AddModuleScore",
      "DotPlot"
    ],
    "packages": [
      "Seurat",
      "ggplot2",
      "dplyr"
    ],
    "scene": "自动注释给的标签不准（肿瘤细胞被叫成成纤维细胞），要靠经典 marker 人工定簇。",
    "code": "# ============================================================\n# 15 手动注释：打分 + 点图 + 逐簇核对\n# ============================================================\nlibrary(Seurat)\nlibrary(ggplot2)\nlibrary(dplyr)\n\nobj <- readRDS(\"data/processed/obj_clustered.rds\")\n\n# 1) 每个簇的 marker（先看数据怎么说，别先入为主）\nmarkers <- FindAllMarkers(obj, only.pos = TRUE, min.pct = 0.25, logfc.threshold = 0.25)\ntop5 <- markers %>% group_by(cluster) %>% slice_max(avg_log2FC, n = 5)\nprint(top5, n = 100)\n\n# 2) 经典 marker 点图：一张图看完全部簇\ncanonical <- c(\"CD3D\",\"CD3E\",\"CD8A\",\"CD4\",\"IL7R\",      # T\n               \"NKG7\",\"GNLY\",\"KLRD1\",                    # NK\n               \"MS4A1\",\"CD79A\",\"MZB1\",                   # B / 浆细胞\n               \"CD14\",\"LYZ\",\"FCGR3A\",                    # 单核/巨噬\n               \"LILRA4\",\"CLEC4C\",                        # pDC\n               \"COL1A1\",\"DCN\",\"PDGFRB\",                  # 成纤维\n               \"PECAM1\",\"VWF\",                           # 内皮\n               \"EPCAM\",\"KRT18\",\"KRT8\",                   # 上皮/肿瘤\n               \"TPSAB1\",\"CPA3\")                          # 肥大\nDotPlot(obj, features = canonical, group.by = \"cluster\") +\n  RotatedAxis() + theme(axis.text.x = element_text(size = 7))\n\n# 3) 打分法：把每个细胞类型的 marker 打包成基因集\ngene_sets <- list(\n  T_cell   = c(\"CD3D\",\"CD3E\",\"CD2\",\"IL7R\"),\n  Myeloid  = c(\"LYZ\",\"CD14\",\"FCGR3A\",\"S100A8\"),\n  Fibroblast = c(\"COL1A1\",\"DCN\",\"LUM\"),\n  Epithelial = c(\"EPCAM\",\"KRT8\",\"KRT18\")\n)\nobj <- AddModuleScore(obj, features = gene_sets, name = \"score_\", seed = 1)\nVlnPlot(obj, features = paste0(\"score_\", 1:4), group.by = \"cluster\", pt.size = 0, ncol = 4)\n\n# 4) 人工定标签：按簇号一对一映射（写成命名向量，便于复现）\nmap <- c(`0` = \"T cell\", `1` = \"Myeloid\", `2` = \"Epithelial\",\n         `3` = \"Fibroblast\", `4` = \"B cell\", `5` = \"NK\")\nobj$celltype <- unname(map[as.character(obj$cluster)])\nobj$celltype[is.na(obj$celltype)] <- \"Unknown\"\n\nDimPlot(obj, reduction = \"umap\", group.by = \"celltype\", label = TRUE)\nsaveRDS(obj, \"data/processed/obj_annotated.rds\")",
    "notes": [
      "先 FindAllMarkers 再对照经典 marker，比先想好标签再找证据更不容易自欺。",
      "AddModuleScore 的分数是相对值，只能在同一对象内比较，不能跨数据集比较。",
      "注释映射写成命名向量并保存，是复现性的关键：换个时间重跑能对得上。"
    ],
    "pitfalls": [
      "只用一两个 marker 就定簇（比如 CD3D 阳性就叫 T 细胞）非常容易错，NK 细胞也表达 CD3E 的部分转录本。",
      "DotPlot 的 scale = TRUE（默认）是按基因标准化，不能用来比较不同基因的绝对表达高低。",
      "肿瘤样本里恶性细胞与正常上皮表达谱高度相似，必须靠 inferCNV 或拷贝数区分。"
    ],
    "next": [
      "scrna-17",
      "scrna-19",
      "scrna-21"
    ]
  },
  {
    "id": "scrna-16",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "FindAllMarkers 与 marker 展示（DoHeatmap / DotPlot）",
    "level": "常用",
    "tags": [
      "marker",
      "FindAllMarkers",
      "DoHeatmap",
      "DotPlot"
    ],
    "packages": [
      "Seurat",
      "dplyr",
      "ggplot2",
      "pheatmap"
    ],
    "scene": "注释定完了，要给每个细胞类型找出特异 marker，并做成能放进论文的图。",
    "code": "# ============================================================\n# 16 找 marker → 筛选 → 热图/点图\n# ============================================================\nlibrary(Seurat)\nlibrary(dplyr)\nlibrary(ggplot2)\n\nobj <- readRDS(\"data/processed/obj_annotated.rds\")\nIdents(obj) <- \"celltype\"\ntable(Idents(obj))\n\n# 1) 每个细胞类型 vs 其余全部\nmarkers <- FindAllMarkers(obj, assay = \"RNA\", slot = \"data\",\n                          only.pos = TRUE, min.pct = 0.25,\n                          logfc.threshold = 0.25, test.use = \"wilcox\")\n# 过滤：校正后显著 + 有一定倍数\nsig <- markers %>% filter(p_val_adj < 0.05, avg_log2FC > 0.5)\ndim(sig)\n\n# 2) 每类取 top5 画热图（基因多了会糊）\ntop5 <- sig %>% group_by(cluster) %>% slice_max(avg_log2FC, n = 5, with_ties = FALSE)\ngenes <- unique(top5$gene)\n\nobj <- ScaleData(obj, features = genes, assay = \"RNA\")\nDoHeatmap(subset(obj, downsample = 100), features = genes,\n          group.by = \"celltype\", size = 3) +\n  scale_fill_gradient2(low = \"#2166AC\", mid = \"white\", high = \"#B2182B\")\n\n# 3) 点图：更紧凑，正文常用\nDotPlot(obj, features = split(top5$gene, top5$cluster), group.by = \"celltype\") +\n  RotatedAxis() + labs(x = NULL, y = NULL)\n\n# 4) 导出表格（补充材料）\nwrite.csv(sig, \"results/tables/scna_all_markers.csv\", row.names = FALSE)\ntop5 %>% select(cluster, gene, avg_log2FC, pct.1, pct.2, p_val_adj) %>%\n  write.csv(\"results/tables/scna_top5_markers.csv\", row.names = FALSE)",
    "notes": [
      "avg_log2FC > 0.5 且 pct.1 - pct.2 > 0.1 是常用的双阈值，只看 p 值会挑出一堆在两类里都表达的基因。",
      "DoHeatmap 前必须 ScaleData，否则高表达基因吃掉整个色阶。",
      "subset(downsample = 100) 让每个组最多取 100 个细胞，图才不会被大簇主导。"
    ],
    "pitfalls": [
      "SCT assay 下 slot 参数要用 'data'，新版 Seurat 已改名为 layer，写成 slot 会有 deprecation 警告。",
      "FindAllMarkers 默认只找上调，如果某类细胞全是下调特征，only.pos = TRUE 会让你什么都找不到。",
      "marker 基因名重复（不同转录本同 symbol）时 DoHeatmap 会报错，先去重。"
    ],
    "next": [
      "scrna-22",
      "bulk-24",
      "scrna-15"
    ]
  },
  {
    "id": "scrna-17",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "inferCNV：从单细胞表达推断拷贝数变异",
    "level": "少见",
    "tags": [
      "inferCNV",
      "CNV",
      "恶性细胞",
      "肿瘤"
    ],
    "packages": [
      "infercnv",
      "Seurat",
      "ComplexHeatmap"
    ],
    "scene": "肿瘤样本里正常上皮和恶性上皮长得几乎一样，需要用拷贝数变异把恶性细胞挑出来。",
    "code": "# ============================================================\n# 17 inferCNV：以免疫/基质细胞为参考，推断恶性细胞\n# ============================================================\nlibrary(infercnv)\nlibrary(Seurat)\n\nobj <- readRDS(\"data/processed/obj_annotated.rds\")\n# 细胞数太多时先抽样（inferCNV 的内存消耗与细胞数×基因数成正比）\nset.seed(1)\nsub <- subset(obj, cells = sample(colnames(obj), min(4000, ncol(obj))))\n\ncnt <- GetAssayData(sub, assay = \"RNA\", layer = \"counts\")\ncnt <- cnt[Matrix::rowSums(cnt > 0) >= 10, ]        # 过滤极低表达基因\n\n# 1) 注释文件：一列细胞名，一列分组\nanno <- data.frame(cell = colnames(sub), group = as.character(sub$celltype))\nwrite.table(anno, \"results/infercnv_anno.txt\", sep = \"\\t\",\n            quote = FALSE, row.names = FALSE, col.names = FALSE)\n\n# 2) 基因位置文件：从 infercnv 官方仓库下载对应物种/注释版本\n#    https://github.com/broadinstitute/infercnv/tree/master/inst/extdata/gencode\ngene_order <- \"data/ref/gencode_v27_gene_pos.txt\"\n\ninfercnv_obj <- CreateInfercnvObject(\n  raw_counts_matrix = cnt,\n  annotations_file  = \"results/infercnv_anno.txt\",\n  delim             = \"\\t\",\n  gene_order_file   = gene_order,\n  ref_group_names   = c(\"T cell\", \"Myeloid\", \"B cell\", \"NK\")   # 正常二倍体参考\n)\n\nout <- run(infercnv_obj,\n           out_dir = \"results/infercnv\",\n           cluster_by_groups = TRUE,\n           denoise = TRUE,\n           HMM = TRUE,\n           analysis_mode = \"subclusters\",\n           num_threads = 8)\n\n# 3) 结果：每个细胞的 CNV 打分，> 0.1 常被判为恶性\ncnv_score <- read.table(\"results/infercnv/expr.infercnv_score.txt\", header = FALSE)\nscore <- colMeans(t(cnv_score[, -1]))\nsub$cnv_score <- score[colnames(sub)]\nsub$malignant <- ifelse(sub$cnv_score > 0.1, \"Malignant\", \"Normal\")\ntable(sub$celltype, sub$malignant)\nsaveRDS(sub, \"data/processed/obj_cnv.rds\")",
    "notes": [
      "参考细胞必须选确定的正常二倍体细胞（T/NK/髓系），把可能恶变的细胞放进参考会掩盖 CNV 信号。",
      "gene_order_file 的注释版本要与表达矩阵的基因 ID 体系一致（symbol 对 symbol），否则大量基因对不上位置。",
      "denoise = TRUE 会平滑掉一部分真实的小片段变异，做精细分析（如 arm-level）可关掉再看。"
    ],
    "pitfalls": [
      "细胞数上万时不抽样会直接吃爆内存（inferCNV 会建稠密矩阵）。",
      "analysis_mode = 'subclusters' 在细胞少时容易报错，细胞 < 500 建议用 'samples'。",
      "把 CNV 打分当成诊断级别的证据是过度解读：单细胞 CNV 只能提示恶性倾向。"
    ],
    "next": [
      "scrna-15",
      "spatial-08",
      "scrna-22"
    ]
  },
  {
    "id": "scrna-18",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "Monocle3 拟时序：轨迹、分支与基因动态",
    "level": "进阶",
    "tags": [
      "拟时序",
      "Monocle3",
      "轨迹",
      "分支"
    ],
    "packages": [
      "monocle3",
      "Seurat",
      "ggplot2"
    ],
    "scene": "想说明某类细胞从 A 状态分化到 B 状态，并找出沿轨迹变化的基因。",
    "code": "# ============================================================\n# 18 Monocle3：从 Seurat 对象直接转，学习轨迹并排序\n# ============================================================\nlibrary(monocle3)\nlibrary(Seurat)\nlibrary(ggplot2)\n\nobj <- readRDS(\"data/processed/obj_annotated.rds\")\n# 只保留参与分化的一类细胞（比如全部上皮/肿瘤细胞），混太多类型轨迹没有意义\nobj <- subset(obj, subset = celltype %in% c(\"Epithelial\", \"Cycling\"))\n\ncds <- as.cell_data_set(obj)\ncds <- estimate_size_factors(cds)\ncds <- preprocess_cds(cds, num_dim = 30)\ncds <- reduce_dimension(cds, reduction_method = \"UMAP\", preprocess_method = \"PCA\")\n\n# 1) 聚类（分辨率很小，只用来分段，不是最终分群）\ncds <- cluster_cells(cds, reduction_method = \"UMAP\", resolution = 1e-4)\n\n# 2) 学习主图（principal graph）\ncds <- learn_graph(cds, use_partition = TRUE)\nplot_cells(cds, color_cells_by = \"celltype\", label_cell_groups = FALSE,\n           label_branch_points = TRUE, label_leaves = TRUE, graph_label_size = 3)\n\n# 3) 定根节点：交互点选（脚本里可换成已知的起始细胞）\n# cds <- order_cells(cds)                 # 交互模式\nroot_cell <- colnames(cds)[which.max(cds@colData$Size_Factor)]   # 仅示意\ncds <- order_cells(cds, root_cells = root_cell)\nplot_cells(cds, color_cells_by = \"pseudotime\", show_trajectory_graph = TRUE)\n\n# 4) 沿轨迹显著变化的基因\ngt <- graph_test(cds, neighbor_graph = \"principal_graph\", cores = 4)\ngt %>% dplyr::arrange(q_value) %>% head(20)\n# 只画真正随拟时序变化的基因\ntop_genes <- gt %>% dplyr::filter(q_value < 0.01) %>% dplyr::arrange(desc(morans_I)) %>%\n  head(6) %>% rownames()\nplot_genes_in_pseudotime(cds[top_genes, ], color_cells_by = \"celltype\", min_expr = 0.5)",
    "notes": [
      "根节点选择决定拟时序方向，选错方向会让所有结论反着来，必须用已知的早期 marker 或时间点信息定位。",
      "graph_test 的 morans_I 衡量空间自相关，比单纯的差异表达更能反映“沿轨迹渐变”。",
      "Monocle3 的 pseudotime 是相对排序，不同 run 之间不可比，只能在同一对象内解释。"
    ],
    "pitfalls": [
      "把多个不相关的细胞类型放进同一个轨迹，会得到一条毫无生物学意义的“主干”。",
      "as.cell_data_set 转换后 UMAP 是重新算的，和 Seurat 里的 UMAP 不一致，看图时别混。",
      "细胞数超过 10 万时 learn_graph 会非常慢，建议先降采样或按亚群分析。"
    ],
    "next": [
      "scrna-22",
      "scrna-19",
      "scrna-17"
    ]
  },
  {
    "id": "scrna-19",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "CellChat 细胞通讯：配体受体与通路网络",
    "level": "进阶",
    "tags": [
      "CellChat",
      "细胞通讯",
      "配体受体",
      "niche"
    ],
    "packages": [
      "CellChat",
      "Seurat",
      "NMF",
      "ggplot2"
    ],
    "scene": "想说明肿瘤细胞和 T 细胞之间存在哪些配体-受体互作，以及两组样本之间通讯强度有何差异。",
    "code": "# ============================================================\n# 19 CellChat：建对象 → 推断通讯 → 通路聚合 → 可视化\n# ============================================================\nlibrary(CellChat)\nlibrary(Seurat)\nlibrary(NMF)\nlibrary(ggalluvial)\n\nobj <- readRDS(\"data/processed/obj_annotated.rds\")\ndata.input <- GetAssayData(obj, assay = \"RNA\", layer = \"data\")   # log-normalized\nmeta <- data.frame(labels = obj$celltype, row.names = colnames(obj))\n\ncellchat <- createCellChat(object = data.input, meta = meta, group.by = \"labels\")\ncellchat@DB <- subsetDB(CellChatDB.human, search = \"Secreted Signaling\")  # 只留分泌型\ncellchat <- subsetData(cellchat)\n\n# 1) 找过表达基因与互作（人口基数校正很关键）\ncellchat <- identifyOverExpressedGenes(cellchat)\ncellchat <- identifyOverExpressedInteractions(cellchat)\ncellchat <- computeCommunProb(cellchat, type = \"triMean\", population.size = TRUE)\ncellchat <- filterCommunication(cellchat, min.cells = 10)     # 太小的簇不参与\ncellchat <- computeCommunProbPathway(cellchat)\ncellchat <- aggregateNet(cellchat)\n\n# 2) 网络图：圆图看谁和谁说得最多\ngroupSize <- as.numeric(table(cellchat@idents))\npar(mfrow = c(1, 2), xpd = TRUE)\nnetVisual_circle(cellchat@net$count, vertex.weight = groupSize, weight.scale = TRUE,\n                 label.edge = FALSE, title.name = \"Number of interactions\")\nnetVisual_circle(cellchat@net$weight, vertex.weight = groupSize, weight.scale = TRUE,\n                 label.edge = FALSE, title.name = \"Interaction strength\")\n\n# 3) 指定通路的细胞间通讯（比如 TGFb）\nnetVisual_bubble(cellchat, sources.use = c(1, 2), targets.use = c(3, 4, 5),\n                 remove.isolate = FALSE)\n\n# 4) 两组比较：各自建对象后 merge\n# cellchat_ctrl  <- ...; cellchat_treat <- ...\n# merged <- mergeCellChat(list(Ctrl = cellchat_ctrl, Treat = cellchat_treat), add.names = names(...))\n# compareInteractions(merged, show.legend = FALSE, group = c(1, 2))\n# netVisual_diffInteraction(merged, weight.scale = TRUE)\nsaveRDS(cellchat, \"results/tables/cellchat.rds\")",
    "notes": [
      "population.size = TRUE 会按细胞比例校正，否则细胞数多的簇天然“通讯更强”。",
      "filterCommunication(min.cells = 10) 必须做，只有 3 个细胞的簇算出来的通讯全是噪声。",
      "两组比较时要用 mergeCellChat，直接比较 lr 数会因细胞组成差异得出错误结论。"
    ],
    "pitfalls": [
      "输入必须是 log-normalized 的 data 层，用 counts 会让过表达基因判断完全失效。",
      "CellChatDB.human 的基因名区分大小写，小鼠数据要用 CellChatDB.mouse，混用会匹配不到任何互作。",
      "computeCommunProb 默认 permutation 次数较多，几万细胞跑一次可能要几十分钟，先用子集调试。"
    ],
    "next": [
      "scrna-20",
      "scrna-16",
      "scrna-21"
    ]
  },
  {
    "id": "scrna-20",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "SCENIC：转录因子调控网络与 regulon 活性",
    "level": "少见",
    "tags": [
      "SCENIC",
      "转录因子",
      "regulon",
      "AUCell"
    ],
    "packages": [
      "SCENIC",
      "GENIE3",
      "RcisTarget",
      "AUCell",
      "Seurat"
    ],
    "scene": "想看哪个转录因子在驱动某群细胞的状态，而不是只看差异基因列表。",
    "code": "# ============================================================\n# 20 SCENIC：共表达模块 → motif 富集 → regulon 打分\n# ============================================================\nlibrary(SCENIC)\nlibrary(Seurat)\n\nobj <- readRDS(\"data/processed/obj_annotated.rds\")\nexprMat <- as.matrix(GetAssayData(obj, assay = \"RNA\", layer = \"counts\"))\nstorage.mode(exprMat) <- \"double\"\n\n# 1) 初始化：dbDir 里放 cisTarget 的 feather 注释文件（hg38）\nscenicOptions <- initializeScenic(org = \"hgnc\", dbDir = \"data/ref/cisTarget_databases\",\n                                  nCores = 8, datasetTitle = \"SX_obj\")\ncellInfo <- data.frame(cellType = obj$celltype, nGene = obj$nFeature_RNA,\n                       row.names = colnames(obj))\nscenicOptions@inputDatasetInfo$cellInfo <- cellInfo\n\n# 2) 基因过滤：至少在 1% 的细胞里检出\ngenesKept <- geneFiltering(exprMat, scenicOptions = scenicOptions,\n                           minCountsPerGene = 3 * 0.01 * ncol(exprMat),\n                           minSamples = ncol(exprMat) * 0.01)\nexprMat_f <- exprMat[genesKept, ]\n\n# 3) 共表达推断（GENIE3 很慢，几万细胞建议先降采样到 5000）\nrunCorrelation(exprMat_f, scenicOptions)\nrunGenie3(exprMat_f, scenicOptions, nParts = 20)\n\n# 4) 三步走：模块 → regulon → 活性打分\nscenicOptions <- runSCENIC_1_coexNetwork2modules(scenicOptions)\nscenicOptions <- runSCENIC_2_createRegulons(scenicOptions, coexMethod = \"top5perTarget\")\nscenicOptions <- runSCENIC_3_scoreCells(scenicOptions, exprMat_f)\n\n# 5) 把 AUC 矩阵并回 Seurat\nauc <- read.csv(\"int/3.4_regulonAUC.scaled.tsv\", row.names = 1, sep = \"\\t\")\nobj[[\"regulon\"]] <- CreateAssayObject(data = as.matrix(auc[, colnames(obj)]))\nDefaultAssay(obj) <- \"regulon\"\nFeaturePlot(obj, features = rownames(auc)[1:4], ncol = 2)\nsaveRDS(obj, \"data/processed/obj_scenic.rds\")",
    "notes": [
      "SCENIC 的输入是原始 count 矩阵（它自己内部做归一化），不要传已经 scale 的数据。",
      "cisTarget 的 motif 注释文件必须和物种/基因组版本匹配，hg19 的 db 用在 hg38 基因名上会得到错误的 regulon。",
      "runSCENIC_3 输出的 AUC 矩阵可以直接当“通路打分”做下游比较，比原始表达更能反映 TF 活性。"
    ],
    "pitfalls": [
      "GENIE3 是 O(n²) 的随机森林，2 万基因 × 1 万细胞能跑一整天，必须降采样 + nParts 并行。",
      "没有安装对应的 RcisTarget 数据库时 runSCENIC_2 会静默返回空 regulon，不报错但结果为空。",
      "SCENIC 的 regulon 命名带 (+)，表示包含激活/抑制靶基因的合并集合，直接用名字做匹配要注意括号。"
    ],
    "next": [
      "scrna-19",
      "scrna-22",
      "bulk-19"
    ]
  },
  {
    "id": "scrna-21",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "伪 bulk 差异分析：把单细胞降级成 bulk 来比较",
    "level": "进阶",
    "tags": [
      "伪bulk",
      "差异分析",
      "pseudobulk",
      "样本为单元"
    ],
    "packages": [
      "Seurat",
      "edgeR",
      "DESeq2",
      "dplyr"
    ],
    "scene": "审稿人指出“按细胞做 Wilcoxon 检验存在伪重复”，需要用样本为单位的伪 bulk 重做差异分析。",
    "code": "# ============================================================\n# 21 伪 bulk：按 样本 × 细胞类型 汇总 counts，再做 bulk 差异\n# ============================================================\nlibrary(Seurat)\nlibrary(edgeR)\nlibrary(dplyr)\n\nobj <- readRDS(\"data/processed/obj_annotated.rds\")\n\n# 1) 汇总：每个 样本-细胞类型 一个“样本”\npb <- AggregateExpression(obj, group.by = c(\"sample\", \"celltype\"),\n                          assays = \"RNA\", return.seurat = FALSE)\ncnt <- pb$RNA\ncolnames(cnt)                                       # 形如 \"S1_T cell\"\nmeta <- data.frame(\n  col = colnames(cnt),\n  sample = sub(\"_.*$\", \"\", colnames(cnt)),\n  celltype = sub(\"^[^_]+_\", \"\", colnames(cnt))\n)\n\n# 2) 只分析细胞数足够的组合（每样本至少 10 个细胞）\nncell <- obj@meta.data %>% count(sample, celltype, name = \"n\")\nok <- ncell %>% filter(n >= 10) %>% mutate(col = paste(sample, celltype, sep = \"_\"))\ncnt <- cnt[, colnames(cnt) %in% ok$col]\nmeta <- meta[meta$col %in% colnames(cnt), ]\n\n# 3) 单一细胞类型内比较分组（必须有多生物学重复）\nct <- \"T cell\"\nsub_cnt <- cnt[, meta$celltype == ct]\nsub_meta <- meta[meta$celltype == ct, ]\ngrp <- readRDS(\"data/processed/clinical.rds\")$group[match(sub_meta$sample,\n                                                          readRDS(\"data/processed/clinical.rds\")$sample)]\nsub_meta$group <- factor(grp, levels = c(\"Ctrl\", \"Treat\"))\ntable(sub_meta$group)\nstopifnot(min(table(sub_meta$group)) >= 3)          # 每组至少 3 个样本\n\ndge <- DGEList(sub_cnt, group = sub_meta$group)\nkeep <- filterByExpr(dge, design = model.matrix(~ group, data = sub_meta))\ndge <- calcNormFactors(dge[keep, , keep.lib.sizes = FALSE])\ndesign <- model.matrix(~ group, data = sub_meta)\nv <- voom(dge, design)\nfit <- eBayes(lmFit(v, design))\ntopTable(fit, coef = 2, number = 30, sort.by = \"P\")",
    "notes": [
      "伪 bulk 的核心是把“细胞”当技术重复的伪重复问题消掉，统计单元必须是生物学样本。",
      "每个样本每个细胞类型至少 10 个细胞才聚合，细胞太少时 counts 噪声极大。",
      "聚合用 sum（counts 相加），不是平均，平均会破坏负二项分布假设。"
    ],
    "pitfalls": [
      "只有 2 个生物学重复时伪 bulk 的检验功效极低，几乎不可能得到显著结果，不要硬跑。",
      "把所有细胞类型合并成一个 pseudobulk 再比较，等于放弃了单细胞的分辨率，结论和 bulk 无差别。",
      "AggregateExpression 在 Seurat v5 里默认返回 list（按 assay），忘了取 $RNA 会报类型错误。"
    ],
    "next": [
      "bulk-12",
      "scrna-16",
      "stats-02"
    ]
  },
  {
    "id": "scrna-22",
    "track": "scrna",
    "trackName": "单细胞转录组",
    "title": "亚群再聚类：把 T 细胞单独拿出来细分",
    "level": "进阶",
    "tags": [
      "亚群",
      "再聚类",
      "subset",
      "精细分型"
    ],
    "packages": [
      "Seurat",
      "harmony",
      "ggplot2"
    ],
    "scene": "大体注释后发现 T 细胞簇里混着 naive/记忆/耗竭，需要单独取出来重新降维聚类。",
    "code": "# ============================================================\n# 22 亚群再聚类：subset → 重算 HVG/PCA → 再整合 → 细分\n# ============================================================\nlibrary(Seurat)\nlibrary(harmony)\nlibrary(ggplot2)\n\nobj <- readRDS(\"data/processed/obj_annotated.rds\")\ntc <- subset(obj, subset = celltype == \"T cell\")\ncat(\"T 细胞数：\", ncol(tc), \"\\n\")\n\n# 1) 清掉旧降维与聚类，否则会带着上一层的结构走\ntc@reductions <- list()\ntc@graphs <- list()\ntc$seurat_clusters <- NULL\n\n# 2) 重新做高变基因（亚群内部变异和全局完全不同，这一步不能省）\ntc <- NormalizeData(tc) %>% FindVariableFeatures(nfeatures = 2000) %>%\n  ScaleData(vars.to.regress = \"percent.mt\") %>% RunPCA(npcs = 40)\n\n# 3) 亚群内重新整合（样本间批次在亚群层面依然存在）\ntc <- RunHarmony(tc, group.by.vars = \"sample\", dims.use = 1:25)\ntc <- RunUMAP(tc, reduction = \"harmony\", dims = 1:25, reduction.name = \"umap.sub\")\ntc <- FindNeighbors(tc, reduction = \"harmony\", dims = 1:25)\ntc <- FindClusters(tc, resolution = 0.4)\n\n# 4) 亚群 marker 与经典分型\nsub_markers <- FindAllMarkers(tc, only.pos = TRUE, min.pct = 0.25, logfc.threshold = 0.25)\nsub_markers %>% group_by(cluster) %>% slice_max(avg_log2FC, n = 5) %>% print(n = 80)\n\nDotPlot(tc, features = c(\"CCR7\",\"SELL\",\"TCF7\",\"IL7R\",      # naive / 记忆\n                         \"GZMB\",\"PRF1\",\"NKG7\",              # 效应/细胞毒\n                         \"PDCD1\",\"HAVCR2\",\"LAG3\",\"TOX\",     # 耗竭\n                         \"FOXP3\",\"IL2RA\",\"CTLA4\")) +        # Treg\n  RotatedAxis()\n\n# 5) 亚群标签回写到原对象，方便全局分析\nmap <- c(`0` = \"CD4 naive\", `1` = \"CD8 Tem\", `2` = \"CD8 Tex\", `3` = \"Treg\")\nobj$tcell_sub <- NA\nobj$tcell_sub[colnames(tc)] <- unname(map[as.character(tc$seurat_clusters)])\nsaveRDS(list(obj = obj, tc = tc), \"data/processed/obj_tcell_sub.rds\")",
    "notes": [
      "亚群分析必须重算 HVG 和 PCA：全局 HVG 反映的是细胞类型间的差异，亚群内部的差异基因完全不同。",
      "再聚类前清掉 reductions 和 graphs，否则 RunUMAP 会沿用旧图，看起来“没变”。",
      "亚群标签回写时用 colnames 匹配，不要用细胞顺序下标，subset 之后顺序会变。"
    ],
    "pitfalls": [
      "直接对 subset 后的对象 FindClusters 而不重算 PCA，等于在旧空间里重新切一刀，亚群结构出不来。",
      "亚群内细胞数少（< 200）时 harmony 过度校正，会把真实亚群抹成一群。",
      "resolution 沿用全局的 0.6，亚群内部通常需要更小的值（0.2~0.4），否则碎成十几个簇。"
    ],
    "next": [
      "scrna-15",
      "scrna-18",
      "scrna-16"
    ]
  },
  {
    "id": "spatial-05",
    "track": "spatial",
    "trackName": "空间转录组",
    "title": "Visium 读取：从 spaceranger 输出到 Seurat 对象",
    "level": "常用",
    "tags": [
      "Visium",
      "10x",
      "空间转录组",
      "Load10X_Spatial"
    ],
    "packages": [
      "Seurat",
      "hdf5r",
      "ggplot2"
    ],
    "scene": "测序公司给了 Visium 的 filtered_feature_bc_matrix.h5 和一张 H&E 图，要读进来做后续分析。",
    "code": "# ============================================================\n# 05 Visium：读入 → 看切片 → 基础归一化\n# ============================================================\nlibrary(Seurat)\nlibrary(ggplot2)\n\n# 目录里应有：barcodes/features/matrix 或 filtered_feature_bc_matrix.h5 + spatial/ 文件夹\ndata_dir <- \"data/raw/visium/S1_spaceranger/outs\"\nlist.files(file.path(data_dir, \"spatial\"))     # tissue_positions.csv, scalefactors_json.json, 图片\n\nobj <- Load10X_Spatial(data.dir = data_dir,\n                       filename = \"filtered_feature_bc_matrix.h5\",\n                       slice = \"slice1\",\n                       assay = \"Spatial\",\n                       filter.matrix = TRUE)     # TRUE 只保留组织内的 spot\n\nobj\n# 每个 spot 的坐标与组织覆盖\nhead(GetTissueCoordinates(obj))\n\n# 1) 看图：H&E 上叠加 count，确认方向和比例对不对\nSpatialFeaturePlot(obj, features = \"nCount_RNA\", alpha = 0.8) +\n  theme(legend.position = \"right\")\nSpatialDimPlot(obj, alpha = 0.6)\n\n# 2) 质控指标（空间数据没有线粒体阈值那么严格，因为一个 spot 里是多个细胞）\nobj[[\"percent.mt\"]] <- PercentageFeatureSet(obj, pattern = \"^MT-\")\nVlnPlot(obj, features = c(\"nCount_RNA\", \"nFeature_RNA\", \"percent.mt\"), pt.size = 0.1)\n\n# 3) 归一化：SCT 在空间数据上表现稳定（也可以用 LogNormalize）\nobj <- SCTransform(obj, assay = \"Spatial\", vst.flavor = \"v2\", verbose = FALSE)\n\n# 4) 常规降维聚类（空间数据同样先按表达聚类，再叠加坐标看）\nobj <- RunPCA(obj, assay = \"SCT\", verbose = FALSE)\nobj <- RunUMAP(obj, dims = 1:30, reduction.name = \"umap\")\nobj <- FindNeighbors(obj, dims = 1:30) %>% FindClusters(resolution = 0.5)\nSpatialDimPlot(obj, label = TRUE, label.size = 3)\n\nsaveRDS(obj, \"data/processed/visium_s1.rds\")",
    "notes": [
      "filter.matrix = TRUE 只保留组织覆盖的 spot；设 FALSE 会带入背景空 spot，PCA 会被背景主导。",
      "Visium 一个 spot 直径 55 µm，通常含 1~10 个细胞，所以不能用单细胞的“每细胞”口径解释结果。",
      "load 失败最常见的原因是 spatial 文件夹和 h5 文件不在同一层，Load10X_Spatial 会去 data.dir/spatial 找。"
    ],
    "pitfalls": [
      "切片坐标是图像像素坐标（imagerow/imagecol），不是毫米，做距离计算要乘以 scalefactors 里的 pixel size。",
      "同一个对象里加第二张切片（slice2）时坐标会自动对齐到各自图像，跨切片直接比较坐标是错误的。",
      "h5 文件需要 hdf5r 包，Windows 上装不上时改用 matrix.mtx.gz 三件套。"
    ],
    "next": [
      "spatial-06",
      "spatial-07",
      "scrna-11"
    ]
  },
  {
    "id": "spatial-06",
    "track": "spatial",
    "trackName": "空间转录组",
    "title": "spot 质控与过滤：线粒体、文库大小与空间分布",
    "level": "常用",
    "tags": [
      "质控",
      "spot过滤",
      "空间分布",
      "nCount"
    ],
    "packages": [
      "Seurat",
      "ggplot2",
      "patchwork"
    ],
    "scene": "有些 spot 落在组织边缘或坏死区，count 极低，不剔除会在聚类里形成“低质量簇”。",
    "code": "# ============================================================\n# 06 spot 质控：不只看数值，还要看空间分布\n# ============================================================\nlibrary(Seurat)\nlibrary(ggplot2)\nlibrary(patchwork)\n\nobj <- readRDS(\"data/processed/visium_s1.rds\")\n\n# 1) 数值分布\nsummary(obj$nCount_RNA); summary(obj$nFeature_RNA); summary(obj$percent.mt)\n\np1 <- SpatialFeaturePlot(obj, \"nCount_RNA\") + ggtitle(\"UMI per spot\")\np2 <- SpatialFeaturePlot(obj, \"nFeature_RNA\") + ggtitle(\"Genes per spot\")\np3 <- SpatialFeaturePlot(obj, \"percent.mt\") + ggtitle(\"MT%\")\np1 | p2 | p3\n\n# 2) 空间分布才是关键：组织边缘的 spot 天然 count 低\n#    如果低 count 集中在某一角，那是组织切片/测序问题，不是细胞少\nobj$low_quality <- obj$nCount_RNA < quantile(obj$nCount_RNA, 0.05) |\n                   obj$nFeature_RNA < 200\nSpatialDimPlot(obj, group.by = \"low_quality\")\n\n# 3) 过滤：去掉极低质量 spot 与高线粒体 spot\nobj <- subset(obj, subset = nCount_RNA > 500 & nFeature_RNA > 200 & percent.mt < 25)\ncat(\"剩余 spot：\", ncol(obj), \"\\n\")\n\n# 4) 基因层面：至少在一定比例 spot 中检出\ncnt <- GetAssayData(obj, assay = \"Spatial\", layer = \"counts\")\nobj <- obj[rownames(cnt)[Matrix::rowSums(cnt > 0) >= 10], ]\n\n# 5) 剔除明显是技术噪声的基因（线粒体、核糖体、血红蛋白）\ndrop <- grep(\"^MT-|^RP[SL]|^HB[AB]\", rownames(obj), value = TRUE)\nobj <- obj[!rownames(obj) %in% drop, ]\ndim(obj)\nsaveRDS(obj, \"data/processed/visium_qc.rds\")",
    "notes": [
      "空间数据里 count 低不一定是坏 spot：某些组织（脂肪、软骨）本身细胞稀疏，要结合 H&E 判断。",
      "percent.mt 阈值在 Visium 上通常比单细胞宽松（20%~30%），因为一个 spot 是多细胞混合。",
      "过滤后要检查空间连续性：如果中间被挖出一个洞，说明阈值过严。"
    ],
    "pitfalls": [
      "按 5% 分位数一刀切，在 spot 数少（< 1000）的切片上会误删整片区域，建议固定绝对值阈值。",
      "subset 之后再跑 SCTransform 会重新拟合，之前算好的 SCT 模型失效，必须重跑。",
      "把线粒体基因全删掉后想算 percent.mt 就没了，做质控要留到过滤完成后再删。"
    ],
    "next": [
      "spatial-07",
      "spatial-08",
      "spatial-09"
    ]
  },
  {
    "id": "spatial-07",
    "track": "spatial",
    "trackName": "空间转录组",
    "title": "空间可变基因：Moran's I 与 SPARK",
    "level": "进阶",
    "tags": [
      "SVG",
      "Moran's I",
      "SPARK",
      "空间模式"
    ],
    "packages": [
      "Seurat",
      "ape",
      "SPARK",
      "ggplot2"
    ],
    "scene": "想知道哪些基因的表达在空间上有明显的梯度或聚集模式，而不只是细胞类型间的差异。",
    "code": "# ============================================================\n# 07 空间可变基因：Moran's I（Seurat 内置）与 SPARK\n# ============================================================\nlibrary(Seurat)\nlibrary(ape)\n\nobj <- readRDS(\"data/processed/visium_qc.rds\")\n\n# ---- 路线 A：Seurat 内置 Moran's I ----\nobj <- FindSpatiallyVariableFeatures(obj, assay = \"SCT\",\n                                     selection.method = \"moransi\",\n                                     features = VariableFeatures(obj)[1:2000],\n                                     nfeatures = 100)\ntop_svg <- head(SpatiallyVariableFeatures(obj, selection.method = \"moransi\"), 6)\nSpatialFeaturePlot(obj, features = top_svg, ncol = 3)\n\n# ---- 路线 B：手算 Moran's I，理解原理 ----\ncoords <- GetTissueCoordinates(obj)[, c(\"x\", \"y\")]\n# 距离权重矩阵：反距离，超过 3 个 spot 直径记为 0\nd <- as.matrix(dist(coords))\nw <- ifelse(d > 0, 1 / d, 0); diag(w) <- 0\nw <- w * (d < median(d[d > 0]) * 2)\n\nmoran_i <- function(x, w) {\n  x <- as.numeric(x); x <- x - mean(x)\n  n <- length(x)\n  (n / sum(w)) * (sum(w * outer(x, x)) / sum(x^2))\n}\nexpr <- GetAssayData(obj, assay = \"SCT\", layer = \"data\")\nmi <- apply(expr[VariableFeatures(obj)[1:200], ], 1, moran_i, w = w)\nhead(sort(mi, decreasing = TRUE), 10)\n\n# ---- 路线 C：SPARK（专门为空间数据设计，更慢更稳）----\n# library(SPARK)\n# spark_obj <- sparkx(as.matrix(expr[1:500, ]), as.matrix(coords),\n#                     num_core = 4, option = \"mixture\")\n# head(spark_obj$res_mtest[order(spark_obj$res_mtest$combined_pval), ])\n\nsaveRDS(top_svg, \"results/tables/svg_top.rds\")",
    "notes": [
      "Moran's I 衡量的是“相邻 spot 表达是否相似”，数值接近 1 表示强空间聚集，接近 0 表示随机。",
      "反距离权重是最常用的构造方式，但阈值（这里用中位距离×2）会显著影响结果，要做敏感性分析。",
      "SVG 与“细胞类型 marker”不是一回事：某个基因可能只在一种细胞里表达但该细胞均匀分布，Moran's I 就不高。"
    ],
    "pitfalls": [
      "用欧氏距离直接算，但切片不是正方形像素（相同 µm 对应的像素数不同），严格来说要按 scalefactors 换算坐标。",
      "SPARK 在 spot 数 > 5000 时极慢且吃内存，通常先筛 2000 个高变基因再跑。",
      "Moran's I 的 p 值基于随机化假设，空间自相关本身会让 p 值偏小，多重检验要用 BH 而不是 Bonferroni 硬卡。"
    ],
    "next": [
      "spatial-09",
      "spatial-08",
      "bulk-25"
    ]
  },
  {
    "id": "spatial-08",
    "track": "spatial",
    "trackName": "空间转录组",
    "title": "去卷积：RCTD 估计每个 spot 的细胞类型构成",
    "level": "少见",
    "tags": [
      "去卷积",
      "RCTD",
      "spacexr",
      "cell2location"
    ],
    "packages": [
      "spacexr",
      "Seurat",
      "ggplot2"
    ],
    "scene": "Visium 一个 spot 混了多种细胞，想知道每个 spot 里 T 细胞、肿瘤细胞各占多少。",
    "code": "# ============================================================\n# 08 RCTD：用单细胞参考给每个 spot 拆成分\n# ============================================================\nlibrary(spacexr)\nlibrary(Seurat)\nlibrary(ggplot2)\n\n# 1) 参考：单细胞对象（必须有 celltype 注释，且细胞数别太少）\nref <- readRDS(\"data/processed/obj_annotated.rds\")\nref <- subset(ref, downsample = 300)              # 每类最多 300 个，控制内存\nref_cnt <- GetAssayData(ref, assay = \"RNA\", layer = \"counts\")\nreference <- Reference(counts = ref_cnt,\n                       cell_types = factor(ref$celltype),\n                       n_max_cells = 5000)\n\n# 2) 目标：Visium 对象\nsp <- readRDS(\"data/processed/visium_qc.rds\")\ncoords <- GetTissueCoordinates(sp)[, c(\"x\", \"y\")]\ncolnames(coords) <- c(\"x\", \"y\")\npuck <- SpatialRNA(coords = coords,\n                   counts = GetAssayData(sp, assay = \"Spatial\", layer = \"counts\"))\n\n# 3) 跑 RCTD（doublet_mode = \"doublet\" 允许一个 spot 由两种细胞主导）\nrctd <- create.RCTD(puck, reference, max_cores = 8, test_mode = FALSE)\nrctd <- run.RCTD(rctd, doublet_mode = \"doublet\")\n\n# 4) 结果：每个 spot 的主要细胞类型 + 权重矩阵\nweights <- as.matrix(rctd@results$weights)        # spot × 细胞类型\nres_df  <- rctd@results$results_df\nsp$first_type <- res_df[colnames(sp), \"first_type\"]\nSpatialDimPlot(sp, group.by = \"first_type\", label = TRUE, label.size = 2.5)\n\n# 5) 看某个细胞类型的空间分布（权重当“表达量”用）\nsp[[\"rctd_Tcell\"]] <- weights[colnames(sp), \"T cell\"]\nSpatialFeaturePlot(sp, \"rctd_Tcell\")\n\n# cell2location（Python）适合多切片联合建模，R 里可以用它的导出结果做下游\nwrite.csv(weights, \"results/tables/rctd_weights.csv\")",
    "notes": [
      "RCTD 的参考必须与目标组织同源（人脑参考不能用在小鼠肝上），跨组织去卷积结果不可解释。",
      "n_max_cells 限制每类参考细胞数，太少（< 50）估计不稳，太多会慢且无收益。",
      "doublet_mode = 'doublet' 只允许两种细胞主导，组织复杂（> 5 种细胞）时用 'full' 更合适。"
    ],
    "pitfalls": [
      "参考和目标的基因名必须一致且不能有重复，RCTD 对重复基因直接报错。",
      "坐标必须是 data.frame 且列名是 x/y，GetTissueCoordinates 返回的是 imagerow/imagecol，直接传会报错。",
      "权重矩阵的行名是 barcode，取子集时用 colnames(sp) 匹配，靠位置索引会整体错位。"
    ],
    "next": [
      "spatial-09",
      "spatial-07",
      "scrna-15"
    ]
  },
  {
    "id": "spatial-09",
    "track": "spatial",
    "trackName": "空间转录组",
    "title": "空间区域注释与邻域分析",
    "level": "进阶",
    "tags": [
      "区域注释",
      "空间聚类",
      "邻域",
      "niche"
    ],
    "packages": [
      "Seurat",
      "RANN",
      "ggplot2",
      "dplyr"
    ],
    "scene": "聚类结果和病理分区（肿瘤区、间质区、坏死区）对不上，需要按空间位置重新定义区域。",
    "code": "# ============================================================\n# 09 空间区域：先聚类，再用空间连续性合并成区域\n# ============================================================\nlibrary(Seurat)\nlibrary(dplyr)\nlibrary(ggplot2)\n\nsp <- readRDS(\"data/processed/visium_qc.rds\")\nsp <- RunPCA(sp, assay = \"SCT\", verbose = FALSE)\nsp <- FindNeighbors(sp, dims = 1:30)\nsp <- FindClusters(sp, resolution = 0.6)\nSpatialDimPlot(sp, label = TRUE)\n\n# 1) 每个簇的空间中心与离散度：判断该簇是“连片”还是“散点”\ncenters <- sp@meta.data %>%\n  bind_cols(as.data.frame(GetTissueCoordinates(sp)[, c(\"x\", \"y\")])) %>%\n  group_by(seurat_clusters) %>%\n  summarise(n = n(), cx = mean(x), cy = mean(y),\n            sd_x = sd(x), sd_y = sd(y), .groups = \"drop\") %>%\n  mutate(compact = sd_x < 300 & sd_y < 300)      # 阈值按图像尺寸调整\ncenters\n\n# 2) 按 marker 给区域命名（先找每个簇的 marker）\nIdents(sp) <- \"seurat_clusters\"\nmk <- FindAllMarkers(sp, only.pos = TRUE, min.pct = 0.25, logfc.threshold = 0.25)\nmk %>% group_by(cluster) %>% slice_max(avg_log2FC, n = 5) %>% print(n = 50)\n\n# 3) 区域命名：结合 marker 与空间位置（示例）\nregion_map <- c(`0` = \"Tumor\", `1` = \"Stroma\", `2` = \"Immune\", `3` = \"Necrosis\")\nsp$region <- unname(region_map[as.character(sp$seurat_clusters)])\nsp$region[is.na(sp$region)] <- \"Other\"\n\n# 4) 邻域分析：统计每个 spot 周围 6 个邻居的区域组成（六边形网格）\ncoords <- GetTissueCoordinates(sp)[, c(\"x\", \"y\")]\nnn <- RANN::nn2(coords, k = 7)$nn.idx[, -1]     # 最近 6 个邻居\nneighbor_region <- t(apply(nn, 1, function(i) table(sp$region[i])[c(\"Tumor\",\"Stroma\",\"Immune\")]))\ncolnames(neighbor_region) <- paste0(\"nb_\", c(\"Tumor\",\"Stroma\",\"Immune\"))\nsp@meta.data <- cbind(sp@meta.data, neighbor_region)\nsaveRDS(sp, \"data/processed/visium_region.rds\")\nSpatialDimPlot(sp, group.by = \"region\", label = TRUE)",
    "notes": [
      "空间聚类的结果天然带空间自相关，不要再用普通 t 检验比较区域间差异，p 值会被严重高估。",
      "区域命名必须同时看 marker 与空间位置：只看 marker 会把“同一区域的不同状态”分成两个区。",
      "邻域统计用 6 个最近邻（Visium 是六边形网格，每个 spot 有 6 个邻居），用 k = 8 会引入斜向噪声。"
    ],
    "pitfalls": [
      "样本量只有一张切片时，任何“区域间差异”都不能外推，只能作为假设生成。",
      "RANN::nn2 在坐标尺度差异大（x/y 像素不等距）时会算错邻居，必要时先按像素物理尺寸归一。",
      "把 region 写进 meta.data 后重跑 SCTransform，会把 region 当成协变量来源，导致信息泄漏。"
    ],
    "next": [
      "spatial-08",
      "scrna-22",
      "viz-11"
    ]
  },
  {
    "id": "mr-05",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "TwoSampleMR 标准流程：暴露 → 结局 → harmonise",
    "level": "常用",
    "tags": [
      "孟德尔随机化",
      "TwoSampleMR",
      "harmonise",
      "IEU"
    ],
    "packages": [
      "TwoSampleMR",
      "dplyr",
      "ggplot2"
    ],
    "scene": "想用 GWAS summary 数据做暴露（比如 BMI）对结局（比如乳腺癌）的因果推断，从取工具变量开始。",
    "code": "# ============================================================\n# 05 两样本 MR：选工具变量 → 取结局 → 对齐等位基因\n# ============================================================\nlibrary(TwoSampleMR)\nlibrary(dplyr)\n\n# 1) 暴露：IEU OpenGWAS 的 ID（也可以用本地 GWAS summary 文件）\nexposure_dat <- extract_instruments(\n  outcomes = \"ieu-b-40\",          # 示例：BMI\n  p1 = 5e-08,                     # 全基因组显著\n  clump = TRUE, r2 = 0.001, kb = 10000,\n  access_token = Sys.getenv(\"OPENGWAS_JWT\")\n)\nexposure_dat <- clump_data(exposure_dat, clump_r2 = 0.001, clump_kb = 10000)\ncat(\"工具变量个数：\", nrow(exposure_dat), \"\\n\")\n\n# 2) 结局：按暴露的 SNP 去取\noutcome_dat <- extract_outcome_data(\n  snps = exposure_dat$SNP,\n  outcomes = \"ieu-b-4977\",        # 示例：乳腺癌\n  proxies = TRUE, rsq = 0.8,      # 允许用高 LD 代理 SNP\n  access_token = Sys.getenv(\"OPENGWAS_JWT\")\n)\n\n# 3) 对齐：效应等位基因方向必须一致，否则 beta 符号全反\ndat <- harmonise_data(exposure_dat, outcome_dat, action = 2)\ntable(dat$mr_keep)                # FALSE 的是被剔除的（回文、模糊）\n\n# 4) 主分析\nres <- mr(dat, method_list = c(\"mr_ivw\", \"mr_egger_regression\",\n                               \"mr_weighted_median\", \"mr_weighted_mode\"))\nres_or <- generate_odds_ratios(res)\nprint(res_or[, c(\"method\", \"nsnp\", \"b\", \"se\", \"pval\", \"or\", \"or_lci95\", \"or_uci95\")])\n\nwrite.csv(dat, \"results/tables/mr_harmonised.csv\", row.names = FALSE)\nwrite.csv(res_or, \"results/tables/mr_results.csv\", row.names = FALSE)",
    "notes": [
      "action = 2 是“尝试对齐，对不齐就剔除”，action = 1 是假定全是同一方向，action = 3 是全部反转，默认 2 最安全。",
      "p1 = 5e-08 是常规全基因组阈值；工具变量太少（< 3）时 IVW 极不稳定，应放宽到 5e-06 并做敏感性分析。",
      "extract_outcome_data 的 proxies = TRUE 会用 LD 代理补齐缺失 SNP，能显著增加可用工具变量。"
    ],
    "pitfalls": [
      "回文 SNP（A/T、G/C）在 harmonise 时最容易出错，必须看 mr_keep 列并在方法里说明如何处理。",
      "暴露和结局如果来自同一批样本（样本重叠），MR 结果会被弱工具偏倚污染，要用 MRlap 之类的方法校正。",
      "extract_instruments 默认 clump = TRUE 也要联网，本地跑要提前下载 PLINK 参考面板。"
    ],
    "next": [
      "mr-06",
      "mr-07",
      "mr-08"
    ]
  },
  {
    "id": "mr-06",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "本地 LD clump：不联网也能筛独立工具变量",
    "level": "进阶",
    "tags": [
      "clump",
      "LD",
      "plink",
      "ieugwasr"
    ],
    "packages": [
      "ieugwasr",
      "genetics.binaRies",
      "data.table"
    ],
    "scene": "IEU 的 clump 服务经常超时，或者手上是本地 GWAS summary（没有 SNP 的 rsID），想自己跑 LD 剪枝。",
    "code": "# ============================================================\n# 06 本地 clump：PLINK + 1000G 参考面板\n# ============================================================\nlibrary(ieugwasr)\nlibrary(data.table)\n\n# 1) 读本地 GWAS summary（列名至少要有 SNP / p / beta / se / ea / nea）\ngwas <- fread(\"data/raw/exposure_gwas.txt\")\nsetnames(gwas, c(\"SNP\", \"p\", \"beta\", \"se\", \"ea\", \"nea\", \"eaf\", \"n\"))\n\n# 2) 只留全基因组显著位点（先粗筛，减少 clump 计算量）\nsig <- gwas[p < 5e-08 & !is.na(SNP)]\ncat(\"显著 SNP：\", nrow(sig), \"\\n\")\n\n# 3) 本地 clump：需要 PLINK 二进制 + 1000G EUR 参考（.bed/.bim/.fam）\n#    bfile 指向参考面板前缀\nclumped <- ld_clump(\n  dat = data.frame(rsid = sig$SNP, pval = sig$p),\n  clump_kb = 10000, clump_r2 = 0.001,\n  clump_p = 5e-08,\n  bfile = \"data/ref/EUR\",          # 1000G EUR 前缀\n  plink_bin = genetics.binaRies::get_plink_binary()\n)\ncat(\"clump 后独立 SNP：\", nrow(clumped), \"\\n\")\n\n# 4) 取回完整信息\niv <- merge(clumped, gwas, by.x = \"rsid\", by.y = \"SNP\")\niv <- iv[order(iv$p)]\n\n# 5) 计算 F 统计量：评估工具变量强度（F > 10 才算强工具）\niv$r2 <- 2 * iv$eaf * (1 - iv$eaf) * iv$beta^2\niv$F  <- (iv$n - 2) * iv$r2 / (1 - iv$r2)\nsummary(iv$F)\n\nwrite.csv(iv, \"data/processed/instruments_clumped.csv\", row.names = FALSE)",
    "notes": [
      "clump_r2 = 0.001 是阈值惯例（对应 r² < 0.1%），clump_kb = 10000 表示 10 Mb 窗口内只保留最显著的。",
      "参考面板的祖先必须和目标 GWAS 人群一致，欧洲人 GWAS 用 EUR 面板，用 AFR 面板会过度剪枝。",
      "F 统计量 < 10 的 SNP 是弱工具，弱工具会让 IVW 结果偏向混杂方向。"
    ],
    "pitfalls": [
      "ld_clump 的 dat 列名必须叫 rsid 和 pval，换个名字会报 'no column named'。",
      "PLINK 二进制路径在 Windows 上要指向 plink.exe，直接给 'plink' 在没加 PATH 时会失败。",
      "本地 GWAS 如果没有 rsID 只有 chr:pos，要先做 rsID 注释（可用 SNPlocs 或 dbSNP 的 VCF），否则 clump 无从下手。"
    ],
    "next": [
      "mr-05",
      "mr-07",
      "mr-08"
    ]
  },
  {
    "id": "mr-07",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "MR 三种主方法：IVW / MR-Egger / 加权中位数",
    "level": "常用",
    "tags": [
      "IVW",
      "MR-Egger",
      "加权中位数",
      "OR"
    ],
    "packages": [
      "TwoSampleMR",
      "ggplot2",
      "dplyr"
    ],
    "scene": "harmonise 完了，要给出一张结果表（含 OR 和 95%CI）以及散点图、森林图。",
    "code": "# ============================================================\n# 07 主分析：三种方法互补 + 出图\n# ============================================================\nlibrary(TwoSampleMR)\nlibrary(ggplot2)\nlibrary(dplyr)\n\ndat <- read.csv(\"results/tables/mr_harmonised.csv\")\ndat <- dat[dat$mr_keep == TRUE, ]\n\n# 1) 三种方法：IVW 是主结果，Egger 检验多效性，加权中位数是稳健性验证\nres <- mr(dat, method_list = c(\"mr_ivw\", \"mr_egger_regression\",\n                               \"mr_weighted_median\", \"mr_weighted_mode\"))\nres <- generate_odds_ratios(res)\nprint(res[, c(\"method\", \"nsnp\", \"b\", \"se\", \"pval\", \"or\", \"or_lci95\", \"or_uci95\")])\n\n# 2) 散点图：每个点是一个 SNP，斜率就是因果效应\np1 <- mr_scatter_plot(res, dat)[[1]]\np1 + theme_bw()\n\n# 3) 森林图：单 SNP 与多方法并列\nres_single <- mr_singlesnp(dat, all_method = c(\"mr_ivw\", \"mr_egger_regression\"))\np2 <- mr_forest_plot(res_single)[[1]]\n\n# 4) 留一法图：看有没有单个 SNP 在驱动结果\nloo <- mr_leaveoneout(dat)\np3 <- mr_leaveoneout_plot(loo)[[1]]\n\n# 5) 结果表整理成论文格式\nout <- res %>%\n  mutate(across(c(b, se, or, or_lci95, or_uci95), ~ round(.x, 4)),\n         pval = signif(pval, 3)) %>%\n  select(method, nsnp, b, se, pval, or, or_lci95, or_uci95)\nwrite.csv(out, \"results/tables/mr_main_results.csv\", row.names = FALSE)",
    "notes": [
      "IVW 假设所有 SNP 都有效（无多效性）；MR-Egger 允许存在定向多效性但功效低，两者结论不一致时要谨慎解释。",
      "加权中位数要求至少一半的权重来自有效 SNP，比 IVW 稳健，是必报的敏感性分析。",
      "OR 是由 exp(b) 得到的，只在二分类结局下有意义；连续结局应该报 beta 而不是 OR。"
    ],
    "pitfalls": [
      "只报 IVW 一个方法的结果，审稿人一定会要求补 Egger 和中位数。",
      "mr_forest_plot 会把 IVW 与单个 SNP 画在一起，单个 SNP 的 CI 很宽会压扁整体，用 ylim 截断要说明。",
      "mr() 里的 method_list 名字写错（比如 mr_ivw_fe）会静默跳过该方法，结果表里直接少一行。"
    ],
    "next": [
      "mr-08",
      "mr-09",
      "mr-05"
    ]
  },
  {
    "id": "mr-08",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "异质性与多效性：Cochran Q、Egger 截距、MR-PRESSO",
    "level": "进阶",
    "tags": [
      "多效性",
      "异质性",
      "MR-PRESSO",
      "Cochran Q"
    ],
    "packages": [
      "TwoSampleMR",
      "MRPRESSO",
      "ggplot2"
    ],
    "scene": "审稿人问：你的工具变量有没有水平多效性？结果是不是靠一两个异常 SNP 撑起来的？",
    "code": "# ============================================================\n# 08 三大敏感性检验：异质性 / 定向多效性 / 离群 SNP\n# ============================================================\nlibrary(TwoSampleMR)\nlibrary(MRPRESSO)\nlibrary(ggplot2)\n\ndat <- read.csv(\"results/tables/mr_harmonised.csv\")\ndat <- dat[dat$mr_keep == TRUE, ]\n\n# 1) Cochran's Q：SNP 之间的效应是否一致（异质性）\nhet <- mr_heterogeneity(dat)\nprint(het[, c(\"method\", \"Q\", \"Q_df\", \"Q_pval\")])\n\n# 2) MR-Egger 截距：截距显著偏离 0 说明存在定向多效性\npleio <- mr_pleiotropy_test(dat)\nprint(pleio[, c(\"egger_intercept\", \"se\", \"pval\")])\n\n# 3) MR-PRESSO：检测离群 SNP，并给出剔除后的校正估计\npresso <- mr_presso(BetaOutcome = \"beta.outcome\", BetaExposure = \"beta.exposure\",\n                    SdOutcome = \"se.outcome\", SdExposure = \"se.exposure\",\n                    OUTCOME = \"outcome\", EXPOSURE = \"exposure\",\n                    data = dat, NbDistribution = 5000, SignifThreshold = 0.05)\npresso$`Main MR results`                 # Raw 与 Outlier-corrected\npresso$`MR-PRESSO results`$`Distortion test`$Pvalue\n\n# 4) 如果有离群 SNP，剔除后重跑 IVW\nout_idx <- presso$`MR-PRESSO results`$`Distortion test`$`Outliers Indices`\nif (length(out_idx) > 0 && !is.na(out_idx[1])) {\n  dat_clean <- dat[-out_idx, ]\n  print(mr(dat_clean, method_list = \"mr_ivw\"))\n}\n\n# 5) 漏斗图看不对称性（与 Egger 截距互为印证）\nfunnel <- mr_funnel_plot(mr_singlesnp(dat))[[1]]\nfunnel + theme_bw()",
    "notes": [
      "Q 的 p < 0.05 表示存在异质性，此时优先用随机效应 IVW（默认就是），并报告 I²。",
      "Egger 截距的检验功效很低，p > 0.05 只能说“未发现证据”，不能说“没有多效性”。",
      "MR-PRESSO 的离群值剔除必须报告剔了几个、剔除前后结果如何，只报校正后的结果是选择性报告。"
    ],
    "pitfalls": [
      "MR-PRESSO 要求至少 4 个 SNP，工具变量少于 4 个会直接报错。",
      "mr_presso 的列名参数写错（比如把 se.outcome 写成 sd.outcome）时会报 data frame 列不存在，且提示不明显。",
      "Egger 的截距估计依赖 SNP 数量，SNP 太少时截距极不稳定，结果不可解读。"
    ],
    "next": [
      "mr-09",
      "mr-07",
      "mr-10"
    ]
  },
  {
    "id": "mr-09",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "留一法分析：揪出主导结果的单个 SNP",
    "level": "常用",
    "tags": [
      "留一法",
      "leave-one-out",
      "稳健性"
    ],
    "packages": [
      "TwoSampleMR",
      "ggplot2"
    ],
    "scene": "整体 IVW 很显著，但想确认这个结论不是由某一个强效应 SNP 单独驱动的。",
    "code": "# ============================================================\n# 09 留一法：逐个剔除 SNP，看合并效应是否稳定\n# ============================================================\nlibrary(TwoSampleMR)\nlibrary(ggplot2)\n\ndat <- read.csv(\"results/tables/mr_harmonised.csv\")\ndat <- dat[dat$mr_keep == TRUE, ]\ncat(\"参与分析的 SNP：\", nrow(dat), \"\\n\")\n\n# 1) 留一法：每次剔除一个 SNP 重算 IVW\nloo <- mr_leaveoneout(dat)\nprint(loo[, c(\"SNP\", \"b\", \"se\", \"p\")])\n\n# 2) 作图：所有点都应该落在总效应（红线）附近\np <- mr_leaveoneout_plot(loo)[[1]]\np + theme_bw() +\n  labs(title = \"Leave-one-out sensitivity analysis\")\n\n# 3) 定量判断：剔除后效应变化超过 20% 就值得警惕\noverall <- mr(dat, method_list = \"mr_ivw\")\nloo$delta <- abs(loo$b - overall$b) / abs(overall$b)\nworst <- loo[which.max(loo$delta), c(\"SNP\", \"b\", \"delta\")]\nprint(worst)\n\n# 4) 如果某个 SNP 影响巨大，检查它是否：\n#    - 在结局 GWAS 里是强效应位点（可能是水平多效性）\n#    - 处于复杂 LD 区域（如 MHC、ApoE）\n#    - 回文 SNP 且 MAF 接近 0.5（对齐可能出错）\nwrite.csv(loo, \"results/tables/mr_leaveoneout.csv\", row.names = FALSE)",
    "notes": [
      "留一法图里所有估计都在总效应线同侧且变化不大，才能说结果稳健。",
      "SNP 数少于 5 时留一法几乎没有信息量，剔一个就少 20% 的权重。",
      "delta > 0.2（剔除后变化超过 20%）通常作为需要讨论的阈值，但没有硬性标准。"
    ],
    "pitfalls": [
      "mr_leaveoneout 默认用 IVW，如果主分析用的是加权中位数，留一法也要对应换方法。",
      "留一法只检验“单个 SNP 的影响”，无法发现两三个 SNP 联合驱动的偏倚，必要时配合 MR-PRESSO。",
      "把留一法当成“剔除异常值后结果更好看”的工具是数据挖掘，剔除理由必须有生物学或方法学依据。"
    ],
    "next": [
      "mr-08",
      "mr-07",
      "mr-11"
    ]
  },
  {
    "id": "mr-10",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "Steiger 方向检验：因果方向是不是反了",
    "level": "常用",
    "tags": [
      "Steiger",
      "方向检验",
      "因果方向"
    ],
    "packages": [
      "TwoSampleMR",
      "dplyr"
    ],
    "scene": "暴露和结局可能互为因果，想用 Steiger filtering 说明“方向更可能是暴露→结局”。",
    "code": "# ============================================================\n# 10 Steiger：比较 SNP 对暴露与结局的解释方差\n# ============================================================\nlibrary(TwoSampleMR)\nlibrary(dplyr)\n\ndat <- read.csv(\"results/tables/mr_harmonised.csv\")\ndat <- dat[dat$mr_keep == TRUE, ]\n\n# 1) 需要样本量信息：r2 的计算依赖 N\n#    如果 harmonise 后没有 samplesize 列，要手动补\nif (!\"samplesize.outcome\" %in% names(dat) || all(is.na(dat$samplesize.outcome))) {\n  dat$samplesize.outcome <- 200000        # 从原文 Methods 里取\n}\n\n# 2) 计算每个 SNP 对暴露/结局的 r2，并判断方向\ndat_steiger <- directionality_test(dat)\nprint(dat_steiger[, c(\"snp_r2.exposure\", \"snp_r2.outcome\", \"correct_causal_direction\",\n                      \"steiger_pval\")])\n\n# 3) Steiger filtering：剔除方向错误的 SNP 后重跑\ndat_f <- dat[dat$snp_r2.exposure > dat$snp_r2.outcome, ]\ncat(\"保留 SNP：\", nrow(dat_f), \"/\", nrow(dat), \"\\n\")\nmr(dat_f, method_list = c(\"mr_ivw\", \"mr_weighted_median\"))\n\n# 4) 结论怎么写：\n#    - correct_causal_direction = TRUE 且 steiger_pval 显著 → 支持暴露→结局\n#    - 方向错误 → 考虑反向 MR（结局当暴露）\nwrite.csv(dat_steiger, \"results/tables/mr_steiger.csv\", row.names = FALSE)",
    "notes": [
      "directionality_test 是对整个数据集做一次判断，不是逐 SNP 检验；逐 SNP 的 r2 比较才用于 filtering。",
      "r2 的计算需要样本量 N，缺失时 directionality_test 会返回 NA 而不报错，极易被忽略。",
      "Steiger 只能排除“明显反向”，不能证明因果方向，必须与生物学合理性一起解释。"
    ],
    "pitfalls": [
      "样本量填错（比如把病例数当总样本量）会让 r2 系统性偏小，方向判断整体翻转。",
      "对二分类结局，r2 的计算公式与连续变量不同，TwoSampleMR 内部会按比例换算，但前提是 prevalence 设置正确。",
      "Steiger filtering 后工具变量大幅减少时，IVW 的置信区间会变宽，不能只报告过滤后的显著结果。"
    ],
    "next": [
      "mr-07",
      "mr-11",
      "mr-08"
    ]
  },
  {
    "id": "mr-11",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "coloc 共定位：MR 显著但可能不是同一个信号",
    "level": "进阶",
    "tags": [
      "coloc",
      "共定位",
      "eQTL",
      "PP.H4"
    ],
    "packages": [
      "coloc",
      "TwoSampleMR",
      "dplyr"
    ],
    "scene": "MR 显示基因表达与疾病相关，但暴露和结局的 GWAS 信号可能只是 LD 连锁而非同一因果变异。",
    "code": "# ============================================================\n# 11 coloc：检验两个性状是否共享同一个因果变异\n# ============================================================\nlibrary(coloc)\nlibrary(dplyr)\n\n# 1) 准备两个数据集：eQTL（暴露）与 GWAS（结局），必须是同一区域\neqtl <- readRDS(\"data/raw/eqtl_region.rds\")     # 含 snp / beta / se / maf / N\ngwas <- readRDS(\"data/raw/gwas_region.rds\")\n\n# 2) 对齐 SNP 并统一效应方向（coloc 只吃 p 值/beta，不自动对齐）\nm <- merge(eqtl, gwas, by = \"snp\", suffixes = c(\".e\", \".g\"))\nm$beta.g <- ifelse(m$ea.e == m$ea.g, m$beta.g, -m$beta.g)\n\n# 3) 构造 coloc 输入：type = \"quant\"（eQTL）/ \"cc\"（病例对照）\nd1 <- list(snp = m$snp, beta = m$beta.e, varbeta = m$se.e^2,\n           MAF = m$maf.e, N = m$N.e, type = \"quant\", sdY = 1)\nd2 <- list(snp = m$snp, beta = m$beta.g, varbeta = m$se.g^2,\n           MAF = m$maf.g, N = m$N.g, type = \"cc\",\n           s = m$ncase.g[1] / m$N.g[1])     # s = 病例比例\n\n# 4) 跑共定位\nres <- coloc.abf(d1, d2)\nprint(res$summary)          # PP.H0 ~ PP.H4\n\n# 5) 判读：PP.H4 > 0.8 支持共享因果变异；PP.H3 > 0.8 支持两个独立信号\nres$summary[\"PP.H4.abf\"]",
    "notes": [
      "PP.H4 高只说明“共享同一个因果变异”，不说明方向，因果方向还要靠 MR/Steiger。",
      "coloc 对区域范围很敏感，窗口取 500 kb 还是 1 Mb 会改变结果，方法里要写清楚。",
      "s 参数是病例比例，二分类性状必须给，否则模型完全错误。"
    ],
    "pitfalls": [
      "两个数据集的效应等位基因没有对齐，beta 符号相反，PP.H4 会被严重低估。",
      "输入里有重复 SNP 或 MAF = 0 的位点会让 coloc.abf 报错或给出 NaN。",
      "把整个基因组放进去跑 coloc 是错误用法，必须先按 LD 区域/基因窗口切分。"
    ],
    "next": [
      "mr-07",
      "mr-12",
      "mr-10"
    ]
  },
  {
    "id": "mr-12",
    "track": "mr",
    "trackName": "孟德尔随机化",
    "title": "SMR 与 HEIDI：基于 summary 数据的孟德尔随机化",
    "level": "少见",
    "tags": [
      "SMR",
      "HEIDI",
      "eQTL",
      "summary数据"
    ],
    "packages": [
      "data.table",
      "TwoSampleMR"
    ],
    "scene": "想用 eQTL 数据做“基因表达 → 疾病”的 SMR 分析，并给出 HEIDI 多效性检验。",
    "code": "# ============================================================\n# 12 SMR：命令行工具 + R 端整理输入输出\n# ============================================================\nlibrary(data.table)\n\n# SMR 是独立可执行程序（https://yanglab.westlake.edu.cn/software/smr/）\n# 1) 准备 .besd 格式 eQTL 数据（用 SMR 自带的 eQTLGen / GTEx 官方 besd 最省事）\n#    如果没有 besd，可用 --eqtl-summary 直接读文本\neqtl_besd <- \"data/ref/eQTLgen/eQTLgen.besd\"\neqtl_esi  <- \"data/ref/eQTLgen/eQTLgen.esi\"\n\n# 2) 把 GWAS summary 转成 SMR 需要的 .ma 格式（SNP A1 A2 freq b se p N）\ngwas <- fread(\"data/raw/gwas_summary.txt\")\nma <- gwas[, .(SNP, A1 = ea, A2 = nea, freq = eaf, b = beta, se = se, p = p, N = n)]\nfwrite(ma, \"results/smr/gwas.ma\", sep = \"\\t\")\n\n# 3) 调用 SMR（eQTL 文件路径、探针列表、输出前缀）\ncmd <- paste(\n  \"smr\",\n  \"--bfile data/ref/EUR\",                 # LD 参考\n  \"--gwas-summary results/smr/gwas.ma\",\n  \"--beqtl-summary\", eqtl_besd, eqtl_esi,\n  \"--out results/smr/smr_result\",\n  \"--thread-num 8\",\n  \"--peqtl-smr 5e-8\",\n  \"--cis-wind 2000\"                       # cis 窗口 2 Mb\n)\nsystem(cmd)\n\n# 4) 读结果：p_SMR 显著 + p_HEIDI > 0.05 才算“共定位支持”\nsmr <- fread(\"results/smr/smr_result.smr\")\nsig <- smr[p_SMR < 0.05 / nrow(smr) & p_HEIDI > 0.05]\nhead(sig[order(p_SMR)])\n\n# 5) 与 MR/coloc 交叉验证：三个方法都指向同一基因才算稳\nwrite.csv(sig, \"results/tables/smr_significant.csv\", row.names = FALSE)",
    "notes": [
      "p_HEIDI < 0.05 表示该位点可能存在多效性（两个性状由不同变异驱动），此时 SMR 结果不可信。",
      "--cis-wind 2000 表示探针上下游 2 Mb，窗口越大越容易纳入多效性位点，但要覆盖整个 LD 区间。",
      "SMR 的 p 值需要按探针数做 Bonferroni 校正（0.05 / nrow(smr)），直接用 0.05 会大量假阳性。"
    ],
    "pitfalls": [
      "LD 参考面板必须与 GWAS 人群匹配，欧洲样本用 EUR，混用会让 SMR 的 LD 校正完全失效。",
      "GWAS 的 .ma 文件里 N 必须是每 SNP 的样本量，全填同一个数在 meta 分析数据上会低估 SE。",
      "SMR 只在 cis 区域有效（顺式调控），拿 trans-eQTL 做 SMR 得到的结论没有意义。"
    ],
    "next": [
      "mr-11",
      "mr-07",
      "mr-05"
    ]
  },
  {
    "id": "drug-04",
    "track": "drug",
    "trackName": "药物重定位与分子对接数据",
    "title": "DGIdb 药物-靶点匹配：从基因列表找可成药靶点",
    "level": "常用",
    "tags": [
      "DGIdb",
      "药物重定位",
      "靶点",
      "可成药性"
    ],
    "packages": [
      "rDGIdb",
      "dplyr",
      "ggplot2"
    ],
    "scene": "做完差异分析得到 200 个基因，想知道其中哪些是已有药物的靶点，可以直接拿来做重定位。",
    "code": "# ============================================================\n# 04 DGIdb：基因 → 药物 → 证据来源\n# ============================================================\nlibrary(rDGIdb)\nlibrary(dplyr)\nlibrary(ggplot2)\n\ndeg <- read.csv(\"results/tables/DEG_tumor_vs_normal.csv\")\ngenes <- deg %>% filter(padj < 0.05, abs(logFC) > 1) %>% pull(gene) %>% unique()\ncat(\"查询基因数：\", length(genes), \"\\n\")\n\n# 1) 基础查询：返回 gene / drug / interaction type / source\nres <- queryDGIdb(genes)\nstr(res[[1]])\nhits <- res[[1]]\n\n# 2) 详细报告：把各类证据（ChEMBL、DrugBank、CIViC…）合并\ndetail <- detailedGeneDrugReport(genes)\nnames(detail)\n\n# 3) 统计：每个基因被多少种药物靶向（被靶向越多，越可能是“可成药 hub”）\ndrug_count <- hits %>%\n  distinct(gene, drug) %>%\n  count(gene, sort = TRUE)\nhead(drug_count, 20)\n\n# 4) 反向：找能同时靶向多个差异基因的药物（多靶点药物更可能是重定位候选）\nmulti_target <- hits %>%\n  distinct(gene, drug) %>%\n  count(drug, sort = TRUE) %>%\n  filter(n >= 3)\nhead(multi_target, 20)\n\n# 5) 出图\nggplot(head(drug_count, 20), aes(reorder(gene, n), n)) +\n  geom_col(fill = \"#2E86AB\") + coord_flip() +\n  labs(x = NULL, y = \"Number of targeting drugs\") + theme_bw()\n\nwrite.csv(hits, \"results/tables/dgidb_hits.csv\", row.names = FALSE)",
    "notes": [
      "DGIdb 的证据分“有实验支持”和“仅数据库推断”，做重定位时应优先看 ChEMBL / FDA 批准的证据。",
      "基因名要用 HGNC 官方 symbol，旧别名（如 HER2 应为 ERBB2）查不到结果。",
      "queryDGIdb 返回的是 list（每个基因一个 data.frame），直接当 data.frame 用会报错。"
    ],
    "pitfalls": [
      "rDGIdb 走 HTTP 请求 DGIdb 服务，网络不通或服务限流时会返回空表而不报错。",
      "同一药物在不同来源里的名字不一致（Aspirin / acetylsalicylic acid），统计多靶点药物前要统一命名。",
      "把 DGIdb 结果当成“药物一定有效”是过度解读，它只说明存在靶向关系记录。"
    ],
    "next": [
      "drug-05",
      "drug-08",
      "bulk-17"
    ]
  },
  {
    "id": "drug-05",
    "track": "drug",
    "trackName": "药物重定位与分子对接数据",
    "title": "CMap / LINCS 连接性打分：找能逆转疾病 signature 的药",
    "level": "进阶",
    "tags": [
      "CMap",
      "LINCS",
      "连接性得分",
      "药物重定位"
    ],
    "packages": [
      "data.table",
      "ggplot2",
      "dplyr"
    ],
    "scene": "有一份疾病 vs 正常的差异基因排序表，想按 Connectivity Map 的思路给候选药物打分，找“逆转”疾病的药。",
    "code": "# ============================================================\n# 05 连接性打分：加权 KS 统计量（CMap 原始算法）\n# ============================================================\nlibrary(data.table)\nlibrary(dplyr)\n\n# 输入 1：疾病 signature（按 logFC 降序，命名向量）\ndeg <- fread(\"results/tables/DEG_tumor_vs_normal.csv\")\ndeg <- deg[order(-logFC)]\nsig_up   <- head(deg[logFC > 0]$gene, 150)\nsig_down <- head(deg[logFC < 0]$gene, 150)\nquery <- c(sig_up, rev(sig_down))          # 上调在前、下调在后\n\n# 输入 2：药物扰动 signature（LINCS L1000 下载的 z 分数矩阵：基因 × 药物）\nlincs <- fread(\"data/raw/lincs_subset.tsv\")   # 第一列是 gene，其余是各药物扰动\nsetkey(lincs, gene)\n\n# 加权 KS：把 query 的基因映射到药物扰动排序上，看它们是否集中在两端\nconnectivity <- function(drug_vec, query, n_top = 150) {\n  o <- order(drug_vec, decreasing = TRUE)\n  rank_pos <- setNames(seq_along(o), names(drug_vec)[o])\n  hit <- rank_pos[query]\n  hit <- hit[!is.na(hit)]\n  N <- length(drug_vec); Nh <- length(hit)\n  if (Nh < 20) return(NA_real_)\n  # CMap 的权重：|r|^0.5，靠两端的基因权重更大\n  w <- abs(seq_len(N) - N / 2) ^ 0.5\n  es <- cumsum(ifelse(seq_len(N) %in% hit, w / sum(w[sort(hit)]), -1 / (N - Nh)))\n  es[which.max(abs(es))]\n}\n\nmat <- as.matrix(lincs[, -1]); rownames(mat) <- lincs$gene\nscores <- apply(mat, 2, connectivity, query = query)\nres <- data.frame(drug = names(scores), cs = scores) %>% arrange(cs)\nhead(res, 20)     # 负分表示“逆转”疾病 signature，是重定位候选\n\nwrite.csv(res, \"results/tables/cmap_scores.csv\", row.names = FALSE)",
    "notes": [
      "连接性得分为负表示该药物扰动与疾病 signature 方向相反（潜在治疗），为正表示同向（可能加重）。",
      "query 里上调基因放前面、下调放后面，方向搞反会让所有分数符号翻转。",
      "L1000 用的是 978 个 landmark 基因，先把表达数据投影到这些基因上再比较，才和 CMap 口径一致。"
    ],
    "pitfalls": [
      "直接用全部 2 万个基因算，会和 L1000 的 landmark 基因集不匹配，分数不可比。",
      "不同细胞系/不同扰动时间点的 signature 差异极大，混在一起算会得到互相矛盾的结果。",
      "KS 统计量对基因集大小敏感，必须固定 query 长度（如各 150 个），否则药物之间不可比。"
    ],
    "next": [
      "drug-04",
      "drug-08",
      "bulk-18"
    ]
  },
  {
    "id": "drug-06",
    "track": "drug",
    "trackName": "药物重定位与分子对接数据",
    "title": "对接前处理：PDB 结构清洗、去水去配体、加氢",
    "level": "常用",
    "tags": [
      "PDB",
      "结构清洗",
      "bio3d",
      "对接准备"
    ],
    "packages": [
      "bio3d",
      "dplyr"
    ],
    "scene": "从 PDB 下了一个含配体的晶体结构，直接拿去对接会报错：有水分子、有杂原子、有缺失残基。",
    "code": "# ============================================================\n# 06 受体准备：只留目标蛋白链，去水去配体，输出 PDB\n# ============================================================\nlibrary(bio3d)\n\npdb <- read.pdb(\"data/raw/dock/4ZZZ.pdb\")\npdb\n\n# 1) 看一眼结构里有什么：链、残基范围、是否含配体/水\nunique(pdb$atom$chain)\ntable(pdb$atom$resid %in% c(\"HOH\", \"WAT\"))\nhead(unique(pdb$atom$resid))\n\n# 2) 只保留蛋白原子（protein = 标准氨基酸），同时去掉水与杂原子\nsel_prot <- atom.select(pdb, \"protein\", verbose = FALSE)\nprot <- trim.pdb(pdb, sel_prot)\ncat(\"保留原子数：\", nrow(prot$atom), \"\\n\")\n\n# 3) 指定链（同源二聚体只留一条，否则口袋会被对称分子占住）\nsel_chain <- atom.select(prot, chain = \"A\", verbose = FALSE)\nprot <- trim.pdb(prot, sel_chain)\n\n# 4) 检查缺失残基（gap 会影响对接口袋形状）\ngaps <- check.integer(prot$atom$resno)          # 仅示意\nsummary(prot)\n\n# 5) 输出：对接软件通常要 PDBQT，先存 PDB 再用 MGLTools/OpenBabel 转换\nwrite.pdb(prot, \"results/dock/receptor_clean.pdb\")\n# 命令行：\n# prepare_receptor4.py -r receptor_clean.pdb -o receptor.pdbqt -A hydrogens\n# 或 obabel receptor_clean.pdb -O receptor.pdbqt -xr\n\n# 6) 定义对接盒子中心（用原配体或已知关键残基）\n# 原配体中心：\nlig <- atom.select(pdb, resname = \"STI\", verbose = FALSE)\nif (length(lig$atom) > 0) {\n  center <- colMeans(pdb$xyz[lig$xyz])\n  print(round(center, 2))\n}",
    "notes": [
      "只要蛋白原子时用 atom.select(pdb, 'protein')，它保留标准氨基酸，金属离子和辅因子会被一起去掉，需要的话单独加回来。",
      "多链蛋白要指定 chain，否则对接盒子中心可能落在界面而不是目标口袋。",
      "PDBQT 转换时会加氢并合并非极性氢，质子化状态（pH 7.4）最好用 PDBFixer 或 H++ 单独处理。"
    ],
    "pitfalls": [
      "缺失残基（REMARK 465）不会报错，但会让口袋出现空洞，导致对接打分虚高，需要同源建模补齐。",
      "用了含抑制剂的复合物却忘了去配体，对接结果会全部落在原配体位置，看起来“完美”其实是假的。",
      "Windows 下 bio3d 的 trim.pdb 对超大结构（> 10 万原子）会吃满内存，先 extract 单链再处理。"
    ],
    "next": [
      "drug-07",
      "drug-04",
      "drug-05"
    ]
  },
  {
    "id": "drug-07",
    "track": "drug",
    "trackName": "药物重定位与分子对接数据",
    "title": "AutoDock Vina 批量对接与结合能汇总",
    "level": "进阶",
    "tags": [
      "分子对接",
      "Vina",
      "结合能",
      "批量"
    ],
    "packages": [
      "dplyr",
      "ggplot2",
      "stringr"
    ],
    "scene": "手上有 50 个小分子要对接同一个靶点，一个个开图形界面不现实，需要命令行批量跑并整理结果。",
    "code": "# ============================================================\n# 07 Vina 批量对接：写配置 → 循环调用 → 解析结合能\n# ============================================================\nlibrary(dplyr)\nlibrary(ggplot2)\nlibrary(stringr)\n\nreceptor  <- \"results/dock/receptor.pdbqt\"\nlig_dir   <- \"data/raw/dock/ligands_pdbqt\"\nout_dir   <- \"results/dock/vina_out\"\ndir.create(out_dir, showWarnings = FALSE, recursive = TRUE)\n\n# 1) 盒子参数：由原配体中心 ± 22 Å 得到（比口袋略大，避免切掉结合位点）\ncenter <- c(12.4, -3.8, 21.6)\nsize   <- c(22, 22, 22)\n\nligands <- list.files(lig_dir, pattern = \"\\\\.pdbqt$\", full.names = TRUE)\ncat(\"待对接分子：\", length(ligands), \"\\n\")\n\n# 2) 逐个跑（exhaustiveness 8 是常规精度，24 更准但慢 3 倍）\nfor (lg in ligands) {\n  name <- tools::file_path_sans_ext(basename(lg))\n  cfg <- file.path(out_dir, paste0(name, \".txt\"))\n  writeLines(c(\n    paste(\"receptor =\", receptor),\n    paste(\"ligand =\", lg),\n    paste(\"center_x =\", center[1]), paste(\"center_y =\", center[2]),\n    paste(\"center_z =\", center[3]),\n    paste(\"size_x =\", size[1]), paste(\"size_y =\", size[2]), paste(\"size_z =\", size[3]),\n    \"exhaustiveness = 8\", \"num_modes = 9\", \"energy_range = 4\",\n    paste(\"out =\", file.path(out_dir, paste0(name, \"_out.pdbqt\")))\n  ), cfg)\n  system2(\"vina\", args = c(\"--config\", shQuote(cfg), \"--cpu\", \"8\"),\n          stdout = file.path(out_dir, paste0(name, \".log\")),\n          stderr = file.path(out_dir, paste0(name, \".err\")))\n}\n\n# 3) 解析结果：log 里 \"REMARK VINA RESULT:  -8.7  0.000  0.000\"\nlogs <- list.files(out_dir, pattern = \"\\\\.log$\", full.names = TRUE)\naffinity <- lapply(logs, function(f) {\n  lines <- readLines(f, warn = FALSE)\n  hit <- grep(\"VINA RESULT\", lines, value = TRUE)\n  if (length(hit) == 0) return(NULL)\n  v <- as.numeric(str_extract(hit[1], \"-?\\\\d+\\\\.\\\\d+\"))\n  data.frame(molecule = tools::file_path_sans_ext(basename(f)),\n             affinity = v, n_modes = length(hit))\n}) %>% bind_rows() %>% arrange(affinity)\n\nhead(affinity, 15)\nwrite.csv(affinity, \"results/tables/vina_affinity.csv\", row.names = FALSE)\n\nggplot(head(affinity, 20), aes(reorder(molecule, affinity), affinity)) +\n  geom_col(fill = \"#2E86AB\") + coord_flip() + theme_bw() +\n  labs(x = NULL, y = \"Binding energy (kcal/mol)\")",
    "notes": [
      "结合能只是打分函数，-9 kcal/mol 不代表真的强结合，必须配合分子动力学或实验验证。",
      "exhaustiveness 太低（< 8）会陷入局部最优，重复跑得到不同构象说明采样不足。",
      "盒子中心要覆盖整个口袋，盒子太小会把配体挤到边缘，得到虚高的结合能。"
    ],
    "pitfalls": [
      "Windows 下 system2('vina', ...) 需要 vina.exe 在 PATH 里，否则报 'vina not found'。",
      "配体 pdbqt 的准备（加氢、定义可旋转键）要用 prepare_ligand4.py，直接用 OpenBabel 转的 pdbqt 常缺少 torsion 信息。",
      "同一个配体重复对接得到不同结果时，要取多次运行的均值或最优值并说明策略，不能只挑最好的报。"
    ],
    "next": [
      "drug-06",
      "drug-08",
      "drug-04"
    ]
  },
  {
    "id": "drug-08",
    "track": "drug",
    "trackName": "药物重定位与分子对接数据",
    "title": "ADMET 与类药性筛选：Lipinski / Veber 快速过滤",
    "level": "常用",
    "tags": [
      "ADMET",
      "类药性",
      "Lipinski",
      "rcdk"
    ],
    "packages": [
      "rcdk",
      "dplyr",
      "ggplot2"
    ],
    "scene": "对接出 30 个候选分子，老板问哪些口服吸收可能还行、哪些一看就是“假药”，需要先做一轮类药性筛。",
    "code": "# ============================================================\n# 08 类药性：从 SMILES 算描述符，套 Lipinski / Veber 规则\n# ============================================================\nlibrary(rcdk)\nlibrary(dplyr)\nlibrary(ggplot2)\n\nsmiles <- read.csv(\"data/raw/candidates.csv\")     # 至少两列：name, smiles\nmols <- parse.smiles(smiles$smiles)\nbad <- which(vapply(mols, is.null, logical(1)))\nif (length(bad) > 0) message(\"无法解析的 SMILES：\", paste(smiles$name[bad], collapse = \", \"))\n\n# 1) 常用描述符（MW / logP / HBD / HBA / TPSA / 可旋转键）\ndesc_names <- c(\"org.openscience.cdk.qsar.descriptors.molecular.MolecularWeightDescriptor\",\n                \"org.openscience.cdk.qsar.descriptors.molecular.XLogPDescriptor\",\n                \"org.openscience.cdk.qsar.descriptors.molecular.HBondDonorCountDescriptor\",\n                \"org.openscience.cdk.qsar.descriptors.molecular.HBondAcceptorCountDescriptor\",\n                \"org.openscience.cdk.qsar.descriptors.molecular.TPSADescriptor\",\n                \"org.openscience.cdk.qsar.descriptors.molecular.RotatableBondsCountDescriptor\")\ndesc <- eval.desc(mols, desc_names)\ncolnames(desc) <- c(\"MW\", \"logP\", \"HBD\", \"HBA\", \"TPSA\", \"RotB\")\ndf <- cbind(smiles[, \"name\", drop = FALSE], desc)\n\n# 2) 规则：Lipinski 五规则 + Veber（可旋转键 ≤ 10、TPSA ≤ 140）\ndf <- df %>%\n  mutate(\n    lipinski_violation = (MW > 500) + (logP > 5) + (HBD > 5) + (HBA > 10),\n    veber_pass = RotB <= 10 & TPSA <= 140,\n    drug_like  = lipinski_violation <= 1 & veber_pass\n  ) %>%\n  arrange(lipinski_violation, MW)\nprint(df)\n\n# 3) 可视化：MW vs logP，颜色标出通过的分子\nggplot(df, aes(MW, logP, color = drug_like)) +\n  geom_point(size = 3) +\n  geom_vline(xintercept = 500, linetype = \"dashed\") +\n  geom_hline(yintercept = 5, linetype = \"dashed\") +\n  scale_color_manual(values = c(`TRUE` = \"#2E86AB\", `FALSE` = \"grey60\")) +\n  theme_bw() + labs(color = \"Drug-like\")\n\nwrite.csv(df, \"results/tables/admet_lipinski.csv\", row.names = FALSE)",
    "notes": [
      "Lipinski 五规则是粗筛，通过不代表能成药，失败也不代表一定不行（很多抗生素就违规）。",
      "XLogP 与实验 logP 有系统偏差，跨分子比较时只看相对趋势。",
      "TPSA > 140 主要影响血脑屏障穿透，做中枢神经药物时才需要严格卡这条。"
    ],
    "pitfalls": [
      "rcdk 依赖 Java，Windows 上必须先 rJava::.jinit() 且 R 位数与 Java 位数一致，否则加载即失败。",
      "parse.smiles 遇到带立体化学或盐形式的 SMILES 可能返回 NULL，要先脱盐（去 .HCl 之类）。",
      "eval.desc 的列顺序按 desc_names 顺序返回，写死 colnames 时要确认版本没变，否则列会错位。"
    ],
    "next": [
      "drug-07",
      "drug-05",
      "drug-04"
    ]
  },
  {
    "id": "ml-06",
    "track": "ml",
    "trackName": "机器学习与生存建模",
    "title": "LASSO-Cox 构建预后模型：从 5000 个基因到 10 个特征",
    "level": "常用",
    "tags": [
      "LASSO",
      "Cox",
      "预后模型",
      "glmnet"
    ],
    "packages": [
      "glmnet",
      "survival",
      "survminer",
      "dplyr"
    ],
    "scene": "有一份带随访的表达矩阵，想做“多基因预后 signature”，并用风险评分分高低危画 KM 曲线。",
    "code": "# ============================================================\n# 06 LASSO-Cox：降维 + 变量选择 + 风险评分\n# ============================================================\nlibrary(glmnet)\nlibrary(survival)\nlibrary(survminer)\nlibrary(dplyr)\n\nexpr <- readRDS(\"data/processed/expr_log2_tpm.rds\")\ncli  <- readRDS(\"data/processed/clinical.rds\")\ncli  <- cli[!is.na(cli$OS_time) & cli$OS_time > 0, ]\n\n# 1) 矩阵方向：glmnet 要 样本 × 特征\nx <- t(expr[, cli$sample])\nx <- x[, apply(x, 2, sd) > 0]              # 去掉零方差基因\ny <- Surv(cli$OS_time, cli$OS_status)\n\n# 2) 单因素预筛（可选，能显著加速且降低过拟合；但会引入选择偏倚，须在交叉验证内做才严谨）\nuni <- apply(x, 2, function(g) summary(coxph(y ~ g))$coefficients[5])\nx <- x[, which(p.adjust(uni, \"BH\") < 0.05)]\n\n# 3) 10 折交叉验证选 lambda\nset.seed(20240101)\ncvfit <- cv.glmnet(x, y, family = \"cox\", alpha = 1, nfolds = 10,\n                   type.measure = \"C\", standardize = TRUE)\nplot(cvfit)\ncoef_mat <- coef(cvfit, s = \"lambda.min\")\nsel <- rownames(coef_mat)[as.numeric(coef_mat) != 0]\ncat(\"入选基因数：\", length(sel), \"\\n\"); sel\n\n# 4) 风险评分与分组\nrisk <- as.numeric(predict(cvfit, newx = x, s = \"lambda.min\", type = \"link\"))\ndf <- data.frame(sample = rownames(x), risk = risk, time = y[, 1], status = y[, 2])\ndf$group <- ifelse(df$risk > median(df$risk), \"High\", \"Low\")\n\n# 5) 验证：KM + Cox + C-index\nfit <- survfit(Surv(time, status) ~ group, data = df)\nggsurvplot(fit, data = df, pval = TRUE, risk.table = TRUE, palette = c(\"#2E86AB\", \"#D1495B\"))\ncoxph(Surv(time, status) ~ risk, data = df) %>% summary()\ncoxph(Surv(time, status) ~ group, data = df) %>% summary()\nsaveRDS(list(model = cvfit, genes = sel, score = df), \"results/tables/lasso_cox.rds\")",
    "notes": [
      "type.measure = 'C' 表示用 C-index 选 lambda，生存模型必须用它而不是默认的 deviance。",
      "单因素预筛如果在外层数据上做，会造成“选择偏倚导致 C-index 虚高”，严谨做法是放进交叉验证内部。",
      "风险评分是线性预测子（link），不是概率，跨数据集比较要重新标准化。"
    ],
    "pitfalls": [
      "x 里有 NA 会让 cv.glmnet 直接报错，先做缺失值处理（基因层面通常没有 NA，样本层面要查）。",
      "lambda.min 会选更多变量，lambda.1se 更简约；论文里要写清用的是哪个，不能两个都试完挑好看的。",
      "在训练集上算 C-index 再当验证结果报告，是最常见的自欺行为，必须用独立验证集或交叉验证估计。"
    ],
    "next": [
      "ml-09",
      "ml-12",
      "stats-06"
    ]
  },
  {
    "id": "ml-07",
    "track": "ml",
    "trackName": "机器学习与生存建模",
    "title": "随机森林特征筛选：非线性关系的变量重要性",
    "level": "常用",
    "tags": [
      "随机森林",
      "特征筛选",
      "randomForestSRC",
      "VIMP"
    ],
    "packages": [
      "randomForestSRC",
      "survival",
      "ggplot2"
    ],
    "scene": "基因和结局可能是非线性关系，LASSO 只挑线性项，想用随机森林补充一轮特征重要性排序。",
    "code": "# ============================================================\n# 07 randomForestSRC：生存随机森林 + 变量重要性\n# ============================================================\nlibrary(randomForestSRC)\nlibrary(survival)\nlibrary(ggplot2)\n\nexpr <- readRDS(\"data/processed/expr_log2_tpm.rds\")\ncli  <- readRDS(\"data/processed/clinical.rds\")\ngenes <- readRDS(\"results/tables/lasso_cox.rds\")$genes   # 也可用全部高变基因\n\nd <- data.frame(time = cli$OS_time, status = cli$OS_status,\n                t(expr[genes, cli$sample]))\nd <- d[complete.cases(d) & d$time > 0, ]\n\n# 1) 先 tune：mtry 与 nodesize 对生存森林影响很大\nset.seed(1)\ntuned <- tune(Surv(time, status) ~ ., data = d,\n              mtryStart = floor(sqrt(ncol(d) - 2)),\n              nodesizeTry = c(5, 10, 15, 20), ntreeTry = 300, nsplit = 5)\ntuned$optimal\n\n# 2) 正式建模\nset.seed(1)\nrf <- rfsrc(Surv(time, status) ~ ., data = d,\n            ntree = 1000, mtry = tuned$optimal[\"mtry\"],\n            nodesize = tuned$optimal[\"nodesize\"],\n            importance = TRUE, proximity = TRUE)\nprint(rf)\n\n# 3) 变量重要性：VIMP > 0 才算有贡献，负值说明是噪声\nvimp <- rf$importance\nvimp <- data.frame(gene = rownames(vimp), vimp = vimp[, 1]) %>% arrange(desc(vimp))\nhead(vimp, 20)\n\nggplot(head(vimp, 20), aes(reorder(gene, vimp), vimp)) +\n  geom_col(fill = \"#2E86AB\") + coord_flip() + theme_bw() +\n  labs(x = NULL, y = \"Variable importance (VIMP)\")\n\n# 4) 最小深度法：按 VIMP 标准误做逐步剔除\nvs <- var.select(rf, conservative = \"medium\")\nhead(vs$topvars, 20)\nwrite.csv(vimp, \"results/tables/rf_vimp.csv\", row.names = FALSE)",
    "notes": [
      "VIMP 是在 OOB 数据上算的，负值意味着打乱该变量后预测反而更好，说明它是噪声。",
      "tune 出的 mtry 与 nodesize 要一起用，只调一个等于没调。",
      "随机森林对特征共线性不敏感但会稀释重要性：两个高度相关的基因会各自只拿到一半的 VIMP。"
    ],
    "pitfalls": [
      "用全部 2 万个基因跑 rfsrc 会极慢且内存爆掉，先做方差/表达过滤或用单因素预筛。",
      "proximity = TRUE 在样本 > 5000 时会生成巨大的距离矩阵，非必要不要开。",
      "rfsrc 的随机性来自 bootstrap，不设种子每次结果都不同，论文里要写种子和 ntree。"
    ],
    "next": [
      "ml-06",
      "ml-08",
      "ml-11"
    ]
  },
  {
    "id": "ml-08",
    "track": "ml",
    "trackName": "机器学习与生存建模",
    "title": "SVM-RFE 递归特征消除",
    "level": "进阶",
    "tags": [
      "SVM-RFE",
      "特征选择",
      "caret",
      "递归消除"
    ],
    "packages": [
      "caret",
      "e1071",
      "kernlab",
      "ggplot2"
    ],
    "scene": "想用第三种方法（SVM-RFE）和 LASSO、随机森林取交集，得到更稳的特征集。",
    "code": "# ============================================================\n# 08 SVM-RFE：每次剔除权重最小的特征，递归到目标维度\n# ============================================================\nlibrary(caret)\nlibrary(kernlab)\nlibrary(ggplot2)\n\nexpr <- readRDS(\"data/processed/expr_log2_tpm.rds\")\ncli  <- readRDS(\"data/processed/clinical.rds\")\ngenes <- readRDS(\"results/tables/rf_vimp.csv\")$gene[1:200]     # 控制候选规模\n\nx <- t(expr[genes, cli$sample])\ny <- factor(ifelse(cli$OS_status == 1, \"dead\", \"alive\"))\n\n# 1) 控制参数：5 折 CV，重复 3 次降低随机性\nset.seed(20240101)\nctrl <- rfeControl(functions = caretFuncs, method = \"cv\",\n                   number = 5, repeats = 3, verbose = FALSE)\n\n# 2) 递归消除：sizes 是要评估的特征子集大小\nrfe_fit <- rfe(x, y, sizes = c(5, 10, 15, 20, 30, 50),\n               rfeControl = ctrl, method = \"svmRadial\",\n               tuneLength = 3, metric = \"ROC\")\nprint(rfe_fit)\nrfe_fit$optVariables\n\n# 3) 看不同特征数下的性能曲线\nplot(rfe_fit, type = c(\"g\", \"o\"), metric = \"ROC\")\n\n# 4) 三种方法取交集，得到最终候选基因\nlasso_genes <- readRDS(\"results/tables/lasso_cox.rds\")$genes\nrf_genes    <- readRDS(\"results/tables/rf_vimp.csv\")$gene[1:30]\nfinal <- Reduce(intersect, list(lasso_genes, rf_genes, rfe_fit$optVariables))\ncat(\"三法交集：\", length(final), \"\\n\"); final\nwrite.csv(data.frame(gene = final), \"results/tables/feature_intersection.csv\", row.names = FALSE)",
    "notes": [
      "SVM-RFE 是包装法，计算量与特征数成正比，2 万个基因直接跑要几天，必须先粗筛到几百个。",
      "这里把生存结局二分类化了，会丢掉随访时间信息；严谨做法是自定义 surv 的 rfe 函数或用 penalizedSVM。",
      "三法交集不一定更好：如果三种方法原理相似，交集只是更保守，不代表更准。"
    ],
    "pitfalls": [
      "caret 的 svmRadial 内部会做标准化，但如果输入里有零方差列仍会报错，提前过滤。",
      "rfe 的 sizes 必须从小到大排列且不能超过特征数，否则报 'sizes must be unique'。",
      "用整个数据集做 RFE 再交叉验证评估，属于典型的特征选择泄漏，性能会被高估。"
    ],
    "next": [
      "ml-11",
      "ml-06",
      "ml-07"
    ]
  },
  {
    "id": "ml-09",
    "track": "ml",
    "trackName": "机器学习与生存建模",
    "title": "ROC 与 timeROC：多指标 AUC 比较",
    "level": "常用",
    "tags": [
      "ROC",
      "AUC",
      "timeROC",
      "C-index"
    ],
    "packages": [
      "pROC",
      "timeROC",
      "survival",
      "ggplot2"
    ],
    "scene": "模型建好了，要报告 1 年/3 年/5 年的 AUC，并和临床指标（分期、年龄）比较谁更准。",
    "code": "# ============================================================\n# 09 ROC：二分类用 pROC，生存数据用 timeROC\n# ============================================================\nlibrary(pROC)\nlibrary(timeROC)\nlibrary(survival)\nlibrary(ggplot2)\n\ndf <- readRDS(\"results/tables/lasso_cox.rds\")$score\ncli <- readRDS(\"data/processed/clinical.rds\")\ndf <- merge(df, cli[, c(\"sample\", \"age\", \"stage\")], by = \"sample\")\n\n# ---- 1) 二分类：status 的普通 ROC ----\nr1 <- roc(df$status, df$risk, levels = c(0, 1), direction = \"<\", quiet = TRUE)\nr2 <- roc(df$status, df$age,  levels = c(0, 1), direction = \"<\", quiet = TRUE)\nauc(r1); ci.auc(r1)\n# 两条 ROC 比较（DeLong 检验）\nroc.test(r1, r2)\n\n# ---- 2) 生存数据：时间依赖 AUC ----\ntr <- timeROC(T = df$time, delta = df$status, marker = df$risk,\n              cause = 1, times = c(12, 36, 60), iid = TRUE)\ntr$AUC\nconfint(tr)$CI_AUC            # 各时间点的 95%CI\n\n# 画时间依赖 ROC 曲线\nplot(tr, time = 36, col = \"#D1495B\", title = \"Time-dependent ROC at 36 months\")\n\n# ---- 3) 多指标多时间点对比：条形图 ----\nres <- data.frame(\n  time = rep(c(12, 36, 60), each = 2),\n  model = rep(c(\"Risk score\", \"Age\"), times = 3),\n  auc = c(tr$AUC, timeROC(df$time, df$status, df$age, cause = 1,\n                          times = c(12, 36, 60))$AUC)\n)\nggplot(res, aes(factor(time), auc, fill = model)) +\n  geom_col(position = \"dodge\") + ylim(0, 1) + theme_bw() +\n  labs(x = \"Months\", y = \"Time-dependent AUC\", fill = NULL)",
    "notes": [
      "direction 参数必须显式指定，否则 pROC 会自动选方向，可能把 AUC 算成 1 - 真值。",
      "timeROC 的 cause = 1 表示事件是 1，竞争风险数据里其余事件类型会被正确删失。",
      "AUC 高不代表临床有用，还要看校准（校准曲线）和净收益（DCA）。"
    ],
    "pitfalls": [
      "用 Cox 的线性预测子当 marker 时，AUC 与 C-index 概念不同，不能直接等同或互相换算。",
      "在训练集上算 AUC 一定偏高，验证集才是真实性能，论文里两个都要报并标明。",
      "timeROC 的 iid = TRUE 才能算置信区间，样本量大时会很慢（O(n²)），可先抽样估计。"
    ],
    "next": [
      "ml-10",
      "ml-06",
      "stats-06"
    ]
  },
  {
    "id": "ml-10",
    "track": "ml",
    "trackName": "机器学习与生存建模",
    "title": "校准曲线与决策曲线（DCA）",
    "level": "进阶",
    "tags": [
      "校准曲线",
      "DCA",
      "净收益",
      "rms"
    ],
    "packages": [
      "rms",
      "dcurves",
      "survival",
      "ggplot2"
    ],
    "scene": "审稿人问：模型预测的 3 年生存率和实际差多少？临床上用这个模型做决策到底划不划算？",
    "code": "# ============================================================\n# 10 校准 + DCA：预测准不准、用起来值不值\n# ============================================================\nlibrary(rms)\nlibrary(dcurves)\nlibrary(survival)\n\ndf <- readRDS(\"results/tables/lasso_cox.rds\")$score\ndf <- df[, c(\"time\", \"status\", \"risk\")]\n\n# rms 需要 datadist 环境\ndd <- datadist(df); options(datadist = \"dd\")\n\n# 1) Cox 模型（cph 支持校准与列线图）\nfit <- cph(Surv(time, status) ~ risk, data = df, x = TRUE, y = TRUE, surv = TRUE)\n\n# 2) 校准曲线：预测 36 个月生存率 vs 实际（bootstrap 校正）\ncal <- calibrate(fit, cmethod = \"KM\", method = \"boot\",\n                 u = 36, m = 100, B = 500)\nplot(cal, xlab = \"Nomogram-predicted 36-month survival\",\n     ylab = \"Observed survival\", subtitles = FALSE)\nabline(0, 1, lty = 2, col = \"grey40\")\n\n# 3) 决策曲线：不同阈值概率下的净收益\ndca_res <- dca(Surv(time, status) ~ risk, data = df, time = 36,\n               thresholds = seq(0.05, 0.8, by = 0.01))\nas.data.frame(dca_res) %>% head()\nplot(dca_res) + theme_bw()\n\n# 4) 与“全治/全不治”对比：曲线高于两条参考线才有临床价值\n#    All：所有人都按高危处理；None：没人处理",
    "notes": [
      "校准曲线的 m（每组样本数）要保证每组有足够事件，通常 100~200；样本少时用 m = 50。",
      "B = 500 次 bootstrap 是精度与耗时的折中，最终发表建议 B ≥ 1000。",
      "DCA 的净收益与患病率强相关，不同人群的阈值区间不能直接套用。"
    ],
    "pitfalls": [
      "options(datadist = 'dd') 忘记设置时 cph 会报 'datadist not set'，且必须在建模前设置。",
      "校准曲线用的 u 必须与你要报告的随访时间点一致，画 36 个月却说预测 5 年是最常见的错。",
      "DCA 在事件数很少（< 50）时曲线剧烈震荡，此时的净收益不可解释。"
    ],
    "next": [
      "ml-09",
      "ml-12",
      "stats-06"
    ]
  },
  {
    "id": "ml-11",
    "track": "ml",
    "trackName": "机器学习与生存建模",
    "title": "嵌套交叉验证：避免特征选择泄漏导致的虚高",
    "level": "进阶",
    "tags": [
      "嵌套交叉验证",
      "数据泄漏",
      "过拟合",
      "nested CV"
    ],
    "packages": [
      "glmnet",
      "survival",
      "dplyr"
    ],
    "scene": "自己算出来 C-index 0.85，换个数据集只剩 0.6，怀疑是特征选择时把验证集信息泄漏了。",
    "code": "# ============================================================\n# 11 嵌套 CV：外层评估、内层调参，所有选择都在训练折内完成\n# ============================================================\nlibrary(glmnet)\nlibrary(survival)\nlibrary(dplyr)\n\nexpr <- readRDS(\"data/processed/expr_log2_tpm.rds\")\ncli  <- readRDS(\"data/processed/clinical.rds\")\nx <- t(expr[, cli$sample]); y <- Surv(cli$OS_time, cli$OS_status)\n\nset.seed(20240101)\nK <- 5\nfolds <- sample(rep(1:K, length.out = nrow(x)))\ncindex <- function(risk, y, idx) {\n  survConcordance(y[idx, 1] ~ risk[idx])$concordance\n}\n\nouter_c <- numeric(K)\nfor (k in 1:K) {\n  tr <- which(folds != k); te <- which(folds == k)\n\n  # ---- 内层：只用训练折做 CV 选 lambda（含标准化）----\n  inner <- cv.glmnet(x[tr, ], y[tr, ], family = \"cox\", alpha = 1,\n                     nfolds = 5, type.measure = \"C\")\n\n  # ---- 外层：用内层选出的模型在测试折上评估 ----\n  risk_te <- as.numeric(predict(inner, newx = x[te, ], s = \"lambda.min\", type = \"link\"))\n  outer_c[k] <- cindex(risk_te, y, te)\n}\ncat(\"嵌套 CV 的 C-index：\", round(mean(outer_c), 3),\n    \"±\", round(sd(outer_c), 3), \"\\n\")\n\n# ---- 反例：先在全数据上挑基因，再普通 CV —— 会明显高估 ----\nuni <- apply(x, 2, function(g) summary(coxph(y ~ g))$coefficients[5])\nx_sel <- x[, which(p.adjust(uni, \"BH\") < 0.05)]\nleak <- sapply(1:K, function(k) {\n  tr <- which(folds != k); te <- which(folds == k)\n  m <- cv.glmnet(x_sel[tr, ], y[tr, ], family = \"cox\", nfolds = 5, type.measure = \"C\")\n  cindex(as.numeric(predict(m, newx = x_sel[te, ], s = \"lambda.min\", type = \"link\")), y, te)\n})\ncat(\"泄漏版 C-index：\", round(mean(leak), 3), \"\\n\")",
    "notes": [
      "嵌套 CV 的核心：任何用到结局变量的操作（差异筛选、标准化、调参）都必须只在外层训练折里做。",
      "外层 5 折 × 内层 5 折 = 25 次建模，耗时是普通 CV 的数倍，特征多时要预留时间。",
      "两次结果的差值就是“选择偏倚”的大小，通常 0.05~0.15，差得越多说明泄漏越严重。"
    ],
    "pitfalls": [
      "用 scale() 对全数据标准化再 CV，也是泄漏（测试折的均值方差进了训练），应该在每折内重新算。",
      "反复换随机种子直到 C-index 好看，等价于在测试集上过拟合，必须固定种子并报告所有结果。",
      "样本量 < 100 时 5 折 CV 的每折验证集太小，C-index 方差极大，建议重复 10 次取平均。"
    ],
    "next": [
      "ml-06",
      "ml-09",
      "stats-04"
    ]
  },
  {
    "id": "ml-12",
    "track": "ml",
    "trackName": "机器学习与生存建模",
    "title": "列线图 Nomogram：把 Cox 模型变成临床评分卡",
    "level": "常用",
    "tags": [
      "列线图",
      "nomogram",
      "rms",
      "临床预测"
    ],
    "packages": [
      "rms",
      "regplot",
      "survival",
      "ggplot2"
    ],
    "scene": "要把年龄、分期、风险评分整合成一张“打分卡”，让临床医生能手工估算 1 年/3 年生存率。",
    "code": "# ============================================================\n# 12 Nomogram：cph → nomogram → 出图 + C-index + 校准\n# ============================================================\nlibrary(rms)\nlibrary(survival)\n\nscore <- readRDS(\"results/tables/lasso_cox.rds\")$score\ncli   <- readRDS(\"data/processed/clinical.rds\")\ndf <- merge(score[, c(\"sample\", \"risk\")], cli[, c(\"sample\", \"age\", \"stage\", \"OS_time\", \"OS_status\")],\n            by = \"sample\")\ndf <- df[complete.cases(df) & df$OS_time > 0, ]\ndf$stage <- factor(df$stage)\n\ndd <- datadist(df); options(datadist = \"dd\")\n\n# 1) 多因素 Cox（cph 才能配 nomogram）\nfit <- cph(Surv(OS_time, OS_status) ~ age + stage + risk,\n           data = df, x = TRUE, y = TRUE, surv = TRUE)\nanova(fit)\n# 区分度与校准\nrcorr.cens(predict(fit), Surv(df$OS_time, df$OS_status))\n\n# 2) 列线图：fun 里放各时间点的生存函数\nsurv_fun <- Survival(fit)\nnom <- nomogram(fit,\n                fun = list(function(x) surv_fun(12, x),\n                           function(x) surv_fun(36, x),\n                           function(x) surv_fun(60, x)),\n                funlabel = c(\"1-year OS\", \"3-year OS\", \"5-year OS\"),\n                lp = FALSE, fun.at = c(0.9, 0.8, 0.6, 0.4, 0.2, 0.1))\nplot(nom, xfrac = 0.35, cex.axis = 0.8)\n\n# 3) 更现代的美化版（regplot 包，支持 ggplot 风格）\n# regplot::regplot(fit, plots = c(\"density\", \"boxes\"), observation = TRUE)\n\n# 4) 直接把模型变成可查询的预测表（便于嵌进 Excel 或网页）\nnd <- expand.grid(age = c(50, 65, 80),\n                  stage = levels(df$stage),\n                  risk = quantile(df$risk, c(0.25, 0.75)))\nsp <- survest(fit, newdata = nd, times = c(12, 36, 60))\nout <- cbind(nd, round(sp$surv, 3))\ncolnames(out)[4:6] <- c(\"OS_1y\", \"OS_3y\", \"OS_5y\")\nprint(head(out, 10))\nwrite.csv(out, \"results/tables/nomogram_predict_table.csv\", row.names = FALSE)",
    "notes": [
      "nomogram 的每个变量取值范围来自训练数据，超出范围外推（比如 90 岁）不可靠。",
      "fun.at 决定横轴上标哪些生存概率刻度，刻度太少不好读、太多会重叠。",
      "列线图的可视化效果依赖变量个数，超过 6 个变量会挤成一团，应先做变量精简。"
    ],
    "pitfalls": [
      "cph 必须 x = TRUE, y = TRUE, surv = TRUE，缺一个 nomogram 或 calibrate 就会报错。",
      "分类变量要在 datadist 之前转成 factor 并设好参照水平，否则列线图上会出现“stage=1.5”这种荒谬刻度。",
      "nomogram 只能用于 Cox 或 logistic 模型，直接套 randomForest / xgboost 是不合法的。"
    ],
    "next": [
      "ml-10",
      "ml-06",
      "report-02"
    ]
  },
  {
    "id": "viz-06",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "统一主题与中文字体：一套代码管住所有图",
    "level": "常用",
    "tags": [
      "ggplot2",
      "主题",
      "中文字体",
      "ggsci"
    ],
    "packages": [
      "ggplot2",
      "ggsci",
      "showtext",
      "sysfonts"
    ],
    "scene": "每张图字体、字号、配色都不一样，拼在一起像从不同论文里抠出来的；中文还经常显示成方框。",
    "code": "# ============================================================\n# 06 统一主题：字体、配色、导出尺寸一次定好\n# ============================================================\nlibrary(ggplot2)\nlibrary(ggsci)\nlibrary(showtext)\nlibrary(sysfonts)\n\n# 1) 中文字体：Windows 自带微软雅黑/黑体；Mac 用 PingFang SC\nfont_add(\"cn\", regular = \"C:/Windows/Fonts/msyh.ttc\")\nshowtext_auto()          # 让 PDF/PNG 设备也能正确渲染中文\n\n# 2) 项目统一主题（所有图都用它）\ntheme_sx <- function(base_size = 12, base_family = \"cn\") {\n  theme_bw(base_size = base_size, base_family = base_family) +\n    theme(\n      panel.grid.minor = element_blank(),\n      panel.grid.major = element_line(linewidth = 0.25, colour = \"grey90\"),\n      panel.border     = element_rect(linewidth = 0.6, colour = \"grey30\"),\n      axis.text        = element_text(colour = \"grey20\"),\n      axis.title       = element_text(face = \"bold\"),\n      plot.title       = element_text(face = \"bold\", hjust = 0),\n      plot.subtitle    = element_text(colour = \"grey40\"),\n      legend.key       = element_blank(),\n      legend.background = element_blank(),\n      strip.background = element_rect(fill = \"grey95\", colour = NA)\n    )\n}\ntheme_set(theme_sx())\n\n# 3) 统一配色：期刊常用的 NPG / Lancet 调色板\nmy_col <- ggsci::pal_npg()(5)\nmy_col\nscale_fill_sx  <- function(...) scale_fill_manual(values = my_col, ...)\nscale_color_sx <- function(...) scale_color_manual(values = my_col, ...)\n\np <- ggplot(iris, aes(Sepal.Length, Sepal.Width, color = Species)) +\n  geom_point(size = 1.5, alpha = 0.8) +\n  scale_color_sx() +\n  labs(title = \"统一主题示例\", subtitle = \"字体、配色、网格全部由主题控制\")\np\n\n# 4) 导出规范：宽度一律 85 mm（单栏）/ 170 mm（双栏），300 dpi\nggsave(\"results/figures/demo.pdf\", p, width = 85, height = 70, units = \"mm\")\nggsave(\"results/figures/demo.png\", p, width = 85, height = 70, units = \"mm\", dpi = 300)",
    "notes": [
      "showtext_auto() 之后 PDF 里的文字是矢量路径还是字体取决于设备，投稿要确认期刊接受哪种（多数要求字体可嵌入）。",
      "theme_set() 只影响之后新建的图，已经画好的对象不会变。",
      "ggsave 的尺寸用 mm 而不是默认英寸，能直接对上期刊的单栏 85 mm / 双栏 170 mm 规范。"
    ],
    "pitfalls": [
      "Windows 上直接用 family = 'SimHei' 在 PDF 设备里会报 'invalid font type'，必须走 showtext 或 cairo_pdf。",
      "msyh.ttc 是字体集合，某些 R 版本读 .ttc 会失败，改用 msyh.ttf 或 simhei.ttf。",
      "ggplot2 3.4 起 size 参数改名为 linewidth，老代码里的 size 对线条已经失效（只报警告）。"
    ],
    "next": [
      "viz-07",
      "viz-11",
      "bulk-25"
    ]
  },
  {
    "id": "viz-07",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "小提琴 + 箱线 + 显著性标注（ggpubr）",
    "level": "常用",
    "tags": [
      "小提琴图",
      "箱线图",
      "显著性",
      "ggpubr"
    ],
    "packages": [
      "ggpubr",
      "ggplot2",
      "dplyr",
      "tidyr"
    ],
    "scene": "要画“基因表达在两组间差异”的图，并且要自动加 p 值和星号，手工调坐标太麻烦。",
    "code": "# ============================================================\n# 07 小提琴 + 箱线 + 抖动点 + 显著性标记\n# ============================================================\nlibrary(ggpubr)\nlibrary(ggplot2)\nlibrary(dplyr)\nlibrary(tidyr)\n\ndf <- readRDS(\"data/processed/plot_df.rds\")   # 含 group 与若干基因表达列\ngenes <- c(\"TP53\", \"EGFR\", \"MYC\")\n\n# 1) 宽转长，一次画多个基因（分面）\nlong <- df %>% select(group, all_of(genes)) %>%\n  pivot_longer(-group, names_to = \"gene\", values_to = \"expr\")\n\np <- ggplot(long, aes(group, expr, fill = group)) +\n  geom_violin(trim = FALSE, alpha = 0.6, linewidth = 0.3) +\n  geom_boxplot(width = 0.18, outlier.shape = NA, fill = \"white\", linewidth = 0.3) +\n  geom_jitter(width = 0.12, size = 0.6, alpha = 0.4) +\n  facet_wrap(~ gene, scales = \"free_y\") +\n  theme_bw() + theme(legend.position = \"none\") +\n  labs(x = NULL, y = \"Expression (log2 TPM)\")\n\n# 2) 自动加显著性：ggpubr 的 stat_compare_means 支持全局与两两比较\np + stat_compare_means(method = \"wilcox.test\", label = \"p.signif\",\n                       comparisons = list(c(\"Normal\", \"Tumor\")))\n\n# 3) 想显示具体 p 值并控制小数点\np + stat_compare_means(method = \"wilcox.test\", label = \"p.format\", hide.ns = TRUE)\n\n# 4) 多组两两比较（比如 I/II/III/IV 四期）\nggboxplot(df, x = \"stage\", y = \"TP53\", fill = \"stage\", palette = \"npg\") +\n  stat_compare_means(comparisons = list(c(\"I\", \"II\"), c(\"II\", \"III\"), c(\"III\", \"IV\")),\n                     method = \"wilcox.test\", label = \"p.signif\") +\n  stat_compare_means(label.y = max(df$TP53) * 1.15)   # 顶部总检验\n\nggsave(\"results/figures/violin_box.pdf\", width = 120, height = 80, units = \"mm\")",
    "notes": [
      "stat_compare_means 默认是 Kruskal-Wallis（多组）或 Wilcoxon（两组），要显式指定 method 才不会被误读。",
      "comparisons 里的组名必须与因子水平完全一致，写成 'Tumor ' 带空格会静默不画。",
      "小提琴图在样本量 < 10 时形状毫无意义，此时应该只画箱线 + 散点。"
    ],
    "pitfalls": [
      "geom_jitter 的随机位置每次运行都不同，投稿图要 set.seed 固定。",
      "label = 'p.signif' 只显示星号，审稿人常要求给出具体数值，建议同时放 p.format。",
      "facet_wrap(scales = 'free_y') 会让各基因的 y 轴不同，读者容易误比较，必要时改成固定刻度。"
    ],
    "next": [
      "viz-08",
      "stats-02",
      "viz-06"
    ]
  },
  {
    "id": "viz-08",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "KM 生存曲线：风险表、中位生存与多组比较",
    "level": "常用",
    "tags": [
      "KM",
      "生存曲线",
      "survminer",
      "log-rank"
    ],
    "packages": [
      "survival",
      "survminer",
      "ggplot2"
    ],
    "scene": "要画高/低风险组的 Kaplan-Meier 曲线，带风险人数表、log-rank p 值和 HR。",
    "code": "# ============================================================\n# 08 KM 曲线：survfit + ggsurvplot 的标准配置\n# ============================================================\nlibrary(survival)\nlibrary(survminer)\n\ndf <- readRDS(\"results/tables/lasso_cox.rds\")$score\ndf$group <- factor(df$group, levels = c(\"Low\", \"High\"))\n\nfit <- survfit(Surv(time, status) ~ group, data = df)\n\n# 1) 标准图：p 值 + 风险表 + 中位生存线\nggsurvplot(\n  fit, data = df,\n  pval = TRUE, pval.method = TRUE,             # 显示 log-rank p 与其方法\n  conf.int = TRUE, conf.int.alpha = 0.15,\n  risk.table = TRUE, risk.table.height = 0.25,\n  xlab = \"Time (months)\", ylab = \"Overall survival\",\n  break.time.by = 12,\n  palette = c(\"#2E86AB\", \"#D1495B\"),\n  legend.title = \"\", legend.labs = c(\"Low risk\", \"High risk\"),\n  surv.median.line = \"hv\",                     # 中位生存时间辅助线\n  ggtheme = theme_bw()\n)\n\n# 2) HR 与置信区间（Cox）\nhr <- coxph(Surv(time, status) ~ group, data = df)\nsummary(hr)$conf.int\nsprintf(\"HR = %.2f (95%%CI %.2f-%.2f), p = %.3g\",\n        exp(coef(hr)), exp(confint(hr))[1], exp(confint(hr))[2],\n        summary(hr)$coefficients[, \"Pr(>|z|)\"])\n\n# 3) 多组比较（如 4 个分型）\n# fit4 <- survfit(Surv(time, status) ~ subtype, data = df)\n# ggsurvplot(fit4, data = df, pval = TRUE, palette = \"npg\")\n\n# 4) 输出可编辑的 PDF（survminer 返回 list，要指定 $plot）\np <- ggsurvplot(fit, data = df, risk.table = TRUE, pval = TRUE)\nggsave(\"results/figures/km_os.pdf\", p$plot, width = 100, height = 90, units = \"mm\")",
    "notes": [
      "surv.median.line = 'hv' 只在两组都达到中位生存时才有横线，否则只有竖线，属于正常现象。",
      "风险表与主图的 x 轴必须一致，risk.table.height 太大会让主图被压扁。",
      "log-rank 检验假设比例风险，曲线明显交叉时应改用 RMST 或分层分析。"
    ],
    "pitfalls": [
      "ggsurvplot 返回的是 list（含 plot 和 table），直接 ggsave 会报错，必须取 $plot。",
      "把 status 编成 1/2 而不是 0/1，Surv() 会把 2 当成删失，生存率会算错。",
      "分组变量没转成 factor 时，survfit 会把连续变量当成多组，图例出现几十条曲线。"
    ],
    "next": [
      "stats-06",
      "viz-10",
      "ml-06"
    ]
  },
  {
    "id": "viz-09",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "富集气泡图与条形图：手工版更好控",
    "level": "常用",
    "tags": [
      "气泡图",
      "富集",
      "dotplot",
      "ggplot2"
    ],
    "packages": [
      "ggplot2",
      "dplyr",
      "forcats",
      "stringr"
    ],
    "scene": "enrichplot 的默认图不能改颜色和标签，要自己做一张“通路 - GeneRatio - p 值”的气泡图。",
    "code": "# ============================================================\n# 09 富集气泡图：GeneRatio 拆分数、颜色映射 p 值\n# ============================================================\nlibrary(ggplot2)\nlibrary(dplyr)\nlibrary(forcats)\nlibrary(stringr)\n\nego <- read.csv(\"results/tables/GO_BP.csv\")\n\n# 1) GeneRatio 是 \"12/500\" 这种字符串，要拆成数值\ndf <- ego %>%\n  mutate(gene_ratio = as.numeric(str_split_i(GeneRatio, \"/\", 1)) /\n                      as.numeric(str_split_i(GeneRatio, \"/\", 2)),\n         neglogp = -log10(p.adjust)) %>%\n  arrange(desc(neglogp)) %>%\n  slice_head(n = 15) %>%\n  mutate(Description = fct_reorder(str_wrap(Description, 45), gene_ratio))\n\n# 2) 气泡图：x = 比例，y = 通路，大小 = 基因数，颜色 = 显著性\nggplot(df, aes(gene_ratio, Description)) +\n  geom_point(aes(size = Count, color = neglogp)) +\n  scale_color_gradient(low = \"#2E86AB\", high = \"#D1495B\") +\n  scale_size_continuous(range = c(2, 7)) +\n  labs(x = \"Gene ratio\", y = NULL, color = \"-log10(P.adjust)\", size = \"Count\") +\n  theme_bw() +\n  theme(axis.text.y = element_text(size = 9))\n\n# 3) 条形图版本（更省版面，适合 10 条以内）\nggplot(df, aes(neglogp, fct_reorder(str_wrap(Description, 40), neglogp))) +\n  geom_col(aes(fill = Count), width = 0.7) +\n  scale_fill_gradient(low = \"#9EC5E8\", high = \"#1B4F72\") +\n  labs(x = \"-log10(P.adjust)\", y = NULL, fill = \"Count\") +\n  theme_bw()\n\n# 4) 上下调分开：用 .sign 分面（clusterProfiler 输出自带该列）\n# ego %>% group_by(.sign) %>% slice_max(neglogp, n = 8) %>% ...\nggsave(\"results/figures/go_bubble.pdf\", width = 130, height = 90, units = \"mm\")",
    "notes": [
      "str_split_i 是 stringr 1.5+ 的函数，老版本要先 strsplit 再取下标。",
      "fct_reorder 决定条形图的顺序，不排的话会按字母序，看起来毫无逻辑。",
      "颜色映射用 -log10(p.adjust) 比直接用 p 值色阶更直观，且方向一致（越大越红）。"
    ],
    "pitfalls": [
      "GeneRatio 直接当数值用会被转成 NA（因为含 '/'），必须拆开除。",
      "Count 与 GeneRatio 高度相关，同时映射大小和 x 轴会显得冗余，选一个即可。",
      "用 pvalue 而不是 p.adjust 上色，会被审稿人质疑多重检验问题。"
    ],
    "next": [
      "bulk-17",
      "viz-06",
      "bulk-18"
    ]
  },
  {
    "id": "viz-10",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "森林图：多因素 Cox 与亚组分析",
    "level": "常用",
    "tags": [
      "森林图",
      "HR",
      "亚组",
      "coxph"
    ],
    "packages": [
      "survival",
      "ggplot2",
      "dplyr",
      "broom"
    ],
    "scene": "要展示多因素 Cox 的结果（HR 与 95%CI），以及在不同亚组里效应是否一致。",
    "code": "# ============================================================\n# 10 森林图：从 coxph 到可发表图形\n# ============================================================\nlibrary(survival)\nlibrary(broom)\nlibrary(dplyr)\nlibrary(ggplot2)\n\ndf <- readRDS(\"data/processed/surv_df.rds\")\n\n# 1) 多因素 Cox\nfit <- coxph(Surv(OS_time, OS_status) ~ age + sex + stage + risk_score, data = df)\ntd <- tidy(fit, exponentiate = TRUE, conf.int = TRUE) %>%\n  filter(term != \"(Intercept)\") %>%\n  mutate(term = recode(term,\n                       age = \"Age (per year)\", sexMale = \"Sex (male vs female)\",\n                       stageIII = \"Stage III vs I\", stageIV = \"Stage IV vs I\",\n                       risk_score = \"Risk score (per unit)\"))\n\n# 2) 基础森林图\nggplot(td, aes(x = estimate, y = reorder(term, estimate))) +\n  geom_vline(xintercept = 1, linetype = \"dashed\", color = \"grey50\") +\n  geom_errorbarh(aes(xmin = conf.low, xmax = conf.high), height = 0.15) +\n  geom_point(size = 2.5, color = \"#D1495B\") +\n  scale_x_log10() +\n  labs(x = \"Hazard ratio (95% CI)\", y = NULL) +\n  theme_bw()\n\n# 3) 亚组分析：逐个亚组内单独建模\nsubgroups <- c(\"sex\", \"stage\", \"age_grp\")\nsub_res <- lapply(subgroups, function(v) {\n  df %>% group_by(.data[[v]]) %>%\n    group_modify(~ tidy(coxph(Surv(OS_time, OS_status) ~ risk_score, data = .x),\n                        exponentiate = TRUE, conf.int = TRUE)) %>%\n    mutate(subgroup = v, level = as.character(.y[[v]]))\n}) %>% bind_rows() %>%\n  filter(term == \"risk_score\")\n\nggplot(sub_res, aes(estimate, interaction(subgroup, level))) +\n  geom_vline(xintercept = 1, linetype = \"dashed\") +\n  geom_errorbarh(aes(xmin = conf.low, xmax = conf.high), height = 0.2) +\n  geom_point(size = 2) + scale_x_log10() +\n  labs(x = \"HR per unit risk score\", y = NULL) + theme_bw()",
    "notes": [
      "scale_x_log10() 是森林图的关键：HR 的置信区间在原始尺度上不对称，取对数后才对称。",
      "tidy(exponentiate = TRUE) 直接把 coef 转成 HR，省去手动 exp，conf.int 也会同步转换。",
      "亚组分析的交互作用检验（P for interaction）比“每组各跑一次”更有说服力，应补上。"
    ],
    "pitfalls": [
      "ggplot 默认按字母排序 y 轴，森林图的变量顺序要用 factor + levels 手动指定。",
      "亚组样本量小时 CI 极宽甚至算不出来（完全分离），coxph 会给警告并返回 NA。",
      "把不同量纲的变量（年龄 vs 风险评分）画在同一张森林图，x 轴含义不同，需在脚注说明。"
    ],
    "next": [
      "stats-06",
      "viz-08",
      "ml-12"
    ]
  },
  {
    "id": "viz-11",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "patchwork 拼图与整版导出",
    "level": "常用",
    "tags": [
      "拼图",
      "patchwork",
      "排版",
      "导出"
    ],
    "packages": [
      "patchwork",
      "ggplot2",
      "cowplot"
    ],
    "scene": "投稿要求 Figure 1 由 a/b/c/d 四个子图组成，手工在 AI 里排版太费时间。",
    "code": "# ============================================================\n# 11 patchwork：布局、标签、统一图例与导出\n# ============================================================\nlibrary(patchwork)\nlibrary(ggplot2)\n\np1 <- ggplot(mtcars, aes(wt, mpg)) + geom_point() + labs(title = \"PCA\")\np2 <- ggplot(mtcars, aes(factor(cyl), mpg)) + geom_boxplot() + labs(title = \"Groups\")\np3 <- ggplot(mtcars, aes(hp)) + geom_histogram(bins = 15) + labs(title = \"Distribution\")\np4 <- ggplot(mtcars, aes(wt, hp, color = factor(cyl))) + geom_point() + labs(title = \"Correlation\")\n\n# 1) 布局语法：| 是左右，/ 是上下，() 分组\nlayout <- (p1 | p2) / (p3 | p4)\n\n# 2) 统一加 a/b/c/d 标签，并收集重复的图例\nfinal <- layout +\n  plot_annotation(tag_levels = \"a\", tag_prefix = \"(\", tag_suffix = \")\",\n                  title = \"Figure 1. Study overview\",\n                  theme = theme(plot.title = element_text(face = \"bold\", size = 13))) &\n  theme(legend.position = \"bottom\")\n\n# 3) 精细控制各图宽度（比如左侧大图占 60%）\n# (p1 | p2) + plot_layout(widths = c(2, 1))\n\n# 4) 导出：整版双栏 170 mm\nggsave(\"results/figures/Figure1.pdf\", final, width = 170, height = 140, units = \"mm\")\nggsave(\"results/figures/Figure1.tiff\", final, width = 170, height = 140,\n       units = \"mm\", dpi = 300, compression = \"lzw\")\n\n# 5) 与 cowplot 混用：把非 ggplot 对象（如 pheatmap）放进来\n# library(cowplot)\n# combo <- plot_grid(p1, as_grob(pheatmap_obj$gtable), ncol = 2)",
    "notes": [
      "plot_annotation 的 tag_levels = 'a' 会自动编号，tag_prefix/suffix 控制成 (a) 还是 a。",
      "用 & theme(...) 可以把主题应用到所有子图，用 + 只作用于最后一个。",
      "ggsave 的 width/height 是成品尺寸，不是每张子图的尺寸，排版前先想好最终版面。"
    ],
    "pitfalls": [
      "patchwork 只能拼 ggplot / grob 对象，pheatmap 的返回值要先 as_grob 或 pheatmap(..., silent = TRUE)$gtable。",
      "子图里有多个图例时，& theme(legend.position = 'bottom') 会让每个图都有图例，需要 plot_layout(guides = 'collect')。",
      "TIFF 不指定 compression 会生成几十 MB 的文件，投稿系统常常上传失败。"
    ],
    "next": [
      "viz-06",
      "viz-12",
      "report-04"
    ]
  },
  {
    "id": "viz-12",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "ComplexHeatmap 进阶：多层注释与行列分割",
    "level": "进阶",
    "tags": [
      "ComplexHeatmap",
      "注释",
      "行分割",
      "热图"
    ],
    "packages": [
      "ComplexHeatmap",
      "circlize",
      "dplyr"
    ],
    "scene": "热图要同时标注分组、分期、突变状态、通路打分，还要按行分成“上调/下调”两块。",
    "code": "# ============================================================\n# 12 ComplexHeatmap：多行注释 + 行分割 + 自定义图例\n# ============================================================\nlibrary(ComplexHeatmap)\nlibrary(circlize)\nlibrary(dplyr)\n\nmat  <- readRDS(\"data/processed/heatmap_mat.rds\")     # 基因 × 样本，已 z-score\nanno <- readRDS(\"data/processed/heatmap_anno.rds\")    # 样本 × (group, stage, subtype)\n\n# 1) 列注释：分组 + 分期 + 亚型，三种颜色方案\ncol_ha <- HeatmapAnnotation(\n  group   = anno$group,\n  stage   = anno$stage,\n  subtype = anno$subtype,\n  col = list(group   = c(Normal = \"#2E86AB\", Tumor = \"#D1495B\"),\n             stage   = c(I = \"#E8F4F8\", II = \"#A8D5E2\", III = \"#5DA5C7\", IV = \"#2C6E91\"),\n             subtype = c(Luminal = \"#F4A6A6\", HER2 = \"#C97B84\", Basal = \"#8E5572\")),\n  annotation_name_side = \"left\",\n  gap = unit(1, \"mm\")\n)\n\n# 2) 行注释：方向（按行均值判 Up/Down）+ 通路打分\nanno_row <- data.frame(\n  direction = ifelse(rowMeans(mat) > 0, \"Up\", \"Down\"),\n  pathway   = rowMeans(mat[, anno$group == \"Tumor\", drop = FALSE]),\n  row.names = rownames(mat)\n)\nrow_ha <- rowAnnotation(\n  direction = anno_row$direction,\n  pathway   = anno_row$pathway,\n  col = list(direction = c(Up = \"#C0392B\", Down = \"#2980B9\")),\n  annotation_name_side = \"top\"\n)\n\n# 3) 热图本体：按方向分行、按分组分列\nht <- Heatmap(mat, name = \"z-score\",\n              top_annotation = col_ha, left_annotation = row_ha,\n              row_split = anno_row$direction,\n              column_split = anno$group,\n              cluster_row_slices = FALSE,\n              cluster_column_slices = TRUE,\n              show_row_names = FALSE, show_column_names = FALSE,\n              col = colorRamp2(c(-2, 0, 2), c(\"#2166AC\", \"white\", \"#B2182B\")),\n              row_title_rot = 0,\n              heatmap_legend_param = list(title = \"Expression (z)\"))\n\n# 4) 加一个顶部条形图注释（比如每个样本的免疫评分）\n# ht <- ht + Heatmap(anno$immune_score, name = \"Immune\",\n#                    top_annotation = HeatmapAnnotation(bar = anno_barplot(anno$immune_score)))\n\ndraw(ht, merge_legend = TRUE)\npdf(\"results/figures/complex_heatmap.pdf\", width = 8, height = 9)\ndraw(ht, merge_legend = TRUE)\ndev.off()",
    "notes": [
      "colorRamp2 定义的是连续色阶的锚点，不是分段，热图会线性插值。",
      "column_split 会按分组把列切开并各自聚类，比单纯在聚类结果里“看起来分开”更严谨。",
      "annotation_name_side 控制注释名位置，行注释默认在右侧，容易和热图挤在一起。"
    ],
    "pitfalls": [
      "Heatmap 的矩阵不能有 NA，ComplexHeatmap 会报错而不是像 pheatmap 那样留白。",
      "draw() 之后再用 pdf() 会画到新设备上，正确顺序是先 pdf() 再 draw()。",
      "行注释向量的顺序必须与矩阵行顺序一致，用 anno_row[match(rownames(mat), ...), ] 对齐，别靠行号。"
    ],
    "next": [
      "viz-11",
      "bulk-24",
      "spatial-09"
    ]
  },
  {
    "id": "viz-13",
    "track": "viz",
    "trackName": "统计作图与可视化",
    "title": "相关性矩阵图：热图 + 显著性 + 层次聚类",
    "level": "常用",
    "tags": [
      "相关性",
      "corrplot",
      "ggcorrplot",
      "矩阵图"
    ],
    "packages": [
      "ggcorrplot",
      "corrplot",
      "dplyr"
    ],
    "scene": "要看 20 个免疫细胞分数之间谁和谁高度相关，并标出显著性，找出共线性严重的一组。",
    "code": "# ============================================================\n# 13 相关性矩阵：ggcorrplot 上三角 + p 值星号\n# ============================================================\nlibrary(ggcorrplot)\nlibrary(corrplot)\nlibrary(dplyr)\n\ntme <- read.csv(\"results/tables/cibersort_fraction.csv\", row.names = 1)\ncell_cols <- setdiff(colnames(tme), c(\"ID\", \"Method\", \"Time\"))\nmat <- tme[, cell_cols]\n\n# 1) 计算相关系数与 p 值（Spearman 更适合比例/偏态数据）\ncor_mat <- cor(mat, method = \"spearman\", use = \"pairwise.complete.obs\")\np_mat   <- ggcorrplot::cor_pmat(mat, method = \"spearman\")\n\n# 2) 上三角热图 + 不显著处打叉\nggcorrplot(cor_mat, type = \"upper\", method = \"square\",\n           lab = TRUE, lab_size = 2.5,\n           colors = c(\"#2166AC\", \"white\", \"#B2182B\"),\n           p.mat = p_mat, sig.level = 0.05, insig = \"blank\",\n           hc.order = TRUE, outline.color = \"white\") +\n  theme(legend.position = \"right\")\n\n# 3) corrplot 版本：聚类树 + 只显示显著相关\ncorrplot(cor_mat, method = \"color\", type = \"upper\",\n         order = \"hclust\", addrect = 3,\n         p.mat = p_mat, sig.level = 0.05, insig = \"label_sig\",\n         pch.col = \"white\", tl.col = \"black\", tl.cex = 0.7)\n\n# 4) 找出高度相关的变量对（|r| > 0.8），建模前要处理共线性\nhigh <- which(abs(cor_mat) > 0.8 & upper.tri(cor_mat), arr.ind = TRUE)\ndata.frame(var1 = rownames(cor_mat)[high[, 1]],\n           var2 = colnames(cor_mat)[high[, 2]],\n           r = cor_mat[high]) %>% arrange(desc(abs(r)))",
    "notes": [
      "人口型（成分）数据的相关性天生为负（比例和为 1），出现大量负相关是数学约束而非生物学。",
      "hc.order = TRUE 会重排变量顺序，看单个变量时要对着标签找，别按原顺序读。",
      "Spearman 对单调关系敏感、对异常值稳健，免疫细胞比例这类数据优先用它。"
    ],
    "pitfalls": [
      "cor_pmat 的 p 值没有做多重检验校正，变量多时要自己 p.adjust。",
      "样本量 < 20 时相关系数极不稳定，矩阵图的“聚类”可能完全是噪声。",
      "use = 'pairwise.complete.obs' 在不同变量对上用不同样本量，矩阵可能不半正定，做 PCA 会报错。"
    ],
    "next": [
      "bulk-20",
      "stats-03",
      "viz-06"
    ]
  },
  {
    "id": "stats-01",
    "track": "stats",
    "trackName": "统计与实验设计",
    "title": "样本量与功效计算：开题前先算清楚要多少例",
    "level": "常用",
    "tags": [
      "样本量",
      "功效",
      "pwr",
      "生存"
    ],
    "packages": [
      "pwr",
      "gsDesign",
      "ggplot2"
    ],
    "scene": "课题设计阶段，导师问“你要收多少病例”，或者审稿人质疑“n=12 够不够支持这个结论”。",
    "code": "# ============================================================\n# 01 样本量：连续 / 二分类 / 生存三种场景\n# ============================================================\nlibrary(pwr)\nlibrary(gsDesign)\n\n# ---- 1) 两组均值比较（t 检验）----\n# d 是 Cohen's d = 均值差 / 合并标准差，0.2 小 / 0.5 中 / 0.8 大\npwr.t.test(d = 0.5, sig.level = 0.05, power = 0.8, type = \"two.sample\")\n# 反过来：已有 30 vs 30，能测出多大的效应？\npwr.t2n.test(n1 = 30, n2 = 30, sig.level = 0.05, power = 0.8)\n\n# ---- 2) 两组率比较（卡方/Fisher）----\n# 预期 60% vs 35%，每组需要多少\npower.prop.test(p1 = 0.60, p2 = 0.35, sig.level = 0.05, power = 0.8)\n\n# ---- 3) 多组 ANOVA ----\npwr.anova.test(k = 4, f = 0.25, sig.level = 0.05, power = 0.8)\n\n# ---- 4) 生存分析（log-rank）：中位生存 12 vs 18 个月，入组 24 个月、随访 12 个月 ----\n# 指数分布 lambda = ln2 / 中位生存\nn_surv <- nSurvival(lambda1 = log(2) / 18, lambda2 = log(2) / 12,\n                    eta = log(2) / 12,      # 失访率对应的中位随访\n                    Ts = 24, Tr = 12,\n                    alpha = 0.05, beta = 0.2, sided = 2)\nn_surv$n            # 需要的总事件/样本数\n\n# ---- 5) 画一条功效曲线，写进开题报告 ----\nd_seq <- seq(0.1, 1, by = 0.02)\npow <- sapply(d_seq, function(d) pwr.t.test(d = d, sig.level = 0.05,\n                                            power = NULL, n = 30)$power)\nplot(d_seq, pow, type = \"l\", lwd = 2, xlab = \"Effect size (Cohen's d)\",\n     ylab = \"Power\", main = \"n = 30 per group\")\nabline(h = 0.8, lty = 2, col = \"red\")",
    "notes": [
      "power.prop.test 的 p1/p2 是比例（0~1），不是百分比，写 60 会得到荒谬的样本量。",
      "生存分析的样本量取决于事件数而不是入组数，事件不足时随访再久也没用。",
      "算出来的 n 要向上取整，并且加上 10%~20% 的脱落率。"
    ],
    "pitfalls": [
      "用观察到的效应量反过来算 power（post-hoc power）是没有意义的，审稿人会直接指出。",
      "双侧检验与单侧检验的样本量差很多，默认都用双侧，除非有强先验理由。",
      "多重比较（多个终点）要做 alpha 校正，否则实际 I 类错误率远高于 0.05。"
    ],
    "next": [
      "stats-02",
      "stats-06",
      "report-01"
    ]
  },
  {
    "id": "stats-02",
    "track": "stats",
    "trackName": "统计与实验设计",
    "title": "t 检验 / Wilcoxon / 方差分析怎么选（附多重检验）",
    "level": "常用",
    "tags": [
      "t检验",
      "Wilcoxon",
      "ANOVA",
      "p.adjust"
    ],
    "packages": [
      "stats",
      "car",
      "FSA",
      "emmeans",
      "dplyr"
    ],
    "scene": "两组或多组比较时总在纠结用 t 检验还是秩和检验，做完又多组比较不知道 p 值要不要校正。",
    "code": "# ============================================================\n# 02 组间比较：先看分布，再选方法，最后校正\n# ============================================================\nlibrary(dplyr)\nlibrary(car)\nlibrary(FSA)\nlibrary(emmeans)\n\ndf <- readRDS(\"data/processed/clinical.rds\")\n\n# ---- 1) 两组：正态性 + 方差齐性决定用哪个 ----\nx <- df$age[df$group == \"Normal\"]; y <- df$age[df$group == \"Tumor\"]\nshapiro.test(x); shapiro.test(y)               # p > 0.05 才谈得上正态\nvar.test(x, y)                                 # 方差齐性\n\nt.test(age ~ group, data = df, var.equal = TRUE)\nwilcox.test(age ~ group, data = df, exact = FALSE)   # 不满足正态时的替代\n\n# 效应量：t 检验看 Cohen's d，秩和看 rank-biserial\neffsize::cohen.d(age ~ group, data = df)\nwilcox_effsize <- function(a, b) {\n  w <- wilcox.test(a, b)$statistic\n  1 - 2 * w / (length(a) * length(b)) * 2          # 近似 rank-biserial\n}\n\n# ---- 2) 多组：ANOVA + 事后两两比较 ----\nfit <- aov(age ~ stage, data = df)\nsummary(fit)\nTukeyHSD(fit)                                  # 方差齐时\n# 方差不齐：Welch ANOVA + Games-Howell\noneway.test(age ~ stage, data = df, var.equal = FALSE)\nemmeans::emmeans(fit, pairwise ~ stage)\n\n# 非参数：Kruskal-Wallis + Dunn（含 BH 校正）\nkruskal.test(age ~ stage, data = df)\ndunnTest(age ~ stage, data = df, method = \"bh\")\n\n# ---- 3) 多重检验：什么时候必须校正 ----\np <- c(0.001, 0.01, 0.03, 0.04, 0.049, 0.2, 0.6)\ndata.frame(raw = p,\n           BH   = p.adjust(p, \"BH\"),        # FDR，探索性分析首选\n           bonf = p.adjust(p, \"bonferroni\"))# 极保守，适合少量确证性检验",
    "notes": [
      "Shapiro-Wilk 在 n > 5000 时极其敏感，几乎必然拒绝正态，此时应看 QQ 图而不是 p 值。",
      "两组比较用 t 检验、三组以上用 ANOVA，不要做三次两两 t 检验（I 类错误膨胀）。",
      "BH 校正的是 FDR 不是 FWER，探索性研究用它、确证性研究用 Bonferroni。"
    ],
    "pitfalls": [
      "方差不齐还硬跑普通 ANOVA，p 值会偏大或偏小，应先做 Levene 检验（car::leveneTest）。",
      "Wilcoxon 检验在存在并列值（ties）时会警告，exact = FALSE 用正态近似更稳。",
      "p.adjust 的输入顺序会被保留，但如果先筛掉 p > 0.05 再校正，结果完全错误（校正必须在全集上做）。"
    ],
    "next": [
      "viz-07",
      "stats-03",
      "stats-01"
    ]
  },
  {
    "id": "stats-03",
    "track": "stats",
    "trackName": "统计与实验设计",
    "title": "相关性分析：Pearson / Spearman / 偏相关",
    "level": "常用",
    "tags": [
      "相关性",
      "偏相关",
      "Spearman",
      "rcorr"
    ],
    "packages": [
      "Hmisc",
      "ppcor",
      "dplyr"
    ],
    "scene": "想说明两个指标相关，但两者都受第三个变量（比如年龄、肿瘤纯度）影响，需要控制混杂。",
    "code": "# ============================================================\n# 03 相关：选对系数，控制混杂，处理多重比较\n# ============================================================\nlibrary(Hmisc)\nlibrary(ppcor)\nlibrary(dplyr)\n\ndf <- readRDS(\"data/processed/analysis_df.rds\")\n\n# ---- 1) 先看散点，别直接跑相关系数 ----\nplot(df$immune_score, df$risk_score, pch = 19, col = \"#2E86AB\",\n     xlab = \"Immune score\", ylab = \"Risk score\")\n\n# Pearson：线性关系 + 双变量正态\ncor.test(df$immune_score, df$risk_score, method = \"pearson\")\n# Spearman：单调关系、有异常值、等级数据\ncor.test(df$immune_score, df$risk_score, method = \"spearman\")\n\n# ---- 2) 偏相关：控制年龄与肿瘤纯度 ----\npcor.test(df$immune_score, df$risk_score,\n          z = df[, c(\"age\", \"tumor_purity\")], method = \"spearman\")\n\n# ---- 3) 多变量相关矩阵：一次出 r 与 p ----\nnum <- df %>% select(immune_score, risk_score, age, tumor_purity, stage_num)\nrc <- rcorr(as.matrix(num), type = \"spearman\")\nround(rc$r, 2)\nround(rc$P, 3)\n\n# ---- 4) 多重检验：相关矩阵里跑了几十次检验，必须校正 ----\np_vec <- rc$P[upper.tri(rc$P)]\npadj  <- p.adjust(p_vec, \"BH\")\nsum(padj < 0.05)\n\n# 5) 报告写法：r = 0.42, 95%CI 0.28-0.55, P < 0.001\n#    CI 需要 bootstrap（见 stats-04）",
    "notes": [
      "相关系数大小不等于因果强度，r = 0.9 也可能毫无生物学意义。",
      "Pearson 对异常值极敏感，一个离群点就能把 r 从 0.1 拉到 0.6。",
      "偏相关控制变量本身如果测量误差大，校正后反而引入新的偏倚。"
    ],
    "pitfalls": [
      "把分类变量（如分期 I/II/III）直接当连续变量算 Pearson 是常见的硬伤。",
      "rcorr 对缺失值用成对删除，不同变量对的样本量不同，矩阵可能出现不合理的非正定。",
      "两个变量都随年龄增长而变化时，不控制年龄会得到虚假的强相关（混杂）。"
    ],
    "next": [
      "viz-13",
      "stats-04",
      "bulk-20"
    ]
  },
  {
    "id": "stats-04",
    "track": "stats",
    "trackName": "统计与实验设计",
    "title": "Bootstrap 置信区间：不依赖分布假设",
    "level": "进阶",
    "tags": [
      "Bootstrap",
      "置信区间",
      "重抽样",
      "boot"
    ],
    "packages": [
      "boot",
      "dplyr",
      "ggplot2"
    ],
    "scene": "指标是中位数、AUC 差值、C-index 这类没有现成公式算 CI 的统计量，想用重抽样给出区间。",
    "code": "# ============================================================\n# 04 Bootstrap：任何统计量都能算 CI\n# ============================================================\nlibrary(boot)\nlibrary(dplyr)\nlibrary(ggplot2)\n\ndf <- readRDS(\"data/processed/analysis_df.rds\")\n\n# ---- 1) 手写版：中位数的 95% CI ----\nset.seed(20240101)\nB <- 2000\nboot_med <- replicate(B, median(sample(df$OS_time, replace = TRUE), na.rm = TRUE))\nquantile(boot_med, c(0.025, 0.975))\nsd(boot_med)                     # bootstrap 标准误\n\n# ---- 2) boot 包版：可以套任意统计量（这里是两组中位数差）----\nstat_diff <- function(data, idx) {\n  d <- data[idx, ]\n  median(d$OS_time[d$group == \"High\"]) - median(d$OS_time[d$group == \"Low\"])\n}\nb <- boot(df, statistic = stat_diff, R = B)\nb\nboot.ci(b, type = c(\"perc\", \"bca\"))     # 百分位法与偏差校正法\n\n# ---- 3) 相关系数的 CI（Fisher z 之外的第二选择）----\nstat_cor <- function(data, idx) cor(data$immune_score[idx], data$risk_score[idx],\n                                    method = \"spearman\", use = \"complete.obs\")\nbc <- boot(df, statistic = stat_cor, R = B)\nboot.ci(bc, type = \"perc\")\n\n# ---- 4) 可视化 bootstrap 分布 ----\nas.data.frame(b$t) %>% ggplot(aes(V1)) +\n  geom_histogram(bins = 50, fill = \"#2E86AB\", color = \"white\") +\n  geom_vline(xintercept = b$t0, linetype = \"solid\") +\n  geom_vline(xintercept = boot.ci(b, type = \"perc\")$percent[4:5], linetype = \"dashed\") +\n  labs(x = \"Median difference (High - Low)\", y = \"Count\") + theme_bw()",
    "notes": [
      "B 至少 1000 次，报告最终结果常用 5000~10000；B 太小 CI 会抖。",
      "BCa 比百分位法更准（尤其偏态分布），但需要计算加速常数，样本极小时可能失败。",
      "Bootstrap 假设样本能代表总体，样本本身有严重选择偏倚时，重抽样也救不了。"
    ],
    "pitfalls": [
      "忘了 set.seed，每次跑 CI 都不一样，无法复现。",
      "对时间序列/有聚类结构的数据直接 iid 重抽样是错的，要用 block bootstrap 或按簇重抽样。",
      "统计量里用了 na.rm 但 resample 后有整列 NA 的情况，会返回 NA 并污染整个分布。"
    ],
    "next": [
      "stats-03",
      "ml-11",
      "stats-06"
    ]
  },
  {
    "id": "stats-05",
    "track": "stats",
    "trackName": "统计与实验设计",
    "title": "混合效应模型：处理重复测量与中心效应",
    "level": "进阶",
    "tags": [
      "混合模型",
      "lme4",
      "随机效应",
      "ICC"
    ],
    "packages": [
      "lme4",
      "lmerTest",
      "performance",
      "ggplot2"
    ],
    "scene": "同一个病人有多个时间点的样本，或者数据来自 5 个中心，普通线性模型把每个观测当独立是错的。",
    "code": "# ============================================================\n# 05 混合效应：随机截距 + 随机斜率 + ICC\n# ============================================================\nlibrary(lme4)\nlibrary(lmerTest)\nlibrary(performance)\nlibrary(ggplot2)\n\ndf <- readRDS(\"data/processed/longitudinal_df.rds\")   # patient_id, time, group, value\n\n# 1) 先看个体轨迹：同一病人多个时间点，明显不独立\nggplot(df, aes(time, value, group = patient_id, color = group)) +\n  geom_line(alpha = 0.3) + theme_bw()\n\n# 2) 随机截距模型：每个病人有自己的基线\nm1 <- lmer(value ~ group * time + (1 | patient_id), data = df, REML = TRUE)\nsummary(m1)                 # lmerTest 会给 Satterthwaite 近似的 p 值\n\n# 3) 随机斜率：每个病人的变化速度也不同（容易不收敛，谨慎）\nm2 <- lmer(value ~ group * time + (1 + time | patient_id), data = df)\nanova(m1, m2)               # 似然比检验比较两个模型\n\n# 4) ICC：组内相关有多强（> 0.2 说明必须用混合模型）\nicc(m1)\n\n# 5) 二分类结局用 glmer\n# m3 <- glmer(outcome ~ group + time + (1 | patient_id), data = df, family = binomial)\n\n# 6) 固定效应解读：交互项显著 = 两组随时间变化趋势不同\n# 边际均值（emmeans 更方便给临床解释）\n# emmeans::emmeans(m1, ~ group | time)",
    "notes": [
      "REML = TRUE 不能用于比较固定效应不同的模型，比较时要改 ML（REML = FALSE）。",
      "随机斜率模型在每组个体数少时经常不收敛，先试随机截距，必要时用 brms 的贝叶斯版本。",
      "ICC 高说明个体差异大，忽略它会大幅低估标准误、夸大显著性。"
    ],
    "pitfalls": [
      "把 patient_id 当固定效应用（写成 factor）会消耗几十个自由度，模型直接过拟合。",
      "lmer 对缺失值按行删除，纵向数据里会让不同时间点的样本量不一致，解释时要小心。",
      "p 值来自 Satterthwaite 近似，lme4 本身不输出 p 值，别以为没输出就是不能做检验。"
    ],
    "next": [
      "stats-02",
      "stats-06",
      "stats-01"
    ]
  },
  {
    "id": "stats-06",
    "track": "stats",
    "trackName": "统计与实验设计",
    "title": "Cox 比例风险模型：多因素、PH 假设与交互",
    "level": "常用",
    "tags": [
      "Cox",
      "生存分析",
      "PH假设",
      "风险比"
    ],
    "packages": [
      "survival",
      "survminer",
      "dplyr"
    ],
    "scene": "要做多因素生存分析，报告调整后的 HR，还要检验比例风险假设是否成立。",
    "code": "# ============================================================\n# 06 Cox：建模 → PH 假设 → 交互 → 分层\n# ============================================================\nlibrary(survival)\nlibrary(survminer)\nlibrary(dplyr)\n\ndf <- readRDS(\"data/processed/surv_df.rds\")\ndf$stage <- factor(df$stage)\n\n# 1) 单因素筛选（p < 0.1 的进多因素，避免过度拟合）\nvars <- c(\"age\", \"sex\", \"stage\", \"risk_score\", \"immune_score\")\nuni <- lapply(vars, function(v) {\n  f <- as.formula(paste(\"Surv(OS_time, OS_status) ~\", v))\n  s <- summary(coxph(f, data = df))\n  data.frame(var = v, HR = s$conf.int[1, 1], low = s$conf.int[1, 3],\n             high = s$conf.int[1, 4], p = s$coefficients[1, 5])\n}) %>% bind_rows()\nuni\n\n# 2) 多因素模型\nfit <- coxph(Surv(OS_time, OS_status) ~ age + sex + stage + risk_score, data = df)\nsummary(fit)\n\n# 3) 比例风险假设：p < 0.05 说明该变量违反 PH，需要分层或加时依系数\nzph <- cox.zph(fit)\nzph\nggcoxzph(zph)                 # 平滑曲线应接近水平\n\n# 4) 违反 PH 的处理：分层 Cox（把违反的变量放 strata）\nfit_strata <- coxph(Surv(OS_time, OS_status) ~ age + risk_score + strata(stage), data = df)\nsummary(fit_strata)\n\n# 5) 交互作用检验（比“亚组各跑一次”更有说服力）\nfit_int <- coxph(Surv(OS_time, OS_status) ~ risk_score * sex + age + stage, data = df)\nsummary(fit_int)$coefficients\n\n# 6) 模型整体性能\nconcordance(fit)              # C-index\nAIC(fit)",
    "notes": [
      "cox.zph 的 p 值是对整个模型和每个变量分别检验，看单个变量那一行更关键。",
      "HR 是“任意时刻的相对风险”，不是“风险提高 X%”，写成百分比时要说明是相对基线。",
      "事件数（不是样本数）决定能放几个变量：常用规则是每个变量至少 10 个事件（EPV）。"
    ],
    "pitfalls": [
      "把连续变量硬分成高低两组会损失信息并引入人为阈值，除非有临床切点依据。",
      "性别等分类变量没转 factor 时会被当成连续变量，HR 变成“每增加 1 个单位”的荒谬解释。",
      "用 coxph 处理有竞争风险的数据（如癌症特异性死亡 vs 其他死因）会高估风险，应改用 Fine-Gray。"
    ],
    "next": [
      "viz-08",
      "ml-10",
      "stats-05"
    ]
  },
  {
    "id": "report-01",
    "track": "report",
    "trackName": "报告与表格输出",
    "title": "基线表（Table 1）：gtsummary 与 table1 两套写法",
    "level": "常用",
    "tags": [
      "基线表",
      "Table1",
      "gtsummary",
      "描述统计"
    ],
    "packages": [
      "gtsummary",
      "table1",
      "dplyr",
      "flextable"
    ],
    "scene": "论文第一张表要按分组列出年龄、性别、分期、随访时间，还要带 p 值和标准化差异。",
    "code": "# ============================================================\n# 01 Table 1：tbl_summary 一站式生成\n# ============================================================\nlibrary(gtsummary)\nlibrary(dplyr)\n\ndf <- readRDS(\"data/processed/clinical.rds\")\ndf$group <- factor(df$group, levels = c(\"Normal\", \"Tumor\"))\n\n# 1) 基础版：连续变量默认中位数(IQR)，分类变量给 n(%)\nt1 <- df %>%\n  select(group, age, sex, stage, OS_time) %>%\n  tbl_summary(by = group,\n              statistic = list(all_continuous() ~ \"{median} ({p25}, {p75})\",\n                               all_categorical() ~ \"{n} ({p}%)\"),\n              digits = all_continuous() ~ 1,\n              missing = \"if_any\") %>%\n  add_overall() %>%\n  add_p(test = list(all_continuous() ~ \"wilcox.test\",\n                    all_categorical() ~ \"chisq.test\")) %>%\n  add_n() %>%\n  bold_labels()\nt1\n\n# 2) 加标准化差异（SMD，> 0.1 提示组间不平衡）\nt1 %>% add_difference()\n\n# 3) 导出为 Word 三线表\nt1 %>% as_flex_table() %>%\n  flextable::save_as_docx(path = \"results/tables/Table1.docx\")\n\n# 4) 备选：table1 包（语法更直白，适合快速出表）\nlibrary(table1)\ntable1(~ age + sex + stage + OS_time | group, data = df,\n       overall = \"Total\",\n       render.continuous = c(. = \"Median [IQR]\"))",
    "notes": [
      "连续变量用中位数(IQR) 还是均值(SD) 取决于分布，tbl_summary 默认会按分布自动判断，但最好显式指定。",
      "SMD 是观察性研究里比 p 值更合适的组间比较指标，p 值受样本量影响太大。",
      "缺失值要在表里体现（missing = 'if_any'），审稿人一定会问每组缺失多少。"
    ],
    "pitfalls": [
      "用 p 值判断基线是否可比，是 RCT 之外研究里的常见误区（应看 SMD 与临床意义）。",
      "分类变量的卡方检验在期望频数 < 5 时应改用 Fisher，tbl_summary 不会自动切换。",
      "连续变量里有极端值（如年龄 999 表示缺失）时，中位数和均值都会失真，先清洗再出表。"
    ],
    "next": [
      "report-02",
      "stats-02",
      "io-07"
    ]
  },
  {
    "id": "report-02",
    "track": "report",
    "trackName": "报告与表格输出",
    "title": "三线表导出 Word：flextable 精修",
    "level": "常用",
    "tags": [
      "flextable",
      "Word",
      "三线表",
      "officer"
    ],
    "packages": [
      "flextable",
      "officer",
      "dplyr"
    ],
    "scene": "期刊要求三线表、宋体小五、表注在下方，手动在 Word 里调格式每次都要重来。",
    "code": "# ============================================================\n# 02 flextable：表格样式 → 三线表 → 导出 docx\n# ============================================================\nlibrary(flextable)\nlibrary(officer)\nlibrary(dplyr)\n\ntb <- read.csv(\"results/tables/mr_main_results.csv\")\n\nft <- flextable(tb) %>%\n  set_header_labels(method = \"Method\", nsnp = \"SNPs\", b = \"β\",\n                    se = \"SE\", pval = \"P\", or = \"OR\",\n                    or_lci95 = \"95%CI low\", or_uci95 = \"95%CI high\") %>%\n  colformat_double(j = c(\"b\", \"se\", \"or\", \"or_lci95\", \"or_uci95\"), digits = 3) %>%\n  colformat_double(j = \"pval\", digits = 4) %>%\n  bold(part = \"header\") %>%\n  font(fontname = \"Times New Roman\", part = \"all\") %>%\n  fontsize(size = 9, part = \"all\") %>%\n  align(align = \"center\", part = \"all\") %>%\n  align(j = 1, align = \"left\", part = \"all\") %>%\n  # 三线表：只留顶线、表头下线、底线\n  border_remove() %>%\n  hline_top(border = fp_border(width = 1.5), part = \"header\") %>%\n  hline_bottom(border = fp_border(width = 0.75), part = \"header\") %>%\n  hline_bottom(border = fp_border(width = 1.5), part = \"body\") %>%\n  set_caption(\"Table 2. MR estimates of BMI on breast cancer risk\") %>%\n  autofit()\n\nft\n\n# 导出 docx（可以再嵌进已有的 manuscript.docx，保留原有格式）\ndoc <- read_docx() %>%\n  body_add_par(\"Table 2\", style = \"heading 2\") %>%\n  body_add_flextable(ft) %>%\n  body_add_par(\"Abbreviations: IVW, inverse variance weighted.\", style = \"Normal\")\nprint(doc, target = \"results/tables/Table2.docx\")\n\n# 备选：直接出 LaTeX / HTML\n# flextable::save_as_image(ft, \"results/figures/table2.png\")",
    "notes": [
      "border_remove() 必须放在加线之前，否则默认的网格线会残留。",
      "colformat_double 只影响显示，不改数据本身，导出后单元格仍是数值。",
      "字体设为 Times New Roman 是多数中文期刊对英文/数字的要求，中文正文另设宋体。"
    ],
    "pitfalls": [
      "body_add_flextable 的表格宽度默认按页面自适应，列多时会被压扁，用 width() 手动设列宽。",
      "set_caption 生成的是题注段，部分期刊要求表题在表上方，需要自己调整顺序。",
      "把 flextable 存成图片会丢矢量，投稿要 Word/PDF 时不要走图片路线。"
    ],
    "next": [
      "report-01",
      "report-03",
      "ml-12"
    ]
  },
  {
    "id": "report-03",
    "track": "report",
    "trackName": "报告与表格输出",
    "title": "参数化 R Markdown：一份模板跑多个数据集",
    "level": "进阶",
    "tags": [
      "RMarkdown",
      "参数化",
      "批量报告",
      "render"
    ],
    "packages": [
      "rmarkdown",
      "knitr",
      "yaml"
    ],
    "scene": "同样的分析要给 5 个数据集各出一份 Word 报告，不想复制 5 份 Rmd 再手改路径。",
    "code": "# ============================================================\n# 03 参数化报告：一份 Rmd + 循环 render\n# ============================================================\nlibrary(rmarkdown)\n\n# ---- Rmd 文件头（params 段）示例，写在 report_template.Rmd 里 ----\n# ---\n# title: \"`r params$dataset` 分析报告\"\n# params:\n#   dataset: \"GSE14520\"\n#   expr_file: \"data/processed/expr_GSE14520.rds\"\n#   group_col: \"group\"\n# output: word_document\n# ---\n\n# 正文里用 params$xxx 引用，例如：\n#   expr <- readRDS(params$expr_file)\n#   table(expr[[params$group_col]])\n\n# ---- 驱动脚本：批量渲染 ----\nruns <- data.frame(\n  dataset   = c(\"GSE14520\", \"GSE76427\", \"TCGA-LUAD\"),\n  expr_file = c(\"data/processed/expr_GSE14520.rds\",\n                \"data/processed/expr_GSE76427.rds\",\n                \"data/processed/tcga_luad.rds\")\n)\n\nfor (i in seq_len(nrow(runs))) {\n  rmarkdown::render(\n    input       = \"analysis/report_template.Rmd\",\n    params      = list(dataset   = runs$dataset[i],\n                       expr_file = runs$expr_file[i]),\n    output_file = paste0(\"results/reports/\", runs$dataset[i], \"_report.docx\"),\n    output_dir  = \"results/reports\",\n    envir       = new.env()      # 每个报告独立环境，避免变量串味\n  )\n}\n\n# ---- 需要 PDF 时：output_format 也可以在 render 里覆盖 ----\n# rmarkdown::render(\"report_template.Rmd\", output_format = \"pdf_document\",\n#                   params = list(dataset = \"GSE14520\"))\n\n# ---- 一键检查所有报告是否生成 ----\nlist.files(\"results/reports\", pattern = \"\\\\.docx$\")",
    "notes": [
      "envir = new.env() 很关键：不加的话第二次渲染会复用上一次的变量，出现“数据串台”的诡异结果。",
      "params 里的默认值要能跑通，否则单点 knit 按钮时会失败。",
      "output_file 用了变量时 output_dir 要单独指定，两者拼在一起才是最终路径。"
    ],
    "pitfalls": [
      "Rmd 里用绝对路径，换台电脑就全断，全部路径应基于 here::here() 或 params 传入。",
      "render 循环里报错会中断整个批次，外面套 tryCatch 才能“跑完所有能跑的”。",
      "同一份 Rmd 输出 docx 与 pdf 需要不同的字体设置（pdf 要 showtext），直接改 output_format 常报错。"
    ],
    "next": [
      "report-04",
      "report-05",
      "report-02"
    ]
  },
  {
    "id": "report-04",
    "track": "report",
    "trackName": "报告与表格输出",
    "title": "批量出图与命名规范：一次存 50 张图",
    "level": "常用",
    "tags": [
      "批量出图",
      "ggsave",
      "命名规范",
      "purrr"
    ],
    "packages": [
      "ggplot2",
      "purrr",
      "dplyr",
      "glue"
    ],
    "scene": "要对 50 个基因各画一张箱线图，手动改文件名存图能存到崩溃，还容易覆盖。",
    "code": "# ============================================================\n# 04 批量出图：统一尺寸、统一命名、失败可追踪\n# ============================================================\nlibrary(ggplot2)\nlibrary(purrr)\nlibrary(dplyr)\nlibrary(glue)\n\ndf <- readRDS(\"data/processed/plot_df.rds\")\ngenes <- c(\"TP53\", \"EGFR\", \"MYC\", \"KRAS\", \"PTEN\")\nout_dir <- \"results/figures/genes\"\ndir.create(out_dir, showWarnings = FALSE, recursive = TRUE)\n\n# 1) 写一个返回 ggplot 对象的函数（不要在函数里 ggsave）\nplot_one <- function(g) {\n  ggplot(df, aes(group, .data[[g]], fill = group)) +\n    geom_boxplot(outlier.size = 0.4, width = 0.6) +\n    ggpubr::stat_compare_means(method = \"wilcox.test\", label = \"p.format\") +\n    labs(title = g, x = NULL, y = \"log2 TPM\") +\n    theme_bw() + theme(legend.position = \"none\")\n}\n\n# 2) iwalk：同时拿到元素和名字，方便命名\nplots <- map(set_names(genes, genes), plot_one)\n\niwalk(plots, function(p, g) {\n  ggsave(filename = glue(\"{out_dir}/{g}_boxplot.pdf\"), plot = p,\n         width = 60, height = 70, units = \"mm\")\n})\n\n# 3) 出错不影响其他图：possibly 包一层\nsafe_save <- possibly(function(p, g) {\n  ggsave(glue(\"{out_dir}/{g}_boxplot.pdf\"), p, width = 60, height = 70, units = \"mm\")\n  TRUE\n}, otherwise = FALSE)\nres <- imap_lgl(plots, safe_save)\nsum(!res)      # 失败的数量，> 0 说明有图没存出来\n\n# 4) 命名规范：{数据集}_{分析}_{基因}_{日期}.pdf，避免覆盖\n#    glue(\"{dataset}_{analysis}_{g}_{format(Sys.Date(), '%Y%m%d')}.pdf\")\nlist.files(out_dir)",
    "notes": [
      "绘图函数只返回对象、保存交给外部，才能复用（拼图、批量改尺寸都靠这个）。",
      "文件名里带基因名/日期，避免不同批次互相覆盖，也方便回溯是哪次跑的。",
      "possibly / safely 让批量任务“部分失败也能继续”，比整批中断强得多。"
    ],
    "pitfalls": [
      "在 for 循环里用 ggsave 而不指定 plot 参数时，ggsave 会去存“最后一张图”，极易存错。",
      "文件名里含 Windows 非法字符（: * ? \" < > |）会静默失败或报错。",
      "ggsave 的默认 dpi 是 300，但 PDF 是矢量的，改 dpi 只影响位图元素（如 geom_point 的平滑）。"
    ],
    "next": [
      "report-03",
      "viz-11",
      "viz-06"
    ]
  },
  {
    "id": "report-05",
    "track": "report",
    "trackName": "报告与表格输出",
    "title": "一键复现：renv 锁定依赖 + 项目清单",
    "level": "进阶",
    "tags": [
      "renv",
      "复现性",
      "依赖管理",
      "sessionInfo"
    ],
    "packages": [
      "renv",
      "here",
      "sessioninfo"
    ],
    "scene": "半年后回看自己的项目，发现 Seurat 升级后代码跑不通了，或者合作者装不上同样的包版本。",
    "code": "# ============================================================\n# 05 复现性：版本锁定 + 环境快照 + 运行清单\n# ============================================================\nlibrary(renv)\n\n# ---- 1) 初始化项目环境（只做一次）----\nrenv::init()          # 会在项目根建 renv/ 与 renv.lock\n# 之后所有 install.packages 都会被记录到 lock 文件\n\n# ---- 2) 分析做完后，把当前实际用的版本写进 lock ----\nrenv::snapshot(prompt = FALSE)\n\n# ---- 3) 换机器/合作者：一条命令还原全部包版本 ----\n# renv::restore()\n\n# ---- 4) 检查依赖是否和 lock 一致（提交前跑一遍）----\nrenv::status()\n\n# ---- 5) 每次分析脚本结尾都留一份环境快照（人可读）----\nwriteLines(capture.output(sessionInfo()),\n           here::here(\"results/tables/sessionInfo.txt\"))\n# 更细的版本信息（含 Bioconductor 包）：\n# sessioninfo::session_info() %>% print()\n\n# ---- 6) 项目根放一份 README，写清运行顺序 ----\n# 01_io.R → 02_qc.R → 03_deg.R → 04_enrich.R → 05_figures.R\n# 每个脚本开头 here::i_am(\"analysis/03_deg.R\") 保证路径可移植",
    "notes": [
      "renv::snapshot 只记录项目里实际 library() 过的包，用 :: 临时调用的包可能漏记，跑一遍全流程再 snapshot。",
      "renv.lock 要提交到 git，renv/library/ 不要提交（体积大且与平台相关）。",
      "Bioconductor 包需要 renv 的设置里指定 Bioconductor 版本，否则 restore 会装成最新版。"
    ],
    "pitfalls": [
      "renv::init() 会把全局库隔离成项目库，之前的包“消失”了是正常现象，restore 后就回来。",
      "Windows 与 Linux 的二进制包不同，跨平台 restore 会走源码编译，耗时长且可能需要系统依赖。",
      "lock 文件里的 R 版本与当前 R 版本差异过大时 renv 会警告，大版本升级后要重跑验证。"
    ],
    "next": [
      "rbase-07",
      "report-03",
      "io-01"
    ]
  }
];
