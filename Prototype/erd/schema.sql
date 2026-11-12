-- MFG-08 SmartWO — PostgreSQL DDL mô phỏng
-- Nguồn: Prototype/plan/02-ERD-spec.md (mở rộng research/mfg-08/06).
-- 9 bảng. Dữ liệu seed là mô phỏng, không phải số liệu thực địa.
--
-- work_orders.state KHÔNG có giá trị pending_confirm.
-- Phiếu chờ duyệt là hitl_requests.status = 'pending' (US-01 / EV-33).
--
-- predecessor_wo_id: [Đề xuất – nhóm chưa chốt].
-- Schema research 06 chưa có cột này. Cổng 5 dùng cột này: nếu khác NULL
-- thì lệnh tiền nhiệm phải có state = 'done'.
--
-- materials.reserved tăng khi Duyệt thành công: [Quyết định nhóm đang chờ chốt].
-- Không tăng lúc check cổng, lúc tạo phiếu, hay khi duyệt fail/stale (US-05, US-06).
-- Research 01 từng ghi "không giữ chỗ kho".
--
-- Seed máy mô phỏng (không INSERT trong file này):
--   M1 Bàn gá chính C1     UP           current_wo_id NULL  (WO-01 đủ cổng)
--   M2 Máy hàn bấm viền    DOWN         (WO-04 fail Cổng 2)
--   M3 Máy siết bu-lông    MAINTENANCE  (WO-05 fail Cổng 2)
--   M4 Bàn gá phụ C2       UP           current_wo_id WO-11 (in_progress)
-- Không có hai lệnh in_progress trên cùng một máy.
--
-- Quan hệ SOP ↔ SKU trên sơ đồ ERD là logic qua target_sku_or_process.
-- Spec không khai báo cột FK, nên DDL không thêm cột.
-- machines.current_wo_id trỏ logic tới work_orders.wo_id nhưng spec mục 2.3
-- không đánh dấu FK (tránh vòng machines ↔ work_orders).

CREATE TABLE sku_master (
  sku VARCHAR(32) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  current_bom_rev VARCHAR(8) NOT NULL
);

CREATE TABLE materials (
  material_code VARCHAR(32) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  on_hand INT NOT NULL CHECK (on_hand >= 0),
  reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  qc_hold BOOLEAN NOT NULL DEFAULT FALSE,
  unit VARCHAR(16) NOT NULL
);

CREATE TABLE machines (
  machine_id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('UP', 'DOWN', 'MAINTENANCE')),
  current_wo_id VARCHAR(32)
);

CREATE TABLE labor (
  shift_id VARCHAR(32) NOT NULL,
  machine_id VARCHAR(32) NOT NULL REFERENCES machines (machine_id),
  skill VARCHAR(32) NOT NULL,
  required_headcount INT NOT NULL CHECK (required_headcount > 0),
  assigned_headcount INT NOT NULL DEFAULT 0 CHECK (assigned_headcount >= 0),
  PRIMARY KEY (shift_id, machine_id, skill)
);

CREATE TABLE work_orders (
  wo_id VARCHAR(32) PRIMARY KEY,
  sku VARCHAR(32) NOT NULL REFERENCES sku_master (sku),
  qty_target INT NOT NULL CHECK (qty_target > 0),
  qty_good INT NOT NULL DEFAULT 0 CHECK (qty_good >= 0),
  bom_rev VARCHAR(8) NOT NULL,
  machine_id VARCHAR(32) NOT NULL REFERENCES machines (machine_id),
  shift_id VARCHAR(32) NOT NULL,
  priority VARCHAR(16) NOT NULL CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  -- Không gồm pending_confirm. Phiếu chờ là hitl_requests.status.
  state VARCHAR(24) NOT NULL CHECK (state IN (
    'created', 'not_ready', 'released', 'in_progress', 'blocked', 'done', 'cancelled'
  )),
  due_time TIMESTAMP NOT NULL,
  note TEXT,
  -- [Đề xuất – nhóm chưa chốt]. Nullable. Self-FK.
  predecessor_wo_id VARCHAR(32) REFERENCES work_orders (wo_id)
);

CREATE TABLE wo_materials (
  wo_id VARCHAR(32) NOT NULL REFERENCES work_orders (wo_id),
  material_code VARCHAR(32) NOT NULL REFERENCES materials (material_code),
  qty_required INT NOT NULL CHECK (qty_required > 0),
  critical BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (wo_id, material_code)
);

