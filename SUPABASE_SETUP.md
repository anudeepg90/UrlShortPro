# Supabase Migration Setup Guide

This guide will help you migrate your URL shortener app from PostgreSQL to Supabase.

## 1. Supabase Database Setup

### Step 1: Create Tables in Supabase

Go to your Supabase dashboard (https://supabase.com/dashboard) and navigate to the SQL Editor. Run the following SQL commands:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create urls table
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  long_url TEXT NOT NULL,
  short_id TEXT NOT NULL UNIQUE,
  custom_alias TEXT UNIQUE,
  title TEXT,
  tags TEXT[],
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMP
);

-- Create url_clicks table
CREATE TABLE url_clicks (
  id SERIAL PRIMARY KEY,
  url_id INTEGER NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  ip TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_urls_short_id ON urls(short_id);
CREATE INDEX idx_urls_custom_alias ON urls(custom_alias);
CREATE INDEX idx_urls_user_id ON urls(user_id);
CREATE INDEX idx_url_clicks_url_id ON url_clicks(url_id);
CREATE INDEX idx_url_clicks_timestamp ON url_clicks(timestamp);
```

### Step 2: Fix Existing RLS Policies (If Tables Already Exist)

If you already have tables with RLS enabled, run these commands to fix the policies:

```sql
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow all inserts" ON users;

-- Create new policies that work with your app
CREATE POLICY "Allow all operations for development" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For urls table
DROP POLICY IF EXISTS "Users can view their own URLs" ON urls;
DROP POLICY IF EXISTS "Users can insert their own URLs" ON urls;
DROP POLICY IF EXISTS "Users can update their own URLs" ON urls;
DROP POLICY IF EXISTS "Users can delete their own URLs" ON urls;
DROP POLICY IF EXISTS "Public can view URLs by short_id" ON urls;

CREATE POLICY "Allow all operations for development" ON urls
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For url_clicks table
DROP POLICY IF EXISTS "Users can view clicks for their URLs" ON url_clicks;
DROP POLICY IF EXISTS "Anyone can insert clicks" ON url_clicks;

CREATE POLICY "Allow all operations for development" ON url_clicks
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Step 3: Enable Row Level Security (RLS) - Only if not already enabled

```sql
-- Enable RLS on all tables (only if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_clicks ENABLE ROW LEVEL SECURITY;
```

## 2. Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://epcqeqcqqzzpolymqflm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FlcWNxcXp6cG9seW1xZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTkxODksImV4cCI6MjA2NzgzNTE4OX0.1eEibQkblIem4TkAIkh9afrHiqm1EOURw3hvUDMjbLw

# Database Configuration (for direct PostgreSQL connection)
# You'll need to get this from your Supabase dashboard
DATABASE_URL=postgresql://postgres.epcqeqcqqzzpolymqflm:[YOUR_DB_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Session Secret
SESSION_SECRET=your-session-secret-here
```

## 3. Get Database Password

1. Go to your Supabase dashboard
2. Navigate to Settings > Database
3. Find the "Connection string" section
4. Copy the password from the connection string
5. Replace `[YOUR_DB_PASSWORD]` in the DATABASE_URL with your actual password

## 4. Install Dependencies

Run the following command to install the new dependencies:

```bash
npm install
```

## 5. Test the Migration

1. Start the development server:
```bash
npm run dev
```

2. Test the following functionality:
   - User registration and login
   - URL shortening
   - URL redirection
   - Analytics and statistics

## 6. Key Changes Made

### Database Layer
- Replaced Neon database with Supabase
- Updated Drizzle ORM configuration
- Created Supabase helper functions
- Switched from PostgreSQL session store to memory store

### Storage Layer
- Updated all database operations to use Supabase
- Maintained the same interface for backward compatibility
- Added proper error handling for Supabase operations

### Configuration
- Updated package.json with Supabase dependencies
- Created environment variable configuration
- Updated Drizzle configuration for Supabase

## 7. Troubleshooting

### Common Issues

1. **Connection Errors**: Make sure your DATABASE_URL is correct and includes the proper password
2. **RLS Policy Errors**: Ensure all RLS policies are properly set up
3. **Type Errors**: The migration maintains type safety, but you may need to adjust some type definitions

### Getting Help

If you encounter issues:
1. Check the Supabase dashboard for any error messages
2. Verify your environment variables are set correctly
3. Ensure all tables and policies are created properly

## 8. Next Steps

After successful migration:
1. Test all functionality thoroughly
2. Consider implementing Supabase Auth for better security
3. Set up proper monitoring and logging
4. Consider using Supabase Edge Functions for serverless operations

## 9. Security Considerations

- The current setup uses memory-based sessions for simplicity
- Consider implementing Supabase Auth for production use
- Ensure all RLS policies are properly configured
- Regularly rotate your database passwords and API keys 