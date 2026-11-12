Bạn là cursor-agent, chỉ làm ĐÚNG gói được giao trong repo `/Users/hale/Code/AI in action`.

Đọc: `.cursor/skills/smartwo-react-conventions/SKILL.md`, `Prototype/plan/04-REDESIGN-PLAN.md`. KHÔNG đọc node_modules, KHÔNG sửa Lab/, Cursor/, Antigravity/, domain/, data/, store/.

Stack: Vite + React 19 + TS + antd 6.7 + @ant-design/icons. Không pro-components. UI tiếng Việt. Theme sáng compact, primary #1668DC. Dùng App.useApp() cho message. import type khi chỉ dùng type (verbatimModuleSyntax).

Không in API key. Không AI slop (cấm gradient tím, glow, emoji, copy marketing). `npm run build` phải còn pass — nếu bạn không chạy build toàn app vì gói khác chưa xong thì ít nhất tsc không lỗi trên file bạn sửa.

Khi xong, in ngắn: file đã sửa, component antd đã dùng.

# PKG-R1 — layout / theme

CHỈ tạo/sửa:
- `Prototype/app/src/theme/smartwoTheme.ts` (và index nếu cần)
- `Prototype/app/src/main.tsx` — bọc ConfigProvider locale `antd/es/locale/vi_VN` + dayjs `vi` + theme compact + Antd `App` + componentSize middle
- `Prototype/app/src/components/layout/**` — AppChrome dùng Layout + Sider light (Menu hash) + Header (Segmented vai, Button Reset Demo) + AlertBanner (Alert antd, liệt kê WO bị ảnh hưởng)
- `Prototype/app/src/components/layout/RoleSwitcher.tsx` — Segmented
- `Prototype/app/src/styles/global.css` và `tokens.css` — reset nhẹ, không palette song song

KHÔNG sửa pages, kanban, wo, hitl, agent, lead, audit, App.tsx, routes.tsx, domain/store.

Sider items: /dispatcher Điều độ, /lead Tổ trưởng, /audit Nhật ký, /demo/stale-approve Demo duyệt stale. Brand SmartWO (mô phỏng). Header nền trắng, không #001529. Layout min-height 100vh, Content padding 16 overflow auto.
