'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Virtual } from 'swiper/modules';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function ProjectsSwiper() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch the list of images from the API route
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        // Transform the data into the required format
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
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-light mb-12 text-center text-gray-900">פרויקטים נבחרים</h2>
          <div className="relative h-[600px] bg-gray-100 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-light mb-12 text-center text-gray-900">פרויקטים נבחרים</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          allowSlideNext={true}
          allowSlidePrev={true}
          watchSlidesProgress={true}
          preventInteractionOnTransition={false}
          simulateTouch={true}
          grabCursor={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            disabledClass: 'swiper-button-disabled !opacity-100',
            enabled: true,
            hideOnClick: false
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            renderBullet: function (index, className) {
              return `<span class="${className} bg-yellow-600"></span>`;
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          speed={1000}
          className="mySwiper relative"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <div className="group relative h-[600px] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-0 transition-all duration-500">
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-yellow-400 text-2xl font-light">{project.id}</span>
                      <div className="h-px w-16 bg-yellow-400" />
                    </div>
                    <h3 className="text-3xl font-light mb-2">{project.title}</h3>
                    <p className="text-gray-200">{project.description}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination !bottom-8" />
          <div className="swiper-button-next !text-yellow-600 after:!text-2xl !pointer-events-auto" />
          <div className="swiper-button-prev !text-yellow-600 after:!text-2xl !pointer-events-auto" />
        </Swiper>
      </div>
    </section>
  );
} 