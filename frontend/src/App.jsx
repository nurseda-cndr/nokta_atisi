import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import UserPanel from './pages/UserPanel';
import SellerPanel from './pages/SellerPanel';

const Navigation = () => {
  const location = useLocation();
  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <span className="logo-icon">🎯</span>
        <span className="logo-text">NoktaAtisi</span>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>User Panel</Link>
        <Link to="/seller" className={location.pathname === '/seller' ? 'active' : ''}>Seller Panel</Link>
      </div>
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
            <Route path="/" element={<UserPanel />} />
            <Route path="/seller" element={<SellerPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
