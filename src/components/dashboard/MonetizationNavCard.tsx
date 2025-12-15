import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Briefcase, 
  Shield, 
  Star,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const MonetizationNavCard = () => {
  const features = [
    {
      title: "Skill Certifications",
      description: "AI-graded tests with digital certificates",
      icon: Trophy,
      path: "/dashboard/certifications",
      price: "₹299-₹499",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      title: "Freelance Marketplace",
      description: "Offer services or hire skilled freelancers",
      icon: Briefcase,
      path: "/dashboard/freelance",
      price: "Commission-based",
      color: "bg-green-500/10 text-green-600"
    },
    {
      title: "Guarantee Packs",
      description: "Guaranteed internship placement or money back",
      icon: Shield,
      path: "/dashboard/guarantee",
      price: "₹4,999",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      title: "Professional Services",
      description: "Resume review, LinkedIn optimization & more",
      icon: Star,
      path: "/dashboard/services",
      price: "₹999+",
      color: "bg-orange-500/10 text-orange-600"
    }
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Boost Your Career
        </CardTitle>
        <CardDescription>Premium services to accelerate your success</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                  <Badge variant="outline" className="text-xs mt-1">{feature.price}</Badge>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to={feature.path}>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default MonetizationNavCard;