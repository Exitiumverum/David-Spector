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

async function setupSiteImages() {
  console.log('=== SETTING UP SITE IMAGES ===');
  
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('./supabase-site-images-setup.sql', 'utf8');
    
    console.log('SQL file loaded successfully');
    console.log('Executing SQL commands...');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error executing SQL:', error);
      
      // If the RPC method doesn't exist, we'll need to execute the SQL manually
      console.log('Trying manual execution...');
      await executeSQLManually();
    } else {
      console.log('✅ SQL executed successfully!');
    }
    
    // Verify the table was created
    await verifyTable();
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

async function executeSQLManually() {
  console.log('Executing SQL commands manually...');
  
  try {
    // Check if site_images table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'site_images');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
      return;
    }
    
    if (tables.length === 0) {
      console.log('site_images table does not exist. Please create it manually in Supabase dashboard.');
      console.log('Run the SQL from supabase-site-images-setup.sql in your Supabase SQL editor.');
    } else {
      console.log('✅ site_images table exists');
    }
    
  } catch (error) {
    console.error('Manual execution failed:', error);
  }
}

async function verifyTable() {
  console.log('\n=== VERIFYING SITE IMAGES TABLE ===');
  
  try {
    // Check if we can query the site_images table
    const { data: images, error: imagesError } = await supabase
      .from('site_images')
      .select('*');
    
    if (imagesError) {
      console.error('Error checking site_images table:', imagesError);
      return;
    }
    
    console.log(`✅ site_images table is working`);
    console.log(`Found ${images.length} site images in database`);
    
    // Show some sample data
    if (images.length > 0) {
      const sampleImage = images[0];
      console.log('\n📷 Sample site image:');
      console.log(`Key: ${sampleImage.key}`);
      console.log(`URL: ${sampleImage.image_url}`);
      console.log(`Alt text: ${sampleImage.alt_text}`);
    }
    
    console.log('\n🎉 Site images setup completed successfully!');
    console.log('You can now use the management interface at /management to upload site images.');
    
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Run the setup
setupSiteImages(); 