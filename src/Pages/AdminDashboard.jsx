import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaFilm, FaTv, FaChartBar, FaSignOutAlt, FaCommentDots } from 'react-icons/fa';
import axios from 'axios';
import './AdminDashboard.css';
import { serverUrl } from '../Services/ServerUrl';

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, movies: 0, tvshows: 0, reviews: 0 });
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));

  useEffect(() => {
    if (isLoggedIn) {
      const fetchStats = async () => {
        try {
          // Fetch movies
          const moviesResponse = await axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: { api_key: "104982ca487a975dd171416b2958f849", language: "en-US", page: 1 },
          });
          console.log("Movies Response:", moviesResponse.data);

          // Fetch TV shows
          const tvShowsResponse = await axios.get("https://api.themoviedb.org/3/tv/popular", {
            params: { api_key: "104982ca487a975dd171416b2958f849", language: "en-US", page: 1 },
          });
          console.log("TV Shows Response:", tvShowsResponse.data);

          // Fetch users count from the backend
          const usersResponse = await axios.get(`${serverUrl}/users/count`);
          console.log("Users Response:", usersResponse.data);

          // Fetch reviews count (Make sure this API exists in your backend)
          const reviewsResponse = await axios.get(`${serverUrl}/reviews/all-reviews/count`);
          console.log("Reviews Response:", reviewsResponse.data);

          // Update state with the fetched data
          setStats({
            users: usersResponse.data.count || 0,
            movies: moviesResponse.data.total_results || 0,
            tvshows: tvShowsResponse.data.total_results || 0,
            reviews: reviewsResponse.data.count || 0,
          });

        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {!isLoggedIn ? (
        <div className="login-card text-center">
          <h2>Admin Login Required</h2>
          <Link to="/adminlogin" className="btn btn-primary">Login</Link>
        </div>
      ) : (
        <>
          <h2 className="dashboard-title text-white">Admin Dashboard</h2>
          <div className="dashboard-grid">
            <div className="stat-card users">
              <FaUsers size={50} />
              <h5>Manage Users</h5>
              <p>{stats.users} Active Users</p>
              <Link to="/admin/users" className="btn">Go to Users</Link>
            </div>
            <div className="stat-card movies mt-5">
              <FaFilm size={50} />
              <h5>Manage Movies</h5>
              <p>{stats.movies} Movies in Database</p>
              <Link to="/movies" className="btn">Go to Movies</Link>
            </div>
            <div className="stat-card tvshows mt-5">
              <FaTv size={50} />
              <h5>Manage TV Shows</h5>
              <p>{stats.tvshows} TV Shows Available</p>
              <Link to="/tvshows" className="btn">Go to TV Shows</Link>
            </div>
            <div className="stat-card reviews mt-5">
              <FaCommentDots size={50} />
              <h5>Manage Reviews</h5>
              <p>{stats.reviews} Reviews Submitted</p>
              <Link to="/admin/allreview" className="btn">View All Reviews</Link>

            </div>
          </div>

          <div className="text-center mt-5">
            <button onClick={handleLogout} className="logout-btn btn btn-danger">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </>
        
      )}
    </div>
  );
}

export default AdminDashboard;
