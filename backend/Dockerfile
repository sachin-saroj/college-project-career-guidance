# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies for node-gyp (e.g. for bcrypt)
RUN apk add --no-cache python3 make g++ 

COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

# Set Node environment to production
ENV NODE_ENV=production

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /usr/src/app

USER appuser

EXPOSE 5000

CMD ["node", "dist/server.js"]
