# Style: zoe-genai

Chép từ https://www.instagram.com/p/DbtK6GXMkoN/ (@zoe_genai), đo ngày 24/10/2026. Áp lên trên `short-editing/references/style.md`: cái gì không ghi ở đây thì giữ như ở đó.

Định dạng gốc: hook chia đôi "bản dựng bằng AI / Raw" (7,3 s), rồi video hướng dẫn quay màn hình laptop bằng điện thoại có tay chỉ, rồi selfie CTA. Một reel, nên coi là một trường hợp riêng (chưa đối chiếu với reel thứ hai của kênh).

## Cắt
- 39,7 s, 9 lần đổi khung (scdet ngưỡng 12) ở giây 7,3 / 15,2 / 25,9 / 30,1 / 31,2 / 32,7 / 33,7 / 34,8 / 36,1. Trung bình khoảng 4 s một cảnh nhưng không đều: hook 7,3 s, hai cảnh dài 7,9 s và 10,7 s, năm cảnh 1 đến 1,5 s dồn dập ở giây 30 đến 36 (mở công cụ, bấm tạo, ra kết quả), rồi 3,6 s selfie.
- Trong hook, thẻ trái đổi nền cứng khoảng 0,5 đến 1 s một lần, tám đến chín nền trong 7,3 s (scdet không bắt được vì chỉ đổi trong thẻ).
- Không có khoảng lặng nào từ 0,25 s trở lên (đã cắt hết). Không fade, không chuyển cảnh.

## Khung hình
- Hook: nền là chính camera, phóng to, làm mờ rất mạnh và tối đi (vệt đỏ sẫm, vàng mờ). Trên đó (khung 1080 x 1920): dấu tia sáng 4 cánh + chữ trắng đậm "Omni" ở y 400; thẻ trái cao bo góc 30 px (x 84 đến 641, y 465 đến 1455, tức 52 % rộng và 52 % cao khung); thẻ phải nhỏ (x 672 đến 997, y 850 đến 1425) là bản "Raw", nhãn "Raw" chữ trắng đậm cỡ 80 px, không dải, ngay trên thẻ.
- Sau hook: cảnh quay laptop bằng điện thoại cầm tay (rung nhẹ), tay cầm bút chỉ vào màn hình, có cảnh thu nhỏ video giữa màn hình. Không có punch-in.
- Cảnh cuối: selfie nền tường vàng, góc quay thấp, mặt (đỉnh tóc đến cằm) khoảng 28 đến 35 % chiều cao khung. Không zoom vào ra, không push (`zoom.drift: 0`). Trần cho bản chép: mặt không quá 35 %.

## Phụ đề
- IN HOA, đậm, hẹp, nghiêng, trắng có viền đen và bóng đổ nhẹ, cao khoảng 55 px, 2 đến 4 từ một cụm, hiện cứng ở y 1318 (68 % khung, ngay dưới cằm), không fade.
- Từ khóa CTA ("VIDEO") cực lớn (cao khoảng 160 px, rộng khoảng 665 px), in hoa nghiêng trắng có bóng đổ, ở y khoảng 425 (22 % khung), có nhiễu màu (glitch) khoảng 0,2 s khi hiện.
- Bản chép: Archivo 900, in hoa, trắng, bóng mờ (`captions.style: band`, `bg: none`). Không nghiêng được (engine không có chữ nghiêng), ghi vào "Bỏ ra".

## Graphic và hình ảnh
- Thẻ trái của hook, chín nền liên tiếp: đỏ sẫm với chữ trắng cực to ("editing is so"); khung trình phát "MEDIA" có nút điều khiển; vàng với biểu tượng lịch ("easy these days"); khung ngắm máy quay có chấm REC, góc đỏ và mã giờ ("even for people"); kem và vàng chia đôi, chữ nổi 3D có bóng cứng ("with no experience like me"); lưới xanh lá kiểu thảm cắt với mũi tên trắng chỉ vào người ("And the best part is it's"); cận mặt tối với vạch vàng viết tay ("free"); bìa các-tông với vòng tròn vàng vẽ tay ("Come I'll show you exactly how"); xanh lá và đen với đồ vật cắt dán. Người nói luôn là chủ thể (cắt rời hoặc đóng khung), chữ khổng lồ ở trên đầu hoặc đè lên thân.
- Nhãn trên thẻ phải ("Raw") đứng yên suốt hook.
- Ảnh màn hình: cảnh quay thật (điện thoại quay laptop), không dán ảnh chụp.
- CTA cuối: từ khóa cực lớn ở trên đầu, phụ đề ở cằm.

