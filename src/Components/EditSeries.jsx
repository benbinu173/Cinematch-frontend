import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { updateUserMoviesAPI, updateUserSeriesAPI } from '../Services/allApi';
import { editResponseContext, addResponseContext } from '../Context/ContextSharing';
import { serverUrl } from '../Services/ServerUrl';

function EditSeries({ series, setEditingSeries }) {
  const { setEditResponse } = useContext(editResponseContext);
  const { setAddResponse } = useContext(addResponseContext);
  //   const [show, setShow] = useState(false);
  const [key, setKey] = useState(0)
  const [show, setShow] = useState(false);

  const [preview, setPreview] = useState("");
  const [seriesDetails, setSeriesDetails] = useState({
    title: series?.title,
    year: series?.year,
    seasons: series?.seasons,
    rating: series?.rating,
    overview: series?.overview,
    seriesImg: ""
  });



  const handleClose = () => {
    handleCancel(); // Reset input fields
    if (setEditingSeries) {
      setEditingSeries(null); // Properly reset the state
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
    setPreview("")

    // here we appplied the below code because while editin when we change the image the image changes and when we click on the cancel button a conflict occurs tht again whne we try to replace the image with the same img which was used the image wont be displayed hence we sent the key value as 0 and setkey value as 1
    if (key == 0) {
      setKey(1)

    }
    else {
      setKey(0)
    }
  };

  const handleUpdate = async () => {
    const { title, year, seasons, rating, overview, seriesImg } = seriesDetails
    if (!title || !year || !seasons || !rating || !overview) {
      toast.error(`fill the form completely`)
    }
    else {
      // definin rebody because it is a part of the api

      const reqBody = new FormData()
      reqBody.append("title", title)
      reqBody.append("year", year)
      reqBody.append("seasons", seasons)
      reqBody.append("rating", rating)
      //   reqBody.append("website", website)
      reqBody.append("overview", overview)
      // in the below line of code can be defined as when the image is updated reqBody.append("profileImg",profileImg) this code runs if not update the img which was ther b4 we be used itself   reqBody.append("profileImg",projects.profileImg)
      preview ? reqBody.append("seriesImg", seriesImg) : reqBody.append("seriesImg", series?.seriesImg)

      // reqheader since it is a part of the api
      const token = sessionStorage.getItem("token")

      if (preview) {
        const reqHeader = {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
        // the projects can be taken from projects._id
        const result = await updateUserSeriesAPI(series._id, reqBody, reqHeader)
        console.log(result);
        if (result.status == 200) {
          setEditResponse(result)
          toast.success(`project updated successfully`)
          //  here we added settimeout in order to close the modal after certain number of seconds
          setTimeout(() => {
            handleClose()
          }, [2000])

          setAddResponse(result)

        } else if (result.status == 406) {
          toast.warning(result.response.data)
        }
        else {
          toast.error(`something went wrong`)
        }

      }
      else {
        const reqHeader = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
        const result = await updateUserSeriesAPI(series._id, reqBody, reqHeader)
        console.log(result);

        if (result.status == 200) {
          setEditResponse(result)
          alert(`project updated successfully`)
          //  here we added settimeout in order to close the modal after certain number of seconds
          setTimeout(() => {
            handleClose()
          }, [2000])

          setAddResponse(result)

        } else if (result.status == 406) {
          toast.warning(result.response.data)
        }
        else {
          toast.error(`something went wrong`)
        }
      }
    }
  }




  const handleFile = (e) => {
    // console.log(e.target.files);
    setSeriesDetails({ ...seriesDetails, seriesImg: e.target.files[0] })

  }


  useEffect(() => {
    if (seriesDetails.seriesImg) {
      setPreview(URL.createObjectURL(seriesDetails.seriesImg))
    }
  }, [seriesDetails.seriesImg])
  return (
    <Modal show={true} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Series Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col-6 mt-3">
              <label htmlFor="movieImage">
                <input
                  key={key}
                  id="movieImage"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e)}
                />
                <img src={preview ? preview : `${serverUrl}/uploads/${series?.seriesImg}`} className="img-fluid" alt="Preview" />
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
                value={seriesDetails.seasons}
                onChange={(e) => setSeriesDetails({ ...seriesDetails, seasons: e.target.value })}
                className='form-control mb-3'
                placeholder='total seasons'
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
  )
}

export default EditSeries
