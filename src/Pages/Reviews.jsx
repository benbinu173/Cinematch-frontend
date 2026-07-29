import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { serverUrl } from "../Services/ServerUrl";
import "./Reviews.css";

const Reviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(1);
  const currentUserId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = () => {
    axios
      .get(`${serverUrl}/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  const handleDelete = (reviewId) => {
    axios
      .delete(`${serverUrl}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchReviews())
      .catch((err) => console.error("Delete error:", err));
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditedText(review.reviewText);
    setEditedRating(review.rating);
  };

  const handleUpdate = () => {
    axios
      .put(
        `${serverUrl}/reviews/${editingId}`,
        { reviewText: editedText, rating: editedRating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setEditingId(null);
        fetchReviews();
      })
      .catch((err) => console.error("Update error:", err));
  };

  const renderStars = (rating = 0, interactive = false) => {
    const clamped = Math.max(0, Math.min(5, rating));

    if (interactive) {
      return (
        <div className="review-star-selector">
          <label>Rating</label>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`review-star-btn ${n <= editedRating ? "active" : "inactive"}`}
              onClick={() => setEditedRating(n)}
              aria-label={`Rate ${n} out of 5`}
            >
              ★
            </button>
          ))}
        </div>
      );
    }

    return (
      <p className="review-stars">
        <span className="star-filled">{"★".repeat(clamped)}</span>
        <span className="star-empty">{"★".repeat(5 - clamped)}</span>
      </p>
    );
  };

  return (
    <div className="reviews-page">
      {/* Header */}
      <div className="reviews-header">
        <h2>User <span>Reviews</span></h2>
        <p>
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
        <div className="reviews-divider" />
      </div>

      {reviews.length === 0 ? (
        <div className="reviews-empty">
          <p>No reviews yet — be the first to share your take.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              {/* Top row — username + date */}
              <div className="review-card-top">
                <p className="review-card-user">
                  {review.user?.username || "Anonymous"}
                </p>
                <span className="review-card-date">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {editingId === review._id ? (
                /* ── Edit mode ── */
                <div className="review-edit-area">
                  {renderStars(editedRating, true)}

                  <textarea
                    className="review-edit-textarea"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    placeholder="Write your review…"
                  />

                  <div className="review-edit-actions">
                    <button
                      className="review-btn review-btn-save"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                    <button
                      className="review-btn review-btn-cancel"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Read mode ── */
                <>
                  {renderStars(review.rating || 0)}
                  <p className="review-text">{review.reviewText}</p>

                  {review.user?._id === currentUserId && (
                    <>
                      <div className="review-sep" />
                      <div className="review-actions">
                        <button
                          className="review-btn review-btn-edit"
                          onClick={() => handleEdit(review)}
                        >
                          Edit
                        </button>
                        <button
                          className="review-btn review-btn-delete"
                          onClick={() => handleDelete(review._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;