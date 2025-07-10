'use client';

import { useEffect, useState } from 'react';
import { projectService, siteContentService, Project, SiteContent } from '@/lib/supabase';

export default function TestDBPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test projects
        const allProjects = await projectService.getAllProjects();
        setProjects(allProjects);

        // Test site content
        const allContent = await siteContentService.getAllSiteContent();
        setSiteContent(allContent);

        console.log('✅ Database connection successful!');
        console.log('Projects:', allProjects);
        console.log('Site Content:', allContent);

      } catch (err) {
        console.error('❌ Database connection failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">בדיקת חיבור למסד הנתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">שגיאה בחיבור למסד הנתונים</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
            <p className="font-semibold mb-2">בדוק את:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>קובץ .env.local עם פרטי Supabase</li>
              <li>חיבור לאינטרנט</li>
              <li>סטטוס שרת Supabase</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">חיבור למסד הנתונים מוצלח!</h1>
          <p className="text-gray-600">כל הנתונים נטענו בהצלחה מ-Supabase</p>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">פרויקטים ({projects.length})</h2>
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>קטגוריה: {project.category}</span>
                      <span>מיקום: {project.location}</span>
                      <span>גודל: {project.size}</span>
                      {project.featured && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                          פרויקט מוביל
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {project.slug}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Content Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">תוכן האתר ({siteContent.length})</h2>
          <div className="grid gap-4">
            {siteContent.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{content.key}</h3>
                    <p className="text-gray-600 text-sm">סעיף: {content.section}</p>
                    <p className="text-gray-700 mt-2 text-sm line-clamp-3">{content.hebrew}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">השלבים הבאים:</h3>
          <ul className="text-blue-700 space-y-1">
            <li>• עדכן את מערכת הניהול לעבוד עם Supabase</li>
            <li>• בדוק שהאתר עובד עם הנתונים החדשים</li>
            <li>• הוסף פרויקטים חדשים דרך מערכת הניהול</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 