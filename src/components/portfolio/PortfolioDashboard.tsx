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
  const { data, selectedElement, isPremium, publishPortfolio, exportStatic, generatePDF, setTheme } = usePortfolio();
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');

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
        const themes = [
          { id: 'modern', name: 'Modern', desc: 'Clean and professional design', premium: false, gradient: 'from-blue-500/20 to-cyan-500/20' },
          { id: 'minimal', name: 'Minimal', desc: 'Simple and elegant layout', premium: false, gradient: 'from-gray-500/20 to-slate-500/20' },
          { id: 'showcase', name: 'Showcase', desc: 'Bold and creative presentation', premium: false, gradient: 'from-purple-500/20 to-pink-500/20' },
          { id: 'corporate', name: 'Corporate', desc: 'Professional business style', premium: false, gradient: 'from-indigo-500/20 to-blue-500/20' },
          { id: 'creative', name: 'Creative', desc: 'Artistic and vibrant design', premium: false, gradient: 'from-orange-500/20 to-red-500/20' },
          { id: 'dark-mode', name: 'Dark Mode', desc: 'Sleek dark theme', premium: false, gradient: 'from-gray-800/40 to-black/40' },
          { id: 'glassmorphism', name: 'Glass', desc: 'Modern glassmorphism effect', premium: true, gradient: 'from-white/30 to-white/10' },
          { id: 'interactive-3d', name: 'Interactive 3D', desc: 'Advanced 3D animations', premium: true, gradient: 'from-emerald-500/20 to-teal-500/20' },
        ];
        
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Theme Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <Card 
                  key={theme.id} 
                  className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                    data.theme === theme.id ? 'ring-2 ring-primary shadow-lg' : ''
                  } ${theme.premium && !isPremium ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (theme.premium && !isPremium) return;
                    setTheme(theme.id as any);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{theme.name}</h3>
                    {theme.premium && !isPremium && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className={`h-24 bg-gradient-to-br ${theme.gradient} rounded-md mb-3 flex items-center justify-center`}>
                    {data.theme === theme.id && (
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        );

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