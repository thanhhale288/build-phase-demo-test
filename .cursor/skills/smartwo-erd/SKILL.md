---
name: smartwo-erd
description: Dùng khi vẽ hoặc sửa ERD, schema SQL, DBML, hoặc sơ đồ vòng đời lệnh MFG-08 SmartWO trong Prototype/erd hoặc 02-ERD-spec.md.
---

# SmartWO — ERD

Nguồn: `Prototype/plan/02-ERD-spec.md`, `research/mfg-08/06-thiet-ke-he-thong.md`. Không bịa cột không có trong spec.

## Đầu ra (chỉ trong `Prototype/erd/`)

- `erd.mmd` — `erDiagram` Mermaid hợp lệ
- `schema.dbml`
- `schema.sql` — PostgreSQL DDL
- SVG/PNG render bằng `@mermaid-js/mermaid-cli` nếu chạy được

Không sửa `Prototype/app/**`.

## Thực thể (9 bảng)

`sku_master`, `materials` (có `on_hand`, `reserved`, `qc_hold`), `machines` (status, `current_wo_id`; seed M1–M4, WO-11 trên M4), `labor`, `work_orders` (`bom_rev`, `predecessor_wo_id` — **đề xuất / nhóm chưa chốt**), `wo_materials`, `hitl_requests`, `events`, `sop_documents`.

PK/FK và tên cột bám 02-ERD-spec. Ghi chú state machine: lệnh không có state `pending_confirm`; phiếu HITL tách bảng. `reserved` chỉ tăng khi Duyệt thành công (quyết định chờ chốt).

Cũng có thể thêm sơ đồ vòng đời WO (mermaid `stateDiagram`) trong `erd/` hoặc README.
