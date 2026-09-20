# 烦恼种子

把烦恼种下，让解决过程长成一棵树。

## 产品流程

1. 用最长 60 秒语音或文字记录烦恼。
2. 设定回访时间，种下一颗种子。
3. 持续追加行动、变化、失败与总结，形成生长年轮。
4. 问题解决后开花结果；仍未解决则继续生长。

## 本地运行

这是无构建步骤的静态 Web 应用。由于麦克风和 IndexedDB 需要安全上下文，请使用本地服务器：

```bash
python3 -m http.server 4173
```

打开 `http://localhost:4173`。

## 数据与兼容

- 新版元数据存储于 `localStorage.worrySeedsV1`。
- 录音 Blob 存储于 IndexedDB `WorrySeedAudio`。
- 首次启动会只读迁移旧版 `worryBottles` 与 `worries` 数据，不删除旧键。
- 无需账号，不会自动上传录音或烦恼内容。

## 仓库结构

- `index.html`：应用界面。
- `styles.css`：烦恼种子视觉系统。
- `app.js`：录音、种子状态、回访与旧数据迁移。
- `site/`：由原 `worrybottle-page` 收束而来的产品介绍页。
- `docs/MIGRATION.md`：三仓迁移与归档记录。
