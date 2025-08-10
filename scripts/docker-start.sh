#!/bin/bash
set -e

echo "🚀 Starting Tejo Beauty with Docker Compose..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create networks if they don't exist
docker network create tejo-network 2>/dev/null || true

# Build and start all services
echo "📦 Building Docker images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Wait for PostgreSQL to be ready
echo "🔍 Checking PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U tejo -d tejobeauty; do
    echo "Waiting for PostgreSQL..."
    sleep 5
done

# Wait for Redis to be ready  
echo "🔍 Checking Redis..."
until docker-compose exec -T redis redis-cli ping; do
    echo "Waiting for Redis..."
    sleep 5
done

# Wait for API to be ready
echo "🔍 Checking API..."
until curl -f http://localhost:4000/health >/dev/null 2>&1; do
    echo "Waiting for API..."
    sleep 5
done

# Wait for Web to be ready
echo "🔍 Checking Web app..."
until curl -f http://localhost:3000 >/dev/null 2>&1; do
    echo "Waiting for Web app..."
    sleep 5
done

echo "✅ All services are running!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   API:      http://localhost:4000"
echo "   API Docs: http://localhost:4000/docs"
echo "   Search:   http://localhost:7700"
echo ""
echo "📋 View logs with: docker-compose logs -f [service-name]"
echo "🛑 Stop with: docker-compose down"
