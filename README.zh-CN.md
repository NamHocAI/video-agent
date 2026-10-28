# Video Agent — 先审分镜再渲染的短视频剪辑工具（Claude Code）

[English](README.md) · [Tiếng Việt](README.vi.md) · **简体中文**

这是一个 Claude Code 工作区，把一段口播原始素材剪成竖屏短视频（1080×1920）。它先从参考视频学习风格，在你自己的素材上画出分镜，等你确认后才开始渲染。全部在本机运行（Node、ffmpeg、Chrome）：不用付费服务，不上传任何视频。

## 工作方式

在你确认一个便宜的步骤之前，不做任何耗时的工作。

| 步骤 | 你会看到 | 你来决定 |
|---|---|---|
| 0. 风格 | 逐镜头测量参考视频：剪辑节奏、人脸大小、推镜、标题、音乐音量、音效位置 | 风格名称 |
| 1. 开始 | 测量你的素材（出镜比例、人声、语速、录屏），并给出建议格式及依据 | 确认或更换格式 |
| 2. 分镜 | 每一段都有静帧和 **在真实素材上播放的 GIF 动图**，风格的 2–3 个配色/字体变体，音效、运动和封面选项 | 逐段确认，或在画面上画批注 |
| 3. 确认 | 成片在独立进程中自动渲染 | — |
| 4. 检查 | 分段渲染与预览对比、每段响度、与参考视频并排对比、一张全尺寸画面 | 批注 → 修改 |

## 包含内容

- **分镜关卡**（`.claude/skills/storyboard-gate/`）：每次剪新素材前默认开启。测量素材、建议格式、生成本地审阅页面（`http://127.0.0.1:4747`），只有点击 **确认并生成成片** 后才导出。
- **预览与渲染共用一份 spec**（`cardspec.mjs`）：你确认的就是最终渲染的。
- **动态预览**（`gif.mjs`）：每段以半分辨率在真实素材上渲染，循环成 GIF。
- **风格变体**：每个风格有 2–3 个配色/字体变体（`styles/<风格>/bien-the/<变体>/`），切换后所有预览按该变体重绘。
- **安全网渲染**（`auto-final.mjs`）：点击确认即在后台生成成片，会话中断也有成片；会话仍在时照常完成全部检查。
- **带断点的渲染**（`render-seg.mjs`）：某段失败后从该段继续。
- **质量检查**（`qc.mjs`、`seg-gain.mjs`、`compare.py`）：小于 32 px 的文字、文字重叠、安全区、每段 −14 ±1 LUFS 且 ≤ −1 dBTP、预览与渲染一致（≤ 8 px，≤ 12/255）。
- **格式档案**（`video-agent/formats/`）：路由规则和每种格式的档案：`talking-head`、`faceless-broll`、`animation-story`。

## 剪辑原则

来自真实被否决的版本，已写入技能，下次一开始就对：

- **屏幕文字跟随实际说的话**，而不是脚本；重点词在说到时出现。说“下面”时文字就在下方，并配箭头。
- **提到但没拍到的物品用真实、贴合语境的照片**（越南人用越南护照，提到哪所学校就用那所学校），抠图做成符合风格的贴纸。
- **运动根据素材创作**：每段一个与台词相关的动作（说“电话”时手机响，说“诈骗”时盖章），不用通用预设。
- **一眼认出风格**：使用该风格的字体、配色和文字出现方式，不加风格以外的元素。
- **送审前自检**：文字不出画、不挡脸、装饰不压字。

## 安装

需要：[Claude Code](https://claude.com/claude-code)、Node 20+、ffmpeg、yt-dlp、Python 3。渲染引擎（`short-editing`）和通用技能位于 `~/.claude/skills/`；新机器先运行一次 `/studio-setup`。

```bash
git clone https://github.com/NamHocAI/video-agent.git
cd video-agent
```

## 使用

在 Claude Code 中：

```text
/steal <参考视频链接>                         # 学习新风格
/short-editing <素材> style <风格名>          # 剪一条视频（先运行分镜关卡）
```

在 `video-agent/` 目录下逐步运行：

```bash
node ../.claude/skills/storyboard-gate/scripts/start.mjs takes/<素材>.mp4 --style <风格名>
node ../.claude/skills/storyboard-gate/scripts/preview.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/gif.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/build-wizard.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/server.mjs edits/short-<slug>/storyboard --port 4747
```

确认后重新生成成片：

```bash
node ../.claude/skills/storyboard-gate/scripts/auto-final.mjs edits/short-<slug>/storyboard
```

## 仓库结构

```text
.
├── CLAUDE.md                          # Claude Code 项目规则（默认开启分镜关卡）
├── .claude/skills/storyboard-gate/
│   ├── SKILL.md                       # 完整流程与用户设定的规则
│   ├── scripts/                       # start · preview · gif · build-wizard · server · cardspec
│   │                                  # render-seg · auto-final · qc · seg-gain · compare.py · …
│   └── wizard/index.html              # 审阅页面
└── video-agent/
    ├── formats/                       # ROUTER.md + 各格式档案
    └── storyboards/templates/         # 同源素材可复用的分段模板
```

仅保留在本地、不推送：`styles/`、`takes/`、`edits/`、`inputs/`、`presets/`、`backups/`、所有 `.env`，以及全部媒体文件（视频、音频、图片、字体、渲染结果）。

## 贡献

只提交源码和文档。不要提交密钥、原始素材或渲染输出。
