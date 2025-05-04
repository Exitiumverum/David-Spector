'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        const formattedProjects = data.images.map((image: string, index: number) => ({
          id: (index + 1).toString().padStart(2, '0'),
          title: `פרויקט מגורים ${(index + 1).toString().padStart(2, '0')}`,
          description: getDescription(index),
          image: `/images/Homes2/${image}`
        }));

        setProjects(formattedProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getDescription = (index: number): string => {
    const descriptions = [
      'בית פרטי מודרני',
      'דירה עירונית',
      'וילה יוקרתית',
      'דופלקס עכשווי',
      'בית גן',
      'נטהאוז',
      'דירת גן',
      'בית קוטג',
      'דירת נופש',
      'בית מינימליסטי'
    ];
    return descriptions[index] || 'פרויקט מגורים';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-yellow-600 text-xl">טוען פרויקטים...</div>
      </div>
    );
  }

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
          <p className="text-gray-600 max-w-2xl mx-auto">
            גלריית הפרויקטים שלנו מציגה את העבודה שלנו בתחום האדריכלות ועיצוב הפנים
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden cursor-pointer rounded-lg shadow-lg"
              onClick={() => router.push(`/projects/${project.id}`)}
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
        </div>
      </div>
    </main>
  );
} 