#!/usr/bin/env bash
# Final check before delivery: one SMALL compare sheet (original on top, copy below), ONE FULL-SIZE frame (mandatory, look at it),
# loudness, cut count. Prints paths and numbers only.
#   bash video-agent/styles/mindang/scripts/check.sh video-agent/edits/short-<slug> <reel.mp4|-> <full-size frame at short s>
set -euo pipefail
P="$1"; R="$2"; AT="$3"
slug=$(basename "$P"); V="$P/output/$slug.mp4"; O="$P/output"
if [ "$R" != "-" ]; then
  ffmpeg -v error -y -i "$R" -i "$V" -filter_complex "[0:v]fps=0.75,scale=160:284,trim=end_frame=12,tile=12x1[a];[1:v]fps=0.75,scale=160:284,trim=end_frame=12,tile=12x1[b];[a][b]vstack" -frames:v 1 "$O/so-sanh-voi-reel-goc.jpg"
  echo "compare=$O/so-sanh-voi-reel-goc.jpg"
fi
ffmpeg -v error -y -ss "$AT" -i "$V" -frames:v 1 "$O/kiem-tra-full-$AT.jpg"
echo "full_frame=$O/kiem-tra-full-$AT.jpg (READ IT before delivery)"
ffmpeg -hide_banner -i "$V" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2 | tr -s ' ' | tr '\n' ' '; echo
echo "hard_cuts=$(ffmpeg -hide_banner -i "$V" -vf "scdet=threshold=12" -an -f null - 2>&1 | grep -c "scd.time") duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")"
