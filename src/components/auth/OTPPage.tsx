import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTPPage = () => {
  const navigate = useNavigate();

  // Redirect to login since OTP is not implemented with Supabase yet
  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
              <Smartphone className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">OTP Authentication</h1>
            <p className="text-muted-foreground mb-6">
              OTP authentication is not yet implemented with Supabase.
            </p>
            <Link to="/login">
              <Button className="btn-neon">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;