// src/pages/Profile/components/UserListModal.tsx
import { useNavigate } from 'react-router-dom';
import type { ProfileListUser } from '../../../api/user.api';
import PulseLoader from '../../../components/PulseLoader';
import UserAvatar from './UserAvatar';

interface UserListModalProps {
  title: string;
  users: ProfileListUser[];
  isLoading: boolean;
  onClose: () => void;
}

const UserListModal = ({ title, users, isLoading, onClose }: UserListModalProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <PulseLoader size="md" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center py-12 text-zinc-500">No users yet</p>
          ) : (
            users.map((listUser) => (
              <button
                key={listUser.id}
                onClick={() => {
                  onClose();
                  navigate(`/profile/${listUser.username}`);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-zinc-900/50 transition text-left cursor-pointer"
              >
                <UserAvatar
                  name={listUser.name}
                  username={listUser.username}
                  avatar={listUser.avatar}
                  size="md"
                />
                <div>
                  <div className="font-semibold text-white">
                    {listUser.name || listUser.username}
                  </div>
                  <div className="text-zinc-500 text-sm">@{listUser.username}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
