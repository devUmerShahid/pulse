// src/pages/Settings/components/ChangePasswordModal.tsx
import { useState } from 'react';
import Modal from './Modal';
import PasswordInput from '../../auth/components/PasswordInput';

interface ChangePasswordModalProps {
  isSaving: boolean;
  error: string;
  onSave: (currentPassword: string, newPassword: string) => void;
  onClose: () => void;
}

const ChangePasswordModal = ({
  isSaving,
  error,
  onSave,
  onClose,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    onSave(currentPassword, newPassword);
  };

  return (
    <Modal title="Change Password" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          id="current-password"
          name="currentPassword"
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <PasswordInput
          id="new-password"
          name="newPassword"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordInput
          id="confirm-password"
          name="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {(error || validationError) && (
          <p className="text-sm text-red-600">{error || validationError}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-bold text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-[14px] font-bold text-white bg-[#5c5cff] hover:bg-[#4a4ae6] rounded-full transition disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
