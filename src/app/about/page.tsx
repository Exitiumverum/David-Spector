'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { siteContentService, SiteContent } from '@/lib/supabase';

export default function AboutPage() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const aboutContent = await siteContentService.getSiteContentBySection('about');
        setContent(aboutContent);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  // Helper function to get content by key
  const getContent = (key: string) => {
    return content.find(c => c.key === key)?.hebrew || '';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse text-yellow-600 text-xl text-center">טוען...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-light mb-8 text-center">{getContent('about_title')}</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-lg text-black">
            <p>
              {getContent('about_title')}
            </p>
            <p>
              {getContent('about_intro')}
            </p>
            <p>
              {getContent('about_mission')}
            </p>
            <p>
              {getContent('about_impact')}
            </p>
            <p>
              {getContent('about_experience')}
            </p>
            <p>
              {getContent('about_vision')}
            </p>
            {/* <p className="text-gray-600">
              דוד מתמחה בפרויקטים מגוונים הכוללים בתי מגורים, חללים מסחריים ופרויקטים של אירוח, כאשר כל פרויקט משקף את מחויבותו ליצירת חללים יפים ופונקציונליים.
            </p> */}
          </div>
          <div className="relative w-[250px] h-[250px] md:w-[400px] md:h-[400px] mx-auto md:mx-0">
            <Image
              src="/images/Logos/DavidSpector.jpeg"
              alt="דוד ספקטור"
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
} 