// src/pages/Settings/components/Modal.tsx
import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;
