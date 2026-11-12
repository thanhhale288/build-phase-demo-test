import type { SopDocument } from '../domain/types.ts'

export const MOCK_SOPS: SopDocument[] = [
  {
    sop_id: 'SOP-M01',
    title: 'Xuất kho đệm khi thiếu bu-lông (mô phỏng)',
    category: 'Vật tư',
    target_sku_or_process: 'BLT-1',
    effective_rev: 'B',
    excerpt:
      'Khi tồn khả dụng bu-lông (tồn trừ phần đã giữ chỗ) thấp hơn định mức lệnh, điều độ viên giữ lệnh, ghi phiếu đề xuất, và chỉ phát sau khi kho xác nhận đã đủ hoặc đã có phương án đệm được duyệt. Không tự phát lệnh khi cổng vật tư đỏ. Tài liệu mô phỏng.',
    last_updated: '2026-11-01T08:00:00+07:00',
  },
  {
    sop_id: 'SOP-Q03',
    title: 'Xử lý vật tư đang QC hold (mô phỏng)',
    category: 'Chất lượng',
    target_sku_or_process: 'QC-9',
    effective_rev: 'B',
    excerpt:
      'Lô đang QC hold không được tính vào tồn khả dụng. Không phát lệnh dùng lô đó cho đến khi chất lượng gỡ hold. Tài liệu mô phỏng.',
    last_updated: '2026-11-01T08:00:00+07:00',
  },
  {
    sop_id: 'SOP-E02',
    title: 'Máy dừng hoặc bảo trì — không đổi chuyền (mô phỏng)',
    category: 'Thiết bị',
    target_sku_or_process: 'Máy M2/M3',
    effective_rev: 'B',
    excerpt:
      'Khi máy gán DOWN hoặc MAINTENANCE, giữ lệnh và liệt kê các lệnh cùng máy. Không tự đề xuất chuyển sang máy khác. Tài liệu mô phỏng.',
    last_updated: '2026-11-01T08:00:00+07:00',
  },
  {
    sop_id: 'SOP-B04',
    title: 'Đối chiếu phiên bản bản vẽ BOM (mô phỏng)',
    category: 'Kỹ thuật',
    target_sku_or_process: 'P-100',
    effective_rev: 'B',
    excerpt:
      'Chỉ phát lệnh khi bom_rev của lệnh trùng bản hiện hành của mã hàng. Lệch bản vẽ không được giải thích thành thiếu vật tư. Tài liệu mô phỏng.',
    last_updated: '2026-11-01T08:00:00+07:00',
  },
  {
    sop_id: 'SOP-O05',
    title: 'Công đoạn trước chưa xong (mô phỏng)',
    category: 'Luồng công đoạn',
    target_sku_or_process: 'Lắp cụm cửa',
    effective_rev: 'B',
    excerpt:
      'Nếu lệnh có công đoạn tiền nhiệm, chỉ xét phát khi lệnh trước đã done. Quy tắc này đang ở trạng thái đề xuất, nhóm chưa chốt. Tài liệu mô phỏng.',
    last_updated: '2026-11-01T08:00:00+07:00',
  },
]
