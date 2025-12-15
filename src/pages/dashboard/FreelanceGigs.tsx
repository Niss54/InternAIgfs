import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Star, 
  Plus,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const FreelanceGigs = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Freelance Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Find skilled freelancers or offer your services
          </p>
        </div>
        <Button className="btn-neon">
          <Plus className="w-4 h-4 mr-2" />
          Create Gig
        </Button>
      </div>

      {/* Coming Soon */}
      <Card className="glass-card text-center py-12">
        <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Freelance Marketplace Coming Soon!</h3>
        <p className="text-muted-foreground mb-4">
          Connect with skilled freelancers and offer your services
        </p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Browse Services
          </div>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Gigs
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Secure Payments
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FreelanceGigs;