import React, { useState, useEffect } from 'react';
import { fetchTopUsers, fetchUserPosts, getRandomAvatar } from '../services/api';

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const getTopUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchTopUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch top users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTopUsers();
  }, []);

  const handleUserClick = async (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      // Clicking the same user again will collapse the posts
      setSelectedUser(null);
      setUserPosts([]);
      return;
    }
    
    try {
      setSelectedUser(user);
      setLoadingPosts(true);
      const posts = await fetchUserPosts(user.id);
      setUserPosts(posts);
    } catch (err) {
      console.error(`Error fetching posts for user ${user.id}:`, err);
      setUserPosts([]);
    } finally {
      setLoadingPosts(false);
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
        <h2 className="text-2xl font-bold text-gray-900">Top Users</h2>
        <p className="text-gray-600">Users with the highest number of posts</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li 
                key={user.id} 
                className="py-4 px-6"
              >
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => handleUserClick(user)}
                >
                  <img 
                    className="h-16 w-16 rounded-full mr-4 object-cover"
                    src={getRandomAvatar(user.id)} 
                    alt={`${user.username || user.name}'s avatar`} 
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">{user.username || user.name}</p>
                    <p className="text-sm text-gray-500">Posts: <span className="font-bold text-indigo-600">{user.postCount || 0}</span></p>
                  </div>
                  <svg 
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${selectedUser?.id === user.id ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>

                {selectedUser?.id === user.id && (
                  <div className="mt-4 pl-20 border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Posts</h4>
                    {loadingPosts ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                      </div>
                    ) : userPosts.length > 0 ? (
                      <ul className="space-y-3">
                        {userPosts.map(post => (
                          <li key={post.id} className="bg-gray-50 p-3 rounded">
                            <h5 className="font-medium">{post.title}</h5>
                            <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              <span>{post.commentCount || 0} comments</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No posts available for this user.</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopUsers;