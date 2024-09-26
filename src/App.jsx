import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostDetailContainer from './pages/PostDetailContainer';
import CreatePostPage from './pages/CreatePostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Layout/Navbar';
import EditPostPage from './pages/EditPostPage';
import PostAction from './pages/PostAction';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
               <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailContainer />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/edit-blog/:id" element={<EditPostPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/action" element={<PostAction />} />


        </Routes>
      </Router>
    </>
  );
}

export default App;
