# Management System Setup Guide

## Overview
This management system allows you to add new projects and edit text content on your website. It's designed to be secure and easy to use.

## Current Features
- **Project Management**: Add, edit, and delete projects
- **Content Management**: Edit text content throughout the site
- **Secure Authentication**: Password-protected access
- **Hebrew Support**: Full RTL and Hebrew text support

## Access
Navigate to `/management` to access the admin interface.

**Default Password**: `admin123` (Change this immediately!)

## Setting up Supabase Integration

### 1. Install Supabase Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables
Create a `.env.local` file in your project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema
Create these tables in your Supabase database:

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Content Table
```sql
CREATE TABLE content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  hebrew TEXT NOT NULL,
  english TEXT,
  section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Row Level Security (RLS)
Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for content table
CREATE POLICY "Enable read access for all users" ON content FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON content FOR DELETE USING (auth.role() = 'authenticated');
```

### 5. Update the Management Page
Replace the simple password authentication in `/src/app/management/page.tsx` with Supabase auth:

```typescript
// Replace the handleLogin function with:
const handleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (error) throw error;
    setIsAuthenticated(true);
  } catch (error) {
    alert('שגיאה בהתחברות');
  }
};
```

### 6. Connect to API
Update the API routes in `/src/app/api/management/` to use Supabase instead of the placeholder code.

## Security Recommendations

1. **Change Default Password**: Immediately change the default password
2. **Use Environment Variables**: Never hardcode credentials
3. **Enable HTTPS**: Ensure your site uses HTTPS in production
4. **Rate Limiting**: Consider adding rate limiting to prevent brute force attacks
5. **Session Management**: Implement proper session management with Supabase
6. **Input Validation**: Always validate and sanitize user input

## Usage

### Adding Projects
1. Navigate to the "פרויקטים" tab
2. Fill in the project details:
   - Title (כותרת)
   - Category (קטגוריה)
   - Description (תיאור)
   - Featured checkbox for highlighted projects
3. Click "הוסף פרויקט"

### Editing Content
1. Navigate to the "תוכן טקסט" tab
2. Click "ערוך" on any content item
3. Modify the text in the modal
4. Click "שמור" to save changes

## File Structure
```
src/
├── app/
│   ├── management/
│   │   └── page.tsx          # Main management interface
│   └── api/
│       └── management/
│           ├── projects/
│           │   └── route.ts  # Project API endpoints
│           └── content/
│               └── route.ts  # Content API endpoints
└── lib/
    └── supabase.ts           # Supabase utilities
```

## Next Steps
1. Set up Supabase project
2. Install dependencies
3. Configure environment variables
4. Create database tables
5. Update authentication
6. Test the management interface

## Support
For issues or questions, refer to the Supabase documentation or contact your developer. 