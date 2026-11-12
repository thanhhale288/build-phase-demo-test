---
name: smartwo-team-workflow
description: Dùng khi chia việc, viết user story, test, CI/CD, nhánh/PR, hoặc quy ước làm việc nhóm SmartWO / VinUni AI thực chiến. Bám workshop QTDA và notes 12/11.
---

# SmartWO — cách nhóm làm việc

Nguồn: `Prototype/plan/00-workshop-cach-lam-viec.md`, slide `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Lộc Đặng), `notes.md` (12/11/2026), `Lab/Eval/06-user-story-uat.md`.

## Kỷ luật đã được dạy

- **Project Charter tuần 1:** mục tiêu SMART, metric đo được, In/Out of scope, stakeholder. Chốt trước khi code nhiều.
- Vai: PO bảo vệ giá trị, Tech Lead bảo vệ kỹ thuật, PM bảo vệ thời gian.
- **Một file SSOT** (Git, Figma/UI, API/demo, backlog). Không có trong file đó = chưa tồn tại với mentor.
- Phát hành liên tục V1 (chạy được) → V2 → V3. Code tốt nhất là code đang chạy trên **production**. **CI/CD và VPS production dựng từ đầu**, không để cuối kỳ.
- Việc tính bằng **User Story**: "Với vai trò là [người dùng], tôi muốn [tính năng] để [lợi ích]". Mỗi US dễ thành bài **UAT trên production**.
- Sprint 1 tuần, scope đã chốt thì không thêm tùy hứng. Checkpoint tuần 3 (~80%) và tuần 5 (100% chạy production).
- Viết **Spec** (động lực, thiết kế gồm edge cases, plan + tiêu chí xong) trước khi gõ code tính năng lớn.
- Daily standup 10–15 phút: hôm qua / hôm nay / blocker. Họp kỹ thuật ngắn khi kẹt.
- Khuyến khích xung đột kỹ thuật (người chuyên môn sâu quyết). Không khuyến khích xung đột cái tôi.
- Retro Sad / Mad / Glad cuối sprint.
- Tinh thần đa chức năng: không nói "không phải việc của em"; FE kẹt thì người khác phụ; backend vắng thì mock API để làm tiếp.
- **Unit test** chạy CI, không cần API key (hàng policy: cổng, HITL, denylist).
- Bài test user story chạy trên URL production, dùng **Reset Demo** / `POST /demo/reset` để lặp lại an toàn.
- Tránh AI slop (UI, slide, văn bản). RAG không còn là hướng chính — dùng **personal agent** có tool.
- Nghiên cứu sản phẩm nước ngoài trước khi tuyên bố "sâu hơn"; không phóng đại so với SAP Joule.

## Acceptance cho prototype này

Lấy đúng US-01..US-10 và AC Given/When/Then trong `Lab/Eval/06-user-story-uat.md`. Không bịa AC khác. Ánh xạ package: xem `Prototype/plan/01-PLAN.md` mục 7.

Khi code xong một gói, đối chiếu checklist US/AC của gói đó. `npm run build` phải pass trước khi tích hợp xong.
