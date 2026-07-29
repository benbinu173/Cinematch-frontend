import React, { useState, useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { updateUserMoviesAPI } from '../Services/allApi';
import { editResponseContext, addResponseContext } from '../Context/ContextSharing';
import { serverUrl } from '../Services/ServerUrl';
import { FaCamera } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './EditMovies.css';

function EditMovies({ movie, setEditingMovie }) {
  const { setEditResponse } = useContext(editResponseContext);
  const { setAddResponse } = useContext(addResponseContext);

  const [key, setKey] = useState(0);
  const [preview, setPreview] = useState('');
  const [movieDetails, setMovieDetails] = useState({
    title: '',
    year: '',
    rating: '',
    overview: '',
    movieImg: null,
  });

  // Populate form when movie prop changes
  useEffect(() => {
    if (movie) {
      setMovieDetails({
        title: movie.title || '',
        year: movie.year || '',
        rating: movie.rating || '',
        overview: movie.overview || '',
        movieImg: null,
      });
      setPreview('');
      setKey((k) => k + 1);
    }
  }, [movie]);

  // Generate object URL for new file picks
  useEffect(() => {
    if (movieDetails.movieImg instanceof File) {
      const url = URL.createObjectURL(movieDetails.movieImg);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview('');
    }
  }, [movieDetails.movieImg]);

  const handleClose = () => {
    handleCancel();
    if (setEditingMovie) setEditingMovie(null);
  };

  const handleCancel = () => {
    setMovieDetails({
      title: movie?.title || '',
      year: movie?.year || '',
      rating: movie?.rating || '',
      overview: movie?.overview || '',
      movieImg: null,
    });
    setPreview('');
    setKey((k) => k + 1);
  };

  const set = (field) => (e) =>
    setMovieDetails((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setMovieDetails((prev) => ({ ...prev, movieImg: file }));
  };

  const handleUpdate = async () => {
    const { title, year, rating, overview, movieImg } = movieDetails;

    if (!title || !year || !rating || !overview) {
      toast.error('Please fill out all fields.');
      return;
    }

    const reqBody = new FormData();
    reqBody.append('title', title);
    reqBody.append('year', year);
    reqBody.append('rating', rating);
    reqBody.append('overview', overview);
    if (movieImg instanceof File) reqBody.append('movieImg', movieImg);

    const token = sessionStorage.getItem('token');
    const reqHeader = { Authorization: `Bearer ${token}` };

    try {
      const result = await updateUserMoviesAPI(movie._id, reqBody, reqHeader);

      if (result.status === 200) {
        setEditResponse(result);
        setAddResponse(result);
        toast.success('Movie updated successfully!');
        setTimeout(() => handleClose(), 2000);
      } else if (result.status === 406) {
        toast.warning(result.response.data);
      } else {
        toast.error('Something went wrong.');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Server error during update.');
    }
  };

  // Resolve poster src: new preview > existing server image > placeholder
  const posterSrc =
    preview ||
    (movie?.movieImg ? `${serverUrl}/upload/${movie.movieImg}` : null) ||
    'https://via.placeholder.com/300x450.png?text=No+Image';

  return (
    <>
      <div className="editmovie-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div className="editmovie-modal">

          {/* Header */}
          <div className="editmovie-modal-header">
            <p className="editmovie-modal-title">
              Update <span>Movie</span>
            </p>
            <button className="editmovie-close-btn" onClick={handleClose} aria-label="Close">
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="editmovie-modal-body">

            {/* Poster */}
            <div className="editmovie-poster-col">
              <label className="editmovie-poster-label" htmlFor="movieImage">
                <input
                  key={key}
                  id="movieImage"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFile}
                />
                <img
                  src={posterSrc}
                  className="editmovie-poster-img"
                  alt={movie?.title || 'Movie poster'}
                />
                <div className="editmovie-poster-overlay">
                  <FaCamera className="editmovie-poster-icon" />
                  <span className="editmovie-poster-hint-hover">Change poster</span>
                </div>
              </label>
              <span className="editmovie-poster-hint">Click poster to replace</span>
            </div>

            {/* Fields */}
            <div className="editmovie-form-col">
              <input
                className="editmovie-input"
                type="text"
                placeholder="Movie Title"
                value={movieDetails.title}
                onChange={set('title')}
              />

              <div className="editmovie-row">
                <input
                  className="editmovie-input"
                  type="text"
                  placeholder="Release Year"
                  value={movieDetails.year}
                  onChange={set('year')}
                />
                <input
                  className="editmovie-input"
                  type="text"
                  placeholder="Rating (e.g. 8.4)"
                  value={movieDetails.rating}
                  onChange={set('rating')}
                />
              </div>

              <textarea
                className="editmovie-textarea"
                placeholder="Movie Overview"
                value={movieDetails.overview}
                onChange={set('overview')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="editmovie-modal-footer">
            <button className="editmovie-btn editmovie-btn-cancel" onClick={handleCancel}>
              Reset
            </button>
            <button className="editmovie-btn editmovie-btn-update" onClick={handleUpdate}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={5000} />
    </>
  );
}

export default EditMovies;