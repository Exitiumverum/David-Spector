require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

const imagesToUpload = [
  {
    key: 'home_banner',
    label: 'תמונת Banner ראשי',
    localPath: path.join(__dirname, 'public/images/Homes2/10.jpg'),
    storagePath: 'site/home_banner.jpg',
    altText: 'תמונת Banner ראשי'
  },
  {
    key: 'profile_picture',
    label: 'תמונת פרופיל',
    localPath: path.join(__dirname, 'public/images/Logos/DavidSpector.jpeg'),
    storagePath: 'site/profile_picture.jpeg',
    altText: 'תמונת פרופיל של דוד ספקטור'
  },
  {
    key: 'contact_hero',
    label: 'תמונת Banner צור קשר',
    localPath: path.join(__dirname, 'public/images/Homes2/9.png'),
    storagePath: 'site/contact_hero.png',
    altText: 'תמונת הרקע בדף צור קשר'
  }
];

async function uploadImageAndSaveRecord(image) {
  console.log(`Uploading ${image.label}...`);
  const fileBuffer = fs.readFileSync(image.localPath);

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(image.storagePath, fileBuffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: getContentType(image.storagePath)
    });

  if (uploadError && !uploadError.message.includes('The resource already exists')) {
    console.error(`Error uploading ${image.label}:`, uploadError.message);
    return;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('project-images')
    .getPublicUrl(image.storagePath);
  const publicUrl = publicUrlData.publicUrl;

  // Upsert into site_images table
  const { data: existing, error: fetchError } = await supabase
    .from('site_images')
    .select('*')
    .eq('key', image.key)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error(`Error checking existing record for ${image.key}:`, fetchError.message);
    return;
  }

  if (existing) {
    // Update
    const { error: updateError } = await supabase
      .from('site_images')
      .update({ image_url: publicUrl, alt_text: image.altText })
      .eq('key', image.key);
    if (updateError) {
      console.error(`Error updating site_images for ${image.key}:`, updateError.message);
      return;
    }
    console.log(`Updated site_images record for ${image.key}`);
  } else {
    // Insert
    const { error: insertError } = await supabase
      .from('site_images')
      .insert({ key: image.key, image_url: publicUrl, alt_text: image.altText });
    if (insertError) {
      console.error(`Error inserting site_images for ${image.key}:`, insertError.message);
      return;
    }
    console.log(`Inserted site_images record for ${image.key}`);
  }
  console.log(`✅ ${image.label} uploaded and saved.`);
}

function getContentType(filename) {
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  if (filename.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

async function main() {
  for (const image of imagesToUpload) {
    if (!fs.existsSync(image.localPath)) {
      console.error(`File not found: ${image.localPath}`);
      continue;
    }
    await uploadImageAndSaveRecord(image);
  }
  console.log('\nAll images processed.');
}

main(); 