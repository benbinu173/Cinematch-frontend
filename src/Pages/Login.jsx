import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser, FaLock, FaPlay } from 'react-icons/fa';
import { loginAPI } from '../Services/allApi';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const { username, password } = userDetails;
    if (!username || !password) {
      toast.info('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAPI({ username, password });

      if (result.status >= 200 && result.status <= 399) {
        toast.success('Welcome back!');
        sessionStorage.setItem('existingUser', JSON.stringify(result.data.existingUser));
        sessionStorage.setItem('token', result.data.token);
        sessionStorage.setItem('userId', result.data.existingUser._id);
        setUserDetails({ username: '', password: '' });
        setTimeout(() => navigate('/profile'), 1500);
      } else if (result.status >= 400 && result.status < 500) {
        toast.error(result.response?.data || 'Invalid credentials');
        setUserDetails({ username: '', password: '' });
      } else {
        toast.error('Something went wrong');
      }
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="lg-root">

      {/* ── SPLIT LEFT — cinematic backdrop ── */}
      <div className="lg-left">
        <div className="lg-left__bg" />
        <div className="lg-left__overlay" />

        <div className="lg-left__content">
          {/* Logo */}
          <Link to="/" className="lg-logo">
            <span className="lg-logo__icon"><FaPlay /></span>
            CineMatch
          </Link>

          {/* Pull-quote */}
          <div className="lg-quote">
            <p className="lg-quote__text">
              "Cinema is a mirror by which we often see ourselves."
            </p>
            <span className="lg-quote__attr">— Martin Scorsese</span>
          </div>

          {/* Floating film strip decoration */}
          <div className="lg-strip">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="lg-strip__frame" />
            ))}
          </div>
        </div>
      </div>

      {/* ── SPLIT RIGHT — form ── */}
      <div className="lg-right">
        <div className="lg-form-wrap">

          {/* Header */}
          <div className="lg-form__header">
            <h1 className="lg-form__title">Welcome back</h1>
            <p className="lg-form__sub">Sign in to your CineMatch account</p>
          </div>

          {/* Fields */}
          <div className="lg-field">
            <span className="lg-field__icon"><FaUser /></span>
            <input
              type="text"
              placeholder="Username"
              value={userDetails.username}
              onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
              onKeyDown={handleKey}
              className="lg-field__input"
              autoComplete="username"
            />
          </div>

          <div className="lg-field">
            <span className="lg-field__icon"><FaLock /></span>
            <input
              type="password"
              placeholder="Password"
              value={userDetails.password}
              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
              onKeyDown={handleKey}
              className="lg-field__input"
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            className={`lg-submit ${loading ? 'lg-submit--loading' : ''}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="lg-spinner" />
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className="lg-divider">
            <span className="lg-divider__line" />
            <span className="lg-divider__text">New to CineMatch?</span>
            <span className="lg-divider__line" />
          </div>

          <Link to="/register" className="lg-register-btn">
            Create an Account
          </Link>

        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar
        toastClassName="lg-toast"
      />
    </div>
  );
}

export default Login;