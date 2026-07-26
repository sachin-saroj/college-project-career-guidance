import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for console (development)
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }), // capture stack traces
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV === 'production' ? json() : combine(colorize(), consoleFormat)
  ),
  transports: [
    new winston.transports.Console(),
    // Future: Add File transports or Datadog/CloudWatch transports here
  ],
  exitOnError: false,
});
