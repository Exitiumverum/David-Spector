'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import BeforeAfterToggle from '@/components/BeforeAfterToggle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { projectService, projectImageService, projectContentService, Project, ProjectImage, ProjectContent } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function ProjectPageContent({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [content, setContent] = useState<ProjectContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project data
        const projectData = await projectService.getProjectBySlug(slug);
        if (!projectData) {
          notFound();
        }
        setProject(projectData);

        // Fetch project images
        const projectImages = await projectImageService.getProjectImages(projectData.id);
        setImages(projectImages);

        // Fetch project content
        const projectContent = await projectContentService.getProjectContent(projectData.id);
        setContent(projectContent);
      } catch (error) {
        console.error('Error fetching project:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-yellow-600 text-xl">טוען פרויקט...</div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  // Use database images for banner, gallery, before/after
  const bannerImage = images.find(img => img.image_type === 'banner')?.image_url;
  const galleryImages = images.filter(img => img.image_type === 'gallery').map(img => img.image_url);
  const beforeImages = images.filter(img => img.image_type === 'before').sort((a, b) => a.display_order - b.display_order);
  const afterImages = images.filter(img => img.image_type === 'after').sort((a, b) => a.display_order - b.display_order);

  // Pair before/after images by display_order
  const beforeAfterPairs = beforeImages.map((beforeImg, i) => ({
    before: beforeImg.image_url,
    after: afterImages[i]?.image_url || '',
    label: beforeImg.alt_text?.replace(' - Before', '') || ''
  }));

  const projectDescription = content.find(c => c.section === 'project_description')?.content_hebrew || '';

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-screen">
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">תמונה לא זמינה</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-light mb-4">{project.title}</h1>
            <p className="text-xl md:text-2xl">{project.description}</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div>
            <h2 className="text-3xl font-light mb-6 text-black">הפרויקט</h2>
            <div className="space-y-4">
              {projectDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-black">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-light mb-6 text-black">פרטים</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-black">מיקום</p>
                <p className="font-medium text-black">{project.location}</p>
              </div>
              <div>
                <p className="text-black">גודל</p>
                <p className="font-medium text-black">{project.size}</p>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-12 border-t-4 border-yellow-400 rounded-full" />
        {/* Before/After Section */}
        {beforeAfterPairs.length > 0 && (
          <>
            <div className="mb-20">
              <h2 className="text-3xl font-light mb-12 text-center text-black">לפני ואחרי</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {beforeAfterPairs.map((pair, index) => (
                  <BeforeAfterToggle
                    key={index}
                    beforeImg={pair.before}
                    afterImg={pair.after}
                    label={pair.label}
                  />
                ))}
              </div>
            </div>
            <hr className="my-12 border-t-4 border-yellow-400 rounded-full" />
          </>
        )}
        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-light mb-12 text-center text-black">גלריית תמונות</h2>
            <Swiper modules={[Navigation, Pagination, Autoplay]} spaceBetween={30} slidesPerView={1} navigation pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} className="h-72 md:h-[400px] lg:h-[500px]">
              {galleryImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full">
                    <Image src={image} alt={`${project.title} ${index + 1}`} fill className="object-contain rounded-lg" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
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
      `}</style>
    </main>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  return <ProjectPageContent slug={slug} />;
} 