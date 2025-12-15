import React, { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './ChatWindow';

interface FloatingChatWidgetProps {
  className?: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-20 right-6 w-80 h-96 z-50 transition-all duration-300 ease-out ${
            isMinimized ? 'h-12' : 'h-96'
          } ${className}`}
        >
          <div className="glass-card h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center pulse-glow">
                  <MessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 flex flex-col">
                <ChatWindow />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full btn-neon p-0 transition-all duration-300 ${
            isOpen ? 'scale-90 opacity-80' : 'scale-100 opacity-100'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>
    </>
  );
};