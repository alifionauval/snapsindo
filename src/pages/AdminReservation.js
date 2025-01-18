import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import { getAuthToken, removeAuthToken } from '../utils/authUtils';
import withAuth from '../components/ProtectedRoute';

const AdminReservation = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch('https://backend-dsnap.vercel.app/api/order', {
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
          throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        const formattedData = data.map((reservation) => ({
          ...reservation,
          date: new Date(reservation.date).toISOString().split('T')[0],
        }));
        setReservations(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchReservations();
  }, [navigate]);

  const handleEdit = (id) => {
    // Make sure we're using the actual database ID
    if (id) {
      navigate(`/reservation/edit/${id}`);
    } else {
      console.error('Invalid reservation ID');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reservation?');
  
    if (!confirmDelete) {
      return;
    }
  
    try {
      const token = getAuthToken();
      const response = await fetch(`https://backend-dsnap.vercel.app/api/order/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          removeAuthToken();
          navigate('/login');
          return;
        }
        throw new Error('Failed to delete reservation');
      }
  
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation._id !== id)
      );
  
      alert('Reservation deleted successfully!');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Failed to delete reservation. Please try again.');
    }
  };

  const handleLogout = () => {
    try {
      removeAuthToken();
      navigate('/');
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
        <h1 className="admin-title">Admin / Reservation</h1>

        <div className="logout-button" onClick={handleLogout}>
          <img
            src={require('../assets/LogoutLogo.png')}
            alt="Logout"
            className="logout-logo"
          />
        </div>

        <table className="reservation-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Packet</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={reservation._id}>
                <td>{index + 1}</td>
                <td>{reservation.name}</td>
                <td>{reservation.email}</td>
                <td>{reservation.no_telepon}</td>
                <td>{reservation.subject}</td>
                <td>{reservation.date}</td>
                <td>{reservation.jenis_paket}</td>
                <td>{reservation.message}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(reservation._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(reservation._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservation;
