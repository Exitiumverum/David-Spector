'use client';

import { useState, useEffect } from 'react';
import { siteContentService, SiteContent } from '@/lib/supabase';

interface ContentSection {
  key: string;
  label: string;
  description: string;
  section: string;
}

const CONTENT_SECTIONS: ContentSection[] = [
  // Home page content (from src/app/page.tsx)
  { key: 'home_hero_title', label: 'כותרת ראשית', description: 'כותרת הדף הראשי (דוד ספקטור)', section: 'home' },
  { key: 'home_hero_subtitle', label: 'כותרת משנה', description: 'כותרת משנה בדף הראשי (אדריכלות ועיצוב פנים)', section: 'home' },
  { key: 'home_about_title', label: 'כותרת אודות', description: 'כותרת סעיף האודות בדף הראשי (נעים להכיר!)', section: 'home' },
  { key: 'home_about_content', label: 'תוכן אודות', description: 'תוכן סעיף האודות בדף הראשי', section: 'home' },
  { key: 'home_contact_title', label: 'כותרת יצירת קשר', description: 'כותרת סעיף יצירת קשר בדף הראשי (בואו ניצור משהו יוצא דופן)', section: 'home' },
  
  // Projects page content (from src/app/projects/page.tsx)
  { key: 'projects_page_title', label: 'כותרת דף פרויקטים', description: 'כותרת דף הפרויקטים (פרויקטים)', section: 'projects' },
  { key: 'projects_page_description', label: 'תיאור דף פרויקטים', description: 'תיאור דף הפרויקטים', section: 'projects' },
  
  // About page content (from src/app/about/page.tsx)
  { key: 'about_title', label: 'כותרת דף אודות', description: 'כותרת דף האודות', section: 'about' },
  { key: 'about_intro', label: 'הקדמה', description: 'טקסט הקדמה בדף האודות', section: 'about' },
  { key: 'about_mission', label: 'פסקה א', description: 'פסקה א בדף האודות', section: 'about' },
  { key: 'about_impact', label: 'פסקה ב', description: 'פסקה ב בדף האודות', section: 'about' },
  { key: 'about_experience', label: 'פסקה ג', description: 'פסקה ג בדף האודות', section: 'about' },
  { key: 'about_vision', label: 'פסקה ד', description: 'פסקה ד בדף האודות', section: 'about' },
  
  // Contact page content (only the requested fields)
  { key: 'contact_hero_title', label: 'כותרת יצירת קשר', description: 'בואו נדבר', section: 'contact' },
  { key: 'contact_hero_subtitle', label: 'כותרת משנה יצירת קשר', description: 'אשמח לשמוע מכם ולענות על כל שאלה', section: 'contact' },
  { key: 'contact_section_title', label: 'כותרת סעיף יצירת קשר', description: 'צור קשר', section: 'contact' },
  { key: 'contact_section_description', label: 'תיאור סעיף יצירת קשר', description: 'אשמח לשמוע מכם ולענות על כל שאלה. מלאו את הטופס ואחזור אליכם בהקדם.', section: 'contact' },
  
  // Footer content (from src/app/page.tsx footer) - only copyright is editable
  { key: 'footer_copyright', label: 'זכויות יוצרים', description: 'טקסט זכויות יוצרים בפוטר', section: 'footer' }
];

// Default values for content sections
const DEFAULT_CONTENT: Record<string, { hebrew: string }> = {
  'home_hero_title': { hebrew: 'דוד ספקטור' },
  'home_hero_subtitle': { hebrew: 'אדריכלות ועיצוב פנים' },
  'home_about_title': { hebrew: 'נעים להכיר!' },
  'home_about_content': { 
    hebrew: 'אני מאמין שהמרחב שסביבנו משפיע על איך שאנחנו מרגישים, חושבים, ואפילו על מערכות היחסים שלנו. לפעמים קשה לשים את האצבע על מה הופך חלל ל"נעים" או "קודר" – אבל כולנו מרגישים את זה מיד.' 
  },
  'home_contact_title': { hebrew: 'בואו ניצור משהו יוצא דופן' },
  'projects_page_title': { hebrew: 'פרויקטים' },
  'projects_page_description': { hebrew: 'גלריית הפרויקטים שלנו מציגה את העבודה שלנו בתחום האדריכלות ועיצוב הפנים' },
  'contact_hero_title': { hebrew: 'בואו נדבר' },
  'contact_hero_subtitle': { hebrew: 'אשמח לשמוע מכם ולענות על כל שאלה' },
  'contact_section_title': { hebrew: 'צור קשר' },
  'contact_section_description': { hebrew: 'אשמח לשמוע מכם ולענות על כל שאלה. מלאו את הטופס ואחזור אליכם בהקדם.' },
  'footer_copyright': { hebrew: '© 2024 דוד ספקטור - כל הזכויות שמורות' }
};

export default function SiteContentManager() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ hebrew: string }>({ hebrew: '' });
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const allContent = await siteContentService.getAllSiteContent();
      setContent(allContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContent = (key: string) => {
    return content.find(c => c.key === key);
  };

  const handleEdit = (section: ContentSection) => {
    const existingContent = getContent(section.key);
    const defaultContent = DEFAULT_CONTENT[section.key];
    
    setEditingKey(section.key);
    setEditValues({
      hebrew: existingContent?.hebrew || defaultContent?.hebrew || ''
    });
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const existingContent = getContent(key);
      const section = CONTENT_SECTIONS.find(s => s.key === key);
      
      if (existingContent) {
        // Update existing content
        await siteContentService.updateSiteContent(existingContent.id, {
          hebrew: editValues.hebrew
        });
      } else {
        // Create new content
        await siteContentService.createSiteContent({
          key,
          hebrew: editValues.hebrew,
          section: section?.section || 'general'
        });
      }
      
      // Refresh content
      await fetchContent();
      setEditingKey(null);
      alert('התוכן נשמר בהצלחה!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('שגיאה בשמירת התוכן');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValues({ hebrew: '' });
  };

  const getSectionsForCurrentTab = () => {
    return CONTENT_SECTIONS.filter(section => section.section === activeSection);
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      'home': 'דף ראשי',
      'projects': 'דף פרויקטים',
      'about': 'דף אודות',
      'contact': 'דף יצירת קשר',
      'footer': 'פוטר'
    };
    return labels[section] || section;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <span className="mr-3 text-gray-600">טוען תוכן...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Content Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">סיכום תוכן</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">סה"כ תכנים:</span>
            <span className="mr-2 text-blue-600">{content.length}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">תכנים מלאים:</span>
            <span className="mr-2 text-blue-600">{content.filter(c => c.hebrew && c.hebrew.trim()).length}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">תכנים חסרים:</span>
            <span className="mr-2 text-red-600">{CONTENT_SECTIONS.length - content.filter(c => c.hebrew && c.hebrew.trim()).length}</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {Array.from(new Set(CONTENT_SECTIONS.map(s => s.section))).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === section
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getSectionLabel(section)}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {getSectionsForCurrentTab().map(section => {
          const existingContent = getContent(section.key);
          const defaultContent = DEFAULT_CONTENT[section.key];
          const isEditing = editingKey === section.key;
          const hasContent = existingContent?.hebrew || defaultContent?.hebrew;
          const displayContent = existingContent?.hebrew || defaultContent?.hebrew || 'לא נוסף תוכן עדיין';

          return (
            <div key={section.key} className={`bg-white border rounded-lg p-6 ${
              existingContent?.hebrew ? 'border-gray-200' : 'border-orange-200 bg-orange-50'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{section.label}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  {!existingContent?.hebrew && (
                    <span className="inline-block mt-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      תוכן חסר
                    </span>
                  )}
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(section)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      existingContent?.hebrew 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {existingContent?.hebrew ? 'ערוך' : 'הוסף תוכן'}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תוכן בעברית *</label>
                    <textarea
                      value={editValues.hebrew}
                      onChange={(e) => setEditValues(prev => ({ ...prev, hebrew: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                      rows={4}
                      placeholder="הזן תוכן בעברית..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(section.key)}
                      disabled={saving || !editValues.hebrew.trim()}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'שומר...' : 'שמור'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">תוכן בעברית:</h4>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                      {displayContent}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {getSectionsForCurrentTab().length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>לא נמצאו תכנים לסעיף זה</p>
        </div>
      )}
    </div>
  );
} 