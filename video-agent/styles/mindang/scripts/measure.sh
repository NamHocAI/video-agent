#!/usr/bin/env bash
# Measure a reference reel and print NUMBERS only (token saver for /steal).
#   bash video-agent/styles/mindang/scripts/measure.sh <reel.mp4> <outdir> [--music]
# Writes small contact sheets (180x320 tiles, 2 fps), cuts.txt, spectrum.png into <outdir>.
# --music: isolate the voice with ElevenLabs (uses a few credits, key from video-agent/.env) and print the bed level under the voice.
set -euo pipefail
R="$1"; W="$2"; mkdir -p "$W"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$R")
ffmpeg -v error -y -i "$R" -vf "fps=2,scale=180:320,tile=8x3:padding=3:color=black" "$W/sheet-%02d.jpg"
ffmpeg -hide_banner -i "$R" -vf "scdet=threshold=12" -an -f null - 2>&1 | grep -o "scd.time: [0-9.]*" | cut -d' ' -f2 > "$W/cuts.txt" || true
n=$(wc -l < "$W/cuts.txt")
ffmpeg -v error -y -i "$R" -lavfi "showspectrumpic=s=1500x300:legend=0:scale=log:stop=11000" "$W/spectrum.png"
lufs=$(ffmpeg -hide_banner -i "$R" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
echo "duration_s=$dur cuts=$n sec_per_shot=$(awk "BEGIN{printf \"%.2f\", $dur/($n+1)}") lufs=$lufs"
echo "cuts_at=$(tr '\n' ' ' < "$W/cuts.txt")"
echo "sheets=$(ls "$W"/sheet-*.jpg | wc -l) (tile i of sheet N = second 12(N-1)+i/2) spectrum=$W/spectrum.png (x = 1500*t/dur)"
if [ "${3:-}" = "--music" ]; then
  set -a; . video-agent/.env; set +a
  ffmpeg -v error -y -i "$R" -vn -ac 1 -ar 44100 "$W/full.wav"
  curl -s -X POST https://api.elevenlabs.io/v1/audio-isolation -H "xi-api-key: $ELEVENLABS_API_KEY" -F audio=@"$W/full.wav" -o "$W/voice.mp3"
  ffmpeg -v error -y -i "$W/voice.mp3" -ac 1 -ar 44100 "$W/voice.wav"
  for f in full voice; do ffmpeg -v error -i "$W/$f.wav" -af "asetnsamples=882,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-" -f null - | grep -o "RMS_level=.*" | cut -d= -f2 > "$W/rms-$f.txt"; done
  m=$(paste "$W/rms-voice.txt" "$W/rms-full.txt" | awk '$1<-40{print $2}' | sort -n | awk '{a[NR]=$1}END{print a[int(NR/2)+1]" over "NR/50"s"}')
  v=$(awk '$1>-30' "$W/rms-voice.txt" | sort -n | awk '{a[NR]=$1}END{print a[int(NR/2)+1]}')
  echo "voice_db=$v music_in_pauses_db=$m"
fi