## Âm thanh
- Không có nhạc nền: phổ âm thanh không có dải nhạc đều nào. -14,3 LUFS, LRA 4,2 LU. Khoảng yên (5 % thấp nhất) ở -30,5 dB so với giọng khoảng -20,4 dB, tức chỉ cách 10 dB: là tiếng phòng thu bằng điện thoại, không phải nhạc. Chưa tách giọng bằng ElevenLabs (tốn credit) nên không loại trừ hẳn nhạc rất nhỏ. Bản chép: `music.mute: true`.
- Hiệu ứng: hai vệt "vút" ở dải giữa và cao ở giây 0,6 và 4,5; vài nét đứng mảnh (click) ở khoảng giây 3,1 và 5,2; một click ở chỗ cắt giây 7,1 và ở giây 36,4. Không beat, không tiếng gõ liên tục, không riser.
- Bản chép: `zhhh` rất nhỏ ở hai lần đổi nền lớn của hook và một click nhẹ ở cú cắt vào camera. Không click khi cắt thường (learnings).

## Màu
- Hook: nền xám nâu tối, thẻ bão hòa (đỏ sẫm, vàng, xanh lá, các-tông). Cảnh selfie: tường vàng bão hòa, da ấm tự nhiên. `grade` để trống: giữ màu da của bạn (learnings: không rút đỏ hay cam khỏi da).

## Bỏ ra
- Các bản dựng do AI tạo ra từ người nói (Gemini Omni): thay bằng chính bạn đóng khung trên nền chữ dựng bằng code. Không có logo Omni của Google: dùng dấu tia sáng chung và chữ "AI".
- Chữ nghiêng của phụ đề: engine không có, dùng Archivo 900 đứng.
- Cảnh quay laptop bằng điện thoại: dùng quay màn hình thật của bạn, hoặc bỏ nếu không có.
- Phụ đề cố định ở y 1318 của reel gốc: khi dùng motion pack, phụ đề do `fx2.html` vẽ và đổi chỗ theo từng cụm (người dùng yêu cầu "đừng làm phụ đề cố định 1 chỗ"), nên `captions.hide: [[0, 999]]`.

## short-editing áp dụng thế nào
- Hook: copy `assets/components/hook-omni.html` sang `source/hook-omni.html`. Đầu file có đủ lệnh: đặt `matteSpans` để engine cắt người, `prepare`, tạo ba bộ khung hình (nền mờ, người cắt rời, khung "Raw" gốc), sửa `window.HOOK` (thời điểm đổi nền theo từ khóa trong `files/words.md`), capture `--alpha`, rồi `prepare` lại, gắn bằng scene `overlay` từ 0 đến hết hook và `captions.hide` cho đoạn đó. Lần đầu `prepare` tự tải mô hình cắt người của MediaPipe (một lần).
- Khung cắt: đo chiều cao hộp mặt (`vision-web.mjs faces`), chọn `cam.crop` sao cho mặt 30 đến 35 % chiều cao khung (đỉnh tóc đến cằm). Take thử: [59, 85, 1294, 2300] cho mặt khoảng 31 đến 33 %, đúng mức của selfie reel gốc.
- Sau hook: camera toàn khung, `layout.keys: [[0, 0]]`, `captions.yKeys: [[0, 1318]]`, không nhạc, hai tiếng `zhhh` nhỏ (gain -19) ở các lần đổi nền lớn và một tiếng `tap` 0,05 ở cú cắt vào camera.
- Từ khóa CTA: nhãn lớn ở đầu khung bằng component (cùng cách làm với `stickers.html` của style cindie-zhu).
- Lớp nội dung sau hook (mascot chạy qua chạy lại, B-roll tự sinh từ transcript, chữ chạy, phụ đề đổi chỗ, đổi màu theo ý): xem phần "Motion pack" ở cuối file (viết bằng tiếng Anh).

