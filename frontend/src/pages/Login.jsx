import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const existingRole = localStorage.getItem('role');
    if (existingRole === 'user') navigate('/');
    if (existingRole === 'seller') navigate('/seller');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required!");
      return;
    }

    try {
      // Connect to real backend
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        alert("Sunucudan veri alınamadı");
        return;
      }

      if (!response.ok) {
        alert(data.error || data.message || "Giriş başarısız");
        return;
      }

      // Store real token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('role', data.user.role);

      // Redirect based on server role
      if (data.user.role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="login-container fade-in">
      <div className="login-card glass-panel">
        <div className="login-header">
          <span className="logo-icon" style={{ fontSize: '3rem' }}>🎯</span>
          <h2>NoktaAtisi'na Hoş Geldiniz</h2>
          <p>Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
            />
          </div>

          <div className="form-group">
            <label>Rol Seçin</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
              <option value="user">Kullanıcı</option>
              <option value="seller">Satıcı</option>
            </select>
          </div>

          <button type="submit" className="login-btn">Giriş Yap</button>
        </form>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .login-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        .login-header h2 {
          color: #f8fafc;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: #94a3b8;
          font-size: 0.9rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          color: #cbd5e1;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .form-group input, .role-select {
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #f8fafc;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .form-group input:focus, .role-select:focus {
          outline: none;
          border-color: #6366f1;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        .role-select option {
          background: #0f172a;
          color: #f8fafc;
        }
        .login-btn {
          margin-top: 0.5rem;
          padding: 0.875rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Login;
