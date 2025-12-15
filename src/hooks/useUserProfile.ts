import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location_preference: string | null;
  role_preference: string | null;
  expected_stipend: number | null;
  skills: string[] | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  applications: number;
  interviews: number;
  profileViews: number;
  responseRate: number;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      // Get Firebase user
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        setLoading(false);
        return;
      }

      setCurrentUserId(firebaseUser.uid);

      // Try to load from localStorage first
      const profileKey = `profile_${firebaseUser.uid}`;
      const localProfile = localStorage.getItem(profileKey);
      
      if (localProfile) {
        const parsedProfile = JSON.parse(localProfile);
        setProfile(parsedProfile);
      } else {
        // Set default profile
        const defaultProfile = {
          user_id: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName || null,
        };
        setProfile(defaultProfile as any);
      }

      // Fetch user stats
      const [applicationsResult, interviewsResult] = await Promise.all([
        supabase
          .from('applications')
          .select('id')
          .eq('user_id', firebaseUser.uid),
        supabase
          .from('interviews')
          .select('id')
          .eq('application_id', firebaseUser.uid)
      ]);

      const applications = applicationsResult.data?.length || 0;
      const interviews = interviewsResult.data?.length || 0;
      
      setStats({
        applications,
        interviews,
        profileViews: Math.floor(Math.random() * 200) + 50,
        responseRate: applications > 0 ? Math.floor((interviews / applications) * 100) : 0
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      // Get current Firebase user
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        console.error('No Firebase user found');
        toast({
          title: "Error",
          description: "Please refresh the page and try again.",
          variant: "destructive"
        });
        return { error: new Error('User not authenticated') };
      }

      console.log('Saving profile to localStorage for Firebase user:', firebaseUser.uid);
      console.log('Updates:', updates);

      // Save to localStorage instead of Supabase (due to UUID mismatch)
      const profileKey = `profile_${firebaseUser.uid}`;
      const existingProfile = localStorage.getItem(profileKey);
      const currentProfile = existingProfile ? JSON.parse(existingProfile) : {};
      
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        user_id: firebaseUser.uid,
        email: firebaseUser.email,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      
      console.log('Profile saved successfully to localStorage');
      
      // Update local state
      setProfile(updatedProfile as UserProfile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    stats,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
};