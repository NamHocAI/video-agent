# Video Agent — storyboard-first short-form video editing, for Claude Code

**English** · [Tiếng Việt](README.vi.md) · [简体中文](README.zh-CN.md)

A Claude Code workspace that edits vertical shorts (1080×1920) from a raw talking-head take. It learns a style from a reference reel, plans the edit as a storyboard drawn on your own footage, waits for your approval, then renders. Everything runs on your machine with Node, ffmpeg and Chrome: no paid service, no upload.

## How it works

Nothing expensive happens before you have approved something cheap.

| step | what you see | you decide |
|---|---|---|
| 0. Style | a reference reel measured shot by shot: cut rhythm, face size, zooms, titles, music level, sound hits | the style name |
| 1. Start | your take measured (face share, voice, pace, screen recordings) and a proposed format, with the evidence | confirm or change the format |
| 2. Storyboard | every segment as a frame **and an animated GIF on your real footage**, 2–3 colour/font variants of the style, sound and motion options, cover frames | approve per segment, or draw a note on the frame |
| 3. Commit | the final video renders on its own, in a detached process | — |
| 4. Review | per-segment render vs preview, loudness per segment, a side-by-side with the reference reel, one full-size frame | notes → a revision |

## What's in the box

- **Storyboard gate** (`.claude/skills/storyboard-gate/`) — on by default before any new edit. Measures the take, proposes a format, builds a local review page (`http://127.0.0.1:4747`), and only exports after you press **Commit & render**.
- **One spec for preview and render** (`cardspec.mjs`) — what you approve is exactly what gets rendered.
- **Animated previews** (`gif.mjs`) — each segment rendered at half size on the real footage and looped as a GIF.
- **Style variants** — a style ships 2–3 colour/font variants (`styles/<style>/bien-the/<variant>/`); switching one redraws every preview in that variant.
- **Safety-net render** (`auto-final.mjs`) — pressing Commit starts the final render on its own, so a finished video exists even if the session stops. With the session still running, the full review still happens.
- **Checkpointed renders** (`render-seg.mjs`) — a failed segment resumes where it stopped.
- **QC** (`qc.mjs`, `seg-gain.mjs`, `compare.py`) — text under 32 px, overlaps, safe zones, −14 ±1 LUFS and ≤ −1 dBTP per segment, preview-vs-render match (≤ 8 px, ≤ 12/255).
- **Format profiles** (`video-agent/formats/`) — a router and one profile per format: `talking-head`, `faceless-broll`, `animation-story`.

## Editing principles

Learned from real rejected cuts, and written into the skill so the next edit starts right:

- **On-screen text follows what is actually said**, not the script; a key word appears when it is spoken. "Below" means the text sits below, with an arrow.
- **Objects that are named but not filmed get a real, context-exact photo** (the Vietnamese passport for a Vietnamese speaker, the school that is named), cut out as a sticker in the style's look.
- **Motion is invented from the take**: one action per segment, tied to the line (a phone rings on "call", a stamp slams on "scam"), never a stock preset.
- **The style stays recognisable**: its fonts, palette and way of revealing text, nothing outside it.
- **Self-check before review**: no text off the frame, nothing over the face, decorations never over text.

## Install

Requirements: [Claude Code](https://claude.com/claude-code), Node 20+, ffmpeg, yt-dlp, Python 3. The render engine (`short-editing`) and the global skills live in `~/.claude/skills/`; on a new machine run `/studio-setup` once.

```bash
git clone https://github.com/NamHocAI/video-agent.git
cd video-agent
```

## Usage

In Claude Code:

```text
/steal <reference reel link>                  # learn a new style
/short-editing <take> style <style-name>      # edit one video (the storyboard gate runs first)
```

Step by step, from `video-agent/`:

```bash
node ../.claude/skills/storyboard-gate/scripts/start.mjs takes/<take>.mp4 --style <style-name>
node ../.claude/skills/storyboard-gate/scripts/preview.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/gif.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/build-wizard.mjs edits/short-<slug>/storyboard/plan.json
node ../.claude/skills/storyboard-gate/scripts/server.mjs edits/short-<slug>/storyboard --port 4747
```

Render the final again after a commit:

```bash
node ../.claude/skills/storyboard-gate/scripts/auto-final.mjs edits/short-<slug>/storyboard
```

## Repository layout

```text
.
├── CLAUDE.md                          # project rules for Claude Code (storyboard gate on by default)
├── .claude/skills/storyboard-gate/
│   ├── SKILL.md                       # the full gate procedure and the user's standing rules
│   ├── scripts/                       # start · preview · gif · build-wizard · server · cardspec
│   │                                  # render-seg · auto-final · qc · seg-gain · compare.py · …
│   └── wizard/index.html              # the review page
└── video-agent/
    ├── formats/                       # ROUTER.md + one profile per format
    └── storyboards/templates/         # reusable segment templates for takes of the same source
```

Kept local, never pushed: `styles/`, `takes/`, `edits/`, `inputs/`, `presets/`, `backups/`, every `.env`, and all media (video, audio, images, fonts, renders).

## Contributing

Commit source and docs only. No secrets, no source media, no rendered output.
