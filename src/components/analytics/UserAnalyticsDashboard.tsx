import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Calendar,
  Brain,
  Award,
  AlertCircle
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from '@/lib/i18n';

interface AnalyticsData {
  month: string;
  applications: number;
  interviews: number;
  selections: number;
}

interface PredictiveInsight {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  recommendation: string;
}

const UserAnalyticsDashboard = () => {
  const { stats } = useUserProfile();
  const { t } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);

  // Mock analytics data - in real app, this would come from API
  useEffect(() => {
    const mockData: AnalyticsData[] = [
      { month: 'Jan', applications: 5, interviews: 1, selections: 0 },
      { month: 'Feb', applications: 8, interviews: 2, selections: 1 },
      { month: 'Mar', applications: 12, interviews: 3, selections: 1 },
      { month: 'Apr', applications: 15, interviews: 4, selections: 2 },
      { month: 'May', applications: 10, interviews: 2, selections: 0 },
      { month: 'Jun', applications: stats?.applications || 18, interviews: stats?.interviews || 5, selections: 2 }
    ];
    
    setAnalyticsData(mockData);

    // Generate predictive insights based on current performance
    const totalApps = mockData.reduce((sum, month) => sum + month.applications, 0);
    const totalInterviews = mockData.reduce((sum, month) => sum + month.interviews, 0);
    const currentRate = totalApps > 0 ? (totalInterviews / totalApps) * 100 : 0;
    
    const predictiveInsights: PredictiveInsight[] = [
      {
        metric: 'Interview Probability',
        current: currentRate,
        predicted: Math.min(currentRate + 5, 25),
        confidence: 78,
        recommendation: t('analytics.prediction_text')
      },
      {
        metric: 'Optimal Applications/Week',
        current: 3,
        predicted: 7,
        confidence: 85,
        recommendation: 'Apply to 7 internships weekly for best results'
      }
    ];
    
    setInsights(predictiveInsights);
  }, [stats, t]);

  const chartConfig = {
    applications: {
      label: t('dashboard.applications'),
      color: "hsl(217 91% 60%)"
    },
    interviews: {
      label: t('dashboard.interviews'),
      color: "hsl(184 100% 60%)"
    },
    selections: {
      label: "Selections",
      color: "hsl(142 71% 45%)"
    }
  };

  const successRate = stats?.applications ? ((stats.interviews / stats.applications) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('dashboard.analytics')}</h2>
          <p className="text-muted-foreground">Track your progress and get AI-powered insights</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Brain className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{successRate.toFixed(1)}%</div>
            <Progress value={successRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {successRate > 15 ? 'Above average' : 'Room for improvement'}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">+0%</div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="text-xs text-muted-foreground">Applications increased</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Interview</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0 days</div>
            <p className="text-xs text-muted-foreground mt-2">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trend Chart */}
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>{t('analytics.application_trend')}</CardTitle>
            <CardDescription>Your application performance over time</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stackId="1"
                    stroke="hsl(217 91% 60%)"
                    fill="hsl(217 91% 60% / 0.3)"
                  />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stackId="1"
                    stroke="hsl(184 100% 60%)"
                    fill="hsl(184 100% 60% / 0.3)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Success Rate by Month */}
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>{t('analytics.monthly_progress')}</CardTitle>
            <CardDescription>Interview-to-application ratio</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="applications" fill="hsl(217 91% 60% / 0.7)" />
                  <Bar dataKey="interviews" fill="hsl(184 100% 60%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            {t('analytics.success_prediction')}
          </CardTitle>
          <CardDescription>AI-powered insights to improve your success rate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{insight.metric}</h4>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {insight.confidence}% confidence
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="text-lg font-bold text-foreground">{insight.current.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Predicted</p>
                  <p className="text-lg font-bold text-primary">{insight.predicted.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalyticsDashboard;