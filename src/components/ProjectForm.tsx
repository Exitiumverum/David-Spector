'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ImageUpload from './ImageUpload';
import { ProjectImage } from '@/lib/supabase';

interface ProjectFormData {
  title: string;
  description: string;
  category: 'apartments' | 'private-homes' | 'other-projects' | 'concepts';
  location: string;
  size: string;
  featured: boolean;
  slug: string;
  detailedDescription?: string; // Add detailed description field
}

interface BeforeAfterPair {
  id: string;
  before: string;
  after: string;
  title?: string;
}

interface ProjectFormProps {
  onSubmit: (projectData: ProjectFormData, images: ProjectImage[], imagesToDelete: string[]) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<ProjectFormData>;
  initialImages?: ProjectImage[];
  initialDetailedDescription?: string; // Add prop for detailed description
}

export default function ProjectForm({ onSubmit, onCancel, loading = false, initialData, initialImages = [], initialDetailedDescription = '' }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'apartments',
    location: initialData?.location || '',
    size: initialData?.size || '',
    featured: initialData?.featured || false,
    slug: initialData?.slug || '',
    detailedDescription: initialDetailedDescription
  });

  // Track images to be deleted (for existing projects)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Process initial images into the expected format
  const processInitialImages = useCallback(() => {
    console.log('Processing initial images:', initialImages);
    console.log('Total images to process:', initialImages.length);
    
    const banner = initialImages.find(img => img.image_type === 'banner')?.image_url;
    const galleryImages = initialImages.filter(img => img.image_type === 'gallery');
    const gallery = galleryImages.map(img => img.image_url);
    
    console.log('Banner image:', banner);
    console.log('Gallery images:', gallery);
    console.log('Gallery images (detailed):', galleryImages);
    console.log('Number of gallery images found:', galleryImages.length);
    
    // Show all gallery images, even if they're the same as banner
    const filteredGallery = gallery; // Remove filtering - show all gallery images
    console.log('Filtered gallery images:', filteredGallery);
    
    // Group before/after images into pairs
    const beforeImages = initialImages.filter(img => img.image_type === 'before').sort((a, b) => a.display_order - b.display_order);
    const afterImages = initialImages.filter(img => img.image_type === 'after').sort((a, b) => a.display_order - b.display_order);
    
    console.log('Before images:', beforeImages);
    console.log('After images:', afterImages);
    console.log('Number of before images:', beforeImages.length);
    console.log('Number of after images:', afterImages.length);
    
    const beforeAfterPairs: BeforeAfterPair[] = [];
    
    // Create pairs based on display_order
    const processedBefore = new Set();
    const processedAfter = new Set();
    
    // First, try to match before/after pairs by their order
    for (let i = 0; i < Math.max(beforeImages.length, afterImages.length); i++) {
      const before = beforeImages[i];
      const after = afterImages[i];
      
      if (before || after) {
        const pair: BeforeAfterPair = {
          id: `pair-${i}`,
          before: before?.image_url || '',
          after: after?.image_url || '',
          title: before?.alt_text?.replace(' - Before', '') || 
                 after?.alt_text?.replace(' - After', '') || ''
        };
        
        beforeAfterPairs.push(pair);
        
        if (before) processedBefore.add(before.id);
        if (after) processedAfter.add(after.id);
      }
    }
    
    // Add any remaining unmatched images as individual pairs
    beforeImages.forEach((img, index) => {
      if (!processedBefore.has(img.id)) {
        beforeAfterPairs.push({
          id: `before-only-${index}`,
          before: img.image_url,
          after: '',
          title: img.alt_text?.replace(' - Before', '') || ''
        });
      }
    });
    
    afterImages.forEach((img, index) => {
      if (!processedAfter.has(img.id)) {
        beforeAfterPairs.push({
          id: `after-only-${index}`,
          before: '',
          after: img.image_url,
          title: img.alt_text?.replace(' - After', '') || ''
        });
      }
    });

    const result = {
      banner,
      gallery: filteredGallery,
      beforeAfterPairs
    };
    console.log('Processed images result:', result);
    return result;
  }, [initialImages]);

  const [images, setImages] = useState<{
    banner?: string;
    gallery: string[];
    beforeAfterPairs: BeforeAfterPair[];
  }>(processInitialImages());

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update images when initialImages prop changes
  useEffect(() => {
    console.log('initialImages changed:', initialImages);
    setImages(processInitialImages());
    setImagesToDelete([]); // Reset deleted images when initial images change
  }, [initialImages, processInitialImages]);

  // Update form data when initialDetailedDescription changes
  useEffect(() => {
    console.log('initialDetailedDescription changed:', initialDetailedDescription);
    setFormData(prev => ({ ...prev, detailedDescription: initialDetailedDescription }));
  }, [initialDetailedDescription]);

  const handleInputChange = (field: keyof ProjectFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (type: 'banner' | 'gallery', url: string) => {
    if (type === 'banner') {
      setImages(prev => ({ ...prev, banner: url }));
    } else {
      setImages(prev => ({ 
        ...prev, 
        gallery: [...prev.gallery, url] 
      }));
    }
  };

  const handleImageRemove = (type: 'banner' | 'gallery', index?: number) => {
    if (type === 'banner') {
      // If editing an existing project and banner exists, mark it for deletion
      const bannerImage = initialImages.find(img => img.image_type === 'banner');
      if (bannerImage && initialData) {
        setImagesToDelete(prev => [...prev, bannerImage.id]);
      }
      setImages(prev => ({ ...prev, banner: undefined }));
    } else {
      // If editing an existing project and gallery image exists, mark it for deletion
      const galleryImages = initialImages.filter(img => img.image_type === 'gallery');
      if (index !== undefined && galleryImages[index] && initialData) {
        setImagesToDelete(prev => [...prev, galleryImages[index].id]);
      }
      setImages(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index)
      }));
    }
  };

  const addBeforeAfterPair = () => {
    const newPair: BeforeAfterPair = {
      id: Date.now().toString(),
      before: '',
      after: '',
      title: ''
    };
    setImages(prev => ({
      ...prev,
      beforeAfterPairs: [...prev.beforeAfterPairs, newPair]
    }));
  };

  const removeBeforeAfterPair = (pairId: string) => {
    const pair = images.beforeAfterPairs.find(p => p.id === pairId);
    if (pair) {
      // If editing an existing project and images exist, mark them for deletion
      if (initialData) {
        const beforeImage = initialImages.find(img => img.image_url === pair.before && img.image_type === 'before');
        const afterImage = initialImages.find(img => img.image_url === pair.after && img.image_type === 'after');
        if (beforeImage) setImagesToDelete(prev => [...prev, beforeImage.id]);
        if (afterImage) setImagesToDelete(prev => [...prev, afterImage.id]);
      }
    }
    setImages(prev => ({
      ...prev,
      beforeAfterPairs: prev.beforeAfterPairs.filter(pair => pair.id !== pairId)
    }));
  };

  const updateBeforeAfterPair = (pairId: string, field: 'before' | 'after' | 'title', value: string) => {
    const pair = images.beforeAfterPairs.find(p => p.id === pairId);
    if (pair && initialData) {
      // If editing an existing project and removing an image, mark it for deletion
      if (field === 'before' && pair.before && !value) {
        const beforeImage = initialImages.find(img => img.image_url === pair.before && img.image_type === 'before');
        if (beforeImage) setImagesToDelete(prev => [...prev, beforeImage.id]);
      }
      if (field === 'after' && pair.after && !value) {
        const afterImage = initialImages.find(img => img.image_url === pair.after && img.image_type === 'after');
        if (afterImage) setImagesToDelete(prev => [...prev, afterImage.id]);
      }
    }
    
    setImages(prev => ({
      ...prev,
      beforeAfterPairs: prev.beforeAfterPairs.map(pair => 
        pair.id === pairId ? { ...pair, [field]: value } : pair
      )
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'כותרת הפרויקט נדרשת';
    if (!formData.description.trim()) newErrors.description = 'תיאור הפרויקט נדרש';
    if (!formData.slug.trim()) newErrors.slug = 'Slug נדרש';
    if (!formData.category) newErrors.category = 'קטגוריה נדרשת';
    if (!formData.location.trim()) newErrors.location = 'מיקום נדרש';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Convert images to ProjectImage format
    const projectImages: ProjectImage[] = [];
    let displayOrder = 0;

    // Add banner image
    if (images.banner) {
      projectImages.push({
        project_id: '', // Will be set by the parent component
        image_url: images.banner,
        image_type: 'banner',
        display_order: displayOrder++,
        alt_text: `Banner for ${formData.title}`
      } as ProjectImage);
    }

    // Add gallery images
    images.gallery.forEach((url, index) => {
      projectImages.push({
        project_id: '',
        image_url: url,
        image_type: 'gallery',
        display_order: displayOrder++,
        alt_text: `Gallery image ${index + 1} for ${formData.title}`
      } as ProjectImage);
    });

    // Add before/after images
    images.beforeAfterPairs.forEach((pair, index) => {
      if (pair.before) {
        projectImages.push({
          project_id: '',
          image_url: pair.before,
          image_type: 'before',
          display_order: displayOrder++,
          alt_text: pair.title ? `${pair.title} - Before` : `Before image ${index + 1} for ${formData.title}`
        } as ProjectImage);
      }
      if (pair.after) {
        projectImages.push({
          project_id: '',
          image_url: pair.after,
          image_type: 'after',
          display_order: displayOrder++,
          alt_text: pair.title ? `${pair.title} - After` : `After image ${index + 1} for ${formData.title}`
        } as ProjectImage);
      }
    });

    // Pass imagesToDelete along with the project data
    onSubmit(formData, projectImages, imagesToDelete);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Project Information */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">מידע בסיסי</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">כותרת הפרויקט *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="כותרת הפרויקט"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="my-project"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">קטגוריה *</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="apartments">דירות</option>
              <option value="private-homes">בתים פרטיים</option>
              <option value="other-projects">פרויקטים נוספים</option>
              <option value="concepts">קונספטים</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">מיקום *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="תל אביב"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">גודל</label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
              placeholder="120 מ״ר"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="featured" className="text-gray-700 font-medium">פרויקט מוביל</label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור קצר *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="תיאור קצר של הפרויקט (יופיע ברשימת הפרויקטים)..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור מפורט - סעיף "הפרויקט"</label>
          <textarea
            value={formData.detailedDescription || ''}
            onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
            rows={8}
            placeholder={formData.detailedDescription ? '' : "תיאור מפורט של הפרויקט (יופיע בדף הפרויקט בסעיף 'הפרויקט')..."}
          />
          <p className="text-sm text-gray-500 mt-1">תיאור זה יופיע בדף הפרויקט בסעיף "הפרויקט" - התוכן המפורט של הפרויקט</p>
          {formData.detailedDescription && (
            <p className="text-xs text-green-600 mt-1">✓ תוכן קיים: {formData.detailedDescription.length} תווים</p>
          )}
        </div>
      </div>

      {/* Image Uploads */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">תמונות הפרויקט</h3>
        
        {/* Banner Image */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">תמונת Banner</h4>
          {images.banner ? (
            <div className="relative">
              <Image
                src={images.banner}
                alt="Banner"
                width={400}
                height={200}
                className="rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => handleImageRemove('banner')}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <ImageUpload
              onUploadComplete={(url) => handleImageUpload('banner', url)}
              onUploadError={(error) => alert(error)}
              className="max-w-md"
            />
          )}
        </div>

        {/* Gallery Images */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">תמונות גלריה</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {images.gallery.map((url, index) => (
              <div key={index} className="relative">
                <Image
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove('gallery', index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <ImageUpload
            onUploadComplete={(url) => handleImageUpload('gallery', url)}
            onUploadError={(error) => alert(error)}
            className="max-w-md"
          />
        </div>

        {/* Before/After Images */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-gray-700">תמונות Before &amp; After</h4>
            <button
              type="button"
              onClick={addBeforeAfterPair}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
              הוסף זוג תמונות
            </button>
          </div>
          
          <div className="space-y-6">
            {images.beforeAfterPairs.map((pair, index) => (
              <div key={pair.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-semibold text-gray-700">זוג תמונות {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeBeforeAfterPair(pair.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    מחק
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">כותרת (אופציונלי)</label>
                  <input
                    type="text"
                    value={pair.title || ''}
                    onChange={(e) => updateBeforeAfterPair(pair.id, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                    placeholder="למשל: חדר מגורים, מטבח, חדר אמבטיה..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תמונה Before</label>
                    {pair.before ? (
                      <div className="relative">
                        <Image
                          src={pair.before}
                          alt="Before"
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => updateBeforeAfterPair(pair.id, 'before', '')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <ImageUpload
                        onUploadComplete={(url) => updateBeforeAfterPair(pair.id, 'before', url)}
                        onUploadError={(error) => alert(error)}
                        className="max-w-full"
                      />
                    )}
                  </div>
                  
                  {/* After Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תמונה After</label>
                    {pair.after ? (
                      <div className="relative">
                        <Image
                          src={pair.after}
                          alt="After"
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => updateBeforeAfterPair(pair.id, 'after', '')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <ImageUpload
                        onUploadComplete={(url) => updateBeforeAfterPair(pair.id, 'after', url)}
                        onUploadError={(error) => alert(error)}
                        className="max-w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {images.beforeAfterPairs.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>לא נוספו תמונות Before &amp; After עדיין</p>
                <p className="text-sm">לחץ על &quot;הוסף זוג תמונות&quot; כדי להתחיל</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 text-white py-3 px-8 rounded-lg hover:bg-amber-600 transition-colors font-semibold disabled:opacity-50"
        >
          {loading ? 'שומר...' : 'שמור פרויקט'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-3 px-8 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}