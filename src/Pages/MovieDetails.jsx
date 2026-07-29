import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { FaPlayCircle, FaStar, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MovieDetails.css";
import { serverUrl } from "../Services/ServerUrl";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (error) {
        toast.error("Failed to fetch movie details.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovieDetails();
  }, [id]);

  const handleSubmitReview = async () => {
    const token = sessionStorage.getItem("token");
    if (!reviewText.trim() || rating < 1 || rating > 5) {
      toast.error("Please enter a review and select a rating.");
      return;
    }
    if (!token) {
      toast.error("Please login to submit a review.");
      return;
    }
    try {
      await axios.post(
        `${serverUrl}/reviews`,
        { movieId: id, reviewText, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted!");
      setReviewText("");
      setRating(0);
      navigate(`/reviews/${id}`);
    } catch {
      toast.error("Failed to submit review. Try again.");
    }
  };

  const handleClose = () => navigate("/movies");

  const formatRuntime = (mins) => {
    if (!mins) return null;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const year = movie?.release_date?.slice(0, 4);
  const runtime = formatRuntime(movie?.runtime);
  const genres = movie?.genres?.map((g) => g.name).join(" · ");
  const voteAvg = movie?.vote_average?.toFixed(1);

  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />

      {/* Backdrop overlay */}
      <div className="md-backdrop" onClick={handleClose} />

      <div className="md-panel">
        {/* Gold hairline */}
        <div className="md-hairline" />

        {/* Close button */}
        <button className="md-close" onClick={handleClose} aria-label="Close">
          <FaTimes />
        </button>

        {loading ? (
          <div className="md-loading">
            <Spinner animation="border" style={{ color: "#F5C518" }} />
            <p>Loading…</p>
          </div>
        ) : movie ? (
          <div className="md-body">
            {/* ── Hero ── */}
            <div
              className="md-hero"
              style={{
                backgroundImage: movie.backdrop_path
                  ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
                  : "none",
              }}
            >
              <div className="md-hero-overlay" />
              <div className="md-hero-content">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="md-poster"
                />
                <div className="md-hero-info">
                  <h1 className="md-title">{movie.title}</h1>
                  <div className="md-meta">
                    {year && <span>{year}</span>}
                    {runtime && <><span className="md-dot">·</span><span>{runtime}</span></>}
                    {genres && <><span className="md-dot">·</span><span>{genres}</span></>}
                  </div>
                  {voteAvg && (
                    <div className="md-score">
                      <FaStar className="md-star-icon" />
                      <span className="md-score-val">{voteAvg}</span>
                      <span className="md-score-max">/ 10</span>
                      {movie.vote_count && (
                        <span className="md-vote-count">
                          ({movie.vote_count.toLocaleString()} votes)
                        </span>
                      )}
                    </div>
                  )}
                  {trailerKey && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailerKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md-trailer-btn"
                    >
                      <FaPlayCircle />
                      Watch Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── Details body ── */}
            <div className="md-details">
              {/* Overview */}
              <section className="md-section">
                <h2 className="md-section-label">Overview</h2>
                <p className="md-overview">{movie.overview}</p>
              </section>

              {/* Cast */}
              {cast.length > 0 && (
                <section className="md-section">
                  <h2 className="md-section-label">Top Cast</h2>
                  <div className="md-cast">
                    {cast.map((actor) => (
                      <div key={actor.id} className="md-cast-card">
                        <div className="md-cast-img-wrap">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                : "https://via.placeholder.com/80x80?text=?"
                            }
                            alt={actor.name}
                            className="md-cast-img"
                          />
                        </div>
                        <p className="md-cast-name">{actor.name}</p>
                        {actor.character && (
                          <p className="md-cast-char">{actor.character}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Review */}
              <section className="md-section">
                <h2 className="md-section-label">Leave a Review</h2>
                {sessionStorage.getItem("token") ? (
                  <div className="md-review-form">
                    {/* Star picker */}
                    <div className="md-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar
                          key={s}
                          className={`md-star ${s <= (hoverRating || rating) ? "md-star--active" : ""}`}
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                      {rating > 0 && (
                        <span className="md-rating-label">{rating} / 5</span>
                      )}
                    </div>

                    <textarea
                      className="md-textarea"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="What did you think?"
                    />

                    <button className="md-submit-btn" onClick={handleSubmitReview}>
                      Submit Review
                    </button>
                  </div>
                ) : (
                  <p className="md-login-prompt">
                    <span className="md-login-accent">Sign in</span> to leave a review.
                  </p>
                )}
              </section>
            </div>
          </div>
        ) : (
          <p className="md-loading">Movie not found.</p>
        )}
      </div>
    </>
  );
}

export default MovieDetails;