import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UniversityLogin from './components/UniversityLogin';
import AuthorityLogin from './components/AuthorityLogin';
import UniversityPage from './components/UniversityPage';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/university-login" element={<UniversityLogin />} />
        <Route path="/authority-login" element={<AuthorityLogin />} />
        <Route path="/university-page" element={<UniversityPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
