Bạn là cursor-agent, chỉ làm ĐÚNG gói được giao trong repo `/Users/hale/Code/AI in action`.

Đọc: `.cursor/skills/smartwo-react-conventions/SKILL.md`, `Prototype/plan/04-REDESIGN-PLAN.md`. KHÔNG đọc node_modules, KHÔNG sửa Lab/, Cursor/, Antigravity/, domain/, data/, store/.

Stack: Vite + React 19 + TS + antd 6.7 + @ant-design/icons. Không pro-components. UI tiếng Việt. Theme sáng compact, primary #1668DC. Dùng App.useApp() cho message. import type khi chỉ dùng type (verbatimModuleSyntax).

Không in API key. Không AI slop (cấm gradient tím, glow, emoji, copy marketing). `npm run build` phải còn pass — nếu bạn không chạy build toàn app vì gói khác chưa xong thì ít nhất tsc không lỗi trên file bạn sửa.

Khi xong, in ngắn: file đã sửa, component antd đã dùng.

# PKG-R2 — dispatcher board + stats

CHỈ sửa:
- `Prototype/app/src/components/kanban/**`
- `Prototype/app/src/pages/DispatcherPage.tsx`

Giữ props: KanbanBoard `{ activeWoId, onSelect }`, WorkOrderCard `{ wo, readiness, pending, active, onSelect }`, export `formatDue` và `stateLabel` (WO drawer đang import).

Làm:
- DispatcherPage: tiêu đề Typography, hàng Statistic trong Card (tổng lệnh, đủ cổng, phiếu pending, máy DOWN+MAINTENANCE, in_progress, blocked) — số từ store/getReadiness/hasPendingBadge. Giữ workspace: Kanban trái, rail phải `#smartwo-hitl-slot` + `#smartwo-agent-slot` (vẫn mount HitlPanel + AgentMount). Route `#/wo/:woId` vẫn mở WorkOrderDetailModal.
- Lọc Segmented: Tất cả / Sẵn sàng / Chờ duyệt / Bị kẹt cổng.
- 5 cột Card + Badge count; Empty khi trống; CSS modules chỉ để flex/scroll kanban (chiều cao khoảng còn lại viewport, không overflow trang).
- Thẻ Card size small: Tag state, Tag vàng [Chờ duyệt], Tag đỏ [LATE], Progress qty, Tooltip 5 cổng, hạn Asia/Saigon.
- Sort pending = true lên ĐẦU mỗi cột (WO-09 visible không cần scroll). Rồi mới sort theo wo_id.
