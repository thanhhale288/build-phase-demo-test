# 03-REVIEW — đối chiếu prototype với 01-PLAN và US-01..10

Thời điểm: 2026-11-12 ~23:50 Asia/Saigon.
Cách làm: `npm run build` pass; `vite preview` + ảnh headless Chrome các route chính. Không chạy lại agy review vì phiên planning đã xong và các lần CLI song song bị treo kết nối; người điều phối tự đối chiếu.

## Đạt

- Kanban 5 cột, badge `[Chờ duyệt]` trên thẻ (WO-09 ở Chưa phát, state `created`; WO-12 ở Đã phát vì phiếu CANCEL), không cột Pending riêng. US-01.
- 5 cổng một view, số khớp seed (WO-02 BLT-1 10/40; WO-01 đủ cổng; cổng 5 có nhãn đề xuất). US-02.
- Cảnh báo M2/M3 + lệnh bị ảnh hưởng (WO-04, WO-05). US-10.
- Reset Demo trên header, mọi vai. Role switcher.
- HITL duyệt/từ chối, trang stale-approve, nhãn reserve chờ chốt. US-05/06/07 (cần bấm tay để xác nhận nhánh fail).
- Seed tách máy: WO-11 trên M4, WO-01 đủ cổng trên M1.
- ERD đủ 9 bảng, svg/png, predecessor và reserved được chú thích.
- Trợ lý framing personal agent, denylist, không nút tự phát.

## Còn hạn chế

- Trang Tổ trưởng khi còn vai điều độ viên để trống (đã thêm nút chuyển vai sau vòng chụp ảnh đầu). Muốn thao tác Start phải bấm chuyển vai — đúng quyền, nhưng lần chụp `05-lead.png` chưa có panel lệnh.
- WO-09 nằm dưới fold cột Chưa phát (10 thẻ); dùng bộ lọc “Chờ duyệt” cho dễ demo.
- Giải thích trợ lý là template từ evidence, chưa gọi LLM thật (đúng phạm vi mock).
- Chưa có bài unit test tự chạy trong CI; chỉ build TypeScript.
- `predecessor_wo_id` và reserve-on-approve vẫn là quyết định nhóm chưa chốt, đã gắn nhãn.
