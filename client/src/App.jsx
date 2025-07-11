import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostDetailsPage from './pages/PostDetailsPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Header />
      <main className='container'>
        <Routes>
          <Route path='/' element={<HomePage />} exact />
          <Route path='/posts/:id' element={<PostDetailsPage />} />
          <Route path='/create-post' element={<CreatePostPage />} />
          <Route path='/edit-post/:id' element={<EditPostPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;