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
  const bannerImage = '/images/projects/kipsli-28m/05.jpeg';
  const galleryImages = [
    '/images/projects/kipsli-28m/01.jpeg',
    '/images/projects/kipsli-28m/02.jpeg',
    '/images/projects/kipsli-28m/03.jpeg',
    '/images/projects/kipsli-28m/04.jpeg',
    '/images/projects/kipsli-28m/05.jpeg',
    '/images/projects/kipsli-28m/06.jpeg',
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-screen">
        <Image src={bannerImage} alt="Kipsli 28m Apartment" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-light mb-4">דירת 28 מ&quot;ר בקיפסלי</h1>
            <p className="text-xl md:text-2xl">עיצוב דירה קומפקטית בקיפסלי</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div>
            <h2 className="text-3xl font-light mb-6 text-black">הפרויקט</h2>
            <div className="space-y-4">
              <p className="text-black">
                דירת גן שרכשתי לצורכי השקעה, עם שטח פנים של 28 מ&quot;ר וגינה רחבה.
              </p>
              <p className="text-black">
                בחרתי לתכנן מחדש את החלוקה הפנימית כדי למקסם את תחושת המרחב – ולשלב סלון, פינת אוכל וחדר שינה מבלי ליצור עומס חזותי.
              </p>
              <p className="text-black">
                הדירה מתאימה לזוג או יחיד, עם אפשרות לאירוח נוסף.
              </p>
              <p className="text-black">
                הקו העיצובי מתבסס על שפה חמה ונעימה, עם שילוב של עץ בהיר ותאורה רכה בגוון צהוב.
              </p>
              <p className="text-black">
                את הגינה תכננתי מחדש כחלל חיצוני מזמין, עם צמחייה טבעית ופינת ישיבה רגועה.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-light mb-6 text-black">פרטים</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-black">מיקום</p>
                <p className="font-medium text-black">קיפסלי</p>
              </div>
              <div>
                <p className="text-black">גודל</p>
                <p className="font-medium text-black">28 מ&quot;ר</p>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-12 border-t-4 border-yellow-400 rounded-full" />
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-12 text-center text-black">לפני ואחרי</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BeforeAfterToggle
              beforeImg="/images/projects/kipsli-28m/Before01.jpeg"
              afterImg="/images/projects/kipsli-28m/01.jpeg"
              label="לפני ואחרי - מטבח"
            />
            <BeforeAfterToggle
              beforeImg="/images/projects/kipsli-28m/Before02.jpeg"
              afterImg="/images/projects/kipsli-28m/02.jpeg"
             label="לפני ואחרי - מטבח"
            />
            <BeforeAfterToggle
              beforeImg="/images/projects/kipsli-28m/Before03.jpeg"
              afterImg="/images/projects/kipsli-28m/03.jpeg"
              label="לפני ואחרי - חדר שינה"
            />
            <BeforeAfterToggle
              beforeImg="/images/projects/kipsli-28m/Before04.jpeg"
              afterImg="/images/projects/kipsli-28m/04.jpeg"
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