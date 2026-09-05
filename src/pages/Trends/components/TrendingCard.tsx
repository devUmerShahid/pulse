import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Hashtag {
  id: string;
  name: string;
  _count?: {
    posts: number;
  };
}

interface TrendingCardProps {
  hashtag: Hashtag;
  rank?: number;
}

/**
 * Display individual trending hashtag card
 * Shows hashtag name, post count, and rank
 */
const TrendingCard: React.FC<TrendingCardProps> = ({ hashtag, rank }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/trending/${hashtag.name}`);
  };

  const postCount = hashtag._count?.posts || 0;
  const formattedCount = Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(postCount).toLowerCase();

  // Pseudo-category mapping for visual fidelity based on the mockup.
  const nameUpper = hashtag.name.toUpperCase();
  let category = 'TECH';
  if (nameUpper.includes('SPORT') || nameUpper.includes('WIMBLEDON') || nameUpper.includes('FOOTBALL')) category = 'SPORTS';
  else if (nameUpper.includes('NEWS') || nameUpper.includes('LIVING') || nameUpper.includes('ELECTION')) category = 'NEWS';
  else if (nameUpper.includes('ART') || nameUpper.includes('MUSIC') || nameUpper.includes('ECLIPSE')) category = 'ENTERTAINMENT';

  return (
    <div
      onClick={handleClick}
      className="py-5 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer flex items-center"
    >
      <div className="w-10 text-sm font-mono font-medium text-gray-400 text-center shrink-0">
        {rank}
      </div>
      <div className="flex-1 px-4">
        <div className="flex items-center gap-3 mb-1.5">
          <h2 className="text-xl font-bold text-[#5c5cff]">#{hashtag.name}</h2>
          <span className="bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase">
            {category}
          </span>
        </div>
        <div className="text-gray-500 font-mono text-sm font-medium">
          {formattedCount} posts
        </div>
      </div>
      <div className="text-gray-400 px-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default TrendingCard;
