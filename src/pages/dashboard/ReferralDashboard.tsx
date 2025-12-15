import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Users, 
  Gift, 
  Copy, 
  Share2, 
  Crown, 
  Zap,
  Trophy,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

interface ReferralStats {
  referral_code: string;
  total_referrals: number;
  successful_referrals: number;
  pending_referrals: number;
  total_rewards: number;
}

interface ReferralRecord {
  id: string;
  referrer_id: string;
  referee_id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Generate unique referral code from Firebase UID (first 8 characters)
      const uniqueCode = user.uid.substring(0, 8).toUpperCase();
      
      // Set stats with generated code
      setStats({
        referral_code: uniqueCode,
        total_referrals: 0,
        successful_referrals: 0,
        pending_referrals: 0,
        total_rewards: 0
      });

      // Set empty referrals array (using localStorage approach)
      setReferrals([]);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [user]);

  const copyReferralLink = () => {
    if (!stats?.referral_code) return;
    
    const referralUrl = `https://www.nissh.info?ref=${stats.referral_code}`;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareReferralLink = async () => {
    if (!stats?.referral_code) return;
    
    const referralUrl = `https://www.nissh.info?ref=${stats.referral_code}`;
    const shareData = {
      title: 'Join InternAI with my referral link!',
      text: 'Get 3 days of premium trial and 50 AI tokens when you sign up with my referral link.',
      url: referralUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  const getNextMilestone = () => {
    if (!stats) return { target: 5, reward: '1 week premium' };
    
    const milestones = [
      { target: 1, reward: '2 days premium' },
      { target: 3, reward: '1 week premium' },
      { target: 5, reward: '2 weeks premium' },
      { target: 10, reward: '1 month premium' },
      { target: 25, reward: '3 months premium' },
      { target: 50, reward: '6 months premium' }
    ];

    const nextMilestone = milestones.find(m => m.target > stats.successful_referrals);
    return nextMilestone || { target: 100, reward: 'Lifetime premium' };
  };

  const nextMilestone = getNextMilestone();
  const progressPercentage = stats ? (stats.successful_referrals / nextMilestone.target) * 100 : 0;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Referral Dashboard</h1>
          <p className="text-muted-foreground">
            Invite friends and earn premium rewards together
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={copyReferralLink} className="gap-2">
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button onClick={shareReferralLink} variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Total Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats?.total_referrals || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Friends invited
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent" />
                Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats?.successful_referrals || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Friends joined
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gift className="w-4 h-4 text-secondary" />
                Rewards Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats?.total_rewards || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total tokens + days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats?.total_referrals ? 
                  Math.round((stats.successful_referrals / stats.total_referrals) * 100) 
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Success rate
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Your Referral Link
            </CardTitle>
            <CardDescription>
              Share this link with friends. They get 3 days premium + 50 tokens, you get 5 days premium + 100 tokens!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border">
              <code className="flex-1 text-sm font-mono">
                {stats?.referral_code ? 
                  `nissh.info/ref/${stats.referral_code}` 
                  : 'Generating...'
                }
              </code>
              <Button size="sm" onClick={copyReferralLink}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Zap className="w-3 h-3" />
                Your Code: {stats?.referral_code}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress to Next Milestone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Next Milestone
            </CardTitle>
            <CardDescription>
              {nextMilestone.target - (stats?.successful_referrals || 0)} more successful referrals to earn {nextMilestone.reward}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{stats?.successful_referrals || 0}/{nextMilestone.target}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">
                Reward: {nextMilestone.reward}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Referrals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Recent Referrals
            </CardTitle>
            <CardDescription>
              Track your referral activity and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No referrals yet. Start sharing your link!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.slice(0, 5).map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-medium text-primary-foreground">
                        {referral.profiles?.full_name?.charAt(0) || referral.profiles?.email?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {referral.profiles?.full_name || referral.profiles?.email || 'Anonymous User'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                      {referral.status === 'completed' ? 'Joined' : 'Pending'}
                    </Badge>
                  </div>
                ))}
                
                {referrals.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      View All ({referrals.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReferralDashboard;