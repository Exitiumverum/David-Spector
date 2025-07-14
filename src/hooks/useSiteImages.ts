import { useState, useEffect } from 'react';
import { siteImageService, SiteImage } from '@/lib/supabase';

export function useSiteImage(key: string) {
  const [image, setImage] = useState<SiteImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const data = await siteImageService.getSiteImageByKey(key);
        setImage(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching site image for key ${key}:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [key]);

  return { image, loading, error };
}

export function useSiteImages(keys: string[]) {
  const [images, setImages] = useState<Record<string, SiteImage | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const imagePromises = keys.map(async (key) => {
          try {
            return await siteImageService.getSiteImageByKey(key);
          } catch (err) {
            console.error(`Error fetching site image for key ${key}:`, err);
            return null;
          }
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap: Record<string, SiteImage | null> = {};
        
        keys.forEach((key, index) => {
          imageMap[key] = imageResults[index];
        });

        setImages(imageMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching site images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [keys.join(',')]);

  return { images, loading, error };
} 