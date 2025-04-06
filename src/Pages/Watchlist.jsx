import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

function Watchlist() {
  const isLoggedIn = sessionStorage.getItem("token");
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(storedWatchlist);
  }, []);

  // Function to remove a movie from watchlist
  const removeFromWatchlist = (id) => {
    const updatedList = watchlist.filter(movie => movie.id !== id);
    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  return (
    <div className='container watchlist-bg mt-5'>
      {isLoggedIn ? (
        <div>
          <h2 className="text-center fw-bold mb-4">📺 Your Watchlist</h2>
          <div className="row g-4">
            {watchlist.length > 0 ? (
              watchlist.map((movie) => (
                <div key={movie.id} className="col-md-3">
                  <div className="card shadow-lg border-0 rounded-3 text-center">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      className="card-img-top rounded-top" 
                      alt={movie.title} 
                      style={{ height: "300px", objectFit: "cover" }} 
                      loading="lazy" 
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{movie.title}</h5>
                      <p className="fw-bold">
                        <FaStar className="text-warning" /> {movie.vote_average.toFixed(1)}
                      </p>
                      <button 
                        className="btn btn-danger w-100"
                        onClick={() => removeFromWatchlist(movie.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted mt-3">No movies added to Watchlist yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">
          <h3 className="text-danger fw-bold">Access Denied</h3>
          <p className='text-muted'>You must be logged in to access your Watchlist.</p>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
