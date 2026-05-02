import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import UserPanel from './pages/UserPanel';
import SellerPanel from './pages/SellerPanel';
import Login from './pages/Login';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  if (!username || !role) {
    return <Navigate to="/login" replace />;
  }

  // Restrict access based on role
  if (allowedRole && role !== allowedRole) {
    if (role === 'seller') return <Navigate to="/seller" replace />;
    if (role === 'user') return <Navigate to="/" replace />;
  }

  return children;
};

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  // Hide navbar on login page
  if (location.pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <span className="logo-icon">🎯</span>
        <span className="logo-text">NoktaAtisi</span>
      </div>
      <div className="nav-links">
        {role === 'user' && (
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Kullanıcı Paneli</Link>
        )}
        {role === 'seller' && (
          <Link to="/seller" className={location.pathname === '/seller' ? 'active' : ''}>Satıcı Paneli</Link>
        )}
      </div>
      <div className="nav-user">
        {username && <span className="user-greeting">Merhaba, {username}</span>}
        <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
      </div>

      <style>{`
        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
        }
        .user-greeting {
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .logout-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute allowedRole="user">
                  <UserPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller"
              element={
                <ProtectedRoute allowedRole="seller">
                  <SellerPanel />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route to handle invalid URLs or logged-out users */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
