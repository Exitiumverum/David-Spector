require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupAdminUser() {
  console.log('=== SETTING UP ADMIN USER ===');
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@davidspector.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'spector_94D';
  
  console.log(`Admin Email: ${adminEmail}`);
  console.log('Admin Password: (hidden)');
  
  try {
    // Try to sign in to check if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (signInData.user) {
      console.log('✅ Admin user already exists and can sign in');
      console.log(`User ID: ${signInData.user.id}`);
      console.log(`Email: ${signInData.user.email}`);
      console.log(`Email confirmed: ${signInData.user.email_confirmed_at ? 'Yes' : 'No'}`);
      
      // Sign out after checking
      await supabase.auth.signOut();
      return;
    }
    
    // If sign in failed, try to create the user
    console.log('Creating new admin user...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin'
      }
    });
    
    if (createError) {
      console.error('Error creating admin user:', createError.message);
      
      // If user might already exist but with different password, try to reset
      console.log('Attempting to reset password for existing user...');
      const { error: resetError } = await supabase.auth.admin.updateUserById(
        newUser?.user?.id || 'temp',
        { password: adminPassword }
      );
      
      if (resetError) {
        console.error('Could not create or update user. Please check Supabase dashboard.');
        return;
      }
    }
    
    console.log('✅ Admin user created/updated successfully!');
    console.log(`User ID: ${newUser?.user?.id || 'Unknown'}`);
    console.log(`Email: ${adminEmail}`);
    
    console.log('\n📝 Login credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('Setup failed:', error);
    console.log('\n💡 Alternative: Create the user manually in Supabase Dashboard:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Authentication > Users');
    console.log('3. Click "Add User"');
    console.log(`4. Email: ${adminEmail}`);
    console.log(`5. Password: ${adminPassword}`);
    console.log('6. Mark email as confirmed');
  }
}

// Run the setup
setupAdminUser(); 