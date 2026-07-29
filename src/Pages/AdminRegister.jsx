import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AdminregisterAPI } from '../Services/allApi';
import './AdminReg.css';

function AdminRegister() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleRegister = async () => {
    const { username, email, password } = userDetails;

    if (!username || !email || !password) {
      toast.info('Please fill the form completely');
      return;
    }

    const result = await AdminregisterAPI(userDetails);

    if (result.status >= 200 && result.status < 300) {
      toast.info('Registration successful');
      setUserDetails({ username: '', email: '', password: '' });
      navigate('/adminlogin');
    } else if (result.status >= 400 && result.status < 500) {
      toast.info(result.response?.data || 'Something went wrong');
    } else {
      toast.info('Something went wrong');
    }
  };

  return (
    <div className="adminreg-bg">
      <div className="adminreg-card">

        {/* Left — cinematic visual panel */}
        <div className="adminreg-visual">
          <div className="adminreg-visual-overlay">
            <p className="adminreg-visual-tagline">
              Your stage.<br /><span>Set it up.</span>
            </p>
            <p className="adminreg-visual-sub">CineMatch Admin Portal</p>
          </div>
        </div>

        {/* Right — form panel */}
        <div className="adminreg-form-panel">
          <h1 className="adminreg-heading">Create Account</h1>
          <p className="adminreg-subheading">Admin registration</p>

          <div className="adminreg-field">
            <input
              type="text"
              className="adminreg-input"
              placeholder="Username"
              value={userDetails.username}
              onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
            />
          </div>

          <div className="adminreg-field">
            <input
              type="email"
              className="adminreg-input"
              placeholder="Email"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            />
          </div>

          <div className="adminreg-field">
            <input
              type="password"
              className="adminreg-input"
              placeholder="Password"
              value={userDetails.password}
              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
            />
          </div>

          <button className="adminreg-btn" type="button" onClick={handleRegister}>
            Register
          </button>

          <p className="adminreg-link-row">
            Already have an account? <Link to="/adminlogin">Sign in</Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
    </div>
  );
}

export default AdminRegister;