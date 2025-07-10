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

async function uploadImages() {
  console.log('Starting image upload process...');
  
  const projectSlugs = getProjectSlugs();
  console.log(`Found ${projectSlugs.length} projects: ${projectSlugs.join(', ')}`);
  
  // List of images that failed in the previous upload
  const failedImages = [
    'ashdod-studio/14.png',
    'ashdod-studio/15.png', 
    'drawings-gallery/08.png',
    'drawings-gallery/14.png'
  ];
  
  for (const projectSlug of projectSlugs) {
    console.log(`\nProcessing project: ${projectSlug}`);
    
    const images = getProjectImages(projectSlug);
    console.log(`Found ${images.length} images in ${projectSlug}`);
    
    for (const imageName of images) {
      const localPath = path.join(__dirname, 'public', 'images', 'projects', projectSlug, imageName);
      const storagePath = `projects/${projectSlug}/${imageName}`;
      
      // Check if this is one of the failed images or if we should upload all
      const isFailedImage = failedImages.includes(`${projectSlug}/${imageName}`);
      
      try {
        // Check if file exists locally
        if (!fs.existsSync(localPath)) {
          console.log(`⚠️  File not found: ${localPath}`);
          continue;
        }
        
        // Check if file already exists in storage
        const { data: existingFile } = await supabase.storage
          .from('project-images')
          .list(`projects/${projectSlug}`, {
            search: imageName
          });
        
        if (existingFile && existingFile.length > 0) {
          console.log(`⏭️  Skipping existing file: ${imageName}`);
          continue;
        }
        
        // Read file
        const fileBuffer = fs.readFileSync(localPath);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('project-images')
          .upload(storagePath, fileBuffer, {
            cacheControl: '3600',
            upsert: true // Overwrite if exists
          });
        
        if (error) {
          console.error(`❌ Error uploading ${imageName}:`, error);
        } else {
          console.log(`✅ Uploaded: ${imageName}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${imageName}:`, error);
      }
    }
  }
  
  console.log('\nUpload process completed!');
}

// Run the upload
uploadImages().catch(console.error); 