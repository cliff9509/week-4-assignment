import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: 'white',
      }}
    >
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          style={{
            maxWidth: '100%',
            height: '200px',
            objectFit: 'cover',
            marginBottom: '10px',
            borderRadius: '4px',
          }}
        />
      )}
      <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none' }}>
        <h3 style={{ color: '#007bff' }}>{post.title}</h3>
      </Link>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        By {post.user ? post.user.name : 'Unknown'} on{' '}
        {new Date(post.createdAt).toLocaleDateString()}
        {post.category && ` in ${post.category.name}`}
      </p>
      <p>{post.content.substring(0, 150)}...</p>
      <Link to={`/posts/${post._id}`} className='button'>
        Read More
      </Link>
    </div>
  );
}

export default PostCard;