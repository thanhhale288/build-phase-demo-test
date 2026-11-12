# MODEL-LOG — Prototype build

## Planning (agy)
- 2026-11-12 23:12–23:22 Asia/Saigon — `gemini-3.8-flash-high` (agy 1.5.6, effort high). Lần gọi đầu lỗi cú pháp `-p` nuốt `--model`; lần 2 chạy thành công. Trong cùng phiên, agy đọc thêm `CONTINUE.md`, `Lab/Research/04-san-pham-nuoc-ngoai.md`, `Lab/Eval/06-user-story-uat.md` và cập nhật plan (checklist A–H trong `Prototype/plan/MODEL-LOG.md`). Không cần phiên `--continue` riêng. Không đổi model (không rate limit).

## Scaffold (PKG-0)
- 2026-11-12 23:25:54 Asia/Saigon — Người điều phối chạy `npm create vite@latest app -- --template react-ts`, cài react-router-dom, zustand, lucide-react; viết HashRouter, tokens, stub pages. `npm run build` đã pass.

## Parallel coding (cursor-agent)
- 2026-11-12 23:25:54 Asia/Saigon — Chạy song song PKG-A, PKG-B, PKG-C, PKG-D, PKG-E với model `grok-4.7-high` (hôm nay `claude-opus-5-5-high` và `gpt-5.6-sol-high` đã hết hạn mức; grok-4.7-high chạy được). Fallback nếu rate limit: `grok-4.7-xhigh` → `cursor-grok-4.5-high` → `gemini-3.8-flash-high` → `composer-2.5`.
- 2026-11-12 23:33:08 Asia/Saigon — PKG-A (`grok-4.7-high`) exit 1: Connection lost tới agentn.global.api5.cursor.sh, RetriableError [unavailable] sau 3 lần retry. Chưa ghi file domain/store. Chạy lại cùng model; nếu lặp lỗi sẽ đổi `grok-4.7-high-fast` hoặc `cursor-grok-4.5-high`.
- 2026-11-12 23:33:34 Asia/Saigon — PKG-E (`grok-4.7-high`) xong: erd.mmd, schema.dbml, schema.sql, wo-lifecycle.mmd, svg/png.
- 2026-11-12 23:39:15 Asia/Saigon — PKG-C (`grok-4.7-high`) treo: transcript không tăng từ 23:27, CPU 0, chưa tạo component agent/HITL. Kill pid 67207 và chạy lại cùng model.
- 2026-11-12 23:42:52 Asia/Saigon — PKG-B (`grok-4.7-high`) xong (exit 0, 23:41). Kanban 5 cột, badge chờ duyệt, lọc Sẵn sàng, 5 cổng UI. Build chưa chạy được vì thiếu domain/store (PKG-A).
- 2026-11-12 23:44:47 Asia/Saigon — PKG-A lần 2, PKG-C lần 2 và PKG-D treo (transcript không tăng, 0 Write). Kill pid 70028, 67455, 71695. Người điều phối viết nốt domain/store/agent/layout để khớp API đã khóa của PKG-B, rồi tích hợp.
- 2026-11-12 23:50:03 Asia/Saigon — Tích hợp xong, npm run build pass. Ảnh headless trong Prototype/screenshots/. README và plan/03-REVIEW.md đã ghi. Preview 4173 sẽ được tắt.\n
## Redesign Ant Design (2026-11-12 đêm)
- 2026-11-12 23:58:32 Asia/Saigon — Bắt đầu agy plan 04-REDESIGN-PLAN.md với gemini-3.8-flash-high. Đã cài antd@6.7.0 + @ant-design/icons@6.3.4. Bỏ pro-components (peer antd 5, không build được với antd 6).

- 2026-11-13 00:02:02 Asia/Saigon — Ghi Prototype/plan/04-REDESIGN-PLAN.md (điều phối, vì agy gemini-3.8-flash-high vẫn stream chưa ghi file sau ~2–3 phút). Skill/rule đã bắt buộc antd. Sắp chạy 5 cursor-agent PKG-R1..R5, model grok-4.7-high; fallback grok-4.7-high-fast → cursor-grok-4.5-high → composer-2.5.

- 2026-11-13 00:07:54 Asia/Saigon — 5 cursor-agent PKG-R1..R5 model grok-4.7-high: R3 exit 1 (Connection lost, RetriableError unavailable sau 3 retry). R1/R2/R4/R5 ~2 phút log 0 byte, chưa ghi src. Đã dừng wrapper và điều phối triển khai UI antd (cùng plan 04).

- 2026-11-13 00:18:07 Asia/Saigon — Redesign antd 6 xong (responsive + hamburger). `npm run build` pass, vite base '/'. Ảnh 1440/768/390 trong Prototype/screenshots2/. cursor-agent R1–R5: R3 mất kết nối, các gói còn lại không ghi file; điều phối implement theo plan 04. agy 04-plan: phiên stream chưa kịp ghi file, điều phối viết plan rồi code.
