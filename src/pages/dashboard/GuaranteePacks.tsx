import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Target, 
  CheckCircle, 
  Clock, 
  Briefcase,
  TrendingUp,
  Award,
  Zap,
  Users,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const GuaranteePacks = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Internship Guarantee Packs</h1>
          <p className="text-muted-foreground mt-2">
            Get guaranteed internship offers or your money back
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-500/10 text-green-600 w-fit">
          <Shield className="w-4 h-4 mr-2" />
          100% Money Back Guarantee
        </Badge>
      </div>

      {/* Coming Soon */}
      <Card className="glass-card text-center py-12">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Guarantee Packs Coming Soon!</h3>
        <p className="text-muted-foreground mb-4">
          Premium guarantee packages with internship placement assurance
        </p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Guaranteed Placement
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Dedicated Support
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Money Back Promise
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GuaranteePacks;