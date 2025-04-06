import React, { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import { addSeriesAPI } from '../Services/allApi';
import { addResponseContext } from '../Context/ContextSharing';
import 'react-toastify/dist/ReactToastify.css';

function AddSeries() {
  const { setAddResponse } = useContext(addResponseContext);
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [key, setKey] = useState(1);

  const [seriesDetails, setSeriesDetails] = useState({
    title: "",
    year: "",
    seasons: "",
    rating: "",
    overview: "",
    seriesImg: ""
  });

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (seriesDetails.seriesImg) {
      setImagePreview(URL.createObjectURL(seriesDetails.seriesImg));
    }
  }, [seriesDetails.seriesImg]);

  const handleFile = (e) => {
    setSeriesDetails({ ...seriesDetails, seriesImg: e.target.files[0] });
  };

  const handleClose = () => {
    setShow(false);
    handleCancel();
  };

  const handleCancel = () => {
    setSeriesDetails({
      title: "",
      year: "",
      seasons: "",
      rating: "",
      overview: "",
      seriesImg: ""
    });
    setImagePreview(null);
    setKey((prevKey) => (prevKey === 1 ? 0 : 1));
  };

  const handleAdd = async () => {
    const { title, year, seasons, rating, overview, seriesImg } = seriesDetails;

    if (!title || !year || !seasons || !rating || !overview || !seriesImg) {
      toast.error("Please fill in all fields");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("title", title);
    reqBody.append("year", year);
    reqBody.append("seasons", seasons);
    reqBody.append("rating", rating);
    reqBody.append("overview", overview);
    reqBody.append("seriesImg", seriesImg);

    if (token) {
      const reqHeader = {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      };

      try {
        const result = await addSeriesAPI(reqBody, reqHeader);
        if (result.status === 200) {
          toast.success("Series added successfully");
          setTimeout(() => handleClose(), 2000);
          setAddResponse(result);
        } else {
          toast.error(result.response?.data || "Something went wrong");
        }
      } catch (error) {
        toast.error("Error adding Series. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className='text-center'>
        <Button onClick={() => setShow(true)} variant='primary' className='fw-bold'>
          + Add Series
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold'>Add Series</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='container'>
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
                      value={seriesDetails.title}
                      onChange={(e) => setSeriesDetails({ ...seriesDetails, title: e.target.value })}
                      placeholder='Series Title'
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      value={seriesDetails.year}
                      onChange={(e) => setSeriesDetails({ ...seriesDetails, year: e.target.value })}
                      placeholder='Release Year'
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      value={seriesDetails.seasons}
                      onChange={(e) => setSeriesDetails({ ...seriesDetails, seasons: e.target.value })}
                      placeholder='Total Seasons'
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      value={seriesDetails.rating}
                      onChange={(e) => setSeriesDetails({ ...seriesDetails, rating: e.target.value })}
                      placeholder='Your Rating'
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      as='textarea'
                      rows={3}
                      value={seriesDetails.overview}
                      onChange={(e) => setSeriesDetails({ ...seriesDetails, overview: e.target.value })}
                      placeholder='Series Overview'
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel}>Cancel</Button>
          <Button variant='success' onClick={handleAdd}>Add Series</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position='top-center' autoClose={3000} />
    </div>
  );
}

export default AddSeries;
