import { createClient } from '@supabase/supabase-js';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const supabaseUrl = 'https://epcqeqcqqzzpolymqflm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FlcWNxcXp6cG9seW1xZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTkxODksImV4cCI6MjA2NzgzNTE4OX0.1eEibQkblIem4TkAIkh9afrHiqm1EOURw3hvUDMjbLw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64));
  return `${buf.toString("hex")}.${salt}`;
}

async function testRegistration() {
  try {
    console.log("🔧 Testing Supabase connection...");
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error("❌ Connection test failed:", testError);
      return;
    }
    
    console.log("✅ Connection test successful");
    
    // Test password hashing
    console.log("🔐 Testing password hashing...");
    const hashedPassword = await hashPassword("testpassword");
    console.log("✅ Password hashed successfully:", hashedPassword.substring(0, 20) + "...");
    
    // Test user creation
    console.log("👤 Testing user creation...");
    const userData = {
      username: "debugtest",
      email: "debug@test.com",
      password: hashedPassword,
      is_premium: true,
      membership_start_date: new Date().toISOString(),
    };
    
    console.log("📝 User data:", userData);
    
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) {
      console.error("❌ User creation failed:", error);
      return;
    }
    
    console.log("✅ User created successfully:", data);
    
    // Clean up
    console.log("🧹 Cleaning up test user...");
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('username', 'debugtest');
    
    if (deleteError) {
      console.error("❌ Cleanup failed:", deleteError);
    } else {
      console.log("✅ Cleanup successful");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testRegistration(); 