import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';

const LoginPage = () => {
  const BaseAPI = process.env.BASE_API
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = e => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch(`http://${BaseAPI}:3000/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();
      if (res.ok) {
        // Build Basic Auth header
        const authHeader = "Basic " + btoa(`${credentials.email}:${credentials.password}`);

        // Save for dashboards
        localStorage.setItem("auth", authHeader);
        localStorage.setItem("user", JSON.stringify({ email: credentials.email }));

        alert(`Hey Welcome Back ${credentials.email}`);
        navigate("/home");
      }
      else {
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };


  return (
    <div className="auth-split">
      <div className="left-pane">
        <h1>Login</h1>
        <p>Access your learning dashboard and continue growing your investing knowledge.</p>
      </div>
      <div className="right-pane">
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email address" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
