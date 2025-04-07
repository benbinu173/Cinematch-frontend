import React, { useEffect, useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import { addMovieAPI } from '../Services/allApi';
import { addResponseContext } from '../Context/ContextSharing';
import 'react-toastify/dist/ReactToastify.css';

function Addmovies() {
  const { setAddResponse } = useContext(addResponseContext);
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [key, setKey] = useState(1);

  const [movieDetails, setmovieDetails] = useState({
    title: "",
    year: "",
    rating: "",
    overview: "",
    movieImg: "",
    tmdbId: ""
  });

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (movieDetails.movieImg) {
      setImagePreview(URL.createObjectURL(movieDetails.movieImg));
    }
  }, [movieDetails.movieImg]);

  const handleFile = (e) => {
    setmovieDetails({ ...movieDetails, movieImg: e.target.files[0] });
  };

  const handleClose = () => {
    setShow(false);
    handleCancel();
  };

  const handleCancel = () => {
    setmovieDetails({
      title: "",
      year: "",
      rating: "",
      overview: "",
      movieImg: "",
      tmdbId: ""
    });
    setImagePreview(null);
    setKey((prevKey) => (prevKey === 1 ? 0 : 1));
  };

  const handleAdd = async () => {
    const { title, year, rating, overview, movieImg, tmdbId } = movieDetails;

    if (!title || !year || !rating || !overview || !movieImg || !tmdbId) {
      toast.error("Please fill in all fields including TMDb ID");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("title", title);
    reqBody.append("year", year);
    reqBody.append("rating", rating);
    reqBody.append("overview", overview);
    reqBody.append("movieImg", movieImg);
    reqBody.append("tmdbId", tmdbId);

    if (token) {
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      };

      try {
        const result = await addMovieAPI(reqBody, reqHeader);
        if (result.status === 200) {
          toast.success("Movie added successfully");
          setTimeout(() => handleClose(), 2000);
          setAddResponse(result);
        } else {
          toast.error(result.response?.data || "Something went wrong");
          console.error("Add Movie Error:", result);
        }
      } catch (error) {
        console.error("Add Movie Catch Error:", error);
        toast.error("Error adding Movie. Please try again.");
      }
    } else {
      toast.error("No token found. Please login.");
    }
  };

  return (
    <div>
      <div className='text-center'>
        <Button onClick={() => setShow(true)} variant='primary' className='fw-bold'>
          + Add Movie
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold'>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='movie-container container'>
            <div className='row align-items-center'>
              <div className='col-md-5 text-center mb-3'>
                <label htmlFor='uploadImage' className='d-block'>
                  <input
                    id='uploadImage'
                    type='file'
                    className='d-none'
                    onChange={handleFile}
                  />
                  <img
                    src={imagePreview || "https://t4.ftcdn.net/jpg/01/64/16/59/360_F_164165971_ELxPPwdwHYEhg4vZ3F4Ej7OmZVzqq4Ov.jpg"}
                    className='img-fluid rounded-circle border shadow-sm p-2'
                    alt='Upload Preview'
                    style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                  />
                </label>
                <small className='text-muted'>Click to upload image</small>
              </div>

              <div className='col-md-7'>
                <Form>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      value={movieDetails.title}
                      onChange={(e) => setmovieDetails({ ...movieDetails, title: e.target.value })}
                      placeholder='Movie Title'
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      value={movieDetails.year}
                      onChange={(e) => setmovieDetails({ ...movieDetails, year: e.target.value })}
                      placeholder='Release Year'
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      value={movieDetails.rating}
                      onChange={(e) => setmovieDetails({ ...movieDetails, rating: e.target.value })}
                      placeholder='Your Rating'
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      value={movieDetails.tmdbId}
                      onChange={(e) => setmovieDetails({ ...movieDetails, tmdbId: e.target.value })}
                      placeholder='TMDb ID (e.g., 27205)'
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      as='textarea'
                      rows={3}
                      value={movieDetails.overview}
                      onChange={(e) => setmovieDetails({ ...movieDetails, overview: e.target.value })}
                      placeholder='Movie Overview'
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel}>Cancel</Button>
          <Button variant='success' onClick={handleAdd}>Add Movie</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position='top-center' autoClose={3000} />
    </div>
  );
}

export default Addmovies;
