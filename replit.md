# LinkVault - URL Shortener Application

## Overview

LinkVault is a modern URL shortener application built with a React frontend and Express.js backend. The application provides URL shortening capabilities with user authentication, premium features, and analytics tracking. It follows a full-stack TypeScript architecture with PostgreSQL as the database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a monorepo structure with three main directories:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and schemas

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy using bcrypt-style password hashing
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema**: Three main tables - users, urls, and urlClicks
- **Migrations**: Managed through Drizzle Kit

### Authentication System
- **Strategy**: Session-based authentication using Passport.js
- **Password Security**: Scrypt hashing with salts for password storage
- **Session Storage**: PostgreSQL-backed session store
- **User Types**: Regular and premium users with feature differentiation

### URL Management
- **Short ID Generation**: Random 8-character alphanumeric strings
- **Custom Aliases**: Premium feature for branded short links
- **Click Tracking**: Detailed analytics with IP, user agent, and referrer capture
- **Bulk Operations**: Premium feature for processing multiple URLs

### Premium Features
- Custom aliases for branded short links
- Bulk URL shortening capabilities
- Advanced analytics and insights
- Higher usage limits

## Data Flow

### URL Shortening Process
1. User submits long URL through React form
2. Frontend validates URL format using Zod schema
3. Backend generates unique short ID or validates custom alias
4. URL metadata is extracted (title from domain)
5. Database record created with user association
6. Short URL returned to client

### Click Tracking Flow
1. User clicks shortened link
2. Backend looks up original URL by short ID
3. Click event recorded in urlClicks table
4. URL click count incremented
5. User redirected to original URL
6. Analytics data available for premium users

### Authentication Flow
1. User submits credentials via login form
2. Passport.js validates against stored hash
3. Session created and stored in PostgreSQL
4. User object cached in React Query
5. Protected routes check authentication status

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (PostgreSQL)
- **Session Storage**: PostgreSQL with connect-pg-simple
- **Environment**: Replit deployment platform

### Frontend Libraries
- **UI Framework**: React 18+ with TypeScript
- **Component Library**: Radix UI primitives via shadcn/ui
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with PostCSS
- **Date Handling**: date-fns for date formatting

### Backend Libraries
- **Web Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy
- **Database**: Drizzle ORM with Neon serverless driver
- **Validation**: Zod for schema validation
- **Security**: Built-in crypto module for password hashing

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Shared Neon database instance
- **Environment Variables**: Database URL and session secrets

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: esbuild bundling for Node.js deployment
- **Static Serving**: Express serves built frontend assets
- **Database**: Same Neon instance with connection pooling

### Replit Integration
- **Platform**: Designed for Replit deployment
- **Configuration**: Custom Vite plugins for Replit environment
- **Development Banner**: Automatic Replit dev banner injection
- **File Watching**: Integrated with Replit's file system

### Environment Configuration
- **TypeScript**: Shared tsconfig.json with path mapping
- **Build Process**: Concurrent frontend and backend builds
- **Asset Handling**: Vite handles frontend assets, Express serves API
- **Database Migrations**: Drizzle Kit for schema management