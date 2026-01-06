'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

interface CommentsProps {
  postId: string;
}

/**
 * Comments Component
 * Client-side component for blog post comments with localStorage persistence
 */
export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const storageKey = `blog-comments-${postId}`;

  // Load comments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setComments(parsed);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [storageKey]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Create new comment
    const newComment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add to comments array
    const updatedComments = [newComment, ...comments];

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedComments));
      setComments(updatedComments);

      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to save comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format timestamp
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="comments-section">
      {/* Comments Header */}
      <div className="comments-header">
        <h2 className="comments-title">Comments ({comments.length})</h2>
        <p className="comments-subtitle">Share your thoughts about this post</p>
      </div>

      {/* Comment Form */}
      <div className="comment-form-wrapper">
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Your name"
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`form-textarea ${errors.message ? 'input-error' : ''}`}
              placeholder="Write your comment here..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <div className="comment-avatar">{comment.name.charAt(0).toUpperCase()}</div>
                <div className="comment-meta">
                  <div className="comment-author">{comment.name}</div>
                  <div className="comment-date">{formatDate(comment.timestamp)}</div>
                </div>
              </div>
              <div className="comment-body">
                <p>{comment.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Get comment count for a post (use in server components)
 * Note: This must be called client-side to access localStorage
 */
export function getCommentCount(postId: string): number {
  if (typeof window === 'undefined') return 0;

  try {
    const stored = localStorage.getItem(`blog-comments-${postId}`);
    if (stored) {
      const comments = JSON.parse(stored);
      return comments.length;
    }
  } catch (error) {
    console.error('Error getting comment count:', error);
  }
  return 0;
}
