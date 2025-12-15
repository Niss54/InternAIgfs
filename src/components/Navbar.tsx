import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, User, ChevronDown, Crown, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)] h-14">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center group mr-8">
            <div className="relative">
              <img 
                src="/1ec9134d-68f3-4c6d-ba7c-48add65f4254.png" 
                alt="InternAI" 
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300 rounded-lg"></div>
            </div>
          </Link>

          {/* Navigation and Search in one line */}
          <div className="hidden lg:flex items-center flex-1 justify-between">
            {/* Navigation Links */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary font-medium transition-all duration-300 px-2 py-1 rounded-lg hover:bg-primary/10 relative group"
              >
                {t('nav.home')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/internships" 
                className="text-foreground hover:text-primary font-medium transition-all duration-300 px-2 py-1 rounded-lg hover:bg-primary/10 relative group whitespace-nowrap"
              >
                {t('nav.find_internship')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/dashboard/networking" 
                className="text-foreground hover:text-primary font-medium transition-all duration-300 px-2 py-1 rounded-lg hover:bg-primary/10 relative group whitespace-nowrap"
              >
                {t('nav.networking_hub')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Search Section */}
            <div className="flex items-center max-w-lg mx-8">
              <div className="flex items-center w-full bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl overflow-hidden shadow-lg">
                <select className="bg-transparent border-none px-2 py-2 text-foreground outline-none font-medium text-sm w-auto">
                  <option value="all" className="bg-card text-foreground">All</option>
                  <option value="software" className="bg-card text-foreground">Software</option>
                  <option value="data" className="bg-card text-foreground">Data Science</option>
                  <option value="marketing" className="bg-card text-foreground">Marketing</option>
                  <option value="design" className="bg-card text-foreground">Design</option>
                </select>
                <div className="w-px h-4 bg-border/40"></div>
                <input 
                  type="text" 
                  placeholder={t('search.placeholder')}
                  className="flex-1 h-9 px-3 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground font-medium text-sm"
                />
                <Button size="sm" className="btn-neon rounded-none rounded-r-xl h-9 px-4 m-0 border-0">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="hidden lg:flex items-center">
            <div className="mr-3">
              <LanguageToggle />
            </div>
            {user && (
              <div className="mr-4">
                <NotificationBell />
              </div>
            )}
            {!user ? (
              <Button asChild className="btn-neon hover:bg-primary/10 hover:text-primary hover:border-primary active:bg-primary/90 transition-all duration-200">
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
            ) : (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  onClick={toggleUserMenu}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <UserCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground font-medium text-sm">User</span>
                  <ChevronDown className="w-3 h-3 text-foreground" />
                </div>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 glass-card border border-border/50 rounded-lg p-2 min-w-48 z-50 shadow-lg">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 p-3 text-foreground hover:bg-primary/10 rounded transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t('nav.dashboard')}
                    </Link>
                    <div className="h-px bg-border/50 my-2"></div>
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center gap-3 p-3 text-foreground hover:bg-destructive/10 hover:text-destructive rounded transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={toggleMenu}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <div className="bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center">
              <select className="bg-transparent border-none px-2 py-2 text-foreground outline-none font-medium text-sm w-auto">
                <option value="all" className="bg-card text-foreground">All</option>
                <option value="software" className="bg-card text-foreground">Software</option>
                <option value="data" className="bg-card text-foreground">Data Science</option>
                <option value="marketing" className="bg-card text-foreground">Marketing</option>
              </select>
              <div className="w-px h-4 bg-border/40"></div>
              <input 
                type="text" 
                placeholder="Search internships..." 
                className="flex-1 h-9 px-3 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground font-medium text-sm"
              />
              <Button size="sm" className="btn-neon rounded-none rounded-r-xl h-9 px-4 m-0 border-0">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4">
            <div className="glass-card border border-border/50 rounded-lg p-4 space-y-4">
              <Link 
                to="/" 
                className="block text-foreground hover:text-primary font-medium transition-colors p-2 rounded hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/internships" 
                className="block text-foreground hover:text-primary font-medium transition-colors p-2 rounded hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Internship
              </Link>
              <Link 
                to="/dashboard/networking" 
                className="block text-foreground hover:text-primary font-medium transition-colors p-2 rounded hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Networking Hub
              </Link>
              <div className="h-px bg-border/50"></div>
              <div className="flex flex-col gap-3 pt-2">
                {!user ? (
                  <>
                    <Button asChild variant="ghost" className="justify-start hover:bg-primary/10">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild className="btn-neon">
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="justify-start hover:bg-primary/10">
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost" 
                      className="justify-start hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;