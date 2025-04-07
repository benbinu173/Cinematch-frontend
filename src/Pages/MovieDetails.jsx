import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Row, Col, Spinner, Button, Form } from "react-bootstrap";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        const apiKey = "104982ca487a975dd171416b2958f849";

        const [movieRes, castRes, trailerRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: { api_key: apiKey, language: "en-US" },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
            params: { api_key: apiKey },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
            params: { api_key: apiKey },
          }),
        ]);

        setMovie(movieRes.data);
        setCast(castRes.data.cast.slice(0, 5));

        const trailer = trailerRes.data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (error) {
        toast.error("Failed to fetch movie details.");
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  const handleSubmitReview = async () => {
    const token = sessionStorage.getItem("token");

    if (!reviewText.trim() || rating < 1 || rating > 5) {
      toast.error("Please enter a review and select a rating between 1 and 5.");
      return;
    }

    if (!token) {
      toast.error("Please login to submit a review.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/reviews",
        {
          movieId: id,
          reviewText,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review submitted successfully!");
      setReviewText("");
      setRating(0);

      // ✅ Navigate to Reviews page for the specific movie
      navigate(`/reviews/${id}`);

    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Try again.");
    }
  };

  const handleClose = () => {
    setShow(false);
    navigate("/movies");
  };

  return (
    <>
      <ToastContainer />
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className="custom-modal"
      >
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Loading movie details...</p>
          </div>
        ) : movie ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="modal-title">{movie.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="g-4">
                <Col xs={12} md={5} className="text-center position-relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="img-fluid movie-poster rounded shadow-sm"
                  />
                  {trailerKey && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailerKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="play-icon d-block mt-2"
                    >
                      <FaPlayCircle size={50} className="text-danger" />
                      <p className="small mt-1">Watch Trailer</p>
                    </a>
                  )}
                </Col>

                <Col xs={12} md={7}>
                  <h5 className="section-title">Overview</h5>
                  <p className="text-muted">{movie.overview}</p>

                  <h5 className="section-title">Top Cast</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {cast.map((actor) => (
                      <div
                        key={actor.id}
                        className="text-center"
                        style={{ width: "80px" }}
                      >
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                              : "https://via.placeholder.com/80"
                          }
                          alt={actor.name}
                          className="rounded-circle cast-img img-fluid"
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                        <p className="small mt-1">{actor.name}</p>
                      </div>
                    ))}
                  </div>

                  <h5 className="section-title mt-4">Submit a Review</h5>
                  {sessionStorage.getItem("token") ? (
                    <>
                      <Form.Group className="mb-2">
                        <Form.Label>Star Rating</Form.Label>
                        <Form.Select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value={0}>Select rating</option>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                              {star} Star{star > 1 ? "s" : ""}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Write your review here..."
                        />
                      </Form.Group>
                      <Button variant="dark" onClick={handleSubmitReview}>
                        Submit Review
                      </Button>
                    </>
                  ) : (
                    <p className="text-danger">
                      You must be logged in to submit a review.
                    </p>
                  )}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <p className="text-center">Movie not found.</p>
        )}
      </Modal>
    </>
  );
}

export default MovieDetails;
