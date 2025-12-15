import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Briefcase, MapPin, Clock, DollarSign, Calendar, BookmarkPlus, BookmarkCheck, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Internships = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedInternships, setAppliedInternships] = useState<number[]>([]);
  const [aiTokens, setAiTokens] = useState(0);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [possibleApplications, setPossibleApplications] = useState(0);

  // Load AI tokens and check daily login
  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLoginDate');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      // Daily login - give 25 tokens
      const currentTokens = parseInt(localStorage.getItem('aiTokens') || '0');
      const newTokens = currentTokens + 25;
      localStorage.setItem('aiTokens', newTokens.toString());
      localStorage.setItem('lastLoginDate', today);
      setAiTokens(newTokens);
    } else {
      const tokens = parseInt(localStorage.getItem('aiTokens') || '0');
      setAiTokens(tokens);
    }
    
    // Load applied internships from localStorage
    const savedAppliedInternships = localStorage.getItem('appliedInternships');
    if (savedAppliedInternships) {
      setAppliedInternships(JSON.parse(savedAppliedInternships));
    }
  }, []);
  
  // Save applied internships to localStorage whenever it changes
  useEffect(() => {
    if (appliedInternships.length > 0) {
      localStorage.setItem('appliedInternships', JSON.stringify(appliedInternships));
    }
  }, [appliedInternships]);

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleAutoApply = () => {
    const lastAutoApply = localStorage.getItem('lastAutoApplyDate');
    const today = new Date().toDateString();
    
    // Check if user has used free daily auto apply
    if (lastAutoApply !== today) {
      // Free daily auto apply (first 5 internships)
      const firstFive = filteredInternships.slice(0, 5);
      const firstFiveIds = firstFive.map(i => i.id);
      
      setAppliedInternships(prev => [...new Set([...prev, ...firstFiveIds])]);
      localStorage.setItem('lastAutoApplyDate', today);
      
      toast({
        title: "Auto-Apply Complete! 🎉",
        description: `Successfully auto-applied to ${firstFive.length} internships for free!`,
      });
    } else {
      // Already used free daily auto apply - need tokens
      const tokensPerInternship = 10;
      const availableInternships = filteredInternships.filter(i => !appliedInternships.includes(i.id));
      const maxApplications = Math.floor(aiTokens / tokensPerInternship);
      const possible = Math.min(maxApplications, availableInternships.length);
      
      if (aiTokens < tokensPerInternship) {
        toast({
          title: "Insufficient AI Tokens",
          description: "You need 10 AI tokens per internship. Login daily to earn 25 tokens!",
          variant: "destructive"
        });
        return;
      }
      
      setPossibleApplications(possible);
      setShowTokenDialog(true);
    }
  };

  const confirmTokenAutoApply = () => {
    const tokensPerInternship = 10;
    const tokensNeeded = possibleApplications * tokensPerInternship;
    const availableInternships = filteredInternships.filter(i => !appliedInternships.includes(i.id));
    const toApply = availableInternships.slice(0, possibleApplications);
    const toApplyIds = toApply.map(i => i.id);
    
    setAppliedInternships(prev => [...new Set([...prev, ...toApplyIds])]);
    
    const newTokenBalance = aiTokens - tokensNeeded;
    setAiTokens(newTokenBalance);
    localStorage.setItem('aiTokens', newTokenBalance.toString());
    
    setShowTokenDialog(false);
    
    toast({
      title: "Auto-Apply Complete! 🎉",
      description: `Applied to ${possibleApplications} internships using ${tokensNeeded} AI tokens. Remaining: ${newTokenBalance} tokens`,
    });
  };

  // Sample internship data
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
    },
    {
      id: 7,
      title: "Android Developer Intern",
      company: "MobileFirst Tech",
      location: "Bangalore, India",
      type: "Remote",
      duration: "4 months",
      stipend: "₹28,000/month",
      skills: ["Kotlin", "Android SDK", "Firebase"],
      posted: "2 days ago",
      category: "software"
    },
    {
      id: 8,
      title: "Content Writing Intern",
      company: "Media House",
      location: "Mumbai, India",
      type: "Hybrid",
      duration: "3 months",
      stipend: "₹12,000/month",
      skills: ["Writing", "SEO", "Copywriting"],
      posted: "6 days ago",
      category: "marketing"
    },
    {
      id: 9,
      title: "DevOps Intern",
      company: "CloudTech Solutions",
      location: "Pune, India",
      type: "On-site",
      duration: "5 months",
      stipend: "₹32,000/month",
      skills: ["Docker", "Kubernetes", "AWS"],
      posted: "3 days ago",
      category: "software"
    },
    {
      id: 10,
      title: "Graphic Design Intern",
      company: "Design Studio Pro",
      location: "Delhi, India",
      type: "Remote",
      duration: "3 months",
      stipend: "₹16,000/month",
      skills: ["Photoshop", "Illustrator", "InDesign"],
      posted: "1 week ago",
      category: "design"
    },
    {
      id: 11,
      title: "Machine Learning Intern",
      company: "AI Innovations",
      location: "Hyderabad, India",
      type: "Hybrid",
      duration: "6 months",
      stipend: "₹40,000/month",
      skills: ["Python", "TensorFlow", "Deep Learning"],
      posted: "2 days ago",
      category: "data-science"
    },
    {
      id: 12,
      title: "HR Intern",
      company: "People First Inc",
      location: "Chennai, India",
      type: "On-site",
      duration: "4 months",
      stipend: "₹14,000/month",
      skills: ["Recruitment", "HR Policies", "Communication"],
      posted: "5 days ago",
      category: "business"
    },
    {
      id: 13,
      title: "Frontend Developer Intern",
      company: "WebWorks",
      location: "Bangalore, India",
      type: "Remote",
      duration: "4 months",
      stipend: "₹24,000/month",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      posted: "1 day ago",
      category: "software"
    },
    {
      id: 14,
      title: "Digital Marketing Intern",
      company: "AdBoost Agency",
      location: "Mumbai, India",
      type: "Hybrid",
      duration: "3 months",
      stipend: "₹17,000/month",
      skills: ["Google Ads", "Facebook Ads", "Analytics"],
      posted: "4 days ago",
      category: "marketing"
    },
    {
      id: 15,
      title: "Backend Developer Intern",
      company: "ServerSide Tech",
      location: "Pune, India",
      type: "Remote",
      duration: "5 months",
      stipend: "₹26,000/month",
      skills: ["Node.js", "Express", "MongoDB"],
      posted: "2 days ago",
      category: "software"
    },
    {
      id: 16,
      title: "Product Management Intern",
      company: "InnovateCorp",
      location: "Delhi, India",
      type: "On-site",
      duration: "6 months",
      stipend: "₹22,000/month",
      skills: ["Product Strategy", "Agile", "User Research"],
      posted: "3 days ago",
      category: "business"
    },
    {
      id: 17,
      title: "Cyber Security Intern",
      company: "SecureNet Systems",
      location: "Hyderabad, India",
      type: "Remote",
      duration: "4 months",
      stipend: "₹30,000/month",
      skills: ["Network Security", "Penetration Testing", "Ethical Hacking"],
      posted: "1 week ago",
      category: "software"
    },
    {
      id: 18,
      title: "Motion Graphics Intern",
      company: "Animation Studios",
      location: "Chennai, India",
      type: "Hybrid",
      duration: "3 months",
      stipend: "₹19,000/month",
      skills: ["After Effects", "Premiere Pro", "Cinema 4D"],
      posted: "5 days ago",
      category: "design"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Find Your Perfect Internship
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover opportunities that match your skills and career goals
        </p>
      </div>

        {/* Filters */}
        <Card className="glass-card mb-8">
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
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {aiTokens} AI Tokens
                </Badge>
                <span className="text-xs text-muted-foreground">• 10 tokens per internship</span>
              </div>
              <Button 
                onClick={handleAutoApply}
                disabled={filteredInternships.length === 0}
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
                    className={appliedInternships.includes(internship.id) ? "bg-green-500/20 text-green-400 border-green-500/30 cursor-not-allowed" : "btn-neon"}
                    disabled={appliedInternships.includes(internship.id)}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    {appliedInternships.includes(internship.id) ? "Auto Applied" : "Auto Apply by AI"}
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

        {/* AI Token Usage Dialog */}
        <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
          <DialogContent className="glass-card">
            <DialogHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <DialogTitle className="text-center text-2xl">Use AI Tokens for Auto Apply?</DialogTitle>
              <DialogDescription className="text-center text-base">
                You've already used your free daily auto-apply. Now you need AI tokens to continue.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="glass-card p-4 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Your AI Tokens:</span>
                  <Badge className="bg-primary/20 text-primary text-lg px-3 py-1">
                    {aiTokens} tokens
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Cost per Internship:</span>
                  <span className="text-foreground font-semibold">10 tokens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Can Apply to:</span>
                  <span className="text-primary font-bold text-lg">{possibleApplications} internships</span>
                </div>
              </div>

              <div className="glass-card p-4 bg-accent/10 border border-accent/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-foreground font-medium mb-1">After this auto-apply:</p>
                    <p className="text-muted-foreground">
                      • Tokens used: <span className="text-accent font-semibold">{possibleApplications * 10}</span>
                    </p>
                    <p className="text-muted-foreground">
                      • Remaining tokens: <span className="text-accent font-semibold">{aiTokens - (possibleApplications * 10)}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-3 bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                  💡 Login daily to earn 25 free AI tokens!
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowTokenDialog(false)}
                className="bg-secondary/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmTokenAutoApply}
                className="btn-neon"
                disabled={possibleApplications === 0}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use {possibleApplications * 10} Tokens & Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default Internships;