import React, { useState, useEffect } from 'react';
import { fetchPosts, getRandomAvatar, getRandomPostImage } from '../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        // Sort posts by date descending (newest first)
        const sortedPosts = data.sort((a, b) => {
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        });
        setPosts(sortedPosts);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPosts();

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      getPosts();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && posts.length === 0) {
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
        <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
        <p className="text-gray-600">Real-time feed of the newest posts</p>
      </div>
      
      {loading && (
        <div className="text-center py-2 text-sm text-indigo-600">
          Refreshing feed...
        </div>
      )}
      
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center mb-4">
                <img 
                  className="h-10 w-10 rounded-full mr-2"
                  src={getRandomAvatar(post.userId)} 
                  alt="User avatar" 
                />
                <div>
                  <span className="font-medium text-gray-900">{post.username || `User ${post.userId}`}</span>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.body}</p>
              <img 
                className="w-full h-64 object-cover rounded-md mb-4"
                src={getRandomPostImage(post.id)} 
                alt={`Post ${post.id} image`} 
              />
              <div className="flex items-center justify-between text-gray-500">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{Math.floor(Math.random() * 100) + 10} views</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                  </svg>
                  <span>{post.commentCount || Math.floor(Math.random() * 10)} comments</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;