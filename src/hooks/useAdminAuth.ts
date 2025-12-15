import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminAuth = (redirectPath?: string) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        if (redirectPath) {
          navigate('/admin/login');
        }
        return;
      }

      // Check if user has admin role using the secure function
      const { data, error } = await supabase.rpc('current_user_is_admin');

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        toast({
          title: "Error",
          description: "Failed to verify admin status",
          variant: "destructive",
        });
      } else {
        setIsAdmin(data);

        if (!data && redirectPath) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
          navigate('/admin/login');
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      if (redirectPath) {
        navigate('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const makeUserAdmin = async (email: string) => {
    try {
      // Get user by email from auth.users (using admin query)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .single();

      if (!profiles) {
        throw new Error('User not found. Make sure the user has signed up first.');
      }

      // Insert admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: profiles.user_id,
          role: 'admin'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Admin role granted to ${email}`,
      });
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { isAdmin, isLoading, checkAdminStatus, makeUserAdmin };
};