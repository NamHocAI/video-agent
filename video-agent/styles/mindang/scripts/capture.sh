#!/usr/bin/env bash
# Capture an HTML component in N parallel time slices (window.T0), then join them. Prints one line when done.
#   bash video-agent/styles/mindang/scripts/capture.sh video-agent/edits/short-<slug> source/stage.html <dur s> assets/stage.mov [slices=4] [--alpha]
set -euo pipefail
P="$1"; PAGE="$2"; DUR="$3"; OUT="$4"; N="${5:-4}"; A="${6:-}"
S=C:/Users/Admin/.claude/skills/short-editing/engine/short.mjs
base=$(basename "$PAGE" .html); dir=$(dirname "$PAGE"); ext="${OUT##*.}"
len=$(awk "BEGIN{printf \"%.3f\", $DUR/$N}")
: > "$P/assets/_cap.txt"
for i in $(seq 0 $((N-1))); do
  T=$(awk "BEGIN{print $i*$len}")
  sed "0,/<script/s#<script#<script>window.T0=$T</script><script#" "$P/$PAGE" > "$P/$dir/_${base}$i.html"
  echo "file '_${base}$i.$ext'" >> "$P/assets/_cap.txt"
  node $S capture "$P" "$dir/_${base}$i.html" --dur "$len" $A --out "assets/_${base}$i.$ext" > /dev/null 2>&1 &
done
wait
# slices started in the same instant can collide (port / temp dir): rerun any missing one alone
for i in $(seq 0 $((N-1))); do
  [ -s "$P/assets/_${base}$i.$ext" ] || node $S capture "$P" "$dir/_${base}$i.html" --dur "$len" $A --out "assets/_${base}$i.$ext" > /dev/null 2>&1
  [ -s "$P/assets/_${base}$i.$ext" ] || { echo "capture: slice $i failed"; exit 1; }
done
ffmpeg -v error -y -f concat -safe 0 -i "$P/assets/_cap.txt" -c copy "$P/$OUT"
rm -f "$P/assets/_cap.txt" "$P/assets/_${base}"*."$ext" "$P/$dir/_${base}"*.html "$P/stills/_${base}"*-sheet.jpg
echo "capture: $OUT $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$P/$OUT") s"
