import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://epcqeqcqqzzpolymqflm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FlcWNxcXp6cG9seW1xZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTkxODksImV4cCI6MjA2NzgzNTE4OX0.1eEibQkblIem4TkAIkh9afrHiqm1EOURw3hvUDMjbLw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addMembershipColumns() {
  try {
    console.log('🔄 Adding membership tracking columns to users table...');
    
    // Note: This would typically be done through Supabase migrations
    // For now, we'll just update the existing users to be premium
    // The new columns will be added when we run the schema migration
    
    console.log('📝 Note: New columns will be added when schema is migrated');
    console.log('🔄 Updating existing users to premium status...');
    
    // Update all existing users to be premium (without new columns for now)
    const { data, error } = await supabase
      .from('users')
      .update({
        is_premium: true,
      })
      .neq('id', 0); // Update all users except system users
    
    if (error) {
      console.error('❌ Error updating users:', error);
      return;
    }
    
    console.log('✅ Successfully updated all users to premium status');
    
    // Verify the update
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, username, is_premium')
      .order('id');
    
    if (fetchError) {
      console.error('❌ Error fetching users for verification:', fetchError);
      return;
    }
    
    console.log('📋 Verification - Current users:');
    users.forEach(user => {
      console.log(`  - ${user.username} (ID: ${user.id}): Premium: ${user.is_premium}`);
    });
    
    console.log('✅ All users are now premium!');
    console.log('📝 Next steps:');
    console.log('  1. Run schema migration to add new columns');
    console.log('  2. Update existing users with membership dates');
    console.log('  3. Test premium features');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
addMembershipColumns(); 