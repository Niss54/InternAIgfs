import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, DollarSign, Briefcase, Plus, X, Upload, Linkedin, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ProfileSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location_preference: '',
    role_preference: '',
    expected_stipend: '',
    skills: [],
    bio: '',
    linkedin_url: '',
    github_url: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Pre-fill email from auth if available
      if (session.user.email) {
        setFormData(prev => ({ ...prev, email: session.user.email }));
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create your profile.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      const profileData = {
        user_id: session.user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        location_preference: formData.location_preference,
        role_preference: formData.role_preference,
        expected_stipend: formData.expected_stipend ? parseInt(formData.expected_stipend) : null,
        skills: formData.skills,
        bio: formData.bio,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) {
        console.error('Profile creation error:', error);
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Profile Created!",
        description: "Your profile has been successfully created.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us about yourself to get the best internship matches
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic information about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="input-glass"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="input-glass"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="input-glass"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Internship Preferences
              </CardTitle>
              <CardDescription>
                What kind of internship are you looking for?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location_preference" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location Preference
                  </Label>
                  <Input
                    id="location_preference"
                    name="location_preference"
                    value={formData.location_preference}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, Remote, Hybrid"
                    className="input-glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role_preference">Role Preference</Label>
                  <Input
                    id="role_preference"
                    name="role_preference"
                    value={formData.role_preference}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer, Data Analyst"
                    className="input-glass"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_stipend" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Expected Stipend (per month)
                </Label>
                <Input
                  id="expected_stipend"
                  name="expected_stipend"
                  type="number"
                  value={formData.expected_stipend}
                  onChange={handleInputChange}
                  placeholder="e.g., 2000"
                  className="input-glass"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>
                Add your technical and soft skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill and press Enter"
                  className="input-glass flex-1"
                />
                <Button type="button" onClick={addSkill} className="btn-neon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bio & Links */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About You</CardTitle>
              <CardDescription>
                Tell employers about yourself and share your profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a brief introduction about yourself, your interests, and career goals..."
                  className="input-glass min-h-[100px] resize-none"
                />
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedin_url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="input-glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </Label>
                  <Input
                    id="github_url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                    className="input-glass"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={loading}
              className="btn-neon px-8 py-3"
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;