// src/pages/Profile/components/ProfilePostList.tsx
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../../api/post.api';
import PostContent from '../../../components/PostContent';
import BookmarkButton from '../../../components/BookmarkButton';
import LikeButton from '../../../components/LikeButton';
import DeletePostButton from '../../../components/DeletePostButton';
import PulseLoader from '../../../components/PulseLoader';
import { formatRelativeTime } from '../../../utils/time';
import ShareDropdown from '../../PostDetail/components/ShareDropdown';

interface ProfilePostListProps {
  posts: Post[];
  isLoading?: boolean;
  /** Query key of the posts query so bookmark toggles can invalidate it. */
  queryKey: unknown[];
}

const ProfilePostList = ({ posts, isLoading, queryKey }: ProfilePostListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <PulseLoader size="md" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 font-medium">
        No posts yet.
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {/* Avatar + Info */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden">
              {post.user.avatar ? (
                <img src={post.user.avatar} alt={post.user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-gray-500">{(post.user.name || post.user.username).charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-[15px]">
                  {post.user.name || post.user.username}
                </span>
                <svg className="w-4 h-4 text-[#5c5cff]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79-.45-.51-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79.45.51.68 1.11.68 1.79s.23 1.28.68 1.79c-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79.51.45 1.11.68 1.79.68.68 0 1.28-.23 1.79-.68.51.45 1.11.68 1.79.68.68 0 1.28-.23 1.79-.68.51.45 1.11.68 1.79.68.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79zm-12.83 4.31L5.55 12.7l1.7-1.7 2.42 2.41 6.59-6.59 1.7 1.7-8.29 8.29z"/></svg>
                <span className="text-gray-500 text-[13px] font-medium">
                  @{post.user.username} · {formatRelativeTime(post.createdAt)}
                </span>
                <DeletePostButton postId={post.id} postUserId={post.user.id} queryKey={queryKey} className="ml-auto" />
              </div>
              
              {/* Content with hashtag links */}
              <div className="mt-1 text-gray-800 text-[15px] leading-relaxed">
                <PostContent content={post.content} />
              </div>
              
              {/* Image */}
              {post.imageUrl && (
                <div className="mt-3">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="rounded-xl w-full object-cover border border-gray-200 max-h-80"
                  />
                </div>
              )}
              
              {/* Action Bar */}
              <div className="flex flex-wrap justify-between items-center mt-4 text-gray-400 max-w-md">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/post/${post.id}`);
                  }}
                  className="flex items-center gap-2 hover:text-indigo-500 transition cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  <span className="text-[13px] font-medium">{post._count?.comments ?? 0}</span>
                </button>

                <LikeButton postId={post.id} isLiked={post.isLiked} likeCount={post._count?.likes ?? 0} queryKey={queryKey} className="hover:text-pink-500" />

                <BookmarkButton
                  postId={post.id}
                  isBookmarked={post.isBookmarked}
                  bookmarkCount={post._count?.bookmarks}
                  queryKey={queryKey}
                  className="hover:text-indigo-500"
                />

                <div onClick={(e) => e.stopPropagation()} className="hover:text-indigo-500 transition cursor-pointer">
                  <ShareDropdown
                    postId={post.id}
                    postContent={post.content}
                    postAuthor={post.user.username}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfilePostList;
