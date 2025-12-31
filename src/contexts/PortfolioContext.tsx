import React, { createContext, useContext, useState, useCallback } from 'react';

export type ThemeType = 'modern' | 'minimal' | 'showcase' | 'interactive-3d';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  model3d?: string;
  tags: string[];
  link?: string;
  caseStudyLink?: string;
}

export interface SkillData {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location?: string;
    avatar?: string;
    socialLinks: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
    };
  };
  projects: ProjectData[];
  skills: SkillData[];
  experience: ExperienceData[];
  education: EducationData[];
  theme: ThemeType;
  isPublished: boolean;
  slug: string;
  customDomain?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  enabledSections?: Record<string, boolean>;
}

interface PortfolioContextType {
  data: PortfolioData;
  selectedElement: string | null;
  isPremium: boolean;
  updateProfile: (profile: Partial<PortfolioData['profile']>) => void;
  addProject: (project: Omit<ProjectData, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectData>) => void;
  removeProject: (id: string) => void;
  addSkill: (skill: Omit<SkillData, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<SkillData>) => void;
  removeSkill: (id: string) => void;
  addExperience: (experience: Omit<ExperienceData, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<ExperienceData>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<EducationData, 'id'>) => void;
  updateEducation: (id: string, education: Partial<EducationData>) => void;
  removeEducation: (id: string) => void;
  setTheme: (theme: ThemeType) => void;
  setSectionEnabled: (section: string, enabled: boolean) => void;
  setSelectedElement: (element: string | null) => void;
  publishPortfolio: () => void;
  exportStatic: () => void;
  generatePDF: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: React.ReactNode;
  isPremium?: boolean;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ 
  children, 
  isPremium = false 
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioData>({
    profile: {
      name: 'Your Name',
      title: 'Your Professional Title',
      bio: 'A brief description about yourself and your expertise.',
      email: 'your.email@example.com',
      socialLinks: {}
    },
    projects: [],
    skills: [],
    experience: [],
    education: [],
    theme: 'modern',
    isPublished: false,
    slug: 'your-portfolio',
    seo: {
      title: 'Your Portfolio',
      description: 'Professional portfolio showcasing my work and experience',
      keywords: []
    },
    enabledSections: {
      home: true,
      about: true,
      skills: true,
      services: true,
      portfolio: true,
      reviews: true,
      achievements: true,
      certifications: true,
      contact: true
    }
  });

  const setSectionEnabled = useCallback((section: string, enabled: boolean) => {
    setData(prev => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [section]: enabled
      }
    }));
  }, []);

  const updateProfile = useCallback((profile: Partial<PortfolioData['profile']>) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));
  }, []);

  const addProject = useCallback((project: Omit<ProjectData, 'id'>) => {
    const newProject = { ...project, id: `project-${Date.now()}` };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  }, []);

  const updateProject = useCallback((id: string, project: Partial<ProjectData>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...project } : p)
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  }, []);

  const addSkill = useCallback((skill: Omit<SkillData, 'id'>) => {
    const newSkill = { ...skill, id: `skill-${Date.now()}` };
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  }, []);

  const updateSkill = useCallback((id: string, skill: Partial<SkillData>) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...skill } : s)
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  }, []);

  const addExperience = useCallback((experience: Omit<ExperienceData, 'id'>) => {
    const newExperience = { ...experience, id: `exp-${Date.now()}` };
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  }, []);

  const updateExperience = useCallback((id: string, experience: Partial<ExperienceData>) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...experience } : e)
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  }, []);

  const addEducation = useCallback((education: Omit<EducationData, 'id'>) => {
    const newEducation = { ...education, id: `edu-${Date.now()}` };
    setData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  }, []);

  const updateEducation = useCallback((id: string, education: Partial<EducationData>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...education } : e)
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  }, []);

  const setTheme = useCallback((theme: ThemeType) => {
    setData(prev => ({ ...prev, theme }));
  }, []);

  const publishPortfolio = useCallback(() => {
    setData(prev => ({ ...prev, isPublished: !prev.isPublished }));
  }, []);

  const exportStatic = useCallback(() => {
    console.log('Exporting static site...');
    // TODO: Implement static export
  }, []);

  const generatePDF = useCallback(() => {
    console.log('Generating PDF...');
    // TODO: Implement PDF generation
  }, []);

  const value: PortfolioContextType = {
    data,
    selectedElement,
    isPremium,
    updateProfile,
    addProject,
    updateProject,
    removeProject,
    addSkill,
    updateSkill,
    removeSkill,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    setTheme,
    setSelectedElement,
    publishPortfolio,
    exportStatic,
    generatePDF,
    setSectionEnabled
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};