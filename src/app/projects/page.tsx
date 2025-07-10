'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { projectService, siteContentService, Project } from '@/lib/supabase';

// Component that tries multiple image extensions
const ProjectImage = ({ projectSlug, projectTitle }: { projectSlug: string; projectTitle: string }) => {
  const [imageError, setImageError] = useState(false);
  const [currentExtensionIndex, setCurrentExtensionIndex] = useState(0);
  
  const extensions = ['01.jpg', '01.jpeg', '01.png', '01.JPG', '01.JPEG', '01.PNG'];
  
  const handleImageError = () => {
    if (currentExtensionIndex < extensions.length - 1) {
      setCurrentExtensionIndex(currentExtensionIndex + 1);
    } else {
      setImageError(true);
    }
  };
  
  if (imageError) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500 text-sm">תמונה לא זמינה</span>
      </div>
    );
  }
  
  const currentExtension = extensions[currentExtensionIndex];
  const imagePath = `/images/projects/${projectSlug}/${currentExtension}`;
  
  return (
    <Image
      src={imagePath}
      alt={projectTitle}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={handleImageError}
    />
  );
};

const ComingSoon = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="mb-8"
    >
      <svg className="w-24 h-24 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </motion.div>
    <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">בקרוב</h2>
    <p className="text-gray-600 max-w-md">
      אני עובד על פרויקטים חדשים ומרגשים. בקרוב אוסיף פרויקטים חדשים לקטגוריה זו.
    </p>
    <motion.div
      animate={{ 
        opacity: [0.5, 1, 0.5],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
      }}
      className="mt-8 text-yellow-500 text-sm"
    >
      בואו לבדוק שוב בקרוב
    </motion.div>
  </motion.div>
);

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'featured', label: 'פרויקטים מובחרים' },
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

    const fetchData = async () => {
      try {
        // Fetch all projects
        const allProjects = await projectService.getAllProjects();
        setProjects(allProjects);

        // Fetch site content
        const content = await siteContentService.getSiteContentBySection('projects');
        const contentMap: Record<string, string> = {};
        content.forEach(item => {
          contentMap[item.key] = item.hebrew;
        });
        setSiteContent(contentMap);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    ? projects // Show all projects, featured first (already sorted by database)
    : activeCategory === 'featured'
    ? projects.filter(project => project.featured) // Show only featured projects
    : projects.filter(project => project.category === activeCategory); // Show projects by category

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            {siteContent.projects_page_title || 'פרויקטים'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            {siteContent.projects_page_description || 'גלריית הפרויקטים שלנו מציגה את העבודה שלנו בתחום האדריכלות ועיצוב הפנים'}
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                  activeCategory === category.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.length === 0 ? (
              <ComingSoon />
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/projects/${project.slug}`}>
                    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-64">
                        <ProjectImage projectSlug={project.slug} projectTitle={project.title} />
                        {project.featured && (
                          <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            פרויקט מוביל
                          </div>
                        )}
                      </div>
                      <div className="p-6 bg-white">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{project.location}</span>
                          <span>{project.size}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
} 