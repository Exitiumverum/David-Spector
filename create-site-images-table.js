require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

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

async function createSiteImagesTable() {
  console.log('=== CREATING SITE IMAGES TABLE ===');
  
  try {
    // First, let's check if the table already exists
    const { data: existingTable, error: checkError } = await supabase
      .from('site_images')
      .select('*')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ site_images table already exists');
      return;
    }
    
    console.log('Creating site_images table...');
    
    // Since we can't execute raw SQL, we'll try to create the table by inserting a test record
    // This will fail if the table doesn't exist, but that's expected
    const { error: insertError } = await supabase
      .from('site_images')
      .insert({
        key: 'test',
        image_url: 'test',
        alt_text: 'test'
      });
    
    if (insertError && insertError.message && insertError.message.includes('relation "public.site_images" does not exist')) {
      console.log('❌ site_images table does not exist');
      console.log('Please create the table manually in your Supabase dashboard:');
      console.log('');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Run the following SQL:');
      console.log('');
      console.log(`
CREATE TABLE IF NOT EXISTS site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Create policies for site_images
CREATE POLICY "Enable read access for all users" ON site_images FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON site_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON site_images FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON site_images FOR DELETE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON site_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('');
      console.log('After creating the table, run this script again to verify.');
    } else if (insertError) {
      console.log('Error testing table:', insertError.message);
    } else {
      console.log('✅ site_images table exists and is working');
      // Clean up the test record
      await supabase
        .from('site_images')
        .delete()
        .eq('key', 'test');
    }
    
  } catch (error) {
    console.error('Error creating site_images table:', error);
  }
}

// Run the setup
createSiteImagesTable(); 