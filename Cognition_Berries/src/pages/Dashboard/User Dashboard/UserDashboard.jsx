import "./UserDashboard.css";
import { FiShoppingBag, FiMessageSquare, FiHeart, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <h2 className="logo">🍃MySpace</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>My Orders</li>
            <li>Messages</li>
            <li>Saved</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard">
        <header className="dash-header">
          <div className="user-greeting">
            <h1>Welcome back, Sanje 👋</h1>
            <p>Here’s a quick look at your activity.</p>
          </div>
          <div className="profile-summary">
            <img src="https://i.pravatar.cc/40?img=3" alt="User Avatar" className="avatar" />
            <span className="username">Sanje</span>
          </div>
        </header>

        <section className="card-grid">
          <div className="card">
            <FiShoppingBag className="icon" />
            <div>
              <h4>Orders</h4>
              <p>12 Total</p>
            </div>
          </div>
          <div className="card">
            <FiMessageSquare className="icon" />
            <div>
              <h4>Messages</h4>
              <p>3 New</p>
            </div>
          </div>
          <div className="card">
            <FiHeart className="icon" />
            <div>
              <h4>Saved Items</h4>
              <p>5</p>
            </div>
          </div>
          <div className="card">
            <FiTrendingUp className="icon" />
            <div>
              <h4>Progress</h4>
              <p>68% Complete</p>
            </div>
          </div>
        </section>

        <section className="recent-activity">
          <h3>Recent Activity</h3>
          <ul>
            <li>🛒 You purchased "Cognition Mastery" – R650</li>
            <li>💬 Replied to a support message</li>
            <li>❤️ Saved "Financial Freedom PDF Guide"</li>
          </ul>
          <button className="lime-btn">Update Profile</button>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
