import React from 'react';
import { Users, MessageSquare, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const NetworkingFeatureCard = () => {
  return (
    <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Users className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          Student Networking Hub
          <Badge className="ml-auto bg-gradient-to-r from-primary to-accent text-primary-foreground">
            NEW
          </Badge>
        </CardTitle>
        <CardDescription>
          Connect with fellow students, join study groups, and get mentorship from alumni
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-foreground text-sm">Discussion Boards</p>
              <p className="text-xs text-muted-foreground">Join topic-based conversations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-foreground text-sm">Q&A Sessions</p>
              <p className="text-xs text-muted-foreground">Get answers from peers & experts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
            <Users className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium text-foreground text-sm">Alumni Mentorship</p>
              <p className="text-xs text-muted-foreground">Video calls with industry experts</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">💬 7 Active Channels</Badge>
            <Badge variant="secondary" className="text-xs">👥 150+ Students</Badge>
          </div>
          <Button asChild className="btn-neon">
            <Link to="/dashboard/networking">
              Join Network
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkingFeatureCard;