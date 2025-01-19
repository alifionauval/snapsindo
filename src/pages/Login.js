import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { setAuthToken } from '../utils/authUtils';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    const payload = {
      username: email,
      password: password,
    };

    try {
      const response = await fetch('https://backend-dsnap.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.token); // Menggunakan fungsi dari authUtils
        navigate('/admin');
      } else {
        setError(data.message || 'Login gagal, periksa email dan password Anda.');
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi nanti.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <img
          src={require('../assets/BackLogo.png')}
          alt="Back"
          className="back-logo"
        />
      </button>
      <div className="login-box">
        <img
          src={require('../assets/logo.png')}
          alt="Logo d'snap"
          className="login-logo"
        />
        <h2 className="login-title">Admin Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          <input
            type="email"
            placeholder="Enter Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
