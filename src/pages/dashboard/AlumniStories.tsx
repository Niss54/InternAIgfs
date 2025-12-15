import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Plus, 
  Trophy, 
  Building, 
  MapPin,
  Calendar,
  ThumbsUp,
  Eye,
  Bookmark,
  Star,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface AlumniStory {
  id: string;
  author_name: string;
  author_avatar?: string;
  author_current_company: string;
  author_current_role: string;
  author_location: string;
  title: string;
  content: string;
  journey_timeline: any[];
  skills_gained: string[];
  advice_tags: string[];
  story_type: 'career_transition' | 'first_job' | 'startup_journey' | 'skill_development';
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
  created_at: string;
  is_featured: boolean;
  is_verified_alumni: boolean;
}

const AlumniStories = () => {
  const { user } = useAuth();
  const { isPremium } = usePremiumCheck();
  const { toast } = useToast();
  const [stories, setStories] = useState<AlumniStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<AlumniStory | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    story_type: 'career_transition' as AlumniStory['story_type'],
    skills_gained: '',
    advice_tags: ''
  });

  useEffect(() => {
    if (isPremium) {
      fetchAlumniStories();
    }
  }, [isPremium, filterType]);

  const fetchAlumniStories = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('alumni_stories' as any)
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('story_type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setStories((data as any) || []);
    } catch (error) {
      console.error('Error fetching alumni stories:', error);
      toast({
        title: "Loading Failed",
        description: "Could not load alumni stories. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async () => {
    if (!user || !newStory.title.trim() || !newStory.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('alumni_stories' as any)
        .insert({
          user_id: authUser.id,
          author_name: user?.email || 'Anonymous',
          author_current_company: 'Company',
          author_current_role: 'Role',
          author_location: 'Location',
          title: newStory.title,
          content: newStory.content,
          story_type: newStory.story_type,
          skills_gained: newStory.skills_gained ? newStory.skills_gained.split(',').map(s => s.trim()) : [],
          advice_tags: newStory.advice_tags ? newStory.advice_tags.split(',').map(s => s.trim()) : []
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Story Shared Successfully!",
        description: "Your story will be reviewed and published soon.",
      });

      setShowCreateDialog(false);
      setNewStory({
        title: '',
        content: '',
        story_type: 'career_transition',
        skills_gained: '',
        advice_tags: ''
      });
      
      fetchAlumniStories();
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: "Sharing Failed",
        description: "Could not share your story. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLikeStory = async (storyId: string) => {
    if (!user) return;

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('story_interactions' as any)
        .select('id')
        .eq('story_id', storyId)
        .eq('user_id', authUser.id)
        .eq('interaction_type', 'like')
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('story_interactions' as any)
          .delete()
          .eq('id', (existingLike as any).id);
      } else {
        // Like
        await supabase
          .from('story_interactions' as any)
          .insert({
            story_id: storyId,
            user_id: authUser.id,
            interaction_type: 'like'
          });
      }

      // Update local state
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, like_count: existingLike ? story.like_count - 1 : story.like_count + 1 }
          : story
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getStoryTypeIcon = (type: string) => {
    switch (type) {
      case 'career_transition': return <Trophy className="w-4 h-4" />;
      case 'first_job': return <Star className="w-4 h-4" />;
      case 'startup_journey': return <Building className="w-4 h-4" />;
      case 'skill_development': return <BookOpen className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getStoryTypeLabel = (type: string) => {
    switch (type) {
      case 'career_transition': return 'Career Transition';
      case 'first_job': return 'First Job';
      case 'startup_journey': return 'Startup Journey';
      case 'skill_development': return 'Skill Development';
      default: return 'Story';
    }
  };

  if (!isPremium) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">Premium Feature</CardTitle>
            <CardDescription className="mb-4">
              Alumni Success Stories are available for premium members only. 
              Get inspired by real career journeys and success stories from our alumni network.
            </CardDescription>
            <Button className="btn-neon">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inspiring stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Alumni Success Stories
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Premium
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Get inspired by real career journeys from our successful alumni
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="btn-neon">
              <Plus className="w-4 h-4 mr-2" />
              Share Your Story
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Your Success Story</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Story title"
                value={newStory.title}
                onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                className="input-glass"
              />
              <Textarea
                placeholder="Share your journey, challenges, and how you overcame them..."
                value={newStory.content}
                onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                className="min-h-[200px]"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Story Type</label>
                  <select 
                    value={newStory.story_type}
                    onChange={(e) => setNewStory({...newStory, story_type: e.target.value as AlumniStory['story_type']})}
                    className="input-glass w-full"
                  >
                    <option value="career_transition">Career Transition</option>
                    <option value="first_job">First Job</option>
                    <option value="startup_journey">Startup Journey</option>
                    <option value="skill_development">Skill Development</option>
                  </select>
                </div>
                <Input
                  placeholder="Skills gained (comma-separated)"
                  value={newStory.skills_gained}
                  onChange={(e) => setNewStory({...newStory, skills_gained: e.target.value})}
                  className="input-glass"
                />
              </div>
              <Input
                placeholder="Advice tags (comma-separated)"
                value={newStory.advice_tags}
                onChange={(e) => setNewStory({...newStory, advice_tags: e.target.value})}
                className="input-glass"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateStory} className="btn-neon">
                  Share Story
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Stories', icon: '📚' },
              { key: 'career_transition', label: 'Career Transitions', icon: '🔄' },
              { key: 'first_job', label: 'First Jobs', icon: '🌟' },
              { key: 'startup_journey', label: 'Startup Stories', icon: '🚀' },
              { key: 'skill_development', label: 'Skill Growth', icon: '📈' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={filterType === filter.key ? "default" : "outline"}
                onClick={() => setFilterType(filter.key)}
                size="sm"
                className={filterType === filter.key ? "bg-primary text-primary-foreground" : ""}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stories Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="glass-card group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <CardContent className="p-6" onClick={() => setSelectedStory(story)}>
              {/* Story Header */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {story.author_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{story.author_name}</h3>
                    {story.is_verified_alumni && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                        ✓ Verified Alumni
                      </Badge>
                    )}
                    {story.is_featured && (
                      <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {story.author_current_role} at {story.author_current_company}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    {story.author_location}
                    <Calendar className="w-3 h-3 ml-2" />
                    {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
                  </div>
                </div>
                <Badge variant="outline" className="bg-secondary/30">
                  {getStoryTypeIcon(story.story_type)}
                  <span className="ml-1 text-xs">{getStoryTypeLabel(story.story_type)}</span>
                </Badge>
              </div>

              {/* Story Content */}
              <div className="mb-4">
                <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {story.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {story.content}
                </p>
              </div>

              {/* Skills & Tags */}
              {story.skills_gained && story.skills_gained.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {story.skills_gained.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary">
                      {skill}
                    </Badge>
                  ))}
                  {story.skills_gained.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{story.skills_gained.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/50 pt-3">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeStory(story.id);
                    }}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    {story.like_count}
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {story.comment_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {story.view_count}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Story Detail Dialog */}
      {selectedStory && (
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="glass-card max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedStory.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                {/* Author Info */}
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {selectedStory.author_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{selectedStory.author_name}</h3>
                    <p className="text-muted-foreground">
                      {selectedStory.author_current_role} at {selectedStory.author_current_company}
                    </p>
                    <p className="text-sm text-muted-foreground">📍 {selectedStory.author_location}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground">{selectedStory.content}</div>
                </div>

                {/* Skills & Tags */}
                {selectedStory.skills_gained && selectedStory.skills_gained.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Skills Gained:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStory.skills_gained.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advice Tags */}
                {selectedStory.advice_tags && selectedStory.advice_tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Key Advice:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStory.advice_tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-accent/10 text-accent">
                          💡 {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Empty State */}
      {stories.length === 0 && !loading && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No stories found
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your success story with the community!
            </p>
            <Button 
              className="btn-neon"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Your Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlumniStories;