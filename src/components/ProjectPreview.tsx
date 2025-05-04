'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ProjectPreviewProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    images: string[];
    beforeAfter?: {
      before: string;
      after: string;
    };
    details?: {
      location: string;
      year: string;
      size: string;
      status: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPreview({ project, isOpen, onClose }: ProjectPreviewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(true);
  const [galleryHeight, setGalleryHeight] = useState('50vh');

  useEffect(() => {
    // Calculate gallery height based on viewport height
    const updateGalleryHeight = () => {
      const vh = window.innerHeight;
      const height = Math.min(vh * 0.5, 500); // 50% of viewport height, max 500px
      setGalleryHeight(`${height}px`);
    };

    updateGalleryHeight();
    window.addEventListener('resize', updateGalleryHeight);
    return () => window.removeEventListener('resize', updateGalleryHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const contentSection = document.querySelector('.content-section');
      if (contentSection) {
        const scrollTop = contentSection.scrollTop;
        const threshold = 50; // Adjust this value to control when the gallery disappears
        setIsGalleryVisible(scrollTop < threshold);
      }
    };

    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
      contentSection.addEventListener('scroll', handleScroll);
      return () => contentSection.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-7xl mx-auto h-[90vh] mt-[5vh] bg-white rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Main Image Gallery */}
          <motion.div 
            className="fixed top-[5vh] left-1/2 -translate-x-1/2 w-full max-w-7xl bg-gray-900 z-10"
            style={{ height: galleryHeight }}
            animate={{
              y: isGalleryVisible ? 0 : -50,
              opacity: isGalleryVisible ? 1 : 0,
              height: isGalleryVisible ? galleryHeight : '0px'
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Image
              src={project.images[activeImageIndex]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            {/* Image Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeImageIndex === index ? 'bg-yellow-400 scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Content Section */}
          <div 
            className="h-full overflow-y-auto content-section"
            style={{ 
              paddingTop: isGalleryVisible ? galleryHeight : '0px',
              transition: 'padding-top 0.3s ease-in-out'
            }}
          >
            <div className="max-w-4xl mx-auto p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-yellow-600 text-2xl font-light">{project.id}</span>
                  <div className="h-px w-16 bg-yellow-600" />
                </div>
                <h2 className="text-3xl font-light mb-2">{project.title}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>

              {/* Project Details */}
              {project.details && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">מיקום</h3>
                    <p className="font-light">{project.details.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">שנה</h3>
                    <p className="font-light">{project.details.year}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">גודל</h3>
                    <p className="font-light">{project.details.size}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">סטטוס</h3>
                    <p className="font-light">{project.details.status}</p>
                  </div>
                </div>
              )}

              {/* Before/After Section */}
              {project.beforeAfter && (
                <div className="mb-8">
                  <h3 className="text-xl font-light mb-4">לפני ואחרי</h3>
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={showAfter ? project.beforeAfter.after : project.beforeAfter.before}
                      alt={showAfter ? 'אחרי' : 'לפני'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                      onClick={() => setShowAfter(!showAfter)}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      {showAfter ? 'הצג לפני' : 'הצג אחרי'}
                    </button>
                  </div>
                </div>
              )}

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden ${
                      activeImageIndex === index ? 'ring-2 ring-yellow-600' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${project.title} - תמונה ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 