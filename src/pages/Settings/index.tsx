// src/pages/Settings/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from './hooks/useSettings';
import Sidebar from '../../components/Sidebar';
import RightSidebar from '../../components/RightSidebar';
import EditFieldModal from './components/EditFieldModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import ConfirmModal from './components/ConfirmModal';

type ActiveModal = 'username' | 'email' | 'password' | 'deactivate' | 'logout' | null;

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const ChevronRightIcon = ({ className = 'text-gray-400' }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Settings = () => {
  const navigate = useNavigate();
  const {
    user,
    saveField,
    isSavingField,
    fieldError,
    changePassword,
    isChangingPassword,
    passwordError,
    deleteAccount,
    isDeleting,
    deleteError,
    logout,
  } = useSettings();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleFieldSave = (value: string, field: 'username' | 'email') => {
    saveField(field === 'username' ? { username: value } : { email: value }, () => {
      setActiveModal(null);
      showToast('Profile updated');
    });
  };

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    changePassword(currentPassword, newPassword, () => {
      setActiveModal(null);
      showToast('Password changed successfully');
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex gap-6">
        <div className="flex-1 max-w-2xl mx-auto border-x border-gray-100 bg-white min-h-screen">
          {/* Sticky Header */}
          <div className="border-b border-gray-100 px-6 py-3 flex items-center gap-6 sticky top-14 bg-white/95 backdrop-blur-md z-50 md:top-0">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-900 hover:bg-gray-100 p-2 rounded-full transition cursor-pointer"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <h1 className="text-[20px] font-bold">Settings</h1>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* Account Information */}
            <section>
              <h2 className="text-[18px] font-bold text-gray-900 mb-4">Account Information</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveModal('username')}
                  className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group text-left"
                >
                  <span className="text-[15px] text-gray-900">Username</span>
                  <span className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 transition-colors">
                    <span className="text-[14px] font-medium">@{user?.username}</span>
                    <ChevronRightIcon />
                  </span>
                </button>
                <button
                  onClick={() => setActiveModal('email')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group text-left"
                >
                  <span className="text-[15px] text-gray-900">Email Address</span>
                  <span className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 transition-colors">
                    <span className="text-[14px] font-medium">{user?.email}</span>
                    <ChevronRightIcon />
                  </span>
                </button>
              </div>
            </section>

            {/* Password & Security */}
            <section>
              <h2 className="text-[18px] font-bold text-gray-900 mb-4">Password &amp; Security</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveModal('password')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group text-left"
                >
                  <div>
                    <span className="text-[15px] text-gray-900 block">Change Password</span>
                    <span className="text-[13px] text-gray-500 mt-1 block">
                      Update the password used to sign in
                    </span>
                  </div>
                  <ChevronRightIcon />
                </button>
              </div>
            </section>

            {/* Account Management */}
            <section>
              <h2 className="text-[18px] font-bold text-gray-900 mb-4">Account Management</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveModal('deactivate')}
                  className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-red-50/60 transition-colors cursor-pointer group text-left"
                >
                  <div>
                    <span className="text-[15px] text-red-500 block">Deactivate Account</span>
                    <span className="text-[13px] text-gray-500 mt-1 block">
                      Permanently delete your profile and content
                    </span>
                  </div>
                  <ChevronRightIcon className="text-red-400" />
                </button>
                <button
                  onClick={() => setActiveModal('logout')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group text-left"
                >
                  <div>
                    <span className="text-[15px] text-gray-900 block">Log Out</span>
                    <span className="text-[13px] text-gray-500 mt-1 block">
                      Sign out of your account on this device
                    </span>
                  </div>
                  <ChevronRightIcon />
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-8">
            <RightSidebar />
          </div>
        </aside>
      </div>

      {/* Modals */}
      {activeModal === 'username' && (
        <EditFieldModal
          title="Change Username"
          label="Username"
          value={user?.username || ''}
          prefix="@"
          placeholder="username"
          isSaving={isSavingField}
          error={fieldError}
          onSave={(value) => handleFieldSave(value, 'username')}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'email' && (
        <EditFieldModal
          title="Change Email"
          label="Email Address"
          value={user?.email || ''}
          placeholder="name@example.com"
          isSaving={isSavingField}
          error={fieldError}
          onSave={(value) => handleFieldSave(value, 'email')}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'password' && (
        <ChangePasswordModal
          isSaving={isChangingPassword}
          error={passwordError}
          onSave={handleChangePassword}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'deactivate' && (
        <ConfirmModal
          title="Deactivate Account"
          message="This will permanently delete your account, along with all of your posts, comments, likes, bookmarks and followers. This action cannot be undone."
          confirmLabel="Delete account"
          danger
          isProcessing={isDeleting}
          error={deleteError}
          onConfirm={deleteAccount}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'logout' && (
        <ConfirmModal
          title="Log Out"
          message="Are you sure you want to log out of Pulse?"
          confirmLabel="Log Out"
          isProcessing={false}
          error=""
          onConfirm={handleLogout}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-[15px] font-medium shadow-lg z-[60] text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Settings;
