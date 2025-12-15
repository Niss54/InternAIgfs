import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Eye, Zap } from 'lucide-react';
import { ResumeData } from '@/pages/ResumeGenerator';
import { supabase } from '@/integrations/supabase/client';

interface ResumePreviewProps {
  template: string;
  resumeData: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ template, resumeData }) => {
  const handleDownloadPDF = async () => {
    try {
      const { data } = await supabase.functions.invoke('generate-resume-pdf', {
        body: {
          resumeData,
          template,
          format: 'pdf'
        }
      });

      if (data?.html) {
        // Create a new window with the HTML content for PDF printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(data.html);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDownloadDOCX = async () => {
    try {
      const { data } = await supabase.functions.invoke('generate-resume-pdf', {
        body: {
          resumeData,
          template,
          format: 'docx'
        }
      });

      if (data?.html) {
        // Create a downloadable HTML file for DOCX conversion
        const blob = new Blob([data.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${template}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating DOCX:', error);
    }
  };

  const getTemplateStyles = (template: string) => {
    switch (template) {
      case 'modern':
        return {
          headerBg: 'bg-gradient-to-r from-primary to-accent',
          accentColor: 'text-primary',
          sectionBg: 'bg-primary/5'
        };
      case 'minimal':
        return {
          headerBg: 'bg-foreground',
          accentColor: 'text-foreground',
          sectionBg: 'bg-muted/20'
        };
      case 'ats':
        return {
          headerBg: 'bg-secondary',
          accentColor: 'text-secondary-foreground',
          sectionBg: 'bg-secondary/10'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-primary to-accent',
          accentColor: 'text-primary',
          sectionBg: 'bg-primary/5'
        };
    }
  };

  const styles = getTemplateStyles(template);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
            <Eye className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Live Preview</h2>
            <p className="text-muted-foreground">Real-time resume preview</p>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-accent/10 border-accent/30 text-accent">
          {template.charAt(0).toUpperCase() + template.slice(1)} Template
        </Badge>
      </div>

      {/* Download Actions */}
      <Card className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1 btn-neon"
            onClick={handleDownloadPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 hover:bg-primary/10 hover:border-primary"
            onClick={handleDownloadDOCX}
          >
            <FileText className="w-4 h-4 mr-2" />
            Download DOCX
          </Button>
        </div>
      </Card>

      {/* Preview Container with Glowing Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Glowing Border Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-75 rounded-lg blur-sm"></div>
        
        <Card className="relative glass-card overflow-hidden">
          {/* A4 Paper Simulation */}
          <div className="aspect-[210/297] bg-white text-gray-900 overflow-auto">
            <div className="p-8 space-y-6 text-sm">
              {/* Header Section */}
              <div className={`${styles.headerBg} text-white p-6 -m-8 mb-6`}>
                <h1 className="text-2xl font-bold">
                  {resumeData.personalInfo.name || 'Your Name'}
                </h1>
                <div className="mt-2 text-sm opacity-90">
                  {resumeData.personalInfo.email && (
                    <span>{resumeData.personalInfo.email}</span>
                  )}
                  {resumeData.personalInfo.phone && (
                    <span className="ml-4">{resumeData.personalInfo.phone}</span>
                  )}
                  {resumeData.personalInfo.location && (
                    <span className="ml-4">{resumeData.personalInfo.location}</span>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              {resumeData.personalInfo.summary && (
                <section>
                  <h2 className={`text-lg font-semibold ${styles.accentColor} mb-2 border-b border-gray-300 pb-1`}>
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {resumeData.personalInfo.summary}
                  </p>
                </section>
              )}

              {/* Experience Section */}
              {resumeData.experience.length > 0 && (
                <section>
                  <h2 className={`text-lg font-semibold ${styles.accentColor} mb-3 border-b border-gray-300 pb-1`}>
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-gray-700">{exp.company}</p>
                          </div>
                          <span className="text-gray-600 text-xs">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education Section */}
              {resumeData.education.length > 0 && (
                <section>
                  <h2 className={`text-lg font-semibold ${styles.accentColor} mb-3 border-b border-gray-300 pb-1`}>
                    Education
                  </h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-700">{edu.institution}</p>
                          {edu.gpa && (
                            <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                          )}
                        </div>
                        <span className="text-gray-600 text-xs">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills Section */}
              {resumeData.skills.length > 0 && (
                <section>
                  <h2 className={`text-lg font-semibold ${styles.accentColor} mb-3 border-b border-gray-300 pb-1`}>
                    Skills
                  </h2>
                  <div className="space-y-2">
                    {resumeData.skills.map((skill) => (
                      <div key={skill.id}>
                        <h3 className="font-medium text-gray-900 mb-1">{skill.category}</h3>
                        <p className="text-gray-700 text-sm">
                          {skill.items.join(' • ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {resumeData.projects.length > 0 && (
                <section>
                  <h2 className={`text-lg font-semibold ${styles.accentColor} mb-3 border-b border-gray-300 pb-1`}>
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {resumeData.projects.map((project) => (
                      <div key={project.id} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          {project.link && (
                            <span className="text-gray-600 text-xs underline">
                              {project.link}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        {project.technologies.length > 0 && (
                          <p className="text-gray-600 text-xs">
                            Technologies: {project.technologies.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State */}
              {!resumeData.personalInfo.name && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
                  <Zap className="w-16 h-16" />
                  <div>
                    <h3 className="text-lg font-medium">Start Building Your Resume</h3>
                    <p className="text-sm">Fill out the form to see your resume come to life</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tips Card */}
      <Card className="glass-card p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded-full bg-accent/10">
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Pro Tip</p>
            <p className="text-muted-foreground">
              Use action verbs and quantifiable achievements in your experience descriptions. 
              Tailor your resume to match the job description for better ATS compatibility.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResumePreview;