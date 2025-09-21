import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import TiltedCard from "../../components/TiltedCard/TiltedCard";
import "./Course.css";
import Footer from "../../components/Footer/Footer";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState("All");
  const [loading, setLoading] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");


  useEffect(() => {
    const BaseAPI = process.env.BASE_API
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.error("No user found in localStorage");
          setCourses([]);
          return;
        }

        // Build Basic Auth header
        const authHeader = "Basic " + btoa(`${user.email}:${user.password}`);

        const res = await fetch(`http://${BaseAPI}t:3000/courses`, {
          headers: {
            Authorization: authHeader,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch courses:", res.status);
          setCourses([]);
          return;
        }

        const data = await res.json();
        // backend returns an array, not { courses: [] }
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter logic
  const filteredCourses = courses
    .filter((course) => {
      // Search filter
      if (
        searchTerm &&
        !course.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (
        selectedCategory !== "All Categories" &&
        course.category !== selectedCategory
      ) {
        return false;
      }

      // Level filter
      if (
        selectedLevel !== "All Levels" &&
        course.level !== selectedLevel
      ) {
        return false;
      }

      // Price filter
      if (selectedPrice === "free") return course.price === 0;
      if (selectedPrice === "paid") return course.price > 0;
      if (selectedPrice === "subscription")
        return course.priceType === "subscription";

      return true;
    });

  // --- sorting logic stays the same ---
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (filters === "popular") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (filters === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (filters === "low-high") {
      return (a.price || 0) - (b.price || 0);
    }
    if (filters === "high-low") {
      return (b.price || 0) - (a.price || 0);
    }
    return 0;
  });



  return (
    <>
      <Navbar />
      <div className="part1">

        <h1>Our Courses</h1>
        <p>
          Explore our diverse range of courses designed to enhance your financial
          literacy and investing skills.
        </p>
      </div>
      <div className="part2">

        <h2>
          Explore Our Comprehensive Range of Financial Literacy Courses Tailored
          for You
        </h2>
        <div className="part2-1">
          <div>
            <img src="/Learning.jpg" alt="" className="crs-img" />
            <h3>Choose Your Learning Path: Beginner or Intermediate Courses Available</h3>
            <p>Our courses are designed to empower you with essential financial skills.</p>
            <Link>
              <button>Enroll {" >"}</button>
            </Link>
          </div>
          <div>
            <img src="/Learning.jpg" alt="" className="crs-img" />
            <h3>Engaging Content and Interactive Learning Experience Await You</h3>
            <p>Dive into our engaging modules that make learning fun and effective.</p>
            <Link>
              <button>Enroll {" >"}</button>
            </Link>
          </div>
          <div>
            <img src="/Learning.jpg" alt="" className="crs-img" />
            <h3>Track Your Progress and Achieve Your Financial Goals with Us</h3>
            <p>Stay motivated as you monitor your learning journey and accomplishments.</p>
            <Link>
              <button>Enroll {" >"}</button>
            </Link>
          </div>
        </div>
      </div>

      <section className="course-display">
        <div>
          <div>
            <h1>Courses</h1>
            <p>Explore our engaging financial literacy courses today!</p>
          </div>
          <select
            name="filter"
            id="filter-drp-dwm"
            value={filters}
            onChange={(e) => setFilters(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="low-high">Price: Lowest to Highest</option>
            <option value="high-low">Price: Highest to Lowest</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          <aside style={{ minWidth: "300px" }}>
            <input
              type="text"
              placeholder="Search Courses"
              id="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <h2>Filter</h2>
            <hr />
            <select
              name="Categories"
              id="Categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              <option value="Fundamentals">Fundamentals</option>
              <option value="Technical Analysis">Technical Analysis</option>
              <option value="Value Investing">Value Investing</option>
              <option value="Portfolio Management">Portfolio Management</option>
            </select>
            <hr />
            <select
              name="Experience-Levels"
              id="Experience-Levels"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="All Levels">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <hr />
            <div className="dropdown-radio">
              <label htmlFor="price-dropdown">Price</label>
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => setShowPriceDropdown((prev) => !prev)}
                >
                  Select Price
                </button>
                {showPriceDropdown && (
                  <div className="dropdown-menu">
                    <label>
                      <input
                        type="radio"
                        name="price"
                        value="free"
                        checked={selectedPrice === "free"}
                        onChange={() => setSelectedPrice("free")}
                      />
                      Free
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="price"
                        value="paid"
                        checked={selectedPrice === "paid"}
                        onChange={() => setSelectedPrice("paid")}
                      />
                      Paid
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="price"
                        value="subscription"
                        checked={selectedPrice === "subscription"}
                        onChange={() => setSelectedPrice("subscription")}
                      />
                      Subscription
                    </label>
                  </div>
                )}
              </div>
            </div>
          </aside>
          <div style={{ flex: 1 }}>
            {loading ? (
              <p>Loading courses...</p>
            ) : sortedCourses.length > 0 ? (
              sortedCourses.map((course, i) => (
                <TiltedCard
                  key={i}
                  imageSrc={course.image || "https://via.placeholder.com/400x250"}
                  altText={course.title}
                  captionText={course.title}
                  containerHeight="340px"
                  containerWidth="100%"
                  imageHeight="220px"
                  imageWidth="100%"
                  rotateAmplitude={10}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="course-overlay">
                      <div className="course-level">{course.level || "Beginner"}</div>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>

                      <div className="course-meta">
                        <span>⭐ {course.rating || "4.5"} ({course.reviews || 120})</span>
                        <span>📚 {course.lessons || 20} lessons</span>
                        <span>👨‍🎓 {course.students || 1000} students</span>
                      </div>

                      <p className="price">${course.price}</p>
                    </div>
                  }
                />
              ))
            ) : (
              <p>No courses available.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default CoursesPage;
