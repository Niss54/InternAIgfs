import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReferralStats {
  referral_code: string;
  total_referrals: number;
  successful_referrals: number;
  pending_referrals: number;
  total_rewards: number;
}

export const useReferralSystem = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReferralStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Generate unique referral code from Firebase UID (first 8 characters)
      const uniqueCode = user.uid.substring(0, 8).toUpperCase();
      
      // Set stats with generated code (using localStorage approach)
      setStats({
        referral_code: uniqueCode,
        total_referrals: 0,
        successful_referrals: 0,
        pending_referrals: 0,
        total_rewards: 0
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .rpc('generate_referral_code');
      
      if (error) throw error;
      
      // Update user profile with new referral code
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referral_code: data })
        .eq('user_id', user.uid);
      
      if (updateError) throw updateError;
      
      await fetchReferralStats();
      return data;
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast.error('Failed to generate referral code');
      return null;
    }
  };

  const createReferralLink = (code?: string) => {
    const referralCode = code || stats?.referral_code;
    if (!referralCode) return null;
    
    return `${window.location.origin}/signup?ref=${referralCode}`;
  };

  const shareReferral = async () => {
    const link = createReferralLink();
    if (!link) return false;

    const shareData = {
      title: 'Join InternAI with my referral!',
      text: 'Get premium trial and AI tokens when you sign up with my referral link.',
      url: link,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(link);
        toast.success('Referral link copied to clipboard!');
      }
      return true;
    } catch (error) {
      console.error('Error sharing referral:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchReferralStats();
    }
  }, [user]);

  return {
    stats,
    loading,
    fetchReferralStats,
    generateReferralCode,
    createReferralLink,
    shareReferral
  };
};