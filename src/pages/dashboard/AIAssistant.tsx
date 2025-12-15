import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Bot, Sparkles, TrendingUp, Target, BookOpen, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const AIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skillAnalysis, setSkillAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (user) {
      loadSkillGapAnalysis();
    }
  }, [user]);

  const loadSkillGapAnalysis = async () => {
    if (!user) return;

    try {
      setLoadingAnalysis(true);
      const { data, error } = await supabase.functions.invoke('ai-skill-gap-analyzer');

      if (error) throw error;

      setSkillAnalysis(data.analysis);
      
      if (!data.cached) {
        toast({
          title: "Skill Analysis Complete",
          description: `Your market readiness score: ${data.analysis.skill_match_percentage}%`,
        });
      }
    } catch (error) {
      console.error('Skill analysis error:', error);
      toast({
        title: "Analysis Unavailable",
        description: "Complete your profile to unlock skill gap analysis.",
        variant: "destructive"
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center pulse-glow">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                AI Assistant
              </h1>
            </div>
            <p className="text-muted-foreground">
              Get personalized career guidance, interview prep, and internship advice
            </p>
          </div>
          <div className="pulse-glow">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-lg">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Powered by Gemini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <Card className="glass-card border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center pulse-glow">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  AI Skill Gap Analyzer
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    <Target className="w-3 h-3 mr-1" />
                    Market Analysis
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Compare your skills with market demand and get personalized learning recommendations
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={loadSkillGapAnalysis}
              disabled={loadingAnalysis}
              className="btn-neon"
            >
              {loadingAnalysis ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze Skills
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {skillAnalysis ? (
            <div className="space-y-6">
              {/* Skill Match Score */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {skillAnalysis.skill_match_percentage}%
                      </div>
                      <div className="text-sm text-muted-foreground">Market Readiness</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {skillAnalysis.gap_skills?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Skills to Learn</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-glow mb-1">
                        {skillAnalysis.current_skills?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Skills</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              {skillAnalysis.recommendations && skillAnalysis.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Learning Recommendations
                  </h4>
                  <div className="space-y-2">
                    {skillAnalysis.recommendations.slice(0, 5).map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-secondary/30 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Market Skills */}
              {skillAnalysis.market_analysis?.top_skills && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Top Market Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillAnalysis.market_analysis.top_skills.slice(0, 10).map((skillData: any, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30"
                      >
                        {skillData.skill} ({skillData.demand_percentage}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            !loadingAnalysis && (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Get AI-powered insights into your skill gaps and market demand
                </p>
                <Button onClick={loadSkillGapAnalysis} className="btn-neon">
                  Start Analysis
                </Button>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="glass-card h-[600px]">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Chat with AI Assistant
          </CardTitle>
          <CardDescription>
            Ask me anything about internships, career advice, interview preparation, or resume tips
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[500px] relative">
          <ChatWindow />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Interview Prep</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized interview questions and practice sessions
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Resume Review</h3>
            <p className="text-sm text-muted-foreground">
              Get AI-powered feedback on your resume and cover letters
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-primary-glow/20 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-5 h-5 text-primary-glow" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Career Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Receive personalized career advice and industry insights
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;