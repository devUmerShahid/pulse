import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrendingBar from '../pages/Trends/components/TrendingBar';
import PulseLoader from './PulseLoader';
import { userAPI } from '../api/user.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const RightSidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['searchUsers', debouncedQuery],
    queryFn: () => userAPI.searchUsers(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  // Fetch suggested users
  const { data: suggestedData, isLoading: isLoadingSuggested } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: () => userAPI.getSuggestedUsers(3),
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: userAPI.followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] });
    },
  });

  const handleFollow = (userId: string) => {
    followMutation.mutate(userId);
  };

  const openProfile = (username: string) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/profile/${username}`);
  };

  const suggestedUsers = suggestedData?.users || [];

  return (
    <aside className="hidden lg:block w-80 shrink-0 pr-2 relative">
      <div className="sticky top-6">
        {/* Search */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search Pulse"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => {
              // Timeout to allow clicking on dropdown items
              setTimeout(() => setShowDropdown(false), 200);
            }}
          />
          {/* Search Dropdown */}
          {showDropdown && debouncedQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center py-3">
                  <PulseLoader size="sm" />
                </div>
              ) : searchResults?.users && searchResults.users.length > 0 ? (
                searchResults.users.map((user) => (
                  <div
                    key={user.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-0"
                    onClick={() => openProfile(user.username)}
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
                       {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-indigo-800 font-medium text-sm">
                            {(user.name || user.username).charAt(0).toUpperCase()}
                          </span>
                        )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name || user.username}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* Trending Now */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h3 className="font-semibold mb-3">Trending Now</h3>
          <TrendingBar />
        </div>

        {/* Who to follow */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">Who to follow</h3>
          {isLoadingSuggested ? (
            <div className="flex justify-center py-3">
              <PulseLoader size="sm" />
            </div>
          ) : suggestedUsers.length > 0 ? (
            <div className="space-y-4">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer overflow-hidden flex-1 mr-2"
                    onClick={() => openProfile(user.username)}
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-indigo-800 font-medium text-sm">
                            {(user.name || user.username).charAt(0).toUpperCase()}
                          </span>
                        )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium text-gray-900 truncate">{user.name || user.username}</div>
                      <div className="text-xs text-gray-500 truncate">@{user.username}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFollow(user.id)}
                    disabled={followMutation.isPending}
                    className="text-sm bg-black text-white px-3 py-1.5 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 shrink-0"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-2">No suggestions right now.</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
