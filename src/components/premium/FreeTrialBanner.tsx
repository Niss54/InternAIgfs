import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Crown, X } from "lucide-react";

const FreeTrialBanner = () => {
  const [daysLeft, setDaysLeft] = useState(7);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate countdown - in real app, calculate from user's trial start date
    const timer = setInterval(() => {
      setDaysLeft(prev => Math.max(0, prev - 1));
    }, 24 * 60 * 60 * 1000); // Update daily

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <Card className="relative mx-4 mt-4 overflow-hidden border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse" />
      
      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center pulse-glow">
            <Crown className="w-6 h-6 text-primary-foreground" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Free Trial Active
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary pulse-glow">
                {daysLeft}
              </span>
              <span className="text-foreground">
                {daysLeft === 1 ? 'day' : 'days'} left in your free trial
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            className="btn-neon"
            onClick={() => window.location.href = '/premium-upgrade'}
          >
            Upgrade Now
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/30">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
          style={{ width: `${(daysLeft / 7) * 100}%` }}
        />
      </div>
    </Card>
  );
};

export default FreeTrialBanner;