import { Menu, Bell, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/NotificationBell";

interface MobileHeaderProps {
  title?: string;
  showMenu?: boolean;
  showNotifications?: boolean;
}

const MobileHeader = ({ title = "InternAI", showMenu = true, showNotifications = true }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/resume-generator", label: "Resume Builder" },
    { path: "/portfolio-builder", label: "Portfolio" },
    { path: "/dashboard/premium", label: "Premium" },
    { path: "/settings", label: "Settings" },
    { path: "/help-support", label: "Help & Support" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border md:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            {showMenu && (
              <Button
                variant="ghost"
                size="icon"
                className="touch-manipulation"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          
          {showNotifications && (
            <NotificationBell />
          )}
        </div>
      </header>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col p-4 gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 rounded-lg text-sm font-medium touch-manipulation",
                    "transition-colors hover:bg-accent/10 active:scale-95",
                    isActive && "bg-primary/10 text-primary"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileHeader;