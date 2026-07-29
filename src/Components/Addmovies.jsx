import React, { useEffect, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { addMovieAPI } from '../Services/allApi';
import { addResponseContext } from '../Context/ContextSharing';
import { FaPlus, FaCamera } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './Addmovies.css';

const EMPTY = { title: '', year: '', rating: '', overview: '', movieImg: '', tmdbId: '' };

function Addmovies() {
  const { setAddResponse } = useContext(addResponseContext);
  const [token, setToken] = useState('');
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [movieDetails, setmovieDetails] = useState(EMPTY);

  useEffect(() => {
    const stored = sessionStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (movieDetails.movieImg) {
      const url = URL.createObjectURL(movieDetails.movieImg);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [movieDetails.movieImg]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    setShow(false);
    handleCancel();
  };

  const handleCancel = () => {
    setmovieDetails(EMPTY);
    setImagePreview(null);
  };

  const set = (field) => (e) =>
    setmovieDetails((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (e) => {
    setmovieDetails((prev) => ({ ...prev, movieImg: e.target.files[0] }));
  };

  const handleAdd = async () => {
    const { title, year, rating, overview, movieImg, tmdbId } = movieDetails;

    if (!title || !year || !rating || !overview || !movieImg || !tmdbId) {
      toast.error('Please fill in all fields including TMDb ID');
      return;
    }

    if (!token) {
      toast.error('No token found. Please login.');
      return;
    }

    const reqBody = new FormData();
    reqBody.append('title', title);
    reqBody.append('year', year);
    reqBody.append('rating', rating);
    reqBody.append('overview', overview);
    reqBody.append('movieImg', movieImg);
    reqBody.append('tmdbId', tmdbId);

    const reqHeader = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await addMovieAPI(reqBody, reqHeader);
      if (result.status === 200) {
        toast.success('Movie added successfully');
        setAddResponse(result);
        setTimeout(() => handleClose(), 2000);
      } else {
        toast.error(result.response?.data || 'Something went wrong');
      }
    } catch (err) {
      console.error('Add Movie error:', err);
      toast.error('Error adding movie. Please try again.');
    }
  };

  return (
    <>
      {/* Trigger */}
      <div className="text-center">
        <button className="addmovie-trigger-btn" onClick={() => setShow(true)}>
          <FaPlus size={12} /> Add Movie
        </button>
      </div>

      {/* Modal */}
      {show && (
        <div className="addmovie-backdrop" onClick={handleBackdropClick}>
          <div className="addmovie-modal">

            {/* Header */}
            <div className="addmovie-modal-header">
              <p className="addmovie-modal-title">
                Add <span>Movie</span>
              </p>
              <button className="addmovie-close-btn" onClick={handleClose} aria-label="Close">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="addmovie-modal-body">

              {/* Poster upload */}
              <div className="addmovie-upload-col">
                <label className="addmovie-upload-label" htmlFor="uploadImage">
                  <input
                    id="uploadImage"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFile}
                  />
                  <img
                    src={
                      imagePreview ||
                      'https://t4.ftcdn.net/jpg/01/64/16/59/360_F_164165971_ELxPPwdwHYEhg4vZ3F4Ej7OmZVzqq4Ov.jpg'
                    }
                    className="addmovie-upload-img"
                    alt="Poster preview"
                  />
                  <div className="addmovie-upload-overlay">
                    <FaCamera className="addmovie-upload-icon" />
                  </div>
                </label>
                <span className="addmovie-upload-hint">Click to upload poster</span>
              </div>

              {/* Fields */}
              <div className="addmovie-form-col">
                <input
                  className="addmovie-input"
                  type="text"
                  placeholder="Movie Title"
                  value={movieDetails.title}
                  onChange={set('title')}
                />

                <div className="addmovie-row">
                  <input
                    className="addmovie-input"
                    type="text"
                    placeholder="Release Year"
                    value={movieDetails.year}
                    onChange={set('year')}
                  />
                  <input
                    className="addmovie-input"
                    type="text"
                    placeholder="Rating (e.g. 8.4)"
                    value={movieDetails.rating}
                    onChange={set('rating')}
                  />
                </div>

                <input
                  className="addmovie-input"
                  type="text"
                  placeholder="TMDb ID (e.g. 27205)"
                  value={movieDetails.tmdbId}
                  onChange={set('tmdbId')}
                />

                <textarea
                  className="addmovie-textarea"
                  placeholder="Movie Overview"
                  value={movieDetails.overview}
                  onChange={set('overview')}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="addmovie-modal-footer">
              <button className="addmovie-btn addmovie-btn-cancel" onClick={handleCancel}>
                Clear
              </button>
              <button className="addmovie-btn addmovie-btn-add" onClick={handleAdd}>
                Add Movie
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
    </>
  );
}

export default Addmovies;