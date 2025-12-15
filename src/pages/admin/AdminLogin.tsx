import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAdminStatus } = useAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin using the secure admin check
      const { data: isAdminUser, error: adminError } = await supabase.rpc('current_user_is_admin');

      if (adminError) {
        console.error('Admin check error:', adminError);
        await supabase.auth.signOut();
        toast({
          title: "Error",
          description: "Failed to verify admin privileges",
          variant: "destructive",
        });
        return;
      }

      if (isAdminUser) {
        toast({
          title: "Welcome Admin",
          description: "Successfully logged in to admin panel",
        });
        navigate('/admin/dashboard');
      } else {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Only designated admins can access this panel.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-background via-background/80 to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,transparent_50%)] opacity-10" />
      </div>
      
      <Card className="glass-card w-full max-w-md relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 pulse-glow">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            Admin Portal
          </CardTitle>
          <p className="text-muted-foreground">
            Secure access to InternAI admin panel
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@internai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full btn-neon"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <Link 
              to="/"
              className="text-primary hover:text-primary-glow transition-colors text-sm"
            >
              ← Back to Main Site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;