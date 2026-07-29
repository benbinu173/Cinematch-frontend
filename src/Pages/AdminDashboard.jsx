import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaFilm, FaTv, FaCommentDots, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import './AdminDashboard.css';
import { serverUrl } from '../Services/ServerUrl';

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, movies: 0, tvshows: 0, reviews: 0 });
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchStats = async () => {
      try {
        const [moviesRes, tvRes, usersRes, reviewsRes] = await Promise.all([
          axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: { api_key: '104982ca487a975dd171416b2958f849', language: 'en-US', page: 1 },
          }),
          axios.get('https://api.themoviedb.org/3/tv/popular', {
            params: { api_key: '104982ca487a975dd171416b2958f849', language: 'en-US', page: 1 },
          }),
          axios.get(`${serverUrl}/users/count`),
          axios.get(`${serverUrl}/reviews/all-reviews/count`),
        ]);

        setStats({
          users: usersRes.data.count || 0,
          movies: moviesRes.data.total_results || 0,
          tvshows: tvRes.data.total_results || 0,
          reviews: reviewsRes.data.count || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-dashboard">
        <div className="login-card">
          <h2>Admin Login Required</h2>
          <Link to="/adminlogin" className="btn-primary btn">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">
        Admin <span>Dashboard</span>
      </h2>
      <p className="dashboard-eyebrow">CineMatch Control Centre</p>

      <div className="dashboard-grid">
        {/* Users */}
        <div className="stat-card users">
          <FaUsers size={40} />
          <h5>Users</h5>
          <p>{stats.users.toLocaleString()} active</p>
          <Link to="/admin/users" className="btn">Manage</Link>
        </div>

        {/* Movies */}
        <div className="stat-card movies">
          <FaFilm size={40} />
          <h5>Movies</h5>
          <p>{stats.movies.toLocaleString()} in database</p>
          <Link to="/movies" className="btn">Manage</Link>
        </div>

        {/* TV Shows — blue accent per design system */}
        <div className="stat-card tvshows">
          <FaTv size={40} />
          <h5>TV Shows</h5>
          <p>{stats.tvshows.toLocaleString()} available</p>
          <Link to="/tvshows" className="btn">Manage</Link>
        </div>

        {/* Reviews */}
        <div className="stat-card reviews">
          <FaCommentDots size={40} />
          <h5>Reviews</h5>
          <p>{stats.reviews.toLocaleString()} submitted</p>
          <Link to="/admin/allreview" className="btn">View All</Link>
        </div>
      </div>

      <div className="text-center mt-5">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;