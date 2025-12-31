import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PortfolioPreview } from './PortfolioPreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  FolderOpen, 
  Code, 
  Palette, 
  Globe, 
  Settings,
  Eye,
  Download,
  Share,
  Crown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PortfolioPreview } from './PortfolioPreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  FolderOpen, 
  Code, 
  Palette, 
  Globe, 
  Settings,
  Eye,
  Download,
  Share,
  Crown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

const PortfolioDashboard: React.FC = () => {
  const { data, selectedElement, isPremium, publishPortfolio, exportStatic, generatePDF, setTheme, setSectionEnabled } = usePortfolio();
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const sectionToggles = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' }
  ];

  const renderPropertiesPanel = () => {
    if (!selectedElement) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>Select an element to edit its properties</p>
        </div>
      );
    }
    // ...existing code...
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            {/* ...existing code... */}
          </div>
        );
      case 'projects':
        return (
          <div className="p-6">
            {/* ...existing code... */}
          </div>
        );
      case 'theme':
        // ...existing code...
      case 'publish':
        // ...existing code...
      default:
        return (
          <div className="p-6 text-center text-muted-foreground">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Select a section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 60 : 280 }}
        className="bg-card border-r border-border flex flex-col"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg">Portfolio Builder</h1>
                {!isPremium && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Free Plan
                  </Badge>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {/* ...existing code... */}
      </motion.div>
      {/* ...existing code... */}
    </div>
  );
};


      case 'publish':
        const username = data.profile.name.toLowerCase().replace(/\s+/g, '') || 'user';
        const generatedUrl = `www.internai.com/${username}-portfolio`;
        
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Publish Portfolio</h2>
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Portfolio Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {data.isPublished ? '🟢 Your portfolio is live!' : '🔴 Draft mode'}
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      publishPortfolio();
                      setPortfolioUrl(generatedUrl);
                    }}
                    variant={data.isPublished ? 'destructive' : 'default'}
                    size="lg"
                  >
                    {data.isPublished ? 'Unpublish' : '🚀 Publish Now'}
                  </Button>
                </div>
                {data.isPublished && (
                  <div className="space-y-4 mt-6">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-green-500">
                      <label className="text-xs text-muted-foreground mb-2 block">Your Portfolio URL</label>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-500" />
                        <span className="text-lg font-mono text-primary font-bold">
                          {generatedUrl}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2 flex-1" onClick={() => {
                        navigator.clipboard.writeText(`https://${generatedUrl}`);
                      }}>
                        <Share className="w-4 h-4" />
                        Copy Link
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 flex-1">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Share this link on LinkedIn, resume, or anywhere to showcase your work!
                    </p>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Export Options</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={exportStatic}
                  >
                    <Download className="w-4 h-4" />
                    Export Static Site (ZIP)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={generatePDF}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Resume
                  </Button>
                </div>
              </Card>

              {isPremium && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Premium Features</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Domain</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        placeholder="yourname.com"
                        defaultValue={data.customDomain}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      Verify Domain
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 text-center text-muted-foreground">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Select a section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 60 : 280 }}
        className="bg-card border-r border-border flex flex-col"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg">Portfolio Builder</h1>
                {!isPremium && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Free Plan
                  </Badge>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-2">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-muted-foreground mb-2">Section Visibility</h2>
            {sectionToggles.map((section) => (
              <div key={section.id} className="flex items-center justify-between mb-2 px-2">
                <span>{section.label}</span>
                <button
                  aria-label={`Toggle ${section.label}`}
                  onClick={() => setSectionEnabled(section.id, !data.enabledSections?.[section.id])}
                  className="focus:outline-none"
                >
                  {data.enabledSections?.[section.id] ? (
                    <ToggleRight className="w-6 h-6 text-primary" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
        </nav>

        {!isPremium && !sidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <Card className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium">Upgrade to Premium</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Unlock advanced 3D themes, custom domains, and more
              </p>
              <Button size="sm" className="w-full">
                Upgrade Now
              </Button>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Content Panel */}
        <motion.div
          initial={false}
          animate={{ width: previewFullscreen ? 0 : '40%' }}
          className="bg-background border-r border-border overflow-hidden"
        >
          <AnimatePresence>
            {!previewFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                {renderMainContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">Live Preview</span>
              <Badge variant="outline" className="text-xs">
                {data.theme}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewFullscreen(!previewFullscreen)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <PortfolioPreview />
          </div>
        </div>

        {/* Properties Panel */}
        <AnimatePresence>
          {!previewFullscreen && (
            <motion.div
              initial={{ width: 300, opacity: 1 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-card border-l border-border overflow-hidden"
            >
              <div className="h-full">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold">Properties</h2>
                </div>
                <div className="h-full overflow-y-auto">
                  {renderPropertiesPanel()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};