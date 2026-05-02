// src/pages/PostDetail/components/ShareDropdown.tsx
import { useState, useRef, useEffect } from 'react';

interface ShareDropdownProps {
  postId: string;
  postContent: string;
  postAuthor: string;
}

const ShareDropdown = ({ postId, postContent, postAuthor }: ShareDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const postUrl = `${window.location.origin}/post/${postId}`;
  const shareText = `Check out this post by @${postAuthor}: "${postContent.slice(0, 100)}${postContent.length > 100 ? '...' : ''}"`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const toggle = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setIsOpen(!isOpen); };

  const ShareOption = ({ icon, label, onClick, className = '' }: { icon: string; label: string; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5 active:bg-white/10 transition text-left cursor-pointer ${className}`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        onClick={toggle}
        className={`flex items-center gap-1.5 cursor-pointer transition ${isOpen ? 'text-green-500' : 'text-zinc-500 hover:text-green-500'}`}
      >
        🔗 Share
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 min-w-[220px] bg-zinc-900 border border-zinc-700/60 rounded-2xl py-1.5 z-50 shadow-2xl shadow-black/60 animate-[dropdownIn_0.2s_ease]">
          <div className="px-4 pt-2 pb-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-700/50 mb-1">
            Share this post
          </div>

          <ShareOption icon={copied ? '✅' : '🔗'} label={copied ? 'Copied!' : 'Copy Link'} onClick={handleCopyLink} />
          <ShareOption icon="𝕏" label="Share on X" onClick={handleShareTwitter} />
          <ShareOption icon="📘" label="Share on Facebook" onClick={handleShareFacebook} />
          <ShareOption icon="💬" label="Share on WhatsApp" onClick={handleShareWhatsApp} />
          <ShareOption icon="💼" label="Share on LinkedIn" onClick={handleShareLinkedIn} />

          {typeof navigator.share === 'function' && (
            <>
              <div className="border-t border-zinc-700/50 my-1" />
              <ShareOption icon="📤" label="More options..." onClick={handleNativeShare} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;
