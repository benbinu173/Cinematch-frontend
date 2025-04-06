// keep everything up to imports
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./tvshowdetails.css";

function TVShowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTVShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchTVShowDetails() {
      try {
        setLoading(true);
        const apiKey = "104982ca487a975dd171416b2958f849";

        const [tvShowRes, castRes, trailerRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
            params: { api_key: apiKey, language: "en-US" },
          }),
          axios.get(`https://api.themoviedb.org/3/tv/${id}/credits`, {
            params: { api_key: apiKey },
          }),
          axios.get(`https://api.themoviedb.org/3/tv/${id}/videos`, {
            params: { api_key: apiKey },
          }),
        ]);

        setTVShow(tvShowRes.data);
        setCast(castRes.data.cast.slice(0, 5));

        const trailer = trailerRes.data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (error) {
        toast.error("Failed to fetch TV show details.");
        console.error("Error fetching TV show details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTVShowDetails();
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
          tvShowId: id,
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
      navigate(`/reviews/${id}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Try again.");
    }
  };

  const handleClose = () => {
    setShow(false);
    navigate("/tvshows");
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleClose} centered size="lg" className="custom-modal">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Loading TV show details...</p>
          </div>
        ) : tvShow ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="modal-title">{tvShow.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="g-4">
                <Col md={5} className="text-center position-relative">
                  <img
                    src={
                      tvShow.poster_path
                        ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={tvShow.name}
                    className="img-fluid tvshow-poster rounded shadow-sm"
                  />
                  {trailerKey && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailerKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="play-icon"
                    >
                      <FaPlayCircle size={70} />
                    </a>
                  )}
                </Col>
                <Col md={7}>
                  <h5 className="section-title">Overview</h5>
                  <p className="text-muted">{tvShow.overview}</p>
                  <h5 className="section-title">Top Cast</h5>
                  <div className="d-flex">
                    {cast.map((actor) => (
                      <div key={actor.id} className="cast-card me-2 text-center">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                              : "https://via.placeholder.com/100"
                          }
                          alt={actor.name}
                          className="rounded-circle cast-img"
                        />
                        <p className="cast-name">{actor.name}</p>
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
                      <textarea
                        className="form-control mb-2"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here..."
                      ></textarea>
                      <button
                        className="btn btn-dark"
                        onClick={handleSubmitReview}
                        disabled={!reviewText.trim() || rating < 1}
                      >
                        Submit Review
                      </button>
                    </>
                  ) : (
                    <p className="text-danger">You must be logged in to submit a review.</p>
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
          <p className="text-center">TV show not found.</p>
        )}
      </Modal>
    </>
  );
}

export default TVShowDetails;
