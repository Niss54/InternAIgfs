import { useState } from 'react';
import { motion } from 'framer-motion';
import TemplateCarousel from '@/components/resume/TemplateCarousel';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Target, FileText, Linkedin, Download, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const ResumeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [showCustomizationDialog, setShowCustomizationDialog] = useState(false);
  const [internshipDescription, setInternshipDescription] = useState('');
  const [customizationLoading, setCustomizationLoading] = useState(false);
  const [customizedResume, setCustomizedResume] = useState<any>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAICustomization = async (internshipUrl?: string) => {
    if (!user || !resumeData.personalInfo.name) {
      toast({
        title: "Profile Required",
        description: "Please fill in your basic information first",
        variant: "destructive"
      });
      return;
    }

    try {
      setCustomizationLoading(true);
      
      // For demo purposes, we'll use a mock internship ID
      // In a real app, this would come from internship selection
      const mockInternshipId = '00000000-0000-0000-0000-000000000001';
      
      const { data, error } = await supabase.functions.invoke('ai-resume-tailor', {
        body: {
          internship_id: mockInternshipId,
          base_resume_data: resumeData,
          customization_type: 'all',
          template_id: selectedTemplate
        }
      });

      if (error) throw error;

      setCustomizedResume(data.customized_content);
      setAtsScore(data.ats_score);
      
      toast({
        title: "Resume Customized Successfully!",
        description: `ATS Score: ${data.ats_score}/100. Your resume is now tailored for the target role.`,
      });

      setShowCustomizationDialog(false);
    } catch (error) {
      console.error('Customization error:', error);
      toast({
        title: "Customization Failed",
        description: "Unable to customize resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCustomizationLoading(false);
    }
  };

  const resetToOriginal = () => {
    setCustomizedResume(null);
    setAtsScore(null);
    toast({
      title: "Reset Complete",
      description: "Showing your original resume template",
    });
  };

  const displayResumeData = customizedResume?.resume || resumeData;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center pulse-glow">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-primary/10 border-primary/30 text-primary">
              AI-Powered
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Resume Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create stunning, professional resumes with our premium templates. Built for ATS compatibility and modern design.
          </p>
        </motion.div>

        {/* Template Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TemplateCarousel 
            selectedTemplate={selectedTemplate} 
            onSelectTemplate={setSelectedTemplate} 
          />
        </motion.div>

        {/* AI Customization Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-card border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center pulse-glow">
                    <Wand2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      AI Resume Tailor
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Smart Customization
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Automatically customize your resume for specific internship positions
                      {atsScore && <span className="text-accent ml-2">• ATS Score: {atsScore}/100</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {customizedResume && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetToOriginal}
                      className="bg-secondary/50"
                    >
                      Reset to Original
                    </Button>
                  )}
                  <Dialog open={showCustomizationDialog} onOpenChange={setShowCustomizationDialog}>
                    <DialogTrigger asChild>
                      <Button className="btn-neon">
                        <Target className="w-4 h-4 mr-2" />
                        Customize for Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          AI Resume Customization
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Job Description or Requirements
                          </label>
                          <Textarea
                            placeholder="Paste the internship job description, requirements, or key skills needed..."
                            value={internshipDescription}
                            onChange={(e) => setInternshipDescription(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowCustomizationDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleAICustomization()}
                            disabled={customizationLoading}
                            className="btn-neon"
                          >
                            {customizationLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Customizing...
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Customize Resume
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            {customizedResume && (
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-secondary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Customized Resume</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Tailored content with optimized keywords and structure
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-1" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {customizedResume.cover_letter && (
                    <Card className="bg-secondary/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">Cover Letter</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Personalized cover letter for this specific role
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  {customizedResume.linkedin_summary && (
                    <Card className="bg-secondary/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Linkedin className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">LinkedIn Summary</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Optimized LinkedIn about section
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Copy Text
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ResumeForm 
              resumeData={resumeData} 
              onUpdateData={setResumeData} 
            />
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ResumePreview 
              template={selectedTemplate} 
              resumeData={displayResumeData} 
            />
            {customizedResume && (
              <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="font-medium text-accent">AI-Customized Version</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    ATS Score: {atsScore}/100
                  </Badge>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;