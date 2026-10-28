# mindang: engine rules (read this instead of the short-editing references)

Compiled 2026-10-26 from short-editing `SKILL.md` and every file in `references/` (shorts-codes, design-system, style, style-schema,
scene-library, sfx, music, performance, sub-agents rules applied through capture). Everything a mindang talking-head short uses is here.
**Rule:** a feature NOT listed here (story scenes, race, convo, mascot, vanish, pause, inserts, youtube format...) = grep that key in
`<skill>/references/scene-library.md` (`Grep -n "<key>" -A3`), never read the whole file. If the engine changes (skill updated), re-check this file first.

`<skill>` = `C:/Users/Admin/.claude/skills/short-editing`. Run every command from `C:/Users/Admin/Desktop/video-agent`.

## 1. Pipeline (commands, in order)

| step | command | notes |
|---|---|---|
| check | `node <skill>/engine/setup.mjs --check` | 1 s |
| init | `node <skill>/engine/short.mjs init video-agent/edits/short-<slug> --source "<take>" --style mindang` | slug lowercase-dashes; copies style assets (fonts) |
| words | `short.mjs words <P> vi` | ElevenLabs Scribe when `video-agent/.env` has the key (hears retakes), else whisper.cpp |
| prepare | `short.mjs prepare <P> --matte-workers 4` | cuts silences, speed, cam frames, MATTE (cutout), media frames, writes `files/words.md` (src -> short). Windows matte = MediaPipe ~1.4 fps with 4 workers: run in background, ONE notification at the end. Rerun after any change to `cut`, `cam`, `media`, `cutout`, or after a capture |
| stills | `short.mjs stills <P> 0.05 3.6s ...` | plain = SHORT s, `s` suffix = SOURCE s. Writes `stills/contact.jpg` + full `tNN.jpg` |
| capture | `short.mjs capture <P> source/x.html --dur <s> [--alpha] --out assets/x.mov|mp4` | one screenshot per frame (~1 min per 6 s on this PC): slice with `window.T0` pages, 4 in parallel, `ffmpeg -f concat -c copy` |
| all | `short.mjs all <P>` | render (~90 s for 23 s here) + audio + final + QC. After a sound-only change: `audio` then `final` |

QC line must read `h264 1080 1920`, duration = timeline, about -14 LUFS, true peak <= -1 dBTP (else `mix: { ceil: -2.2 }`, then audio + final).

## 2. Spec keys mindang uses (all times SOURCE seconds)

```js
window.SPEC = {
  title, media: { stage: { src: 'assets/stage.mov', width: 1080, alpha: true }, result: { src: 'assets/result.mp4', width: 1080 } },
  cam: { crop: [0, 0, W, H], eyes: [x, y] },        // from init (face detected); eyes in crop px
  cut: [[a, b]],                                       // retakes / false starts: keep the LAST complete attempt
  layout: { keys: [[0, 1920]] },                       // paper only, all along
  zoom: { keys: [[0, 1]] },                            // no zoom on the face, ever
  cutout: { from: 0, to: <end>, scale, x: 540, bottom, hard: true },  // speaker on the paper
  broll: [{ media, from, to, offset: 0, zoom: 0, hard: true }],       // full-screen clips (dark result beat, own footage)
  scenes: [{ type: 'overlay', media: 'stage', from: 0, to: <end>, layer: 'over' }],
  music: { bed: '<id>', offset: <a time> }, mix: { music: -40, duck: 0.6 },
  sfx: { swish: 0, accents: 0, marker: 0, strike: 0 },
  captions: { replace: [[heard, right]], emph: [...], hide: [[a, b]], yKeys: [[0, 1010]] },
};
```

