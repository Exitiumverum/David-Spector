'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageUpload from './ImageUpload';
import { siteImageService, SiteImage } from '@/lib/supabase';

interface ImageSection {
  key: string;
  label: string;
  description: string;
  currentImage?: string;
}

const IMAGE_SECTIONS: ImageSection[] = [
  { 
    key: 'home_banner', 
    label: 'תמונת Banner ראשי', 
    description: 'תמונת הרקע הראשית בדף הבית' 
  },
  { 
    key: 'profile_picture', 
    label: 'תמונת פרופיל', 
    description: 'תמונת הפרופיל של דוד ספקטור' 
  },
  { 
    key: 'contact_hero', 
    label: 'תמונת Banner צור קשר', 
    description: 'תמונת הרקע בדף צור קשר' 
  }
];

export default function ImageManager() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const allImages = await siteImageService.getAllSiteImages();
      setImages(allImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImage = (key: string) => {
    return images.find(img => img.key === key);
  };

  const handleImageUpload = async (key: string, url: string) => {
    setUploading(key);
    try {
      const existingImage = getImage(key);
      
      if (existingImage) {
        // Update existing image
        await siteImageService.updateSiteImage(existingImage.id, {
          image_url: url
        });
      } else {
        // Create new image
        await siteImageService.createSiteImage({
          key,
          image_url: url,
          alt_text: IMAGE_SECTIONS.find(s => s.key === key)?.label || key
        });
      }
      
      // Refresh images
      await fetchImages();
      alert('התמונה נשמרה בהצלחה!');
    } catch (error) {
      console.error('Error saving image:', error);
      alert('שגיאה בשמירת התמונה');
    } finally {
      setUploading(null);
    }
  };

  const handleImageDelete = async (key: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;
    
    setSaving(true);
    try {
      const existingImage = getImage(key);
      if (existingImage) {
        await siteImageService.deleteSiteImage(existingImage.id);
        await fetchImages();
        alert('התמונה נמחקה בהצלחה!');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('שגיאה במחיקת התמונה');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <span className="mr-3 text-gray-600">טוען תמונות...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Image Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">ניהול תמונות האתר</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">סה"כ תמונות:</span>
            <span className="mr-2 text-blue-600">{images.length}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">תמונות מוגדרות:</span>
            <span className="mr-2 text-blue-600">{images.filter(img => img.image_url).length}</span>
          </div>
        </div>
      </div>

      {/* Image Sections */}
      <div className="space-y-6">
        {IMAGE_SECTIONS.map(section => {
          const existingImage = getImage(section.key);
          const hasImage = existingImage?.image_url;

          return (
            <div key={section.key} className={`bg-white border rounded-lg p-6 ${
              hasImage ? 'border-gray-200' : 'border-orange-200 bg-orange-50'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{section.label}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  {!hasImage && (
                    <span className="inline-block mt-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      תמונה חסרה
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {hasImage ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Image
                        src={existingImage.image_url}
                        alt={section.label}
                        width={400}
                        height={section.key === 'home_banner' ? 200 : 300}
                        className="rounded-lg object-cover"
                      />
                      <button
                        onClick={() => handleImageDelete(section.key)}
                        disabled={saving}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>כתובת התמונה: {existingImage.image_url}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">לא הועלתה תמונה עדיין</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {hasImage ? 'החלף תמונה' : 'העלה תמונה'}
                  </h4>
                  <ImageUpload
                    onUploadComplete={(url) => handleImageUpload(section.key, url)}
                    onUploadError={(error) => alert(error)}
                    className="max-w-md"
                  />
                  {uploading === section.key && (
                    <div className="mt-2 text-sm text-amber-600">
                      מעלה תמונה...
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 