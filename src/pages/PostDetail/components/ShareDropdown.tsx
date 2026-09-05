// src/pages/PostDetail/components/ShareDropdown.tsx
import { useState, useRef, useEffect, type MouseEvent, type ReactNode } from 'react';

interface ShareDropdownProps {
  postId: string;
  postContent: string;
  postAuthor: string;
}

const ShareOption = ({ icon, label, onClick, className = '' }: { icon: ReactNode; label: string; onClick: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5 active:bg-white/10 transition text-left cursor-pointer ${className}`}
  >
    <span className="flex items-center justify-center w-5 shrink-0">{icon}</span>
    <span>{label}</span>
  </button>
);

const ShareDropdown = ({ postId, postContent, postAuthor }: ShareDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const postUrl = `${window.location.origin}/post/${postId}`;
  const shareText = `Check out this post by @${postAuthor}: "${postContent.slice(0, 100)}${postContent.length > 100 ? '...' : ''}"`;

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = postUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => { setCopied(false); setIsOpen(false); }, 1500);
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
    setIsOpen(false);
  };

  const handleShareTwitter = () =>
    openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`);

  const handleShareFacebook = () =>
    openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(shareText)}`);

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleShareLinkedIn = () =>
    openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`);

  const handleNativeShare = async () => {
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: `Post by @${postAuthor}`, text: postContent.slice(0, 200), url: postUrl }); } catch { /* cancelled */ }
      setIsOpen(false);
    }
  };

  const toggle = (e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); setIsOpen(!isOpen); };

  const strokeIconProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        onClick={toggle}
        className={`flex items-center gap-1.5 cursor-pointer transition ${isOpen ? 'text-green-500' : 'text-zinc-500 hover:text-green-500'}`}
      >
        <svg {...strokeIconProps} width={18} height={18}>
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 min-w-[220px] bg-zinc-900 border border-zinc-700/60 rounded-2xl py-1.5 z-50 shadow-2xl shadow-black/60 animate-[dropdownIn_0.2s_ease]">
          <div className="px-4 pt-2 pb-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-700/50 mb-1">
            Share this post
          </div>

          <ShareOption
            icon={copied ? (
              <svg {...strokeIconProps} width={16} height={16}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg {...strokeIconProps} width={16} height={16}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            )}
            label={copied ? 'Copied!' : 'Copy Link'}
            onClick={handleCopyLink}
          />
          <ShareOption
            icon={
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            }
            label="Share on X"
            onClick={handleShareTwitter}
          />
          <ShareOption
            icon={
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
              </svg>
            }
            label="Share on Facebook"
            onClick={handleShareFacebook}
          />
          <ShareOption
            icon={
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.043zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"></path>
              </svg>
            }
            label="Share on WhatsApp"
            onClick={handleShareWhatsApp}
          />
          <ShareOption
            icon={
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path>
              </svg>
            }
            label="Share on LinkedIn"
            onClick={handleShareLinkedIn}
          />

          {typeof navigator.share === 'function' && (
            <>
              <div className="border-t border-zinc-700/50 my-1" />
              <ShareOption
                icon={
                  <svg {...strokeIconProps} width={16} height={16}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                }
                label="More options..."
                onClick={handleNativeShare}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;
