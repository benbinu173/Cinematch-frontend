import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { updateUserMoviesAPI } from '../Services/allApi';
import { editResponseContext , addResponseContext } from '../Context/ContextSharing';
import { serverUrl } from '../Services/ServerUrl';

function EditMovies({ movie, setEditingMovie }) {
    const { setEditResponse } = useContext(editResponseContext);
    const { setAddResponse } = useContext(addResponseContext); 
    //   const [show, setShow] = useState(false);
    const [key, setKey] = useState(0)
    const [show, setShow] = useState(false);

    const [preview, setPreview] = useState("");
    const [movieDetails, setMovieDetails] = useState({
        title: movie?.title,
        year: movie?.year,
        rating: movie?.rating,
        overview: movie?.overview,
        movieImg: ""
    });

    

    const handleClose = () => {
        handleCancel(); // Reset input fields
        if (setEditingMovie) {
            setEditingMovie(null); // Properly reset the state
        }
    };

    const handleCancel = () => {
        setMovieDetails({
            title: movie?.title,
            year: movie?.year,
            rating: movie?.rating,
            overview: movie?.overview,
            movieImg: ""
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
        const { title, year, rating, overview, movieImg } = movieDetails
        if (!title || !year || !rating || !overview) {
          toast.error(`fill the form completely`)
        }
        else {
          // definin rebody because it is a part of the api
    
          const reqBody = new FormData()
          reqBody.append("title", title)
          reqBody.append("year", year)
          reqBody.append("rating", rating)
        //   reqBody.append("website", website)
          reqBody.append("overview", overview)
          // in the below line of code can be defined as when the image is updated reqBody.append("profileImg",profileImg) this code runs if not update the img which was ther b4 we be used itself   reqBody.append("profileImg",projects.profileImg)
          preview ? reqBody.append("movieImg", movieImg) :  reqBody.append("movieImg", movie?.movieImg)
    
          // reqheader since it is a part of the api
          const token = sessionStorage.getItem("token")

          if (preview) {
            const reqHeader = {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${token}`
            }
            // the projects can be taken from projects._id
            const result = await updateUserMoviesAPI(movie._id, reqBody, reqHeader)
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
            const result = await updateUserMoviesAPI(movie._id, reqBody, reqHeader)
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
        setMovieDetails({ ...movieDetails, movieImg: e.target.files[0] })
    
      }

    
  useEffect(() => {
    if (movieDetails.movieImg) {
      setPreview(URL.createObjectURL(movieDetails.movieImg))
    }
  }, [movieDetails.movieImg])

    return (
        <Modal show={true} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update Movie Details</Modal.Title>
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
                                <img src={preview ? preview : `${serverUrl}/uploads/${movie?.movieImg}`} className="img-fluid" alt="Preview" />
                            </label>
                        </div>
                        <div className="col-6 mt-3">
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Title"
                                value={movieDetails.title}
                                onChange={(e) => setMovieDetails({ ...movieDetails, title: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Year"
                                value={movieDetails.year}
                                onChange={(e) => setMovieDetails({ ...movieDetails, year: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Rating"
                                value={movieDetails.rating}
                                onChange={(e) => setMovieDetails({ ...movieDetails, rating: e.target.value })}
                            />
                            <textarea
                                rows={3}
                                className="form-control"
                                placeholder="Overview"
                                value={movieDetails.overview}
                                onChange={(e) => setMovieDetails({ ...movieDetails, overview: e.target.value })}
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

export default EditMovies;
