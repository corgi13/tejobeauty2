#!/bin/bash
set -e

echo "☸️  Deploying Tejo Beauty to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo "❌ Cannot connect to Kubernetes cluster"
    exit 1
fi

# Build Docker images for Kubernetes
echo "📦 Building Docker images..."
cd "$(dirname "$0")/.."

echo "Building API image..."
docker build -t tejo-api:latest ./tejo-api

echo "Building Web image..."
docker build -t tejo-web:latest ./tejo-web

echo "Building Worker image..."
docker build -t tejo-worker:latest ./tejo-worker

# Deploy to Kubernetes
echo "🚀 Deploying to Kubernetes..."
kubectl apply -k k8s/

echo "⏳ Waiting for deployments to be ready..."

# Wait for PostgreSQL
echo "🔍 Waiting for PostgreSQL..."
kubectl wait --for=condition=ready pod -l app=tejo-postgres -n tejo-beauty --timeout=300s

# Wait for Redis
echo "🔍 Waiting for Redis..."
kubectl wait --for=condition=ready pod -l app=tejo-redis -n tejo-beauty --timeout=300s

# Wait for Meilisearch
echo "🔍 Waiting for Meilisearch..."
kubectl wait --for=condition=ready pod -l app=tejo-meilisearch -n tejo-beauty --timeout=300s

# Wait for API
echo "🔍 Waiting for API..."
kubectl wait --for=condition=ready pod -l app=tejo-api -n tejo-beauty --timeout=300s

# Wait for Web
echo "🔍 Waiting for Web..."
kubectl wait --for=condition=ready pod -l app=tejo-web -n tejo-beauty --timeout=300s

echo "✅ Deployment completed!"
echo ""
echo "📋 Check status with:"
echo "   kubectl get pods -n tejo-beauty"
echo "   kubectl get services -n tejo-beauty"
echo ""
echo "🌐 Access your application:"
echo "   kubectl port-forward svc/tejo-web 3000:3000 -n tejo-beauty"
echo "   kubectl port-forward svc/tejo-api 4000:4000 -n tejo-beauty"
echo ""
echo "📖 View logs with:"
echo "   kubectl logs -f deployment/tejo-api -n tejo-beauty"
echo "   kubectl logs -f deployment/tejo-web -n tejo-beauty"
