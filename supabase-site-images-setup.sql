-- Create site_images table
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

-- Insert initial site images (optional - can be done through admin interface)
-- INSERT INTO site_images (key, image_url, alt_text) VALUES 
-- ('home_banner', 'https://your-supabase-url.supabase.co/storage/v1/object/public/project-images/default-banner.jpg', 'תמונת Banner ראשי'),
-- ('profile_picture', 'https://your-supabase-url.supabase.co/storage/v1/object/public/project-images/default-profile.jpg', 'תמונת פרופיל של דוד ספקטור'); 