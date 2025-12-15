import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Coins, Crown, Zap, Check } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export const RewardsPanel = () => {
  const { userStats, loading, triggerConfetti } = useGamification();
  const { toast } = useToast();
  
  // State for tracking claims
  const [totalTokens, setTotalTokens] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('totalAITokens');
    const storedStreak = localStorage.getItem('dailyStreak');
    const storedLastClaim = localStorage.getItem('lastClaimDate');
    
    if (storedTokens) setTotalTokens(parseInt(storedTokens));
    if (storedStreak) setCurrentStreak(parseInt(storedStreak));
    if (storedLastClaim) {
      setLastClaimDate(storedLastClaim);
      // Check if already claimed today
      const today = new Date().toDateString();
      const lastClaim = new Date(storedLastClaim).toDateString();
      setIsClaimed(today === lastClaim);
      
      // Check if streak should be reset (missed a day)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastClaim !== today && lastClaim !== yesterdayStr) {
        // Missed a day, reset streak
        setCurrentStreak(0);
        localStorage.setItem('dailyStreak', '0');
      }
    }
  }, []);

  const handleClaimReward = async (rewardId: string, type: string, amount: number) => {
    // Check if already claimed today
    if (isClaimed) {
      toast({
        title: "Already Claimed",
        description: "You've already claimed your daily reward today. Come back tomorrow!",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toDateString();
    const newTotalTokens = totalTokens + amount;
    const newStreak = currentStreak + 1;
    
    // Update state
    setTotalTokens(newTotalTokens);
    setCurrentStreak(newStreak);
    setLastClaimDate(today);
    setIsClaimed(true);
    
    // Save to localStorage
    localStorage.setItem('totalAITokens', newTotalTokens.toString());
    localStorage.setItem('dailyStreak', newStreak.toString());
    localStorage.setItem('lastClaimDate', today);
    
    triggerConfetti();
    toast({
      title: "Reward Claimed! 🎉",
      description: `You received ${amount} AI tokens! Total: ${newTotalTokens}`,
    });
  };

  const getRewardIcon = (type: string) => {
    switch(type) {
      case 'tokens': return <Coins className="w-4 h-4 text-yellow-500" />;
      case 'premium_days': return <Crown className="w-4 h-4 text-purple-500" />;
      case 'badge': return <Badge className="w-4 h-4 text-blue-500" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Daily Rewards
          </CardTitle>
          <CardDescription>Loading rewards...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const dailyStreak = userStats?.daily_streak || 0;
  const todaysClaimed = userStats?.last_login ? 
    new Date(userStats.last_login).toDateString() === new Date().toDateString() : false;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Daily Rewards
        </CardTitle>
        <CardDescription>
          Streak: {currentStreak} {currentStreak > 0 ? 'days' : 'day'} {currentStreak >= 7 && '🔥'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Login Reward */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-medium">Daily Login</span>
            </div>
            <Badge variant={isClaimed ? "secondary" : "default"}>
              {isClaimed ? "Claimed" : "Available"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {currentStreak >= 7 ? "50 AI tokens + bonus!" : "25 AI tokens"}
          </p>
          <Button 
            size="sm" 
            disabled={isClaimed}
            onClick={() => handleClaimReward('daily', 'tokens', currentStreak >= 7 ? 50 : 25)}
            className="w-full"
          >
            {isClaimed ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Claimed
              </span>
            ) : 'Claim Reward'}
          </Button>
          
          {/* Day Complete Message */}
          {isClaimed && (
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-primary">
                Day {currentStreak} Complete! ✓
              </p>
            </div>
          )}
        </div>

        {/* Pending Rewards - Removed since not in UserStats interface */}

        {/* Next Rewards Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Upcoming Rewards</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Day {currentStreak + 1}</div>
              <div className="text-sm font-medium">25 tokens</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Day 7 Bonus</div>
              <div className="text-sm font-medium">+25 extra</div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{totalTokens}</div>
              <div className="text-xs text-muted-foreground">AI Tokens</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">{userStats?.achievements_unlocked?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};