import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, Mail, MapPin, Building, Edit, Save, Plus, X, Award, Upload, FileText, 
  Briefcase, BookOpen, GraduationCap, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileNew = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    skills: [] as string[],
    address: '',
    branch: '',
    marks10th: '',
    marks12th: '',
    graduationStatus: '',
    instituteName: '',
    courseName: '',
    achievements: [] as string[],
    certificates: ''
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: [] as any[],
    cv: [] as any[],
    certificate: [] as any[],
    other: [] as any[]
  });

  // Load profile on mount
  useEffect(() => {
    loadProfile();
    loadDocuments();
  }, []);

  const loadProfile = () => {
    const profileStore = (window as any).profileStore;
    if (profileStore) {
      const profile = profileStore.getProfile();
      if (profile) {
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          role: profile.role || '',
          skills: profile.skills || [],
          address: profile.address || '',
          branch: profile.branch || '',
          marks10th: profile.marks10th?.toString() || '',
          marks12th: profile.marks12th?.toString() || '',
          graduationStatus: profile.graduationStatus || '',
          instituteName: profile.instituteName || '',
          courseName: profile.courseName || '',
          achievements: profile.achievements || [],
          certificates: profile.certificates || ''
        });
      }
    }
  };

  const loadDocuments = () => {
    const resumeStore = (window as any).resumeStore;
    if (resumeStore) {
      setUploadedFiles({
        resume: resumeStore.getDocumentsByCategory('resume') || [],
        cv: resumeStore.getDocumentsByCategory('cv') || [],
        certificate: resumeStore.getDocumentsByCategory('certificate') || [],
        other: resumeStore.getDocumentsByCategory('other') || []
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && formData.skills.length < 6 && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    } else if (formData.skills.length >= 6) {
      toast({
        title: "Maximum Skills Reached",
        description: "You can only add up to 6 skills",
        variant: "destructive"
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: 'resume' | 'cv' | 'certificate' | 'other') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resumeStore = (window as any).resumeStore;
    if (resumeStore) {
      try {
        // Extract text if it's a text file
        let extractedText = '';
        if (file.type === 'text/plain') {
          extractedText = await file.text();
        }

        resumeStore.saveNewDocument(file, extractedText, category);
        loadDocuments();
        
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload file",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in Name, Email, and Role",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }

    const profileStore = (window as any).profileStore;
    if (profileStore) {
      try {
        const profileData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          skills: formData.skills,
          address: formData.address || undefined,
          branch: formData.branch,
          marks10th: formData.marks10th ? parseFloat(formData.marks10th) : undefined,
          marks12th: formData.marks12th ? parseFloat(formData.marks12th) : undefined,
          graduationStatus: formData.graduationStatus,
          instituteName: formData.instituteName,
          courseName: formData.courseName,
          achievements: formData.achievements,
          certificates: formData.certificates
        };

        profileStore.saveProfile(profileData);
        
        toast({
          title: "Profile Updated! 🎉",
          description: "Your profile has been saved successfully",
        });
        
        setIsEditing(false);
      } catch (error: any) {
        toast({
          title: "Save Failed",
          description: error.message || "Failed to save profile",
          variant: "destructive"
        });
      }
    }
    
    setIsSaving(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and documents</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className="btn-neon"
        >
          {isSaving ? (
            <>Saving...</>
          ) : isEditing ? (
            <><Save className="w-4 h-4 mr-2" />Save Changes</>
          ) : (
            <><Edit className="w-4 h-4 mr-2" />Edit Profile</>
          )}
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent">
                {getInitials(formData.name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{formData.name || 'Complete Your Profile'}</CardTitle>
              <CardDescription>{formData.role || 'Role not specified'}</CardDescription>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {formData.email || 'Email not provided'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className="input-glass"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="your.email@example.com"
                  className="input-glass"
                />
              </div>
              <div>
                <Label htmlFor="role">Target Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Web Developer, Data Scientist"
                  className="input-glass"
                />
              </div>
              <div>
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="City, State"
                  className="input-glass"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Skills (Maximum 6)
            </h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                    {isEditing && (
                      <X
                        className="w-3 h-3 ml-2 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    )}
                  </Badge>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
              {isEditing && formData.skills.length < 6 && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill (max 6)"
                    className="input-glass"
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="branch">Branch/Stream</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Computer Science, IT"
                  className="input-glass"
                />
              </div>
              <div>
                <Label htmlFor="graduationStatus">Graduation Status</Label>
                <Select
                  value={formData.graduationStatus}
                  onValueChange={(value) => handleInputChange('graduationStatus', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="input-glass">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="instituteName">Institute/College Name</Label>
                <Input
                  id="instituteName"
                  value={formData.instituteName}
                  onChange={(e) => handleInputChange('instituteName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Your institute name"
                  className="input-glass"
                />
              </div>
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => handleInputChange('courseName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., B.Tech, BCA, MCA"
                  className="input-glass"
                />
              </div>
              <div>
                <Label htmlFor="marks10th">10th Percentage (Optional)</Label>
                <Input
                  id="marks10th"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.marks10th}
                  onChange={(e) => handleInputChange('marks10th', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., 85.5"
                  className="input-glass"
                />
              </div>
              <div>
                <Label htmlFor="marks12th">12th Percentage (Optional)</Label>
                <Input
                  id="marks12th"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.marks12th}
                  onChange={(e) => handleInputChange('marks12th', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., 90.0"
                  className="input-glass"
                />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </h3>
            <div className="space-y-3">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <p className="text-sm">{achievement}</p>
                  {isEditing && (
                    <X
                      className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive"
                      onClick={() => removeAchievement(index)}
                    />
                  )}
                </div>
              ))}
              {formData.achievements.length === 0 && (
                <p className="text-sm text-muted-foreground">No achievements added yet</p>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    placeholder="Add an achievement"
                    className="input-glass"
                  />
                  <Button onClick={addAchievement} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Certificates & Courses
            </h3>
            <Textarea
              value={formData.certificates}
              onChange={(e) => handleInputChange('certificates', e.target.value)}
              disabled={!isEditing}
              placeholder="List your certificates, courses, or other qualifications..."
              className="input-glass min-h-[100px]"
            />
          </div>

          {/* Document Uploads */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resume */}
              <div>
                <Label>Resume</Label>
                <div className="mt-2 space-y-2">
                  {uploadedFiles.resume.map((file: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm truncate flex-1">{file.fileName}</span>
                    </div>
                  ))}
                  {isEditing && (
                    <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/30">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Resume</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileUpload(e, 'resume')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* CV */}
              <div>
                <Label>CV</Label>
                <div className="mt-2 space-y-2">
                  {uploadedFiles.cv.map((file: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm truncate flex-1">{file.fileName}</span>
                    </div>
                  ))}
                  {isEditing && (
                    <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/30">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload CV</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileUpload(e, 'cv')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Certificates */}
              <div>
                <Label>Certificates</Label>
                <div className="mt-2 space-y-2">
                  {uploadedFiles.certificate.map((file: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm truncate flex-1">{file.fileName}</span>
                    </div>
                  ))}
                  {isEditing && (
                    <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/30">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Certificate</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'certificate')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Other Documents */}
              <div>
                <Label>Other Documents & Videos</Label>
                <div className="mt-2 space-y-2">
                  {uploadedFiles.other.map((file: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm truncate flex-1">{file.fileName}</span>
                    </div>
                  ))}
                  {isEditing && (
                    <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/30">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Document/Video</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov,.avi,.mkv,.webm"
                        onChange={(e) => handleFileUpload(e, 'other')}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Supported: Documents (PDF, DOC, TXT), Images (JPG, PNG), Videos (MP4, MOV, AVI, MKV, WEBM)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileNew;
