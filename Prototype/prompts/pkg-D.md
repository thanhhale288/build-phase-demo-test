
Bạn là coder Cursor CLI cho prototype MFG-08 SmartWO.
Workspace: /Users/hale/Code/AI in action
Chỉ được tạo/sửa các file liệt kê ở dưới. CẤM sửa Lab/, Cursor/, Antigravity/, research/, và file của gói khác.
Đọc trước: Prototype/plan/01-PLAN.md, Prototype/plan/02-ERD-spec.md, .cursor/skills/smartwo-domain/SKILL.md, .cursor/skills/smartwo-react-conventions/SKILL.md, Lab/Eval/06-user-story-uat.md (AC của gói bạn).
UI text tiếng Việt. Dữ liệu giả, không bịa số thực địa. Không in API key. Không git commit / git init ngoài Prototype.
Stack đã scaffold: Prototype/app (Vite + React 19 + TS, HashRouter, zustand, lucide-react). tokens.css đã có. verbatimModuleSyntax: dùng `import type`.
npm run build phải không bị lỗi vì file của BẠN (gói khác có thể còn stub).

# PKG-D — Layout, role switcher, line lead, audit, machine-down alert, Reset Demo

TẠO/SỬA CHỈ:
- Prototype/app/src/components/layout/Header.tsx
- Prototype/app/src/components/layout/RoleSwitcher.tsx
- Prototype/app/src/components/layout/AlertBanner.tsx
- Prototype/app/src/components/layout/layout.module.css
- Prototype/app/src/components/lead/LeadControlPanel.tsx
- Prototype/app/src/components/lead/ReportProgressModal.tsx
- Prototype/app/src/components/lead/lead.module.css
- Prototype/app/src/components/audit/AuditLogDrawer.tsx
- Prototype/app/src/components/audit/EventRow.tsx
- Prototype/app/src/components/audit/audit.module.css
- Prototype/app/src/pages/LeadPage.tsx (thay stub)
- Prototype/app/src/pages/AuditPage.tsx (thay stub)
- Được thêm: Prototype/app/src/components/layout/AppChrome.tsx — header+banner+nav, để PKG-F bọc vào App.tsx. CẤM sửa App.tsx / routes.tsx.

CẤM: store/domain/data, kanban, wo, agent, hitl, erd.

Contract store: role, setRole, resetSeed, startOrder, reportProgress, blockOrder, events, machines, workOrders, setMachineStatus (nếu có).

## Bắt buộc
- Header: tên "SmartWO — Điều độ lệnh (mô phỏng)", RoleSwitcher (Điều độ viên | Tổ trưởng chuyền), nút **Reset Demo** mọi vai (US-01 AC-05), nav Hash: Điều độ `#/dispatcher`, Tổ trưởng `#/lead`, Nhật ký `#/audit`, Demo duyệt stale `#/demo/stale-approve`.
- Khi role=line_lead: không hiện nút Duyệt/Từ chối (trang lead không có chúng). LeadPage chỉ lệnh từ released trở đi (WO-10 start, WO-11 qty hoặc block). Điều độ không start được (store sẽ 403 — UI ẩn nút).
- AlertBanner: nếu có máy DOWN hoặc MAINTENANCE, cảnh báo in-app, liệt kê **lệnh bị ảnh hưởng** (WO-04 với M2 DOWN trên seed). Không đề xuất đổi máy. Không Telegram.
- AuditPage: timeline events (ts, actor, role, type, wo_id, from_state, to_state). Giờ hiển thị Asia/Saigon.
- Tiếng Việt, theme sáng, tokens, không slop.
- Có thể thêm nút demo "Chuyển M2 thành DOWN" nếu seed đã DOWN thì banner hiện sẵn — đủ US-10.
