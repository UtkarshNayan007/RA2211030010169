import React, { useState, useEffect } from 'react';
import { fetchTrendingPosts, getRandomAvatar, getRandomPostImage, addComment } from '../services/api';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getTrendingPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch trending posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTrendingPosts();
  }, []);

  const handleToggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
    setCommentText('');
  };

  const handleSubmitComment = async (postId) => {
    if (!commentText.trim()) return;
    
    try {
      setSubmitting(true);
      await addComment(postId, { 
        body: commentText, 
        userId: 1 // Using a placeholder user ID
      });
      
      // Update post locally to show the new comment count
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, commentCount: (post.commentCount || 0) + 1 } 
          : post
      ));
      
      setCommentText('');
      // Keep the comments section expanded
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trending Posts</h2>
        <p className="text-gray-600">Posts with the most comments</p>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No trending posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                className="h-48 w-full object-cover"
                src={getRandomPostImage(post.id)} 
                alt={`Post ${post.id} cover`} 
              />
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <img 
                    className="h-10 w-10 rounded-full mr-2"
                    src={getRandomAvatar(post.userId)} 
                    alt="User avatar" 
                  />
                  <span className="font-medium text-gray-900">{post.username || `User ${post.userId}`}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-3">{post.body}</p>
                
                <button 
                  onClick={() => handleToggleComments(post.id)}
                  className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-3"
                >
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                  </svg>
                  <span>{post.commentCount || 0} comments</span>
                </button>
                
                {expandedPostId === post.id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-start space-x-3 mb-4">
                      <img 
                        className="h-8 w-8 rounded-full"
                        src={getRandomAvatar()} 
                        alt="Your avatar" 
                      />
                      <div className="flex-1">
                        <textarea
                          className="w-full px-3 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows="2"
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            onClick={() => handleSubmitComment(post.id)}
                            disabled={!commentText.trim() || submitting}
                          >
                            {submitting ? 'Posting...' : 'Post Comment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;