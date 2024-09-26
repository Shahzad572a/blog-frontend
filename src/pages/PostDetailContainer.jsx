import React, { useState, useEffect } from 'react';
import PostDetailPage from '../components/Post/PostDetailPage';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams

const PostDetailContainer = () => {
  const { id } = useParams(); // Use useParams to get the id from the URL 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // Initialize comments state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching the post:', error);
        setError('Post not found!');
      } finally {
        setLoading(false);
      }
    };

    fetchPostById();
  }, [id]); // Dependency on id

  useEffect(() => {
    // Initialize comments when post is available
    if (post) {
      setComments(post.comments || []); // Ensure comments is initialized only if post exists
    }
  }, [post]); // Run this effect when post changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found!</div>;
  }

  return <PostDetailPage post={post} comments={comments} setComments={setComments} />;
};

export default PostDetailContainer;
