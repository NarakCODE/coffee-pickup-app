import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import {
  securityMiddleware,
  corsMiddleware,
  limiter,
} from './middlewares/security.js';
import {
  enableQueryPerformanceMonitoring,
  setupQueryMiddleware,
} from './middlewares/queryPerformance.js';
import { verifyIndexes } from './utils/indexOptimization.js';

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  // Enable query performance monitoring
  enableQueryPerformanceMonitoring();
  setupQueryMiddleware();

  // Verify indexes in development
  if (config.nodeEnv === 'development') {
    verifyIndexes().catch(console.error);
  }
});

// Security & Performance Middleware
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(limiter);
app.use(compression());

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
