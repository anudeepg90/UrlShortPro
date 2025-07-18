#!/bin/bash

# LinkVault Deployment Script
# This script deploys the backend to Google Cloud Run

set -e

echo "🚀 Starting LinkVault deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run:"
    echo "gcloud auth login"
    exit 1
fi

# Set project ID (replace with your actual project ID)
PROJECT_ID="linkvault-181c7"
SERVICE_NAME="linkvault-api"
REGION="us-central1"

echo "📋 Project: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo "🔧 Service: $SERVICE_NAME"

# Set the project
gcloud config set project $PROJECT_ID

# Build the application
echo "🔨 Building application..."
npm run build

# Build and push Docker image
echo "🐳 Building Docker image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo "✅ Deployment complete!"
echo "🔗 Service URL: $SERVICE_URL"
echo ""
echo "📝 Next steps:"
echo "1. Update your frontend API base URL to: $SERVICE_URL"
echo "2. Test the API endpoints"
echo "3. Update Firebase Hosting to use the new API URL" 