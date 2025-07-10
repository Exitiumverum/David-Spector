-- =====================================================
-- SUPABASE SETUP FOR DAVID SPECTOR WEBSITE
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('apartments', 'private-homes', 'other-projects', 'concepts')),
  location TEXT NOT NULL,
  location_en TEXT,
  size TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  project_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PROJECT IMAGES TABLE
-- =====================================================
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT CHECK (image_type IN ('banner', 'gallery', 'before', 'after')),
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PROJECT CONTENT TABLE
-- =====================================================
CREATE TABLE project_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  content_hebrew TEXT NOT NULL,
  content_english TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. SITE CONTENT TABLE (for general text content)
-- =====================================================
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  hebrew TEXT NOT NULL,
  english TEXT,
  section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON project_images FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON project_content FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON site_content FOR SELECT USING (true);

-- Admin write access (for management system)
CREATE POLICY "Enable insert for authenticated users only" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON project_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON project_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON project_images FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON project_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON project_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON project_content FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON site_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON site_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON site_content FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_type ON project_images(image_type);
CREATE INDEX idx_project_content_project_id ON project_content(project_id);
CREATE INDEX idx_site_content_key ON site_content(key);
CREATE INDEX idx_site_content_section ON site_content(section);

-- =====================================================
-- 7. SAMPLE DATA - EXISTING PROJECTS
-- =====================================================

-- Athens Penthouse Project
INSERT INTO projects (
  slug, title, title_en, description, description_en, 
  category, location, location_en, size, featured, project_details
) VALUES (
  'athens-penthouse',
  'נטהאוס באתונה',
  'Athens Penthouse',
  'עיצוב פנטהאוס מודרני',
  'Modern penthouse design',
  'apartments',
  'אתונה',
  'Athens',
  '38 מ"ר',
  true,
  '{
    "before_after_pairs": [
      {
        "before": "/images/projects/athens-penthouse/Before01.png",
        "after": "/images/projects/athens-penthouse/After01.png",
        "label": "לפני ואחרי - מרפסת"
      },
      {
        "before": "/images/projects/athens-penthouse/Before02.png",
        "after": "/images/projects/athens-penthouse/After02.png",
        "label": "לפני ואחרי - סלון"
      }
    ]
  }'
);

-- Athens 26m Project
INSERT INTO projects (
  slug, title, title_en, description, description_en, 
  category, location, location_en, size, featured
) VALUES (
  'athens-26m',
  'דירת 26 מ"ר באתונה',
  '26m² Athens Apartment',
  'עיצוב דירה קומפקטית באתונה',
  'Compact apartment design in Athens',
  'apartments',
  'אתונה',
  'Athens',
  '26 מ"ר',
  false
);

-- Athens 21m Project
INSERT INTO projects (
  slug, title, title_en, description, description_en, 
  category, location, location_en, size, featured
) VALUES (
  'athens-21m',
  'דירת 21 מ"ר באתונה',
  '21m² Athens Apartment',
  'עיצוב דירה קומפקטית באתונה',
  'Compact apartment design in Athens',
  'apartments',
  'אתונה',
  'Athens',
  '21 מ"ר',
  false
);

-- Kipsli 28m Project
INSERT INTO projects (
  slug, title, title_en, description, description_en, 
  category, location, location_en, size, featured
) VALUES (
  'kipsli-28m',
  'דירת 28 מ"ר בקיפסלי',
  '28m² Kipsli Apartment',
  'עיצוב דירה קומפקטית בקיפסלי',
  'Compact apartment design in Kipsli',
  'apartments',
  'קיפסלי',
  'Kipsli',
  '28 מ"ר',
  false
);

-- Ashdod Studio Project
INSERT INTO projects (
  slug, title, title_en, description, description_en, 
  category, location, location_en, size, featured
) VALUES (
  'ashdod-studio',
  'פרויקט קונספט באשדוד',
  'Ashdod Studio Concept',
  'פרויקט מגורים באשדוד רובע א',
  'Residential project in Ashdod District A',
  'concepts',
  'אשדוד',
  'Ashdod',
  'שכונת מגורים',
  false
);

-- Drawings Gallery Project
INSERT INTO projects (
  slug, title, title_en, description, description_en, 
  category, location, location_en, size, featured
) VALUES (
  'drawings-gallery',
  'גלריית איורים אמנותיים',
  'Artistic Drawings Gallery',
  'אוסף איורים אישיים וסקיצות אמנותיות',
  'Personal drawings and artistic sketches collection',
  'concepts',
  '',
  '',
  '',
  false
);

