# mindang: token-lean workflow (same speed, same quality)

Read order for a mindang short: `WORKFLOW.md` (this) -> `ENGINE.md` -> `style.json` -> `formats/talking-head/PROFILE.md`.
Do NOT read the short-editing references or the steal SKILL body again: ENGINE.md holds every rule they set for this style
(user condition 2, 2026-10-26). Missing feature -> grep that one key, never read the whole doc.

## The 6 rules

1. **Small images.** Review on contact sheets (stills `contact.jpg`, `check.sh` compare 160x284 tiles). Open a full-size still only to inspect one detail, and crop it first (`ffmpeg -vf crop=w:h:x:y`). Never read several full-size stills in a row.
   - **Exception, mandatory (condition 1):** before delivery, READ at least ONE full-size frame of the final mp4 (`check.sh` writes `output/kiem-tra-full-<t>.jpg`). Pick a beat with a board + captions + the speaker.
2. **No long docs.** ENGINE.md + PROFILE.md only (about 200 lines). Grep for anything else.
3. **Templates.** Start components from `assets/components/stage.template.html` and `result.template.html` (init copies them into the project's `assets/components/`): copy to `source/`, change boards and cue lines only.
4. **Scripts print numbers.** `scripts/measure.sh` (steal a reel), `scripts/map.sh` (time map), `scripts/capture.sh` (parallel slices), `scripts/check.sh` (final check). Read their one-line outputs, not raw logs. Pipe engine commands through `| grep -v "page 404" | tail -3`.
5. **One notification per long job.** Long steps (prepare with matte, capture, all) run with `run_in_background` and a command that ends when the job ends. No progress monitor that fires every 100 frames. One status line to the user before the job starts.
6. **One video per session.** Finish, deliver, then the user opens a new session for the next video. Memory + style + profile carry everything over.

## Kept on purpose (quality)

- Stills of every beat before the render (one contact sheet), the compare with the original, the loudness QC, the face-size check on one still, the full-size frame at the end.
- Missing-material note before editing (short-editing step 1b).

## Storage rule (condition 3)

Templates, scripts and profiles live ONLY in `video-agent/styles/mindang/` (and `video-agent/formats/`). The skill core (`~/.claude/skills/...`) is not edited without a backup first: copies of every core file changed so far are in `backup-skill-core/` with `CHANGES.md`.