## Kết quả dựng thử (24/10/2026)
- Take thử: 24,5 s đầu của "VID THÔ" (21,3 s sau khi cắt khoảng lặng), render -14,0 LUFS, true peak -1,5 dBTP. Dự án: `video-agent/edits/short-vid-tho-24s-zoe-genai`.
- Khớp reel: vị trí tiêu đề, thẻ trái cao bo góc, thẻ "Raw", nền mờ, đổi nền cứng 7 lần trong 7,9 s, người cắt rời, phụ đề ở y 68 %, không nhạc.
- Lệch reel: nền các thẻ là chữ và hình dựng bằng code (reel dùng ảnh AI sinh ra), không có chữ nghiêng, hook của bạn không có CTA từ khóa nên chưa có nhãn từ khóa to ở đầu khung, không có phần quay laptop bằng điện thoại.

## Motion pack (content layer, added 25/10/2026)

*Everything below is written in English for the agent that runs the pack; the sections above are the measurement of the reel.*

What it is: everything that belongs to **what the speaker says**, drawn by code as one transparent 1080 x 1920 overlay (`assets/fx2.mov`) above the full-frame camera and above the hook overlay: captions that change place / style / colour per phrase, running-text ribbons, animated B-roll cards and the creator's own screenshots floating around the person, icons that float or orbit the head, a colour wash that changes with every phrase, effects, a comparison panel and an original mascot that runs back and forth. It goes beyond the reel on purpose (the creator asked for the style, not a 1:1 copy, and for the take to fit its own content). It supersedes the light pack `fx.html` + `gen_fx.py` (mascot hops, panel, fixed-place captions), which stays for takes that need less.

### Files (`assets/components/`)
| file | role |
|---|---|
| `fx2.html` | the page. `window.setT(t)` is a pure function of SHORT time; it reads `window.FX2` from `source/fx2-config.js` |
| `gen_fx2.py` | the automatic B-roll director: transcript + rules + plan -> `source/fx2-config.js` (and with `--spec` the spec) |
| `keywords.vi.json` | Vietnamese keyword rules: a word said -> card, icon, ribbon, mascot mood, effect, colour |
| `buddy.js` | the mascot, `window.buddy(mood, k, h, ph)` -> inline SVG string |
| `icons2.js` | flat icons for the tiles, `window.ico2(name, p, size)`: sparkle clapper clock scissors play bulb brain rocket wand layers globe chat; any other name falls back to `window.ico` of `edita-icons.js` (`calendar`, `bolt`...) |
| `preview_server.py`, `preview.html` | look at frames without rendering (see "Fast preview") |
| `fx.html`, `gen_fx.py` | the older light pack |

`edita-icons.js` is not in this style: copy it from `styles/edita-visuals/assets/components/`. Into the project's `source/` copy `fx2.html`, `buddy.js`, `icons2.js`, `edita-icons.js` (`fx2.html` loads `fx2-config.js`, `buddy.js`, `edita-icons.js` and `icons2.js` by relative path), plus small JPG copies of the creator's screenshots in `source/img/`.

### Layers (bottom to top, the DOM order of `fx2.html`)
1. colour wash: radial gradient, the frame edges take the colour of the current phrase (alpha .34, breathing), from `washFrom`
2. running-text ribbons (`#tks`) 3. the creator's screenshots (`#shots`) 4. animated B-roll cards (`#pips`) 5. icon tiles (`#sats`) 6. comparison panel (`#info`) 7. captions (`#cap`) 8. the mascot (`#bd`: the pose plus 3 trail ghosts) 9. effects (`#fxc` canvas: flash, glitch, confetti, speed lines, rings)

All config times are SHORT seconds (the cut video); `spec.js` scene times and `sfx.extra` are SOURCE seconds.

