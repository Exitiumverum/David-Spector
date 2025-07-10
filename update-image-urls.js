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

async function updateImageUrls() {
  console.log('Starting image URL update process...');
  
  try {
    // Get all project images
    const { data: images, error } = await supabase
      .from('project_images')
      .select('*');
    
    if (error) {
      console.error('Error fetching images:', error);
      return;
    }
    
    console.log(`Found ${images.length} images to update`);
    
    // Update each image URL
    for (const image of images) {
      const oldUrl = image.image_url;
      
      // Convert local path to Supabase Storage URL
      // From: /images/projects/athens-penthouse/01.jpg
      // To: https://your-project.supabase.co/storage/v1/object/public/project-images/projects/athens-penthouse/01.jpg
      
      const pathMatch = oldUrl.match(/\/images\/projects\/(.+)/);
      if (pathMatch) {
        const storagePath = `projects/${pathMatch[1]}`;
        const newUrl = `${supabaseUrl}/storage/v1/object/public/project-images/${storagePath}`;
        
        console.log(`Updating: ${oldUrl} -> ${newUrl}`);
        
        // Update the image URL
        const { error: updateError } = await supabase
          .from('project_images')
          .update({ image_url: newUrl })
          .eq('id', image.id);
        
        if (updateError) {
          console.error(`Error updating image ${image.id}:`, updateError);
        } else {
          console.log(`✅ Updated image: ${image.id}`);
        }
      } else {
        console.log(`⚠️  Skipping image with non-standard URL: ${oldUrl}`);
      }
    }
    
    console.log('\nImage URL update process completed!');
    
  } catch (error) {
    console.error('Error in update process:', error);
  }
}

// Run the update
updateImageUrls().catch(console.error); 