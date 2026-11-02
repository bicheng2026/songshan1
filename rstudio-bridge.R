# 嵩山一号 · 工作站 —— 本机 R 桥接
# 让别人（或你自己）用电脑上的完整 R 环境来跑练习台右边的代码（能装包、读本地文件）
# 用法（任选其一）：
#   1) 双击本文件（用 Rscript 运行）
#   2) 在 R / RStudio 里执行：  source("rstudio-bridge.R")
# 然后回到工作站练习台，点「连接本机 R」。
if (!requireNamespace("httpuv", quietly = TRUE)) install.packages("httpuv")
if (!requireNamespace("jsonlite", quietly = TRUE)) install.packages("jsonlite")
library(httpuv); library(jsonlite)

PORT <- 19810
CORS <- list(
  "Access-Control-Allow-Origin" = "*",
  "Access-Control-Allow-Methods" = "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers" = "Content-Type"
)

app <- list(
  call = function(req) {
    if (req$REQUEST_METHOD == "OPTIONS")
      return(list(status = 200, headers = CORS, body = ""))
    if (req$PATH_INFO == "/ping")
      return(list(status = 200, headers = CORS, body = toJSON(list(ok = TRUE), auto_unbox = TRUE)))
    if (req$PATH_INFO == "/run" && req$REQUEST_METHOD == "POST") {
      body <- rawToChar(req$rook.input$read())
      code <- tryCatch(fromJSON(body)$code, error = function(e) "")
      result <- tryCatch({
        out <- capture.output(eval(parse(text = code), envir = .GlobalEnv))
        list(output = paste(out, collapse = "\n"), error = "")
      }, error = function(e) list(output = "", error = paste("错误:", e$message)))
      return(list(status = 200, headers = CORS,
                  body = toJSON(result, auto_unbox = TRUE)))
    }
    list(status = 404, headers = CORS, body = "not found")
  }
)

cat("本地 R 桥接已启动： http://127.0.0.1:", PORT, "\n", sep = "")
cat("回到工作站练习台，点「连接本机 R」即可使用。按 Ctrl+C 停止。\n")
runApp(app, port = PORT)
