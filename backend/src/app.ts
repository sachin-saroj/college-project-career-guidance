import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { ENV } from './config/env';
import { CONSTANTS } from './config/constants';
import { logger } from './utils/logger';
import apiV1Router from './routes';
import { globalErrorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';
import { swaggerSpec } from './docs/swagger';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const app: Application = express();

Sentry.init({
  dsn: ENV.SENTRY_DSN || '',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0, 
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 1. Security HTTP Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", ENV.CLIENT_URL || 'http://localhost:5173'],
    },
  },
}));

// 2. CORS Policy
app.use(
  cors({
    origin: ENV.CLIENT_URL || 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// 3. HTTP Request Logging (piped to Winston)
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// 4. Rate Limiting (Global)
const globalLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.GLOBAL_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT.GLOBAL_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', globalLimiter);

// 5. Body Parsing, URL Encoding, and Cookie Parsing
app.use(express.json({ limit: '10kb' })); // Prevents massive payload DOS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 6. Data Compression
app.use(compression());

// 7. Route Mounting
// Mount Swagger UI (API Documentation)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', apiV1Router);

// 8. Unhandled Route (404) Catcher
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// 9. Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
