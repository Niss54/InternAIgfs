import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, Calendar, Settings, 
  Bell, LogOut, Menu, X, Shield, TrendingUp, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItem {
  icon: any;
  label: string;
  href: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'User Management', href: '/admin/users' },
  { icon: FileText, label: 'Applications', href: '/admin/applications' },
  { icon: Calendar, label: 'Interviews', href: '/admin/interviews' },
  { icon: TrendingUp, label: 'Analytics', href: '/admin/analytics' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications', badge: 5 },
  { icon: MessageSquare, label: 'AI Assistant', href: '/admin/ai-chat' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface AdminSidebarProps {
  onSignOut: () => void;
}

const AdminSidebar = ({ onSignOut }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "h-screen bg-card/50 backdrop-blur-xl border-r border-border/50 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive && "text-primary"
              )} />
              
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-destructive/10",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;