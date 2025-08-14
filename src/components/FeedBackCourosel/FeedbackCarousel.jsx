// FeedbackCarousel.jsx
import { useState, useEffect } from "react";
import "./FeedbackCarousel.css";

function FeedbackCarousel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch reviews from backend
  useEffect(() => {
    fetch("http://localhost:3000/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  }, []);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Generate star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  if (reviews.length === 0) return <p>Loading reviews...</p>;

  return (
    <div className="feedback-container">
      <h2>User Feedback</h2>
      <p className="sub-text">
        Cognition Berries transformed my understanding of finance!
      </p>

      <div className="review-card">
        <div className="stars">{renderStars(reviews[currentIndex].rating)}</div>
        <p className="comment">"{reviews[currentIndex].comment}"</p>
        <div className="reviewer">
          <strong>{reviews[currentIndex].name}</strong>
          <p>{reviews[currentIndex].role}</p>
        </div>
      </div>

      <div className="nav-buttons">
        <button onClick={prevReview}>&lt;</button>
        <button onClick={nextReview}>&gt;</button>
      </div>
    </div>
  );
}

export default FeedbackCarousel;
