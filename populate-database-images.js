require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

// Function to get all image files from a project directory
function getProjectImages(projectSlug) {
  const projectPath = path.join(__dirname, 'public', 'images', 'projects', projectSlug);
  
  if (!fs.existsSync(projectPath)) {
    console.log(`⚠️  Project directory not found: ${projectPath}`);
    return [];
  }
  
  const files = fs.readdirSync(projectPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
}

// Get all project directories
function getProjectSlugs() {
  const projectsPath = path.join(__dirname, 'public', 'images', 'projects');
  
  if (!fs.existsSync(projectsPath)) {
    console.error('Projects directory not found:', projectsPath);
    return [];
  }
  
  return fs.readdirSync(projectsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

async function populateDatabaseImages() {
  console.log('=== POPULATING DATABASE WITH IMAGES ===');
  
  try {
    // First, get all projects from database
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, slug, title')
      .order('slug');
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return;
    }
    
    console.log(`Found ${projects.length} projects in database`);
    
    const projectSlugs = getProjectSlugs();
    console.log(`Found ${projectSlugs.length} project directories: ${projectSlugs.join(', ')}`);
    
    for (const project of projects) {
      console.log(`\n=== PROCESSING PROJECT: ${project.slug} ===`);
      
      // Get all images for this project from local directory
      const images = getProjectImages(project.slug);
      console.log(`Found ${images.length} images in directory for ${project.slug}`);
      
      // Create database records for each image
      const imageRecords = [];
      let displayOrder = 0;
      
      for (const imageName of images) {
        const storageUrl = `${supabaseUrl}/storage/v1/object/public/project-images/projects/${project.slug}/${imageName}`;
        
        // Determine image type based on filename
        let imageType = 'gallery';
        let altText = `Image ${imageName}`;
        
        if (imageName.toLowerCase().includes('before')) {
          imageType = 'before';
          altText = `${imageName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')} - Before`;
        } else if (imageName.toLowerCase().includes('after')) {
          imageType = 'after';
          altText = `${imageName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')} - After`;
        } else if (imageName.match(/^0?1\.(jpg|jpeg|png|gif|webp)$/i)) {
          // First image is banner
          imageType = 'banner';
          altText = `Banner for ${project.title}`;
        }
        
        imageRecords.push({
          project_id: project.id,
          image_url: storageUrl,
          image_type: imageType,
          display_order: displayOrder++,
          alt_text: altText
        });
      }
      
      console.log(`Creating ${imageRecords.length} image records for ${project.slug}`);
      
      // Delete existing images for this project
      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', project.id);
      
      if (deleteError) {
        console.error(`Error deleting existing images for ${project.slug}:`, deleteError);
        continue;
      }
      
      // Insert new image records
      if (imageRecords.length > 0) {
        const { data: insertedImages, error: insertError } = await supabase
          .from('project_images')
          .insert(imageRecords)
          .select();
        
        if (insertError) {
          console.error(`Error inserting images for ${project.slug}:`, insertError);
        } else {
          console.log(`✅ Successfully inserted ${insertedImages.length} images for ${project.slug}`);
          
          // Log summary by type
          const byType = {
            banner: insertedImages.filter(img => img.image_type === 'banner').length,
            gallery: insertedImages.filter(img => img.image_type === 'gallery').length,
            before: insertedImages.filter(img => img.image_type === 'before').length,
            after: insertedImages.filter(img => img.image_type === 'after').length
          };
          
          console.log(`  Banner: ${byType.banner}, Gallery: ${byType.gallery}, Before: ${byType.before}, After: ${byType.after}`);
        }
      }
    }
    
    console.log('\n=== DATABASE POPULATION COMPLETED ===');
    
  } catch (error) {
    console.error('Error in population process:', error);
  }
}

// Run the population
populateDatabaseImages().catch(console.error); 