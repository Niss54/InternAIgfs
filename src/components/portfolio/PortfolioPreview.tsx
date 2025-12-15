import React from 'react';
import { motion } from 'framer-motion';
import { ThreeScene } from './ThreeScene';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe,
  Download,
  ExternalLink
} from 'lucide-react';

export const PortfolioPreview: React.FC = () => {
  const { data, selectedElement, setSelectedElement } = usePortfolio();

  const getThemeClasses = () => {
    switch (data.theme) {
      case 'modern':
        return 'bg-gradient-to-br from-background via-background to-secondary/5';
      case 'minimal':
        return 'bg-background';
      case 'showcase':
        return 'bg-gradient-to-br from-primary/5 via-background to-accent/5';
      case 'interactive-3d':
        return 'bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10';
      default:
        return 'bg-background';
    }
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(selectedElement === elementId ? null : elementId);
  };

  return (
    <div className={`w-full h-full overflow-y-auto ${getThemeClasses()}`}>
      {/* Hero Section */}
      <section 
        className={`relative min-h-screen flex items-center justify-center p-8 cursor-pointer transition-all duration-200 ${
          selectedElement === 'hero' ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={() => handleElementClick('hero')}
      >
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {data.profile.name}
              </motion.h1>
              <motion.h2 
                className="text-xl md:text-2xl text-primary font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {data.profile.title}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {data.profile.bio}
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button size="lg" className="gap-2">
                <Mail className="w-4 h-4" />
                Contact Me
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="flex flex-wrap gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {data.profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {data.profile.email}
                </div>
              )}
              {data.profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {data.profile.phone}
                </div>
              )}
              {data.profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {data.profile.location}
                </div>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {data.profile.socialLinks.github && (
                <Button variant="ghost" size="sm" className="gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              )}
              {data.profile.socialLinks.linkedin && (
                <Button variant="ghost" size="sm" className="gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
              )}
              {data.profile.socialLinks.twitter && (
                <Button variant="ghost" size="sm" className="gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
              )}
              {data.profile.socialLinks.website && (
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Button>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-96 lg:h-[500px]"
          >
            <ThreeScene variant="hero" className="w-full h-full" />
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        className={`py-20 px-8 cursor-pointer transition-all duration-200 ${
          selectedElement === 'projects' ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={() => handleElementClick('projects')}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A showcase of my recent work and creative projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.projects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No projects added yet. Click to add your first project!</p>
              </div>
            ) : (
              data.projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative bg-secondary/10">
                      {project.model3d ? (
                        <ThreeScene variant="project" className="w-full h-full" />
                      ) : project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ThreeScene variant="minimal" className="w-full h-full" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {project.link && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-3 h-3" />
                            Live Demo
                          </Button>
                        )}
                        {project.caseStudyLink && (
                          <Button variant="ghost" size="sm">
                            Case Study
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section 
        className={`py-20 px-8 bg-secondary/5 cursor-pointer transition-all duration-200 ${
          selectedElement === 'skills' ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={() => handleElementClick('skills')}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Skills & Expertise
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Technologies and tools I work with
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.skills.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No skills added yet. Click to add your skills!</p>
              </div>
            ) : (
              Object.entries(
                data.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof data.skills>)
              ).map(([category, skills]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-foreground">{category}</h3>
                  <div className="space-y-3">
                    {skills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        className={`py-20 px-8 cursor-pointer transition-all duration-200 ${
          selectedElement === 'experience' ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        onClick={() => handleElementClick('experience')}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Work Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              My professional journey and key achievements
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {data.experience.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No experience added yet. Click to add your work history!</p>
              </div>
            ) : (
              data.experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 pb-8 border-l-2 border-primary/20 last:border-l-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{exp.position}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-8 bg-secondary/5">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Let's Work Together
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Have a project in mind? Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Mail className="w-4 h-4" />
                Get In Touch
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};