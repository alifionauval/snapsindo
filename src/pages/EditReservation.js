import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import { getAuthToken, removeAuthToken } from '../utils/authUtils';
import withAuth from '../components/ProtectedRoute';

const EditReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    date: '',
    message: '',
    no_telepon: '',
    jenis_paket: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`https://backend-dsnap.vercel.app/api/order/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            removeAuthToken();
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch reservation');
        }

        const data = await response.json();
        if (data) {
          // Make sure we format the date correctly
          const formattedDate = new Date(data.date).toISOString().split('T')[0];
          setFormData({
            name: data.name || '',
            email: data.email || '',
            subject: data.subject || '',
            date: formattedDate || '',
            message: data.message || '',
            no_telepon: data.no_telepon || '',
            jenis_paket: data.jenis_paket || ''
          });
        } else {
          setError('No data found for this reservation');
        }
      } catch (error) {
        console.error('Error fetching reservation:', error);
        setError('Error loading reservation data');
      }
    };

    if (id) {
      fetchReservation();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await fetch(`https://backend-dsnap.vercel.app/api/order/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          removeAuthToken();
          navigate('/login');
          return;
        }
        throw new Error('Failed to update reservation');
      }

      alert('Reservation updated successfully!');
      navigate('/reservation');
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/reservation');
  };

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-content">
          <h1 className="admin-title">Error</h1>
          <p>{error}</p>
          <button onClick={handleCancel} className="cancel-button">
            Back to Reservations
          </button>
        </div>
      </div>
    );
  }

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
            <a href="/admin" className="menu-link">Home</a>
          </li>
          <li>
            <a href="/adminprojects" className="menu-link">Projects</a>
          </li>
          <li>
            <a href="/reservation" className="menu-link active">Reservation</a>
          </li>
        </ul>
      </div>
      
      <div className="admin-content">
        <h1 className="admin-title">Edit Reservation</h1>
        
        <form onSubmit={handleSubmit} className="edit-reservation-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="no_telepon">Contact:</label>
            <input
              type="text"
              id="no_telepon"
              name="no_telepon"
              value={formData.no_telepon}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jenis_paket">Package Type:</label>
            <input
              type="text"
              id="jenis_paket"
              name="jenis_paket"
              value={formData.jenis_paket}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">
              Save
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservation;
