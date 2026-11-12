Bạn là planner cho prototype wireframe MFG-08 SmartWO (VinUni AI thực chiến, khóa 5, Track 3). Viết kế hoạch bằng tiếng Việt, rõ ràng, không bịa số liệu thực địa, đánh dấu giả định khi cần.

# NHIỆM VỤ
Chỉ được TẠO file MỚI trong thư mục:
  /Users/hale/Code/AI in action/Prototype/plan/
Không sửa file ngoài Prototype/. Không commit git. Không in API key.

Tạo đúng 4 file:
1. /Users/hale/Code/AI in action/Prototype/plan/00-workshop-cach-lam-viec.md
2. /Users/hale/Code/AI in action/Prototype/plan/01-PLAN.md
3. /Users/hale/Code/AI in action/Prototype/plan/02-ERD-spec.md
4. /Users/hale/Code/AI in action/Prototype/plan/MODEL-LOG.md  (ghi model bạn đang dùng, thời điểm Asia/Saigon, nguồn đã đọc)

# BẮT BUỘC ĐỌC TRƯỚC KHI VIẾT
- Thư mục (có dấu cách cuối tên): `/Users/hale/Code/AI in action/Workshop QTDA + Quản lý nhóm /`
  Đặc biệt file `slide QTDA & Quản lý nhóm.html` (workshop QTDA & quản lý nhóm, mentor Lộc Đặng). Cũng xem các file khác trong folder (template charter, template quản trị nhóm, pptx, docx) nếu đọc được.
- `/Users/hale/Code/AI in action/notes.md` (workshop 12/11: CI/CD + VPS production ngay từ đầu, unit test, UAT trên production theo user story, nghiên cứu sản phẩm nước ngoài, tránh AI slop, RAG outdated → personal agent, UI/UX chỉn chu, làm tốt cả slide)
- `/Users/hale/Code/AI in action/Tongketdahoc.md`
- `/Users/hale/Code/AI in action/Cursor/00-TONG-HOP-KIEM-CHUNG.md`
- `/Users/hale/Code/AI in action/Lab/Product/*.md`
- `/Users/hale/Code/AI in action/Lab/Eval/*.md` (đọc để biết stop-rule, denylist, scorecard — đừng mở rộng scope)
- `/Users/hale/Code/AI in action/research/mfg-08/` (01–10, đặc biệt 04 nghiệp vụ, 06 thiết kế/schema/seed 12 WO, 07 eval)

# QUYẾT ĐỊNH ĐÃ CHỐT (KHÔNG ĐỔI)
- Đề: MFG-08 SmartWO. Wireframe HTML đủ nộp hình dung, nhưng stack chốt **Vite + React + TypeScript**. App nằm ở `Prototype/app`. Phải `npm run build` ra `dist/` mở được / serve local (`vite preview`).
- **5 cổng readiness** (hiển thị cả 5; đây là quyết định wireframe để nhóm nhìn):
  1. Vật tư: mọi dòng critical thỏa `(on_hand − reserved) ≥ required` VÀ không QC hold
  2. Máy: máy gán đang chạy được, không DOWN/MAINTENANCE, không bị lệnh khác chiếm
  3. Người: đủ người đúng skill trong ca (dữ liệu giả lập)
  4. `bom_rev` của lệnh trùng bản hiện hành của SKU
  5. Công đoạn / WO tiền nhiệm đã Done (nếu lệnh có predecessor)
- AI agent: panel giải thích lệnh bị chặn bằng tiếng Việt dễ hiểu; tra SOP bằng **tool lookup mỏng** (framing "personal agent" có công cụ, KHÔNG gọi là "hệ thống RAG"). AI KHÔNG BAO GIỜ tự phát lệnh; chỉ tạo phiếu HITL.
- Điều độ viên (dispatcher): Approve (phải re-check 5 cổng; nếu vẫn đủ thì **trừ/giữ chỗ vật tư ngay lúc Duyệt**) / Reject. Phải có case demo: dữ liệu đổi giữa lúc mở phiếu và lúc bấm Duyệt → approve thất bại.
- Tổ trưởng (line lead): start / nhập qty / block. Không có nút phát lệnh.
- Kanban cột: Planned / Ready / Pending approval / Released / In progress / Blocked / Done, có badge pending. (Lưu ý research 06: trạng thái gốc không nhảy vào pending_confirm — cột "Pending approval" là **góc nhìn UI** khi `work_orders.status` vẫn created/planned và có `hitl_requests` mở. Ghi rõ mapping này trong plan.)
- Audit log. Cảnh báo exception máy hỏng. Role switcher hai vai.
- Bối cảnh: chuyền lắp cụm cửa mô phỏng. 8–12 lệnh seed **rõ là giả**. Có thể dùng bộ 12 WO trong research/mfg-08/06, bổ sung ít nhất 1 lệnh fail cổng predecessor, và 1 kịch bản "approve fail after data change" (nút demo hoặc WO dành riêng).
- Out of scope: OR-Tools, tách WO, dashboard OTIF/WIP, Telegram, soft-lock tồn kho lúc check (trước khi người duyệt), LangGraph ghi thẳng work_orders, solver.
- UI: công cụ nội bộ chuyên nghiệp, theme sáng, tiếng Việt, tiết chế, không AI-gradient slop (không tím hồng glow, không orb, không "Ask your AI anything" marketing copy).
- Cần ERD (spec trong 02-ERD-spec.md; file vẽ do package E làm sau).

