require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (request, response) => {
  const connected = mongoose.connection.readyState === 1;
  response.status(connected ? 200 : 503).json({
    status: 'ok',
    database: connected ? 'connected' : 'disconnected',
  });
});

app.use('/api/recipes', (request, response, next) => {
  if (mongoose.connection.readyState !== 1) {
    response.status(503).json({ message: 'The recipe database is unavailable. Check the server configuration.' });
    return;
  }
  next();
});

app.use('/api/recipes', recipeRoutes);

const frontendBuildPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

app.get('*', (request, response, next) => {
  if (request.path.startsWith('/api/')) {
    next();
    return;
  }
  response.sendFile(path.join(frontendBuildPath, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((request, response) => {
  response.status(404).json({ message: 'Endpoint not found.' });
});

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((fieldError) => fieldError.message);
    response.status(400).json({ message: 'Please check the recipe details.', errors: details });
    return;
  }

  if (error.name === 'CastError') {
    response.status(400).json({ message: 'One of the submitted values is not valid.' });
    return;
  }

  if (error.type === 'entity.parse.failed') {
    response.status(400).json({ message: 'Request body must contain valid JSON.' });
    return;
  }

  if (mongoose.connection.readyState !== 1) {
    response.status(503).json({ message: 'The recipe database is unavailable. Check the server configuration.' });
    return;
  }

  console.error('Request failed:', error.message);
  response.status(500).json({ message: 'Something went wrong while processing the request.' });
});

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB.'))
    .catch((error) => console.error('MongoDB connection failed. Check MONGODB_URI and Atlas network access.', error.message));
} else {
  console.warn('MONGODB_URI is not set. The API will start, but recipe data is unavailable.');
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Recipe Book API listening on 0.0.0.0:${port}`);
});