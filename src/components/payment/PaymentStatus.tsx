import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, XCircle, Clock, RefreshCw, 
  CreditCard, Smartphone, Banknote, Wallet 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentStatusProps {
  paymentId?: string;
  orderId?: string;
  onStatusChange?: (status: string) => void;
  autoRefresh?: boolean;
}

const PaymentStatus = ({ paymentId, orderId, onStatusChange, autoRefresh = false }: PaymentStatusProps) => {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchPaymentStatus = async () => {
    if (!paymentId && !orderId) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('payment-status', {
        body: {
          payment_id: paymentId,
          razorpay_order_id: orderId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.payment) {
        setPayment(data.payment);
        onStatusChange?.(data.payment.status);
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentStatus();
  };

  useEffect(() => {
    fetchPaymentStatus();
    
    // Auto-refresh every 10 seconds if enabled and payment is pending
    let interval: NodeJS.Timeout;
    if (autoRefresh && payment?.status === 'created') {
      interval = setInterval(fetchPaymentStatus, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentId, orderId, autoRefresh, payment?.status]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'created':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Paid</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      case 'created':
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'upi':
        return <Smartphone className="w-4 h-4" />;
      case 'netbanking':
        return <Banknote className="w-4 h-4" />;
      case 'wallet':
        return <Wallet className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading payment status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payment) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Payment not found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getStatusIcon(payment.status)}
            Payment Status
          </span>
          {getStatusBadge(payment.status)}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Payment Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Amount</span>
            <p className="font-semibold text-foreground">
              ₹{(payment.amount / 100).toFixed(2)}
            </p>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Plan</span>
            <p className="font-semibold text-foreground">{payment.plan_name}</p>
          </div>
          
          {payment.payment_method && (
            <div>
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <p className="font-semibold text-foreground flex items-center gap-2">
                {getPaymentMethodIcon(payment.payment_method)}
                {payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)}
              </p>
            </div>
          )}
          
          <div>
            <span className="text-sm text-muted-foreground">Created</span>
            <p className="font-semibold text-foreground">
              {new Date(payment.created_at).toLocaleString()}
            </p>
          </div>
          
          {payment.paid_at && (
            <div>
              <span className="text-sm text-muted-foreground">Paid At</span>
              <p className="font-semibold text-green-400">
                {new Date(payment.paid_at).toLocaleString()}
              </p>
            </div>
          )}
          
          {payment.failed_at && (
            <div>
              <span className="text-sm text-muted-foreground">Failed At</span>
              <p className="font-semibold text-red-400">
                {new Date(payment.failed_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Payment IDs */}
        {(payment.razorpay_order_id || payment.razorpay_payment_id) && (
          <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Transaction Details</h4>
            
            {payment.razorpay_order_id && (
              <div>
                <span className="text-xs text-muted-foreground">Order ID</span>
                <p className="font-mono text-sm text-foreground break-all">
                  {payment.razorpay_order_id}
                </p>
              </div>
            )}
            
            {payment.razorpay_payment_id && (
              <div>
                <span className="text-xs text-muted-foreground">Payment ID</span>
                <p className="font-mono text-sm text-foreground break-all">
                  {payment.razorpay_payment_id}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-secondary/50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;