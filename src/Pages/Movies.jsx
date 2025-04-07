import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Movies.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const fetchMovies = async (pageNumber) => {
    try {
      const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: "104982ca487a975dd171416b2958f849",
          language: "en-US",
          page: pageNumber,
        },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const addToWatchlist = (movie) => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.find((item) => item.id === movie.id)) {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      toast.success("✅ Added to Watchlist!");
    } else {
      toast.info("ℹ️ Already in Watchlist!");
    }
  };

  return (
    <div className="bg-movies text-dark">
      {/* Hero Section */}
      <div className="hero-section d-flex align-items-center justify-content-center position-relative text-center py-5" 
        style={{
          backgroundImage: "url(https://s.studiobinder.com/wp-content/uploads/2019/12/Best-Movies-on-Netflix-Dec-2019-Featured-StudioBinder.jpg)", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
        }}>
        
        {/* Dark Overlay */}
        <div className="overlay position-absolute top-0 start-0 w-100 h-100" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}></div>

        <div className="container position-relative">
          <h1 className="display-4 fw-bold text-light">Welcome to Movies</h1>
          <p className="lead text-light">Find the best movies and curate your watchlist with ease!</p>
        </div>
      </div>

      {/* Movies List */}
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-4 text-danger">🎬 Trending Movies (Page {page})</h2>
        <div className="row g-4">
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-3">
              <div className="card shadow-lg border-0 rounded-4 text-center" 
                style={{ background: 'rgba(0, 0, 0, 0.7)', transition: "transform 0.3s" }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="card-img-top rounded-top"
                  alt={movie.title}
                  style={{ height: "350px", objectFit: "cover", transition: "transform 0.3s" }}
                  loading="lazy"
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{movie.title}</h5>
                  <p className="fw-bold">
                    <FaStar className="text-warning" /> {movie.vote_average.toFixed(1)}
                  </p>
                  <button
                    className="btn btn-outline-success w-100 mb-2"
                    onClick={() => addToWatchlist(movie)}
                  >
                     Add to Watchlist
                  </button>
                  <Link to={`/movie/${movie.id}`} className="text-dark" style={{ textDecoration: "none" }}>
                    <button className="btn btn-outline-dark btn-sm w-100"> View Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-5">
          <button
            className="btn btn-danger me-3"
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
          >
             Previous
          </button>
          <button
            className="btn btn-danger"
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

export default Movies;
