Bạn là cursor-agent, chỉ làm ĐÚNG gói được giao trong repo `/Users/hale/Code/AI in action`.

Đọc: `.cursor/skills/smartwo-react-conventions/SKILL.md`, `Prototype/plan/04-REDESIGN-PLAN.md`. KHÔNG đọc node_modules, KHÔNG sửa Lab/, Cursor/, Antigravity/, domain/, data/, store/.

Stack: Vite + React 19 + TS + antd 6.7 + @ant-design/icons. Không pro-components. UI tiếng Việt. Theme sáng compact, primary #1668DC. Dùng App.useApp() cho message. import type khi chỉ dùng type (verbatimModuleSyntax).

Không in API key. Không AI slop (cấm gradient tím, glow, emoji, copy marketing). `npm run build` phải còn pass — nếu bạn không chạy build toàn app vì gói khác chưa xong thì ít nhất tsc không lỗi trên file bạn sửa.

Khi xong, in ngắn: file đã sửa, component antd đã dùng.

# PKG-R4 — HITL + agent + stale demo

CHỈ sửa:
- `Prototype/app/src/components/hitl/**`
- `Prototype/app/src/components/agent/**`
- `Prototype/app/src/pages/DemoStalePage.tsx`

HITL:
- HitlPanel: Card/List phiếu pending, Empty nếu không có, footer nhãn reserve chờ chốt.
- HitlRequestCard: Tag action/status, mô tả lệnh. Dispatcher: Popconfirm Duyệt / Từ chối (giữ copy re-check hiện tại), gọi approveHitl/rejectHitl, message.success/error, Alert/Result nếu !ok (stale fail). Line lead: không nút, Alert không được duyệt.
- Có thể xóa ApproveDialog/RejectDialog nếu Popconfirm thay hết (đừng để import gãy).

Agent:
- Card “Trợ lý điều độ”, List chat, Typography, Tag SOP (Modal xem excerpt), Input.TextArea + gửi, Button gợi ý. inspectQuery denylist. explainBlocked / lookupSop / proposeRelease như code hiện tại. Không tự phát, không copy marketing.

DemoStalePage:
- Typography kịch bản, Button giả lập xuất kho BLT-1 (`simulateStale`), Link về điều độ, hiện state/readiness WO-09, HitlRequestCard HITL-09.
- Khi duyệt fail: Result hoặc Alert error. Nhắc Reset Demo.
