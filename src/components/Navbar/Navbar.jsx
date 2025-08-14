// components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import './Navbar.css';



const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src="/Cog-Berr-Logo.svg" alt="Cognition Berries Logo" width="30" height="30" />
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        {user ? (
          <div className="user-menu">
            {/* Cart icon */}
            <Link to="/cart" className="cart-icon">🛒</Link>

            {/* Avatar triggers sidebar */}
            <div onClick={toggleSidebar} className="avatar-wrapper">
              <Avatar
                alt={user?.name || 'User'}
                src={user.avatar || '/SilhouettedHumanProfileAgainstPinkGradient.png'}
              />
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        )}
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <ul>
          <li><Link to="/dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
          <li><Link to="/settings" onClick={toggleSidebar}>Settings</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
