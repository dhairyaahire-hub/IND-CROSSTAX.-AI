# Stage 1: Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build Vite client and bundle Node server.js
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled client and server from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/api/webhook-logs', (r) => { if (r.statusCode !== 200) process.exit(1); })"

# Start the application
CMD ["node", "server.js"]
