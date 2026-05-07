import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrending } from '../../hooks/useTrending';
import TrendingCard from './components/TrendingCard';

/**
 * Main Trends/Explore page
 * Similar to Twitter's Explore tab
 * Shows trending hashtags with search functionality
 */
const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { trending, isLoading, error } = useTrending({ limit: 50 });

  const filteredTrends = trending.filter(hashtag =>
    hashtag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/feed')}
            className="text-xl hover:text-blue-500 transition cursor-pointer"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">Explore</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="sticky top-14 z-40 p-4 bg-black/85 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-3 bg-zinc-900 rounded-full px-4 py-3 border border-zinc-700 focus-within:border-blue-500 transition">
            <span className="text-zinc-500">🔍</span>
            <input
              type="text"
              placeholder="Search hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-zinc-500 hover:text-zinc-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-4 text-center text-zinc-500">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
              Loading trends...
            </div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            Failed to load trends
          </div>
        ) : filteredTrends.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            {searchQuery ? 'No trends found matching your search' : 'No trends available'}
          </div>
        ) : (
          <div className="border-b border-zinc-800">
            {filteredTrends.map((hashtag, index) => (
              <TrendingCard
                key={hashtag.id}
                hashtag={hashtag}
                rank={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;
