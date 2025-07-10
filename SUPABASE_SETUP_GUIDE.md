# Supabase Setup Guide for David Spector Website

## 🚀 **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your **Project URL** and **Anon Key**

## 🔧 **Step 2: Set Up Environment Variables**

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ **Step 3: Create Database Tables**

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content from `supabase-setup.sql`
4. Click **Run** to execute all the SQL commands

This will create:
- ✅ **4 tables** (projects, project_images, project_content, site_content)
- ✅ **Security policies** (RLS enabled)
- ✅ **Performance indexes**
- ✅ **Sample data** (all your existing projects)

## 📁 **Step 4: Create Storage Buckets**

In Supabase Dashboard > **Storage**:

### **Bucket 1: project-images**
- **Name**: `project-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 10MB
- **Allowed MIME types**: `image/*`

### **Bucket 2: site-content**
- **Name**: `site-content`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

## 🔐 **Step 5: Set Storage Policies**

In **Storage > Policies**, add these policies for both buckets:

### **Public Read Access**
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'site-content');
```

### **Authenticated Upload/Update/Delete**
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Same for site-content bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-content' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'site-content' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'site-content' AND auth.role() = 'authenticated');
```

## 📊 **Step 6: Verify Data**

After running the SQL, you should have:

### **Projects Table** (6 projects):
- ✅ Athens Penthouse (featured)
- ✅ Athens 26m
- ✅ Athens 21m
- ✅ Kipsli 28m
- ✅ Ashdod Studio
- ✅ Drawings Gallery

### **Project Images** (all your existing images):
- ✅ Banner images
- ✅ Gallery images
- ✅ Before/After images for Athens Penthouse

### **Site Content** (text content):
- ✅ Home page content
- ✅ Projects page content

## 🔍 **Step 7: Test the Setup**

1. **Install Supabase client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Test connection** (optional):
   ```bash
   npm run dev
   ```
   Then visit `/management` to test the connection

## 📋 **What's Included in the Setup**

### **Database Tables:**
- **`projects`** - Main project information
- **`project_images`** - All project images with types
- **`project_content`** - Detailed project content
- **`site_content`** - General website text content

### **Features:**
- ✅ **Hebrew and English support**
- ✅ **Before/After image pairs**
- ✅ **Project categories and filtering**
- ✅ **Featured projects**
- ✅ **SEO-friendly slugs**
- ✅ **Image galleries**
- ✅ **Security policies**

### **Sample Data:**
- ✅ **All 6 existing projects** with their data
- ✅ **All project images** properly categorized
- ✅ **Before/After images** for Athens Penthouse
- ✅ **Site content** for home and projects pages

## 🎯 **Next Steps**

After completing this setup:

1. **Update your management system** to use Supabase
2. **Update your website** to fetch data from Supabase
3. **Test the management interface** with real data
4. **Add new projects** through the management system

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Cannot find module '@supabase/supabase-js'"**
   - Run: `npm install @supabase/supabase-js`

2. **"Invalid API key"**
   - Check your `.env.local` file
   - Verify the URL and key from Supabase dashboard

3. **"Policy violation"**
   - Make sure RLS policies are set up correctly
   - Check that you're authenticated for write operations

4. **"Table doesn't exist"**
   - Run the SQL script again
   - Check that all tables were created successfully

## 📞 **Support**

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify your environment variables
3. Test the connection with a simple query

Your database is now ready with all your existing projects! 🎉 