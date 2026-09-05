// src/pages/Settings/components/ConfirmModal.tsx
import Modal from './Modal';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  isProcessing: boolean;
  error: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  isProcessing,
  error,
  danger = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) => (
  <Modal title={title} onClose={onClose}>
    <p className="text-[15px] text-gray-700 leading-relaxed">{message}</p>
    {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={onClose}
        disabled={isProcessing}
        className="px-4 py-2 text-[14px] font-bold text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={isProcessing}
        className={`px-4 py-2 text-[14px] font-bold text-white rounded-full transition cursor-pointer disabled:opacity-50 ${
          danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#5c5cff] hover:bg-[#4a4ae6]'
        }`}
      >
        {isProcessing ? 'Processing...' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmModal;
