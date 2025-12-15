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
  Users, 
  Star, 
  Calendar, 
  Clock, 
  DollarSign, 
  Video, 
  MessageSquare,
  Award,
  MapPin,
  Filter,
  Search,
  Plus,
  Crown,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Mentor {
  id: string;
  user_id: string;
  name: string;
  title: string;
  company: string;
  avatar_url?: string;
  bio: string;
  expertise_areas: string[];
  hourly_rate: number;
  rating: number;
  total_sessions: number;
  years_experience: number;
  location: string;
  languages: string[];
  availability_slots: any[];
  is_premium_mentor: boolean;
  is_verified: boolean;
  session_types: string[];
  created_at: string;
}

interface SessionBooking {
  mentor_id: string;
  session_type: string;
  session_date: string;
  session_duration: number;
  message: string;
}

const MentorMarketplace = () => {
  const { user } = useAuth();
  const { isPremium } = usePremiumCheck();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpertise, setFilterExpertise] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [bookingData, setBookingData] = useState<SessionBooking>({
    mentor_id: '',
    session_type: 'career_guidance',
    session_date: '',
    session_duration: 60,
    message: ''
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('mentors' as any)
        .select('*')
        .eq('is_active', true)
        .order('is_verified', { ascending: false })
        .order('rating', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Map database fields to interface
      const mappedMentors = (data as any)?.map((mentor: any) => ({
        id: mentor.id,
        user_id: mentor.user_id,
        name: mentor.name,
        title: mentor.title,
        company: mentor.company,
        avatar_url: mentor.avatar_url,
        bio: mentor.bio,
        expertise_areas: mentor.specialties || [],
        hourly_rate: mentor.hourly_rate,
        rating: mentor.rating,
        total_sessions: mentor.total_sessions,
        years_experience: mentor.experience_years,
        location: 'Remote',
        languages: ['English'],
        availability_slots: [],
        is_premium_mentor: mentor.is_verified,
        is_verified: mentor.is_verified,
        session_types: ['career_guidance', 'technical_review', 'mock_interview'],
        created_at: mentor.created_at
      })) || [];

      setMentors(mappedMentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: "Loading Failed",
        description: "Could not load mentors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async () => {
    if (!user || !selectedMentor) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a session",
        variant: "destructive"
      });
      return;
    }

    if (!bookingData.session_date || !bookingData.message.trim()) {
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
        .from('mentor_sessions' as any)
        .insert({
          mentor_id: selectedMentor.id,
          student_id: authUser.id,
          scheduled_at: bookingData.session_date,
          duration_minutes: bookingData.session_duration,
          amount: (selectedMentor.hourly_rate * bookingData.session_duration) / 60,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session Requested! 📅",
        description: `Your session request with ${selectedMentor.name} has been sent. They'll confirm within 24 hours.`,
      });

      setShowBookingDialog(false);
      setBookingData({
        mentor_id: '',
        session_type: 'career_guidance',
        session_date: '',
        session_duration: 60,
        message: ''
      });
    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: "Booking Failed",
        description: "Could not book the session. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter mentors based on search and filters
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise_areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExpertise = !filterExpertise || mentor.expertise_areas.includes(filterExpertise);
    
    const matchesRating = !filterRating || mentor.rating >= parseFloat(filterRating);
    
    return matchesSearch && matchesExpertise && matchesRating;
  });

  // Get unique expertise areas for filter
  const expertiseAreas = [...new Set(mentors.flatMap(mentor => mentor.expertise_areas))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading mentor marketplace...</p>
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
            <Users className="w-8 h-8 text-primary" />
            Mentor Marketplace
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              Expert Guidance
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Connect with industry experts for personalized career guidance
          </p>
        </div>
        
        {isPremium && (
          <Button className="btn-neon">
            <Plus className="w-4 h-4 mr-2" />
            Become a Mentor
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors, skills, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-glass"
              />
            </div>
            <select 
              value={filterExpertise}
              onChange={(e) => setFilterExpertise(e.target.value)}
              className="input-glass"
            >
              <option value="">All Expertise Areas</option>
              {expertiseAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <select 
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="input-glass"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterExpertise('');
              setFilterRating('');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Premium Feature Banner */}
      {!isPremium && (
        <Card className="glass-card border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Crown className="w-12 h-12 text-accent" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Unlock Premium Mentorship
                </h3>
                <p className="text-muted-foreground mb-3">
                  Get access to 1-on-1 sessions with industry experts, priority booking, and exclusive mentor content.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">✓ Verified Industry Experts</Badge>
                  <Badge variant="secondary">✓ 1-on-1 Video Sessions</Badge>
                  <Badge variant="secondary">✓ Career Guidance</Badge>
                  <Badge variant="secondary">✓ Priority Support</Badge>
                </div>
              </div>
              <Button className="btn-neon">
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mentors Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="glass-card group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
              {/* Mentor Header */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {mentor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{mentor.name}</h3>
                    {mentor.is_verified && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                    {mentor.is_premium_mentor && (
                      <Crown className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
                  <p className="text-sm font-medium text-foreground">{mentor.company}</p>
                </div>
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  {mentor.total_sessions} sessions
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  {mentor.years_experience}y exp
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {mentor.bio}
              </p>

              {/* Expertise Areas */}
              <div className="flex flex-wrap gap-1 mb-4">
                {mentor.expertise_areas.slice(0, 3).map((area, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary">
                    {area}
                  </Badge>
                ))}
                {mentor.expertise_areas.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{mentor.expertise_areas.length - 3}
                  </Badge>
                )}
              </div>

              {/* Location and Rate */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {mentor.location}
                </div>
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <DollarSign className="w-4 h-4" />
                  ${mentor.hourly_rate}/hr
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedMentor(mentor)}
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  View Profile
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 btn-neon"
                  disabled={!isPremium}
                  onClick={() => {
                    setSelectedMentor(mentor);
                    setShowBookingDialog(true);
                    setBookingData(prev => ({...prev, mentor_id: mentor.id}));
                  }}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mentor Profile Dialog */}
      {selectedMentor && !showBookingDialog && (
        <Dialog open={!!selectedMentor} onOpenChange={() => setSelectedMentor(null)}>
          <DialogContent className="glass-card max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedMentor.name}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                {/* Detailed Profile Info */}
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {selectedMentor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{selectedMentor.name}</h2>
                      {selectedMentor.is_verified && (
                        <Badge className="bg-primary/20 text-primary">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {selectedMentor.is_premium_mentor && (
                        <Badge className="bg-accent/20 text-accent">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-1">{selectedMentor.title}</p>
                    <p className="text-lg font-medium text-foreground mb-3">{selectedMentor.company}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{selectedMentor.rating.toFixed(1)} ({selectedMentor.total_sessions} sessions)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedMentor.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>{selectedMentor.years_experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>${selectedMentor.hourly_rate}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">About</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedMentor.bio}</p>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.expertise_areas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Session Types */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Available Session Types</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedMentor.session_types?.map((type, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                        <Video className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-medium text-sm">{type.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-xs text-muted-foreground">1-on-1 guidance session</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                {selectedMentor.languages && selectedMentor.languages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                Close
              </Button>
              <Button 
                className="btn-neon"
                disabled={!isPremium}
                onClick={() => {
                  setShowBookingDialog(true);
                  setBookingData(prev => ({...prev, mentor_id: selectedMentor.id}));
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Booking Dialog */}
      {showBookingDialog && selectedMentor && (
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Book Session with {selectedMentor.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Session Type</label>
                <select 
                  value={bookingData.session_type}
                  onChange={(e) => setBookingData({...bookingData, session_type: e.target.value})}
                  className="input-glass w-full"
                >
                  <option value="career_guidance">Career Guidance</option>
                  <option value="interview_prep">Interview Preparation</option>
                  <option value="skill_development">Skill Development</option>
                  <option value="industry_insights">Industry Insights</option>
                  <option value="resume_review">Resume Review</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Preferred Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={bookingData.session_date}
                    onChange={(e) => setBookingData({...bookingData, session_date: e.target.value})}
                    className="input-glass"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Duration</label>
                  <select 
                    value={bookingData.session_duration}
                    onChange={(e) => setBookingData({...bookingData, session_duration: parseInt(e.target.value)})}
                    className="input-glass w-full"
                  >
                    <option value={30}>30 minutes - ${(selectedMentor.hourly_rate * 0.5).toFixed(0)}</option>
                    <option value={60}>1 hour - ${selectedMentor.hourly_rate}</option>
                    <option value={90}>1.5 hours - ${(selectedMentor.hourly_rate * 1.5).toFixed(0)}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Message to Mentor</label>
                <Textarea
                  placeholder="Tell the mentor about your goals, what you'd like to discuss, and any specific questions..."
                  value={bookingData.message}
                  onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-lg font-bold text-primary">
                    ${((selectedMentor.hourly_rate * bookingData.session_duration) / 60).toFixed(0)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Payment will be processed after mentor confirms the session
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBookSession} className="btn-neon">
                  <Calendar className="w-4 h-4 mr-2" />
                  Request Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Empty State */}
      {filteredMentors.length === 0 && !loading && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No mentors found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new mentors.
            </p>
            <Button variant="outline" onClick={fetchMentors}>
              Refresh List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MentorMarketplace;