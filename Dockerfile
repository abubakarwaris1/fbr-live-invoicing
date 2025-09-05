# Multi-stage build for FBR Live Invoicing App
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the client
WORKDIR /app/client
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Install nginx and other required packages
RUN apk add --no-cache nginx curl

# Create nginx directories
RUN mkdir -p /var/log/nginx /var/lib/nginx/tmp /run/nginx

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server ./server
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh ./start.sh

# Set ownership
RUN chown -R nextjs:nodejs /app
RUN chown -R nextjs:nodejs /var/log/nginx /var/lib/nginx /run/nginx
RUN chmod +x /app/start.sh

USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start both nginx and the application
CMD ["/app/start.sh"]
