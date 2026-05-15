import React, { useEffect, useState } from 'react';
import { useTrending } from '../../../hooks/useTrending';
import { subscribeToEvent } from '../../../services/socket';
import TrendingCard from './TrendingCard';

/**
 * Display trending hashtags in a sidebar
 * Shows top 10 trending hashtags with post counts
 * Reusable component for use on Feed, PostDetail pages
 */
const TrendingBar: React.FC = () => {
  const { trending, isLoading, error } = useTrending({ limit: 10 });
  const [displayTrending, setDisplayTrending] = useState(trending);

  // Update displayTrending when trending changes from API
  useEffect(() => {
    setDisplayTrending(trending);
  }, [trending]);

  // ✅ LISTEN TO TRENDING UPDATES
  useEffect(() => {
    const updateTrending = (eventData: any) => {
      console.log('📈 Trends updated');
      if (eventData.trending && Array.isArray(eventData.trending)) {
        setDisplayTrending(eventData.trending);
      }
    };

    const cleanupListUpdated = subscribeToEvent('TRENDING_LIST_UPDATED', updateTrending);
    const cleanupUpdated = subscribeToEvent('TRENDING_UPDATED', updateTrending);

    return () => {
      cleanupListUpdated();
      cleanupUpdated();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-4 sticky top-14">
        <div className="text-zinc-400 text-sm">Loading trends...</div>
      </div>
    );
  }

  if (error || displayTrending.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-4 sticky top-14">
        <div className="text-zinc-500 text-sm">No trends available</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden sticky top-14">
      <div className="px-4 py-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-white">What&apos;s happening?</h2>
      </div>
      {displayTrending.map((hashtag, index) => (
        <TrendingCard key={hashtag.id} hashtag={hashtag} rank={index + 1} />
      ))}
      <div className="px-4 py-3 border-t border-zinc-800 hover:bg-zinc-950/50 transition cursor-pointer text-center">
        <button className="text-blue-500 font-semibold w-full hover:text-blue-400">
          Show more
        </button>
      </div>
    </div>
  );
};

export default TrendingBar;
