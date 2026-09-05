import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrending } from '../../hooks/useTrending';
import { subscribeToEvent } from '../../services/socket';
import TrendingCard from './components/TrendingCard';
import RightSidebar from '../../components/RightSidebar';
import Sidebar from '../../components/Sidebar';
import PulseLoader from '../../components/PulseLoader';

/**
 * Main Trends/Explore page
 * Similar to Twitter's Explore tab
 * Shows trending hashtags with search functionality
 */
const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery] = useState('');
  const { trending, isLoading, error } = useTrending({ limit: 50 });
  const [displayTrending, setDisplayTrending] = useState(trending);

  // Update displayTrending only when API data changes
  useEffect(() => {
    if (trending.length > 0) {
      setDisplayTrending(trending);
    }
  }, [trending]);

  // ✅ LISTEN TO REAL-TIME TRENDING UPDATES (socket events only)
  useEffect(() => {
    const handleTrendingUpdate = (eventData: any) => {
      console.log('📈 Trends updated in real-time');
      if (eventData.trending && Array.isArray(eventData.trending)) {
        setDisplayTrending(eventData.trending);
      }
    };

    // Only subscribe if we have initial data
    if (displayTrending.length > 0 || trending.length > 0) {
      const cleanupListUpdated = subscribeToEvent('TRENDING_LIST_UPDATED', handleTrendingUpdate);
      const cleanupUpdated = subscribeToEvent('TRENDING_UPDATED', handleTrendingUpdate);

      return () => {
        cleanupListUpdated();
        cleanupUpdated();
      };
    }
  }, [displayTrending.length, trending.length]);

  const filteredTrends = displayTrending.filter(hashtag =>
    hashtag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock categories for UI since API doesn't provide them yet
  const categories = ['All', 'News', 'Sports', 'Tech', 'Entertainment'];
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex gap-6 pt-8 px-4 md:px-8">
        <div className="flex-1 max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition"
              aria-label="Go back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Trending on Pulse</h1>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Content List */}
          <div className="border-t border-gray-200 pt-2">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <PulseLoader size="lg" />
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500 font-medium">
                Failed to load trends
              </div>
            ) : filteredTrends.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {searchQuery ? 'No trends found matching your search' : 'No trends available'}
              </div>
            ) : (
              <div className="flex flex-col">
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

        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-8">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Trends;
