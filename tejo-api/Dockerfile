FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies (tolerate peer conflicts from mixed NestJS versions)
RUN apk add --no-cache curl \
  && npm install --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the application
CMD ["npm", "run", "start:dev"]
