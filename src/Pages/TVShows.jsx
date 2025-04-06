import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Tvseries.css';
function TVShows() {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTVShows(page);
  }, [page]);

  const fetchTVShows = async (pageNumber) => {
    try {
      const response = await axios.get("https://api.themoviedb.org/3/tv/popular", {
        params: {
          api_key: "104982ca487a975dd171416b2958f849",
          language: "en-US",
          page: pageNumber,
        }
      });
      setShows(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    }
  };

  // Function to add a TV show to the watchlist
  const addToWatchlist = (show) => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.find((item) => item.id === show.id)) {
      watchlist.push(show);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      toast.success("Added to Watchlist!");
    } else {
      toast.info("Already in Watchlist!");
    }
  };

  return (
    <div className="bg-tvseries text-dark">
      {/* Hero Section */}
      <div className="hero-section d-flex align-items-center justify-content-center position-relative text-center py-5" 
        style={{
          backgroundImage: "url(https://www.pinkvilla.com/english/images/2023/01/461908490_netflix-series_1600*900.jpg)", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
        }}>
        
        {/* Dark Overlay */}
        <div className="overlay position-absolute top-0 start-0 w-100 h-100" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}></div>
        
        <div className="container position-relative">
          <h1 className="display-4 fw-bold text-light">Welcome to TV Shows</h1>
          <p className="lead text-light">Discover the best TV shows and create your personalized watchlist!</p>
        </div>
      </div>

      {/* TV Shows List */}
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-4 text-primary">📺 Trending TV Shows (Page {page})</h2>
        <div className="row g-4">
          {shows.map((show) => (
            <div key={show.id} className="col-md-3">
              <div className="card shadow-lg border-0 rounded-4 text-center" 
                style={{ background: 'rgba(0, 0, 0, 0.7)', transition: "transform 0.3s", color: "white" }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  className="card-img-top rounded-top"
                  alt={show.name}
                  style={{ height: "320px", objectFit: "cover", transition: "transform 0.3s" }}
                  loading="lazy"
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold text-light">{show.name}</h5>
                  <p className="fw-bold">
                    <FaStar className="text-warning" /> {show.vote_average.toFixed(1)}
                  </p>
                  <button
                    className="btn btn-outline-primary w-100 mb-2"
                    onClick={() => addToWatchlist(show)}
                  >
                    Add to Watchlist
                  </button>
                  <Link to={`/tvshows/${show.id}`} className="text-light" style={{ textDecoration: "none" }}>
                    <button className="btn btn-outline-light btn-sm w-100">View Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-5">
          <button
            className="btn btn-primary me-3"
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        <ToastContainer position="top-center" theme="light" autoClose={2000} />
      </div>
    </div>
  );
}

export default TVShows;
