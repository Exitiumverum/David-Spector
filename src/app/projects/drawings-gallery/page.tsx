"use client"
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function DrawingsGalleryPage() {
  const bannerImage = '/images/projects/drawings-gallery/01.jpg';
  const galleryImages = [
    '/images/projects/drawings-gallery/01.jpg',
    '/images/projects/drawings-gallery/02.jpg',
    '/images/projects/drawings-gallery/03.jpg',
    '/images/projects/drawings-gallery/04.jpg',
    '/images/projects/drawings-gallery/05.jpg',
    '/images/projects/drawings-gallery/06.jpg',
    '/images/projects/drawings-gallery/07.jpg',
    '/images/projects/drawings-gallery/08.png',
    '/images/projects/drawings-gallery/09.jpg',
    '/images/projects/drawings-gallery/10.jpeg',
    '/images/projects/drawings-gallery/11.jpeg',
    '/images/projects/drawings-gallery/12.jpg',
    '/images/projects/drawings-gallery/13.jpg',
    '/images/projects/drawings-gallery/14.png',
    '/images/projects/drawings-gallery/15.jpg',
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-screen">
        <Image src={bannerImage} alt="גלריית איורים אמנותיים" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-light mb-4">גלריית איורים אמנותיים</h1>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <hr className="my-12 border-t-4 border-yellow-400 rounded-full" />
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center text-black">גלריית איורים</h2>
          <Swiper 
            modules={[Navigation, Pagination, Autoplay]} 
            spaceBetween={30} 
            slidesPerView={1} 
            navigation 
            pagination={{ clickable: true }} 
            autoplay={{ delay: 5000, disableOnInteraction: false }} 
            className="h-[600px] md:h-[700px] lg:h-[800px]"
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image 
                    src={image} 
                    alt={`רישום אמנותי ${index + 1}`} 
                    fill 
                    className="object-contain rounded-lg" 
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #facc15;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          color: #facc15;
          font-weight: bold;
        }
        .swiper-pagination-bullet {
          background: #facc15;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #facc15;
          opacity: 1;
        }
      `}</style>
    </main>
  );
} 