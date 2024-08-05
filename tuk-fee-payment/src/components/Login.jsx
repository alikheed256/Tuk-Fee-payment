import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../assets/styles/login.css";
import tukProfile from '../assets/images/tuk.png';
import GoogleAuth from '../components/GoogleAuth';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const { loginWithAdmissionNumber, loginWithGoogle } = useAuth();
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginWithAdmissionNumber(admissionNumber, password);
    
      navigate('/home');
    } catch (err) {
      setError('Invalid username or password');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleGoogleSuccess = (response) => {
    loginWithGoogle(response);
    
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div>
      <div className="header-section">
        <nav className="header">
          <img className="tuk-profile" src={tukProfile} alt="tuk profile" />
          <h3>Fee Payment Portal</h3>
        </nav>
      </div>

      <div className='login-container'>
        <div className="login-section">
          <h4>Login</h4>
          <form onSubmit={handleSubmit}>
            <label htmlFor="admissionnumber">Admission Number:</label>
            <input
              type="text"
              id="admissionnumber"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              required
            /><br />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className='submit-button' type="submit">Login</button>
          </form>
        </div>
      </div>

      <div className='google-auth'>
        <p className='google-p'>Or</p>
        <GoogleAuth onSuccess={handleGoogleSuccess} />
      </div>

      <div className='sign-up-link'>
        <a href="/signup">Don't have an account? Sign up</a>
      </div>

      {showError && (
        <div className='error-section'>
          <div className="error-text">
            {error}
            <button className='x-button' onClick={handleCloseError}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
