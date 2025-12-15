import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { sendOTP, verifyOTP } from "@/lib/firebase";
import { ConfirmationResult } from "firebase/auth";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { confirmationResult, error } = await sendOTP(phone);
    
    if (confirmationResult) {
      setConfirmationResult(confirmationResult);
      setOtpSent(true);
    } else {
      console.error('OTP send error:', error);
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setLoading(true);
    
    const { user, error } = await verifyOTP(confirmationResult, otp);
    
    if (user) {
      console.log('OTP verification successful:', user);
      navigate('/dashboard');
    } else {
      console.error('OTP verification error:', error);
    }
    
    setLoading(false);
  };


  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Floating Background Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
          <div className="floating absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-xl" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Main Login Card */}
        <div className="glass-card p-8 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>


          {/* Google Login */}
          <Button 
            variant="outline" 
            className="w-full mb-6 bg-secondary/50 border-border/50 hover:bg-secondary"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-border/50"></div>
            <span className="px-4 text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/50"></div>
          </div>

          {/* Login Method Selector */}
          <div className="flex bg-secondary/20 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
                loginMethod === "email" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("otp")}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
                loginMethod === "otp" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Phone OTP
            </button>
          </div>

          {/* Login Forms */}
          {loginMethod === "email" ? (
            <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-glass w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-glass w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:text-primary-glow transition-colors">
                Forgot password?
              </Link>
            </div>
            <Button className="btn-neon w-full" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          ) : (
            !otpSent ? (
              <form className="space-y-4" onSubmit={handleSendOTP}>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number with country code (+91)"
                    className="input-glass w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div id="recaptcha-container"></div>
                <Button className="btn-neon w-full" type="submit" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleVerifyOTP}>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter the 6-digit OTP"
                    className="input-glass w-full"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <Button className="btn-neon w-full" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setOtpSent(false)}
                >
                  Back to Phone Number
                </Button>
              </form>
            )
          )}

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary-glow transition-colors font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;