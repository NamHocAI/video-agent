#!/usr/bin/env bash
# Build source/stage-map.js (window.MAP = [[source s, short s], ...]) from files/words.md, after every prepare that changes timing.
#   bash video-agent/styles/mindang/scripts/map.sh video-agent/edits/short-<slug>
set -euo pipefail
P="$1"
end=$(grep -o "Short duration: [0-9.]*s (source [0-9.]*" "$P/files/words.md" | sed -E 's/Short duration: ([0-9.]+)s \(source ([0-9.]+)/\2,\1/')
pairs=$(awk -F'|' '{gsub(/ /,"",$2); gsub(/ /,"",$3); if ($2 ~ /^[0-9.]+$/) printf "[%s,%s],", $2, $3}' "$P/files/words.md")
echo "window.MAP=[[0,0],${pairs}[${end}]];" > "$P/source/stage-map.js"
echo "map: $(grep -o '\],\[' "$P/source/stage-map.js" | wc -l) points, end [${end}]"
