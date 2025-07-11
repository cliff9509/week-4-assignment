import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import api from '../services/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: categories,
    loading: loadingCategories,
    error: errorCategories,
    fetchData: fetchCategories,
  } = useApi(api.get, [], []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchCategories('/api/categories');
    }
  }, [user, navigate, fetchCategories]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/posts', { title, content, category, featuredImage });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await api.post('/api/posts/upload', formData, config);
      setFeaturedImage(data.imageUrl);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert(error.response?.data?.message || error.message);
    }
  };

  if (!user) {
    return <Message variant='info'>Please login to create a post.</Message>;
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
      <h1>Create New Post</h1>
      {loadingCategories ? (
        <Loader />
      ) : errorCategories ? (
        <Message variant='danger'>{errorCategories}</Message>
      ) : (
        <form onSubmit={submitHandler}>
          <div className='form-group'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='content'>Content</label>
            <textarea
              id='content'
              rows='10'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div className='form-group'>
            <label htmlFor='category'>Category</label>
            <select
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=''>Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='featuredImage'>Featured Image</label>
            <input
              type='text'
              id='featuredImage'
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder='Enter image URL or upload'
            />
            <input type='file' onChange={uploadFileHandler} />
            {uploading && <Loader />}
          </div>
          <button type='submit' className='button'>
            Create Post
          </button>
        </form>
      )}
    </div>
  );
}

export default CreatePostPage;