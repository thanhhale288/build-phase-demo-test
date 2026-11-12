---
name: smartwo-react-conventions
description: Dùng khi scaffold, viết, sửa hoặc style app React của prototype SmartWO (Prototype/app). Quy ước stack Ant Design, theme, thư mục, và chống AI slop.
---

# SmartWO — quy ước React (Ant Design)

Nguồn: `Prototype/plan/01-PLAN.md`, `Prototype/plan/04-REDESIGN-PLAN.md`. App chỉ nằm trong `Prototype/app`. Không sửa `Lab/`, `Cursor/`, `Antigravity/`, research, hay file dự án ngoài Prototype (trừ `.cursor/skills` và `.cursor/rules` đã có).

## Stack

- Vite + React + TypeScript
- `react-router-dom` với **HashRouter** (preview/`dist` không 404)
- Zustand cho store (`useAppStore`) — **không đổi domain/store/seed** trừ khi plan chỉ rõ API thiếu
- **Ant Design 6** (`antd@^6.7`) + `@ant-design/icons` là design system bắt buộc
- **Không** cài `@ant-design/pro-components` (peer chỉ antd 4/5, phá build với antd 6)
- **Không** Tailwind / MUI. Không thêm CSS framework khác
- CSS Modules chỉ còn cho chỗ antd không phủ (layout chiều cao 100vh, kanban cuộn ngang). Không invent palette song song — màu lấy từ token theme
- Font: `system-ui, -apple-system, "Segoe UI", sans-serif`
- Icon: `@ant-design/icons`. Có thể gỡ `lucide-react` nếu không còn import
- Locale: `ConfigProvider` + `antd/locale/vi_VN` (hoặc `antd/es/locale/vi_VN` nếu Vite production lỗi default export) + `dayjs/locale/vi`
- Bọc `ConfigProvider` và `App` (antd) ở `main.tsx` để `message` / `notification` / `modal` nhận theme. Dùng `App.useApp()`, không gọi `message` tĩnh nếu có thể

Route hash (mỗi màn chụp được):

- `#/dispatcher` — Kanban điều độ + Statistic + phiếu HITL + trợ lý
- `#/wo/:woId` — cùng trang, **Drawer** chi tiết lệnh / 5 cổng
- `#/lead` — tổ trưởng (Table + Modal)
- `#/audit` — nhật ký (Table, filter, giờ Asia/Saigon)
- `#/demo/stale-approve` — kịch bản duyệt stale (Result/Alert)

## Theme (bắt buộc)

File sở hữu: `src/theme/smartwoTheme.ts` (PKG-R1).

- Theme **sáng**, `theme.compactAlgorithm`, mật độ compact cho công cụ điều độ (`componentSize`: `middle` hoặc `small`, thống nhất)
- **Một** `colorPrimary` (xanh điều độ công nghiệp, ví dụ `#1668DC` hoặc `#0D47A1`). Không đổi primary theo trang
- `colorSuccess` pass `#198754`, `colorError` fail/late `#DC3545`, `colorWarning` chờ duyệt `#F59E0B`
- Layout sáng: `headerBg` / `siderBg` / `lightSiderBg` trắng, `bodyBg` xám rất nhạt (`#F5F7FA`). Không dùng header tối `#001529` mặc định
- `borderRadius` vừa phải (6–8). Spacing lấy token antd
- Giá trị thiết kế Ant Design: Natural, Certain, Meaningful, Growing — tiết chế, modular, phản hồi ngay, căn chỉnh/lặp lại nhất quán

## Mapping component (tham chiếu plan 04)

- Shell: `Layout` + `Sider` + `Menu` (hash nav) + `Header` (`Segmented` vai, `Button` Reset Demo)
- Cảnh báo máy: `Alert` + danh sách lệnh bị ảnh hưởng
- Dispatcher: hàng `Statistic`; cột Kanban = `Card`; thẻ WO = `Card` + `Badge`/`Tag` + `Progress` qty + `Tag`/`Tooltip` cổng
- Lọc: `Segmented` hoặc `Radio.Group` (Tất cả / Sẵn sàng / Chờ duyệt / Bị kẹt cổng)
- Thẻ có phiếu pending **đưa lên đầu cột** để WO-09 thấy được không cần scroll; panel phiếu chờ luôn visible
- Chi tiết WO: `Drawer` + `Descriptions` + `Steps`/`Timeline` + bảng vật tư; Tag Katana: Còn hàng / Sắp về (map từ `Dự kiến`) / Không có / QC Hold
- HITL: `List`/`Card` + `Popconfirm` Duyệt/Từ chối; thất bại = `Result`/`Alert` + `message`
- Agent: `List` kiểu chat, `Typography`, `Tag` trích SOP, gợi ý `Button`. Không copy marketing
- Tổ trưởng: `Table` + `Modal` qty/lý do tắc; nếu sai vai: `Alert` + nút chuyển vai. Không nút Duyệt
- Nhật ký: `Table` có filter, có thể kèm `Timeline`
- Cột/bảng trống: `Empty`

Nhãn bắt buộc: cổng 5 `[Đề xuất – nhóm chưa chốt]`; reserve-on-approve `[Quyết định nhóm đang chờ chốt]`.

## Sở hữu file — đợt redesign (không đụng file của gói khác)

- PKG-R1 layout/theme: `src/theme/**`, `src/main.tsx`, `src/components/layout/**`, `src/styles/**` (reset nhẹ). Không sửa page nghiệp vụ
- PKG-R2 dispatcher + stats: `src/components/kanban/**`, `src/pages/DispatcherPage.tsx`
- PKG-R3 WO drawer + gates: `src/components/wo/**`
- PKG-R4 HITL + agent + stale: `src/components/agent/**`, `src/components/hitl/**`, `src/pages/DemoStalePage.tsx`
- PKG-R5 lead + audit: `src/components/lead/**`, `src/components/audit/**`, `src/pages/LeadPage.tsx`, `src/pages/AuditPage.tsx`
- PKG-R6 integration: `App.tsx`, `routes.tsx` nếu cần, vá import/build, gỡ dep chết
- Domain/data/store: **không đổi** trừ lỗ API đã ghi trong plan

Export type và hook rõ ràng. Import `useAppStore` như hiện có (`role`, `workOrders`, `hitlRequests`, `getReadiness`, `setRole`, `resetSeed`, `approveHitl`, `rejectHitl`, `startOrder`, `reportProgress`, `blockOrder`, `simulateStale`, `inspectQuery`, `lookupSop`, `explainBlocked`, `proposeRelease`).

## UI / anti-slop (bắt buộc)

Công cụ nội bộ, theme sáng, tiếng Việt xưởng, tiết chế.

- **CẤM** gradient tím hồng, glow neon, quả cầu AI, emoji thừa, copy marketing ("Ask your AI anything", "Magic auto solver")
- Số trên cổng / thẻ / Statistic lấy từ `gates[]` / store, không lấy từ câu model
- Lọc "Sẵn sàng" kiểu Odoo: lệnh `overallReady`
- Đèn/Tag xanh đỏ từng cổng kiểu MRPeasy; bước Duyệt tường minh (`Popconfirm`)
- Cảnh báo máy DOWN kèm **danh sách lệnh bị ảnh hưởng**
- Tổ trưởng không thấy nút Duyệt/Từ chối; điều độ không thấy Start/qty/block
- `npm run build` phải pass. UI text = tiếng Việt
- Không đọc/sửa `node_modules` khi làm việc
