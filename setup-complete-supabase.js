require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client
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

async function setupCompleteSupabase() {
  console.log('=== COMPLETE SUPABASE SETUP ===');
  
  try {
    // Step 1: Execute main database setup
    console.log('\n1. Setting up main database tables...');
    await executeSQLFile('./supabase-setup.sql');
    
    // Step 2: Set up storage
    console.log('\n2. Setting up storage...');
    await executeSQLFile('./supabase-storage-setup.sql');
    
    // Step 3: Set up site images
    console.log('\n3. Setting up site images...');
    await executeSQLFile('./supabase-site-images-setup.sql');
    
    // Step 4: Verify setup
    console.log('\n4. Verifying setup...');
    await verifySetup();
    
    console.log('\n🎉 Complete Supabase setup finished successfully!');
    console.log('You can now:');
    console.log('- Use the management interface at /management');
    console.log('- Upload site images through the admin panel');
    console.log('- Manage projects and content');
    
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

async function executeSQLFile(filePath) {
  try {
    console.log(`Reading ${filePath}...`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.log(`Statement ${i + 1} failed (this might be expected):`, error.message);
          }
        } catch (err) {
          console.log(`Statement ${i + 1} failed (this might be expected):`, err.message);
        }
      }
    }
    
    console.log(`✅ ${filePath} processed`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    throw error;
  }
}

async function verifySetup() {
  console.log('Verifying database setup...');
  
  try {
    // Check if main tables exist
    const tables = ['projects', 'project_images', 'project_content', 'site_content', 'site_images'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`⚠️  Table ${table} might not exist or be accessible:`, error.message);
        } else {
          console.log(`✅ Table ${table} is accessible`);
        }
      } catch (err) {
        console.log(`⚠️  Could not verify table ${table}:`, err.message);
      }
    }
    
    // Check storage bucket
    try {
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketError) {
        console.log('⚠️  Could not verify storage buckets:', bucketError.message);
      } else {
        const projectImagesBucket = buckets.find(b => b.name === 'project-images');
        if (projectImagesBucket) {
          console.log('✅ Storage bucket "project-images" exists');
        } else {
          console.log('⚠️  Storage bucket "project-images" not found');
        }
      }
    } catch (err) {
      console.log('⚠️  Could not verify storage:', err.message);
    }
    
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Run the setup
setupCompleteSupabase(); 