require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Import models and middleware
const User = require('./models/User');
const { authMiddleware, requireRole } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE (Proper Order)
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// MONGODB CONNECTION
// ==========================================
if (!process.env.MONGO_URI) {
  console.warn("[WARNING] MONGO_URI is missing in .env. Database features will be disabled.");
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('[DATABASE] Connected to MongoDB Atlas'))
    .catch((err) => console.error('[DATABASE] Connection error:', err.message));
}

// ==========================================
// TEST ENDPOINTS
// ==========================================
app.get('/', (req, res) => res.json({ message: "NoktaAtisi API Çalışıyor" }));
app.get('/test', (req, res) => res.json({ message: "API çalışıyor" }));

// ==========================================
// DATA MODEL (In-Memory Fallback for requests)
// ==========================================
let requests = [];

const normalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
};

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (role !== 'user' && role !== 'seller') {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    console.log(`[AUTH] Registered new user: ${username} (${role})`);
    res.status(201).json({ message: 'User registered successfully.' });

  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// SINGLE LOGIN ENDPOINT
app.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }

    // 1. TEST İÇİN SABİT USER
    if (username === "nurseda" && password === "1234") {
      const token = jwt.sign(
        { id: "test_id", username: "nurseda", role: role || "user" },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '1d' }
      );

      console.log(`[AUTH] Test User logged in: nurseda`);
      return res.json({
        token,
        user: {
          username: "nurseda",
          role: role || "user"
        }
      });
    }

    // 2. REAL DATABASE LOGIN (Fallback if not test user)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    );

    console.log(`[AUTH] User logged in: ${username}`);
    return res.json({ token, user: { username: user.username, role: user.role } });

  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ==========================================
// API ENDPOINTS (Protected)
// ==========================================

// Protect: Only authenticated users with role "user" can submit requests
app.post('/request', authMiddleware, requireRole('user'), (req, res) => {
  const { city, category, message } = req.body;
  if (!city || !category || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  requests.push({
    city,
    category,
    message,
    timestamp: new Date(),
    userId: req.user.id // Now tied to the authenticated user
  });

  console.log(`[REQUEST ADDED] City: ${city}, Message: ${message} (by ${req.user.username})`);
  res.json({ success: true });
});

const axios = require('axios');

app.get('/analyze', async (req, res) => {
  const { city, category } = req.query;

  console.log("ANALYZE ÇALIŞTI:", city, category);

  // Kategori mapping (Multiple search terms)
  const categoryMap = {
    "Eğlence": ["cinema", "night club", "park", "museum"],
    "Eğitim": ["school", "university", "course"],
    "Yiyecek & İçecek": ["restaurant", "cafe", "fast food"],
    "Sağlık": ["hospital", "clinic", "pharmacy"]
  };

  const searchTerms = categoryMap[category] || [category];

  try {
    const allPlaces = [];

    // Loop over all search terms
    for (const term of searchTerms) {
      try {
        const response = await axios.get("https://serpapi.com/search.json", {
          params: {
            engine: "google_maps",
            q: `${term} in ${city}, Turkey`,
            api_key: process.env.SERP_API_KEY
          }
        });

        const places = response.data.local_results || [];
        allPlaces.push(...places);
      } catch (err) {
        console.error(`SERP API HATA (${term}):`, err.message);
      }
    }

    // Remove duplicates safely (using place_id or title)
    const uniquePlacesMap = new Map();
    allPlaces.forEach(place => {
      const key = place.place_id || place.title;
      if (key && !uniquePlacesMap.has(key)) {
        uniquePlacesMap.set(key, place);
      }
    });

    const uniquePlaces = Array.from(uniquePlacesMap.values());

    if (uniquePlaces.length === 0) {
      return res.json({
        error: "Hiç veri bulunamadı"
      });
    }

    // Calculations
    const supply = uniquePlaces.length;

    const ratings = uniquePlaces
      .map(p => p.rating)
      .filter(r => r !== undefined);

    const avgRating =
      ratings.length > 0
        ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
        : "Yok";

    const topPlace = uniquePlaces[0]?.title || "Yok";

    res.json({
      city,
      category,
      supply,
      avgRating,
      topPlace,
      source: "serpapi"
    });

  } catch (error) {
    console.error("SERP API GENEL HATA:", error.message);

    res.json({
      error: "SerpApi failed"
    });
  }
});

// Sample data
const init = () => {
  requests.push(
    { city: "Samsun", category: "Electronics", message: "Airfryer yok", timestamp: new Date(), userId: "system" },
    { city: "Samsun", category: "Electronics", message: "Air fryer lazım", timestamp: new Date(), userId: "system" },
    { city: "Samsun", category: "Electronics", message: "Yağsız fritöz", timestamp: new Date(), userId: "system" }
  );
};
init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
