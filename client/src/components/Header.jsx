import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>
        <h1>MERN Blog</h1>
      </Link>
      <nav>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            gap: '1rem',
          }}
        >
          <li>
            <Link
              to='/'
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to='/create-post'
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  Create Post
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  Logout ({user.name})
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to='/login'
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;