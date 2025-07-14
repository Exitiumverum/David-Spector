'use client';

import { useState, useEffect } from 'react';
import { siteContentService, SiteContent } from '@/lib/supabase';

interface ContentSection {
  key: string;
  label: string;
  description: string;
}

const ABOUT_SECTIONS: ContentSection[] = [
  {
    key: 'about_title',
    label: 'כותרת ראשית',
    description: 'הכותרת הראשית של דף &quot;אודות&quot;'
  },
  {
    key: 'about_intro',
    label: 'פסקת פתיחה',
    description: 'הפסקה הראשונה שמסבירה על האמונה שלך במרחב'
  },
  {
    key: 'about_mission',
    label: 'המשימה',
    description: 'הפסקה שמסבירה איך אתה עוזר לאנשים'
  },
  {
    key: 'about_impact',
    label: 'השפעה',
    description: 'הפסקה על ההשפעה של שינויים קטנים'
  },
  {
    key: 'about_experience',
    label: 'ניסיון',
    description: 'הפסקה על הניסיון והרקע המקצועי'
  },
  {
    key: 'about_vision',
    label: 'חזון',
    description: 'הפסקה על החזון והיכולת לראות פוטנציאל'
  }
];

export default function TextContentManager() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ hebrew: string }>({ hebrew: '' });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const aboutContent = await siteContentService.getSiteContentBySection('about');
      setContent(aboutContent);
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
    setEditingKey(section.key);
    setEditValues({
      hebrew: existingContent?.hebrew || ''
    });
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const existingContent = getContent(key);
      
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
          section: 'about'
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-yellow-600 text-xl">טוען תוכן...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">עריכת תוכן דף &quot;אודות&quot;</h3>
        <p className="text-gray-600 text-sm">ערוך את הטקסטים המוצגים בדף &quot;אודות&quot;</p>
      </div>

      <div className="grid gap-6">
        {ABOUT_SECTIONS.map((section) => {
          const isEditing = editingKey === section.key;
          const existingContent = getContent(section.key);

          return (
            <div key={section.key} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">{section.label}</h4>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(section)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    ערוך
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תוכן בעברית</label>
                    <textarea
                      value={editValues.hebrew}
                      onChange={(e) => setEditValues(prev => ({ ...prev, hebrew: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                      rows={4}
                      placeholder="הזן תוכן בעברית..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(section.key)}
                      disabled={saving}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'שומר...' : 'שמור'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded border">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {existingContent?.hebrew || 'לא נוסף תוכן עדיין'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 