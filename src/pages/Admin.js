import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import { getAuthToken, removeAuthToken, isAuthenticated } from '../utils/authUtils';

const Admin = () => {
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const token = getAuthToken();
    
    // Fetch order count
    fetch('https://backend-dsnap.vercel.app/api/order', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {
        setOrderCount(data.length);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        if (error.message === 'Unauthorized') {
          removeAuthToken();
          navigate('/login');
        }
      });

    // Fetch project count
    fetch('https://backend-dsnap.vercel.app/api/portfolio', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {
        setProjectCount(data.length);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        if (error.message === 'Unauthorized') {
          removeAuthToken();
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    try {
      removeAuthToken(); // Hapus token dari localStorage
      navigate('/'); // Redirect ke halaman home
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error during logout. Please try again.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <img
          src={require('../assets/logo.png')}
          alt="Logo d'snap"
          className="admin-logo"
        />
        <ul className="admin-menu">
          <li>
            <a href="/admin" className="menu-link active">
              Home
            </a>
          </li>
          <li>
            <a href="/adminprojects" className="menu-link">
              Projects
            </a>
          </li>
          <li>
            <a href="/reservation" className="menu-link">
              Reservation
            </a>
          </li>
        </ul>
      </div>
      <div className="admin-content">
        <h1 className="admin-title">Home</h1>
        
        <div className="stats-container">
          <div className="stats-box event-box">
            <h2>Pemesanan Jasa yang Masuk</h2>
            <div className="stats-number">{orderCount}</div>
          </div>
          
          <div className="stats-box portfolio-box">
            <h2>Project yang Diselesaikan</h2>
            <div className="stats-number">{projectCount}</div>
          </div>
        </div>
      </div>
      <div className="logout-button" onClick={handleLogout}>
        <img
          src={require('../assets/LogoutLogo.png')}
          alt="Logout"
          className="logout-logo"
        />
      </div>
    </div>
  );
};

export default Admin;