import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, Check, Star, Zap, Shield, Users, 
  TrendingUp, Calendar, Bot, FileText, CreditCard,
  Smartphone, ArrowLeft, Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FreeTrialBanner from "@/components/premium/FreeTrialBanner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { activatePaidPlan, getActivePlan, getDaysRemaining } from "@/lib/premiumManager";
import { PlanWelcomePopup } from "@/components/premium/PlanWelcomePopup";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PremiumUpgrade = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [welcomePlan, setWelcomePlan] = useState<any>(null);
  const activePlan = getActivePlan();
  const daysRemaining = getDaysRemaining();

  const plans = [
    {
      name: "Basic",
      price: "$4",
      originalPrice: "$6",
      period: "per month",
      description: "Perfect for students starting their career journey",
      features: [
        "50 Auto Applications",
        "Basic Resume Templates",
        "AI Chat Support",
        "Interview Preparation",
        "Email Support"
      ],
      popular: false,
      savings: "40% OFF",
      priceInPaise: 29900
    },
    {
      name: "Pro",
      price: "$8", 
      originalPrice: "$12",
      period: "per month",
      description: "Best for active job seekers",
      features: [
        "Unlimited Auto Applications",
        "Premium Resume Builder",
        "Advanced AI Assistant",
        "Priority Support",
        "Interview Preparation",
        "Application Analytics",
        "Custom Cover Letters",
        "ATS Score Optimization"
      ],
      popular: true,
      savings: "30% OFF",
      priceInPaise: 69900
    },
    {
      name: "Enterprise",
      price: "$15",
      originalPrice: "$22", 
      period: "per month",
      description: "For serious career builders",
      features: [
        "Everything in Pro",
        "1-on-1 Career Coaching",
        "Exclusive Job Opportunities",
        "Personal Brand Building",
        "Salary Negotiation Help",
        "Network Expansion Tools",
        "Advanced Analytics Dashboard",
        "White-label Solutions"
      ],
      popular: false,
      savings: "28% OFF",
      priceInPaise: 129900
    }
  ];

  const handlePayment = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.name);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: plan.priceInPaise,
          currency: 'INR',
          name: 'InternAI Premium',
          description: `${plan.name} Plan Subscription - Monthly`,
          handler: async function (response: any) {
            // Payment successful - Activate plan
            const paymentMethod = response.razorpay_payment_id ? 'card' : 'upi';
            const last4 = response.razorpay_payment_id ? response.razorpay_payment_id.slice(-4) : '0000';
            
            const activatedPlan = activatePaidPlan(
              plan.name as 'Basic' | 'Pro' | 'Enterprise',
              {
                method: paymentMethod,
                last4: last4
              }
            );
            
            setWelcomePlan(activatedPlan);
            setShowWelcomePopup(true);
            
            toast({
              title: "Payment Successful!",
              description: `Welcome to ${plan.name} plan! Payment ID: ${response.razorpay_payment_id}`,
            });
          },
          prefill: {
            name: '',
            email: '',
            contact: ''
          },
          notes: {
            plan: plan.name,
            subscription_type: 'monthly'
          },
          theme: {
            color: '#3B82F6'
          },
          modal: {
            ondismiss: function() {
              setLoadingPlan(null);
              toast({
                title: "Payment Cancelled",
                description: "Your payment was cancelled. You can try again anytime.",
                variant: "destructive"
              });
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast({
            title: "Payment Failed",
            description: response.error.description || "Payment failed. Please try again.",
            variant: "destructive"
          });
          setLoadingPlan(null);
        });
        rzp.open();
        setLoadingPlan(null);
      };

      script.onerror = () => {
        setLoadingPlan(null);
        toast({
          title: "Payment Error",
          description: "Unable to load payment gateway. Please try again.",
          variant: "destructive"
        });
      };

    } catch (error) {
      setLoadingPlan(null);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FreeTrialBanner />
      
      <div className="container mx-auto px-4 py-12">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center pulse-glow floating">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Supercharge your internship search with AI-powered tools and unlimited applications
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isActivePlan = activePlan?.name === plan.name;
            return (
            <Card key={index} className={`
              glass-card relative overflow-visible transition-all duration-500 hover:scale-105
              ${plan.popular ? 'border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-border/50'}
              ${isActivePlan ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : ''}
              group
            `}>
              {isActivePlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-1.5 text-sm font-semibold whitespace-nowrap pulse-glow">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              )}
              {!isActivePlan && plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-1.5 text-sm font-semibold whitespace-nowrap pulse-glow">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.savings && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 pulse-glow">
                    {plan.savings}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {plan.name === "Basic" && <Users className="w-8 h-8 text-primary" />}
                  {plan.name === "Pro" && <Zap className="w-8 h-8 text-primary" />}
                  {plan.name === "Enterprise" && <Crown className="w-8 h-8 text-primary" />}
                </div>
                
                <CardTitle className="text-2xl font-bold text-foreground mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice}
                    </span>
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full text-lg py-6 ${
                    isActivePlan
                      ? 'bg-green-500/20 text-green-400 border-green-500/30 cursor-not-allowed'
                      : plan.popular 
                      ? 'btn-neon' 
                      : 'btn-secondary-glow'
                  }`}
                  onClick={() => handlePayment(plan)}
                  disabled={loadingPlan !== null || isActivePlan}
                >
                  {isActivePlan ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {loadingPlan === plan.name ? 'Processing...' : `Choose ${plan.name}`}
                    </>
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    Cards
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    UPI
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Netbanking
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Auto Apply Technology",
              description: "AI automatically applies to relevant internships based on your profile"
            },
            {
              icon: FileText,
              title: "Smart Resume Builder",
              description: "ATS-optimized resumes tailored for each application"
            },
            {
              icon: Bot,
              title: "AI Career Assistant",
              description: "24/7 AI support for interview prep and career guidance"
            },
            {
              icon: TrendingUp,
              title: "Application Analytics",
              description: "Detailed insights on your application performance"
            },
            {
              icon: Calendar,
              title: "Interview Scheduler",
              description: "Smart scheduling and preparation tools"
            },
            {
              icon: Shield,
              title: "Priority Support",
              description: "Get help when you need it with premium support"
            }
          ].map((feature, index) => (
            <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Active Plan Display */}
        {activePlan && daysRemaining !== null && (
          <div className="mt-16 glass-card p-8 border-2 border-primary/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Your Active Plan: {activePlan.name}</h3>
                  <p className="text-muted-foreground">Premium Member</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white px-4 py-2 text-lg pulse-glow">
                {daysRemaining} {daysRemaining === 1 ? 'Day' : 'Days'} Remaining
              </Badge>
            </div>

            {activePlan.paymentMethod && activePlan.paymentDetails && (
              <div className="glass-card p-4 border border-primary/20 mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Payment Method</h4>
                <p className="text-foreground font-medium">{activePlan.paymentMethod}</p>
                <p className="text-sm text-muted-foreground">{activePlan.paymentDetails}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {activePlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Welcome Popup */}
      {showWelcomePopup && welcomePlan && (
        <PlanWelcomePopup 
          open={showWelcomePopup}
          onClose={() => setShowWelcomePopup(false)}
          plan={welcomePlan}
        />
      )}
    </div>
  );
};

export default PremiumUpgrade;