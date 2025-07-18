# LinkVault - Deployment Architecture

## 🏗️ **Clean Architecture (Best Practices)**

We follow a **separated frontend-backend architecture** for better scalability, maintainability, and cost optimization.

### 🌐 **Production URLs**

| Component | URL | Purpose | Technology |
|-----------|-----|---------|------------|
| **Frontend** | `https://linkvault-181c7.web.app/` | User Interface | Firebase Hosting |
| **Backend** | `https://urlshortpro-backend-222258163708.us-central1.run.app/` | API Endpoints | Google Cloud Run |

### 🔧 **Development URLs**

| Component | URL | Purpose |
|-----------|-----|---------|
| **Frontend + Backend** | `http://localhost:5173/` | Local Development |

## 📁 **Project Structure**

```
UrlShortPro/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities & config
│   └── index.html
├── server/                # Backend (Express + TypeScript)
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication
│   ├── storage.ts        # Database operations
│   └── supabase.ts       # Supabase helpers
└── shared/               # Shared types & schemas
    └── schema.ts
```

## 🚀 **Deployment Commands**

### **Frontend Deployment (Firebase)**
```bash
npm run build
firebase deploy --only hosting
```

### **Backend Deployment (Cloud Run)**
```bash
gcloud run deploy urlshortpro-backend --source . --platform managed --region us-central1 --allow-unauthenticated --port 5173 --memory 512Mi --cpu 1 --max-instances 10
```

## 🔄 **API Communication**

The frontend communicates with the backend through:
- **Development**: Direct calls to `localhost:5173`
- **Production**: Calls to Cloud Run backend via Firebase proxy

### **Configuration**
- **Development**: `client/src/lib/config.ts` points to `localhost:5173`
- **Production**: Points to Cloud Run backend URL

## 📊 **Features**

### ✅ **Working Features**
- ✅ User Authentication (Login/Register)
- ✅ URL Shortening (Public & Authenticated)
- ✅ Bulk URL Shortening
- ✅ URL Management (Edit/Delete)
- ✅ QR Code Generation
- ✅ **Analytics Dashboard** (NEW!)
- ✅ Premium Features
- ✅ AdSense Integration

### 🔧 **Analytics Features**
- Real-time click tracking
- Device breakdown (Mobile/Desktop/Tablet)
- Traffic source analysis
- Daily click charts
- Recent activity logs

## 🗑️ **Cleanup History**

### **Removed Services**
- ❌ `linkvault-api` (Old backend) - Deleted on 2025-07-18
- ❌ `https://linkvault-api-m7jbmtvdha-uc.a.run.app` - No longer accessible

### **Current Services**
- ✅ `urlshortpro-backend` (Active backend)
- ✅ `linkvault-181c7` (Firebase hosting)

## 💡 **Why This Architecture?**

### **Benefits of Separation**
1. **Scalability**: Frontend and backend can scale independently
2. **Cost Optimization**: Pay only for what you use
3. **Performance**: CDN for static files, optimized API responses
4. **Maintenance**: Easier to update and debug
5. **Security**: Better isolation of concerns

### **Best Practices Followed**
- ✅ Single responsibility principle
- ✅ Environment-specific configurations
- ✅ Proper error handling
- ✅ Type safety (TypeScript)
- ✅ Clean code structure

## 🔍 **Testing**

### **Production Testing**
1. Visit: `https://linkvault-181c7.web.app/`
2. Sign in and test all features
3. Analytics: Click the 📊 button next to any URL

### **Local Testing**
1. Run: `npm run dev`
2. Visit: `http://localhost:5173/`
3. Test all features locally

## 📝 **Notes**

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Session-based with Supabase
- **File Storage**: Built into the application
- **Monitoring**: Cloud Run logs and Firebase analytics

---

**Last Updated**: 2025-07-18  
**Architecture**: Frontend-Backend Separation  
**Status**: ✅ Production Ready 