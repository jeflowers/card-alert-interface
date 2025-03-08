const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database configuration
const DatabaseConfig = require('./config/dbConfig');

// Routes
const alertRoutes = require('./routes/alertRoutes');
const caseRoutes = require('./routes/caseRoutes');
const cardRoutes = require('./routes/cardRoutes');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Route registrations
app.use('/api/alerts', alertRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/cards', cardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
async function startServer() {
  try {
    // Initialize database connection pool
    await DatabaseConfig.initialize();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await DatabaseConfig.closePool();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();