-- =====================================================
-- 8. PROJECT IMAGES DATA
-- =====================================================

-- Athens Penthouse Images
INSERT INTO project_images (project_id, image_url, image_type, display_order, alt_text)
SELECT 
  p.id,
  image_url,
  image_type,
  display_order,
  alt_text
FROM projects p
CROSS JOIN (
  VALUES 
    ('/images/projects/athens-penthouse/01.jpg', 'banner', 1, 'Athens Penthouse Banner'),
    ('/images/projects/athens-penthouse/01.jpg', 'gallery', 1, 'Athens Penthouse 1'),
    ('/images/projects/athens-penthouse/02.png', 'gallery', 2, 'Athens Penthouse 2'),
    ('/images/projects/athens-penthouse/03.png', 'gallery', 3, 'Athens Penthouse 3'),
    ('/images/projects/athens-penthouse/04.jpg', 'gallery', 4, 'Athens Penthouse 4'),
    ('/images/projects/athens-penthouse/05.png', 'gallery', 5, 'Athens Penthouse 5'),
    ('/images/projects/athens-penthouse/06.png', 'gallery', 6, 'Athens Penthouse 6'),
    ('/images/projects/athens-penthouse/07.png', 'gallery', 7, 'Athens Penthouse 7'),
    ('/images/projects/athens-penthouse/08.png', 'gallery', 8, 'Athens Penthouse 8'),
    ('/images/projects/athens-penthouse/09.jpg', 'gallery', 9, 'Athens Penthouse 9'),
    ('/images/projects/athens-penthouse/10.png', 'gallery', 10, 'Athens Penthouse 10'),
    ('/images/projects/athens-penthouse/11.png', 'gallery', 11, 'Athens Penthouse 11'),
    ('/images/projects/athens-penthouse/Before01.png', 'before', 1, 'Athens Penthouse Before 1'),
    ('/images/projects/athens-penthouse/After01.png', 'after', 1, 'Athens Penthouse After 1'),
    ('/images/projects/athens-penthouse/Before02.png', 'before', 2, 'Athens Penthouse Before 2'),
    ('/images/projects/athens-penthouse/After02.png', 'after', 2, 'Athens Penthouse After 2')
) AS images(image_url, image_type, display_order, alt_text)
WHERE p.slug = 'athens-penthouse';

-- Athens 26m Images
INSERT INTO project_images (project_id, image_url, image_type, display_order, alt_text)
SELECT 
  p.id,
  image_url,
  image_type,
  display_order,
  alt_text
FROM projects p
CROSS JOIN (
  VALUES 
    ('/images/projects/athens-26m/01.png', 'banner', 1, 'Athens 26m Banner'),
    ('/images/projects/athens-26m/01.png', 'gallery', 1, 'Athens 26m 1')
) AS images(image_url, image_type, display_order, alt_text)
WHERE p.slug = 'athens-26m';

-- Athens 21m Images
INSERT INTO project_images (project_id, image_url, image_type, display_order, alt_text)
SELECT 
  p.id,
  image_url,
  image_type,
  display_order,
  alt_text
FROM projects p
CROSS JOIN (
  VALUES 
    ('/images/projects/athens-21m/01.png', 'banner', 1, 'Athens 21m Banner'),
    ('/images/projects/athens-21m/01.png', 'gallery', 1, 'Athens 21m 1')
) AS images(image_url, image_type, display_order, alt_text)
WHERE p.slug = 'athens-21m';

-- Kipsli 28m Images
INSERT INTO project_images (project_id, image_url, image_type, display_order, alt_text)
SELECT 
  p.id,
  image_url,
  image_type,
  display_order,
  alt_text
FROM projects p
CROSS JOIN (
  VALUES 
    ('/images/projects/kipsli-28m/03.jpeg', 'banner', 1, 'Kipsli 28m Banner'),
    ('/images/projects/kipsli-28m/03.jpeg', 'gallery', 1, 'Kipsli 28m 1')
) AS images(image_url, image_type, display_order, alt_text)
WHERE p.slug = 'kipsli-28m';

-- Ashdod Studio Images
INSERT INTO project_images (project_id, image_url, image_type, display_order, alt_text)
SELECT 
  p.id,
  image_url,
  image_type,
  display_order,
  alt_text
FROM projects p
CROSS JOIN (
  VALUES 
    ('/images/projects/ashdod-studio/01.png', 'banner', 1, 'Ashdod Studio Banner'),
    ('/images/projects/ashdod-studio/01.png', 'gallery', 1, 'Ashdod Studio 1')
) AS images(image_url, image_type, display_order, alt_text)
WHERE p.slug = 'ashdod-studio';

-- Drawings Gallery Images
INSERT INTO project_images (project_id, image_url, image_type, display_order, alt_text)
SELECT 
  p.id,
  image_url,
  image_type,
  display_order,
  alt_text
FROM projects p
CROSS JOIN (
  VALUES 
    ('/images/projects/drawings-gallery/01.jpg', 'banner', 1, 'Drawings Gallery Banner'),
    ('/images/projects/drawings-gallery/01.jpg', 'gallery', 1, 'Drawings Gallery 1')
) AS images(image_url, image_type, display_order, alt_text)
WHERE p.slug = 'drawings-gallery';

-- =====================================================
-- 9. PROJECT CONTENT DATA
-- =====================================================

-- Athens Penthouse Content
INSERT INTO project_content (project_id, section, content_hebrew, display_order)
SELECT 
  p.id,
  'project_description',
  'קיבלתי לטיפולי בפרויקט מהנה במיוחד של עיצוב מחדש לפנטהאוס נטוש באתונה במטרה להשביחו.

לבקשת הלקוח השפה העיצובית שילבה בטון ועץ.

חילקתי את החלל לחדר שינה וחדר עבודה כשרהיט דו-צדדי משמש כמחיצה.

מיקמתי חדר רחצה מואר במקום המטבח, ואת המטבח העברתי לחלל המגורים הפתוח בוויטרינה.

המרפסת כוללת ג''קוזי בנוי ופינת ישיבה מוקפת צמחייה.

העיצוב שומר על תחושת חמימות מודרנית ומנצל את הנוף האורבני של אתונה.',
  1
FROM projects p WHERE p.slug = 'athens-penthouse';

INSERT INTO project_content (project_id, section, content_hebrew, display_order)
SELECT 
  p.id,
  'details',
  'מיקום: אתונה, יוון
גודל: 38 מ"ר',
  2
FROM projects p WHERE p.slug = 'athens-penthouse';

-- =====================================================
-- 10. SITE CONTENT DATA
-- =====================================================

INSERT INTO site_content (key, hebrew, section) VALUES
('home_hero_title', 'דוד ספקטור', 'home'),
('home_hero_subtitle', 'אדריכלות ועיצוב פנים', 'home'),
('home_about_title', 'נעים להכיר!', 'home'),
('home_about_content', 'אני מאמין שהמרחב שסביבנו משפיע על איך שאנחנו מרגישים, חושבים, ואפילו על מערכות היחסים שלנו. לפעמים קשה לשים את האצבע על מה הופך חלל ל"נעים" או "קודר" – אבל כולנו מרגישים את זה מיד.

דרך עיצוב, תכנון והדמיה, אני עוזר לאנשים לראות את הפוטנציאל האמיתי של נכסים – בין אם הם גרים בהם, משכירים אותם או רוצים לקנות נכס.

שינוי קטן יכול לעשות הבדל ענק – בדיוק בשביל זה אני כאן.

צברתי ניסיון עשיר בתכנון, עיצוב וניהול פרויקטים – מדירות ובתים פרטיים ועד שכונות של מאות יחידות דיור במשרד פיבקו אדריכלים ועוד. כיום אני משלב את תחומי ההתמחות שלי – אדריכלות, עיצוב פנים ותיווך נדל"ן ברימקס אושן תל אביב – כדי להעניק לכם פתרון שלם, מקצועי ומדויק.

בזכות ההבנה הרחבה שלי במרחב, בערך שעיצוב טוב נותן ובשוק הנדל"ן, אני רואה את הנכס שלכם לא רק כמו שהוא – אלא כמו שהוא יכול להיות.', 'home'),
('home_contact_title', 'בואו ניצור משהו יוצא דופן', 'home'),
('projects_page_title', 'פרויקטים', 'projects'),
('projects_page_description', 'גלריית הפרויקטים שלנו מציגה את העבודה שלנו בתחום האדריכלות ועיצוב הפנים', 'projects'); 