import React from 'react';
import { useNavigate } from 'react-router-dom';
import { parseHashtagParts } from '../utils/hashtags';

interface PostContentProps {
  content: string;
  className?: string;
}

/**
 * Display post content with clickable hashtags
 * Hashtags are rendered in blue and navigate to hashtag detail page
 */
const PostContent: React.FC<PostContentProps> = ({ content, className = '' }) => {
  const navigate = useNavigate();

  const handleHashtagClick = (hashtag: string) => {
    navigate(`/trending/${hashtag}`);
  };

  const parts = parseHashtagParts(content, handleHashtagClick);

  return (
    <div className={`text-[17px] leading-relaxed ${className}`}>
      {parts}
    </div>
  );
};

export default PostContent;