CREATE TABLE hitl_requests (
  id SERIAL PRIMARY KEY,
  wo_id VARCHAR(32) NOT NULL REFERENCES work_orders (wo_id),
  action VARCHAR(24) NOT NULL CHECK (action IN ('RELEASE', 'CANCEL', 'CHANGE_PRIORITY')),
  from_state VARCHAR(24) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(16) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  evidence_json JSONB,
  reason TEXT,
  proposed_by VARCHAR(64) NOT NULL DEFAULT 'ai_agent',
  decided_by VARCHAR(64),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_at TIMESTAMP
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  wo_id VARCHAR(32) NOT NULL REFERENCES work_orders (wo_id),
  actor VARCHAR(64) NOT NULL,
  role VARCHAR(24) NOT NULL CHECK (role IN ('dispatcher', 'line_lead', 'system', 'ai_agent')),
  type VARCHAR(32) NOT NULL,
  from_state VARCHAR(24),
  to_state VARCHAR(24),
  payload JSONB,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sop_documents (
  sop_id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  category VARCHAR(32) NOT NULL,
  target_sku_or_process VARCHAR(64) NOT NULL,
  effective_rev VARCHAR(8) NOT NULL,
  excerpt TEXT NOT NULL,
  last_updated TIMESTAMP NOT NULL
);

COMMENT ON TABLE sku_master IS
  'Danh mục thành phẩm mô phỏng. current_bom_rev đối chiếu Cổng 4.';
COMMENT ON COLUMN sku_master.current_bom_rev IS
  'Phiên bản BOM hiện hành. Cổng 4 đạt khi work_orders.bom_rev trùng cột này.';

COMMENT ON TABLE materials IS
  'Tồn kho mô phỏng. Tồn khả dụng Cổng 1 = on_hand - reserved, và qc_hold phải FALSE.';
COMMENT ON COLUMN materials.reserved IS
  '[Quyết định nhóm đang chờ chốt] Tăng đúng qty_required các dòng critical khi Duyệt thành công. Không tăng lúc check, lúc tạo phiếu, hay khi duyệt fail/stale. Research 01 từng ghi không giữ chỗ kho.';
COMMENT ON COLUMN materials.qc_hold IS
  'TRUE thì không tính vào tồn khả dụng, dù on_hand đủ (Cổng 1).';

COMMENT ON TABLE machines IS
  'Bốn máy seed mô phỏng: M1 Bàn gá chính C1 UP rảnh; M2 Máy hàn bấm viền DOWN (WO-04); M3 Máy siết bu-lông tự động MAINTENANCE (WO-05); M4 Bàn gá phụ C2 UP, current_wo_id = WO-11.';
COMMENT ON COLUMN machines.status IS
  'UP, DOWN hoặc MAINTENANCE. Cổng 2 cần status = UP.';
COMMENT ON COLUMN machines.current_wo_id IS
  'Lệnh đang chiếm máy. Seed: M4 = WO-11 (in_progress); M1 rảnh (NULL) để WO-01 qua Cổng 2. Spec không khai báo FK.';

COMMENT ON TABLE labor IS
  'Định biên theo ca, máy và kỹ năng. Cổng 3: assigned_headcount >= required_headcount.';
COMMENT ON COLUMN labor.skill IS
  'Ví dụ mô phỏng: asm (lắp ráp), weld (hàn).';

COMMENT ON TABLE work_orders IS
  'Vòng đời lệnh. State: created, not_ready, released, in_progress, blocked, done, cancelled. Không có pending_confirm.';
COMMENT ON COLUMN work_orders.state IS
  'Không gồm pending_confirm. Lệnh created có phiếu pending vẫn ở created; Kanban gắn badge Chờ duyệt.';
COMMENT ON COLUMN work_orders.bom_rev IS
  'Phiên bản BOM gán lúc tạo lệnh. Cổng 4 so với sku_master.current_bom_rev.';
COMMENT ON COLUMN work_orders.predecessor_wo_id IS
  '[Đề xuất – nhóm chưa chốt] Self-FK. Schema research 06 chưa có. NULL thì Cổng 5 = N/A (coi như pass). Có giá trị thì lệnh tiền nhiệm phải state = done. Seed mô phỏng: WO-13 trỏ WO-10 (released, chưa done) nên fail Cổng 5.';
COMMENT ON COLUMN work_orders.shift_id IS
  'Ca dự kiến. Không phải FK: khóa labor là (shift_id, machine_id, skill).';

COMMENT ON TABLE wo_materials IS
  'Định mức tiêu hao. Cổng 1 chỉ xét dòng critical = TRUE.';
COMMENT ON COLUMN wo_materials.critical IS
  'TRUE: (on_hand - reserved) >= qty_required và qc_hold = FALSE mới qua Cổng 1.';

COMMENT ON TABLE hitl_requests IS
  'Phiếu phê duyệt tách khỏi work_orders.state. AI không tự phát lệnh. Không có tool release.';
COMMENT ON COLUMN hitl_requests.status IS
  'pending, approved hoặc rejected. pending không đổi work_orders.state thành pending_confirm.';
COMMENT ON COLUMN hitl_requests.action IS
  'RELEASE, CANCEL hoặc CHANGE_PRIORITY. Từ chối CANCEL của lệnh đã released giữ nguyên state.';

COMMENT ON TABLE events IS
  'Nhật ký kiểm toán (US-09). role gồm dispatcher, line_lead, system, ai_agent.';

COMMENT ON TABLE sop_documents IS
  'Năm tài liệu SOP giả cho tra cứu mỏng. Không phải hệ thống RAG. Không có FK tới sku_master.';
COMMENT ON COLUMN sop_documents.target_sku_or_process IS
  'Phạm vi áp dụng dạng chữ. Quan hệ với SKU trên ERD là logic, không có cột khóa ngoại.';
