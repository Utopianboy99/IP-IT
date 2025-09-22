import React, { useState } from 'react';
import './AuthPages.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const SignupPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Store auth data
      localStorage.setItem("authToken", idToken);
      localStorage.setItem("user", JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: formData.name
      }));

      alert("Signup successful!");
      navigate("/home");
      
    } catch (error) {
      console.error("Signup error:", error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "Signup failed. Please try again.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled.";
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
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          <p>Already have an account? <a href="/login">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;