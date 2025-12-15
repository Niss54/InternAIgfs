import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AchievementBadge } from './AchievementBadge';
import { LeaderboardWidget } from './LeaderboardWidget';
import { RewardsPanel } from './RewardsPanel';
import { ReferralCard } from '@/components/dashboard/ReferralCard';
import MonetizationNavCard from '@/components/dashboard/MonetizationNavCard';
import { useGamification } from '@/hooks/useGamification';
import { Trophy, Target, Zap, Star } from 'lucide-react';

export const GamificationDashboard = () => {
  const { userStats, loading } = useGamification();

  const achievements = [
    { 
      id: 'first_application', 
      name: 'First Step', 
      description: 'Applied to your first internship', 
      icon: '🚀', 
      points: 50,
      unlocked: (userStats?.total_applications || 0) >= 1,
      condition: 'Apply to 1 internship'
    },
    { 
      id: 'application_master', 
      name: 'Application Master', 
      description: 'Applied to 10 internships', 
      icon: '💼', 
      points: 100,
      unlocked: (userStats?.total_applications || 0) >= 10,
      condition: 'Apply to 10 internships'
    },
    { 
      id: 'interview_ready', 
      name: 'Interview Ready', 
      description: 'Got your first interview', 
      icon: '🎯', 
      points: 75,
      unlocked: (userStats?.total_interviews || 0) >= 1,
      condition: 'Get 1 interview'
    },
    { 
      id: 'networking_pro', 
      name: 'Networking Pro', 
      description: 'Got 5 interviews', 
      icon: '🌟', 
      points: 150,
      unlocked: (userStats?.total_interviews || 0) >= 5,
      condition: 'Get 5 interviews'
    },
    { 
      id: 'consistency_king', 
      name: 'Consistency King', 
      description: '7-day login streak', 
      icon: '🔥', 
      points: 200,
      unlocked: (userStats?.daily_streak || 0) >= 7,
      condition: 'Login for 7 days straight'
    },
    { 
      id: 'point_collector', 
      name: 'Point Collector', 
      description: 'Earned 1000 points', 
      icon: '💎', 
      points: 100,
      unlocked: (userStats?.total_points || 0) >= 1000,
      condition: 'Earn 1000 points'
    }
  ];

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-80 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Achievement Badges */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
            <CardDescription>
              Unlock badges by completing challenges
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  {...achievement}
                  size="md"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Stats */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Progress
            </CardTitle>
            <CardDescription>
              Track your internship journey stats
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{userStats?.total_applications || 0}</div>
                <div className="text-sm text-muted-foreground">Applications</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="text-2xl font-bold text-accent">{userStats?.total_interviews || 0}</div>
                <div className="text-sm text-muted-foreground">Interviews</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <div className="text-2xl font-bold text-green-600">{userStats?.total_points || 0}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                <div className="text-2xl font-bold text-orange-600">{userStats?.daily_streak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <LeaderboardWidget />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <RewardsPanel />
        <ReferralCard />
        <MonetizationNavCard />
      </div>
    </div>
  );
};