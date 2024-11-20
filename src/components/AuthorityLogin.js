import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthorityLogin = () => {
  const navigate = useNavigate();

  const handleAuthorityLogin = () => {
    // Logic to verify authority login credentials (if needed)
    navigate('/admin-dashboard');
  };

  return (
    <div className="login-page">
      <h2>Authority Login</h2>
      <label>
        Username:
        <input type="admin" />
      </label>
      <label>
        Password:
        <input type="pass123" />
      </label>
      <button onClick={handleAuthorityLogin}>Login</button>
    </div>
  );
};

export default AuthorityLogin;
