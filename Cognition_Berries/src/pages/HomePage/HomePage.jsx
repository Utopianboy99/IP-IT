import Navbar from '../../components/Navbar/Navbar';
import './HomePage.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BaseAPI = import.meta.env.VITE_BASE_API

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    fetch(`http://${BaseAPI}:3000/courses`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: auth || "",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then(data => {
        setCourses(data);
        setError(""); // clear error if successful
      })
      .catch(err => console.error("Failed to fetch reviews:", err))
      .finally(() => setLoading(false));;
  }, []);


  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <h1>Master Stock<br />Investing with<br />Confidence</h1>
          <p>
            Cognition Berries provides beginner-friendly education on stocks and investing
            through interactive courses, expert coaching, and practical resources.
          </p>
          <div className="hero-buttons">
            <button className="btn-explore">Explore More &gt;</button>
            <button className="btn-learn">Learn More</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="image-placeholder"></div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="sec2">
        <h1>Why Choose Cognition Berries?</h1>
        <p>
          Our platform is designed to make financial education accessible, engaging, and effective for everyone.
        </p>
        <div className="reasons">
          <div className="reason-blk">
            <p>icon</p>
            <h3>Expert-Backed Content</h3>
            <p>All our resources are created by financial experts with years of experience in the stock market.</p>
          </div>
          <div className="reason-blk">
            <p>icon</p>
            <h3>Interactive Learning</h3>
            <p>Engage with quizzes, simulations, and gamified experiences that make learning enjoyable.</p>
          </div>
          <div className="reason-blk">
            <p>icon</p>
            <h3>Personalized Coaching</h3>
            <p>Get one-on-one guidance from financial coaches who understand your goals.</p>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="sec3">
        <div className="sec3-1">
          <h1>Featured Courses</h1>
          <Link to="/courses">See All Courses</Link>
        </div>
        <div className="sec3-2">
          {loading ? (
            <div className="courses-loading">Loading courses…</div>
          ) : error ? (
            <div className="courses-error">{error}</div>
          ) : courses.length === 0 ? (
            <div className="courses-empty">No courses available.</div>
          ) : (
            <div className="courses-list">
              {courses.slice(0, 3).map((course, idx) => (
                <div className="course" key={course._id || idx}>
                  <img
                    src={course.image && course.image.trim() !== "" ? course.image : "/Learnin2.jpg"}
                    alt={course.title || "Course"}
                  />
                  <h3>{course.title || course.name}</h3>
                  <p>{course.description || "No description available."}</p>
                  <div className="prce-btn">
                    <p>R{course.price}</p>
                    <button>View Course</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
