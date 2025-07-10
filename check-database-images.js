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

async function checkDatabaseImages() {
  console.log('=== CHECKING DATABASE IMAGES ===');
  
  try {
    // First, get all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, slug, title')
      .order('slug');
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return;
    }
    
    console.log(`Found ${projects.length} projects in database`);
    
    // Check images for each project
    for (const project of projects) {
      console.log(`\n=== PROJECT: ${project.slug} (${project.title}) ===`);
      console.log(`Project ID: ${project.id}`);
      
      // Get all images for this project
      const { data: images, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', project.id)
        .order('display_order');
      
      if (imagesError) {
        console.error(`Error fetching images for ${project.slug}:`, imagesError);
        continue;
      }
      
      console.log(`Total images in database: ${images.length}`);
      
      // Group images by type
      const byType = {
        banner: images.filter(img => img.image_type === 'banner'),
        gallery: images.filter(img => img.image_type === 'gallery'),
        before: images.filter(img => img.image_type === 'before'),
        after: images.filter(img => img.image_type === 'after')
      };
      
      console.log(`Banner images: ${byType.banner.length}`);
      console.log(`Gallery images: ${byType.gallery.length}`);
      console.log(`Before images: ${byType.before.length}`);
      console.log(`After images: ${byType.after.length}`);
      
      // Show first few images of each type
      if (byType.banner.length > 0) {
        console.log('Banner images:');
        byType.banner.forEach((img, i) => {
          console.log(`  ${i + 1}. ${img.image_url}`);
        });
      }
      
      if (byType.gallery.length > 0) {
        console.log('Gallery images:');
        byType.gallery.slice(0, 5).forEach((img, i) => {
          console.log(`  ${i + 1}. ${img.image_url}`);
        });
        if (byType.gallery.length > 5) {
          console.log(`  ... and ${byType.gallery.length - 5} more`);
        }
      }
      
      if (byType.before.length > 0) {
        console.log('Before images:');
        byType.before.forEach((img, i) => {
          console.log(`  ${i + 1}. ${img.image_url}`);
        });
      }
      
      if (byType.after.length > 0) {
        console.log('After images:');
        byType.after.forEach((img, i) => {
          console.log(`  ${i + 1}. ${img.image_url}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error in check process:', error);
  }
}

// Run the check
checkDatabaseImages().catch(console.error); 