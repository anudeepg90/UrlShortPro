import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://epcqeqcqqzzpolymqflm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FlcWNxcXp6cG9seW1xZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTkxODksImV4cCI6MjA2NzgzNTE4OX0.1eEibQkblIem4TkAIkh9afrHiqm1EOURw3hvUDMjbLw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateUsersToPremium() {
  try {
    console.log('🔄 Updating all users to premium status...');
    
    // Update all existing users to be premium
    const { data, error } = await supabase
      .from('users')
      .update({
        is_premium: true,
        membership_start_date: new Date().toISOString(),
        // membership_end_date remains NULL (no expiration)
      })
      .neq('id', 0); // Update all users except system users
    
    if (error) {
      console.error('❌ Error updating users:', error);
      return;
    }
    
    console.log('✅ Successfully updated all users to premium status');
    console.log('📊 Updated users count:', data?.length || 'unknown');
    
    // Verify the update
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, username, is_premium, membership_start_date')
      .order('id');
    
    if (fetchError) {
      console.error('❌ Error fetching users for verification:', fetchError);
      return;
    }
    
    console.log('📋 Verification - Current users:');
    users.forEach(user => {
      console.log(`  - ${user.username} (ID: ${user.id}): Premium: ${user.is_premium}, Start Date: ${user.membership_start_date}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
updateUsersToPremium(); 