'use client';

import { useState, useCallback, useRef } from 'react';
import { supabaseAdmin } from '@/lib/supabase';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({ onUploadComplete, onUploadError, className = '', accept = 'image/*', maxSize = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      onUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onUploadError('Please select an image file');
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `project-images/${timestamp}.${fileExtension}`;

      // Upload to Supabase Storage
      const { error } = await supabaseAdmin.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        onUploadError('Failed to upload image');
        return;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('images')
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        onUploadComplete(urlData.publicUrl);
      } else {
        onUploadError('Failed to get image URL');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, onUploadError, maxSize]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <div className="text-6xl text-gray-400">📷</div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {uploading ? 'מעלה תמונה...' : 'לחץ או גרור תמונה לכאן'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG עד {maxSize}MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 