import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Athens24mPage() {
  const bannerImage = '/images/projects/athens-21m/02.png';
  const beforeImage = '/images/projects/athens-21m/BnA01.png';
  const afterImage = '/images/projects/athens-21m/BnA02.png';
  const galleryImages = [
    '/images/projects/athens-21m/01.png',
    '/images/projects/athens-21m/02.png',
    '/images/projects/athens-21m/03.png',
    '/images/projects/athens-21m/04.png',
    '/images/projects/athens-21m/05.png',
    '/images/projects/athens-21m/06.png',
    '/images/projects/athens-21m/07.png',
    '/images/projects/athens-21m/08.png',
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-screen">
        <Image src={bannerImage} alt="Athens 24m House" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-light mb-4">דירת 24 מ"ר באתונה</h1>
            <p className="text-xl md:text-2xl">עיצוב דירה קומפקטית באתונה</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div>
            <h2 className="text-3xl font-light mb-6 text-black">הפרויקט</h2>
            <p className="text-black mb-4">עיצוב דירה קומפקטית באתונה. טקסט לדוגמה.</p>
            <p className="text-black">הפרויקט כולל פתרונות חכמים לניצול חלל, עיצוב מודרני ופונקציונלי.</p>
          </div>
          <div>
            <h2 className="text-3xl font-light mb-6 text-black">פרטים</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-black">מיקום</p>
                <p className="font-medium text-black">אתונה, יוון</p>
              </div>
              <div>
                <p className="text-black">גודל</p>
                <p className="font-medium text-black">21 מ"ר</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center text-black">לפני ואחרי</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-light text-center mb-6 text-black">לפני</h3>
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <Image src={beforeImage} alt="Before" fill className="object-cover" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-light text-center mb-6 text-black">אחרי</h3>
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <Image src={afterImage} alt="After" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center text-black">גלריית תמונות</h2>
          <Swiper modules={[Navigation, Pagination, Autoplay]} spaceBetween={30} slidesPerView={1} navigation pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} className="h-[800px]">
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image src={image} alt={`Athens 21m House ${index + 1}`} fill className="object-cover rounded-lg" />
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