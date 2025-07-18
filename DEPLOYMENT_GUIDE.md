# LinkVault Deployment Guide

## 🚀 Complete Deployment Solution

Your LinkVault URL shortener needs both frontend and backend deployed to work properly. Currently, only the frontend is deployed to Firebase Hosting, but the backend API is still running locally.

## 📋 **Current Status**
- ✅ **Frontend**: Deployed to Firebase Hosting (https://linkvault-181c7.web.app)
- ❌ **Backend**: Still running locally (not accessible from internet)
- 🔗 **Issue**: Frontend can't connect to backend API

## 🛠️ **Solution: Deploy Backend to Google Cloud Run**

### **Step 1: Install Google Cloud CLI**

```bash
# macOS (using Homebrew)
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### **Step 2: Authenticate with Google Cloud**

```bash
gcloud auth login
gcloud config set project linkvault-181c7
```

### **Step 3: Enable Required APIs**

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### **Step 4: Deploy Backend**

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### **Step 5: Update Frontend Configuration**

After deployment, you'll get a Cloud Run URL. Update your frontend:

1. **Create environment file**:
```bash
# Create .env.production file
echo "VITE_API_URL=https://your-cloud-run-url" > .env.production
```

2. **Rebuild and redeploy frontend**:
```bash
npm run build
firebase deploy
```

## 🔧 **Manual Deployment (Alternative)**

If the script doesn't work, here's the manual process:

### **1. Build the Application**
```bash
npm run build
```

### **2. Build Docker Image**
```bash
gcloud builds submit --tag gcr.io/linkvault-181c7/linkvault-api
```

### **3. Deploy to Cloud Run**
```bash
gcloud run deploy linkvault-api \
  --image gcr.io/linkvault-181c7/linkvault-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production
```

### **4. Get the Service URL**
```bash
gcloud run services describe linkvault-api --region=us-central1 --format="value(status.url)"
```

## 🌍 **Environment Configuration**

### **Development (.env.local)**
```env
VITE_API_URL=http://localhost:5173
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Production (.env.production)**
```env
VITE_API_URL=https://linkvault-api-xxxxx-uc.a.run.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔍 **Debugging Deployment Issues**

### **1. Check Cloud Run Logs**
```bash
gcloud logs read --service=linkvault-api --limit=50
```

### **2. Test API Endpoints**
```bash
# Test the deployed API
curl https://your-cloud-run-url/api/user
```

### **3. Check CORS Configuration**
Make sure your Cloud Run service allows requests from your Firebase domain:
- Origin: `https://linkvault-181c7.web.app`
- Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Headers: `Content-Type, Authorization`
- Credentials: `true`

### **4. Verify Environment Variables**
```bash
# Check if environment variables are set
gcloud run services describe linkvault-api --region=us-central1 --format="value(spec.template.spec.containers[0].env[].name)"
```

## 📊 **Monitoring & Analytics**

### **Cloud Run Monitoring**
- **CPU Usage**: Monitor resource utilization
- **Memory Usage**: Ensure adequate memory allocation
- **Request Count**: Track API usage
- **Error Rate**: Monitor for issues

### **Firebase Analytics**
- **User Engagement**: Track user behavior
- **Performance**: Monitor app performance
- **Crash Reports**: Identify and fix issues

## 🔒 **Security Considerations**

### **1. Environment Variables**
- Store sensitive data in environment variables
- Never commit secrets to version control
- Use Google Secret Manager for production secrets

### **2. CORS Configuration**
- Only allow your Firebase domain
- Restrict HTTP methods as needed
- Enable credentials for session management

### **3. Authentication**
- Ensure session cookies work across domains
- Configure secure cookie settings
- Use HTTPS in production

## 💰 **Cost Optimization**

### **Cloud Run Settings**
- **Memory**: Start with 512Mi, adjust based on usage
- **CPU**: Start with 1 CPU, scale as needed
- **Max Instances**: Set reasonable limits (10-20)
- **Min Instances**: 0 for cost savings, 1 for faster cold starts

### **Firebase Hosting**
- **Free Tier**: 10GB storage, 360MB/day transfer
- **Paid Tier**: $0.026/GB storage, $0.15/GB transfer

## 🚨 **Common Issues & Solutions**

### **Issue 1: CORS Errors**
**Symptoms**: Browser shows CORS errors in console
**Solution**: Update CORS configuration in server/index.ts

### **Issue 2: Session Not Working**
**Symptoms**: Users can't stay logged in
**Solution**: Configure secure cookies and domain settings

### **Issue 3: API Timeouts**
**Symptoms**: Requests take too long or fail
**Solution**: Increase memory/CPU allocation or optimize code

### **Issue 4: Build Failures**
**Symptoms**: Docker build fails
**Solution**: Check Dockerfile and dependencies

## 📈 **Performance Optimization**

### **1. Enable Compression**
```typescript
// In server/index.ts
app.use(compression());
```

### **2. Cache Static Assets**
```typescript
// Cache static files
app.use(express.static('dist/public', {
  maxAge: '1y',
  etag: true
}));
```

### **3. Database Connection Pooling**
```typescript
// Optimize database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 🔄 **Continuous Deployment**

### **GitHub Actions Workflow**
```yaml
name: Deploy to Cloud Run
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
      - run: |
          gcloud auth configure-docker
          gcloud builds submit --tag gcr.io/${{ secrets.PROJECT_ID }}/linkvault-api
          gcloud run deploy linkvault-api --image gcr.io/${{ secrets.PROJECT_ID }}/linkvault-api --region us-central1
```

## 📞 **Support & Troubleshooting**

### **1. Check Logs**
```bash
# Cloud Run logs
gcloud logs read --service=linkvault-api

# Firebase logs
firebase functions:log
```

### **2. Monitor Performance**
- Google Cloud Console → Cloud Run → Metrics
- Firebase Console → Performance

### **3. Get Help**
- Google Cloud Documentation
- Firebase Documentation
- Stack Overflow

---

## 🎯 **Next Steps**

1. **Deploy Backend**: Run `./deploy.sh`
2. **Update Frontend**: Set API URL and redeploy
3. **Test Everything**: Verify all features work
4. **Monitor Performance**: Set up alerts and monitoring
5. **Scale as Needed**: Adjust resources based on usage

Your LinkVault app will be fully functional once both frontend and backend are deployed! 🚀 