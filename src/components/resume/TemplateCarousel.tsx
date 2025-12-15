import { useState } from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, FileText, Briefcase, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  preview: string;
  category: 'modern' | 'minimal' | 'ats';
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Eye-catching design with bold colors and clean typography',
    features: ['Creative Layout', 'Color Accents', 'Modern Typography', 'Visual Appeal'],
    icon: <Zap className="w-6 h-6" />,
    preview: '/api/placeholder/300/400',
    category: 'modern'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean, minimalist design focusing on content clarity',
    features: ['Clean Design', 'Easy to Read', 'Professional', 'Timeless'],
    icon: <FileText className="w-6 h-6" />,
    preview: '/api/placeholder/300/400',
    category: 'minimal'
  },
  {
    id: 'ats',
    name: 'ATS Optimized',
    description: 'Designed specifically for Applicant Tracking Systems',
    features: ['ATS Friendly', 'Keyword Optimized', 'Standard Format', 'High Pass Rate'],
    icon: <Briefcase className="w-6 h-6" />,
    preview: '/api/placeholder/300/400',
    category: 'ats'
  }
];

interface TemplateCarouselProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Template</h2>
        <p className="text-muted-foreground">Select from our premium collection of resume templates</p>
      </div>

      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-4">
          {templates.map((template, index) => (
            <CarouselItem key={template.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`
                    relative h-full cursor-pointer transition-all duration-300 overflow-hidden
                    ${selectedTemplate === template.id 
                      ? 'glass-card ring-2 ring-primary shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
                      : 'glass-card hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    }
                  `}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  onClick={() => onSelectTemplate(template.id)}
                >
                  {/* 3D Glow Effect */}
                  <div 
                    className={`
                      absolute inset-0 rounded-lg transition-opacity duration-300
                      ${hoveredTemplate === template.id || selectedTemplate === template.id
                        ? 'bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-100'
                        : 'opacity-0'
                      }
                    `}
                  />

                  <div className="relative p-6 space-y-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          p-2 rounded-lg transition-all duration-300
                          ${selectedTemplate === template.id 
                            ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                            : 'bg-secondary text-secondary-foreground'
                          }
                        `}>
                          {template.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={`
                              mt-1 text-xs
                              ${template.category === 'modern' ? 'border-accent text-accent' : ''}
                              ${template.category === 'minimal' ? 'border-muted-foreground text-muted-foreground' : ''}
                              ${template.category === 'ats' ? 'border-primary text-primary' : ''}
                            `}
                          >
                            {template.category.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedTemplate === template.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </motion.div>
                      )}
                    </div>

                    {/* Template Preview */}
                    <div className="flex-1 flex items-center justify-center">
                      <motion.div
                        className={`
                          w-32 h-40 bg-secondary/30 rounded-lg border border-border/50 
                          flex items-center justify-center transition-all duration-300
                          ${hoveredTemplate === template.id ? 'scale-105' : 'scale-100'}
                        `}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-6xl text-muted-foreground/30">
                          📄
                        </div>
                      </motion.div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground text-center">
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {template.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <Button
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      size="sm"
                      className={`
                        w-full transition-all duration-300
                        ${selectedTemplate === template.id 
                          ? 'btn-neon' 
                          : 'hover:border-primary hover:text-primary'
                        }
                      `}
                    >
                      {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="glass-card" />
        <CarouselNext className="glass-card" />
      </Carousel>
    </div>
  );
};

export default TemplateCarousel;