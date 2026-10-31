# 嵩山一号 · 科研工作站

一个**纯静态、零后端、打开即用**的生信科研训练站：能读论文、写代码、跑 R、存数据、学机制、练写作、问导师。

- **在线地址**：（部署后填在这里）
- **本地运行**：双击 `启动工作站.bat`

## 它解决什么问题

生信学习最常见的断点不是"不会写代码"，而是**"不知道这一步在算什么、为什么这么算、审稿人会怎么挑刺"**。
本站在浏览器里内置了一个 WebAssembly 版 R 4.6.0（[WebR](https://docs.r-wasm.org/webr/latest/)），
把 27 关练习做成"打怪升级"：每关自带数据、故事、提示、参考答案和**自动判题**——判题脚本在真实 R 里跑，
会告诉你具体哪一步算错了，而不是简单判对错。

**关键设计**：WebR 里只有 base R，没有 Seurat / DESeq2 / clusterProfiler。
所以每一关都是**手撕底层算法**——自己写 `phyper` 富集、自己写 log-rank、自己写 ARI、自己写 Moran's I。
会用包不等于懂原理，这里走的是懂原理那条路。

## 功能

| 模块 | 内容 |
|---|---|
| 代码道场 | 27 关，十条赛道：R 基础 / Bulk / 单细胞 / 空间 / 孟德尔随机化 / 网络毒理学 / 药物重定位 / 机器学习 / 写作出图 / 终章 BOSS |
| 代码库 | 51 段可直接复制的 R 模板，附使用场景、依赖包、踩坑点 |
| 论文库 | 67 篇论文全清单，按方法标签反查"这一类题是怎么搭的" |
| 作战手册 | 8 步 SOP + 案例拆解 + 6 条学术红线 |
| 知识库 | 37 条机制与方法论条目（再生 / 癌症 / 放疗） |
| 数据中心 | 11 个内置练习数据集 + 20 个公共数据源入口与读取代码 |
| 数据仓库 | IndexedDB 本地存储，CSV 拖进来即可，不上传任何服务器 |
| 论文写作台 | IMRaD 逐节写，自动保存，导出 Markdown / 打印成 PDF |
| AI 导师 | 8 个预设角色，OpenAI 兼容接口，默认 DeepSeek；密钥只存本机 localStorage |

## 技术栈

- 纯 HTML / CSS / 原生 JS，哈希路由，**无构建步骤**
- [WebR](https://docs.r-wasm.org/webr/latest/) 提供浏览器内 R 运行时，走 `PostMessage` 通道
  （不需要 COOP/COEP 跨源隔离，因此任何静态托管都能跑）
- 状态存 localStorage，大文件存 IndexedDB
- 数据集以 CSV 内联在 `data/data.js` 里，离线可跑

## 目录结构

```
index.html
启动工作站.bat
assets/   theme.css store.js webr.js view-dojo.js view-lib.js view-write.js app.js
data/     data.js levels_core.js levels_adv.js codebank.js papers.js
          knowledge.js myscripts.js writing.js tutors.js
dist/     对外发布副本（脱敏后）
_build/   数据生成与校验脚本（使用不需要）
```

## 本地运行

```bash
python -m http.server 8901
# 打开 http://localhost:8901/index.html
```

**必须通过 http 打开，不能直接双击 index.html**：`file://` 协议下 WebR 的 Worker 与 AI 导师请求都会被浏览器拦截。

首次进入代码道场需要下载约 11 MB 的 R 运行时，等待 20–80 秒属正常。

## 隐私

- 所有数据都在浏览器本地，没有任何后端，不采集任何信息。
- AI 导师的 API Key 只存在你的浏览器 localStorage，只发往你填写的地址。
- 本仓库的 `dist/` 为脱敏发布版，已去除个人姓名、院校与指导老师姓名。

## 许可

代码 MIT。论文元数据来自 Europe PMC，数据集为教学用途的合成数据。
