// src/pages/Profile/components/UserAvatar.tsx
interface UserAvatarProps {
  name?: string | null;
  username: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-28 h-28 text-3xl border-4 border-black',
};

const UserAvatar = ({ name, username, avatar, size = 'md', className = '' }: UserAvatarProps) => {
  const label = (name || username).charAt(0).toUpperCase();

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || username}
        className={`rounded-full object-cover shrink-0 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {label}
    </div>
  );
};

export default UserAvatar;
