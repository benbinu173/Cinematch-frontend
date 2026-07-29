import React, { useState } from 'react';
import registerimg from "../assets/Animation - 1742100674978.gif";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { registerAPI } from '../Services/allApi';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    const { username, email, password } = userDetails;

    if (!username || !email || !password) {
      toast.info(`Please fill the form completely`);
    } else {
      const result = await registerAPI(userDetails);
      console.log(result);

      if (result.status >= 200 && result.status < 300) {
        toast.info(`Registration successful`);
        setUserDetails({ username: "", email: "", password: "" });
        navigate('/login');
      } else if (result.status >= 400 && result.status < 500) {
        toast.info(result.response?.data || `Something went wrong`);
      } else {
        toast.info(`Something went wrong`);
      }
    }
  };

  return (
    <div className="register-bg">
      {/* Radial gold glow backdrop */}
      <div className="register-glow" />

      <div className="register-card">
        {/* Gold hairline top border */}
        <div className="register-hairline" />

        <div className="register-inner">
          {/* Left — Branding panel */}
          <div className="register-left">
            <div className="register-logo">
              <span className="logo-cine">CINE</span>
              <span className="logo-match">MATCH</span>
            </div>
            <p className="register-tagline">Your personal guide to every screen worth watching.</p>
            <img
              src={registerimg}
              alt="Cinema animation"
              className="register-gif"
            />
            <p className="register-signin-hint">
              Already a member?{' '}
              <Link to="/login" className="register-link">Sign in</Link>
            </p>
          </div>

          {/* Divider */}
          <div className="register-divider" />

          {/* Right — Form panel */}
          <div className="register-right">
            <h1 className="register-heading">Create Account</h1>
            <p className="register-subheading">Join the community. Rate, discover, match.</p>

            <div className="register-form">
              <div className="register-field">
                <label className="register-label">Username</label>
                <input
                  type="text"
                  value={userDetails.username}
                  onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                  placeholder="e.g. cinephile_raj"
                  className="register-input"
                />
              </div>

              <div className="register-field">
                <label className="register-label">Email</label>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  placeholder="you@example.com"
                  className="register-input"
                />
              </div>

              <div className="register-field">
                <label className="register-label">Password</label>
                <input
                  type="password"
                  value={userDetails.password}
                  onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                  placeholder="••••••••"
                  className="register-input"
                />
              </div>

              <button
                className="register-btn"
                onClick={handleRegister}
                type="button"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
    </div>
  );
}

export default Register;