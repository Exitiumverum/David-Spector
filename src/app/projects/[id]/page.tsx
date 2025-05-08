'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [showAfter, setShowAfter] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // This would typically come from an API or data source
  const project = {
    id: params.id,
    title: "Project Title",
    description: "A detailed description of the project goes here. This can be multiple paragraphs explaining the scope, challenges, and solutions implemented.",
    category: "Category",
    images: [
      "/path/to/image1.jpg",
      "/path/to/image2.jpg",
      // Add more images as needed
    ],
    beforeAfter: {
      before: "/path/to/before.jpg",
      after: "/path/to/after.jpg"
    },
    details: {
      location: "Location",
      year: "2024",
      size: "Size",
      status: "Status"
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link 
            href="/projects" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>חזרה לפרויקטים</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <Image
          src={project.images[activeImageIndex]}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <span className="text-yellow-400 text-2xl font-light">{project.id}</span>
            <h1 className="text-5xl md:text-6xl font-light mt-2 mb-4">{project.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{project.description}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        {/* Project Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">מיקום</h3>
            <p className="text-xl font-light">{project.details.location}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">שנה</h3>
            <p className="text-xl font-light">{project.details.year}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">גודל</h3>
            <p className="text-xl font-light">{project.details.size}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-2">סטטוס</h3>
            <p className="text-xl font-light">{project.details.status}</p>
          </div>
        </div>

        {/* Before/After Section */}
        {project.beforeAfter && (
          <div className="mb-24">
            <h2 className="text-3xl font-light mb-12">לפני ואחרי</h2>
            <div className="relative h-[80vh] rounded-2xl overflow-hidden">
              <Image
                src={showAfter ? project.beforeAfter.after : project.beforeAfter.before}
                alt={showAfter ? 'אחרי' : 'לפני'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setShowAfter(!showAfter)}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-12 py-4 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors text-lg"
              >
                {showAfter ? 'הצג לפני' : 'הצג אחרי'}
              </button>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <div>
          <h2 className="text-3xl font-light mb-12">גלריית תמונות</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {project.images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative h-64 rounded-xl overflow-hidden ${
                  activeImageIndex === index ? 'ring-2 ring-yellow-600' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={image}
                  alt={`${project.title} - תמונה ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 