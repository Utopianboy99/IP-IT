import React, { useState } from 'react';
import './AuthPages.css';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const Base_API = import.meta.env.BASE_API
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch(`http://${Base_API}:3000/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        // Build Basic Auth header from signup form
        const authHeader = "Basic " + btoa(`${formData.email}:${formData.password}`);

        // Save for dashboards
        localStorage.setItem("auth", authHeader);
        localStorage.setItem("user", JSON.stringify({ email: formData.email }));

        alert("Signup successful!");
        navigate("/home");
      }
      else {
        alert(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };


  return (
    <div className="auth-split">
      <div className="left-pane">
        <h1>Sign Up</h1>
        <p>Start your journey into investing with Cognition Berries. It's quick and easy.</p>
      </div>
      <div className="right-pane">
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
          <p>Already have an account? <a href="/login">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
