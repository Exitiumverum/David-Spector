'use client';

import Image from "next/image";
import ContactModal from "@/components/ContactModal";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { projectService, siteContentService, Project, SiteContent } from '@/lib/supabase';

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
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 800px"
      onError={handleImageError}
    />
  );
};

export default function Home() {
  const router = useRouter();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured projects
        const projects = await projectService.getFeaturedProjects();
        setFeaturedProjects(projects);

        // Fetch site content
        const content = await siteContentService.getSiteContentBySection('home');
        const contentMap: Record<string, string> = {};
        content.forEach(item => {
          contentMap[item.key] = item.hebrew;
        });
        setSiteContent(contentMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-yellow-600 text-xl">טוען...</div>
      </div>
    );
  }

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
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            {siteContent.home_hero_title || 'דוד ספקטור'}
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8">
            {siteContent.home_hero_subtitle || 'אדריכלות ועיצוב פנים'}
          </p>
          <button 
            onClick={() => router.push('/projects')} 
            className="cursor-pointer border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300"
          >
            צפה בפרויקטים
          </button>
        </div>
      </section>

      {/* Projects Swiper Section */}
      <BestProjectsSwiper projects={featuredProjects} />

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light mb-6">
              {siteContent.home_about_title || 'נעים להכיר!'}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                {siteContent.home_about_content || 'אני מאמין שהמרחב שסביבנו משפיע על איך שאנחנו מרגישים, חושבים, ואפילו על מערכות היחסים שלנו. לפעמים קשה לשים את האצבע על מה הופך חלל ל"נעים" או "קודר" – אבל כולנו מרגישים את זה מיד.'}
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
          <h2 className="text-3xl font-light mb-8">
            {siteContent.home_contact_title || 'בואו ניצור משהו יוצא דופן'}
          </h2>
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

function BestProjectsSwiper({ projects }: { projects: Project[] }) {
  const router = useRouter();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light mb-4 text-gray-800">פרויקטים מובילים</h2>
        <p className="text-gray-600">הפרויקטים המובילים שלנו</p>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-80 md:h-[350px] lg:h-[400px]"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <div
              className="relative h-full w-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => router.push(`/projects/${project.slug}`)}
              tabIndex={0}
              role="button"
              aria-label={project.title}
              onKeyDown={e => { if (e.key === 'Enter') router.push(`/projects/${project.slug}`); }}
            >
              <ProjectImage projectSlug={project.slug} projectTitle={project.title} />
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
