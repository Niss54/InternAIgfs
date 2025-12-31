import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarDays, 
  Briefcase, 
  Target, 
  TrendingUp, 
  Clock,
  Users,
  Star,
  MessageCircle,
  PlusCircle,
  Eye,
  Trophy,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FreeTrialBanner from "@/components/premium/FreeTrialBanner";
import { ReferralCard } from '@/components/dashboard/ReferralCard';
import { useAuth } from "@/contexts/AuthContext";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { useGamification } from "@/hooks/useGamification";
import { useTranslation } from "@/lib/i18n";
import MonetizationNavCard from "@/components/dashboard/MonetizationNavCard";


const Dashboard = () => {
  const { profile, stats, loading } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const { userStats: gamificationStats } = useGamification();
  const { t } = useTranslation();
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>>([]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FreeTrialBanner />
      
      {/* Welcome Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('dashboard.welcome')}{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your internship journey today.
          </p>
          {gamificationStats && (
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Trophy className="w-3 h-3 mr-1" />
                {gamificationStats.total_points} pts
              </Badge>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
                <Zap className="w-3 h-3 mr-1" />
                {gamificationStats.daily_streak} day streak
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link to="/dashboard/search">
              <PlusCircle className="w-4 h-4 mr-2" />
              Find Internships
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/networking">
              <Users className="w-4 h-4 mr-2" />
              Networking Hub
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/referrals">
              <Star className="w-4 h-4 mr-2" />
              Referrals
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/about">
              <MessageCircle className="w-4 h-4 mr-2" />
              About
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.applications')}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.applications || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 5)} this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.interviews')}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.interviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.interviews ? 'Great progress!' : 'Keep applying!'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.response_rate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.responseRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.responseRate && stats.responseRate > 15 ? 'Above average' : 'Keep improving'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.profile_views')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.profileViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10)} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gamification, Referral and Monetization Section */}
      <GamificationDashboard />

      {/* Recent Activity Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground">Start applying to internships to see your activity here</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;