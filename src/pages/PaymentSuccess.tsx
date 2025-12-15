import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, ArrowRight, Download, AlertTriangle } from "lucide-react";
import PaymentStatus from "@/components/payment/PaymentStatus";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isAnimated, setIsAnimated] = useState(false);
  
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  const plan = searchParams.get('plan');
  const verified = searchParams.get('verified');

  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass-card max-w-2xl w-full overflow-hidden">
        <CardContent className="p-0">
          {/* Success Header */}
          <div className={`text-center p-8 relative overflow-hidden ${
            verified === 'false' 
              ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10' 
              : 'bg-gradient-to-br from-green-500/10 to-primary/10'
          }`}>
            <div className={`absolute inset-0 animate-pulse ${
              verified === 'false' 
                ? 'bg-gradient-to-r from-yellow-500/5 to-orange-500/5' 
                : 'bg-gradient-to-r from-green-500/5 to-primary/5'
            }`} />
            
            <div className={`relative transition-all duration-1000 ${
              isAnimated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}>
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center pulse-glow floating ${
                verified === 'false' 
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                  : 'bg-gradient-to-br from-green-500 to-green-600'
              }`}>
                {verified === 'false' ? (
                  <AlertTriangle className="w-12 h-12 text-white" />
                ) : (
                  <CheckCircle className="w-12 h-12 text-white" />
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {verified === 'false' ? 'Payment Needs Verification' : 'Payment Successful! 🎉'}
              </h1>
              
              <p className="text-xl text-muted-foreground">
                {verified === 'false' 
                  ? 'Payment completed but verification pending' 
                  : `Welcome to ${plan} Plan`
                }
              </p>
              
              {verified === 'false' && (
                <p className="text-sm text-yellow-400 mt-2">
                  Please contact support if your premium access is not activated within 5 minutes
                </p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-8 space-y-6">
            <PaymentStatus 
              paymentId={paymentId || undefined}
              orderId={orderId || undefined}
              autoRefresh={verified === 'false'}
            />

            {/* What's Next */}
            <div className="bg-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" />
                What's Next?
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <span className="text-foreground">Complete your profile to get personalized internship matches</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <span className="text-foreground">Upload your resume or create one with our AI builder</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <span className="text-foreground">Start applying to internships with unlimited auto-applications</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="btn-neon flex-1"
              >
                <Link to="/dashboard">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-secondary/50 flex-1"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>

            {/* Support */}
            <div className="text-center pt-6 border-t border-border/50">
              <p className="text-muted-foreground text-sm mb-2">
                Need help? Our premium support team is here for you!
              </p>
              <Button variant="link" className="text-primary">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;