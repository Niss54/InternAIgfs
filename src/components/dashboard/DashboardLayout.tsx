import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Navbar";
import MobileBottomNav from "../mobile/MobileBottomNav";
import MobileHeader from "../mobile/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  Users, 
  Star, 
  Settings, 
  UserCircle,
  Crown,
  Menu,
  X,
  Info,
  Calendar,
  Bot,
  Award,
  Laptop,
  Shield,
  Sparkles,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "Find Internships", path: "/dashboard/internships" },
    { icon: Sparkles, label: "AI Search", path: "/dashboard/search" },
    { icon: Briefcase, label: "Applications", path: "/dashboard/applied" },
    { icon: Calendar, label: "Interviews", path: "/dashboard/interviews" },
    { icon: Bot, label: "AI Assistant", path: "/dashboard/ai" },
    { icon: Brain, label: "AI Suggestions", path: "/ai-suggestions.html" },
    { icon: Users, label: "Networking", path: "/dashboard/networking" },
    { icon: Star, label: "Referrals", path: "/dashboard/referrals" },
    { icon: Award, label: "Certifications", path: "/dashboard/certifications" },
    { icon: Laptop, label: "Freelance Gigs", path: "/dashboard/freelance" },
    { icon: Shield, label: "Guarantee Packs", path: "/dashboard/guarantee" },
    { icon: Sparkles, label: "Services", path: "/dashboard/services" },
    { icon: Crown, label: "Premium", path: "/dashboard/premium-upgrade" },
    { icon: Crown, label: "Premium Dashboard", path: "/dashboard/premium" },
    { icon: UserCircle, label: "Profile", path: "/dashboard/profile" },
    { icon: Info, label: "About InternAI", path: "/dashboard/about" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="InternAI" />
        <main className="container mx-auto px-4 py-4 pb-20">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-20 z-50 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-[72px] h-[calc(100vh-72px)] w-64 bg-card border-r border-border transition-transform duration-300 z-40 overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="p-4 space-y-2 pb-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isExternalLink = item.path.endsWith('.html');
              
              if (isExternalLink) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      "hover:bg-accent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;