# NỘI DUNG TỪNG FILE

## 00-workshop-cach-lam-viec.md
Tóm tắt cách nhóm được dạy làm việc (từ slide HTML + notes 12/11 + template nếu đọc được). Gồm: Project Charter tuần 1, vai PO/Tech Lead/PM, Single Source of Truth (1 file, Git/Figma/API/task), phát hành liên tục V1→V2→V3 và production sớm, User Story + UAT, Sprint 1 tuần + checkpoint, viết Spec trước khi code, daily standup, xung đột kỹ thuật vs cá nhân, retro Sad-Mad-Glad, tinh thần đa chức năng, CI/CD và VPS production từ đầu, unit test, bài test user story trên production, tránh AI slop, personal agent thay RAG. Ghi rõ nguồn từng ý. Không bịa.

## 01-PLAN.md
Kế hoạch dựng prototype, đủ để nhiều coder chạy song song không đụng file. Bắt buộc có:
- Mục tiêu prototype + phạm vi / out of scope
- Kiến trúc frontend-only (mock store, không backend thật; cổng là hàm TypeScript thuần, deterministic)
- Stack: Vite + React + TS, react-router (hash router để preview/file mở ổn định), không UI kit nặng (không MUI). CSS modules hoặc một file CSS có biến, không Tailwind bắt buộc. Font hệ thống hoặc một font trung tính.
- Cây thư mục `Prototype/app/src/...` chi tiết
- Cây component
- Các màn hình / route (hash hoặc query để mỗi màn chụp screenshot được, ví dụ `#/dispatcher`, `#/wo/WO-02`, `#/lead`, `#/audit`, `#/demo/stale-approve`)
- Data model TypeScript (khớp ERD)
- Mock data: liệt kê 10–12 WO, vật tư, máy, labor, BOM, predecessor, 5 file SOP giả (id, title, đoạn trích), hitl seed, exception máy
- Gate engine: chữ ký hàm, thứ tự cổng, công thức vật tư, re-check lúc approve, reserve lúc approve thành công, rollback/không reserve nếu fail
- HITL flow, denylist chat (từ Lab/Eval), AI không có tool release
- Mapping Kanban cột ↔ state + phiếu
- Package công việc ĐỘC LẬP với **file ownership tuyệt đối** (không hai package sửa cùng một file). Đề xuất:
  - PKG-0 Scaffold (làm TRƯỚC, 1 người): Vite app, tsconfig, index.html, src/main.tsx, src/App.tsx (shell tối thiểu + router outlet), src/styles/tokens.css, package.json. Sau đó các package khác mới chạy song song.
  - PKG-A Domain: types, mock data, gate engine, store/actions (approve/reject/start/qty/block/reserve/demo-stale). Files: src/domain/**, src/data/**, src/store/**
  - PKG-B Kanban + WO detail + gates UI (dispatcher view). Files: src/components/kanban/**, src/components/wo/**, src/pages/DispatcherPage.tsx
  - PKG-C AI agent panel + SOP lookup mock + HITL ticket UI + approve/reject + stale-approve demo. Files: src/components/agent/**, src/components/hitl/**, src/pages/HitlFlows (nếu cần)
  - PKG-D Layout, role switcher, line lead view, audit log, machine-down alert. Files: src/components/layout/**, src/components/lead/**, src/components/audit/**, src/components/alerts/**, src/pages/LeadPage.tsx, src/pages/AuditPage.tsx
  - PKG-E ERD: chỉ viết trong `Prototype/erd/` (erd.mmd mermaid erDiagram, schema.dbml, schema.sql Postgres, render svg/png bằng mermaid-cli nếu có). KHÔNG sửa app.
  - PKG-F Integration (SAU CÙNG, 1 người): nối store vào UI, sửa TS/build, README chưa viết (executor sẽ viết README), đảm bảo `npm run build` pass.
- Với mỗi package: mô tả, file được phép tạo/sửa, file cấm đụng, acceptance criteria cụ thể (checklist).
- Quy ước UI anti-slop (màu, typography, khoảng trắng, tiếng Việt, không icon rực)
- Kịch bản demo 2 phút
- Rủi ro song song và cách tránh

## 02-ERD-spec.md
Đặc tả ERD cho MES giả lập, bám research/mfg-08/06 (sku_master, materials, machines, labor, work_orders, wo_materials, hitl_requests, events) và BỔ SUNG những gì 5 cổng + predecessor + SOP lookup + audit cần (ví dụ: wo_predecessors hoặc predecessor_wo_id; sop_documents; quality hold trên materials; reserved tăng khi approve). Mỗi entity: thuộc tính, PK, FK, mô tả ngắn, ràng buộc. Ghi quan hệ. Ghi chú state machine WO. Phân biệt bảng thật (khi build backend) vs dữ liệu mock trên prototype. Nhúng một khối ```mermaid erDiagram``` hoàn chỉnh, hợp lệ.

## MODEL-LOG.md
- Thời điểm (Asia/Saigon)
- Model thực tế
- Danh sách file nguồn đã đọc
- Nếu thiếu file nào thì ghi

Viết đủ chất lượng để Cursor CLI code theo mà không cần hỏi lại. Giữ plan vừa đủ, đừng viết tiểu thuyết.
