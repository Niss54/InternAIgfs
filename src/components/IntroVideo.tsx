import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
}

const IntroVideo = ({ onComplete }: IntroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser, user can manually click skip
        // No error needed, it's expected behavior
      });
    }
  }, []);

  const handleSkip = () => {
    localStorage.setItem('intro_video_watched', 'true');
    onComplete();
  };

  const handleVideoEnd = () => {
    localStorage.setItem('intro_video_watched', 'true');
    onComplete();
  };

  const handleError = () => {
    console.log('Video failed to load, skipping...');
    handleSkip();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        onError={handleError}
        playsInline
        muted
        autoPlay
      >
        <source src="/generated-intro.mp4" type="video/mp4" />
        <source src="/generated-intro.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Skip Button */}
      <Button
        onClick={handleSkip}
        variant="outline"
        size="lg"
        className="fixed top-6 right-6 z-10 bg-black/50 hover:bg-black/70 text-white border-white/20"
      >
        <X className="w-4 h-4 mr-2" />
        Skip Intro
      </Button>
    </div>
  );
};

export default IntroVideo;
