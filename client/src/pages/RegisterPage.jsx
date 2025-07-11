import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, register } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError('');
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (error) {
      setFormError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Sign Up</h1>
      {formError && <Message variant='danger'>{formError}</Message>}
      {loading && <Loader />}
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className='form-group'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            id='confirmPassword'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='button'>
          Register
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        Have an Account?{' '}
        <Link to='/login' style={{ color: '#007bff' }}>
          Login
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;