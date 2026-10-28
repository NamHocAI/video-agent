# Thư viện format

Mỗi format là 1 thư mục: `PROFILE.md` (luật edit cho loại video đó) + `profile.json` (giá trị cho engine short-editing).
Format nói "dựng kiểu gì", style nói "trông thế nào". Một format trỏ tới 1 style mặc định nhưng dùng được với style khác.

| Format | Style mặc định | Học từ | Trạng thái |
|---|---|---|---|
| [talking-head](talking-head/PROFILE.md) | `mindang` | @mindang.com19 (reel De4D7stBc8T) | đã edit thử: `edits/short-vid-tho-24s-mindang/output/` |

Cách dùng: `/short-editing <take> style mindang` rồi làm theo `formats/talking-head/PROFILE.md` khi viết spec.

Các style khác vẫn giữ nguyên, không bị ghi đè: `buildwithdarius-ai`, `kem-3d` (từ @guipaulinooo), `cindie-zhu`, `edita-visuals`, `zoe-genai`, `default`.

Format sẽ thêm ở lượt sau: (chưa làm)
