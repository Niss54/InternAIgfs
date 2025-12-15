import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, UserPlus } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const MakeAdminPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { makeUserAdmin } = useAdminAuth();

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await makeUserAdmin(email);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card className="glass-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 pulse-glow">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Grant Admin Access
          </CardTitle>
          <p className="text-muted-foreground">
            Add admin privileges to a user account
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleMakeAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full btn-neon"
              disabled={isLoading}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isLoading ? "Granting Access..." : "Make Admin"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium mb-2">⚠️ Important Security Notice</p>
            <p className="text-xs text-muted-foreground">
              This page should only be used to create the first admin. 
              Remove this page after creating your admin account for security.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeAdminPage;