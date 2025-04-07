import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Addmovies from '../Components/Addmovies';
import Addseries from '../Components/Addseries';
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { deleteUserMoviesAPI, deleteUserSeriesAPI, getUserMoviesAPI, getUserSeriesAPI } from '../Services/allApi';
import { addResponseContext, editResponseContext } from '../Context/ContextSharing';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditMovies from '../Components/EditMovies';
import EditSeries from '../Components/EditSeries';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("token");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const { addResponse } = useContext(addResponseContext);
  const [removeStatus, setRemoveStatus] = useState({});
  const { editResponse } = useContext(editResponseContext);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingSeries, setEditingSeries] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("existingUser"));
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
    if (isLoggedIn) {
      try {
        const token = sessionStorage.getItem('token');
        const reqHeader = { Authorization: `Bearer ${token}` };
        const result = await getUserMoviesAPI(reqHeader);
        if (result?.data) setMovies(result.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
  };

  const getUserSeries = async () => {
    if (isLoggedIn) {
      try {
        const token = sessionStorage.getItem('token');
        const reqHeader = { Authorization: `Bearer ${token}` };
        const result = await getUserSeriesAPI(reqHeader);
        if (result?.data) setSeries(result.data);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    }
  };

  const handleDelete = async (id, type) => {
    if (isLoggedIn) {
      const token = sessionStorage.getItem('token');
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = type === 'movie' ? await deleteUserMoviesAPI(id, reqHeader) : await deleteUserSeriesAPI(id, reqHeader);
      if (result.status === 200) {
        toast.success(`${type === 'movie' ? 'Movie' : 'Series'} deleted successfully`);
        setRemoveStatus(result);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="profilebg profile-container container-fluid">
      {isLoggedIn ? (
        <div className="card profile-card shadow-lg p-4 mx-auto text-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
          <FaUserCircle size={80} className="text-primary mb-3" />
          <h2 className="fw-bold">Your Profile</h2>
          <p className="text-muted">Manage your account information</p>
          <p><strong>Name:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="text-center mt-5">
          <h3 className="text-danger fw-bold">Access Denied</h3>
          <p className="text-muted">You must be logged in to view your profile.</p>
          <Link to="/login" className="btn btn-warning mt-3">Login Here</Link>
        </div>
      )}

      <div className="row mt-5">
        {isLoggedIn && [
          { title: "🎬 My Movies", data: movies, addComponent: <Addmovies />, setEditing: setEditingMovie },
          { title: "📺 My Series", data: series, addComponent: <Addseries />, setEditing: setEditingSeries }
        ].map(({ title, data, addComponent, setEditing }, idx) => (
          <div key={idx} className="col-md-6">
            <div className="border shadow-sm p-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
              <h4 className="fw-bold text-center">{title}</h4>
              {addComponent}
              <div className="row mt-4">
                {data.map(item => (
                  <div key={item._id} className="col-md-6 mb-3">
                    <div className="card shadow-sm small-card" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', width: '180px', height: '260px' }}>
                      <img src={`http://localhost:4000/upload/${item.movieImg || item.seriesImg}`} className="card-img-top" style={{ height: '120px', objectFit: 'cover' }} alt={item.title} />
                      <div className="card-body text-center p-2">
                        <h6 className="card-title text-truncate">{item?.title}</h6>
                        <div className="d-flex justify-content-center gap-2">
                          <AiFillEdit className="text-primary edit-icon" onClick={() => setEditing(item)} />
                          <AiFillDelete className="text-danger delete-icon" onClick={() => handleDelete(item._id, idx === 0 ? 'movie' : 'series')} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Conditionally render the editors outside the loop */}
      {editingMovie && <EditMovies movie={editingMovie} setEditingMovie={setEditingMovie} />}
      {editingSeries && <EditSeries series={editingSeries} setEditingSeries={setEditingSeries} />}

      <ToastContainer />
    </div>
  );
}

export default Profile;
