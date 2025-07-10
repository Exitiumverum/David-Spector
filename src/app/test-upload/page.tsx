'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function TestUploadPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url);
    setError('');
    console.log('Upload successful:', url);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    console.error('Upload error:', errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Test Image Upload</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Test Image</h2>
          
          <ImageUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            className="mb-6"
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {uploadedUrl && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>Success!</strong> Image uploaded successfully.
              <div className="mt-2">
                <strong>URL:</strong> {uploadedUrl}
              </div>
              <div className="mt-4">
                <img 
                  src={uploadedUrl} 
                  alt="Uploaded image" 
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 