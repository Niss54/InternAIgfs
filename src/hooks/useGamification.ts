import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  points: number;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  applications_count: number;
  interviews_count: number;
  total_points: number;
  rank: number;
}

export interface UserStats {
  total_applications: number;
  total_interviews: number;
  total_points: number;
  daily_streak: number;
  last_login: string;
  achievements_unlocked: Achievement[];
}

export const useGamification = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF']
    });
  };

  const checkDailyLogin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile to check last login via updated_at
      const { data: profile } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('user_id', user.id)
        .single();

      const today = new Date().toDateString();
      const lastUpdate = profile?.updated_at ? new Date(profile.updated_at).toDateString() : null;
      
      if (lastUpdate !== today) {
        // Simulate daily login reward
        toast({
          title: "Daily Login Reward! 🎉",
          description: "You earned 25 AI tokens for logging in today!",
        });
      }
    } catch (error) {
      console.error('Error checking daily login:', error);
    }
  };

  const checkAchievements = async (applicationsCount: number, interviewsCount: number) => {
    try {
      // Check for achievement unlocks and show notifications
      if (applicationsCount === 1) {
        triggerConfetti();
        toast({
          title: "Achievement Unlocked! 🚀",
          description: "First Step: Applied to your first internship",
        });
      }
      
      if (applicationsCount === 10) {
        triggerConfetti();
        toast({
          title: "Achievement Unlocked! 💼",
          description: "Application Master: Applied to 10 internships",
        });
      }
      
      if (interviewsCount === 1) {
        triggerConfetti();
        toast({
          title: "Achievement Unlocked! 🎯",
          description: "Interview Ready: Got your first interview",
        });
      }
      
      if (interviewsCount === 5) {
        triggerConfetti();
        toast({
          title: "Achievement Unlocked! 🌟",
          description: "Networking Pro: Got 5 interviews",
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch applications count
      const { data: applications } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id);

      // Fetch interviews count using application IDs
      const { data: interviews } = await supabase
        .from('interviews')
        .select('id, application_id')
        .in('application_id', applications?.map(app => app.id) || []);

      const applicationsCount = applications?.length || 0;
      const interviewsCount = interviews?.length || 0;

      // Calculate points based on activities
      const totalPoints = (applicationsCount * 10) + (interviewsCount * 25);
      
      // Mock daily streak based on profile updated date
      const { data: profile } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('user_id', user.id)
        .single();

      const mockStreak = Math.floor(Math.random() * 10) + 1;

      // Create achievements array
      const achievements: Achievement[] = [
        { 
          id: 'first_application', 
          name: 'First Step', 
          description: 'Applied to your first internship', 
          icon: '🚀', 
          condition: 'applications >= 1',
          points: 50,
          unlocked: applicationsCount >= 1
        },
        { 
          id: 'application_master', 
          name: 'Application Master', 
          description: 'Applied to 10 internships', 
          icon: '💼', 
          condition: 'applications >= 10',
          points: 100,
          unlocked: applicationsCount >= 10
        },
        { 
          id: 'interview_ready', 
          name: 'Interview Ready', 
          description: 'Got your first interview', 
          icon: '🎯', 
          condition: 'interviews >= 1',
          points: 75,
          unlocked: interviewsCount >= 1
        },
        { 
          id: 'networking_pro', 
          name: 'Networking Pro', 
          description: 'Got 5 interviews', 
          icon: '🌟', 
          condition: 'interviews >= 5',
          points: 150,
          unlocked: interviewsCount >= 5
        },
        { 
          id: 'consistency_king', 
          name: 'Consistency King', 
          description: '7-day login streak', 
          icon: '🔥', 
          condition: 'streak >= 7',
          points: 200,
          unlocked: mockStreak >= 7
        },
        { 
          id: 'point_collector', 
          name: 'Point Collector', 
          description: 'Earned 1000 points', 
          icon: '💎', 
          condition: 'points >= 1000',
          points: 100,
          unlocked: totalPoints >= 1000
        }
      ];

      setUserStats({
        total_applications: applicationsCount,
        total_interviews: interviewsCount,
        total_points: totalPoints,
        daily_streak: mockStreak,
        last_login: profile?.updated_at || new Date().toISOString(),
        achievements_unlocked: achievements
      });

      // Check for new achievements
      await checkAchievements(applicationsCount, interviewsCount);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Create mock leaderboard data since we don't have the RPC function
      const mockLeaderboard: LeaderboardEntry[] = [
        { user_id: '1', full_name: 'Alex Johnson', applications_count: 45, interviews_count: 12, total_points: 1250, rank: 1 },
        { user_id: '2', full_name: 'Sarah Chen', applications_count: 38, interviews_count: 10, total_points: 1100, rank: 2 },
        { user_id: '3', full_name: 'Mike Rodriguez', applications_count: 32, interviews_count: 8, total_points: 950, rank: 3 },
        { user_id: '4', full_name: 'Emily Davis', applications_count: 28, interviews_count: 7, total_points: 850, rank: 4 },
        { user_id: '5', full_name: 'David Kim', applications_count: 25, interviews_count: 6, total_points: 750, rank: 5 }
      ];
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    const initializeGamification = async () => {
      setLoading(true);
      await checkDailyLogin();
      await fetchUserStats();
      await fetchLeaderboard();
      setLoading(false);
    };

    initializeGamification();
  }, []);

  return {
    userStats,
    leaderboard,
    loading,
    fetchUserStats,
    fetchLeaderboard,
    triggerConfetti
  };
};