-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');

-- Create storage policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Create storage policy to allow service role to upload (for admin operations)
CREATE POLICY "Service role can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'service_role');

-- Create storage policy to allow service role to delete
CREATE POLICY "Service role can delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'project-images' AND auth.role() = 'service_role');

-- Create storage policy to allow service role to update
CREATE POLICY "Service role can update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'project-images' AND auth.role() = 'service_role'); 