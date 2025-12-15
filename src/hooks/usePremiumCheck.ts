import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePremiumCheck = (redirectPath?: string) => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsPremium(false);
        setIsLoading(false);
        if (redirectPath) {
          navigate('/auth/login');
        }
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_expires_at')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } else {
        const isPremiumUser = profile?.is_premium && 
          (!profile.premium_expires_at || new Date(profile.premium_expires_at) > new Date());
        setIsPremium(isPremiumUser);

        if (!isPremiumUser && redirectPath) {
          toast({
            title: "Premium Feature",
            description: "This feature requires a premium subscription.",
            variant: "destructive",
          });
          navigate('/premium-upgrade');
        }
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isPremium, isLoading, checkPremiumStatus };
};