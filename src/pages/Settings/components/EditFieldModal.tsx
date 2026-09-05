// src/pages/Settings/components/EditFieldModal.tsx
import { useState } from 'react';
import Modal from './Modal';

interface EditFieldModalProps {
  title: string;
  label: string;
  value: string;
  prefix?: string;
  placeholder?: string;
  isSaving: boolean;
  error: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

const EditFieldModal = ({
  title,
  label,
  value,
  prefix,
  placeholder,
  isSaving,
  error,
  onSave,
  onClose,
}: EditFieldModalProps) => {
  const [field, setField] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = field.trim();
    if (!trimmed || isSaving) return;
    onSave(trimmed);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor={`edit-${label}`}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
        <div className="flex items-center rounded-xl border border-gray-300 focus-within:border-[#5c5cff] focus-within:ring-1 focus-within:ring-[#5c5cff] transition overflow-hidden">
          {prefix && <span className="pl-4 text-gray-500 font-medium">{prefix}</span>}
          <input
            id={`edit-${label}`}
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 text-[15px] text-gray-900 outline-none"
            autoFocus
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-bold text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !field.trim()}
            className="px-4 py-2 text-[14px] font-bold text-white bg-[#5c5cff] hover:bg-[#4a4ae6] rounded-full transition disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditFieldModal;
