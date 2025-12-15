import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { Gift, Copy, Share2, Users } from 'lucide-react';

export const ReferralCard: React.FC = () => {
  const { stats, shareReferral } = useReferralSystem();

  const copyReferralLink = () => {
    if (!stats?.referral_code) return;
    
    const referralUrl = `${window.location.origin}/signup?ref=${stats.referral_code}`;
    navigator.clipboard.writeText(referralUrl);
  };

  if (!stats) return null;

  return (
    <Card className="glass-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Earn rewards by inviting friends to join InternAI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your Referrals</p>
            <p className="text-2xl font-bold text-foreground">{stats.successful_referrals}</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {stats.total_referrals} invited
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={copyReferralLink} size="sm" className="gap-2">
            <Copy className="w-3 h-3" />
            Copy Link
          </Button>
          <Button onClick={shareReferral} variant="outline" size="sm" className="gap-2">
            <Share2 className="w-3 h-3" />
            Share
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>• Friend gets: 3 days premium + 50 AI tokens</p>
          <p>• You get: 5 days premium + 100 AI tokens</p>
        </div>
      </CardContent>
    </Card>
  );
};