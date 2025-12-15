import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, CreditCard, Smartphone, Building } from "lucide-react";
import { PremiumPlan } from "@/lib/premiumManager";

interface PlanWelcomePopupProps {
  open: boolean;
  onClose: () => void;
  plan: PremiumPlan;
}

export const PlanWelcomePopup = ({ open, onClose, plan }: PlanWelcomePopupProps) => {
  const getPaymentIcon = (method?: string) => {
    if (method?.includes('Card')) return <CreditCard className="w-4 h-4" />;
    if (method?.includes('UPI')) return <Smartphone className="w-4 h-4" />;
    if (method?.includes('Banking')) return <Building className="w-4 h-4" />;
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to {plan.name}!
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            {plan.name === 'Free Trial' 
              ? '🎉 Your free trial is now active! This trial will last for 7 days only.'
              : `🎉 You are now our premium member in the ${plan.name} plan!`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Info for Paid Plans */}
          {plan.paymentMethod && plan.paymentDetails && (
            <div className="glass-card p-4 border border-primary/20">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                {getPaymentIcon(plan.paymentMethod)}
                Payment Method
              </h3>
              <p className="text-foreground font-medium">{plan.paymentMethod}</p>
              <p className="text-sm text-muted-foreground">{plan.paymentDetails}</p>
            </div>
          )}

          {/* Plan Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan Duration:</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {plan.duration} days
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="text-lg font-bold text-primary">{plan.price}/{plan.name === 'Free Trial' ? '7 days' : 'month'}</span>
            </div>
            {plan.name === 'Free Trial' && (
              <div className="flex items-center justify-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Note: Your free trial will automatically expire after 7 days
                </p>
              </div>
            )}
          </div>

          {/* Features List */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Your Plan Includes:</h3>
            <div className="grid gap-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-card/50">
                  <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={onClose} className="w-full btn-neon text-lg py-6">
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
