import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client that bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// TypeScript interfaces
export interface Project {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  category: 'apartments' | 'private-homes' | 'other-projects' | 'concepts';
  location: string;
  location_en?: string;
  size: string;
  featured: boolean;
  project_details?: any;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  image_type: 'banner' | 'gallery' | 'before' | 'after';
  display_order: number;
  alt_text?: string;
  created_at: string;
}

export interface ProjectContent {
  id: string;
  project_id: string;
  section: string;
  content_hebrew: string;
  content_english?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  hebrew: string;
  english?: string;
  section: string;
  created_at: string;
  updated_at: string;
}

// Project management functions
export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getNonFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProjectsByCategory(category: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    console.log('Updating project with ID:', id);
    
    // Filter out system fields that shouldn't be updated
    const { id: _, created_at: __, updated_at: ___, ...updateData } = updates;
    
    // Filter out null/undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== null && value !== undefined)
    );
    
    console.log('Clean update data:', cleanUpdateData);
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(cleanUpdateData)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Supabase update error:', error);
      console.error('Update data:', cleanUpdateData);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Project images functions
export const projectImageService = {
  async getProjectImages(projectId: string): Promise<ProjectImage[]> {
    console.log('=== DATABASE QUERY ===');
    console.log('Querying for project_id:', projectId);
    
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });
    
    console.log('Database query result:', { data, error });
    console.log('Number of images found:', data?.length || 0);
    
    if (error) {
      console.error('Database query error:', error);
      throw error;
    }
    
    console.log('Returning images:', data || []);
    return data || [];
  },

  async getProjectImagesByType(projectId: string, type: string): Promise<ProjectImage[]> {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .eq('image_type', type)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createProjectImage(image: Omit<ProjectImage, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('project_images')
      .insert([image])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProjectImage(id: string) {
    const { error } = await supabaseAdmin
      .from('project_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async updateProjectImage(id: string, updates: Partial<ProjectImage>) {
    const { data, error } = await supabaseAdmin
      .from('project_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async replaceProjectImages(projectId: string, images: Omit<ProjectImage, 'id' | 'created_at'>[]) {
    // First delete all existing images for this project
    const { error: deleteError } = await supabaseAdmin
      .from('project_images')
      .delete()
      .eq('project_id', projectId);
    
    if (deleteError) throw deleteError;
    
    // Then insert the new images
    if (images.length > 0) {
      const { data, error: insertError } = await supabaseAdmin
        .from('project_images')
        .insert(images)
        .select();
      
      if (insertError) throw insertError;
      return data;
    }
    
    return [];
  },

  async getAllProjectImages(): Promise<ProjectImage[]> {
    console.log('=== GETTING ALL PROJECT IMAGES ===');
    
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .order('project_id', { ascending: true })
      .order('display_order', { ascending: true });
    
    console.log('All project images:', data);
    console.log('Total images in database:', data?.length || 0);
    
    if (error) {
      console.error('Error getting all project images:', error);
      throw error;
    }
    
    return data || [];
  }
};

// Project content functions
export const projectContentService = {
  async getProjectContent(projectId: string): Promise<ProjectContent[]> {
    const { data, error } = await supabase
      .from('project_content')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getProjectContentBySection(projectId: string, section: string): Promise<ProjectContent | null> {
    const { data, error } = await supabase
      .from('project_content')
      .select('*')
      .eq('project_id', projectId)
      .eq('section', section)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProjectContent(content: Omit<ProjectContent, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('project_content')
      .insert([content])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProjectContent(id: string, updates: Partial<ProjectContent>) {
    const { data, error } = await supabaseAdmin
      .from('project_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Site content functions
export const siteContentService = {
  async getAllSiteContent(): Promise<SiteContent[]> {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getSiteContentByKey(key: string): Promise<SiteContent | null> {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSiteContentBySection(section: string): Promise<SiteContent[]> {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', section)
      .order('key', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createSiteContent(content: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .insert([content])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSiteContent(id: string, updates: Partial<SiteContent>) {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Authentication functions
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}; 