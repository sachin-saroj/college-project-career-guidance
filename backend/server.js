import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger.js';
import routes from './routes.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Enforce mandatory JWT secret configuration on startup
if (!process.env.JWT_SECRET) {
  logger.error('FATAL ERROR: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

const app = express();

// Trust reverse proxy (Render, Nginx, Cloudflare) for accurate client IP
app.set('trust proxy', 1);

// Helper to identify local development requests
const isLocalOrDev = (req) => {
  if (process.env.NODE_ENV !== 'production') return true;
  const ip = req.ip || req.connection?.remoteAddress || '';
  return ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1') || ip === '::ffff:127.0.0.1';
};

// Rate Limiters - generous thresholds with dev/local bypass
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 1000 : 20000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isLocalOrDev(req),
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 60 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isLocalOrDev(req),
  message: { error: 'Too many authentication attempts, please try again later.' }
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 120 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isLocalOrDev(req),
  message: { error: 'AI rate limit exceeded, please wait a few minutes.' }
});

// Configure environment-based CORS origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Apply rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/chat', aiLimiter);
app.use('/api/assessment/submit', aiLimiter);
app.use('/api/', apiLimiter);

// Serve frontend-v2 static files in production
app.use(express.static(path.join(__dirname, '../frontend-v2/dist')));

// Interactive Swagger OpenAPI Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Mount Unified API Routes
app.use('/api', routes);

// Wildcard SPA route fallback for non-API requests
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend-v2/dist/index.html'));
  } else {
    res.status(404).json({ error: 'API route not found' });
  }
});

// Global error handler (must be last middleware)
app.use((err, req, res, next) => {
  // Log error with Winston
  logger.error(`Error: ${err.message}`, { stack: err.stack, url: req.url, method: req.method });

  // Determine status code
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // In production, don't expose stack traces
  const response = {
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  res.status(status).json(response);
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;
