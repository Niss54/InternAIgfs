import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, Sparkles, Briefcase, BookOpen, Home } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Back to Home Button */}
      <div className="flex justify-end p-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">About InternAI</Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Empowering Your Career Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            InternAI is your intelligent companion for finding the perfect internship opportunities, 
            crafting impressive resumes, and preparing for successful interviews.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="glass-card mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Target className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              We believe every student deserves the opportunity to kickstart their career with the right internship. 
              Our AI-powered platform simplifies the journey from application to interview, making professional 
              growth accessible to everyone.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <Briefcase className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your profile to recommend internships that perfectly match your skills and interests.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <BookOpen className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resume Builder</h3>
              <p className="text-muted-foreground">
                Create professional resumes with AI-powered suggestions and industry-specific templates.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <Sparkles className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interview Prep</h3>
              <p className="text-muted-foreground">
                Practice with personalized interview questions and get AI feedback to improve your responses.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="glass-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Award className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Our Impact</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">10K+</p>
                <p className="text-muted-foreground">Students Placed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">500+</p>
                <p className="text-muted-foreground">Partner Companies</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">95%</p>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">24/7</p>
                <p className="text-muted-foreground">AI Support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Built by Students, for Students</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our team understands the challenges of finding the right internship because we've been there. 
            InternAI is designed with your success in mind, combining cutting-edge AI technology with 
            real-world insights to help you achieve your career goals.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;