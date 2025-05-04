'use client';

import Image from "next/image";
import ProjectsSwiper from "@/components/ProjectsSwiper";
import ContactModal from "@/components/ContactModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50" />
          <Image
            src="/images/Homes2/9.png"
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
      <ProjectsSwiper />

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light mb-6">אודות דוד ספקטור</h2>
            <p className="text-gray-600 mb-4">
              עם ניסיון של מעל 15 שנים בתחום האדריכלות ועיצוב הפנים, דוד ספקטור מביא שילוב ייחודי של יצירתיות ומומחיות טכנית לכל פרויקט. עבודתו מתאפיינת בקווים נקיים, תכנון מרחבי מחושב והבנה עמוקה של האינטראקציה בין אנשים לסביבתם.
            </p>
            <p className="text-gray-600">
              דוד מתמחה בפרויקטים מגוונים הכוללים בתי מגורים, חללים מסחריים ופרויקטים של אירוח, כאשר כל פרויקט משקף את מחויבותו ליצירת חללים יפים ופונקציונליים.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/about-image.jpg"
              alt="דוד ספקטור"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-light mb-12 text-center">פרויקטים נבחרים</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((project) => (
              <div key={project} className="group">
                <div className="relative h-[300px] mb-4">
                  <Image
                    src={`/project-${project}.jpg`}
                    alt={`פרויקט ${project}`}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-xl font-light mb-2">פרויקט {project}</h3>
                <p className="text-gray-600">מגורים / מסחרי</p>
              </div>
            ))}
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
            className="bg-gray-900 text-white px-8 py-3 hover:bg-gray-800 transition-colors duration-300"
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
