const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Invalid token format.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded; // Contains id, username, role
    next();
  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Middleware factory for role-based access
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden. Requires role: ${role}` });
    }

    next();
  };
};

module.exports = { authMiddleware, requireRole };
