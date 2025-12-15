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
  Maximize2
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

export const PortfolioDashboard: React.FC = () => {
  const { data, selectedElement, isPremium, publishPortfolio, exportStatic, generatePDF } = usePortfolio();
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-4 h-4" />, count: data.projects.length },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" />, count: data.skills.length },
    { id: 'theme', label: 'Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'publish', label: 'Publish', icon: <Globe className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
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

    return (
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4 capitalize">
          Edit {selectedElement}
        </h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Properties panel for {selectedElement} section
          </p>
          <Button variant="outline" className="w-full">
            Customize {selectedElement}
          </Button>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    defaultValue={data.profile.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Title</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    defaultValue={data.profile.title}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea 
                  rows={4} 
                  className="w-full p-2 border rounded-md"
                  defaultValue={data.profile.bio}
                />
              </div>
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Projects</h2>
              <Button>
                <FolderOpen className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.projects.map((project) => (
                <Card key={project.id} className="p-4">
                  <h3 className="font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </Card>
              ))}
              {data.projects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No projects yet. Add your first project!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Theme Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['modern', 'minimal', 'showcase', 'interactive-3d'] as const).map((theme) => (
                <Card 
                  key={theme} 
                  className={`p-4 cursor-pointer transition-all ${
                    data.theme === theme ? 'ring-2 ring-primary' : ''
                  } ${theme === 'interactive-3d' && !isPremium ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (theme === 'interactive-3d' && !isPremium) return;
                    // setTheme(theme);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize">{theme.replace('-', ' ')}</h3>
                    {theme === 'interactive-3d' && !isPremium && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md mb-3"></div>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'modern' && 'Clean and professional design'}
                    {theme === 'minimal' && 'Simple and elegant layout'}
                    {theme === 'showcase' && 'Bold and creative presentation'}
                    {theme === 'interactive-3d' && 'Advanced 3D animations and interactions'}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'publish':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Publish Settings</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Portfolio Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {data.isPublished ? 'Your portfolio is live' : 'Your portfolio is in draft'}
                    </p>
                  </div>
                  <Button 
                    onClick={publishPortfolio}
                    variant={data.isPublished ? 'destructive' : 'default'}
                  >
                    {data.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                </div>
                {data.isPublished && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                        /u/{data.slug}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share className="w-3 h-3" />
                      Share Link
                    </Button>
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
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-1 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <>
                  <span className="ml-2">{item.label}</span>
                  {item.count !== undefined && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {item.count}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
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