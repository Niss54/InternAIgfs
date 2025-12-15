import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

export const LeaderboardWidget = () => {
  const { leaderboard, loading } = useGamification();

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2: return <Medal className="w-4 h-4 text-gray-400" />;
      case 3: return <Award className="w-4 h-4 text-amber-600" />;
      default: return <Star className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch(rank) {
      case 1: return "default";
      case 2: return "secondary"; 
      case 3: return "outline";
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Leaderboard
          </CardTitle>
          <CardDescription>Loading rankings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="w-24 h-4 bg-muted rounded" />
                </div>
                <div className="w-16 h-6 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data - always show dummy data for demo
  const mockLeaderboard = [
    { user_id: '1', full_name: 'Alex Johnson', applications_count: 45, interviews_count: 12, total_points: 1250, rank: 1 },
    { user_id: '2', full_name: 'Sarah Chen', applications_count: 38, interviews_count: 10, total_points: 1100, rank: 2 },
    { user_id: '3', full_name: 'Mike Rodriguez', applications_count: 32, interviews_count: 8, total_points: 950, rank: 3 },
    { user_id: '4', full_name: 'Emily Davis', applications_count: 28, interviews_count: 7, total_points: 850, rank: 4 },
    { user_id: '5', full_name: 'David Kim', applications_count: 25, interviews_count: 6, total_points: 750, rank: 5 },
    { user_id: '6', full_name: 'Priya Sharma', applications_count: 22, interviews_count: 5, total_points: 680, rank: 6 },
    { user_id: '7', full_name: 'James Wilson', applications_count: 20, interviews_count: 5, total_points: 620, rank: 7 },
    { user_id: '8', full_name: 'Lisa Anderson', applications_count: 18, interviews_count: 4, total_points: 550, rank: 8 },
    { user_id: '9', full_name: 'Rahul Verma', applications_count: 16, interviews_count: 4, total_points: 500, rank: 9 },
    { user_id: '10', full_name: 'Nina Patel', applications_count: 15, interviews_count: 3, total_points: 450, rank: 10 },
    { user_id: '11', full_name: 'Kevin Zhang', applications_count: 14, interviews_count: 3, total_points: 420, rank: 11 },
    { user_id: '12', full_name: 'Maria Garcia', applications_count: 12, interviews_count: 2, total_points: 380, rank: 12 }
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top performers this month</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {mockLeaderboard.map((entry) => (
            <div 
              key={entry.user_id}
              className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-card/50 to-card/30 border border-border/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Badge variant={getRankBadgeVariant(entry.rank)} className="w-7 h-7 rounded-full flex items-center justify-center p-0">
                  {getRankIcon(entry.rank)}
                </Badge>
                <div>
                  <p className="font-medium text-sm text-foreground">{entry.full_name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{entry.applications_count} apps</span>
                    <span>{entry.interviews_count} interviews</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  {entry.total_points} pts
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};