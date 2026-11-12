# Nhật Ký Thực Thi Mô Hình (MODEL-LOG) — Lập Kế Hoạch Prototype MFG-08 SmartWO

- **Thời điểm hoàn thành và cập nhật cuối cùng:** 2026-11-12 23:22:00 (Múi giờ Asia/Saigon, UTC+7).
- **Mô hình AI thực tế sử dụng:** **Gemini 3.8 Flash (High)** (chạy trên môi trường Antigravity CLI v1.5.6, chế độ suy luận chuyên sâu high effort, tham số `-p="$PROMPT"`).
- **Vai trò đảm nhiệm:** Planner / Kiến trúc sư giải pháp cho Prototype Wireframe tương tác cao MFG-08 SmartWO (Chương trình VinUni AI Thực Chiến — Khóa 5, Track 3).

---

## 1. Danh Sách Các Tài Liệu Nguồn Đã Đọc & Đối Chiếu Trực Tiếp

Toàn bộ các tài liệu sau đã được đọc trực tiếp từ hệ thống tệp và đối chiếu chéo kỹ lưỡng trước khi xây dựng và cập nhật kế hoạch:

### 1.1. Tài Liệu Quản Trị Dự Án & Quản Lý Nhóm (Workshop Mentor Lộc Đặng)
- `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Đọc toàn bộ 883 dòng HTML: 15 slide bài giảng từ S1 đến S15, các nguyên tắc Project Charter tuần 1, phân vai PO/Tech Lead/PM, SSOT 1 file duy nhất, phát hành liên tục V1→V2→V3, User Story, kỷ luật Sprint 1 tuần & 2 Checkpoint tuần 3/tuần 5, viết Spec trước khi code, Daily Standup & Technical Meeting, ma trận xử lý xung đột kỹ thuật vs cá nhân, retro Sad-Mad-Glad, tinh thần đa chức năng startup 6 tuần).
- `Workshop QTDA + Quản lý nhóm /Template Project Charter + Mẫu báo cáo.xlsx` (Đọc cấu trúc các sheet: 'Quy Định', 'Mẫu Quy Định Nội Bộ', 'Mẫu Báo Cáo Tuần', 'Mẫu Project Charter', 'Mẫu Daily Standup', 'Đề xuất Hỗ Trợ Teams').
- `Workshop QTDA + Quản lý nhóm /team_project_management_template.xlsx` (Đọc các sheet quản trị SSOT: 'Tổng hợp', 'Đường link quan trọng', 'Thành viên nhóm', 'Lộ trình', 'Backlog', 'Đặc tả tính năng', 'Theo dõi lỗi', 'Danh sách User Story').
- `Workshop QTDA + Quản lý nhóm /AI20K_Hướng dẫn đăng ký các gói tài khoản miễn phí - update 1-6.docx` (Khảo sát các gói tài nguyên hạ tầng đề xuất).

### 1.2. Ghi Chú Workshop 12/11/2026 & Đúc Kết Lý Thuyết Nền Tảng
- `notes.md` (Workshop ngày 12/11/2026: Setup CI/CD ngay từ đầu, dựng môi trường VPS production từ đầu, viết bộ unit test, bài test chạy trực tiếp trên production theo user story để phục vụ UAT, nghiên cứu sản phẩm quốc tế để biết độ sâu, làm chỉn chu UI/UX và slide, kiên quyết tránh AI slop, chuyển dịch từ RAG lỗi thời sang personal agent).
- `Tongketdahoc.md` (Đúc kết Day 1 → Day 5 AI20K: Double Diamond, PAIR framework, Rule → Workflow → Agent, ReAct loop, 5 stop rules, 3 tầng fallback, trust calibration, offline eval & online monitoring).
- `Cursor/00-TONG-HOP-KIEM-CHUNG.md` (Bản phán quyết tổng hợp ngày 12/11/2026 giữa Cursor CLI và Antigravity CLI: Khóa đề MFG-08, 5 ô Problem Statement, định nghĩa chính xác available inventory có QC hold khác với ATP, loại bỏ solver/tách lệnh/dashboard OTIF/WIP khỏi scope MVP).

### 1.3. Nghiên Cứu Nghiệp Vụ, Sản Phẩm Nước Ngoài & Đánh Giá Chất Lượng
- `Lab/Research/04-san-pham-nuoc-ngoai.md` *(Nguồn mới đọc theo CONTINUE.md)*: Khảo sát sản phẩm nước ngoài (SAP Digital Manufacturing, SAP Joule Production Planning and Operations Agent, Siemens Opcenter, Tulip, Plex, Katana MRP, Odoo Shop Floor, MRPeasy); nhận diện các pattern UI/UX mượn hỏi và định vị điểm khác biệt thực chất (cả 5 cổng trong 1 view + giải thích tiếng Việt cho điều độ viên + impact analysis khi máy DOWN).
- `Lab/Eval/06-user-story-uat.md` *(Nguồn mới đọc theo CONTINUE.md)*: Danh mục 10 User Stories (US-01 đến US-10) và ~40 Acceptance Criteria (Given/When/Then), hệ thống mã hóa EV-01..33 cho kiểm thử unit và UAT production an toàn.
- `Lab/Product/01-gate1-readiness.md` (Rà soát điều kiện tiên quyết Gate 1, tiêu chuẩn Definition of Done).
- `Lab/Product/02-mau-thuan-va-mvp-cat-gon.md` (Phân tích mâu thuẫn scope và quyết định cắt gọt các tính năng ngoài tầm).
- `Lab/Product/03-role-fit.md` (Rà soát năng lực từng thành viên theo CV và hồ sơ thực tế).
- `Lab/Eval/01-scorecard-va-scenario.md` (Khung kịch bản đánh giá và bộ tiêu chí kiểm thử chất lượng).
- `Lab/Eval/02-denylist-guardrail.md` (Cấu trúc denylist regex phòng chống prompt injection và unsafe release patterns).
- `Lab/Eval/03-baseline-decision-support-time.md` (Phương pháp đo lường Decision Support Time qua A/B testing).
- `Lab/Eval/04-stop-rule-fallback.md` (Các luật dừng ReAct: `needs_human`, `max_steps`, `no_progress`, `tool_error_limit` và mẫu câu phản hồi fallback).
- `Lab/Eval/05-latency-cost.md` (Định mức độ trễ p50 và tối ưu chi phí).
- `Lab/Eval/README.md` (Tổng quan chiến lược đánh giá an toàn).

### 1.4. Bộ Nghiên Cứu Chuyên Sâu Đề Tài MFG-08 SmartWO (`research/mfg-08/`)
- `research/mfg-08/01-tom-tat.md`
- `research/mfg-08/02-framework-5-buoc.md`
- `research/mfg-08/03-validation-ladder.md`
- `research/mfg-08/04-nghiep-vu-work-order.md` (Khảo sát nghiệp vụ lệnh sản xuất, chuẩn ISA-95 Level 3, mô hình Kanban 5 cột).
- `research/mfg-08/05-feasibility.md`
- `research/mfg-08/06-thiet-ke-he-thong.md` (Kiến trúc hệ thống, schema SQL, seed dữ liệu 12 lệnh WO mẫu, cơ chế 2 tool chính).
- `research/mfg-08/07-eval-scorecard.md`
- `research/mfg-08/08-gate-va-roadmap.md`
- `research/mfg-08/09-rui-ro-cau-hoi-nguon.md`
- `research/mfg-08/10-de-xuat-build-va-phan-role.md`
- `research/mfg-08/README.md`

---

## 2. Tình Trạng Tài Liệu & Ghi Nhận Thiếu / Đủ

- **Tình trạng:** **Đầy đủ 100% tài liệu đầu vào theo yêu cầu.** Tất cả các tệp đều tồn tại trên hệ thống tệp cục bộ và đã được truy cập thành công.
- **Không có tài liệu nào bị thiếu** trong danh mục bắt buộc.
- **Xử lý tên thư mục:** Thư mục `Workshop QTDA + Quản lý nhóm ` có dấu cách cuối tên, đã được mở và đọc trọn vẹn.

---

## 3. Xác Nhận Hoàn Tất Checklist Cập Nhật Theo `CONTINUE.md` (Mục A–H)

Kế hoạch trong `01-PLAN.md` và `02-ERD-spec.md` đã được cập nhật đồng bộ, thỏa mãn 100% các điểm chỉ đạo:

- [x] **Mục A (Kanban 5 cột):** Chuẩn hóa Kanban thành 5 cột nghiệp vụ (`Chưa phát`, `Đã phát`, `Đang chạy`, `Tắc`, `Xong`). Thẻ WO-09 nằm ở cột "Chưa phát" kèm Huy hiệu (Badge) `[Chờ duyệt]`, **không tách thành cột riêng**. Trạng thái cơ sở dữ liệu của lệnh vẫn là `created` (tuyệt đối không ghi `pending_confirm`). Khớp US-01 AC-02, EV-33.
- [x] **Mục B (Nhãn Cổng 5):** Cổng 5 (Công đoạn tiền nhiệm / Predecessor) được hiển thị trên giao diện nhưng gắn nhãn rõ ràng: **`[Đề xuất – nhóm chưa chốt]`** do schema `06` gốc chưa có bảng này. Cổng 1–4 là các cổng đã khóa cứng trong nghiên cứu.
- [x] **Mục C (Reserve-on-Approve):** Implement trong store: tăng `reserved` khi Duyệt thành công; không tăng lúc check/tạo phiếu; không tăng nếu duyệt fail do stale data. Trên giao diện và tài liệu gắn nhãn rõ ràng: **`[Quyết định nhóm đang chờ chốt]`**. Khớp US-05 AC-02 / EV-25.
- [x] **Mục D (Phân bổ Seed không xung đột máy):** Tách máy M1 và M4 để luật máy bị chiếm (`current_wo_id`) hoàn toàn nhất quán. Lệnh WO-11 đang chạy (`in_progress`) được gán sang máy M4, giải phóng máy M1 rảnh cho WO-01 ("đủ cả 5 cổng"). Khớp US-02 AC-05 / EV-29.
- [x] **Mục E (Nút Reset Demo):** Bố trí nút "Reset Demo" (tương đương `POST /demo/reset`) cố định trên thanh Header/Layout, mọi vai trò đều bấm được để khôi phục toàn bộ seed ban đầu, phục vụ chạy bài kiểm thử UAT lặp lại an toàn (US-01 AC-05).
- [x] **Mục F (Ánh xạ US-01..US-10 vào Packages):** Từng gói công việc (PKG-0, PKG-A, PKG-B, PKG-C, PKG-D, PKG-E, PKG-F) đều có danh sách Acceptance Criteria ánh xạ trực tiếp từ `Lab/Eval/06-user-story-uat.md` (US-01 đến US-10 kèm mã EV tương ứng), không bịa đặt tiêu chí ngoài luồng.
- [x] **Mục G (Kế thừa Pattern Quốc tế & Định vị trung thực):** Ghi rõ nguồn mượn pattern từ Katana (nhãn tồn kho Còn hàng / Dự kiến / QC Hold), Odoo Shop Floor (bộ lọc Sẵn sàng), MRPeasy (đèn giao thông readiness xanh/đỏ). Nêu thẳng điểm khác biệt (cả 5 cổng trong 1 view + giải thích tiếng Việt + impact analysis khi máy sự cố), không thổi phồng rằng "AI phát lệnh có người duyệt" là mới (đã có trên SAP Joule).
- [x] **Mục H (Kịch bản Demo & Seed Fail Predecessor):** Kịch bản demo stale-approve fail (EV-18) và nút Reset demo được giữ vững; lệnh seed WO-13 fail Cổng 5 (do lệnh tiền nhiệm WO-10 chưa hoàn thành) được duy trì với nhãn đề xuất.

---

## 4. Các Đầu Ra Đã Tạo Trong Thư Mục `Prototype/plan/`

Đúng 4 file tài liệu theo yêu cầu đã được khởi tạo và cập nhật hoàn chỉnh:
1. `00-workshop-cach-lam-viec.md`: Tóm tắt chi tiết và chính xác toàn bộ văn hóa, kỷ luật quản trị dự án, phương pháp luận phát hành phần mềm và bài học workshop 12/11/2026.
2. `01-PLAN.md`: Kế hoạch hành động chi tiết dựng prototype wireframe tương tác cao bằng Vite + React + TypeScript, 5 cột Kanban + badge chờ duyệt, phân chia 7 gói công việc độc lập với nguyên tắc File Ownership tuyệt đối, ánh xạ trực tiếp US-01..US-10, kịch bản demo 2 phút và quy chuẩn chống AI slop.
3. `02-ERD-spec.md`: Đặc tả chi tiết 9 bảng thực thể của MES mô phỏng (phân bổ máy M1-M4 tránh xung đột seed), biểu đồ Mermaid ERD hợp lệ, máy trạng thái Work Order phân biệt với phiếu HITL, đối chiếu CSDL PostgreSQL thật và Mock Store.
4. `MODEL-LOG.md`: Bản ghi chép minh bạch về mô hình sử dụng, mốc thời gian, nguồn tài liệu đã kiểm chứng và cam kết chất lượng.
