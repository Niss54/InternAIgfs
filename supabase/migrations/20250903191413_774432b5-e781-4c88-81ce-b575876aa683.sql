-- Create payments table for comprehensive payment tracking
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL, -- Amount in paise
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created', -- created, paid, failed, refunded
  plan_type TEXT NOT NULL, -- subscription, one-time
  plan_name TEXT NOT NULL,
  payment_method TEXT, -- card, upi, netbanking, wallet
  customer_email TEXT,
  customer_phone TEXT,
  notes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can manage all payments" 
ON public.payments 
FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Create updated_at trigger
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();