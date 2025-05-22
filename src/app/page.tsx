'use client';

import Image from "next/image";
import ContactModal from "@/components/ContactModal";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50" />
          <Image
            src="/images/Homes2/10.jpg"
            alt="רקע אדריכלי"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-light mb-4">דוד ספקטור</h1>
          <p className="text-xl md:text-2xl font-light mb-8">אדריכלות ועיצוב פנים</p>
          <button 
            onClick={() => router.push('/projects')} 
            className="cursor-pointer border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300"
          >
            צפה בפרויקטים
          </button>
        </div>
      </section>

      {/* Projects Swiper Section */}
      <BestProjectsSwiper />

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light mb-6">נעים להכיר!</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                אני מאמין שהמרחב שסביבנו משפיע על איך שאנחנו מרגישים, חושבים, ואפילו על מערכות היחסים שלנו. לפעמים קשה לשים את האצבע על מה הופך חלל ל&quot;נעים&quot; או &quot;קודר&quot; – אבל כולנו מרגישים את זה מיד.
              </p>
              <p className="text-gray-600">
                דרך עיצוב, תכנון והדמיה, אני עוזר לאנשים לראות את הפוטנציאל האמיתי של נכסים – בין אם הם גרים בהם, משכירים אותם או רוצים לקנות נכס.
              </p>
              <p className="text-gray-600">
                שינוי קטן יכול לעשות הבדל ענק – בדיוק בשביל זה אני כאן.
              </p>
              <p className="text-gray-600">
                צברתי ניסיון עשיר בתכנון, עיצוב וניהול פרויקטים – מדירות ובתים פרטיים ועד שכונות של מאות יחידות דיור במשרד פיבקו אדריכלים ועוד. כיום אני משלב את תחומי ההתמחות שלי – אדריכלות, עיצוב פנים ותיווך נדל&quot;ן ברימקס אושן תל אביב – כדי להעניק לכם פתרון שלם, מקצועי ומדויק.
              </p>
              <p className="text-gray-600">
                בזכות ההבנה הרחבה שלי במרחב, בערך שעיצוב טוב נותן ובשוק הנדל&quot;ן, אני רואה את הנכס שלכם לא רק כמו שהוא – אלא כמו שהוא יכול להיות.
              </p>
            </div>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/Logos/DavidSpector.jpeg"
              alt="דוד ספקטור"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <ContactModal />
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-light mb-8">בואו ניצור משהו יוצא דופן</h2>
          <button 
            onClick={() => router.push('/contact')} 
            className="bg-amber-500 text-white px-8 py-3 hover:bg-amber-700 transition-colors duration-300 cursor-pointer"
          >
            צור קשר
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} דוד ספקטור - כל הזכויות שמורות
          </p>
          <p className="text-gray-500 text-xs mt-2">
            האתר נבנה על ידי <a href="https://www.linkedin.com/in/dan-tayari-a44b77329" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 transition-colors">דן טיירי</a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function BestProjectsSwiper() {
  const router = useRouter();
  const projects = [
    {
      href: '/projects/athens-penthouse',
      img: '/images/projects/athens-penthouse/01.jpg',
      title: 'פנטהאוס באתונה',
    },
    {
      href: '/projects/athens-26m',
      img: '/images/projects/athens-26m/01.png',
      title: 'דירת 26 מ"ר באתונה',
    },
    {
      href: '/projects/athens-21m',
      img: '/images/projects/athens-21m/01.png',
      title: 'דירת 21 מ"ר באתונה',
    },
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-80 md:h-[350px] lg:h-[400px]"
      >
        {projects.map((project, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative h-full w-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => router.push(project.href)}
              tabIndex={0}
              role="button"
              aria-label={project.title}
              onKeyDown={e => { if (e.key === 'Enter') router.push(project.href); }}
            >
              <Image
                src={project.img}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                <h3 className="text-2xl text-white font-bold">{project.title}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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
    </div>
  );
}
