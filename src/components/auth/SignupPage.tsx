import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, MapPin, Briefcase, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Get referral code from URL
  const referralCode = new URLSearchParams(location.search).get('ref');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    location: "",
    skills: [] as string[],
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      full_name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role,
      location: formData.location,
      skills: formData.skills,
      ...(referralCode && { referred_by: referralCode })
    };
    
    const { error } = await signUp(formData.email, formData.password, userData);
    
    if (!error) {
      navigate('/login');
    }
    
    setLoading(false);
  };

  const roles = [
    "Developer", "Designer", "Manager", "Analyst", "Consultant", "Student", "Other"
  ];

  const skillOptions = [
    "React", "TypeScript", "Python", "Java", "Design", "Marketing", 
    "Sales", "Data Analysis", "Project Management", "Communication"
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating absolute top-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
          <div className="floating absolute bottom-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-xl" style={{ animationDelay: "1.5s" }}></div>
        </div>

        {/* Main Signup Card */}
        <div className="glass-card p-8 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join our premium platform</p>
          </div>

          {/* Referral Code Notice */}
          {referralCode && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <Gift className="w-4 h-4" />
                <span className="text-sm font-medium">
                  You're invited by a friend! Get 3 days premium + 50 AI tokens when you complete signup.
                </span>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                      currentStep > step ? "bg-primary" : "bg-secondary/50"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input-glass w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input-glass w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="input-glass w-full pr-10"
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
                <Button 
                  onClick={() => setCurrentStep(2)} 
                  className="btn-neon w-full"
                  type="button"
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password}
                >
                Continue
              </Button>
            </form>
          )}

          {/* Step 2: Professional Info */}
          {currentStep === 2 && (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role }))}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.role === role
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <input
                  type="text"
                  placeholder="New York, NY"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="input-glass w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setCurrentStep(1)} 
                  variant="outline"
                  className="flex-1 bg-secondary/50 border-border/50"
                  type="button"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)} 
                  className="btn-neon flex-1"
                  type="button"
                  disabled={!formData.role || !formData.location}
                >
                  Continue
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Skills & Preferences */}
          {currentStep === 3 && (
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Skills (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.skills.includes(skill)
                          ? "bg-primary/20 text-primary border border-primary"
                          : "bg-secondary/30 text-muted-foreground border border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setCurrentStep(2)} 
                  variant="outline"
                  className="flex-1 bg-secondary/50 border-border/50"
                  type="button"
                >
                  Back
                </Button>
                <Button className="btn-neon flex-1" type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary-glow transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;