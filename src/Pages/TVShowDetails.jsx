import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { FaPlayCircle, FaStar, FaTimes, FaTv } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./tvshowdetails.css";
import { serverUrl } from "../Services/ServerUrl";

function TVShowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTVShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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
          (v) => v.type === "Trailer" && v.site === "YouTube"
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
        { tvShowId: id, reviewText, rating },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleClose = () => navigate("/tvshows");

  // Derived display values
  const firstAirYear = tvShow?.first_air_date?.slice(0, 4);
  const seasons = tvShow?.number_of_seasons;
  const episodes = tvShow?.number_of_episodes;
  const genres = tvShow?.genres?.map((g) => g.name).join(" · ");
  const voteAvg = tvShow?.vote_average?.toFixed(1);
  const status = tvShow?.status;

  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />

      {/* Backdrop dim */}
      <div className="tvd-backdrop" onClick={handleClose} />

      <div className="tvd-panel">
        {/* Blue hairline — TV-specific accent per design system */}
        <div className="tvd-hairline" />

        {/* Close */}
        <button className="tvd-close" onClick={handleClose} aria-label="Close">
          <FaTimes />
        </button>

        {loading ? (
          <div className="tvd-loading">
            <Spinner animation="border" style={{ color: "#3B82F6" }} />
            <p>Loading details…</p>
          </div>
        ) : tvShow ? (
          <div className="tvd-body">

            {/* ── Hero ── */}
            <div
              className="tvd-hero"
              style={{
                backgroundImage: tvShow.backdrop_path
                  ? `url(https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path})`
                  : "none",
              }}
            >
              <div className="tvd-hero-overlay" />
              <div className="tvd-hero-content">
                <img
                  src={
                    tvShow.poster_path
                      ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                      : "https://via.placeholder.com/110x165?text=?"
                  }
                  alt={tvShow.name}
                  className="tvd-poster"
                />
                <div className="tvd-hero-info">
                  {/* TV badge */}
                  <span className="tvd-badge">
                    <FaTv style={{ fontSize: "0.65rem" }} /> TV Series
                  </span>

                  <h1 className="tvd-title">{tvShow.name}</h1>

                  <div className="tvd-meta">
                    {firstAirYear && <span>{firstAirYear}</span>}
                    {seasons && (
                      <>
                        <span className="tvd-dot">·</span>
                        <span>{seasons} Season{seasons !== 1 ? "s" : ""}</span>
                      </>
                    )}
                    {episodes && (
                      <>
                        <span className="tvd-dot">·</span>
                        <span>{episodes} Episodes</span>
                      </>
                    )}
                    {status && (
                      <>
                        <span className="tvd-dot">·</span>
                        <span className={`tvd-status ${status === "Returning Series" ? "tvd-status--live" : ""}`}>
                          {status}
                        </span>
                      </>
                    )}
                  </div>

                  {genres && <p className="tvd-genres">{genres}</p>}

                  {voteAvg && (
                    <div className="tvd-score">
                      <FaStar className="tvd-star-icon" />
                      <span className="tvd-score-val">{voteAvg}</span>
                      <span className="tvd-score-max">/ 10</span>
                      {tvShow.vote_count && (
                        <span className="tvd-vote-count">
                          ({tvShow.vote_count.toLocaleString()} votes)
                        </span>
                      )}
                    </div>
                  )}

                  {trailerKey && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailerKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tvd-trailer-btn"
                    >
                      <FaPlayCircle />
                      Watch Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── Details ── */}
            <div className="tvd-details">

              {/* Overview */}
              <section className="tvd-section">
                <h2 className="tvd-section-label">Overview</h2>
                <p className="tvd-overview">{tvShow.overview}</p>
              </section>

              {/* Cast */}
              {cast.length > 0 && (
                <section className="tvd-section">
                  <h2 className="tvd-section-label">Top Cast</h2>
                  <div className="tvd-cast">
                    {cast.map((actor) => (
                      <div key={actor.id} className="tvd-cast-card">
                        <div className="tvd-cast-img-wrap">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                : "https://via.placeholder.com/80x80?text=?"
                            }
                            alt={actor.name}
                            className="tvd-cast-img"
                          />
                        </div>
                        <p className="tvd-cast-name">{actor.name}</p>
                        {actor.character && (
                          <p className="tvd-cast-char">{actor.character}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Review */}
              <section className="tvd-section">
                <h2 className="tvd-section-label">Leave a Review</h2>
                {sessionStorage.getItem("token") ? (
                  <div className="tvd-review-form">
                    <div className="tvd-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar
                          key={s}
                          className={`tvd-star ${s <= (hoverRating || rating) ? "tvd-star--active" : ""}`}
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                      {rating > 0 && (
                        <span className="tvd-rating-label">{rating} / 5</span>
                      )}
                    </div>

                    <textarea
                      className="tvd-textarea"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="What did you think of this show?"
                    />

                    <button
                      className="tvd-submit-btn"
                      onClick={handleSubmitReview}
                      disabled={!reviewText.trim() || rating < 1}
                    >
                      Submit Review
                    </button>
                  </div>
                ) : (
                  <p className="tvd-login-prompt">
                    <span className="tvd-login-accent">Sign in</span> to leave a review.
                  </p>
                )}
              </section>

            </div>
          </div>
        ) : (
          <p className="tvd-loading">TV show not found.</p>
        )}
      </div>
    </>
  );
}

export default TVShowDetails;