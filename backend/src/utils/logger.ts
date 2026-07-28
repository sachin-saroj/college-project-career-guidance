import winston from 'winston';
import { ENV } from '../config/env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for console (development)
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${stack || message}`;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

export const logger = winston.createLogger({
  level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }), // capture stack traces
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    new winston.transports.Console({
      format: ENV.NODE_ENV === 'production' ? json() : combine(colorize(), consoleFormat),
    }),
    // Future: Add File transports or Datadog/CloudWatch transports here
  ],
  exitOnError: false,
});
