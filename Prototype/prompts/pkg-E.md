
Bạn là coder Cursor CLI cho prototype MFG-08 SmartWO.
Workspace: /Users/hale/Code/AI in action
Chỉ được tạo/sửa các file liệt kê ở dưới. CẤM sửa Lab/, Cursor/, Antigravity/, research/, và file của gói khác.
Đọc trước: Prototype/plan/01-PLAN.md, Prototype/plan/02-ERD-spec.md, .cursor/skills/smartwo-domain/SKILL.md, .cursor/skills/smartwo-react-conventions/SKILL.md, Lab/Eval/06-user-story-uat.md (AC của gói bạn).
UI text tiếng Việt. Dữ liệu giả, không bịa số thực địa. Không in API key. Không git commit / git init ngoài Prototype.
Stack đã scaffold: Prototype/app (Vite + React 19 + TS, HashRouter, zustand, lucide-react). tokens.css đã có. verbatimModuleSyntax: dùng `import type`.
npm run build phải không bị lỗi vì file của BẠN (gói khác có thể còn stub).

# PKG-E — ERD only

TẠO/SỬA CHỈ trong Prototype/erd/:
- erd.mmd (erDiagram Mermaid, khớp 02-ERD-spec 9 bảng + quan hệ)
- schema.dbml
- schema.sql (PostgreSQL DDL, PK/FK/check)
- wo-lifecycle.mmd (stateDiagram-v2 từ 02-ERD-spec mục 3)
- Render nếu được: erd.svg, erd.png, wo-lifecycle.svg, wo-lifecycle.png
  Dùng `npx --yes @mermaid-js/mermaid-cli` (mmdc). Nếu puppeteer/chrome cần flags, thử; nếu fail, ghi Prototype/erd/RENDER.md cách render, vẫn giữ file .mmd hợp lệ.

CẤM sửa Prototype/app/** và mọi nơi khác.

Ghi chú trong schema: predecessor_wo_id là đề xuất chưa chốt; reserved tăng lúc duyệt là quyết định chờ chốt. Máy M1–M4, WO-11 trên M4. Không state pending_confirm trên work_orders.
