import React, { useEffect, useState } from 'react';
import { useTrending } from '../../../hooks/useTrending';
import { subscribeToEvent } from '../../../services/socket';
import PulseLoader from '../../../components/PulseLoader';
import TrendingCard from './TrendingCard';

/**
 * Display trending hashtags in a sidebar
 * Shows top 10 trending hashtags with post counts
 * Reusable component for use on Feed, PostDetail pages
 */
const TrendingBar: React.FC = () => {
  const { trending, isLoading, error } = useTrending({ limit: 10 });
  const [displayTrending, setDisplayTrending] = useState(trending);

  // Update displayTrending only when API data changes
  useEffect(() => {
    if (trending.length > 0) {
      setDisplayTrending(trending);
    }
  }, [trending]);

  // ✅ LISTEN TO TRENDING UPDATES (socket events only)
  useEffect(() => {
    const updateTrending = (eventData: any) => {
      console.log('📈 Trends updated');
      if (eventData.trending && Array.isArray(eventData.trending)) {
        setDisplayTrending(eventData.trending);
      }
    };

    // Only subscribe if we have initial data
    if (displayTrending.length > 0 || trending.length > 0) {
      const cleanupListUpdated = subscribeToEvent('TRENDING_LIST_UPDATED', updateTrending);
      const cleanupUpdated = subscribeToEvent('TRENDING_UPDATED', updateTrending);

      return () => {
        cleanupListUpdated();
        cleanupUpdated();
      };
    }
  }, [displayTrending.length, trending.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <PulseLoader size="sm" />
      </div>
    );
  }

  if (error || displayTrending.length === 0) {
    return (
      <div className="py-4 text-center">
        <div className="text-sm text-gray-500">No trends available</div>
      </div>
    );
  }

  return (
    <div className=" overflow-hidden sticky top-14">
      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-black">What&apos;s happening?</h2>
      </div>
      {displayTrending.map((hashtag, index) => (
        <TrendingCard key={hashtag.id} hashtag={hashtag} rank={index + 1} />
      ))}
      <div className="px-4 py-3 border-t border-gray-200  transition cursor-pointer text-center">
        <button className="text-indigo-600 font-semibold w-full hover:text-black cursor-pointer">
          Show more
        </button>
      </div>
    </div>
  );
};

export default TrendingBar;
