"use client";

import { useState, useEffect } from "react";
import { projectService, projectImageService, projectContentService, ProjectImage } from "@/lib/supabase";
import ProjectForm from "@/components/ProjectForm";
import SiteContentManager from "@/components/SiteContentManager";
import ImageManager from "@/components/ImageManager";

interface ProjectFormData {
  title: string;
  description: string;
  category: 'apartments' | 'private-homes' | 'other-projects' | 'concepts';
  location: string;
  size: string;
  featured: boolean;
  slug: string;
  detailedDescription?: string; // Added for detailed description
}

interface Project extends ProjectFormData {
  id: string;
}

export default function ManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'projects' | 'content' | 'images'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [detailedDescription, setDetailedDescription] = useState<string>('');
  const [loadingDetailedDescription, setLoadingDetailedDescription] = useState(false);

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("סיסמה שגויה");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  // Fetch projects on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects();
      console.log('=== ALL PROJECTS ===');
      data.forEach((project, index) => {
        console.log(`Project ${index + 1}:`, {
          id: project.id,
          slug: project.slug,
          title: project.title,
          category: project.category
        });
      });
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('שגיאה בטעינת הפרויקטים');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectImages = async (projectId: string) => {
    try {
      console.log('=== FETCHING IMAGES FOR PROJECT ===');
      console.log('Project ID:', projectId);
      
      const images = await projectImageService.getProjectImages(projectId);
      console.log('Raw images from database:', images);
      console.log('Number of images fetched:', images.length);
      
      // Log each image with its details
      images.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, {
          id: img.id,
          project_id: img.project_id,
          image_url: img.image_url,
          image_type: img.image_type,
          display_order: img.display_order,
          alt_text: img.alt_text
        });
      });
      
      // Group images by type for easier analysis
      const byType = {
        banner: images.filter(img => img.image_type === 'banner'),
        gallery: images.filter(img => img.image_type === 'gallery'),
        before: images.filter(img => img.image_type === 'before'),
        after: images.filter(img => img.image_type === 'after')
      };
      
      console.log('Images by type:', byType);
      console.log('Banner count:', byType.banner.length);
      console.log('Gallery count:', byType.gallery.length);
      console.log('Before count:', byType.before.length);
      console.log('After count:', byType.after.length);
      
      setProjectImages(images);
    } catch (error) {
      console.error('Error fetching project images:', error);
      setProjectImages([]);
    }
  };

  const handleCreateProject = async (projectData: ProjectFormData, images: ProjectImage[], imagesToDelete: string[] = []) => {
    setLoading(true);
    try {
      // Filter out detailedDescription from project data since it's stored in project_content table
      const { detailedDescription, ...projectCreateData } = projectData;
      
      const project = await projectService.createProject(projectCreateData);
      
      // Create detailed description in project_content
      if (detailedDescription) {
        await projectContentService.createProjectContent({
          project_id: project.id,
          section: 'project_description',
          content_hebrew: detailedDescription,
          display_order: 1
        });
      }
      
      // Create project images if any
      if (images.length > 0) {
        // Set the project_id for all images
        const imagesWithProjectId = images.map(img => ({
          ...img,
          project_id: project.id
        }));
        await projectImageService.replaceProjectImages(project.id, imagesWithProjectId);
      }
      
      setProjects((prev) => [...prev, project]);
      setShowProjectForm(false);
      alert('פרויקט נוסף בהצלחה!');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('שגיאה ביצירת הפרויקט');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (project: Project) => {
    console.log('=== EDITING PROJECT ===');
    console.log('Project ID:', project.id);
    console.log('Project Slug:', project.slug);
    console.log('Project Title:', project.title);
    console.log('Full project data:', project);
    
    setEditingProject(project);
    setLoadingDetailedDescription(true);
    setShowProjectForm(true);
    // Fetch project images when editing
    await fetchProjectImages(project.id);
    
    // Fetch detailed description
    try {
      console.log('=== FETCHING DETAILED DESCRIPTION ===');
      const projectContent = await projectContentService.getProjectContent(project.id);
      console.log('Project content:', projectContent);
      const detailedDesc = projectContent.find(c => c.section === 'project_description')?.content_hebrew || '';
      console.log('Detailed description found:', detailedDesc);
      setDetailedDescription(detailedDesc);
    } catch (error) {
      console.error('Error fetching project content:', error);
      setDetailedDescription('');
    } finally {
      setLoadingDetailedDescription(false);
    }
  };

  const handleUpdateProject = async (projectData: ProjectFormData, images: ProjectImage[], imagesToDelete: string[] = []) => {
    if (!editingProject) return;
    setLoading(true);
    try {
      // Filter out detailedDescription from project data since it's stored in project_content table
      const { detailedDescription, ...projectUpdateData } = projectData;
      
      const project = await projectService.updateProject(editingProject.id, projectUpdateData);
      
      // Update detailed description in project_content
      if (detailedDescription !== undefined) {
        try {
          const existingContent = await projectContentService.getProjectContent(editingProject.id);
          const existingDesc = existingContent.find(c => c.section === 'project_description');
          
          if (existingDesc) {
            // Update existing content
            await projectContentService.updateProjectContent(existingDesc.id, {
              content_hebrew: detailedDescription
            });
          } else {
            // Create new content
            await projectContentService.createProjectContent({
              project_id: editingProject.id,
              section: 'project_description',
              content_hebrew: detailedDescription,
              display_order: 1
            });
          }
        } catch (error) {
          console.error('Error updating project content:', error);
        }
      }
      
      // Delete images that were marked for deletion
      if (imagesToDelete.length > 0) {
        console.log('Deleting images:', imagesToDelete);
        for (const imageId of imagesToDelete) {
          await projectImageService.deleteProjectImage(imageId);
        }
      }
      
      // Update project images
      if (images.length > 0) {
        // Set the project_id for all images
        const imagesWithProjectId = images.map(img => ({
          ...img,
          project_id: editingProject.id
        }));
        await projectImageService.replaceProjectImages(editingProject.id, imagesWithProjectId);
      }
      
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
      setEditingProject(null);
      setShowProjectForm(false);
      setProjectImages([]);
      setDetailedDescription('');
      alert('פרויקט עודכן בהצלחה!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('שגיאה בעדכון הפרויקט');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פרויקט זה?')) return;
    setLoading(true);
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      alert('פרויקט נמחק בהצלחה!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('שגיאה במחיקת הפרויקט');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">מערכת הניהול</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
              התחבר
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Next: Add tabbed interface and CRUD logic
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">מערכת הניהול</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-6 border-b-2 transition-colors font-semibold ${
              activeTab === 'projects' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            פרויקטים
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-6 border-b-2 transition-colors font-semibold ${
              activeTab === 'content' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            תוכן טקסט
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`py-3 px-6 border-b-2 transition-colors font-semibold ${
              activeTab === 'images' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            תמונות
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Add New Project Button */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">פרויקטים</h2>
                <div className="flex gap-4">
                  {/* <button
                    onClick={debugAllImages}
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    Debug Images
                  </button> */}
                  <button
                    onClick={() => { 
                      setShowProjectForm(true); 
                      setEditingProject(null); 
                      setProjectImages([]); // Clear images when adding new project
                    }}
                    className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                  >
                    הוסף פרויקט חדש
                  </button>
                  <button
                    onClick={async () => {
                      // Test loading detailed description for athens-penthouse
                      try {
                        const projects = await projectService.getAllProjects();
                        const athensPenthouse = projects.find(p => p.slug === 'athens-penthouse');
                        if (athensPenthouse) {
                          const content = await projectContentService.getProjectContent(athensPenthouse.id);
                          const detailedDesc = content.find(c => c.section === 'project_description')?.content_hebrew || '';
                          console.log('Test - Athens Penthouse detailed description:', detailedDesc);
                          alert(`Found detailed description with ${detailedDesc.length} characters`);
                        }
                      } catch (error) {
                        console.error('Test error:', error);
                        alert('Error testing detailed description');
                      }
                    }}
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    בדוק תיאור מפורט
                  </button>
                </div>
              </div>
            </div>

            {/* Project Form - Full Page */}
            {showProjectForm && (
              <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{editingProject ? 'ערוך פרויקט' : 'הוסף פרויקט חדש'}</h2>
                </div>
                {editingProject && loadingDetailedDescription ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">טוען תיאור מפורט...</p>
                  </div>
                ) : (
                  <ProjectForm
                    initialData={editingProject ?? undefined}
                    onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
                    onCancel={() => { 
                      setShowProjectForm(false); 
                      setEditingProject(null); 
                      setProjectImages([]);
                      setDetailedDescription('');
                      setLoadingDetailedDescription(false);
                    }}
                    loading={loading}
                    initialImages={projectImages}
                    initialDetailedDescription={detailedDescription}
                  />
                )}
              </div>
            )}

            {/* Projects List - Only show when not creating a project */}
            {!showProjectForm && (
              <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">פרויקטים קיימים</h2>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-800 mb-2">{project.title}</h3>
                          <p className="text-gray-800 mb-3">{project.description}</p>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">קטגוריה: {project.category}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">מיקום: {project.location}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">גודל: {project.size}</span>
                            {project.featured && (
                              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
                                פרויקט מוביל
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors font-semibold"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors font-semibold"
                          >
                            מחק
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ניהול תוכן טקסט</h2>
              <SiteContentManager />
            </div>
          </div>
        )}
        {activeTab === 'images' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ניהול תמונות האתר</h2>
              <ImageManager />
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 