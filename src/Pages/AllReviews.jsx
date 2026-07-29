import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AllReviews.css";
import api from "../Services/axios";
import { serverUrl } from "../Services/ServerUrl";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await api.get(`${serverUrl}/all-reviews`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching all reviews:", error.message);
        toast.error("Failed to fetch reviews.");
      }
    };

    fetchAllReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("Delete this review? This cannot be undone.");
    if (!confirmed) return;

    const token = sessionStorage.getItem("token");

    try {
      await api.delete(`${serverUrl}/all-reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted.");
    } catch (err) {
      console.error("Error deleting review:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete the review.");
    }
  };

  const renderStars = (rating = 0) => {
    const filled = Math.max(0, Math.min(5, rating));
    return (
      <>
        {"★".repeat(filled)}
        <span className="star-empty">{"★".repeat(5 - filled)}</span>
      </>
    );
  };

  return (
    <div className="allreviews-page">
      <ToastContainer position="top-center" theme="dark" autoClose={3000} />

      {/* Header */}
      <div className="allreviews-header">
        <h2>All User <span>Reviews</span></h2>
        <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"} total</p>
        <div className="allreviews-divider" />
      </div>

      {reviews.length === 0 ? (
        <div className="allreviews-empty">
          <p>No reviews have been submitted yet.</p>
        </div>
      ) : (
        <div className="allreviews-grid">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              {/* Movie title */}
              <p className="review-card-title">
                {review.title || "Unknown Title"}
              </p>

              {/* Meta */}
              <div className="review-card-meta">
                <span className="review-card-user">
                  {review.user?.username || "Unknown"}
                </span>
                <span className="review-card-date">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Stars */}
              <p className="review-card-stars">
                {renderStars(review.rating || 0)}
              </p>

              {/* Review text */}
              <p className="review-card-text">{review.reviewText}</p>

              <div className="review-card-sep" />

              {/* Delete */}
              <button
                className="review-delete-btn"
                onClick={() => handleDelete(review._id)}
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReviews;