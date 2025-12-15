import { Home, Search, Users, Calendar, User, Gift } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/internships", icon: Search, label: "Search" },
    { path: "/dashboard/networking", icon: Users, label: "Network" },
    { path: "/dashboard/referrals", icon: Gift, label: "Referrals" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === "/dashboard" && location.pathname === "/dashboard");
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 touch-manipulation transition-colors",
                "hover:bg-accent/10 active:scale-95",
                isActive && "text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className={cn("text-[10px] font-medium", isActive && "text-primary")}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;