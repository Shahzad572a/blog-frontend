import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants';
const Navbar = () => {
  const navigate = useNavigate();

  // Check if the user is logged in by looking for the token in localStorage
  const isLoggedIn = !!localStorage.getItem('userInfo');

  const handleLogout = async () => {
    // Call the logout API to clear the cookie
    try {
      const response = await fetch(`${BASE_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include', // Required to send and receive cookies
      });

      const data = await response.json();
      if (response.ok) {
        // Clear the token from localStorage
        localStorage.removeItem('userInfo');
        alert(data.message);
        navigate('/login'); // Redirect to login after logging out
      }
    } catch (error) {
      console.error('Logout failed', error);
      alert('Logout failed, please try again.');
    }
  };

  return (
    <nav className="bg-indigo-600 p-4 fixed top-0 left-0 w-full z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          My Blog
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:bg-indigo-700 px-3 py-2 rounded">
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/create" className="text-white hover:bg-indigo-700 px-3 py-2 rounded">
                Create Post
              </Link>
              <Link to="/action" className="text-white hover:bg-indigo-700 px-3 py-2 rounded">
                Action
              </Link>
            </>
          )}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-white hover:bg-indigo-700 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="text-white hover:bg-indigo-700 px-3 py-2 rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;