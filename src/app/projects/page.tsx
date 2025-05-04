'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectPreview from '@/components/ProjectPreview';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'apartments' | 'private-homes' | 'other-projects' | 'concepts';
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
}

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !Array.isArray(data.images)) {
          throw new Error('Invalid data format received');
        }

        if (isMounted) {
          const formattedProjects = data.images.map((image: string, index: number) => ({
            id: (index + 1).toString().padStart(2, '0'),
            title: getTitle(index),
            description: getDescription(index),
            image: `/images/Homes2/${image}`,
            images: [
              `/images/Homes2/${image}`,
              `/images/Homes2/${image}`,
              `/images/Homes2/${image}`,
              `/images/Homes2/${image}`,
            ],
            beforeAfter: {
              before: `/images/Homes2/${image}`,
              after: `/images/Homes2/${image}`,
            },
            details: {
              location: getLocation(index),
              year: '2023',
              size: getSize(index),
              status: 'הושלם',
            },
            category: getCategory(index)
          }));

          setProjects(formattedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [mounted]);

  const getTitle = (index: number): string => {
    const titles = [
      'דירה עירונית מודרנית',
      'וילה יוקרתית',
      'דופלקס עכשווי',
      'בית גן',
      'נטהאוז',
      'דירת גן',
      'בית קוטג',
      'דירת נופש',
      'בית מינימליסטי',
      'קונספט מגורים עתידני'
    ];
    return titles[index] || `פרויקט ${(index + 1).toString().padStart(2, '0')}`;
  };

  const getDescription = (index: number): string => {
    const descriptions = [
      'דירה עירונית עם עיצוב מודרני',
      'וילה יוקרתית עם נוף פנורמי',
      'דופלקס עכשווי עם חללים פתוחים',
      'בית גן עם גינה פרטית',
      'נטהאוז עם מרפסת גג',
      'דירת גן עם גינה משותפת',
      'בית קוטג כפרי',
      'דירת נופש עם נוף לים',
      'בית מינימליסטי עם קווים נקיים',
      'קונספט מגורים חדשני'
    ];
    return descriptions[index] || 'פרויקט מגורים';
  };

  const getLocation = (index: number): string => {
    const locations = [
      'תל אביב',
      'הרצליה',
      'רמת גן',
      'כפר סבא',
      'רעננה',
      'הוד השרון',
      'רמת השרון',
      'אילת',
      'ירושלים',
      'חיפה'
    ];
    return locations[index] || 'ישראל';
  };

  const getSize = (index: number): string => {
    const sizes = [
      '120 מ"ר',
      '350 מ"ר',
      '180 מ"ר',
      '250 מ"ר',
      '200 מ"ר',
      '150 מ"ר',
      '300 מ"ר',
      '100 מ"ר',
      '280 מ"ר',
      '400 מ"ר'
    ];
    return sizes[index] || '200 מ"ר';
  };

  const getCategory = (index: number): Project['category'] => {
    const categories: Project['category'][] = [
      'apartments',
      'private-homes',
      'apartments',
      'private-homes',
      'apartments',
      'apartments',
      'private-homes',
      'other-projects',
      'private-homes',
      'concepts'
    ];
    return categories[index] || 'other-projects';
  };

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
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedProject(project)}
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
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project Preview Modal */}
      {selectedProject && (
        <ProjectPreview
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
} 