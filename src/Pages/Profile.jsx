import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaFilm, FaTv, FaSignOutAlt, FaLock, FaTrash, FaPen } from 'react-icons/fa';
import Addmovies from '../Components/Addmovies';
import Addseries from '../Components/Addseries';
import EditMovies from '../Components/EditMovies';
import EditSeries from '../Components/EditSeries';
import { deleteUserMoviesAPI, deleteUserSeriesAPI, getUserMoviesAPI, getUserSeriesAPI } from '../Services/allApi';
import { addResponseContext, editResponseContext } from '../Context/ContextSharing';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import { serverUrl } from '../Services/ServerUrl';

function Profile() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('token');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const { addResponse } = useContext(addResponseContext);
  const [removeStatus, setRemoveStatus] = useState({});
  const { editResponse } = useContext(editResponseContext);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingSeries, setEditingSeries] = useState(null);
  const [activeTab, setActiveTab] = useState('movies');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('existingUser'));
    if (userData?.username && userData?.email) {
      setUsername(userData.username);
      setEmail(userData.email);
    }
  }, []);

  useEffect(() => {
    getUserMovies();
    getUserSeries();
  }, [addResponse, removeStatus, editResponse]);

  const getUserMovies = async () => {
    if (!isLoggedIn) return;
    try {
      const reqHeader = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
      const result = await getUserMoviesAPI(reqHeader);
      if (result?.data) setMovies(result.data);
    } catch (e) { console.error(e); }
  };

  const getUserSeries = async () => {
    if (!isLoggedIn) return;
    try {
      const reqHeader = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
      const result = await getUserSeriesAPI(reqHeader);
      if (result?.data) setSeries(result.data);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id, type) => {
    if (!isLoggedIn) return;
    const reqHeader = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
    const result = type === 'movie'
      ? await deleteUserMoviesAPI(id, reqHeader)
      : await deleteUserSeriesAPI(id, reqHeader);
    if (result.status === 200) {
      toast.success(`${type === 'movie' ? 'Movie' : 'Series'} removed`);
      setRemoveStatus(result);
    } else {
      toast.error('Something went wrong');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // ── ACCESS DENIED ──────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="pf-root pf-denied">
        <div className="pf-denied__card">
          <div className="pf-denied__icon"><FaLock /></div>
          <h2 className="pf-denied__title">Access Restricted</h2>
          <p className="pf-denied__sub">You need to be signed in to view your profile.</p>
          <Link to="/login" className="pf-btn pf-btn--gold">Sign In</Link>
        </div>
      </div>
    );
  }

  const initials = username ? username.slice(0, 2).toUpperCase() : '??';

  return (
    <div className="pf-root">

      {/* ── HERO BANNER ── */}
      <div className="pf-hero">
        <div className="pf-hero__overlay" />
        <div className="pf-hero__content">
          <div className="pf-avatar">{initials}</div>
          <div className="pf-hero__info">
            <h1 className="pf-hero__name">{username}</h1>
            <p className="pf-hero__email">{email}</p>
            <div className="pf-hero__stats">
              <div className="pf-stat">
                <span className="pf-stat__num">{movies.length}</span>
                <span className="pf-stat__label">Movies</span>
              </div>
              <div className="pf-stat__divider" />
              <div className="pf-stat">
                <span className="pf-stat__num">{series.length}</span>
                <span className="pf-stat__label">Series</span>
              </div>
            </div>
          </div>
          <button className="pf-btn pf-btn--ghost pf-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="pf-container">

        {/* Tab bar */}
        <div className="pf-tabs">
          <button
            className={`pf-tab ${activeTab === 'movies' ? 'pf-tab--active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            <FaFilm className="pf-tab__icon" />
            My Movies
            <span className="pf-tab__badge">{movies.length}</span>
          </button>
          <button
            className={`pf-tab ${activeTab === 'series' ? 'pf-tab--active' : ''}`}
            onClick={() => setActiveTab('series')}
          >
            <FaTv className="pf-tab__icon" />
            My Series
            <span className="pf-tab__badge pf-tab__badge--blue">{series.length}</span>
          </button>
        </div>

        {/* ── MOVIES PANEL ── */}
        {activeTab === 'movies' && (
          <div className="pf-panel">
            <div className="pf-panel__header">
              <h2 className="pf-panel__title">🎬 My Movies</h2>
              <Addmovies />
            </div>
            {movies.length === 0 ? (
              <div className="pf-empty">
                <FaFilm className="pf-empty__icon" />
                <p>No movies added yet. Add your first one above!</p>
              </div>
            ) : (
              <div className="pf-grid">
                {movies.map((item) => (
                  <div key={item._id} className="pf-card">
                    <div className="pf-card__img-wrap">
                      <img
                        src={`${serverUrl}/upload/${item.movieImg}`}
                        alt={item.title}
                        className="pf-card__img"
                      />
                      <div className="pf-card__actions">
                        <button
                          className="pf-card__action pf-card__action--edit"
                          onClick={() => setEditingMovie(item)}
                          title="Edit"
                        >
                          <FaPen />
                        </button>
                        <button
                          className="pf-card__action pf-card__action--delete"
                          onClick={() => handleDelete(item._id, 'movie')}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="pf-card__body">
                      <p className="pf-card__title">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SERIES PANEL ── */}
        {activeTab === 'series' && (
          <div className="pf-panel">
            <div className="pf-panel__header">
              <h2 className="pf-panel__title">📺 My Series</h2>
              <Addseries />
            </div>
            {series.length === 0 ? (
              <div className="pf-empty">
                <FaTv className="pf-empty__icon" />
                <p>No series added yet. Add your first one above!</p>
              </div>
            ) : (
              <div className="pf-grid">
                {series.map((item) => (
                  <div key={item._id} className="pf-card">
                    <div className="pf-card__img-wrap">
                      <img
                        src={`${serverUrl}/upload/${item.seriesImg}`}
                        alt={item.title}
                        className="pf-card__img"
                      />
                      <div className="pf-card__actions">
                        <button
                          className="pf-card__action pf-card__action--edit"
                          onClick={() => setEditingSeries(item)}
                          title="Edit"
                        >
                          <FaPen />
                        </button>
                        <button
                          className="pf-card__action pf-card__action--delete"
                          onClick={() => handleDelete(item._id, 'series')}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="pf-card__body">
                      <p className="pf-card__title">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Edit modals */}
      {editingMovie && <EditMovies movie={editingMovie} setEditingMovie={setEditingMovie} />}
      {editingSeries && <EditSeries series={editingSeries} setEditingSeries={setEditingSeries} />}

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={2000}
        hideProgressBar
        toastClassName="pf-toast"
      />
    </div>
  );
}

export default Profile;