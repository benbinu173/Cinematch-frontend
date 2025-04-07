import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { updateUserSeriesAPI } from '../Services/allApi';
import { editResponseContext, addResponseContext } from '../Context/ContextSharing';
import { serverUrl } from '../Services/ServerUrl';

function EditSeries({ series, setEditingSeries }) {
  const { setEditResponse } = useContext(editResponseContext);
  const { setAddResponse } = useContext(addResponseContext);

  const [key, setKey] = useState(0);
  const [preview, setPreview] = useState("");
  const [seriesDetails, setSeriesDetails] = useState({
    title: series?.title,
    year: series?.year,
    seasons: series?.seasons,
    rating: series?.rating,
    overview: series?.overview,
    seriesImg: "" // this will be File object when updated
  });

  const handleClose = () => {
    handleCancel();
    if (setEditingSeries) {
      setEditingSeries(null);
    }
  };

  const handleCancel = () => {
    setSeriesDetails({
      title: series?.title,
      year: series?.year,
      seasons: series?.seasons,
      rating: series?.rating,
      overview: series?.overview,
      seriesImg: ""
    });
    setPreview("");
    setKey(prev => prev + 1); // Force re-render to reset file input
  };

  const handleUpdate = async () => {
    const { title, year, seasons, rating, overview, seriesImg } = seriesDetails;

    if (!title || !year || !seasons || !rating || !overview) {
      toast.error("Please fill out all fields");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("title", title);
    reqBody.append("year", year);
    reqBody.append("seasons", seasons);
    reqBody.append("rating", rating);
    reqBody.append("overview", overview);

    if (preview) {
      reqBody.append("seriesImg", seriesImg); // new image
    } else {
      reqBody.append("seriesImg", series?.seriesImg); // existing image filename
    }

    const token = sessionStorage.getItem("token");
    const reqHeader = {
      "Authorization": `Bearer ${token}`
    };

    // If new image, use multipart/form-data header
    if (preview) reqHeader["Content-Type"] = "multipart/form-data";
    else reqHeader["Content-Type"] = "application/json";

    try {
      const result = await updateUserSeriesAPI(series._id, reqBody, reqHeader);
      if (result.status === 200) {
        toast.success("Series updated successfully");
        setEditResponse(result);
        setAddResponse(result);
        setTimeout(() => handleClose(), 2000);
      } else if (result.status === 406) {
        toast.warning(result.response.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSeriesDetails({ ...seriesDetails, seriesImg: file });
    }
  };

  useEffect(() => {
    if (seriesDetails.seriesImg instanceof File) {
      setPreview(URL.createObjectURL(seriesDetails.seriesImg));
    }
  }, [seriesDetails.seriesImg]);

  return (
    <Modal show={true} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Series Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col-6 mt-3">
              <label htmlFor="seriesImage">
                <input
                  key={key}
                  id="seriesImage"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
                <img
                                                   src={
                                                       preview
                                                           ? preview
                                                           : series?.seriesImg
                                                           ? `${serverUrl}/upload/${series.seriesImg}`
                                                           : "https://via.placeholder.com/300x200.png?text=No+Image"
                                                   }
                                                   className="img-fluid rounded"
                                                   alt="Movie"
                                               />
              </label>
            </div>
            <div className="col-6 mt-3">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Title"
                value={seriesDetails.title}
                onChange={(e) => setSeriesDetails({ ...seriesDetails, title: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Year"
                value={seriesDetails.year}
                onChange={(e) => setSeriesDetails({ ...seriesDetails, year: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Total Seasons"
                value={seriesDetails.seasons}
                onChange={(e) => setSeriesDetails({ ...seriesDetails, seasons: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Rating"
                value={seriesDetails.rating}
                onChange={(e) => setSeriesDetails({ ...seriesDetails, rating: e.target.value })}
              />
              <textarea
                rows={3}
                className="form-control"
                placeholder="Overview"
                value={seriesDetails.overview}
                onChange={(e) => setSeriesDetails({ ...seriesDetails, overview: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleUpdate}>Update</Button>
      </Modal.Footer>
      <ToastContainer position="top-center" theme="dark" autoClose={5000} />
    </Modal>
  );
}

export default EditSeries;
