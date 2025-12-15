import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from './AdminSidebar';
import { FloatingChatWidget } from '@/components/chat/FloatingChatWidget';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading } = useAdminAuth('/admin/dashboard');

  useEffect(() => {
    // The useAdminAuth hook handles all authentication logic
    if (isAdmin === false) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "Successfully signed out of admin panel",
      });
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar onSignOut={handleSignOut} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <FloatingChatWidget />
    </div>
  );
};

export default AdminLayout;