- **Cutout placement**: drawn at `x0 = x - eyes[0]*scale`, `y = bottom - frameH*scale`. For a 1440x2560 take, `scale .75` + `bottom 2530` gave head top y ~1075, face 25 %. Measure on a still: face (hair to chin) 24 to 26 % of 1920, head top ~1090. Changing scale/bottom needs no new matte (only stills).
- **Matte gaps**: props in front of the body (mic, cup) can be dropped by the matte: `cam.keep: [[x, y, w, h, r]]` (cam-crop px) keeps them.
- `cuts: 'hard'` in the style makes scenes, cutout and broll cut in one frame.
- Overlay clips are captured in SHORT time; inside components convert SOURCE cues with `M()` from `source/stage-map.js` (built from `files/words.md`, see scripts/map.sh). Rebuild the map after every prepare that changes timing.
- `captions.replace` fixes misheard words (never edit times). Numbers as digits.
- `captions.hide` where a beat writes its own caption (dark/video beats: the band caption is ink and would vanish).
- Engine caption auto-hide: no speech > .55 s.

## 3. Captions (style `band`, set in style.json)

`style: 'band', bg: 'none', shadow: false, color: '#191813', hi: '#2F7BDB', font: 'Montserrat', weight: 700, size: 62, maxWords: 4, paperY: 1010`.
Whole chunk at once, hard in/out, emph words in `hi`. One emph word per line (pick from `files/words.md`: number, tool, verb). Font file path in style.json is cwd-relative (`video-agent/styles/mindang/assets/fonts/Montserrat.ttf`). House rule caps say 84 px / 3 words; mindang overrides with 62 px / 4 words (measured on the original).
Available but off: `captions.emphAccent` (rise + block:false only, added 2026-10-26, see backup-skill-core/).

## 4. Components (HTML, captured)

- Page contract: 1080x1920, every animation a pure function of `window.setT(t)` (no CSS animation, no timers), `t += window.T0 || 0` first line, transparent body for `--alpha`. Fonts via `/p/assets/fonts/...` (served from the project).
- Templates: `assets/components/stage.template.html`, `result.template.html` (copied into each project by init). Copy to `source/`, then edit the board <div>s, the `boards` list (id, source from, source to) and the cue lines in `setT`; keep the helpers (M, ent, dial, hands).
- Fonts in components: Noto Serif Display (headers, stickers), Montserrat (UI text). The house rule "SF Pro for UIs" is macOS-only (SFNS.ttf); on this Windows PC keep Montserrat.
- Media extraction caches by file size+mtime: a recaptured clip is re-extracted by the next `prepare`.

## 5. House rules that still apply (design-system, style.md, shorts-codes)

- Safe zone: text inside x 60 to 940 (centred ok), y 220 to 1500; nothing in the right 140 px from y 900 to 1700; captions <= y 1400 except dark/video beats (1480, original measured).
- Hook: frame 1 already readable (header + cards shown at t=0), start on speech, a visual change within 1 s.
- Something changes every 2 to 4 s; an idea developed over several sentences = ONE board that grows (no swap mid-idea).
- Every beat ACTS (types, counts, ticks, a hand turns); no sitting screenshot, no lone logo, no text card.
- Minimum text 34 px; labels 38 to 42 px.
- Real logos only (App Store icon / official site), never letter glyphs. **No emoji** anywhere on screen. No em dash in on-screen text.
- Motion: no pulse, bounce, elastic, overshoot, glow, shake, spin, confetti. Cards never change size. No ghost of the old beat under the new one, no counter parked on 0, no two numbers stacked.
- Camera colour natural, warm skin (check `stills/grade.jpg` once per short; `grade: true`).
- Sound: voice on top; mindang = bed at -40 (about 26 dB under voice), no SFX (no clicks, pops, whooshes, risers).
- Music: rotate beds (never the previous short's). Talking-head: never `sonar` or `compte-a-rebours`. Tech default `arpege`, offset = its `a` (10.0); `enquete` (a 10.7) when unsure. Keep `offset + length < out`.
- Deliver: mp4 + poster, `short-<slug>.srt` (from words.md short times, <= 7 words/cue), `post.md` (title < 60 chars, caption first 125 chars standalone, 3 to 5 hashtags, no #fyp).
- Before editing: name the 2 or 3 missing files that would make it better (B-roll, screen recording, result screenshot, logo), where they go, the fallback; never block (short-editing step 1b).
