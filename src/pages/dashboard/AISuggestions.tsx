import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Plus, Sparkles, FileText, Image, FileUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AISuggestions = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI mentor. Upload your resume or ask me any questions about internships!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: "I understand your question. Let me help you with that! Based on your profile, I recommend focusing on these key areas...",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileUpload = () => {
    setShowUploadDialog(true);
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast({
          title: "Photo Uploaded",
          description: `${file.name} uploaded successfully!`,
        });
        setShowUploadDialog(false);
      }
    };
    input.click();
  };

  const handleDocumentUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast({
          title: "Document Uploaded",
          description: `${file.name} uploaded successfully!`,
        });
        setShowUploadDialog(false);
      }
    };
    input.click();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Suggestions for Internship
        </h1>
        <p className="text-muted-foreground">
          Upload your resume or chat with your personal AI mentor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Chat Area */}
        <Card className="p-6">
          <div className="space-y-4 mb-4 h-[500px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 mt-4 border-t pt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleFileUpload}
              title="Upload Resume"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Textarea
              placeholder="Type your question about your resume or internships..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[50px] max-h-[100px]"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <FileText className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Resume Review</h3>
            <p className="text-sm text-muted-foreground">
              Get AI-powered feedback on your resume
            </p>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Sparkles className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Skill Gap Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Identify skills you need for your dream role
            </p>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Sparkles className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Interview Prep</h3>
            <p className="text-sm text-muted-foreground">
              Practice common interview questions
            </p>
          </Card>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all text-center"
              onClick={handlePhotoUpload}
            >
              <Image className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Upload Photo</h3>
              <p className="text-xs text-muted-foreground">Profile picture or ID</p>
            </Card>
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all text-center"
              onClick={handleDocumentUpload}
            >
              <FileUp className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Upload Document</h3>
              <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AISuggestions;
