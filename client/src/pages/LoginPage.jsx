import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setFormError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Sign In</h1>
      {formError && <Message variant='danger'>{formError}</Message>}
      {loading && <Loader />}
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            id='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='button'>
          Sign In
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        New Customer?{' '}
        <Link to='/register' style={{ color: '#007bff' }}>
          Register
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;