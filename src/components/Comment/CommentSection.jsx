import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const CommentSection = ({ comments, setComments, blogId }) => {
  const [newComment, setNewComment] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingComment, setEditingComment] = useState('');
  const [visibleComments, setVisibleComments] = useState(3); // Initially show 3 comments
  const userInfo = localStorage.getItem('userInfo'); // Check if the user is logged in  
  const userInfoId = localStorage.getItem('userInfoId');
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const response = await axios.post(`http://localhost:5000/api/blogs/${blogId}/comments`, {
          text: newComment,
        }, {
          headers: {
            Authorization: `Bearer ${userInfo}`, // Use the token from userInfo
          },
        });
        setComments(response.data.comments);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleEditClick = (index, comment) => {
    setEditingIndex(index);
    setEditingComment(comment.text);
  };

  const handleEditSubmit = async (e, commentId) => {
    e.preventDefault();
    if (editingComment.trim()) {
      try {
        const response = await axios.put(`http://localhost:5000/api/blogs/${blogId}/comments/${commentId}`, {
          text: editingComment,
        }, {
          headers: {
            Authorization: `Bearer ${userInfo}`, // Use the token from userInfo
          },
        });
        setComments(response.data.comments);
        setEditingIndex(null);
        setEditingComment('');
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    console.log('Attempting to delete comment:', commentId, 'from blog:', blogId);
    try {
      const response = await axios.delete(`http://localhost:5000/api/blogs/${blogId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userInfo')}`,
        },
      });
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error deleting comment:', error.response.data);
    }
  };


  // Infinite Scroll
  const loadMoreComments = () => {
    setVisibleComments((prevCount) => prevCount + 3); // Load 3 more comments when scrolling
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
        loadMoreComments();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 max-h-48 overflow-y-auto">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.slice(0, visibleComments).map((comment, index) => (
            <div key={index} className="border-b last:border-b-0 py-2">
              {editingIndex === index ? (
                <form onSubmit={(e) => handleEditSubmit(e, comment._id)}>
                  <textarea
                    className="border rounded-lg p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-gray-800">{comment.text}</p>
                  <div className="flex justify-between mt-2">
                    {userInfo && comment.user && (
                      <>
                        {/* Debugging: Check what userInfo and comment.user are */}
                        {console.log('Current User Info:', userInfo)}
                        {console.log('Comment User ID:', comment.user)}
                        {console.log('Do they match?', userInfo.id === comment.user)}

                        {userInfoId === comment.user ? ( // Adjust this based on your actual user ID key
                          <>
                            <button
                              onClick={() => handleEditClick(index, comment)}
                              className="flex items-center text-blue-500 hover:underline"
                            >
                              <FaEdit className="h-4 w-4 mr-1" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="flex items-center text-red-500 hover:underline"
                            >
                              <FaTrashAlt className="h-4 w-4 mr-1" />
                            </button>
                          </>
                        ) : null}
                      </>
                    )}
                  </div>


                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Show comment form only if user is logged in */}
      {userInfo ? (
        <form onSubmit={handleCommentSubmit} className="flex flex-col mt-4">
          <textarea
            className="border rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            Submit Comment
          </button>
        </form>
      ) : (
        <div className="mt-4 text-center">
          <p className="text-red-500">Please log in to add a comment.</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
