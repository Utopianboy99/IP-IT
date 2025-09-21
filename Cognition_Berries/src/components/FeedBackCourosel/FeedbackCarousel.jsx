import { useState, useEffect, useRef } from "react";
import "./FeedbackCarousel.css";

function FeedbackCarousel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // Fetch reviews from backend with Basic Auth
  useEffect(() => {
    const Base_API = import.meta.env.VITE_BASE_API
    const fetchReviews = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.error("No user in localStorage");
          return;
        }

        // Build Basic Auth header
        const authHeader = "Basic " + btoa(`${user.email}:${user.password}`);

        const res = await fetch(`http://${Base_API}:3000/reviews`, {
          headers: {
            Authorization: authHeader,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch reviews:", res.status);
          return;
        }

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  // Automatic carousel effect
  useEffect(() => {
    if (reviews.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 3 >= reviews.length ? 0 : prev + 1
      );
    }, 5000); 

    return () => clearInterval(intervalRef.current);
  }, [reviews]);

  const prevReview = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(reviews.length - 3, 0) : prev - 1
    );
  };

  const nextReview = () => {
    setCurrentIndex((prev) =>
      prev + 3 >= reviews.length ? 0 : prev + 1
    );
  };

  // Generate star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  // Guard against empty reviews OR failed fetch
  if (!reviews || reviews.length === 0) return <p>No reviews available.</p>;

  // Get 3 reviews to display, wrap around if needed
  const visibleReviews = [];
  for (let i = 0; i < 3; i++) {
    const idx = (currentIndex + i) % reviews.length;
    visibleReviews.push(reviews[idx]);
  }

  return (
    <div className="feedback-container">
      <h2>User Feedback</h2>

      <div className="review-list">
        {visibleReviews.map((review, idx) => (
          <div className="review-card" key={idx}>
            <div className="stars">{renderStars(review.rating)}</div>
            <p className="comment">"{review.comment}"</p>
            <div className="reviewer">
              <strong>{review.name}</strong>
              <p>{review.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-buttons">
        <button onClick={prevReview}>&lt;</button>
        <button onClick={nextReview}>&gt;</button>
      </div>
    </div>
  );
}

export default FeedbackCarousel;
