import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated()) {
        navigate('/login');
      }
    }, [navigate]);

    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;