/* 嵩山一号 · 工作站 —— 通用课程（不依赖本课题数据，任何人拿 mtcars/iris 就能从头学） */
window.SX_COURSE = {
  intro: "这门课和「代码道场」是两条路：道场是挂在本课题真数据上的练习题，这门课是通用基础——只用 R 自带的数据集，从「1+1 怎么写」讲到「怎么把结果整理成能投的表格」。26 节，每节三段：为什么、要点、能直接跑的代码。看懂一节就去道场找对应的关卡练手。",
  chapters: [
    {
      id: "c1", title: "第 1 章 从零开始",
      subs: [
        {
          t: "1.1 代码就是命令，回车就执行",
          why: "R 没有「编译」这一步，你写一行它算一行。所以学 R 最快的办法不是背语法，是把每一行都跑一遍、看它吐出什么。",
          pts: [
            "`<-` 是赋值，意思是「把右边算出来的东西存到左边这个名字里」；`=` 也能用，但在函数参数里含义不同，初学一律用 `<-`。",
            "井号 `#` 后面是注释，R 不会执行——写给人看的。",
            "报错不要慌，读最后一行：它一般直接告诉你「哪个对象不存在」或「哪个参数没给」。"
          ],
          code: `1 + 1                 # 算术：结果直接打印
sqrt(16)              # 函数调用：函数名(参数)
x <- 5                # 赋值，屏幕上什么都不出现
x * 2                 # 用的时候才出现
x <- 6                # 再赋值就覆盖了，R 不会问你
c(x, x * 2, sqrt(x))  # c() 把几个值拼成一个向量`
        },
        {
          t: "1.2 名字怎么起、什么时候会被覆盖",
          why: "R 的工作环境里所有东西都有名字。你起错名字不会报错，只会让你后面找不到东西——这是新手最常见的耗时点。",
          pts: [
            "名字只能由字母、数字、下划线、点组成，不能以数字开头，区分大小写（`X` 和 `x` 是两个东西）。",
            "不要用 `c`、`t`、`data`、`mean` 这类已经存在的函数名当变量名，会把函数盖掉。",
            "`ls()` 看当前有哪些对象，`rm(x)` 删掉一个——环境脏了先清，比debug快。"
          ],
          code: `a <- 1; A <- 2
a; A                  # 区分大小写

ls()                  # 当前环境里有哪些对象

y <- 10
y <- y + 1            # 右边先算，再赋回左边
y                     # 11

rm(y)                 # 删掉
exists("y")           # FALSE`
        },
        {
          t: "1.3 卡住了怎么查",
          why: "九成的卡壳不是逻辑难，是「不知道这个函数要什么参数」。查文档这件事必须变成肌肉记忆。",
          pts: [
            "`?函数名` 看帮助；`args(函数名)` 只看参数列表，比翻整页文档快。",
            "不确定类型时用 `class()` / `str()`，比猜快十倍。",
            "三个高频报错：`object not found`（名字拼错或没赋值）、`argument ... is missing`（少给参数）、`non-numeric argument`（把字符当数字算了）。"
          ],
          code: `args(mean)            # 看 mean 要哪些参数
# ?mean               # 交互式 R 里打开帮助页；写进脚本时留成注释

class(1:3)            # integer
class("a")            # character
class(TRUE)           # logical
str(mtcars)           # 一个数据框的结构，一眼看清每列类型

mean(c(1, 2, NA))     # NA 会污染结果 → NA
mean(c(1, 2, NA), na.rm = TRUE)   # 加参数才算出 1.5`
        }
      ]
    },
    {
      id: "c2", title: "第 2 章 数据结构：五种容器",
      subs: [
        {
          t: "2.1 向量：最基本的一串数",
          why: "R 里几乎所有运算都是「对整个向量一起算」，不用写循环。理解这一点，后面所有代码都能看懂。",
          pts: [
            "一个向量只能有一种类型；`c(1, \"a\")` 会把数字强制变成字符。",
            "`NA` 是缺失值，参与运算会传染；`NaN` 是「算不出来」（如 0/0）。",
            "向量化：`x * 2` 是对每个元素各乘 2，不需要 for 循环。"
          ],
          code: `x <- c(3, 1, 4, 1, 5)
x * 2                 # 每个元素都乘 2
length(x); sum(x); mean(x)
sort(x); rev(sort(x)) # 排序、倒序
x[x > 2]              # 逻辑筛选，只要大于 2 的

c(1, "a")             # 全变字符了，注意
class(c(1, "a"))`
        },
        {
          t: "2.2 矩阵：按列存的二维表",
          why: "表达矩阵、距离矩阵、邻接矩阵都是矩阵。R 默认**按列**填充，这是最容易搞错方向的一处。",
          pts: [
            "`matrix(1:6, nrow = 2)` 得到 2 行 3 列，填的顺序是「先填满第 1 列，再填第 2 列」。",
            "取元素用 `m[行, 列]`，逗号前空着表示所有行，逗号后空着表示所有列。",
            "`t(m)` 转置；`rowMeans` / `colMeans` 按行/按列求均值，比 `apply` 快。"
          ],
          code: `m <- matrix(1:6, nrow = 2)
m                     # 第 1 列是 1,2；第 2 列是 3,4
dim(m)                # 2 行 3 列
m[1, ]                # 第 1 行
m[, 2]                # 第 2 列
m[1, 2]               # 单个元素

t(m)                  # 转置，2x3 变 3x2
rowMeans(m); colMeans(m)

rownames(m) <- c("g1", "g2")
colnames(m) <- c("s1", "s2", "s3")
m["g1", "s2"]`
        },
        {
          t: "2.3 数据框：一张表，每列一个向量",
          why: "你 90% 的时间在处理数据框。它是「列可以不同类型」的二维表，也是所有统计函数的输入格式。",
          pts: [
            "`df$列名` 取一列（得到向量）；`df[\"列名\"]` 取一列（得到数据框），两者差一对方括号，结果类型不同。",
            "`head()` / `str()` / `summary()` 三件套，拿到任何新表先跑这三个。",
            "新建列直接赋值：`df$new <- ...`，长度必须等于行数或为 1。"
          ],
          code: `d <- data.frame(gene = c("A", "B", "C"),
                logFC = c(1.2, -0.8, 0.3),
                p = c(0.01, 0.2, 0.04))
d
str(d)                # 3 个观测、3 个变量，类型一目了然
d$logFC               # 向量
d["logFC"]            # 数据框（一列的表）
d$sig <- d$p < 0.05   # 加一列逻辑值
d[order(d$p), ]       # 按 p 排序`
        },
        {
          t: "2.4 列表与因子：装杂物的箱子、带顺序的标签",
          why: "列表能装任何东西（模型结果、多个表）；因子决定分组顺序和图上的排列——这两样不会，后面画图和建模都会卡。",
          pts: [
            "`list()` 里每样东西可以有名字，用 `l$名字` 或 `l[[\"名字\"]]` 取；`[[ ]]` 取出的是原件，`[ ]` 取出的还是列表。",
            "`factor()` 有「水平（levels）」，默认按字母排；想按大小排就显式给 `levels=`。",
            "画箱线图、做分组统计时，顺序错了图就错了，所以因子顺序要专门检查一次。"
          ],
          code: `l <- list(a = 1:3, b = "文本", c = data.frame(x = 1))
l$a                   # 向量
l[["a"]]              # 同上
class(l["a"])         # 还是 list，注意区别

g <- c("高", "低", "中", "高")
factor(g)             # 水平按拼音/字母排
factor(g, levels = c("低", "中", "高"))   # 显式指定顺序
table(factor(g, levels = c("低", "中", "高")))`
        }
      ]
    },
    {
      id: "c3", title: "第 3 章 取子集与分组计算",
      subs: [
        {
          t: "3.1 逻辑筛选：== & | 与 %in%",
          why: "「把符合条件的那部分挑出来」是数据分析里最高频的动作，写法就一种：方括号里放逻辑向量。",
          pts: [
            "比较用 `==`（两个等号），`=` 是赋值，混用是新手第一大错。",
            "多个条件用 `&`（且）和 `|`（或），不要用 `&&`（那是给单个值用的）。",
            "「属于某个集合」用 `%in%`，比写一长串 `|` 干净。"
          ],
          code: `d <- mtcars
d[d$mpg > 25, c("mpg", "cyl")]        # 油耗大于 25 的车
d[d$cyl == 4 & d$hp > 100, ]          # 两个条件同时满足
d[d$cyl %in% c(6, 8), "mpg"]          # 属于集合就选中
sum(d$mpg > 25)                       # 逻辑值求和 = 计数
mean(d$cyl == 4)                      # 占比，TRUE 当 1`
        },
        {
          t: "3.2 按位置、按名字取",
          why: "真实数据里列的顺序会变、列名可能带空格，所以「按名字取」比「按第几列取」稳。",
          pts: [
            "`d[, 1]` 按位置取第 1 列；`d[, \"mpg\"]` 按名字取，列顺序变了也不会错。",
            "`d[1:5, ]` 取前 5 行；`d[-1, ]` 去掉第 1 行。",
            "取列名带空格的要用反引号或 `[[\"名字\"]]`，所以第一件事是把列名洗干净。"
          ],
          code: `d <- mtcars
d[1:3, 1:2]                 # 前 3 行、前 2 列
d[, "mpg"][1:5]             # 按名字取列，再取前 5 个值
names(d)                    # 所有列名
names(d)[1] <- "miles"      # 改列名
d[, c("miles", "cyl")][1:3, ]`
        },
        {
          t: "3.3 分组计算三件套",
          why: "「按组求均值」是生信里出现最多的操作。三种写法都要会，因为它们分别适合「一组一个数」「一组一张表」「一组一个模型」。",
          pts: [
            "`tapply(值, 分组, 函数)`：一组一个数，最短。",
            "`aggregate(值 ~ 分组, data, 函数)`：一组一行，返回数据框，方便继续处理。",
            "`split(数据, 分组)` + `lapply()`：一组一个任意结果，最灵活（比如每组跑一个模型）。"
          ],
          code: `tapply(mtcars$mpg, mtcars$cyl, mean)          # 一组一个均值

aggregate(mpg ~ cyl, data = mtcars, FUN = mean)  # 一组一行
aggregate(cbind(mpg, hp) ~ cyl, data = mtcars,   # 多列一起汇总
          FUN = mean)

sp <- split(mtcars, mtcars$cyl)                  # 一组一张表
length(sp)                                       # 3 组
lapply(sp, function(x) range(x$mpg))             # 每组油耗范围`
        },
        {
          t: "3.4 apply 家族：什么时候用哪个",
          why: "这三兄弟是「不用写循环」的关键。记一句就够：按行/列算用 apply，返回同长度向量用 sapply，返回列表用 lapply。",
          pts: [
            "`apply(矩阵, 1, 函数)` 的 1 表示按行，2 表示按列——和 `[行, 列]` 的顺序一致。",
            "`sapply` 会尽量把结果简化成向量/矩阵，方便直接进 `data.frame()`。",
            "结果长度不一致（比如每组基因数不同）时只能用 `lapply`，它会老实返回列表。"
          ],
          code: `m <- as.matrix(mtcars[, c("mpg", "hp", "wt")])
apply(m, 2, mean)              # 按列（每个变量）求均值
apply(m, 1, sum)[1:5]          # 按行（每辆车）求和

sapply(1:3, function(i) i^2)   # 简化成向量
lapply(1:3, function(i) i^2)   # 返回列表
sapply(split(mtcars$mpg, mtcars$cyl), mean)   # 分组 + 简化`
        }
      ]
    },
    {
      id: "c4", title: "第 4 章 读数据与清洗",
      subs: [
        {
          t: "4.1 read.csv 的四个关键参数",
          why: "读进来就错了，后面全错。四个参数能挡掉八成问题。",
          pts: [
            "`header = TRUE` 表示第一行是列名；`row.names = 1` 把第一列当作行名（表达矩阵常用）。",
            "`check.names = FALSE` 保住带连字符的列名，否则 `TCGA-T1` 会被改成 `TCGA.T1`。",
            "`stringsAsFactors = FALSE` 让字符保持字符（老版本 R 默认转因子）。"
          ],
          code: `# 先在本地写一个 csv，再读回来，看清参数的作用
tmp <- tempfile(fileext = ".csv")
write.csv(data.frame(id = c("A-1", "B-2"), v = c(1, 2)),
          tmp, row.names = FALSE)
read.csv(tmp)                          # 正常读
read.csv(tmp, check.names = FALSE)     # 保住列名里的连字符

d <- read.csv(tmp, stringsAsFactors = FALSE)
str(d)                                 # 确认 id 是 character`
        },
        {
          t: "4.2 类型转换与缺失值",
          why: "「明明是数字却算不了」几乎全是类型问题；「算出来是 NA」几乎全是缺失值没处理。",
          pts: [
            "`as.numeric()` 遇到非数字会变 NA 并给警告——警告要看，它告诉你哪几个值坏了。",
            "`is.na()` 判断缺失，`sum(is.na(x))` 数有几个，`na.omit()` 整行删。",
            "不要无脑删缺失：先想清楚这列缺失是「没测」还是「没有」，两者处理方式不同。"
          ],
          code: `v <- c("1", "2", "x", "4")
as.numeric(v)                  # 第 3 个变 NA，并给警告
sum(is.na(as.numeric(v)))      # 有几个坏了

d <- data.frame(a = c(1, NA, 3), b = c("x", "y", NA))
is.na(d$b)
colSums(is.na(d))              # 每列缺几个
d[complete.cases(d), ]         # 只留完整的行
mean(d$a, na.rm = TRUE)`
        },
        {
          t: "4.3 合并与宽长转换",
          why: "把「表达矩阵」变成「一行一个观测的长表」，是画图和建模的前提；把两张表按共同列拼起来，是整合数据的前提。",
          pts: [
            "`merge(x, y, by = \"列名\")` 相当于 SQL 的 join，默认取交集（inner join）。",
            "宽转长的核心是「骨架顺序」和「取值顺序」对上：`expand.grid` 让第一个变量变最快，`as.vector(矩阵)` 按列展开也是第一个变量变最快。",
            "合并前先确认两边「共同的列」名字是否一样、有没有重复值，否则行数会暴涨。"
          ],
          code: `expr <- data.frame(gene = c("g1", "g2"),
                   s1 = c(5, 6), s2 = c(7, 8))
meta <- data.frame(sample = c("s1", "s2"),
                   group = c("ctrl", "trt"))

long <- expand.grid(gene = expr$gene, sample = c("s1", "s2"))
long$value <- as.vector(as.matrix(expr[, c("s1", "s2")]))
long
merge(long, meta, by = "sample")     # 拼上分组信息`
        }
      ]
    },
    {
      id: "c5", title: "第 5 章 统计基本功",
      subs: [
        {
          t: "5.1 先看分布，再选方法",
          why: "所有检验都有前提。不看分布直接跑 t 检验，是最常见的「结果不可信」来源。",
          pts: [
            "`summary()` 给五数概括；`sd()` 是标准差，`var()` 是方差（注意 n-1）。",
            "偏态明显（均值远离中位数、长尾巴）就该考虑秩和检验或先做变换。",
            "`shapiro.test()` 检验正态性，但样本量一大就过度敏感——别把它当唯一标准，看图更靠谱。"
          ],
          code: `x <- mtcars$mpg
summary(x)                 # 最小/四分位/中位/均值/最大
sd(x); var(x)
hist(x)                    # 先看图，别只看数字
shapiro.test(x)            # p 小 → 偏离正态（样本大时慎用）

y <- mtcars$wt
cor(x, y)                  # 相关系数
cor.test(x, y, method = "spearman")   # 秩相关，抗离群`
        },
        {
          t: "5.2 两组比较：t 还是 Wilcoxon",
          why: "这两者回答的是同一个问题（两组有没有差别），区别在于「信不信正态」。选错的代价是结论站不住。",
          pts: [
            "`t.test()` 默认是 Welch 版本（不假设方差齐），样本小又明显偏态时别用。",
            "`wilcox.test()` 比的是中位数/秩，抗离群值，代价是效能低一些。",
            "报告要写清：用了哪个检验、单双侧、n 是多少——这三样缺一个都复现不了。"
          ],
          code: `a <- mtcars$mpg[mtcars$cyl == 4]
b <- mtcars$mpg[mtcars$cyl == 8]

t.test(a, b)                       # Welch t 检验
t.test(a, b, var.equal = TRUE)     # 假设方差齐的版本
wilcox.test(a, b)                  # 秩和检验

c(n1 = length(a), n2 = length(b),
  diff = mean(a) - mean(b))        # 报结果必备的三样`
        },
        {
          t: "5.3 多组比较：ANOVA 与事后检验",
          why: "三组以上反复做 t 检验会把假阳性率越推越高，正确做法是先用方差分析看整体，再做两两比较并校正。",
          pts: [
            "`aov(值 ~ 分组, data)` 做方差分析，`summary()` 看整体 p 值。",
            "`TukeyHSD()` 做所有两两比较并自带校正，比手工做多次 t 检验稳。",
            "分组必须先是因子，否则 `aov` 会把它当连续变量——这是最常见的翻车点。"
          ],
          code: `d <- mtcars
d$cyl <- factor(d$cyl)             # 关键一步
fit <- aov(mpg ~ cyl, data = d)
summary(fit)                       # 整体有没有差别
TukeyHSD(fit)                      # 哪两组有差别

table(d$cyl)                       # 每组样本量，差太多要谨慎`
        },
        {
          t: "5.4 多重检验与相关矩阵",
          why: "一次检验 1 万个基因，按 p<0.05 会白捡 500 个「显著」。校正不是可选项，是必做项。",
          pts: [
            "`p.adjust(p, \"BH\")` 控制 FDR，是转录组的标准做法；Bonferroni 太保守，会杀掉真信号。",
            "校正后要报的是 `adj.P`，图上标的也是它——正文里偷偷报原始 p 是学术不端。",
            "相关分析同理：算几百个基因与临床指标的相关，必须校正，并说明用了 Pearson 还是 Spearman。"
          ],
          code: `p <- c(0.001, 0.01, 0.03, 0.2, 0.6)
p.adjust(p, "BH")                  # FDR 校正
p.adjust(p, "bonferroni")          # 除以检验次数

m <- cor(mtcars[, c("mpg", "hp", "wt", "qsec")])
round(m, 2)
m[upper.tri(m)] <- NA              # 只留下三角，看着清爽
round(m, 2)`
        }
      ]
    },
    {
      id: "c6", title: "第 6 章 绘图：先把图画对，再谈好看",
      subs: [
        {
          t: "6.1 base plot：一张图的最小构成",
          why: "散点图是所有图的祖先。会画散点，就会改造坐标轴、标题、点样式——其他图都是它的变体。",
          pts: [
            "`plot(x, y)` 画散点；`type = \"l\"` 改成线，`pch` 改点形状，`col` 改颜色。",
            "`main` 标题、`xlab`/`ylab` 轴标题——英文图里单位要写进轴标题，不要写进图注。",
            "`par(mfrow = c(1, 2))` 一页放两张图，出多面板图必备。"
          ],
          code: `plot(mtcars$wt, mtcars$mpg,
     pch = 19, col = "steelblue",
     xlab = "Weight (1000 lbs)", ylab = "MPG",
     main = "Weight vs fuel economy")
abline(lm(mpg ~ wt, data = mtcars), col = "red", lty = 2)

par(mfrow = c(1, 2))               # 一页两图
hist(mtcars$mpg, main = "MPG")
boxplot(mpg ~ cyl, data = mtcars, main = "MPG by cylinder")
par(mfrow = c(1, 1))               # 记得改回来`
        },
        {
          t: "6.2 三类主图：箱线、直方、热图",
          why: "生信论文里九成的图就是这三类加一个散点。每类解决一个特定问题，选错了图，读者就看不出你想说的。",
          pts: [
            "箱线图看「组间分布差异」，但它藏住了样本量和双峰——样本少时把点叠上去（`stripchart`）。",
            "直方图看「一个变量的形状」；`breaks` 决定分箱，分箱一改观感全变，别只画一版就下结论。",
            "热图看「矩阵里的模式」；一定要有行/列聚类和颜色条，否则读者无法判断尺度。"
          ],
          code: `boxplot(mpg ~ cyl, data = mtcars, col = "grey90",
        xlab = "Cylinder", ylab = "MPG")
stripchart(mpg ~ cyl, data = mtcars, vertical = TRUE,
           method = "jitter", add = TRUE, pch = 19, cex = 0.6)

hist(mtcars$mpg, breaks = 10, col = "grey80", main = "")

m <- as.matrix(mtcars[, c("mpg", "hp", "wt", "qsec")])
heatmap(scale(m), scale = "none", margins = c(6, 8))`
        },
        {
          t: "6.3 图注与配色：让图自己说清楚",
          why: "审稿人先看图注再决定要不要看图。图注写不清，图等于没画；配色乱，读者找不到重点。",
          pts: [
            "图注四件套：画的是什么（panel 说明）、样本量 n、统计方法、显著性标记含义。",
            "配色只做一件事：区分组别。别用彩虹色，别用红绿对立（色盲看不出）。",
            "字号不要小于 7 pt，导出时用矢量（PDF）——位图放大会糊，返修时被要求重做很常见。"
          ],
          code: `legend_text <- paste0(
  "Figure 1. Fuel economy across cylinder groups. ",
  "Boxes show median and interquartile range; n = ",
  paste(tapply(mtcars$mpg, mtcars$cyl, length), collapse = " / "),
  " cars for 4 / 6 / 8 cylinders. ",
  "P values from one-way ANOVA with Tukey correction. ",
  "* adjusted P < 0.05; ** < 0.01; ns, not significant.")
cat(legend_text, sep = "\n")`
        }
      ]
    },
    {
      id: "c7", title: "第 7 章 生信通用流程：四步走到终点",
      subs: [
        {
          t: "7.1 表达矩阵长什么样",
          why: "所有转录组分析的输入都是同一张表：行是基因、列是样本、值是表达量。搞清它，换任何数据集都只是换文件名。",
          pts: [
            "原始 count 是整数、方差随均值增大；log2 之后才近似正态，才适合 t 检验这类方法。",
            "TPM/FPKM 已按长度和深度归一，跨样本可比；count 不能直接跨样本比，要交给 DESeq2 这类模型。",
            "行名必须是基因、列名必须是样本——一旦转置，后面全错，而报错往往很晚才出现。"
          ],
          code: `set.seed(1)
expr <- matrix(rpois(20, lambda = 50), nrow = 5,
               dimnames = list(paste0("g", 1:5), paste0("s", 1:4)))
expr                                # 整数 count，行=基因、列=样本
dim(expr)

log2(expr + 1)                      # 加 1 避免 log(0)
rowMeans(expr); colSums(expr)       # 每个基因均值、每个样本测序深度

# 转置是灾难的开始：转完行就变成样本了
dim(t(expr))`
        },
        {
          t: "7.2 差异分析到底在算什么",
          why: "不论用 DESeq2 还是 limma，本质都是三件事：算倍数变化、算这个变化可不可信、对成千上万次检验做校正。",
          pts: [
            "`logFC = 处理组均值 - 对照组均值`（log2 尺度下），所以 logFC=1 就是翻倍。",
            "p 值回答「这个差是不是偶然」，不回答「这个差大不大」——两个都要看。",
            "`adj.P` 才是能写进论文的那个；阈值要事先定好，不能看完结果再调。"
          ],
          code: `set.seed(2)
x <- matrix(rnorm(200, 8, 1), nrow = 20,
            dimnames = list(paste0("g", 1:20), paste0("s", 1:10)))
x[1, 6:10] <- x[1, 6:10] + 2      # 第 1 个基因人为上调 2 倍

trt <- 6:10; ctl <- 1:5
lfc <- rowMeans(x[, trt]) - rowMeans(x[, ctl])
p <- apply(x, 1, function(v) t.test(v[trt], v[ctl])$p.value)
deg <- data.frame(gene = rownames(x), logFC = lfc, p = p)
deg$adj.P <- p.adjust(deg$p, "BH")
deg[order(deg$adj.P), ][1:3, ]`
        },
        {
          t: "7.3 富集与生存：两个高频下游",
          why: "拿到差异基因之后，几乎必然要做两件事：这些基因挤在哪些通路里（富集）、表达高低和结局有没有关系（生存）。",
          pts: [
            "富集分析的数学是超几何分布：从背景里随机抽这么多基因，恰好抽中通路里这么多个的概率。",
            "KM 曲线是「每遇到一次事件，生存率乘一次当时未发生比例」；log-rank 检验两组曲线是否整体不同。",
            "富集要写清背景基因集（是全部基因还是检测到的基因），生存要写清随访时间单位与删失处理。"
          ],
          code: `# 富集：4 个数字的超几何检验
# 背景 100 个基因，通路 10 个，候选 20 个里命中 4 个
phyper(4 - 1, 10, 100 - 10, 20, lower.tail = FALSE)

# 生存：手写乘积限估计
tm <- c(2, 4, 6, 8, 10, 12); st <- c(1, 0, 1, 1, 0, 1)
km <- function(tm, st) {
  s <- 1; out <- data.frame(time = 0, surv = 1)
  for (t in sort(unique(tm[st == 1]))) {
    n <- sum(tm >= t); d <- sum(tm == t & st == 1)
    s <- s * (1 - d / n)
    out <- rbind(out, data.frame(time = t, surv = s))
  }
  out
}
km(tm, st)`
        }
      ]
    },
    {
      id: "c8", title: "第 8 章 可复现与交付",
      subs: [
        {
          t: "8.1 项目结构与脚本规范",
          why: "半年后回来看自己的代码，能一眼跑通，靠的不是记性，是结构。这也是导师和审稿人判断你靠不靠谱的第一眼。",
          pts: [
            "目录分三层：`data/`（只读原始数据，永不覆盖）、`analysis/`（按 01、02 编号的脚本）、`result/`（脚本产物，可随时删了重跑）。",
            "**绝不用 `setwd()`**：路径从项目根目录出发，换台电脑才不会崩。",
            "每个脚本开头写清「输入什么、输出什么、依赖什么包、跑多久」，这一段比代码本身更值钱。"
          ],
          code: `# 先在临时目录造出 data/raw 下那两个文件，这样这段代码能直接跑通
d <- file.path(tempdir(), "data", "raw")
dir.create(d, recursive = TRUE, showWarnings = FALSE)
e0 <- data.frame(g1 = c(5, 6), g2 = c(7, 8), row.names = c("A", "B"))
write.csv(e0, file.path(d, "expr.csv"))
write.csv(data.frame(sample = c("g1", "g2"), group = c("ctrl", "trt")),
          file.path(d, "meta.csv"), row.names = FALSE)

# ---- 下面是任何分析脚本都该有的开头（照抄改路径） ----
# 输入：data/raw/expr.csv, data/raw/meta.csv
# 输出：result/tables/deg.csv
# 依赖：base R
expr <- read.csv(file.path(d, "expr.csv"), row.names = 1, check.names = FALSE)
meta <- read.csv(file.path(d, "meta.csv"), stringsAsFactors = FALSE)

# 检查（永远先检查再分析，不要跳过）
stopifnot(ncol(expr) == nrow(meta),
          all(colnames(expr) == meta$sample))
dim(expr)
meta$group`
        },
        {
          t: "8.2 表格与图注：把结果整理成能投的样子",
          why: "分析做完只是半成品。数字靠手抄进 Word，改一次分析就得改三处，迟早对不上——所以表格必须由代码生成。",
          pts: [
            "`sprintf()` 控制小数位：`%.3f` 三位小数、`%.2e` 科学计数法、`%s` 字符。",
            "Markdown 表格 = 表头 + 分隔行 + 数据行，三部分用 `c()` 拼起来，`cat(sep = \"\\n\")` 输出。",
            "图注里所有会变的数字（n、p 值、阈值）都用变量拼，别手打——这是「数字永远同步」的唯一办法。"
          ],
          code: `res <- data.frame(gene = c("TFRC", "SPP1", "YAP1"),
                  logFC = c(3.069, 3.432, 3.070),
                  adj = c(2.3e-09, 2.1e-08, 2.1e-08))
tbl <- c("| Gene | logFC | adj.P |",
         "|---|---:|---:|",
         sprintf("| %s | %.3f | %.2e |", res$gene, res$logFC, res$adj))
cat(tbl, sep = "\\n")

n <- nrow(res)
cat(sprintf("Table 1. Top %d genes ranked by adjusted P.\\n", n))`
        }
      ]
    }
  ]
};
