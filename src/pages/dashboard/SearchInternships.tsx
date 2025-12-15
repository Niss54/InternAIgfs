import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, Filter, MapPin, DollarSign, Clock, Building, Briefcase,
  Star, ExternalLink, Bookmark, BookmarkCheck, Sparkles, Target, TrendingUp, Zap, BotIcon, BookmarkPlus, Calendar
} from "lucide-react";
import { PushNotificationManager } from "@/components/PushNotificationManager";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SearchInternships = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [highlightedInternship, setHighlightedInternship] = useState<string | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showAISection, setShowAISection] = useState(true);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [showAutoApplyDialog, setShowAutoApplyDialog] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [appliedInternships, setAppliedInternships] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    location: "",
    stipendMin: "",
    stipendMax: "",
    duration: "",
    type: ""
  });

  // Sample internship data (same as Internships.tsx)
  const internships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "TechCorp Solutions",
      location: "Bangalore, India",
      type: "Remote",
      duration: "3 months",
      stipend: "₹25,000/month",
      skills: ["React", "Node.js", "MongoDB"],
      posted: "2 days ago",
      category: "software"
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataMinds Analytics",
      location: "Mumbai, India",
      type: "Hybrid",
      duration: "6 months",
      stipend: "₹30,000/month",
      skills: ["Python", "Machine Learning", "SQL"],
      posted: "5 days ago",
      category: "data-science"
    },
    {
      id: 3,
      title: "Marketing Intern",
      company: "Growth Hackers",
      location: "Delhi, India",
      type: "On-site",
      duration: "4 months",
      stipend: "₹15,000/month",
      skills: ["Social Media", "Content Writing", "SEO"],
      posted: "1 week ago",
      category: "marketing"
    },
    {
      id: 4,
      title: "UI/UX Design Intern",
      company: "Creative Studios",
      location: "Pune, India",
      type: "Remote",
      duration: "3 months",
      stipend: "₹20,000/month",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      posted: "3 days ago",
      category: "design"
    },
    {
      id: 5,
      title: "Full Stack Developer Intern",
      company: "StartupHub",
      location: "Hyderabad, India",
      type: "Remote",
      duration: "6 months",
      stipend: "₹35,000/month",
      skills: ["React", "Django", "PostgreSQL"],
      posted: "1 day ago",
      category: "software"
    },
    {
      id: 6,
      title: "Business Development Intern",
      company: "Global Ventures",
      location: "Chennai, India",
      type: "Hybrid",
      duration: "3 months",
      stipend: "₹18,000/month",
      skills: ["Sales", "Communication", "Market Research"],
      posted: "4 days ago",
      category: "business"
    }
  ];

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || internship.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || internship.type === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Check for highlighted internship from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlight = urlParams.get('highlight');
    if (highlight) {
      setHighlightedInternship(highlight);
      // Remove highlight after 5 seconds
      setTimeout(() => setHighlightedInternship(null), 5000);
    }
  }, []);

  // Load AI recommendations
  useEffect(() => {
    if (user && profile) {
      loadAIRecommendations();
    }
  }, [user, profile]);

  const loadAIRecommendations = async (forceRefresh = false) => {
    if (!user) return;
    
    try {
      setLoadingRecommendations(true);
      const { data, error } = await supabase.functions.invoke('ai-internship-matcher', {
        body: { limit: 5, forceRefresh }
      });

      if (error) throw error;

      setAiRecommendations(data.recommendations || []);
      
      if (data.cached) {
        toast({
          title: "AI Recommendations Loaded",
          description: "Showing your daily personalized matches",
        });
      } else {
        toast({
          title: "Fresh AI Recommendations Generated",
          description: `Found ${data.recommendations?.length || 0} perfect matches for you!`,
        });
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      toast({
        title: "Recommendations Unavailable",
        description: "Using standard search. Complete your profile for AI matching.",
        variant: "destructive"
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleAutoApply = async (internshipIds: string[]) => {
    if (!user || !profile?.is_premium) {
      toast({
        title: "Premium Feature",
        description: "Auto-apply is available for premium users. Upgrade to access this feature.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('auto-apply', {
        body: { internship_ids: internshipIds }
      });

      if (error) throw error;

      toast({
        title: "Auto-Apply Complete!",
        description: `Applied to ${data.summary.successful} internships successfully!`,
      });
      
      // Refresh recommendations to remove applied ones
      loadAIRecommendations(true);
    } catch (error) {
      console.error('Auto-apply error:', error);
      toast({
        title: "Auto-Apply Failed",
        description: "Please try applying manually or contact support.",
        variant: "destructive"
      });
    }
  };

  const handleOneClickApply = async (internship: any) => {
    if (!user || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please complete your profile to apply",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('one-click-apply', {
        body: {
          internship_id: internship.id,
          user_profile: profile,
          internship_details: internship
        }
      });

      if (error) throw error;

      toast({
        title: "Application Submitted! 🎉",
        description: `Your application for ${internship.role} at ${internship.company} has been submitted successfully.`,
      });
      
      // Update local state to show as applied
      // This would typically refresh the internship list or update the UI
    } catch (error) {
      console.error('One-click apply error:', error);
      toast({
        title: "Application Failed",
        description: "Please try again or apply manually.",
        variant: "destructive"
      });
    }
  };

  const handleAutoApplyToggle = () => {
    if (!autoApplyEnabled) {
      setShowAutoApplyDialog(true);
    } else {
      setAutoApplyEnabled(false);
      toast({
        title: "Auto-Apply Disabled",
        description: "You can now apply manually to internships."
      });
    }
  };

  const confirmAutoApply = () => {
    setAutoApplyEnabled(true);
    setShowAutoApplyDialog(false);
    
    // Auto-apply to first 5 internships
    const firstFive = filteredInternships.slice(0, 5);
    setAppliedInternships(firstFive.map(i => i.id));
    
    toast({
      title: "Auto-Apply Enabled! 🤖",
      description: `Successfully auto-applied to ${firstFive.length} internships based on your profile.`,
    });
  };

  const cancelAutoApply = () => {
    setShowAutoApplyDialog(false);
    window.location.href = '/dashboard/premium-upgrade';
  };

  const aiInternships = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineering Intern",
      location: "Mountain View, CA",
      stipend: "$7,500/month",
      duration: "3 months",
      type: "Full-time",
      description: "Work on cutting-edge projects with experienced engineers. Build scalable systems used by millions.",
      requirements: ["React", "JavaScript", "Python", "Computer Science"],
      posted: "2 days ago",
      applicants: 245,
      logo: "G"
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Product Manager Intern",
      location: "Seattle, WA",
      stipend: "$6,800/month",
      duration: "4 months",
      type: "Full-time",
      description: "Drive product strategy and work with cross-functional teams to deliver innovative solutions.",
      requirements: ["Product Management", "Analytics", "Communication", "Strategy"],
      posted: "1 day ago",
      applicants: 189,
      logo: "M"
    },
    {
      id: 3,
      company: "Meta",
      role: "Data Science Intern",
      location: "Menlo Park, CA",
      stipend: "$8,200/month",
      duration: "3 months",
      type: "Full-time",
      description: "Analyze complex datasets to drive product decisions and user insights at scale.",
      requirements: ["Python", "SQL", "Machine Learning", "Statistics"],
      posted: "3 days ago",
      applicants: 312,
      logo: "F"
    },
    {
      id: 4,
      company: "Amazon",
      role: "Cloud Engineer Intern",
      location: "Remote",
      stipend: "$6,500/month",
      duration: "6 months",
      type: "Remote",
      description: "Build and maintain cloud infrastructure on AWS. Work with distributed systems.",
      requirements: ["AWS", "Docker", "Kubernetes", "DevOps"],
      posted: "1 week ago",
      applicants: 156,
      logo: "A"
    },
    {
      id: 5,
      company: "Netflix",
      role: "ML Engineer Intern",
      location: "Los Gatos, CA",
      stipend: "$8,000/month",
      duration: "4 months",
      type: "Full-time",
      description: "Develop recommendation algorithms and work on machine learning pipelines.",
      requirements: ["TensorFlow", "Python", "Machine Learning", "Deep Learning"],
      posted: "5 days ago",
      applicants: 198,
      logo: "N"
    },
    {
      id: 6,
      company: "Apple",
      role: "iOS Developer Intern",
      location: "Cupertino, CA",
      stipend: "$7,200/month",
      duration: "3 months",
      type: "Full-time",
      description: "Build innovative iOS applications and work on user experience improvements.",
      requirements: ["Swift", "iOS", "Xcode", "UI/UX"],
      posted: "4 days ago",
      applicants: 223,
      logo: "🍎"
    }
  ];

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Find Your Perfect Internship
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your skills and career goals
          </p>
        </div>
        <PushNotificationManager className="mt-2" />
      </div>

      {/* Filters Section */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-1">
              <Input
                placeholder="Search internships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="software">Software Engineering</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
              </SelectContent>
            </Select>

            <Button className="btn-neon">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          {/* Auto Apply Button */}
          <div className="flex justify-center pt-4 border-t border-border/50">
            <Button 
              onClick={handleAutoApplyToggle}
              className="btn-pulse w-full md:w-auto"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Auto Apply by AI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Found <span className="font-semibold text-foreground">{filteredInternships.length}</span> internships
        </p>
      </div>

      {/* Internship Listings */}
      <div className="grid gap-6">
        {filteredInternships.map((internship) => (
          <Card key={internship.id} className="glass-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{internship.title}</CardTitle>
                  <p className="text-lg font-medium text-muted-foreground">{internship.company}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toggleSaveJob(internship.id)}
                >
                  {savedJobs.includes(internship.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{internship.location}</span>
                  <Badge variant="secondary">{internship.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{internship.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>{internship.stipend}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {internship.posted}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {internship.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  className={`btn-neon ${appliedInternships.includes(internship.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={appliedInternships.includes(internship.id)}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  {appliedInternships.includes(internship.id) ? 'Applied' : 'Auto Apply by AI'}
                </Button>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInternships.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No internships found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query to find more opportunities
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations Section */}
      {showAISection && (
        <Card className="glass-card border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center pulse-glow">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    Daily Top 5 AI Matches
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI-Powered
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Personalized recommendations based on your profile and preferences
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadAIRecommendations(true)}
                  disabled={loadingRecommendations}
                  className="bg-secondary/50"
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
                {profile?.is_premium && aiRecommendations.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => handleAutoApply(aiRecommendations.slice(0, 3).map(r => r.id))}
                    className="btn-neon"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Auto-Apply Top 3
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingRecommendations ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-secondary/30 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-secondary/50 rounded mb-2"></div>
                    <div className="h-3 bg-secondary/40 rounded mb-2"></div>
                    <div className="h-3 bg-secondary/40 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : aiRecommendations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiRecommendations.slice(0, 5).map((rec, index) => (
                  <Card key={rec.id} className="bg-secondary/30 border-primary/20 hover:bg-secondary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                          #{index + 1} Match
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-accent">
                          <Star className="w-3 h-3 fill-current" />
                          {rec.match_score}%
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{rec.company_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        {rec.location || 'Remote'}
                        <DollarSign className="w-3 h-3" />
                        ₹{rec.stipend_min || 'TBD'}
                      </div>
                      {rec.match_reasons && rec.match_reasons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {rec.match_reasons.slice(0, 2).map((reason: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 text-xs btn-neon"
                          onClick={() => handleOneClickApply(rec)}
                        >
                          1-Click Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Complete your profile for AI recommendations</p>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/profile'}>
                  Complete Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by role, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Any location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Min Stipend</label>
                <input
                  type="number"
                  placeholder="Min amount"
                  value={filters.stipendMin}
                  onChange={(e) => setFilters({...filters, stipendMin: e.target.value})}
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Max Stipend</label>
                <input
                  type="number"
                  placeholder="Max amount"
                  value={filters.stipendMax}
                  onChange={(e) => setFilters({...filters, stipendMax: e.target.value})}
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
                <select 
                  value={filters.duration}
                  onChange={(e) => setFilters({...filters, duration: e.target.value})}
                  className="input-glass w-full"
                >
                  <option value="">Any duration</option>
                  <option value="1-3">1-3 months</option>
                  <option value="3-6">3-6 months</option>
                  <option value="6+">6+ months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="input-glass w-full"
                >
                  <option value="">Any type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="btn-neon">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" className="bg-secondary/50">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {internships.length} internships
        </div>
        <div className="flex gap-3 items-center">
          <Button
            variant={autoApplyEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleAutoApplyToggle}
            className={autoApplyEnabled ? "btn-neon" : ""}
          >
            <BotIcon className="w-4 h-4 mr-2" />
            {autoApplyEnabled ? "Auto-Apply ON" : "Auto-Apply"}
          </Button>
          <select className="input-glass w-auto">
            <option>Sort by: Most Recent</option>
            <option>Sort by: Highest Stipend</option>
            <option>Sort by: Company Name</option>
            <option>Sort by: Least Applicants</option>
          </select>
        </div>
      </div>

      {/* Internship Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {aiInternships.map((internship) => {
          const isHighlighted = highlightedInternship === String(internship.id);
          
          return (
            <Card 
              key={internship.id} 
              className={`glass-card group hover:scale-[1.02] transition-all duration-300 ${
                isHighlighted ? 'ring-2 ring-accent animate-pulse' : ''
              }`}
            >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold pulse-glow">
                    {internship.logo}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {internship.role}
                      {profile?.is_premium && new Date(internship.posted).getTime() > Date.now() - 30*60*1000 && (
                        <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
                          Early Access
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {internship.company}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSaveJob(internship.id)}
                  className="text-muted-foreground hover:text-accent"
                >
                  {savedJobs.includes(internship.id) ? 
                    <BookmarkCheck className="w-5 h-5" /> : 
                    <Bookmark className="w-5 h-5" />
                  }
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {internship.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  {internship.stipend}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {internship.duration}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="w-4 h-4" />
                  {internship.type}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {internship.description}
              </p>

              {/* Requirements */}
              <div className="flex flex-wrap gap-2">
                {internship.requirements.slice(0, 3).map((req, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/20 text-primary text-xs">
                    {req}
                  </Badge>
                ))}
                {internship.requirements.length > 3 && (
                  <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground text-xs">
                    +{internship.requirements.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  Posted {internship.posted} • {internship.applicants} applicants
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {appliedInternships.includes(internship.id) ? (
                    <Button size="sm" disabled className="bg-green-500/20 text-green-400">
                      ✓ Auto Applied
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        className="btn-neon"
                        disabled={appliedInternships.includes(internship.id)}
                      >
                        Apply Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAutoApplyToggle}
                        className="bg-primary/10 text-primary border-primary/30"
                      >
                        <BotIcon className="w-3 h-3 mr-1" />
                        Auto
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="bg-secondary/50">
          Load More Internships
        </Button>
      </div>

      {/* Auto-Apply Confirmation Dialog */}
      <Dialog open={showAutoApplyDialog} onOpenChange={setShowAutoApplyDialog}>
        <DialogContent className="glass-card border-primary/30 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <BotIcon className="w-6 h-6 text-primary" />
              Enable Auto-Apply AI
            </DialogTitle>
            <DialogDescription className="text-base space-y-3 pt-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Free Trial - 7 Days</p>
                    <p className="text-sm text-muted-foreground">Daily 5 internships will be auto-applied based on your profile and resume using AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">AI-Powered Matching</p>
                    <p className="text-sm text-muted-foreground">Our AI analyzes your skills, experience, and preferences to apply to the best matches</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">After 7 Days</p>
                    <p className="text-sm text-muted-foreground">Upgrade to Premium for unlimited auto-apply and advanced AI features</p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelAutoApply}>
              Not Now
            </Button>
            <Button className="btn-neon" onClick={confirmAutoApply}>
              Enable Auto-Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Apply Dialog */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="glass-card border-accent/30 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Manual Application</DialogTitle>
            <DialogDescription className="text-base space-y-3 pt-4">
              <p>You can continue applying manually to internships.</p>
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-foreground">Premium Benefits:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Unlimited AI auto-apply</li>
                  <li>Advanced resume tailoring</li>
                  <li>Interview preparation with AI</li>
                  <li>Priority support and early access</li>
                  <li>Skill gap analysis and recommendations</li>
                </ul>
                <Button 
                  className="w-full mt-3 btn-neon" 
                  onClick={() => window.location.href = '/dashboard/premium'}
                >
                  Upgrade to Premium
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualDialog(false)}>
              Continue Manually
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchInternships;