import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { ResumeData } from '@/pages/ResumeGenerator';

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdateData: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, onUpdateData }) => {
  const [openSections, setOpenSections] = useState({
    personal: true,
    experience: false,
    education: false,
    skills: false,
    projects: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    onUpdateData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    });
  }, [resumeData, onUpdateData]);

  const addExperience = useCallback(() => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onUpdateData({
      ...resumeData,
      experience: [...resumeData.experience, newExp]
    });
  }, [resumeData, onUpdateData]);

  const updateExperience = useCallback((id: string, field: string, value: string) => {
    onUpdateData({
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  }, [resumeData, onUpdateData]);

  const removeExperience = useCallback((id: string) => {
    onUpdateData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  }, [resumeData, onUpdateData]);

  const addEducation = useCallback(() => {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onUpdateData({
      ...resumeData,
      education: [...resumeData.education, newEdu]
    });
  }, [resumeData, onUpdateData]);

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    onUpdateData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  }, [resumeData, onUpdateData]);

  const removeEducation = useCallback((id: string) => {
    onUpdateData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  }, [resumeData, onUpdateData]);

  const addSkillCategory = useCallback(() => {
    const newSkill = {
      id: Date.now().toString(),
      category: '',
      items: []
    };
    onUpdateData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill]
    });
  }, [resumeData, onUpdateData]);

  const updateSkillCategory = useCallback((id: string, category: string) => {
    onUpdateData({
      ...resumeData,
      skills: resumeData.skills.map(skill => 
        skill.id === id ? { ...skill, category } : skill
      )
    });
  }, [resumeData, onUpdateData]);

  const updateSkillItems = useCallback((id: string, items: string) => {
    onUpdateData({
      ...resumeData,
      skills: resumeData.skills.map(skill => 
        skill.id === id ? { ...skill, items: items.split(',').map(item => item.trim()) } : skill
      )
    });
  }, [resumeData, onUpdateData]);

  const removeSkill = useCallback((id: string) => {
    onUpdateData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id)
    });
  }, [resumeData, onUpdateData]);

  const addProject = useCallback(() => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    onUpdateData({
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    });
  }, [resumeData, onUpdateData]);

  const updateProject = useCallback((id: string, field: string, value: string | string[]) => {
    onUpdateData({
      ...resumeData,
      projects: resumeData.projects.map(project => 
        project.id === id 
          ? { 
              ...project, 
              [field]: field === 'technologies' 
                ? (value as string).split(',').map(tech => tech.trim()) 
                : value 
            } 
          : project
      )
    });
  }, [resumeData, onUpdateData]);

  const removeProject = useCallback((id: string) => {
    onUpdateData({
      ...resumeData,
      projects: resumeData.projects.filter(project => project.id !== id)
    });
  }, [resumeData, onUpdateData]);

  const FormSection = ({ 
    title, 
    icon, 
    isOpen, 
    onToggle, 
    children, 
    badge 
  }: {
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    badge?: string;
  }) => (
    <Card className="glass-card">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="p-6 cursor-pointer hover:bg-secondary/10 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  {badge && (
                    <Badge variant="secondary" className="mt-1">
                      {badge}
                    </Badge>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 pt-0">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Resume Details</h2>
          <p className="text-muted-foreground">Fill in your information to generate your resume</p>
        </div>
      </div>

      {/* Personal Information */}
      <FormSection
        title="Personal Information"
        icon={<User className="w-5 h-5" />}
        isOpen={openSections.personal}
        onToggle={() => toggleSection('personal')}
        badge="Required"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              className="input-glass"
              placeholder="John Doe"
              value={resumeData.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              className="input-glass"
              placeholder="john.doe@email.com"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              className="input-glass"
              placeholder="+1 (555) 123-4567"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              className="input-glass"
              placeholder="New York, NY"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              className="input-glass min-h-[100px]"
              placeholder="Brief summary of your professional background and key achievements..."
              value={resumeData.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      {/* Experience */}
      <FormSection
        title="Work Experience"
        icon={<Briefcase className="w-5 h-5" />}
        isOpen={openSections.experience}
        onToggle={() => toggleSection('experience')}
        badge={`${resumeData.experience.length} entries`}
      >
        <div className="space-y-4">
          <AnimatePresence>
            {resumeData.experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border border-border/50 rounded-lg bg-secondary/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Experience {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(exp.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Company Name"
                    className="input-glass"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <Input
                    placeholder="Job Title"
                    className="input-glass"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  />
                  <Input
                    placeholder="Start Date"
                    className="input-glass"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                  <Input
                    placeholder="End Date"
                    className="input-glass"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Job description and key achievements..."
                  className="input-glass"
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            variant="outline"
            onClick={addExperience}
            className="w-full hover:bg-primary/10 hover:border-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </FormSection>

      {/* Education */}
      <FormSection
        title="Education"
        icon={<GraduationCap className="w-5 h-5" />}
        isOpen={openSections.education}
        onToggle={() => toggleSection('education')}
        badge={`${resumeData.education.length} entries`}
      >
        <div className="space-y-4">
          <AnimatePresence>
            {resumeData.education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border border-border/50 rounded-lg bg-secondary/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Education {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Institution Name"
                    className="input-glass"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  />
                  <Input
                    placeholder="Degree"
                    className="input-glass"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  />
                  <Input
                    placeholder="Start Date"
                    className="input-glass"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                  <Input
                    placeholder="End Date"
                    className="input-glass"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                  <Input
                    placeholder="GPA (optional)"
                    className="input-glass"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            variant="outline"
            onClick={addEducation}
            className="w-full hover:bg-primary/10 hover:border-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </FormSection>

      {/* Skills */}
      <FormSection
        title="Skills"
        icon={<Code className="w-5 h-5" />}
        isOpen={openSections.skills}
        onToggle={() => toggleSection('skills')}
        badge={`${resumeData.skills.length} categories`}
      >
        <div className="space-y-4">
          <AnimatePresence>
            {resumeData.skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border border-border/50 rounded-lg bg-secondary/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Category {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Skill Category (e.g., Programming Languages)"
                  className="input-glass"
                  value={skill.category}
                  onChange={(e) => updateSkillCategory(skill.id, e.target.value)}
                />
                <Input
                  placeholder="Skills (comma separated: JavaScript, React, Node.js)"
                  className="input-glass"
                  value={skill.items.join(', ')}
                  onChange={(e) => updateSkillItems(skill.id, e.target.value)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            variant="outline"
            onClick={addSkillCategory}
            className="w-full hover:bg-primary/10 hover:border-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill Category
          </Button>
        </div>
      </FormSection>

      {/* Projects */}
      <FormSection
        title="Projects"
        icon={<FolderOpen className="w-5 h-5" />}
        isOpen={openSections.projects}
        onToggle={() => toggleSection('projects')}
        badge={`${resumeData.projects.length} projects`}
      >
        <div className="space-y-4">
          <AnimatePresence>
            {resumeData.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border border-border/50 rounded-lg bg-secondary/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Project {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Project Name"
                    className="input-glass"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Project Link (optional)"
                    className="input-glass"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Project description..."
                  className="input-glass"
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                />
                <Input
                  placeholder="Technologies (comma separated: React, TypeScript, Node.js)"
                  className="input-glass"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            variant="outline"
            onClick={addProject}
            className="w-full hover:bg-primary/10 hover:border-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </FormSection>
    </div>
  );
};

export default ResumeForm;