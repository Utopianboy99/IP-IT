import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      // Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Store the token for API calls
      localStorage.setItem("authToken", idToken);
      localStorage.setItem("user", JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || credentials.email
      }));

      alert(`Hey Welcome Back ${credentials.email}`);
      navigate("/home");
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Invalid password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed login attempts. Please try again later.";
          break;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
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
          <input 
            type="email" 
            name="email" 
            placeholder="Email address" 
            value={credentials.email}
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={credentials.password}
            onChange={handleChange} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;