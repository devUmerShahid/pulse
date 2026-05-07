import type { ReactNode } from 'react';
import React from 'react';

/**
 * Extract hashtag names from text
 * @param text - Text containing hashtags
 * @returns Array of hashtag names (lowercase, without #)
 *
 * @example
 * extractHashtags("Check this #ReactJS and #WebDev tutorial!")
 * // Returns: ['reactjs', 'webdev']
 */
export function extractHashtags(text: string): string[] {
  if (!text) {
    return [];
  }
  const regex = /#(\w+)/g;
  const matches = [...text.matchAll(regex)];
  return matches.map(m => m[1].toLowerCase());
}

/**
 * Check if text contains any hashtags
 * @param text - Text to check
 * @returns true if text contains hashtags, false otherwise
 *
 * @example
 * hasHashtags("Hello #world") // true
 * hasHashtags("Hello world") // false
 */
export function hasHashtags(text: string): boolean {
  if (!text) {
    return false;
  }
  return /#\w+/.test(text);
}

/**
 * Get unique hashtags from text
 * @param text - Text containing hashtags
 * @returns Array of unique hashtag names (lowercase, without #)
 *
 * @example
 * getUniqueHashtags("I love #ReactJS and #reactjs again")
 * // Returns: ['reactjs']
 */
export function getUniqueHashtags(text: string): string[] {
  const hashtags = extractHashtags(text);
  return [...new Set(hashtags)];
}

/**
 * Parse text and identify parts (text vs hashtag)
 * Creates clickable React elements for hashtags
 *
 * @param text - Text containing hashtags
 * @param onHashtagClick - Callback function when hashtag is clicked
 * @returns Array of strings and React elements
 *
 * @example
 * parseHashtagParts("Check #ReactJS", (tag) => console.log(tag))
 * // Returns: ["Check ", <span>#ReactJS</span>]
 */
