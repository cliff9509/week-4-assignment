import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import useApi from '../hooks/useApi';
import api from '../services/api';
import { useSearchParams, Link } from 'react-router-dom';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get('page') || 1;
  const keyword = searchParams.get('keyword') || '';
  const categoryFilter = searchParams.get('category') || '';

  const {
    data: postsData,
    loading,
    error,
    fetchData: fetchPosts,
  } = useApi(api.get, { posts: [], page: 1, pages: 1 }, []);

  const {
    data: categories,
    loading: loadingCategories,
    error: errorCategories,
    fetchData: fetchCategories,
  } = useApi(api.get, [], []);

  useEffect(() => {
    fetchPosts(
      `/api/posts?pageNumber=${pageNumber}&keyword=${keyword}&category=${categoryFilter}`
    );
  }, [pageNumber, keyword, categoryFilter, fetchPosts]);

  useEffect(() => {
    fetchCategories('/api/categories');
  }, [fetchCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value;
    setSearchParams({ page: 1, keyword: searchInput, category: categoryFilter });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSearchParams({ page: 1, keyword, category: selectedCategory });
  };

  return (
    <div>
      <h2>Latest Posts</h2>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
        <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
          <input
            type='text'
            name='search'
            placeholder='Search posts...'
            defaultValue={keyword}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: 'calc(100% - 70px)' }}
          />
          <button type='submit' className='button' style={{ marginLeft: '10px' }}>
            Search
          </button>
        </form>
        <div className='form-group'>
          <select onChange={handleCategoryChange} value={categoryFilter}>
            <option value=''>All Categories</option>
            {loadingCategories ? (
              <option>Loading categories...</option>
            ) : errorCategories ? (
              <option>Error loading categories</option>
            ) : (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {postsData.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            {[...Array(postsData.pages).keys()].map((x) => (
              <Link
                key={x + 1}
                to={`/?page=${x + 1}&keyword=${keyword}&category=${categoryFilter}`}
                style={{
                  padding: '8px 12px',
                  margin: '0 5px',
                  border: '1px solid #007bff',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  backgroundColor:
                    x + 1 === Number(pageNumber) ? '#007bff' : 'white',
                  color: x + 1 === Number(pageNumber) ? 'white' : '#007bff',
                }}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;