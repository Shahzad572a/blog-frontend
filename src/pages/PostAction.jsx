import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing the icons

const PostAction = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Number of posts to display per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/myblogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('userInfo')}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setBlogs(data);
        } else {
          console.error('Error fetching blogs:', data.message);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('userInfo');
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'DELETE',
        });

        const data = await response.json();
        if (response.ok) {
          toast.success('Post deleted successfully');
          setBlogs(blogs.filter(blog => blog._id !== id));
        } else {
          console.error('Error deleting blog:', data.message);
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const updateBlog = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  // Calculate the total pages
  const totalPages = Math.ceil(blogs.length / postsPerPage);

  // Get the blogs for the current page
  const indexOfLastBlog = currentPage * postsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - postsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">My Blog Posts</h2>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-left">Image</th>
            <th className="py-2 px-4 border-b text-left">Title</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  <Link to={`/post/${blog._id}`}>
                    <img
                      src={`http://localhost:5000${blog.image}`}
                      alt={blog.title}
                      className="w-16 h-16 object-cover"
                    />
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{blog.title}</td>
                <td className="py-2 px-4 border-b">{blog.description.length > 10 ? blog.description.slice(0, 10) + "..." : blog.description}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateBlog(blog._id)}
                      className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      <FaEdit className="mr-1" />  
                    </button>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      <FaTrashAlt className="mr-1" />  
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">No posts found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-lg mx-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-lg mx-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostAction;
