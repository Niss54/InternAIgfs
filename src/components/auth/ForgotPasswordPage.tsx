import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      setIsSubmitted(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating absolute top-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
          <div className="floating absolute bottom-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-xl" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Main Card */}
        <div className="glass-card p-8 relative">
          {/* Back Button */}
          <Link 
            to="/login" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
                  <Mail className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass w-full"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="btn-neon w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:text-primary-glow transition-colors font-medium">
                    Sign in instead
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
                  <CheckCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to <br />
                  <span className="text-primary font-medium">{email}</span>
                </p>

                <div className="space-y-4">
                  <Button className="btn-neon w-full" asChild>
                    <a href="mailto:" target="_blank" rel="noopener noreferrer">
                      Open Email App
                    </a>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full bg-secondary/50 border-border/50"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Try Different Email
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Didn't receive the email?</strong><br />
                    Check your spam folder or try resending the link in a few minutes.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;