export function parseHashtagParts(
  text: string,
  onHashtagClick?: (hashtag: string) => void
): (string | ReactNode)[] {
  if (!text) {
    return [];
  }

  const parts: (string | ReactNode)[] = [];
  const regex = /#(\w+)/g;
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    // Add text before hashtag
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add hashtag as clickable element
    const hashtag = match[0]; // includes the #
    const hashtagName = match[1].toLowerCase();

    parts.push(
      React.createElement(
        'span',
        {
          key: `hashtag-${parts.length}`,
          className: 'text-blue-500 hover:text-blue-400 underline cursor-pointer font-medium transition-colors',
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onHashtagClick?.(hashtagName);
          },
          role: 'button',
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onHashtagClick?.(hashtagName);
            }
          },
        },
        hashtag
      )
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * Format hashtag for display (remove # if present)
 * @param hashtag - Hashtag string with or without #
 * @returns Formatted hashtag (lowercase, without #)
 *
 * @example
 * formatHashtag("#ReactJS") // "reactjs"
 * formatHashtag("ReactJS") // "reactjs"
 */
export function formatHashtag(hashtag: string): string {
  if (!hashtag) {
    return '';
  }
  return hashtag.toLowerCase().replace(/^#+/, '');
}

/**
 * Add # symbol to hashtag if not present
 * @param hashtag - Hashtag name (with or without #)
 * @returns Hashtag with # symbol
 *
 * @example
 * addHashtagSymbol("reactjs") // "#reactjs"
 * addHashtagSymbol("#reactjs") // "#reactjs"
 */
export function addHashtagSymbol(hashtag: string): string {
  if (!hashtag) {
    return '';
  }
  const clean = hashtag.toLowerCase().replace(/^#+/, '');
  return `#${clean}`;
}

/**
 * Validate if a string is a valid hashtag name
 * Valid hashtags: alphanumeric and underscore, 1-30 chars
 * @param hashtag - Hashtag name to validate (without #)
 * @returns true if valid, false otherwise
 *
 * @example
 * isValidHashtag("ReactJS") // true
 * isValidHashtag("react js") // false (contains space)
 * isValidHashtag("a".repeat(31)) // false (too long)
 */
export function isValidHashtag(hashtag: string): boolean {
  if (!hashtag) {
    return false;
  }
  const clean = formatHashtag(hashtag);
  const regex = /^[a-z0-9_]{1,30}$/i;
  return regex.test(clean);
}

/**
 * Count hashtags in text
 * @param text - Text to count hashtags in
 * @returns Number of hashtags found
 *
 * @example
 * countHashtags("I love #ReactJS and #WebDev") // 2
 */
export function countHashtags(text: string): number {
  return extractHashtags(text).length;
}

/**
 * Replace hashtags in text with custom replacer function
 * @param text - Text containing hashtags
 * @param replacer - Function that takes hashtag name and returns replacement string
 * @returns Text with hashtags replaced
 *
 * @example
 * replaceHashtags("#ReactJS is great", (tag) => `[${tag}]`)
 * // Returns: "[ReactJS] is great"
 */
export function replaceHashtags(
  text: string,
  replacer: (hashtag: string) => string
): string {
  if (!text) {
    return '';
  }
  return text.replace(/#(\w+)/g, (_match, hashtag: string) => replacer(hashtag.toLowerCase()));
}

/**
 * Convert hashtags to URLs (e.g., for links)
 * @param hashtags - Array of hashtag names
 * @param basePath - Base path for hashtag links (default: '/trending')
 * @returns Array of URLs for hashtags
 *
 * @example
 * hashtagsToUrls(['reactjs', 'webdev'], "/search")
 * // Returns: ["/search/reactjs", "/search/webdev"]
 */
export function hashtagsToUrls(hashtags: string[], basePath: string = '/trending'): string[] {
  return hashtags.map(tag => `${basePath}/${formatHashtag(tag)}`);
}

/**
 * Extract hashtags with their positions in text
 * Useful for highlighting or advanced text processing
 * @param text - Text containing hashtags
 * @returns Array of {hashtag, start, end} objects
 *
 * @example
 * extractHashtagsWithPosition("Hello #world and #react")
 * // Returns: [{hashtag: 'world', start: 6, end: 12}, {hashtag: 'react', start: 17, end: 23}]
 */
export function extractHashtagsWithPosition(
  text: string
): Array<{ hashtag: string; start: number; end: number }> {
  if (!text) {
    return [];
  }
  const regex = /#(\w+)/g;
  const results: Array<{ hashtag: string; start: number; end: number }> = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    results.push({
      hashtag: match[1].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return results;
}

/**
 * Generate hashtag suggestions based on text
 * Returns trending-like format with hashtags
 * @param text - Text to generate suggestions from
 * @returns Array of hashtag suggestions
 *
 * @example
 * generateHashtagSuggestions("I'm learning React and JavaScript")
 * // Returns: ['react', 'javascript', 'coding', 'programming']
 */
export function generateHashtagSuggestions(text: string): string[] {
  if (!text) {
    return [];
  }

  // Common tech keywords to suggest as hashtags
  const techKeywords = [
    'react',
    'javascript',
    'typescript',
    'nodejs',
    'webdev',
    'frontend',
    'backend',
    'fullstack',
    'coding',
    'programming',
    'web',
    'mobile',
    'app',
    'development',
    'tutorial',
  ];

  const lowerText = text.toLowerCase();
  return techKeywords.filter(keyword => lowerText.includes(keyword));
}

/**
 * Limit number of hashtags allowed
 * @param text - Text containing hashtags
 * @param maxHashtags - Maximum number of hashtags allowed (default: 10)
 * @returns true if within limit, false otherwise
 *
 * @example
 * isWithinHashtagLimit("#a #b #c", 2) // false (3 hashtags > 2 limit)
 */
export function isWithinHashtagLimit(text: string, maxHashtags: number = 10): boolean {
  return countHashtags(text) <= maxHashtags;
}