### Slots and the face keep-out (frame 1080 x 1920, `cam.crop [59, 85, 1294, 2300]`)
| slot | box x, y, w x h | used by |
|---|---|---|
| TL / TR | 24, 100, 490 x 290 / 566, 100, 490 x 290 | landscape cards and screenshots, float icons; caption zone T takes both; the top ribbon (y 290) takes both |
| SL / SR | 18, 450, 272 x 400 / 790, 450, 272 x 400 | portrait cards and screenshots, float icons, caption zones L / R |
| CB | caption zone B: x 40, y 1284, w 1000 (to about y 1456) | the main caption, the only place for `mark` and `neon` (white or glowing text needs the dark shirt) |
| RIB | ribbon band y 1128 to 1212, tilt -3 deg | running text; blocked while the panel is up |
| PANEL | comparison panel y 1010 to 1272 (also blocks RIB) | `info` |
| lane | mascot box top y 1480 at scale .9 (body about y 1505 to 1700), x -10 to 850 | the mascot, below the chest caption and above the platform UI |

- Face keep-out for this framing: x 310 to 770, y 430 to 1040 (hair top about 430, chin about 1030). Keep key content out of x > 950 (y 1000 to 1650, the platform buttons) and the bottom 250 px.
- Caption zones (`ZONE` in `fx2.html`): B x 40 y 1284 w 1000, T y 150 w 1000, L x 18 y 470 w 290, R x 772 y 470 w 290, B2 y 1380 (the director never picks B2: the mascot lane is below it). Big words 112 px (B, T) or 86 px (L, R), lead-in 44 or 32 px.
- Another crop or another speaker: measure the face box again (`vision-web.mjs faces`), then edit the `SLOT` table in `gen_fx2.py` and the `ZONE` table in `fx2.html` together.

### The mascot (`buddy.js`)
An ORIGINAL character, a chubby coral "spark": a soft 8-petal body that turns slowly (radius `R * (1 + .15 cos(8a + rot))`, coral gradient), big shiny eyes that blink every 3.1 s, rosy cheeks, mitten hands, two feet, a shadow that shrinks while it is in the air. `buddy(mood, k, h, ph)`: `k` = seconds since it appeared, `h` = hop height 0 to 1, `ph` = run phase in radians. Viewbox 240 x 264.
- `wave`: one arm up, hearts rise. `cheer`: both arms up, happy eyes, five stars orbit. `wow`: arms out, wide eyes, pulsing mouth, sweat drop, speed lines, "!". `think`: forearm to the chin, skeptical brows, "?" bubble. `idea`: arm up, glowing bulb. `run`: arms swing, feet alternate and lift (`ph`), open smile.
- Why not Anthropic's mascot: the creator asked for a cute character "like the Claude one" for the moments when AI is named; Anthropic's mascot is Anthropic's copyrighted character, so this is a new design (coral palette of the channel, our own shape), no Anthropic mark. When the product itself is named and a logo is needed, show the real logo asset (`assets/logos/claude.png`) as an icon tile, never a redrawn mascot.
- Motion (in `fx2.html`, `pose`): hop-in .45 s arc (squash and stretch, tilt), idle hop every .62 s with a landing squash and a crouch before the next jump, hop-out .35 s; running bobs 22 px, tilts 8 deg in the running direction and hops at the lane ends; 3 ghosts trail it (.04 s apart, .07 s while running).

