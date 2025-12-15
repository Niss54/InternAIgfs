import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  Code, 
  Brain, 
  Star, 
  CheckCircle,
  Play,
  Lock,
  Medal,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Certifications = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">InternAI Verified Certifications</h1>
          <p className="text-muted-foreground mt-2">
            Earn industry-recognized certificates to boost your profile
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">
          <Trophy className="w-4 h-4 mr-2" />
          AI-Graded & Verified
        </Badge>
      </div>

      {/* Coming Soon */}
      <Card className="glass-card text-center py-12">
        <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Certifications Coming Soon!</h3>
        <p className="text-muted-foreground mb-4">
          We're preparing AI-graded certification tests to validate your skills
        </p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            MCQ Tests
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Coding Challenges
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Digital Certificates
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Certifications;