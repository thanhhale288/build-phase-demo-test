import { useState } from 'react'
import { Alert, App, Button, Card, Form, Input, InputNumber, Modal, Progress, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { WorkOrder } from '../../domain/types.ts'
import { useResponsive } from '../../hooks/useResponsive.ts'
import { useAppStore } from '../../store/useAppStore.ts'

const VISIBLE = new Set(['released', 'in_progress', 'blocked'])

const STATE_COLOR: Record<string, string> = {
  released: 'blue',
  in_progress: 'processing',
  blocked: 'error',
}

export function LeadControlPanel() {
  const role = useAppStore((s) => s.role)
  const workOrders = useAppStore((s) => s.workOrders)
  const startOrder = useAppStore((s) => s.startOrder)
  const reportProgress = useAppStore((s) => s.reportProgress)
  const blockOrder = useAppStore((s) => s.blockOrder)
  const setRole = useAppStore((s) => s.setRole)
  const { message } = App.useApp()
  const { isMobile } = useResponsive()
  const [qtyModal, setQtyModal] = useState<WorkOrder | null>(null)
  const [blockModal, setBlockModal] = useState<WorkOrder | null>(null)
  const [qty, setQty] = useState<number>(0)
  const [reason, setReason] = useState('')

  if (role !== 'line_lead') {
    return (
      <Alert
        type="info"
        showIcon
        message="Đang ở vai Điều độ viên, nên các nút Start / sản lượng / Báo tắc bị ẩn."
        action={
          <Button type="primary" onClick={() => setRole('line_lead')}>
            Chuyển sang vai Tổ trưởng chuyền
          </Button>
        }
      />
    )
  }

  const orders = workOrders.filter((wo) => VISIBLE.has(wo.state))

  function handleStart(wo: WorkOrder) {
    const result = startOrder(wo.wo_id)
    if (result.ok) message.success(result.message)
    else message.error(result.message)
  }

  function submitQty() {
    if (!qtyModal) return
    const result = reportProgress(qtyModal.wo_id, qty)
    if (result.ok) message.success(result.message)
    else message.error(result.message)
    setQtyModal(null)
  }

  function submitBlock() {
    if (!blockModal) return
    const result = blockOrder(blockModal.wo_id, reason.trim() || 'Sự cố trên chuyền (mô phỏng)')
    if (result.ok) message.success(result.message)
    else message.error(result.message)
    setBlockModal(null)
    setReason('')
  }

  function actionsFor(wo: WorkOrder) {
    return (
      <Space wrap>
        {wo.state === 'released' ? (
          <Button type="primary" size="small" onClick={() => handleStart(wo)}>
            Bắt đầu
          </Button>
        ) : null}
        {wo.state === 'in_progress' ? (
          <Button
            size="small"
            onClick={() => {
              setQty(wo.qty_target)
              setQtyModal(wo)
            }}
          >
            Ghi sản lượng
          </Button>
        ) : null}
        {wo.state === 'released' || wo.state === 'in_progress' ? (
          <Button
            danger
            size="small"
            onClick={() => {
              setReason('')
              setBlockModal(wo)
            }}
          >
            Báo tắc
          </Button>
        ) : null}
      </Space>
    )
  }

  const columns: ColumnsType<WorkOrder> = [
    { title: 'Lệnh', dataIndex: 'wo_id', width: 100 },
    { title: 'SKU', dataIndex: 'sku', width: 90 },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      width: 120,
      render: (state: string) => <Tag color={STATE_COLOR[state]}>{state}</Tag>,
    },
    { title: 'Máy', dataIndex: 'machine_id', width: 80 },
    {
      title: 'Sản lượng',
      key: 'qty',
      width: 180,
      render: (_, wo) => (
        <Progress
          percent={wo.qty_target > 0 ? Math.round((wo.qty_good / wo.qty_target) * 100) : 0}
          size="small"
          format={() => `${wo.qty_good}/${wo.qty_target}`}
        />
      ),
    },
    { title: 'Thao tác', key: 'actions', render: (_, wo) => actionsFor(wo) },
  ]

  const modals = (
    <>
      <Modal
        title={qtyModal ? `Ghi sản lượng ${qtyModal.wo_id}` : 'Ghi sản lượng'}
        open={!!qtyModal}
        onOk={submitQty}
        onCancel={() => setQtyModal(null)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form layout="vertical">
          <Form.Item label="Sản lượng tốt">
            <InputNumber
              min={qtyModal?.qty_good ?? 0}
              value={qty}
              onChange={(value) => setQty(value ?? 0)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={blockModal ? `Báo tắc ${blockModal.wo_id}` : 'Báo tắc'}
        open={!!blockModal}
        onOk={submitBlock}
        onCancel={() => setBlockModal(null)}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        destroyOnHidden
      >
        <Form layout="vertical">
          <Form.Item label="Lý do tắc">
            <Input.TextArea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Sự cố trên chuyền (mô phỏng)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )

  if (orders.length === 0) {
    return (
      <>
        <Typography.Text type="secondary">Không có lệnh đã phát / đang chạy / tắc.</Typography.Text>
        {modals}
      </>
    )
  }

  if (isMobile) {
    return (
      <>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {orders.map((wo) => (
            <Card key={wo.wo_id} size="small" title={`${wo.wo_id} · ${wo.sku}`}>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space>
                  <Tag color={STATE_COLOR[wo.state]}>{wo.state}</Tag>
                  <Typography.Text>Máy {wo.machine_id}</Typography.Text>
                </Space>
                <Progress
                  percent={wo.qty_target > 0 ? Math.round((wo.qty_good / wo.qty_target) * 100) : 0}
                  format={() => `${wo.qty_good}/${wo.qty_target}`}
                />
                {actionsFor(wo)}
              </Space>
            </Card>
          ))}
        </Space>
        {modals}
      </>
    )
  }

  return (
    <>
      <Table<WorkOrder>
        size="small"
        rowKey="wo_id"
        columns={columns}
        dataSource={orders}
        pagination={false}
        scroll={{ x: 720 }}
      />
      {modals}
    </>
  )
}
