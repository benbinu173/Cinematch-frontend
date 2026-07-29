import React, { useEffect, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { addSeriesAPI } from '../Services/allApi';
import { addResponseContext } from '../Context/ContextSharing';
import { FaPlus, FaCamera } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './AddSeries.css';

const EMPTY = {
  title: '',
  tmdbId: '',
  year: '',
  seasons: '',
  rating: '',
  overview: '',
  seriesImg: '',
};

function AddSeries() {
  const { setAddResponse } = useContext(addResponseContext);
  const [token, setToken] = useState('');
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [seriesDetails, setSeriesDetails] = useState(EMPTY);

  useEffect(() => {
    const stored = sessionStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (seriesDetails.seriesImg) {
      const url = URL.createObjectURL(seriesDetails.seriesImg);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [seriesDetails.seriesImg]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    setShow(false);
    handleCancel();
  };

  const handleCancel = () => {
    setSeriesDetails(EMPTY);
    setImagePreview(null);
  };

  const set = (field) => (e) =>
    setSeriesDetails((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (e) => {
    setSeriesDetails((prev) => ({ ...prev, seriesImg: e.target.files[0] }));
  };

  const handleAdd = async () => {
    const { title, tmdbId, year, seasons, rating, overview, seriesImg } = seriesDetails;

    if (!title || !tmdbId || !year || !seasons || !rating || !overview || !seriesImg) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!token) {
      toast.error('No token found. Please login.');
      return;
    }

    const reqBody = new FormData();
    reqBody.append('title', title);
    reqBody.append('tmdbId', tmdbId);
    reqBody.append('year', year);
    reqBody.append('seasons', seasons);
    reqBody.append('rating', rating);
    reqBody.append('overview', overview);
    reqBody.append('seriesImg', seriesImg);

    const reqHeader = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await addSeriesAPI(reqBody, reqHeader);
      if (result.status === 200) {
        toast.success('Series added successfully');
        setAddResponse(result);
        setTimeout(() => handleClose(), 2000);
      } else {
        toast.error(result.response?.data || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.response?.data || 'Error adding series. Please try again.');
    }
  };

  return (
    <>
      {/* Trigger — blue for TV content */}
      <div className="text-center">
        <button className="addseries-trigger-btn" onClick={() => setShow(true)}>
          <FaPlus size={12} /> Add Series
        </button>
      </div>

      {/* Modal */}
      {show && (
        <div className="addseries-backdrop" onClick={handleBackdropClick}>
          <div className="addseries-modal">

            {/* Header */}
            <div className="addseries-modal-header">
              <p className="addseries-modal-title">
                Add <span>Series</span>
              </p>
              <button
                className="addseries-close-btn"
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="addseries-modal-body">

              {/* Poster upload */}
              <div className="addseries-upload-col">
                <label className="addseries-upload-label" htmlFor="uploadSeriesImage">
                  <input
                    id="uploadSeriesImage"
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
                    className="addseries-upload-img"
                    alt="Poster preview"
                  />
                  <div className="addseries-upload-overlay">
                    <FaCamera className="addseries-upload-icon" />
                  </div>
                </label>
                <span className="addseries-upload-hint">Click to upload poster</span>
              </div>

              {/* Fields */}
              <div className="addseries-form-col">
                <input
                  className="addseries-input"
                  type="text"
                  placeholder="Series Title"
                  value={seriesDetails.title}
                  onChange={set('title')}
                />

                <input
                  className="addseries-input"
                  type="text"
                  placeholder="TMDb ID (e.g. 1396)"
                  value={seriesDetails.tmdbId}
                  onChange={set('tmdbId')}
                />

                {/* Year · Seasons · Rating in one row */}
                <div className="addseries-row">
                  <input
                    className="addseries-input"
                    type="text"
                    placeholder="Year"
                    value={seriesDetails.year}
                    onChange={set('year')}
                  />
                  <input
                    className="addseries-input"
                    type="text"
                    placeholder="Seasons"
                    value={seriesDetails.seasons}
                    onChange={set('seasons')}
                  />
                  <input
                    className="addseries-input"
                    type="text"
                    placeholder="Rating"
                    value={seriesDetails.rating}
                    onChange={set('rating')}
                  />
                </div>

                <textarea
                  className="addseries-textarea"
                  placeholder="Series Overview"
                  value={seriesDetails.overview}
                  onChange={set('overview')}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="addseries-modal-footer">
              <button className="addseries-btn addseries-btn-cancel" onClick={handleCancel}>
                Clear
              </button>
              <button className="addseries-btn addseries-btn-add" onClick={handleAdd}>
                Add Series
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
    </>
  );
}

export default AddSeries;