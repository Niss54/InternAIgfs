import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User, 
  Globe, 
  Star, 
  Clock, 
  CheckCircle,
  Zap,
  Award,
  Briefcase,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const UpsellServices = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const demoServices = [
    {
      id: '1',
      name: 'Human Resume Review',
      description: 'Expert review of your resume by industry professionals',
      category: 'resume_review',
      price: 999,
      delivery_days: 2,
      features: [
        'Detailed feedback on content and format',
        'ATS compatibility check',
        'Industry-specific suggestions',
        'Before/after comparison'
      ]
    },
    {
      id: '2',
      name: 'LinkedIn Profile Optimization',
      description: 'Professional LinkedIn makeover to attract recruiters',
      category: 'linkedin_optimization',
      price: 1499,
      delivery_days: 3,
      features: [
        'Keyword optimization',
        'Professional headline',
        'Compelling summary',
        'Skills and endorsements strategy'
      ]
    },
    {
      id: '3',
      name: 'Portfolio Website Builder',
      description: 'Custom React/Tailwind portfolio built with your data',
      category: 'portfolio_website',
      price: 2999,
      delivery_days: 7,
      features: [
        'Custom React website',
        'Responsive design',
        'SEO optimized',
        'Deployment included'
      ]
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'resume_review': return <FileText className="w-6 h-6" />;
      case 'linkedin_optimization': return <User className="w-6 h-6" />;
      case 'portfolio_website': return <Globe className="w-6 h-6" />;
      case 'interview_prep': return <Briefcase className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resume_review': return 'bg-blue-500/10 text-blue-600';
      case 'linkedin_optimization': return 'bg-cyan-500/10 text-cyan-600';
      case 'portfolio_website': return 'bg-purple-500/10 text-purple-600';
      case 'interview_prep': return 'bg-green-500/10 text-green-600';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Professional Services</h1>
          <p className="text-muted-foreground mt-2">
            Boost your career with our premium professional services
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">
          <Award className="w-4 h-4 mr-2" />
          Expert-Delivered
        </Badge>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoServices.map((service) => (
            <Card key={service.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg ${getCategoryColor(service.category)}`}>
                    {getCategoryIcon(service.category)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="mt-2">{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">₹{service.price.toLocaleString()}</div>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.delivery_days} days
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">What's Included:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button className="w-full btn-neon">
                    <Zap className="w-4 h-4 mr-2" />
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="glass-card bg-primary/5 border-primary/20">
        <CardContent className="text-center py-8">
          <Star className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Payment Integration Coming Soon!
          </h3>
          <p className="text-muted-foreground">
            These services will be available for purchase once our payment system is fully integrated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpsellServices;