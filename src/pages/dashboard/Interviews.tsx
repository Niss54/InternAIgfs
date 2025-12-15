import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, Clock, Video, MapPin, User, Plus,
  ChevronLeft, ChevronRight, AlertCircle, Bot, Mic, 
  Play, Pause, RotateCcw, Award, Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Interviews = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showSimulatorDialog, setShowSimulatorDialog] = useState(false);
  const [simulationSetup, setSimulationSetup] = useState({
    role_type: '',
    simulation_type: 'technical' as 'technical' | 'behavioral' | 'final'
  });
  const [currentSimulation, setCurrentSimulation] = useState<any>(null);
  const [simulationQuestions, setSimulationQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [simulationStartTime, setSimulationStartTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const interviews = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineering Intern",
      date: "2024-01-25",
      time: "14:00",
      duration: 60,
      type: "Technical Round",
      interviewer: "Sarah Johnson",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      status: "upcoming",
      notes: "Focus on algorithms and data structures"
    },
    {
      id: 2,
      company: "Netflix",
      role: "ML Engineer Intern",
      date: "2024-01-30",
      time: "11:00",
      duration: 45,
      type: "Final Round",
      interviewer: "Michael Chen",
      meetingLink: "https://zoom.us/j/123456789",
      status: "upcoming",
      notes: "Behavioral questions and project discussion"
    },
    {
      id: 3,
      company: "Microsoft",
      role: "Product Manager Intern",
      date: "2024-01-22",
      time: "10:30",
      duration: 30,
      type: "HR Round",
      interviewer: "Emily Davis",
      meetingLink: "https://teams.microsoft.com/abc",
      status: "completed",
      notes: "Went well, discussed company culture"
    },
    {
      id: 4,
      company: "Amazon",
      role: "Cloud Engineer Intern",
      date: "2024-02-02",
      time: "16:00",
      duration: 90,
      type: "Technical Round",
      interviewer: "Alex Kumar",
      meetingLink: "https://chime.aws/meeting",
      status: "upcoming",
      notes: "System design and AWS knowledge"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'technical round':
        return 'bg-primary/20 text-primary';
      case 'hr round':
        return 'bg-accent/20 text-accent';
      case 'final round':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-secondary/50 text-muted-foreground';
    }
  };

  const upcomingInterviews = interviews.filter(interview => interview.status === 'upcoming');
  const todayInterviews = interviews.filter(interview => 
    interview.date === new Date().toISOString().split('T')[0]
  );

  const startAISimulation = async () => {
    if (!user || !simulationSetup.role_type) {
      toast({
        title: "Setup Required",
        description: "Please enter the role you're preparing for",
        variant: "destructive"
      });
      return;
    }

    try {
      setSimulationLoading(true);
      const { data, error } = await supabase.functions.invoke('ai-interview-simulator', {
        body: {
          role_type: simulationSetup.role_type,
          simulation_type: simulationSetup.simulation_type,
          action: 'start'
        }
      });

      if (error) throw error;

      setCurrentSimulation(data);
      setSimulationQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setCurrentAnswer('');
      setSimulationStartTime(Date.now());
      setShowSimulatorDialog(false);
      
      toast({
        title: "Interview Simulation Started",
        description: `${data.questions.length} ${simulationSetup.simulation_type} questions ready`,
      });
    } catch (error) {
      console.error('Simulation start error:', error);
      toast({
        title: "Simulation Failed",
        description: "Unable to start interview simulation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSimulationLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;

    const newAnswer = {
      question: simulationQuestions[currentQuestionIndex].question,
      answer: currentAnswer,
      time_taken: simulationStartTime ? Math.floor((Date.now() - simulationStartTime) / 1000) : 0
    };

    setUserAnswers([...userAnswers, newAnswer]);
    setCurrentAnswer('');

    if (currentQuestionIndex < simulationQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSimulationStartTime(Date.now());
    } else {
      // Submit final answers
      submitSimulation([...userAnswers, newAnswer]);
    }
  };

  const submitSimulation = async (answers: any[]) => {
    if (!currentSimulation) return;

    try {
      setSimulationLoading(true);
      const { data, error } = await supabase.functions.invoke('ai-interview-simulator', {
        body: {
          action: 'submit',
          simulation_id: currentSimulation.simulation_id,
          answers
        }
      });

      if (error) throw error;

      setFeedback(data.feedback);
      
      toast({
        title: "Interview Complete!",
        description: `Overall Score: ${data.feedback.overall_score}/100`,
      });
    } catch (error) {
      console.error('Simulation submit error:', error);
      toast({
        title: "Submission Failed",
        description: "Unable to get feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSimulationLoading(false);
    }
  };

  const resetSimulation = () => {
    setCurrentSimulation(null);
    setSimulationQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentAnswer('');
    setSimulationStartTime(null);
    setFeedback(null);
    setSimulationSetup({ role_type: '', simulation_type: 'technical' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Schedule</h1>
          <p className="text-muted-foreground">Manage your upcoming interviews and practice with AI simulation</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSimulatorDialog} onOpenChange={setShowSimulatorDialog}>
            <DialogTrigger asChild>
              <Button className="btn-neon">
                <Bot className="w-4 h-4 mr-2" />
                AI Interview Simulator
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Interview Simulator
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Target Role
                  </label>
                  <Input
                    placeholder="e.g., Software Engineering Intern, Data Science Intern"
                    value={simulationSetup.role_type}
                    onChange={(e) => setSimulationSetup({...simulationSetup, role_type: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['technical', 'behavioral', 'final'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={simulationSetup.simulation_type === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSimulationSetup({...simulationSetup, simulation_type: type})}
                        className={simulationSetup.simulation_type === type ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSimulatorDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={startAISimulation}
                    disabled={simulationLoading || !simulationSetup.role_type}
                    className="btn-neon"
                  >
                    {simulationLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Simulation
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="bg-secondary/50">
            <Plus className="w-4 h-4 mr-2" />
            Add Interview
          </Button>
        </div>
      </div>

      {/* AI Interview Simulation Active */}
      {currentSimulation && !feedback && (
        <Card className="glass-card border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center pulse-glow">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground">
                    {simulationSetup.simulation_type.charAt(0).toUpperCase() + simulationSetup.simulation_type.slice(1)} Interview Simulation
                  </CardTitle>
                  <CardDescription>
                    Question {currentQuestionIndex + 1} of {simulationQuestions.length}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={resetSimulation} size="sm">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Question:</h4>
              <p className="text-muted-foreground">
                {simulationQuestions[currentQuestionIndex]?.question}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Your Answer:
              </label>
              <Textarea
                placeholder="Type your answer here... Use the STAR method (Situation, Task, Action, Result) for behavioral questions."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {userAnswers.length} of {simulationQuestions.length} questions completed
              </div>
              <Button
                onClick={submitAnswer}
                disabled={!currentAnswer.trim() || simulationLoading}
                className="btn-neon"
              >
                {currentQuestionIndex < simulationQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Results */}
      {feedback && (
        <Card className="glass-card border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center pulse-glow">
                  <Award className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Interview Performance Report</CardTitle>
                  <CardDescription>AI-generated feedback and recommendations</CardDescription>
                </div>
              </div>
              <Button onClick={resetSimulation} className="btn-neon">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Simulation
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-secondary/30">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {feedback.overall_score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-accent mb-1">
                    {feedback.communication_score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Communication</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary-glow mb-1">
                    {feedback.individual_scores?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Questions Answered</div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Strengths
                </h4>
                <div className="space-y-2">
                  {feedback.strengths?.map((strength: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-foreground">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-accent" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {feedback.improvements?.map((improvement: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-foreground">{improvement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {feedback.recommendations && feedback.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {feedback.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Today's Interviews Alert */}
      {todayInterviews.length > 0 && (
        <Card className="glass-card border-accent/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Today's Interviews</h3>
                <p className="text-sm text-muted-foreground">
                  You have {todayInterviews.length} interview{todayInterviews.length > 1 ? 's' : ''} scheduled for today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Calendar View</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className={viewMode === 'month' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50'}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className={viewMode === 'week' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50'}
                >
                  Week
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-foreground">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simple calendar grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Starting from a Sunday
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const hasInterview = interviews.some(interview => 
                  interview.date === date.toISOString().split('T')[0]
                );
                
                return (
                  <div key={i} className={`
                    p-2 text-center text-sm rounded-lg cursor-pointer transition-all
                    ${day <= 0 || day > 31 ? 'text-muted-foreground/50' : 'text-foreground hover:bg-secondary/50'}
                    ${hasInterview ? 'bg-primary/20 ring-1 ring-primary/30' : ''}
                  `}>
                    {day > 0 && day <= 31 ? day : ''}
                    {hasInterview && (
                      <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1 pulse-glow"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews Sidebar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Interviews</CardTitle>
            <CardDescription>Your next scheduled interviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.slice(0, 4).map((interview) => (
              <div key={interview.id} className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{interview.role}</h4>
                    <p className="text-xs text-muted-foreground">{interview.company}</p>
                  </div>
                  <Badge className={getTypeColor(interview.type)} variant="outline">
                    {interview.type}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(interview.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {interview.time} ({interview.duration}min)
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {interview.interviewer}
                  </div>
                </div>
                
                <Button size="sm" className="w-full mt-2 bg-primary/20 text-primary hover:bg-primary/30">
                  <Video className="w-3 h-3 mr-1" />
                  Join Meeting
                </Button>
              </div>
            ))}
            
            {upcomingInterviews.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No upcoming interviews</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Interviews List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-foreground">All Interviews</CardTitle>
          <CardDescription>Complete list of your interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="p-4 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                      {interview.company[0]}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{interview.role}</h3>
                          <p className="text-sm text-muted-foreground">{interview.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(interview.status)} variant="outline">
                            {interview.status}
                          </Badge>
                          <Badge className={getTypeColor(interview.type)} variant="outline">
                            {interview.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(interview.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {interview.time} ({interview.duration}min)
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {interview.interviewer}
                        </div>
                      </div>
                      
                      {interview.notes && (
                        <p className="text-sm text-muted-foreground mb-3 italic">
                          "{interview.notes}"
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        {interview.status === 'upcoming' && (
                          <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">
                            <Video className="w-4 h-4 mr-1" />
                            Join Meeting
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Interviews;