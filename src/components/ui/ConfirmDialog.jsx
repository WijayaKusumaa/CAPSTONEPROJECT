import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Hapus', onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} description={description}>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
