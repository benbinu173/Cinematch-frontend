import React, { useState } from 'react';
import loginphoto from "../assets/Animation - 1742099700803.gif";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AdminloginAPI } from '../Services/allApi';
import './AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const { username, password } = userDetails;

    if (!username || !password) {
      toast.info('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await AdminloginAPI({ username, password });
    setLoading(false);

    if (result.status >= 200 && result.status <= 399) {
      toast.success('Login successful.');
      sessionStorage.setItem('existingAdmin', JSON.stringify(result.data.existingAdmin));
      sessionStorage.setItem('token', result.data.token);
      setUserDetails({ username: "", password: "" });
      setTimeout(() => navigate('/admin'), 2000);
    } else if (result.status >= 400 && result.status < 500) {
      toast.error(result.response?.data || 'Invalid credentials.');
      setUserDetails({ username: "", password: "" });
    } else {
      toast.error('Something went wrong. Try again.');
      setUserDetails({ username: "", password: "" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="al-page">
      {/* Deep radial glow */}
      <div className="al-glow" />

      <div className="al-card">
        {/* Gold hairline */}
        <div className="al-hairline" />

        <div className="al-inner">

          {/* ── Left branding panel ── */}
          <div className="al-left">
            <div className="al-logo">
              <span className="al-logo-cine">CINE</span>
              <span className="al-logo-match">MATCH</span>
            </div>

            <div className="al-badge">
              <span className="al-badge-dot" />
              Admin Portal
            </div>

            <p className="al-left-desc">
              Restricted access. Authorised administrators only.
            </p>

            <img
              src={loginphoto}
              alt="Admin animation"
              className="al-gif"
            />

            <p className="al-reg-hint">
              New admin?{' '}
              <Link to="/adminreg" className="al-reg-link">Request access</Link>
            </p>
          </div>

          {/* ── Divider ── */}
          <div className="al-divider" />

          {/* ── Right form panel ── */}
          <div className="al-right">
            <h1 className="al-heading">Welcome Back</h1>
            <p className="al-subheading">Sign in to your admin account.</p>

            <div className="al-form">
              <div className="al-field">
                <label className="al-label">Username</label>
                <input
                  type="text"
                  value={userDetails.username}
                  onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="admin_username"
                  className="al-input"
                  autoComplete="username"
                />
              </div>

              <div className="al-field">
                <label className="al-label">Password</label>
                <input
                  type="password"
                  value={userDetails.password}
                  onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="al-input"
                  autoComplete="current-password"
                />
              </div>

              <button
                className="al-btn"
                onClick={handleLogin}
                type="button"
                disabled={loading}
              >
                {loading ? 'Verifying…' : 'Login'}
              </button>
            </div>
          </div>

        </div>
      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
    </div>
  );
}

export default AdminLogin;