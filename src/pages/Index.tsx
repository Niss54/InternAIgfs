import { Link, useNavigate } from "react-router-dom";
import { 
  Lock, UserPlus, Smartphone, Mail, Shield, Zap, Sparkles, 
  Rocket, FileText, Bot, Star, Check, Instagram, Linkedin, 
  MessageCircle, MapPin, Phone, LogOut, User, Globe
} from "lucide-react";
import { FloatingChatWidget } from "@/components/chat/FloatingChatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import MobileHeader from "@/components/mobile/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import RatingSystem from "@/components/RatingSystem";
import { useTranslation } from "@/lib/i18n";
import { activateFreeTrial, isPlanActive } from "@/lib/premiumManager";
import { useState } from "react";
import { PlanWelcomePopup } from "@/components/premium/PlanWelcomePopup";

const Index = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [welcomePlan, setWelcomePlan] = useState<any>(null);
  const isActivePlan = isPlanActive();

  const handleStartFreeTrial = () => {
    const plan = activateFreeTrial();
    setWelcomePlan(plan);
    setShowWelcomePopup(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcomePopup(false);
    navigate('/dashboard/premium-upgrade');
  };

  return (
    <>
      {isMobile ? <MobileHeader showMenu={false} showNotifications={false} /> : <Navbar />}
      <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Spline Background */}
      <div className="relative w-full h-screen mb-0">
        {/* Spline 3D Background */}
        <iframe 
          className="absolute top-0 left-0 w-full h-full transform scale-100 sm:scale-100 md:scale-[1.08] lg:scale-[1.15] transition-transform duration-300 ease-in-out z-0" 
          style={{ transform: "scale(1.55)" }}
          src="https://my.spline.design/boxeshover-F5tZ6NOmlm9jyfL55IZQJY2t/" 
          frameBorder="0"
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[-5%] text-center z-10">
          <div className="flex justify-center gap-4 flex-wrap mb-32">
            {user ? (
              <>
                <Button asChild className="btn-pulse">
                  <Link to="/dashboard">
                    <User className="w-5 h-5 mr-2" />
                    {t('home.hero.dashboard')}
                  </Link>
                </Button>
                <Button asChild className="btn-neon" variant="outline">
                  <Link to="/portfolio-builder">
                    <Globe className="w-5 h-5 mr-2" />
                    {t('home.hero.build_portfolio')}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-secondary-glow"
                  onClick={signOut}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {t('home.hero.sign_out')}
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="btn-pulse">
                  <Link to="/signup">
                    <Rocket className="w-5 h-5 mr-2" />
                    {t('home.hero.get_started')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-secondary-glow">
                  <Link to="/login">
                    {t('home.hero.sign_in')}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 mt-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('home.features.ai_powered')}
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-6 flex items-center justify-center pulse-glow">
                <Rocket className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Auto Apply</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Let AI automatically apply to relevant internships based on your profile, 
                saving hours of manual applications while maximizing your opportunities.
              </p>
              <Button asChild className="btn-neon">
                <Link to="/internships">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Auto Apply by AI
                </Link>
              </Button>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-6 flex items-center justify-center pulse-glow">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Resume Generator</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Create professional, ATS-optimized resumes tailored for each internship application 
                with our intelligent resume builder and industry-specific templates.
              </p>
              <Button asChild className="btn-neon">
                <Link to="/resume-generator">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Resume Generator
                </Link>
              </Button>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-6 flex items-center justify-center pulse-glow">
                <Globe className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">3D Portfolio Builder</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Create stunning interactive 3D portfolios with advanced animations, themes, and 
                professional templates to showcase your work and stand out from the crowd.
              </p>
              <Button asChild className="btn-neon">
                <Link to="/portfolio-builder">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Build Portfolio
                </Link>
              </Button>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-6 flex items-center justify-center pulse-glow">
                <Bot className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">AI Assistant</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Get personalized career guidance, interview prep, and application tips from our 
                advanced AI assistant trained on successful internship strategies.
              </p>
              <Button asChild className="btn-neon">
                <Link to="/dashboard/ai-assistant">
                  <Bot className="w-4 h-4 mr-2" />
                  Try AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Choose Your Plan
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
              Premium Internship Solutions
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Select the perfect plan to accelerate your internship search with our AI-powered tools.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Free Trial */}
            <Card className={`glass-card p-8 text-center relative overflow-hidden ${
              isActivePlan ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-border/50'
            }`}>
              {isActivePlan && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-semibold pulse-glow">
                    ✓ Active
                  </span>
                </div>
              )}
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">Free Trial</CardTitle>
                <CardDescription className="text-muted-foreground">Perfect for getting started</CardDescription>
                <div className="text-4xl font-bold text-primary mt-4">
                  $0
                  <span className="text-base font-normal text-muted-foreground">/7 days</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground">5 Auto Applications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground">Basic Resume Templates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground">AI Chat Support</span>
                  </div>
                </div>
                <Button 
                  onClick={handleStartFreeTrial} 
                  className="w-full btn-neon mt-6"
                  disabled={isActivePlan}
                >
                  {isActivePlan ? 'Trial Active' : 'Start Free Trial'}
                </Button>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="glass-card border-border/50 p-8 text-center relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border-green-500/30 px-2 py-1 rounded-full text-xs font-semibold">
                40% OFF
              </div>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">Basic</CardTitle>
                <CardDescription className="text-muted-foreground">Perfect for students starting their career journey</CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">$6</span>
                    <span className="text-4xl font-bold text-primary">$4</span>
                  </div>
                  <span className="text-sm text-muted-foreground">/per month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">50 Auto Applications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Basic Resume Templates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">AI Chat Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Interview Preparation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Email Support</span>
                  </div>
                </div>
                <Button asChild className="w-full btn-neon mt-6">
                  <Link to="/dashboard/premium-upgrade">Choose Basic</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="glass-card border-primary/50 p-8 text-center relative overflow-visible scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap z-10">
                Most Popular
              </div>
              <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border-green-500/30 px-2 py-1 rounded-full text-xs font-semibold">
                30% OFF
              </div>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">Pro</CardTitle>
                <CardDescription className="text-muted-foreground">Best for active job seekers</CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">$12</span>
                    <span className="text-4xl font-bold text-primary">$8</span>
                  </div>
                  <span className="text-sm text-muted-foreground">/per month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Unlimited Auto Applications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Premium Resume Builder</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Advanced AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Priority Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Interview Preparation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Application Analytics</span>
                  </div>
                </div>
                <Button asChild className="w-full btn-pulse mt-6">
                  <Link to="/dashboard/premium-upgrade">Choose Pro</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="glass-card border-border/50 p-8 text-center relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border-green-500/30 px-2 py-1 rounded-full text-xs font-semibold">
                28% OFF
              </div>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">Enterprise</CardTitle>
                <CardDescription className="text-muted-foreground">For serious career builders</CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">$22</span>
                    <span className="text-4xl font-bold text-primary">$15</span>
                  </div>
                  <span className="text-sm text-muted-foreground">/per month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">1-on-1 Career Coaching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Exclusive Job Opportunities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Personal Brand Building</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-foreground text-sm">Advanced Analytics Dashboard</span>
                  </div>
                </div>
                <Button asChild className="w-full btn-neon mt-6">
                  <Link to="/dashboard/premium-upgrade">Choose Enterprise</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Success Stories
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful interns who found their dream opportunities with InternAI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground"
                   style={{ boxShadow: 'var(--shadow-neon)' }}>
                SK
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "InternAI helped me land my dream internship at Google! The auto-apply feature saved me weeks of work, 
                and the resume generator made my application stand out."
              </p>
              <h4 className="text-foreground font-semibold">Sarah Kim</h4>
              <p className="text-muted-foreground text-sm">Software Engineering Intern @ Google</p>
            </div>

            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground"
                   style={{ boxShadow: 'var(--shadow-neon)' }}>
                MR
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "The AI assistant provided incredible interview preparation. I felt confident and prepared for every question. 
                Highly recommend to anyone serious about their career!"
              </p>
              <h4 className="text-foreground font-semibold">Marcus Rodriguez</h4>
              <p className="text-muted-foreground text-sm">Marketing Intern @ Meta</p>
            </div>

            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground"
                   style={{ boxShadow: 'var(--shadow-neon)' }}>
                AJ
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "From 0 to 3 internship offers in just 2 weeks! The platform's matching algorithm is incredible. 
                It found opportunities I never would have discovered on my own."
              </p>
              <h4 className="text-foreground font-semibold">Aisha Johnson</h4>
              <p className="text-muted-foreground text-sm">Data Science Intern @ Microsoft</p>
            </div>
          </div>
          
          {/* Rating System */}
          <div className="mt-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Rate Your Experience
              </h3>
              <p className="text-muted-foreground">
                Help us improve by sharing your feedback
              </p>
            </div>
            <RatingSystem />
          </div>
        </section>

        {/* Footer */}
        <footer className="glass-card rounded-none border-x-0 border-b-0 mt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold text-primary mb-4" style={{ textShadow: '0 0 10px hsl(var(--primary))' }}>
                  InternAI
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                  Revolutionizing internship discovery with AI-powered automation, intelligent matching, 
                  and comprehensive career support for the next generation of professionals.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/niss_9854?igsh=azdoM25zb3JkdzRw" className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform" style={{ boxShadow: 'var(--shadow-neon)' }}>
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/niss-visuals/" className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform" style={{ boxShadow: 'var(--shadow-neon)' }}>
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://whatsapp.com/channel/0029VaNCLCK0LKZGSmkr7g46" className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform" style={{ boxShadow: 'var(--shadow-neon)' }}>
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-foreground font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link to="/internships" className="text-muted-foreground hover:text-primary transition-colors">Find Internships</Link></li>
                  <li><Link to="/resume-generator" className="text-muted-foreground hover:text-primary transition-colors">Resume Tips</Link></li>
                  <li><Link to="/premium-upgrade" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-foreground font-semibold mb-4">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground text-sm">Lucknow Uttar Pradesh, India</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground text-sm">8840301998</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground text-sm">Nishantma05@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 mt-12 pt-8 text-center">
              <p className="text-muted-foreground text-sm">
                © 2025 InternAI. All rights reserved. Built with ❤️
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />
      
      {/* Welcome Popup */}
      {showWelcomePopup && welcomePlan && (
        <PlanWelcomePopup 
          open={showWelcomePopup}
          onClose={handleCloseWelcome}
          plan={welcomePlan}
        />
      )}
    </div>
    </>
  );
};

export default Index;
