"use client"
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import BeforeAfterToggle from '@/components/BeforeAfterToggle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Athens26mPage() {
  const bannerImage = '/images/projects/athens-26m/01.png';
  const galleryImages = [
    '/images/projects/athens-26m/01.png',
    '/images/projects/athens-26m/02.png',
    '/images/projects/athens-26m/03.png',
    '/images/projects/athens-26m/04.png',
    '/images/projects/athens-26m/05.png',
    '/images/projects/athens-26m/06.png',
    '/images/projects/athens-26m/07.png',
    '/images/projects/athens-26m/08.png',
    '/images/projects/athens-26m/09.png',
    '/images/projects/athens-26m/10.png',
    '/images/projects/athens-26m/11.png',
    '/images/projects/athens-26m/12.png',

  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-screen">
        <Image src={bannerImage} alt="Athens 26m Apartment" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-light mb-4">דירת 26 מ&quot;ר באתונה</h1>
            <p className="text-xl md:text-2xl">עיצוב דירה קומפקטית באתונה</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div>
            <h2 className="text-3xl font-light mb-6 text-black">הפרויקט</h2>
            <div className="space-y-4">
              <p className="text-black">
                בפרויקט זה נהניתי מחופש תכנוני מלא.
              </p>
              <p className="text-black">
                על שטח של 26 מ&quot;ר עם גינה, בחרתי לוותר על מחיצות לטובת תחושת מרחב וניצול אופטימלי של האור הטבעי.
              </p>
              <p className="text-black">
                יצרתי אזור שינה ועבודה מרווח, ומטבח פתוח ונוח.
              </p>
              <p className="text-black">
                ביניהם מפריד שולחן אוכל המשמש גם כאי.
              </p>
              <p className="text-black">
                כל הריהוט תוכנן בהתאמה – מיטה, ארון, פינת עבודה והאי.
              </p>
              <p className="text-black">
                השפה החומרית חמימה, עם דגש על עץ בהיר.
              </p>
              <p className="text-black">
                הגינה עוצבה מחדש עם צמחייה ופינת ישיבה מזמינה.
              </p>
            </div>
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
                <p className="font-medium text-black">26 מ&quot;ר</p>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-12 border-t-4 border-yellow-400 rounded-full" />
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center text-black">לפני ואחרי</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BeforeAfterToggle
              beforeImg="/images/projects/athens-26m/Before01.png"
              afterImg="/images/projects/athens-26m/After01.png"
              label="לפני ואחרי - מטבח"
            />
            <BeforeAfterToggle
              beforeImg="/images/projects/athens-26m/Before02.png"
              afterImg="/images/projects/athens-26m/After02.png"
              label="לפני ואחרי - חדר רחצה"
            />
          </div>
        </div>
        <hr className="my-12 border-t-4 border-yellow-400 rounded-full" />
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center text-black">גלריית תמונות</h2>
          <Swiper modules={[Navigation, Pagination, Autoplay]} spaceBetween={30} slidesPerView={1} navigation pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} className="h-72 md:h-[400px] lg:h-[500px]">
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image src={image} alt={`Athens 26m Apartment ${index + 1}`} fill className="object-contain rounded-lg" />
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

// function BeforeAfterToggle({ beforeImg, afterImg, label }: { beforeImg: string; afterImg: string; label: string }) {
//   const [showAfter, setShowAfter] = useState(false);
//   return (
//     <div className="space-y-4 flex flex-col items-center">
//       <h3 className="text-xl font-light text-center mb-2 text-black">{label}</h3>
//       <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-gray-100">
//         <Image
//           src={showAfter ? afterImg : beforeImg}
//           alt={label}
//           fill
//           className="object-contain"
//           sizes="(max-width: 768px) 100vw, 800px"
//         />
//       </div>
//       <button
//         className="mt-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
//         onClick={() => setShowAfter((prev) => !prev)}
//       >
//         {showAfter ? 'הצג לפני' : 'הצג אחרי'}
//       </button>
//     </div>
//   );
// } 