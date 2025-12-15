// Premium Plan Management Utility

export interface PremiumPlan {
  name: 'Free Trial' | 'Basic' | 'Pro' | 'Enterprise';
  features: string[];
  price: string;
  duration: number; // days
  startDate: string;
  endDate: string;
  isActive: boolean;
  paymentMethod?: string;
  paymentDetails?: string;
}

export interface PaymentInfo {
  method: 'card' | 'upi' | 'netbanking';
  last4?: string; // last 4 digits of card/account
  phoneNumber?: string; // for UPI
}

export const activateFreeTrial = (): PremiumPlan => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const plan: PremiumPlan = {
    name: 'Free Trial',
    features: [
      '5 Auto Applications',
      'Basic Resume Templates',
      'AI Chat Support'
    ],
    price: '$0',
    duration: 7,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: true
  };

  localStorage.setItem('activePlan', JSON.stringify(plan));
  localStorage.setItem('trialStartDate', startDate.toISOString());
  
  return plan;
};

export const activatePaidPlan = (
  planName: 'Basic' | 'Pro' | 'Enterprise',
  paymentInfo: PaymentInfo
): PremiumPlan => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 30 days

  const planFeatures: Record<string, string[]> = {
    Basic: [
      '50 Auto Applications',
      'Basic Resume Templates',
      'AI Chat Support',
      'Interview Preparation',
      'Email Support'
    ],
    Pro: [
      'Unlimited Auto Applications',
      'Premium Resume Builder',
      'Advanced AI Assistant',
      'Priority Support',
      'Interview Preparation',
      'Application Analytics',
      'Custom Cover Letters',
      'ATS Score Optimization'
    ],
    Enterprise: [
      'Everything in Pro',
      '1-on-1 Career Coaching',
      'Exclusive Job Opportunities',
      'Personal Brand Building',
      'Salary Negotiation Help',
      'Network Expansion Tools',
      'Advanced Analytics Dashboard',
      'White-label Solutions'
    ]
  };

  const prices: Record<string, string> = {
    Basic: '$4',
    Pro: '$8',
    Enterprise: '$15'
  };

  let paymentMethodStr = '';
  let paymentDetailsStr = '';

  if (paymentInfo.method === 'card' && paymentInfo.last4) {
    paymentMethodStr = 'Credit/Debit Card';
    paymentDetailsStr = `**** **** **** ${paymentInfo.last4}`;
  } else if (paymentInfo.method === 'upi' && paymentInfo.phoneNumber) {
    paymentMethodStr = 'UPI';
    paymentDetailsStr = paymentInfo.phoneNumber;
  } else if (paymentInfo.method === 'netbanking' && paymentInfo.last4) {
    paymentMethodStr = 'Net Banking';
    paymentDetailsStr = `Account ending in ${paymentInfo.last4}`;
  }

  const plan: PremiumPlan = {
    name: planName,
    features: planFeatures[planName],
    price: prices[planName],
    duration: 30,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: true,
    paymentMethod: paymentMethodStr,
    paymentDetails: paymentDetailsStr
  };

  localStorage.setItem('activePlan', JSON.stringify(plan));
  localStorage.setItem('planStartDate', startDate.toISOString());
  
  return plan;
};

export const getActivePlan = (): PremiumPlan | null => {
  const planStr = localStorage.getItem('activePlan');
  if (!planStr) return null;

  const plan: PremiumPlan = JSON.parse(planStr);
  
  // Check if plan is expired
  const endDate = new Date(plan.endDate);
  const now = new Date();
  
  if (now > endDate) {
    // Plan expired
    localStorage.removeItem('activePlan');
    localStorage.removeItem('trialStartDate');
    localStorage.removeItem('planStartDate');
    return null;
  }

  return plan;
};

export const getDaysRemaining = (): number | null => {
  const plan = getActivePlan();
  if (!plan) return null;

  const endDate = new Date(plan.endDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

export const isPlanActive = (): boolean => {
  return getActivePlan() !== null;
};
