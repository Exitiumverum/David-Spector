'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'apartments' | 'private-homes' | 'other-projects' | 'concepts';
  location: string;
  size: string;
}

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'apartments', label: 'דירות' },
    { id: 'private-homes', label: 'בתים פרטיים' },
    { id: 'other-projects', label: 'פרויקטים נוספים' },
    { id: 'concepts', label: 'קונספטים' },
  ];

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Mock data for now - replace with actual API call later
    const mockProjects: Project[] = [
      {
        id: 'athens-apartment',
        title: 'דירה באתונה',
        description: 'עיצוב מחדש לדירה באתונה',
        image: '/images/projects/athens/01.png',
        category: 'apartments',
        location: 'אתונה',
        size: '38 מ"ר'
      },
      {
        id: 'athens-penthouse',
        title: 'פנטהאוס באתונה',
        description: 'עיצוב פנטהאוס יוקרתי באתונה',
        image: '/images/projects/athens-penthouse/01.png',
        category: 'apartments',
        location: 'אתונה',
        size: '60 מ"ר'
      },
      {
        id: 'athens-24m',
        title: 'דירת 24 מ"ר באתונה',
        description: 'עיצוב דירה קומפקטית באתונה',
        image: '/images/projects/athens-24m/01.png',
        category: 'apartments',
        location: 'אתונה',
        size: '24 מ"ר'
      },
      // Add more projects here
    ];

    setProjects(mockProjects);
    setLoading(false);
  }, [mounted]);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-yellow-600 text-xl">טוען פרויקטים...</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-600 mb-4">לא נמצאו פרויקטים</h2>
          <p className="text-gray-500">אנא נסה שוב מאוחר יותר</p>
        </div>
      </div>
    );
  }

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4">פרויקטים</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            גלריית הפרויקטים שלנו מציגה את העבודה שלנו בתחום האדריכלות ועיצוב הפנים
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-[400px]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-yellow-400 text-2xl font-light">{project.id}</span>
                        <div className="h-px w-16 bg-yellow-400" />
                      </div>
                      <h3 className="text-2xl font-light mb-2 text-white">{project.title}</h3>
                      <p className="text-gray-200">{project.description}</p>
                      <div className="mt-4 flex gap-4 text-sm text-gray-300">
                        <span>{project.location}</span>
                        <span>•</span>
                        <span>{project.size}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
} 