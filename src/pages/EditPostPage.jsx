import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../constants';
const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog post');
        const post = await response.json();
        setTitle(post.title);
        setDescription(post.description);
        setCategory(post.category);
        setTags(post.tags.join(','));
        setExistingImage(`${BASE_URL}${post.image}`);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const validateFields = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required!';
    if (!description) newErrors.description = 'Description is required!';
    if (!category) newErrors.category = 'Category is required!';
    if (!image) newErrors.image = 'Image is required!';
    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('userInfo');
      const response = await fetch(`${BASE_URL}/api/blogs/${id}`, {
        
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update blog post');

      const updatedPost = await response.json();
      console.log('Blog post updated:', updatedPost);
      toast.success('Blog post updated successfully!');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Error updating blog post!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Blog Post</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500' : 'focus:ring-indigo-500'}`}
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500' : 'focus:ring-indigo-500'}`}
              placeholder="Enter post description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
            <select
              id="category"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500' : 'focus:ring-indigo-500'}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter tags (e.g. tech, AI, health)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Upload New Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.image ? 'border-red-500' : ''}`}
              onChange={handleImageChange}
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            {existingImage && (
              <div className="mt-4">
                <h3 className="text-sm font-bold">Current Image:</h3>
                <img src={existingImage} alt="Current" className="h-48 w-full object-cover rounded-lg" />
              </div>
            )}
            {image && (
              <div className="mt-4">
                <h3 className="text-sm font-bold">Preview:</h3>
                <img src={URL.createObjectURL(image)} alt="Selected" className="h-48 w-full object-cover rounded-lg" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
