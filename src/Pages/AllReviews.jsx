import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AllReviews.css";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get("http://localhost:4000/all-reviews");
        console.log("All reviews fetched: ", res.data);
        setReviews(res.data);
      } catch (error) {
        console.error("❌ Error fetching all reviews:", error.message);
        toast.error("Failed to fetch reviews.");
      }
    };

    fetchAllReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (!confirm) return;
  
    const token = sessionStorage.getItem("token"); // get the stored JWT
  
    try {
      await axios.delete(`http://localhost:4000/all-reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting review:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete the review.");
    }
  };
  

  const renderStars = (rating = 0) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">All User Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-center">No reviews available.</p>
      ) : (
        <div className="row">
          {reviews.map((review) => (
            <div key={review._id} className="col-md-6 mb-4">
              <div className="card shadow p-3">
                <h5>
                  <strong>Title:</strong> {review.title || "Unknown Title"}
                </h5>
                <h6>
                  <strong>User:</strong> {review.user?.username || "Unknown"}
                </h6>
                <p className="mb-1">
                  <strong>Review:</strong> {review.reviewText}
                </p>
                <p className="text-warning mb-1">
                  {renderStars(review.rating || 0)}
                </p>
                <p className="text-muted">
                  <small>{new Date(review.createdAt).toLocaleString()}</small>
                </p>
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReviews;
