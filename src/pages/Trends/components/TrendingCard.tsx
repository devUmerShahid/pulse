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

  return (
    <div
      onClick={handleClick}
      className="px-4 py-3 border-b border-zinc-800 hover:bg-zinc-950/50 transition cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-zinc-500 text-xs mb-1">
            {rank ? `#${rank}` : ''} Trending Worldwide
          </div>
          <div className="text-blue-500 font-semibold text-sm hover:text-blue-400">
            #{hashtag.name}
          </div>
          <div className="text-zinc-500 text-xs mt-1">
            {postCount.toLocaleString()} {postCount === 1 ? 'post' : 'posts'}
          </div>
        </div>
        <div className="text-zinc-600 text-lg">→</div>
      </div>
    </div>
  );
};

export default TrendingCard;
