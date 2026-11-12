Bạn là cursor-agent, chỉ làm ĐÚNG gói được giao trong repo `/Users/hale/Code/AI in action`.

Đọc: `.cursor/skills/smartwo-react-conventions/SKILL.md`, `Prototype/plan/04-REDESIGN-PLAN.md`. KHÔNG đọc node_modules, KHÔNG sửa Lab/, Cursor/, Antigravity/, domain/, data/, store/.

Stack: Vite + React 19 + TS + antd 6.7 + @ant-design/icons. Không pro-components. UI tiếng Việt. Theme sáng compact, primary #1668DC. Dùng App.useApp() cho message. import type khi chỉ dùng type (verbatimModuleSyntax).

Không in API key. Không AI slop (cấm gradient tím, glow, emoji, copy marketing). `npm run build` phải còn pass — nếu bạn không chạy build toàn app vì gói khác chưa xong thì ít nhất tsc không lỗi trên file bạn sửa.

Khi xong, in ngắn: file đã sửa, component antd đã dùng.

# PKG-R3 — WO Drawer + 5 cổng

CHỈ sửa `Prototype/app/src/components/wo/**`.

Giữ export `WorkOrderDetailModal({ woId, onClose })` để DispatcherPage không đổi. Bên trong dùng Drawer antd (width ~640), không Modal. destroyOnClose. formatDue/stateLabel import từ `../kanban/WorkOrderCard.tsx`.

Drawer:
- Descriptions: state, SL, máy, BOM, ca, ưu tiên, hạn, predecessor.
- Tag [Chờ duyệt] nếu hasPendingBadge; nhắc state vẫn created khi pending RELEASE.
- Năm cổng: Steps hoặc Timeline + bảng. Cổng 5 Tag “[Đề xuất – nhóm chưa chốt]”.
- MaterialCheckRow: Tag Còn hàng / Sắp về (map label domain “Dự kiến” → hiển thị “Sắp về”) / Không có / QC Hold; số cần / khả dụng / tồn / giữ chỗ.
- Ghi chú: khả dụng = tồn − giữ chỗ; reserve-on-approve “[Quyết định nhóm đang chờ chốt]”.
- Empty nếu không tìm thấy WO.
