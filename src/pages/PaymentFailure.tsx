import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RotateCcw, ArrowLeft, AlertTriangle, CreditCard } from "lucide-react";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const [isAnimated, setIsAnimated] = useState(false);
  
  const error = searchParams.get('error');
  const plan = searchParams.get('plan');

  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const commonIssues = [
    {
      icon: CreditCard,
      title: "Insufficient Balance",
      description: "Please check your account balance and try again"
    },
    {
      icon: AlertTriangle,
      title: "Card Declined",
      description: "Your bank may have declined the transaction for security reasons"
    },
    {
      icon: XCircle,
      title: "Network Error",
      description: "Please check your internet connection and retry"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass-card max-w-2xl w-full overflow-hidden">
        <CardContent className="p-0">
          {/* Failure Header */}
          <div className="text-center p-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 animate-pulse" />
            
            <div className={`relative transition-all duration-1000 ${
              isAnimated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}>
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center pulse-glow">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Payment Failed
              </h1>
              
              <p className="text-xl text-muted-foreground">
                We couldn't process your payment for {plan} Plan
              </p>
            </div>
          </div>

          {/* Error Details */}
          <div className="p-8 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Error Details
                </h3>
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Common Issues */}
            <div className="bg-secondary/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Common Issues & Solutions</h3>
              
              <div className="space-y-4">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <issue.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to do next */}
            <div className="bg-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">What to do next?</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <span className="text-foreground">Check your payment method and ensure sufficient balance</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <span className="text-foreground">Try using a different payment method (UPI, Card, Net Banking)</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <span className="text-foreground">Contact your bank if the issue persists</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="btn-neon flex-1"
              >
                <Link to="/premium-upgrade">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="bg-secondary/50 flex-1"
              >
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            {/* Support */}
            <div className="text-center pt-6 border-t border-border/50">
              <p className="text-muted-foreground text-sm mb-2">
                Still having trouble? We're here to help!
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="link" className="text-primary">
                  Contact Support
                </Button>
                <Button variant="link" className="text-primary">
                  Live Chat
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;