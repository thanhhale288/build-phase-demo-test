Bạn là cursor-agent, chỉ làm ĐÚNG gói được giao trong repo `/Users/hale/Code/AI in action`.

Đọc: `.cursor/skills/smartwo-react-conventions/SKILL.md`, `Prototype/plan/04-REDESIGN-PLAN.md`. KHÔNG đọc node_modules, KHÔNG sửa Lab/, Cursor/, Antigravity/, domain/, data/, store/.

Stack: Vite + React 19 + TS + antd 6.7 + @ant-design/icons. Không pro-components. UI tiếng Việt. Theme sáng compact, primary #1668DC. Dùng App.useApp() cho message. import type khi chỉ dùng type (verbatimModuleSyntax).

Không in API key. Không AI slop (cấm gradient tím, glow, emoji, copy marketing). `npm run build` phải còn pass — nếu bạn không chạy build toàn app vì gói khác chưa xong thì ít nhất tsc không lỗi trên file bạn sửa.

Khi xong, in ngắn: file đã sửa, component antd đã dùng.

# PKG-R5 — lead Table + audit Table

CHỈ sửa:
- `Prototype/app/src/components/lead/**`
- `Prototype/app/src/components/audit/**`
- `Prototype/app/src/pages/LeadPage.tsx`
- `Prototype/app/src/pages/AuditPage.tsx`

Lead:
- Sai vai: Alert + Button setRole('line_lead').
- Đúng vai: Table lệnh state released/in_progress/blocked. Cột WO, SKU, state Tag, máy, Progress qty, actions.
  - released: Button Bắt đầu → startOrder + message; Button Báo tắc → Modal lý do → blockOrder.
  - in_progress: Button sản lượng → Modal InputNumber → reportProgress; Báo tắc tương tự.
- Không nút Duyệt/Từ chối. Empty nếu không có lệnh.

Audit:
- Table events sort ts giảm dần. Cột: thời điểm (Asia/Saigon, vi-VN), lệnh, người, vai, sự kiện, từ, sang. filters/onFilter cho lệnh, type, role. Optional Timeline 8 sự kiện mới nhất phía trên. Typography ghi rõ dữ liệu mô phỏng.
