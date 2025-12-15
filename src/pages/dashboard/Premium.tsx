import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, Check, Star, Zap, Shield, Users, 
  TrendingUp, Calendar, Bot, FileText, CreditCard, Smartphone, Building
} from "lucide-react";
import { getActivePlan, getDaysRemaining } from "@/lib/premiumManager";
import { Link } from "react-router-dom";

const Premium = () => {
  const activePlan = getActivePlan();
  const daysRemaining = getDaysRemaining();

  const getPaymentIcon = (method?: string) => {
    if (method?.includes('card')) return <CreditCard className="w-4 h-4" />;
    if (method?.includes('upi')) return <Smartphone className="w-4 h-4" />;
    if (method?.includes('netbanking')) return <Building className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  const premiumFeatures = [
    {
      icon: Zap,
      title: "Auto Apply Technology",
      description: "AI automatically applies to relevant internships based on your profile",
      included: true
    },
    {
      icon: FileText,
      title: "Smart Resume Builder",
      description: "ATS-optimized resumes tailored for each application",
      included: true
    },
    {
      icon: Bot,
      title: "AI Career Assistant",
      description: "24/7 AI support for interview prep and career guidance",
      included: true
    },
    {
      icon: TrendingUp,
      title: "Application Analytics",
      description: "Detailed insights on your application performance",
      included: true
    },
    {
      icon: Calendar,
      title: "Interview Scheduler",
      description: "Smart scheduling and preparation tools",
      included: true
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Get help when you need it with premium support",
      included: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
          <Crown className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Premium Dashboard</h1>
        <p className="text-muted-foreground">Manage your subscription and unlock premium features</p>
      </div>

      {activePlan ? (
        <>
          {/* Current Plan Status */}
          <Card className="glass-card border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {activePlan.name} Plan
                    </h2>
                    <p className="text-muted-foreground">
                      {activePlan.name === 'Free Trial' 
                        ? `Trial expires in ${daysRemaining} days` 
                        : `${daysRemaining} days remaining`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {activePlan.price}
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
              
              {/* Payment Information */}
              {activePlan.paymentMethod && activePlan.paymentDetails && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    {getPaymentIcon(activePlan.paymentMethod)}
                    Payment Method
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-bold">
                      ••••
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">{activePlan.paymentMethod}</p>
                      <p className="text-sm text-muted-foreground">{activePlan.paymentDetails}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">156</div>
                    <div className="text-sm text-muted-foreground">Applications Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">23</div>
                    <div className="text-sm text-muted-foreground">Interviews Scheduled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">8</div>
                    <div className="text-sm text-muted-foreground">Offers Received</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground">Your Plan Features</CardTitle>
              <CardDescription>Everything included in your {activePlan.name} plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {activePlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Section */}
          {(activePlan.name === 'Free Trial' || activePlan.name === 'Basic') && (
            <Card className="glass-card border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Want more features?
                    </h3>
                    <p className="text-muted-foreground">
                      Upgrade to {activePlan.name === 'Free Trial' ? 'a paid plan' : activePlan.name === 'Basic' ? 'Pro or Enterprise' : 'Pro'} for unlimited access
                    </p>
                  </div>
                  <Button asChild className="btn-neon">
                    <Link to="/dashboard/premium-upgrade">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* No Active Plan - Show CTA */
        <Card className="glass-card border-primary/30">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center pulse-glow">
              <Crown className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No Active Premium Plan
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Unlock premium features and supercharge your internship search with AI-powered tools
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="btn-neon">
                <Link to="/dashboard/premium-upgrade">
                  <Crown className="w-4 h-4 mr-2" />
                  View Premium Plans
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-secondary/50">
                <Link to="/">
                  Try Free Trial
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Premium Features */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-foreground">All Premium Features</CardTitle>
          <CardDescription>See what you can unlock with premium plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Premium;