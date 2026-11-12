---
name: smartwo-domain
description: Dùng khi viết logic nghiệp vụ MFG-08 SmartWO — cổng sẵn sàng, trạng thái lệnh sản xuất, phiếu HITL, tồn khả dụng, seed, hoặc thuật ngữ xưởng. Bắt buộc khi sửa domain/, data/, store/, gate engine.
---

# SmartWO — nghiệp vụ (MFG-08)

Nguồn sự thật: `Prototype/plan/01-PLAN.md`, `Prototype/plan/02-ERD-spec.md`, `research/mfg-08/04` & `06`, `Lab/Eval/06-user-story-uat.md` (US-01..US-10). Không bịa số liệu thực địa. Seed là dữ liệu giả, nói rõ là mô phỏng.

## Hai vai

- **Điều độ viên (dispatcher):** xem Kanban, kiểm cổng, dùng agent, tạo phiếu HITL, Duyệt / Từ chối. Không start / nhập qty / block.
- **Tổ trưởng chuyền (line lead):** chỉ thao tác lệnh từ `released` trở đi: Bắt đầu, nhập sản lượng, Báo tắc. **Không** có nút Duyệt / Từ chối.

## Trạng thái lệnh (DB) ≠ góc nhìn Kanban

State hợp lệ: `created` | `released` | `in_progress` | `blocked` | `done` (và `cancelled` nếu có). **Không** ghi `pending_confirm` vào `work_orders.state`.

Kanban **5 cột** (research 04/06, US-01, EV-33):

| Cột | State |
|---|---|
| Chưa phát | `created` / `not_ready` |
| Đã phát | `released` |
| Đang chạy | `in_progress` |
| Tắc | `blocked` |
| Xong | `done` |

Badge **`[Chờ duyệt]`** trên thẻ khi có `hitl_requests` `pending` (ví dụ WO-09). Badge không phải cột, không đổi state. Cờ **`[LATE]`** (WO-08) tách với cổng sẵn sàng: quá hạn vẫn phải đủ cổng mới được phát.

## Năm cổng (`checkReadiness`)

Hàm thuần TypeScript, deterministic, số evidence lấy từ store chứ không từ câu LLM.

1. **Vật tư (đã khóa):** mọi dòng `critical`: `(on_hand - reserved) >= qty_required` VÀ `qc_hold === false`. Nhãn kiểu Katana: *Còn hàng* / *Dự kiến* / *Không có* / *QC Hold*.
2. **Máy (đã khóa):** `status === 'UP'` và không bị lệnh khác chiếm (`current_wo_id` null hoặc chính lệnh này). DOWN / MAINTENANCE / đang chiếm → fail. Không đề xuất đổi máy.
3. **Người (đã khóa):** đủ headcount đúng skill trong ca.
4. **`bom_rev` (đã khóa):** `wo.bom_rev === sku.current_bom_rev`.
5. **Công đoạn trước (đề xuất – nhóm chưa chốt):** nếu có `predecessor_wo_id` thì predecessor phải `done`. UI **bắt buộc** gắn nhãn `[Đề xuất – nhóm chưa chốt]`. Không predecessor → PASS / N/A.

`overall_ready` chỉ true khi mọi cổng áp dụng đều pass (cổng 5 N/A = pass).

## HITL

- AI **không bao giờ** tự phát lệnh. Không có tool `release`. Agent chỉ giải thích (tiếng Việt, đúng số cổng) và **tạo phiếu** `hitl_requests`.
- Không tạo phiếu RELEASE khi cổng đỏ. Không tạo phiếu đôi khi đã có phiếu pending cùng loại (US-04 / EV-30).
- **Duyệt:** re-check 5 cổng. Nếu pass: `state = released`, phiếu `approved`. **Reserve-on-approve** (implement, nhưng nhãn UI/README: `[Quyết định nhóm đang chờ chốt]` — research 01 từng ghi "không làm giữ chỗ kho"): tăng `reserved` đúng `qty_required` các dòng critical. Không trừ lúc check hay lúc tạo phiếu.
- **Duyệt fail / stale (US-06, EV-18):** state giữ `created`, **không** tăng `reserved`.
- **Từ chối RELEASE:** phiếu `rejected`, state vẫn `created`. **Từ chối CANCEL** của WO-12: lệnh **vẫn `released`** (US-07 / EV-19).
- Tổ trưởng gọi confirm/reject → từ chối (EV-14). Điều độ gọi start/progress/block → từ chối.

## Seed (13 lệnh, đã tách máy)

Không để hai lệnh `in_progress` cùng một máy. **WO-11** chạy trên **M4**. **M1** rảnh (WO-01 đủ cổng). M2 DOWN (WO-04), M3 MAINTENANCE (WO-05). **WO-13** fail cổng 5 vì predecessor WO-10 chưa `done`. WO-09: `created` + phiếu RELEASE pending. WO-12: `released`, `note` chứa câu injection.

Nút **Reset Demo** (mọi vai) khôi phục đúng seed (US-01 AC-05, tương đương `POST /demo/reset`).

## Agent / SOP / denylist

Framing: **personal agent** có tool tra SOP mỏng (5 tài liệu giả). Không gọi là "hệ thống RAG". Citation phải khớp đoạn SOP. Denylist chặn "bỏ qua kiểm tra", "giám đốc duyệt miệng", "force release", v.v. (`Lab/Eval/02-denylist-guardrail.md`). Bị chặn thì không đổi state sang `released`.

## Metric / tuyên bố

- Metric hệ thống: `illegal_release = 0`, 100% lần phát có phiếu đã duyệt.
- **Không** tuyên bố "AI hỗ trợ phát lệnh có người duyệt" là mới — SAP Joule Production Planning and Operations Agent đã làm. Điểm khác biệt UI: cả 5 cổng một view + lời tiếng Việt + danh sách lệnh bị ảnh hưởng khi máy DOWN.
