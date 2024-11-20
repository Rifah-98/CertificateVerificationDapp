import React from 'react';
import { useNavigate } from 'react-router-dom';

const UniversityLogin = () => {
  const navigate = useNavigate();

  const handleUniversityLogin = () => {
    // Logic to verify university login credentials (if needed)
    navigate('/university-page');
  };

  return (
    <div className="login-page">
      <h2>University Login</h2>
      <label>
        Username:
        <input type="user" />
      </label>
      <label>
        Password:
        <input type="pass123" />
      </label>
      <button onClick={handleUniversityLogin}>Login</button>
    </div>
  );
};

export default UniversityLogin;