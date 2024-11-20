import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === 'university') {
      navigate('/university-page');
    } else if (role === 'authority') {
      navigate('/admin-dashboard');
    }
    // Add other roles as needed
  };

  return (
    <div className="login-page">
      <h1>Select Your Action</h1>
      <button onClick={() => handleLogin('university')}>Submit a certificate</button>
      <button onClick={() => handleLogin('authority')}>Verify a certificate</button>
    </div>
  );
};

export default LoginPage;
