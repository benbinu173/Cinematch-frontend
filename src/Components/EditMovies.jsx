import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { updateUserMoviesAPI } from '../Services/allApi';
import { editResponseContext, addResponseContext } from '../Context/ContextSharing';
import { serverUrl } from '../Services/ServerUrl';

function EditMovies({ movie, setEditingMovie }) {
    const { setEditResponse } = useContext(editResponseContext);
    const { setAddResponse } = useContext(addResponseContext);

    const [key, setKey] = useState(0);
    const [preview, setPreview] = useState("");

    const [movieDetails, setMovieDetails] = useState({
        title: "",
        year: "",
        rating: "",
        overview: "",
        movieImg: null
    });

    // ✅ Update form state when `movie` prop changes
    useEffect(() => {
        if (movie) {
            setMovieDetails({
                title: movie.title || "",
                year: movie.year || "",
                rating: movie.rating || "",
                overview: movie.overview || "",
                movieImg: null
            });

            setPreview("");
            setKey(prev => prev + 1); // reset file input
        }
    }, [movie]);

    const handleClose = () => {
        handleCancel();
        if (setEditingMovie) setEditingMovie(null);
    };

    const handleCancel = () => {
        setMovieDetails({
            title: movie?.title || "",
            year: movie?.year || "",
            rating: movie?.rating || "",
            overview: movie?.overview || "",
            movieImg: null
        });
        setPreview("");
        setKey(prev => prev + 1);
    };

    const handleUpdate = async () => {
        const { title, year, rating, overview, movieImg } = movieDetails;

        if (!title || !year || !rating || !overview) {
            toast.error("Please fill out the entire form.");
            return;
        }

        const reqBody = new FormData();
        reqBody.append("title", title);
        reqBody.append("year", year);
        reqBody.append("rating", rating);
        reqBody.append("overview", overview);

        if (movieImg instanceof File) {
            reqBody.append("movieImg", movieImg);
        }

        const token = sessionStorage.getItem("token");
        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };

        try {
            const result = await updateUserMoviesAPI(movie._id, reqBody, reqHeader);

            if (result.status === 200) {
                setEditResponse(result);
                setAddResponse(result);
                toast.success("Movie updated successfully!");

                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else if (result.status === 406) {
                toast.warning(result.response.data);
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Server error during update.");
        }
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMovieDetails({ ...movieDetails, movieImg: file });
        }
    };

    useEffect(() => {
        if (movieDetails.movieImg instanceof File) {
            const objectUrl = URL.createObjectURL(movieDetails.movieImg);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview("");
        }
    }, [movieDetails.movieImg]);

    return (
        <Modal show={true} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update Movie Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col-6 mt-3">
                            <label htmlFor="movieImage" style={{ cursor: "pointer" }}>
                                <input
                                    key={key}
                                    id="movieImage"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleFile}
                                />
                                <img
                                    src={
                                        preview
                                            ? preview
                                            : movie?.movieImg
                                            ? `${serverUrl}/upload/${movie.movieImg}`
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
