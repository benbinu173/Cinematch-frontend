import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { serverUrl } from "../Services/ServerUrl";

const Reviews = () => {
  const { id } = useParams(); // 🔄 Unified param
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
      .then((response) => setReviews(response.data))
      .catch((error) => console.error("Error fetching reviews:", error));
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${serverUrl}/reviews/${id}`, {
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Reviews</h2>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="p-3 mb-3 border rounded shadow-sm">
            <strong>{review.user?.username || "Anonymous"}</strong>

            <div className="text-warning mb-1" style={{ fontSize: "1.2rem" }}>
              {renderStars(review.rating || 0)}
            </div>

            {editingId === review._id ? (
              <>
                <textarea
                  className="form-control mb-2"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  min={1}
                  max={5}
                  value={editedRating}
                  onChange={(e) => setEditedRating(Number(e.target.value))}
                />
                <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="mb-1">{review.reviewText}</p>
                <small className="text-muted">
                  {new Date(review.createdAt).toLocaleString()}
                </small>

                {review.user?._id === currentUserId && (
  <div className="mt-2">
    <button
      className="btn btn-primary btn-sm me-2"
      onClick={() => handleEdit(review)}
    >
      Edit
    </button>
    <button
      className="btn btn-danger btn-sm"
      onClick={() => handleDelete(review._id)}
    >
      Delete
    </button>
  </div>
)}

              </>
            )}
          </div>
        ))
      ) : (
        <p>No reviews yet for this item.</p>
      )}
    </div>
  );
};

export default Reviews;
