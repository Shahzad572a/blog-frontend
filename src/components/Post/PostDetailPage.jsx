// PostDetailPage.jsx
import React from 'react';
import CommentSection from '../Comment/CommentSection'; // Import the new CommentSection component
import { BASE_URL } from '../../constants';
const PostDetailPage = ({ post, comments, setComments }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
      <img 
          src={`${BASE_URL}${post.image}`}
          alt={post.title}
        className="w-full h-60 object-cover rounded-t-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <div className="flex items-center justify-between mt-2">
        <span className="bg-indigo-200 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
          {post.category}
        </span>
        <div className="text-sm text-gray-600">
        {post.tags && post.tags.map((tag, index) => (
            <span key={index} className="mr-2">
              #{tag.trim()}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-gray-700">{post.description}</p>

      {/* Include the CommentSection here */}
      <CommentSection comments={comments} setComments={setComments} blogId={post._id}/>
    </div>
  );
};

export default PostDetailPage;
