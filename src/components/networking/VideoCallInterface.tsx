import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Users, 
  Settings,
  Crown,
  Calendar,
  Clock
} from 'lucide-react';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VideoCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  channelType: 'mentor' | 'discussion' | 'qa' | 'private';
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  isOpen,
  onClose,
  channelName,
  channelType
}) => {
  const { isPremium } = usePremiumCheck();
  const { toast } = useToast();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [participants, setParticipants] = useState([
    { id: '1', name: 'Dr. Sarah Chen', role: 'Alumni Mentor', avatar: 'SC' },
    { id: '2', name: 'You', role: 'Student', avatar: 'U' }
  ]);
  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isCallActive) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!isPremium && channelType === 'mentor') {
      toast({
        title: "Premium Required",
        description: "Video calls with mentors require a premium subscription",
        variant: "destructive"
      });
      return;
    }

    try {
      // Initialize camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCallActive(true);
      toast({
        title: "Call Started",
        description: "Connected to video call",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access camera/microphone",
        variant: "destructive"
      });
    }
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCallActive(false);
    setCallDuration(0);
    onClose();
    toast({
      title: "Call Ended",
      description: "Video call has been ended",
    });
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {channelType === 'mentor' && <Crown className="w-5 h-5 text-yellow-500" />}
              <Video className="w-5 h-5 text-primary" />
              {channelName}
            </div>
            {isCallActive && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(callDuration)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
          {!isCallActive ? (
            // Pre-call interface
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready to join {channelName}?
                </h3>
                <p className="text-muted-foreground mb-6">
                  {channelType === 'mentor' 
                    ? 'Connect with experienced alumni mentors for personalized guidance'
                    : 'Join the video discussion with other students'
                  }
                </p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline" className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  {participants.length} participants waiting
                </Badge>
                {channelType === 'mentor' && (
                  <Badge className="bg-yellow-500/20 text-yellow-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium Feature
                  </Badge>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={toggleVideo}
                  className={cn(
                    "flex items-center gap-2",
                    !isVideoEnabled && "bg-red-500/20 text-red-600"
                  )}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  {isVideoEnabled ? 'Camera On' : 'Camera Off'}
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleAudio}
                  className={cn(
                    "flex items-center gap-2",
                    !isAudioEnabled && "bg-red-500/20 text-red-600"
                  )}
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  {isAudioEnabled ? 'Mic On' : 'Mic Off'}
                </Button>
              </div>

              <Button onClick={startCall} className="btn-neon px-8">
                <Video className="w-4 h-4 mr-2" />
                Join Call
              </Button>
            </div>
          ) : (
            // Active call interface
            <div className="h-full flex flex-col">
              {/* Video Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Local Video */}
                <div className="relative bg-card rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    You {!isVideoEnabled && '(Camera Off)'}
                  </div>
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">U</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remote Video */}
                <div className="relative bg-card rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">SC</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    Dr. Sarah Chen
                  </div>
                  <Badge className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Mentor
                  </Badge>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4 p-4 bg-card/50 rounded-lg">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleVideo}
                  className={cn(
                    "rounded-full w-12 h-12 p-0",
                    !isVideoEnabled && "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleAudio}
                  className={cn(
                    "rounded-full w-12 h-12 p-0",
                    !isAudioEnabled && "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};