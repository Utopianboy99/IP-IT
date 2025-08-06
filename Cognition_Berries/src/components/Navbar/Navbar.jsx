// components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import Avatar from '@mui/material/Avatar';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Cognition Berries</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      {user ? (
        <div className="user-menu">
          <span className="user-greeting">
            Hi, {user?.name ? user.name.split(' ')[0] : 'User'}
          </span>
          <Link to="/dashboard" className="nav-button">Dashboard</Link>
          <Link to="/profile" className="nav-button">
            {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
            {/* <img src={user.avatar || '/default-user.png'} alt="User Avatar" className="avatar" /> */}
          </Link>
          <button className="nav-button logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
