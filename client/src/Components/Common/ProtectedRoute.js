import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext); // Use user from context
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);  // Mark loading as false when user data is available
    } else {
      setLoading(false);  // Mark loading as false
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Customize this as per your design
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
