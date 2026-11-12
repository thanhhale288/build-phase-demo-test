
Bạn là coder Cursor CLI cho prototype MFG-08 SmartWO.
Workspace: /Users/hale/Code/AI in action
Chỉ được tạo/sửa các file liệt kê ở dưới. CẤM sửa Lab/, Cursor/, Antigravity/, research/, và file của gói khác.
Đọc trước: Prototype/plan/01-PLAN.md, Prototype/plan/02-ERD-spec.md, .cursor/skills/smartwo-domain/SKILL.md, .cursor/skills/smartwo-react-conventions/SKILL.md, Lab/Eval/06-user-story-uat.md (AC của gói bạn).
UI text tiếng Việt. Dữ liệu giả, không bịa số thực địa. Không in API key. Không git commit / git init ngoài Prototype.
Stack đã scaffold: Prototype/app (Vite + React 19 + TS, HashRouter, zustand, lucide-react). tokens.css đã có. verbatimModuleSyntax: dùng `import type`.
npm run build phải không bị lỗi vì file của BẠN (gói khác có thể còn stub).

# PKG-C — Personal Agent, SOP lookup, HITL, demo stale approve

TẠO/SỬA CHỈ:
- Prototype/app/src/components/agent/AgentDrawer.tsx
- Prototype/app/src/components/agent/ChatHistory.tsx
- Prototype/app/src/components/agent/QuickSuggestions.tsx
- Prototype/app/src/components/agent/SopViewerModal.tsx
- Prototype/app/src/components/agent/agent.module.css
- Prototype/app/src/components/hitl/HitlRequestCard.tsx
- Prototype/app/src/components/hitl/ApproveDialog.tsx
- Prototype/app/src/components/hitl/RejectDialog.tsx
- Prototype/app/src/components/hitl/hitl.module.css
- Prototype/app/src/pages/DemoStalePage.tsx (thay stub)
- Prototype/app/src/pages/AgentHost.tsx  — KHÔNG, đừng tạo page ngoài danh sách. Để AgentDrawer tự dùng được từ DemoStalePage. DispatcherPage thuộc B — CẤM sửa DispatcherPage.
  Được phép thêm: Prototype/app/src/components/agent/AgentMount.tsx xuất component để F gắn vào DispatcherPage.

CẤM: store, domain, data, kanban, wo, layout, lead, audit, App.tsx, routes.tsx (routes đã có #/demo/stale-approve).

Import store/domain theo contract (A chạy song song):
- inspectQuery(text), explainBlocked(woId), lookupSop, proposeRelease, approveHitl, rejectHitl, simulateStale, getReadiness, role, hitlRequests, workOrders
- Denylist chỉ trên câu user. Trúng thì trả lời từ chối tiếng Việt, không gọi "model", không tạo phiếu, không đổi state.
- explainBlocked: lời tiếng Việt, số khớp gates, kèm citation SOP (id + excerpt). Không tool release.
- Tạo phiếu chỉ khi overallReady; báo lỗi nếu cổng đỏ hoặc đã có phiếu pending.
- ApproveDialog: cảnh báo re-check; nếu store trả stale, hiện lỗi đỏ, không nói đã phát. Nhãn nhỏ: "Giữ chỗ vật tư lúc duyệt: quyết định nhóm đang chờ chốt".
- RejectDialog cho cả RELEASE và CANCEL; reject CANCEL không được làm UI giả định lệnh tụt về kế hoạch.
- DemoStalePage (`#/demo/stale-approve`): chọn/cố định WO-09, nút "Giả lập xuất kho đột xuất bu-lông BLT-1", sau đó nút Duyệt; kỳ vọng fail, state vẫn created. Link/hướng dẫn reset ("Reset Demo ở header — PKG-D").
- Quick suggestions không vi phạm denylist (tham chiếu NEG examples).
- Style: panel công cụ nội bộ, không "Ask your AI anything", không orb/gradient.

Framing: "Trợ lý điều độ" (personal agent), không ghi "hệ thống RAG".
