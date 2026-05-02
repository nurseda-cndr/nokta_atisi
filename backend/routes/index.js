const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// GET /health
// returns: { status: "ok" }
router.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// POST /request
// input: { city, category, message }
router.post('/request', requestController.addRequest);

// GET /analyze
// query params: city, category
router.get('/analyze', requestController.analyzeDemand);

module.exports = router;
