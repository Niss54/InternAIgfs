import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Bot, HelpCircle, MessageCircle, Send, Mail, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HelpSupport = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleAIHelp = () => {
    toast({
      title: "AI Assistant Activated",
      description: "Our AI bot is ready to help you instantly!",
    });
  };

  const faqData = [
    {
      question: "How do I create my first resume?",
      answer: "Navigate to the Resume Generator from your dashboard. Choose a template, fill in your details, and our AI will help optimize your content. You can preview and download your resume in multiple formats."
    },
    {
      question: "What's included in the Premium plan?",
      answer: "Premium includes unlimited resume downloads, access to all premium templates, AI-powered content suggestions, cover letter generation, and priority customer support."
    },
    {
      question: "How do I search for internships?",
      answer: "Use the Search Internships feature in your dashboard. Filter by location, industry, company size, and more. You can save internships and track your applications easily."
    },
    {
      question: "Can I track my application status?",
      answer: "Yes! The Applied Internships section lets you track all your applications, set interview reminders, and monitor your progress through different application stages."
    },
    {
      question: "How do I prepare for interviews?",
      answer: "Our Interviews section provides AI-powered mock interviews, common questions for your field, and tips to help you succeed. Premium users get personalized interview coaching."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and never share your personal information. Your resume data is stored securely and only accessible by you."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-muted-foreground text-lg">
            Get the help you need, when you need it
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-card hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI Quick Help</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant answers from our AI assistant
              </p>
              <Button 
                onClick={handleAIHelp}
                className="btn-neon w-full pulse-glow"
              >
                <Bot className="h-4 w-4 mr-2" />
                Chat with AI
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed help via email
              </p>
              <div className="text-sm space-y-1">
                <p className="text-primary font-medium">support@internai.com</p>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>24h response time</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For Premium users only
              </p>
              <div className="text-sm space-y-1">
                <p className="text-primary font-medium">+1 (555) 123-4567</p>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Mon-Fri 9AM-6PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* FAQ Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Contact Us
              </CardTitle>
              <CardDescription>
                Send us a message and we'll respond soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="input-glass"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What can we help you with?"
                    className="input-glass"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your question or issue in detail..."
                    className="input-glass min-h-[120px] resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="btn-neon w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;