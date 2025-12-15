import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  DollarSign, 
  Github, 
  Linkedin,
  Edit,
  Save,
  Plus,
  X,
  Star,
  Calendar,
  Briefcase,
  Target,
  Trophy,
  Award,
  Loader2
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';
import { useGamification } from '@/hooks/useGamification';
import UserAnalyticsDashboard from '@/components/analytics/UserAnalyticsDashboard';
import { useTranslation } from '@/lib/i18n';

const Profile = () => {
  const { profile, stats, loading, updateProfile } = useUserProfile();
  const { userStats: gamificationStats } = useGamification();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location_preference: '',
    role_preference: '',
    expected_stipend: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    skills: [] as string[]
  });
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location_preference: profile.location_preference || '',
        role_preference: profile.role_preference || '',
        expected_stipend: profile.expected_stipend?.toString() || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        skills: profile.skills || []
      });
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updateData = {
      ...formData,
      expected_stipend: formData.expected_stipend ? parseInt(formData.expected_stipend) : null,
      skills
    };
    
    const { error } = await updateProfile(updateData);
    if (!error) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground">Manage your profile information and preferences</p>
        </div>
        <Button 
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={isSaving}
          className={isEditing ? "btn-neon" : "btn-secondary-glow"}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isEditing ? (
            <Save className="w-4 h-4 mr-2" />
          ) : (
            <Edit className="w-4 h-4 mr-2" />
          )}
          {isSaving ? "Saving..." : isEditing ? t('profile.save') : t('profile.edit')}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="glass-card lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary-foreground pulse-glow">
              {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{profile?.full_name || 'User Name'}</h2>
            <p className="text-muted-foreground mb-4">{profile?.role_preference || 'Role not specified'}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {profile?.email || 'No email provided'}
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                {profile?.phone || 'No phone provided'}
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {profile?.location_preference || 'No location specified'}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-foreground">{stats?.applications || 0}</div>
                  <div className="text-xs text-muted-foreground">Applications</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stats?.interviews || 0}</div>
                  <div className="text-xs text-muted-foreground">Interviews</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground">{t('profile.personal_info')}</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('profile.full_name')}</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('profile.email')}</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('profile.phone')}</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('profile.location')}</label>
                  <Input
                    value={formData.location_preference}
                    onChange={(e) => handleInputChange('location_preference', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">LinkedIn URL</label>
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">GitHub URL</label>
                  <Input
                    value={formData.github_url}
                    onChange={(e) => handleInputChange('github_url', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Achievements Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
            <CardDescription>Your unlocked badges and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            {gamificationStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gamificationStats.achievements_unlocked.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    {...achievement}
                    size="md"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">0 achievements unlocked</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Internship Preferences
              </CardTitle>
              <CardDescription>Your preferred internship criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Preferred Role</label>
                  <Input
                    value={formData.role_preference}
                    onChange={(e) => handleInputChange('role_preference', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Expected Stipend</label>
                  <Input
                    type="number"
                    value={formData.expected_stipend}
                    onChange={(e) => handleInputChange('expected_stipend', e.target.value)}
                    disabled={!isEditing}
                    className="input-glass w-full"
                    placeholder="Monthly stipend expectation"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Dashboard Section */}
      <UserAnalyticsDashboard />
    </div>
  );
};

export default Profile;