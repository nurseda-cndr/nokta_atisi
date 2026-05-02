// In-memory data store for the hackathon (no database needed)
// Example test data included as requested
let requests = [
  { id: 1, city: 'Istanbul', category: 'Transport', message: 'More metro lines needed' },
  { id: 2, city: 'Istanbul', category: 'Transport', message: 'More metro lines needed' },
  { id: 3, city: 'Istanbul', category: 'Transport', message: 'Better bus schedules' },
  { id: 4, city: 'Ankara', category: 'Parks', message: 'Need more green spaces' },
  { id: 5, city: 'Izmir', category: 'Health', message: 'Need a new hospital' }
];
let currentId = 6;

// POST /request
// input: { city, category, message }
exports.addRequest = (req, res) => {
  const { city, category, message } = req.body;

  if (!city || !category || !message) {
    return res.status(400).json({ error: 'City, category, and message are required' });
  }

  const newRequest = {
    id: currentId++,
    city,
    category,
    message
  };

  requests.push(newRequest);

  return res.status(201).json({ success: true, data: newRequest });
};

// GET /analyze
// query params: city, category
exports.analyzeDemand = (req, res) => {
  const { city, category } = req.query;

  if (!city || !category) {
    return res.status(400).json({ error: 'City and category query parameters are required' });
  }

  // Filter requests by city and category
  const filtered = requests.filter(r =>
    r.city.toLowerCase() === city.toLowerCase() &&
    r.category.toLowerCase() === category.toLowerCase()
  );

  if (filtered.length === 0) {
    return res.json({
      most_requested_message: null,
      demand_score: 0,
      suggestion_text: 'No data available for this city and category.'
    });
  }

  // Count frequency of messages
  const messageCounts = {};
  filtered.forEach(r => {
    messageCounts[r.message] = (messageCounts[r.message] || 0) + 1;
  });

  // Find the top requested item
  let topMessage = '';
  let maxCount = 0;

  for (const [msg, count] of Object.entries(messageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topMessage = msg;
    }
  }

  // Generate suggestion text based on demand
  let suggestionText = '';
  if (maxCount >= 5) {
    suggestionText = `High demand detected! Consider prioritizing solutions for: "${topMessage}"`;
  } else if (maxCount >= 2) {
    suggestionText = `Moderate demand for: "${topMessage}". Good opportunity for a targeted solution.`;
  } else {
    suggestionText = `Low demand for: "${topMessage}". Keep monitoring.`;
  }

  // Returns most requested message, demand_score, and suggestion text
  return res.json({
    most_requested_message: topMessage,
    demand_score: filtered.length,
    suggestion_text: suggestionText
  });
};
