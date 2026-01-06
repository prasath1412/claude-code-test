'use client';

import { useState, useEffect } from 'react';

interface CommentCountProps {
  postId: string;
}

/**
 * CommentCount Component
 * Client-side component to display comment count from localStorage
 */
export default function CommentCount({ postId }: CommentCountProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`blog-comments-${postId}`);
      if (stored) {
        const comments = JSON.parse(stored);
        setCount(comments.length);
      }
    } catch (error) {
      console.error('Error loading comment count:', error);
    }
  }, [postId]);

  if (count === 0) return null;

  return (
    <span className="comment-count-badge">
      <svg
        className="comment-badge-icon"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {count} {count === 1 ? 'comment' : 'comments'}
    </span>
  );
}
