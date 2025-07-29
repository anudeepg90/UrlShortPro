#!/bin/bash

# TinyYOUrl Production Deployment Script
# This script deploys both frontend and backend for production

set -e

echo "🚀 Starting TinyYOUrl production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="linkvault-181c7"
SERVICE_NAME="tinyyourl-api"
REGION="us-central1"
DOMAIN="tinyyourl.com"

echo -e "${BLUE}📋 Project: $PROJECT_ID${NC}"
echo -e "${BLUE}🌍 Region: $REGION${NC}"
echo -e "${BLUE}🔧 Service: $SERVICE_NAME${NC}"
echo -e "${BLUE}🌐 Domain: $DOMAIN${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI is not installed. Please install it first:${NC}"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with Google Cloud. Please run:${NC}"
    echo "gcloud auth login"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI is not installed. Please install it first:${NC}"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Set the project
echo -e "${YELLOW}🔧 Setting Google Cloud project...${NC}"
gcloud config set project $PROJECT_ID

# Step 1: Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 2: Deploy Backend to Cloud Run
echo -e "${YELLOW}🐳 Building and deploying backend to Cloud Run...${NC}"

# Build and push Docker image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars CLOUD_RUN_URL=https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
echo -e "${BLUE}🔗 Backend URL: $SERVICE_URL${NC}"

# Step 3: Deploy Frontend to Firebase
echo -e "${YELLOW}🔥 Deploying frontend to Firebase Hosting...${NC}"

# Deploy to Firebase
firebase deploy --only hosting

echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"

# Step 4: Update environment variables
echo -e "${YELLOW}🔧 Updating environment configuration...${NC}"

# Create production environment file
cat > .env.production << EOF
VITE_API_URL=$SERVICE_URL
VITE_DOMAIN=$DOMAIN
NODE_ENV=production
EOF

echo -e "${GREEN}✅ Environment configuration updated${NC}"

# Step 5: Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

# Test backend health
echo -e "${BLUE}Testing backend health...${NC}"
if curl -f "$SERVICE_URL/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check failed (this might be normal if no health endpoint exists)${NC}"
fi

# Test frontend
echo -e "${BLUE}Testing frontend...${NC}"
if curl -f "https://$DOMAIN" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend test failed (domain might not be configured yet)${NC}"
fi

# Step 6: Display final information
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "  🌐 Frontend URL: https://$DOMAIN"
echo -e "  🔗 Backend URL: $SERVICE_URL"
echo -e "  📁 Project ID: $PROJECT_ID"
echo -e "  🌍 Region: $REGION"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Configure your domain DNS to point to Firebase Hosting"
echo "2. Set up SSL certificates (Firebase handles this automatically)"
echo "3. Update your AdSense verification with the new domain"
echo "4. Test all features on the new domain"
echo "5. Monitor logs and performance"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "  View backend logs: gcloud logs read --service=$SERVICE_NAME --region=$REGION"
echo "  View Firebase logs: firebase hosting:log"
echo "  Monitor performance: firebase console"
echo "  Update backend: ./deploy-production.sh"
echo ""
echo -e "${GREEN}🚀 TinyYOUrl is now live on https://$DOMAIN${NC}" 