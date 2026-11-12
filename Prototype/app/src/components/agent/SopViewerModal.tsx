import { Modal, Typography } from 'antd'
import type { SopDocument } from '../../domain/types.ts'

export function SopViewerModal({ sop, onClose }: { sop: SopDocument; onClose: () => void }) {
  return (
    <Modal
      open
      title={`${sop.sop_id} — ${sop.title}`}
      onCancel={onClose}
      onOk={onClose}
      okText="Đóng"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Typography.Paragraph type="secondary">
        Nhóm: {sop.category} · Áp dụng: {sop.target_sku_or_process} · Bản {sop.effective_rev}
      </Typography.Paragraph>
      <Typography.Paragraph>{sop.excerpt}</Typography.Paragraph>
    </Modal>
  )
}
