import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { FaStar, FaFilm, FaLaugh, FaHeart, FaRobot, FaBolt } from 'react-icons/fa';
import axios from 'axios';
import './Home.css';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    async function fetchPopularMovies() {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            api_key: '104982ca487a975dd171416b2958f849',
            language: 'en-US',
            page: 1,
          },
        });

        setPopularMovies(response.data.results.slice(0, 8));
        setTrendingMovies(response.data.results.slice(0, 5)); // For carousel
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    }

    fetchPopularMovies();
  }, []);

  return (
    <div className='home-bg'>
      {/* Hero Section */}
      <div className="hero-section text-white text-center d-flex align-items-center justify-content-center position-relative" style={{
        height: '80vh',
        backgroundImage: "url(https://dnm.nflximg.net/api/v6/BvVbc2Wxr2w6QuoANoSpJKEIWjQ/AAAAQRyruy3VX74B3clZV0KK5jLrLj2Vm6psEVkCqjAsigi61oaNXHbiGmtrzpjaIPIhymS0Q_tKn4utqIZ3yGWVG6W72SxS70pihwk1xCrJqlei1x-Og8gz-WFjqzFO8P6V8YqrlQkV_UiS4diHLTyOUI5P7b0.jpg?r=de5)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }}></div>

        <div className="container position-relative z-2">
          <h1 className="display-3 fw-bold text-light">Welcome to CineMatch</h1>
          <p className="lead text-white">Discover, Watch, and Enjoy Your Favorite Movies & Shows</p>
          <Link to="/movies" className="btn btn-warning btn-lg">Explore Now</Link>
        </div>
      </div>

      {/* Trending Movies & Shows Carousel (More Professional) */}
      <div className="container my-5">
        <h2 className="mb-4 text-center">🎬 Trending Now</h2>
        <Carousel fade interval={3000} className="shadow-lg rounded">
          {trendingMovies.map((movie) => (
            <Carousel.Item key={movie.id}>
              <div style={{
                position: 'relative',
                height: '500px',
                backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {/* Dark Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}></div>

                <Carousel.Caption className="text-light">
                  <h3 className="fw-bold">{movie.title}</h3>
                  <p className="lead">{movie.overview.slice(0, 100)}...</p>
                  <p><FaStar className="text-warning" /> {movie.vote_average.toFixed(1)}/10</p>
                  <Link to={`/movie/${movie.id}`} className="btn btn-warning">View Details</Link>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Categories Section */}
  

      {/* Popular in Watchlists */}
      <div className="container my-5">
        <h2 className="text-center">🔥 Popular in Watchlists</h2>
        <div className="row">
          {popularMovies.length > 0 ? (
            popularMovies.map((movie) => (
              <div key={movie.id} className="col-md-3 mb-4">
                <div className="card shadow-lg border-0 rounded">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200'}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{movie.title}</h5>
                    <p><FaStar className="text-warning" /> {movie.vote_average.toFixed(1)}/10</p>
                    <Link to={`/movie/${movie.id}`} className="btn btn-dark btn-sm">View Details</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Loading movies...</p>
          )}
        </div>
      </div>

      {/* Signup Section */}
      <div className="text-center my-5">
        <h2>🚀 Join CineMatch Today</h2>
        <Link to="/register" className="btn btn-warning btn-lg">Sign Up Now</Link>
      </div>
    </div>
  );
}

export default Home;
