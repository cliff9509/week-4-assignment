import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import api from '../services/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

  const {
    data: post,
    loading,
    error,
    fetchData: fetchPost,
    setData: setPostData, // To update comments optimistically
  } = useApi(api.get, null, [id]);

  useEffect(() => {
    if (id) {
      fetchPost(`/api/posts/${id}`);
    }
  }, [id, fetchPost]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/api/posts/${id}`);
        navigate('/');
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    if (!user) {
      alert('You must be logged in to comment');
      return;
    }

    try {
      // Optimistic UI update
      const newComment = {
        user: { _id: user._id, name: user.name }, // Simulate user data
        text: commentText,
        createdAt: new Date().toISOString(),
      };

      setPostData((prevPost) => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), newComment],
      }));
      setCommentText('');

      await api.post(`/api/posts/${id}/comments`, { text: commentText });
      // Re-fetch to get the official comment with server-generated ID and timestamp if needed
      fetchPost(`/api/posts/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      // Revert optimistic update if there's an error
      fetchPost(`/api/posts/${id}`);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant='danger'>{error}</Message>;
  if (!post) return <Message>Post not found</Message>;

  const isAuthor = user && post.user && user._id === post.user._id;

  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
      <Link to='/' className='button' style={{ marginBottom: '1rem', display: 'inline-block' }}>
        Go Back
      </Link>
      {isAuthor && (
        <div style={{ marginBottom: '1rem', float: 'right' }}>
          <Link to={`/edit-post/${post._id}`} className='button'>
            Edit Post
          </Link>{' '}
          <button onClick={handleDelete} className='button' style={{ backgroundColor: 'red' }}>
            Delete Post
          </button>
        </div>
      )}
      <h1>{post.title}</h1>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        By {post.user ? post.user.name : 'Unknown'} on{' '}
        {new Date(post.createdAt).toLocaleDateString()}
        {post.category && ` in ${post.category.name}`}
      </p>
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          style={{
            maxWidth: '100%',
            height: '300px',
            objectFit: 'cover',
            marginBottom: '1rem',
            borderRadius: '8px',
          }}
        />
      )}
      <div style={{ lineHeight: '1.6' }}>{post.content}</div>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Comments</h3>
      {post.comments && post.comments.length === 0 ? (
        <Message>No comments yet</Message>
      ) : (
        <div style={{ marginBottom: '1.5rem' }}>
          {post.comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                border: '1px solid #eee',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '10px',
              }}
            >
              <strong>{comment.user ? comment.user.name : 'Anonymous'}</strong>{' '}
              <span style={{ fontSize: '0.8em', color: '#888' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form onSubmit={handleAddComment}>
          <div className='form-group'>
            <label htmlFor='comment'>Add a Comment</label>
            <textarea
              id='comment'
              rows='5'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
          </div>
          <button type='submit' className='button'>
            Submit Comment
          </button>
        </form>
      ) : (
        <Message variant='info'>
          Please <Link to='/login'>log in</Link> to add a comment.
        </Message>
      )}
    </div>
  );
}

export default PostDetailsPage;