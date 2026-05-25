const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoV Hero Database API is running' });
});

const heroRoutes = require('./routes/heroRoutes');
const itemRoutes = require('./routes/itemRoutes');
const runeRoutes = require('./routes/runeRoutes');
const authRoutes = require('./routes/authRoutes');
const buildRoutes = require('./routes/buildRoutes');

app.use('/api/heroes', heroRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/runes', runeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/builds', buildRoutes);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
