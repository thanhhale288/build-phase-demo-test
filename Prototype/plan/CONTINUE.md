Bổ sung plan (KHÔNG viết lại từ đầu). Cập nhật các file đã tạo trong Prototype/plan/ (đặc biệt 01-PLAN.md và 02-ERD-spec.md; ghi thêm dòng vào MODEL-LOG.md). Không sửa file ngoài Prototype/.

Đọc thêm hai nguồn mới rồi chỉnh plan cho khớp:

1) `/Users/hale/Code/AI in action/Lab/Research/04-san-pham-nuoc-ngoai.md`
2) `/Users/hale/Code/AI in action/Lab/Eval/06-user-story-uat.md`  (US-01..US-10, ~40 AC Given/When/Then — đây là acceptance criteria chính thức cho code và kiểm chứng)

# Chỉnh plan (bắt buộc)

A. Kanban: theo research 04/06 — **5 cột** (Chưa phát / Đã phát / Đang chạy / Tắc / Xong, hoặc Planned / Released / In progress / Blocked / Done). Badge **"chờ duyệt"** nằm trên thẻ, **không** tách cột "Pending approval". State lệnh không được ghi `pending_confirm`. WO-09: state `created` + badge chờ duyệt. (US-01 AC-02; EV-33. Bảy cột chỉ là ý cũ trong PROMPT — bỏ.)

B. Vẫn hiện **5 cổng** trên UI, nhưng cổng "công đoạn trước / predecessor" gắn nhãn **"đề xuất – nhóm chưa chốt"** (schema 06 chưa có predecessor). Các cổng 1–4 là đã khóa trong research.

C. Reserve-on-approve: **implement** trong store (trừ/tăng reserved lúc Duyệt thành công, không trừ lúc check/tạo phiếu; không trừ nếu duyệt fail). Trên UI và ghi chú plan/README: đây là **quyết định nhóm đang chờ chốt** (research 01 liệt kê "không làm giữ chỗ kho"). US-05 AC-02 / EV-25.

D. Seed: **không** để hai lệnh cùng chạy/chiếm một máy cùng lúc. Seed 06 hiện WO-01 "đủ cổng" trong khi WO-11 `in_progress` trên M1 — phải tách máy (ví dụ chuyển WO-11 sang máy khác rảnh, hoặc WO-01 sang máy khác) để luật "máy bị chiếm" nhất quán. US-02 AC-05 / EV-29.

E. Có **nút Reset demo** (tương đương `POST /demo/reset` trong research 06): trả toàn bộ seed về trạng thái ban đầu, lặp lại UAT được. US-01 AC-05. Đặt ở layout, mọi vai đều bấm được.

F. Acceptance criteria của từng package trong 01-PLAN.md phải **ánh xạ US-01..US-10 / AC** trong `Lab/Eval/06-user-story-uat.md`, không bịa AC khác. Liệt kê US/AC nào thuộc package nào.

G. UI mượn pattern (ghi rõ nguồn, không copy thương hiệu):
- Katana-style: nhãn trạng thái vật tư (Còn hàng / Dự kiến / Không có) trên dòng material.
- Odoo Shop Floor: bộ lọc "Sẵn sàng" (WO ready khi components + bước trước xong — bước trước = cổng 5, đang đề xuất).
- MRPeasy: đèn xanh/đỏ readiness từng cổng + bước duyệt tường minh.
- Điểm khác biệt cần hiện trên UI (nói thẳng, không phóng đại): **cả 5 cổng một view + lời giải thích tiếng Việt cho điều độ viên + danh sách lệnh bị ảnh hưởng** (ví dụ khi máy DOWN). **Không** tuyên bố "AI hỗ trợ phát lệnh có người duyệt" là mới — SAP Joule Production Planning and Operations Agent đã làm việc đó.

H. Kịch bản demo stale-approve + reset phải còn. Cổng 5 vẫn có ít nhất 1 WO seed fail predecessor (đánh dấu đề xuất).

Cập nhật xong thì xác nhận checklist các mục A–H đã sửa trong 01-PLAN.md.
