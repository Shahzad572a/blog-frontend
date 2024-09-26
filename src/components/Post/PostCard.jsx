import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BASE_URL } from '../../constants';
const limitWords = (text, wordCount) => {
  if (!text) return '';
  const words = text.split(' ');
  return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : text;
};

const PostCard = ({ post }) => {
  const commentCount = post.comments ? post.comments.length : 0;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <Link to={`/post/${post._id}`}>
        <img
          src={`${BASE_URL}${post.image}`}
          alt={post.title}
          className="w-full h-64 object-cover mb-4 rounded-lg"
        />
      </Link>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-700 mb-4">
          {limitWords(post.description, 10)} {/* Limit description to 8 words */}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="bg-indigo-200 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
            {limitWords(post.category, 8)} {/* Limit category to 8 words */}
          </span>
          <div className="text-sm text-gray-600">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-blue-200 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-600 text-sm">
            {commentCount} Comment{commentCount !== 1 ? 's' : ''}
          </span>
          <Link
            to={`/post/${post._id}`}
            className="text-indigo-500 hover:text-indigo-700 font-semibold"
          >
            View Comments
          </Link>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Link
          to={`/post/${post._id}`}
          className="text-indigo-500 hover:text-indigo-700 font-semibold"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

// PropTypes for type checking
PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default PostCard;
