
Bạn là coder Cursor CLI cho prototype MFG-08 SmartWO.
Workspace: /Users/hale/Code/AI in action
Chỉ được tạo/sửa các file liệt kê ở dưới. CẤM sửa Lab/, Cursor/, Antigravity/, research/, và file của gói khác.
Đọc trước: Prototype/plan/01-PLAN.md, Prototype/plan/02-ERD-spec.md, .cursor/skills/smartwo-domain/SKILL.md, .cursor/skills/smartwo-react-conventions/SKILL.md, Lab/Eval/06-user-story-uat.md (AC của gói bạn).
UI text tiếng Việt. Dữ liệu giả, không bịa số thực địa. Không in API key. Không git commit / git init ngoài Prototype.
Stack đã scaffold: Prototype/app (Vite + React 19 + TS, HashRouter, zustand, lucide-react). tokens.css đã có. verbatimModuleSyntax: dùng `import type`.
npm run build phải không bị lỗi vì file của BẠN (gói khác có thể còn stub).

# PKG-B — Kanban 5 cột + WO detail + 5 cổng UI

TẠO/SỬA CHỈ:
- Prototype/app/src/components/kanban/KanbanBoard.tsx
- Prototype/app/src/components/kanban/KanbanColumn.tsx
- Prototype/app/src/components/kanban/WorkOrderCard.tsx
- Prototype/app/src/components/kanban/kanban.module.css
- Prototype/app/src/components/wo/WorkOrderDetailModal.tsx
- Prototype/app/src/components/wo/FiveGatesTable.tsx
- Prototype/app/src/components/wo/MaterialCheckRow.tsx
- Prototype/app/src/components/wo/wo.module.css
- Prototype/app/src/pages/DispatcherPage.tsx  (đang là stub — THAY nội dung)

CẤM: src/store/**, src/domain/**, src/data/**, src/components/agent/**, src/components/hitl/**, src/components/layout/**, src/components/lead/**, src/components/audit/**, App.tsx, routes.tsx, Prototype/erd/**

Nếu `src/store/useAppStore.ts` hoặc `src/domain/*` chưa có (gói A chạy song song), hãy:
1. Vẫn `import { useAppStore } from '../../store/useAppStore.ts'` và `import type { ... } from '../../domain/types.ts'` cùng helper từ `../../domain/gateEngine.ts` / `kanban.ts` với API dự kiến:
   - useAppStore(): { role, workOrders, hitlRequests, getReadiness(woId), ... }
   - checkReadiness / getReadiness -> ReadinessResult (gates[], overallReady, late)
   - kanbanColumn, hasPendingBadge
2. Không tự viết lại store. Nếu import fail lúc build, để nguyên import đúng contract — PKG-F sẽ nối.

## UI bắt buộc (US-01, US-02)
- 5 cột: Chưa phát, Đã phát, Đang chạy, Tắc, Xong. KHÔNG có cột Pending approval.
- WO-09 ở Chưa phát, badge vàng `[Chờ duyệt]`. State không hiện là pending_confirm.
- WO-08 cờ `[LATE]` đỏ, tách với cổng.
- Lọc kiểu Odoo trên board: Tất cả / Sẵn sàng (overallReady) / Chờ duyệt / Bị kẹt cổng.
- Click thẻ: mở chi tiết (modal hoặc panel). Route `#/wo/:woId` (useParams) cũng mở đúng lệnh.
- FiveGatesTable: 5 hàng đèn xanh/đỏ (MRPeasy). Cổng 5 luôn có nhãn `[Đề xuất – nhóm chưa chốt]`. Số evidence từ gates (required/available), không bịa.
- MaterialCheckRow: nhãn Còn hàng / Không có / QC Hold (Katana-style).
- Tiếng Việt, theme sáng, tokens.css, CSS modules, không gradient/glow/orb.
- DispatcherPage: bố cục board + chỗ trống bên phải hoặc dưới cho agent/HITL (PKG-C sẽ mount nếu bạn để một vùng `id="smartwo-agent-slot"` và `id="smartwo-hitl-slot"` trống — được phép, không import agent).

Khi role là line_lead, trang này có thể không dùng (LeadPage thuộc D). Vẫn ẩn nút duyệt nếu lỡ render (nút duyệt thuộc C).
