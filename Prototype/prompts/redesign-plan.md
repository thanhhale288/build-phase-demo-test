Bạn là Antigravity (agy) đang lập kế hoạch redesign UI cho prototype MFG-08 SmartWO.

VIẾT FILE (ghi đè nếu đã có): `/Users/hale/Code/AI in action/Prototype/plan/04-REDESIGN-PLAN.md`

ĐỌC (chỉ đọc, không sửa code app): `Prototype/plan/01-PLAN.md` (tóm tắt), `Prototype/README.md`, `Prototype/app/src/routes.tsx`, `Prototype/app/src/App.tsx`, `Prototype/app/src/main.tsx`, các page trong `Prototype/app/src/pages/`, cấu trúc `Prototype/app/src/components/`, `.cursor/skills/smartwo-react-conventions/SKILL.md`. KHÔNG sửa Lab/, Cursor/, Antigravity/, research, domain/store (trừ khi plan cần ghi chú API có sẵn).

BỐI CẢNH
- User feedback: "UI sơ sài quá". Thiết kế lại bằng Ant Design (https://github.com/ant-design/ant-design).
- Đã cài trong `Prototype/app`: `antd@^6.7.0` (latest v5+), `@ant-design/icons@^6.3.4`.
- KHÔNG dùng `@ant-design/pro-components`: peer hiện tại chỉ `antd ^4.24.15 || ^5.11.2`, sẽ phá build với antd 6. Dùng antd core: Layout, Table, Card, Statistic, v.v.
- Giữ nguyên: domain/, data/seed, store logic, hash routes, Reset Demo, 5 cổng, badge [Chờ duyệt] (không cột Pending riêng), nhãn cổng 5 đề xuất, nhãn reserve chờ chốt, seed WO-11 trên M4, tiếng Việt, không AI slop.
- Vite + React 19 + TS. Locale: `antd/locale/vi_VN` (hoặc `antd/es/locale/vi_VN` nếu Vite production lỗi default export). dayjs locale `vi`. Bọc `ConfigProvider` + `App` (antd) để `message`/`notification`/`modal` nhận theme. Theme sáng, `theme.compactAlgorithm`, một màu primary, mật độ compact cho công cụ điều độ.
- Giá trị thiết kế Ant Design: Natural, Certain, Meaningful, Growing — restraint, modular, immediate feedback, proximity/alignment/contrast/repetition. Công cụ nội bộ nhà máy, không marketing AI.

YÊU CẦU NỘI DUNG PLAN (tiếng Việt, cụ thể, làm được ngay)

1. Theme tokens (ConfigProvider): colorPrimary đề xuất (một màu, ví dụ xanh điều độ công nghiệp, không tím hồng), colorSuccess/Error/Warning khớp pass/fail/pending hiện có, font system-ui, Layout headerBg/siderBg sáng (không dùng header tối #001529 mặc định nếu không hợp light tool), bodyBg, borderRadius, componentSize. compactAlgorithm. Ghi rõ file theme (ví dụ `src/theme/smartwoTheme.ts`) do gói Layout sở hữu.

2. Mapping từng trang → component antd (bắt buộc, chi tiết):
   - Shell: Layout + Sider (Menu điều hướng hash) + Header (Segmented vai + Button Reset Demo + typography title). Alert banner máy DOWN/MAINTENANCE = Alert, liệt kê lệnh bị ảnh hưởng.
   - Dispatcher: hàng Statistic (số WO theo state, phiếu pending, máy dừng); Kanban 5 cột = Card; thẻ WO = Card/Badge/Tag ( [Chờ duyệt], [LATE] ), Progress cho qty, chỉ báo 5 cổng = Tag hoặc chấm + Tooltip; bộ lọc Segmented/Radio (Tất cả / Sẵn sàng / Chờ duyệt / Bị kẹt cổng). WO-09 phải thấy được không cần scroll: sắp thẻ pending lên đầu cột VÀ/HOẶC thanh/list phiếu chờ luôn visible.
   - Chi tiết WO: Drawer (không Modal chật) với Descriptions, Steps hoặc Timeline cổng, bảng vật tư Table/Descriptions, Tag kiểu Katana: Còn hàng / Sắp về / Không có / QC Hold. Cổng 5 có Tag đề xuất.
   - HITL: List hoặc Card, Popconfirm Duyệt/Từ chối, Result hoặc Alert khi duyệt stale fail; message.success/error. Ghi chú reserve: quyết định nhóm đang chờ chốt.
   - Agent: panel chat List + typography, Tag trích SOP, Input.Search / Input.TextArea, quick suggestions Button. Không gradient, không “Ask your AI anything”.
   - Tổ trưởng: Table + actions Start / sản lượng / Báo tắc; Modal nhập qty hoặc lý do tắc; Alert nếu chưa đúng vai + Button chuyển vai. Không nút Duyệt.
   - Nhật ký: Table có filter + có thể kèm Timeline; giờ Asia/Saigon.
   - Demo stale-approve: mô tả + Button giả lập + Result/Alert sau fail.
   - Empty: dùng Empty của antd cho cột/bảng trống.

3. Sở hữu file cho 5 gói cursor-agent + 1 gói tích hợp (không chồng file):
   - PKG-R1 layout/theme: main.tsx ConfigProvider+App, theme file, AppChrome, Header, Sider/Menu, RoleSwitcher (Segmented), AlertBanner, styles tối giản (bỏ tokens thủ công nơi antd thay thế, giữ global reset nhẹ), không sửa page nghiệp vụ.
   - PKG-R2 dispatcher board + stats: Kanban*, DispatcherPage, statistic row. Slot cho HITL/agent nếu đã có.
   - PKG-R3 WO drawer + gates: FiveGatesTable, MaterialCheckRow, WorkOrderDetail — đổi Modal thành Drawer; route `#/wo/:woId` mở drawer.
   - PKG-R4 HITL + agent + DemoStalePage.
   - PKG-R5 lead Table + audit Table/Timeline + LeadPage + AuditPage.
   - PKG-R6 integration: App/routes nếu cần, build fix, typings, bỏ lucide nếu không còn dùng, bảo đảm npm run build pass.
   Domain/store/data KHÔNG đổi trừ khi thiếu API (ghi rõ, đừng bịa).

4. Anti-slop + brand: cấm gradient tím, glow, emoji thừa, copy marketing. Một primary. Spacing nhất quán (antd token). Icon từ `@ant-design/icons`.

5. Kiểm chứng: build phải pass; screenshot 1440x900 từng route, lead ở vai tổ trưởng, drawer WO mở, stale-approve sau fail.

6. Checklist việc không làm: không đổi seed để hai WO chạy cùng máy; không thêm cột Pending; không gọi LLM thật; không thêm pro-components.

Cuối file: checklist A–F cho từng gói + tiêu chí “xong”. Viết plan đủ để agent khác code mà không hỏi lại. Chỉ viết file plan, không sửa app.
