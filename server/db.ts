import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

const supabaseUrl = process.env.SUPABASE_URL || 'https://epcqeqcqqzzpolymqflm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FlcWNxcXp6cG9seW1xZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTkxODksImV4cCI6MjA2NzgzNTE4OX0.1eEibQkblIem4TkAIkh9afrHiqm1EOURw3hvUDMjbLw';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create postgres connection for Drizzle
// For now, we'll use a simple connection string. You'll need to set up the DATABASE_URL
// with your Supabase database password
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.epcqeqcqqzzpolymqflm:[YOUR_DB_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Export for session store
export const pool = client;