import "./UserDashboard.css";
import { FiShoppingBag, FiBook, FiAward, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: user.name,
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Cognitive Skills Learner",
    points: 1200,
  };

  return (
    <div className="dashboard-container">
      {/* Left Column - Profile */}
      <div className="dashboard-left">
        <div className="profile-card">
          <img src={user.avatar} alt="User Avatar" className="profile-img" />
          <h2>{user.name}</h2>
          <p>{user.role}</p>
          <div className="points-badge">{user.points} pts</div>
        </div>
      </div>

      {/* Middle Column - Main Content */}
      <div className="dashboard-main">
        <div className="welcome-header">
          <h1>Welcome back, {user.name} 👋</h1>
          <p>Here’s your learning summary.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <FiBook className="stat-icon" />
            <div>
              <h4>Active Courses</h4>
              <p>4</p>
            </div>
          </div>
          <div className="stat-card">
            <FiShoppingBag className="stat-icon" />
            <div>
              <h4>Purchases</h4>
              <p>12</p>
            </div>
          </div>
          <div className="stat-card">
            <FiAward className="stat-icon" />
            <div>
              <h4>Achievements</h4>
              <p>7</p>
            </div>
          </div>
          <div className="stat-card">
            <FiClock className="stat-icon" />
            <div>
              <h4>Hours Learned</h4>
              <p>45h</p>
            </div>
          </div>
        </div>

        <div className="progress-card">
          <h3>Weekly Learning Progress</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "68%" }}></div>
          </div>
          <p>68% of weekly goal completed</p>
        </div>
      </div>

      {/* Right Column - Upcoming Tasks */}
      <div className="dashboard-right">
        <div className="task-card">
          <h3>Upcoming Lessons</h3>
          <ul>
            <li>🧠 Memory Boosting Techniques – Today, 10:00 AM</li>
            <li>📚 Speed Reading Practice – Tomorrow, 8:00 AM</li>
            <li>💡 Problem Solving Session – Sep 15, 2:00 PM</li>
          </ul>
        </div>

        <div className="task-card">
          <h3>To-Do</h3>
          <ul>
            <li>✔ Complete Cognitive Mastery Quiz</li>
            <li>✔ Download Learning Guide</li>
            <li>⬜ Join Live Coaching Session</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