### Config schema (`window.FX2`)
- `dur`: page length (short duration + .1). `washFrom`: when the wash starts (the hook end).
- `themes: [{at, rgb: [r,g,b]}]`: one colour per phrase, blended in .35 s. It tints the wash, ribbons, card accents, icon rings, chips / outlines / marks / neon and the rings effect.
- `tickers: [{at, to, y, h, angle, text, speed, dir, dark}]`: a ribbon of running text (`text` repeated with a star between; `h` 84, `speed` px/s 420, `dir` +1 or -1). Theme-coloured ribbon with dark text, or `dark: true` = dark ribbon with theme-coloured text. It grows from its leading edge in .32 s.
- `sats: [{icon, at, to, cx, cy, rx, ry, a0, w, size, arc?}]`: an icon tile (white rounded square, theme ring) moving on an ellipse around (cx, cy), start angle `a0`, speed `w` rad/s, `size` px (132). `arc: [a, b]` ping-pongs between two angles (an orbit over the head only). The director writes two shapes: float (rx 34, ry 24 around a slot centre) and ring (centre 540, 760, rx 430, ry 470, `arc [3.5, 5.92]`, size 116).
- `pips: [{scene, at, to, x, y, w, h, rot, side}]`: an animated card, an SVG that is a function of its local time. Scenes: `prompt` (a prompt types, shapes pop out), `timeline` (editor timeline, playhead, cursor), `workflow` (nodes feed the AI, pulses run on the wires), `clock`, `rocket`, `idea`. `prompt` 520 x 320, `timeline` 480 x 300 and `workflow` 340 x 500 are drawn at that design size and fitted to the slot; the others adapt to `w` x `h`. `side` `l` or `r` = the side it flies in from and out to; `rot` = base tilt (deg).
- `shots: [{src, at, to, x, y, w, h, rot, side}]`: the creator's own screenshot (`src` relative to `source/`, cover fit, slow vertical pan during the stay).
- Cards and shots enter in .4 s with an overshoot, drift (sin and cos offsets) and tilt while they stay, and fly out in .3 s.
- `phrases: [{at, to, zone, style, from, rot, dy, theme, small: [[t, word]], big: [[t, word]]}]`: `zone` B / T / L / R / B2, `style` `chip` (theme-coloured sticker) / `outline` (white, theme stroke, hard shadow) / `mark` (white with a highlighter sweep) / `neon` (glowing theme colour), `from` b / t / l / r = the side it slides in from, `rot` deg, `dy` px, `theme` = [r,g,b] to override the current colour. `small` = the lead-in words, shown as they are said (in a dark pill on the light wall zones T / L / R); `big` = the key words, each pops with an overshoot and a tilt when said. In L and R each big word takes its own line and shrinks to fit the 290 px column; in B and T the line is scaled to fit 1000 px.
- `events`: the mascot's poses, one at a time (a list in time order).
  - stand pose: `{at, to, mood, side, x, y, scale, fromX?, toX?, hopIn?, hopH?, noOut?}`: `x`, `y` = left / top of the 240 x 264 box; without `fromX` it hops in from the screen edge `side`; `fromX` / `toX` = where it hops in from / out to (equal to `x` = hop in place); `hopIn` hop-in height (190), `hopH` idle hop height (62), `noOut` = stay until the end.
  - run pose: `{at, to, mood: 'run', xa, xb, xs, d0, speed, y, scale}`: patrols between `xa` and `xb`, starting at `xs` in direction `d0` (+1 or -1) at `speed` px/s (560), turning with a small hop at the ends.
- `info: {at, to, at2, ratio, y, l1, v1, l2, v2}`: the "before / with" panel. A grey bar (`v1`, label `l1`) grows from `at`, the orange bar (`ratio` of the track, `v2`, label `l2`) from `at2`. Defaults: TRƯỚC / GẦN 1 NGÀY and CÓ AI / 1–2 TIẾNG (content: change them or leave `info` out).
- `fx: [{type, at, dur, x, y}]`: `flash` (white wash), `glitch` (7 colour slices), `confetti` (54 pieces from x, y), `speed` (30 radial lines), `rings` (3 rings from x, y).

### The director (`gen_fx2.py`)
```
python -I <style>/assets/components/gen_fx2.py <project> [--spec]
```
Reads `files/words.md` (the src | short | word table that `prepare` writes), `keywords.vi.json` (or `source/keywords.json` when the project has its own), and an optional `source/plan.json`. Writes `source/fx2-config.js` and prints the schedule, one line per element in time order (look for `(card ... no free slot, skipped)`). Every element is anchored on a word really said, so a new cut or transcript needs only a re-run. `--spec` wires `fx2` into `source/spec.js` (renames the `fx` media and scene, rewrites the `sfx.extra` line, turns `captions.hide [[0, 9.1]]` into `[[0, 999]]`); it only patches an existing `fx` media line and an existing `extra:` line, so on another spec add the media, the scene and the extras by hand. A working example: `video-agent/edits/short-vid-tho-24s-zoe-genai/source/plan.json`.

