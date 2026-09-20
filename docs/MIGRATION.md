# 三仓迁移记录

迁移日期：2026-09-20

## 主仓

`foxmuldery/worrybottle` 保留为当前主仓，后续可在部署稳定后另行改名为 `worryseed`。

## 来源与去向

### worrybottle

保留并重写：创建记录、本地存储、等待/回访/解决状态、感悟追加、提前查看的核心状态机。深海玻璃、瓶子类型、封存/开瓶/烟花表现层不再使用。

### worrybox

迁入：工作/感情/家庭/学习/人际关系/其他标签，1/7/30/90/365 天回访周期，“已解决=成长记录”的产品思想。旧多页 HTML 与重复的 LocalStorage 实现不迁入。

### worrybottle-page

迁入 `site/`：产品理念、四步流程、隐私说明和应用入口。瓶子视觉、旧部署链接、联系表单与旧开发者介绍不迁入。

## 数据兼容策略

应用首次启动且没有新版数据时，会从以下键复制数据：

- `worryBottles` → `worrySeedsV1`
- `worries` → `worrySeedsV1`

迁移过程不修改或删除旧键，可以回退到旧版本。

## 新状态映射

| 旧状态 | 新状态 |
| --- | --- |
| sealed | growing |
| openable / 到期 | review |
| resolved / solved | fruited |
| reflections | growthLogs |
| sealUntil / openTime | nextReviewAt |

## 归档判断

- `foxmuldery/worrybox`：迁移完成后只读归档。
- `foxmuldery/worrybottle-page`：宣传页迁入主仓后只读归档。
- 不删除任何仓库，不改写旧仓历史。
