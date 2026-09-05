import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import { NavIcon } from './icons';
import type { NavIconName } from './icons';

type NavItem = { key: string; label: string; to: string; icon: NavIconName };

const items: NavItem[] = [
  { key: 'home', label: 'Home', to: '/', icon: 'home' },
  { key: 'trends', label: 'Trends', to: '/trends', icon: 'trends' },
  { key: 'notifications', label: 'Notifications', to: '/notifications', icon: 'notifications' },
  { key: 'bookmarks', label: 'Bookmarks', to: '/bookmarks', icon: 'bookmarks' },
  { key: 'settings', label: 'Settings', to: '/settings', icon: 'settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { canInstall, install } = usePWAInstall();
  const { count: unreadCount } = useUnreadNotifications();

  const profilePath = `/profile/${user?.username}`;

  const isActive = (to?: string) => {
    if (!to) return false;
    // "Home" labels "/" but the feed lives at "/feed" — both should highlight it.
    if (to === '/') return location.pathname === '/' || location.pathname === '/feed';
    return location.pathname === to || location.pathname.startsWith(to);
  };

  const renderNavButton = (it: NavItem, onNavigate?: () => void) => (
    <button
      onClick={() => {
        navigate(it.to);
        onNavigate?.();
      }}
      className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg flex items-center gap-3 ${isActive(it.to) ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
    >
      <NavIcon name={it.icon} />
      <span className="flex-1 truncate">{it.label}</span>
      {it.key === 'notifications' && unreadCount > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#5c5cff] text-white text-xs font-semibold flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white border-b">
        <div className="flex items-center gap-2">
          <img src="/pulse_logo.png" alt="Pulse" className="w-8 h-8" />
          <span className="font-bold text-indigo-600">Pulse</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="px-3 py-2 rounded-lg bg-gray-100">☰</button>
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-gray-200 bg-white px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <img src="/pulse_logo.png" alt="Pulse" className="w-10 h-10" />
          <span className="text-2xl font-bold text-indigo-600">Pulse</span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.key}>{renderNavButton(it)}</li>
            ))}

            <li>
              <button
                onClick={() => navigate(profilePath)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${isActive(profilePath) ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
              >
                <NavIcon name="profile" />
                <span className="flex-1 truncate">Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto">
          {canInstall && (
            <button
              onClick={install}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#5c5cff] border border-[#5c5cff]/30 bg-[#5c5cff]/5 hover:bg-[#5c5cff]/10 rounded-full py-2.5 mb-3 transition cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Install App
            </button>
          )}
          <button onClick={() => window.dispatchEvent(new Event('open-create-post'))} className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-full mb-3 font-semibold">New Post</button>

          <button 
            onClick={() => navigate(profilePath)} 
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-full transition cursor-pointer text-left mt-2"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600 font-bold text-sm">
                  {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{user?.name || user?.username}</div>
              <div className="text-xs text-gray-500 truncate">@{user?.username}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 overflow-auto border-r border-gray-200 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <img src="/pulse_logo.png" alt="Pulse" className="w-10 h-10" />
              <span className="text-2xl font-bold text-indigo-600">Pulse</span>
            </div>
            <nav className="flex-1">
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.key}>{renderNavButton(it, () => setOpen(false))}</li>
                ))}
                <li>
                  <button onClick={() => { navigate(profilePath); setOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${isActive(profilePath) ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
                    <NavIcon name="profile" />
                    <span className="flex-1 truncate">Profile</span>
                  </button>
                </li>
              </ul>
            </nav>

            <div className="mt-auto pt-6">
              {canInstall && (
                <button
                  onClick={() => { install(); setOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#5c5cff] border border-[#5c5cff]/30 bg-[#5c5cff]/5 hover:bg-[#5c5cff]/10 rounded-full py-2.5 mb-3 transition cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Install App
                </button>
              )}
              <button onClick={() => { window.dispatchEvent(new Event('open-create-post')); setOpen(false); }} className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-full mb-3 font-semibold">New Post</button>

              <button 
                onClick={() => { 
                  navigate(profilePath);
                  setOpen(false); 
                }} 
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-full transition cursor-pointer text-left mt-2"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-600 font-bold text-sm">
                      {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{user?.name || user?.username}</div>
                  <div className="text-xs text-gray-500 truncate">@{user?.username}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