Order of work: rule hits (with cool-downs) -> captions -> colours -> panel -> ribbons -> cards and screenshots -> icons -> mascot -> effects and sounds.
- Layout is a resource manager over the slots (TL TR SL SR CB RIB PANEL): an element takes the first free slot of its preference list for its whole stay (.12 s margin), two things never share one, and an element with no free slot is skipped. Captions go first, then ribbons (RIB, else the top band), then cards (the plan's `extras` first, then the rules'), then icons: float = one slot, ring = all four.
- Captions: the plan's list, else automatic chunks (a sentence is cut at pauses over .42 s or after 8 words; a chunk = up to 6 lead-in words + 1 to 4 key words taken from the end of the clause: stop words stay in the lead-in, and a rule hit within 4 words of the end is pulled into the key words). Style cycles chip, outline, mark, outline, chip, mark; zone cycles B, T, B, R, B, L; `mark` and `neon` are forced to B; L / R with more than 4 big words become B; a busy zone falls back to B.
- Mascot: reactions come from the rules' `mascot` moods, at least .9 s apart, alternating right (x 830) and left (x -6); between two reactions it runs, with direction and speed solved so it lands where the next pose stands (the next pose hops in place, no teleport); after the last reaction it runs on to the end. Before `hookEnd` only rules with `hook: 1` act (the mascot and its effect: wave on the first "AI", rings).
- `plan.json` keys: `hookEnd` (short seconds; default = the end of the hook overlay in `spec.js`), `say` (`[[previous word, heard word, shown word]]`, display fixes), `captions` (`[lead-in, key words, style?, zone?, colour index?]`, `a|b` = the transcript hears one of them), `info` (`{from, to, at2, ratio, y, shift, l1, v1, l2, v2}`, phrases to find in the transcript), `extras` (`{at, nth?, kind: shot|pip, src|scene, slots?, lead?, len?}`: forced cards, the creator's screenshots), `laneY` (1480), `mscale` (.9), `rules` (more rules, appended to the keyword file).
- Rule fields (`keywords.vi.json`): `name`, `pat` (words said; `a|b` alternatives; spaces = consecutive words), `mascot` (a mood or a list used by occurrence), `mlen` (reaction seconds), `hook`, `pip` + `slots` + `len`, `sat` + `mode` (`float` or `ring`) + `slen`, `ticker` + `dark` + `tlen`, `fx` (`rings` `confetti` `speed` `glitch`), `flash`, `theme` (palette index), `cool` (seconds before it may fire again). `palette` = 6 colours (orange, yellow, cyan, violet, lime, pink).

### Run it (in a project that already has `files/words.md`)
```
python -I <style>/assets/components/gen_fx2.py <project> --spec
node <skill>/engine/short.mjs capture <project> source/fx2.html --dur <short seconds + .3> --alpha --out assets/fx2.mov
node <skill>/engine/short.mjs prepare <project>          # always after a capture: the media cache refreshes only here
node <skill>/engine/short.mjs stills <project> 8.4 11.9 14.5 19.9
node <skill>/engine/short.mjs all <project>              # render + audio + final; then the light export
```
`capture` always writes `stills/fx2-sheet.jpg` (the overlay alone over gray, at the `--at t,t` times, else 8 even ones). The hook (`hook-omni.html`) is captured the same way and its scene comes first in `spec.scenes`; the `fx2` overlay scene comes after it, `layer: 'over'`.

### Sound extras (modest)
Pop (.09) .3 s into each mascot hop-in, bell (.06) on the cheer and the idea, slide on the panel and on the first two cards, tap (.05) on every flash, plus the hook's two soft `zhhh` and the tap at the cut to the camera: about 12 extras over 21 s. No click per caption, no riser, no bed (dense clicks and risers were rejected).

### Fast preview without rendering
A capture takes minutes; to check overlaps and legibility, look at the page directly over the real camera frames.
```
python -I <style>/assets/components/preview_server.py <project> <skill>/engine 8765
```
Copy `preview.html` to `<project>/source/_preview.html`, then open `http://127.0.0.1:8765/source/_preview.html?t=8.4,9.4,11.9&s=0.25` (`s` = scale: .25 puts 8 frames on a screen, .5 two frames to read the detail; `h` = hook end, default 7.9). Each cell is `fx2.html` set to time `t` over `frames/cam/NNNNN.jpg` (frame `round(t * 30)`, and `frames/media/hook` under it before the hook ends). The server serves the project at `/` and the engine at `/engine/` (the fonts), without cache. Edit, reload, look again; delete `_preview.html` from the project when done. In the in-app browser the first screenshot after a navigation may time out: take it again.

### Learnings (motion pack)
1. Nothing over the face: keep out x 310 to 770, y 430 to 1040 and measure the face box (never by eye). Cards, captions and float icons live in the slots; the ring icons move on an arc outside the head.
2. The top and side zones sit on a light wall: white lead-in text is unreadable there, so it sits in a dark pill; `mark` and `neon` only on the dark shirt (zone B).
3. Narrow cards (272 px) must scale their text with the width (`Math.min(40, w * .085)`); scenes with a fixed design (`prompt`, `timeline`, `workflow`) are drawn at that size and fitted with `preserveAspectRatio slice`, and the director only sends each scene to a slot of the right orientation.
4. The overlay is captured at 30 fps: motion comes from easing and overshoot (easeOutBack), squash and stretch, drift (sin and cos offsets), trail ghosts and fly-outs, never from more frames.
5. fx2 draws every caption: `captions.hide: [[0, 999]]`. Config times are SHORT seconds, `sfx.extra` and scene times are SOURCE seconds (the director converts).
6. Run `prepare` after every capture (the media cache refreshes only there). A spec that points at a `.mov` that does not exist yet crashes `prepare`: capture first, then wire (or run the director without `--spec` first).
7. Keep the creator's screenshots as small JPG copies in `source/img/` (about twice the slot size; 560 px wide for a portrait cover, 960 px for a landscape screen), never the full PNG; they are evidence B-roll next to the person, not pasted over the face.
8. One mascot at a time, in a bottom lane: it runs back and forth between reactions and hops in place when a keyword lands (it never teleports), below the chest caption and above the platform UI.
9. Keep the sound modest: pops, one bell, a few slides. Dense clicks and risers were rejected earlier in this project.
10. Original character only: never redraw Anthropic's mascot; use the real logo asset for a named tool.
11. The comparison panel is content: set its labels and values in `plan.info` or leave it out when the take makes no before / after claim.
12. Automatic captions are a first pass: write `plan.captions` for the key words (the transcript mishears: `a|b`; `say` fixes what is shown), and look at the printed schedule before capturing.
13. Run Python with `-I` (isolated); the director reconfigures stdout to UTF-8, a Windows console crashes printing Vietnamese otherwise.
14. An SVG gradient `id` defined inside a `display:none` element breaks every other reference to the same id (the mascot body came out transparent after its first pose). Give each mascot element its own id (`bdg` + event index) and empty the `innerHTML` of anything that is hidden. A page that only draws one frame in the preview never shows this: also call `setT` twice (an early time, then a later one) when testing.
15. A capture is one screenshot per frame (about 6 min for 21 s). Cut it into slices rendered at the same time: `fx2.html` adds `window.T0` to every time, so make copies `_fx2_p1.html ... _fx2_p4.html` that set `<script>window.T0=5.4</script>` before `fx2-config.js` (T0 = slice start, a multiple of 1/30), run `capture ... source/_fx2_pN.html --dur 5.4 --alpha --out assets/_fx2_pN.mov` four at once, then `printf "file '_fx2_p1.mov'\n..." > list.txt; ffmpeg -f concat -safe 0 -i list.txt -c copy fx2.mov` (inside `assets/`) and run `prepare`. Delete the slices and `_fx2_p*.html` afterwards.
